# Coogs Hub — Dev Workflow & Under the Hood

## The Two Modes

### `pnpm dev` (browser)
You run this and get `http://localhost:5173`. Everything is live:
- Edit any `.jsx`, `.js`, `.json`, `.md` file → browser updates instantly
- This is called **HMR (Hot Module Replacement)** — Vite watches your files and pushes changes to the browser without a full reload
- The Express server (`server/upload.js`) is mounted directly into Vite, so `/api/` routes work too
- Nothing is compiled permanently — Vite transforms files on-the-fly as the browser requests them

**This is your main development environment.**

---

### Tauri app (built binary)
You run `pnpm tauri build` and get a `.deb` installer. What happens:
1. Vite builds your entire React app into static files (`dist/`) — all JSX is compiled to plain JavaScript, all imports are bundled together into a handful of `.js` files
2. Rust compiles `src-tauri/src/lib.rs` into a native binary
3. Tauri bundles the `dist/` folder *inside* the binary — the app carries its own web content, no server needed
4. The binary uses a system **WebView** (same engine as Chrome/Safari but embedded) to render the UI

**The key consequence:** the bundled JS is a frozen snapshot. Editing `DeptPage.jsx` after building does nothing — the app is already compiled and doesn't know your source files exist.

---

## Why Some Things Need a Rebuild and Some Don't

### Needs a rebuild
- `src/pages/*.jsx` — React components, compiled into the bundle
- `src/components/*.jsx` — same
- `src/App.jsx` — the router, compiled in
- `src-tauri/src/lib.rs` — Rust code, has to be recompiled

These are **code** — they get compiled into the binary and can't be changed without recompiling.

### Does NOT need a rebuild
- `src/data/*.json` — read from disk at runtime via Rust `load_data_file` command
- `src/content/**` — markdown/HTML files read from disk via the file system
- `public/**` — static files served directly, never bundled
- `server/upload.js` — only runs in `pnpm dev`, not in Tauri

These are **data** — the app reads them fresh every time it launches.

---

## What Actually Happens When You Launch the App

```
1. OS opens the binary
2. Binary starts a local WebView (embedded browser)
3. WebView loads the bundled JS/HTML from inside the binary
4. React boots up — useState initializes with empty/fallback data
5. useEffect fires → invoke("load_memory") → Rust reads memory.js from disk
6. useEffect fires → invoke("load_data_file", "subjects.json") → Rust reads subjects.json
7. React re-renders with the live data from disk
8. App is ready
```

Steps 1-4 use the frozen bundle. Steps 5-8 pull live data from your project folder.

---

## Why `pnpm dev` Is Fully Live

Vite is a **dev server** — it doesn't pre-compile anything. When your browser requests `DeptPage.jsx`, Vite:
1. Reads the file from disk right now
2. Transforms it (JSX → JS, TypeScript → JS, etc.)
3. Sends it to the browser

So every request gets the current state of your file. Change the file, the browser gets the new version on next render. This is why HMR feels instant — Vite only re-transforms the file that changed, not the whole app.

---

## The Real Options for "Always Live"

### Option 1 — Use pnpm dev as your main tool (recommended)
Open the browser, develop there. Rebuild Tauri periodically as a "release." This is the standard workflow for any web app.

### Option 2 — Point Tauri at the dev server
In `tauri.conf.json`, `devUrl` is already set to `http://localhost:5173`. When you run `pnpm tauri dev` (not `build`), Tauri opens a window pointing at your live Vite server. Changes to JSX appear instantly in the Tauri window too — no rebuild.

The catch: `pnpm tauri dev` compiles Rust every time (slow first launch), and you need `pnpm dev` running alongside it.

### Option 3 — Accept the split (current setup)
- Data/content = live via JSON + Rust file reads
- UI code = rebuild when changed
- Use `pnpm dev` for UI work, rebuild when the UI is stable

---

## The WebView

The Tauri app doesn't ship its own browser engine — it uses whatever is installed on the OS:
- **Linux** → WebKitGTK (same engine as Safari)
- **Windows** → WebView2 (Edge/Chromium)
- **macOS** → WKWebView (Safari)

This is why the binary is small (~5MB) compared to Electron (~150MB). Electron ships its own Chromium. Tauri borrows the system's.

The downside: slight rendering differences across platforms. The upside: tiny binary, low memory usage.

---

## The Rust Side

`src-tauri/src/lib.rs` is the bridge between the WebView and the OS. It:
- Registers commands (`load_memory`, `save_deadlines`, `load_data_file`, etc.)
- These commands are called from JS via `invoke("command_name", { args })`
- Rust has full OS access — it can read/write files, make network requests, spawn processes
- The WebView (JS side) has sandboxed access — it can only do what Rust explicitly allows

This is the security model: JS asks Rust to do things, Rust decides if it's allowed.

---

## TL;DR

| Thing | Where it lives | Live without rebuild? |
|-------|---------------|----------------------|
| UI layout / components | Compiled into binary | No |
| App routing | Compiled into binary | No |
| Rust commands | Compiled into binary | No |
| Data (JSON files) | Read from disk at runtime | Yes |
| Content (md, HTML) | Read from disk at runtime | Yes |
| pnpm dev | Vite dev server | Always live |
