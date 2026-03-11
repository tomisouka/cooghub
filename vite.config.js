// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Upload server plugin — starts alongside `pnpm dev`, no separate terminal needed
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

export default defineConfig({
  plugins: [react(), uploadServerPlugin()],
});