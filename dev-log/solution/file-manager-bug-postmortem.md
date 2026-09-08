# File Manager — Bug Postmortem

**Feature:** File Inventory Modal — delete files, delete subsections, save changes  
**Status:** ✅ Resolved  
**Date:** March 2026

---

## Bug 1 — `onDelete` prop was always `undefined`

**Symptom:** Clicking DELETE in the confirm panel did nothing.

**Root cause:** `FileRow` had a confirm-delete UI that called `onDelete?.(f.filename)`, but every call site either omitted the prop or explicitly passed `onDelete={undefined}`. The confirm panel fired but called nothing.

**Fix (`FileInventoryModal.jsx`):**
- Removed `onDelete` from `FileRow`'s prop signature entirely
- Wired the confirm DELETE button to `onToggleSelect?.()` instead, which stages the file in `pendingFileDeletes` — the correct path to `saveAll`
- Removed `onDelete={undefined}` from the orphan section's `FileRow` render

---

## Bug 2 — `saveAll` couldn't find file metadata

**Symptom:** Files staged for deletion silently skipped — no error, no delete.

**Root cause:** `saveAll` searched `data.courses[].tabs` to find `courseId` and `tab` for the API call. This traversal was unreliable and often produced `meta = null`, causing the `if (meta)` branch to be skipped entirely and the API call never made.

**Fix (`FileInventoryModal.jsx`):**
- Changed lookup to search `data.registered` and `data.unindexed` first — flat lists that already carry `courseId` and `tab` on every item
- Falls back to course tree traversal only if not found in flat lists
- Fixed payload key from `file: found.file || filename` (wrong) to `file: foundFlat.filePath || filename` — the server's `DELETE /file` matches against the full `filePath` (e.g. `./content/subjects/automata/list.md`), not the bare filename

---

## Bug 3 — No `vite.config.js` — Express server was never connected

**Symptom:** Every `/api/*` call returned 404. Delete, inventory, register — all broken.

**Root cause:** The Express server (`server/upload.js`) exports `app` but nothing ever mounted it. There was no `vite.config.js` in the project, so Vite's dev server had no knowledge of the Express routes. Every fetch to `/api/group`, `/api/file`, `/api/inventory` etc. hit Vite directly and got a 404.

**Fix (new `vite.config.js`):**
```js
import { app as apiApp } from "./server/upload.js";

function expressPlugin() {
  return {
    name: "express-api",
    configureServer(server) {
      server.middlewares.use("/api", apiApp);
    },
  };
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
});
```

---

## Bug 4 — Server was writing to `subjects.js`, app reads `subjects.json`

**Symptom:** Deletes and reorders appeared to succeed (no error) but nothing changed in the UI after reload.

**Root cause:** The codebase migrated course data from `subjects.js` to `subjects.json`, but the entire server (`upload.js`) still targeted `SUBJECTS_PATH = subjects.js` using brittle regex string surgery. Every write — `patchSubjects`, `DELETE /file`, `DELETE /group`, `POST /reorder`, `POST /add-section` — was modifying the wrong file. `subjects.js` is now just language reference links; the app never reads it for course data.

**Fix (`upload.js`):** Rewrote every affected route to use `JSON.parse`/`JSON.stringify` on `subjects.json` directly:

| Route | Old approach | New approach |
|---|---|---|
| `patchSubjects` | Regex string insert into `subjects.js` | Push entry object into JSON array |
| `GET /groups` | Regex scan of `subjects.js` | Filter `type: "group"` from JSON |
| `POST /reorder` | String rebuild of JS array | Rebuild JSON tab array |
| `POST /add-section` | String insert into `subjects.js` | Push group object to JSON |
| `DELETE /file` | Line-filter regex on `subjects.js` | Filter file from JSON array |
| `DELETE /group` | Walk braces in `subjects.js` | `.filter()` on JSON array |
| `GET /orphans` | `src.includes(filename)` on `subjects.js` | Build registered Set from JSON |

---

## Bug 5 — `DELETE /group` matched file labels instead of group labels

**Symptom:** Deleting a subsection sometimes corrupted `subjects.js` or returned "Group not found".

**Root cause:** The server searched for the group using `src.indexOf('label: "rrrr"')` — but plain file entries also have `label:` fields. If a file's label matched first, `openBrace` walked back to the file's `{` instead of the group's `{`, and the wrong block was deleted.

**Fix (`upload.js`):** Replaced the naive label string search with a scan that:
1. Finds all `type: "group"` occurrences within the tab array bounds (`closeIdx`)
2. Walks back to each group's opening `{`
3. Reads the full group object and checks its `label` field specifically
4. Only proceeds with deletion on an exact match

*(This bug became moot after Bug 4 was fixed — all operations now use JSON — but the fix was applied anyway.)*

---

## Bug 6 — `no-dupe-else-if` in `buildJsTab`

**Symptom:** ESLint error, unreachable branch.

**Root cause:** In `buildJsTab`, `else if (item.group)` appeared before `else if (item._emptyGroup && item.group)`. Since `item.group` being truthy already covers any case where `item._emptyGroup && item.group` is true, the second branch could never execute.

**Fix (`upload.js`):** Swapped the two branches — specific condition (`_emptyGroup && group`) before the broader one (`group`).

---

## Bug 7 — `removeFromIndex` deleted with dead builder functions

**Symptom:** ESLint `no-undef` — `removeFromIndex is not defined` at three call sites.

**Root cause:** When the dead `buildJsonTab`, `buildJsTab`, and `makeEntryFromItem` functions were removed, `removeFromIndex` was accidentally caught in the same deletion range.

**Fix (`upload.js`):** Re-added `removeFromIndex` as a standalone function before the Express route definitions.

---

## Bug 8 — Password confirmation on save

**Feature added:** Clicking "✓ save all" now requires password entry before `saveAll()` fires.

**Implementation (`FileInventoryModal.jsx`):**
- Added `confirmingSave`, `passwordDraft`, `passwordErr` state
- "✓ save all" button replaced inline with a password input + confirm button when clicked
- Enter key and confirm button both check `passwordDraft === "changeme123"` before calling `saveAll()`
- Wrong password shows "wrong" in red, stays open
- Escape or ✕ cancels back to the save button
- `resetPending` also clears confirm state
