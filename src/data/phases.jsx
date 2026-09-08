// src/data/roadmap.js
export const PHASES = [
  {
    number: 1,
    title: "Content Transfer",
    status: "done",
    summary: "All notes, markdown, HTML refs, code files, PDFs, and assignments wired into the app.",
  },
  {
    number: 2,
    title: "Component Split",
    status: "done",
    summary: "App broken into pages, components, and data files. Routing, search, and glob registry established.",
  },
  {
    number: 3,
    title: "Knowledge Base Extraction",
    status: "done",
    summary: "~4,100 entries extracted from HTML references into structured JS — languages, math, CS core, Linux.",
  },
  {
    number: 4,
    title: "App Rebuild & UI Overhaul",
    status: "done",
    summary: "Dept/course hierarchy, CoursePage tabs, DeptPage layouts, font overhaul, mobile support.",
  },
  {
    number: 5,
    title: "PDF Viewer",
    status: "done",
    summary: "PDF.js viewer wired. OS textbook live. Remaining course PDFs pending.",
  },
  {
    number: 6,
    title: "Search Improvements",
    status: "partial",
    summary: "Full-text search across notes, code, and talk2me. Knowledge base and PDF search not yet wired.",
  },
  {
    number: 7,
    title: "JSX → Data Audit",
    status: "done",
    summary: "All multi-consumer and DB-bound constants extracted from JSX into src/data/. roadmap.js, tabs.js, uiConfig.js created.",
  },
  {
    number: 8,
    title: "Runtime Content Sync — Detection Only",
    status: "partial",
    summary: "Manifest generator built. App detects content changes on launch via SyncThing + manifest diff. Currently only notifies — does NOT download or serve new files to the device. Android 16 external storage permissions block full implementation. Actual file delivery requires a self-hosted server (Phase 8b).",
  },
  {
    number: "8b",
    title: "Self-Hosted Content Server",
    status: "next",
    eta: "2025-05-15",
    summary: "Host notes, references, and PDFs on a self-hosted server. App fetches new/changed files directly over HTTPS on launch — no APK rebuild needed for content updates. Manifest drives delta downloads. Files cached locally in app storage.",
  },
  {
    number: 9,
    title: "Desktop App — V1",
    status: "partial",
    summary: "Tauri app built and installed on both a desktop and a laptop. App reads and writes directly to src/data/memory.js on disk via custom Rust commands. SyncThing keeps both machines in sync. V1 satisfied — data persists across sessions and machines. Remaining: Talk2Me entries need their own persistence file (talk2me.js) and Rust commands, mirroring the memory.js pattern.",
  },
  {
    number: "9b",
    title: "Desktop App — Persistence Layer",
    status: "next",
    eta: "2025-05-30",
    summary: "Complete the file-based persistence architecture. Talk2Me entries currently work in browser via Express but not verified in Tauri. Need talk2me.js as dedicated persistence file, load_talk2me and save_talk2me Rust commands, and first-render guard matching the deadlines pattern. Then verify end-to-end on both machines.",
  },
  {
    number: 10,
    title: "Database",
    status: "next",
    eta: "2025-06-30",
    summary: "Once sync is stable, the manifest becomes the seed. Migrate to a real DB for queryability, user progress, flashcard history, PDF bookmarks, and highlight tracking. Offline-first — DB lives on device, syncs passively.",
  },
  {
    number: 11,
    title: "Frontend Polish",
    status: "upcoming",
    eta: "2025-08-01",
    summary: "Design system, CSS vars, loading skeletons, flashcard modes, dark/light toggle.",
  },
  {
    number: 12,
    title: "Android APK",
    status: "upcoming",
    eta: "2025-08-15",
    summary: "Capacitor build, self-signed APK, biometric lock, local PDF bundle, sideload to Samsung.",
  },
];

export const STATUS = {
  done:     { label: "Done",     color: "#34d399", bg: "#34d39915" },
  partial:  { label: "Partial",  color: "#e8c547", bg: "#e8c54715" },
  active:   { label: "Active",   color: "#7eb8f7", bg: "#7eb8f720" },
  next:     { label: "Next",     color: "#fb923c", bg: "#fb923c15" },
  upcoming: { label: "Upcoming", color: "#4a5060", bg: "transparent" },
};