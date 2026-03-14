import React from "react";

export default function OsHubPage({ hubData, onSelectLane, onBack }) {
  const lanes = hubData?.lanes ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0f1117" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 14px", borderBottom: "1px solid #1e2130" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer", padding: "2px 6px", lineHeight: 1 }}
        >
          ←
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
          {hubData?.icon} {hubData?.label}
        </span>
        <span style={{ fontSize: 13, color: "#555", marginLeft: 4 }}>{hubData?.courseCode}</span>
      </div>

      {/* Lane cards */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 20, padding: "32px 24px",
      }}>
        {lanes.map((lane) => (
          <button
            key={lane.id}
            onClick={() => onSelectLane(lane.id)}
            style={{
              width: "100%", maxWidth: 480,
              background: "#161b27", border: `2px solid ${lane.color}22`,
              borderRadius: 14, padding: "28px 28px",
              cursor: "pointer", textAlign: "left",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = lane.color + "88"; e.currentTarget.style.background = "#1a2035"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = lane.color + "22"; e.currentTarget.style.background = "#161b27"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 26 }}>{lane.icon}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: lane.color }}>{lane.title}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#8892a4", lineHeight: 1.6 }}>{lane.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}