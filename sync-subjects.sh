#!/usr/bin/env bash
set -e

JSON="src/data/subjects.json"
JS="src/data/subjects.js"

if [ ! -f "$JSON" ]; then
  echo "✗ $JSON not found — run from project root"
  exit 1
fi

cp "$JS" "$JS.bak"
echo "  backed up → $JS.bak"

python3 - "$JSON" "$JS" << 'EOF'
import json, sys

with open(sys.argv[1]) as f:
    d = json.load(f)

lines = [
    "// src/data/subjects.js",
    "// AUTO-GENERATED from subjects.json — do not edit by hand",
    "// Regenerate with: bash sync-subjects.sh",
    "",
]

for key, val in d.items():
    serialized = json.dumps(val, indent=2, ensure_ascii=False)
    # indent every line of the value by 2 spaces so it reads cleanly
    indented = "\n".join("  " + l if l else l for l in serialized.splitlines())
    lines.append(f"export const {key} =\n{indented};")
    lines.append("")

with open(sys.argv[2], "w") as f:
    f.write("\n".join(lines))

print(f"  ✅  {sys.argv[2]} synced from {sys.argv[1]}")
EOF
