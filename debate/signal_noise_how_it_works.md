# Signal / Noise — How It Works

## What This Is

A weekly debate with Claude to measure how dependent you are on AI across 19 skills.
100 = full AI dependency. 0 = fully independent.
You answer yes/no. Claude judges. Verdict is law.

---

## The 19 Skills

### Meta Skills — how you work with AI
1. **Context Engineering** — do you get the right output without a follow-up?
2. **Translator** — do you describe problems yourself before Claude names them?
3. **Cold Vision** — do you know what you want before Claude shows you an option?
4. **Shipwright** — do you design structure before Claude proposes it?
5. **Domain** — do you own and understand what ships?

### CS Practical — hands-on execution
6. **Codelogic** — can you read code and understand it before Claude explains it?
7. **Debugging** — can you name an error type before opening Claude?
8. **Markup** — can you write HTML/CSS before Claude generates it?
9. **Scripting** — can you write JS/Python/shell before Claude generates it?
10. **Frameworks** — can you write hooks and components before Claude proposes them?
11. **Compiled** — can you write and reason through C++/C/Java cold?
12. **Assembly** — can you write ARM/MIPS instructions from memory?
13. **SQL** — can you write queries and schemas without Claude?
14. **Regex** — can you write patterns before Claude generates them?

### CS Academic — course subjects, exam-graded
15. **DSA** — can you trace and implement algorithms cold?
16. **Automata** — can you construct DFAs/NFAs and write proofs on paper?
17. **Linear Algebra** — do you own the intuition or just the mechanics?
18. **Calculus** — can you work through problems without reaching for AI?
19. **Stats** — do you understand why a test applies or just plug and chug?

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

## Week 1 Baseline — 2026-03-26

All skills started at 100%. First honest assessment ever.
**Average verdict: 86% AI reliance.**

| Skill | Verdict | Key Reason |
|-------|---------|------------|
| Prompting (now: Context Engineering) | 97% | Prompting everything is dependency not skill |
| Problem Framing (now: Cold Vision) | 94% | Knows the principle, paste reflex is still first |
| Creative & Design (now: Cold Vision) | 72% | Architecture yours, visual language AI-proposed |
| Writing | 78% | Journal framework strong, technical writing handed off |
| Research | 68% | Scratchpad habit real, LLM-first reflex confirmed |
| Systems Thinking (now: Shipwright) | 75% | Two modes — Mode 1 genuine, Mode 2 dependent |
| HTML / Frontend (now: Markup) | 97% | Can't build solo at all |
| Code Logic | 90% | Pattern recognition real, guessing is not owning |
| Debugging | 93% | Error taxonomy real, can't fix alone |
| Reading Docs | 97% | Never goes to primary sources |
| Testing | 95% | Never writes tests, mailman for Claude |
| DSA | 95% | Theory only, no cold execution |
| Automata | 85% | Can draw DFA, solving from spec cold not there |
| Linear Algebra | 88% | Basic ops real, lost in row reduction |
| Calculus | 68% | Three completed courses, refresher needed |
| Statistics | 95% | Reverse engineered it, didn't actually learn it |
| Discrete Math | 78% | Logic solid, rigorous proofs and asymptotic are gaps |

---

## How to Run a Debate Session

**Step 1 — Zip & Upload**
Run `zipit.sh` from project root. Upload `coogs-hub-clean.zip` to Claude.

**Step 2 — Start**
Say: *"ready to debate"*
Claude reads `CLAUDE.md`, the signal logs, and `signal_noise.json` before anything else.

**Step 3 — Debate**
Claude asks what you did this week, reminds you what you're proving, then asks one yes/no question per skill — 19 rounds.

**Step 4 — Verdict**
All 19 verdicts revealed at once in a table with a conclusion statement.

**Step 5 — Appeal**
Optional. Make your case. Claude rules. Once locked — done.

**Step 6 — Patch**
Claude outputs the `WEEKLY_PATCH`. Drop it into `apply_patch.js` and run it.

---

## Rules

- **Bring the zip every session.** Claude has no memory of the code between sessions.
- **Yes/no only during the debate.** Context is optional, not required.
- **Verdict is law.** No renegotiating after locked.
- **Session log must be saved.** No log = no debate context next week.
