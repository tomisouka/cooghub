#!/usr/bin/env node
// scripts/index-pdfs.js
// Extracts text from every PDF in public/pdfs/ and writes public/pdf-index.json
// Skips indexing if pdf-index.json is already newer than all PDFs.

import { readdir, writeFile, readFile, stat } from "fs/promises";
import { existsSync }                          from "fs";
import { join, resolve }                       from "path";
import { fileURLToPath, pathToFileURL }        from "url";
import { createRequire }                       from "module";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT      = resolve(__dirname, "..");
const PDF_DIR   = join(ROOT, "public", "pdfs");
const OUT_FILE  = join(ROOT, "public", "pdf-index.json");

const COURSE_IDS = [
  "datastruct", "algos", "automata", "cpp", "comporg", "python",
  "algebra", "precalc", "calc1", "calc2", "discrete", "linear", "stats",
];

// Fallback hardcoded maps for existing files with non-obvious names
const PDF_COURSE_MAP = {
  "zybookdsa.pdf":           "datastruct",
  "algos_gopalbook_v2.pdf":  "algos",
  "automataVarem.pdf":       "automata",
  "mergedcpp.pdf":           "cpp",
  "cpp_RPG_PROJECT.pdf":     "cpp",
  "ARMedition2425.pdf":      "comporg",
  "comporg_merged.pdf":      "comporg",
  "comporg_merged_labs.pdf": "comporg",
  "DISCRETE.pdf":            "discrete",
  "discrete-notes.pdf":      "discrete",
  "discrete-exam1.pdf":      "discrete",
  "discrete-exam2.pdf":      "discrete",
  "lineartextbook.pdf":      "linear",
  "stats-alllectures.pdf":   "stats",
};

const PDF_LABEL_MAP = {
  "zybookdsa.pdf":           "Zybook DSA Textbook",
  "algos_gopalbook_v2.pdf":  "Gopal Algorithms Textbook",
  "automataVarem.pdf":       "Automata Textbook (Varem)",
  "mergedcpp.pdf":           "C++ Merged Textbook",
  "cpp_RPG_PROJECT.pdf":     "RPG Project",
  "ARMedition2425.pdf":      "ARM Architecture Textbook",
  "comporg_merged.pdf":      "Comp Org Merged Notes",
  "comporg_merged_labs.pdf": "Comp Org Labs",
  "DISCRETE.pdf":            "Discrete Math Textbook",
  "discrete-notes.pdf":      "Discrete Notes",
  "discrete-exam1.pdf":      "Exam 1",
  "discrete-exam2.pdf":      "Exam 2",
  "lineartextbook.pdf":      "Linear Algebra Textbook",
  "stats-alllectures.pdf":   "All Lectures",
};

function detectCourse(filename) {
  if (PDF_COURSE_MAP[filename]) return PDF_COURSE_MAP[filename];
  const lower = filename.toLowerCase();
  return COURSE_IDS.find(id => lower.includes(id)) ?? "unknown";
}

function makeLabel(filename) {
  if (PDF_LABEL_MAP[filename]) return PDF_LABEL_MAP[filename];
  // "Algos_Gopal_intro_exam.pdf" → "Gopal Intro Exam"
  const noExt  = filename.replace(/\.[^.]+$/, "");
  const words  = noExt.replace(/[_\-]+/g, " ").trim().split(/\s+/);
  const course = detectCourse(filename);
  const filtered = words[0].toLowerCase() === course ? words.slice(1) : words;
  return filtered.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || noExt;
}

let pdfjsLib = null;
async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const mod    = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib     = mod.default || mod;
  const require    = createRequire(import.meta.url);
  const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  return pdfjsLib;
}

async function extractPages(pdfPath) {
  const lib  = await getPdfjs();
  const data = await readFile(pdfPath);
  const doc  = await lib.getDocument({
    data:            new Uint8Array(data),
    useWorkerFetch:  false,
    isEvalSupported: false,
    disableFontFace: true,
  }).promise;

  const pages = [];
  const total = doc.numPages;
  for (let i = 1; i <= total; i++) {
    const page    = await doc.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items.map(item => item.str).join(" ").replace(/\s+/g, " ").trim();
    if (text.length > 10) pages.push({ page: i, text });
  }
  return { total, pages };
}

async function main() {
  if (!existsSync(PDF_DIR)) {
    console.log("⚠  public/pdfs/ not found — skipping");
    await writeFile(OUT_FILE, JSON.stringify({ indexed: [], builtAt: new Date().toISOString() }));
    return;
  }

  const files = (await readdir(PDF_DIR)).filter(f => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.log("⚠  No PDFs found — skipping");
    await writeFile(OUT_FILE, JSON.stringify({ indexed: [], builtAt: new Date().toISOString() }));
    return;
  }

  // ── Skip if index is already newer than all PDFs ─────────────────
  const force = process.argv.includes("--force") || process.env.FORCE_REINDEX === "1";
  if (!force && existsSync(OUT_FILE)) {
    const indexTime = (await stat(OUT_FILE)).mtimeMs;
    const pdfTimes  = await Promise.all(files.map(f => stat(join(PDF_DIR, f)).then(s => s.mtimeMs)));
    const newestPdf = Math.max(...pdfTimes);

    if (newestPdf < indexTime) {
      console.log("✅ PDF index up to date — skipping");
      return;
    }
    console.log("🔄 PDFs changed — rebuilding index...");
  }

  console.log(`📄 Indexing ${files.length} PDFs...`);
  const indexed = [];

  for (const file of files) {
    const course = detectCourse(file);
    const label  = makeLabel(file);
    process.stdout.write(`   ${file} ... `);
    try {
      const { total, pages } = await extractPages(join(PDF_DIR, file));
      indexed.push({ file, course, label, totalPages: total, pages });
      console.log(`✓  ${pages.length}/${total} pages`);
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }
  }

  const out = { indexed, builtAt: new Date().toISOString() };
  await writeFile(OUT_FILE, JSON.stringify(out));
  const kb = Math.round(JSON.stringify(out).length / 1024);
  console.log(`\n✅ Done → public/pdf-index.json  (${kb} kb, ${indexed.length} PDFs)`);
}

main().catch(err => { console.error(err); process.exit(1); });