// server/upload.js
// Run alongside Vite via vite.config.js plugin
/* eslint-env node */
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

const ROUTES = {
  ".pdf": ()         => path.join(ROOT, "public", "pdfs"),
  ".md":   (courseId) => path.join(ROOT, "src", "content", "subjects", courseId),
  ".txt":  (courseId) => path.join(ROOT, "src", "content", "subjects", courseId),
  ".html": (courseId, filename = "") => {
    const base = path.basename(filename).toLowerCase();
    const isAssignment = /hw\d|quiz|exam|practice|review|solution/i.test(base);
    return isAssignment
      ? path.join(ROOT, "src", "content", "assignments")
      : path.join(ROOT, "src", "content", "subjects", courseId);
  },
  ".cpp": (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".py":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".c":   (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".h":   (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".js":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
  ".ts":  (courseId) => path.join(ROOT, "src", "content", "code", courseId),
};

const ALLOWED_EXTS = new Set(Object.keys(ROUTES));

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function detectCourse(filename) {
  const lower = filename.toLowerCase();
  const direct = COURSE_IDS.find(id => lower.includes(id));
  if (direct) return direct;
  for (const [code, courseId] of Object.entries(COURSE_CODE_ALIASES)) {
    if (lower.includes(code)) return courseId;
  }
  return null;
}

function existingHash(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return sha256(fs.readFileSync(filepath));
}

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
  const destDir      = ROUTES[ext](courseId, base);
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

const SUBJECTS_JSON_PATH = path.resolve(ROOT, "src", "data", "subjects.json");

// ── JSON helpers ─────────────────────────────────────────────────────────────

function readSubjects() {
  return JSON.parse(fs.readFileSync(SUBJECTS_JSON_PATH, "utf8"));
}

function writeSubjects(json) {
  fs.writeFileSync(SUBJECTS_JSON_PATH, JSON.stringify(json, null, 2), "utf8");
}

// Returns every course object that matches courseId (may appear in DEPARTMENTS and ALL_COURSES)
function findCourses(json, courseId) {
  const found = [];
  for (const dept of (json.DEPARTMENTS || [])) {
    for (const c of (dept.courses || [])) {
      if (c.id === courseId) found.push(c);
    }
  }
  for (const c of (json.ALL_COURSES || [])) {
    if (c.id === courseId) found.push(c);
  }
  return found;
}

function tabForExt(ext, filename = "") {
  if (ext === ".pdf") return "pdfs";
  if (ext === ".html") {
    const isAssignment = /hw\d|quiz|exam|practice|review|solution/i.test(filename);
    return isAssignment ? "assignments" : "notes";
  }
  if (ext === ".md" || ext === ".txt") return "notes";
  if ([".cpp", ".py", ".c", ".h", ".js", ".ts"].includes(ext)) return "code";
  return null;
}

function makeEntryObj(base, courseId, tab) {
  const label = base.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  if (tab === "pdfs")        return { file: base, label };
  if (tab === "notes")       return { file: `./content/subjects/${courseId}/${base}`, label };
  if (tab === "assignments") return { file: `./content/assignments/${base}`, label, type: "content" };
  if (tab === "code")        return { file: `./content/code/${courseId}/${base}`, label };
  return null;
}

function patchSubjects(base, courseId, tab, group = "") {
  const entry = makeEntryObj(base, courseId, tab);
  if (!entry) return;

  const json = readSubjects();
  const courses = findCourses(json, courseId);
  if (!courses.length) return;

  for (const course of courses) {
    if (!Array.isArray(course[tab])) course[tab] = [];
    const tabArr = course[tab];

    // Already registered?
    const alreadyFlat = tabArr.some(i => (i.file || i.path) === (entry.file || entry.path));
    const alreadyChild = tabArr.some(i => i.type === "group" && (i.children || []).some(ch => (ch.file || ch.path) === (entry.file || entry.path)));
    if (alreadyFlat || alreadyChild) continue;

    if (group && group.trim()) {
      const g = tabArr.find(i => i.type === "group" && i.label === group.trim());
      if (g) {
        g.children = g.children || [];
        g.children.push(entry);
      } else {
        tabArr.push({ type: "group", label: group.trim(), children: [entry] });
      }
    } else {
      tabArr.push(entry);
    }
  }

  writeSubjects(json);
  console.log(`  ✓ subjects.json patched: ${courseId}.${tab}${group ? `["${group}"]` : ""} <- ${base}`);
}

function applyResult(result, buffer, ext, base, groupLabels, tabOverrides = {}) {
  const tabOverride = tabOverrides[base];
  if (result.status === "ok" || result.status === "conflict") {
    if (tabOverride && tabOverride !== tabForExt(ext, base)) {
      const newDest = tabOverride === "assignments"
        ? path.join(ROOT, "src", "content", "assignments")
        : tabOverride === "references"
          ? path.join(ROOT, "public", "references")
          : path.join(ROOT, "src", "content", "subjects", result.courseId);
      fs.mkdirSync(newDest, { recursive: true });
      fs.writeFileSync(path.join(newDest, base), buffer);
      patchSubjects(base, result.courseId, tabOverride, groupLabels[base] || "");
      return;
    }
    fs.mkdirSync(path.dirname(result.destPath), { recursive: true });
    fs.writeFileSync(result.destPath, buffer);
    const tab = tabForExt(ext, base);
    if (tab) patchSubjects(base, result.courseId, tab, groupLabels[base] || "");
  } else if (result.status === "duplicate") {
    const tab = tabOverride || tabForExt(ext, base);
    if (tab) patchSubjects(base, result.courseId, tab, groupLabels[base] || "");
  }
}

async function processZip(zipBuffer, zipName = "", apply = false, groupLabels = {}, renames = {}, tabOverrides = {}) {
  const zip     = await JSZip.loadAsync(zipBuffer);
  const results = [];

  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const buffer      = await entry.async("nodebuffer");
    const originalBase = path.basename(name);
    const base        = renames[originalBase] || originalBase;
    const fext        = path.extname(base).toLowerCase();
    const result      = validate(base, buffer, zipName);
    results.push({ filename: base, originalFilename: originalBase, path: name, size: buffer.length, ...result });
    if (apply) applyResult(result, buffer, fext, base, groupLabels, tabOverrides);
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

async function processFiles(files, apply = false, groupLabels = {}, renames = {}, tabOverrides = {}) {
  const results = [];

  for (const file of files) {
    const originalBase = file.originalname;
    const base         = renames[originalBase] || originalBase;
    const fext         = path.extname(base).toLowerCase();
    const buffer       = file.buffer;
    const result       = validate(base, buffer, "");
    results.push({ filename: base, originalFilename: originalBase, path: base, size: buffer.length, ...result });
    if (apply) applyResult(result, buffer, fext, base, groupLabels, tabOverrides);
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

function removeFromIndex(basename) {
  const indexPath = path.join(ROOT, "public", "pdf-index.json");
  if (!fs.existsSync(indexPath)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    const entries = Array.isArray(raw) ? raw : (raw.indexed ?? []);
    const filtered = entries.filter(e => path.basename(e.file || "") !== basename);
    if (filtered.length === entries.length) return;
    const out = Array.isArray(raw) ? filtered : { ...raw, indexed: filtered };
    fs.writeFileSync(indexPath, JSON.stringify(out), "utf8");
    console.log(`  ✓ removed from index: ${basename}`);
  } catch (err) {
    console.warn(`  ⚠ could not update pdf-index.json: ${err.message}`);
  }
}

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

app.use(express.json());

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
    const destDir  = ROUTES[fext](courseId, base);
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
    const groupLabels  = req.body.groupLabels  ? JSON.parse(req.body.groupLabels)  : {};
    const tabOverrides = req.body.tabOverrides ? JSON.parse(req.body.tabOverrides) : {};
    const renames      = req.body.renames      ? JSON.parse(req.body.renames)      : {};
    const data = await processZip(req.file.buffer, req.file.originalname, true, groupLabels, renames, tabOverrides);
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
    const groupLabels  = req.body.groupLabels  ? JSON.parse(req.body.groupLabels)  : {};
    const tabOverrides = req.body.tabOverrides ? JSON.parse(req.body.tabOverrides) : {};
    const renames      = req.body.renames      ? JSON.parse(req.body.renames)      : {};
    const data = await processFiles(req.files, true, groupLabels, renames, tabOverrides);
    if (data.needsReindex) triggerReindex();
    res.json(data);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/groups", (req, res) => {
  const { courseId, tab } = req.query;
  if (!courseId || !tab) return res.status(400).json({ error: "Missing courseId or tab" });
  try {
    const json = readSubjects();
    const courses = findCourses(json, courseId);
    if (!courses.length) return res.json({ groups: [] });
    const tabArr = courses[0][tab] || [];
    const groups = tabArr.filter(i => i.type === "group").map(i => i.label);
    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/reorder", express.json(), (req, res) => {
  const { courseId, tab, items } = req.body;
  if (!courseId || !tab || !Array.isArray(items))
    return res.status(400).json({ error: "Missing courseId, tab, or items" });
  try {
    const json = readSubjects();
    const courses = findCourses(json, courseId);
    if (!courses.length) return res.status(404).json({ error: `Course ${courseId} not found` });

    // Rebuild tab array from incoming items (flat format from frontend)
    function buildTab(incomingItems, currentTab) {
      // Preserve empty groups that aren't in incoming items
      const incomingGroupLabels = new Set(
        incomingItems.flatMap(it => it.group ? [it.group] : it.type === "group" ? [it.label] : [])
      );
      const emptyGroups = (currentTab || []).filter(
        e => e.type === "group" && !(e.children || []).length && !incomingGroupLabels.has(e.label)
      );

      const groupMap = new Map();
      for (const item of incomingItems) {
        if (item.group && !item._emptyGroup && (item.file || item.filePath)) {
          if (!groupMap.has(item.group)) groupMap.set(item.group, []);
          groupMap.get(item.group).push({ file: item.file || item.filePath, label: item.label, ...(item.type && item.type !== "group" ? { type: item.type } : {}) });
        }
      }

      const out = [];
      const emitted = new Set();
      for (const item of incomingItems) {
        if (item.type === "group") {
          if (emitted.has(item.label)) continue;
          emitted.add(item.label);
          const children = groupMap.get(item.label) || item.children || [];
          out.push({ type: "group", label: item.label, children });
        } else if (item._emptyGroup && item.group) {
          if (emitted.has(item.group)) continue;
          emitted.add(item.group);
          out.push({ type: "group", label: item.group, children: [] });
        } else if (item.group) {
          if (emitted.has(item.group)) continue;
          emitted.add(item.group);
          out.push({ type: "group", label: item.group, children: groupMap.get(item.group) || [] });
        } else if (!item._emptyGroup && (item.file || item.filePath)) {
          out.push({ file: item.file || item.filePath, label: item.label, ...(item.type ? { type: item.type } : {}) });
        }
      }
      for (const eg of emptyGroups) {
        if (!emitted.has(eg.label)) out.push({ type: "group", label: eg.label, children: [] });
      }
      return out;
    }

    for (const course of courses) {
      course[tab] = buildTab(items, course[tab]);
    }

    writeSubjects(json);
    console.log(`  ✓ reordered: ${courseId}.${tab} (${items.length} items)`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/add-section", express.json(), (req, res) => {
  const { courseId, tab, label } = req.body;
  if (!courseId || !tab || !label?.trim())
    return res.status(400).json({ error: "Missing courseId, tab, or label" });
  const groupLabel = label.trim();
  try {
    const json = readSubjects();
    const courses = findCourses(json, courseId);
    if (!courses.length) return res.status(404).json({ error: `Course ${courseId} not found` });

    for (const course of courses) {
      if (!Array.isArray(course[tab])) course[tab] = [];
      if (course[tab].some(x => x.type === "group" && x.label === groupLabel))
        return res.status(409).json({ error: `Section "${groupLabel}" already exists` });
      course[tab].push({ type: "group", label: groupLabel, children: [] });
    }

    writeSubjects(json);
    console.log(`  ✓ section added: ${courseId}.${tab} -> "${groupLabel}"`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/file", express.json(), async (req, res) => {
  const { courseId, tab, file } = req.body;
  if (!courseId || !tab || !file) return res.status(400).json({ error: "Missing courseId, tab, or file" });
  try {
    const json = readSubjects();
    const courses = findCourses(json, courseId);
    if (!courses.length) return res.status(404).json({ error: "Course not found" });

    let found = false;
    for (const course of courses) {
      if (!Array.isArray(course[tab])) continue;
      const before = JSON.stringify(course[tab]);
      course[tab] = course[tab].map(item => {
        if (item.type === "group") {
          return { ...item, children: (item.children || []).filter(ch => (ch.file || ch.path) !== file) };
        }
        if ((item.file || item.path) === file) { found = true; return null; }
        return item;
      }).filter(Boolean);
      // also check if file was in a group child
      if (!found && JSON.stringify(course[tab]) !== before) found = true;
    }

    if (!found) return res.status(404).json({ error: "Entry not found in subjects.json" });

    writeSubjects(json);

    // Delete from disk
    const fext     = path.extname(file).toLowerCase();
    const basename = path.basename(file);
    const destDir  = ROUTES[fext] ? ROUTES[fext](courseId, basename) : null;
    const dest     = destDir ? path.join(destDir, basename) : null;
    if (dest && fs.existsSync(dest)) fs.unlinkSync(dest);
    if (fext === ".pdf") removeFromIndex(basename);

    console.log(`  ✓ deleted: ${courseId}.${tab} -> ${file}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/group", express.json(), async (req, res) => {
  const { courseId, tab, label } = req.body;
  if (!courseId || !tab || !label) return res.status(400).json({ error: "Missing courseId, tab, or label" });
  try {
    const json = readSubjects();
    const courses = findCourses(json, courseId);
    if (!courses.length) return res.status(404).json({ error: "Course not found" });

    let found = false;
    for (const course of courses) {
      if (!Array.isArray(course[tab])) continue;
      const group = course[tab].find(i => i.type === "group" && i.label === label);
      if (!group) continue;
      found = true;

      // Delete files on disk that belong to this group
      for (const child of (group.children || [])) {
        const f       = child.file || child.path || "";
        const fext    = path.extname(f).toLowerCase();
        const base    = path.basename(f);
        const destDir = ROUTES[fext] ? ROUTES[fext](courseId, base) : null;
        const dest    = destDir ? path.join(destDir, base) : null;
        if (dest && fs.existsSync(dest)) fs.unlinkSync(dest);
        if (fext === ".pdf") removeFromIndex(base);
      }

      course[tab] = course[tab].filter(i => !(i.type === "group" && i.label === label));
    }

    if (!found) return res.status(404).json({ error: "Group not found" });

    writeSubjects(json);
    console.log(`  ✓ deleted group: ${courseId}.${tab}["${label}"]`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/register-orphan", express.json(), (req, res) => {
  const { filename, courseId } = req.body;
  if (!filename || !courseId) return res.status(400).json({ error: "Missing filename or courseId" });
  try {
    const ext = path.extname(filename).toLowerCase();
    const tab = tabForExt(ext, filename);
    if (!tab) return res.status(400).json({ error: `No tab mapping for extension ${ext}` });
    patchSubjects(filename, courseId, tab, "");
    console.log(`  ✓ registered orphan: ${courseId}.${tab} <- ${filename}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/orphan", express.json(), (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "Missing filename" });
  try {
    const pdfDir = path.join(ROOT, "public", "pdfs");
    const target = path.join(pdfDir, path.basename(filename));
    if (!fs.existsSync(target)) return res.status(404).json({ error: "File not found on disk" });
    fs.unlinkSync(target);
    removeFromIndex(path.basename(filename));
    console.log(`  ✓ deleted orphan: ${filename}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/rename-orphan", express.json(), (req, res) => {
  const { filename, newName } = req.body;
  if (!filename || !newName) return res.status(400).json({ error: "Missing filename or newName" });
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

app.get("/orphans", (req, res) => {
  try {
    const json    = readSubjects();
    const pdfDir  = path.join(ROOT, "public", "pdfs");
    const orphans = [];
    if (!fs.existsSync(pdfDir)) return res.json({ orphans: [] });

    // Collect all registered PDF filenames from subjects.json
    const registered = new Set();
    for (const course of (json.ALL_COURSES || [])) {
      for (const item of (course.pdfs || [])) {
        if (item.type === "group") {
          for (const ch of (item.children || [])) if (ch.file) registered.add(path.basename(ch.file));
        } else if (item.file) {
          registered.add(path.basename(item.file));
        }
      }
    }

    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));
    for (const file of files) {
      if (!registered.has(file)) {
        const courseId = detectCourse(file) ?? "unknown";
        const size     = fs.statSync(path.join(pdfDir, file)).size;
        orphans.push({ filename: file, courseId, size, status: "hidden", reason: "On disk but not registered in subjects.json" });
      }
    }
    res.json({ orphans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/inventory", (req, res) => {
  try {
    const pdfDir    = path.join(ROOT, "public", "pdfs");
    const indexPath = path.join(ROOT, "public", "pdf-index.json");

    const indexed = new Set();
    if (fs.existsSync(indexPath)) {
      try {
        const idx     = JSON.parse(fs.readFileSync(indexPath, "utf8"));
        const entries = Array.isArray(idx) ? idx : (idx.indexed ?? []);
        for (const e of entries) if (e.file) indexed.add(path.basename(e.file));
      } catch {} // eslint-disable-line no-empty
    }

    const onDisk = new Map();
    if (fs.existsSync(pdfDir)) {
      for (const f of fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"))) {
        const stat = fs.statSync(path.join(pdfDir, f));
        onDisk.set(f, { size: stat.size, mtime: stat.mtimeMs });
      }
    }

    const courses = [];
    if (fs.existsSync(SUBJECTS_JSON_PATH)) {
      const sjson = JSON.parse(fs.readFileSync(SUBJECTS_JSON_PATH, "utf8"));
      const TAB_KEYS = ["notes", "references", "gopal", "assignments", "code", "pdfs"];

      for (const course of (sjson.ALL_COURSES || [])) {
        const tabs = {};
        for (const tabKey of TAB_KEYS) {
          const tabItems = course[tabKey];
          if (!Array.isArray(tabItems)) continue;

          const enriched = [];
          for (const item of tabItems) {
            if (item.type === "group") {
              const validChildren = (item.children || []).filter(c => c.file || c.path);
              if (validChildren.length > 0) {
                for (const child of validChildren) {
                  const base = path.basename(child.file || child.path || "");
                  const extra = tabKey === "pdfs"
                    ? { size: onDisk.get(base)?.size ?? null, mtime: onDisk.get(base)?.mtime ?? null, indexed: indexed.has(base) }
                    : {};
                  enriched.push({ filename: base, filePath: child.file || child.path, label: child.label, tab: tabKey, group: item.label, ...(child.type ? { type: child.type } : {}), ...extra });
                }
              } else {
                enriched.push({ filename: null, filePath: null, label: null, tab: tabKey, group: item.label, _emptyGroup: true });
              }
            } else if (item.file || item.path) {
              const base = path.basename(item.file || item.path || "");
              const extra = tabKey === "pdfs"
                ? { size: onDisk.get(base)?.size ?? null, mtime: onDisk.get(base)?.mtime ?? null, indexed: indexed.has(base) }
                : {};
              enriched.push({ filename: base, filePath: item.file || item.path, label: item.label, tab: tabKey, group: null, ...(item.type ? { type: item.type } : {}), ...extra });
            }
          }

          if (enriched.length > 0) tabs[tabKey] = enriched;
        }

        if (Object.keys(tabs).length > 0) {
          courses.push({ id: course.id, label: course.label, tabs });
        }
      }
    }

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

    const unindexed = courses
      .flatMap(c => (c.tabs.pdfs || []).map(f => ({ ...f, courseId: c.id })))
      .filter(f => !f.indexed);

    const registered = courses.flatMap(c =>
      Object.values(c.tabs).flat().map(f => ({ ...f, courseId: c.id }))
    );

    res.json({ courses, registered, orphans, unindexed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/index-file", express.json(), (req, res) => {
  const script = path.join(ROOT, "scripts", "index-pdfs.js");
  const env = { ...process.env, FORCE_REINDEX: "1" };
  const child = spawn(process.execPath, [script, "--force"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });
  let stderr = "";
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

app.post("/save-entry", express.json(), async (req, res) => {
  const { filename, content, courseId } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: "filename and content are required" });
  }
  const safe = path.basename(filename).replace(/[^a-z0-9_\-.]/gi, "_");
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

app.post("/save-data-file", express.json({ limit: "5mb" }), async (req, res) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) return res.status(400).json({ error: "filename and content required" });
  const safe = path.basename(filename);
  try {
    await fs.promises.writeFile(path.join(ROOT, "src", "data", safe), content, "utf8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/load-data-file", async (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: "filename required" });
  const safe = path.basename(filename);
  try {
    const content = await fs.promises.readFile(path.join(ROOT, "src", "data", safe), "utf8");
    res.json({ ok: true, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/load-tickets", async (req, res) => {
  const ticketsPath = path.join(ROOT, "dev-log", "tickets.js");
  if (!fs.existsSync(ticketsPath)) {
    return res.json({ TICKETS: {}, TODO_ITEMS: [] });
  }
  try {
    const mod = await import(`${ticketsPath}?t=${Date.now()}`);
    res.json({ TICKETS: mod.TICKETS || {}, TODO_ITEMS: mod.TODO_ITEMS || [] });
  } catch (err) {
    console.error("  ⚠ load-tickets import error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/save-deadlines", express.json({ limit: "2mb" }), async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });
  try {
    const target = path.join(ROOT, "src", "data", "deadlines.js");
    await fs.promises.writeFile(target, content, "utf8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/save-memory", express.json({ limit: "2mb" }), async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });
  try {
    const target = path.join(ROOT, "src", "data", "memory-deadlines.js");
    await fs.promises.writeFile(target, content, "utf8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/save-progress", express.json({ limit: "2mb" }), async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });
  try {
    const target = path.join(ROOT, "src", "data", "memory-progress.js");
    await fs.promises.writeFile(target, content, "utf8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { app }
;