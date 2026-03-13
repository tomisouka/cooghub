// server/upload.js
// Run alongside Vite via vite.config.js plugin
// POST /scan         — dry-run zip: validate only, no writes
// POST /upload       — zip: validate + write + patch subjects.js
// POST /scan-files   — dry-run loose files: validate only, no writes
// POST /upload-files — loose files: validate + write + patch subjects.js

import express    from "express";
import multer     from "multer";
import JSZip      from "jszip";
import fs         from "fs";
import path       from "path";
import crypto     from "crypto";
import { spawn }  from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");

function triggerReindex() {
  const script = path.join(ROOT, "scripts", "index-pdfs.js");
  const child  = spawn(process.execPath, [script], { cwd: ROOT, detached: true, stdio: "inherit" });
  child.unref();
  console.log("  ↻ PDF reindex triggered");
}

// ── Course IDs ────────────────────────────────────────────────────────────────
const COURSE_IDS = [
  "datastruct", "algos", "automata", "cpp", "comporg", "python",
  "algebra", "precalc", "calc1", "calc2", "discrete", "linear", "stats",
];

// Course code aliases — common UH COSC/MATH codes map to course IDs
const COURSE_CODE_ALIASES = {
  "2436": "datastruct",
  "3320": "algos",
  "3360": "automata",
  "1430": "cpp",
  "2310": "cpp",
  "3340": "comporg",
  "1336": "python",
  "2303": "algebra",
  "2311": "precalc",
  "1431": "calc1",
  "1432": "calc2",
  "2305": "discrete",
  "2318": "linear",
  "3339": "stats",
};

// ── File routing rules ────────────────────────────────────────────────────────
const ROUTES = {
  ".pdf": ()         => path.join(ROOT, "public", "pdfs"),
  ".md":  (courseId) => path.join(ROOT, "src", "content", "subjects", courseId),
  ".txt": (courseId) => path.join(ROOT, "src", "content", "subjects", courseId),
  ".cpp": (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".py":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".c":   (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".h":   (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".js":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".ts":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
};

const ALLOWED_EXTS = new Set(Object.keys(ROUTES));

// ── Helpers ───────────────────────────────────────────────────────────────────

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function detectCourse(filename) {
  const lower = filename.toLowerCase();
  // Direct course ID match
  const direct = COURSE_IDS.find(id => lower.includes(id));
  if (direct) return direct;
  // Course code alias match (e.g. "3320" → "algos")
  for (const [code, courseId] of Object.entries(COURSE_CODE_ALIASES)) {
    if (lower.includes(code)) return courseId;
  }
  return null;
}

function existingHash(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return sha256(fs.readFileSync(filepath));
}

// ── Validate a single file ────────────────────────────────────────────────────
function validate(name, buffer, zipName = "") {
  const base = path.basename(name);
  const ext  = path.extname(base).toLowerCase();

  if (base.startsWith("__") || base.startsWith(".") || name.includes("__MACOSX"))
    return { status: "skip", reason: "System file" };

  if (name.endsWith("/"))
    return { status: "skip", reason: "Directory entry" };

  if (!ALLOWED_EXTS.has(ext))
    return { status: "rejected", reason: `Unsupported type (${ext || "no extension"})` };

  const courseId = detectCourse(base) ?? detectCourse(zipName);
  if (!courseId) {
    return {
      status: "rejected",
      reason: `No course ID found in filename or zip name. Include one of: ${COURSE_IDS.join(", ")}`,
    };
  }

  const inferredFrom = detectCourse(base) ? "filename" : "zip name";
  const destDir      = ROUTES[ext](courseId);
  const destPath     = path.join(destDir, base);
  const incomingHash = sha256(buffer);
  const existHash    = existingHash(destPath);

  if (existHash) {
    if (existHash === incomingHash)
      return { status: "duplicate", reason: "Exact duplicate already exists", courseId, inferredFrom, destPath, ext };
    else
      return { status: "conflict", reason: "Name exists but content differs — will overwrite", courseId, inferredFrom, destPath, ext, hash: incomingHash };
  }

  return { status: "ok", courseId, inferredFrom, destPath, ext, hash: incomingHash };
}

// ── subjects.js auto-patching ─────────────────────────────────────────────────

const SUBJECTS_PATH = path.resolve(ROOT, "src", "data", "subjects.js");

function tabForExt(ext) {
  if (ext === ".pdf") return "pdfs";
  if (ext === ".md" || ext === ".txt") return "notes";
  if ([".cpp", ".py", ".c", ".h", ".js", ".ts"].includes(ext)) return "code";
  return null;
}

function makeEntry(base, courseId, tab) {
  const label = base.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  if (tab === "pdfs")  return `{ file: "${base}", label: "${label}" }`;
  if (tab === "notes") return `{ file: "./content/subjects/${courseId}/${base}", label: "${label}" }`;
  if (tab === "code")  return `{ path: "./content/code/${courseId}/${base}", label: "${base}" }`;
  return null;
}

function patchSubjects(base, courseId, tab, group = "") {
  const entryObj = makeEntry(base, courseId, tab);
  if (!entryObj) return;

  let src = fs.readFileSync(SUBJECTS_PATH, "utf8");

  const courseIdx = src.indexOf(`id: "${courseId}"`);
  if (courseIdx === -1) return;

  const tabIdx = src.indexOf(`${tab}: [`, courseIdx);
  if (tabIdx === -1) return;

  // Walk brackets to find the tab array closing ]
  let depth = 0, closeIdx = -1;
  for (let i = tabIdx + tab.length + 3 - 1; i < src.length; i++) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx === -1) return;

  // Already registered? (idempotent)
  if (src.slice(tabIdx, closeIdx).includes(`"${base}"`)) return;

  if (group && group.trim()) {
    const groupLabel  = group.trim();
    const groupMarker = `label: "${groupLabel}"`;
    const groupIdx    = src.indexOf(groupMarker, tabIdx);

    if (groupIdx !== -1 && groupIdx < closeIdx) {
      // Group exists — append inside its children array
      const childrenIdx = src.indexOf("children: [", groupIdx);
      if (childrenIdx !== -1 && childrenIdx < closeIdx) {
        let cd = 0, childClose = -1;
        for (let i = childrenIdx + 10; i < src.length; i++) {
          if (src[i] === "[") cd++;
          if (src[i] === "]") { if (cd === 0) { childClose = i; break; } cd--; }
        }
        if (childClose !== -1) {
          const entry = `\n            ${entryObj},`;
          src = src.slice(0, childClose) + entry + "\n          " + src.slice(childClose);
          fs.writeFileSync(SUBJECTS_PATH, src, "utf8");
          console.log(`  ✓ subjects.js patched: ${courseId}.${tab}["${groupLabel}"] <- ${base}`);
          return;
        }
      }
    }

    // Group doesn't exist — create it
    const groupBlock =
      `\n          { type: "group", label: "${groupLabel}", children: [\n` +
      `            ${entryObj},\n` +
      `          ] },`;
    src = src.slice(0, closeIdx) + groupBlock + "\n        " + src.slice(closeIdx);
  } else {
    // Flat insert
    const entry = `\n          ${entryObj},`;
    src = src.slice(0, closeIdx) + entry + "\n        " + src.slice(closeIdx);
  }

  fs.writeFileSync(SUBJECTS_PATH, src, "utf8");
  console.log(`  ✓ subjects.js patched: ${courseId}.${tab}${group ? `["${group}"]` : ""} <- ${base}`);
}

// ── Apply a single validated result ──────────────────────────────────────────
function applyResult(result, buffer, ext, base, groupLabels) {
  if (result.status === "ok" || result.status === "conflict") {
    fs.mkdirSync(path.dirname(result.destPath), { recursive: true });
    fs.writeFileSync(result.destPath, buffer);
    const tab = tabForExt(ext);
    if (tab) patchSubjects(base, result.courseId, tab, groupLabels[base] || "");
  } else if (result.status === "duplicate") {
    // File already on disk — just make sure it's registered in subjects.js
    const tab = tabForExt(ext);
    if (tab) patchSubjects(base, result.courseId, tab, groupLabels[base] || "");
  }
}

// ── Process zip ───────────────────────────────────────────────────────────────
async function processZip(zipBuffer, zipName = "", apply = false, groupLabels = {}, renames = {}) {
  const zip     = await JSZip.loadAsync(zipBuffer);
  const results = [];

  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const buffer      = await entry.async("nodebuffer");
    const originalBase = path.basename(name);
    const base        = renames[originalBase] || originalBase;  // apply rename if present
    const fext        = path.extname(base).toLowerCase();
    const result      = validate(base, buffer, zipName);

    results.push({ filename: base, originalFilename: originalBase, path: name, size: buffer.length, ...result });

    if (apply) applyResult(result, buffer, fext, base, groupLabels);
  }

  const summary = {
    total:      results.length,
    added:      results.filter(r => r.status === "ok").length,
    conflicts:  results.filter(r => r.status === "conflict").length,
    duplicates: results.filter(r => r.status === "duplicate").length,
    rejected:   results.filter(r => r.status === "rejected").length,
    skipped:    results.filter(r => r.status === "skip").length,
  };

  const needsReindex = apply && results.some(r =>
    (r.status === "ok" || r.status === "conflict" || r.status === "duplicate") && r.ext === ".pdf"
  );

  return { results, summary, needsReindex };
}

// ── Process loose files ───────────────────────────────────────────────────────
async function processFiles(files, apply = false, groupLabels = {}, renames = {}) {
  const results = [];

  for (const file of files) {
    const originalBase = file.originalname;
    const base         = renames[originalBase] || originalBase;
    const fext         = path.extname(base).toLowerCase();
    const buffer       = file.buffer;
    const result       = validate(base, buffer, "");

    results.push({ filename: base, originalFilename: originalBase, path: base, size: buffer.length, ...result });

    if (apply) applyResult(result, buffer, fext, base, groupLabels);
  }

  const summary = {
    total:      results.length,
    added:      results.filter(r => r.status === "ok").length,
    conflicts:  results.filter(r => r.status === "conflict").length,
    duplicates: results.filter(r => r.status === "duplicate").length,
    rejected:   results.filter(r => r.status === "rejected").length,
    skipped:    results.filter(r => r.status === "skip").length,
  };

  const needsReindex = apply && results.some(r =>
    (r.status === "ok" || r.status === "conflict" || r.status === "duplicate") && r.ext === ".pdf"
  );

  return { results, summary, needsReindex };
}

// ── Express app ───────────────────────────────────────────────────────────────
const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

app.use(express.json());

// ── POST /rescan-file — re-validate a single file under a new name ─────────────
// Body: { originalName, newName }
// Returns the same shape as a single scan result entry (no file bytes needed).
app.post("/rescan-file", express.json(), (req, res) => {
  const { originalName, newName } = req.body;
  if (!originalName || !newName) return res.status(400).json({ error: "Missing originalName or newName" });
  try {
    const base = path.basename(newName);
    const fext = path.extname(base).toLowerCase();

    if (!ALLOWED_EXTS.has(fext))
      return res.json({ status: "rejected", reason: `Unsupported type (${fext || "no extension"})`, filename: newName, courseId: null, ext: fext });

    const courseId = detectCourse(base);
    if (!courseId)
      return res.json({ status: "rejected", reason: `No course ID found. Include one of: ${COURSE_IDS.join(", ")}`, filename: newName, courseId: null, ext: fext });

    const destDir  = ROUTES[fext](courseId);
    const destPath = path.join(destDir, base);
    const exists   = fs.existsSync(destPath);

    res.json({
      filename: newName,
      status: exists ? "conflict" : "ok",
      reason: exists ? "Name exists on disk — will overwrite" : null,
      courseId, inferredFrom: "filename", ext: fext,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/scan", upload.single("zip"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No zip provided" });
  try {
    const renames = req.body.renames ? JSON.parse(req.body.renames) : {};
    res.json(await processZip(req.file.buffer, req.file.originalname, false, {}, renames));
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/upload", upload.single("zip"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No zip provided" });
  try {
    const groupLabels = req.body.groupLabels ? JSON.parse(req.body.groupLabels) : {};
    const renames     = req.body.renames     ? JSON.parse(req.body.renames)     : {};
    const data = await processZip(req.file.buffer, req.file.originalname, true, groupLabels, renames);
    if (data.needsReindex) triggerReindex();
    res.json(data);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/scan-files", upload.array("files"), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: "No files provided" });
  try {
    const renames = req.body.renames ? JSON.parse(req.body.renames) : {};
    res.json(await processFiles(req.files, false, {}, renames));
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/upload-files", upload.array("files"), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: "No files provided" });
  try {
    const groupLabels = req.body.groupLabels ? JSON.parse(req.body.groupLabels) : {};
    const renames     = req.body.renames     ? JSON.parse(req.body.renames)     : {};
    const data = await processFiles(req.files, true, groupLabels, renames);
    if (data.needsReindex) triggerReindex();
    res.json(data);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /groups — return existing group labels for a course+tab ───────────────
app.get("/groups", (req, res) => {
  const { courseId, tab } = req.query;
  if (!courseId || !tab) return res.status(400).json({ error: "Missing courseId or tab" });
  try {
    const src       = fs.readFileSync(SUBJECTS_PATH, "utf8");
    const courseIdx = src.indexOf(`id: "${courseId}"`);
    if (courseIdx === -1) return res.json({ groups: [] });
    const tabIdx = src.indexOf(`${tab}: [`, courseIdx);
    if (tabIdx === -1) return res.json({ groups: [] });

    let depth = 0, closeIdx = -1;
    for (let i = tabIdx + tab.length + 3 - 1; i < src.length; i++) {
      if (src[i] === "[") depth++;
      if (src[i] === "]") { depth--; if (depth === 0) { closeIdx = i; break; } }
    }
    if (closeIdx === -1) return res.json({ groups: [] });

    const tabSrc = src.slice(tabIdx, closeIdx);
    const groups = [];
    const re = /type:\s*"group"[^}]*label:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(tabSrc)) !== null) groups.push(m[1]);

    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── removeFromIndex — strip a filename from pdf-index.json if present ─────────
function removeFromIndex(basename) {
  const indexPath = path.join(ROOT, "public", "pdf-index.json");
  if (!fs.existsSync(indexPath)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    const entries = Array.isArray(raw) ? raw : (raw.indexed ?? []);
    const filtered = entries.filter(e => path.basename(e.file || "") !== basename);
    if (filtered.length === entries.length) return; // nothing to remove
    const out = Array.isArray(raw) ? filtered : { ...raw, indexed: filtered };
    fs.writeFileSync(indexPath, JSON.stringify(out), "utf8");
    console.log(`  ✓ removed from index: ${basename}`);
  } catch (err) {
    console.warn(`  ⚠ could not update pdf-index.json: ${err.message}`);
  }
}

// ── DELETE /file — remove a single file entry from subjects.js + disk ─────────
app.delete("/file", express.json(), async (req, res) => {
  const { courseId, tab, file } = req.body;
  if (!courseId || !tab || !file) return res.status(400).json({ error: "Missing courseId, tab, or file" });
  try {
    let src = fs.readFileSync(SUBJECTS_PATH, "utf8");
    const courseIdx = src.indexOf(`id: "${courseId}"`);
    if (courseIdx === -1) return res.status(404).json({ error: "Course not found" });
    const tabIdx = src.indexOf(`${tab}: [`, courseIdx);
    if (tabIdx === -1) return res.status(404).json({ error: "Tab not found" });

    let depth = 0, closeIdx = -1;
    for (let i = tabIdx + tab.length + 3 - 1; i < src.length; i++) {
      if (src[i] === "[") depth++;
      if (src[i] === "]") { depth--; if (depth === 0) { closeIdx = i; break; } }
    }
    if (closeIdx === -1) return res.status(500).json({ error: "Could not find tab array end" });

    const before   = src.slice(0, tabIdx);
    const tabSrc   = src.slice(tabIdx, closeIdx + 1);
    const after    = src.slice(closeIdx + 1);
    const escaped  = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const lineRe   = new RegExp(`(?:file|path):\\s*"${escaped}"`);
    const lines    = tabSrc.split("\n");
    const filtered = lines.filter(line => !lineRe.test(line));

    if (filtered.length === lines.length)
      return res.status(404).json({ error: "Entry not found in subjects.js" });

    fs.writeFileSync(SUBJECTS_PATH, before + filtered.join("\n") + after, "utf8");

    const fext = path.extname(file).toLowerCase();
    const dest = ROUTES[fext] ? path.join(ROUTES[fext](courseId), path.basename(file)) : null;
    if (dest && fs.existsSync(dest)) fs.unlinkSync(dest);
    if (fext === ".pdf") removeFromIndex(path.basename(file));

    console.log(`  ✓ deleted: ${courseId}.${tab} -> ${file}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /group — remove an entire group block from subjects.js + disk ──────
app.delete("/group", express.json(), async (req, res) => {
  const { courseId, tab, label } = req.body;
  if (!courseId || !tab || !label) return res.status(400).json({ error: "Missing courseId, tab, or label" });
  try {
    let src = fs.readFileSync(SUBJECTS_PATH, "utf8");
    const courseIdx = src.indexOf(`id: "${courseId}"`);
    if (courseIdx === -1) return res.status(404).json({ error: "Course not found" });
    const tabIdx = src.indexOf(`${tab}: [`, courseIdx);
    if (tabIdx === -1) return res.status(404).json({ error: "Tab not found" });

    const groupMarker = `label: "${label}"`;
    const groupIdx    = src.indexOf(groupMarker, tabIdx);
    if (groupIdx === -1) return res.status(404).json({ error: "Group not found" });

    let openBrace = groupIdx;
    while (openBrace > tabIdx && src[openBrace] !== "{") openBrace--;

    let depth = 0, closeBrace = -1;
    for (let i = openBrace; i < src.length; i++) {
      if (src[i] === "{") depth++;
      if (src[i] === "}") { depth--; if (depth === 0) { closeBrace = i; break; } }
    }
    if (closeBrace === -1) return res.status(500).json({ error: "Could not find group end" });

    let end = closeBrace + 1;
    if (src[end] === ",") end++;
    if (src[end] === "\n") end++;

    const groupSrc = src.slice(openBrace, closeBrace + 1);
    const fileRe   = /(?:file|path):\s*"([^"]+)"/g;
    let match;
    while ((match = fileRe.exec(groupSrc)) !== null) {
      const f    = match[1];
      const fext = path.extname(f).toLowerCase();
      const dest = ROUTES[fext] ? path.join(ROUTES[fext](courseId), path.basename(f)) : null;
      if (dest && fs.existsSync(dest)) fs.unlinkSync(dest);
      if (fext === ".pdf") removeFromIndex(path.basename(f));
    }

    fs.writeFileSync(SUBJECTS_PATH, src.slice(0, openBrace) + src.slice(end), "utf8");

    console.log(`  ✓ deleted group: ${courseId}.${tab}["${label}"]`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /register-orphan — register an already-on-disk file into subjects.js ──
app.post("/register-orphan", express.json(), (req, res) => {
  const { filename, courseId } = req.body;
  if (!filename || !courseId) return res.status(400).json({ error: "Missing filename or courseId" });
  try {
    const ext = path.extname(filename).toLowerCase();
    const tab = tabForExt(ext);
    if (!tab) return res.status(400).json({ error: `No tab mapping for extension ${ext}` });
    patchSubjects(filename, courseId, tab, "");
    console.log(`  ✓ registered orphan: ${courseId}.${tab} <- ${filename}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /orphan — delete an unregistered file from disk ───────────────────
app.delete("/orphan", express.json(), (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Missing filename" });
  try {
    const pdfDir = path.join(ROOT, "public", "pdfs");
    const target = path.join(pdfDir, path.basename(filename)); // basename prevents path traversal
    if (!fs.existsSync(target)) return res.status(404).json({ error: "File not found on disk" });
    fs.unlinkSync(target);
    removeFromIndex(path.basename(filename));
    console.log(`  ✓ deleted orphan: ${filename}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /rename-orphan — rename an unregistered file on disk ────────────────
app.post("/rename-orphan", express.json(), (req, res) => {
  const { filename, newName } = req.body;
  if (!filename || !newName) return res.status(400).json({ error: "Missing filename or newName" });
  // Validate: no path separators, must end in .pdf, reasonable length
  if (/[/\\]/.test(newName)) return res.status(400).json({ error: "newName must not contain path separators" });
  if (!newName.toLowerCase().endsWith(".pdf")) return res.status(400).json({ error: "newName must end in .pdf" });
  if (newName.length > 200) return res.status(400).json({ error: "newName too long" });
  try {
    const pdfDir  = path.join(ROOT, "public", "pdfs");
    const oldPath = path.join(pdfDir, path.basename(filename));
    const newPath = path.join(pdfDir, newName);
    if (!fs.existsSync(oldPath)) return res.status(404).json({ error: "File not found on disk" });
    if (fs.existsSync(newPath)) return res.status(409).json({ error: "A file with that name already exists" });
    fs.renameSync(oldPath, newPath);
    console.log(`  ✓ renamed orphan: ${filename} → ${newName}`);
    res.json({ ok: true, newName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /orphans — files on disk not registered in subjects.js ────────────────
app.get("/orphans", (req, res) => {
  try {
    const src     = fs.readFileSync(SUBJECTS_PATH, "utf8");
    const pdfDir  = path.join(ROOT, "public", "pdfs");
    const orphans = [];

    if (!fs.existsSync(pdfDir)) return res.json({ orphans: [] });

    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));
    for (const file of files) {
      // Check if this filename appears anywhere in subjects.js
      if (!src.includes(`"${file}"`)) {
        const courseId = detectCourse(file) ?? "unknown";
        const size     = fs.statSync(path.join(pdfDir, file)).size;
        orphans.push({ filename: file, courseId, size, status: "hidden", reason: "On disk but not registered in subjects.js" });
      }
    }

    res.json({ orphans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /inventory — full file overview grouped by course → tab → subsection ──
app.get("/inventory", (req, res) => {
  try {
    const src       = fs.readFileSync(SUBJECTS_PATH, "utf8");
    const pdfDir    = path.join(ROOT, "public", "pdfs");
    const indexPath = path.join(ROOT, "public", "pdf-index.json");

    // 1. Indexed PDFs
    const indexed = new Set();
    if (fs.existsSync(indexPath)) {
      try {
        const idx     = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        const entries = Array.isArray(idx) ? idx : (idx.indexed ?? []);
        for (const e of entries) if (e.file) indexed.add(path.basename(e.file));
      } catch {}
    }

    // 2. Disk stats for pdfs
    const onDisk = new Map();
    if (fs.existsSync(pdfDir)) {
      for (const f of fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"))) {
        const stat = fs.statSync(path.join(pdfDir, f));
        onDisk.set(f, { size: stat.size, mtime: stat.mtimeMs });
      }
    }

    // 3. Walk subjects.js — parse course blocks and all tab types
    //    Tabs tracked: notes, references, gopal, assignments, code, pdfs
    const TAB_KEYS = ["notes", "references", "gopal", "assignments", "code", "pdfs"];

    // Identify course blocks by scanning for `id: "..."` lines, then extract
    // each tab array by bracket-walking the source text.
    function extractTabArray(src, courseStart, courseEnd, tabKey) {
      const region  = src.slice(courseStart, courseEnd);
      const marker  = `${tabKey}: [`;
      const tabIdx  = region.indexOf(marker);
      if (tabIdx === -1) return null;

      const absStart = courseStart + tabIdx + marker.length - 1; // points to '['
      let depth = 0, close = -1;
      for (let i = absStart; i < courseStart + courseEnd - courseStart; i++) {
        if (src[i] === "[") depth++;
        if (src[i] === "]") { depth--; if (depth === 0) { close = i; break; } }
      }
      if (close === -1) return null;
      return src.slice(absStart, close + 1);
    }

    // Parse a tab array string into flat items with optional group label
    function parseTabItems(tabSrc, tabKey) {
      if (!tabSrc) return [];
      const items = [];

      // Find all group blocks first
      const groupRe = /\{\s*type:\s*["']group["'][^}]*label:\s*["']([^"']+)["'][^}]*children:\s*\[/g;
      let gm;
      const groups = [];
      while ((gm = groupRe.exec(tabSrc)) !== null) {
        const groupLabel = gm[1];
        const childStart = gm.index + gm[0].length - 1; // points to '['
        let depth = 0, childClose = -1;
        for (let i = childStart; i < tabSrc.length; i++) {
          if (tabSrc[i] === "[") depth++;
          if (tabSrc[i] === "]") { depth--; if (depth === 0) { childClose = i; break; } }
        }
        if (childClose !== -1) {
          groups.push({ label: groupLabel, start: gm.index, end: childClose + 2, childSrc: tabSrc.slice(childStart + 1, childClose) });
        }
      }

      // Extract items inside each group
      for (const g of groups) {
        const childItems = extractItems(g.childSrc, tabKey, g.label);
        items.push(...childItems);
      }

      // Extract top-level items (not inside a group)
      // Build a mask of characters that are inside group blocks
      const masked = tabSrc.split("");
      for (const g of groups) {
        for (let i = g.start; i < Math.min(g.end, tabSrc.length); i++) masked[i] = " ";
      }
      const flatSrc = masked.join("");
      items.push(...extractItems(flatSrc, tabKey, null));

      return items;
    }

    function extractItems(src, tabKey, groupLabel) {
      const items = [];
      // Match object literals: { file/path: "...", label: "..." }
      const objRe = /\{([^{}]*)\}/g;
      let m;
      while ((m = objRe.exec(src)) !== null) {
        const obj = m[1];
        const fileM  = obj.match(/(?:file|path):\s*["']([^"']+)["']/);
        const labelM = obj.match(/label:\s*["']([^"']+)["']/);
        if (!fileM) continue;
        const filePath = fileM[1];
        const filename = path.basename(filePath);
        const label    = labelM ? labelM[1] : filename;
        items.push({ filename, filePath, label, tab: tabKey, group: groupLabel });
      }
      return items;
    }

    // Walk courses
    const courses = [];
    const courseRe = /\bid:\s*["']([^"']+)["']/g;
    // Also grab label
    const allCourseIds = [];
    {
      const idRe = /\bid:\s*["']([^"']+)["']/g;
      let m;
      while ((m = idRe.exec(src)) !== null) allCourseIds.push({ id: m[1], pos: m.index });
    }

    // Filter to only course-level ids (inside DEPARTMENTS courses array)
    // Heuristic: preceded by a line with "color:" within 300 chars — good enough
    const depStart = src.indexOf("export const DEPARTMENTS");
    if (depStart === -1) return res.status(500).json({ error: "DEPARTMENTS not found in subjects.js" });

    const courseStarts = [];
    const courseIdRe = /\bid:\s*["']([^"']+)["']/g;
    courseIdRe.lastIndex = depStart;
    let cm;
    while ((cm = courseIdRe.exec(src)) !== null) {
      // Check there's a "label:" within the next 200 chars — confirms it's a course object
      const ahead = src.slice(cm.index, cm.index + 300);
      if (ahead.includes("label:") && ahead.includes("courseCode:")) {
        courseStarts.push({ id: cm[1], start: cm.index });
      }
    }

    for (let i = 0; i < courseStarts.length; i++) {
      const { id, start } = courseStarts[i];
      const end = i + 1 < courseStarts.length ? courseStarts[i + 1].start : src.length;

      // Get label
      const labelM = src.slice(start, start + 200).match(/label:\s*["']([^"']+)["']/);
      const label  = labelM ? labelM[1] : id;

      const tabs = {};
      for (const tabKey of TAB_KEYS) {
        const tabSrc = extractTabArray(src, start, end, tabKey);
        if (tabSrc) {
          const items = parseTabItems(tabSrc, tabKey);
          if (items.length > 0) {
            // Enrich pdf items with disk + index info
            tabs[tabKey] = items.map(item => {
              const base = item.filename;
              const extra = tabKey === "pdfs"
                ? { size: onDisk.get(base)?.size ?? null, mtime: onDisk.get(base)?.mtime ?? null, indexed: indexed.has(base) }
                : {};
              return { ...item, ...extra };
            });
          }
        }
      }

      if (Object.keys(tabs).length > 0) {
        courses.push({ id, label, tabs });
      }
    }

    // 4. Orphan PDFs — on disk but not in any course's pdfs tab
    const registeredPdfs = new Set(
      courses.flatMap(c => (c.tabs.pdfs || []).map(f => f.filename))
    );
    const orphans = [];
    for (const [file, stat] of onDisk) {
      if (!registeredPdfs.has(file)) {
        orphans.push({
          filename: file,
          courseId: detectCourse(file) ?? "unknown",
          size: stat.size,
          mtime: stat.mtimeMs,
          indexed: indexed.has(file),
        });
      }
    }

    // 5. Unindexed — registered PDFs not in pdf-index.json
    const unindexed = courses
      .flatMap(c => (c.tabs.pdfs || []).map(f => ({ ...f, courseId: c.id })))
      .filter(f => !f.indexed);

    // Legacy registered flat list (still used by modal header count)
    const registered = courses.flatMap(c =>
      Object.values(c.tabs).flat().map(f => ({ ...f, courseId: c.id }))
    );

    res.json({ courses, registered, orphans, unindexed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/index-file — run reindex and wait for completion ───────────────
app.post("/index-file", express.json(), (req, res) => {
  const script = path.join(ROOT, "scripts", "index-pdfs.js");

  // Try pnpm first, fall back to node directly.
  // We pass --force via env var since argv isn't available in all spawn modes.
  const env = { ...process.env, FORCE_REINDEX: "1" };

  // Use node with the project root as cwd so package.json "type":"module" is respected
  const child = spawn(process.execPath, [script, "--force"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", d => { stdout += d.toString(); });
  child.stderr?.on("data", d => { stderr += d.toString(); });

  child.on("close", code => {
    if (code === 0) {
      res.json({ ok: true, message: "Reindex complete — PDFs are now searchable" });
    } else {
      console.error("index-pdfs failed:\n", stderr);
      res.status(500).json({ error: `Reindex failed (exit ${code})`, detail: stderr.slice(0, 400) });
    }
  });

  child.on("error", err => {
    res.status(500).json({ error: err.message });
  });
});

// ── List journal entries ──────────────────────────────────────────
app.get("/list-entries", async (req, res) => {
  const dir = path.join(ROOT, "src", "content", "talk2me", "entries");
  try {
    await fs.promises.mkdir(dir, { recursive: true });
    const files = await fs.promises.readdir(dir);
    const entries = await Promise.all(
      files
        .filter(f => f.endsWith(".md") || f.endsWith(".txt"))
        .map(async f => {
          const stat = await fs.promises.stat(path.join(dir, f));
          return { filename: f, size: stat.size, mtime: stat.mtimeMs, birthtime: stat.birthtimeMs };
        })
    );
    entries.sort((a, b) => b.mtime - a.mtime);
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete journal entry ──────────────────────────────────────────
app.delete("/delete-entry", express.json(), async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "filename required" });
  const safe = path.basename(filename);
  const dir  = path.join(ROOT, "src", "content", "talk2me", "entries");
  try {
    await fs.promises.unlink(path.join(dir, safe));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Read journal entry ────────────────────────────────────────────
app.get("/read-entry", async (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: "filename required" });
  const safe = path.basename(filename);
  const dir  = path.join(ROOT, "src", "content", "talk2me", "entries");
  try {
    const content = await fs.promises.readFile(path.join(dir, safe), "utf8");
    res.json({ ok: true, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Save journal entry ────────────────────────────────────────────
app.post("/save-entry", express.json(), async (req, res) => {
  const { filename, content, courseId } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: "filename and content are required" });
  }

  // Sanitize filename — no path traversal
  const safe = path.basename(filename).replace(/[^a-z0-9_\-\.]/gi, "_");

  // Destination: entries folder for journal, or course notes folder
  const dest = courseId
    ? path.join(ROOT, "src", "content", "subjects", courseId)
    : path.join(ROOT, "src", "content", "talk2me", "entries");

  try {
    await fs.promises.mkdir(dest, { recursive: true });
    await fs.promises.writeFile(path.join(dest, safe), content, "utf8");
    res.json({ ok: true, filename: safe, path: dest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { app };