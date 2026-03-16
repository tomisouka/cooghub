# Dev Log — HTML Upload & Assignment Display Pipeline
**Date:** March 15, 2026  
**Status:** ✅ Resolved

---

## Problem

Uploading `.html` assignment files through the DropZone failed with `REJECTED — Unsupported type (.html)`. Even after fixing the rejection, uploaded files were not displaying in the Automata assignments tab.

---

## Root Causes (in order of discovery)

### 1. Frontend rejected `.html` before it hit the server
`DropZone.jsx` had `.html` missing from both the `<input accept>` attribute and `extToTab()`. Files were blocked client-side.

**Fix:** Added `.html` to `accept` attribute and `extToTab()`.

### 2. Server had no route for `.html`
`server/upload.js` `ROUTES` object didn't include `.html`, so even if the file passed the frontend, the server had no destination for it.

**Fix:** Added `.html` to `ROUTES` routing to `src/content/subjects/<courseId>/`.

### 3. No way to choose destination tab
`.html` files could be notes OR assignments but the DropZone had no UI for the user to pick. Everything went to `notes` with the wrong path.

**Fix:** Added a tab picker UI (`notes · assignments · references`) to `FileRow` in `DropZone.jsx` for `.html` files. Added `tabOverrides` state that gets passed to the server on apply. Server uses the override to route the file to the correct directory and register it under the correct tab in `subjects.js`.

### 4. `subjects.js` vs `subjects.json` disconnect
The app reads `subjects.json` at runtime via `DataContext` — not `subjects.js`. We were adding the hw3 entry to `subjects.js` only, so the app never saw it.

**Fix:** Added hw3 entry to both `subjects.js` and `subjects.json`. Going forward, `patchSubjects` in `upload.js` should write to both files.

### 5. The file wasn't on disk
`hw3_problems_solutionsAutomata.html` was referenced in `subjects.json` but didn't exist at `src/content/assignments/`. It had been deleted or never properly placed there. Manually copying the file to the correct path resolved the display issue.

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/DropZone.jsx` | Added `.html` to `accept` + `extToTab`; added `tabOverrides` state; added tab picker UI in `FileRow`; pass `tabOverrides` to server on apply; fixed empty catch blocks and unused vars |
| `server/upload.js` | Added `.html` to `ROUTES`; updated `tabForExt` + `makeEntry` to support `assignments` tab; added `tabOverrides` param through `processZip`, `processFiles`, `applyResult`; fixed `base` undefined in delete routes |
| `src/data/subjects.js` | Added hw3 entry to automata assignments array |
| `src/data/subjects.json` | Added hw3 entry to automata assignments array (the file the app actually reads) |
| `src/content/assignments/hw3_problems_solutionsAutomata.html` | Created — step-reveal hw3 solutions file |
| `vite.config.js` | Added `hmr: { overlay: false }` to stop HMR crash overlay |
| `eslint.config.js` | Added `vite.config.js` to node globals block |
| `src/components/ReferenceViewer.jsx` | Fixed useless escape `\[` → `[` |

---

## HW3 File

The hw3 solutions file uses a **step-by-step reveal system** for self-quizzing:

- **Core Idea** and **Key Formula** are always visible (setup/framing)
- **Watch Out** is always visible (common mistakes)
- **Proof steps** are individually hidden — tap to reveal one at a time
- **Answer box** only appears after all steps in a section are revealed
- **Reveal All / Reset** buttons per section

Problems covered: Q1 (C not regular + C*), Q2 (TM for aᵐbⁿ m≠n), Q3 (Regular ⊊ TM-Decidable), Q4 (Pumping Lemma aⁿbᵐ n=m²), Q5 (Right quotient L/a).

---

## Lesson

**Always edit `subjects.json` when wiring new content** — not just `subjects.js`. The `.js` file is the source of truth for static imports and the upload server's `patchSubjects` function, but the app loads `subjects.json` at runtime. They need to stay in sync.

The long-term fix is to have `patchSubjects` write to both files simultaneously.
