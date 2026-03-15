// src/search.js
// Unified search across notes, talk2me, code, PDFs, and references.
// PDF results come from /pdf-index.json built by scripts/index-pdfs.js

import { mdFiles, txtFiles, cppFiles } from "./globs";
// Static fallbacks — overridden by live data passed from DataContext
import { ALL_COURSES as _ALL_COURSES, LANG_REFS as _LANG_REFS, MATH_SHARED_REFS as _MATH_SHARED_REFS } from "./data/subjects";
import { TALK2ME }                      from "./data/talk2me";

let _liveData = null;
export function setSearchData(data) { _liveData = data; }
const getCourses  = () => _liveData?.ALL_COURSES      ?? _ALL_COURSES;
const getLangRefs = () => _liveData?.LANG_REFS        ?? _LANG_REFS;
const getMathRefs = () => _liveData?.MATH_SHARED_REFS ?? _MATH_SHARED_REFS;

// ── Knowledge base — lazy loaded on first search, then cached ─────────────────
// All 21 JS arrays are large; importing them eagerly delays app startup by ~10s.
// We dynamic-import them once, build ALL_KNOWLEDGE, then cache it.

// ── Meta lookup: filePath → { label, courseId, section, color, type } ────────

function buildMeta() {
  const meta = {};

  getCourses().forEach(course => {
    if (course.isHub) return;
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

// ── Build reference label index from subjects.js ──────────────────────────────
// Flat list of every reference/gopal iframe entry across all courses.
// Used for label-level search ("Merge Sort", "AVL Tree", "Gopal FFT").

export function buildReferenceIndex() {
  const entries = [];

  function addItems(items, courseId, courseLabel, courseColor, tab) {
    items.forEach(item => {
      if (item.type === "group") {
        addItems(item.children, courseId, courseLabel, courseColor, tab);
      } else if (item.type === "iframe" && item.file && item.label) {
        entries.push({
          id:       `ref::${courseId}::${item.file}`,
          type:     "reference",
          file:     item.file,
          label:    item.label,
          courseId,
          section:  courseLabel,
          color:    courseColor,
          tab,
        });
      }
    });
  }

  getCourses().forEach(course => {
    addItems(course.references || [], course.id, course.label, course.color, "references");
    addItems(course.gopal      || [], course.id, course.label, course.color, "gopal");
  });

  // Lang+ refs
  getLangRefs().forEach(ref => {
    entries.push({
      id:       `langref::${ref.file}`,
      type:     "reference",
      file:     ref.file,
      label:    `${ref.label} Reference`,
      courseId: null,
      section:  "Lang+",
      color:    ref.color,
      tab:      "langref",
    });
  });

  // MATH dept shared refs (only live in DeptPage sidebar, not attached to any course)
  getMathRefs().forEach(ref => {
    entries.push({
      id:       `mathref::${ref.file}`,
      type:     "reference",
      file:     ref.file,
      label:    ref.label,
      courseId: null,
      section:  "MATH",
      color:    ref.color,
      tab:      "mathref",
    });
  });

  return entries;
}

// ── Full-text reference HTML index ────────────────────────────────────────────
// Fetches every reference HTML file, strips tags, and builds a plain-text index.
// Lazy-loaded on first search, then cached. Uses the same refIndex entries as
// buildReferenceIndex() so navigation already works correctly.

let refTextCache = null;
const REF_TEXT_CACHE_VERSION = 4; // bump when extraction logic changes
const REF_TEXT_STORAGE_KEY   = `coogs-ref-text-v${REF_TEXT_CACHE_VERSION}`;

export async function buildRefTextIndex(refIndex) {
  // 1. Return in-memory cache if available
  if (refTextCache) return refTextCache;

  // 2. Try sessionStorage — survives HMR reloads but not hard refreshes.
  //    Key includes version so any code change auto-invalidates old data.
  try {
    const stored = sessionStorage.getItem(REF_TEXT_STORAGE_KEY);
    if (stored) {
      refTextCache = JSON.parse(stored);
      return refTextCache;
    }
  } catch { /* sessionStorage unavailable or quota exceeded — continue to fetch */ }

  // 3. Block-level elements that should have spaces inserted around their text
  //    so table cells, list items, headings etc. don't concatenate into blobs.
  const BLOCK = new Set([
    "DIV","P","TD","TH","LI","H1","H2","H3","H4","H5","H6",
    "TR","SECTION","ARTICLE","HEADER","FOOTER","CAPTION",
    "BLOCKQUOTE","PRE","DT","DD","FIGCAPTION","SUMMARY",
  ]);

  function extractText(el) {
    let out = "";
    for (const node of el.childNodes) {
      if (node.nodeType === 3) {
        out += node.textContent;
      } else if (node.nodeType === 1) {
        if (BLOCK.has(node.tagName)) {
          out += " " + extractText(node) + " ";
        } else {
          out += extractText(node);
        }
      }
    }
    return out;
  }

  // 4. Fetch all files in parallel, extract text with block-aware walker
  const results = await Promise.allSettled(
    refIndex.map(async entry => {
      try {
        const res = await fetch(`/references/${entry.file}?raw`);
        if (!res.ok) return null;
        const html = await res.text();
        const div = document.createElement("div");
        div.innerHTML = html;
        div.querySelectorAll("script, style, nav, header, footer, .grid-bg, .back-top").forEach(el => el.remove());
        const text = extractText(div).replace(/\s+/g, " ").trim();
        return { ...entry, text };
      } catch {
        return null;
      }
    })
  );

  refTextCache = results
    .filter(r => r.status === "fulfilled" && r.value)
    .map(r => r.value);

  // 5. Persist to sessionStorage — clear old versions first
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("coogs-ref-text-")) sessionStorage.removeItem(key);
    }
    sessionStorage.setItem(REF_TEXT_STORAGE_KEY, JSON.stringify(refTextCache));
  } catch { /* quota exceeded — in-memory only is fine */ }

  return refTextCache;
}

export function searchRefTextIndex(refTextIndex, query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const entry of refTextIndex) {
    const inLabel   = entry.label.toLowerCase().includes(q);
    const inSection = entry.section.toLowerCase().includes(q);
    const lower     = entry.text.toLowerCase();
    const inText    = lower.includes(q);

    if (!inLabel && !inSection && !inText) continue;

    let snippet = "";
    if (inText) {
      const idx   = lower.indexOf(q);
      const start = Math.max(0, idx - 60);
      const end   = Math.min(entry.text.length, idx + q.length + 100);
      snippet =
        (start > 0 ? "…" : "") +
        entry.text.slice(start, end).replace(/\s+/g, " ") +
        (end < entry.text.length ? "…" : "");
    }

    results.push({
      ...entry,
      snippet,
      matchInLabel: inLabel || inSection,
      type: "reference",
    });
  }

  results.sort((a, b) => (b.matchInLabel ? 1 : 0) - (a.matchInLabel ? 1 : 0));
  return results;
}

// ── Search reference label index ──────────────────────────────────────────────

export function searchReferenceIndex(refIndex, query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const entry of refIndex) {
    const inLabel   = entry.label.toLowerCase().includes(q);
    const inSection = entry.section.toLowerCase().includes(q);
    if (!inLabel && !inSection) continue;
    results.push({ ...entry, snippet: entry.section, matchInLabel: inLabel });
  }

  results.sort((a, b) => (b.matchInLabel ? 1 : 0) - (a.matchInLabel ? 1 : 0));
  return results;
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
  return results;
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

  return results;
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
  if (result.type === "reference") {
    if (result.tab === "mathref") {
      return { page: "math", courseId: null, tab: "mathref", file: result.file, query: result.query };
    }
    if (result.tab === "langref" || !result.courseId) {
      return { page: "cosc", courseId: null, tab: "langref", file: result.file, query: result.query };
    }
    return { page: result.courseId, courseId: result.courseId, tab: result.tab, file: result.file, query: result.query };
  }

  return null;
}