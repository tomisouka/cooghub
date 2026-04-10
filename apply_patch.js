#!/usr/bin/env node
/**
 * apply_patch.js — Signal/Noise weekly patch applier
 * Usage: node apply_patch.js
 * Run from anywhere. Paths are relative to the script location or set PROJECT_ROOT env var.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = process.env.PROJECT_ROOT || resolve(__dirname);

// ─── PATCH — paste the new one here each week ────────────────────────────────
const WEEKLY_PATCH = {
  week: 2,
  date: "Apr 01",
  globalSwing:
    "Real gains in the meta skills — framing, research, systems all moved meaningfully — but the CS practical and academic floors didn't budge, and codelogic/automata/linalg are quietly getting worse.",
  verdicts: {
    prompting: { verdict: 97, youPct: null, youReason: "", swingPoint: "" },
    framing:   { verdict: 88, youPct: null, youReason: "", swingPoint: "Wrote the question first, caught wrong framing, identified the need before asking — all three fired." },
    creative:  { verdict: 68, youPct: null, youReason: "", swingPoint: "Answered aesthetic cold: dark, cyberpunk, bold. Rejected an AI output and specified why. Initiated direction." },
    writing:   { verdict: 70, youPct: null, youReason: "", swingPoint: "Wrote a complete draft without AI and submitted it unpolished. Cleanup reflex still live." },
    research:  { verdict: 58, youPct: null, youReason: "", swingPoint: "Caught Claude being out of date — independent verification in action. Opened primary sources before asking." },
    systems:   { verdict: 65, youPct: null, youReason: "", swingPoint: "4/4 clean sweep — sketched first, built structure without AI, critiqued Claude's output, caught a mistake." },
    html:      { verdict: 97, youPct: null, youReason: "", swingPoint: "" },
    codelogic: { verdict: 92, youPct: null, youReason: "", swingPoint: "" },
    debugging: { verdict: 95, youPct: null, youReason: "", swingPoint: "" },
    docs:      { verdict: 97, youPct: null, youReason: "", swingPoint: "" },
    testing:   { verdict: 95, youPct: null, youReason: "", swingPoint: "" },
    dsa:       { verdict: 96, youPct: null, youReason: "", swingPoint: "" },
    automata:  { verdict: 88, youPct: null, youReason: "", swingPoint: "" },
    linalg:    { verdict: 90, youPct: null, youReason: "", swingPoint: "" },
    calc:      { verdict: 63, youPct: null, youReason: "", swingPoint: "Solved problems cold. Only CS Academic skill with any cold execution this week." },
    stats:     { verdict: 95, youPct: null, youReason: "", swingPoint: "" },
  },
  evidence: {},
  examDates: {},
};

// ─── GROWTH CHECKLIST — paste the new one here each week ─────────────────────
const GROWTH_CHECKLIST = `# Growth Checklist — Week 2
**Generated:** Apr 01, 2026
**Complete what you can. Nothing here is mandatory. Everything here moves the needle.**

---

## 🔴 High Priority (highest-reliance skills + your top courses)

- [ ] Draw the DFA for strings over {0,1} ending in '00' from scratch. No notes, no AI. Check it after. (Automata)
- [ ] Trace BFS on a 5-node graph you draw yourself. Write the queue state at every step. (DSA)
- [ ] Do one row reduction problem from your 2318 textbook cold. Write every step. Find the exact line where you lose the thread. (Linalg)
- [ ] Open a blank file and write a nav bar in HTML from memory. 10 lines minimum before Claude touches it. (HTML)

## 🟠 Medium Priority (building toward independence)

- [ ] Open react.dev and look up one hook you've used in coogs-hub. Read the signature, params, and one example — without asking Claude. (Docs)
- [ ] Take the last Claude-generated block in coogs-hub, close the chat, and explain out loud what each line does. Note exactly where you get stuck. (Codelogic)
- [ ] Next time something breaks in the project, give yourself 10 minutes before pasting. Name the error type. Write one hypothesis. (Debugging)

## 🟡 Stretch Goals

- [ ] Write a 3-sentence explanation of what a DFA is — no AI, no notes. Raw and imperfect is fine. (Writing + Automata)
- [ ] Pick one stats formula from your old class and write one sentence explaining why it works, not just what it does. (Stats)

---

## Skill Targets This Week
| Skill    | Current | Target | What Would Move It |
|----------|---------|--------|--------------------|
| DSA      | 96%     | 91%    | Trace one algorithm cold on paper |
| Automata | 88%     | 82%    | Draw a standard DFA from spec without help |
| Linalg   | 90%     | 85%    | Complete one row reduction cold, every step |
| HTML     | 97%     | 93%    | Write any markup from memory before Claude |
| Docs     | 97%     | 92%    | Open an official reference before the next Claude question |

---

*Check off what you do. Bring this file next session as evidence.*
`;

// ─── SESSION LOG ─────────────────────────────────────────────────────────────
const SESSION_LOG = `# Signal / Noise — Week 2 Debate Log
**Date:** Apr 01, 2026
**Overall avg verdict:** 84%

## Verdicts Locked
| Skill      | Week 1 | Week 2 | Change | Moved? |
|------------|--------|--------|--------|--------|
| Prompting  | 97%    | 97%    | 0      | No     |
| Framing    | 94%    | 88%    | -6     | Yes    |
| Creative   | 72%    | 68%    | -4     | Yes    |
| Writing    | 78%    | 70%    | -8     | Yes    |
| Research   | 68%    | 58%    | -10    | Yes    |
| Systems    | 75%    | 65%    | -10    | Yes    |
| HTML       | 97%    | 97%    | 0      | No     |
| Codelogic  | 90%    | 92%    | +2     | Yes    |
| Debugging  | 93%    | 95%    | +2     | Yes    |
| Docs       | 97%    | 97%    | 0      | No     |
| Testing    | 95%    | 95%    | 0      | No     |
| DSA        | 95%    | 96%    | +1     | Yes    |
| Automata   | 85%    | 88%    | +3     | Yes    |
| Linalg     | 88%    | 90%    | +2     | Yes    |
| Calc       | 68%    | 63%    | -5     | Yes    |
| Stats      | 95%    | 95%    | 0      | No     |

## What Shifted This Week
Real gains in the meta skills — framing, research, and systems all moved meaningfully — but CS practical and academic floors didn't budge, and codelogic, automata, and linalg are quietly getting worse.

## Key Debate Moments
- No contests. All 16 verdicts accepted as proposed.
- Framing was the biggest single-week improvement: 3/3 diagnostic answers, -6pts.
- Research dropped 10pts on the back of catching Claude being out of date — independent verification actually happened.

## Priority Actions Next Week
1. DSA — trace one algorithm by hand before opening Claude
2. Automata — draw the ending-in-00 DFA cold tonight
3. Linalg — one row reduction from textbook, cold, every step written
4. HTML — 10 lines of nav bar from memory before Claude touches it
5. Docs — open react.dev before the next Claude question about hooks

## Escalation Flags
⚠ CODELOGIC — regressing week 2. Reading Claude-generated code before keeping it needs to start now.
⚠ AUTOMATA — regressing week 2. Standard DFA cold execution is not there.
⚠ LINALG — regressing week 2. Cold problems need to start happening this week.
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function updateSignalNoiseJson() {
  const jsonPath = resolve(PROJECT_ROOT, "src/data/signal_noise.json");
  const raw = JSON.parse(readFileSync(jsonPath, "utf8"));

  // Bump current week
  raw.currentWeek = WEEKLY_PATCH.week + 1;

  // Build skill verdicts object for history
  const skills = {};
  for (const [key, val] of Object.entries(WEEKLY_PATCH.verdicts)) {
    skills[key] = val.verdict;
  }

  // Compute avg
  const values = Object.values(skills);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  // Append to history (avoid duplicate weeks)
  const alreadyExists = raw.history.some((h) => h.week === WEEKLY_PATCH.week);
  if (!alreadyExists) {
    raw.history.push({
      week: WEEKLY_PATCH.week,
      date: new Date().toISOString().split("T")[0],
      avgVerdict: avg,
      skills,
    });
  } else {
    const idx = raw.history.findIndex((h) => h.week === WEEKLY_PATCH.week);
    raw.history[idx] = {
      ...raw.history[idx],
      avgVerdict: avg,
      skills,
    };
  }

  // Merge exam dates and evidence
  if (WEEKLY_PATCH.examDates) {
    raw.examDates = { ...raw.examDates, ...WEEKLY_PATCH.examDates };
  }
  if (WEEKLY_PATCH.evidence) {
    for (const [skill, entries] of Object.entries(WEEKLY_PATCH.evidence)) {
      raw.evidence[skill] = [...(raw.evidence[skill] || []), ...entries];
    }
  }

  // Append to debateLog per skill
  for (const [skill, val] of Object.entries(WEEKLY_PATCH.verdicts)) {
    if (!raw.debateLog[skill]) raw.debateLog[skill] = [];
    const alreadyLogged = raw.debateLog[skill].some(
      (e) => e.week === WEEKLY_PATCH.week
    );
    if (!alreadyLogged) {
      raw.debateLog[skill].push({
        week: WEEKLY_PATCH.week,
        date: new Date().toISOString().split("T")[0],
        aiPct: val.verdict,
        youPct: val.youPct,
        verdict: val.verdict,
        youReason: val.youReason,
        swingPoint: val.swingPoint,
        archived: false,
        summary: `Wk ${WEEKLY_PATCH.week}: ${val.verdict}%. ${val.swingPoint || "No change."}`,
        shove: "",
      });
    }
  }

  writeFileSync(jsonPath, JSON.stringify(raw, null, 2));
  console.log(`✅ signal_noise.json updated — week ${WEEKLY_PATCH.week}, avg ${avg}%`);
}

function updateSignalNoisePage() {
  const pagePath = resolve(PROJECT_ROOT, "src/pages/SignalNoisePage.jsx");
  let src = readFileSync(pagePath, "utf8");

  const patchStr = `const WEEKLY_PATCH = ${JSON.stringify(WEEKLY_PATCH, null, 2)};`;

  // Replace either null or a prior patch
  src = src.replace(/const WEEKLY_PATCH = [\s\S]*?;(\n|$)/, patchStr + "\n");

  writeFileSync(pagePath, src);
  console.log(`✅ SignalNoisePage.jsx updated with week ${WEEKLY_PATCH.week} patch`);
}

function writeSessionLog() {
  const logsDir = resolve(PROJECT_ROOT, "src/content/signal/logs");
  mkdirSync(logsDir, { recursive: true });
  const filename = `signal_wk${WEEKLY_PATCH.week}_${WEEKLY_PATCH.date.replace(" ", "").toLowerCase()}.md`;
  const logPath = resolve(logsDir, filename);
  writeFileSync(logPath, SESSION_LOG);
  console.log(`✅ Session log saved → ${filename}`);
}

function writeGrowthChecklist() {
  const logsDir = resolve(PROJECT_ROOT, "src/content/signal/logs");
  mkdirSync(logsDir, { recursive: true });
  const filename = `growth_wk${WEEKLY_PATCH.week}_${WEEKLY_PATCH.date.replace(" ", "").toLowerCase()}.md`;
  const checklistPath = resolve(logsDir, filename);
  writeFileSync(checklistPath, GROWTH_CHECKLIST);
  console.log(`✅ Growth checklist saved → ${filename}`);
}

// ─── RUN ─────────────────────────────────────────────────────────────────────
try {
  updateSignalNoiseJson();
  updateSignalNoisePage();
  writeSessionLog();
  writeGrowthChecklist();
  console.log("\n🟢 All done. Restart your dev server to see changes.");
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
