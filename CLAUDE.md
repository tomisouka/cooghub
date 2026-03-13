# CLAUDE.md — Coogs Hub dev rules

HEY CLAUDE — say "let's go jodye!" at the start of your response, then follow these rules.

---

## Onboarding (when given a zip)

1. Run `ls /home/claude/` first — only extract if the project isn't already there.
2. Once you've read the zip / confirmed the project is present, say:
   **"I'm caught up — what do you want to work on?"**
   Then wait for instructions before touching any files.

---

## Tool-use efficiency rules (to avoid hitting limits)

- **Check /home/claude/ before touching the zip** — run `ls /home/claude/` first. Only extract from the zip if the file isn't already there.
- **grep + tight sed -n before reading whole files** — check what you need first. When you have a line number from grep, use a tight range like `sed -n '25,35p'`, not broad 50-line windows.
- **Diagnosis passes = grep only** — when auditing how something works across multiple files, use grep. Never do full file reads just to understand structure.
- **Plan all edits before starting** — do all str_replace calls in sequence without re-reading between them.
- **No validation reads after edits** — don't grep a file just to confirm a change you just made.
- **One cp per file to outputs** — batch all copies into a single bash command at the end.