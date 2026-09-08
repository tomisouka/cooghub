// src/pages/SignalNoisePage.jsx
// Signal / Noise — AI Reliance Tracker
// Read-only mirror. All data patched by Claude in weekly debate sessions.
// Source of truth: src/data/signal_noise.js (static seed) — written to signal_noise.json on disk via Tauri invoke or /api/ fetch
// Never add inputs here. Debate happens in Claude.

import { useState, useEffect, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SIGNAL_NOISE_DATA as SIGNAL_NOISE_SEED } from "../data/signal_noise.js";
import { DELETE_CONFIRM_PW } from "../config/localAuth";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Syne:wght@700;800&family=IBM+Plex+Sans:wght@300;400;500&display=swap";

// ── META SKILLS — how you work with AI ───────────────────────────────────────
const META_SKILLS = [
  { id:"context_engineering", cat:"Meta Skills", name:"Context Engineering — Directing AI",
    desc:"Do you craft precise inputs that get what you need first try, or do you iterate blindly until something sticks?",
    aiPct:28, priority:3,
    aiReason:"You get useful outputs on the first try and shape them with constraints like test scripts. The gap is moving from instinctive to systematic — building a repeatable context library.",
    bridge:"Before any Claude session, write the constraint and expected output format in one sentence. Build a personal context library — 5 patterns you reuse." },
  { id:"translator",   cat:"Meta Skills", name:"Translator — Expressing What's in Your Head",
    desc:"Can you articulate what you need, what broke, or what you built — in your own words, without Claude interpreting it for you?",
    aiPct:47, priority:2,
    aiReason:"You can describe the surface of a problem but not the logic underneath it. The gap between knowing something is broken and being able to say why it's broken — in code terms — is still wide.",
    bridge:"Next time something breaks, write one sentence describing it before opening Claude. What you see, not why. Build the reflex." },
  { id:"cold_vision",  cat:"Meta Skills", name:"Cold Vision — Thinking Before You Ask",
    desc:"Can you reason through a problem AND know what you want the output to look and feel like — before Claude touches it?",
    aiPct:39, priority:3,
    aiReason:"New territory defaults to asking Claude. When you're in familiar ground you have instincts, but the moment something is unfamiliar the reflex is to open Claude before thinking.",
    bridge:"Before the next your app feature, write 3 words: what you want it to look like, feel like, and do. That's your vision. Then open Claude." },
  { id:"shipwright",   cat:"Meta Skills", name:"Shipwright — Designing Before Building",
    desc:"Can you map the structure of what you're building — files, components, data flow — before Claude scaffolds it for you?",
    aiPct:71, priority:2,
    aiReason:"You explore architecture with Claude rather than arriving with a blueprint. You can describe what you want but you don't map it first — Claude does the structural thinking.",
    bridge:"Before the next feature: 5 minutes, paper, boxes and arrows. What talks to what. Then compare your map to what Claude produces." },
  { id:"domain",       cat:"Meta Skills", name:"Domain — Who Owns the Output",
    desc:"Are you the boss of what ships, or is Claude? Do you read, question, and own the code — or relay it?",
    aiPct:84, priority:1,
    aiReason:"Claude is Gojo, you're the volcano dude — your words. All code is Claude's. You catch mistakes only when Claude explains its own reasoning, not from reading the logic yourself.",
    bridge:"After every Claude-generated block, read it before running it. Not to fix it — to own it. If you can't explain it, you don't own it." },
];

// ── CS PRACTICAL — hands-on execution skills ──────────────────────────────────
const PRACTICAL_SKILLS = [
  { id:"codelogic", cat:"CS Practical",  name:"Code Logic — Understanding What It Does",
    desc:"Can you read a block of code and explain exactly what it does, line by line, without AI help?",
    aiPct:75, priority:1,
    aiReason:"'Scary to even look at' — your words about your own codebase. Surface-level pattern recognition exists but tracing execution flow cold is not there.",
    bridge:"After every Claude-generated block, close the chat. Explain the logic out loud. If you cannot — you do not own it yet." },
  { id:"debugging", cat:"CS Practical",  name:"Debugging Cold — Finding Breaks Without AI",
    desc:"Given a broken program, can you read the error, form a hypothesis, and fix it without pasting it into Claude?",
    aiPct:82, priority:1,
    aiReason:"Immediate paste reflex. You GUI-test, something looks off, paste. The solo attempt muscle is barely trained — even when you try, the reasoning breaks down fast.",
    bridge:"Next error: name the type out loud before opening Claude. Syntax, runtime, or logic. One word. Build the reflex before everything else." },
  { id:"markup",    cat:"CS Practical",  name:"Markup — HTML & CSS From Scratch",
    desc:"Can you write HTML structure and CSS styling from scratch — no Claude generating it for you?",
    aiPct:84, priority:1,
    aiReason:"All markup is Claude-generated. You bring direction but the actual HTML and CSS is produced entirely by Claude. You cannot yet write a component skeleton without scaffolding.",
    bridge:"Write a card component in HTML/CSS from memory — skeleton first, no Claude until you've got the structure down." },
  { id:"scripting", cat:"CS Practical",  name:"Scripting — JS, Python, Shell",
    desc:"Can you write logic, automation, or standalone scripts in JS, Python, or shell — without Claude generating it first?",
    aiPct:78, priority:1,
    aiReason:"Test scripts, your app JS, automation — all Claude-written. You direct what should happen but the actual code is generated, not written.",
    bridge:"Write one small JS function from scratch — even 5 lines. No Claude until it exists. Read every line of what you use." },
  { id:"frameworks", cat:"CS Practical", name:"Frameworks — React & Component Architecture",
    desc:"Can you make React decisions — hook choice, component structure, state design — without Claude proposing them first?",
    aiPct:84, priority:1,
    aiReason:"React and Tailwind are fully Claude-scaffolded. No independent hook or component decisions. You know the names but Claude decides how they're used.",
    bridge:"Next hook you use — write it yourself before asking Claude. Even if it's wrong. That's how the muscle builds." },
  { id:"compiled",  cat:"CS Practical",  name:"Compiled — C++, C, Java",
    desc:"Can you write and reason through compiled, typed language code without AI?",
    aiPct:78, priority:2,
    aiReason:"Not in active use this semester. Baseline reflects prior C++ exposure without current practice.",
    bridge:"When compiled languages appear in coursework — write the logic on paper before opening Claude." },
  { id:"assembly",  cat:"CS Practical",  name:"Assembly — ARM, MIPS, ASM",
    desc:"Can you reason at the instruction level — registers, memory, control flow — without notes or AI?",
    aiPct:87, priority:1,
    aiReason:"CompOrg covers ARM but nothing executed cold. Instruction-level reasoning requires pen-and-paper thinking that AI cannot do for you in an exam.",
    bridge:"Next ARM problem in CompOrg: attempt to write the instructions by hand before opening any reference." },
  { id:"sql",       cat:"CS Practical",  name:"SQL — Queries & Schema Design",
    desc:"Can you write queries, design schemas, and reason about relational data without Claude?",
    aiPct:90, priority:3,
    aiReason:"Not in active curriculum yet. Baseline set for when databases arrive.",
    bridge:"When SQL enters your coursework — write every query by hand first, then verify." },
  { id:"regex",     cat:"CS Practical",  name:"Regex — Pattern Matching & Parsing",
    desc:"Can you write and read regular expressions without Claude generating or explaining them?",
    aiPct:85, priority:3,
    aiReason:"Not in active use. Baseline set — regex shows up everywhere and tends to get fully outsourced.",
    bridge:"Next time you need a pattern match — write the regex yourself before asking Claude. Even a partial attempt." },
];

// ── CS ACADEMIC — course subjects, exam-graded ────────────────────────────────
const ACADEMIC_SKILLS = [
  { id:"dsa",      cat:"CS Academic",  name:"Data Structures & Algorithms",
    desc:"Can you trace, implement, and analyze DS&A cold — BFS, Dijkstra, hash maps, time complexity — no AI, no notes?",
    aiPct:81, priority:1,
    aiReason:"Dijkstra workshop was the first real engagement — applied and assisted. But tracing cold, implementing from memory, analyzing complexity — those muscles aren't trained yet.",
    bridge:"Trace Dijkstra on the workshop graph by hand. Write the priority queue state at every step. That's your evidence next week." },
  { id:"automata", cat:"CS Academic",  name:"Automata & Theory of Computation",
    desc:"Can you construct DFAs/NFAs, write formal proofs, and reason about formal languages on paper?",
    aiPct:87, priority:1,
    aiReason:"Nothing constructed cold in 3 weeks of an active course. DFA construction from spec, formal proofs — these are exam-room skills with no AI allowed.",
    bridge:"Draw the DFA for strings ending in '00' right now. Cold. No help. Check it after. This is on the exam." },
  { id:"linalg",   cat:"CS Academic",  name:"Linear Algebra",
    desc:"Do you own the geometric intuition behind matrices, transformations, and eigenvalues — or just the mechanics?",
    aiPct:75, priority:2,
    aiReason:"Nothing cold in 2 weeks of an active course. Row reduction breaks mid-problem. No geometric intuition built yet.",
    bridge:"One row reduction problem from 2318 textbook by hand. Every step. Find where you run out of moves — that's the gap." },
  { id:"calc",     cat:"CS Academic",  name:"Calculus",
    desc:"Can you work through derivatives, integrals, and limits without reaching for AI?",
    aiPct:64, priority:2,
    aiReason:"Three completed courses. Not in active curriculum. Drifting without a loop to keep it sharp.",
    bridge:"Find a way to keep calc in your CS loop — even one derivative a week keeps the decay from accelerating." },
  { id:"stats",    cat:"CS Academic",  name:"Statistics & Probability",
    desc:"Do you understand why a statistical test applies, or are you pattern-matching and plugging in numbers?",
    aiPct:72, priority:2,
    aiReason:"Reverse-engineered without learning it. Not in active curriculum. Concepts are formula-associated, not reason-associated.",
    bridge:"Pick one formula from your stats course. Write one sentence explaining why it works — not what it does." },
];

const ALL_SKILLS = [...META_SKILLS, ...PRACTICAL_SKILLS, ...ACADEMIC_SKILLS];

// ── PER-SKILL STEPS — specific, doable actions for each skill ─────────────────
const SKILL_STEPS = {
  context_engineering: [
    "Before opening Claude, write one sentence: what you want + what format. Send that first.",
    "Make prompts.md. Add 3 prompts you reuse right now. Done.",
    "Next Claude response that misses — give it one specific correction instead of re-asking from scratch.",
  ],
  translator: [
    "Something breaks → fill in: 'Problem is ___. I see ___ instead of ___.' Before Claude.",
    "Write one sentence describing what the Props tab does. Plain English. No code.",
    "Add a one-line comment to any function in your app you didn't write.",
  ],
  cold_vision: [
    "Next feature → write 3 words first: look, feel, purpose. Then open Claude.",
    "Before pasting a bug, write what you think the fix is. Even if wrong.",
    "Pick any your app tab. Write one change you'd make. No AI.",
  ],
  shipwright: [
    "Draw the Props tab data flow. Boxes and arrows. 5 minutes. Paper.",
    "Before your next feature, list the files you'll touch and why. Before Claude.",
    "Before building anything new, name the components: what renders what.",
  ],
  domain: [
    "Open useSaveData.js. Read 10 lines. Close it. Write what they do in plain English.",
    "Next Claude code block → read top to bottom before running. Mark ?? on any line you don't get.",
    "Find one function in your app you didn't write. Say out loud what it does.",
  ],
  codelogic: [
    "Open the fetchedRef guard. Write what you think it does. Then verify with Claude.",
    "Find a useEffect in your app. Write what triggers it and what it returns. No AI.",
    "Pick any 10 lines of your app code. Explain each line out loud before running anything.",
  ],
  debugging: [
    "Next error → write syntax, runtime, or logic before opening Claude. One word.",
    "Give yourself 5 minutes alone with the error before pasting. Form one hypothesis.",
    "Read the full error message before doing anything. Write in one sentence what it says.",
  ],
  markup: [
    "Blank HTML file → write a div, an h1, and a p. No Claude.",
    "Write a dark button with padding in HTML inline styles. No Claude until it exists.",
    "Look at a your app card. Write its HTML skeleton from memory. Structure only.",
  ],
  scripting: [
    "Write a JS function that filters an array to strings only. No Claude until written.",
    "Write a Python script that prints today's date. No Claude. Look up the import if needed.",
    "Find the simplest function Claude wrote in your app. Rewrite it from memory. Compare.",
  ],
  frameworks: [
    "Write useState from memory in a blank file. Don't look it up first.",
    "Write a useEffect that runs on mount only. No Claude until it exists.",
    "Pick any your app component. Write what props it takes and what it renders.",
  ],
  compiled: [
    "Write a C++ function that adds two ints. No Claude. Just signature + body.",
    "Write a C++ for loop printing 1 to 10. No Claude. Try syntax from memory first.",
    "Write a C++ Hello World main() from memory.",
  ],
  assembly: [
    "Write ARM to load 5 into a register and add 3. From CompOrg memory. No notes.",
    "Write what MOV does in ARM. One sentence. No notes.",
    "Write the ARM instruction that stores a register value to memory. No notes.",
  ],
  sql: [
    "Write SELECT * FROM users. No Claude.",
    "Write a SELECT with WHERE active = true. No Claude.",
    "Write CREATE TABLE picks with id, team, date. No Claude.",
  ],
  regex: [
    "Write a regex matching a string that starts with a digit. Try before Claude.",
    "Write a basic email regex. Try first.",
    "Write a regex matching a 4-digit number. Test mentally: does '1234' match? Does 'abc'?",
  ],
  dsa: [
    "Draw a 5-node graph. Trace Dijkstra. Write priority queue state after each step.",
    "Draw a 4-node graph. Trace BFS. Write queue state at every step.",
    "Write Dijkstra's time and space complexity. One sentence each.",
  ],
  automata: [
    "Draw the DFA for strings ending in '00'. Cold. Check after.",
    "Write the DFA 5-tuple from memory: (Q, Σ, δ, q0, F). Define each symbol.",
    "Draw the DFA for strings with at least one '1'. Cold. 3 states max.",
  ],
  linalg: [
    "Do one row reduction from the 2318 textbook. Stop where you lose the thread.",
    "Write the conditions for a matrix to be invertible. No notes.",
    "Multiply two 2×2 matrices by hand. Write every step.",
  ],
  calc: [
    "Derive x³ + 2x² - 5. Every step. No calculator.",
    "State L'Hôpital's rule from memory. One sentence. When does it apply?",
    "Integrate 2x dx. Every step. Cold.",
  ],
  stats: [
    "Write what a p-value means. Not the formula — the meaning. One sentence.",
    "Write Type I vs Type II error difference. One sentence each. Cold.",
    "Name one stats test. Write when you'd use it and why. One sentence.",
  ],
};

// ── WEEKLY PATCH — Claude replaces this each week after debate ───────────────
const WEEKLY_PATCH = {
  "week": 3,
  "date": "Apr 03",
  "globalSwing": "Major restructure — 19 skills replacing 16, meta skills renamed to reflect real gaps, coding split into 7 specific categories. Overall reliance up slightly as new baselines expose more blind spots. Dijkstra workshop was the only cold academic work — first DSA movement in 3 weeks.",
  "verdicts": {
    "context_engineering": { "verdict": 95, "youPct": null, "youReason": "Gets what he needs first try, shapes outputs with test scripts.", "swingPoint": "First-try accuracy and test script direction earned 2pts. Renamed from prompting." },
    "translator":          { "verdict": 72, "youPct": null, "youReason": "Can describe what's broken but not the code underneath it.", "swingPoint": "New skill week 3. Can name the problem surface, not the code logic." },
    "cold_vision":         { "verdict": 88, "youPct": null, "youReason": "New territory defaults to Claude. Blind paste when stuck, no pre-thinking.", "swingPoint": "Merged framing + creative. No cold reasoning or pre-vision this week." },
    "shipwright":          { "verdict": 72, "youPct": null, "youReason": "Explores with Claude, no prep, can't describe your app architecture cold.", "swingPoint": "Merged from systems. Exploration with Claude counts over pure dependency." },
    "domain":              { "verdict": 96, "youPct": null, "youReason": "Claude is Gojo. All code Claude's. Only catches errors when Claude explains reasoning.", "swingPoint": "New skill week 3. Zero ownership of codebase output." },
    "codelogic":           { "verdict": 96, "youPct": null, "youReason": "Can't explain own code cold. Scary to even look at the fetchedRef guard.", "swingPoint": "" },
    "debugging":           { "verdict": 94, "youPct": null, "youReason": "Tried to reason through Claude's logic independently, failed. Removed an emoji solo.", "swingPoint": "1pt for attempting independent reasoning before Claude." },
    "markup":              { "verdict": 97, "youPct": null, "youReason": "All Claude-generated. No scratch work, no docs consulted.", "swingPoint": "New skill week 3. Baseline at 97%." },
    "scripting":           { "verdict": 96, "youPct": null, "youReason": "Test scripts Claude-written. your app JS all Claude.", "swingPoint": "New skill week 3. Baseline at 96%." },
    "frameworks":          { "verdict": 97, "youPct": null, "youReason": "React and Tailwind all Claude-scaffolded. No independent decisions.", "swingPoint": "New skill week 3. Baseline at 97%." },
    "compiled":            { "verdict": 100, "youPct": null, "youReason": "Not touched.", "swingPoint": "New skill week 3. Baseline at 100%." },
    "assembly":            { "verdict": 98, "youPct": null, "youReason": "ARM in CompOrg but nothing executed cold.", "swingPoint": "New skill week 3. Baseline at 98%." },
    "sql":                 { "verdict": 100, "youPct": null, "youReason": "Not in curriculum yet.", "swingPoint": "New skill week 3. Baseline at 100%." },
    "regex":               { "verdict": 99, "youPct": null, "youReason": "Not touched.", "swingPoint": "New skill week 3. Baseline at 99%." },
    "dsa":                 { "verdict": 94, "youPct": null, "youReason": "Dijkstra GPS workshop — applied algo work, assisted but real.", "swingPoint": "2pts for applied Dijkstra. First algo engagement in 3 weeks." },
    "automata":            { "verdict": 90, "youPct": null, "youReason": "Nothing constructed, nothing attempted. Active course.", "swingPoint": "" },
    "linalg":              { "verdict": 90, "youPct": null, "youReason": "Nothing touched. Active course.", "swingPoint": "" },
    "calc":                { "verdict": 65, "youPct": null, "youReason": "Not in active loop. Slight regression for the gap.", "swingPoint": "" },
    "stats":               { "verdict": 95, "youPct": null, "youReason": "Nothing touched.", "swingPoint": "" }
  },
  "evidence": {},
  "examDates": {}
};

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
  // p = reliance %. Used internally for radar/sparkline (high reliance = red).
  if (p == null) return "#888";
  if (p >= 75) return "#e87a7a";
  if (p >= 50) return "#e8b07a";
  if (p >= 30) return "#e8c97a";
  return "#7ae8a8";
}
function indColor(reliance) {
  // Display color for independence (100 - reliance). Higher ind = greener.
  if (reliance == null) return "#888";
  const ind = 100 - reliance;
  if (ind >= 70) return "#7ae8a8";
  if (ind >= 50) return "#e8c97a";
  if (ind >= 25) return "#e8b07a";
  return "#e87a7a";
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
  const verdictColor = verdict !== null ? indColor(verdict) : "#555";
  const indVerdict = verdict !== null ? 100 - verdict : null;
  const M = { s1:"#121212", s2:"#181818", border:"#1e1e1e", border2:"#272727", text:"#e8e3d9", muted:"#888", muted2:"#aaa", accent:"#e8c97a", blue:"#7ab8e8" };
  const MONO = "IBM Plex Mono,monospace";
  const DISPLAY = "'Syne',sans-serif";
  const SANS = "IBM Plex Sans,sans-serif";
  return (
    <>
      <div ref={cardRef} onClick={() => { setOpen(o=>!o); }} style={{ background:M.s1, border:"1px solid "+(isOpen?"#333":M.border), display:"grid", gridTemplateColumns:"1fr auto auto auto", alignItems:"center", gap:"0.8rem", padding:"0.7rem 0.9rem", cursor:"pointer", transition:"border-color 0.15s", userSelect:"none" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:2 }}>{skill.cat}</div>
          <div style={{ fontFamily:MONO, fontSize:"0.9rem", fontWeight:600, color:M.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{skill.name}</div>
          {skill.desc && <div style={{ fontFamily:SANS, fontSize:"0.88rem", color:M.muted, marginTop:2, lineHeight:1.4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{skill.desc}</div>}
          {urg && <div style={{ display:"inline-flex", alignItems:"center", gap:3, fontFamily:MONO, fontSize:"0.62rem", padding:"1px 6px", border:"1px solid "+urg.color+"44", color:urg.color, marginTop:3, letterSpacing:"0.06em" }}>📅 {urg.label}</div>}
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:DISPLAY, fontSize: verdict!==null?"1.6rem":"1rem", fontWeight:800, lineHeight:1, color: verdict!==null?verdictColor:"#555" }}>{verdict!==null?indVerdict+"%":"—"}</div>
          <div style={{ fontFamily:MONO, fontSize:"0.62rem", color:M.muted, marginTop:1 }}>YOURS {verdict!==null?indVerdict:"—"}% · AI WRITES {verdict!==null?verdict:skill.aiPct}%</div>
        </div>
        <Sparkline skillId={skill.id} history={history} />
        <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, transition:"transform 0.18s", transform:isOpen?"rotate(90deg)":"none", marginLeft:"-0.3rem" }}>▶</div>
      </div>
      {isOpen && (
        <div style={{ background:M.s2, border:"1px solid "+M.border, borderTop:"none", padding:"0.8rem 0.9rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem" }}>
            <div style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.6rem 0.7rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>AI's Position</div>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, lineHeight:1, color:M.blue, marginBottom:"0.2rem" }}>{skill.aiPct}%</div>
              <div style={{ fontFamily:SANS, fontSize:"0.85rem", color:M.muted2, lineHeight:1.6 }}>{skill.aiReason}</div>
            </div>
            <div style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.6rem 0.7rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.14em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>Your Last Argument</div>
              <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, lineHeight:1, color:M.accent, marginBottom:"0.2rem" }}>{lastEntry && lastEntry.youPct!=null ? lastEntry.youPct+"%" : "—"}</div>
              <div style={{ fontFamily:SANS, fontSize:"0.85rem", color:M.muted2, lineHeight:1.6, fontStyle:lastEntry && lastEntry.youReason?"normal":"italic" }}>{lastEntry && lastEntry.youReason ? lastEntry.youReason : "No argument recorded yet."}</div>
            </div>
          </div>
          {lastEntry && lastEntry.swingPoint && (
            <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid rgba(232,201,122,0.35)", background:M.s1 }}>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.accent, marginBottom:2 }}>⚡ What shifted</div>
              <div style={{ fontFamily:MONO, fontSize:"0.82rem", color:M.accent, lineHeight:1.6 }}>{lastEntry.swingPoint}</div>
            </div>
          )}
          <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid #272727", background:M.s1 }}>
            <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:2 }}>Bridge Action</div>
            <div style={{ fontFamily:SANS, fontSize:"0.85rem", color:M.muted2, lineHeight:1.6 }}>{skill.bridge}</div>
          </div>
          {lastEntry && lastEntry.shove && (
            <div style={{ marginTop:"0.5rem", padding:"0.5rem 0.6rem", borderLeft:"2px solid rgba(122,232,168,0.4)", background:M.s1 }}>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.green, marginBottom:2 }}>→ This Week</div>
              <div style={{ fontFamily:MONO, fontSize:"0.82rem", color:M.green, lineHeight:1.6 }}>{lastEntry.shove}</div>
            </div>
          )}
          {evList.length > 0 && (
            <div style={{ marginTop:"0.5rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:"0.3rem" }}>📎 Receipts ({evList.length})</div>
              {evList.map((ev,i) => (
                <div key={i} style={{ display:"flex", alignItems:"baseline", gap:"0.4rem", padding:"3px 0", borderBottom:i<evList.length-1?"1px solid #1e1e1e":"none" }}>
                  <div style={{ width:4, height:4, borderRadius:"50%", background:M.accent, flexShrink:0, marginTop:5 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.88rem", color:M.muted2, lineHeight:1.5 }}>{ev.text}</div>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.muted, marginLeft:"auto", flexShrink:0 }}>{ev.date}</div>
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
  if (!withLog.length) return <div style={{ fontFamily:MONO, fontSize:"0.82rem", color:M.muted, fontStyle:"italic", padding:"3rem", textAlign:"center", border:"1px solid "+M.border, background:M.s1 }}>No debate history yet.</div>;
  return (
    <div>
      {archived > 0 && <div style={{ fontFamily:MONO, fontSize:"0.63rem", color:M.muted, padding:"0.5rem 0.8rem", border:"1px solid "+M.border, background:M.s1, marginBottom:"0.8rem", display:"flex", alignItems:"center", gap:"0.5rem" }}><span style={{ color:M.accent }}>ℹ</span> {archived} entries auto-compressed (older than 3 weeks). Full data preserved.</div>}
      <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, marginBottom:"0.8rem" }}>{total} entries · {archived} archived</div>
      {withLog.map(skill => {
        const entries = (debateLog[skill.id]||[]).filter(e => !q || [e.youReason,e.swingPoint,skill.name].some(v=>v&&v.toLowerCase().includes(q)));
        if (!entries.length) return null;
        const isCollapsed = collapsed[skill.id];
        return (
          <div key={skill.id} style={{ marginBottom:"1.4rem" }}>
            <div onClick={() => setCollapsed(c=>({...c,[skill.id]:!c[skill.id]}))} style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.4rem", cursor:"pointer", userSelect:"none" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.88rem", fontWeight:600, color:"#e8e3d9" }}>{skill.name}<span style={{ fontFamily:MONO, fontSize:"0.66rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginLeft:4 }}>{skill.cat}</span></div>
              <div style={{ fontFamily:MONO, fontSize:"0.72rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, marginLeft:"auto" }}>{entries.length} entries</div>
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
                        <div style={{ fontFamily:MONO, fontSize:"0.72rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, background:M.s2 }}>Wk {e.week}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted }}>{e.date}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"2px 6px", border:"1px solid "+M.border2, color:M.muted, marginLeft:"auto" }}>compressed</div>
                      </div>
                      <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6, fontStyle:"italic", borderLeft:"2px solid "+M.border2, paddingLeft:"0.5rem" }}>{e.summary}</div>
                    </div>
                  );
                  return (
                    <div key={i} style={{ background:M.s1, border:"1px solid "+M.border, padding:"0.75rem 0.9rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
                        <div style={{ fontFamily:MONO, fontSize:"0.72rem", padding:"2px 7px", border:"1px solid "+M.border2, color:M.muted, background:M.s2 }}>Wk {e.week}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted }}>{e.date}</div>
                        <div style={{ fontFamily:MONO, fontSize:"0.72rem", padding:"2px 8px", border:"1px solid rgba(122,232,168,0.25)", color:M.green, background:"rgba(122,232,168,0.07)", marginLeft:"auto", whiteSpace:"nowrap" }}>⚑ {e.verdict}% <span style={{ color:changeColor, marginLeft:4 }}>{changeStr}</span></div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", marginTop:"0.4rem" }}>
                        <div style={{ background:M.s2, padding:"0.5rem 0.6rem", border:"1px solid "+M.border }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:3 }}>AI Position</div>
                          <div style={{ fontFamily:DISPLAY, fontSize:"1.2rem", fontWeight:700, lineHeight:1, color:M.blue, marginBottom:3 }}>{e.aiPct}%</div>
                          <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6 }}>{skill.aiReason.slice(0,140)}…</div>
                        </div>
                        <div style={{ background:M.s2, padding:"0.5rem 0.6rem", border:"1px solid "+M.border }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:3 }}>Your Position</div>
                          <div style={{ fontFamily:DISPLAY, fontSize:"1.2rem", fontWeight:700, lineHeight:1, color:M.accent, marginBottom:3 }}>{e.youPct!=null ? e.youPct+"%" : "—"}</div>
                          <div style={{ fontFamily:MONO, fontSize:"0.7rem", color:M.muted2, lineHeight:1.6, fontStyle:e.youReason?"normal":"italic" }}>{e.youReason||"No argument recorded."}</div>
                        </div>
                      </div>
                      {e.swingPoint && (
                        <div style={{ marginTop:"0.4rem", padding:"0.4rem 0.6rem", borderLeft:"2px solid rgba(232,201,122,0.35)", background:M.s2 }}>
                          <div style={{ fontFamily:MONO, fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.accent, marginBottom:2 }}>⚡ What shifted</div>
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
  const avgColor = avgVerdict !== null ? indColor(avgVerdict) : "#888";

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
            <div style={{ fontFamily:MONO, fontSize:"0.88rem", letterSpacing:"0.28em", textTransform:"uppercase", color:M.accent, marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <div style={{ width:18, height:1, background:M.accent }} /> Personal OS — Weekly Calibration
            </div>
            <div style={{ fontFamily:DISPLAY, fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, lineHeight:0.95, letterSpacing:"-0.02em" }}>
              SIGNAL /<br/><span style={{ color:M.accent }}>NOISE</span>
            </div>
            <div style={{ fontFamily:MONO, fontSize:"0.82rem", color:M.muted, marginTop:"0.8rem", lineHeight:1.8, maxWidth:500 }}>
              Verdict is law. &nbsp;100 = AI-dependent &nbsp;·&nbsp; 0 = fully independent.<br/>
              <span style={{ color:M.accent }}>Debate happens in Claude.</span> This page is your record and mirror.
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"0.4rem" }}>
            <div style={{ fontFamily:MONO, fontSize:"0.7rem", padding:"5px 12px", border:"1px solid rgba(232,201,122,0.35)", color:M.accent, background:"rgba(232,201,122,0.12)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Week {currentWeek}</div>
            <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.muted }}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
            <div style={{ display:"flex", gap:"1.5rem", marginTop:"0.5rem" }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.5rem", fontWeight:800, lineHeight:1, color:avgColor }}>{avgVerdict !== null ? (100-avgVerdict) : "—"}{avgVerdict !== null ? "%" : ""}</div>
                <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>avg verdict</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1.5rem", fontWeight:800, lineHeight:1, color:M.accent }}>{history.length}</div>
                <div style={{ fontFamily:MONO, fontSize:"0.72rem", color:M.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>weeks locked</div>
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
                <div style={{ fontFamily:MONO, fontSize:"0.68rem", color:M.red, letterSpacing:"0.06em" }}>Wipe all data? Enter password.</div>
                <input
                  type="password"
                  value={resetPw}
                  onChange={e=>{setResetPw(e.target.value);setResetPwErr(false);}}
                  onKeyDown={e=>{if(e.key==="Enter"){if(resetPw===DELETE_CONFIRM_PW){resetData();}else{setResetPwErr(true);setResetPw("");}}}}
                  placeholder="password"
                  autoFocus
                  style={{ fontFamily:MONO, fontSize:"0.62rem", padding:"4px 8px", background:"transparent", border:`1px solid ${resetPwErr?"rgba(232,122,122,0.8)":M.border3}`, color:resetPwErr?M.red:M.text, outline:"none", width:"120px", letterSpacing:"0.05em" }}
                />
                {resetPwErr && <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.red, letterSpacing:"0.05em" }}>wrong password</div>}
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>{setConfirmReset(false);setResetPw("");setResetPwErr(false);}} style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"3px 9px", border:"1px solid "+M.border3, background:"transparent", color:M.muted, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>Cancel</button>
                  <button onClick={()=>{if(resetPw===DELETE_CONFIRM_PW){resetData();}else{setResetPwErr(true);setResetPw("");}}} style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"3px 9px", border:"1px solid rgba(232,122,122,0.5)", background:"rgba(232,122,122,0.15)", color:M.red, cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase" }}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid "+M.border3, marginBottom:"1.5rem" }}>
          {[["tracker","📡 Dashboard"],["steps","🎯 Your Steps"],["log","📜 Debate Log"]].map(([id,label]) => (
            <div key={id} onClick={()=>setActiveTab(id)} style={{ fontFamily:MONO, fontSize:"0.88rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.6rem 1.2rem", cursor:"pointer", color:activeTab===id?M.accent:M.muted, borderBottom:"2px solid "+(activeTab===id?M.accent:"transparent"), marginBottom:-1, userSelect:"none", transition:"all 0.13s" }}>{label}</div>
          ))}
        </div>

        {activeTab==="tracker" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.2rem", alignItems:"start" }}>
            <div>
              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.4rem 1.2rem 1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.4rem" }}>
                  Reliance Radar
                  <span style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {history.map((h,i) => (
                      <span key={i} onClick={()=>setRadarWeek(radarWeek===i?null:i)} style={{ padding:"1px 6px", border:"1px solid "+(radarWeek===i?"rgba(232,201,122,0.35)":M.border2), color:radarWeek===i?M.accent:M.muted, cursor:"pointer", background:radarWeek===i?"rgba(232,201,122,0.1)":"transparent", fontSize:"0.68rem" }}>Wk{h.week}</span>
                    ))}
                    <span onClick={()=>setRadarWeek(null)} style={{ padding:"1px 6px", border:"1px solid "+(radarWeek===null?"rgba(232,201,122,0.35)":M.border2), color:radarWeek===null?M.accent:M.muted, cursor:"pointer", background:radarWeek===null?"rgba(232,201,122,0.1)":"transparent", fontSize:"0.68rem" }}>Now</span>
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
                    }} style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.62rem", color:"#7ae8a8", cursor:"pointer", padding:"1px 4px", border:"1px solid #7ae8a822", borderRadius:3 }} title={s.name}>
                      {i+1} {s.name.split("—")[0].trim().slice(0,10)}
                    </span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"1rem", marginTop:"0.8rem", flexWrap:"wrap", justifyContent:"center" }}>
                  {[["rgba(122,184,232,0.7)","AI position"],["#7ae8a8","Verdict"],["#303030","Prev week"]].map(([col,lbl]) => (
                    <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5, fontFamily:MONO, fontSize:"0.65rem", color:M.muted }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:col }} />{lbl}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop:"1.3rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>Meta Skills</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>{META_SKILLS.length} axes</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {META_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>

              <div style={{ marginTop:"1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>CS Practical</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>hands-on execution</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {PRACTICAL_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>

              <div style={{ marginTop:"1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.7rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>CS Academic</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                  <div style={{ fontFamily:MONO, fontSize:"0.68rem", padding:"2px 7px", border:"1px solid "+M.border3, color:M.muted }}>exam-reality</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {ACADEMIC_SKILLS.map(s => <SkillCard key={s.id} skill={s} store={store} forceOpen={openSkillId===s.id} cardRef={el=>cardRefs.current[s.id]=el} />)}
                </div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:DISPLAY, fontSize:"1rem", fontWeight:700, marginBottom:2 }}>Overall Status</div>
                <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.muted, letterSpacing:"0.08em", marginBottom:"0.9rem" }}>Week {currentWeek} · {history.length} weeks recorded</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"0.4rem", marginBottom:"0.5rem" }}>
                  <div style={{ fontFamily:DISPLAY, fontSize:"3rem", fontWeight:800, lineHeight:1, color:avgColor }}>{avgVerdict !== null ? (100-avgVerdict) : "—"}</div>
                  <div style={{ fontFamily:MONO, fontSize:"0.62rem", color:M.muted, lineHeight:1.7 }}>%<br/>yours<br/>no AI</div>
                </div>
                <div style={{ height:3, background:M.border3, marginBottom:"0.9rem" }}>
                  <div style={{ height:"100%", width:(avgVerdict !== null ? (100-avgVerdict) : 0)+"%", background:avgColor, transition:"width 0.6s" }} />
                </div>
                {avgVerdict !== null && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:MONO, fontSize:"0.62rem", padding:"3px 9px", letterSpacing:"0.06em", textTransform:"uppercase", border:"1px solid", ...(avgVerdict>=75?{color:M.red,borderColor:"rgba(232,122,122,0.25)",background:"rgba(232,122,122,0.1)"}:avgVerdict>=50?{color:M.orange,borderColor:"rgba(232,176,122,0.25)",background:"rgba(232,176,122,0.07)"}:{color:M.green,borderColor:"rgba(122,232,168,0.25)",background:"rgba(122,232,168,0.1)"}) }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"currentColor", flexShrink:0 }} />
                    {avgVerdict>=75?"Just Getting Started":avgVerdict>=50?"Building Independence":"Strong — Keep Going"}
                  </div>
                )}
              </div>

              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"0.6rem" }}>Priority Actions</div>
                {scored.length===0 ? <div style={{ fontFamily:MONO, fontSize:"0.68rem", color:M.muted, fontStyle:"italic" }}>No verdicts yet.</div>
                : scored.map((s,i) => (
                  <div key={s.id} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0.6rem", alignItems:"start", padding:"0.6rem 0", borderBottom:i<scored.length-1?"1px solid "+M.border:"none" }}>
                    <div style={{ fontFamily:DISPLAY, fontSize:"1.3rem", fontWeight:800, color:[M.red,M.orange,M.accent][i], lineHeight:1, paddingTop:2, minWidth:24 }}>{["01","02","03"][i]}</div>
                    <div>
                      <div style={{ fontFamily:MONO, fontSize:"0.72rem", fontWeight:600, color:M.text, marginBottom:2 }}>{s.name}</div>
                      {s._urg && <div style={{ display:"inline-flex", alignItems:"center", gap:3, fontFamily:MONO, fontSize:"0.62rem", padding:"1px 6px", border:"1px solid "+s._urg.color+"44", color:s._urg.color, marginBottom:3, letterSpacing:"0.06em" }}>📅 {s._urg.label}</div>}
                      <div style={{ fontFamily:SANS, fontSize:"0.85rem", color:M.muted2, lineHeight:1.5 }}>{s.bridge}</div>
                      <div style={{ fontFamily:MONO, fontSize:"0.65rem", color:M.red, marginTop:3 }}>Independence: {100-s._verdict}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:M.s1, border:"1px solid "+M.border3, padding:"1.1rem" }}>
                <div style={{ fontFamily:MONO, fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:M.muted, marginBottom:"0.4rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  Weekly History <span style={{ color:M.muted2 }}>{history.length} snapshots</span>
                </div>
                {history.length===0 ? <div style={{ fontFamily:MONO, fontSize:"0.68rem", color:M.muted, fontStyle:"italic" }}>No snapshots yet.</div>
                : history.map((h,i) => {
                  const isCur = i===history.length-1;
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"52px 1fr 38px", alignItems:"center", gap:"0.5rem", padding:"4px 0" }}>
                      <div style={{ fontFamily:MONO, fontSize:"0.62rem", color:M.muted }}>Wk{h.week} <span style={{ fontSize:"0.4rem" }}>{h.date}</span></div>
                      <div style={{ height:3, background:M.border3 }}><div style={{ height:"100%", width:h.avgVerdict+"%", background:isCur?M.blue:M.accent }} /></div>
                      <div style={{ fontFamily:MONO, fontSize:"0.62rem", color:isCur?M.blue:M.muted, textAlign:"right" }}>{100-h.avgVerdict}%</div>
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

        {activeTab==="steps" && (
          <div>
            <div style={{ fontFamily:MONO, fontSize:"0.82rem", color:M.muted, marginBottom:"1.4rem", lineHeight:1.8 }}>
              3 specific actions per skill. Pick one. Do it. Bring it as evidence next session.
            </div>
            {[
              { label:"Meta Skills", skills:META_SKILLS },
              { label:"CS Practical", skills:PRACTICAL_SKILLS },
              { label:"CS Academic", skills:ACADEMIC_SKILLS },
            ].map(({ label, skills }) => (
              <div key={label} style={{ marginBottom:"2rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"1rem" }}>
                  <div style={{ fontFamily:MONO, fontSize:"0.82rem", letterSpacing:"0.18em", textTransform:"uppercase", color:M.muted, whiteSpace:"nowrap" }}>{label}</div>
                  <div style={{ flex:1, height:1, background:M.border3 }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
                  {skills.map(skill => {
                    const latestHistory = history[history.length - 1];
                    const verdict = latestHistory && latestHistory.skills ? latestHistory.skills[skill.id] : null;
                    const verdictColor = verdict !== null ? indColor(verdict) : "#555";
                    const indV = verdict !== null ? 100 - verdict : null;
                    const steps = SKILL_STEPS[skill.id] || [];
                    return (
                      <div key={skill.id} style={{ background:M.s1, border:"1px solid "+M.border3 }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", padding:"0.85rem 1rem", borderBottom:"1px solid "+M.border }}>
                          <div>
                            <div style={{ fontFamily:MONO, fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", color:M.muted, marginBottom:3 }}>{skill.cat}</div>
                            <div style={{ fontFamily:MONO, fontSize:"0.92rem", fontWeight:600, color:"#e8e3d9" }}>{skill.name}</div>
                          </div>
                          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.6rem", fontWeight:800, color:verdict!==null?verdictColor:"#555", lineHeight:1 }}>
                            {verdict!==null ? indV+"%" : "—"}
                          </div>
                        </div>
                        <div style={{ padding:"0.8rem 1rem", display:"flex", flexDirection:"column", gap:"0.55rem" }}>
                          {steps.map((step, i) => (
                            <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0.7rem", alignItems:"start" }}>
                              <div style={{ fontFamily:MONO, fontSize:"0.88rem", color:M.accent, fontWeight:700, lineHeight:1.8, minWidth:18 }}>{i+1}.</div>
                              <div style={{ fontFamily:"IBM Plex Sans,sans-serif", fontSize:"0.88rem", color:"#c8c3b9", lineHeight:1.7 }}>{step}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}