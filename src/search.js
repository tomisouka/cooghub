// src/search.js
// Unified search across notes, talk2me, code, and PDFs.
// PDF results come from /pdf-index.json built by scripts/index-pdfs.js

import { mdFiles, txtFiles, cppFiles } from "./globs";
import { ALL_COURSES }                  from "./data/subjects";
import { TALK2ME }                      from "./data/talk2me";

// ── Meta lookup: filePath → { label, courseId, section, color, type } ────────

function buildMeta() {
  const meta = {};

  ALL_COURSES.forEach(course => {
    course.notes.forEach(n => {
      meta[n.file] = {
        label:    n.label,
        courseId: course.id,
        section:  course.label,
        color:    course.color,
        type:     "note",
      };
    });
    course.code.forEach(f => {
      meta[f.path] = {
        label:    f.label,
        courseId: course.id,
        section:  course.label,
        color:    course.color,
        type:     "code",
      };
    });
  });

  TALK2ME.forEach(s => {
    s.files.forEach(f => {
      meta[f.file] = {
        label:     f.label,
        courseId:  null,
        section:   `Talk2Me / ${s.label}`,
        color:     s.color,
        type:      "talk2me",
        sectionId: s.id,
      };
    });
  });

  return meta;
}

// ── Build text index from md/txt/cpp files ────────────────────────────────────

export async function buildSearchIndex() {
  const meta    = buildMeta();
  const entries = [];

  const allLoaders = [
    ...Object.entries(mdFiles),
    ...Object.entries(txtFiles),
    ...Object.entries(cppFiles),
  ];

  await Promise.all(
    allLoaders.map(async ([filePath, loader]) => {
      const m = meta[filePath];
      if (!m) return;
      try {
        const content = await loader();
        entries.push({ id: filePath, filePath, content, ...m });
      } catch {
        // skip unloadable files
      }
    })
  );

  return entries;
}

// ── Load PDF index (fetched once, cached) ─────────────────────────────────────

let pdfIndexCache = null;

export async function loadPdfIndex() {
  if (pdfIndexCache) return pdfIndexCache;
  try {
    const res = await fetch("/pdf-index.json");
    if (!res.ok) throw new Error("not found");
    const data = await res.json();
    pdfIndexCache = data.indexed || [];
    return pdfIndexCache;
  } catch {
    pdfIndexCache = [];
    return [];
  }
}

// ── Search text index ─────────────────────────────────────────────────────────

export function searchTextIndex(index, query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const entry of index) {
    const inLabel   = entry.label.toLowerCase().includes(q);
    const inSection = entry.section.toLowerCase().includes(q);
    const lower     = entry.content.toLowerCase();
    const inContent = lower.includes(q);

    if (!inLabel && !inSection && !inContent) continue;

    let snippet = "";
    if (inContent) {
      const idx   = lower.indexOf(q);
      const start = Math.max(0, idx - 60);
      const end   = Math.min(entry.content.length, idx + q.length + 100);
      snippet =
        (start > 0 ? "…" : "") +
        entry.content.slice(start, end).replace(/\n/g, " ") +
        (end < entry.content.length ? "…" : "");
    }

    results.push({ ...entry, snippet, matchInLabel: inLabel || inSection });
  }

  results.sort((a, b) => (b.matchInLabel ? 1 : 0) - (a.matchInLabel ? 1 : 0));
  return results.slice(0, 30);
}

// ── Search PDF index ──────────────────────────────────────────────────────────

export function searchPdfIndex(pdfIndex, query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const pdf of pdfIndex) {
    let hitsForThisPdf = 0;
    for (const { page, text } of pdf.pages) {
      if (hitsForThisPdf >= 3) break;
      const lower = text.toLowerCase();
      if (!lower.includes(q)) continue;

      const idx   = lower.indexOf(q);
      const start = Math.max(0, idx - 80);
      const end   = Math.min(text.length, idx + q.length + 120);
      const snippet =
        (start > 0 ? "…" : "") +
        text.slice(start, end).replace(/\s+/g, " ") +
        (end < text.length ? "…" : "");

      results.push({
        id:       `${pdf.file}::${page}`,
        type:     "pdf",
        file:     pdf.file,
        label:    pdf.label,
        courseId: pdf.course,
        page,
        snippet,
      });
      hitsForThisPdf++;
    }
  }

  return results.slice(0, 20);
}

// ── Resolve a result → navigation target ─────────────────────────────────────

export function resolveResult(result) {
  if (result.type === "pdf") {
    return { page: result.courseId, courseId: result.courseId, tab: "pdfs", file: result.file, pdfPage: result.page };
  }
  if (result.type === "note") {
    return { page: result.courseId, courseId: result.courseId, tab: "notes", file: result.filePath };
  }
  if (result.type === "code") {
    return { page: result.courseId, courseId: result.courseId, tab: "code", file: result.filePath };
  }
  if (result.type === "talk2me") {
    return { page: "talk2me", sectionId: result.sectionId, file: result.filePath };
  }
  return null;
}
