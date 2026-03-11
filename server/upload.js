// server/upload.js
// Run alongside Vite via vite.config.js plugin
// POST /api/upload  — accepts multipart with a single "zip" field
// POST /api/scan    — dry-run: validate only, no writes

import express    from "express";
import multer     from "multer";
import JSZip      from "jszip";
import fs         from "fs";
import path       from "path";
import crypto     from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");  // project root

// ── Course IDs (keep in sync with src/data/subjects.js) ──────────────────────
const COURSE_IDS = [
  // COSC
  "datastruct", "algos", "automata", "cpp", "comporg", "python",
  // MATH
  "algebra", "precalc", "calc1", "calc2", "discrete", "linear", "stats",
];

// ── File routing rules ────────────────────────────────────────────────────────
const ROUTES = {
  ".pdf": (courseId) => path.join(ROOT, "public", "pdfs"),
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
  return COURSE_IDS.find(id => lower.includes(id)) ?? null;
}

function existingHash(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return sha256(fs.readFileSync(filepath));
}

// ── Validate a single file entry from zip ────────────────────────────────────
function validate(name, buffer, zipName = "") {
  const base = path.basename(name);
  const ext  = path.extname(base).toLowerCase();

  // skip __MACOSX and hidden files
  if (base.startsWith("__") || base.startsWith(".") || name.includes("__MACOSX")) {
    return { status: "skip", reason: "System file" };
  }

  // must be a real file (not directory entry)
  if (name.endsWith("/")) {
    return { status: "skip", reason: "Directory entry" };
  }

  // extension check
  if (!ALLOWED_EXTS.has(ext)) {
    return { status: "rejected", reason: `Unsupported type (${ext || "no extension"})` };
  }

  // course ID: filename first, zip name as fallback
  const courseId = detectCourse(base) ?? detectCourse(zipName);
  if (!courseId) {
    return {
      status: "rejected",
      reason: `No course ID found in filename or zip name. Include one of: ${COURSE_IDS.join(", ")}`,
    };
  }
  const inferredFrom = detectCourse(base) ? "filename" : "zip name";

  // route the file
  const destDir  = ROUTES[ext](courseId);
  const destPath = path.join(destDir, base);
  const incomingHash = sha256(buffer);
  const existHash    = existingHash(destPath);

  if (existHash) {
    if (existHash === incomingHash) {
      return { status: "duplicate", reason: "Exact duplicate already exists", courseId, inferredFrom, destPath, ext };
    } else {
      return { status: "conflict", reason: "Name exists but content differs — will overwrite", courseId, inferredFrom, destPath, ext, hash: incomingHash };
    }
  }

  return { status: "ok", courseId, inferredFrom, destPath, ext, hash: incomingHash };
}

// ── Express app ───────────────────────────────────────────────────────────────

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });

app.use(express.json());

// shared scan + apply logic
async function processZip(zipBuffer, zipName = "", apply = false) {
  const zip     = await JSZip.loadAsync(zipBuffer);
  const results = [];

  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const buffer = await entry.async("nodebuffer");
    const base   = path.basename(name);
    const result = validate(name, buffer, zipName);

    results.push({
      filename: base,
      path:     name,
      size:     buffer.length,
      ...result,
    });

    if (apply && (result.status === "ok" || result.status === "conflict")) {
      fs.mkdirSync(path.dirname(result.destPath), { recursive: true });
      fs.writeFileSync(result.destPath, buffer);
    }
  }

  const summary = {
    total:     results.length,
    added:     results.filter(r => r.status === "ok").length,
    conflicts: results.filter(r => r.status === "conflict").length,
    duplicates:results.filter(r => r.status === "duplicate").length,
    rejected:  results.filter(r => r.status === "rejected").length,
    skipped:   results.filter(r => r.status === "skip").length,
  };

  // if PDFs were added, note that re-index is needed
  const needsReindex = apply && results.some(r =>
    (r.status === "ok" || r.status === "conflict") && r.ext === ".pdf"
  );

  return { results, summary, needsReindex };
}

// POST /api/scan  — validate only, no writes
app.post("/api/scan", upload.single("zip"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No zip provided" });
  try {
    const data = await processZip(req.file.buffer, req.file.originalname, false);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload — validate + write
app.post("/api/upload", upload.single("zip"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No zip provided" });
  try {
    const data = await processZip(req.file.buffer, req.file.originalname, true);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { app };