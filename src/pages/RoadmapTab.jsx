import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const DISPLAY = "'Bebas Neue', 'Anton', 'Impact', sans-serif";
const BODY    = "'DM Sans', 'Manrope', sans-serif";
const MONO    = "'DM Mono', 'Courier New', monospace";

// ── Persist ───────────────────────────────────────────────────────
async function persistData(data) {
  try {
    const content = JSON.stringify(data, null, 2);
    if (IS_TAURI) {
      await invoke("save_data_file", { filename: "roadmap3.json", content });
    } else {
      await fetch("/api/save-data-file", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: "roadmap3.json", content }),
      });
    }
  } catch (e) { console.error("[roadmap3] persist failed", e); }
}

// ── Types: "event" | "goal" ────────────────────────────────────────
// event: { id, type:"event", title, date, description, tag }
// goal:  { id, type:"goal",  title, date, description, tag }
// tag options for events: "Hackathon" | "Competition" | "Deadline" | "Demo" | "Interview"
// tag options for goals:  "Ship" | "Build" | "Learn" | "Internship" | "Research" | "Compete"

const EVENT_TAGS = ["Hackathon", "Competition", "Deadline", "Demo", "Interview"];
const GOAL_TAGS  = ["Ship", "Build", "Learn", "Internship", "Research", "Compete"];

const TAG_COLORS = {
  Hackathon:   "#ff4b1f",
  Competition: "#f5a623",
  Deadline:    "#e85454",
  Demo:        "#7eb8f7",
  Interview:   "#a78bfa",
  Ship:        "#34d399",
  Build:       "#60a5fa",
  Learn:       "#c084fc",
  Internship:  "#fbbf24",
  Research:    "#94a3b8",
  Compete:     "#f97316",
};

const SEED = [
  { id: "e1", type: "event", title: "HackUH Spring",       date: "2025-04-20", tag: "Hackathon",   description: "University of Houston's flagship hackathon. Come to win." },
  { id: "g1", type: "goal",  title: "Finish CoogsHub Android APK", date: "2025-04-18", tag: "Ship", description: "Capacitor build, sideloaded on Samsung before the event." },
  { id: "e2", type: "event", title: "Google STEP Deadline", date: "2025-05-01", tag: "Deadline",    description: "Submit the final application. No extensions." },
  { id: "g2", type: "goal",  title: "Self-Hosted Content Server", date: "2025-05-15", tag: "Build", description: "App fetches notes over HTTPS on launch. No APK rebuild for content." },
  { id: "e3", type: "event", title: "HackTX 2025",          date: "2025-09-20", tag: "Hackathon",   description: "Texas's biggest hackathon. Top 3 or bust." },
  { id: "g3", type: "goal",  title: "ICPC Regional Qualifier", date: "2025-10-15", tag: "Compete",  description: "Algorithms sharp enough to compete at regionals." },
  { id: "e4", type: "event", title: "ICPC Regionals",        date: "2025-11-08", tag: "Competition", description: "The real thing. Show up ready." },
  { id: "g4", type: "goal",  title: "AI Agent — v1",         date: "2026-01-15", tag: "Build",      description: "Real reasoning loop. Memory, tools, observable thought. Not a wrapper." },
  { id: "e5", type: "event", title: "Dream Internship Start", date: "2026-05-20", tag: "Internship", description: "The whole point." },
];

function uid() { return "x" + Math.random().toString(36).slice(2, 9); }

function parseDate(str) {
  // treat as noon local to avoid timezone off-by-one
  return new Date(str + "T12:00:00");
}

function daysFrom(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function fmtDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function urgencyColor(days) {
  if (days < 0)   return "#3a4060";   // past
  if (days <= 7)  return "#ff4b1f";   // this week
  if (days <= 30) return "#f5a623";   // this month
  if (days <= 90) return "#fbbf24";   // this quarter
  return "#4a5680";                   // far future
}

function urgencyGlow(days) {
  if (days < 0)   return "none";
  if (days <= 7)  return "0 0 28px #ff4b1f55";
  if (days <= 30) return "0 0 20px #f5a62340";
  if (days <= 90) return "0 0 12px #fbbf2428";
  return "none";
}

function countdownLabel(days) {
  if (days < 0)   return `${Math.abs(days)}D AGO`;
  if (days === 0) return "TODAY";
  if (days === 1) return "TOMORROW";
  if (days <= 30) return `${days}D`;
  if (days < 365) return `${Math.ceil(days / 30)}MO`;
  return `${(days / 365).toFixed(1)}Y`;
}

const emptyForm = (type = "goal") => ({
  type, title: "", date: "", tag: type === "event" ? "Hackathon" : "Ship", description: "",
});

// ═══════════════════════════════════════════════════════════════════
export default function RoadmapTab() {
  const [items,    setItems]    = useState(SEED);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm("goal"));
  const [editId,   setEditId]   = useState(null);
  const [filter,   setFilter]   = useState("all"); // "all" | "event" | "goal"
  const [tab,      setTab]      = useState("upcoming"); // "upcoming" | "history"
  const [now,      setNow]      = useState(new Date());
  const formRef = useRef(null);

  // Tick every minute so countdowns stay accurate
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Load
  useEffect(() => {
    const load = IS_TAURI
      ? invoke("load_data_file", { filename: "roadmap3.json" }).catch(() => null)
      : fetch("/api/load-data-file?filename=roadmap3.json").then(r => r.json()).then(d => d.content).catch(() => null);
    load.then(raw => {
      if (!raw) return;
      try { const d = JSON.parse(raw); if (d.items) setItems(d.items); } catch { /* ignore */ }
    });
  }, []);

  // Inject fonts + CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "rm3-styles";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap');

      .rm3-item { transition: transform 0.15s ease, box-shadow 0.2s ease; }
      .rm3-item:hover { transform: translateX(3px); }
      .rm3-item:hover .rm3-actions { opacity: 1 !important; }

      .rm3-event-card {
        transition: box-shadow 0.2s ease, transform 0.15s ease;
      }
      .rm3-event-card:hover { transform: translateY(-1px); }
      .rm3-event-card:hover .rm3-actions { opacity: 1 !important; }

      .rm3-today-pulse {
        animation: today-pulse 2.5s ease-in-out infinite;
      }
      @keyframes today-pulse {
        0%, 100% { box-shadow: 0 0 0 0 #ff4b1f44; }
        50%       { box-shadow: 0 0 0 6px #ff4b1f00; }
      }

      .rm3-urgent {
        animation: urgent-glow 2s ease-in-out infinite alternate;
      }
      @keyframes urgent-glow {
        from { box-shadow: 0 0 16px #ff4b1f33; }
        to   { box-shadow: 0 0 32px #ff4b1f66; }
      }
    `;
    if (!document.getElementById("rm3-styles")) document.head.appendChild(el);
    return () => document.getElementById("rm3-styles")?.remove();
  }, []);

  function save(newItems) {
    setItems(newItems);
    persistData({ items: newItems });
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.date) return;
    const updated = editId
      ? items.map(i => i.id === editId ? { ...i, ...form } : i)
      : [...items, { id: uid(), ...form }];
    save(updated);
    setForm(emptyForm()); setShowForm(false); setEditId(null);
  }

  function handleEdit(item) {
    setForm({ type: item.type, title: item.title, date: item.date, tag: item.tag, description: item.description || "" });
    setEditId(item.id); setShowForm(true);
    setTab("upcoming");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function handleDelete(id) { save(items.filter(i => i.id !== id)); }
  function cancelForm() { setForm(emptyForm()); setShowForm(false); setEditId(null); }

  // Sort by date, split past/future
  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);
  const sorted = [...filtered].sort((a, b) => parseDate(a.date) - parseDate(b.date));

  const todayStr = now.toISOString().slice(0, 10);
  const past   = sorted.filter(i => i.date <  todayStr);
  const future = sorted.filter(i => i.date >= todayStr);

  // Next event (soonest future event)
  const nextEvent = items
    .filter(i => i.type === "event" && i.date >= todayStr)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))[0];

  const inp = (active) => ({
    width: "100%", boxSizing: "border-box", background: "#090b12",
    border: `1px solid ${active ? "#ff4b1f55" : "#1a1e2e"}`,
    borderRadius: 6, color: "#c8ccd8", fontFamily: BODY, fontSize: 13,
    padding: "8px 12px", outline: "none", resize: "none",
    transition: "border-color 0.15s",
  });

  const chip = (active, color = "#4a5680") => ({
    padding: "4px 13px", borderRadius: 20,
    border: `1px solid ${active ? color + "88" : "#1a1e2e"}`,
    background: active ? color + "22" : "transparent",
    color: active ? color : "#3a4060",
    fontSize: 10, fontWeight: 700, letterSpacing: "1px",
    textTransform: "uppercase", cursor: "pointer", fontFamily: MONO,
    transition: "all 0.15s",
  });

  return (
    <div style={{ fontFamily: BODY, color: "#c8ccd8", paddingBottom: 80 }}>

      {/* ── Next Event Banner ──────────────────────────────────────── */}
      {nextEvent && (() => {
        const days = daysFrom(nextEvent.date);
        const col  = TAG_COLORS[nextEvent.tag] ?? "#ff4b1f";
        const urgent = days <= 30;
        return (
          <div className={urgent ? "rm3-urgent" : ""}
            style={{
              position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, #0e0a06 0%, #0c0e16 70%)`,
              border: `1px solid ${col}30`,
              borderLeft: `3px solid ${col}`,
              borderRadius: 10, padding: "18px 22px",
              marginBottom: 26,
              boxShadow: urgencyGlow(days),
            }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: `radial-gradient(ellipse at top left, ${col}12 0%, transparent 60%)`,
              pointerEvents: "none",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "3px", color: col, marginBottom: 7, textTransform: "uppercase" }}>
                  ▶ Next Up — {nextEvent.tag}
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 28, letterSpacing: "1px", color: "#f0f2f8", lineHeight: 1.1, marginBottom: 5 }}>
                  {nextEvent.title}
                </div>
                {nextEvent.description && (
                  <div style={{ fontSize: 12, color: "#5a6480", lineHeight: 1.6, maxWidth: 520 }}>{nextEvent.description}</div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontFamily: DISPLAY, fontSize: 48, letterSpacing: "2px",
                  color: col, lineHeight: 1,
                  textShadow: `0 0 30px ${col}66`,
                }}>
                  {countdownLabel(days)}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "#3a4060", letterSpacing: "1.5px", marginTop: 4 }}>
                  {fmtDate(nextEvent.date)}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Tab switcher + controls ──────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 22, borderBottom: "1px solid #1a1e2e", flexWrap: "wrap" }}>
        {[["upcoming", "Upcoming"], ["history", "History"]].map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); if (id === "history") { setShowForm(false); cancelForm(); } }}
            style={{
              padding: "8px 20px", background: "none", border: "none",
              borderBottom: `2px solid ${tab === id ? "#ff4b1f" : "transparent"}`,
              color: tab === id ? "#f0f2f8" : "#3a4060",
              fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase", cursor: "pointer",
              marginBottom: -1, transition: "color 0.15s",
            }}>
            {label}
            {id === "history" && (
              <span style={{ marginLeft: 7, fontSize: 9, color: tab === "history" ? "#ff4b1f88" : "#252838" }}>
                ({items.filter(i => i.date < todayStr).length})
              </span>
            )}
          </button>
        ))}
        {tab === "upcoming" && (
          <>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 5, paddingBottom: 4, flexWrap: "wrap" }}>
              <button style={chip(filter === "all",   "#6b7490")} onClick={() => setFilter("all")}>All</button>
              <button style={chip(filter === "event", "#ff4b1f")} onClick={() => setFilter("event")}>Events</button>
              <button style={chip(filter === "goal",  "#60a5fa")} onClick={() => setFilter("goal")}>Goals</button>
            </div>
            <button
              onClick={() => { setShowForm(v => !v); if (showForm) cancelForm(); }}
              style={{ marginLeft: 10, marginBottom: 4, padding: "5px 16px", borderRadius: 6, border: "1px solid #ff4b1f44", background: "transparent", color: "#ff4b1f", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: MONO }}
            >{showForm ? "✕ Cancel" : "+ Add"}</button>
          </>
        )}
      </div>

      {/* ── Form ──────────────────────────────────────────────────── */}
      {showForm && (
        <div ref={formRef} style={{ background: "#0c0e16", border: "1px solid #ff4b1f28", borderRadius: 10, padding: "20px 22px", marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "3px", color: "#ff4b1f", marginBottom: 16, textTransform: "uppercase" }}>
            {editId ? "Edit" : "Add to Timeline"}
          </div>

          {/* Type toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["goal", "event"].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t, tag: t === "event" ? "Hackathon" : "Ship" }))}
                style={{ padding: "5px 16px", borderRadius: 6, border: `1px solid ${form.type === t ? "#ff4b1f66" : "#1a1e2e"}`, background: form.type === t ? "#ff4b1f18" : "transparent", color: form.type === t ? "#ff4b1f" : "#3a4060", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: MONO }}>
                {t === "event" ? "⚡ Event" : "◎ Goal"}
              </button>
            ))}
          </div>

          {/* Title */}
          <div style={{ marginBottom: 10 }}>
            <input placeholder={form.type === "event" ? "Event name" : "What are you building toward?"} value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={inp(!!form.title)}
              onFocus={e => { e.target.style.borderColor = "#ff4b1f66"; }}
              onBlur={e => { e.target.style.borderColor = form.title ? "#ff4b1f44" : "#1a1e2e"; }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {/* Date */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#3a4060", fontFamily: MONO, marginBottom: 5 }}>Date</div>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ ...inp(!!form.date), colorScheme: "dark", cursor: "pointer" }}
                onFocus={e => { e.target.style.borderColor = "#ff4b1f66"; }}
                onBlur={e => { e.target.style.borderColor = form.date ? "#ff4b1f44" : "#1a1e2e"; }}
              />
            </div>
            {/* Tag */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#3a4060", fontFamily: MONO, marginBottom: 5 }}>Tag</div>
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                style={{ background: "#090b12", border: "1px solid #1a1e2e", borderRadius: 6, color: TAG_COLORS[form.tag] ?? "#8090b8", fontFamily: MONO, fontSize: 11, fontWeight: 700, padding: "8px 10px", outline: "none", cursor: "pointer", width: "100%" }}>
                {(form.type === "event" ? EVENT_TAGS : GOAL_TAGS).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <textarea rows={2} placeholder="What does this mean? Why does it matter?" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ ...inp(!!form.description), lineHeight: 1.6, marginBottom: 4 }}
            onFocus={e => { e.target.style.borderColor = "#ff4b1f66"; }}
            onBlur={e => { e.target.style.borderColor = form.description ? "#ff4b1f44" : "#1a1e2e"; }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <button onClick={cancelForm} style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid #1a1e2e", background: "transparent", color: "#3a4060", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: MONO, letterSpacing: "1px", textTransform: "uppercase" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={!form.title.trim() || !form.date}
              style={{ padding: "7px 20px", borderRadius: 6, border: "none", background: (form.title.trim() && form.date) ? "#ff4b1f" : "#1a1e2e", color: (form.title.trim() && form.date) ? "#0a0a0a" : "#3a4060", fontSize: 10, fontWeight: 700, cursor: (form.title.trim() && form.date) ? "pointer" : "not-allowed", fontFamily: MONO, letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.15s" }}>
              {editId ? "Save" : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* ── History Tab ─────────────────────────────────────────────── */}
      {tab === "history" && (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, #1e2235 8%, #1e2235 92%, transparent)" }} />
          {past.length === 0 ? (
            <div style={{ paddingLeft: 110, paddingTop: 30, fontFamily: MONO, fontSize: 11, color: "#2a2e40", letterSpacing: "2px", textTransform: "uppercase" }}>
              No past items yet.
            </div>
          ) : (
            [...past].reverse().map(item => (
              <TimelineItem key={item.id} item={item} past={false} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} historyMode={true} />
            ))
          )}
        </div>
      )}

      {/* ── Upcoming Tab ─────────────────────────────────────────────── */}
      {tab === "upcoming" && (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, #1e2235 8%, #1e2235 92%, transparent)" }} />

          {past.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {past.map(item => (
                <TimelineItem key={item.id} item={item} past={true} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8, position: "relative" }}>
            <div style={{ width: 90, textAlign: "right", paddingRight: 18, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "2.5px", color: "#ff4b1f", textTransform: "uppercase" }}>
              Today
            </div>
            <div className="rm3-today-pulse" style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#ff4b1f", flexShrink: 0,
              border: "2px solid #ff4b1f88",
              marginLeft: -4, zIndex: 2, position: "relative",
            }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #ff4b1f66, transparent)", marginLeft: 8 }} />
            <div style={{ fontFamily: MONO, fontSize: 9, color: "#2a2e40", letterSpacing: "1px", paddingRight: 4 }}>
              {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
          </div>

          {future.length > 0 && (
            <div>
              {future.map(item => (
                <TimelineItem key={item.id} item={item} past={false} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
              ))}
            </div>
          )}

          {sorted.length === 0 && (
            <div style={{ paddingLeft: 110, paddingTop: 30, fontFamily: MONO, fontSize: 11, color: "#2a2e40", letterSpacing: "2px", textTransform: "uppercase" }}>
              Nothing on the timeline yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Timeline Item ─────────────────────────────────────────────────
function TimelineItem({ item, past, onEdit, onDelete, historyMode = false }) {
  const effectivePast = past && !historyMode;
  const [hovered, setHovered] = useState(false);
  const days = daysFrom(item.date);
  const isEvent = item.type === "event";
  const col = TAG_COLORS[item.tag] ?? "#60a5fa";
  const urg = effectivePast ? "#2a2e40" : urgencyColor(days);

  if (isEvent) {
    // Events get a wide card spanning the full width
    return (
      <div className="rm3-event-card"
        style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 16, position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Date column */}
        <div style={{ width: 90, flexShrink: 0, textAlign: "right", paddingRight: 18, paddingTop: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: effectivePast ? "#2a2e40" : urg, letterSpacing: "1px", lineHeight: 1.4 }}>
            {fmtDate(item.date).replace(",", "\n")}
          </div>
        </div>

        {/* Dot */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, zIndex: 1 }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: effectivePast ? "#1a1e2e" : col,
            border: `2px solid ${effectivePast ? "#2a2e40" : col}`,
            boxShadow: effectivePast ? "none" : (days <= 7 ? `0 0 14px ${col}88` : `0 0 8px ${col}44`),
            marginLeft: -5, flexShrink: 0,
          }} />
        </div>

        {/* Card */}
        <div style={{
          flex: 1, marginLeft: 16,
          background: effectivePast ? "#0a0c12" : `linear-gradient(135deg, #0e0a06 0%, #0c0e16 80%)`,
          border: `1px solid ${effectivePast ? "#161824" : col + "30"}`,
          borderLeft: `2px solid ${effectivePast ? "#1e2235" : col}`,
          borderRadius: 8, padding: "12px 16px",
          opacity: effectivePast ? 0.4 : 1,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                  color: effectivePast ? "#2a2e40" : col, background: effectivePast ? "#0f1018" : col + "18",
                  border: `1px solid ${effectivePast ? "#1a1e2e" : col + "44"}`,
                  borderRadius: 4, padding: "2px 7px", fontFamily: MONO,
                }}>{item.tag}</span>
                {!effectivePast && (
                  <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: urg, letterSpacing: "1px", textTransform: "uppercase", textShadow: days <= 30 ? `0 0 10px ${urg}66` : "none" }}>
                    {countdownLabel(days)}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: effectivePast ? 16 : 20, letterSpacing: "0.5px", color: effectivePast ? "#2a2e40" : "#f0f2f8", lineHeight: 1.1 }}>
                {item.title}
              </div>
              {item.description && !effectivePast && (
                <div style={{ fontSize: 11, color: "#4a5480", lineHeight: 1.65, marginTop: 5 }}>{item.description}</div>
              )}
            </div>
            <div className="rm3-actions" style={{ display: "flex", gap: 3, opacity: hovered ? 1 : 0, transition: "opacity 0.15s", flexShrink: 0 }}>
              <button onClick={onEdit} style={{ background: "none", border: "none", color: "#3a4060", fontSize: 12, cursor: "pointer", padding: "3px 6px", fontFamily: MONO }}
                onMouseEnter={e => e.currentTarget.style.color = "#8090cc"}
                onMouseLeave={e => e.currentTarget.style.color = "#3a4060"}>✎</button>
              <button onClick={onDelete} style={{ background: "none", border: "none", color: "#4a2020", fontSize: 12, cursor: "pointer", padding: "3px 6px" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ff6b6b"}
                onMouseLeave={e => e.currentTarget.style.color = "#4a2020"}>✕</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Goals — cards with real presence, visually distinct from events
  return (
    <div className="rm3-item rm3-goal-card"
      style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 14, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Date column */}
      <div style={{ width: 90, flexShrink: 0, textAlign: "right", paddingRight: 18, paddingTop: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: effectivePast ? "#1e2235" : "#3a4060", letterSpacing: "0.5px", lineHeight: 1.5 }}>
          {fmtDate(item.date).replace(",", "\n")}
        </div>
      </div>

      {/* Dot — diamond shape via rotation */}
      <div style={{
        width: 8, height: 8,
        background: effectivePast ? "transparent" : col + "cc",
        border: `1.5px solid ${effectivePast ? "#1e2235" : col}`,
        transform: "rotate(45deg)",
        marginLeft: -4, marginTop: 14, flexShrink: 0, zIndex: 1,
        boxShadow: !effectivePast && days <= 30 ? `0 0 8px ${col}66` : "none",
      }} />

      {/* Card */}
      <div style={{
        flex: 1, marginLeft: 16,
        background: effectivePast ? "transparent" : "#0d0f18",
        border: `1px solid ${effectivePast ? "#141828" : col + "28"}`,
        borderLeft: `2px dashed ${effectivePast ? "#1a1e2e" : col + "55"}`,
        borderRadius: 8,
        padding: effectivePast ? "8px 14px" : "12px 16px",
        opacity: effectivePast ? 0.35 : 1,
        transition: "box-shadow 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            {/* Tag + countdown row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: effectivePast ? 2 : 5 }}>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
                color: effectivePast ? "#252838" : col + "bb",
                fontFamily: MONO,
              }}>◎ {item.tag}</span>
              {!effectivePast && (
                <span style={{
                  fontFamily: MONO, fontSize: 9, fontWeight: 700,
                  color: urg, letterSpacing: "1.5px",
                  textShadow: days <= 30 ? `0 0 8px ${urg}66` : "none",
                  marginLeft: "auto",
                }}>
                  {countdownLabel(days)}
                </span>
              )}
              {effectivePast && (
                <span style={{ fontFamily: MONO, fontSize: 8, color: "#1e2235", letterSpacing: "1px", marginLeft: "auto" }}>
                  {countdownLabel(days)}
                </span>
              )}
            </div>
            {/* Title */}
            <div style={{
              fontSize: effectivePast ? 13 : 15,
              fontWeight: 600,
              color: effectivePast ? "#2a2e40" : "#c8ccd8",
              letterSpacing: "0.2px",
              lineHeight: 1.2,
              fontFamily: BODY,
            }}>{item.title}</div>
            {/* Description */}
            {item.description && !effectivePast && (
              <div style={{ fontSize: 11, color: "#3e4460", lineHeight: 1.65, marginTop: 5 }}>
                {item.description}
              </div>
            )}
          </div>
          <div className="rm3-actions" style={{ display: "flex", gap: 2, opacity: hovered ? 1 : 0, transition: "opacity 0.15s", flexShrink: 0, paddingTop: 2 }}>
            <button onClick={onEdit} style={{ background: "none", border: "none", color: "#3a4060", fontSize: 11, cursor: "pointer", padding: "2px 5px", fontFamily: MONO }}
              onMouseEnter={e => e.currentTarget.style.color = "#8090cc"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a4060"}>✎</button>
            <button onClick={onDelete} style={{ background: "none", border: "none", color: "#4a2020", fontSize: 11, cursor: "pointer", padding: "2px 5px" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff6b6b"}
              onMouseLeave={e => e.currentTarget.style.color = "#4a2020"}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}
