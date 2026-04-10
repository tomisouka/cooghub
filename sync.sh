#!/usr/bin/env bash
# sync.sh — resolve .js/.json sync conflicts and keep all data files in sync
# Run from the project root: bash sync.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/src/data"
PUB="$ROOT/public"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  coogs-hub sync"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Delete Syncthing conflict files ───────────────────────────────────────
echo "[ 1/4 ] Scanning for Syncthing conflict files..."
CONFLICTS=$(find "$ROOT" -name "*.sync-conflict*" 2>/dev/null)
if [ -z "$CONFLICTS" ]; then
  ok "No conflict files found"
else
  while IFS= read -r f; do
    warn "Removing conflict file: $(basename "$f")"
    rm "$f"
  done <<< "$CONFLICTS"
  ok "All conflict files removed"
fi
echo ""

# ── 2. Regenerate subjects.js from src/data/subjects.json ────────────────────
echo "[ 2/4 ] Regenerating subjects.js from subjects.json..."
python3 - << 'PYEOF'
import json, sys

src = "src/data/subjects.json"
out = "src/data/subjects.js"

try:
    with open(src) as f:
        d = json.load(f)
except Exception as e:
    print(f"ERROR reading {src}: {e}")
    sys.exit(1)

lines = [
    "// src/data/subjects.js",
    "// AUTO-GENERATED from subjects.json — do not edit by hand",
    "// Regenerate with: bash sync.sh",
    "",
]
for key in ["DEPARTMENTS", "LANG_REFS", "MATH_SHARED_REFS", "ALL_COURSES"]:
    if key not in d:
        print(f"ERROR: key '{key}' missing from subjects.json")
        sys.exit(1)
    lines.append(f"export const {key} =")
    lines.append("  " + json.dumps(d[key], indent=2).replace("\n", "\n  ") + ";")
    lines.append("")

with open(out, "w") as f:
    f.write("\n".join(lines))

print(f"OK: {out} regenerated")
PYEOF
echo ""

# ── 3. Sync src/data/subjects.json → public/subjects.json ────────────────────
echo "[ 3/4 ] Syncing runtime JSON files (src/data → public)..."

sync_json() {
  local name="$1"
  local src_file="$SRC/$name.json"
  local pub_file="$PUB/$name.json"

  if [ ! -f "$src_file" ]; then
    warn "$name.json not found in src/data — skipping"
    return
  fi
  if [ ! -f "$pub_file" ]; then
    warn "$name.json not found in public — skipping"
    return
  fi

  # Compare content (ignore whitespace differences)
  src_sum=$(python3 -c "import json; print(json.dumps(json.load(open('$src_file')), sort_keys=True))" 2>/dev/null | md5sum)
  pub_sum=$(python3 -c "import json; print(json.dumps(json.load(open('$pub_file')), sort_keys=True))" 2>/dev/null | md5sum)

  if [ "$src_sum" = "$pub_sum" ]; then
    ok "$name.json — in sync"
  else
    # src/data is source of truth — copy to public
    cp "$src_file" "$pub_file"
    ok "$name.json — updated public/ from src/data/"
  fi
}

for name in subjects tabs nav uiConfig flashcards; do
  sync_json "$name"
done
echo ""

# ── 4. Check .js fallback files are not ahead of their .json counterparts ─────
echo "[ 4/4 ] Checking .js static fallbacks vs .json source files..."

check_js_json() {
  local name="$1"
  local js="$SRC/$name.js"
  local json="$SRC/$name.json"
  local js_mtime json_mtime

  if [ ! -f "$js" ] || [ ! -f "$json" ]; then
    return
  fi

  js_mtime=$(stat -c %Y "$js")
  json_mtime=$(stat -c %Y "$json")

  if [ "$js_mtime" -gt "$json_mtime" ]; then
    warn "$name.js is NEWER than $name.json — did you edit the .js directly? Run 'bash sync.sh' after updating the .json"
  else
    ok "$name.js fallback is consistent with $name.json"
  fi
}

for name in tabs nav uiConfig flashcards signal_noise; do
  check_js_json "$name"
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}  sync complete${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
