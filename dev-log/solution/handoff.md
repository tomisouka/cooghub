# Coogs Hub — Session Handoff Doc
> Paste this into a new chat to resume exactly where we left off.
> Last updated: Session 19 — March 2026

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
├── App.jsx                  — routing + safe area CSS vars + bottom nav
├── globs.js                 — all import.meta.glob calls
├── search.js                — unified search: notes + code + talk2me + PDFs
├── components/
│   ├── Sidebar.jsx          — 3 items: Home, Talk2Me, Tickets (desktop only)
│   ├── MarkdownViewer.jsx
│   ├── CodeViewer.jsx
│   ├── HtmlViewer.jsx
│   ├── PDFViewer.jsx        — pdfjs canvas viewer with pinch-to-zoom
│   └── DropZone.jsx
├── pages/
│   ├── HomePage.jsx         — mobile-responsive, search bar + dept cards
│   ├── DeptPage.jsx         — COSC: course grid + Lang+; MATH: single-pane on mobile
│   ├── CoursePage.jsx       — single-pane on mobile, tabs
│   ├── Talk2MePage.jsx      — single-pane on mobile
│   └── TicketsPage.jsx
├── hooks/
│   └── useIsMobile.js       — breakpoint 768px
└── data/
    ├── subjects.js          — DEPARTMENTS, ALL_COURSES, LANG_REFS (now includes Bash)
    ├── nav.js
    ├── flashcards.js
    ├── talk2me.js
    ├── references.js
    ├── languages/           — cpp, c, python, java, csharp, ts, rust, go, sql, htmlcss,
    │                          comp_org, git, linux, bash (14 total)
    └── knowledge/           — 10 academic JS modules

public/
└── references/
    └── languages/           — all *_reference.html files including bash_reference.html
```

---

## Routing Logic (App.jsx)

```js
// goTo(navId, courseId, destination)
// course set → CoursePage
// no course → switch(nav): home/cosc/math/talk2me/tickets
// Mobile: bottom nav bar; Desktop: left sidebar (72px)
```

---

## Mobile Layout Pattern

All pages use `useIsMobile()` (breakpoint 768px).

**Pattern used everywhere (CoursePage, Talk2MePage, DeptPage MATH/Lang+):**
- `showList` state — `true` = show file/nav list, `false` = show content fullscreen
- Tapping a file → `setShowList(false)` → content fills screen
- Back arrow `←` in a mini header → `setShowList(true)` → returns to list
- Desktop: unchanged 2-pane or 3-pane layout

**Safe area (Capacitor APK):**
```css
:root {
  --sat: env(safe-area-inset-top, 0px);    /* below status bar */
  --sab: env(safe-area-inset-bottom, 0px); /* above home bar */
}
```
- `<main>` on mobile: `paddingTop: "var(--sat)"`
- Bottom nav: `height: calc(60px + var(--sab))`
- Requires `viewport-fit=cover` in `index.html`

---

## PDF Viewer (PDFViewer.jsx)

- pdfjs-dist 3.11.174 from CDN (no install)
- Canvas rendering + manual text layer for selectable text + highlights
- **Pinch-to-zoom**: non-passive `touchstart`/`touchmove` listeners on scroll container
- **Scroll**: `touchAction: "pan-x pan-y pinch-zoom"` on container
- Props: `file`, `initialPage`, `highlight`

---

## Lang+ Panel

14 language references in `LANG_REFS` (subjects.js):
C, Java, C#, TypeScript, Rust, Go, SQL, HTML/CSS | ARM, Linux, Git, **Bash** | C++, Python

Bash reference: `public/references/languages/bash_reference.html`
Color: `#a8e6a3` (green, matches Bash's terminal vibe)

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

---

## Open Tickets
- **#001** Search scroll-to-match broken (MutationObserver fires too early)
- **#004** knowledge/index.js still re-exports language files that moved
- **#005** Talk2Me search navigation (dest props not wired)
- **#006** Empty courses need content

## Recent Changes (Session 19)
- `src/components/PDFViewer.jsx` — `flex:1, minWidth:0` on outer div; removed diagnostic overlay; `touchAction` now includes `pinch-zoom`; `transformOrigin` → `top left`
- `src/pages/CoursePage.jsx` — `minWidth: 0, overflow: "hidden"` on body div; search nav fixes: `showList` init, string-key dest detection, mobile auto-jump to content
- `src/pages/HomePage.jsx` — `_ts: Date.now()` on dest object to force re-render on same-course repeat search
- `dev-log/Tickets.md` — #007 filed: PDF search highlight visual drift (cosmetic, scaleX transform artifact)

## Recent Changes (Session 18)
- `index.html` — `viewport-fit=cover`
- `src/App.jsx` — safe area CSS vars + paddingTop on main + bottom nav height fix
- `src/components/PDFViewer.jsx` — pinch-to-zoom + touchAction scroll fix
- `src/pages/HomePage.jsx` — mobile padding, font sizes, Add Files moved
- `src/pages/Talk2MePage.jsx` — single-pane mode with back arrow
- `src/pages/DeptPage.jsx` — Lang+ and MATH single-pane on mobile
- `public/references/languages/bash_reference.html` — new, 16 sections
- `src/data/subjects.js` — Bash added to LANG_REFS

---

## Key Commands
```bash
cd ~/rabbit/root/projects/onit/coogs-hub && pnpm dev
pnpm build && npx cap copy android && cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```