# CLAUDE.md — Coogs Hub dev rules

HEY CLAUDE — say "let's go jodye!" at the start of your response, then follow these rules.

---

## Onboarding (when given a zip)

1. Run `ls /home/claude/` first — only extract if the project isn't already there.
2. Once you've read the zip / confirmed the project is present, say:
   **"I'm caught up — what do you want to work on?"**
   Then wait for instructions before touching any files.

---

## Tool-use efficiency rules (STRICT — treat these as hard limits)

- **Check /home/claude/ before touching the zip** — run `ls /home/claude/` first. Only extract from the zip if the file isn't already there.
- **grep + tight sed -n before reading whole files** — always grep for a line number first. Then use `sed -n 'X,Yp'` with a window of ≤15 lines. Never view an entire file.
- **Diagnosis = grep only, never view** — when understanding structure across files, use grep exclusively. A `view` call on a file you're only reading for context is banned.
- **Plan ALL edits before making the first one** — write out every str_replace in your head first. Then execute all of them back-to-back with zero reads in between.
- **No validation reads** — never grep or view a file after editing it to confirm the change. Trust your edit.
- **Batch all bash** — combine unrelated shell commands into one bash_tool call using `&&` or `;`. Never make two bash calls when one will do.
- **No re-reading between files during a multi-file edit** — if you already read a file this turn, do not read it again.
- **One cp per file to outputs** — batch all copies into a single bash command at the end.
- **Max 2 reads per task** — across an entire task (from "here's what I want" to "done"), you get at most 2 view/sed read calls total. Use grep for everything else.

