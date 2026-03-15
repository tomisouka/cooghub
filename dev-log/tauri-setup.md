# Tauri Setup — Coogs Hub Desktop App
**Phase 9 · Last updated: 2026-03-14**

This doc covers everything needed to add Tauri to the project from scratch.
Follow every step in order. Do not skip.

---

## 0. Prerequisites check

Run these before anything else to confirm your system is ready.

```bash
# Check Node version — must be 18+
node -v

# Check pnpm
pnpm -v

# Check WebKitGTK — must be 2.36+ for Tauri 2.x
dpkg -l libwebkit2gtk*
# You want to see libwebkit2gtk-4.1-0 version 2.36 or higher
```

If `pnpm` is not installed:
```bash
npm install -g pnpm
```

---

## 1. Install system dependencies (Linux / Mint / Ubuntu)

These are required by Tauri to build and run. All are APT packages.

```bash
sudo apt update

sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  libssl-dev \
  libxdo-dev \
  libxcb-shape0-dev \
  libxcb-xfixes0-dev
```

> **Note:** `libayatana-appindicator3-dev` is the system tray library. If it fails on your distro try `libappindicator3-dev` instead.

---

## 2. Install Rust

Tauri's backend is compiled Rust. If you already have Rust, skip to step 3.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

When prompted, choose option `1` (default install).

Then reload your shell:
```bash
source ~/.cargo/env
```

Verify:
```bash
rustc --version
# should print something like: rustc 1.78.0
cargo --version
```

If you're on a new terminal session later and `cargo` isn't found, run `source ~/.cargo/env` again or add it to your `.bashrc`:
```bash
echo 'source "$HOME/.cargo/env"' >> ~/.bashrc
```

---

## 3. Add Tauri to the project

Navigate to the project root (wherever `package.json` lives):

```bash
cd ~/path/to/coogs-hub
```

Install Tauri CLI and API:
```bash
pnpm add -D @tauri-apps/cli@latest
pnpm add @tauri-apps/api@latest
```

---

## 4. Initialize Tauri

```bash
pnpm tauri init
```

You will be asked a series of questions. Answer exactly as follows:

| Prompt | Answer |
|---|---|
| What is your app name? | `Coogs Hub` |
| What should the window title be? | `Coogs Hub` |
| Where are your web assets (HTML/CSS/JS) located relative to `<current dir>/src-tauri`? | `../dist` |
| What is the URL of your dev server? | `http://localhost:5173` |
| What is your frontend dev command? | `pnpm dev` |
| What is your frontend build command? | `pnpm build` |

This creates a `src-tauri/` folder with:
- `Cargo.toml` — Rust manifest
- `tauri.conf.json` — Tauri config
- `src/main.rs` — Rust entry point
- `icons/` — App icons

---

## 5. Update `tauri.conf.json`

Open `src-tauri/tauri.conf.json` and set the following. Replace the entire file with:

```json
{
  "productName": "Coogs Hub",
  "version": "0.1.0",
  "identifier": "com.kaneki.coogshub",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build"
  },
  "app": {
    "windows": [
      {
        "title": "Coogs Hub",
        "width": 1280,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

---

## 6. Update `vite.config.js`

Tauri needs Vite to output to `dist/` and not clear the port. Add the Tauri-specific config.

In `vite.config.js`, add this inside `defineConfig({...})`:

```js
export default defineConfig({
  plugins: [react(), uploadServerPlugin(), rawHtmlPlugin()],

  // Add this block:
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,       // must match tauri.conf.json devUrl
    strictPort: true, // fail if port is already taken — don't silently switch
    watch: {
      ignored: ["**/public/references/**"],
    },
  },
});
```

---

## 7. Add Tauri scripts to `package.json`

Open `package.json` and add to the `"scripts"` block:

```json
"tauri": "tauri",
"tauri:dev": "pnpm tauri dev",
"tauri:build": "pnpm tauri build"
```

---

## 8. First dev run

```bash
pnpm tauri dev
```

This will:
1. Start `pnpm dev` (Vite + the Express upload server)
2. Compile the Rust backend (first time takes 2–5 minutes — Rust is compiling ~300 crates)
3. Open a native desktop window showing the app

Subsequent runs are much faster (only changed Rust code recompiles).

---

## 9. First production build

```bash
pnpm tauri build
```

Output will be in `src-tauri/target/release/bundle/`:
- `.deb` — Debian/Ubuntu/Mint installer
- `.AppImage` — portable single-file executable (runs on any Linux)
- Binary at `src-tauri/target/release/coogs-hub`

Install the `.deb` with:
```bash
sudo dpkg -i src-tauri/target/release/bundle/deb/coogs-hub_0.1.0_amd64.deb
```

---

## 10. Troubleshooting

**`cargo` not found after install:**
```bash
source ~/.cargo/env
```

**`libayatana-appindicator3-dev` not found:**
```bash
sudo apt install libappindicator3-dev
```

**Port 5173 already in use:**
Kill whatever is on it: `lsof -ti:5173 | xargs kill -9`

**Window opens but shows blank white screen:**
Make sure `pnpm dev` is running and the dev server is reachable at `http://localhost:5173` before Tauri opens the window. `strictPort: true` in vite config helps catch this.

**Rust compile errors on first build:**
Usually means a system dep is missing. Re-run step 1 and make sure all packages installed without errors.

---

## Notes

- The Express upload server (`server/upload.js`) still runs in dev mode via the Vite plugin. In a future phase this will be replaced with Tauri's native filesystem API so the server is not needed at all.
- The `src-tauri/` folder should be committed to git.
- `src-tauri/target/` should be in `.gitignore` — it's the Rust build cache and is large.
