// src/pages/SignalNoisePage.jsx
// Signal / Noise — AI Reliance Tracker
// Read-only mirror. All data patched by Claude in weekly debate sessions.
// Source of truth: src/data/signal_noise.js (static seed) — written to signal_noise.json on disk via Tauri invoke or /api/ fetch
// Never add inputs here. Debate happens in Claude.

import { useState, useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SIGNAL_NOISE_DATA as SIGNAL_NOISE_SEED } from "../data/signal_noise.js";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Syne:wght@700;800&family=IBM+Plex+Sans:wght@300;400;500&display=swap";

// ── META SKILLS — how you work with AI ───────────────────────────────────────
const META_SKILLS = [
  { id:"prompting", cat:"Meta Skills",   name:"Prompting — Directing AI",
    desc:"How well you craft inputs to get useful outputs — specificity, iteration, context-setting.",
    aiPct:28, priority:3,
    aiReason:"You show above-average prompting instinct — you push back, add context, shape outputs. The gap is making it systematic rather than instinctive.",
    bridge:"Document your best prompts. Build a personal prompt library. Go from instinct to repeatable system." },
  { id:"framing",   cat:"Meta Skills",   name:"Problem Framing — Knowing What to Ask",
    desc:"Can you define the actual problem before reaching for AI? Do you know what you don't know?",
    aiPct:39, priority:3,
    aiReason:"You are developing sharp instinct for what questions matter. You do not always know the answer, but you are increasingly asking the right questions.",
    bridge:"Before any AI session, write your question in one clear sentence. If you cannot — think first, then ask." },
  { id:"creative",  cat:"Meta Skills",   name:"Creative & Design Decisions",
    desc:"Who owns the vision — you or the AI? Are your aesthetic and design choices genuinely yours?",
    aiPct:36, priority:3,
    aiReason:"Your taste and creative direction are genuinely yours — you know when something looks wrong and push for better. AI executes. The vision is largely yours.",
    bridge:"Keep a taste board. When you reject an AI output, write down why in your own words. That's your design language forming." },
  { id:"writing",   cat:"Meta Skills",   name:"Writing — Communicating Ideas Clearly",
    desc:"Can you express a technical idea in plain language without AI polishing it first?",
    aiPct:47, priority:2,
    aiReason:"Your raw ideas are strong. But you lean on AI to structure and polish them — the final form is collaborative, not solo.",
    bridge:"Write one unpolished first draft per week without AI. Submit it. Imperfect independent output beats perfect AI output for growth." },
  { id:"research",  cat:"Meta Skills",   name:"Research — Finding & Synthesizing Info",
    desc:"Do you go to primary sources, or do you ask Claude to summarize everything for you?",
    aiPct:64, priority:2,
    aiReason:"You tend to ask Claude before searching primary sources. You accept synthesized answers without verifying against original material.",
    bridge:"For every major claim Claude makes, find the primary source yourself. Verification before acceptance." },
  { id:"systems",   cat:"Meta Skills",   name:"Systems Thinking — Architecting Solutions",
    desc:"Can you map out a complex problem yourself before AI structures it for you?",
    aiPct:71, priority:2,
    aiReason:"When facing a complex problem, you reach for AI to structure it rather than mapping it yourself first.",
    bridge:"Before opening Claude on any new problem, spend 5 min mapping it on paper. Boxes, arrows, unknowns. Then compare your map to what Claude produces." },
];

// ── CS PRACTICAL — hands-on execution skills ──────────────────────────────────
const PRACTICAL_SKILLS = [
  { id:"html",      cat:"CS Practical",  name:"HTML / Frontend Builds",
    desc:"Can you write a UI component — HTML, CSS, JS — from scratch without AI generating it for you?",
    aiPct:84, priority:1,
    aiReason:"You bring creative direction — but the actual HTML, CSS, and JS is produced entirely by Claude. You cannot yet write a component from scratch without AI scaffolding.",
    bridge:"Hand-write one small component per week without AI. Start: a nav bar, a card. Read every line Claude outputs — understand it before you keep it." },
  { id:"codelogic", cat:"CS Practical",  name:"Code Logic — Understanding What It Does",
    desc:"Can you read a block of code and explain exactly what it does, line by line, without AI help?",
    aiPct:75, priority:1,
    aiReason:"Surface-level reading: yes. Tracing execution flow, debugging cold, or explaining why something works without AI: not yet.",
    bridge:"After every Claude-generated block, close the chat. Explain the logic out loud. If you cannot — you do not own it yet." },
  { id:"debugging", cat:"CS Practical",  name:"Debugging Cold — Finding Breaks Without AI",
    desc:"Given a broken program, can you read the error, form a hypothesis, and fix it without pasting it into Claude?",
    aiPct:82, priority:1,
    aiReason:"When something breaks, the reflex is to paste it into Claude. Reading a stack trace, forming a hypothesis, isolating the bug yourself — that muscle is barely trained.",
    bridge:"Next time something breaks, give yourself 15 minutes before opening Claude. Read the error. Form a hypothesis. Check one thing at a time. Log the attempt." },
  { id:"docs",      cat:"CS Practical",  name:"Reading Documentation — Primary Sources",
    desc:"Can you open official docs — MDN, cppreference, man pages — and extract what you need without Claude summarizing it?",
    aiPct:78, priority:2,
    aiReason:"You ask Claude to summarize docs instead of going to MDN, cppreference, or man pages directly. You are outsourcing source comprehension entirely.",
    bridge:"For every library or function you use this week, open the official docs first. Skim the actual spec before asking Claude anything about it." },
  { id:"testing",   cat:"CS Practical",  name:"Testing & Verification — Does It Actually Work",
    desc:"Do you write tests and verify edge cases yourself, or do you run it once and trust the AI output?",
    aiPct:73, priority:2,
    aiReason:"You run it once, it looks fine, and you move on. You are not writing tests. You are not verifying edge cases. You are trusting AI output without interrogating it.",
    bridge:"After every Claude-generated function, write two tests yourself: one happy path, one edge case. If you cannot think of an edge case — that's the gap." },
];

// ── CS ACADEMIC — course subjects, exam-graded ────────────────────────────────
const ACADEMIC_SKILLS = [
  { id:"dsa",      cat:"CS Academic",  name:"Data Structures & Algorithms",
    desc:"Can you trace, implement, and analyze DS&A cold — BFS, hash maps, time complexity — no AI, no notes?",
    aiPct:81, priority:1,
    aiReason:"Exam reality: can you trace a BFS, implement a hash map, or analyze time complexity on a whiteboard — no AI, no notes? If not, reliance is high.",
    bridge:"3 LeetCode Easy problems per week, no AI. Grade yourself. Track which patterns you cannot solve cold." },
  { id:"automata", cat:"CS Academic",  name:"Automata & Theory of Computation",
    desc:"Can you construct DFAs/NFAs, write formal proofs, and reason about Turing machines on paper?",
    aiPct:87, priority:1,
    aiReason:"Formal proofs, DFA/NFA construction, Turing machine arguments — these require pen-and-paper thinking that AI cannot do for you in an exam room.",
    bridge:"Redraw every DFA/NFA from lecture by hand the same evening. Prove pumping lemma cases without looking at solutions first." },
  { id:"linalg",   cat:"CS Academic",  name:"Linear Algebra",
    desc:"Do you own the geometric intuition behind matrices, eigenvalues, and transformations — or just the mechanics?",
    aiPct:75, priority:2,
    aiReason:"Matrix mechanics are learnable. But eigenvalues, vector spaces, and transformations require geometric intuition hard to build through AI explanations alone.",
    bridge:"Draw every transformation visually. 3Blue1Brown's Essence of Linear Algebra — watch, then reproduce the intuition in your own words." },
  { id:"calc",     cat:"CS Academic",  name:"Calculus",
    desc:"Can you work through limits, derivatives, integrals, and series convergence without reaching for AI?",
    aiPct:64, priority:2,
    aiReason:"Basic derivatives and integrals: probably okay. Limits, series convergence, and multivariable — likely AI-assisted when it gets non-trivial.",
    bridge:"Solve every practice exam problem twice: once with AI to understand, once cold to verify you actually own it." },
  { id:"stats",    cat:"CS Academic",  name:"Statistics & Probability",
    desc:"Do you understand why a statistical test applies, or are you just pattern-matching and plugging in numbers?",
    aiPct:72, priority:2,
    aiReason:"Plug-and-chug: fine. But Bayesian reasoning, hypothesis testing logic, and knowing which test applies when — that requires real conceptual ownership.",
    bridge:"For every stats problem, state the assumptions out loud before solving. If you cannot say why a test applies, you are pattern-matching not understanding." },
  { id:"discrete", cat:"CS Academic",  name:"Discrete Math",
    desc:"Can you reason through proofs, logic, combinatorics, and asymptotic analysis cold — no AI, no notes?",
    aiPct:78, priority:1,
    aiReason:"Propositions and basic logic are solid. But rigorous proofs, asymptotic analysis, and algorithm-heavy discrete problems are shaky without AI scaffolding — and these are the backbone of every upper CS course.",
    bridge:"Pick one proof type per week — induction, contradiction, direct — and write it cold without AI. Check after. Asymptotic: practice Big-O comparisons daily until the intuition is automatic." },
];

const ALL_SKILLS = [...META_SKILLS, ...PRACTICAL_SKILLS, ...ACADEMIC_SKILLS];

// ── WEEKLY PATCH — Claude replaces this each week after debate ───────────────
const WEEKLY_PATCH = null;

// ── BLANK SEED — real data comes from weekly debate sessions ─────────────────
const DUMMY_SEED = {
  currentWeek: 1,
  history:     [],
  examDates:   {},
  evidence:    {},
  debateLog:   {},
};

// ── STORAGE ──────────────────────────────────────────────────────────────────
// No localStorage. Ever. Source of truth is always signal_noise.json on disk.
// Tauri: invoke("save_data_file" / "load_data_file")
// Dev (pnpm dev): POST /api/save-data-file  GET /api/load-data-file
// Same pattern as DataContext.jsx — consistent across the whole app.

const SN_FILE = "signal_noise.json";

function isTauri() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

// Nuke any stale localStorage on load so it can never shadow the file
try { localStorage.removeItem("coogs_signal_noise"); } catch (_) { /* noop */ }

// Tauri IPC can throw "message channel closed before a response was received"
// if React mounts and fires effects before the webview IPC bridge is ready.
// retryInvoke catches that specific error and retries with exponential backoff
// (100ms → 200ms → 400ms) before giving up and re-throwing.
const CHANNEL_CLOSED = "message channel closed before a response was received";
async function retryInvoke(cmd, args, retries = 3, delayMs = 100) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await invoke(cmd, args);
    } catch (e) {
      const msg = (e?.message || String(e)).toLowerCase();
      const isChannelError = msg.includes("channel closed") || msg.includes(CHANNEL_CLOSED.toLowerCase());
      if (isChannelError && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt)));
      } else {
        throw e;
      }
    }
  }
}

// Returns true on success, false on failure — callers can surface errors to the user.
async function persistData(data) {
  const content = JSON.stringify(data, null, 2);
  try {
    if (isTauri()) {
      await retryInvoke("save_data_file", { filename: SN_FILE, content });
    } else {
      const res = await fetch("/api/save-data-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: SN_FILE, content }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
    }
    return true;
  } catch (e) {
    console.error("[SignalNoise] persistData failed:", e);
    return false;
  }
}

async function loadData() {
  try {
    if (isTauri()) {
      const raw = await retryInvoke("load_data_file", { filename: SN_FILE });
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SIGNAL_NOISE_SEED));
    } else {
      const res = await fetch(`/api/load-data-file?filename=${SN_FILE}`);
      const json = await res.json();
      return json.content ? JSON.parse(json.content) : JSON.parse(JSON.stringify(SIGNAL_NOISE_SEED));
    }
  } catch (_) {
    return JSON.parse(JSON.stringify(SIGNAL_NOISE_SEED)); // file doesn't exist yet — seed from JS
  }
}

// ── ARCHIVE SWEEP ─────────────────────────────────────────────────────────────
// Runs on every load (not just on patch days) so the 3-week window never drifts.
// Mutates in place — only called on already-cloned data. Returns true if anything changed.
function sweepArchive(data) {
  const currentWeek = data.currentWeek || 1;
  let changed = false;
  Object.values(data.debateLog || {}).forEach(entries => {
    (entries || []).forEach(e => {
      if (!e.archived && (currentWeek - e.week) >= 3) {
        e.archived = true;
        changed = true;
      }
    });
  });
  return changed;
}

function applyPatch(rawData) {
  if (!WEEKLY_PATCH || !WEEKLY_PATCH.week || rawData.currentWeek > WEEKLY_PATCH.week) return rawData;
  // Deep-clone so mutations don't touch rawData — the identity check (patched !== data)
  // in the mount effect depends on getting back a different object reference.
  const data = JSON.parse(JSON.stringify(rawData));
  const p = WEEKLY_PATCH;
  const skillMap = {};
  ALL_SKILLS.forEach(s => {
    const v = p.verdicts ? p.verdicts[s.id] : null;
    if (!v) return;
    skillMap[s.id] = v.verdict;
    if (!data.debateLog[s.id]) data.debateLog[s.id] = [];
    data.debateLog[s.id].forEach(e => {
      if (!e.archived && (p.week - e.week) >= 3) e.archived = true;
    });
    data.debateLog[s.id].push({
      week:       p.week,
      date:       p.date,
      aiPct:      s.aiPct,
      youPct:     v.youPct != null ? v.youPct : null,
      verdict:    v.verdict,
      youReason:  v.youReason || "",
      swingPoint: v.swingPoint || p.globalSwing || "",
      archived:   false,
      summary:    "Wk " + p.week + ": " + v.verdict + "% verdict (AI was " + s.aiPct + "%). " + (v.swingPoint || p.globalSwing || ""),
    });
  });
  if (p.evidence) {
    Object.entries(p.evidence).forEach(([id, items]) => {
      if (!data.evidence[id]) data.evidence[id] = [];
      data.evidence[id].push(...items);
    });
  }
  if (p.examDates) data.examDates = { ...data.examDates, ...p.examDates };
  const vals = Object.values(skillMap);
  const avg  = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length) : 0;
  data.history.push({ week: p.week, date: p.date, avgVerdict: avg, skills: skillMap });
  data.currentWeek = p.week + 1;
  return data;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function scoreColor(p) {
  if (p == null) return "#888";
  if (p >= 75) return "#e87a7a";
  if (p >= 50) return "#e8b07a";
  if (p >= 30) return "#e8c97a";
  return "#7ae8a8";
}

function examUrgency(examDates, id) {
  const date = examDates ? examDates[id] : null;
  if (!date) return null;
  const days = Math.round((new Date(date) - new Date()) / 86400000);
  if (isNaN(days) || days < 0) return null;
  if (days <= 7)  return { level:"danger",  label:days+"d to exam", color:"#e87a7a" };
  if (days <= 21) return { level:"warning", label:days+"d to exam", color:"#e8b07a" };
  return { level:"ok", label:days+"d to exam", color:"#888" };
}

// ── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ skillId, history }) {
  const data = history.slice(-6).map(h => h.skills[skillId]).filter(v => v != null);
  if (!data.length) return (
    <div style={{ width:56, height:28, display:"flex", alignItems:"center" }}>
      <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.44rem", color:"#555" }}>—</span>
    </div>
  );
  return (
    <div style={{ width:56, height:28, display:"flex", alignItems:"flex-end", gap:2, flexShrink:0 }}>
      {data.map((v, i) => {
        const isCur = i === data.length - 1;
        const h = Math.max(3, Math.round((v / 100) * 28));
        return <div key={i} style={{ flex:1, height:h, borderRadius:"1px 1px 0 0", background: isCur ? scoreColor(v) : "#272727", opacity: isCur ? 1 : 0.6 }} />;
      })}
    </div>
  );
}

// ── RADAR ────────────────────────────────────────────────────────────────────
function RadarCanvas({ history, weekIdx, onLabelClick }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 480, H = 380;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    if (cancelled) return;
    const snapshot = weekIdx !== null ? history[weekIdx] : history[history.length - 1];
    const prevSnapshot = weekIdx !== null ? history[weekIdx - 1] : history[history.length - 2];
    const axes = ALL_SKILLS.map((s, i) => ({
      label: String(i + 1),
      id: s.id,
      ai: s.aiPct,
      verdict: snapshot && snapshot.skills ? snapshot.skills[s.id] : null,
    }));
    const N = axes.length, cx = W/2, cy = H/2;
    const r = Math.min(W, H) * 0.36;
    const step = (Math.PI * 2) / N, start = -Math.PI / 2;
    const pt = (val, i) => {
      const a = start + i * step, ratio = (100 - val) / 100;
      return { x: cx + Math.cos(a) * r * ratio, y: cy + Math.sin(a) * r * ratio };
    };
    const outerPt = (i, rad) => {
      const a = start + i * step;
      return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad };
    };
    // Grid rings
    [0.25, 0.5, 0.75, 1].forEach(ratio => {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const p = outerPt(i, r * ratio);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = ratio === 1 ? "#2e2e2e" : "#222";
      ctx.lineWidth = ratio === 1 ? 1.5 : 0.75;
      ctx.stroke();
    });
    // Spoke lines
    for (let i = 0; i < N; i++) {
      const p = outerPt(i, r);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = "#252525"; ctx.lineWidth = 0.75; ctx.stroke();
    }
    // Prev week ghost
    if (prevSnapshot) {
      ctx.beginPath();
      axes.forEach((a, i) => {
        const v = prevSnapshot.skills[a.id] != null ? prevSnapshot.skills[a.id] : 0;
        const p = pt(v, i); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(60,60,60,0.15)"; ctx.fill();
      ctx.strokeStyle = "rgba(100,100,100,0.3)"; ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    }
    // AI position polygon
    ctx.beginPath();
    axes.forEach((a, i) => {
      const p = pt(a.ai, i); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(122,184,232,0.06)"; ctx.fill();
    ctx.strokeStyle = "rgba(122,184,232,0.4)"; ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
    // Verdict polygon
    if (axes.some(a => a.verdict !== null)) {
      ctx.beginPath(); let first = true;
      axes.forEach((a, i) => {
        const v = a.verdict != null ? a.verdict : a.ai;
        const p = pt(v, i);
        if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(122,232,168,0.09)"; ctx.fill();
      ctx.strokeStyle = "rgba(122,232,168,0.9)"; ctx.lineWidth = 2; ctx.stroke();
      axes.forEach((a, i) => {
        if (a.verdict === null) return;
        const p = pt(a.verdict, i);
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#7ae8a8"; ctx.fill();
        ctx.strokeStyle = "#121212"; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    // Number labels — stored for hit testing
    canvas._labelHits = [];
    ctx.font = "700 10px IBM Plex Mono,monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    axes.forEach((a, i) => {
      const angle = start + i * step;
      const lx = cx + Math.cos(angle) * (r + 22);
      const ly = cy + Math.sin(angle) * (r + 22);
      ctx.fillStyle = "#7ae8a8";
      ctx.fillText(a.label, lx, ly);
      canvas._labelHits.push({ x: lx, y: ly, id: a.id, r: 10 });
    });
    return () => { cancelled = true; };
  }, [history, weekIdx]);

  function handleClick(e) {
    if (!onLabelClick) return;
    const canvas = canvasRef.current;
    if (!canvas || !canvas._labelHits) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const h of canvas._labelHits) {
      if (Math.hypot(mx - h.x, my - h.y) <= h.r) {
        onLabelClick(h.id);
        return;
      }
    }
  }

  return <canvas ref={canvasRef} style={{ display:"block", cursor:"pointer" }} onClick={handleClick} />;
}

// ── SKILL CARD ───────────────────────────────────────────────────────────────
function SkillCard({ skill, store, forceOpen, cardRef }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  const isOpen = open;
  const { history, debateLog, evidence, examDates } = store;
  const latestHistory = history[history.length - 1];
  const verdict = latestHistory && latestHistory.skills ? latestHistory.skills[skill.id] : null;
  const urg = examUrgency(examDates, skill.id);
  const log = debateLog[skill.id] || [];
  const lastEntry = log.length > 0 ? log[log.length - 1] : null;
  const evList = evidence[skill.id] || [];
  const verdictColor = verdict !== null ? scoreColor(verdict) : "#555";
  const M = { s1:"#121212", s2:"#181818", border:"#1e1e1e", border2:"#272727", text:"#e8e3d9", muted:"#888", muted2:"#aaa", accent:"#e8c97a", blue:"#7ab8e8" };
  const MONO = "IBM Plex Mono,monospace";
  const DISPLAY = "'Syne',sans-serif";
  const SANS = "IBM Plex Sans,sans-serif";
  return (
    <>
      <div ref={cardRef} onClick={() => { setOpen(o=>!o); }} style={{ background:M.s1, border:"1px solid "+(isOpen?"#333":M.border), display:"grid", gridTemplateColumns:"1fr auto auto auto", alignItems:"center", gap:"0.8rem", padding:"0.7rem 0.9rem", cursor:"pointer", transition:"border-color 0.15s", userSelect:"none" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:2 }}>{skill.cat}</div>
          <div style={{ fontFamily:MONO, fontSize:"0.8rem", fontWeight:600, color:M.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{skill.name}</div>
          {skill.desc && <div style={{ fontFamily:SANS, fontSize:"0.68rem", color:M.muted, marginTop:2, lineHeight:1.4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{skill.desc}</div>}
          {urg && <div style={{ display:"inline-flex", alignItems:"center", gap:3, fontFamily:MONO, fontSize:"0.5rem", padding:"1px 6px", border:"1px solid "+urg.color+"44", color:urg.color, marginTop:3, letterSpacing:"0.06em" }}>📅 {urg.label}</div>}
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:DISPLAY, fontSize: verdict!==null?"1.6rem":"1rem", fontWeight:800, lineHeight:1, color: verdict!==null?verdictColor:"#555" }}>{verdict!==null?verdict+"%":"—"}</div>
          <div style={{ fontFamily:MONO, fontSize:"0.52rem", color:M.muted, marginTop:1 }}>YOU {verdict!==null?100-verdict:"—"}% · AI {verdict!==null?verdict:skill.aiPct}%</div>
        </div>
        <Sparkline skillId={skill.id} history={history} />
        <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted, transition:"transform 0.18s", transform:isOpen?"rotate(90deg)":"none", marginLeft:"-0.3rem" }}>▶</div>
      </div>
      {isOpen && (
        <div style={{ background:M.s2, border:"1px solid "+M.border, borderTop:"none", padding:"0.8rem 0.9rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem" }}>
            <div style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.6rem 0.7rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>AI's Position</div>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, lineHeight:1, color:M.blue, marginBottom:"0.2rem" }}>{skill.aiPct}%</div>
              <div style={{ fontFamily:SANS, fontSize:"0.75rem", color:M.muted2, lineHeight:1.6 }}>{skill.aiReason}</div>
            </div>
            <div style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.6rem 0.7rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>Your Last Argument</div>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, lineHeight:1, color:M.accent, marginBottom:"0.2rem" }}>{lastEntry && lastEntry.youPct!=null ? lastEntry.youPct+"%" : "—"}</div>
              <div style={{ fontFamily:SANS, fontSize:"0.75rem", color:M.muted2, lineHeight:1.6, fontStyle:lastEntry && lastEntry.youReason?"normal":"italic" }}>{lastEntry && lastEntry.youReason ? lastEntry.youReason : "No argument recorded yet."}</div>
            </div>
          </div>
          {lastEntry && lastEntry.swingPoint && (
            <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid rgba(232,201,122,0.35)", background:M.s1 }}>
              <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.accent, marginBottom:2 }}>⚡ What shifted</div>
              <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.accent, lineHeight:1.6 }}>{lastEntry.swingPoint}</div>
            </div>
          )}
          <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid #272727", background:M.s1 }}>
            <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:2 }}>Bridge Action</div>
            <div style={{ fontFamily:SANS, fontSize:"0.75rem", color:M.muted2, lineHeight:1.6 }}>{skill.bridge}</div>
          </div>
          {lastEntry && lastEntry.shove && (
            <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid rgba(122,232,168,0.4)", background:M.s1 }}>
              <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.green, marginBottom:2 }}>→ This Week</div>
              <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.green, lineHeight:1.6 }}>{lastEntry.shove}</div>
            </div>
          )}
          {evList.length > 0 && (
            <div style={{ marginTop:"0.5rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.55rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>📎 Receipts ({evList.length})</div>
              {evList.map((ev,i) => (
                <div key={i} style={{ display:"flex", alignItems:"baseline", gap:"0.4rem", padding:"3px 0", borderBottom:i<evList.length-1?"1px solid #1e1e1e":"none" }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:M.accent, flexShrink:0, marginTop:5 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.68rem", color:M.muted2, lineHeight:1.5 }}>{ev.text}</div>
                  <div style={{ fontFamily:MONO, fontSize:"0.55rem", color:M.muted, marginLeft:"auto", flexShrink:0 }}>{ev.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── DEBATE LOG ───────────────────────────────────────────────────────────────
function DebateLog({ filter, search, store }) {
  const [collapsed, setCollapsed] = useState({});
  const { debateLog } = store;
  const skills = filter==="meta" ? META_SKILLS : filter==="practical" ? PRACTICAL_SKILLS : filter==="academic" ? ACADEMIC_SKILLS : ALL_SKILLS;
  const withLog = skills.filter(s => debateLog[s.id] && debateLog[s.id].length > 0);
  const q = search.toLowerCase().trim();
  let total=0, archived=0;
  withLog.forEach(s => (debateLog[s.id]||[]).forEach(e => { total++; if(e.archived) archived++; }));
  const MONO="IBM Plex Mono,monospace"; const DISPLAY="'Syne',sans-serif"; const SANS="IBM Plex Sans,sans-serif";
  const M={ s1:"#121212", s2:"#181818", border:"#1e1e1e", border2:"#272727", border3:"#333", muted:"#888", muted2:"#aaa", accent:"#e8c97a", blue:"#7ab8e8", green:"#7ae8a8", red:"#e87a7a" };
  if (!withLog.length) return <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, fontStyle:"italic", padding:"3rem", textAlign:"center", border:"1px solid "+M.border, background:M.s1 }}>No debate history yet.</div>;
  return (
    <div>
      {archived > 0 && <div style={{ fontFamily:MONO, fontSize:"0.63rem", color:M.muted, padding:"0.5rem 0.8rem", border:"1px solid "+M.border, background:M.s1, marginBottom:"0.8rem", display:"flex", alignItems:"center", gap:"0.5rem" }}><span style={{ color:M.accent }}>ℹ</span> {archived} entries auto-compressed (older than 3 weeks). Full data preserved.</div>}
      <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted, marginBottom:"0.8rem" }}>{total} entries · {archived} archived</div>
      {withLog.map(skill => {
        const entries = (debateLog[skill.id]||[]).filter(e => !q || [e.youReason,e.swingPoint,skill.name].some(v=>v&&v.toLowerCase().includes(q)));
        if (!entries.length) return null;
        const isCollapsed = collapsed[skill.id];
        return (
          <div key={skill.id} style={{ marginBottom:"1.4rem" }}>
            <div onClick={() => setCollapsed(c=>({...c,[skill.id]:!c[skill.id]}))} style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.4rem", cursor:"pointer", userSelect:"none" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.78rem", fontWeight:600, color:"#e8e3d9" }}>{skill.name}<span style={{ fontFamily:MONO, fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginLeft:4 }}>{skill.cat}</span></div>
              <div style={{ fontFamily:MONO, fontSize:"0.6rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, marginLeft:"auto" }}>{entries.length} entries</div>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.muted, transition:"transform 0.15s", transform:isCollapsed?"rotate(-90deg)":"none" }}>▾</div>
            </div>
            {!isCollapsed && (
              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {[...entries].reverse().map((e,i) => {
                  const changeVal = e.aiPct - e.verdict;
                  const changeColor = changeVal>0?"#7ae8a8":changeVal<0?"#e87a7a":"#888";
                  const changeStr = changeVal>0?"↓"+changeVal+" from AI":changeVal<0?"↑"+Math.abs(changeVal)+" above AI":"matched AI";
                  if (e.archived) return (
                    <div key={i} style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.75rem 0.9rem", opacity:0.7 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
                        <div style={{ fontFamily:MONO, fontSize:"0.6rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, background:M.s2 }}>Wk {e.week}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted }}>{e.date}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"2px 6px", border:"1px solid "+M.border2, color:M.muted, marginLeft:"auto" }}>compressed</div>
                      </div>
                      <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6, fontStyle:"italic", borderLeft:"2px solid "+M.border2, paddingLeft:"0.5rem" }}>{e.summary}</div>
                    </div>
                  );
                  return (
                    <div key={i} style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.75rem 0.9rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
                        <div style={{ fontFamily:MONO, fontSize:"0.6rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, background:M.s2 }}>Wk {e.week}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted }}>{e.date}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.6rem", padding:"2px 8px", border:"1px solid rgba(122,232,168,0.25)", color:M.green, background:"rgba(122,232,168,0.07)", marginLeft:"auto", whiteSpace:"nowrap" }}>⚑ {e.verdict}% <span style={{ color:changeColor, marginLeft:4 }}>{changeStr}</span></div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginTop:"0.4rem" }}>
                        <div style={{ background:M.s2, padding:"0.5rem 0.6rem", border:"1px solid "+M.border }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:3 }}>AI Position</div>
                          <div style={{ fontFamily:DISPLAY, fontSize:"1.2rem", fontWeight:700, lineHeight:1, color:M.blue, marginBottom:3 }}>{e.aiPct}%</div>
                          <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6 }}>{skill.aiReason.slice(0,140)}…</div>
                        </div>
                        <div style={{ background:M.s2, padding:"0.5rem 0.6rem", border:"1px solid "+M.border }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:3 }}>Your Position</div>
                          <div style={{ fontFamily:DISPLAY, fontSize:"1.2rem", fontWeight:700, lineHeight:1, color:M.accent, marginBottom:3 }}>{e.youPct!=null ? e.youPct+"%" : "—"}</div>
                          <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6, fontStyle:e.youReason?"normal":"italic" }}>{e.youReason||"No argument recorded."}</div>
                        </div>
                      </div>
                      {e.swingPoint && (
                        <div style={{ marginTop:"0.4rem", padding:"0.4rem 0.6rem", borderLeft:"2px solid rgba(232,201,122,0.35)", background:M.s2 }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.accent, marginBottom:2 }}>⚡ What shifted</div>
                          <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.accent, lineHeight:1.6 }}>{e.swingPoint}</div>
                        </div>
                      )}
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
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SignalNoisePage() {
  const [store, setStore]         = useState(null);   // null until async load resolves — no flash
  const [activeTab, setActiveTab] = useState("tracker");
  const [logFilter, setLogFilter] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [radarWeek, setRadarWeek] = useState(null);
  const [toast, setToast]         = useState("");
  const [openSkillId, setOpenSkillId] = useState(null);
  const cardRefs = useRef({});
  const [confirmReset, setConfirmReset] = useState(false); // in-UI confirm — safe in Tauri
  const [resetPw,      setResetPw]      = useState("");
  const [resetPwErr,   setResetPwErr]   = useState(false);

  // Load from signal_noise.json on mount
  useEffect(() => {
    (async () => {
      let data = await loadData();
      let saveError = null;
      if (!data) {
        data = DUMMY_SEED;
        const ok = await persistData(data);
        if (!ok) saveError = "⚠ Could not write seed — data won't persist.";
      } else {
        // Apply any pending weekly patch first
        const patched = applyPatch(data);
        if (patched !== data) {
          const ok = await persistData(patched);
          if (!ok) saveError = "⚠ Save failed — patch applied in memory only.";
          data = patched;
        } else {
          // No patch — still run the archive sweep on every load so the
          // 3-week window stays accurate even on patch-free weeks.
          const cloned = JSON.parse(JSON.stringify(data));
          if (sweepArchive(cloned)) {
            await persistData(cloned);
            data = cloned;
          }
        }
      }
      setStore(data);
      // Defer toast until after setStore — component exits loading screen first,
      // so the toast div actually exists in the DOM when the message fires.
      if (saveError) setTimeout(() => showToast(saveError), 50);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!document.querySelector('link[href*="IBM+Plex+Mono"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const exportState = useCallback(async () => {
    const data = await loadData() || store;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signal_noise_wk" + (data && data.currentWeek ? data.currentWeek : "??") + "_" + Date.now() + ".json";
    a.click();
    showToast("Exported — bring this to Claude for your next debate.");
  }, [store, showToast]);

  const resetData = useCallback(async () => {
    // window.confirm is a no-op in Tauri — use in-UI confirmReset state instead.
    const blank = { currentWeek:1, history:[], examDates:{}, evidence:{}, debateLog:{} };
    const ok = await persistData(blank);
    if (ok) {
      setStore(blank);
      setConfirmReset(false);
      showToast("Reset complete — Week 1, blank slate.");
    } else {
      setConfirmReset(false);
      showToast("⚠ Reset failed — could not write to disk.");
    }
  }, [showToast]);

  const M = { bg:"#0a0a0a", s1:"#121212", s2:"#181818", border:"#1e1e1e", border2:"#272727", border3:"#333", text:"#e8e3d9", muted:"#888", muted2:"#aaa", accent:"#e8c97a", blue:"#7ab8e8", green:"#7ae8a8", red:"#e87a7a", orange:"#e8b07a" };
  const MONO="IBM Plex Mono,monospace"; const DISPLAY="'Syne',sans-serif"; const SANS="IBM Plex Sans,sans-serif";

  // Block render entirely until data is loaded — prevents flash of wrong state
  if (store === null) return (
    <div style={{ background:"#0a0a0a", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.7rem", color:"#333", letterSpacing:"0.18em", textTransform:"uppercase" }}>—</div>
    </div>
  );

  const { history, currentWeek, examDates } = store;
  const latestHistory = history[history.length - 1];
  const avgVerdict = latestHistory
    ? (() => {
        const vals = Object.values(latestHistory.skills).filter(v => v != null);
        return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length) : null;
      })()
    : null;
  const avgColor = avgVerdict !== null ? scoreColor(avgVerdict) : "#888";

  const scored = ALL_SKILLS.map(s => {
    const v = latestHistory && latestHistory.skills ? latestHistory.skills[s.id] : null;
    if (v===null) return null;
    const urg = examUrgency(examDates, s.id);
    let boost=0;
    if (urg && urg.level==="danger")  boost=30;
    if (urg && urg.level==="warning") boost=15;
    return { ...s, _verdict:v, _score:v+boost, _urg:urg };
  }).filter(Boolean).sort((a,b)=>b._score-a._score).slice(0,3);

  return (
    <div style={{ background:M.bg, color:M.text, fontFamily:SANS, height:"100vh", overflowY:"auto", fontSize:17, position:"relative" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.022) 2px,rgba(0,0,0,0.022) 4px)" }} />
      {toast && <div style={{ position:"fixed", bottom:"2rem", right:"2rem", fontFamily:MONO, fontSize:"0.7rem", padding:"8px 16px", background:M.s2, border:"1px solid "+M.border3, color:M.green, letterSpacing:"0.07em", zIndex:1000 }}>{toast}</div>}
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"2rem 1.2rem 6rem", position:"relative", zIndex:1 }}>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"start", gap:"1rem", borderBottom:"1px solid "+M.border3, paddingBottom:"1.5rem", marginBottom:"1.5rem" }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:"0.68rem", letterSpacing:"0.28em", textTransform:"uppercase", color:M.accent, marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <div style={{ width:18, height:1, background:M.accent }} /> Personal OS — Weekly Calibration
            </div>
            <div style={{ fontFamily:DISPLAY, fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, lineHeight:0.95, letterSpacing:"-0.02em" }}>
              SIGNAL /<br/><span style={{ color:M.accent }}>NOISE</span>
            </div>
            <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, marginTop:"0.8rem", lineHeight:1.8, maxWidth:500 }}>
              Verdict is law. &nbsp;100 = AI-dependent &nbsp;·&nbsp; 0 = fully independent.<br/>
              <span style={{ color:M.accent }}>Debate happens in Claude.</span> This page is your record and mirror.
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"0.4rem" }}>
            <div style={{ fontFamily:MONO, fontSize:"0.7rem", padding:"5px 12px", border:"1px solid rgba(232,201,122,0.35)", color:M.accent, background:"rgba(232,201,122,0.12)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Week {currentWeek}</div>
            <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.muted }}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
            <div style={{ display:"flex", gap:"1.5rem", marginTop:"0.5rem" }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.5rem", fontWeight:800, lineHeight:1, color:avgColor }}>{avgVerdict !== null ? avgVerdict : "—"}{avgVerdict !== null ? "%" : ""}</div>
                <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>avg verdict</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.5rem", fontWeight:800, lineHeight:1, color:M.accent }}>{history.length}</div>
                <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:M.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>weeks locked</div>
              </div>
            </div>
            <button onClick={exportState} style={{ marginTop:"0.5rem", fontFamily:MONO, fontSize:"0.62rem", padding:"5px 12px", border:"1px solid "+M.border3, background:"transparent", color:M.muted, cursor:"pointer", letterSpacing:"0.07em", textTransform:"uppercase", transition:"all 0.13s" }}
              onMouseEnter={e=>e.currentTarget.style.color=M.text} onMouseLeave={e=>e.currentTarget.style.color=M.muted}>
              ↓ Export for Debate
            </button>
            {!confirmReset ? (
              <button onClick={()=>{setConfirmReset(true);setResetPw("");setResetPwErr(false);}} style={{ fontFamily:MONO, fontSize:"0.62rem", padding:"5px 12px", border:"1px solid rgba(232,122,122,0.2)", background:"transparent", color:"rgba(232,122,122,0.45)", cursor:"pointer", letterSpacing:"0.07em", textTransform:"uppercase", transition:"all 0.13s" }}
                onMouseEnter={e=>e.currentTarget.style.color=M.red} onMouseLeave={e=>e.currentTarget.style.color="rgba(232,122,122,0.45)"}>
                ↺ Reset
              </button>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, padding:"8px 10px", border:"1px solid rgba(232,122,122,0.35)", background:"rgba(232,122,122,0.07)" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.58rem", color:M.red, letterSpacing:"0.06em" }}>Wipe all data? Enter password.</div>
                <input
                  type="password"
                  value={resetPw}
                  onChange={e=>{setResetPw(e.target.value);setResetPwErr(false);}}
                  onKeyDown={e=>{if(e.key==="Enter"){if(resetPw==="Jesiah"){resetData();}else{setResetPwErr(true);setResetPw("");}}}}
                  placeholder="password"
                  autoFocus
                  style={{ fontFamily:MONO, fontSize:"0.62rem", padding:"4px 8px", background:"transparent", border:`1px solid ${resetPwErr?"rgba(232,122,122,0.8)":M.border3}`, color:resetPwErr?M.red:M.text, outline:"none", width:"120px", letterSpacing:"0.05em" }}
                />
                {resetPwErr && <div style={{ fontFamily:MONO, fontSize:"0.55rem", color:M.red, letterSpacing:"0.05em" }}>wrong password</div>}
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>{setConfirmReset(false);setResetPw("");setResetPwErr(false);}} style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"3px 9px", border:"1px solid "+M.border3, background:"transparent", color:M.muted, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>Cancel</button>
                  <button onClick={()=>{if(resetPw==="Jesiah"){resetData();}else{setResetPwErr(true);setResetPw("");}}} style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"3px 9px", border:"1px solid rgba(232,122,122,0.5)", background:"rgba(232,122,122,0.15)", color:M.red, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid "+M.border3, marginBottom:"1.5rem" }}>
          {[["tracker","📡 Dashboard"],["log","📜 Debate Log"]].map(([id,label]) => (
            <div key={id} onClick={()=>setActiveTab(id)} style={{ fontFamily:MONO, fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.5rem 1.1rem", cursor:"pointer", color:activeTab===id?M.accent:M.muted, borderBottom:"2px solid "+(activeTab===id?M.accent:"transparent"), marginBottom:-1, userSelect:"none", transition:"all 0.13s" }}>{label}</div>
          ))}
        </div>

        {activeTab==="tracker" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.2rem", alignItems:"start" }}>
            <div>
              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.4rem 1.2rem 1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.4rem" }}>
                  Reliance Radar
                  <span style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {history.map((h,i) => (
                      <span key={i} onClick={()=>setRadarWeek(radarWeek===i?null:i)} style={{ padding:"1px 6px", border:"1px solid "+(radarWeek===i?"rgba(232,201,122,0.35)":M.border2), color:radarWeek===i?M.accent:M.muted, cursor:"pointer", background:radarWeek===i?"rgba(232,201,122,0.1)":"transparent", fontSize:"0.58rem" }}>Wk{h.week}</span>
                    ))}
                    <span onClick={()=>setRadarWeek(null)} style={{ padding:"1px 6px", border:"1px solid "+(radarWeek===null?"rgba(232,201,122,0.35)":M.border2), color:radarWeek===null?M.accent:M.muted, cursor:"pointer", background:radarWeek===null?"rgba(232,201,122,0.1)":"transparent", fontSize:"0.58rem" }}>Now</span>
                  </span>
                </div>
                <div style={{ display:"flex", justifyContent:"center" }}>
                  <RadarCanvas history={history} weekIdx={radarWeek} onLabelClick={id => {
                    setOpenSkillId(id);
                    setTimeout(() => {
                      const el = cardRefs.current[id];
                      if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
                    }, 50);
                  }} />
                </div>
                <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.6rem", flexWrap:"wrap", justifyContent:"center" }}>
                  {ALL_SKILLS.map((s, i) => (
                    <span key={s.id} onClick={() => {
                      setOpenSkillId(s.id);
                      setTimeout(() => {
                        const el = cardRefs.current[s.id];
                        if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
                      }, 50);
                    }} style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.5rem", color:"#7ae8a8", cursor:"pointer", padding:"1px 4px", border:"1px solid #7ae8a822", borderRadius:3 }} title={s.name}>
                      {i+1} {s.name.split("—")[0].trim().slice(0,10)}
                    </span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"1rem", marginTop:"0.8rem", flexWrap:"wrap", justifyContent:"center" }}>
                  {[["rgba(122,184,232,0.7)","AI position"],["#7ae8a8","Verdict"],["#303030","Prev week"]].map(([col,lbl]) => (
                    <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5, fontFamily:MONO, fontSize:"0.55rem", color:M.muted }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:col }} />{lbl}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop:"1.3rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>Meta Skills</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>{META_SKILLS.length} axes</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {META_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>

              <div style={{ marginTop:"1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>CS Practical</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>hands-on execution</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {PRACTICAL_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>

              <div style={{ marginTop:"1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>CS Academic</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.58rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>exam-reality</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {ACADEMIC_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, marginBottom:2 }}>Overall Status</div>
                <div style={{ fontFamily:MONO, fontSize:"0.55rem", color:M.muted, letterSpacing:"0.08em", marginBottom:"0.9rem" }}>Week {currentWeek} · {history.length} weeks recorded</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"0.4rem", marginBottom:"0.5rem" }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:"3rem", fontWeight:800, lineHeight:1, color:avgColor }}>{avgVerdict !== null ? avgVerdict : "—"}</div>
                  <div style={{ fontFamily:MONO, fontSize:"0.5rem", color:M.muted, lineHeight:1.7 }}>%<br/>avg AI<br/>reliance</div>
                </div>
                <div style={{ height:3, background:M.border3, marginBottom:"0.9rem" }}>
                  <div style={{ height:"100%", width:(avgVerdict !== null ? avgVerdict : 0)+"%", background:avgColor, transition:"width 0.6s" }} />
                </div>
                {avgVerdict !== null && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:MONO, fontSize:"0.52rem", padding:"3px 9px", letterSpacing:"0.06em", textTransform:"uppercase", border:"1px solid", ...(avgVerdict>=75?{color:M.red,borderColor:"rgba(232,122,122,0.25)",background:"rgba(232,122,122,0.1)"}:avgVerdict>=50?{color:M.orange,borderColor:"rgba(232,176,122,0.25)",background:"rgba(232,176,122,0.07)"}:{color:M.green,borderColor:"rgba(122,232,168,0.25)",background:"rgba(122,232,168,0.1)"}) }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"currentColor", flexShrink:0 }} />
                    {avgVerdict>=75?"High Reliance — Action Needed":avgVerdict>=50?"Moderate — Progress Made":"Low Reliance — Strong Signal"}
                  </div>
                )}
              </div>

              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"0.6rem" }}>Priority Actions</div>
                {scored.length===0 ? <div style={{ fontFamily:MONO, fontSize:"0.58rem", color:M.muted, fontStyle:"italic" }}>No verdicts yet.</div>
                : scored.map((s,i) => (
                  <div key={s.id} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0.6rem", alignItems:"start", padding:"0.6rem 0", borderBottom:i<scored.length-1?"1px solid "+M.border:"none" }}>
                    <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, color:[M.red,M.orange,M.accent][i], lineHeight:1, paddingTop:2, minWidth:24 }}>{["01","02","03"][i]}</div>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:"0.6rem", fontWeight:600, color:M.text, marginBottom:2 }}>{s.name}</div>
                      {s._urg && <div style={{ display:"inline-flex", alignItems:"center", gap:3, fontFamily:MONO, fontSize:"0.52rem", padding:"1px 6px", border:"1px solid "+s._urg.color+"44", color:s._urg.color, marginBottom:3, letterSpacing:"0.06em" }}>📅 {s._urg.label}</div>}
                      <div style={{ fontFamily:SANS, fontSize:"0.75rem", color:M.muted2, lineHeight:1.5 }}>{s.bridge}</div>
                      <div style={{ fontFamily:MONO, fontSize:"0.55rem", color:M.red, marginTop:3 }}>Verdict: {s._verdict}% reliance</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"0.4rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  Weekly History <span style={{ color:M.muted2 }}>{history.length} snapshots</span>
                </div>
                {history.length===0 ? <div style={{ fontFamily:MONO, fontSize:"0.58rem", color:M.muted, fontStyle:"italic" }}>No snapshots yet.</div>
                : history.map((h,i) => {
                  const isCur = i===history.length-1;
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"52px 1fr 38px", alignItems:"center", gap:"0.5rem", padding:"4px 0" }}>
                      <div style={{ fontFamily:MONO, fontSize:"0.52rem", color:M.muted }}>Wk{h.week} <span style={{ fontSize:"0.4rem" }}>{h.date}</span></div>
                      <div style={{ height:3, background:M.border3 }}><div style={{ height:"100%", width:h.avgVerdict+"%", background:isCur?M.blue:M.accent }} /></div>
                      <div style={{ fontFamily:MONO, fontSize:"0.52rem", color:isCur?M.blue:M.muted, textAlign:"right" }}>{h.avgVerdict}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab==="log" && (
          <div>
            <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.2rem", flexWrap:"wrap", alignItems:"center" }}>
              {[["all","All"],["meta","Meta Skills"],["practical","CS Practical"],["academic","CS Academic"]].map(([id,label]) => (
                <button key={id} onClick={()=>setLogFilter(id)} style={{ fontFamily:MONO, fontSize:"0.65rem", padding:"5px 12px", cursor:"pointer", border:"1px solid "+(logFilter===id?"rgba(232,201,122,0.35)":M.border3), background:logFilter===id?"rgba(232,201,122,0.12)":"transparent", color:logFilter===id?M.accent:M.muted, textTransform:"uppercase", letterSpacing:"0.07em", transition:"all 0.12s" }}>{label}</button>
              ))}
              <input value={logSearch} onChange={e=>setLogSearch(e.target.value)} placeholder="Search debates…" style={{ fontFamily:MONO, fontSize:"0.7rem", padding:"5px 10px", background:M.s1, border:"1px solid "+M.border3, color:M.text, outline:"none", flex:1, minWidth:140 }} />
            </div>
            <DebateLog filter={logFilter} search={logSearch} store={store} />
          </div>
        )}

      </div>
    </div>
  );
}