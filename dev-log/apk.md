# Coogs Hub — APK Build Log
> Tracks every APK build, what changed, and known issues per version.
> Last updated: Session 17 — March 2026

---

## Build Process (repeat every update)

```bash
# 1. Make your changes in the project
# 2. From project root:
pnpm build
npx cap copy android
cd android && ./gradlew assembleDebug

# 3. Output:
# android/app/build/outputs/apk/debug/app-debug.apk

# 4. Send via LocalSend → install on Samsung
# Open thunar to grab the file:
thunar /home/kaneki/rabbit/root/projects/onit/coogs-hub/android/app/build/outputs/apk/debug/
```

---

## APK v2 — Session 19 (March 2026)
**Status:** ✅ Ready to build

### What changed since v1
- Full mobile responsive pass (Sessions 17–18): bottom nav, single-pane CoursePage/Talk2Me/DeptPage, safe area fix, touch targets
- PDF viewer pinch-to-zoom (Session 18)
- Bash reference added to Lang+ (Session 18)
- **PDF horizontal scroll fixed (Session 19)** — `minWidth: 0` on CoursePage body + PDFViewer outer div

### Known remaining issues
- None blocking — horizontal + vertical scroll both confirmed working

---

## APK v1 — Session 17 (March 2026)
**Status:** ✅ Installed and running on Samsung

### What's included
- All notes, markdown content
- Code files (26 cpp files)
- Talk2Me content
- Flashcards
- Search
- HTML reference visuals
- PDF viewer UI (viewer works, PDF files not bundled)

### What's NOT included
- `public/pdfs/` — 467MB, kept local. Transfer via USB/LocalSend separately when needed
- `server/upload.js` — dev only, never bundled

### Known Issues / Mobile TODOs
- [ ] 3-pane layout (FileList 220px + Viewer) is too cramped on phone — needs collapsible panel so content is actually readable
- [ ] Sidebar (72px) should become bottom nav bar on mobile
- [ ] Tab bar in CoursePage may overflow/wrap on small screen
- [ ] Touch targets on some buttons too small for fingers
- [ ] References iframes — need to verify HTML reference files are bundled in assets

### Security
- Self-signed debug APK — personal use only
- No internet required, fully offline
- Android app sandbox active
- Samsung Knox hardware encryption applies
- No third party infrastructure involved

---

## Mobile Responsive — Plan
Chosen approach: **`useIsMobile()` hook now** → proper Tailwind migration in Phase 8.

Priority fixes for next APK build:
1. Collapsible FileList panel in CoursePage — biggest UX win, content gets full screen
2. Bottom nav bar on mobile instead of left sidebar
3. CoursePage tab bar scrollable on mobile
4. Touch target sizing pass

---

## Notes
- Debug APK is fine for personal use. Release APK (signed with personal keystore) is the eventual goal for Phase 9 security hardening.
- To generate a release keystore when ready: `keytool -genkey -v -keystore coogs-hub.keystore -alias coogs -keyalg RSA -keysize 2048 -validity 10000`
- Keep keystore backed up — losing it means you can't update the APK