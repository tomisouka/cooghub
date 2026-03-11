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
---

## Session 18 — Mobile Polish Pass + Bash Reference

### Goal
Three targeted fixes: remaining pages not mobile-friendly, PDF viewer unusable on touch (no scroll, no pinch-zoom), status bar covering the app top bar on Android. Plus Bash language reference added to Lang+.

---

### Mobile Pass v2 — Remaining Pages (Session 18a)

**HomePage.jsx**
- Container: `height: "100vh"` → `height: "100%"` + `overflowY: auto` so it respects the bottom nav offset
- Title: 48 → 36px on mobile; subtitle margin tightened
- Search bar padding reduced on mobile; input font 15 → 14px
- "Add Files" button hidden from inside search bar on mobile — moved to a full-width button below the dept cards
- Results dropdown `maxHeight` capped at `55vh` on mobile
- Dept cards: padding reduced, font sizes tightened

**Talk2MePage.jsx**
- Same single-pane pattern as CoursePage: tapping a file hides the sidebar and goes fullscreen content
- Mobile back arrow `←` in a sticky mini-header above content returns to the list
- `switchSection` resets `showList = true` so switching sections always lands back on the file list
- Root container `height: "100vh"` → `height: "100%"`

**DeptPage.jsx (Lang+ and MATH)**
- **Lang+ panel**: on mobile, tapping a language hides the sidebar and shows iframe fullscreen. Back arrow in header toggles back. Active language name shown in header while viewing.
- **MATH layout**: same single-pane treatment. Tapping a reference goes fullscreen. Back arrow in header returns to the list. Header font sizes tightened for mobile.

---

### Bash Reference — bash_reference.html (Session 18b)

Built `public/references/languages/bash_reference.html` matching the existing cpp/git/etc reference style (Fraunces + DM Mono + Inter fonts, sticky header with inline search, dark theme, green accent).

**16 sections, ~1,480 lines:**
1. Syntax & Structure — special chars, exit codes, shebang
2. Variables & Parameters — assignment, all 20+ special params, all parameter expansions
3. String Operations — quoting rules, here strings, here docs
4. Arrays & Associative Arrays — indexed + assoc, safe expansion patterns
5. Arithmetic — `$(( ))`, `(( ))`, operator table, bc/awk for floats
6. Conditionals — if/elif/else, all file tests, string tests, int tests, case, select
7. Loops — for-in, C-style, array loop, `while IFS= read -r` pattern, break/continue
8. Functions — local scope, return, stdout-as-value, namerefs (Bash 4.3+)
9. I/O & Redirection — full redirection table, read options, printf
10. Processes & Jobs — job control, subshells, parallel, PIPESTATUS
11. Builtins — all major builtins, set options, shopt
12. Globbing & Expansion — glob, extglob, brace expansion, tilde
13. Regex & Pattern Matching — `=~`, `$BASH_REMATCH`, ERE quick ref
14. Scripting Best Practices — full script template, getopts, mktemp/trap cleanup
15. Traps & Signals — trap syntax table, common signals table, re-raise pattern
16. Tips & Gotchas — common mistakes table, useful idioms, debug techniques, ShellCheck callout

Wired into `src/data/subjects.js` LANG_REFS as `{ file: "languages/bash_reference.html", label: "Bash", color: "#a8e6a3" }` in the OS group alongside ARM, Linux, and Git.

---

### Status Bar / Safe Area Fix (Session 18c)

**Problem:** On Android (Capacitor APK), the system status bar was overlapping the app's top bar, making the header unreadable.

**Root cause:** `viewport-fit` was not set to `cover`, so the browser was not exposing `env(safe-area-inset-*)` variables. Without these, the app had no way to know the status bar height.

**Fix — two parts:**

`index.html` — added `viewport-fit=cover` to the viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

`src/App.jsx` — added CSS custom properties and applied them:
```css
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
}
```
- `<main>` on mobile: `paddingTop: "var(--sat)"` pushes content below status bar
- Bottom nav `height: calc(60px + var(--sab))` extends into home bar zone on notched phones
- Nav buttons locked to `height: 60px` so the tap targets stay correct size despite nav growing taller

On desktop the CSS vars fall back to `0px` — no impact.

---

### PDF Touch Fix (Session 18c)

**Problem:** On mobile, the PDF viewer canvas was not scrollable and had no pinch-to-zoom.

**Fix — two parts:**

1. **Scroll**: added `touchAction: "pan-x pan-y pinch-zoom"` to the scroll container — tells the browser not to suppress two-finger pan on this element.

2. **Pinch-to-zoom**: native touch event listeners (non-passive, so `preventDefault()` works) track two-finger pinch distance. On `touchstart` the starting distance and scale are recorded; on `touchmove` the ratio of new distance to start distance scales `pinchRef.current.startScale` and calls `setScale()`. The useEffect re-binds listeners whenever `scale` changes so `startScale` is always current.

**Why non-passive?** React synthetic `onTouchMove` is passive by default — `e.preventDefault()` inside it silently fails, which allows the page to scroll while pinching. Registering via `addEventListener(..., { passive: false })` gives us actual control.

---

### Files Changed
- `index.html` — `viewport-fit=cover` added
- `src/App.jsx` — safe area CSS vars, main paddingTop, nav height/padding fix
- `src/components/PDFViewer.jsx` — pinch-to-zoom via non-passive touch listeners, `touchAction` on scroll container
- `src/pages/HomePage.jsx` — mobile padding, font sizes, Add Files repositioned
- `src/pages/Talk2MePage.jsx` — single-pane mode, mobile back arrow
- `src/pages/DeptPage.jsx` — Lang+ and MATH single-pane on mobile
- `public/references/languages/bash_reference.html` — new file
- `src/data/subjects.js` — Bash added to LANG_REFS

---

## Session 19 — PDF Viewer Horizontal Scroll Fix

### Goal
Diagnose and fix horizontal scrolling in the PDF viewer. Vertical scroll worked, left/right did not.

---

### Bug: PDF horizontal scroll broken

**Symptom:** Scrolling up/down in the PDF viewer worked fine. Scrolling left/right did nothing — the canvas was unreachable past the right edge regardless of zoom level.

**Initial hypothesis (wrong):** `textAlign: "center"` on the scroll container was centering the canvas and clipping overflow symmetrically. Removing it and switching to `margin: 0 auto` on the inner wrapper didn't fix it.

**Actual root cause — two-level flex constraint failure:**

The scroll container inside `PDFViewer` had `overflow: auto` — correct. But `overflow` only creates a scrollable region when the element has a *bounded width*. The element's width is bounded by its parent, whose width is bounded by its parent, all the way up the tree. The chain was broken in two places:

1. **`CoursePage` body div** — `flex: 1, display: flex` with no `minWidth: 0` and no `overflow: hidden`. CSS flexbox items have `min-width: auto` by default, meaning "be as wide as your content." So when the PDF canvas was wide, it expanded the body div instead of overflowing inside the scroll container.

2. **`PDFViewer` outer div** — had `height: 100%` but no `flex: 1` / `minWidth: 0`, so it wasn't taking a properly bounded horizontal slot from its flex parent.

**Fix:**

`CoursePage.jsx` — body div:
```jsx
// Before
<div style={{ flex: 1, display: "flex", minHeight: 0 }}>
// After
<div style={{ flex: 1, display: "flex", minHeight: 0, minWidth: 0, overflow: "hidden" }}>
```

`PDFViewer.jsx` — outer div:
```jsx
// Before
<div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#111318" }}>
// After
<div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", background:"#111318" }}>
```

**Key lesson:** `minWidth: 0` is the essential flexbox fix for overflow. Flex items default to `min-width: auto` which means they grow to fit their content and never allow their children to overflow. Adding `minWidth: 0` overrides this and lets the browser treat the element as a true bounded container. Without it, `overflow: auto` on a child is meaningless — there's nothing to overflow against.

**Also cleaned up in this session:**
- Removed the diagnostic overlay div and its `setInterval`/scroll listener `useEffect` from `PDFViewer.jsx` (was left in from troubleshooting)
- Added `pinch-zoom` to `touchAction` on the scroll container — was `"pan-x pan-y"` but `pinch-zoom` was missing (Session 18 intent never landed in the file)
- Changed `transformOrigin` on the canvas wrapper from `"center top"` to `"top left"` for more predictable pinch-zoom behavior

### Files Changed
- `src/components/PDFViewer.jsx` — `flex:1, minWidth:0` on outer div; removed diagnostic overlay + interval; `touchAction` now includes `pinch-zoom`; `transformOrigin` → `top left`
- `src/pages/CoursePage.jsx` — `minWidth: 0, overflow: "hidden"` on body div

---

## Session 19 (cont.) — Search Navigation Fix + PDF Highlight Ticket

### Search Navigation — Three Bugs Fixed

**Symptom:** Clicking a search result would land on the course page but show the file list instead of the content, requiring a manual file tap to get to the highlighted document.

**Bug 1 — Mobile `showList` never false on search nav (`CoursePage.jsx`)**
`showList` was hardcoded to `useState(true)`. On mobile, arriving from a search result with a specific file should skip the list entirely.
Fix: `useState(!(isMobile && dest?.file))` — if there's an incoming file from search, start in content view.

**Bug 2 — `dest` change detection used object reference equality (`CoursePage.jsx`)**
`prevDestRef` was initialized to the current `dest` on mount, and the guard was `dest !== prevDestRef.current`. React batching can reuse object references, causing the `useEffect` to silently skip the sync even when the destination changed.
Fix: replaced with a string key `"tab::file::pdfPage"` — detects any real change in destination regardless of reference.

**Bug 3 — Same-course repeat search doesn't re-trigger (`HomePage.jsx`)**
When already on a course and searching for something else in the same course, `App.jsx`'s `setDest` may bail if the value appears equal. Fix: added `_ts: Date.now()` to the dest object — every search click is guaranteed to be a fresh state value.

**Files changed:**
- `src/pages/CoursePage.jsx` — `showList` init, string key for dest change detection, `setShowList(false)` in useEffect on mobile
- `src/pages/HomePage.jsx` — `_ts: Date.now()` in `handleResult`

---

### PDF Highlight Drift — Documented as Ticket #007

Confirmed the highlight misalignment seen in the comp org textbook is a cosmetic rendering artifact, not a false match. The word "pipe" in "pipelining" was a real hit — the amber box just drifted visually due to `scaleX` transform inheritance on the `<mark>` element. No functional impact. Logged as #007 with a proposed fix approach.
---

## Session 19 (cont.) — Reference & Knowledge Base Search

### Goal
Make HTML references and knowledge base entries searchable from the global search bar.

### What's now searchable

**Before this session:**
- Markdown notes (36 files)
- Talk2Me txt files (44 files)
- C++ code files (26 files)
- PDFs (~14 files, via pdf-index.json)

**Added this session:**
- **Reference pages by label** — all 90 iframe entries across every course (references + gopal tabs) plus 14 Lang+ entries. Searching "Merge Sort", "AVL Tree", "Gopal FFT", "Dijkstra" now returns the right reference page directly.
- **Knowledge base entries** — 4,459 structured entries across 21 JS modules. Searches `symbol`, `plain`, `name`, `meaning` fields. Covers: C++, C, Python, Java, C#, TypeScript, Rust, Go, SQL, HTML/CSS, ARM, Linux, Git, Math/Science, Sets/Automata, Algorithms, Automata, Data Structures, Discrete Math, Linear Algebra, Math Notation.

### What's still NOT searchable
- **Bash reference** — `bash_reference.html` in `public/` has no companion `bash.js`. Fix: extract a `bash.js` from the HTML the same way the other language files were extracted.
- **Visual HTML content** — the 60+ algo/gopal/ds visual pages are searchable by *label* now but not by their *internal text*. They live in `public/` and can't be glob-imported. Fix: build-time extractor (like `scripts/index-pdfs.js`) that strips HTML and emits a JSON index.
- **Assignment HTML files** — 15 files in `src/content/assignments/`. Are glob-importable via `htmlFiles` but not yet wired into search. Low-effort addition.

### Architecture
- `buildReferenceIndex()` — flat array from `ALL_COURSES` references/gopal + `LANG_REFS`. Synchronous.
- `searchReferenceIndex()` — label-level search, up to 15 results.
- `searchKnowledgeIndex()` — searches `ALL_KNOWLEDGE` (~4,459 entries, 21 JS arrays). `DOMAIN_NAV` maps domain → courseId + tab + file.
- `resolveResult()` — extended for `reference` and `knowledge` types. Lang+ refs (no courseId) navigate to COSC dept page.

### Files changed
- `src/search.js` — new functions, DOMAIN_NAV, ALL_KNOWLEDGE, extended resolveResult
- `src/pages/HomePage.jsx` — refIdx state, updated handleQuery, updated typeColor
---

## Session 20 — Checkpoint: Reference Viewer & Search Audit

### What was observed
Two screenshots from a live session surfaced two distinct failure modes:

**1. Loading spinner never resolves (Image 1)**
Clicking "Doubly Linked List" in the Data Structures references tab shows the `IframeWithLoader` spinner indefinitely. The iframe fires `onLoad` reliably in a browser but not in the Capacitor APK WebView — the embedded system browser either blocks the Google Fonts `<link>` request or stalls the load event when the network is unavailable. Since every `public/references/*.html` file contains:
```html
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">
```
…the iframe never reaches a fully-loaded state in an offline/restricted environment, so `setLoaded(true)` never fires.

**2. Knowledge search result opens course page but reference doesn't display (Image 2)**
Searching "certificate" correctly finds the knowledge entry (Complexity Theory › P vs NP & Verifiers) and navigates to the Automata course, shows the yellow search-result card at the top — but the reference iframe behind it shows blank or still-loading. The knowledge card says "↓ Scroll to Complexity Theory in the reference below" but there is nothing rendered below it.

Root cause: the HTML references are plain `<iframe src="/references/...">` elements. The app has no way to:
- Search inside their text content
- Scroll-to or highlight a section
- Render them without a network dependency (Google Fonts)
- Know when they've truly finished loading in WebView

### Decision: Build a `ReferenceViewer.jsx`

Instead of iframes, reference files should be parsed and rendered natively as React components. This gives us:
- Full in-app text search with highlight + scroll (same as MarkdownViewer)
- No external network dependency (fonts loaded by the app, not the HTML file)
- Reliable load state (no `onLoad` event race)
- Section-level navigation from knowledge search results

### Proposed architecture
`src/components/ReferenceViewer.jsx`
- Accepts: `file` (path relative to `/references/`), `highlight` (search query), `sectionId` (optional — jump to section on load)
- `fetch("/references/{file}")` → parse HTML string → extract structured sections
- Render each section as React JSX with the app's own typography and color tokens
- On `highlight`: same TreeWalker + double-rAF scroll approach as MarkdownViewer
- On `sectionId`: scroll to matching `<h2>` or `<h3>` on mount

### What still needs to happen
- Extract a data schema from the reference HTML files (they vary: `<div class="category">`, `<div class="section">`, `<table>`, etc.)
- Decide: parse-at-runtime via DOMParser vs. pre-compile to JSON at build time
- Wire into CoursePage: replace `<IframeWithLoader>` with `<ReferenceViewer>` for known-structured files
- Keep iframe fallback for files that aren't yet migrated

### Files NOT changed this session
This session was a diagnostic + planning checkpoint only. No code was modified.

### Next session entry point
- File: `src/components/ReferenceViewer.jsx` (create new)
- Start with one reference file (`data-structures.html`) as the proof of concept
- Goal: render it natively, confirm highlight works, then generalize to other files

---

## Session 20 (cont.) — ReferenceViewer.jsx Built & Wired

### Diagnostics run
Audited all 39 HTML reference files (`public/references/*.html` + `languages/*.html`) by class name frequency. Found **4 structural templates** across the entire file set:

| Template | Pattern | Files |
|----------|---------|-------|
| `plain-def` | `section-header` + `<table>` rows with `.plain-def` cells | 15 (all language refs + math/linux/automata) |
| `cat-list` | `.cat-header` + `<ul><li>` with `.sym/.plain/.desc` spans | 3 (git, data-structures, algorithms taxonomy) |
| `card-grid` | `.card-bar` + `.card-label/.card-title/.card-desc` | 70+ (algorithms_reference, gopal pages, ds visuals, calc guides) |
| `concept` | `.concept-term` + `.concept-def` pairs | 2 (discrete-math-guide, linear-algebra-guide) |

Visual/canvas pages in `/ds/`, `/algos/`, `/llms/`, `/side/` subdirs kept as iframes (interactive diagrams, not parseable).

### What was built

**`src/components/ReferenceViewer.jsx`** — new native React renderer:
- `fetch("/references/{file}")` → `DOMParser` → auto-detects template → renders as React JSX
- 4 sub-renderers: `PlainDefRenderer`, `CatListRenderer`, `CardGridRenderer`, `ConceptRenderer`
- `GenericRenderer` fallback — injects sanitized `innerHTML` with app CSS override (hides original nav/fonts/bg)
- `highlight` + `highlightKey` props — TreeWalker marks + double-rAF scroll (same approach as MarkdownViewer)
- No Google Fonts dependency — uses app's Inter font, inherits `#111318` background
- Loading state is a simple spinner (fast — fetch + parse, not a full page load)

**`src/pages/CoursePage.jsx`** — wired in:
- `iframeItems` split into `nativeItems` (→ `ReferenceViewer`) and `iframeItems` (→ `IframeWithLoader`, visual pages only)
- Visual dir check: `VISUAL_DIRS = ["/ds/", "/algos/", "/llms/", "/side/"]`
- Passes `color={course.color}`, `highlight={dest?.query}`, `highlightKey={dest?._ts}` to ReferenceViewer

**`src/pages/DeptPage.jsx`** — wired in:
- Lang+ panel iframe → `ReferenceViewer` (passes per-language color from `LANG_REFS`)
- MATH dept sidebar iframe → `ReferenceViewer` (passes `dept.color`)
- Both pass `dest?.query` and `dest?._ts` for search highlight support

### Tickets resolved
- **#008 closed** — Google Fonts spinner-never-resolves bug eliminated. ReferenceViewer has no external font dependency.
- **#009 closed** — ReferenceViewer built and wired in for all structured reference pages.

### Files changed
- `src/components/ReferenceViewer.jsx` — new file
- `src/pages/CoursePage.jsx` — import + VISUAL_DIRS split + ReferenceViewer wired
- `src/pages/DeptPage.jsx` — import + both iframes replaced

---

## Session 21 — ReferenceViewer Rewrite + Full-Text Reference Search

### What broke first
After Session 20's ReferenceViewer (template-based parser), three regressions surfaced:

1. **Spinner still present** on `ds/` and `algos/` pages — `VISUAL_PREFIXES` exemption was keeping them as iframes, which still had Google Fonts blocking `onLoad`
2. **Search too limited** — reference index only had file *labels* ("Singly Linked List", "Merge Sort"). Searching actual content words like "recursion", "cache", "pointer" returned nothing
3. **Template renderer broke ds/ card pages** — `CardGridRenderer` expected `.card-bar`+`.card-desc` but `ds/` files use `.card-title`+`.card-body` — a different card structure. Cards rendered with titles only, body text invisible due to CSS regex mangling `.card-body` → `.card-.rv-generic-body`

### Root cause analysis
Spent significant time diagnosing the card-body invisibility. The `body` selector scoping regex used `\bbody\b` which matched `.card-body` → `.card-.rv-generic-body`, breaking the selector entirely. Intermediate fix used a lookahead regex to only replace standalone `body` selectors, but the deeper problem was the entire template-parsing approach was fragile.

### The actual fix — complete ReferenceViewer rewrite
Threw out all template detection, all sub-renderers (PlainDefRenderer, CatListRenderer, CardGridRenderer, ConceptRenderer, GenericRenderer). Replaced with ~170 lines:

1. `fetch("/references/{file}")` — get raw HTML
2. Strip `<link>` tags pointing to `fonts.googleapis.com` — the only actual problem
3. Extract `<style>` blocks, scope them to a unique `#rv-{id}` container (replacing `:root {}` and bare `body` selectors)
4. Extract `<body>` innerHTML
5. Inject scoped `<style>` + body HTML into a `<div id="rv-{id}">`

Every file now renders exactly as its author designed it — colors, layout, diagrams, tables, everything intact. No parsing, no re-rendering, no template detection needed.

**Key scoping regex fix:**
```js
// WRONG — broke .card-body, .node-body, etc.
.replace(/\bbody\b/g, `#${id}`)

// CORRECT — only replaces standalone `body` CSS selector
.replace(/(^|[\s,{})>+~])body(\s*[{,>+~:\[])/gm, `$1#${id}$2`)
```

### Full-text reference search
Added `buildRefTextIndex()` and `searchRefTextIndex()` to `search.js`. On mount, HomePage fetches all 90 reference HTML files in parallel, strips tags, and stores plain text per entry. Search now finds words inside reference content, not just file labels. Loads in background — falls back to label search while loading, upgrades automatically.

### VISUAL_PREFIXES removed
`ds/`, `algos/`, `llms/`, `side/` files were being kept as iframes due to a false assumption they were interactive. Audited all files — zero canvas/JS/animation in any of them. All are static card/diagram HTML. Removed the exemption. Everything goes through ReferenceViewer now.

### Files changed
- `src/components/ReferenceViewer.jsx` — complete rewrite (170 lines vs ~620)
- `src/search.js` — added `buildRefTextIndex`, `searchRefTextIndex`
- `src/pages/HomePage.jsx` — wired `buildRefTextIndex` + `searchRefTextIndex`, added `refTextIdx` state
- `src/pages/CoursePage.jsx` — removed `VISUAL_PREFIXES` + `isVisualFile`, all items → `nativeItems`, fixed duplicate `htmlItems` declaration

### Tickets
- **#008** — confirmed fully closed (no more spinners anywhere, Google Fonts stripped from all files)
- **#009** — confirmed fully closed (ReferenceViewer working correctly on all 90+ files)
- **New: full-text reference search** — not ticketed, shipped in this session

---

## Session 21 (cont.) — Search Fix, PrevNext everywhere, v1.0

### #011 — Full-text search block-aware extraction
Replaced `div.textContent` with a recursive `extractText()` DOM walker that inserts spaces at block element boundaries (`TD`, `TH`, `DIV`, `H1`–`H6`, `LI`, `TR`, `CAPTION`, etc.). Previously, table cells concatenated directly — "PatternFactored FormExpanded Forma²−b²..." — making table content unsearchable. Now every block boundary gets a space, so phrases like "factoring patterns", "contiguous memory", "merge sort" etc. resolve correctly even when split across cells.

### PrevNextBar in DeptPage
Added `PrevNextBar` component to `DeptPage.jsx` (both Lang+ and MATH reference panels). Users can now navigate between references directly from the viewer without going back to the sidebar.

### Files changed
- `src/search.js` — `buildRefTextIndex` rewritten with block-aware `extractText()`
- `src/pages/DeptPage.jsx` — `PrevNextBar` added for Lang+ and MATH panels
- `dev-log/Tickets.md` — #011 closed

### Tickets resolved
- **#011 closed** — full-text search now finds content inside tables and nested structures

### 🎉 v1.0
All originally scoped features are working:
- Unified search across notes, code, PDFs, knowledge base, and all 90+ reference HTMLs (full-text)
- Search navigates to the right course, tab, file, and scrolls to the matched term
- All reference pages render natively (no iframe spinners, no Google Fonts blocking)
- Interactive reference pages (DFA simulator, DP visualizer) render via srcdoc iframe with scripts executing
- Prev/next navigation on every viewer — references, notes, code, PDFs, Lang+, MATH
- APK-ready (Capacitor compatible, no external font deps blocking load)