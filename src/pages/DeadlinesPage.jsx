import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DEADLINES as INITIAL_DEADLINES } from "../data/memory-deadlines";
import { COURSES, SKILL_TREE, ALL_SKILLS, TOTAL_SKILLS, MAX_LEVEL, MAX_XP, DIFF_LABELS, LEVEL_META, SKILLS_BY_COURSE, DEFAULT_TIERS } from "../data/skills";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

function serializeToJS(deadlines) {
  return `// src/data/memory-deadlines.js
// Runtime persistence for deadlines — auto-saved by DeadlinesPage on every change.
// Do not edit manually while the app is open.
// Last updated: ${new Date().toISOString()}

export const DEADLINES = ${JSON.stringify(deadlines, null, 2)};
`;
}

async function persistToFile(deadlines) {
  try {
    const content = serializeToJS(deadlines);
    console.log("[persist] IS_TAURI:", IS_TAURI, "count:", deadlines.length);
    if (IS_TAURI) {
      await invoke("save_deadlines", { content });
      console.log("[persist] saved via invoke");
    } else {
      await fetch("/api/save-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      console.log("[persist] saved via fetch");
    }
  } catch (e) {
    console.error("[persist] FAILED:", e);
  }
}

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

function getDaysUntil(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr + "T00:00:00") - now) / 86400000);
}
function urgencyTier(d) {
  if (d < 0)   return { color: "#ff4444", label: "OVERDUE",          bold: true };
  if (d === 0) return { color: "#ff6b9d", label: "TODAY",            bold: true };
  if (d <= 1)  return { color: "#ff4444", label: "DUE NOW",           bold: true };
  if (d <= 2)  return { color: "#ff4444", label: `DUE IN ${d}D`,     bold: true };
  if (d <= 7)  return { color: "#fb923c", label: "DUE SOON",         bold: true };
  if (d <= 14) return { color: "#7eb8f7", label: "AROUND THE CORNER",bold: false };
  return              { color: "#4ecdc4", label: "COMING UP",         bold: false };
}
function urgencyLabel(d) {
  if (d < 0)   return "OVERDUE";
  if (d === 0) return "TODAY";
  return urgencyTier(d).label;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── Level up modal ────────────────────────────────────────────────────────────
function LevelUpModal({ skill, currentLevel, targetLevel, onConfirm, onCancel }) {
  const [note, setNote] = useState("");
  const from = LEVEL_META[currentLevel];
  const to   = LEVEL_META[targetLevel];
  const isDown = targetLevel < currentLevel;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 14, padding: 24, maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>{isDown ? "Step back" : "Level up"}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{skill.label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 12, color: from.color, fontFamily: MONO, background: from.bg, padding: "3px 10px", borderRadius: 6 }}>{from.label}</span>
          <span style={{ fontSize: 14, color: "#4a5060" }}>→</span>
          <span style={{ fontSize: 12, color: to.color, fontFamily: MONO, background: to.bg, padding: "3px 10px", borderRadius: 6 }}>{to.label}</span>
        </div>
        <div style={{ fontSize: 12, color: "#7a8090", marginBottom: 8 }}>
          {isDown ? "What made you realize you need more work?" : "What makes you confident in this level up?"}
        </div>
        <textarea autoFocus value={note} onChange={e => setNote(e.target.value)}
          placeholder={isDown ? "e.g. Tried a problem and got stuck..." : "e.g. Implemented from scratch, passed all test cases..."}
          style={{ width: "100%", minHeight: 90, background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, color: "#d4d8e0", fontFamily: FONT, fontSize: 13, padding: "10px 12px", resize: "vertical", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => onConfirm(note)} disabled={!note.trim()} style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: note.trim() ? "pointer" : "not-allowed",
            background: note.trim() ? to.color : "#2a2e38", color: note.trim() ? "#0f1117" : "#4a5060",
            fontFamily: FONT, fontSize: 12, fontWeight: 700,
          }}>Confirm</button>
          <button onClick={onCancel} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>Cancel</button>
        </div>
        <div style={{ fontSize: 11, color: "#3a4052", marginTop: 8, textAlign: "center" }}>Note required to change level</div>
      </div>
    </div>
  );
}

export default function DeadlinesPage() {
  const [deadlines,   setDeadlines]   = useState(INITIAL_DEADLINES);
  const [view,        setView]        = useState("month");
  const [tab,         setTab]         = useState("school");
  const [showAdd,     setShowAdd]     = useState(false);
  const [today]                       = useState(new Date());
  const [calDate,     setCalDate]     = useState(new Date());
  const [form, setForm] = useState({ title: "", course: "", date: "", time: "", notes: "", type: "school", priority: "normal" });

  const isFirstRender = useRef(true);

  // On mount in Tauri, load from disk instead of bundled static import
  useEffect(() => {
    if (!IS_TAURI) return;
    invoke("load_memory").then(raw => {
      try {
        const dl = raw.match(/export const DEADLINES = (\[\s\S]*?\]);/)?.[1];
        if (dl) setDeadlines(JSON.parse(dl));
      } catch(e) { console.error("Failed to parse memory.js", e); }
    }).catch(e => console.error("load_memory failed", e));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    persistToFile(deadlines);
  }, [deadlines]);

  function openAddWithDate(y, m, d) {
    const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    setForm(f => ({ ...f, date: dateStr, type: tab }));
    setShowAdd(true);
  }

  function addDeadline() {
    if (!form.title || !form.date) return;
    setDeadlines(prev => [...prev, { ...form, id: Date.now().toString(), done: false }].sort((a,b) => a.date.localeCompare(b.date)));
    setForm({ title: "", course: "", date: "", time: "", notes: "", type: tab, priority: "normal" });
    setShowAdd(false);
  }

  const [celebrating, setCelebrating] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [subtaskModal, setSubtaskModal] = useState(null); // { id, phase: "count"|"name", count, steps }
  const [reflectModal, setReflectModal] = useState(null); // { id }
  const [reflectInput, setReflectInput] = useState("");

  function cycleStatus(id) {
    const dl = deadlines.find(d => d.id === id);
    if (!dl) return;
    if (dl.done) {
      setConfirmStatus({ id, nextStatus: "none", label: "Unmark as done?" });
    } else if (dl.status === "inprogress") {
      if (dl.subtasks?.length > 0 && !dl.subtasks.every(s => s.done)) {
        const nextIdx = dl.subtasks.findIndex(s => !s.done);
        const updated = dl.subtasks.map((s, i) => i === nextIdx ? { ...s, done: true } : s);
        setDeadlines(p => p.map(d => d.id === id ? { ...d, subtasks: updated } : d));
        if (updated.every(s => s.done)) {
          setTimeout(() => { setReflectModal({ id }); setReflectInput(""); }, 150);
        }
        return;
      }
      setConfirmStatus({ id, nextStatus: "done", label: "Mark as completed?" });
    } else {
      setConfirmStatus({ id, nextStatus: "inprogress", label: "Mark as started?" });
    }
  }

  function applyStatus() {
    if (!confirmStatus) return;
    const { id, nextStatus } = confirmStatus;
    setConfirmStatus(null);
    if (nextStatus === "none") {
      setDeadlines(prev => prev.map(d => d.id === id ? { ...d, done: false, status: "none", completedAt: undefined } : d));
    } else if (nextStatus === "done") {
      setDeadlines(prev => prev.map(d => d.id === id ? { ...d, done: true, status: "done", completedAt: new Date().toISOString().slice(0,10) } : d));
      setReflectModal({ id });
      setReflectInput("");
    } else if (nextStatus === "inprogress") {
      setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: "inprogress", startedAt: d.startedAt || new Date().toISOString().slice(0,10) } : d));
      setSubtaskModal({ id, phase: "count", count: 1, steps: [] });
    }
  }

  const [expandedDl,  setExpandedDl]  = useState(null);
  const [delDlTarget, setDelDlTarget] = useState(null); // deadline id pending delete
  const [delDlStep,   setDelDlStep]   = useState("pw"); // "pw" | "confirm"
  const [delDlPw,     setDelDlPw]     = useState("");
  const [delDlErr,    setDelDlErr]    = useState(false);

  function startDelDl(id) { setDelDlTarget(id); setDelDlStep("pw"); setDelDlPw(""); setDelDlErr(false); }
  function cancelDelDl() { setDelDlTarget(null); setDelDlPw(""); setDelDlErr(false); }
  function submitDelDlPw() {
    if (delDlPw === "Jesiah") { setDelDlErr(false); setDelDlStep("confirm"); }
    else { setDelDlErr(true); setDelDlPw(""); }
  }
  function confirmDelDl() { setDeadlines(p => p.filter(d => d.id !== delDlTarget)); cancelDelDl(); }

  const doneToday = deadlines.filter(d => d.done && d.completedAt === new Date().toISOString().slice(0,10));

  // Derived state
  const isCompletedTab = tab === "completed";
  const done     = deadlines.filter(d => d.done);
  const filtered = deadlines.filter(d => !d.done && d.type === tab);
  const dueNow   = deadlines.filter(d => !d.done && getDaysUntil(d.date) <= 2);

  // Calendar helpers
  const calYear      = calDate.getFullYear();
  const calMonth     = calDate.getMonth();
  const firstDay     = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();

  // Week view: Sun–Sat of the current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Weekly load bar data
  const weekLoad = weekDays.map(d => {
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return {
      str,
      label: DAYS[d.getDay()],
      count: deadlines.filter(dl => dl.date === str && !dl.done).length,
    };
  });

  // ── Completion momentum (last 14 days) ────────────────────────────────────
  const momentumDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 13 + i);
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return {
      str,
      label: i === 13 ? "today" : i === 12 ? "yday" : null,
      count: deadlines.filter(dl => dl.done && dl.completedAt === str).length,
    };
  });

  // ── Daily focus: highest-urgency unstarted deadline ───────────────────────
  const focusPick = (() => {
    const candidates = deadlines.filter(d => !d.done && d.status !== "inprogress");
    if (candidates.length === 0) return null;
    return candidates.slice().sort((a, b) => {
      const da = getDaysUntil(a.date), db = getDaysUntil(b.date);
      const pa = a.priority === "high" ? -1 : a.priority === "low" ? 1 : 0;
      const pb = b.priority === "high" ? -1 : b.priority === "low" ? 1 : 0;
      return (da + pa * 2) - (db + pb * 2);
    })[0];
  })();

  const sect = (title, children, extra) => (
    <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>{title}</div>
        {extra}
      </div>
      {children}
    </div>
  );

  return (
    <>
      {subtaskModal && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}
          onClick={() => setSubtaskModal(null)}>
          <div style={{background:"#161920",border:"1px solid #7eb8f744",borderRadius:14,padding:"24px 28px",minWidth:320,maxWidth:440,display:"flex",flexDirection:"column",gap:16}}
            onClick={e => e.stopPropagation()}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#7eb8f7",fontFamily:FONT,marginBottom:4}}>
                {subtaskModal.phase === "count" ? "How many steps will this take?" : "Name each step"}
              </div>
              <div style={{fontSize:11,color:"#4a5060"}}>{deadlines.find(d=>d.id===subtaskModal.id)?.title}</div>
            </div>

            {subtaskModal.phase === "count" ? (
              <>
                <div style={{display:"flex",gap:8}}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setSubtaskModal(m => ({...m, count: n}))}
                      style={{flex:1,padding:"10px 0",borderRadius:8,border:`1px solid ${subtaskModal.count===n?"#7eb8f7":"#2a2e38"}`,
                        background:subtaskModal.count===n?"#7eb8f720":"transparent",
                        color:subtaskModal.count===n?"#7eb8f7":"#7a8090",fontFamily:MONO,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                      {n}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={() => setSubtaskModal(null)} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Skip</button>
                  <button onClick={() => setSubtaskModal(m => ({...m, phase:"name", steps: Array(m.count).fill("")}))}
                    style={{flex:1,padding:"8px 0",background:"#7eb8f720",border:"1px solid #7eb8f744",borderRadius:8,color:"#7eb8f7",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {subtaskModal.steps.map((step, i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO,width:16,textAlign:"right",flexShrink:0}}>{i+1}</span>
                      <input
                        autoFocus={i===0}
                        value={step}
                        onChange={e => setSubtaskModal(m => ({...m, steps: m.steps.map((s,j) => j===i ? e.target.value : s)}))}
                        onKeyDown={e => { if (e.key==="Enter" && i < subtaskModal.steps.length-1) { e.preventDefault(); document.querySelectorAll(".subtask-input")[i+1]?.focus(); }}}
                        className="subtask-input"
                        placeholder={`Step ${i+1}…`}
                        style={{...inputStyle,fontSize:12,padding:"6px 10px"}}
                      />
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={() => setSubtaskModal(m => ({...m, phase:"count"}))} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>← Back</button>
                  <button onClick={() => {
                    const steps = subtaskModal.steps.map((s,i) => ({id: `${subtaskModal.id}_step_${i}`, label: s||`Step ${i+1}`, done: false}));
                    setDeadlines(p=>p.map(d=>d.id===subtaskModal.id?{...d,subtasks:steps}:d));
                    setSubtaskModal(null);
                  }} style={{flex:1,padding:"8px 0",background:"#7eb8f720",border:"1px solid #7eb8f744",borderRadius:8,color:"#7eb8f7",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Save steps
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {reflectModal && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}
          onClick={() => setReflectModal(null)}>
          <div style={{background:"#161920",border:"1px solid #34d39944",borderRadius:14,padding:"24px 28px",minWidth:300,maxWidth:420,display:"flex",flexDirection:"column",gap:14}}
            onClick={e => e.stopPropagation()}>
            <div style={{fontSize:13,fontWeight:700,color:"#34d399",fontFamily:FONT}}>How did it go?</div>
            <div style={{fontSize:11,color:"#4a5060"}}>{deadlines.find(d=>d.id===reflectModal.id)?.title}</div>
            <textarea
              autoFocus
              value={reflectInput}
              onChange={e => setReflectInput(e.target.value)}
              placeholder="Optional — what worked, what didn't, what you'd do differently..."
              style={{...inputStyle,fontSize:12,resize:"vertical",minHeight:72}}
            />
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                const rid = reflectModal.id;
                setDeadlines(p=>p.map(d=>d.id===rid?{...d,
                  done:true, status:"done",
                  completedAt: d.completedAt || new Date().toISOString().slice(0,10)
                }:d));
                setReflectModal(null);
                setCelebrating(rid);
                setTimeout(() => setCelebrating(null), 2200);
              }} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Skip</button>
              <button onClick={()=>{
                const rid = reflectModal.id;
                setDeadlines(p=>p.map(d=>d.id===rid?{...d,
                  reflection:reflectInput,
                  done:true, status:"done",
                  completedAt: d.completedAt || new Date().toISOString().slice(0,10)
                }:d));
                setReflectModal(null);
                setCelebrating(rid);
                setTimeout(() => setCelebrating(null), 2200);
              }} style={{flex:1,padding:"8px 0",background:"#34d39920",border:"1px solid #34d39944",borderRadius:8,color:"#34d399",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
            </div>
          </div>
        </div>
      )}
      {confirmStatus && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}
          onClick={() => setConfirmStatus(null)}>
          <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:14,padding:"24px 28px",minWidth:260,display:"flex",flexDirection:"column",gap:16}}
            onClick={e => e.stopPropagation()}>
            <div style={{fontSize:13,fontWeight:700,color:"#d4d8e0",fontFamily:FONT}}>{confirmStatus.label}</div>
            <div style={{fontSize:11,color:"#4a5060",fontFamily:FONT}}>
              {deadlines.find(d=>d.id===confirmStatus.id)?.title}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={() => setConfirmStatus(null)} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>
                Cancel
              </button>
              <button onClick={applyStatus} style={{flex:1,padding:"8px 0",background:"#34d39920",border:"1px solid #34d39944",borderRadius:8,color:"#34d399",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {celebrating && (
        <div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{
            display:"flex",flexDirection:"column",alignItems:"center",gap:8,
            animation:"celebratePop 1.8s ease-out forwards",
          }}>
            <div style={{fontSize:28,fontWeight:800,color:"#34d399",fontFamily:MONO,letterSpacing:"2px"}}>✓ DONE</div>
            <div style={{fontSize:12,color:"#34d399",fontFamily:FONT,letterSpacing:"1px",fontWeight:600}}>YOU DID IT :))</div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes celebratePop { 0%{transform:scale(0.6) translateY(10px);opacity:0} 20%{transform:scale(1.1) translateY(-6px);opacity:1} 60%{transform:scale(1) translateY(0);opacity:1} 100%{transform:scale(0.95) translateY(-20px);opacity:0} }
        @keyframes nudgePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.7)} }
      `}</style>
    <div style={{ height: "100%", overflowY: "auto", background: "#0f1117", fontFamily: FONT, color: "#d4d8e0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 100px" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Coogs Hub</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Deadlines</h1>
        </div>

{/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { id: "school",    label: "◈ School",    color: "#e8c547" },
            { id: "research",  label: "◉ Research",  color: "#a78bfa" },
            { id: "completed", label: "✓ Completed", color: "#34d399" },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if(t.id!=="completed") setForm(f=>({...f,type:t.id})); }} style={{
              padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FONT,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
              background: tab===t.id ? t.color : "#1a1f2e",
              color: tab===t.id ? "#0f1117" : "#4a5060",
            }}>
              {t.label}
              {t.id === "completed" && deadlines.filter(d=>d.done).length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 10, background: "#34d39933", border: "1px solid #34d39955", borderRadius: 8, padding: "1px 6px", color: "#34d399" }}>
                  {deadlines.filter(d=>d.done).length}
                </span>
              )}
            </button>
          ))}
          {!isCompletedTab && <button onClick={() => setShowAdd(v=>!v)} style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 8, border: `1px solid ${showAdd?"#e8c547":"#2a2e38"}`, background: "transparent", color: showAdd?"#e8c547":"#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>+ Add deadline</button>}
        </div>

        {/* Add form */}
        {showAdd && (
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>New Deadline</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle} />
              <select value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} style={inputStyle}>
                <option value="">No course</option>
                {COURSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inputStyle} />
              <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={inputStyle} />
              <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={inputStyle}>
                <option value="low">Low priority</option>
                <option value="normal">Normal</option>
                <option value="high">High priority</option>
              </select>
              <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={addDeadline} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: tab==="school"?"#e8c547":"#a78bfa", color: "#0f1117", fontFamily: FONT, fontSize: 12, fontWeight: 700 }}>Add</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Calendar */}
        {/* Weekly load + momentum + focus */}
        {!isCompletedTab && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>

            {/* This week load */}
            <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:12,padding:"14px 20px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4a5060",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>This week</div>
              <div style={{display:"flex",gap:6,alignItems:"flex-end",height:40}}>
                {weekLoad.map((day,i) => {
                  const isToday = day.str === new Date().toISOString().slice(0,10);
                  const h = day.count === 0 ? 4 : Math.min(40, 8 + day.count * 10);
                  return (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:"100%",height:h,background:isToday?"#e8c547":(day.count>2?"#fb923c":day.count>0?"#4ecdc4":"#1e2130"),borderRadius:3,transition:"height 0.3s"}}/>
                      <span style={{fontSize:9,color:isToday?"#e8c547":"#4a5060",fontWeight:isToday?700:400}}>{day.label}</span>
                      {day.count > 0 && <span style={{fontSize:8,color:"#4a5060"}}>{day.count}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion momentum — last 14 days */}
            <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:12,padding:"14px 20px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4a5060",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>Momentum · 14d</div>
              <div style={{display:"flex",gap:3,alignItems:"flex-end",height:40}}>
                {momentumDays.map((day,i) => {
                  const isToday = i === 13;
                  const h = day.count === 0 ? 3 : Math.min(40, 8 + day.count * 14);
                  return (
                    <div key={i} title={`${day.str}: ${day.count} completed`} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{width:"100%",height:h,background:isToday?"#34d399":day.count>0?"#34d39966":"#1e2130",borderRadius:2,transition:"height 0.3s"}}/>
                      {day.label && <span style={{fontSize:8,color:isToday?"#34d399":"#4a5060",fontWeight:isToday?700:400,whiteSpace:"nowrap"}}>{day.label}</span>}
                    </div>
                  );
                })}
              </div>
              {momentumDays.every(d => d.count === 0) && (
                <div style={{fontSize:10,color:"#3a4052",marginTop:6,fontStyle:"italic"}}>no completions yet — let's change that</div>
              )}
            </div>
          </div>
        )}

        {/* Daily focus pick */}
        {!isCompletedTab && focusPick && (
          <div style={{
            background:"#161920",border:"1px solid #e8c54733",
            borderLeft:"3px solid #e8c547",borderRadius:"0 12px 12px 0",
            padding:"12px 18px",marginBottom:16,
            display:"flex",alignItems:"center",gap:14,
          }}>
            <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:0}}>
              <div style={{fontSize:9,fontWeight:700,color:"#e8c547",letterSpacing:"2px",textTransform:"uppercase"}}>Focus on this today</div>
              <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{focusPick.title}</div>
              <div style={{display:"flex",gap:8,marginTop:1}}>
                {COURSES.find(c=>c.id===focusPick.course) && (
                  <span style={{fontSize:10,color:COURSES.find(c=>c.id===focusPick.course).color,fontFamily:MONO}}>
                    {COURSES.find(c=>c.id===focusPick.course).label}
                  </span>
                )}
                <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>
                  {(() => { const d=getDaysUntil(focusPick.date); return d===0?"due today":d<0?`${Math.abs(d)}d overdue`:`${d}d left`; })()}
                </span>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); cycleStatus(focusPick.id); }}
              style={{padding:"7px 16px",borderRadius:8,border:"1px solid #e8c54755",background:"#e8c54715",color:"#e8c547",fontFamily:FONT,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}
            >
              {focusPick.status === "inprogress" ? "continue →" : "start now →"}
            </button>
          </div>
        )}
        {!isCompletedTab && dueNow.length > 0 && (
          <div style={{
            background: "#ff444415", border: "1px solid #ff444444",
            borderLeft: "4px solid #ff4444", borderRadius: "0 10px 10px 0",
            padding: "12px 18px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#ff4444", fontFamily: MONO }}>!!</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ff4444" }}>
                  {dueNow.length} deadline{dueNow.length > 1 ? "s" : ""} need attention now
                </div>
                <div style={{ fontSize: 11, color: "#7a8090", marginTop: 2 }}>
                  {dueNow.map(d => d.title).join(" · ")}
                </div>
              </div>
            </div>
            {doneToday.length > 0 && (
              <div style={{ fontSize: 11, color: "#34d399", fontWeight: 700, fontFamily: MONO }}>
                ✓ {doneToday.length} done today
              </div>
            )}
          </div>
        )}
        {!isCompletedTab && dueNow.length === 0 && doneToday.length > 0 && (
          <div style={{
            background: "#34d39910", border: "1px solid #34d39933",
            borderRadius: 10, padding: "10px 16px", marginBottom: 16,
            fontSize: 12, color: "#34d399", fontWeight: 700,
          }}>
            ✓ {doneToday.length} completed today — good work
          </div>
        )}
        {sect("Calendar",
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["month","week"].map(v => <button key={v} onClick={()=>setView(v)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 11, fontWeight: 700, background: view===v?"#2a2e38":"transparent", color: view===v?"#d4d8e0":"#4a5060" }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
              </div>
              {view==="month" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={()=>setCalDate(new Date(calYear,calMonth-1,1))} style={navBtn}>‹</button>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#d4d8e0", fontFamily: MONO }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={()=>setCalDate(new Date(calYear,calMonth+1,1))} style={navBtn}>›</button>
                </div>
              )}
            </div>
            {view==="month" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d=><div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#4a5060", fontFamily: MONO, padding: "4px 0" }}>{d}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                  {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
                  {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                    const isToday = today.getDate()===day&&today.getMonth()===calMonth&&today.getFullYear()===calYear;
                    const str = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const dots = deadlines.filter(dl=>dl.date===str&&!dl.done);
                    return (
                      <div key={day} onClick={()=>openAddWithDate(calYear,calMonth,day)}
                        onMouseEnter={e=>{if(!isToday)e.currentTarget.style.background="#1a1f2e";}}
                        onMouseLeave={e=>{if(!isToday)e.currentTarget.style.background="transparent";}}
                        style={{ minHeight: 44, padding: "4px 6px", borderRadius: 6, cursor: "pointer", background: isToday?"#1e2a40":"transparent", border: isToday?"1px solid #7eb8f7":"1px solid transparent" }}>
                        <div style={{ fontSize: 11, fontWeight: isToday?700:500, color: isToday?"#7eb8f7":"#5a6070", fontFamily: MONO }}>{day}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
                          {dots.map(dl=>{const c=COURSES.find(c=>c.id===dl.course);return<div key={dl.id} title={dl.title} style={{width:6,height:6,borderRadius:"50%",background:c?c.color:"#e8c547"}}/>;} )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {view==="week" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                {weekDays.map((d,i)=>{
                  const str=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                  const isToday=d.toDateString()===today.toDateString();
                  const items=deadlines.filter(dl=>dl.date===str&&!dl.done);
                  return(
                    <div key={i} onClick={()=>openAddWithDate(d.getFullYear(),d.getMonth(),d.getDate())}
                      style={{background:isToday?"#1e2a40":"#1a1f2e",border:`1px solid ${isToday?"#7eb8f7":"#2a2e38"}`,borderRadius:8,padding:"10px 8px",minHeight:80,cursor:"pointer"}}>
                      <div style={{fontSize:10,fontWeight:700,color:isToday?"#7eb8f7":"#4a5060",fontFamily:MONO,marginBottom:6}}>{DAYS[d.getDay()]} {d.getDate()}</div>
                      {items.map(dl=>{const c=COURSES.find(c=>c.id===dl.course);return<div key={dl.id} style={{fontSize:10,padding:"2px 6px",borderRadius:4,marginBottom:3,background:(c?c.color:"#e8c547")+"22",color:c?c.color:"#e8c547",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.title}</div>;})}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Upcoming */}
        {isCompletedTab ? sect("Completed", (
          done.length === 0
            ? <div style={{fontSize:13,color:"#4a5060",padding:"12px 0"}}>No completed deadlines yet.</div>
            : <div style={{display:"flex",flexDirection:"column",gap:20}}>
                {["school","research"].map(type => {
                  const group = done.filter(d => d.type === type);
                  if (group.length === 0) return null;
                  const typeColor = type === "school" ? "#e8c547" : "#a78bfa";
                  return (
                    <div key={type}>
                      <div style={{fontSize:10,fontWeight:700,color:typeColor,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${typeColor}22`}}>
                        {type} · {group.length}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {group.map(dl=>{
                  const course=COURSES.find(c=>c.id===dl.course);
                  return(
                    <div key={dl.id} style={{background:"#0f1117",border:"1px solid #2a2e38",borderLeft:`3px solid ${typeColor}`,borderRadius:"0 10px 10px 0",overflow:"hidden"}}>
                      <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,opacity:0.75,cursor:"pointer"}} onClick={()=>setExpandedDl(e=>e===dl.id?null:dl.id)}>
                      <button onClick={e=>{e.stopPropagation();cycleStatus(dl.id);}} title="Mark incomplete" style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${typeColor}`,background:typeColor,cursor:"pointer",flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#7a8090",textDecoration:"line-through",marginBottom:2}}>{dl.title}</div>
                        <div style={{display:"flex",gap:8}}>
                          {course&&<span style={{fontSize:10,color:course.color,fontFamily:MONO}}>{course.label}</span>}
                          <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</span>
                        </div>
                      </div>
                      {delDlTarget === dl.id ? (
                        <div style={{display:"flex",flexDirection:"column",gap:5,minWidth:160}}>
                          {delDlStep === "pw" ? (
                            <>
                              <input autoFocus type="password" value={delDlPw}
                                onChange={e=>{setDelDlPw(e.target.value);setDelDlErr(false);}}
                                onKeyDown={e=>{if(e.key==="Enter")submitDelDlPw();if(e.key==="Escape")cancelDelDl();}}
                                placeholder="password"
                                style={{background:"#0d0f14",border:`1px solid ${delDlErr?"#e85454":"#2a2e38"}`,borderRadius:5,color:"#d4d8e0",fontSize:11,fontFamily:MONO,padding:"4px 8px",outline:"none",width:"100%",boxSizing:"border-box"}}
                              />
                              {delDlErr && <div style={{fontSize:10,color:"#e85454",fontFamily:MONO}}>incorrect</div>}
                              <div style={{display:"flex",gap:5}}>
                                <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                                <button onClick={submitDelDlPw} style={{flex:1,padding:"3px 0",background:"#2a2e38",border:"none",borderRadius:5,color:"#d4d8e0",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>next</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{fontSize:11,color:"#e8eaf0",fontFamily:MONO}}>delete permanently?</div>
                              <div style={{display:"flex",gap:5}}>
                                <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                                <button onClick={confirmDelDl} style={{flex:1,padding:"3px 0",background:"#e85454",border:"none",borderRadius:5,color:"#fff",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>delete</button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <button onClick={e=>{e.stopPropagation();startDelDl(dl.id);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid #e8545422",background:"transparent",color:"#4a5060",cursor:"pointer",fontFamily:MONO,fontSize:11,flexShrink:0}}>✕</button>
                      )}
                      </div>
                      {expandedDl === dl.id && (
                        <div style={{padding:"12px 14px 14px",borderTop:`1px solid ${typeColor}22`,display:"flex",flexDirection:"column",gap:8}}>
                          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Due</div>
                              <div style={{fontSize:12,color:"#d4d8e0",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</div>
                            </div>
                            {dl.completedAt && (
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Completed</div>
                                <div style={{fontSize:12,color:"#34d399",fontFamily:MONO}}>{dl.completedAt}</div>
                              </div>
                            )}
                          {dl.startedAt && dl.completedAt && (
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Duration</div>
                                <div style={{fontSize:12,color:"#a78bfa",fontFamily:MONO}}>{
                                  (() => {
                                    const days = Math.round((new Date(dl.completedAt) - new Date(dl.startedAt)) / 86400000);
                                    return days === 0 ? "same day" : `${days} day${days !== 1 ? "s" : ""}`;
                                  })()
                                }</div>
                              </div>
                            )}
                            {dl.priority && dl.priority !== "normal" && (
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Priority</div>
                                <div style={{fontSize:12,color:dl.priority==="high"?"#fb923c":"#60a5fa"}}>{dl.priority}</div>
                              </div>
                            )}
                          </div>
                          {dl.notes && (
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Notes</div>
                              <div style={{fontSize:12,color:"#9aa0b0",lineHeight:1.6}}>{dl.notes}</div>
                            </div>
                          )}
                          {dl.reflection && (
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#34d399",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Reflection</div>
                              <div style={{fontSize:12,color:"#34d39999",lineHeight:1.6,fontStyle:"italic"}}>"{dl.reflection}"</div>
                            </div>
                          )}
                          {dl.subtasks?.length > 0 && (
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#7eb8f7",letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>Steps completed</div>
                              <div style={{fontSize:12,color:"#7eb8f799",fontFamily:MONO}}>{dl.subtasks.filter(s=>s.done).length}/{dl.subtasks.length}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                      </div>
                    </div>
                  );
                })}
              </div>
        )) : sect(`Upcoming — ${tab}`,
          <>
            {filtered.length===0
              ? <div style={{fontSize:13,color:"#4a5060",padding:"12px 0"}}>No upcoming deadlines. Click a day or use + Add.</div>
              : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {filtered.map(dl=>{
                    const days=getDaysUntil(dl.date),tier=urgencyTier(days),uc=tier.color,course=COURSES.find(c=>c.id===dl.course);
                    return(
                      <div key={dl.id} style={{background:"#0f1117",border:`1px solid ${uc}${tier.bold?"55":"22"}`,borderLeft:`${tier.bold?4:3}px solid ${uc}`,borderRadius:"0 10px 10px 0",overflow:"hidden"}}>
                        {/* Time pressure bar */}
                        {(() => {
                          const total = dl.createdAt ? Math.max(1, Math.ceil((new Date(dl.date) - new Date(dl.createdAt)) / 86400000)) : Math.max(1, getDaysUntil(dl.date) + 7);
                          const remaining = Math.max(0, getDaysUntil(dl.date));
                          const pct = Math.min(100, Math.round((1 - remaining / total) * 100));
                          if (pct <= 0) return null;
                          return (
                            <div style={{height:2,background:"#1a1f2e",width:"100%"}}>
                              <div style={{height:"100%",width:`${pct}%`,background:pct>=90?`linear-gradient(90deg,#ff4444,#ff6b6b)`:pct>=60?`linear-gradient(90deg,${uc},${uc}aa)`:uc,transition:"width 0.4s",opacity:0.7}}/>
                            </div>
                          );
                        })()}
                        <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,background:tier.bold?uc+"08":"transparent"}}>
                          <button
                            onClick={e => { e.stopPropagation(); cycleStatus(dl.id); }}
                            title={dl.status==="inprogress"
                              ? (dl.subtasks?.length > 0 && !dl.subtasks.every(s=>s.done)
                                ? `Complete all steps first (${dl.subtasks.filter(s=>s.done).length}/${dl.subtasks.length})`
                                : "Mark complete")
                              : "Mark in progress"}
                            style={{
                              width:18, height:18, borderRadius:"50%", cursor:"pointer", flexShrink:0,
                              border:`2px solid ${dl.status==="inprogress" ? "#7eb8f7" : uc}`,
                              background: dl.status==="inprogress" ? "#7eb8f722" : "transparent",
                              position:"relative", transition:"all 0.2s",
                            }}
                          >
                            {dl.status==="inprogress" && (
                              <div style={{position:"absolute",inset:2,borderRadius:"50%",background:"#7eb8f7",opacity:0.6}}/>
                            )}
                          </button>
                          <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>setExpandedDl(e=>e===dl.id?null:dl.id)}>
                            <div style={{fontSize:13,fontWeight:tier.bold?700:600,color:tier.bold?"#f0f0f0":"#d4d8e0",marginBottom:2}}>{dl.title}</div>
                            <div style={{display:"flex",gap:8}}>
                              {course&&<span style={{fontSize:10,color:course.color,fontFamily:MONO}}>{course.label}</span>}
                              <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</span>
                              {dl.status==="inprogress" && dl.startedAt && (
                                <span style={{fontSize:10,color:"#7eb8f7",fontFamily:MONO}}>● started {dl.startedAt}</span>
                              )}
                              {!dl.status && dl.id && (() => {
                                const daysAgo = Math.floor((Date.now() - parseInt(dl.id)) / 86400000);
                                return daysAgo >= 7 ? (
                                  <span style={{fontSize:10,color:"#3a4052",fontFamily:MONO,fontStyle:"italic"}}>in list {daysAgo}d</span>
                                ) : null;
                              })()}
                              {dl.timeEst && <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>· {dl.timeEst}</span>}
                              {dl.subtasks?.length > 0 && (
                                <span style={{fontSize:10,color:"#7eb8f7",fontFamily:MONO}}>
                                  · {dl.subtasks.filter(s=>s.done).length}/{dl.subtasks.length} steps
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                            {!dl.status && days <= 7 && days >= 0 && (
                              <div title="Not started yet" style={{width:6,height:6,borderRadius:"50%",background:"#fb923c",flexShrink:0,animation:"nudgePulse 1.8s ease-in-out infinite"}}/>
                            )}
                            <div style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:uc,background:uc+"18",border:`1px solid ${uc}44`,borderRadius:6,padding:"3px 8px",letterSpacing:tier.bold?"0.5px":0}}>{urgencyLabel(days)}</div>
                          </div>
                          <button onClick={()=>setDeadlines(p=>p.filter(d=>d.id!==dl.id))} style={{background:"transparent",border:"none",color:"#3a4052",cursor:"pointer",fontSize:13,padding:0}}>✕</button>
                        </div>
                        {expandedDl === dl.id && (
                          <div style={{padding:"12px 14px 14px",borderTop:`1px solid ${uc}22`,display:"flex",flexDirection:"column",gap:10}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Title</div>
                                <input
                                  value={dl.title}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,title:e.target.value}:d))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                />
                              </div>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Course</div>
                                <select
                                  value={dl.course}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,course:e.target.value}:d))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                >
                                  <option value="">No course</option>
                                  {COURSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                              </div>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Date</div>
                                <input
                                  type="date"
                                  value={dl.date}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,date:e.target.value}:d).sort((a,b)=>a.date.localeCompare(b.date)))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                />
                              </div>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Type</div>
                                <select
                                  value={dl.type}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,type:e.target.value}:d))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                >
                                  <option value="school">School</option>
                                  <option value="research">Research</option>
                                </select>
                              </div>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Priority</div>
                                <select
                                  value={dl.priority}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,priority:e.target.value}:d))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                >
                                  <option value="low">Low</option>
                                  <option value="normal">Normal</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              <div>
                                <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Time</div>
                                <input
                                  type="time"
                                  value={dl.time||""}
                                  onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,time:e.target.value}:d))}
                                  style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                                />
                              </div>
                            </div>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Notes</div>
                              <textarea
                                value={dl.notes||""}
                                onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,notes:e.target.value}:d))}
                                placeholder="Add notes…"
                                style={{...inputStyle,fontSize:12,padding:"6px 8px",resize:"vertical",minHeight:52,width:"100%",boxSizing:"border-box"}}
                              />
                            </div>
                            <div>
                              <div style={{fontSize:9,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Time estimate</div>
                              <input
                                value={dl.timeEst||""}
                                onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,timeEst:e.target.value}:d))}
                                placeholder="e.g. ~2 hrs, 30 min…"
                                style={{...inputStyle,fontSize:12,padding:"5px 8px"}}
                              />
                            </div>
                            {dl.subtasks?.length > 0 && (
                              <div style={{gridColumn:"1/-1"}}>
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                                  <div style={{fontSize:9,fontWeight:700,color:"#7eb8f7",letterSpacing:"1px",textTransform:"uppercase"}}>Steps</div>
                                  <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.subtasks.filter(s=>s.done).length}/{dl.subtasks.length}</span>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                                  {dl.subtasks.map((step,si) => (
                                    <div key={step.id} style={{display:"flex",alignItems:"center",gap:8}}>
                                      <button onClick={() => {
                                        const updated = dl.subtasks.map((s,j) => j===si?{...s,done:!s.done}:s);
                                        setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,subtasks:updated}:d));
                                        // Only when checking (not unchecking) the last step
                                        if (!step.done && updated.every(s=>s.done)) {
                                          setTimeout(() => {
                                            setReflectModal({id:dl.id});
                                            setReflectInput("");
                                          }, 300);
                                        }
                                      }} style={{width:14,height:14,borderRadius:3,border:`1px solid ${step.done?"#7eb8f7":"#2a2e38"}`,background:step.done?"#7eb8f7":"transparent",cursor:"pointer",flexShrink:0}}/>
                                      <span style={{fontSize:12,color:step.done?"#4a5060":"#d4d8e0",textDecoration:step.done?"line-through":"none",fontFamily:FONT}}>
                                        {step.label}
                                      </span>
                                      <input
                                        value={step.label}
                                        onChange={e => setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,subtasks:d.subtasks.map((s,j)=>j===si?{...s,label:e.target.value}:s)}:d))}
                                        style={{display:"none"}}
                                      />
                                    </div>
                                  ))}
                                </div>
                                <button onClick={() => setSubtaskModal({id:dl.id,phase:"count",count:dl.subtasks.length,steps:[]})}
                                  style={{marginTop:8,background:"transparent",border:"1px solid #2a2e3855",borderRadius:6,color:"#4a5060",fontSize:10,fontFamily:FONT,cursor:"pointer",padding:"3px 10px"}}>
                                  ✎ edit steps
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
            }
          </>
        )}





      </div>
    </div>
    </>
  );
}

const inputStyle = {
  background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8,
  color: "#d4d8e0", fontFamily: "'Inter', sans-serif", fontSize: 13,
  padding: "8px 12px", outline: "none", width: "100%", boxSizing: "border-box",
};

const navBtn = {
  background: "transparent", border: "none", color: "#7a8090",
  cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1,
};