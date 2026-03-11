# Coogs Hub — Tickets

> Open issues, known bugs, and planned features.
> Status: `OPEN` | `IN PROGRESS` | `DONE`

---

## 🐛 Bugs

### [OPEN] #007 — PDF search highlight visually misaligned
**Filed:** 2026-03-11
**Area:** `src/components/PDFViewer.jsx` → `buildTextLayer()`

Search highlights land at the correct DOM position but appear visually offset on screen — the amber box floats over the wrong word or between words.

**Root cause:** Each text span has a `scaleX()` CSS transform applied to stretch it to match the PDF's original glyph width. A `<mark>` inside a `scaleX`-transformed span inherits that transform, so its *visual* bounding box shifts relative to where the canvas actually drew the text underneath. The text content is correct — no false matches — it's purely a rendering artifact.

**Example:** "parallelism and pipelining" — search for "pipe" finds the right span but the highlight box appears shifted over "parallelism" due to transform drift.

**Does not affect:** search accuracy, page navigation, text selection, or any functional behavior. Cosmetic only.

**Next to try:**
- On each `<mark>`, compute the inverse of the parent span's scaleX and apply a compensating `translateX` so the visual box realigns with the canvas text
- Alternatively: render highlights as absolutely-positioned overlay divs using the item's raw transform matrix coordinates, bypassing the span entirely

---

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
Inter font, weight 500 minimum everywhere. Eliminated Courier New. Bumped dim text from #4a5060 to #7a8090 and #8a90a0 for readability.# Coogs Hub — Tickets

> Open issues, known bugs, and planned features.
> Status: `OPEN` | `IN PROGRESS` | `DONE`

---

## 🐛 Bugs

### [OPEN] #007 — PDF search highlight visually misaligned
**Filed:** 2026-03-11
**Area:** `src/components/PDFViewer.jsx` → `buildTextLayer()`

Search highlights land at the correct DOM position but appear visually offset on screen — the amber box floats over the wrong word or between words.

**Root cause:** Each text span has a `scaleX()` CSS transform applied to stretch it to match the PDF's original glyph width. A `<mark>` inside a `scaleX`-transformed span inherits that transform, so its *visual* bounding box shifts relative to where the canvas actually drew the text underneath. The text content is correct — no false matches — it's purely a rendering artifact.

**Example:** "parallelism and pipelining" — search for "pipe" finds the right span but the highlight box appears shifted over "parallelism" due to transform drift.

**Does not affect:** search accuracy, page navigation, text selection, or any functional behavior. Cosmetic only.

**Next to try:**
- On each `<mark>`, compute the inverse of the parent span's scaleX and apply a compensating `translateX` so the visual box realigns with the canvas text
- Alternatively: render highlights as absolutely-positioned overlay divs using the item's raw transform matrix coordinates, bypassing the span entirely

---

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

---

### [CLOSED] #008 — IframeWithLoader spinner never resolves in Capacitor APK
**Filed:** 2026-03-11
**Area:** `src/components/CoursePage.jsx` → `IframeWithLoader`, all `public/references/*.html`

The loading spinner shown while an iframe loads never goes away inside the Android APK (Capacitor WebView). The `onLoad` event either stalls or never fires when the page has an unresolvable external resource — specifically the Google Fonts `<link>` tag present in every reference HTML file.

**Root cause:** Every `public/references/*.html` includes:
```html
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">
```
In an offline or restricted WebView environment, this request blocks or hangs, preventing the iframe's `onLoad` from firing. The spinner overlay stays on screen indefinitely.

**Affected files:** All 39 HTML reference files in `public/references/` and `public/references/languages/`.

**Does not affect:** Browser dev mode (fonts load fine). Only manifests in the APK / offline.

**Next to try:**
- Remove Google Fonts `<link>` tags from all reference HTMLs, replace with system font stack or inline the font as base64
- Or: migrate to `ReferenceViewer.jsx` (see #009) which renders natively and inherits the app's already-loaded Inter font

---

### [CLOSED] #009 — Build ReferenceViewer.jsx to replace iframes for reference pages
**Filed:** 2026-03-11
**Area:** new `src/components/ReferenceViewer.jsx`, `src/pages/CoursePage.jsx`

Reference pages are currently rendered as raw iframes (`IframeWithLoader`). This causes:
1. Spinner never resolves in APK (see #008 — Google Fonts blocking `onLoad`)
2. No in-app text search or highlight (iframes are opaque to the React tree)
3. Knowledge search results navigate to the right course but can't scroll to or highlight a section inside the iframe
4. No section-jump from knowledge base results (the "↓ Scroll to X" card in CoursePage is purely cosmetic right now)

**Goal:** A `ReferenceViewer` component that:
- `fetch("/references/{file}")` → DOMParser → extract sections as structured data
- Renders sections as native React JSX using the app's own color tokens + Inter font
- Supports `highlight` prop (same TreeWalker approach as MarkdownViewer)
- Supports `sectionId` prop — scrolls to the matching section on load (enables real knowledge search landing)
- Eliminates the Google Fonts dependency entirely inside the viewer

**Proof of concept file:** `public/references/data-structures.html` (simplest structure — `<div class="category">` blocks with `<ul>` lists)

**Migration plan:**
- Start with structured files (data-structures, algorithms, git_reference)
- Keep `<IframeWithLoader>` as fallback for visual/canvas pages (ds_array.html, etc.)
- Replace in CoursePage once ReferenceViewer is stable

**Blocked by:** None. Can start immediately next session.

---

### [OPEN] #010 — Sticky nav bars visible inside srcdoc iframes
**Filed:** 2026-03-11
**Severity:** Minor / cosmetic
**Area:** `src/components/ReferenceViewer.jsx`, scripted reference HTMLs

Scripted reference files (automata, jflap-demo, recursion-memo-dp, etc.) render via `srcdoc` iframe so their JS executes. Files like `automata-sisper-reference.html` have a `position: sticky; top: 0` nav bar designed for full-page scrolling. Inside the iframe viewport it sticks correctly, but visually it overlaps the page content in a way that looks odd when embedded in the app.

**Not a regression** — the old `<IframeWithLoader>` had the same behavior. Now more visible because the iframe loads instantly (no spinner).

**Fix when desired:** Inject a `<style>` block into the srcdoc that overrides `position: sticky` and `position: fixed` to `position: relative`, so the nav scrolls naturally with content instead of pinning inside the iframe viewport.

```js
const noSticky = `<style>
  *[style*="position:sticky"], *[style*="position: sticky"],
  nav, header { position: relative !important; top: auto !important; }
</style>`;
// inject before </head>
```

---

### [CLOSED] #011 — Full-text reference search misses content inside tables and nested structures
**Filed:** 2026-03-11
**Severity:** HIGH — blocks core search functionality
**Root cause update:** extractText() walker is correct but in-memory cache (refTextCache) holds stale data from before the fix. Needs sessionStorage persistence keyed by version stamp.
**Area:** `src/search.js` → `buildRefTextIndex`, `searchRefTextIndex`

The full-text index is built by fetching each HTML file, running `div.textContent` to strip tags, and storing the plain text. This works for flat text content but misses or poorly tokenizes content inside:
- `<table>` cells (e.g. "Factoring Patterns" table — `a²−b²`, `(a+b)(a−b)` etc.)
- `<td>` and `<th>` elements where content is split across cells without spaces
- Math notation like `a²+2ab+b²` which gets concatenated without whitespace into unsearchable blobs

**Example:** Searching "factoring patterns" returns no results even though `precalculus-guide.html` contains a clearly labelled "FACTORING PATTERNS" section.

**Root cause:** `div.textContent` on a `<table>` concatenates all cell text with no separators. "PatternFactored FormExpanded Forma²−b²(a+b)(a−b)..." becomes one unsearchable string that doesn't match "factoring patterns" as a phrase.

**Fix:**
- Walk the DOM manually, inserting spaces between block-level elements (`td`, `th`, `li`, `div`, `p`, `h1`–`h6`) before extracting text
- Or: use `innerText` instead of `textContent` (respects display, inserts newlines for block elements) — but `innerText` isn't available in the DOMParser context (no layout engine)
- Best fix: recursively walk nodes and join with `" "` whenever crossing a block element boundary

```js
function extractText(el) {
  const BLOCK = new Set(["DIV","P","TD","TH","LI","H1","H2","H3","H4","TR","SECTION"]);
  let out = "";
  for (const node of el.childNodes) {
    if (node.nodeType === 3) out += node.textContent;
    else if (node.nodeType === 1) {
      if (BLOCK.has(node.tagName)) out += " " + extractText(node) + " ";
      else out += extractText(node);
    }
  }
  return out;
}
```

---

### [CLOSED] #012 — Knowledge search results show raw entry IDs as labels
**Filed:** 2026-03-11
**Area:** `src/search.js` → `searchKnowledgeIndex`

`proof_method` entries in `discrete_math.js` use `term:` field for their human-readable name, not `name:` or `symbol:`. The label fallback `entry.symbol || entry.name || entry.id` never checked `entry.term`, causing results like `discrete_math_proof_direct_proof_26` to appear instead of "Direct Proof".

**Fix:** Extended fallback to `entry.symbol || entry.name || entry.term || entry.id`.

---

### [OPEN] #013 — Knowledge system: keep or deprecate?
**Filed:** 2026-03-11
**Area:** `src/data/knowledge/`, `src/search.js`

The 6 knowledge JS files (~10k lines) were extracted from reference HTML files and duplicate content that's now fully indexed by `buildRefTextIndex`. Full-text reference search covers all the same material with better fidelity (original formatting, context, navigation).

**Arguments to keep:** Knowledge entries carry structured metadata (type, domain, section, symbol, definition) that enables rich result cards. Navigates to a knowledge viewer panel in CoursePage.

**Arguments to remove:** Duplicates reference content. Maintenance burden — any HTML update requires re-extracting JS. Results in two result cards for the same content. The raw-ID label bug (#012) is a symptom of schema inconsistency across files.

**Decision needed.** If keeping: audit all entry schemas and normalize field names. If removing: delete `src/data/knowledge/`, remove `searchKnowledgeIndex` from `search.js`, remove the knowledge viewer from `CoursePage`.