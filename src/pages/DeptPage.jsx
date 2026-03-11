import { useState } from "react";
import { getDept, courseContentCount, LANG_REFS } from "../data/subjects";
import { useIsMobile } from "../hooks/useIsMobile";

const FONT = "'Inter', 'Segoe UI', sans-serif";

const BUCKET_ICONS = {
  notes: "≡", references: "⊞", assignments: "✎", code: "⌥", pdfs: "⎘", flashcards: "⟁",
};

const MATH_SHARED_REFS = [
  { label: "Math & Science Ref",     file: "math_science_ref.html" },
  { label: "Math Notation",          file: "mathnotation_enhanced.html" },
  { label: "Discrete Math",          file: "discrete-math-guide.html" },
  { label: "Discrete Math (alt)",    file: "discrete-math-guide (1).html" },
  { label: "Precalculus",            file: "precalculus-guide.html" },
  { label: "Calculus I",             file: "calculus1-guide.html" },
  { label: "Calculus II",            file: "calculus2-guide.html" },
  { label: "Linear Algebra",         file: "linear-algebra-guide.html" },
  { label: "Linear Algebra (alt)",   file: "linear-algebra-guide (1).html" },
  { label: "Statistics",             file: "statistics-guide.html" },
];

export default function DeptPage({ deptId, goTo }) {
  const dept = getDept(deptId);
  if (!dept) return null;

  const [view, setView]           = useState("courses");
  const [activeRef, setActiveRef] = useState(null);
  const isMobile = useIsMobile();
  const isMath = deptId === "math";

  // ── Lang+ panel ───────────────────────────────────────────────────
  if (view === "langs") {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", height: 52, flexShrink: 0, borderBottom: "1px solid #2a2e38", background: "#161920" }}>
          <button onClick={() => { setView("courses"); setActiveRef(null); }}
            style={{ background: "none", border: "none", color: "#7a8090", fontSize: 18, cursor: "pointer", padding: "0 4px", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}>←</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e8c547" }}>❰❱ Lang+</span>
          <span style={{ color: "#4a5060", fontSize: 12 }}>language references</span>
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 200, flexShrink: 0, borderRight: "1px solid #2a2e38", overflowY: "auto", padding: "10px 0", background: "#161920" }}>
            {LANG_REFS.map((lang, i) => {
              const isActive = activeRef === lang.file;
              return (
                <button key={i} onClick={() => setActiveRef(lang.file)} style={{
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
          {activeRef ? (
            <iframe key={activeRef} src={`/references/${activeRef}`} style={{ flex: 1, border: "none", background: "#fff" }} title={activeRef} />
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontSize: 14, fontWeight: 500 }}>
              select a language
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MATH layout ───────────────────────────────────────────────────
  if (isMath) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ padding: "28px 52px 20px", borderBottom: "1px solid #2a2e38", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#7a8090", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>department</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: dept.color }}>{dept.label}</h1>
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid #2a2e38", overflowY: "auto", background: "#161920" }}>
            <div style={{ padding: "14px 16px 6px", fontSize: 10, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>References</div>
            {MATH_SHARED_REFS.map((r, i) => {
              const isActive = activeRef === r.file;
              return (
                <button key={i} onClick={() => setActiveRef(r.file)} style={{
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
            {dept.courses.map(course => {
              const empty = courseContentCount(course) === 0;
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
          {activeRef ? (
            <iframe src={`/references/${activeRef}`} style={{ flex: 1, border: "none", background: "#fff" }} title={activeRef} />
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontSize: 14, fontWeight: 500 }}>
              select a reference or course
            </div>
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
          {dept.courses.map(course => {
            const count = courseContentCount(course);
            const empty = count === 0;
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