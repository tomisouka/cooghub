import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DEADLINES as INITIAL_DEADLINES } from "../data/memory-deadlines";
import { COURSES } from "../data/skills";
import RoadmapTab from "./RoadmapTab";
import { DELETE_CONFIRM_PW } from "../config/localAuth";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

// ── Migrate legacy type values ───────────────────────────────────────────────
function migrateType(type) {
  if (type === "school")   return "sun";
  if (type === "research") return "moon";
  return type;
}

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
    if (IS_TAURI) {
      await invoke("save_deadlines", { content });
    } else {
      await fetch("/api/save-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    }
  } catch (e) {
    console.error("[persist] FAILED:", e);
  }
}

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

// ── Date helpers ─────────────────────────────────────────────────────────────
function getDaysUntil(dateStr) {
  const now = new Date();
  const deadline = new Date(dateStr + "T23:59:00");
  return Math.floor((deadline - now) / 86400000);
}
// Urgency tiers — x = days until deadline (floored, so 0 = due today with time remaining)
// OVERDUE : x < 0  (past 23:59 on due date)
// DEATH   : 0 <= x <= 3
// PULSE   : 3 < x <= 7
// CORNER  : 7 < x <= 14
// WINDOW  : 14 < x <= 21
// PROJECT : x > 21
function urgencyTier(d) {
  if (d < 0)   return { color: "#ff4444", label: "OVERDUE", bold: true  };
  if (d <= 3)  return { color: "#ff6b9d", label: "DEATH",   bold: true  };
  if (d <= 7)  return { color: "#fb923c", label: "PULSE",   bold: true  };
  if (d <= 14) return { color: "#7eb8f7", label: "CORNER",  bold: false };
  if (d <= 21) return { color: "#a78bfa", label: "WINDOW",  bold: false };
  return              { color: "#4ecdc4", label: "PROJECT",  bold: false };
}
function urgencyLabel(d) {
  return urgencyTier(d).label;
}
// Returns the name of the next urgency tier and how many days until it arrives
function nextTierInfo(d) {
  if (d < 0)   return null; // already overdue, no next tier
  if (d <= 3)  return { name: "OVERDUE", daysUntil: d + 1 };
  if (d <= 7)  return { name: "DEATH",   daysUntil: d - 3 };
  if (d <= 14) return { name: "PULSE",   daysUntil: d - 7 };
  if (d <= 21) return { name: "CORNER",  daysUntil: d - 14 };
  return              { name: "WINDOW",  daysUntil: d - 21 };
}

// ── Repeat helpers ────────────────────────────────────────────────────────────
const REPEAT_OPTIONS = [
  { id: "none",    label: "No repeat" },
  { id: "daily",   label: "Daily"     },
  { id: "weekly",  label: "Weekly"    },
  { id: "monthly", label: "Monthly"   },
];

function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nextRepeatDate(dateStr, repeat) {
  const d = new Date(dateStr + "T00:00:00");
  if (repeat === "daily")   d.setDate(d.getDate() + 1);
  if (repeat === "weekly")  d.setDate(d.getDate() + 7);
  if (repeat === "monthly") d.setMonth(d.getMonth() + 1);
  return localDateStr(d);
}

function repeatLabel(repeat) {
  if (repeat === "daily")   return "↻ daily";
  if (repeat === "weekly")  return "↻ weekly";
  if (repeat === "monthly") return "↻ monthly";
  return null;
}

// ── Tag config ────────────────────────────────────────────────────────────────
const TAGS = [
  { id: "",         label: "No tag"   },
  { id: "school",   label: "School"   },
  { id: "research", label: "Research" },
];

function tagChip(tag) {
  if (!tag) return null;
  const color = tag === "school" ? "#e8c547" : "#a78bfa";
  return { color, label: tag === "school" ? "◈ school" : "◉ research" };
}

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "sun",       label: "☀ Sun",       color: "#e8c547" },
  { id: "moon",      label: "☽ Moon",      color: "#a78bfa" },
  { id: "roadmap",   label: "⬡ Roadmap",   color: "#60a5fa" },
  { id: "completed", label: "✓ Completed", color: "#34d399" },
];

function tabColor(tabId) {
  return TABS.find(t => t.id === tabId)?.color ?? "#e8c547";
}

// ── Notification helpers ──────────────────────────────────────────────────────
// Requests browser notification permission on mount, then fires alerts for
// deadlines due today or tomorrow (once per session per deadline).
// Only works while the app window is open — no background push support.
function requestNotifPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") Notification.requestPermission();
}

function scheduleNotifications(deadlines, firedRef) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  deadlines.forEach(dl => {
    if (dl.done) return;
    const days = getDaysUntil(dl.date);
    if (days < 0 || days > 3) return;
    const key = `${dl.id}_d${days}`;
    if (firedRef.current.has(key)) return;
    firedRef.current.add(key);
    setTimeout(() => {
      if (Notification.permission !== "granted") return;
      const body = days === 0
        ? `"${dl.title}" is due TODAY — DEATH zone.`
        : days <= 3
        ? `"${dl.title}" is in DEATH zone — ${days}d left.`
        : `"${dl.title}" is due TOMORROW.`;
      new Notification("Coogs Hub · Deadline", { body, icon: "/favicon.ico" });
    }, 800);
  });
}

// ── Calendar export (.ics) ────────────────────────────────────────────────────
function toICSDate(dateStr) {
  // Returns YYYYMMDD for all-day events
  return dateStr.replace(/-/g, "");
}
function escapeICS(str) {
  return (str || "").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");
}
function exportToCalendar(deadlines, courses, type = "all") {
  const active = deadlines.filter(d => !d.done);
  if (!active.length) return;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Coogs Hub//Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  active.forEach(dl => {
    const course = courses.find(c => c.id === dl.course);
    const summary = escapeICS(dl.title + (course ? ` · ${course.label}` : ""));
    const desc    = escapeICS([dl.notes, dl.priority !== "normal" ? `Priority: ${dl.priority}` : ""].filter(Boolean).join(" | "));
    const dtstart = toICSDate(dl.date);
    // End date = day after for all-day events
    const end = new Date(dl.date + "T00:00:00");
    end.setDate(end.getDate() + 1);
    const dtend = `${end.getFullYear()}${String(end.getMonth()+1).padStart(2,"0")}${String(end.getDate()).padStart(2,"0")}`;
    const uid = `coogs-${dl.id}@coogshub`;

    lines.push(...[
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${summary}`,
      desc ? `DESCRIPTION:${desc}` : null,
      `STATUS:${dl.status === "inprogress" ? "IN-PROCESS" : "NEEDS-ACTION"}`,
      "END:VEVENT",
    ].filter(Boolean));
  });

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `coogs-${type}-deadlines.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const emptyForm = (type = "sun") => ({
  title: "", course: "", date: "", time: "23:59", notes: "",
  type, priority: "normal", repeat: "none", tag: "",
  parentSunId: "",
});

// ─────────────────────────────────────────────────────────────────────────────
export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState(() =>
    INITIAL_DEADLINES.map(d => ({ ...d, type: migrateType(d.type) }))
  );
  const [view,           setView]           = useState("month");
  const [collapsedMonths, setCollapsedMonths] = useState(() => {
    // Auto-collapse all months prior to current month
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    return { __currentKey: currentKey }; // tracks auto-collapsed state
  });
  const [tab,            setTab]            = useState("sun");
  const [showAdd,        setShowAdd]        = useState(false);
  const [today]                             = useState(new Date());
  const [calDate,        setCalDate]        = useState(new Date());
  const [form,           setForm]           = useState(emptyForm("sun"));
  const [selectedCalDay, setSelectedCalDay] = useState(null); // "YYYY-MM-DD" or null
  const [flashDlId,      setFlashDlId]      = useState(null); // deadline id to flash in list

  const isFirstRender = useRef(true);
  const notifFired    = useRef(new Set());
  const calRef        = useRef(null);
  const dlRefs        = useRef({});

  useEffect(() => { requestNotifPermission(); }, []);
  useEffect(() => { scheduleNotifications(deadlines, notifFired); }, [deadlines]);

  useEffect(() => {
    if (!IS_TAURI) return;
    invoke("load_memory").then(raw => {
      try {
        const match = raw.match(/export const DEADLINES = (\[[\s\S]*?]);/);
        if (match) setDeadlines(JSON.parse(match[1]).map(d => ({ ...d, type: migrateType(d.type) })));
      } catch(e) { console.error("Failed to parse memory.js", e); }
    }).catch(e => console.error("load_memory failed", e));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    persistToFile(deadlines);
  }, [deadlines]);

  function openDayDetail(y, m, d) {
    const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    setSelectedCalDay(prev => prev === dateStr ? null : dateStr);
  }

  function openAddWithDate(dateStr) {
    const type = tab === "completed" ? "sun" : tab;
    setForm(f => ({ ...f, date: dateStr, type }));
    setShowAdd(true);
    setSelectedCalDay(null);
  }

  function addDeadline() {
    if (!form.title || !form.date) return;
    setDeadlines(prev =>
      [...prev, { ...form, id: Date.now().toString(), done: false }]
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    setForm(emptyForm(tab === "completed" ? "sun" : tab));
    setShowAdd(false);
  }

  function spawnNextOccurrence(dl) {
    if (!dl.repeat || dl.repeat === "none") return;
    const next = {
      ...dl,
      id:          Date.now().toString() + "_r",
      date:        nextRepeatDate(dl.date, dl.repeat),
      done:        false,
      status:      undefined,
      startedAt:   undefined,
      completedAt: undefined,
      reflection:  undefined,
    };
    setDeadlines(prev => [...prev, next].sort((a, b) => a.date.localeCompare(b.date)));
  }

  // ── Status cycle ──────────────────────────────────────────────────────────
  const [celebrating,   setCelebrating]   = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [reflectModal,  setReflectModal]  = useState(null);
  const [reflectInput,  setReflectInput]  = useState("");

  function cycleStatus(id) {
    const dl = deadlines.find(d => d.id === id);
    if (!dl) return;
    if (dl.done) {
      setConfirmStatus({ id, nextStatus: "none",       label: "Unmark as done?"     });
    } else if (dl.status === "inprogress") {
      setConfirmStatus({ id, nextStatus: "done",       label: "Mark as completed?"  });
    } else {
      setConfirmStatus({ id, nextStatus: "inprogress", label: "Mark as started?"    });
    }
  }

  function applyStatus() {
    if (!confirmStatus) return;
    const { id, nextStatus, action } = confirmStatus;
    if (action === "pushToday") {
      const tod = localDateStr();
      setDeadlines(p => p.map(d => d.id === id ? {...d, date: tod} : d).sort((a,b) => a.date.localeCompare(b.date)));
      setConfirmStatus(null);
      return;
    }
    setConfirmStatus(null);
    if (nextStatus === "none") {
      setDeadlines(prev => prev.map(d =>
        d.id === id ? { ...d, done: false, status: "none", completedAt: undefined } : d
      ));
    } else if (nextStatus === "done") {
      const dl = deadlines.find(d => d.id === id);
      setDeadlines(prev => prev.map(d =>
        d.id === id
          ? { ...d, done: true, status: "done", completedAt: localDateStr() }
          : d
      ));
      setReflectModal({ id });
      setReflectInput("");
      if (dl?.repeat && dl.repeat !== "none") spawnNextOccurrence(dl);
    } else {
      setDeadlines(prev => prev.map(d =>
        d.id === id
          ? { ...d, status: "inprogress", startedAt: d.startedAt || localDateStr() }
          : d
      ));
    }
  }

  // ── Delete flow ───────────────────────────────────────────────────────────
  const [expandedDl,  setExpandedDl]  = useState(null);
  const [delDlTarget, setDelDlTarget] = useState(null);
  const [delDlStep,   setDelDlStep]   = useState("pw");
  const [delDlPw,     setDelDlPw]     = useState("");
  const [delDlErr,    setDelDlErr]    = useState(false);

  function startDelDl(id) { setDelDlTarget(id); setDelDlStep("pw"); setDelDlPw(""); setDelDlErr(false); }
  function cancelDelDl()  { setDelDlTarget(null); setDelDlPw(""); setDelDlErr(false); }
  function submitDelDlPw() {
    if (delDlPw === DELETE_CONFIRM_PW) { setDelDlErr(false); setDelDlStep("confirm"); }
    else { setDelDlErr(true); setDelDlPw(""); }
  }
  function confirmDelDl() { setDeadlines(p => p.filter(d => d.id !== delDlTarget)); cancelDelDl(); }

  // ── Derived ───────────────────────────────────────────────────────────────
  const isCompletedTab = tab === "completed";
  const isRoadmapTab   = tab === "roadmap";
  const done           = deadlines.filter(d => d.done);
  const filtered       = deadlines.filter(d => !d.done && d.type === tab);
  const dueNow         = deadlines.filter(d => !d.done && getDaysUntil(d.date) <= 3);
  const doneToday      = deadlines.filter(d => d.done && d.completedAt === localDateStr());

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const calYear     = calDate.getFullYear();
  const calMonth    = calDate.getMonth();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const weekLoad = weekDays.map(d => {
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return { str, label: DAYS[d.getDay()], count: deadlines.filter(dl => dl.date===str && !dl.done).length };
  });

  const momentumDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 13 + i);
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return {
      str,
      label: i===13 ? "today" : i===12 ? "yday" : null,
      count: deadlines.filter(dl => dl.done && dl.completedAt===str).length,
    };
  });

  const focusPick = (() => {
    const candidates = deadlines.filter(d => !d.done && d.status !== "inprogress");
    if (!candidates.length) return null;
    function tagTier(d) {
      const t = (d.tag || "").toLowerCase();
      if (t === "school")   return 0;
      if (!t)               return 1;
      if (t === "research") return 2;
      return 3;
    }
    return candidates.slice().sort((a, b) => {
      const ta = tagTier(a), tb = tagTier(b);
      if (ta !== tb) return ta - tb;
      const da = getDaysUntil(a.date), db = getDaysUntil(b.date);
      const pa = a.priority==="high" ? -1 : a.priority==="low" ? 1 : 0;
      const pb = b.priority==="high" ? -1 : b.priority==="low" ? 1 : 0;
      return (da + pa*2) - (db + pb*2);
    })[0];
  })();

  const sect = (title, children, extra) => (
    <div style={{ background:"#161920", border:"1px solid #2a2e38", borderRadius:12, padding:20, marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#4a5060", letterSpacing:"2px", textTransform:"uppercase" }}>{title}</div>
        {extra}
      </div>
      {children}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Reflect modal ─────────────────────────────────────────────────── */}
      {reflectModal && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}
          onClick={() => setReflectModal(null)}>
          <div style={{background:"#161920",border:"1px solid #34d39944",borderRadius:14,padding:"24px 28px",minWidth:300,maxWidth:420,display:"flex",flexDirection:"column",gap:14}}
            onClick={e => e.stopPropagation()}>
            <div style={{fontSize:13,fontWeight:700,color:"#34d399",fontFamily:FONT}}>How did it go?</div>
            <div style={{fontSize:11,color:"#4a5060"}}>{deadlines.find(d=>d.id===reflectModal.id)?.title}</div>
            <textarea autoFocus value={reflectInput} onChange={e=>setReflectInput(e.target.value)}
              placeholder="Optional — what worked, what didn't, what you'd do differently..."
              style={{...inputStyle,fontSize:12,resize:"vertical",minHeight:72}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                const rid=reflectModal.id;
                setDeadlines(p=>p.map(d=>d.id===rid?{...d,done:true,status:"done",completedAt:d.completedAt||localDateStr()}:d));
                setReflectModal(null); setCelebrating(rid); setTimeout(()=>setCelebrating(null),2200);
              }} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Skip</button>
              <button onClick={()=>{
                const rid=reflectModal.id;
                setDeadlines(p=>p.map(d=>d.id===rid?{...d,reflection:reflectInput,done:true,status:"done",completedAt:d.completedAt||localDateStr()}:d));
                setReflectModal(null); setCelebrating(rid); setTimeout(()=>setCelebrating(null),2200);
              }} style={{flex:1,padding:"8px 0",background:"#34d39920",border:"1px solid #34d39944",borderRadius:8,color:"#34d399",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm status modal ──────────────────────────────────────────── */}
      {confirmStatus && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}
          onClick={() => setConfirmStatus(null)}>
          <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:14,padding:"24px 28px",minWidth:260,display:"flex",flexDirection:"column",gap:16}}
            onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:13,fontWeight:700,color:"#d4d8e0",fontFamily:FONT}}>{confirmStatus.label}</div>
            <div style={{fontSize:11,color:"#4a5060",fontFamily:FONT}}>{deadlines.find(d=>d.id===confirmStatus.id)?.title}</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirmStatus(null)} style={{flex:1,padding:"8px 0",background:"transparent",border:"1px solid #2a2e38",borderRadius:8,color:"#7a8090",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Cancel</button>
              <button onClick={applyStatus} style={{flex:1,padding:"8px 0",background:confirmStatus.action==="pushToday"?"#a78bfa20":"#34d39920",border:`1px solid ${confirmStatus.action==="pushToday"?"#a78bfa44":"#34d39944"}`,borderRadius:8,color:confirmStatus.action==="pushToday"?"#a78bfa":"#34d399",fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Celebrate overlay ────────────────────────────────────────────── */}
      {celebrating && (
        <div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"celebratePop 1.8s ease-out forwards"}}>
            <div style={{fontSize:28,fontWeight:800,color:"#34d399",fontFamily:MONO,letterSpacing:"2px"}}>✓ DONE</div>
            <div style={{fontSize:12,color:"#34d399",fontFamily:FONT,letterSpacing:"1px",fontWeight:600}}>YOU DID IT :))</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes celebratePop {
          0%  { transform:scale(0.6) translateY(10px); opacity:0 }
          20% { transform:scale(1.1) translateY(-6px); opacity:1 }
          60% { transform:scale(1)   translateY(0);    opacity:1 }
          100%{ transform:scale(.95) translateY(-20px);opacity:0 }
        }
        @keyframes nudgePulse {
          0%,100%{ opacity:1;   transform:scale(1)  }
          50%    { opacity:.35; transform:scale(.7) }
        }
        @keyframes calDayFlash {
          0%,100%{ box-shadow:none }
          30%    { box-shadow:0 0 0 3px #7eb8f7aa }
          70%    { box-shadow:0 0 0 3px #7eb8f766 }
        }
        @keyframes dlFlash {
          0%,100%{ background:transparent }
          25%    { background:#7eb8f720 }
          75%    { background:#7eb8f710 }
        }
      `}</style>

      <div style={{ height:"100%", overflowY:"auto", background:"#0f1117", fontFamily:FONT, color:"#d4d8e0" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px 100px" }}>

          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#4a5060", letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>Coogs Hub</div>
            <h1 style={{ fontSize:26, fontWeight:700, color:"#e2e8f0", margin:0 }}>Deadlines</h1>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={()=>{ setTab(t.id); if(t.id!=="completed"&&t.id!=="roadmap") setForm(f=>({...f,type:t.id})); }}
                style={{ padding:"7px 18px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:FONT, fontSize:12, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase", background:tab===t.id?t.color:"#1a1f2e", color:tab===t.id?"#0f1117":"#4a5060" }}>
                {t.label}
              </button>
            ))}
            {!isCompletedTab && !isRoadmapTab && (
              <button onClick={()=>setShowAdd(v=>!v)}
                style={{marginLeft:"auto",padding:"7px 16px",borderRadius:8,border:`1px solid ${showAdd?tabColor(tab):"#2a2e38"}`,background:"transparent",color:showAdd?tabColor(tab):"#7a8090",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600}}>
                + Add deadline
              </button>
            )}
          </div>

          {/* Add form */}
          {showAdd && (
            <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#4a5060",letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>New Deadline</div>
              {tab==="moon"&&(
                <div style={{marginBottom:12,padding:"10px 14px",background:"#e8c54710",border:"1px solid #e8c54730",borderLeft:"3px solid #e8c547",borderRadius:"0 8px 8px 0"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#e8c547",letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>Contributing to ☀ Sun</div>
                  <select value={form.parentSunId||""} onChange={e=>{const sun=deadlines.find(d=>d.id===e.target.value);setForm(f=>({...f,parentSunId:e.target.value,...(sun?{...(sun.course?{course:sun.course}:{}),...(sun.tag?{tag:sun.tag}:{}),...(sun.notes?{notes:sun.notes}:{})}:{})}));}} style={{...inputStyle,fontSize:12,padding:"6px 10px"}}>
                    <option value="">— Select a Sun deadline (optional) —</option>
                    {deadlines.filter(d=>d.type==="sun"&&!d.done).map(s=><option key={s.id} value={s.id}>{s.title} · {s.date}</option>)}
                  </select>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <input placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle}/>
                <div style={{position:"relative"}}>
                  <select value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} style={{...inputStyle,...(tab==="moon"&&form.parentSunId&&form.course?{borderColor:"#e8c54750",color:"#e8c547cc"}:{})}}>
                    <option value="">No course</option>
                    {COURSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  {tab==="moon"&&form.parentSunId&&form.course&&(
                    <div style={{position:"absolute",top:-8,right:6,fontSize:8,fontWeight:700,color:"#e8c547",background:"#161920",padding:"0 4px",letterSpacing:"0.5px",textTransform:"uppercase"}}>inherited from ☀</div>
                  )}
                </div>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} onClick={e=>e.target.showPicker?.()} style={{...inputStyle,gridColumn:"1 / -1"}}/>
                <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={inputStyle}>
                  <option value="low">Low priority</option>
                  <option value="normal">Normal</option>
                  <option value="high">High priority</option>
                </select>
                <select value={form.repeat} onChange={e=>setForm(f=>({...f,repeat:e.target.value}))} style={inputStyle}>
                  {REPEAT_OPTIONS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <div style={{position:"relative"}}>
                  <select value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} style={{...inputStyle,...(tab==="moon"&&form.parentSunId&&form.tag?{borderColor:"#e8c54750",color:"#e8c547cc"}:{})}}>
                    {TAGS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  {tab==="moon"&&form.parentSunId&&form.tag&&(
                    <div style={{position:"absolute",top:-8,right:6,fontSize:8,fontWeight:700,color:"#e8c547",background:"#161920",padding:"0 4px",letterSpacing:"0.5px",textTransform:"uppercase"}}>inherited from ☀</div>
                  )}
                </div>
                <div style={{position:"relative"}}>
                  <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{...inputStyle,...(tab==="moon"&&form.parentSunId&&form.notes?{borderColor:"#e8c54750",color:"#e8c547cc"}:{})}}/>
                  {tab==="moon"&&form.parentSunId&&form.notes&&(
                    <div style={{position:"absolute",top:-8,right:6,fontSize:8,fontWeight:700,color:"#e8c547",background:"#161920",padding:"0 4px",letterSpacing:"0.5px",textTransform:"uppercase"}}>inherited from ☀</div>
                  )}
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={addDeadline} style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",background:tabColor(tab),color:"#0f1117",fontFamily:FONT,fontSize:12,fontWeight:700}}>Add</button>
                <button onClick={()=>setShowAdd(false)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #2a2e38",background:"transparent",color:"#7a8090",cursor:"pointer",fontFamily:FONT,fontSize:12}}>Cancel</button>
              </div>
            </div>
          )}

          {/* Weekly load + momentum */}
          {!isCompletedTab && !isRoadmapTab && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:12,padding:"14px 20px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#4a5060",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>This week</div>
                <div style={{display:"flex",gap:6,alignItems:"flex-end",height:40}}>
                  {weekLoad.map((day,i)=>{
                    const isToday=day.str===localDateStr();
                    const h=day.count===0?4:Math.min(40,8+day.count*10);
                    return(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                        <div style={{width:"100%",height:h,background:isToday?tabColor(tab):day.count>2?"#fb923c":day.count>0?"#4ecdc4":"#1e2130",borderRadius:3,transition:"height 0.3s"}}/>
                        <span style={{fontSize:9,color:isToday?tabColor(tab):"#4a5060",fontWeight:isToday?700:400}}>{day.label}</span>
                        {day.count>0&&<span style={{fontSize:8,color:"#4a5060"}}>{day.count}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{background:"#161920",border:"1px solid #2a2e38",borderRadius:12,padding:"14px 20px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#4a5060",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>Momentum · 14d</div>
                <div style={{display:"flex",gap:3,alignItems:"flex-end",height:40}}>
                  {momentumDays.map((day,i)=>{
                    const isToday=i===13;
                    const h=day.count===0?3:Math.min(40,8+day.count*14);
                    return(
                      <div key={i} title={`${day.str}: ${day.count} completed`} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{width:"100%",height:h,background:isToday?"#34d399":day.count>0?"#34d39966":"#1e2130",borderRadius:2,transition:"height 0.3s"}}/>
                        {day.label&&<span style={{fontSize:8,color:isToday?"#34d399":"#4a5060",fontWeight:isToday?700:400,whiteSpace:"nowrap"}}>{day.label}</span>}
                      </div>
                    );
                  })}
                </div>
                {momentumDays.every(d=>d.count===0)&&<div style={{fontSize:10,color:"#3a4052",marginTop:6,fontStyle:"italic"}}>no completions yet — let's change that</div>}
              </div>
            </div>
          )}

          {/* Focus pick */}
          {!isCompletedTab && !isRoadmapTab && focusPick && (
            <div style={{background:"#161920",border:`1px solid ${tabColor(focusPick.type)}33`,borderLeft:`3px solid ${tabColor(focusPick.type)}`,borderRadius:"0 12px 12px 0",padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
              <div style={{display:"flex",flexDirection:"column",gap:2,flex:1,minWidth:0}}>
                <div style={{fontSize:9,fontWeight:700,color:tabColor(focusPick.type),letterSpacing:"2px",textTransform:"uppercase"}}>Focus on this today</div>
                <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{focusPick.title}</div>
                <div style={{display:"flex",gap:8,marginTop:1}}>
                  {COURSES.find(c=>c.id===focusPick.course)&&<span style={{fontSize:10,color:COURSES.find(c=>c.id===focusPick.course).color,fontFamily:MONO}}>{COURSES.find(c=>c.id===focusPick.course).label}</span>}
                  <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{(()=>{const d=getDaysUntil(focusPick.date);return d===0?"due today":d<0?`${Math.abs(d)}d overdue`:`${d}d left`;})()}</span>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();cycleStatus(focusPick.id);}}
                style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${tabColor(focusPick.type)}55`,background:`${tabColor(focusPick.type)}15`,color:tabColor(focusPick.type),fontFamily:FONT,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                {focusPick.status==="inprogress"?"continue →":"start now →"}
              </button>
            </div>
          )}

          {/* Due-now alert */}
          {!isCompletedTab && !isRoadmapTab && dueNow.length>0 && (
            <div style={{background:"#ff444415",border:"1px solid #ff444444",borderLeft:"4px solid #ff4444",borderRadius:"0 10px 10px 0",padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14,fontWeight:900,color:"#ff4444",fontFamily:MONO}}>!!</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#ff4444"}}>{dueNow.length} deadline{dueNow.length>1?"s":""} in DEATH zone</div>
                  <div style={{fontSize:11,color:"#7a8090",marginTop:2}}>{dueNow.map(d=>d.title).join(" · ")}</div>
                </div>
              </div>
              {doneToday.length>0&&<div style={{fontSize:11,color:"#34d399",fontWeight:700,fontFamily:MONO}}>✓ {doneToday.length} done today</div>}
            </div>
          )}
          {!isCompletedTab && !isRoadmapTab && dueNow.length===0 && doneToday.length>0 && (
            <div style={{background:"#34d39910",border:"1px solid #34d39933",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:12,color:"#34d399",fontWeight:700}}>
              ✓ {doneToday.length} completed today — good work
            </div>
          )}

          {/* Calendar */}
          <div ref={calRef}>
          {sect("Calendar",(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",gap:6}}>
                  {["month","week"].map(v=>(
                    <button key={v} onClick={()=>setView(v)}
                      style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:11,fontWeight:700,background:view===v?"#2a2e38":"transparent",color:view===v?"#d4d8e0":"#4a5060"}}>
                      {v.charAt(0).toUpperCase()+v.slice(1)}
                    </button>
                  ))}
                </div>
                {view==="month"&&(
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>setCalDate(new Date(calYear,calMonth-1,1))} style={navBtn}>‹</button>
                    <span style={{fontSize:12,fontWeight:700,color:"#d4d8e0",fontFamily:MONO}}>{MONTHS[calMonth]} {calYear}</span>
                    <button onClick={()=>setCalDate(new Date(calYear,calMonth+1,1))} style={navBtn}>›</button>
                  </div>
                )}
              </div>
              {view==="month"&&(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                    {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"#4a5060",fontFamily:MONO,padding:"4px 0"}}>{d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                    {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
                    {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                      const isToday=today.getDate()===day&&today.getMonth()===calMonth&&today.getFullYear()===calYear;
                      const str=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                      const dots=deadlines.filter(dl=>dl.date===str&&!dl.done);
                      const isSelected=selectedCalDay===str;
                      return(
                        <div key={day} onClick={()=>openDayDetail(calYear,calMonth,day)}
                          onMouseEnter={e=>{if(!isToday&&!isSelected)e.currentTarget.style.background="#1a1f2e";}}
                          onMouseLeave={e=>{if(!isToday&&!isSelected)e.currentTarget.style.background="transparent";}}
                          style={{minHeight:44,padding:"4px 6px",borderRadius:6,cursor:"pointer",
                            background:isSelected?"#2a2e3e":isToday?"#1e2a40":"transparent",
                            border:isSelected?"1px solid #7eb8f7":isToday?"1px solid #7eb8f7":"1px solid transparent",
                            animation:isSelected?"calDayFlash 0.5s ease-out":"none"}}>
                          <div style={{fontSize:11,fontWeight:isToday||isSelected?700:500,color:isSelected?"#7eb8f7":isToday?"#7eb8f7":"#5a6070",fontFamily:MONO}}>{day}</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:2}}>
                            {dots.map(dl=>{
                              const c=COURSES.find(c=>c.id===dl.course);
                              const dotColor=c?c.color:dl.type==="sun"?"#e8c547":"#a78bfa";
                              // Sun = filled square, Moon = circle
                              return dl.type==="sun"
                                ? <div key={dl.id} title={`☀ ${dl.title}`} style={{width:6,height:6,borderRadius:1,background:dotColor,flexShrink:0}}/>
                                : <div key={dl.id} title={`☽ ${dl.title}`} style={{width:6,height:6,borderRadius:"50%",background:dotColor,flexShrink:0,opacity:0.7}}/>;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Day detail popover */}
                  {selectedCalDay&&(()=>{
                    const dayItems=deadlines.filter(dl=>dl.date===selectedCalDay&&!dl.done);
                    const dayDone=deadlines.filter(dl=>dl.date===selectedCalDay&&dl.done);
                    return(
                      <div style={{marginTop:12,background:"#1a1f2e",border:"1px solid #7eb8f755",borderRadius:10,padding:"14px 16px",position:"relative"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:12,fontWeight:700,color:"#7eb8f7",fontFamily:MONO}}>{selectedCalDay}</span>
                            {dayItems.length===0&&dayDone.length===0&&<span style={{fontSize:11,color:"#4a5060"}}>Nothing due</span>}
                          </div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <button onClick={()=>openAddWithDate(selectedCalDay)}
                              style={{padding:"4px 12px",borderRadius:6,border:"1px solid #2a2e38",background:"transparent",color:"#7a8090",fontFamily:FONT,fontSize:11,fontWeight:600,cursor:"pointer"}}>
                              + Add here
                            </button>
                            <button onClick={()=>setSelectedCalDay(null)} style={{background:"transparent",border:"none",color:"#4a5060",cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>✕</button>
                          </div>
                        </div>
                        {dayItems.length>0&&(
                          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:dayDone.length?10:0}}>
                            {dayItems.map(dl=>{
                              const c=COURSES.find(c=>c.id===dl.course);
                              const tier=urgencyTier(getDaysUntil(dl.date));
                              return(
                                <div key={dl.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#0f1117",borderRadius:7,border:`1px solid ${dl.type==="sun"?"#e8c54733":"#a78bfa33"}`,borderLeft:`3px solid ${dl.type==="sun"?"#e8c547":"#a78bfa"}`}}>
                                  <span style={{fontSize:12,flexShrink:0}}>{dl.type==="sun"?"☀":"☽"}</span>
                                  <span style={{flex:1,fontSize:12,fontWeight:600,color:"#d4d8e0",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.title}</span>
                                  {c&&<span style={{fontSize:10,color:c.color,fontFamily:MONO,flexShrink:0}}>{c.label}</span>}
                                  <span style={{fontSize:10,fontWeight:700,color:tier.color,background:tier.color+"18",border:`1px solid ${tier.color}44`,borderRadius:5,padding:"2px 6px",fontFamily:MONO,flexShrink:0}}>{urgencyLabel(getDaysUntil(dl.date))}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {dayDone.length>0&&(
                          <div>
                            <div style={{fontSize:9,fontWeight:700,color:"#34d399",letterSpacing:"2px",textTransform:"uppercase",marginBottom:5}}>✓ Completed</div>
                            <div style={{display:"flex",flexDirection:"column",gap:4}}>
                              {dayDone.map(dl=>(
                                <div key={dl.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:"#0f1117",borderRadius:7,border:"1px solid #34d39922",opacity:0.75}}>
                                  <span style={{fontSize:11,color:"#34d399",flexShrink:0}}>✓</span>
                                  <span style={{fontSize:12,color:"#7a8090",textDecoration:"line-through",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
              {view==="week"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
                  {weekDays.map((d,i)=>{
                    const str=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                    const isToday=d.toDateString()===today.toDateString();
                    const isSelected=selectedCalDay===str;
                    const items=deadlines.filter(dl=>dl.date===str&&!dl.done);
                    return(
                      <div key={i} onClick={()=>{const dd=new Date(str+"T00:00:00");openDayDetail(dd.getFullYear(),dd.getMonth(),dd.getDate());}}
                        style={{background:isSelected?"#2a2e3e":isToday?"#1e2a40":"#1a1f2e",border:`1px solid ${isSelected||isToday?"#7eb8f7":"#2a2e38"}`,borderRadius:8,padding:"10px 8px",minHeight:80,cursor:"pointer"}}>
                        <div style={{fontSize:10,fontWeight:700,color:isSelected||isToday?"#7eb8f7":"#4a5060",fontFamily:MONO,marginBottom:6}}>{DAYS[d.getDay()]} {d.getDate()}</div>
                        {items.map(dl=>{
                          const c=COURSES.find(c=>c.id===dl.course);
                          const dotColor=c?c.color:dl.type==="sun"?"#e8c547":"#a78bfa";
                          return<div key={dl.id} style={{fontSize:10,padding:"2px 6px",borderRadius:4,marginBottom:3,background:dotColor+"22",color:dotColor,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.type==="sun"?"☀ ":"☽ "}{dl.title}</div>;
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Week view day detail */}
              {view==="week"&&selectedCalDay&&(()=>{
                const dayItems=deadlines.filter(dl=>dl.date===selectedCalDay&&!dl.done);
                const dayDone=deadlines.filter(dl=>dl.date===selectedCalDay&&dl.done);
                if(!dayItems.length&&!dayDone.length&&selectedCalDay!==selectedCalDay) return null;
                return(
                  <div style={{marginTop:12,background:"#1a1f2e",border:"1px solid #7eb8f755",borderRadius:10,padding:"14px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#7eb8f7",fontFamily:MONO}}>{selectedCalDay}</span>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>openAddWithDate(selectedCalDay)} style={{padding:"4px 12px",borderRadius:6,border:"1px solid #2a2e38",background:"transparent",color:"#7a8090",fontFamily:FONT,fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add here</button>
                        <button onClick={()=>setSelectedCalDay(null)} style={{background:"transparent",border:"none",color:"#4a5060",cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>✕</button>
                      </div>
                    </div>
                    {dayItems.length===0&&dayDone.length===0&&<div style={{fontSize:12,color:"#4a5060"}}>Nothing due this day.</div>}
                    {dayItems.map(dl=>{const c=COURSES.find(c=>c.id===dl.course);const tier=urgencyTier(getDaysUntil(dl.date));return(
                      <div key={dl.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#0f1117",borderRadius:7,border:`1px solid ${dl.type==="sun"?"#e8c54733":"#a78bfa33"}`,borderLeft:`3px solid ${dl.type==="sun"?"#e8c547":"#a78bfa"}`,marginBottom:5}}>
                        <span style={{fontSize:12}}>{dl.type==="sun"?"☀":"☽"}</span>
                        <span style={{flex:1,fontSize:12,fontWeight:600,color:"#d4d8e0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.title}</span>
                        {c&&<span style={{fontSize:10,color:c.color,fontFamily:MONO}}>{c.label}</span>}
                        <span style={{fontSize:10,fontWeight:700,color:tier.color,background:tier.color+"18",border:`1px solid ${tier.color}44`,borderRadius:5,padding:"2px 6px",fontFamily:MONO}}>{urgencyLabel(getDaysUntil(dl.date))}</span>
                      </div>
                    );})}
                    {dayDone.map(dl=>(
                      <div key={dl.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",background:"#0f1117",borderRadius:7,border:"1px solid #34d39922",marginBottom:4,opacity:0.75}}>
                        <span style={{fontSize:11,color:"#34d399"}}>✓</span>
                        <span style={{fontSize:12,color:"#7a8090",textDecoration:"line-through"}}>{dl.title}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          ))}
          </div>

          {/* Completed tab — grouped by month, past months auto-collapsed */}
          {isCompletedTab && sect("Completed",(
            done.length===0
              ? <div style={{fontSize:13,color:"#4a5060",padding:"12px 0"}}>No completed deadlines yet.</div>
              : (() => {
                  const now = new Date();
                  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
                  const monthMap = {};
                  done.forEach(dl => {
                    const key = dl.completedAt ? dl.completedAt.slice(0,7) : 'unknown';
                    if (!monthMap[key]) monthMap[key] = [];
                    monthMap[key].push(dl);
                  });
                  const monthKeys = Object.keys(monthMap).sort().reverse();
                  const toggleMonth = (key) => {
                    setCollapsedMonths(prev => ({ ...prev, [key]: !prev[key] }));
                  };
                  const isCollapsed = (key) => {
                    if (key in collapsedMonths && key !== '__currentKey') return collapsedMonths[key];
                    return key < currentMonthKey;
                  };
                  const fmtMonthKey = (key) => {
                    if (key === 'unknown') return 'Unknown Date';
                    const [y, m] = key.split('-');
                    return new Date(+y, +m-1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                  };
                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {monthKeys.map(monthKey => {
                        const monthDone = monthMap[monthKey];
                        const collapsed = isCollapsed(monthKey);
                        const isCurrent = monthKey === currentMonthKey;
                        return (
                          <div key={monthKey} style={{border:`1px solid ${isCurrent?"#2a3040":"#1a1d26"}`,borderRadius:10,overflow:"hidden"}}>
                            <button
                              onClick={() => toggleMonth(monthKey)}
                              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:isCurrent?"#13161f":"#0d0f15",border:"none",cursor:"pointer",textAlign:"left"}}
                            >
                              <span style={{fontSize:11,fontWeight:700,color:isCurrent?"#e8c547":"#4a5060",letterSpacing:"1.5px",textTransform:"uppercase",fontFamily:MONO,flex:1}}>
                                {fmtMonthKey(monthKey)}
                                {isCurrent && <span style={{marginLeft:8,fontSize:9,color:"#e8c54780",letterSpacing:"2px"}}>CURRENT</span>}
                              </span>
                              <span style={{fontSize:10,color:"#34d399",fontFamily:MONO,fontWeight:700,background:"#34d39918",border:"1px solid #34d39930",borderRadius:6,padding:"1px 8px"}}>{monthDone.length}</span>
                              <span style={{fontSize:11,color:"#3a4052",display:"inline-block",transform:collapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</span>
                            </button>
                            {!collapsed && (
                              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                                {["sun","moon"].map(type => {
                                  const group = monthDone.filter(d => d.type===type);
                                  if (!group.length) return null;
                                  const tc = tabColor(type);
                                  return (
                                    <div key={type} style={{borderTop:"1px solid #181c26"}}>
                                      <div style={{fontSize:9,fontWeight:700,color:tc,letterSpacing:"2px",textTransform:"uppercase",padding:"6px 14px 4px",opacity:0.7}}>{type==="sun"?"☀ Sun":"☽ Moon"} · {group.length}</div>
                                      <div style={{display:"flex",flexDirection:"column",gap:4,padding:"0 8px 8px"}}>
                                        {group.map(dl => {
                                          const course=COURSES.find(c=>c.id===dl.course);
                                          const chip=tagChip(dl.tag);
                                          const parentSun=dl.type==="moon"&&dl.parentSunId?deadlines.find(d=>d.id===dl.parentSunId):null;
                                          return (
              <div key={dl.id} style={{background:"#0f1117",border:"1px solid #2a2e38",borderLeft:`3px solid ${tc}`,borderRadius:"0 10px 10px 0",overflow:"hidden"}}>
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,opacity:0.75,cursor:"pointer"}} onClick={()=>setExpandedDl(e=>e===dl.id?null:dl.id)}>
                  <button onClick={e=>{e.stopPropagation();cycleStatus(dl.id);}} title="Mark incomplete"
                    style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${tc}`,background:tc,cursor:"pointer",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:13,fontWeight:600,color:"#7a8090",textDecoration:"line-through"}}>{dl.title}</span>
                      {chip&&<span style={{fontSize:9,fontWeight:700,color:chip.color,background:chip.color+"18",border:`1px solid ${chip.color}44`,borderRadius:4,padding:"1px 5px",letterSpacing:"0.5px",textTransform:"uppercase",flexShrink:0}}>{chip.label}</span>}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {parentSun&&<span style={{fontSize:10,color:"#e8c547",fontFamily:MONO,fontWeight:700,background:"#e8c54712",border:"1px solid #e8c54730",borderRadius:4,padding:"1px 6px"}}>☀ {parentSun.title}</span>}
                      {course&&<span style={{fontSize:10,color:course.color,fontFamily:MONO}}>{course.label}</span>}
                      <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</span>
                      {dl.repeat&&dl.repeat!=="none"&&<span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{repeatLabel(dl.repeat)}</span>}
                    </div>
                  </div>
                  {delDlTarget===dl.id?(
                    <div style={{display:"flex",flexDirection:"column",gap:5,minWidth:160}}>
                      {delDlStep==="pw"?(
                        <>
                          <input autoFocus type="password" value={delDlPw}
                            onChange={e=>{setDelDlPw(e.target.value);setDelDlErr(false);}}
                            onKeyDown={e=>{if(e.key==="Enter")submitDelDlPw();if(e.key==="Escape")cancelDelDl();}}
                            placeholder="password"
                            style={{background:"#0d0f14",border:`1px solid ${delDlErr?"#e85454":"#2a2e38"}`,borderRadius:5,color:"#d4d8e0",fontSize:11,fontFamily:MONO,padding:"4px 8px",outline:"none",width:"100%",boxSizing:"border-box"}}/>
                          {delDlErr&&<div style={{fontSize:10,color:"#e85454",fontFamily:MONO}}>incorrect</div>}
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                            <button onClick={submitDelDlPw} style={{flex:1,padding:"3px 0",background:"#2a2e38",border:"none",borderRadius:5,color:"#d4d8e0",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>next</button>
                          </div>
                        </>
                      ):(
                        <>
                          <div style={{fontSize:11,color:"#e8eaf0",fontFamily:MONO}}>delete permanently?</div>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                            <button onClick={confirmDelDl} style={{flex:1,padding:"3px 0",background:"#e85454",border:"none",borderRadius:5,color:"#fff",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ):(
                    <button onClick={e=>{e.stopPropagation();startDelDl(dl.id);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid #e8545422",background:"transparent",color:"#4a5060",cursor:"pointer",fontFamily:MONO,fontSize:11,flexShrink:0}}>✕</button>
                  )}
                </div>
                {expandedDl===dl.id&&(
                  <div style={{padding:"12px 14px 14px",borderTop:`1px solid ${tc}22`,display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                      <div><div style={fieldLabel}>Due</div><div style={{fontSize:12,color:"#d4d8e0",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</div></div>
                      {dl.completedAt&&<div><div style={fieldLabel}>Completed</div><div style={{fontSize:12,color:"#34d399",fontFamily:MONO}}>{dl.completedAt}</div></div>}
                      {dl.startedAt&&dl.completedAt&&<div><div style={fieldLabel}>Duration</div><div style={{fontSize:12,color:"#a78bfa",fontFamily:MONO}}>{(()=>{const days=Math.round((new Date(dl.completedAt)-new Date(dl.startedAt))/86400000);return days===0?"same day":`${days}d`;})()}</div></div>}
                      {dl.priority&&dl.priority!=="normal"&&<div><div style={fieldLabel}>Priority</div><div style={{fontSize:12,color:dl.priority==="high"?"#fb923c":"#60a5fa"}}>{dl.priority}</div></div>}
                      {dl.repeat&&dl.repeat!=="none"&&<div><div style={fieldLabel}>Repeat</div><div style={{fontSize:12,color:"#7eb8f7",fontFamily:MONO}}>{dl.repeat}</div></div>}
                    </div>
                    {dl.notes&&<div><div style={fieldLabel}>Notes</div><div style={{fontSize:12,color:"#9aa0b0",lineHeight:1.6}}>{dl.notes}</div></div>}
                    {dl.reflection&&<div><div style={fieldLabel}>Reflection</div><div style={{fontSize:12,color:"#34d39999",lineHeight:1.6,fontStyle:"italic"}}>"{dl.reflection}"</div></div>}
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
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
              })()
          ))}

          {/* Roadmap tab */}
          {isRoadmapTab && <RoadmapTab />}

          {/* Upcoming list */}
          {!isCompletedTab && !isRoadmapTab && sect(tab==="moon"?"☽ Moon — Subproblems":"☀ Sun — Upcoming",(
            <>
              {filtered.length===0
                ?<div style={{fontSize:13,color:"#4a5060",padding:"12px 0"}}>No upcoming deadlines. Click a day or use + Add.</div>
                :<div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {filtered.map(dl=>{
                      const days=getDaysUntil(dl.date);
                      const tier=urgencyTier(days);
                      const uc=tier.color;
                      const course=COURSES.find(c=>c.id===dl.course);
                      const chip=tagChip(dl.tag);
                      const parentSun=dl.type==="moon"&&dl.parentSunId?deadlines.find(d=>d.id===dl.parentSunId):null;
                      return(
                        <div key={dl.id} style={{background:"#0f1117",border:`1px solid ${uc}${tier.bold?"55":"22"}`,borderLeft:`${tier.bold?4:3}px solid ${uc}`,borderRadius:"0 10px 10px 0",overflow:"hidden"}}>
                          {(()=>{
                            const total=dl.createdAt?Math.max(1,Math.ceil((new Date(dl.date)-new Date(dl.createdAt))/86400000)):Math.max(1,getDaysUntil(dl.date)+7);
                            const remaining=Math.max(0,getDaysUntil(dl.date));
                            const pct=Math.min(100,Math.round((1-remaining/total)*100));
                            if(pct<=0) return null;
                            return<div style={{height:2,background:"#1a1f2e",width:"100%"}}><div style={{height:"100%",width:`${pct}%`,background:pct>=90?`linear-gradient(90deg,#ff4444,#ff6b6b)`:pct>=60?`linear-gradient(90deg,${uc},${uc}aa)`:uc,transition:"width 0.4s",opacity:0.7}}/></div>;
                          })()}
                          <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,background:tier.bold?uc+"08":"transparent"}}>
                            <button onClick={e=>{e.stopPropagation();cycleStatus(dl.id);}}
                              title={dl.status==="inprogress"?"Mark complete":"Mark in progress"}
                              style={{width:18,height:18,borderRadius:"50%",cursor:"pointer",flexShrink:0,border:`2px solid ${dl.status==="inprogress"?"#7eb8f7":uc}`,background:dl.status==="inprogress"?"#7eb8f722":"transparent",position:"relative",transition:"all 0.2s"}}>
                              {dl.status==="inprogress"&&<div style={{position:"absolute",inset:2,borderRadius:"50%",background:"#7eb8f7",opacity:0.6}}/>}
                            </button>
                            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>setExpandedDl(e=>e===dl.id?null:dl.id)}>
                              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                                <span style={{fontSize:13,fontWeight:tier.bold?700:600,color:tier.bold?"#f0f0f0":"#d4d8e0"}}>{dl.title}</span>
                                {chip&&<span
                                  title="Show on calendar"
                                  onClick={e=>{
                                    e.stopPropagation();
                                    const d=new Date(dl.date+"T00:00:00");
                                    setCalDate(new Date(d.getFullYear(),d.getMonth(),1));
                                    setSelectedCalDay(dl.date);
                                    setTimeout(()=>calRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50);
                                  }}
                                  style={{fontSize:9,fontWeight:700,color:chip.color,background:chip.color+"18",border:`1px solid ${chip.color}44`,borderRadius:4,padding:"1px 5px",letterSpacing:"0.5px",textTransform:"uppercase",flexShrink:0,cursor:"pointer"}}>{chip.label} ↑</span>}
                              </div>
                              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                                {parentSun&&<span style={{fontSize:10,color:"#e8c547",fontFamily:MONO,fontWeight:700,background:"#e8c54712",border:"1px solid #e8c54730",borderRadius:4,padding:"1px 6px"}}>☀ {parentSun.title}</span>}
                                {course&&<span style={{fontSize:10,color:course.color,fontFamily:MONO}}>{course.label}</span>}
                                <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</span>
                                {dl.status==="inprogress"&&dl.startedAt&&<span style={{fontSize:10,color:"#7eb8f7",fontFamily:MONO}}>● started {dl.startedAt}</span>}
                                {!dl.status&&dl.id&&(()=>{const next=nextTierInfo(getDaysUntil(dl.date));return next?<span style={{fontSize:10,color:"#3a4052",fontFamily:MONO,fontStyle:"italic"}}>in {next.name} {next.daysUntil}d</span>:null;})()}
                                {dl.timeEst&&<span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>· {dl.timeEst}</span>}
                                {dl.repeat&&dl.repeat!=="none"&&<span style={{fontSize:10,color:"#7eb8f7",fontFamily:MONO}}>{repeatLabel(dl.repeat)}</span>}
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                              {!dl.status&&days<=7&&days>=0&&<div title="Not started yet" style={{width:6,height:6,borderRadius:"50%",background:"#fb923c",flexShrink:0,animation:"nudgePulse 1.8s ease-in-out infinite"}}/>}
                              <div
                                title="Show on calendar"
                                onClick={e=>{
                                  e.stopPropagation();
                                  const d=new Date(dl.date+"T00:00:00");
                                  setCalDate(new Date(d.getFullYear(),d.getMonth(),1));
                                  setSelectedCalDay(dl.date);
                                  setTimeout(()=>calRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50);
                                }}
                                style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:uc,background:uc+"18",border:`1px solid ${uc}44`,borderRadius:6,padding:"3px 8px",letterSpacing:tier.bold?"0.5px":0,cursor:"pointer"}}>{urgencyLabel(days)}</div>
                              {tab==="moon"&&days<0&&(
                                <button
                                  onClick={e=>{e.stopPropagation();setConfirmStatus({id:dl.id,action:"pushToday",label:"Push deadline to today?"});}}
                                  title="Push to today"
                                  style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:"#a78bfa",background:"#a78bfa18",border:"1px solid #a78bfa44",borderRadius:6,padding:"3px 8px",cursor:"pointer",flexShrink:0,letterSpacing:"0.5px"}}>
                                  → today
                                </button>
                              )}
                            </div>
                            {delDlTarget===dl.id?(
                              <div style={{display:"flex",flexDirection:"column",gap:5,minWidth:160}} onClick={e=>e.stopPropagation()}>
                                {delDlStep==="pw"?(
                                  <>
                                    <input autoFocus type="password" value={delDlPw}
                                      onChange={e=>{setDelDlPw(e.target.value);setDelDlErr(false);}}
                                      onKeyDown={e=>{if(e.key==="Enter")submitDelDlPw();if(e.key==="Escape")cancelDelDl();}}
                                      placeholder="password"
                                      style={{background:"#0d0f14",border:`1px solid ${delDlErr?"#e85454":"#2a2e38"}`,borderRadius:5,color:"#d4d8e0",fontSize:11,fontFamily:MONO,padding:"4px 8px",outline:"none",width:"100%",boxSizing:"border-box"}}/>
                                    {delDlErr&&<div style={{fontSize:10,color:"#e85454",fontFamily:MONO}}>incorrect</div>}
                                    <div style={{display:"flex",gap:5}}>
                                      <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                                      <button onClick={submitDelDlPw} style={{flex:1,padding:"3px 0",background:"#2a2e38",border:"none",borderRadius:5,color:"#d4d8e0",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>next</button>
                                    </div>
                                  </>
                                ):(
                                  <>
                                    <div style={{fontSize:11,color:"#e8eaf0",fontFamily:MONO}}>delete permanently?</div>
                                    <div style={{display:"flex",gap:5}}>
                                      <button onClick={cancelDelDl} style={{flex:1,padding:"3px 0",background:"none",border:"1px solid #2a2e38",borderRadius:5,color:"#7a8090",fontSize:10,fontFamily:MONO,cursor:"pointer"}}>cancel</button>
                                      <button onClick={confirmDelDl} style={{flex:1,padding:"3px 0",background:"#e85454",border:"none",borderRadius:5,color:"#fff",fontSize:10,fontFamily:MONO,fontWeight:700,cursor:"pointer"}}>delete</button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ):(
                              <button onClick={e=>{e.stopPropagation();startDelDl(dl.id);}} style={{background:"transparent",border:"none",color:"#3a4052",cursor:"pointer",fontSize:13,padding:0}}
                                onMouseEnter={e=>{e.currentTarget.style.color="#e85454";}}
                                onMouseLeave={e=>{e.currentTarget.style.color="#3a4052";}}>✕</button>
                            )}
                          </div>
                          {(()=>{
                            const allLinkedMoons=dl.type==="sun"?deadlines.filter(d=>d.type==="moon"&&d.parentSunId===dl.id):[];
                            if(!allLinkedMoons.length) return null;
                            const pendingMoons=allLinkedMoons.filter(m=>!m.done);
                            const doneMoons=allLinkedMoons.filter(m=>m.done);
                            return(
                              <div style={{borderTop:`1px solid #a78bfa22`,padding:"8px 14px 10px",background:"#a78bfa06"}}>
                                <div style={{fontSize:9,fontWeight:700,color:"#a78bfa",letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>☽ Subproblems · {pendingMoons.length} pending · {doneMoons.length} done</div>
                                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                  {pendingMoons.map(m=>{
                                    const md=getDaysUntil(m.date);
                                    const mt=urgencyTier(md);
                                    const mc=COURSES.find(c=>c.id===m.course);
                                    return(
                                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"#a78bfa0a",borderRadius:6,border:"1px solid #a78bfa18"}}>
                                        <span style={{fontSize:11,color:"#a78bfa",flexShrink:0}}>☽</span>
                                        <span style={{fontSize:12,color:m.status==="inprogress"?"#c4b5fd":"#9aa0b0",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</span>
                                        {mc&&<span style={{fontSize:10,color:mc.color,fontFamily:MONO,flexShrink:0}}>{mc.label}</span>}
                                        <span style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:mt.color,background:mt.color+"18",borderRadius:4,padding:"2px 6px",flexShrink:0}}>{urgencyLabel(md)}</span>
                                        {m.status==="inprogress"&&<span style={{width:6,height:6,borderRadius:"50%",background:"#7eb8f7",flexShrink:0,display:"inline-block"}}/>}
                                      </div>
                                    );
                                  })}
                                  {doneMoons.map(m=>{
                                    const mc=COURSES.find(c=>c.id===m.course);
                                    return(
                                      <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:"#34d39908",borderRadius:6,border:"1px solid #34d39922",opacity:0.75}}>
                                        <span style={{fontSize:11,color:"#34d399",flexShrink:0}}>✓</span>
                                        <span style={{fontSize:12,color:"#4a6055",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:"line-through"}}>{m.title}</span>
                                        {mc&&<span style={{fontSize:10,color:mc.color+"88",fontFamily:MONO,flexShrink:0}}>{mc.label}</span>}
                                        {m.completedAt&&<span style={{fontSize:10,color:"#34d39966",fontFamily:MONO,flexShrink:0}}>done {m.completedAt}</span>}
                                        <span style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:"#34d399",background:"#34d39918",borderRadius:4,padding:"2px 6px",flexShrink:0}}>DONE</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                          {expandedDl===dl.id&&(
                            <div style={{padding:"12px 14px 14px",borderTop:`1px solid ${uc}22`,display:"flex",flexDirection:"column",gap:10}}>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                <div><div style={fieldLabel}>Title</div><input value={dl.title} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,title:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}/></div>
                                <div><div style={fieldLabel}>Course</div>
                                  <select value={dl.course} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,course:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    <option value="">No course</option>
                                    {COURSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                                  </select>
                                </div>
                                <div><div style={fieldLabel}>Date</div><input type="date" value={dl.date} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,date:e.target.value}:d).sort((a,b)=>a.date.localeCompare(b.date)))} onClick={e=>e.target.showPicker?.()} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}/></div>
                                <div><div style={fieldLabel}>Status</div>
                                  <select value={dl.status==="inprogress"?"inprogress":"none"} onChange={e=>{
                                    const next=e.target.value;
                                    setDeadlines(p=>p.map(d=>d.id===dl.id
                                      ? next==="inprogress"
                                        ? {...d,status:"inprogress",startedAt:d.startedAt||localDateStr()}
                                        : {...d,status:"none",startedAt:undefined}
                                      : d));
                                  }} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    <option value="none">Not started</option>
                                    <option value="inprogress">In progress</option>
                                  </select>
                                </div>
                                <div><div style={fieldLabel}>Type</div>
                                  <select value={dl.type} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,type:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    <option value="sun">☀ Sun</option>
                                    <option value="moon">☽ Moon</option>
                                  </select>
                                </div>
                                <div><div style={fieldLabel}>Priority</div>
                                  <select value={dl.priority} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,priority:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                  </select>
                                </div>
                                {dl.type==="moon"&&(
                                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,fontWeight:700,color:"#e8c547",letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>Contributing to ☀ Sun</div>
                                    <select value={dl.parentSunId||""} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,parentSunId:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px",borderColor:"#e8c54740"}}>
                                      <option value="">— No parent Sun —</option>
                                      {deadlines.filter(d=>d.type==="sun"&&!d.done).map(s=><option key={s.id} value={s.id}>{s.title} · {s.date}</option>)}
                                    </select>
                                  </div>
                                )}
                                <div><div style={fieldLabel}>Repeat</div>
                                  <select value={dl.repeat||"none"} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,repeat:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    {REPEAT_OPTIONS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
                                  </select>
                                </div>
                                <div><div style={fieldLabel}>Tag</div>
                                  <select value={dl.tag||""} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,tag:e.target.value}:d))} style={{...inputStyle,fontSize:12,padding:"5px 8px"}}>
                                    {TAGS.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div><div style={fieldLabel}>Notes</div><textarea value={dl.notes||""} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,notes:e.target.value}:d))} placeholder="Add notes…" style={{...inputStyle,fontSize:12,padding:"6px 8px",resize:"vertical",minHeight:52,width:"100%",boxSizing:"border-box"}}/></div>
                              <div><div style={fieldLabel}>Time estimate</div><input value={dl.timeEst||""} onChange={e=>setDeadlines(p=>p.map(d=>d.id===dl.id?{...d,timeEst:e.target.value}:d))} placeholder="e.g. ~2 hrs, 30 min…" style={{...inputStyle,fontSize:12,padding:"5px 8px"}}/></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
              }
            </>
          ),
          <button
            onClick={()=>exportToCalendar(filtered,COURSES,tab)}
            title={`Export ${tab === "sun" ? "☀ Sun" : "☽ Moon"} deadlines to .ics`}
            style={{padding:"4px 12px",borderRadius:6,border:"1px solid #7eb8f755",
              background:"#7eb8f710",color:"#7eb8f7",
              fontFamily:"'DM Mono','Fira Code',monospace",
              fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:"0.5px"
            }}
          >↓ .ics</button>
          )}

        </div>
      </div>
    </>
  );
}

const inputStyle = {
  background:"#0f1117", border:"1px solid #2a2e38", borderRadius:8,
  color:"#d4d8e0", fontFamily:"'Inter', sans-serif", fontSize:13,
  padding:"8px 12px", outline:"none", width:"100%", boxSizing:"border-box",
};

const fieldLabel = {
  fontSize:9, fontWeight:700, color:"#4a5060",
  letterSpacing:"1px", textTransform:"uppercase", marginBottom:4,
};

const navBtn = {
  background:"transparent", border:"none", color:"#7a8090",
  cursor:"pointer", fontSize:18, padding:"0 4px", lineHeight:1,
}