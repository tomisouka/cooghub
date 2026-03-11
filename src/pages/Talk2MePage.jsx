import { useState } from "react";
import { TALK2ME } from "../data/talk2me";
import MarkdownViewer from "../components/MarkdownViewer";

const FONT = "'Inter', 'Segoe UI', sans-serif";

export default function Talk2MePage() {
  const [section,    setSection]    = useState(TALK2ME[0].id);
  const [activeFile, setActiveFile] = useState(null);
  const [filter,     setFilter]     = useState("");

  const sec = TALK2ME.find(s => s.id === section);
  const q   = filter.trim().toLowerCase();
  const visibleFiles = q
    ? sec.files.filter(f => f.label.toLowerCase().includes(q))
    : sec.files;

  function switchSection(id) {
    setSection(id);
    setActiveFile(null);
    setFilter("");
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: FONT }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "0 20px", height: 54, flexShrink: 0,
        borderBottom: "1px solid #23262f",
        background: "#15181f",
        overflowX: "auto",
      }}>
        <span style={{
          color: "#55607a", fontSize: 10, fontWeight: 700,
          letterSpacing: "2.5px", textTransform: "uppercase",
          marginRight: 16, whiteSpace: "nowrap", flexShrink: 0,
        }}>
          Talk2Me
        </span>

        {TALK2ME.map(s => {
          const isActive = section === s.id;
          return (
            <button key={s.id} onClick={() => switchSection(s.id)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", border: "none", borderRadius: 7,
              background: isActive ? "#1e2230" : "transparent",
              color: isActive ? s.color : "#6a7080",
              fontSize: 12, fontWeight: isActive ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: FONT, transition: "all 0.15s",
              borderBottom: isActive ? `2px solid ${s.color}` : "2px solid transparent",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#a8b0c0"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#6a7080"; }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span>{s.label}</span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: isActive ? s.color : "#3a4052",
                background: isActive ? `${s.color}18` : "#1e2230",
                border: `1px solid ${isActive ? s.color + "40" : "#2a2e38"}`,
                borderRadius: 10, padding: "1px 6px", marginLeft: 2,
              }}>
                {s.files.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* File sidebar */}
        <div style={{
          width: 248, flexShrink: 0,
          borderRight: "1px solid #23262f",
          display: "flex", flexDirection: "column",
          background: "#15181f",
        }}>
          {/* Filter input */}
          <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid #1e2230", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#1e2230", border: "1px solid #2a2e38",
              borderRadius: 7, padding: "5px 10px",
            }}>
              <span style={{ color: "#3a4052", fontSize: 12 }}>⌕</span>
              <input
                type="text"
                placeholder="filter files…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#c0c6d4", fontSize: 12, fontFamily: FONT, fontWeight: 500,
                }}
              />
              {filter && (
                <button onClick={() => setFilter("")} style={{
                  background: "none", border: "none", color: "#3a4052",
                  cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1,
                }}>×</button>
              )}
            </div>
          </div>

          {/* Section label */}
          <div style={{
            padding: "10px 16px 4px",
            fontSize: 9, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: sec.color,
          }}>
            {sec.label}
          </div>

          {/* File list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "2px 0 8px" }}>
            {visibleFiles.length === 0 ? (
              <div style={{ padding: "18px 16px", color: "#3a4052", fontSize: 12, fontStyle: "italic" }}>
                no matches
              </div>
            ) : visibleFiles.map((f, i) => {
              const isActive = activeFile === f.file;
              const isTxt = f.file?.endsWith(".txt");
              return (
                <button key={i} onClick={() => setActiveFile(f.file)} style={{
                  width: "100%", padding: "9px 16px",
                  background: isActive ? "#1e2230" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${isActive ? sec.color : "transparent"}`,
                  color: isActive ? "#d4d8e8" : "#7a8090",
                  fontSize: 13, fontFamily: FONT, fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", textAlign: "left", transition: "all 0.1s",
                  display: "flex", alignItems: "flex-start", gap: 8,
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#a8b0c0"; e.currentTarget.style.background = "#1a1d24"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#7a8090"; e.currentTarget.style.background = "transparent"; } }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 700, fontFamily: "'Courier New', monospace",
                    color: isActive ? sec.color : "#3a4052",
                    background: isActive ? `${sec.color}18` : "#1e2230",
                    border: `1px solid ${isActive ? sec.color + "40" : "#2a2e38"}`,
                    borderRadius: 3, padding: "2px 5px",
                    marginTop: 1, flexShrink: 0, letterSpacing: "0.5px",
                  }}>
                    {isTxt ? "txt" : "md"}
                  </span>
                  <span style={{ lineHeight: 1.45 }}>{f.label}</span>
                </button>
              );
            })}
          </div>

          {filter && visibleFiles.length > 0 && (
            <div style={{
              padding: "6px 16px 8px", borderTop: "1px solid #1e2230",
              fontSize: 10, color: "#3a4052", fontFamily: FONT,
            }}>
              {visibleFiles.length} of {sec.files.length} files
            </div>
          )}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", background: "#111318" }}>
          {activeFile ? (
            <MarkdownViewer filePath={activeFile} color={sec.color} />
          ) : (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 14, padding: 32,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: `${sec.color}12`, border: `1px solid ${sec.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
              }}>
                {sec.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#5a6070", marginBottom: 6 }}>
                  {sec.label}
                </div>
                <div style={{ fontSize: 12, color: "#3a4052" }}>
                  {sec.files.length} {sec.files.length === 1 ? "file" : "files"} — select one from the sidebar
                </div>
              </div>
              {sec.files.length > 0 && (
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 8,
                  justifyContent: "center", maxWidth: 400, marginTop: 4,
                }}>
                  {sec.files.slice(0, 5).map((f, i) => (
                    <button key={i} onClick={() => setActiveFile(f.file)} style={{
                      padding: "5px 12px", borderRadius: 6,
                      background: "#1a1d24", border: "1px solid #2a2e38",
                      color: "#6a7080", fontSize: 11, fontFamily: FONT, fontWeight: 500,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = sec.color; e.currentTarget.style.color = sec.color; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#6a7080"; }}
                    >
                      {f.label}
                    </button>
                  ))}
                  {sec.files.length > 5 && (
                    <span style={{ fontSize: 11, color: "#3a4052", padding: "5px 4px" }}>
                      +{sec.files.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}