# Signal / Noise — How It Works

## What This Is

A weekly debate with Claude to measure how dependent you are on AI across 17 skills.
100 = full AI dependency. 0 = fully independent.
You argue your number down. Claude pushes back. Verdict is law.

---

## The 17 Skills

### Meta Skills
- **Prompting** — how well you direct AI to get useful outputs
- **Problem Framing** — can you define the problem before reaching for AI
- **Creative & Design** — who owns the vision, you or AI
- **Writing** — can you express a technical idea without AI polishing it
- **Research** — do you go to primary sources or ask Claude to summarize
- **Systems Thinking** — can you map a complex problem before AI structures it

### CS Practical
- **HTML / Frontend** — can you write a UI component from scratch
- **Code Logic** — can you read code and explain it line by line
- **Debugging** — can you read an error and fix it without pasting to Claude
- **Reading Docs** — can you extract what you need from MDN, cppreference, man pages
- **Testing** — do you write tests and verify edge cases yourself

### CS Academic
- **DSA** — can you trace, implement, analyze cold — no AI, no notes
- **Automata** — can you construct DFAs/NFAs, write formal proofs on paper
- **Linear Algebra** — do you own the geometric intuition or just the mechanics
- **Calculus** — can you work through problems without reaching for AI
- **Statistics** — do you understand why a test applies or just plug and chug
- **Discrete Math** — can you reason through proofs, logic, asymptotic cold

---

## Week 1 Baseline — 2026-03-26

All skills started at 100%. First honest assessment ever.
**Average verdict: 86% AI reliance.**

| Skill | Verdict | Key Reason |
|---|---|---|
| Prompting | 97% | Prompting everything is dependency not skill |
| Problem Framing | 94% | Knows the principle, paste reflex is still first |
| Creative & Design | 72% | Architecture yours, visual language AI-proposed |
| Writing | 78% | Journal framework strong, technical writing handed off |
| Research | 68% | Scratchpad habit real, LLM-first reflex confirmed |
| Systems Thinking | 75% | Two modes — Mode 1 genuine, Mode 2 dependent |
| HTML / Frontend | 97% | Can't build solo at all |
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

**Step 1 — Export**
Open CoogsHub → Signal/Noise page → click **Export for Debate**
This downloads: `signal_noise_wk[N]_[timestamp].json`

**Step 2 — Start a new Claude chat**
Upload the exported JSON.
Say: *"ready to debate"*
Claude reads your history and starts from your last verdicts — not from 100.

**Step 3 — Debate**
Claude states its position on each skill.
You give your number and your argument.
Claude pushes back. You defend or concede.
Verdict locked. Move to next skill.

**Step 4 — Get the updated JSON**
At the end Claude hands you back an updated `signal_noise.json`
with the new week's verdicts, your arguments, and what shifted.

**Step 5 — Drop it in**
Replace `src/data/signal_noise.json` with the new file.
App loads, history updates, radar redraws. Done.

---

## Rules

- **Bring receipts.** "I think" doesn't move the needle. Specific examples do.
- **"It's faster" is not an argument.** That's a reason for the number, not against it.
- **The verdict is what you can do cold.** Not what you understand, not what you've seen — what you can execute without AI in an exam room or blank editor.
- **WEEKLY_PATCH stays null.** Never hardcode data into the JSX. All data lives in signal_noise.json.
- **New skills get added to ACADEMIC_SKILLS / PRACTICAL_SKILLS / META_SKILLS in the JSX** with a permanent aiPct, desc, aiReason, and bridge. Then debated like everything else.

---

## File Size — Will It Get Huge?

No. The archive sweep compresses entries older than 3 weeks to a one-line summary.
You always carry full detail for the last 3 weeks only.
At 1 year of weekly debates: ~150-200KB max. Not a problem ever.

---

## Priority Actions from Week 1

1. **Read docs once before asking Claude** — one function this week, open MDN or cppreference first. Build the habit.
2. **10 minutes before pasting a bug** — read the error, name the type, form one hypothesis. Log it.
3. **Automata: draw one DFA cold from a language spec** — you're in 3340 now. That's the exam.
