// Central glob registry — all paths relative to src/
// Import these into any component that needs to load content files.

export const mdFiles   = import.meta.glob("./content/**/*.md",       { query: "?raw", import: "default" });
export const txtFiles  = import.meta.glob("./content/**/*.txt",      { query: "?raw", import: "default" });
export const cppFiles  = import.meta.glob("./content/code/**/*.cpp", { query: "?raw", import: "default" });
export const htmlFiles = import.meta.glob("./content/**/*.html",     { query: "?raw", import: "default" });
