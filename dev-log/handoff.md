# Coogs Hub — Session Handoff Doc
> Paste this into a new chat to resume exactly where we left off.
> Last updated: Session 16 — March 2026

---

## Project Overview
**Coogs Hub** — a personal React study app for COSC/MATH courses at University of Houston (UH).
Built by Jesiah Agudelo (kaneki), Spring 2026.

**Project location:** `~/rabbit/root/projects/onit/coogs-hub`
**Stack:** Vite + React + pnpm
**Dev server:** `pnpm dev` (runs on localhost:5173)
**Main entry:** `src/App.jsx` (~50 lines, routing only)

---

## Current App Structure

```
src/
├── App.jsx                  — routing: home/cosc/math/talk2me/tickets + course drill-in
├── globs.js                 — all import.meta.glob calls
├── search.js                — unified search: notes + code + talk2me + PDFs
├── components/
│   ├── Sidebar.jsx          — 3 items: Home, Talk2Me, Tickets
│   ├── MarkdownViewer.jsx
│   ├── CodeViewer.jsx
│   ├── HtmlViewer.jsx
│   └── DropZone.jsx         — always mounted, window drag listener
├── pages/
│   ├── HomePage.jsx         — search bar + COSC/MATH dept cards
│   ├── DeptPage.jsx         — COSC: course grid + Lang+ card; MATH: shared refs + course list
│   ├── CoursePage.jsx       — tabs: Notes, References, Assignments, Code, PDFs, Flashcards
│   ├── Talk2MePage.jsx
│   └── TicketsPage.jsx
└── data/
    ├── subjects.js          — DEPARTMENTS, ALL_COURSES, getCourse, getDept, LANG_REFS
    ├── nav.js               — 3 items: home, talk2me, tickets
    ├── flashcards.js
    ├── talk2me.js
    ├── references.js
    ├── languages/           — cpp, c, python, java, csharp, ts, rust, go, sql, htmlcss, comp_org, git, linux
    └── knowledge/           — 10 academic JS modules, ~2,012 entries
public/
└── references/
    └── languages/           — cpp_reference.html, git_reference.html, etc. (served as iframes)
```

---

## Routing Logic (App.jsx)

```js
// goTo(navId, courseId, destination)
// course set → CoursePage
// no course → switch(nav): home/cosc/math/talk2me/tickets

// Sidebar setActive clears course + dest, sets nav
// DropZone always mounted at bottom
```

---

## Key Data Shapes

### subjects.js
```js
export const DEPARTMENTS = [
  { id: "cosc", label: "COSC", color: "#4ecdc4", courses: [...] },
  { id: "math", label: "MATH", color: "#f472b6", courses: [...] },
];

export const LANG_REFS = [
  { file: "languages/cpp_reference.html",  label: "C++",        color: "#fb923c" },
  { file: "languages/c_reference.html",    label: "C",          color: "#60a5fa" },
  { file: "languages/python_reference.html", label: "Python",   color: "#facc15" },
  { file: "languages/java_reference.html", label: "Java",       color: "#f87171" },
  { file: "languages/csharp_reference.html", label: "C#",       color: "#a78bfa" },
  { file: "languages/ts_reference.html",   label: "TypeScript", color: "#38bdf8" },
  { file: "languages/rust_reference.html", label: "Rust",       color: "#fb923c" },
  { file: "languages/go_reference.html",   label: "Go",         color: "#34d399" },
  { file: "languages/sql_reference.html",  label: "SQL",        color: "#e8c547" },
  { file: "languages/htmlcss_reference.html", label: "HTML/CSS", color: "#f472b6" },
  { file: "languages/comp_org_reference.html", label: "ARM",    color: "#a78bfa" },
  { file: "languages/linux_reference.html", label: "Linux",     color: "#4ecdc4" },
  { file: "languages/git_reference.html",  label: "Git",        color: "#fb923c" },
];
```

### Course object shape
```js
{
  id: "datastruct",
  label: "Data Structures",
  courseCode: "COSC 2436",
  icon: "⬡",
  color: "#e8c547",
  langRefs: true,         // shows Lang+ card on DeptPage
  notes: [{ label, file }],
  references: [{ label, file, type }],
  assignments: [{ label, file, type }],
  code: [{ label, path }],
  pdfs: [{ label, file }],
  flashcards: "datastruct-set-id",  // or null
}
```

---

## Color Palette
| Token | Value |
|-------|-------|
| bg | `#111318` |
| surface | `#1a1d24` |
| elevated | `#21252e` |
| border | `#2a2e38` |
| accent | `#e8c547` |
| textPri | `#d4d8e0` |
| textMid | `#7a8090` |
| textDim (readable) | `#8a90a0` |

---

## Open Tickets
- **#001** Search scroll-to-match broken (MutationObserver fires too early)
- **#004** knowledge/index.js still re-exports language files that moved
- **#005** Talk2Me search navigation (dest props not wired)
- **#006** Empty courses need content

---

## Key Commands
```bash
cd ~/rabbit/root/projects/onit/coogs-hub && pnpm dev
grep "LANG_REFS" src/data/subjects.js
grep "Lang+" src/pages/CoursePage.jsx
find public/references/languages -name "*.html"
```