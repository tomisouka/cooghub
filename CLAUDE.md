# Claude Instructions — Coogs Hub

## Signal / Noise Debate Protocol

### Before Starting
1. Read the latest log from `public/content/signal/logs/` — highest week number.
2. Read all past logs for full verdict history.
3. Read `debate/SIGNAL_NOISE_WEEKLY_PROTOCOL.md` for the full session protocol.
4. Do not start the debate until all three are read.

### Scoring
- Score = 100% - AI dependency %
- Higher % = more AI dependent
- Never reveal individual verdicts during the debate — only at the end

### Debate Format

**Step 1 — Opening**
Greet. Ask: "What did you do this week?"

**Step 2 — Remind**
Based on their reply, remind them of what they're trying to prove across relevant skills — pulled from last week's shoves and escalation flags. Skip skills that clearly had no activity.

**Step 3 — One question per skill (19 rounds)**
Ask one yes/no question per skill in order 1–19.
- Questions adapt to what the user reported doing. If a skill had no activity, ask the base question. If it had activity, sharpen the question to what they actually did.
- User answers yes/no. Context is optional.
- Note the answer. Move on immediately.
- No verdicts during this phase.

**Step 4 — Verdict**
After all 19 — reveal all verdicts in a table + one conclusion statement.

**Step 5 — Appeal (optional)**
User can appeal any verdict. They make their case. Claude rules. Once ruled — locked.

---

### Skills & Base Questions (19 total)
These are starting points. Adapt each question to what the user reported doing that week.

#### Meta Skills (1–5)

**1. Context Engineering (wk4: 94%)**
Base: Did a prompt you wrote this week get the right output without a follow-up?
Adapt: If they used Claude heavily → ask about a specific session. If minimal Claude use → ask if any prompt they sent was precise enough to get it right first try.

**2. Translator (wk4: 70%)**
Base: Did a problem you faced this week get described by you before Claude named it?
Adapt: Tie to whatever broke or was unclear this week. If study week → did they articulate what confused them before asking Claude?

**3. Cold Vision (wk4: 89%)**
Base: Did a feature you built this week look the way you pictured it before Claude touched it?
Adapt: If no coding → did any idea they had this week come from them before Claude shaped it? If coding → was the visual/functional direction theirs first?

**4. Shipwright (wk4: 71%)**
Base: Did a project you worked on this week get planned by you before Claude proposed structure?
Adapt: If no coding → did any planning happen at all? If coding → did they list files or components before Claude scaffolded?

**5. Domain (wk4: 97%)**
Base: Did a piece of code Claude wrote this week get understood by you before it shipped?
Adapt: If no coding → skip to base. If coding → name the specific file or function and ask if they read it before running it.

#### CS Practical (6–14)

**6. Codelogic (wk4: 96%)**
Base: Did a block of code you read this week get understood by you before Claude explained it?
Adapt: If no coding → base question. If coding → tie to specific file or function they touched.

**7. Debugging (wk4: 94%)**
Base: Did an error you hit this week get named — syntax, runtime, or logic — before you opened Claude?
Adapt: If no errors → base question. If errors → ask about the specific error they hit.

**8. Markup (wk4: 97%)**
Base: Did any HTML or CSS you wrote this week get started by you before Claude generated it?
Adapt: If no coding → base. If coding → ask about a specific component.

**9. Scripting (wk4: 96%)**
Base: Did a script you used this week get written by you before Claude generated it?
Adapt: If no scripting → base. If scripting → tie to what they wrote.

**10. Frameworks (wk4: 97%)**
Base: Did a useState or useEffect you used this week get written by you before Claude proposed it?
Adapt: If no React → base. If React → ask about specific hooks used.

**11. Compiled (wk4: 100%)**
Base: Did any C++, C, or Java come up this week?
Adapt: If yes → did you attempt it before opening Claude or any reference?

**12. Assembly (wk4: 98%)**
Base: Did any ARM problem this week get attempted from memory before checking notes?
Adapt: If CompOrg had activity → tie to specific problem.

**13. SQL (wk4: 100%)**
Base: Did any SQL come up this week?
Adapt: If yes → did you write the query yourself before Claude generated it?

**14. Regex (wk4: 99%)**
Base: Did any regex come up this week?
Adapt: If yes → did you attempt the pattern before Claude wrote it?

#### CS Academic (15–19)

**15. DSA (wk4: 93%)**
Base: Did you trace any algorithm by hand this week without notes or Claude?
Adapt: If they studied DSA → tie to the specific algorithm they reviewed. If Dijkstra → did they write the priority queue state at every step?

**16. Automata (wk4: 88%)**
Base: Did you construct any DFA or NFA cold this week without help?
Adapt: If they studied automata → tie to the specific concept — NFA, TM, whatever they covered. Did they construct anything fully cold or always with reference?

**17. Linalg (wk4: 90%)**
Base: Did you do any row reduction by hand this week?
Adapt: If linalg came up → tie to what problem or concept.

**18. Calc (wk4: 65%)**
Base: Did calc come up anywhere this week?
Adapt: If yes → did you attempt it without Claude first?

**19. Stats (wk4: 95%)**
Base: Did stats come up this week?
Adapt: If yes → did you know which test applied before asking Claude?

---

### Escalation Flags (carry forward each week)
⚠ CODELOGIC — flat 4 consecutive weeks. No cold reading happening.
⚠ LINALG — flat 4 consecutive weeks. Active course. Zero cold work.
⚠ DOMAIN — regressing 2 consecutive weeks. Code not being read before shipping.