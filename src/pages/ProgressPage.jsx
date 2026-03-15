// src/pages/ProgressPage.jsx
import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { COURSES, SKILL_TREE, ALL_SKILLS, TOTAL_SKILLS, MAX_LEVEL, MAX_XP, DIFF_LABELS, LEVEL_META, SKILLS_BY_COURSE, DEFAULT_TIERS } from "../data/skills";
import { SKILL_LEVELS as INITIAL_SKILL_LEVELS, COURSE_TIERS as INITIAL_COURSE_TIERS } from "../data/memory-progress";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

async function persistProgress(skillLevels, courseTiers) {
  const content = `// src/data/memory-progress.js
// Runtime persistence for skill levels and course tiers — auto-saved by ProgressPage on every change.
// Do not edit manually while the app is open.
// Last updated: ${new Date().toISOString()}

export const SKILL_LEVELS = ${JSON.stringify(skillLevels, null, 2)};

export const COURSE_TIERS = ${JSON.stringify(courseTiers, null, 2)};
`;
  try {
    if (IS_TAURI) {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("save_progress", { content });
    } else {
      await fetch("/api/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    }
  } catch(e) { console.error("[persist] progress FAILED:", e); }
}

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

// ── Radar chart ───────────────────────────────────────────────────────────────
function RadarChart({ skillLevels }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const draw = () => {
      canvasRef.current?._chart?.destroy();
      // Use top-level categories for radar
      const cats = [
        { label: "Algorithms",  color: "#4ecdc4", ids: ALL_SKILLS.filter(s => s.course === "algos") },
        { label: "Automata",    color: "#ff6b9d", ids: ALL_SKILLS.filter(s => s.course === "automata") },
        { label: "Data Struct", color: "#e8c547", ids: ALL_SKILLS.filter(s => s.course === "datastruct") },
        { label: "Systems",     color: "#fb923c", ids: ALL_SKILLS.filter(s => ["comporg","opsystems"].includes(s.course)) },
        { label: "Databases",   color: "#f472b6", ids: ALL_SKILLS.filter(s => s.course === "databases") },
        { label: "Linear Alg",  color: "#60a5fa", ids: ALL_SKILLS.filter(s => s.course === "linear") },
        { label: "C++ / Py",    color: "#fb7185", ids: ALL_SKILLS.filter(s => ["cpp","python"].includes(s.course)) },
        { label: "Discrete",    color: "#a78bfa", ids: ALL_SKILLS.filter(s => s.course === "discrete") },
      ];
      const pcts = cats.map(c => c.ids.length > 0
        ? Math.round((c.ids.reduce((a,s) => a + (skillLevels[s.id]?.level||0)/MAX_LEVEL, 0) / c.ids.length) * 100)
        : 0
      );
      canvasRef.current._chart = new window.Chart(canvasRef.current, {
        type: "radar",
        data: {
          labels: cats.map(c => c.label),
          datasets: [
            { data: pcts, backgroundColor: "#a78bfa18", borderColor: "#a78bfa", borderWidth: 2, pointBackgroundColor: cats.map(c => c.color), pointRadius: 5 },
            { data: cats.map(() => 100), backgroundColor: "transparent", borderColor: "#2a2e38", borderWidth: 1, borderDash: [4,4], pointRadius: 0 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: "#1e2130" }, pointLabels: { color: "#7a8090", font: { size: 10, family: "Inter, sans-serif", weight: "600" } }, angleLines: { color: "#1e2130" } } },
        },
      });
    };
    if (!window.Chart) { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"; s.onload = draw; document.head.appendChild(s); }
    else draw();
    const canvas = canvasRef.current;
    return () => canvas?._chart?.destroy();
  }, [skillLevels]);
  return <div style={{ position: "relative", width: "100%", height: 220 }}><canvas ref={canvasRef} /></div>;
}

// ── Projection chart ──────────────────────────────────────────────────────────
function ProjectionChart({ skillLevels }) {
  const canvasRef = useRef(null);
  const now = new Date();
  const allEntries = Object.values(skillLevels).flatMap(s => s.log || []);
  const thirtyAgo = new Date(now); thirtyAgo.setDate(now.getDate() - 30);
  const recentPts = allEntries.filter(e => new Date(e.ts) >= thirtyAgo).reduce((a, e) => a + (e.to - e.from), 0);
  const dailyRate = Math.max(recentPts / 30, 0.05);
  const totalPts  = Object.values(skillLevels).reduce((a, s) => a + (s.level || 0), 0);
  const maxPts    = TOTAL_SKILLS * MAX_LEVEL;
  const daysLeft  = dailyRate > 0 ? Math.ceil((maxPts - totalPts) / dailyRate) : null;
  const masteryDate = daysLeft ? (() => { const d = new Date(now); d.setDate(now.getDate() + daysLeft); return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; })() : null;

  useEffect(() => {
    if (!canvasRef.current) return;
    const sorted = [...allEntries].sort((a,b) => new Date(a.ts) - new Date(b.ts));
    const pastLabels = [], pastData = [];
    for (let w = 8; w >= 0; w--) {
      const d = new Date(now); d.setDate(now.getDate() - w * 7);
      pastLabels.push(`${MONTHS[d.getMonth()]} ${d.getDate()}`);
      pastData.push(sorted.filter(e => new Date(e.ts) <= d).reduce((a,e) => a + (e.to - e.from), 0));
    }
    const futLabels = [], futData = [];
    for (let w = 1; w <= 12; w++) {
      const d = new Date(now); d.setDate(now.getDate() + w * 7);
      futLabels.push(`${MONTHS[d.getMonth()]} ${d.getDate()}`);
      futData.push(Math.min(totalPts + dailyRate * w * 7, maxPts));
    }
    const allLabels  = [...pastLabels, ...futLabels];
    const pastFull   = [...pastData, ...Array(12).fill(null)];
    const futureFull = [...Array(8).fill(null), totalPts, ...futData];
    const draw = () => {
      canvasRef.current?._chart?.destroy();
      canvasRef.current._chart = new window.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: allLabels,
          datasets: [
            { label: "Actual",    data: pastFull,   borderColor: "#a78bfa", backgroundColor: "#a78bfa18", borderWidth: 2, pointRadius: 3, pointBackgroundColor: "#a78bfa", fill: true, tension: 0.3, spanGaps: false },
            { label: "Projected", data: futureFull, borderColor: "#a78bfa", backgroundColor: "#a78bfa08", borderWidth: 2, borderDash: [6,4], pointRadius: 0, fill: true, tension: 0.3, spanGaps: false },
            { label: "Max",       data: allLabels.map(() => maxPts), borderColor: "#2a2e38", borderWidth: 1, borderDash: [3,3], pointRadius: 0, fill: false },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${Math.round(ctx.raw||0)} / ${maxPts} levels` } } },
          scales: {
            x: { ticks: { color: "#4a5060", font: { size: 10, family: MONO }, maxRotation: 45, autoSkip: true, maxTicksLimit: 8 }, grid: { color: "#1e2130" } },
            y: { min: 0, max: maxPts, ticks: { color: "#4a5060", font: { size: 10, family: MONO }, stepSize: Math.ceil(maxPts/5) }, grid: { color: "#1e2130" } },
          },
        },
      });
    };
    if (!window.Chart) { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"; s.onload = draw; document.head.appendChild(s); }
    else draw();
    const canvas = canvasRef.current;
    return () => canvas?._chart?.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillLevels]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, padding: "10px 14px", flex: 1, minWidth: 100 }}>
          <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Daily rate</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#4ecdc4", fontFamily: MONO }}>{dailyRate.toFixed(2)} <span style={{ fontSize: 10, color: "#4a5060" }}>lvl/day</span></div>
        </div>
        <div style={{ background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, padding: "10px 14px", flex: 1, minWidth: 100 }}>
          <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Total progress</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", fontFamily: MONO }}>{totalPts} <span style={{ fontSize: 10, color: "#4a5060" }}>/ {maxPts}</span></div>
        </div>
        {masteryDate && (
          <div style={{ background: "#0f1117", border: "1px solid #34d39933", borderRadius: 8, padding: "10px 14px", flex: 2, minWidth: 160 }}>
            <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Full mastery</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#34d399", fontFamily: MONO }}>{masteryDate} <span style={{ fontSize: 10, color: "#4a5060" }}>({daysLeft}d)</span></div>
          </div>
        )}
      </div>
      <div style={{ position: "relative", width: "100%", height: 200 }}><canvas ref={canvasRef} /></div>
    </div>
  );
}

// ── XP bars ───────────────────────────────────────────────────────────────────
function XPBars({ skillLevels }) {
  const totalXP = Object.values(skillLevels).reduce((a, s) => a + (s.level || 0) * 200, 0);
  return (
    <div>
      {COURSES.map(c => {
        const cs = ALL_SKILLS.filter(s => s.course === c.id);
        if (!cs.length) return null;
        const total = cs.reduce((a, s) => a + (skillLevels[s.id]?.level || 0), 0);
        const max   = cs.length * MAX_LEVEL;
        const pct   = Math.round((total / max) * 100);
        const lvl   = Math.floor(total / cs.length) + 1;
        return (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 100, fontSize: 10, fontWeight: 600, color: "#7a8090", textAlign: "right", flexShrink: 0 }}>{c.label}</div>
            <div style={{ flex: 1, height: 7, background: "#1e2130", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: c.color, borderRadius: 4, transition: "width 0.8s" }} />
            </div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: c.color, width: 44, flexShrink: 0 }}>LVL {lvl}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #1e2130", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO }}>TOTAL XP</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#e8c547", fontFamily: MONO }}>{totalXP.toLocaleString()} <span style={{ fontSize: 10, color: "#4a5060" }}>/ {MAX_XP.toLocaleString()}</span></span>
      </div>
    </div>
  );
}

function StudyHeatmap({ studyLog }) {
  const TOTAL_WEEKS = 36; // wide enough that today (~18 weeks in) sits near center
  const PAST_WEEKS  = 18; // weeks before today's week
  const today = new Date(2026, 2, 14); // Mar 14 2026 — local time, not UTC
  const todayLabel = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const intensities = ["#1a1f2e","#4ecdc433","#4ecdc466","#4ecdc499","#4ecdc4"];
  const DAY_LABELS  = ["S","M","T","W","T","F","S"]; // row 0=Sun … 6=Sat
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Columns start on Sunday. S M T W T F S display order.
  const todayDow = today.getDay(); // 0=Sun,1=Mon…
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - todayDow);
  const gridStart = new Date(thisSunday);
  gridStart.setDate(thisSunday.getDate() - PAST_WEEKS * 7);

  const cols = [];
  const monthLabels = [];
  let lastMonth = null;

  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const col = [];
    let colMonthLabel = null;

    const colSunday = new Date(gridStart);
    colSunday.setDate(gridStart.getDate() + w * 7);
    const colMonth = colSunday.getMonth();
    const colYear  = colSunday.getFullYear();

    // Month label fires on the column whose Sunday is the first Sunday of that month
    if (colMonth !== lastMonth) {
      colMonthLabel = MONTH_NAMES[colMonth] + " '" + String(colYear).slice(2);
      lastMonth = colMonth;
    }

    // Find the day-of-week that the 1st of colMonth falls on (for leading dead cells)
    const firstOfMonth = new Date(colYear, colMonth, 1);
    const firstDow = firstOfMonth.getDay(); // 0=Sun…6=Sat — leading dead cells before this dow

    for (let dow = 0; dow < 7; dow++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + dow);
      const key = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      // Trailing dead: day spills into next month
      const isTrailingDead = date.getMonth() !== colMonth || date.getFullYear() !== colYear;
      // Leading dead: first column of a month, dow is before the 1st
      const isLeadingDead = !!colMonthLabel && dow < firstDow;
      const isDead = isTrailingDead || isLeadingDead;
      const level = (isFuture || isDead) ? 0 : Math.min(studyLog[key] || 0, 4);
      col[dow] = (
        <div key={dow} title={isDead ? "" : key} style={{
          width: 11, height: 11,
          background: isDead ? "transparent" : isFuture ? "#0d1117" : intensities[level],
          borderRadius: 2,
          opacity: isDead ? 0 : isFuture ? 0.25 : 1,
          cursor: "default",
        }} />
      );
    }

    cols.push(col);
    monthLabels.push(colMonthLabel);
  }

  let streak = 0; const sd = new Date(today);
  while (studyLog[sd.toISOString().slice(0, 10)]) { streak++; sd.setDate(sd.getDate() - 1); }

  const CELL = 11, GAP = 3;

  return (
    <div>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#4a5060" }}>Last {PAST_WEEKS} weeks &nbsp;·&nbsp; <span style={{ color: "#7a8090" }}>{todayLabel}</span></span>
        {streak > 0 && <span style={{ fontSize: 11, fontFamily: MONO, color: "#4ecdc4", fontWeight: 700 }}>✦ {streak} day streak</span>}
      </div>

      {/* grid with day-labels on left */}
      <div style={{ display: "flex", gap: 6 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, paddingTop: 18 }}>
          {DAY_LABELS.map((lbl, i) => (
            <div key={i} style={{ width: 8, height: CELL, fontSize: 8, color: "#4a5060", lineHeight: `${CELL}px`, textAlign: "right" }}>
              {lbl}
            </div>
          ))}
        </div>

        {/* Month labels + cell grid */}
        <div style={{ overflowX: "hidden" }}>
          {/* Month label row — one label per column, only shown on month-start cols */}
          <div style={{ display: "flex", marginBottom: 4, height: 14 }}>
            {monthLabels.map((ml, i) => {
              const colW = CELL + GAP;
              const isMonthStart = ml && i > 0;
              return (
                <div key={i} style={{
                  width: i === 0 ? colW : isMonthStart ? colW + 20 : colW,
                  flexShrink: 0,
                  fontSize: 9, color: "#7a8090",
                  whiteSpace: "nowrap", overflow: "visible",
                  paddingLeft: isMonthStart ? 10 : 0,
                }}>
                  {ml || ""}
                </div>
              );
            })}
          </div>

          {/* Cell columns */}
          <div style={{ display: "flex" }}>
            {cols.map((col, w) => {
              const isMonthStart = monthLabels[w] && w > 0;
              return (
                <div key={w} style={{ display: "flex", flexDirection: "column", gap: GAP, marginLeft: isMonthStart ? 20 : (w > 0 ? GAP : 0), position: "relative" }}>

                  {col}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4a5060" }}>Less</span>
        {intensities.map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />)}
        <span style={{ fontSize: 10, color: "#4a5060" }}>More</span>
      </div>
    </div>
  );
}

// ── Course skill group ────────────────────────────────────────────────────────

// ── Course skill group ────────────────────────────────────────────────────────
function CourseSkillGroup({ course, skills, skillLevels, onLevelChange, onDeleteLog, tier, onCycleTier }) {
  const [expanded, setExpanded]       = useState(false);
  const [expandedSkill, setExpanded2] = useState(null);
  const [showTierDrop, setShowTierDrop] = useState(false);
  const [delTarget, setDelTarget]     = useState(null); // { skillId, entryIndex }
  const [delStep,   setDelStep]       = useState("pw"); // "pw" | "confirm"
  const [pwInput,   setPwInput]       = useState("");
  const [pwError,   setPwError]       = useState(false);

  function startDel(skillId, entryIndex) { setDelTarget({ skillId, entryIndex }); setDelStep("pw"); setPwInput(""); setPwError(false); }
  function cancelDel() { setDelTarget(null); setPwInput(""); setPwError(false); }
  function submitPw() {
    if (pwInput === "Jesiah") { setPwError(false); setDelStep("confirm"); }
    else { setPwError(true); setPwInput(""); }
  }
  function confirmDel() { onDeleteLog(delTarget.skillId, delTarget.entryIndex); cancelDel(); }

  const masteredCount = skills.filter(s => (skillLevels[s.id]?.level || 0) === MAX_LEVEL).length;
  const totalLevels   = skills.reduce((a, s) => a + (skillLevels[s.id]?.level || 0), 0);
  const pct           = Math.round((totalLevels / (skills.length * MAX_LEVEL)) * 100);

  const TIER_META = {
    current:  { label: "Current",  color: "#4ecdc4", icon: "◈" },
    research: { label: "Research", color: "#a78bfa", icon: "◉" },
    ambition: { label: "Ambition", color: "#fb923c", icon: "◇" },
  };
  const tm = TIER_META[tier] || TIER_META.ambition;

  const diffGroups = [1,2,3,4]
    .map(d => ({ diff: d, label: DIFF_LABELS[d], skills: skills.filter(s => s.diff === d) }))
    .filter(g => g.skills.length > 0);

  return (
    <div style={{ background: "#1a1f2e", border: `1px solid ${course.color}22`, borderRadius: 12, overflow: "visible", marginBottom: 10, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 }}>

        {/* Tier badge — click to open dropdown */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); setShowTierDrop(v => !v); }} style={{
            padding: "3px 9px", borderRadius: 5,
            border: `1px solid ${tm.color}44`, background: tm.color + "18",
            color: tm.color, cursor: "pointer", fontFamily: MONO,
            fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {tm.icon} {tm.label} <span style={{ fontSize: 8, opacity: 0.7 }}>▾</span>
          </button>

          {showTierDrop && (
            <>
              {/* Click-away overlay */}
              <div onClick={() => setShowTierDrop(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                background: "#1e2130", border: "1px solid #2a2e38", borderRadius: 8,
                padding: 6, zIndex: 100, minWidth: 130,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {Object.entries(TIER_META).map(([key, meta]) => (
                  <button key={key} onClick={e => { e.stopPropagation(); onCycleTier(key); setShowTierDrop(false); }} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: tier === key ? meta.color + "22" : "transparent",
                    color: tier === key ? meta.color : "#7a8090",
                    fontFamily: FONT, fontSize: 12, fontWeight: 600, textAlign: "left",
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: 11 }}>{meta.icon}</span>
                    {meta.label}
                    {tier === key && <span style={{ marginLeft: "auto", fontSize: 10, color: meta.color }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Course info + expand */}
        <button onClick={() => setExpanded(v => !v)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: course.color, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#d4d8e0", marginBottom: 4 }}>{course.label}</div>
            <div style={{ height: 4, background: "#2a2e38", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: course.color, borderRadius: 2, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ fontSize: 11, fontFamily: MONO, color: course.color, flexShrink: 0 }}>{masteredCount}/{skills.length}</div>
          <div style={{ fontSize: 14, color: "#4a5060", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "none" }}>›</div>
        </button>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          {diffGroups.map(group => (
            <div key={group.diff} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px" }}>{group.label}</div>
                <div style={{ flex: 1, height: 1, background: "#2a2e38" }} />
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: group.diff }, (_, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: course.color, opacity: 0.4 + i * 0.2 }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {group.skills.map(skill => {
                  const level = skillLevels[skill.id]?.level || 0;
                  const meta  = LEVEL_META[level];
                  const isOpen = expandedSkill === skill.id;
                  const log   = skillLevels[skill.id]?.log || [];
                  return (
                    <div key={skill.id} style={{ background: "#0f1117", border: `1px solid ${meta.color}33`, borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => setExpanded2(isOpen ? null : skill.id)} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                          {Array.from({ length: MAX_LEVEL }, (_, i) => (
                            <div key={i} style={{ width: 14, height: 5, borderRadius: 2, background: i < level ? LEVEL_META[i+1].color : "#2a2e38" }} />
                          ))}
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: level > 0 ? "#d4d8e0" : "#5a6070" }}>{skill.label}</span>
                        </div>
                        <span style={{ fontSize: 10, color: meta.color, fontFamily: MONO, fontWeight: 700, flexShrink: 0 }}>{meta.label}</span>
                        <span style={{ fontSize: 12, color: "#4a5060", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", flexShrink: 0 }}>›</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #1a1f2e" }}>
                          <div style={{ display: "flex", gap: 6, marginTop: 12, marginBottom: 12 }}>
                            {level > 0 && (
                              <button onClick={() => onLevelChange(skill, level - 1)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #2a2e38", background: "transparent", color: "#4a5060", cursor: "pointer", fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>▼ {LEVEL_META[level-1].label}</button>
                            )}
                            {level < MAX_LEVEL && (
                              <button onClick={() => onLevelChange(skill, level + 1)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${LEVEL_META[level+1].color}55`, background: LEVEL_META[level+1].bg, color: LEVEL_META[level+1].color, cursor: "pointer", fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>▲ Level up to {LEVEL_META[level+1].label}</button>
                            )}
                            {level === MAX_LEVEL && (
                              <div style={{ fontSize: 12, color: "#34d399", fontFamily: MONO, padding: "6px 0" }}>✓ Fully mastered</div>
                            )}
                          </div>
                          {log.length > 0 && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Progress log</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {[...log].reverse().map((entry, i) => {
                                  const realIdx = log.length - 1 - i;
                                  const isDeleting = delTarget?.skillId === skill.id && delTarget?.entryIndex === realIdx;
                                  return (
                                  <div key={i} style={{ background: "#161920", borderRadius: 8, padding: "8px 12px", borderLeft: `2px solid ${LEVEL_META[entry.to]?.color || "#4a5060"}` }}>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                                      <span style={{ fontSize: 10, color: LEVEL_META[entry.from]?.color, fontFamily: MONO }}>{LEVEL_META[entry.from]?.label}</span>
                                      <span style={{ fontSize: 10, color: "#4a5060" }}>→</span>
                                      <span style={{ fontSize: 10, color: LEVEL_META[entry.to]?.color, fontFamily: MONO, fontWeight: 700 }}>{LEVEL_META[entry.to]?.label}</span>
                                      <span style={{ fontSize: 10, color: "#3a4052", marginLeft: "auto", fontFamily: MONO }}>{new Date(entry.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                      {!isDeleting && <button onClick={() => startDel(skill.id, realIdx)} style={{ background: "none", border: "none", color: "#3a4052", cursor: "pointer", fontSize: 11, padding: "0 2px", fontFamily: MONO }} title="delete entry">✕</button>}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#5a6070", fontStyle: "italic", lineHeight: 1.5 }}>"{entry.note}"</div>
                                    {isDeleting && (
                                      <div style={{ marginTop: 8 }}>
                                        {delStep === "pw" ? (
                                          <>
                                            <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 5, letterSpacing: "1px" }}>password required</div>
                                            <input autoFocus type="password" value={pwInput}
                                              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                                              onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDel(); }}
                                              placeholder="password"
                                              style={{ width: "100%", boxSizing: "border-box", background: "#0d0f14", border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`, borderRadius: 5, color: "#d4d8e0", fontSize: 12, fontFamily: MONO, padding: "5px 8px", outline: "none", marginBottom: 5 }}
                                            />
                                            {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 5 }}>incorrect</div>}
                                            <div style={{ display: "flex", gap: 6 }}>
                                              <button onClick={cancelDel} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                                              <button onClick={submitPw} style={{ flex: 1, padding: "4px 0", background: "#2a2e38", border: "none", borderRadius: 5, color: "#d4d8e0", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 8 }}>delete this entry? level will revert.</div>
                                            <div style={{ display: "flex", gap: 6 }}>
                                              <button onClick={cancelDel} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                                              <button onClick={confirmDel} style={{ flex: 1, padding: "4px 0", background: "#e85454", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>delete</button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [skillLevels, setSkillLevels] = useState(INITIAL_SKILL_LEVELS);
  const [skillMode,   setSkillMode]   = useState("current");
  const [courseTiers, setCourseTiers] = useState(INITIAL_COURSE_TIERS);
  const [modal,       setModal]       = useState(null);

  // Load from disk on mount in Tauri
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!IS_TAURI) return;
    invoke("load_memory_progress").then(raw => {
      try {
        const sl = raw.match(/export const SKILL_LEVELS = (\{[\s\S]*?\});/)?.[1];
        const ct = raw.match(/export const COURSE_TIERS = (\{[\s\S]*?\});/)?.[1];
        if (sl) setSkillLevels(JSON.parse(sl));
        if (ct) setCourseTiers(JSON.parse(ct));
      } catch(e) { console.error("Failed to parse memory-progress.js", e); }
    }).catch(e => console.error("load_memory failed", e));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    persistProgress(skillLevels, courseTiers);
  }, [skillLevels, courseTiers]);

  function cycleTier(courseId, newTier) {
    setCourseTiers(prev => ({ ...prev, [courseId]: newTier }));
  }

  function handleLevelChange(skill, targetLevel) {
    setModal({ skill, from: skillLevels[skill.id]?.level || 0, to: targetLevel });
  }

  function confirmLevelChange(note) {
    if (!modal) return;
    const { skill, from, to } = modal;
    setSkillLevels(prev => ({
      ...prev,
      [skill.id]: { level: to, log: [...(prev[skill.id]?.log || []), { ts: new Date().toISOString(), from, to, note }] },
    }));
    setModal(null);
  }

  function handleDeleteLog(skillId, entryIndex) {
    setSkillLevels(prev => {
      const entry = prev[skillId] || { level: 0, log: [] };
      const newLog = entry.log.filter((_, i) => i !== entryIndex);
      const newLevel = newLog.length > 0 ? newLog[newLog.length - 1].to : 0;
      return { ...prev, [skillId]: { level: newLevel, log: newLog } };
    });
  }

  const totalPts = Object.values(skillLevels).reduce((a,s) => a+(s.level||0), 0);
  const maxPts   = TOTAL_SKILLS * MAX_LEVEL;
  const pct      = Math.round((totalPts/maxPts)*100);

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#0f1117", fontFamily: FONT, color: "#d4d8e0" }}>
      {modal && <LevelUpModal skill={modal.skill} currentLevel={modal.from} targetLevel={modal.to} onConfirm={confirmLevelChange} onCancel={() => setModal(null)} />}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 100px" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Coogs Hub</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Progress</h1>
        </div>

        {/* Overall mastery */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase" }}>Overall mastery</span>
              <span style={{ fontSize: 11, fontFamily: MONO, color: "#a78bfa" }}>{totalPts}/{maxPts} · {TOTAL_SKILLS} skills</span>
            </div>
            <div style={{ height: 6, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #4ecdc4, #a78bfa)", borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#a78bfa", fontFamily: MONO, flexShrink: 0 }}>{pct}%</div>
        </div>

        {/* Radar + XP */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Skill radar</div>
            <RadarChart skillLevels={skillLevels} />
          </div>
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>XP levels</div>
            <XPBars skillLevels={skillLevels} />
          </div>
        </div>

        {/* Learning projection */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Learning projection</div>
          <ProjectionChart skillLevels={skillLevels} />
        </div>

        {/* Study activity heatmap */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Study activity</div>
          {(() => {
            const derivedLog = {};
            Object.values(skillLevels).forEach(s => {
              (s.log || []).forEach(entry => {
                const day = entry.ts?.slice(0, 10);
                if (day) derivedLog[day] = Math.min((derivedLog[day] || 0) + 1, 4);
              });
            });
            return <StudyHeatmap studyLog={derivedLog} />;
          })()}
        </div>

        {/* Recent activity */}
        {(() => {
          const allEntries = Object.entries(skillLevels)
            .flatMap(([skillId, s]) => (s.log || []).map(e => ({ ...e, skillId })))
            .sort((a, b) => new Date(b.ts) - new Date(a.ts))
            .slice(0, 10);
          if (!allEntries.length) return null;
          return (
            <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Recent activity</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allEntries.map((entry, i) => {
                  const skill = ALL_SKILLS.find(s => s.id === entry.skillId);
                  const course = COURSES.find(c => c.id === skill?.course);
                  const fromMeta = LEVEL_META[entry.from];
                  const toMeta = LEVEL_META[entry.to];
                  const isUp = entry.to > entry.from;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "#0f1117", borderRadius: 8, borderLeft: `3px solid ${toMeta.color}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          {course && <span style={{ fontSize: 10, color: course.color, fontFamily: MONO, fontWeight: 700 }}>{course.label}</span>}
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#d4d8e0" }}>{skill?.label}</span>
                          <span style={{ marginLeft: "auto", fontSize: 10, color: "#3a4052", fontFamily: MONO }}>
                            {new Date(entry.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: entry.note ? 6 : 0 }}>
                          <span style={{ fontSize: 10, color: fromMeta.color, fontFamily: MONO }}>{fromMeta.label}</span>
                          <span style={{ fontSize: 10, color: isUp ? "#34d399" : "#e85454" }}>{isUp ? "↑" : "↓"}</span>
                          <span style={{ fontSize: 10, color: toMeta.color, fontFamily: MONO, fontWeight: 700 }}>{toMeta.label}</span>
                        </div>
                        {entry.note && <div style={{ fontSize: 11, color: "#5a6070", fontStyle: "italic" }}>"{entry.note}"</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Skills by course */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>Skills by course</div>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "#4a5060" }}>{TOTAL_SKILLS} skills · {totalPts}/{maxPts}</span>
          </div>
          <div style={{ fontSize: 11, color: "#4a5060", marginBottom: 12 }}>Expanded from COSC 3320, 3340, 3360, 3380 syllabi + notes · Each level change requires a note</div>

          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[
              { id: "current",  label: "◈ Current",  color: "#4ecdc4" },
              { id: "research", label: "◉ Research",  color: "#a78bfa" },
              { id: "ambition", label: "◇ Ambition",  color: "#fb923c" },
            ].map(t => (
              <button key={t.id} onClick={() => setSkillMode(t.id)} style={{
                padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                background: skillMode === t.id ? t.color : "#1a1f2e",
                color: skillMode === t.id ? "#0f1117" : "#4a5060",
                transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
            <span style={{ fontSize: 10, color: "#3a4052", marginLeft: 8, alignSelf: "center" }}>Tap tier badge on a course to reassign</span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {LEVEL_META.map((m, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: m.color }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color }} /> {m.label}
              </span>
            ))}
          </div>

          {SKILLS_BY_COURSE
            .filter(c => (courseTiers[c.id] || "ambition") === skillMode)
            .map(course => (
              <CourseSkillGroup
                key={course.id}
                course={course}
                skills={course.skills}
                skillLevels={skillLevels}
                onLevelChange={handleLevelChange}
                onDeleteLog={handleDeleteLog}
                tier={courseTiers[course.id] || "ambition"}
                onCycleTier={newTier => cycleTier(course.id, newTier)}
              />
            ))
          }

          {SKILLS_BY_COURSE.filter(c => (courseTiers[c.id] || "ambition") === skillMode).length === 0 && (
            <div style={{ fontSize: 13, color: "#4a5060", padding: "20px 0", textAlign: "center" }}>
              No courses in this tier yet. Tap a tier badge on any course to move it here.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}