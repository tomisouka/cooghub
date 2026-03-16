import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { app as apiApp } from "./server/upload.js";

// Vite plugin that mounts the Express app as dev-server middleware.
// Every request starting with /api/ is handled by upload.js.
// All other requests fall through to Vite's normal dev handling.
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