import { PHASES, STATUS } from "../data/phases";

const FONT = "'Inter', 'Segoe UI', sans-serif";

const PHASE_STEPS = {
  8: [
    "Manifest generator built (pnpm manifest) — scans content folders, writes public/manifest.json",
    "Synced files: notes (md, txt), references (html), code (cpp, py), pdfs, subjects.js",
    "NOT synced (needs APK rebuild): React components, pages, UI config, build config",
    "SyncThing syncs project folder to phone — app reads manifest from device at launch",
    "Diff local vs synced manifest — detect new/changed files by hash",
    "Prompt: 'X new files available — update now?' Yes / Not now",
    "CURRENT BLOCKER: Android 16 blocks external storage access — manifest detected but files cannot be read or downloaded",
    "Workaround: rebuild APK for content changes until Phase 8b self-hosted server is implemented",
  ],
  "8b": [
    "Set up a self-hosted server (VPS or home server) to serve content files over HTTPS",
    "On desktop: pnpm manifest generates manifest.json + syncs changed files to server",
    "Server exposes /manifest.json and /files/* endpoints",
    "App fetches manifest on launch — diffs against local cache",
    "Delta download: only fetch files whose hash changed, skip unchanged",
    "Files saved to Directory.Data (no special Android permissions needed)",
    "Offline-first: serve from local cache when server unreachable",
    "PDFs, HTML refs, notes all deliverable without APK rebuild",
  ],
  9: [
    "Choose wrapper: Tauri (lightweight, Rust) vs Electron (heavier, JS-native)",
    "Desktop reads src/content/ and public/ directly — no Capacitor Filesystem layer",
    "SyncThing watches the project folder — desktop always sees latest files instantly",
    "Shared codebase with APK — same React app, different platform wrapper",
    "Auto-launch on startup, lives in system tray",
  ],
  10: [
    "Choose engine: SQLite via Capacitor (mobile) + better-sqlite3 (desktop)",
    "Schema: entries, courses, files, flashcard_progress, pdf_bookmarks, sync_log",
    "Seed from manifest.json — one-time migration, no data loss",
    "Replace manifest diff logic with DB queries",
    "Track per-file last-read, highlights, bookmarks without rebuilding",
  ],
};

export default function RoadmapPage() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#0f1117", fontFamily: FONT }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>
            Coogs Hub
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Roadmap</h1>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 1, background: "#1e2130" }} />

          {PHASES.map((phase, i) => {
            const s = STATUS[phase.status];
            const isDone     = phase.status === "done";
            const isUpcoming = phase.status === "upcoming";

            return (
              <div key={phase.number} style={{ display: "flex", gap: 24, marginBottom: i < PHASES.length - 1 ? 32 : 0, position: "relative" }}>

                {/* dot */}
                <div style={{ width: 37, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 2 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: isDone ? s.color : "transparent",
                    border: `2px solid ${isUpcoming ? "#2a2e38" : s.color}`,
                    flexShrink: 0, marginTop: 4,
                    boxShadow: phase.status === "active" ? `0 0 8px ${s.color}66` : "none",
                  }} />
                </div>

                {/* content */}
                <div style={{
                  flex: 1, background: s.bg,
                  border: `1px solid ${isUpcoming ? "#1e2130" : s.color + "22"}`,
                  borderRadius: 10, padding: "14px 16px",
                  opacity: isUpcoming ? 0.5 : 1,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#4a5060" }}>
                      Phase {phase.number}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: s.color,
                      background: s.bg, border: `1px solid ${s.color}33`,
                      borderRadius: 4, padding: "1px 6px", letterSpacing: "0.5px", textTransform: "uppercase",
                    }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: isUpcoming ? "#4a5060" : "#d4d8e0", marginBottom: 6 }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#5a6070", lineHeight: 1.6 }}>
                    {phase.summary}
                  </div>
                  {PHASE_STEPS[phase.number] && (
                    <ol style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                      {PHASE_STEPS[phase.number].map((step, si) => (
                        <li key={si} style={{ fontSize: 11, color: "#4a5568", lineHeight: 1.7, paddingLeft: 4 }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}