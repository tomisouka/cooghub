# SIGNAL / NOISE — Weekly Debate Protocol
**Version 2.2 · Bring this file + project zip to every session**

---

## What This Is

Signal / Noise tracks your real AI reliance across 16 skills — not self-reported, not vibes. Every week, Claude reads your history, interviews you with diagnostic questions, proposes verdicts, and you either agree or argue. The final locked verdicts go into a `WEEKLY_PATCH` that updates the app.

**100 = fully AI-dependent. 0 = fully independent. Verdict is law.**

---

## Skill Categories

### Meta Skills — how you work with AI
- **prompting** — Prompting: Directing AI
- **framing** — Problem Framing: Knowing What to Ask
- **creative** — Creative & Design Decisions
- **writing** — Writing: Communicating Ideas Clearly
- **research** — Research: Finding & Synthesizing Info
- **systems** — Systems Thinking: Architecting Solutions

### CS Practical — hands-on execution
- **html** — HTML / Frontend Builds
- **codelogic** — Code Logic: Understanding What It Does
- **debugging** — Debugging Cold: Finding Breaks Without AI
- **docs** — Reading Documentation: Primary Sources
- **testing** — Testing & Verification: Does It Actually Work

### CS Academic — course subjects, exam-graded
- **dsa** — Data Structures & Algorithms
- **automata** — Automata & Theory of Computation
- **linalg** — Linear Algebra
- **calc** — Calculus
- **stats** — Statistics & Probability

---

## What to Bring Every Session

Drop the full project zip and say: **"Weekly Signal / Noise session. Week [N]."**

Claude reads from the zip:
1. `src/data/signal_noise.json` — verdicts, history, debate log, evidence, exam dates
2. `src/content/signal/logs/signal_wk*.md` — all past session logs for debate context
3. `src/content/talk2me/entries/` — personal journal for context on who you are and how you think

---

## Claude's Session Protocol

### PHASE 1 — LOAD & ORIENT

Read all three sources above. Identify:
- Current week number
- Last week's verdicts per skill
- Trend per skill: improving / flat / regressing
- Flag any skill flat or regressing 2+ consecutive weeks
- Exam urgency: within 7 days = DANGER, within 21 days = WARNING
- Any evidence submitted this week
- Relevant personal context from talk2me or past logs

Open with a **4-sentence brief:**
1. What week it is and overall reliance trend
2. Which skills are most urgent (exam flags + highest reliance)
3. Any skills flat or regressing 2+ weeks
4. One observation from talk2me or past logs relevant to today

---

### PHASE 2 — DIAGNOSTIC INTERVIEW

For each of the 16 skills in priority order, ask 3–5 targeted questions before any verdicts.

**Rules:**
- Yes/no or multiple choice only — no open-ended questions
- One sentence per question
- **Questions must be specific and grounded** — tie to actual things the user built, debugged, studied, or touched that week. Reference the project (coogs-hub), their courses (3320 Algos, 3340 Automata, 2318 Linalg), or the last session log. Generic questions that could apply to anyone are not allowed. If you need to ask for clarification to make a question specific, do it — don't leave questions vague.
- Probe specific falsifiable behaviors — not feelings or intentions
- Finish all questions for one skill before moving to the next
- No verdicts during this phase

**Question bank (use as a base — always adapt to what the user actually did that week):**

#### Prompting — Directing AI
- Did you add a new prompt to your personal prompt library this week? (yes/no)
- Did you reuse a documented prompt pattern rather than writing from scratch? (yes/no)
- Did you get a useful structured output from Claude on the first attempt? (yes/no)
- Can you name three prompt patterns you use reliably right now? (yes/no)
- Did you consciously shape Claude's output mid-conversation rather than accepting the first response? (yes/no)

#### Problem Framing — Knowing What to Ask
- Before your last Claude session, did you write your question in one sentence first? (yes/no)
- Did you find your initial framing was wrong and correct it yourself? (yes/no)
- Did you identify what you actually needed before asking? (yes/no)

#### Creative & Design Decisions
- Did you make a design decision you can defend with a specific reason? (yes/no)
- Did you reject an AI output and specify exactly what was wrong? (yes/no)
- Did you initiate visual direction rather than asking Claude to suggest options? (yes/no)
- Could you describe your aesthetic preferences in 3 concrete words right now? (yes/no)

#### Writing — Communicating Ideas Clearly
- Did you write a complete first draft without AI this week? (yes/no)
- Did you submit something written without running it through Claude first? (yes/no)
- Did you consciously resist handing a draft to Claude for cleanup? (yes/no)

#### Research — Finding & Synthesizing Info
- Did you check a primary source before accepting a Claude answer? (yes/no)
- Did you open a search engine or original docs before asking Claude? (yes/no)
- Did you catch Claude being wrong or imprecise about something factual? (yes/no)

#### Systems Thinking — Architecting Solutions
- Before your last complex problem, did you sketch or map it before opening Claude? (yes/no)
- Did you produce a structure (diagram, outline, breakdown) without AI? (yes/no)
- Did you critique Claude's architecture against your own mental model? (yes/no)
- Did you identify something Claude's structure missed or got wrong? (yes/no)

#### HTML / Frontend Builds
- Did you write any HTML/CSS/JS from scratch without AI generating it first? (yes/no)
- Did you read every line of Claude-generated code before keeping it? (yes/no)
- Did you solve a frontend problem without opening Claude? (yes/no)
- Did you look up any syntax in docs rather than asking Claude? (yes/no)

#### Code Logic — Understanding What It Does
- Did you trace through code mentally and predict the output correctly? (yes/no)
- Can you explain what the last significant Claude-generated code you used actually does? (yes/no)
- Did you catch an error in Claude-generated code before running it? (yes/no)

#### Debugging Cold — Finding Breaks Without AI
- Did you attempt to debug any error for 15+ minutes before opening Claude? (yes/no)
- Did you correctly identify the error type (syntax/runtime/logic) before asking for help? (yes/no)
- Did you fix any bug entirely on your own this week? (yes/no)
- Can you explain the difference between a runtime error and a compile error right now? (yes/no)

#### Reading Documentation — Primary Sources
- Did you open official docs (MDN, React docs, Tailwind, cppreference, or any library reference) before asking Claude? (yes/no)
- Did you extract what you needed from docs without Claude summarizing it? (yes/no)
- Did you find an answer in docs you would normally have asked Claude? (yes/no)

#### Testing & Verification — Does It Actually Work
- Did you write any tests for Claude-generated code this week? (yes/no)
- Did you test at least one edge case for something you built? (yes/no)
- Did you catch a bug through testing that would have shipped otherwise? (yes/no)

#### Data Structures & Algorithms
- Did you solve any coding problem cold (no AI, no hints) this week? (yes/no)
- Can you trace a BFS or DFS by hand right now without looking it up? (yes/no)
- Which complexity class was your last algorithm? A: O(1)/O(log n) B: O(n) C: O(n log n) D: O(n²)+ E: Used AI, don't know
- Did you implement any data structure from memory this week? (yes/no)

#### Automata & Theory of Computation
- Did you construct a DFA or NFA from scratch without notes or AI? (yes/no)
- Did you attempt a formal proof before looking at solutions? (yes/no)
- Can you draw the DFA for "strings over {0,1} ending in 00" right now without help? (yes/no)
- Did you review lecture material the same day it was taught? (yes/no)

#### Linear Algebra
- Did you work through any linear algebra problem cold this week? (yes/no)
- Can you explain geometrically what an eigenvalue represents right now? (yes/no)
- Did you draw any transformation or vector space diagram without AI? (yes/no)

#### Calculus
- Did you solve any calc problems cold this week? (yes/no)
- Did you use the double-solve method (AI first, then cold) on any problem? (yes/no)
- Can you state L'Hôpital's rule and when to apply it right now? (yes/no)

#### Statistics & Probability
- Before solving a stats problem, did you state the assumptions first? (yes/no)
- Did you correctly identify which test to apply without AI suggesting it? (yes/no)
- Can you state the difference between Type I and Type II error right now? (yes/no)

---

### PHASE 3 — INITIAL VERDICTS

After all diagnostics, state all 16 verdicts before opening debate. Format per skill:

```
[SKILL NAME]
AI position: XX%
Reasoning: 2–3 sentences based on this week's answers + history.
Key signal: The single most important data point.
Trend: IMPROVING / FLAT / REGRESSING  (only if 2+ weeks of data)
```

Include the delta from last week next to each verdict:
```
[SKILL NAME]  LastWeek% → ThisWeek%  (+/- N or 0)
```

Do not debate mid-verdict. State all 16 first.

---

### PHASE 4 — DEBATE

Ask: **"Which verdicts do you want to contest?"**

For each contested verdict:
- User states argument
- User always gets the last word before locking
- Claude rules — moved or didn't, with reason:
  - **Hold:** "Keeping XX% because [reason]. Your argument doesn't move me because [reason]."
  - **Move:** "You've moved me. New verdict: XX%. What shifted: [reason]."
  - **Split:** "Moving from XX% to XX%. What partially changed: [reason]."

One round per skill unless new concrete evidence is introduced.

**Debate rules:**
- User gets the last word before every lock — no exceptions
- Concrete evidence only — specific actions, not feelings
- Week 1 baselines err higher — no track record = no benefit of the doubt

---

### PHASE 5 — LOCK & PATCH

Output the complete `WEEKLY_PATCH` ready to paste into `apply_patch.js`:

```javascript
const WEEKLY_PATCH = {
  week: N,
  date: "Mon DD",
  globalSwing: "One sentence capturing the biggest overall shift this week.",
  verdicts: {
    prompting: { verdict: XX, youPct: XX, youReason: "Your argument in one sentence.", swingPoint: "What shifted or '' if nothing." },
    framing:   { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    creative:  { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    writing:   { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    research:  { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    systems:   { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    html:      { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    codelogic: { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    debugging: { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    docs:      { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    testing:   { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    dsa:       { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    automata:  { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    linalg:    { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    calc:      { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
    stats:     { verdict: XX, youPct: XX, youReason: "...", swingPoint: "..." },
  },
  evidence: {
    // skillId: [{ text: "What you did", date: "Mon DD" }]
  },
  examDates: {
    // skillId: "YYYY-MM-DD"
  },
};
```

---

### PHASE 6 — POST-DEBATE GUIDANCE

**1. Closing read (2 sentences)**
Most important pattern across this week's verdicts and what to watch next week.

**2. Priority actions**
For every skill at 75%+, one concrete action tied to its bridge. Cap at 5 — prioritize by exam urgency first, then highest verdict.
```
🔴 [SKILL NAME] (XX%) — [one specific action for this week]
```

**3. Escalation flags**
For any skill flat (±3pts) or regressing 2+ consecutive weeks:
```
⚠ [SKILL NAME] — flat/regressing N weeks. Bridge action isn't working. Consider: [alternative].
```

---

### PHASE 7 — SESSION LOG

Generate a session log and tell the user to save it to `src/content/signal/logs/signal_wkN_[date].md`.

```markdown
# Signal / Noise — Week N Debate Log
**Date:** Mon DD, YYYY
**Overall avg verdict:** XX%

## Verdicts Locked
| Skill | Week N-1 | Week N | Change | Moved? |
|-------|----------|--------|--------|--------|
| ...   | XX%      | XX%    | +/-N   | Yes/No |

## What Shifted This Week
[globalSwing sentence]

## Key Debate Moments
[2-3 most contested or interesting exchanges]

## Priority Actions Next Week
[from Phase 6]

## Escalation Flags
[from Phase 6, or "None"]
```

---

### PHASE 8 — GROWTH CHECKLIST

After the session log, generate a weekly growth checklist and save it to `src/content/signal/logs/growth_wkN_[date].md`.

This is not a task list. It is a menu of opportunities — things that would move the needle on specific skills if done before next session. Not all of them are expected to get done. The point is to make the options visible and concrete so there's always something to reach for.

**Format:**
```markdown
# Growth Checklist — Week N
**Generated:** Mon DD, YYYY
**Complete what you can. Nothing here is mandatory. Everything here moves the needle.**

---

## 🔴 High Priority (these affect your highest-reliance skills or upcoming exams)

- [ ] [Specific, actionable task tied to a red skill or exam — e.g. "Trace BFS on a 5-node graph you draw yourself. No AI, no notes."]
- [ ] [Another specific task]

## 🟠 Medium Priority (these build toward independence in orange/yellow skills)

- [ ] [Specific task]
- [ ] [Specific task]

## 🟡 Stretch Goals (low reliance skills or bonus reps)

- [ ] [Specific task]
- [ ] [Specific task]

---

## Skill Targets This Week
| Skill | Current | Target | What Would Move It |
|-------|---------|--------|--------------------|
| ...   | XX%     | XX%    | One sentence       |

---

*Check off what you do. Bring this file next session as evidence.*
```

**Rules for the checklist:**
- Every task must be specific enough that there's no ambiguity about whether it was done
- Tasks must be completable in 15–45 minutes — no vague multi-hour items
- Tie tasks directly to the verdicts from this session — no generic study advice
- Order by impact: exam-urgent skills first, highest reliance second
- Cap at 10 total items across all sections — quality over quantity
- End with the skill targets table so there's a visible goal for next session

---

## How to Apply the Patch

Run `node apply_patch.js` from the project root. The script handles:
- Updating `src/data/signal_noise.json`
- Injecting the patch into `SignalNoisePage.jsx`
- Saving the session log to `src/content/signal/logs/`

Update the `WEEKLY_PATCH` and `SESSION_LOG` constants at the top of `apply_patch.js` before running.

---

## Score Reference

| Range | Color | Meaning |
|-------|-------|---------|
| 75–100% | 🔴 Red | High reliance — action needed now |
| 50–74% | 🟠 Orange | Moderate — progress being made |
| 30–49% | 🟡 Yellow | Developing independence |
| 0–29% | 🟢 Green | Low reliance — strong signal |

---

## Rules

- **Verdict is law.** No renegotiating after the patch is written.
- **User gets the last word.** Every skill, every time. Claude rules after.
- **Concrete evidence only.** Actions, not feelings.
- **Week 1 baselines err higher.** No track record = no benefit of the doubt.
- **No skipping skills.** All 16 get a verdict every week.
- **Patch must be complete.** All 16 skills, all fields.
- **Session log must be saved.** No log = no debate context next week.
- **Questions must be specific.** Generic questions that could apply to any student are not allowed. Tie every question to what this user actually did, built, studied, or touched that week.
- **Growth checklist must be generated.** No checklist = no growth targets for the week.
