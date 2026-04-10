import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { PHASES as INITIAL_PHASES, STATUS } from "../data/phases";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

async function loadDataFile(filename) {
  try {
    if (IS_TAURI) {
      return await invoke("load_data_file", { filename });
    } else {
      const res = await fetch(`/api/load-data-file?filename=${filename}`);
      const data = await res.json();
      return data.content;
    }
  } catch (e) {
    console.error("loadDataFile failed", e);
    return null;
  }
}

const FONT = "'Inter', 'Segoe UI', sans-serif";

export default function RoadmapPage() {
  const [phases, setPhases] = useState(INITIAL_PHASES);

  useEffect(() => {
    loadDataFile("phases.json").then(raw => {
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        if (data.phases) setPhases(data.phases);
      } catch(e) { console.error("phases parse error", e); }
    });
  }, []);

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

          {phases.map((phase, i) => {
            const s = STATUS[phase.status];
            const isDone     = phase.status === "done";
            const isUpcoming = phase.status === "upcoming";

            return (
              <div key={phase.number} style={{ display: "flex", gap: 24, marginBottom: i < phases.length - 1 ? 32 : 0, position: "relative" }}>

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
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
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
                    {(phase.status === "upcoming" || phase.status === "next") && phase.eta && (
                      <span style={{
                        marginLeft: "auto",
                        fontSize: 11, fontWeight: 800,
                        color: phase.status === "next" ? "#fb923c" : "#e8c547",
                        letterSpacing: "1.5px", textTransform: "uppercase",
                        fontFamily: "'DM Mono', 'Courier New', monospace",
                        textShadow: phase.status === "next" ? "0 0 12px #fb923c66" : "0 0 12px #e8c54766",
                      }}>
                        ⚡ {(() => {
                          if (/^\d{4}-\d{2}-\d{2}$/.test(phase.eta)) {
                            const d = new Date(phase.eta + "T23:59:00");
                            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                          }
                          return phase.eta;
                        })()}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: isUpcoming ? "#4a5060" : "#d4d8e0", marginBottom: 6 }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#5a6070", lineHeight: 1.6 }}>
                    {phase.summary}
                  </div>
                  {phase.steps && (
                    <ol style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                      {phase.steps.map((step, si) => (
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