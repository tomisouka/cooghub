# Coogs Hub — Roadmap
> Living document. Update this as things get done.
> Last updated: Session 17 — March 2026

---

## Legend
- ✅ Done
- 🔄 In progress / partially done
- ⬜ Not started
- ⏸ Blocked / waiting

---

## Phase 1 — Content Transfer
✅ Complete (with minor deferred items)

| Task | Status |
|------|--------|
| Scaffold all pages | ✅ |
| Wire markdown files (all subjects) | ✅ |
| Wire cpp files (26 files) | ✅ |
| Wire HTML references (public/) | ✅ |
| Wire txt files (talk2me, 51 files) | ✅ |
| Wire anki CSV (programmingFundamentals) | ✅ |
| Wire assignment HTML files | ✅ |
| Wire practice HTML files | ✅ |
| Wire assignment md files into Automata subject | ✅ |
| Wire algos practice + imp notes | ✅ |
| Wire linear practice files | ✅ |
| Convert .odt entries → txt | ⬜ |
| Wire comporg anki deck | ⬜ |

---

## Phase 2 — Component Split
✅ Complete

| Task | Status |
|------|--------|
| Create src/components/ | ✅ Sidebar, MarkdownViewer, CodeViewer, HtmlViewer |
| Create src/pages/ | ✅ One file per page |
| Create src/data/ | ✅ subjects, references, code, flashcards, talk2me, nav |
| App.jsx → routing only (~48 lines) | ✅ |
| src/globs.js — central glob registry | ✅ |
| src/search.js — full-text search | ✅ |

---

## Phase 3 — Knowledge Base Extraction
✅ Complete

| Task | Status | Entries |
|------|--------|---------|
| math_notation.js | ✅ | 306 |
| data_structures.js | ✅ | 91 |
| algorithms.js | ✅ | 123 |
| discrete_math.js | ✅ | 84 |
| linear_algebra.js | ✅ | 94 |
| automata.js | ✅ | 302 |
| sets_automata.js | ✅ | 29 |
| linux.js | ✅ | 413 |
| math_science.js | ✅ | 280 |
| comp_org.js | ✅ | 290 |
| languages/*.js (10 files) | ✅ | 1,968 |
| git.js | ✅ | 115 |
| knowledge/index.js master re-export | ✅ | — |
| Decide: languages/ stays in knowledge/ or moves? | ⬜ | TBD |

**Total: ~4,095 entries**

---

## Phase 4 — App Rebuild & UI Overhaul
✅ Complete

| Task | Status |
|------|--------|
| Department/course hierarchy (subjects.js rebuild) | ✅ |
| DeptPage.jsx — COSC grid + MATH shared refs | ✅ |
| CoursePage.jsx — tabs per course | ✅ |
| Sidebar trimmed to 3 items | ✅ |
| Font overhaul — Inter weight 500+, no Courier New | ✅ |
| Lang+ panel on COSC dept page | ✅ |
| git_reference.html | ✅ |
| Fix height: 100vh layout escape bug | ✅ |

---

## Phase 5 — PDF Viewer ← NEXT
Wire subject textbooks and lecture PDFs into the app.

| Task | Status | Notes |
|------|--------|-------|
| ~~react-pdf~~ — used pdfjs CDN instead | ✅ | `pnpm add react-pdf` |
| Create src/data/pdfs.js | ⬜ | PDFS constant, one entry per file |
| PDFViewer.jsx — canvas + text layer + search | ✅ | Replace coming-soon UI |
| Wire comp org PDFs | ⬜ | ARMedition2425 (split), comporg_merged |
| Wire cpp PDFs | ⬜ | mergedcpp.pdf (split 12 parts) |
| Wire DS PDFs | ⬜ | mergeddsa.pdf, zybookdsa.pdf |
| Wire discrete PDFs | ⬜ | allHW.pdf, DISCRETE.pdf, book.pdf |
| Wire stats PDFs | ⬜ | All_Lectures.pdf (split 3 parts) |
| Wire automata PDFs | ⬜ | automataVarem.pdf, automata_current.pdf |
| Wire algos PDFs | ⬜ | gopalbook + exam PDFs |
| Wire linear PDFs | ⬜ | textbook + HW PDFs |
| Wire OS textbook PDF | ✅ | OperatingSystems_TextbookRincon.pdf → opsystems course |
| Convert .xopp → PDF | ⏸ | Xournal++: File → Export as PDF |

---

## Phase 6 — Search Improvements

| Task | Status |
|------|--------|
| sessionStorage reader in Notes page (jump-to-file) | ⬜ |
| sessionStorage reader in Talk2Me page | ⬜ |
| sessionStorage reader in Code Vault page | ⬜ |
| Search knowledge base entries | ⬜ |
| Search PDF content (stretch) | ⬜ |
| Fix scroll-to-match (#001) | ⬜ |
| Fix PDF page jump (#002) | ⬜ |

---

## Phase 7 — Database
Replace hardcoded JS constants with a real database.

| Task | Status |
|------|--------|
| Choose DB (SQLite local vs Supabase hosted) | ⬜ |
| Schema design | ⬜ |
| Migrate all data constants | ⬜ |
| Add/edit content via UI | ⬜ |
| Track flashcard progress in DB | ⬜ |

---

## Phase 8 — Frontend Polish

| Task | Status |
|------|--------|
| Design system / CSS vars | ⬜ |
| Responsive layout | ⬜ |
| Loading skeletons | ⬜ |
| Home page stats dynamic | ⬜ |
| Flashcard shuffle mode | ⬜ |
| Flashcard study history | ⬜ |
| Dark/light theme toggle | ⬜ |

---

## Open TODOs (from sessions 14–15)

| Task | Priority | Notes |
|------|----------|-------|
| Increase font size in all algo/gopal HTML visuals | HIGH | User has astigmatism — bump body font to 1rem+, code blocks to .85rem+, card text to .95rem+ |
| Add sort-by / filter to References tab in CoursePage | MED | Algos course now has 30+ reference entries — users need a way to filter by group or search |
| Build `sort_tim.html` (Timsort) | MED | Added to subjects.js Sorting group but file not yet built — stub exists from make_algo_stubs.sh |
| Consolidate DS font update | LOW | ds_array, ds_singly, ds_doubly, ds_circular still on DM Mono instead of Atkinson Hyperlegible |

---

## Backlog / Ideas
- Flashcard quiz mode powered by knowledge base entries
- Spaced repetition (SM-2 algorithm)
- Knowledge base search / lookup page
- Auto-generate flashcards from knowledge entries
- Export flashcards → CSV for Anki import
- Print view for notes
- Keyboard shortcuts (j/k nav, space to flip)
- talk2me/linux/distros/ — not yet copied (has html + txt + pdf)
- talk2me/junk/SQL.txt — not yet wired

---

## Phase 9 — Android (Capacitor APK) ← ACTIVE
Goal: Polished native Android app, sideloaded, personal use only. Security-first.

### Decision
Chose **Capacitor** over PWA/Termux for:
- True native sandbox (other apps cannot read app data)
- Self-signed APK — no third party involved, no Play Store
- Biometric lock support (fingerprint/face unlock)
- Polished fullscreen app experience

### Security Checklist (must complete before first APK build)
| Task | Status | Notes |
|------|--------|-------|
| Audit `server/upload.js` — confirm it is NOT bundled into the app | ⬜ | Must be standalone only, never imported by React |
| Confirm pdfjs loads from local bundle, not CDN | ⬜ | CDN call = network dependency + fingerprint risk |
| Remove or gate any dev-only console.log with personal data | ⬜ | |
| Confirm no hardcoded paths leak machine username | ⬜ | |

### Build Steps
| Task | Status | Notes |
|------|--------|-------|
| Install Capacitor CLI + Android platform | ⬜ | `pnpm add @capacitor/core @capacitor/cli @capacitor/android` |
| Run `pnpm build` — confirm clean dist/ | ⬜ | |
| `npx cap init` + `npx cap add android` | ⬜ | |
| `npx cap copy android` — sync dist/ into Capacitor | ⬜ | |
| Install Android Studio (for SDK + build tools) | ⬜ | Or use sdkmanager CLI only |
| Generate release keystore (self-signed) | ⬜ | `keytool -genkey ...` — store this securely, never commit |
| Build signed APK | ⬜ | `./gradlew assembleRelease` in android/ |
| Sideload onto Samsung device | ⬜ | Enable "Install unknown apps" for Files app, then disable after |
| Test all tabs + PDF viewer on device | ⬜ | |
| Add biometric lock via Capacitor plugin | ⬜ | `@capacitor-community/biometric-auth` |
| Bundle pdfjs locally (remove CDN dependency) | ⬜ | Copy pdfjs-dist into public/, update PDFViewer.jsx import |
| Responsive layout pass for mobile screen sizes | ⬜ | Phase 8 overlap — sidebar, tab bar, 3-pane layout all need mobile variants |

### Notes
- Keystore file must be backed up somewhere safe — losing it means you can't update the APK
- `server/upload.js` is a Node script, not imported by the React app — confirm this before building
- Samsung Knox provides hardware-level encryption on top of the app sandbox — good baseline
- Once sideloaded, re-installs are just: `pnpm build → npx cap copy android → gradlew assembleRelease → adb install` (or drag APK)