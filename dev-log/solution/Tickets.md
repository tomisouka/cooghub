# Coogs Hub — Tickets

> Open issues, known bugs, and planned features.
> Status: `OPEN` | `IN PROGRESS` | `DONE`
> Last updated: Session 20 — March 2026

---

## 🐛 Bugs

### [OPEN] #007 — PDF search highlight visually misaligned
**Filed:** 2026-03-11
**Area:** `src/components/PDFViewer.jsx` → `buildTextLayer()`

Search highlights land at the correct DOM position but appear visually offset on screen — the amber box floats over the wrong word or between words.

**Root cause:** Each text span has a `scaleX()` CSS transform applied to stretch it to match the PDF's original glyph width. A `<mark>` inside a `scaleX`-transformed span inherits that transform, so its *visual* bounding box shifts relative to where the canvas actually drew the text underneath.

**Does not affect:** search accuracy, page navigation, text selection, or any functional behavior. Cosmetic only.

**Next to try:**
- On each `<mark>`, compute the inverse of the parent span's scaleX and apply a compensating `translateX`
- Alternatively: render highlights as absolutely-positioned overlay divs using the item's raw transform matrix coordinates

---

### [OPEN] #001 — Search scroll-to-match not working correctly
**Filed:** 2026-03-09
**Area:** `MarkdownViewer.jsx`, `CoursePage.jsx`, `search.js`

Clicking a search result navigates to the correct course + tab + file, but does not scroll to the matched text.

**Next to try:**
- `requestAnimationFrame` after observer to ensure layout is done before reading rects
- `IntersectionObserver` on the first `<mark>` instead of manual offset math

---

### [OPEN] #014 — Collapsible sidebar not verified on device
**Filed:** 2026-03-12
**Area:** `src/pages/CoursePage.jsx`

Desktop FileList sidebar (220px fixed) had no collapse toggle — felt clunky when browsing reference files that need full width.

**Done this session:** Added `sidebarOpen` state (default true). Added `⟨` / `⟩` toggle button in header (hidden on mobile + flashcards tab). Conditioned FileList render on `sidebarOpen || isMobile`. Also fixed `switchTab` to call `setShowList(true)` on mobile so switching tabs always returns to the file list instead of leaving you stuck in content view.

**Still needs:** Device/browser testing to confirm feel is right.

---

### [OPEN] #010 — Sticky nav bars + srcdoc iframe scroll
**Filed:** 2026-03-11
**Area:** `src/components/ReferenceViewer.jsx`

Scripted reference files (automata-sipser-reference, jflap-demo, etc.) render via srcdoc iframe. Section-strip anchor nav (`href="#dfa"`) and scroll-based active highlighting weren't working because `body { min-height: 100vh }` fought the iframe's fixed height, making the page unscrollable inside the iframe.

**Done this session:** Injected style override stripping `min-height: 100vh` from html/body inside srcdoc. Added `height: 100%` to iframe element. Removed `allow-same-origin` from sandbox (was a security hole — combined with `allow-scripts` it lets the iframe fully escape sandboxing).

**Still needs:** Verify section-strip nav actually scrolls correctly on device. The sticky header/strip cosmetic overlap (#010 original) still present but lower priority.

---

## 🚀 Features

### [OPEN] #005 — Talk2Me search navigation
**Filed:** 2026-03-09
**Area:** `Talk2MePage.jsx`, `search.js`

`resolveResult` returns `{ page: "talk2me", sectionId, file }` but `Talk2MePage` doesn't accept these props to jump to the matched section on arrival.

---

### [OPEN] #006 — Empty courses need content
**Filed:** 2026-03-09

Courses with no notes/code yet: `comporg`, `python`, `algebra`, `precalc`, `calc1`, `calc2`, `stats`.

---

## ✅ Done

### [DONE] #013 — Knowledge system deprecated and removed
**Filed:** 2026-03-11 / **Closed:** 2026-03-12

Entire knowledge system nuked. Deleted `src/data/knowledge/` (6 files, ~10k lines). Removed `DOMAIN_NAV`, `knowledgeCache`, `loadKnowledge()`, `searchKnowledgeIndex()`, knowledge branch in `resolveResult()` from `search.js`. Removed `knowledgeEntry` state and knowledge card render block from `CoursePage.jsx`. Removed import and search call from `HomePage.jsx`.

### [DONE] #004 — knowledge/index.js cleanup
**Filed:** 2026-03-09 / **Closed:** 2026-03-12 (superseded by #013 full removal)

### [DONE] #D009 — Font/readability overhaul
Inter font, weight 500 minimum everywhere. Eliminated Courier New. Bumped dim text to #7a8090 / #8a90a0.

### [DONE] #D008 — Lang+ panel on COSC dept page
Language reference panel as a card in the COSC course grid. Single-pane on mobile.

### [DONE] #D007 — git_reference.html
Standalone HTML reference. Fraunces + DM Mono, sticky nav, card grid, inline search.

### [DONE] #D006 — git.js (languages/git.js)
115-entry Git reference wired into search and Lang+.

### [DONE] #D005 — Department/course hierarchy
Full rebuild: DEPARTMENTS → courses → typed buckets. DeptPage, CoursePage, subjects.js.

### [DONE] #D004 — Search navigation to course + tab + file
Result click carries `{ tab, file, pdfPage, query }` through App state into CoursePage.

### [DONE] #D003 — Search result term highlighting
`HighlightText` component wraps matches in amber in result cards.

### [DONE] #D002 — Unified search with PDF results
Notes + code + Talk2Me + PDFs in one query. PDF index lazy-loaded.

### [DONE] #D001 — PDF full-text indexing
`scripts/index-pdfs.js` indexes 14 PDFs into `public/pdf-index.json`.

### [DONE] #003 — In-app PDF viewer with page control
`PDFViewer.jsx` — pdfjs-dist canvas renderer, page control, pinch-to-zoom, initialPage prop.

### [DONE] #002 — PDF page jump unreliable
Resolved by switching to PDFViewer.jsx canvas renderer.

### [CLOSED] #012 — Knowledge search results show raw entry IDs as labels
Moot — system removed by #013.

### [CLOSED] #011 — Full-text reference search misses content in tables
Fixed with block-aware `extractText()` walker in `search.js` `buildRefTextIndex`.

### [CLOSED] #009 — Build ReferenceViewer.jsx to replace iframes for reference pages
Built. Fetches HTML, strips Google Fonts, scopes styles, renders natively. Scripted files fall through to srcdoc iframe.

### [CLOSED] #008 — IframeWithLoader spinner never resolves in Capacitor APK
Root cause: Google Fonts `<link>` blocking `onLoad` in offline WebView. Resolved by ReferenceViewer stripping the Fonts link.