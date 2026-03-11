# What We Did — Coogs Hub Build Log
> A learning doc — what was done, why, and how.

---

## Session 1 — File Organization & Zipping

### Goal
Organize ~376 raw files and compress for upload to Claude (25MB limit).

### Key Learnings
- `zip` appends by default — always `rm output.zip` first
- PDFs don't compress; text/HTML/code compress heavily
- `qpdf` for splitting large PDFs by page range
- `pdfinfo file.pdf | grep Pages` for page counts
- `md5sum` to detect duplicate files

---

## Session 2 — React App Scaffolding

### Goal
Build initial App.jsx with all pages, dark theme, sidebar nav.

### Key Patterns

**import.meta.glob (Vite):**
```js
const mdFiles = import.meta.glob("./content/**/*.md", { query: "?raw", import: "default" });
```
Returns `{ filePath: lazyLoaderFn }`. Loaders are lazy — only fetch on call.

**useEffect async file loading:**
```js
useEffect(() => {
  if (!filePath) return;
  setContent(null);
  const loader = mdFiles[filePath];
  if (!loader) { setError(true); return; }
  loader().then(setContent).catch(() => setError(true));
}, [filePath]);
```

**3-Pane layout pattern** — used on Notes, Subjects, Talk2Me, Code Vault:
```jsx
<div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
  <div style={{ width: 180, borderRight: "1px solid #1a1a1a", overflowY: "auto" }}>{/* nav */}</div>
  <div style={{ width: 220, borderRight: "1px solid #1a1a1a", overflowY: "auto" }}>{/* files */}</div>
  <div style={{ flex: 1, overflowY: "auto" }}>{/* content */}</div>
</div>
```

**Serving HTML refs as iframes** — copy to `public/`, then:
```jsx
<iframe src="/references/algos.html" style={{ flex: 1, border: "none" }} />
```

---

## Session 3 — Content Transfer & Talk2Me

### Goal
Get all real content wired in before UI work.

- Copied 26 cpp files → `src/content/code/`
- Copied HTML references → `public/references/`
- Copied 51 talk2me files → `src/content/talk2me/`
- Added `txtFiles` glob — txt renders as `<pre>`
- Added Talk2Me page

**Lesson:** `.odt` files (LibreOffice journal entries) need conversion:
`libreoffice --headless --convert-to txt *.odt`

---

## Session 4 — Assignments, Practice, HTML Viewer

### Goal
Wire assignment HTML and practice HTML files.

**HtmlViewer dual-source pattern:**
- `public/references/` → `<iframe>` (static URL)
- `src/content/` HTML → `htmlFiles` glob + `dangerouslySetInnerHTML`

Why? Files in `src/` aren't served as static URLs by Vite — only `public/` is.

**Bug: Wrong array injection**
Python replace script matched the first `];` in the file (inside SUBJECTS), not REFERENCES.
All assignment entries injected into SUBJECTS → blank page.

**Lesson:** When editing data arrays programmatically, verify by checking surrounding context, not just the closing bracket. Safer to rebuild from an anchor point.

---

## Sessions 5–7 — Component Split

### Goal
Break monolithic App.jsx (~1100 lines) into proper structure.

**Final structure:**
```
src/
  App.jsx          — ~48 lines, routing only
  globs.js         — all import.meta.glob calls in one place
  search.js        — index builder + search logic
  components/      — Sidebar, MarkdownViewer, CodeViewer, HtmlViewer
  pages/           — one file per page
  data/            — subjects, references, code, flashcards, talk2me, nav
```

**Why globs.js?**
Glob paths are relative to the file they're declared in. Centralizing them in `src/globs.js` means all file paths start with `"./content/..."` consistently. Components import from `"../globs"`.

**Bug: echo -e artifact**
Using `echo -e` in bash heredocs left literal `-e` lines in component files
→ `ReferenceError: e is not defined` at runtime.
Fix: `grep -rn "^-e" src/` to find and remove them.

**Bug: Duplicate export default**
Appeared when copy-pasting component boilerplate. React silently fails.
Fix: always check for duplicate `export default` when a component goes blank.

**Search system (src/search.js):**
- `buildSearchIndex()` indexes all md/txt/cpp via globs on mount
- `searchIndex(index, query)` does substring match, returns top 40 with snippets
- `resolveResult()` maps results to navigation destinations
- Uses `sessionStorage` to pass search nav intent to target pages

---

## Sessions 8–9 — Knowledge Base Extraction

### Goal
Extract all structured table data from every reference HTML into JS modules
powering future flashcards, search, quiz engine, and spaced repetition.

### What We Built
`src/data/knowledge/` — 20 JS files, ~3,980 entries total.

### Extraction Approach

All reference HTMLs are table-based. A single Python `html.parser.HTMLParser`
class handled all of them:

```python
class TableExtractor(HTMLParser):
    # tracks: h2 → section, h3 → subsection
    # for each tbody tr: captures all td cells as a row
    # emits one entry per row: { id, symbol, plain, name, meaning, section, subsection, ... }
```

**Column conventions across files:**
- Col 0: symbol / command / keyword (always the "lookup key")
- Col 1: plain English gloss (what it means in plain words)
- Col 2: formal name
- Col 3: meaning / definition / example
- Col 4: optional (example, ref, extra)

### Files Extracted

**Academic refs** (study/quiz material) → `src/data/knowledge/`:
- `math_notation.js` (306) — from mathnotation_enhanced.html
- `data_structures.js` (91) — from data-structures.html
- `algorithms.js` (123) — from algorithms.html
- `discrete_math.js` (84) — from discrete-math-guide.html
- `linear_algebra.js` (94) — from linear-algebra-guide.html
- `automata.js` (302) — from automata-sisper-reference.html
- `sets_automata.js` (29) — from reading-sets-automata.html
- `linux.js` (413) — from linux_reference.html
- `math_science.js` (280) — from math_science_ref.html
- `comp_org.js` (290) — from comp_org_arm_reference.html

**Language cheat-sheets** → `src/data/knowledge/languages/` (location TBD):
- `python.js` (217), `cpp.js` (282), `c.js` (213), `java.js` (180)
- `sql.js` (183), `go.js` (137), `rust.js` (179), `typescript.js` (94)
- `csharp.js` (203), `htmlcss.js` (280)

**Not extracted** (rich interactive UIs, no table data):
- `zy.html`, `recursion-memo-dp.html`, `iteration-visualizer.html`
- `data_structures_toc.html`, `algorithms_toc.html`
- `llms/*.html` (prose articles)
- `jflap-demo.html` (JFLAP tool)

### Key Decision: What belongs in knowledge/?
`knowledge/` = structured data you'd search or quiz on.
Language refs are cheat-sheets, not course-specific — may move to `src/data/languages/` or `src/data/references/`. TBD.

### master index
`knowledge/index.js` re-exports all 20 exports from one import point.

---

## Sessions 10–13 — App Rebuild: Dept/Course Hierarchy + UI Overhaul

### Goal
Rebuild navigation around a department → course → tabs hierarchy, fix fonts for astigmatism readability, add Lang+ language references panel, and create git_reference.html.

### Architecture Change: Department/Course Hierarchy

Replaced the flat subject list with a two-level dept → course model:

```
DEPARTMENTS (cosc, math)
  └── courses[] → { id, label, courseCode, icon, color, notes[], references[], assignments[], code[], pdfs[], flashcards, langRefs }
```

New files:
- `src/data/subjects.js` — exports `DEPARTMENTS`, `ALL_COURSES`, `getCourse`, `getDept`, `courseContentCount`, `LANG_REFS`
- `src/pages/DeptPage.jsx` — COSC: course grid + Lang+ card; MATH: shared refs panel + course list
- `src/pages/CoursePage.jsx` — tabs: Notes, References, Assignments, Code, PDFs, Flashcards
- `src/components/Sidebar.jsx` — trimmed to 3 items: Home, Talk2Me, Tickets

**Routing pattern in App.jsx:**
```js
goTo(navId, courseId, destination)
// course set → render CoursePage
// no course → switch(nav) → DeptPage / HomePage / etc.
```

### Font & Readability Fix

All components switched to Inter, weight 500 minimum. Global style block in App.jsx:
```css
body, button, input, textarea, select {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
}
```
Eliminated Courier New from all viewers. Sidebar inactive text bumped from `#4a5060` to `#7a8090`.

### Lang+ Panel

Language reference panel accessible from the COSC dept page as a standalone card. Clicking opens a sidebar + iframe layout with all 13 language refs. Stored as `LANG_REFS` array in subjects.js — each entry has `{ file, label, color }`. Panel renders an iframe pointed at `public/references/languages/<file>`.

**Key bug fixed:** Lang+ was rendering at x:0 overlapping the sidebar.
Root cause: `height: 100vh` on the panel escaped `<main style={{ marginLeft: 72 }}>`.
Fix: `height: 100%` fills the parent container instead of the full viewport.

### git_reference.html

Built from `src/data/languages/git.js` (115 entries, 16 sections). Matches cpp_reference.html style — Fraunces + DM Mono fonts, sticky nav header, card grid with colored top-bar per section, fadeIn animation, inline search. Lives at `public/references/languages/git_reference.html`.

### Lessons
- `height: 100vh` in a child component escapes parent layout — use `height: 100%` to fill a container
- Always `grep` the file on disk to verify a change landed before re-generating
- HTML reference files are standalone — they load in iframes, no React wiring needed beyond a `LANG_REFS` entry
---

## Sessions 14–15 — Algo Reference Visuals + Gopal Textbook Integration

### Goal
Build all algorithm reference HTML visuals for the Algos course (COSC 3320) and create a full set of Gopal-textbook-aligned reference pages covering every chapter.

### What We Built

**General algo visuals** (`public/references/algos/`) — 30 total HTML files:
- Searching: linear, binary, jump, ternary
- Sorting: bubble, selection, insertion, merge, quick, heap, shell, counting, radix, bucket, tim
- Graph: BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, MST (Kruskal+Prim), Topological Sort
- Tree: traversals (pre/in/post/level-order), queries (height/LCA/diameter)
- Paradigms: D&C overview, DP overview, Greedy overview, Backtracking overview

**Gopal textbook visuals** (`public/references/algos/gopal_*.html`) — 16 files built from the actual book:
- `gopal_asymptotic` — Big-O/Ω/Θ/o/ω, Table 1.1 & 1.2, worked examples
- `gopal_ram_model` — 4 RAM features, input size vs value trap, pseudo-polynomial
- `gopal_primality` — IsPrime, FastIsPrime, why both are exponential in input size
- `gopal_induction` — weak vs strong, celebrity problem proof, recursion ↔ induction connection
- `gopal_gcd` — Euclidean algorithm, Theorem 3.1 proof, trace of gcd(8,5), O(log b)
- `gopal_recurrences` — DC Recurrence Theorem (3 cases), guess-and-verify, change of variables
- `gopal_selection` — Median of Medians, groups of 5, 3n/10 pivot bound, O(n) proof
- `gopal_closest_pair` — Strip lemma, at-most-8-comparisons proof, O(n log n)
- `gopal_fft` — Polynomial representations, roots of unity, FFT recurrence, DFT/interpolation, matrix view
- `gopal_maxsum` — Gopal's 7-step DP process, Min/Mout decomposition, Kadane's with trace
- `gopal_matrix_chain` — Optimal parenthesization, m(i,j) recurrence, O(n³) DP
- `gopal_seq_align` — Similarity scoring, 3-way recurrence, DNA example
- `gopal_caching` — LFD optimality, exchange argument proof, eviction strategies
- `gopal_astar` — d[v]+h[v] key, admissibility, vs Dijkstra comparison
- `gopal_union_find` — MakeSet/Find/Union, path compression, union-by-rank, height proof
- `gopal_math_formulas` — Series, geometric, harmonic, combinatorial inequalities

### subjects.js Reorganization

Collapsed 9 per-chapter Gopal groups into 3 cleaner groups:
- `Gopal — Foundations` (asymptotic, RAM, primality, induction, GCD, recurrences)
- `Gopal — Algorithms` (selection, closest pair, FFT, maxsum, matrix chain, seq align, caching, A*)
- `Gopal — Appendices` (union-find, math formulas)

Also renamed "Sorts" group → "Sorting", added `sort_tim.html` stub to the Sorting group.

### make_algo_stubs.sh

Updated the stub script with all 12 Gopal files listed in the FILES array. Safe to re-run — skips existing files. Lives in `coogs-hub/` root.

### Open TODOs from this session
- Font bump: all gopal_*.html and general algo visuals use ~.78rem body text — too small for astigmatism. Bump to 1rem+ on next pass.
- Add sort/filter UI to CoursePage References tab — 30+ algo refs is clutter without grouping controls.
- Build `sort_tim.html` (Timsort) — wired in subjects.js but file not yet built.
- Fix DS visuals font: ds_array, ds_singly, ds_doubly, ds_circular still on DM Mono.
---

## Session 16 — Search Polish + PDF Viewer Rebuild

### Goal
Fix search UX, add Gopal tab, make References filterable, and replace the native PDF iframe with a real pdfjs-powered viewer with highlight support.

---

### Font Bump — Algo/Gopal HTML Visuals
All 43 HTML files in `public/references/algos/` patched via bash one-liner:
- Body/base: `.78–.85rem` → `1rem`
- Card content: `.82–.84rem` → `.95rem`
- Code blocks: `.75–.77rem` → `.85rem`
- Small labels: `.7rem` → `.8rem`
Idempotent — files tagged with `<!-- FONT-BUMP-PATCH -->` so re-runs skip already-patched files.

---

### References Tab — Filter Input + Gopal Split

**Filter input** added to `FileList` in `CoursePage.jsx`:
- Only renders on References and Gopal tabs
- Filters both flat items and group children — groups with no matching children disappear
- When filter is active, child items show a dim `Group / ` prefix so context isn't lost after groups collapse
- Clears on tab switch

**Gopal tab** split out of References:
- `subjects.js`: Gopal groups moved from `references[]` into a new `gopal[]` key per course
- `CoursePage.jsx`: new `gopal` tab added to TABS — only appears if `course.gopal?.length > 0` (currently only Algos)
- Groups renamed from `"Gopal — Foundations"` → `"Foundations"` since the tab already says Gopal
- Viewer handles `gopal` tab identically to `references` (iframe lookup)

---

### Search Fixes

**Highlights in dropdown** — added `HighlightSnippet` component in `HomePage.jsx`:
- Splits result label and snippet text on query matches
- Wraps matches in amber `<mark>` tags inline
- Applied to both label and snippet in every result card

**Dropdown scrollable** — results container now has `maxHeight: min(520px, 65vh)` with inner scroll div and a sticky header showing `N results`.

**Click-outside closes dropdown** — `mousedown` listener on `document`, clears results when clicking outside the input or dropdown.

**Query carried to CoursePage** — `handleResult` in `HomePage` captures query before clearing state, passes it as `dest.query`. `CoursePage` uses this to drive highlights in `MarkdownViewer` and `CodeViewer`.

**Same-course re-navigation** — `useEffect` in `CoursePage` watches `dest` prop and re-syncs `tab`, `activeFile`, and `codeHighlight` when a new search result points to an already-open course.

---

### CodeViewer — Highlight + Jump Bar

`CodeViewer.jsx` gained a `highlight` prop:
- On load, scans all lines for query matches → builds `matchLines` array
- `SyntaxHighlighter` uses `wrapLines + lineProps` to tint all matching lines amber
- Jump bar appears at top: `"query" · 1/N · line X · ↑↓`
- `codeHighlight` state in `CoursePage` tracks this separately from `dest.query` so it clears when the user manually clicks a different file

---

### PDFViewer — Full Rebuild (Ticket #003)

Replaced the native `<iframe>` PDF viewer with a custom `pdfjs-dist` canvas renderer.

**Architecture:**
- `pdfjs-dist` 3.11.174 loaded from CDN at runtime — no install needed, no Vite worker config
- Canvas rendering via `page.render()` — reliable page control at any zoom
- Text layer built **manually** from `textContent.items` — each item → absolutely-positioned `<span>` using the item's transform matrix
- Highlight marks injected **during** text layer construction (not after) — avoids async timing issues with `renderTextLayer`

**Why not `renderTextLayer`?**
pdfjs 3.x `renderTextLayer` is async and spans aren't available synchronously. Walking the DOM after calling it is a race condition. Building manually from `textContent.items` gives full control.

**Why join items with `""` not `" "`?**
PDF text runs are stored as character sequences without padding. Joining with spaces causes `"pipe"` to become `"pipe "` and miss matches for `"pipeline"`. Empty join matches the raw storage format.

**Features:**
- Page nav (prev/next + direct input)
- Zoom (60%–300%, ± 20% steps)
- In-viewer search: scans all pages, shows `M/N pages` with ↑↓ jump
- Amber highlights on matching text spans
- Auto-triggers search + jump when arriving from global search (`highlight` prop + `initialPage`)
- `activeQueryRef` preserves highlight across page/zoom re-renders

**Files changed:**
- `src/components/PDFViewer.jsx` — new component
- `src/pages/CoursePage.jsx` — imports PDFViewer, passes `file`, `initialPage`, `highlight`
- `src/index.css` — `.textLayer` base styles for pdfjs span positioning
---

## Session 17 — Course Reorder + Android Planning

### Goal
Reorganize COSC dept card order, wire missing OS textbook PDF, begin Android (Capacitor) planning, update dev-log.

---

### subjects.js — Course Card Reorder

COSC course grid reordered so C++ and Python are pinned last before Lang+:

**Before:** Data Structures → Algorithms → Automata → C++ → Comp Org → Python → Databases → Operating Systems
**After:** Data Structures → Algorithms → Automata → Comp Org → Databases → Operating Systems → C++ → Python → Lang+

Rationale: C++ and Python are language-focused courses, not systems/upper-div courses. They sit more naturally right before the Lang+ language reference card.

Also reordered `LANG_REFS` in subjects.js and exports in `src/data/languages/index.js` to match — ARM/Linux/Git as the OS group, C++ and Python pinned last.

**Files changed:**
- `src/data/subjects.js` — course array reorder + LANG_REFS reorder
- `src/data/languages/index.js` — export order updated to match

---

### Wire OperatingSystems_TextbookRincon.pdf

`OperatingSystems_TextbookRincon.pdf` was in `public/pdfs/` but not wired into any course.
Added to the `opsystems` course `pdfs[]` array.

**Files changed:**
- `src/data/subjects.js` — opsystems pdfs: [] → [{ file: "OperatingSystems_TextbookRincon.pdf", label: "Operating Systems — Rincon Textbook" }]

---

### Android Port — Decision & Planning

Evaluated three options for running Coogs Hub on a Samsung Android device:
- **PWA** — lowest effort, weakest security (Chrome storage unencrypted at rest)
- **Termux** — transparent, localhost-only, good security but not a polished UX
- **Capacitor APK (sideloaded)** — chosen. True native sandbox, self-signed, biometric lock support, no Play Store

**Decision: Capacitor APK.**

Reasons:
- Native Android app sandbox — other apps can't read its data
- Self-signed with personal keystore — no third party involved
- Samsung Knox provides hardware encryption on top
- Biometric auth via `@capacitor-community/biometric-auth`
- Re-deploy workflow is straightforward: build → cap copy → gradlew → adb install

**Security items flagged before first build:**
- Audit `server/upload.js` — must confirm it is never imported by the React app
- Bundle pdfjs locally instead of loading from CDN
- Audit console.logs for any personal data leakage
- Confirm no hardcoded machine paths in source

Full checklist added to roadmap Phase 9.

---

## Session 17 (cont.) — Git Setup + PDF Storage Decision

### Git Repo Initialized
First-time git setup for the project:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin git@github.com:tomisouka/cooguh.git
git branch -M main
git push -u origin main
```
Push came in at 1.46 MiB — clean, no PDFs. `.gitignore` correctly excluded `public/pdfs/`.

### PDF Storage Decision
`public/pdfs/` is 467MB — too large for Git LFS free tier (burns bandwidth fast) and overkill for a solo personal app.

**Decision: keep PDFs local only.**
- Repo stays pure code
- PDFs backed up to Google Drive / external drive
- For Android: transfer via USB when Capacitor APK is ready

### PDF + Database Architecture (future)
PDFs are binary files — they don't go *in* a database. The right pattern is:

- **Files** stay on-device (local filesystem or USB-transferred to Android)
- **Database** stores metadata only: filename, course, last read page, highlights, bookmarks, notes

This means Phase 7 (database) will track PDF *state* (where you left off, what you highlighted) without needing to move the actual files anywhere. Keeps the app offline-first and avoids putting personal textbooks on third-party servers.

Future options if remote access is ever needed:
- Self-hosted Express/NAS on home network
- Cloudflare R2 or Backblaze B2 (object storage) — but adds a privacy tradeoff

---

## Session 17 (cont.) — Mobile Responsive Pass (v2 APK)

### Goal
Make the app minimally usable on Android before stopping. Quick pass — no full rewrite.

### Approach
Added a `useIsMobile()` hook (breakpoint 768px) as the single source of truth for layout switching. Used it in 3 components to conditionally swap layouts. Desktop behavior completely unchanged.

### useIsMobile hook
New file: `src/hooks/useIsMobile.js`
- Listens to `window.resize`
- Returns `true` if `window.innerWidth < 768`
- Cleans up listener on unmount

### App.jsx — Bottom Nav Bar
- On mobile: left sidebar hidden, `<main>` height is `calc(100vh - 60px)` to account for nav bar
- Bottom nav bar fixed at bottom — same NAV items, icons + labels, amber active indicator on top border
- On desktop: unchanged — left sidebar, full height main

### CoursePage.jsx — Single Pane Mode
Biggest UX win. On mobile:
- Tapping a file collapses the FileList and goes fullscreen content
- Back arrow (←) in header returns to the file list instead of leaving the course
- On desktop: unchanged 3-pane layout
- Tab bar: icons only on mobile (no label text), horizontally scrollable, `whiteSpace: nowrap` prevents wrapping

### DeptPage.jsx — Responsive Grid
- Course card grid: `1fr 1fr` (2 columns) on mobile vs `repeat(auto-fill, minmax(260px, 1fr))` on desktop
- Header padding reduced on mobile: `16px 16px` vs `28px 52px`
- Card padding reduced: `14px 12px` vs `20px 18px`
- Grid gap: 10px vs 14px
- Bottom padding bumped to 80px on mobile to clear the nav bar

### Files Changed
- `src/hooks/useIsMobile.js` — new file
- `src/App.jsx` — bottom nav, conditional sidebar
- `src/pages/CoursePage.jsx` — single pane mode, scrollable tabs
- `src/pages/DeptPage.jsx` — 2-col grid, responsive padding