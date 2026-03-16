# Coogs Hub

Personal study app built with React + Vite + Tauri. Spring 2026.

---

## Stack
- **Frontend**: React 19, Vite 7, no router (manual nav state in App.jsx)
- **Desktop**: Tauri v2 (Rust backend, `src-tauri/src/lib.rs`)
- **Mobile**: Capacitor (Android — currently ignored/gitignored)
- **Dev server**: Express fallback for browser mode (`/api/*` endpoints)
- **Sync**: SyncThing keeps both machines (kaneki desktop + kusuo laptop) in sync

## Project layout
```
src/
  pages/          # DeadlinesPage, ProgressPage, CoursePage, etc.
  components/     # Sidebar, PDFViewer, DropZone, etc.
  data/           # All app data — skills.js, subjects.js, memory-*.js, etc.
  content/        # Notes, assignments, talk2me entries (HTML/MD files)
public/
  references/     # Static HTML reference pages
  resources/      # Personal guide HTML files
src-tauri/
  src/lib.rs      # All Rust commands
server/
  upload.js       # Express routes — file upload, inventory, journal, persistence
dev-log/          # Dev notes, architecture docs, tickets backup
```

---

## Persistence architecture

### Two files, two pages:
| File | Owned by | Written via |
|------|----------|-------------|
| `src/data/memory-deadlines.js` | `DeadlinesPage` | `invoke("save_deadlines")` / `POST /api/save-memory` |
| `src/data/memory-progress.js` | `ProgressPage` | `invoke("save_progress")` / `POST /api/save-progress` |

### Both files are gitignored — they are runtime state, not source.

### Rust commands in lib.rs:
- `load_memory` → reads `memory-deadlines.js`
- `load_memory_progress` → reads `memory-progress.js`
- `save_deadlines` → writes `memory-deadlines.js`
- `save_progress` → writes `memory-progress.js`
- `save_data_file` / `load_data_file` → generic read/write to `src/data/`
- `list_entries`, `read_entry`, `save_entry`, `delete_entry` → Talk2Me entries

### Project path registration:
Vite plugin writes project root to `~/.coogshub_path` on `pnpm dev`.
Tauri reads this to find `src/data/` at runtime.

---

## Key shared data
- `src/data/skills.js` — single source of truth for `COURSES`, `SKILL_TREE`, `LEVEL_META`, etc.
  - Imported by both `DeadlinesPage` and `ProgressPage`
  - **Edit skills here only**

---

## Git workflow
```bash
git add .
git commit -m "message"
git push
```
Remote: `git@github.com:tomisouka/cooguh.git`

### What's gitignored (important):
- `src/data/memory-deadlines.js` — runtime deadlines state
- `src/data/memory-progress.js` — runtime skill levels + course tiers
- `src/data/memory.js` — old file, deleted, should not reappear
- `public/pdfs/` — too large for git
- `public/pdf-index.json` — regenerate with `npm run reindex`
- `android/`, `dist/`, `src-tauri/target/`

---

## Build & install
```bash
# Dev mode (browser)
pnpm dev

# Production build
pnpm build

# Tauri desktop build + install
pnpm tauri build
sudo dpkg -i "src-tauri/target/release/bundle/deb/Coogs Hub_0.1.0_amd64.deb"
```

---

## Session handoff — last worked on (March 15 2026)

### Completed this session:
1. **`/api/save-progress` added to `server/upload.js`** — `ProgressPage` can now persist in browser/dev mode. Was completely missing before, causing silent data loss on refresh.
2. **`/api/save-memory` fixed** — was writing to the old `memory.js`. Now correctly writes `memory-deadlines.js`.
3. **`ProgressPage.jsx` dynamic import fixed** — `persistProgress()` was doing `await import("@tauri-apps/api/core")` despite `invoke` already being statically imported at the top. Removed the redundant dynamic import. Kills the Vite build warning.
4. **`eslint.config.js` updated** — added a second config block scoped to `server/**` and `scripts/**` with `globals.node`. Fixes all `process is not defined` lint errors without touching source files.
5. **`server/upload.js` lint cleanup** — fixed 5 pre-existing lint issues: `courseRe` unused var removed, `stdout` unused var + listener removed, empty `catch {}` suppressed, useless escape in filename regex fixed.
6. **Ticket F032 filed** — `tickets.js` bundle exclusion tracked in `DataLayer` section.

### Open tickets (priority order):
- **F031** — Talk2Me persistence in Tauri unverified (`list_entries` etc. untested end-to-end)
- **B021** — Study heatmap month label positioning off
- **B019** — Pure-HTML reference viewer drops Google Fonts (head discarded)
- **F028** — Resources page not built yet
- **F032** — tickets.js bundle exclusion (tracked, deferred)
- **F025** — Search "view all" (may already be implemented in HomePage)
- **F009** — Font audit across app + reference HTML files

### Known issues:
- `nav.js` (static fallback) and `nav.json` (runtime) are slightly out of sync — `nav.js` is missing `progress`. Not a bug in practice since `nav.json` is what Tauri reads at runtime, but worth aligning.
- Talk2Me entries in Tauri: Rust commands are implemented but have not been tested end-to-end. Entries sidebar may silently fail to load in the installed binary.

---

## Nav pages
`home`, `cosc`, `math`, `talk2me`, `roadmap`, `resources`, `deadlines`, `progress`

> Note: `tickets` is intentionally absent from nav in production. It is visible in `pnpm dev` only (loaded via `/api/load-tickets` from `dev-log/tickets.js`). See ticket F032 for full plan.