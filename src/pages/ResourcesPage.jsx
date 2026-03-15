// src/pages/ResourcesPage.jsx
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import INITIAL_DATA from "../data/resources.json";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

async function loadResources() {
  try {
    if (IS_TAURI) {
      const raw = await invoke("load_data_file", { filename: "resources.json" });
      return JSON.parse(raw).RESOURCES;
    } else {
      const res = await fetch("/api/load-data-file?filename=resources.json");
      const data = await res.json();
      return JSON.parse(data.content).RESOURCES;
    }
  } catch (e) { return null; }
}

export default function ResourcesPage() {
  const [resources, setResources] = useState(INITIAL_DATA.RESOURCES);
  const [active, setActive]       = useState(null);

  useEffect(() => {
    loadResources().then(r => { if (r) setResources(r); });
  }, []);

  if (active) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f1117" }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 20px", borderBottom: "1px solid #2a2e38",
          background: "#15181f", flexShrink: 0,
        }}>
          <button onClick={() => setActive(null)} style={{
            background: "transparent", border: "1px solid #2a2e38",
            borderRadius: 7, color: "#7a8090", cursor: "pointer",
            fontFamily: FONT, fontSize: 12, fontWeight: 600,
            padding: "6px 14px",
          }}>
            ← Back
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: active.color, fontFamily: FONT }}>
            {active.icon} {active.title}
          </span>
        </div>
        {/* HTML viewer */}
        <iframe
          src={active.file}
          style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
          title={active.title}
        />
      </div>
    );
  }

  return (
    <div style={{
      height: "100%", overflowY: "auto",
      background: "#0f1117", fontFamily: FONT,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 640, width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: "#4a5060",
            letterSpacing: "3px", textTransform: "uppercase", marginBottom: 12,
          }}>
            Coogs Hub · Resources
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 700, color: "#e2e8f0",
            margin: "0 0 12px", letterSpacing: "-0.5px",
          }}>
            Pick your reason for being here.
          </h1>
          <p style={{ fontSize: 14, color: "#4a5060", margin: 0, lineHeight: 1.6 }}>
            Beta — more guides coming.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {resources.map(r => (
            <button
              key={r.id}
              onClick={() => setActive(r)}
              style={{
                background: "#161920",
                border: `1px solid ${r.color}33`,
                borderLeft: `4px solid ${r.color}`,
                borderRadius: "0 12px 12px 0",
                padding: "20px 24px",
                cursor: "pointer", textAlign: "left",
                fontFamily: FONT, width: "100%",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1e2230"; e.currentTarget.style.borderColor = r.color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#161920"; e.currentTarget.style.borderColor = r.color + "33"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 16, color: r.color, fontFamily: MONO }}>{r.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#d4d8e0" }}>{r.title}</span>
                <span style={{
                  fontSize: 10, color: r.color, fontFamily: MONO,
                  background: r.color + "18", border: `1px solid ${r.color}33`,
                  borderRadius: 4, padding: "2px 8px", marginLeft: "auto",
                }}>
                  {r.subtitle}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#5a6070", paddingLeft: 28 }}>
                {r.situation}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
