#!/usr/bin/env bash
# sync_public.sh — renames public/content/code/ dirs to match subjects.json
# and cleans up the orphaned llms/ folder under references/
# Run from project root.
set -euo pipefail

echo ""
echo "══════════════════════════════════════════"
echo "  Sync public/ to match subjects.json"
echo "══════════════════════════════════════════"

mv_if() {
  [ -d "$1" ] && [ ! -d "$2" ] && mv "$1" "$2" && echo "  ✓ $1 → $2" || echo "  SKIP $1"
}

echo ""
echo "── renaming code dirs ──"
mv_if public/content/code/ds            public/content/code/simplyDS
mv_if public/content/code/adt           public/content/code/simplyADT
mv_if public/content/code/algos_examples public/content/code/simplyAlgos

echo ""
echo "── cleaning references/llms/ ──"
rm -rf public/references/llms/.vscode && echo "  ✓ removed llms/.vscode" || true
for f in agents.md introtollms.md transformers.md transformer.svg; do
  [ -f "public/references/llms/$f" ] && \
    mv "public/references/llms/$f" "public/references/ai/$f" && \
    echo "  ✓ llms/$f → ai/$f" || true
done
rmdir public/references/llms 2>/dev/null && echo "  ✓ removed empty llms/" || true

echo ""
echo "══════════════════════════════════════════"
echo "  Done."
echo "══════════════════════════════════════════"
