# Coogs Hub — Tickets

> Open issues, known bugs, and planned features.
> Status: `OPEN` | `IN PROGRESS` | `DONE`

---

## 🐛 Bugs

### [OPEN] #001 — Search scroll-to-match not working correctly
**Filed:** 2026-03-09
**Area:** `MarkdownViewer.jsx`, `CoursePage.jsx`, `search.js`

Clicking a search result navigates to the correct course + tab + file, but does **not** scroll to the matched text. The MutationObserver + debounce approach fires but scroll lands at the top or wrong position.

**Should happen:** Click result → open file → amber highlights on all matches → smooth scroll to first match.

**Suspected cause:** ReactMarkdown renders asynchronously. Debounce timer may fire before full DOM is ready. `scrollBy` offset from `getBoundingClientRect()` may be wrong if layout isn't complete.

**Attempted:**
- MutationObserver disconnect on first success (too early)
- Debounced observer 80ms after last mutation (better, still unreliable)
- `scrollBy` with explicit scroller ref (partial)

**Next to try:**
- `requestAnimationFrame` after observer to ensure layout is done before reading rects
- `IntersectionObserver` on the first `<mark>` instead of manual offset math

---

### [DONE] #002 — PDF page jump unreliable
**Filed:** 2026-03-09
**Area:** `CoursePage.jsx`

`#page=N` fragment on iframe URL forces remount via `key` prop, but Chrome's PDF viewer doesn't always honor the fragment on large PDFs.

**Next to try:** Replace native iframe with `pdfjs-dist` canvas renderer (see #003) for full programmatic page control.

---

## 🚀 Features

### [DONE] #003 — In-app PDF viewer with page control
**Filed:** 2026-03-09
**Area:** new `PDFViewer.jsx`

Replace `<iframe>` with a `pdfjs-dist` canvas-based viewer. Goals:
- Page number display + prev/next + jump-to input
- `initialPage` prop so search results open to the right page
- Future: highlight matched text on the rendered page

---

### [OPEN] #004 — knowledge/index.js cleanup
**Filed:** 2026-03-09
**Area:** `src/data/knowledge/index.js`

Still re-exports the 10 language files even though they moved to `src/data/languages/`. Should only export what's in `knowledge/`.

---

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

### [DONE] #D001 — PDF full-text indexing
`scripts/index-pdfs.js` indexes 14 PDFs into `public/pdf-index.json` (~15MB). Skips re-index if PDFs unchanged. Runs on `pnpm dev` / `pnpm build`.

### [DONE] #D002 — Unified search with PDF results
Notes + code + Talk2Me + PDFs in one query. PDF index lazy-loaded. Results grouped by type with snippets and page badges.

### [DONE] #D003 — Search result term highlighting
`HighlightText` component wraps matches in amber in result card labels and snippets.

### [DONE] #D004 — Search navigation to course + tab + file
Result click carries `{ tab, file, pdfPage, query }` through App state into CoursePage.

### [DONE] #D005 — Department/course hierarchy
Full rebuild: DEPARTMENTS → courses → typed buckets. `DeptPage`, `CoursePage`, updated `subjects.js`.

### [DONE] #D006 — git.js knowledge file
115-entry Git reference. Sections: Setup, Clone, Staging, Branches, Merge/Rebase, Remote, Log, Undo, Stash, Tags, Worktree, Inspection, .gitignore, Concepts, GitHub, Flags.

### [DONE] #D007 — git_reference.html
Standalone HTML reference file built from git.js data. Matches cpp_reference.html style — Fraunces + DM Mono, sticky nav, card grid, inline search. Lives at `public/references/languages/git_reference.html`.

### [DONE] #D008 — Lang+ panel on COSC dept page
Language reference panel accessible as a card in the COSC course grid. Opens sidebar + iframe layout with all 13 LANG_REFS entries. Fixed height: 100vh → 100% bug that caused panel to overlap sidebar.

### [DONE] #D009 — Font/readability overhaul
Inter font, weight 500 minimum everywhere. Eliminated Courier New. Bumped dim text from #4a5060 to #7a8090 and #8a90a0 for readability.