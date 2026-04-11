cd rabbit/root/projects/onit/coogs-hub/
rm -f coogs-hub-clean.zip 
zip -r coogs-hub-clean.zip \
  src/ \
  src-tauri/ \
  public/ \
  server/ \
  package.json \
  pnpm-lock.yaml \
  vite.config.js \
  CLAUDE.md \
  debate/ \
  -x "src-tauri/target/*" \
  -x "node_modules/*" \
  -x "android/build/*" \
  -x "android/.gradle/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "*.pdf" \
  -x "*.apk" \
  -x "*.jar"