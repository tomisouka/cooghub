import { useState, useEffect, useRef } from "react";
import { getDept, courseContentCount, LANG_REFS, MATH_SHARED_REFS } from "../data/subjects";
import { BUCKET_ICONS } from "../data/uiConfig";
import { useIsMobile } from "../hooks/useIsMobile";
import ReferenceViewer from "../components/ReferenceViewer";

const FONT = "'Inter', 'Segoe UI', sans-serif";

function PrevNextBar({ items, activeFile, onSelect, onBack }) {
  if (!items || items.length <= 1) return null;
  const idx = items.findIndex(r => r.file === activeFile);
  if (idx === -1) return null;
  const hasPrev = idx > 0;
  const hasNext = idx < items.length - 1;
  const btn = (enabled, onClick, label) => (
    <button onClick={() => enabled && onClick()} disabled={!enabled}
      style={{ background: "none", border: "none", cursor: enabled ? "pointer" : "default",
        color: enabled ? "#7a8090" : "#2a2e38", fontSize: 13, fontFamily: FONT, padding: "0 4px" }}
      onMouseEnter={e => { if (enabled) e.currentTarget.style.color = "#d4d8e0"; }}
      onMouseLeave={e => { if (enabled) e.currentTarget.style.color = "#7a8090"; }}
    >{label}</button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8,
      padding: "5px 14px", background: "#161920",
      borderBottom: "1px solid #2a2e38", flexShrink: 0 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
          color: "#7a8090", fontSize: 13, fontFamily: FONT, padding: "0 4px", marginRight: 4 }}
          onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
          onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}
        >✕</button>
      )}
      {btn(hasPrev, () => onSelect(items[idx - 1].file), "← prev")}
      <span style={{ color: "#4a5060", fontSize: 11, fontFamily: FONT, fontWeight: 500 }}>
        {idx + 1} / {items.length}
      </span>
      <span style={{ color: "#7a8090", fontSize: 11, fontFamily: FONT, fontWeight: 500,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
        {items[idx]?.label}
      </span>
      {btn(hasNext, () => onSelect(items[idx + 1].file), "next →")}
    </div>
  );
}

// BUCKET_ICONS imported from data/uiConfig.js


export default function DeptPage({ deptId, goTo, dest }) {
  const dept = getDept(deptId);
  if (!dept) return null;

  const [view, setView]           = useState("courses");
  const [activeRef, setActiveRef] = useState(null);
  const [showRefContent, setShowRefContent] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const prevDestRef = useRef(null);

  // Auto-open ref panel when navigating from a search result
  useEffect(() => {
    if (!dest || !dest.file) return;
    if (dest.tab !== "langref" && dest.tab !== "mathref") return;
    const key = `${dest.tab}::${dest.file}::${dest._ts}`;
    if (key === prevDestRef.current) return;
    prevDestRef.current = key;
    if (dest.tab === "langref") setView("langs");
    setActiveRef(dest.file);
    setShowRefContent(true);
  }, [dest]);
  const isMobile = useIsMobile();
  const isMath = deptId === "math";

  // ── Lang+ panel ───────────────────────────────────────────────────
  if (view === "langs") {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 52, flexShrink: 0, borderBottom: "1px solid #2a2e38", background: "#161920" }}>
          <button onClick={() => { if (isMobile && showRefContent) { setShowRefContent(false); } else { setView("courses"); setActiveRef(null); setShowRefContent(false); } }}
            style={{ background: "none", border: "none", color: "#7a8090", fontSize: 18, cursor: "pointer", padding: "0 4px", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}>←</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e8c547" }}>❰❱ Lang+</span>
          {(!isMobile || !showRefContent) && <span style={{ color: "#4a5060", fontSize: 12 }}>language references</span>}
          {isMobile && showRefContent && activeRef && (
            <span style={{ color: "#7a8090", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {LANG_REFS.find(l => l.file === activeRef)?.label}
            </span>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {(!isMobile || !showRefContent) && (
          <div style={{ width: isMobile ? "100%" : 200, flexShrink: 0, borderRight: isMobile ? "none" : "1px solid #2a2e38", overflowY: "auto", padding: "10px 0", background: "#161920" }}>
            {LANG_REFS.map((lang, i) => {
              const isActive = activeRef === lang.file;
              return (
                <button key={i} onClick={() => { setActiveRef(lang.file); if (isMobile) setShowRefContent(true); }} style={{
                  width: "100%", padding: "10px 16px", background: isActive ? "#21252e" : "transparent",
                  border: "none", borderLeft: `2px solid ${isActive ? lang.color : "transparent"}`,
                  color: isActive ? "#d4d8e0" : "#8a90a0",
                  fontSize: 13, fontFamily: FONT, fontWeight: isActive ? 600 : 500,
                  cursor: "pointer", textAlign: "left", transition: "all 0.1s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#b0b8c8"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#8a90a0"; }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: lang.color, flexShrink: 0 }} />
                  {lang.label}
                </button>
              );
            })}
          </div>
          )}
          {(!isMobile || showRefContent) && (
            activeRef ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <PrevNextBar items={LANG_REFS} activeFile={activeRef} onSelect={f => { setActiveRef(f); }} />
                <ReferenceViewer
                  key={activeRef}
                  file={activeRef}
                  color={LANG_REFS.find(l => l.file === activeRef)?.color || "#e8c547"}
                  highlight={dest?.query || null}
                  highlightKey={dest?._ts || null}
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontSize: 14, fontWeight: 500 }}>
                select a language
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ── MATH layout ───────────────────────────────────────────────────
  if (isMath) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ padding: isMobile ? "14px 16px 12px" : "28px 52px 20px", borderBottom: "1px solid #2a2e38", flexShrink: 0,
          display: "flex", alignItems: "center", gap: isMobile && showRefContent ? 12 : 0 }}>
          {isMobile && showRefContent && (
            <button onClick={() => { setShowRefContent(false); setActiveRef(null); }}
              style={{ background: "none", border: "none", color: "#7a8090", fontSize: 18, cursor: "pointer", padding: "0 4px", flexShrink: 0 }}>←</button>
          )}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7a8090", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>department</div>
            <h1 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 700, color: dept.color }}>{dept.label}</h1>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {(!isMobile || !showRefContent) && (
          <div style={{ width: isMobile ? "100%" : (sidebarCollapsed ? 0 : 260), flexShrink: 0, borderRight: isMobile ? "none" : "1px solid #2a2e38", overflowY: "auto", background: "#161920", overflow: "hidden", transition: "width 0.2s ease" }}>
            <div style={{ padding: "14px 16px 6px", fontSize: 10, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>References</div>
            {MATH_SHARED_REFS.map((r, i) => {
              const isActive = activeRef === r.file;
              return (
                <button key={i} onClick={() => { setActiveRef(r.file); if (isMobile) setShowRefContent(true); }} style={{
                  width: "100%", padding: "9px 16px", background: isActive ? "#21252e" : "transparent",
                  border: "none", borderLeft: `2px solid ${isActive ? dept.color : "transparent"}`,
                  color: isActive ? "#d4d8e0" : "#8a90a0",
                  fontSize: 13, fontFamily: FONT, fontWeight: isActive ? 600 : 500,
                  cursor: "pointer", textAlign: "left", transition: "all 0.1s",
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#b0b8c8"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#8a90a0"; }}
                >{r.label}</button>
              );
            })}
            <div style={{ margin: "12px 16px", borderTop: "1px solid #2a2e38" }} />
            <div style={{ padding: "6px 16px 6px", fontSize: 10, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>Courses</div>
            {dept.courses.filter(course => !course.hubParent).map(course => {
              const empty = !course.isHub && courseContentCount(course) === 0;
              return (
                <button key={course.id} onClick={() => !empty && goTo(deptId, course.id)}
                  style={{
                    width: "100%", padding: "9px 16px", background: "transparent",
                    border: "none", borderLeft: "2px solid transparent",
                    color: empty ? "#3a4052" : "#8a90a0",
                    fontSize: 13, fontFamily: FONT, fontWeight: 500,
                    cursor: empty ? "default" : "pointer", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.1s",
                  }}
                  onMouseEnter={e => { if (!empty) { e.currentTarget.style.color = "#b0b8c8"; e.currentTarget.style.borderLeftColor = course.color; } }}
                  onMouseLeave={e => { e.currentTarget.style.color = empty ? "#3a4052" : "#8a90a0"; e.currentTarget.style.borderLeftColor = "transparent"; }}
                >
                  <span style={{ fontSize: 14 }}>{course.icon}</span>
                  {course.label}
                  {empty && <span style={{ marginLeft: "auto", fontSize: 10, color: "#2a2e38" }}>empty</span>}
                </button>
              );
            })}
          </div>
          )}
          {(!isMobile || showRefContent) && (
            activeRef ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "stretch", flexShrink: 0 }}>
                  {!isMobile && (
                    <button onClick={() => setSidebarCollapsed(c => !c)}
                      title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                      style={{ background: "#161920", border: "none", borderBottom: "1px solid #2a2e38", borderRight: "1px solid #2a2e38", color: "#4a5060", cursor: "pointer", padding: "0 10px", fontSize: 12, flexShrink: 0, transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
                      onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
                    >{sidebarCollapsed ? "▶" : "◀"}</button>
                  )}
                  <PrevNextBar items={MATH_SHARED_REFS} activeFile={activeRef} onSelect={f => { setActiveRef(f); }} onBack={() => { setActiveRef(null); setShowRefContent(false); }} />
                </div>
                <ReferenceViewer
                  key={activeRef}
                  file={activeRef}
                  color={dept.color}
                  highlight={dest?.query || null}
                  highlightKey={dest?._ts || null}
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {!isMobile && sidebarCollapsed && (
                  <button onClick={() => setSidebarCollapsed(false)}
                    style={{ alignSelf: "flex-start", background: "#161920", border: "none", borderBottom: "1px solid #2a2e38", borderRight: "1px solid #2a2e38", color: "#4a5060", cursor: "pointer", padding: "8px 10px", fontSize: 12, flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
                  >▶</button>
                )}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontSize: 14, fontWeight: 500 }}>
                  select a reference or course
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // ── COSC: course grid + Lang+ card ────────────────────────────────
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <div style={{ padding: isMobile ? "16px 16px 12px" : "28px 52px 20px", borderBottom: "1px solid #2a2e38", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#7a8090", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>department</div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: dept.color }}>{dept.label}</h1>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px 80px" : "28px 52px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: isMobile ? 10 : 14 }}>

          {/* Course cards */}
          {dept.courses.filter(course => !course.hubParent).map(course => {
            const count = courseContentCount(course);
            const empty = !course.isHub && count === 0;
            const activeBuckets = [
              course.notes?.length       > 0 ? "notes"       : null,
              course.references?.length  > 0 ? "references"  : null,
              course.assignments?.length > 0 ? "assignments" : null,
              course.code?.length        > 0 ? "code"        : null,
              course.pdfs?.length        > 0 ? "pdfs"        : null,
              course.flashcards              ? "flashcards"  : null,
            ].filter(Boolean);

            return (
              <button key={course.id} onClick={() => !empty && goTo(deptId, course.id)}
                style={{
                  background: "#1a1d24", border: `1px solid ${empty ? "#1e2128" : "#2a2e38"}`,
                  borderRadius: 12, padding: isMobile ? "14px 12px" : "20px 18px",
                  cursor: empty ? "default" : "pointer", textAlign: "left",
                  opacity: empty ? 0.35 : 1, transition: "border-color 0.15s, background 0.15s", fontFamily: FONT,
                }}
                onMouseEnter={e => { if (!empty) { e.currentTarget.style.borderColor = course.color; e.currentTarget.style.background = "#21252e"; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = empty ? "#1e2128" : "#2a2e38"; e.currentTarget.style.background = "#1a1d24"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "#21252e", borderRadius: 8, border: "1px solid #2a2e38" }}>
                    {course.icon}
                  </span>
                  <div>
                    <div style={{ color: "#d4d8e0", fontSize: 14, fontWeight: 600 }}>{course.label}</div>
                    {course.courseCode && <div style={{ color: "#7a8090", fontSize: 11, fontWeight: 500, marginTop: 2 }}>{course.courseCode}</div>}
                  </div>
                </div>
                {activeBuckets.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {activeBuckets.map(b => (
                      <span key={b} style={{ fontSize: 10, fontWeight: 600, color: course.color, fontFamily: FONT, background: "#111318", border: `1px solid ${course.color}33`, borderRadius: 4, padding: "2px 7px" }}>
                        {BUCKET_ICONS[b]} {b}
                      </span>
                    ))}
                  </div>
                ) : course.isHub ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {course.lanes.map(lane => (
                      <span key={lane.id} style={{ fontSize: 10, fontWeight: 600, color: lane.color, fontFamily: FONT, background: "#111318", border: `1px solid ${lane.color}33`, borderRadius: 4, padding: "2px 7px" }}>
                        {lane.icon} {lane.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#4a5060" }}>no content yet</div>
                )}
              </button>
            );
          })}

          {/* Lang+ card */}
          <button onClick={() => setView("langs")}
            style={{
              background: "#1a1d24", border: "1px solid #2a2e38",
              borderRadius: 12, padding: "20px 18px",
              cursor: "pointer", textAlign: "left",
              transition: "border-color 0.15s, background 0.15s", fontFamily: FONT,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.background = "#21252e"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.background = "#1a1d24"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "#21252e", borderRadius: 8, border: "1px solid #2a2e38", color: "#e8c547" }}>
                ❰❱
              </span>
              <div>
                <div style={{ color: "#e8c547", fontSize: 14, fontWeight: 700 }}>Lang+</div>
                <div style={{ color: "#7a8090", fontSize: 11, fontWeight: 500, marginTop: 2 }}>language references</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {LANG_REFS.slice(0, 6).map(l => (
                <span key={l.label} style={{ fontSize: 10, fontWeight: 600, color: l.color, background: "#111318", border: `1px solid ${l.color}33`, borderRadius: 4, padding: "2px 7px" }}>
                  {l.label}
                </span>
              ))}
              <span style={{ fontSize: 10, fontWeight: 600, color: "#4a5060", background: "#111318", border: "1px solid #2a2e3833", borderRadius: 4, padding: "2px 7px" }}>
                +{LANG_REFS.length - 6} more
              </span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}