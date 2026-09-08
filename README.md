# Coogs Hub

A personal, local-first hub for organizing a full course load in one place.

- Pulls together notes, PDFs, code, and assignments that would otherwise be scattered across apps
- Automatically sorts everything by course
- Makes it all searchable
- Adds the planning tools needed to actually stay on top of a semester — deadlines, agenda, progress tracking

Runs as a web app with a local Express server for handling uploads, and is packaged for desktop (Tauri) and Android (Capacitor) so the same course library works everywhere.

## Demo

**Upload flow** — drop in a file or a whole zip of course material, and it's automatically identified, matched to the right course, checked against what's already indexed, and filed into place — no manual sorting.
![Upload flow](./docs/demo/upload-flow.gif)

**Quick tour** — moving between courses, browsing notes, code, and PDFs, and seeing how everything is organized by subject and file type.
![Quick tour](./docs/demo/quick-tour.gif)

**Homepage** — every course at a glance, with quick access to the agenda, deadlines, and progress views.
![Homepage](./docs/demo/homepage.png)

## Features

**Ingestion & organization**
- Drag-and-drop upload of single files or entire zip archives
- Automatic course detection from filename, folder structure, or course code
- Duplicate and conflict detection via content hashing
- File inventory manager — reorder, group, rename, and register orphaned files

**Content viewing**
- In-app Markdown, HTML, code, and PDF viewers
- PDF viewer with in-document search and highlight
- Full-text PDF search indexing, with detection of unindexed or orphaned PDFs

**Course & subject management**
- Per-course tabs for notes, code, assignments, PDFs, and references
- Department and course hub pages for browsing by subject

**Planning & tracking**
- Weekly agenda with custom icons
- Deadlines tracker with repeat/recurrence support
- Progress tracking across courses
- Ticket/TODO system for coursework tasks
- Roadmap view for longer-term planning
- "Signal & Noise" — a structured weekly self-debate protocol for tracking exam readiness
- "Talk2Me" journal entries for reflection, saved per course

**Cross-platform**
- Desktop app via Tauri
- Android app via Capacitor
- Same course data and features across all platforms

**Security**
- Shared-secret token required on every upload/delete/save route

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
