import { useState, useRef, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DEADLINES } from "../data/memory-deadlines";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const FONT     = "'Inter', 'Segoe UI', sans-serif";
const MONO     = "'DM Mono', 'Courier New', monospace";
const SHOT_C   = "#e8c547";
const INSPO_C  = "#a78bfa";
const BLANK_C  = "#34d399";
const POISON_C = "#fb923c";
const PINK     = "#f472b6";

// ── Talk2Me save targets ──────────────────────────────────────────
const SAVE_TARGETS = [
  { id: null,         label: "Entries",     color: "#f472b6", icon: "✦" },
  { id: "datastruct", label: "Data Struct", color: "#4ecdc4", icon: "◈" },
  { id: "algos",      label: "Algorithms",  color: "#e8c547", icon: "◈" },
  { id: "automata",   label: "Automata",    color: "#a78bfa", icon: "◈" },
  { id: "comporg",    label: "Comp Org",    color: "#fb923c", icon: "◈" },
  { id: "databases",  label: "Databases",   color: "#60a5fa", icon: "◈" },
  { id: "opsystems",  label: "OS",          color: "#34d399", icon: "◈" },
  { id: "cpp",        label: "C++",         color: "#fb923c", icon: "{}" },
  { id: "python",     label: "Python",      color: "#4ecdc4", icon: "𝜆"  },
  { id: "linux",      label: "Linux",       color: "#34d399", icon: "⌘"  },
];

// ── Helpers ───────────────────────────────────────────────────────
function slugDate() {
  const d   = new Date();
  const mon = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  return `${mon}${d.getDate()}`;
}
function fmtSize(bytes) {
  if (!bytes) return "";
  return bytes < 1024 ? `${bytes}b` : `${(bytes / 1024).toFixed(1)}kb`;
}
function fmtDateTime(ms) {
  if (!ms) return "";
  const d    = new Date(ms);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} · ${time}`;
}
function todayStr()   { return new Date().toISOString().slice(0, 10); }
function todayLabel() { return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
function fmtDateLabel(str) {
  if (!str) return "";
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const LS_AGENDA = "agenda_entries";
const LS_INSPOS = "agenda_inspos";

// ── Persistence: Tauri → JSON files, web → localStorage ──────────────────────

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {} // eslint-disable-line
}

// ── Persistence: mirrors SignalNoisePage pattern exactly ─────────────────────
// Source of truth: src/data/agenda.json on disk via Tauri invoke.
// No localStorage. Ever. JSON.parse / JSON.stringify, nothing fancy.

const AGENDA_FILE = "agenda.json";

async function loadAgendaPersisted() {
  if (IS_TAURI) {
    try {
      const raw = await invoke("load_data_file", { filename: AGENDA_FILE });
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        entries: parsed.entries ?? {},
        inspos:  parsed.inspos  ?? [],
      };
    } catch (e) {
      console.warn("load_data_file agenda.json failed:", e);
    }
  }
  // web fallback
  try {
    const res = await fetch(`/api/load-data-file?filename=${AGENDA_FILE}`);
    const json = await res.json();
    const parsed = json.content ? JSON.parse(json.content) : {};
    return { entries: parsed.entries ?? {}, inspos: parsed.inspos ?? [] };
  } catch (_) {}
  return { entries: {}, inspos: [] };
}

async function saveAgendaPersisted(entries, inspos) {
  const content = JSON.stringify({ entries, inspos }, null, 2);
  try {
    if (IS_TAURI) {
      await invoke("save_data_file", { filename: AGENDA_FILE, content });
    } else {
      await fetch("/api/save-data-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: AGENDA_FILE, content }),
      });
    }
  } catch (e) {
    console.error("saveAgendaPersisted failed:", e);
  }
}

function getTodayMoons() {
  const today = todayStr();
  return DEADLINES.filter(d => !d.done && d.type === "moon" && d.date === today);
}

const EMPTY_ENTRY = () => ({
  shot:    { subject: "", course: "", priority: "", time: "", notes: "" },
  inspo:   { character: "", trait: "", arc: "" },
  blanket: "",
  poison:  "",
  tasks:   {},
  image:   null,
});

// ─────────────────────────────────────────────────────────────────
// Shared UI atoms
// ─────────────────────────────────────────────────────────────────

function AgendaSection({ label, color, icon, children }) {
  return (
    <div style={{
      background: "#0f1117",
      border: `1px solid ${color}22`,
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 14,
      boxShadow: `0 2px 16px rgba(0,0,0,0.25)`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "13px 20px",
        borderBottom: `1px solid ${color}18`,
        background: `${color}08`,
      }}>
        <span style={{
          fontSize: 16, fontWeight: 800, color, lineHeight: 1,
          fontFamily: MONO, flexShrink: 0,
        }}>{icon}</span>
        <span style={{
          fontSize: 14, fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color, fontFamily: MONO,
        }}>{label}</span>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function AgendaField({ label, value, onChange, color, placeholder, multiline, readOnly, half }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    background: readOnly ? "#0a0c10" : "#0d0f14",
    border: `1px solid ${value ? color + "40" : "#1e2230"}`,
    borderRadius: 8,
    color: value ? (readOnly ? "#8090a8" : "#d4d8e0") : "#55607a",
    fontFamily: FONT, fontSize: 14, padding: "10px 13px",
    outline: "none", transition: "border-color 0.15s", resize: "none",
    opacity: readOnly ? 0.8 : 1,
  };
  const focus = e => { if (!readOnly) e.target.style.borderColor = color + "70"; };
  const blur  = e => { if (!readOnly) e.target.style.borderColor = value ? color + "40" : "#1e2230"; };
  return (
    <div style={{ marginBottom: 10 }}>
      {label && (
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "2px",
          textTransform: "uppercase", color: "#4a5568",
          fontFamily: MONO, marginBottom: 6,
        }}>{label}</div>
      )}
      {multiline
        ? <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} style={{ ...base, lineHeight: 1.65 }} onFocus={focus} onBlur={blur} />
        : <input type="text" value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} style={{ ...base }} onFocus={focus} onBlur={blur} />
      }
    </div>
  );
}

function InspoHistory({ inspos, onPick, onDelete }) {
  const [open, setOpen] = useState(false);
  if (inspos.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        background: "none", border: `1px solid ${INSPO_C}33`, borderRadius: 6,
        color: INSPO_C, fontSize: 10, fontFamily: MONO, fontWeight: 700,
        letterSpacing: "1.5px", textTransform: "uppercase",
        padding: "4px 10px", cursor: "pointer",
      }}>
        {open ? "▲" : "▼"} Past Inspos ({inspos.length})
      </button>
      {open && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          {inspos.map((ins, i) => (
            <div key={i} style={{
              background: "#0d0f14", border: `1px solid ${INSPO_C}22`,
              borderRadius: 8, padding: "8px 12px",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: INSPO_C, marginBottom: 2 }}>{ins.character}</div>
                <div style={{ fontSize: 11, color: "#8090a8" }}>{ins.trait}</div>
                <div style={{ fontSize: 11, color: "#5a6070", fontStyle: "italic" }}>{ins.arc}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => onPick(ins)} style={{ background: `${INSPO_C}22`, border: "none", borderRadius: 5, color: INSPO_C, fontSize: 10, fontFamily: MONO, cursor: "pointer", padding: "3px 8px" }}>use</button>
                <button onClick={() => onDelete(i)} style={{ background: "none", border: "none", color: "#3a4052", fontSize: 12, cursor: "pointer", padding: "2px 4px" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e85454"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#3a4052"; }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Agenda Heatmap — pink, driven by agenda entry data
// ─────────────────────────────────────────────────────────────────

function AgendaHeatmap({ entries }) {
  const TOTAL_WEEKS = 26;
  const PAST_WEEKS  = 18;
  const today       = new Date();
  today.setHours(12, 0, 0, 0);
  const todayLabel = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  // Pink intensity palette
  const intensities = ["#1a1f2e", `${PINK}25`, `${PINK}55`, `${PINK}88`, PINK];
  const DAY_LABELS  = ["S","M","T","W","T","F","S"];
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Build a map: date string → intensity level (0-4)
  // 0 = no entry, 1 = entry exists, 2 = entry has image, 3 = entry saved, 4 = full entry (all 4 fields)
  const activityLog = {};
  Object.entries(entries).forEach(([date, e]) => {
    if (!e) return;
    let score = 0;
    if (e.shot?.subject || e.shot?.notes) score++;
    if (e.inspo?.character) score++;
    if (e.blanket) score++;
    if (e.poison) score++;
    if (score > 0) activityLog[date] = Math.min(score, 4);
  });

  const todayDow = today.getDay();
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

    if (colMonth !== lastMonth) {
      colMonthLabel = MONTH_NAMES[colMonth] + " '" + String(colYear).slice(2);
      lastMonth = colMonth;
    }

    const firstOfMonth = new Date(colYear, colMonth, 1);
    const firstDow = firstOfMonth.getDay();

    for (let dow = 0; dow < 7; dow++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + dow);
      const key = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      const isTrailingDead = date.getMonth() !== colMonth || date.getFullYear() !== colYear;
      const isLeadingDead = !!colMonthLabel && dow < firstDow;
      const isDead = isTrailingDead || isLeadingDead;
      const isToday = key === todayStr();
      const level = (isFuture || isDead) ? 0 : Math.min(activityLog[key] || 0, 4);
      col[dow] = (
        <div key={dow} title={isDead ? "" : key} style={{
          width: 11, height: 11,
          background: isDead ? "transparent" : isFuture ? "#0d1117" : intensities[level],
          borderRadius: 2,
          opacity: isDead ? 0 : isFuture ? 0.2 : 1,
          outline: isToday ? `1.5px solid ${PINK}` : "none",
          outlineOffset: "1px",
          cursor: "default",
        }} />
      );
    }

    cols.push(col);
    monthLabels.push(colMonthLabel);
  }

  // Streak: consecutive days going back from today that have entries
  let streak = 0;
  const sd = new Date(today);
  while (activityLog[sd.toISOString().slice(0, 10)]) {
    streak++;
    sd.setDate(sd.getDate() - 1);
  }

  const totalDays = Object.keys(activityLog).length;
  const CELL = 11, GAP = 3;

  return (
    <div style={{
      background: "#0f1117",
      border: `1px solid ${PINK}20`,
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 14,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: PINK, fontFamily: MONO }}>◈</span>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: PINK, fontFamily: MONO }}>Hot Streak</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {totalDays > 0 && (
            <span style={{ fontSize: 11, color: `${PINK}88`, fontFamily: MONO }}>{totalDays} day{totalDays !== 1 ? "s" : ""} logged</span>
          )}
          {streak > 0 && (
            <span style={{
              fontSize: 11, fontFamily: MONO, fontWeight: 700,
              color: PINK,
              background: `${PINK}15`,
              border: `1px solid ${PINK}40`,
              borderRadius: 6, padding: "2px 9px",
            }}>✦ {streak} day streak</span>
          )}
        </div>
      </div>

      {/* Top info bar */}
      <div style={{ fontSize: 10, color: "#4a5060", marginBottom: 8, fontFamily: MONO }}>
        Last {PAST_WEEKS} weeks · <span style={{ color: "#7a8090" }}>{todayLabel}</span>
      </div>

      {/* Grid */}
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
        <div style={{ overflowX: "hidden", flex: 1 }}>
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

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO }}>Less</span>
        {intensities.map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />)}
        <span style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO }}>More</span>
        <span style={{ fontSize: 10, color: "#3a4052", marginLeft: 8, fontFamily: MONO }}>· intensity = fields filled</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// History Sidebar — with password-locked delete per entry
// ─────────────────────────────────────────────────────────────────

const HISTORY_DELETE_PW = "Jesiah";

function HistorySidebar({ entries, viewingDate, onSelect, onDelete, today }) {
  const [confirmDel, setConfirmDel] = useState(null); // date string being deleted
  const [delStep,    setDelStep]    = useState("pw"); // "pw" | "confirm"
  const [pwInput,    setPwInput]    = useState("");
  const [pwError,    setPwError]    = useState(false);

  function openDelete(date, ev) {
    ev.stopPropagation();
    setConfirmDel(date);
    setDelStep("pw");
    setPwInput("");
    setPwError(false);
  }
  function cancelDelete() { setConfirmDel(null); setPwInput(""); setPwError(false); }
  function submitPw() {
    if (pwInput === HISTORY_DELETE_PW) {
      setPwError(false);
      setDelStep("confirm");
    } else {
      setPwError(true);
      setPwInput("");
    }
  }
  function confirmDelete() {
    onDelete(confirmDel);
    setConfirmDel(null);
    setPwInput("");
    setPwError(false);
  }

  const allDates = Object.keys(entries)
    .filter(d => (
      entries[d].savedAt ||
      entries[d].shot?.subject ||
      entries[d].inspo?.character ||
      entries[d].blanket ||
      entries[d].poison ||
      entries[d].image
    ))
    .sort((a, b) => b.localeCompare(a));
  const todayHasContent = allDates.includes(today);
  const pastDates = allDates.filter(d => d !== today);

  return (
    <div style={{
      width: 200, flexShrink: 0,
      borderLeft: "1px solid #1a1d26",
      background: "#0c0e14",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        padding: "13px 14px 11px", borderBottom: "1px solid #1a1d26",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#4a5568", fontFamily: MONO }}>History</span>
        {allDates.length > 0 && <span style={{ fontSize: 11, color: "#4a5568", fontFamily: MONO }}>{allDates.length}</span>}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Today */}
        {todayHasContent && (() => {
          const e = entries[today];
          const isActive  = viewingDate === today;
          const isConfirm = confirmDel === today;
          const preview = e.shot?.subject || e.inspo?.character || e.blanket || e.poison || "";
          return (
            <div
              onClick={() => { if (!isConfirm) onSelect(today); }}
              style={{
                padding: "10px 14px", borderBottom: "1px solid #1a1d26",
                borderLeft: isActive ? "2px solid #f472b6" : "2px solid #34d39944",
                background: isConfirm ? "rgba(232,84,84,0.07)" : isActive ? "rgba(244,114,182,0.06)" : "rgba(52,211,153,0.03)",
                cursor: "pointer", transition: "background 0.1s", position: "relative",
              }}
              onMouseEnter={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "#12151e"; }}
              onMouseLeave={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = isActive ? "rgba(244,114,182,0.06)" : "rgba(52,211,153,0.03)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, paddingRight: isConfirm ? 0 : 18 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#f472b6" : "#34d399", fontFamily: MONO }}>Today</span>
                {e.savedAt && <span style={{ fontSize: 9, color: "#34d39966", fontFamily: MONO, letterSpacing: "1px" }}>saved</span>}
                {e.image && <span style={{ fontSize: 10, opacity: 0.5 }}>◻</span>}
              </div>
              {preview && !isConfirm && <div style={{ fontSize: 11, color: "#3a4050", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</div>}

              {/* Delete inline */}
              {!isConfirm && (
                <button onClick={ev => openDelete(today, ev)} title="Delete entry"
                  style={{ position: "absolute", top: 10, right: 8, background: "none", border: "none", cursor: "pointer", color: "#2a3040", fontSize: 12, padding: 2, lineHeight: 1, transition: "color 0.1s" }}
                  onMouseEnter={ev => { ev.currentTarget.style.color = "#e85454"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.color = "#2a3040"; }}>✕</button>
              )}
              {isConfirm && (
                <div onClick={ev => ev.stopPropagation()} style={{ marginTop: 6 }}>
                  {delStep === "pw" ? (
                    <>
                      <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 4, letterSpacing: "1px" }}>password required</div>
                      <input autoFocus type="password" value={pwInput}
                        onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                        onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDelete(); }}
                        placeholder="password"
                        style={{ width: "100%", boxSizing: "border-box", background: "#0d0f14", border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`, borderRadius: 5, color: "#d4d8e0", fontSize: 12, fontFamily: MONO, padding: "4px 7px", outline: "none", marginBottom: 4 }}
                      />
                      {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 4 }}>incorrect</div>}
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "3px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#8090a8", fontSize: 10, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={submitPw} style={{ flex: 1, padding: "3px 0", background: "#2a2e38", border: "none", borderRadius: 4, color: "#d4d8e0", fontSize: 10, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 6, lineHeight: 1.5 }}>delete <span style={{ color: "#e85454" }}>Today</span>?</div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "3px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#8090a8", fontSize: 10, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={confirmDelete} style={{ flex: 1, padding: "3px 0", background: "#e85454", border: "none", borderRadius: 4, color: "#fff", fontSize: 10, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>delete</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Past days */}
        {!todayHasContent && pastDates.length === 0 && (
          <div style={{ padding: "16px 14px", fontSize: 12, color: "#2a3040", fontStyle: "italic", lineHeight: 1.6 }}>No days saved yet.</div>
        )}
        {pastDates.map(date => {
          const e        = entries[date];
          const isActive = viewingDate === date;
          const isConfirm = confirmDel === date;
          const hasImg   = !!e.image;
          const label    = fmtDateLabel(date);
          const preview  = e.shot?.subject || e.inspo?.character || e.blanket || e.poison || "";
          return (
            <div key={date}
              onClick={() => { if (!isConfirm) onSelect(date); }}
              style={{
                padding: "10px 14px", borderBottom: "1px solid #111520",
                borderLeft: isActive ? "2px solid #f472b6" : "2px solid transparent",
                background: isConfirm ? "rgba(232,84,84,0.07)" : isActive ? "rgba(244,114,182,0.06)" : "transparent",
                cursor: "pointer", transition: "background 0.1s", position: "relative",
              }}
              onMouseEnter={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "#12151e"; }}
              onMouseLeave={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, paddingRight: isConfirm ? 0 : 18 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#f472b6" : "#6070a0", fontFamily: MONO }}>{label}</span>
                {hasImg && <span style={{ fontSize: 10, opacity: 0.6 }}>◻</span>}
              </div>
              {preview && !isConfirm && <div style={{ fontSize: 11, color: "#3a4050", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</div>}

              {/* Delete button */}
              {!isConfirm && (
                <button onClick={ev => openDelete(date, ev)} title="Delete entry"
                  style={{ position: "absolute", top: 10, right: 8, background: "none", border: "none", cursor: "pointer", color: "#2a3040", fontSize: 12, padding: 2, lineHeight: 1, transition: "color 0.1s" }}
                  onMouseEnter={ev => { ev.currentTarget.style.color = "#e85454"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.color = "#2a3040"; }}>✕</button>
              )}

              {/* Delete inline flow */}
              {isConfirm && (
                <div onClick={ev => ev.stopPropagation()} style={{ marginTop: 6 }}>
                  {delStep === "pw" ? (
                    <>
                      <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 4, letterSpacing: "1px" }}>password required</div>
                      <input autoFocus type="password" value={pwInput}
                        onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                        onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDelete(); }}
                        placeholder="password"
                        style={{ width: "100%", boxSizing: "border-box", background: "#0d0f14", border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`, borderRadius: 5, color: "#d4d8e0", fontSize: 12, fontFamily: MONO, padding: "4px 7px", outline: "none", marginBottom: 4 }}
                      />
                      {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 4 }}>incorrect</div>}
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "3px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#8090a8", fontSize: 10, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={submitPw} style={{ flex: 1, padding: "3px 0", background: "#2a2e38", border: "none", borderRadius: 4, color: "#d4d8e0", fontSize: 10, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 6, lineHeight: 1.5 }}>delete <span style={{ color: "#e85454" }}>{label}</span>?</div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "3px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#8090a8", fontSize: 10, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={confirmDelete} style={{ flex: 1, padding: "3px 0", background: "#e85454", border: "none", borderRadius: 4, color: "#fff", fontSize: 10, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>delete</button>
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
  );
}

// ─────────────────────────────────────────────────────────────────
// Image Panel — icon/avatar style, not a banner
// ─────────────────────────────────────────────────────────────────

function ImagePanel({ image, onSet, onClear, readOnly }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function confirmImage() {
    if (preview) { onSet(preview); setPreview(null); }
  }

  function cancelPreview() { setPreview(null); }

  function handleDownload() {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `agenda-icon-${todayStr()}.png`;
    a.click();
  }

  return (
    <>
    {preview && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#0f1117", border: "1px solid #f472b633",
          borderRadius: 18, padding: "24px 28px", maxWidth: 380, width: "90%",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#f472b6", fontFamily: MONO }}>Confirm Day Icon</div>
          <div style={{
            width: 140, height: 140, borderRadius: 18,
            border: "2px solid #f472b644", overflow: "hidden",
            background: "#0d0f14",
          }}>
            <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ fontSize: 12, color: "#6070a0", fontFamily: MONO, textAlign: "center" }}>Set this as your day icon?</div>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button onClick={cancelPreview} style={{
              flex: 1, padding: "9px 0", borderRadius: 9,
              border: "1px solid #2a2e38", background: "transparent",
              color: "#7a8090", fontSize: 12, fontFamily: MONO, fontWeight: 700, cursor: "pointer",
            }}>Cancel</button>
            <button onClick={confirmImage} style={{
              flex: 1, padding: "9px 0", borderRadius: 9,
              border: "none", background: "#f472b6",
              color: "#0e1014", fontSize: 12, fontFamily: MONO, fontWeight: 700, cursor: "pointer",
            }}>Set Icon</button>
          </div>
        </div>
      </div>
    )}
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      marginBottom: 18,
      padding: "14px 20px",
      background: "#0f1117",
      border: "1px solid #1a1d26",
      borderRadius: 14,
    }}>
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        borderRadius: 14,
        border: image ? "2px solid #f472b644" : "2px dashed #2a2e38",
        overflow: "hidden",
        background: "#0d0f14",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        cursor: !readOnly ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
        onClick={() => { if (!readOnly && !image) fileRef.current?.click(); }}
        onMouseEnter={e => { if (!readOnly && !image) e.currentTarget.style.borderColor = "#f472b688"; }}
        onMouseLeave={e => { if (!readOnly && !image) e.currentTarget.style.borderColor = "#2a2e38"; }}
      >
        {image
          ? <img src={image} alt="day icon" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <span style={{ fontSize: 24, opacity: 0.25 }}>🖼</span>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "2px",
          textTransform: "uppercase", color: "#3a4052",
          fontFamily: MONO, marginBottom: 5,
        }}>Day Icon</div>

        {image ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!readOnly && (
              <button onClick={() => fileRef.current?.click()}
                style={{
                  padding: "5px 12px", borderRadius: 7, fontSize: 11, fontFamily: MONO, fontWeight: 700,
                  background: "#1a1f2e", border: "1px solid #2a2e38",
                  color: "#8090a8", cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f472b655"; e.currentTarget.style.color = "#f472b6"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#8090a8"; }}
              >↺ Replace</button>
            )}
            <button onClick={handleDownload}
              style={{
                padding: "5px 12px", borderRadius: 7, fontSize: 11, fontFamily: MONO, fontWeight: 700,
                background: "#1a1f2e", border: "1px solid #2a2e38",
                color: "#8090a8", cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#34d39955"; e.currentTarget.style.color = "#34d399"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#8090a8"; }}
            >↓ Save</button>
            {!readOnly && (
              <button onClick={onClear}
                style={{
                  padding: "5px 12px", borderRadius: 7, fontSize: 11, fontFamily: MONO, fontWeight: 700,
                  background: "transparent", border: "1px solid #e8545422",
                  color: "#e8545488", cursor: "pointer",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e85454"; e.currentTarget.style.borderColor = "#e8545466"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#e8545488"; e.currentTarget.style.borderColor = "#e8545422"; }}
              >✕ Remove</button>
            )}
          </div>
        ) : (
          !readOnly && (
            <button onClick={() => fileRef.current?.click()}
              style={{
                padding: "6px 16px", borderRadius: 7, fontSize: 11, fontFamily: MONO, fontWeight: 700,
                background: "transparent", border: "1px solid #f472b633",
                color: "#f472b6", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f472b615"; e.currentTarget.style.borderColor = "#f472b666"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#f472b633"; }}
            >+ Add icon for today</button>
          )
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// AGENDA tab
// ─────────────────────────────────────────────────────────────────

function AgendaTab() {
  const today = todayStr();
  const [entries,     setEntries]     = useState({});
  const [inspos,      setInspos]      = useState([]);
  const [loaded,      setLoaded]      = useState(false);
  const [viewingDate, setViewingDate] = useState(null);
  const [savedFlash,  setSavedFlash]  = useState(false);

  // Load from file (Tauri) or localStorage (web) on mount
  useEffect(() => {
    loadAgendaPersisted().then(({ entries: e, inspos: i }) => {
      setEntries(e);
      setInspos(i);
      setLoaded(true);
    });
  }, []);

  // Save on any change — debounced by 500ms to avoid hammering disk
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAgendaPersisted(entries, inspos);
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [entries, inspos, loaded]);

  const activeDate  = viewingDate ?? today;
  const isReadOnly  = viewingDate !== null;
  const activeEntry = entries[activeDate] ?? EMPTY_ENTRY();
  const todayEntry  = entries[today]      ?? EMPTY_ENTRY();

  function patchDay(date, patch) {
    setEntries(prev => ({ ...prev, [date]: { ...(prev[date] ?? EMPTY_ENTRY()), ...patch } }));
  }
  function patchToday(patch)  { patchDay(today, patch); }
  function patchShot(patch)   { patchToday({ shot:  { ...todayEntry.shot,  ...patch } }); }
  function patchInspo(patch)  { patchToday({ inspo: { ...todayEntry.inspo, ...patch } }); }

  function saveDayToHistory() {
    patchToday({ savedAt: Date.now() });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  function saveInspoToHistory() {
    const ins = todayEntry.inspo;
    if (!ins.character.trim()) return;
    const exists = inspos.some(i => i.character.toLowerCase() === ins.character.toLowerCase());
    if (!exists) setInspos(prev => [{ ...ins, savedAt: today }, ...prev]);
  }

  function toggleTask(id) {
    const cur = todayEntry.tasks ?? {};
    patchToday({ tasks: { ...cur, [id]: !cur[id] } });
  }

  function useAsTemplate(date) {
    const src = entries[date];
    if (!src) return;
    patchToday({
      shot:    { ...(src.shot  ?? { subject: "", course: "", priority: "", time: "", notes: "" }) },
      inspo:   { ...(src.inspo ?? { character: "", trait: "", arc: "" }) },
      blanket: src.blanket ?? "",
      poison:  src.poison  ?? "",
    });
    setViewingDate(null);
  }

  function handleDeleteEntry(date) {
    setEntries(prev => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
    if (viewingDate === date) setViewingDate(null);
  }

  const moonTasks      = getTodayMoons();
  const completedTasks = Object.values(todayEntry.tasks ?? {}).filter(Boolean).length;

  const disp  = activeEntry;
  const shot  = isReadOnly ? (disp.shot  ?? {}) : todayEntry.shot;
  const inspo = isReadOnly ? (disp.inspo ?? {}) : todayEntry.inspo;

  const hasContent = !!(todayEntry.shot?.subject || todayEntry.inspo?.character || todayEntry.blanket || todayEntry.poison);

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* ── Main scrollable area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Viewing banner */}
          {isReadOnly && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#1a1020", border: "1px solid #f472b630", borderRadius: 12,
              padding: "10px 18px", marginBottom: 16,
            }}>
              <span style={{ fontSize: 13, color: "#f472b6", fontFamily: MONO }}>
                Viewing {fmtDateLabel(viewingDate)}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => useAsTemplate(viewingDate)}
                  style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #f472b655", background: "#f472b618", color: "#f472b6", fontSize: 12, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>
                  Use as template →
                </button>
                <button onClick={() => setViewingDate(null)}
                  style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", fontSize: 12, fontFamily: MONO, cursor: "pointer" }}>
                  Back to today
                </button>
              </div>
            </div>
          )}

          {/* Hot Streak Heatmap */}
          {!isReadOnly && <AgendaHeatmap entries={entries} />}

          {/* Image icon */}
          {(!isReadOnly || disp.image) && (
            <ImagePanel
              image={isReadOnly ? disp.image : todayEntry.image}
              onSet={data => patchToday({ image: data })}
              onClear={() => patchToday({ image: null })}
              readOnly={isReadOnly}
            />
          )}

          {/* Daily Tasks */}
          {!isReadOnly && (
            <AgendaSection label="Daily Tasks" color="#a78bfa" icon="☽">
              {moonTasks.length === 0 ? (
                <div style={{ fontSize: 13, color: "#3a4052", fontStyle: "italic" }}>No moons due today.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {moonTasks.map(d => {
                    const checked = !!(todayEntry.tasks ?? {})[d.id];
                    return (
                      <div key={d.id} onClick={() => toggleTask(d.id)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          cursor: "pointer", padding: "10px 14px", borderRadius: 10,
                          background: checked ? "#a78bfa10" : "#0d0f14",
                          border: `1px solid ${checked ? "#a78bfa33" : "#1e2230"}`,
                          transition: "all 0.1s",
                        }}>
                        <div style={{
                          width: 17, height: 17, borderRadius: 5,
                          border: `1.5px solid ${checked ? "#a78bfa" : "#3a4052"}`,
                          background: checked ? "#a78bfa" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 1, transition: "all 0.1s",
                        }}>
                          {checked && <span style={{ color: "#0f1117", fontSize: 11, fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: checked ? "#6a7090" : "#c8d0e8", textDecoration: checked ? "line-through" : "none" }}>{d.title}</div>
                          {d.notes  && <div style={{ fontSize: 12, color: "#4a5060", marginTop: 2 }}>{d.notes}</div>}
                          {d.course && <div style={{ fontSize: 11, fontFamily: MONO, color: "#a78bfa88", marginTop: 2, letterSpacing: "1px" }}>{d.course}</div>}
                        </div>
                        <div style={{ fontSize: 12, color: "#3a4052", fontFamily: MONO, flexShrink: 0 }}>{d.time || "23:59"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AgendaSection>
          )}

          {/* Shot */}
          <AgendaSection label="Shot" color={SHOT_C} icon="◎">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <AgendaField label="Subject"    color={SHOT_C} value={shot.subject  ?? ""} onChange={e => patchShot({ subject:  e.target.value })} placeholder="What are you studying today?" readOnly={isReadOnly} />
              <AgendaField label="Course"     color={SHOT_C} value={shot.course   ?? ""} onChange={e => patchShot({ course:   e.target.value })} placeholder="e.g. COSC 3320"              readOnly={isReadOnly} />
              <AgendaField label="Priority"   color={SHOT_C} value={shot.priority ?? ""} onChange={e => patchShot({ priority: e.target.value })} placeholder="What matters most?"           readOnly={isReadOnly} />
              <AgendaField label="Time Block" color={SHOT_C} value={shot.time     ?? ""} onChange={e => patchShot({ time:     e.target.value })} placeholder="e.g. 2pm – 5pm"               readOnly={isReadOnly} />
            </div>
            <AgendaField label="Notes" color={SHOT_C} value={shot.notes ?? ""} onChange={e => patchShot({ notes: e.target.value })} placeholder="What's the plan of attack?" multiline readOnly={isReadOnly} />
          </AgendaSection>

          {/* Inspo */}
          <AgendaSection label="Inspo" color={INSPO_C} icon="◈">
            <AgendaField label="Character"       color={INSPO_C} value={inspo.character ?? ""} onChange={e => patchInspo({ character: e.target.value })} placeholder="Who's moving you today?"                      readOnly={isReadOnly} />
            <AgendaField label="Character Trait" color={INSPO_C} value={inspo.trait     ?? ""} onChange={e => patchInspo({ trait:     e.target.value })} placeholder="What quality do they embody?"                 readOnly={isReadOnly} />
            <AgendaField label="Arc"             color={INSPO_C} value={inspo.arc       ?? ""} onChange={e => patchInspo({ arc:       e.target.value })} placeholder="What part of their story are you channeling?" multiline readOnly={isReadOnly} />
            {!isReadOnly && (
              <>
                <button onClick={saveInspoToHistory} disabled={!inspo.character.trim()}
                  style={{
                    background: inspo.character.trim() ? `${INSPO_C}22` : "transparent",
                    border: `1px solid ${inspo.character.trim() ? INSPO_C + "55" : "#2a2e38"}`,
                    borderRadius: 6, color: inspo.character.trim() ? INSPO_C : "#3a4052",
                    fontSize: 11, fontFamily: MONO, fontWeight: 700,
                    letterSpacing: "1.5px", textTransform: "uppercase",
                    padding: "6px 13px", cursor: inspo.character.trim() ? "pointer" : "default",
                    transition: "all 0.15s",
                  }}>
                  + Save to history
                </button>
                <InspoHistory
                  inspos={inspos}
                  onPick={ins => patchInspo({ character: ins.character, trait: ins.trait, arc: ins.arc })}
                  onDelete={i => setInspos(prev => prev.filter((_, idx) => idx !== i))}
                />
              </>
            )}
          </AgendaSection>

          {/* Blanket */}
          <AgendaSection label="Blanket" color={BLANK_C} icon="—">
            <AgendaField color={BLANK_C} value={isReadOnly ? (disp.blanket ?? "") : todayEntry.blanket} onChange={e => patchToday({ blanket: e.target.value })} placeholder="What's your dedicated rest action today?" multiline readOnly={isReadOnly} />
          </AgendaSection>

          {/* Poison */}
          <AgendaSection label="Poison" color={POISON_C} icon="×">
            <AgendaField color={POISON_C} value={isReadOnly ? (disp.poison ?? "") : todayEntry.poison} onChange={e => patchToday({ poison: e.target.value })} placeholder="What's going to try to steal your focus today?" multiline readOnly={isReadOnly} />
          </AgendaSection>

          {/* Save Day button */}
          {!isReadOnly && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={saveDayToHistory}
                disabled={!hasContent}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 28px", borderRadius: 10,
                  border: savedFlash
                    ? "1px solid #34d39966"
                    : hasContent ? "1px solid #f472b644" : "1px solid #2a2e38",
                  background: savedFlash
                    ? "#34d39918"
                    : hasContent ? "#f472b612" : "transparent",
                  color: savedFlash ? "#34d399" : hasContent ? "#f472b6" : "#3a4052",
                  fontSize: 13, fontFamily: MONO, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  cursor: hasContent ? "pointer" : "not-allowed",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { if (hasContent && !savedFlash) { e.currentTarget.style.background = "#f472b622"; e.currentTarget.style.borderColor = "#f472b666"; } }}
                onMouseLeave={e => { if (hasContent && !savedFlash) { e.currentTarget.style.background = "#f472b612"; e.currentTarget.style.borderColor = "#f472b644"; } }}
              >
                <span style={{ fontSize: 14 }}>{savedFlash ? "✓" : "◈"}</span>
                {savedFlash ? "Saved to history" : "Save Day"}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── History sidebar ── */}
      <HistorySidebar
        entries={entries}
        viewingDate={viewingDate}
        onSelect={date => setViewingDate(prev => prev === date ? null : date)}
        onDelete={handleDeleteEntry}
        today={today}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Talk2Me: SaveToPopover
// ─────────────────────────────────────────────────────────────────

function SaveToPopover({ target, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 8, background: open ? "#1e2230" : "#181c28", border: `1px solid ${open ? target.color + "80" : "#2a2e38"}`, color: target.color, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, transition: "all 0.15s" }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = target.color + "55"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = "#2a2e38"; }}
      >
        <span style={{ fontSize: 14 }}>{target.icon}</span>
        <span>{target.label}</span>
        <span style={{ fontSize: 10, color: "#55607a", marginLeft: 2 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200, width: 200, background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px 6px", fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#3a4052", fontFamily: MONO }}>Save to</div>
          {SAVE_TARGETS.map(t => {
            const active = target.id === t.id;
            return (
              <button key={String(t.id)} onClick={() => { onSelect(t); setOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: active ? "#21253a" : "transparent", color: active ? t.color : "#8090a8", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", textAlign: "left", fontFamily: FONT, borderLeft: `2px solid ${active ? t.color : "transparent"}`, transition: "all 0.1s" }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#1e2230"; e.currentTarget.style.color = "#d4d8e0"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8090a8"; } }}
              >
                <span style={{ fontSize: 13, width: 16, flexShrink: 0 }}>{t.icon}</span>
                <span>{t.label}</span>
                {active && <span style={{ marginLeft: "auto", fontSize: 10 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Talk2Me: EntriesSidebar
// ─────────────────────────────────────────────────────────────────

function EntriesSidebar({ refreshTrigger, onSelect, activeFile, onDeleted }) {
  const [entries,    setEntries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmDel, setConfirmDel] = useState(null);
  const [delStep,    setDelStep]    = useState("pw");
  const [pwInput,    setPwInput]    = useState("");
  const [pwError,    setPwError]    = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  function openDelete(f)  { setConfirmDel(f); setDelStep("pw"); setPwInput(""); setPwError(false); }
  function cancelDelete() { setConfirmDel(null); setPwInput(""); setPwError(false); }
  function submitPw()     { if (pwInput === "Jesiah") { setPwError(false); setDelStep("confirm"); } else { setPwError(true); setPwInput(""); } }

  const load = useCallback(() => {
    setLoading(true);
    (IS_TAURI
      ? invoke("list_entries").then(e => ({ entries: e }))
      : fetch("/api/list-entries").then(r => r.json())
    ).then(d => { setEntries(d.entries || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load, refreshTrigger]);

  async function handleDelete(filename) {
    setDeleting(true);
    try {
      const ok = IS_TAURI
        ? await invoke("delete_entry", { filename }).then(() => true).catch(() => false)
        : await fetch("/api/delete-entry", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename }) }).then(r => r.ok);
      if (ok) { setEntries(p => p.filter(e => e.filename !== filename)); setConfirmDel(null); if (onDeleted) onDeleted(filename); }
    } catch (_) {}
    setDeleting(false);
  }

  return (
    <div style={{ width: 240, flexShrink: 0, borderLeft: "1px solid #2a2e3a", background: "#15181f", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #2a2e3a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#8090b0", fontFamily: MONO }}>Entries</span>
        {entries.length > 0 && <span style={{ fontSize: 11, color: "#8090b0", fontFamily: MONO }}>{entries.length}</span>}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && <div style={{ padding: "20px 16px", fontSize: 12, color: "#6070a0", fontFamily: MONO }}>loading…</div>}
        {!loading && entries.length === 0 && <div style={{ padding: "20px 16px", fontSize: 12, color: "#6070a0", fontStyle: "italic", lineHeight: 1.6 }}>No entries yet</div>}
        {!loading && entries.map(e => {
          const isActive  = e.filename === activeFile;
          const isConfirm = confirmDel === e.filename;
          return (
            <div key={e.filename}
              style={{ padding: "11px 14px", borderBottom: "1px solid #1e2230", borderLeft: isActive ? "2px solid #f472b6" : "2px solid transparent", background: isConfirm ? "rgba(232,84,84,0.08)" : isActive ? "rgba(244,114,182,0.07)" : "transparent", cursor: "pointer", transition: "background 0.1s", position: "relative" }}
              onClick={() => { if (!isConfirm) onSelect(e.filename); }}
              onMouseEnter={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "#1c2030"; }}
              onMouseLeave={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontFamily: MONO, fontSize: 12, color: isActive ? "#f472b6" : "#c8d0e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 6, paddingRight: 20 }}>{e.filename}</div>
              {e.birthtime && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 9, fontFamily: MONO, letterSpacing: "1.5px", textTransform: "uppercase", color: "#405070" }}>created</span>
                  <span style={{ fontSize: 11, color: "#6070a0", fontFamily: FONT }}>{fmtDateTime(e.birthtime)}</span>
                </div>
              )}
              {e.mtime && e.mtime !== e.birthtime && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 9, fontFamily: MONO, letterSpacing: "1.5px", textTransform: "uppercase", color: isActive ? "#c060a0" : "#506080" }}>edited</span>
                  <span style={{ fontSize: 11, color: isActive ? "#c878b8" : "#8090a8", fontFamily: FONT }}>{fmtDateTime(e.mtime)}</span>
                </div>
              )}
              {e.size > 0 && <span style={{ fontSize: 10, color: "#405070", fontFamily: MONO }}>{fmtSize(e.size)}</span>}
              {isConfirm ? (
                <div onClick={ev => ev.stopPropagation()} style={{ marginTop: 8 }}>
                  {delStep === "pw" ? (
                    <>
                      <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 5, letterSpacing: "1px" }}>password required</div>
                      <input autoFocus type="password" value={pwInput}
                        onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                        onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDelete(); }}
                        placeholder="password"
                        style={{ width: "100%", boxSizing: "border-box", background: "#0d0f14", border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`, borderRadius: 5, color: "#d4d8e0", fontSize: 12, fontFamily: MONO, padding: "5px 8px", outline: "none", marginBottom: 5 }}
                      />
                      {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 5 }}>incorrect</div>}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={submitPw}     style={{ flex: 1, padding: "4px 0", background: "#2a2e38", border: "none", borderRadius: 5, color: "#d4d8e0", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 8, lineHeight: 1.5 }}>delete <span style={{ color: "#e85454" }}>{confirmDel}</span>?</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={() => handleDelete(confirmDel)} disabled={deleting} style={{ flex: 1, padding: "4px 0", background: "#e85454", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: deleting ? "default" : "pointer", opacity: deleting ? 0.6 : 1 }}>
                          {deleting ? "…" : "delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button onClick={ev => { ev.stopPropagation(); openDelete(e.filename); }} title="Delete entry"
                  style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#3a4050", fontSize: 13, padding: 2, lineHeight: 1, transition: "color 0.1s" }}
                  onMouseEnter={ev => { ev.currentTarget.style.color = "#e85454"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.color = "#3a4050"; }}
                >✕</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ENTRIES tab (Talk2Me — fully intact)
// ─────────────────────────────────────────────────────────────────

function EntriesTab() {
  const [target,     setTarget]     = useState(SAVE_TARGETS[0]);
  const [title,      setTitle]      = useState("");
  const [body,       setBody]       = useState("");
  const [status,     setStatus]     = useState(null);
  const [errMsg,     setErrMsg]     = useState("");
  const [refresh,    setRefresh]    = useState(0);
  const [activeFile, setActiveFile] = useState(null);
  const [editMode,   setEditMode]   = useState(false);
  const textRef = useRef(null);

  async function handleSelectEntry(filename) {
    if (filename === activeFile) { setActiveFile(null); setTitle(""); setBody(""); return; }
    try {
      let raw = "";
      if (IS_TAURI) {
        raw = await invoke("read_entry", { filename }).catch(() => "");
      } else {
        const res  = await fetch(`/api/read-entry?filename=${encodeURIComponent(filename)}`);
        const data = await res.json();
        if (!res.ok) return;
        raw = data.content || "";
      }
      const lines = raw.split("\n");
      if (lines[0].startsWith("# ")) {
        setTitle(lines[0].slice(2).trim());
        const rest = lines[1] === "" ? lines.slice(2) : lines.slice(1);
        setBody(rest.join("\n").trimEnd());
      } else { setTitle(""); setBody(raw.trimEnd()); }
      setActiveFile(filename); setEditMode(false); setStatus(null);
      textRef.current?.focus();
    } catch (_) {}
  }

  function buildFilename() {
    const base   = title.trim() ? title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40) : "entry";
    const prefix = target.id ? `${target.id}_` : "";
    return `${prefix}${base}_${slugDate()}.md`;
  }

  async function handleSave() {
    if (!body.trim()) return;
    setStatus("saving"); setErrMsg("");
    const filename = (editMode && activeFile) ? activeFile : buildFilename();
    const content  = title.trim() ? `# ${title.trim()}\n\n${body.trim()}\n` : `${body.trim()}\n`;
    try {
      if (IS_TAURI) {
        await invoke("save_entry", { filename, content, courseId: target.id || null });
      } else {
        const res  = await fetch("/api/save-entry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename, content, courseId: target.id }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "save failed");
      }
      setStatus("ok");
      if (!target.id) setRefresh(r => r + 1);
      setTimeout(() => { setTitle(""); setBody(""); setStatus(null); textRef.current?.focus(); }, 1200);
    } catch (err) { setStatus("err"); setErrMsg(err.message); }
  }

  const canSave   = body.trim().length > 0 && status !== "saving";
  const charCount = body.length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", height: 54, flexShrink: 0, borderBottom: "1px solid #1e2230", background: "#15181f" }}>
        <SaveToPopover target={target} onSelect={setTarget} />
        <div style={{ flex: 1 }} />
        {status === "ok"     && <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>✓ saved</span>}
        {status === "err"    && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }} title={errMsg}>✗ {errMsg.slice(0, 40)}</span>}
        {status === "saving" && <span style={{ fontSize: 12, color: "#55607a" }}>saving…</span>}
        {activeFile && !editMode && <button onClick={() => setEditMode(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #4ecdc455", background: "#4ecdc418", color: "#4ecdc4", fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>✎ Edit</button>}
        {editMode && <button onClick={() => { setEditMode(false); setActiveFile(null); setTitle(""); setBody(""); setStatus(null); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #4a506055", background: "transparent", color: "#7a8090", fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>✕ Cancel</button>}
        <button onClick={handleSave} disabled={!canSave}
          style={{ padding: "8px 22px", borderRadius: 8, border: "none", background: canSave ? target.color : "#1e2230", color: canSave ? "#0e1014" : "#3a4052", fontSize: 13, fontWeight: 700, fontFamily: FONT, cursor: canSave ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          Save entry
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 32px 24px", gap: 14, overflow: "hidden" }}>
          <input type="text" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)}
            style={{ background: "transparent", border: "none", borderBottom: "1px solid #23262f", outline: "none", color: "#d4d8e8", fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, padding: "4px 0 10px", flexShrink: 0 }} />
          <textarea ref={textRef} placeholder="Write something…" value={body} onChange={e => setBody(e.target.value)}
            readOnly={!!activeFile && !editMode} autoFocus
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#c0c6d4", fontFamily: FONT, fontSize: "0.97rem", lineHeight: 1.8, resize: "none", padding: 0 }} />
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0, paddingTop: 12, borderTop: "1px solid #1e2230" }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#3a4052" }}>{body.trim() ? ((editMode && activeFile) ? activeFile : buildFilename()) : "…"}</span>
            {charCount > 0 && <span style={{ fontSize: 11, color: "#3a4052", marginLeft: 14 }}>{charCount} chars</span>}
          </div>
        </div>
        <EntriesSidebar refreshTrigger={refresh} onSelect={handleSelectEntry} activeFile={activeFile}
          onDeleted={f => { if (f === activeFile) { setActiveFile(null); setTitle(""); setBody(""); } }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// WEEK tab helpers
// ─────────────────────────────────────────────────────────────────

const WEEK_FILE = "agenda_weeks.json";
const WEEK_C    = "#60a5fa"; // blue accent for Week tab

function getWeekKey(date = new Date()) {
  // Returns a stable key: "week-N-monthname-YYYY"
  const d     = new Date(date);
  d.setHours(12, 0, 0, 0);
  const year  = d.getFullYear();
  const month = d.getMonth(); // 0-indexed
  const day   = d.getDate();
  // Week number within the month (1-based), anchored to Mon
  const firstOfMonth = new Date(year, month, 1);
  const firstMon     = new Date(firstOfMonth);
  const dow          = (firstOfMonth.getDay() + 6) % 7; // Mon=0
  firstMon.setDate(1 - dow);
  const weekNum = Math.floor((day - 1 + dow) / 7) + 1;
  const monName = d.toLocaleString("en-US", { month: "long" }).toLowerCase();
  return `week-${weekNum}-${monName}-${year}`;
}

function getWeekLabel(key) {
  // "week-2-april-2026" → "Week 2 of April 2026"
  const parts = key.split("-");
  if (parts.length < 4) return key;
  const n    = parts[1];
  const mon  = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
  const yr   = parts[3];
  return `Week ${n} of ${mon} ${yr}`;
}

async function loadWeeksPersisted() {
  if (IS_TAURI) {
    try {
      const raw = await invoke("load_data_file", { filename: WEEK_FILE });
      return raw ? JSON.parse(raw) : {};
    } catch (_) {}
  }
  try {
    const res = await fetch(`/api/load-data-file?filename=${WEEK_FILE}`);
    const json = await res.json();
    return json.content ? JSON.parse(json.content) : {};
  } catch (_) {}
  return {};
}

async function saveWeeksPersisted(weeks) {
  const content = JSON.stringify(weeks, null, 2);
  try {
    if (IS_TAURI) {
      await invoke("save_data_file", { filename: WEEK_FILE, content });
    } else {
      await fetch("/api/save-data-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: WEEK_FILE, content }),
      });
    }
  } catch (e) {
    console.error("saveWeeksPersisted failed:", e);
  }
}

const EMPTY_WEEK = () => ({
  prompted: { built: "", learned: "", blockers: "" },
  bullets:  [],
  savedAt:  null,
  modifiedAt: null,
});

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─────────────────────────────────────────────────────────────────
// WeekTab
// ─────────────────────────────────────────────────────────────────

function WeekHistorySidebar({ weeks, activeKey, onSelect }) {
  const keys = Object.keys(weeks).sort((a, b) => {
    // sort by year then month then week num, all embedded in key
    // Simplest: parse year+month+num out
    function score(k) {
      const p = k.split("-");
      const yr  = parseInt(p[3] || 0, 10);
      const mon = ["january","february","march","april","may","june","july","august","september","october","november","december"].indexOf(p[2]);
      const wk  = parseInt(p[1] || 0, 10);
      return yr * 10000 + mon * 100 + wk;
    }
    return score(b) - score(a); // newest first
  });

  return (
    <div style={{
      width: 210, flexShrink: 0,
      borderLeft: "1px solid #1a1d26",
      background: "#0c0e14",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        padding: "13px 14px 11px", borderBottom: "1px solid #1a1d26",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#4a5568", fontFamily: MONO }}>History</span>
        {keys.length > 0 && <span style={{ fontSize: 11, color: "#4a5568", fontFamily: MONO }}>{keys.length}</span>}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {keys.length === 0 && (
          <div style={{ padding: "16px 14px", fontSize: 12, color: "#2a3040", fontStyle: "italic", lineHeight: 1.6 }}>No weeks saved yet.</div>
        )}
        {keys.map(key => {
          const w        = weeks[key];
          const isActive = key === activeKey;
          const isThis   = key === getWeekKey();
          const label    = getWeekLabel(key);
          const modified = w.modifiedAt && w.savedAt && w.modifiedAt > w.savedAt;
          const hasContent = w.prompted?.built || w.prompted?.learned || w.prompted?.blockers || (w.bullets?.length > 0);
          return (
            <div key={key}
              onClick={() => onSelect(key)}
              style={{
                padding: "10px 14px", borderBottom: "1px solid #111520",
                borderLeft: isActive ? `2px solid ${WEEK_C}` : "2px solid transparent",
                background: isActive ? `${WEEK_C}10` : "transparent",
                cursor: "pointer", transition: "background 0.1s",
              }}
              onMouseEnter={ev => { if (!isActive) ev.currentTarget.style.background = "#12151e"; }}
              onMouseLeave={ev => { if (!isActive) ev.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? WEEK_C : "#6070a0", fontFamily: MONO, lineHeight: 1.4 }}>{label}</span>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {isThis && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: `${WEEK_C}99`, fontFamily: MONO, textTransform: "uppercase" }}>this week</span>}
                {modified && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: "#fb923c99", fontFamily: MONO, textTransform: "uppercase" }}>modified</span>}
                {w.savedAt && !isThis && <span style={{ fontSize: 9, color: "#3a4052", fontFamily: MONO }}>saved</span>}
              </div>
              {hasContent && (
                <div style={{ fontSize: 10, color: "#2a3040", marginTop: 3 }}>
                  {[w.prompted?.built, w.prompted?.learned, w.prompted?.blockers].filter(Boolean).length} prompted · {w.bullets?.length || 0} bullets
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekPromptedField({ label, value, onChange, color, readOnly, modified }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#4a5568", fontFamily: MONO }}>{label}</span>
        {modified && <span style={{ fontSize: 9, color: "#fb923c88", fontFamily: MONO, letterSpacing: "1px" }}>edited</span>}
      </div>
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={
          label === "WHAT I BUILT" ? "Code written, features shipped, projects touched..." :
          label === "WHAT I LEARNED" ? "Concepts clicked, breakthroughs, new knowledge..." :
          "What slowed you down, what to watch for next week..."
        }
        style={{
          width: "100%", boxSizing: "border-box",
          background: readOnly ? "#0a0c10" : "#0d0f14",
          border: `1px solid ${value ? color + "40" : "#1e2230"}`,
          borderRadius: 8,
          color: value ? (readOnly ? "#8090a8" : "#d4d8e0") : "#55607a",
          fontFamily: FONT, fontSize: 14, padding: "10px 13px",
          outline: "none", resize: "none", lineHeight: 1.65,
          opacity: readOnly ? 0.8 : 1,
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = color + "70"; }}
        onBlur={e => { if (!readOnly) e.target.style.borderColor = value ? color + "40" : "#1e2230"; }}
      />
    </div>
  );
}

function BulletList({ bullets, onChange, readOnly, modified }) {
  const inputRefs = useRef({});

  function addBullet(afterId) {
    const newB  = { id: uid(), text: "" };
    const idx   = afterId ? bullets.findIndex(b => b.id === afterId) : bullets.length - 1;
    const next  = [...bullets.slice(0, idx + 1), newB, ...bullets.slice(idx + 1)];
    onChange(next);
    setTimeout(() => inputRefs.current[newB.id]?.focus(), 30);
  }

  function updateBullet(id, text) {
    onChange(bullets.map(b => b.id === id ? { ...b, text } : b));
  }

  function removeBullet(id) {
    const next = bullets.filter(b => b.id !== id);
    onChange(next.length === 0 ? [] : next);
  }

  function handleKeyDown(e, id) {
    if (e.key === "Enter") {
      e.preventDefault();
      addBullet(id);
    } else if (e.key === "Backspace" && bullets.find(b => b.id === id)?.text === "") {
      e.preventDefault();
      const idx = bullets.findIndex(b => b.id === id);
      removeBullet(id);
      const prevId = bullets[idx - 1]?.id;
      if (prevId) setTimeout(() => inputRefs.current[prevId]?.focus(), 30);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#4a5568", fontFamily: MONO }}>Free-Form Bullets</span>
        {modified && <span style={{ fontSize: 9, color: "#fb923c88", fontFamily: MONO, letterSpacing: "1px" }}>edited</span>}
      </div>

      {bullets.length === 0 && !readOnly && (
        <div
          onClick={() => addBullet(null)}
          style={{
            fontSize: 13, color: "#2a3040", fontStyle: "italic", cursor: "pointer",
            padding: "10px 14px", borderRadius: 8,
            border: "1px dashed #1e2230",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${WEEK_C}44`; e.currentTarget.style.color = "#6070a0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.color = "#2a3040"; }}
        >
          + click to add bullets
        </div>
      )}

      {bullets.length === 0 && readOnly && (
        <div style={{ fontSize: 13, color: "#2a3040", fontStyle: "italic", padding: "6px 0" }}>No bullets added.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {bullets.map((b, i) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: `${WEEK_C}66`, fontSize: 14, flexShrink: 0, fontFamily: MONO, width: 14, textAlign: "center" }}>·</span>
            {readOnly ? (
              <span style={{ flex: 1, fontSize: 14, color: "#8090a8", lineHeight: 1.5 }}>{b.text || <em style={{ color: "#3a4052" }}>empty</em>}</span>
            ) : (
              <input
                ref={el => { inputRefs.current[b.id] = el; }}
                type="text"
                value={b.text}
                onChange={e => updateBullet(b.id, e.target.value)}
                onKeyDown={e => handleKeyDown(e, b.id)}
                placeholder="what happened this week..."
                style={{
                  flex: 1, background: "transparent", border: "none",
                  borderBottom: `1px solid #1e2230`,
                  color: "#d4d8e0", fontFamily: FONT, fontSize: 14,
                  padding: "6px 2px", outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => { e.target.style.borderBottomColor = `${WEEK_C}55`; }}
                onBlur={e => { e.target.style.borderBottomColor = "#1e2230"; }}
              />
            )}
            {!readOnly && (
              <button
                onClick={() => removeBullet(b.id)}
                style={{ background: "none", border: "none", color: "#2a3040", fontSize: 13, cursor: "pointer", padding: "2px 4px", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e85454"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#2a3040"; }}
              >✕</button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && bullets.length > 0 && (
        <button
          onClick={() => addBullet(bullets[bullets.length - 1].id)}
          style={{
            marginTop: 10, background: "none",
            border: `1px dashed ${WEEK_C}33`, borderRadius: 7,
            color: `${WEEK_C}88`, fontSize: 11, fontFamily: MONO, fontWeight: 700,
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "5px 12px", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${WEEK_C}66`; e.currentTarget.style.color = WEEK_C; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WEEK_C}33`; e.currentTarget.style.color = `${WEEK_C}88`; }}
        >+ add bullet</button>
      )}
    </div>
  );
}

function WeekTab() {
  const [weeks,      setWeeks]      = useState({});
  const [loaded,     setLoaded]     = useState(false);
  const [activeKey,  setActiveKey]  = useState(null); // null = current week
  const [savedFlash, setSavedFlash] = useState(false);

  const thisWeekKey = getWeekKey();

  useEffect(() => {
    loadWeeksPersisted().then(w => {
      setWeeks(w);
      setLoaded(true);
    });
  }, []);

  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveWeeksPersisted(weeks);
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [weeks, loaded]);

  const viewingKey  = activeKey ?? thisWeekKey;
  const isReadOnly  = activeKey !== null && activeKey !== thisWeekKey;
  const entry       = weeks[viewingKey] ?? EMPTY_WEEK();
  const thisEntry   = weeks[thisWeekKey] ?? EMPTY_WEEK();
  const isThisWeek  = viewingKey === thisWeekKey;

  function patchWeek(key, patch) {
    setWeeks(prev => {
      const existing = prev[key] ?? EMPTY_WEEK();
      const updated  = { ...existing, ...patch };
      // If this is a past week being modified, set modifiedAt
      if (key !== thisWeekKey && existing.savedAt) {
        updated.modifiedAt = Date.now();
      }
      return { ...prev, [key]: updated };
    });
  }

  function patchPrompted(key, patch) {
    const cur = weeks[key] ?? EMPTY_WEEK();
    patchWeek(key, { prompted: { ...cur.prompted, ...patch } });
  }

  function saveWeek() {
    const now = Date.now();
    setWeeks(prev => {
      const existing = prev[thisWeekKey] ?? EMPTY_WEEK();
      return { ...prev, [thisWeekKey]: { ...existing, savedAt: now } };
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  const weekLabel = getWeekLabel(viewingKey);

  const hasContent = !!(
    thisEntry.prompted?.built ||
    thisEntry.prompted?.learned ||
    thisEntry.prompted?.blockers ||
    (thisEntry.bullets?.length > 0 && thisEntry.bullets.some(b => b.text.trim()))
  );

  const viewingModified = entry.modifiedAt && entry.savedAt && entry.modifiedAt > entry.savedAt;

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Main scrollable area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Viewing banner for past week */}
          {isReadOnly && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: `${WEEK_C}0a`, border: `1px solid ${WEEK_C}30`, borderRadius: 12,
              padding: "10px 18px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: WEEK_C, fontFamily: MONO }}>Viewing {weekLabel}</span>
                {viewingModified && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                    color: "#fb923c", background: "#fb923c18",
                    border: "1px solid #fb923c33", borderRadius: 5,
                    padding: "2px 8px", fontFamily: MONO, textTransform: "uppercase",
                  }}>modified</span>
                )}
              </div>
              <button onClick={() => setActiveKey(null)}
                style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", fontSize: 12, fontFamily: MONO, cursor: "pointer" }}>
                Back to this week
              </button>
            </div>
          )}

          {/* Week header */}
          <div style={{
            background: "#0f1117",
            border: `1px solid ${WEEK_C}22`,
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: WEEK_C, fontFamily: MONO }}>⊞</span>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: WEEK_C, fontFamily: MONO }}>
                {weekLabel}
              </span>
              {isThisWeek && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "1px",
                  color: `${WEEK_C}99`, background: `${WEEK_C}15`,
                  border: `1px solid ${WEEK_C}33`, borderRadius: 5,
                  padding: "2px 8px", fontFamily: MONO, textTransform: "uppercase",
                }}>current</span>
              )}
              {entry.savedAt && (
                <span style={{ fontSize: 10, color: "#3a4052", fontFamily: MONO, marginLeft: "auto" }}>
                  saved {fmtDateTime(entry.savedAt)}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#3a4052", fontFamily: MONO }}>
              Come back periodically to drop bullets of what you shipped, learned, and hit this week.
            </div>
          </div>

          {/* Prompted sections */}
          <div style={{
            background: "#0f1117",
            border: `1px solid ${WEEK_C}18`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 14,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "13px 20px",
              borderBottom: `1px solid ${WEEK_C}14`,
              background: `${WEEK_C}06`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: WEEK_C, fontFamily: MONO }}>◈</span>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: WEEK_C, fontFamily: MONO }}>Prompted Reflection</span>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <WeekPromptedField
                label="WHAT I BUILT"
                color={WEEK_C}
                value={entry.prompted?.built ?? ""}
                onChange={e => patchPrompted(viewingKey, { built: e.target.value })}
                readOnly={isReadOnly}
                modified={isReadOnly && viewingModified}
              />
              <WeekPromptedField
                label="WHAT I LEARNED"
                color="#34d399"
                value={entry.prompted?.learned ?? ""}
                onChange={e => patchPrompted(viewingKey, { learned: e.target.value })}
                readOnly={isReadOnly}
                modified={isReadOnly && viewingModified}
              />
              <WeekPromptedField
                label="BLOCKERS"
                color="#fb923c"
                value={entry.prompted?.blockers ?? ""}
                onChange={e => patchPrompted(viewingKey, { blockers: e.target.value })}
                readOnly={isReadOnly}
                modified={isReadOnly && viewingModified}
              />
            </div>
          </div>

          {/* Free-form bullets */}
          <div style={{
            background: "#0f1117",
            border: `1px solid ${WEEK_C}18`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 20,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "13px 20px",
              borderBottom: `1px solid ${WEEK_C}14`,
              background: `${WEEK_C}06`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: WEEK_C, fontFamily: MONO }}>—</span>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: WEEK_C, fontFamily: MONO }}>This Week</span>
              {!isReadOnly && (
                <span style={{ fontSize: 11, color: "#3a4052", fontFamily: MONO, marginLeft: 4 }}>· Enter to add · Backspace on empty to remove</span>
              )}
            </div>
            <div style={{ padding: "18px 20px" }}>
              <BulletList
                bullets={entry.bullets ?? []}
                readOnly={isReadOnly}
                modified={isReadOnly && viewingModified}
                onChange={newBullets => patchWeek(viewingKey, { bullets: newBullets })}
              />
            </div>
          </div>

          {/* Save button — only for current week */}
          {isThisWeek && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={saveWeek}
                disabled={!hasContent}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 28px", borderRadius: 10,
                  border: savedFlash
                    ? `1px solid #34d39966`
                    : hasContent ? `1px solid ${WEEK_C}44` : "1px solid #2a2e38",
                  background: savedFlash
                    ? "#34d39918"
                    : hasContent ? `${WEEK_C}12` : "transparent",
                  color: savedFlash ? "#34d399" : hasContent ? WEEK_C : "#3a4052",
                  fontSize: 13, fontFamily: MONO, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  cursor: hasContent ? "pointer" : "not-allowed",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { if (hasContent && !savedFlash) { e.currentTarget.style.background = `${WEEK_C}22`; e.currentTarget.style.borderColor = `${WEEK_C}66`; } }}
                onMouseLeave={e => { if (hasContent && !savedFlash) { e.currentTarget.style.background = `${WEEK_C}12`; e.currentTarget.style.borderColor = `${WEEK_C}44`; } }}
              >
                <span style={{ fontSize: 14 }}>{savedFlash ? "✓" : "⊞"}</span>
                {savedFlash ? "Saved" : "Save Week"}
              </button>
            </div>
          )}

          {/* Past week — inline save for modifications */}
          {isReadOnly && viewingModified && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setWeeks(prev => ({
                    ...prev,
                    [viewingKey]: { ...prev[viewingKey], savedAt: Date.now(), modifiedAt: null },
                  }));
                }}
                style={{
                  padding: "10px 28px", borderRadius: 10,
                  border: "1px solid #fb923c44",
                  background: "#fb923c12",
                  color: "#fb923c",
                  fontSize: 13, fontFamily: MONO, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                ✓ Save edits
              </button>
            </div>
          )}

        </div>
      </div>

      {/* History sidebar */}
      <WeekHistorySidebar
        weeks={weeks}
        activeKey={activeKey}
        onSelect={key => setActiveKey(prev => prev === key ? null : key)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────

const PAGE_TABS = [
  { id: "agenda",  label: "◈ Agenda"  },
  { id: "week",    label: "⊞ Week"    },
  { id: "entries", label: "✦ Entries" },
];

export default function AgendaPage() {
  const [tab, setTab] = useState("agenda");

  const moonTasks = getTodayMoons();
  const today     = todayStr();
  // Read task completion count from localStorage cache (fast, non-blocking)
  const stored         = loadLS(LS_AGENDA, {});
  const tasks          = stored[today]?.tasks ?? {};
  const completedCount = Object.values(tasks).filter(Boolean).length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT, background: "#111318" }}>

      {/* Header + tab strip */}
      <div style={{ padding: "14px 32px 0", borderBottom: "1px solid #1a1d26", background: "#0c0e14", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#6070a0", fontFamily: MONO, marginBottom: 5 }}>{todayLabel()}</div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#e2e8f0", letterSpacing: "-1px" }}>AGENDA</h1>
          </div>
          {moonTasks.length > 0 && (
            <span style={{ fontSize: 12, color: "#a78bfa", fontFamily: MONO, background: "#a78bfa18", border: "1px solid #a78bfa33", borderRadius: 6, padding: "2px 9px" }}>
              {completedCount}/{moonTasks.length} tasks
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {PAGE_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "7px 20px", border: "none", cursor: "pointer", fontFamily: FONT,
                fontSize: 13, fontWeight: 700, transition: "color 0.15s",
                borderRadius: "8px 8px 0 0",
                background:   tab === t.id ? "#111318" : "transparent",
                color:        tab === t.id ? "#e2e8f0" : "#3a4052",
                borderTop:    tab === t.id ? "1px solid #2a2e3a" : "1px solid transparent",
                borderLeft:   tab === t.id ? "1px solid #2a2e3a" : "1px solid transparent",
                borderRight:  tab === t.id ? "1px solid #2a2e3a" : "1px solid transparent",
                marginBottom: tab === t.id ? "-1px" : 0,
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {tab === "agenda"  && <AgendaTab />}
      {tab === "week"    && <WeekTab />}
      {tab === "entries" && <EntriesTab />}

    </div>
  );
}