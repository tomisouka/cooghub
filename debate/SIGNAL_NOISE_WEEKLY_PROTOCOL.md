# SIGNAL / NOISE — Weekly Debate Protocol
**Version 3.0 · Bring CLAUDE.md + project zip to every session**

---

## What This Is

Signal / Noise tracks your real AI reliance across 19 skills — not self-reported, not vibes. Every week, Claude reads your history, asks you one yes/no question per skill, proposes verdicts, and you either agree or appeal. The final locked verdicts update the app.

**100 = fully AI-dependent. 0 = fully independent. Verdict is law.**

---

## Skill Categories

### Meta Skills (1–5) — how you work with AI
1. **context_engineering** — Context Engineering: Directing AI
2. **translator** — Translator: Expressing What's in Your Head
3. **cold_vision** — Cold Vision: Thinking Before You Ask
4. **shipwright** — Shipwright: Designing Before Building
5. **domain** — Domain: Who Owns the Output

### CS Practical (6–14) — hands-on execution
6. **codelogic** — Code Logic: Understanding What It Does
7. **debugging** — Debugging Cold: Finding Breaks Without AI
8. **markup** — Markup: HTML & CSS From Scratch
9. **scripting** — Scripting: JS, Python, Shell
10. **frameworks** — Frameworks: React & Component Architecture
11. **compiled** — Compiled: C++, C, Java
12. **assembly** — Assembly: ARM, MIPS, ASM
13. **sql** — SQL: Queries & Schema Design
14. **regex** — Regex: Pattern Matching & Parsing

### CS Academic (15–19) — course subjects, exam-graded
15. **dsa** — Data Structures & Algorithms
16. **automata** — Automata & Theory of Computation
17. **linalg** — Linear Algebra
18. **calc** — Calculus
19. **stats** — Statistics & Probability

---

## What to Bring Every Session

Drop the full project zip and say: **"ready to debate"**

Claude reads from the zip:
1. `CLAUDE.md` — debate format, locked questions, escalation flags
2. `src/data/signal_noise.json` — verdicts, history, debate log
3. `public/content/signal/logs/signal_wk*.md` — all past session logs
4. `debate/` — this protocol and skill todo list

---

## Claude's Session Protocol

### PHASE 1 — LOAD & ORIENT

Read all sources above. Then:

1. Greet.
2. Ask: **"What did you do this week?"**

---

### PHASE 2 — REMIND

Based on the user's reply, remind them of what they're trying to prove across all 19 skills — pulled from last week's shoves and escalation flags. Keep it tight, one line per relevant skill.

---

### PHASE 3 — ONE QUESTION PER SKILL (19 rounds)

Ask one yes/no question per skill, in order 1–19.
- Questions adapt to what the user reported doing — base questions are in `CLAUDE.md`, sharpen them to actual activity
- User answers yes/no. Context is optional but not required.
- Note the answer. Move to the next skill immediately.
- No verdicts during this phase.

---

### PHASE 4 — VERDICT TABLE

After all 19 answers, reveal all verdicts at once in a table:

| # | Skill | Wk N-1 | Wk N | Change |
|---|-------|---------|------|--------|
| 1 | Context Engineering | XX% | XX% | +/-N |
| ... | | | | |

Follow with one conclusion statement — the single most important pattern across this week's verdicts.

---

### PHASE 5 — APPEAL (optional)

Ask: **"Any appeals?"**

For each appeal:
- User makes their case
- User always gets the last word
- Claude rules — moved or didn't, with reason
- Once ruled — locked

---

### PHASE 6 — LOCK & PATCH

Output the complete `WEEKLY_PATCH` ready to paste into `apply_patch.js`:

```javascript
const WEEKLY_PATCH = {
  week: N,
  date: "Mon DD",
  globalSwing: "One sentence capturing the biggest overall shift this week.",
  verdicts: {
    context_engineering: { verdict: XX, youReason: "...", swingPoint: "..." },
    translator:          { verdict: XX, youReason: "...", swingPoint: "..." },
    cold_vision:         { verdict: XX, youReason: "...", swingPoint: "..." },
    shipwright:          { verdict: XX, youReason: "...", swingPoint: "..." },
    domain:              { verdict: XX, youReason: "...", swingPoint: "..." },
    codelogic:           { verdict: XX, youReason: "...", swingPoint: "..." },
    debugging:           { verdict: XX, youReason: "...", swingPoint: "..." },
    markup:              { verdict: XX, youReason: "...", swingPoint: "..." },
    scripting:           { verdict: XX, youReason: "...", swingPoint: "..." },
    frameworks:          { verdict: XX, youReason: "...", swingPoint: "..." },
    compiled:            { verdict: XX, youReason: "...", swingPoint: "..." },
    assembly:            { verdict: XX, youReason: "...", swingPoint: "..." },
    sql:                 { verdict: XX, youReason: "...", swingPoint: "..." },
    regex:               { verdict: XX, youReason: "...", swingPoint: "..." },
    dsa:                 { verdict: XX, youReason: "...", swingPoint: "..." },
    automata:            { verdict: XX, youReason: "...", swingPoint: "..." },
    linalg:              { verdict: XX, youReason: "...", swingPoint: "..." },
    calc:                { verdict: XX, youReason: "...", swingPoint: "..." },
    stats:               { verdict: XX, youReason: "...", swingPoint: "..." },
  },
  evidence: {},
  examDates: {},
};
```

---

### PHASE 7 — SESSION LOG

Generate and tell user to save to `public/content/signal/logs/signal_wkN_[date].md`:

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
[2-3 most notable answers or appeals]

## Priority Actions Next Week
[one shove per flagged skill]

## Escalation Flags
[any skill flat or regressing 2+ weeks, or "None"]
```

---

### PHASE 8 — GROWTH CHECKLIST

Generate and tell user to save to `public/content/signal/logs/growth_wkN_[date].md`:

```markdown
# Growth Checklist — Week N
**Generated:** Mon DD, YYYY
**Complete what you can. Nothing here is mandatory. Everything here moves the needle.**

---

## 🔴 High Priority
- [ ] [Specific task tied to highest reliance or upcoming exam]

## 🟠 Medium Priority
- [ ] [Specific task]

## 🟡 Stretch Goals
- [ ] [Specific task]

---

## Skill Targets This Week
| Skill | Current | Target | What Would Move It |
|-------|---------|--------|---------------------|
| ...   | XX%     | XX%    | One sentence        |
```

**Rules:**
- Every task must be specific — no ambiguity about whether it was done
- Tasks completable in 15–45 minutes
- Tied directly to this week's verdicts
- Cap at 10 total items
- Order by exam urgency first, highest reliance second

---

## Scoring

**Score = 100% - AI dependency %**
Higher % = more AI dependent.

| Range | Color | Meaning |
|-------|-------|---------|
| 75–100% | 🔴 Red | High reliance — action needed now |
| 50–74% | 🟠 Orange | Moderate — progress being made |
| 30–49% | 🟡 Yellow | Developing independence |
| 0–29% | 🟢 Green | Low reliance — strong signal |

---

## Rules

- **Verdict is law.** No renegotiating after locked.
- **User gets the last word.** Every appeal, every time. Claude rules after.
- **Concrete evidence only.** Actions, not feelings.
- **No skipping skills.** All 19 get a verdict every week.
- **Session log must be saved.** No log = no debate context next week.
- **Growth checklist must be generated.** No checklist = no growth targets.
- **Questions are locked in CLAUDE.md.** Don't improvise them.
