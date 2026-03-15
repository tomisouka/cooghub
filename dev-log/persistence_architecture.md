# Coogs Hub — Persistence Architecture

## The Problem

The app has two runtime environments:
- **Browser** (`pnpm dev` at `localhost:5173`) — Vite dev server, Express API mounted via plugin
- **Tauri desktop app** — bundled binary, no Vite, no Express, no dev server

`localStorage` is scoped to the browser origin. Data saved in the browser never reaches the Tauri app and vice versa. The Tauri webview runs on `tauri://localhost` — a completely separate storage bucket.

Static JS imports (`import { DEADLINES } from "../data/memory.js"`) get **bundled at build time**. The app always starts with whatever was in the file when you last ran `pnpm tauri build` — not what's on disk right now.

---

## The Solution

### Two-layer persistence

| Layer | Browser | Tauri App |
|-------|---------|-----------|
| **Write** | `POST /api/save-memory` → Express writes to `src/data/memory.js` | `invoke("save_deadlines")` → Rust writes to `src/data/memory.js` |
| **Read on startup** | Static import (bundled) — fine for dev | `invoke("load_memory")` → Rust reads file from disk, JS parses and hydrates state |

### Key files

- `src/data/memory.js` — runtime persistence, auto-overwritten on every change
- `src/data/deadlines.js` — seed/config only, not touched at runtime
- `src-tauri/src/lib.rs` — Rust commands: `load_memory`, `save_deadlines`, `list_entries`, `read_entry`, `save_entry`, `delete_entry`
- `server/upload.js` — Express endpoints including `/save-memory` for browser writes
- `vite.config.js` — registers project path to `~/.coogshub_path` on `pnpm dev`

### Project path detection

The installed Tauri binary has no idea where the source project lives. On first `pnpm dev`, the Vite plugin writes the absolute project path to `~/.coogshub_path`. The Rust `project_root()` function reads this file to find `src/data/memory.js` at runtime.

**On a new machine:** run `pnpm dev` once to register the path, then the app can write to disk.

### First render guard

```js
const isFirstRender = useRef(true);
useEffect(() => {
  if (isFirstRender.current) { isFirstRender.current = false; return; }
  persistToFile(deadlines, skillLevels, courseTiers);
}, [deadlines, skillLevels, courseTiers]);
```

Without this, the initial render fires `persistToFile` with the empty bundled state, immediately wiping whatever was saved to disk.

### Load on mount (Tauri only)

```js
useEffect(() => {
  if (!IS_TAURI) return;
  invoke("load_memory").then(raw => {
    // parse DEADLINES, SKILL_LEVELS, COURSE_TIERS from raw JS string
    // hydrate React state
  });
}, []);
```

The bundled static import is always empty (snapshot from last build). This effect reads the live file from disk and overwrites state with the real data.

---

## Data flow

```
User adds deadline
  → setDeadlines(...)
  → useEffect fires (not first render)
  → persistToFile(deadlines, skillLevels, courseTiers)
    → IS_TAURI: invoke("save_deadlines", { content })
      → Rust reads ~/.coogshub_path
      → writes to src/data/memory.js
    → browser: POST /api/save-memory
      → Express writes to src/data/memory.js

App launches
  → useState(INITIAL_DEADLINES)  ← empty bundled snapshot
  → useEffect (mount, IS_TAURI)
    → invoke("load_memory")
      → Rust reads src/data/memory.js from disk
      → returns raw JS string
    → parse + setDeadlines(...) ← live data from disk
```

---

## Git workflow

`memory.js` is tracked by git. Commit after a session, pull on another machine — data follows the code.

```bash
git add src/data/memory.js
git commit -m "session data"
git push
# on laptop:
git pull
pnpm dev  # or rebuild tauri
```

---

## Talk2Me

Same pattern. Entries are `.md` files in `src/content/talk2me/entries/`. In the browser, Express serves `list-entries`, `read-entry`, `save-entry`, `delete-entry`. In Tauri, the same operations go through Rust commands that read/write the actual files directly.

---

## Known limitations

- `memory.js` gets wiped if you rebuild while it has data and the file changed between builds — always commit before rebuilding
- The path registration (`~/.coogshub_path`) must be done once per machine via `pnpm dev`
- Talk2Me entries in Tauri persist to disk but are not yet verified end-to-end (pending test)
