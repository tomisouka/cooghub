#!/usr/bin/env python3
# sync.py — resolve .js/.json sync conflicts and keep all data files in sync
# Run from the project root: python3 sync.py

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC  = ROOT / "src" / "data"
PUB  = ROOT / "public"

GREEN  = "\033[0;32m"
YELLOW = "\033[1;33m"
RED    = "\033[0;31m"
NC     = "\033[0m"

def ok(msg):   print(f"{GREEN}✅ {msg}{NC}")
def warn(msg): print(f"{YELLOW}⚠️  {msg}{NC}")
def err(msg):  print(f"{RED}❌ {msg}{NC}"); sys.exit(1)

def load_json(path):
    with open(path) as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def json_fingerprint(path):
    """Order-independent content hash — ignores formatting differences."""
    return json.dumps(load_json(path), sort_keys=True)


print()
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("  coogs-hub sync")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print()


# ── 1. Delete Syncthing conflict files ───────────────────────────────────────
print("[ 1/4 ] Scanning for Syncthing conflict files...")
conflicts = list(ROOT.rglob("*.sync-conflict*"))
if not conflicts:
    ok("No conflict files found")
else:
    for f in conflicts:
        warn(f"Removing: {f.relative_to(ROOT)}")
        f.unlink()
    ok(f"{len(conflicts)} conflict file(s) removed")
print()


# ── 2. Regenerate subjects.js from src/data/subjects.json ────────────────────
print("[ 2/4 ] Regenerating subjects.js from subjects.json...")
subjects_json = SRC / "subjects.json"
subjects_js   = SRC / "subjects.js"

d = load_json(subjects_json)
lines = [
    "// src/data/subjects.js",
    "// AUTO-GENERATED from subjects.json — do not edit by hand",
    "// Regenerate with: python3 sync.py",
    "",
]
for key in ["DEPARTMENTS", "LANG_REFS", "MATH_SHARED_REFS", "ALL_COURSES"]:
    if key not in d:
        err(f"Key '{key}' missing from subjects.json")
    lines.append(f"export const {key} =")
    lines.append("  " + json.dumps(d[key], indent=2).replace("\n", "\n  ") + ";")
    lines.append("")

subjects_js.write_text("\n".join(lines))
ok("subjects.js regenerated")
print()


# ── 3. Sync src/data/*.json → public/*.json ───────────────────────────────────
print("[ 3/4 ] Syncing runtime JSON files (src/data → public)...")
RUNTIME_FILES = ["subjects", "tabs", "nav", "uiConfig", "flashcards"]

for name in RUNTIME_FILES:
    src_file = SRC / f"{name}.json"
    pub_file = PUB / f"{name}.json"

    if not src_file.exists():
        warn(f"{name}.json missing from src/data — skipping")
        continue
    if not pub_file.exists():
        warn(f"{name}.json missing from public — skipping")
        continue

    if json_fingerprint(src_file) == json_fingerprint(pub_file):
        ok(f"{name}.json — in sync")
    else:
        pub_file.write_text(src_file.read_text())
        ok(f"{name}.json — updated public/ from src/data/")
print()


# ── 4. Warn if any .js fallback is newer than its .json ──────────────────────
print("[ 4/4 ] Checking .js static fallbacks vs .json source files...")
FALLBACK_FILES = ["tabs", "nav", "uiConfig", "flashcards", "signal_noise"]

for name in FALLBACK_FILES:
    js   = SRC / f"{name}.js"
    json_ = SRC / f"{name}.json"

    if not js.exists() or not json_.exists():
        continue

    if js.stat().st_mtime > json_.stat().st_mtime:
        warn(f"{name}.js is newer than {name}.json — did you edit the .js directly?")
    else:
        ok(f"{name}.js fallback is consistent with {name}.json")
print()


print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print(f"{GREEN}  sync complete{NC}")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print()
