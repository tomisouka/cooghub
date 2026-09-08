#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT="coogs-hub-${TIMESTAMP}.zip"

zip -qr "$OUT" . \
  -x@.gitignore \
  -x "node_modules/*" \
  -x "dist/*" \
  -x "dist-ssr/*" \
  -x "build/*" \
  -x "out/*" \
  -x ".vite/*" \
  -x "*/target/*" \
  -x "src-tauri/target/*" \
  -x "src-tauri/gen/android/*" \
  -x "src-tauri/gen/apple/*" \
  -x "android/*" \
  -x "ios/*" \
  -x "*.apk" \
  -x "*.aab" \
  -x "*.ipa" \
  -x "*.pdf" \
  -x ".git/*" \
  -x "*.log"

echo "Wrote $OUT"