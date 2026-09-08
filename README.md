# Coogs Hub

Coogs Hub is a personal, local-first command center for a full course load — built to solve a real problem: coursework lives scattered across PDFs, lecture notes, code assignments, exam solutions, and half a dozen apps that don't talk to each other. Coogs Hub pulls all of it into one place, automatically sorts it by course, makes it searchable, and layers on the planning tools (deadlines, agenda, progress tracking) needed to actually stay on top of a semester.

It's built as a web app first, with an Express ingestion server for handling uploads, and packaged for desktop (Tauri) and Android (Capacitor) so the same course library is available everywhere.

## Demo

**Upload flow** — drop in a file or a whole zip of course material, and it's automatically identified, matched to the right course by filename or folder, checked against what's already indexed, and filed into place — no manual sorting.
![Upload flow](./docs/demo/upload-flow.gif)

**Quick tour** — a walkthrough of moving between courses, browsing notes, code, and PDFs, and seeing how everything is organized by subject and file type.
![Quick tour](./docs/demo/quick-tour.gif)

**Homepage** — the home dashboard: every course at a glance, with quick access to the agenda, deadlines, and progress views.
![Homepage](./docs/demo/homepage.png)

## Features

**Ingestion & organization**
- Drag-and-drop upload of single files or entire zip archives
- Automatic course detection from filename, folder structure, or course code aliases (e.g. course numbers map to subject IDs)
- Duplicate and conflict detection via content hashing — never silently overwrites without warning
- File inventory manager: reorder, group, rename, and register orphaned files that didn't get auto-sorted

**Content viewing**
- In-app Markdown viewer
- In-app HTML viewer (for rendered notes and reference pages)
- Syntax-highlighted code viewer
- PDF viewer with in-document search and highlight
- Full-text PDF search indexing, with detection of unindexed or orphaned PDFs

**Course & subject management**
- Per-course tabs for notes, code, assignments, PDFs, and references
- Department and course hub pages for browsing by subject

**Planning & tracking**
- Weekly agenda with custom icons per entry
- Deadlines tracker with repeat/recurrence support
- Progress tracking across courses
- Ticket/TODO system for coursework tasks
- Roadmap view for longer-term planning
- "Signal & Noise" — a structured weekly self-debate protocol for tracking evidence, arguments, and exam readiness on a given topic
- Personal journal-style entries ("Talk2Me") for reflection, saved and browsable per course

**Cross-platform**
- Packaged as a desktop app via Tauri
- Packaged as an Android app via Capacitor
- Same course data and features across all platforms

**Security**
- Shared-secret token authentication on every upload/delete/save route — the server rejects any request that doesn't present a valid token, closing off unauthenticated access to file writes

## Stack

- React 19 + Vite
- Express (local file-ingestion server)
- Tauri (desktop packaging)
- Capacitor (Android packaging)

## Setup

```bash
pnpm install
pnpm dev
```

The Express upload server runs alongside Vite via the config in `vite.config.js`. On first run, copy `src/config/localAuth.example.js` to `src/config/localAuth.js` and set your own `UPLOAD_TOKEN` and `DELETE_CONFIRM_PW` values.

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — run eslint
- `pnpm test` — run vitest
- `pnpm reindex` — force-reindex PDFs

## License

AGPL-3.0 — see [LICENSE](./LICENSE).
