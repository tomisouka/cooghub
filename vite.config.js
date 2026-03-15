// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Upload server plugin — starts alongside `pnpm dev`, no separate terminal needed
function registerProjectPathPlugin() {
  return {
    name: "register-project-path",
    configureServer() {
      const homedir = process.env.HOME || process.env.USERPROFILE || "";
      const configPath = path.join(homedir, ".coogshub_path");
      fs.writeFileSync(configPath, __dirname, "utf8");
      console.log("  ✓ Project path registered at", configPath);
    },
  };
}

function uploadServerPlugin() {
  let started = false;
  return {
    name: "upload-server",
    async configureServer(server) {
      if (started) return;
      started = true;
      const { app } = await import("./server/upload.js");
      // Mount the Express app directly on Vite's connect middleware
      server.middlewares.use("/api", app);
      console.log("  ✓ Upload server mounted at /api");
    },
  };
}

// Plugin: serve HTML files with ?raw without Vite's transformIndexHtml injection.
// Covers both /references/ (public/) and /src/content/ paths.
// ReferenceViewer fetches with ?raw to get clean HTML without @vite/client etc.
function rawHtmlPlugin() {
  return {
    name: "raw-html-references",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        if (!url.searchParams.has("raw")) return next();
        if (!url.pathname.endsWith(".html")) return next();

        // Resolve file: /references/ → public/, /src/ → project root
        let filePath;
        if (url.pathname.startsWith("/references/")) {
          filePath = path.join(__dirname, "public", url.pathname);
        } else if (url.pathname.startsWith("/src/")) {
          filePath = path.join(__dirname, url.pathname);
        } else {
          return next();
        }

        if (!fs.existsSync(filePath)) return next();

        const body = fs.readFileSync(filePath, "utf8");
        const buf = Buffer.from(body, "utf8");
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": buf.length,
          "Cache-Control": "no-store",
        });
        res.end(buf);
        // Do NOT call next() — we've handled the response, bypassing transformIndexHtml
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), registerProjectPathPlugin(), uploadServerPlugin(), rawHtmlPlugin()],
  server: {
    watch: {
      // Don't watch public/references — these are static HTML assets, not source files.
      // Vite watching them causes HMR to fire on every save, and the HMR client then
      // injects @vite/client into all open iframes including our srcDoc references.
      ignored: ["**/public/references/**"],
    },
  },
});