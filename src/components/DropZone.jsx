// src/components/DropZone.jsx
import { useState, useEffect, useRef, useCallback } from "react";

const STATUS = {
  ok:        { label: "READY",     color: "#34d399", bg: "#34d39911" },
  conflict:  { label: "OVERWRITE", color: "#e8c547", bg: "#e8c54711" },
  duplicate: { label: "DUPLICATE", color: "#4a5060", bg: "#4a506011" },
  rejected:  { label: "REJECTED",  color: "#e85454", bg: "#e8545411" },
  skip:      { label: "SKIP",      color: "#2a2e38", bg: "transparent" },
};

const EXT_ICON = {
  ".pdf": "⎘", ".md": "≡", ".txt": "≡",
  ".cpp": "⌥", ".py": "⌥", ".c": "⌥",
  ".h": "⌥", ".js": "⌥", ".ts": "⌥",
};

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}kb`;
  return `${(bytes / 1024 / 1024).toFixed(1)}mb`;
}

function ext(filename) {
  return filename.slice(filename.lastIndexOf(".")).toLowerCase();
}

function Badge({ status }) {
  const cfg = STATUS[status] || STATUS.rejected;
  return (
    <span style={{
      fontSize: 9, letterSpacing: "1.5px", fontFamily: "'Courier New', monospace",
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}44`,
      borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function FileRow({ item, idx }) {
  const e = ext(item.filename);
  const icon = EXT_ICON[e] || "◌";
  const dim = item.status === "skip" || item.status === "duplicate";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "20px 1fr auto auto",
      gap: "0 14px", alignItems: "center", padding: "9px 16px",
      background: idx % 2 === 0 ? "#111318" : "transparent",
      borderRadius: 6, opacity: dim ? 0.45 : 1,
    }}>
      <span style={{ color: "#3e4452", fontSize: 13, fontFamily: "'Courier New', monospace" }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: dim ? "#4a5060" : "#d4d8e0", fontSize: 12, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.filename}
        </div>
        {(item.reason && item.status !== "ok") && (
          <div style={{ color: "#4a5060", fontSize: 10, marginTop: 2, lineHeight: 1.4 }}>{item.reason}</div>
        )}
        {item.courseId && (
          <div style={{ color: "#3e4452", fontSize: 10, marginTop: 1, fontFamily: "'Courier New', monospace" }}>
            → {item.courseId}
          </div>
        )}
      </div>
      <span style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap" }}>{fmt(item.size)}</span>
      <Badge status={item.status} />
    </div>
  );
}

function SummaryBar({ summary, needsReindex }) {
  const chips = [
    { label: "added",     val: summary.added,     color: "#34d399" },
    { label: "overwrite", val: summary.conflicts,  color: "#e8c547" },
    { label: "duplicate", val: summary.duplicates, color: "#4a5060" },
    { label: "rejected",  val: summary.rejected,   color: "#e85454" },
  ].filter(c => c.val > 0);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: "10px 16px", background: "#111318", borderTop: "1px solid #2a2e38" }}>
      {chips.map(c => (
        <span key={c.label} style={{ fontSize: 11, fontFamily: "'Courier New', monospace", color: c.color, background: `${c.color}11`, border: `1px solid ${c.color}33`, borderRadius: 4, padding: "3px 10px" }}>
          {c.val} {c.label}
        </span>
      ))}
      {needsReindex && (
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#e8c547", fontFamily: "'Courier New', monospace", background: "#e8c54711", border: "1px solid #e8c54733", borderRadius: 4, padding: "3px 10px" }}>
          ⚠ PDFs added — run pnpm dev to re-index
        </span>
      )}
    </div>
  );
}

export default function DropZone({ open, onOpen, onClose }) {
  const [phase, setPhase]        = useState("idle");
  const [dragOver, setDragOver]  = useState(false);
  const [results, setResults]    = useState(null);
  const [summary, setSummary]    = useState(null);
  const [needsReindex, setNeeds] = useState(false);
  const [errorMsg, setErrorMsg]  = useState("");
  const [zipName, setZipName]    = useState("");
  const fileRef     = useRef(null);
  const pendingFile = useRef(null);

  useEffect(() => {
    function onDragEnter(e) {
      const hasFiles = [...(e.dataTransfer?.items || [])].some(i => i.kind === "file");
      if (hasFiles) { setDragOver(true); onOpen?.(); }
    }
    function onDragLeave(e) {
      if (e.relatedTarget === null) setDragOver(false);
    }
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
    };
  }, [onOpen]);

  const reset = useCallback(() => {
    setPhase("idle"); setDragOver(false); setResults(null);
    setSummary(null); setNeeds(false); setErrorMsg(""); setZipName("");
    pendingFile.current = null;
  }, []);

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      setErrorMsg("Only .zip files are accepted.");
      setPhase("error");
      return;
    }
    pendingFile.current = file;
    setZipName(file.name);
    setPhase("scanning");
    setDragOver(false);
    setErrorMsg("");
    try {
      const form = new FormData();
      form.append("zip", file);
      const res  = await fetch("/api/scan", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResults(data.results.filter(r => r.status !== "skip"));
      setSummary(data.summary);
      setPhase("scanned");
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  }

  async function handleApply() {
    if (!pendingFile.current) return;
    setPhase("applying");
    try {
      const form = new FormData();
      form.append("zip", pendingFile.current);
      const res  = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setResults(data.results.filter(r => r.status !== "skip"));
      setSummary(data.summary);
      setNeeds(data.needsReindex);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  const canApply = phase === "scanned" && summary && (summary.added + summary.conflicts) > 0;

  if (!open && !dragOver) return null;

  return (
    <div
      onClick={() => { if (phase === "idle") { reset(); onClose?.(); } }}
      style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(6,6,6,0.82)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragOver(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 640, maxWidth: "calc(100vw - 40px)", background: "#1a1d24", border: `1px solid ${dragOver ? "#e8c547" : "#2a2e38"}`, borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.5)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 14px", borderBottom: "1px solid #2a2e38" }}>
          <span style={{ fontFamily: "'Courier New', monospace", color: "#e8c547", fontSize: 14 }}>⊕</span>
          <div>
            <div style={{ color: "#d4d8e0", fontSize: 13, fontWeight: 600 }}>
              {phase === "idle" || phase === "scanning" ? "Drop a zip to add files"
               : phase === "scanned"  ? `Ready to apply — ${zipName}`
               : phase === "applying" ? "Writing files…"
               : phase === "done"     ? `Done — ${zipName}`
               : "Error"}
            </div>
            <div style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", marginTop: 2 }}>
              {phase === "idle"    ? "PDFs, .md, .cpp, .py, .c — must contain a course ID"
               : phase === "scanned" && summary ? `${summary.total} files scanned`
               : phase === "done"    && summary ? `${summary.added + summary.conflicts} written, ${summary.rejected} rejected`
               : ""}
            </div>
          </div>
          <button
            onClick={() => { reset(); onClose?.(); }}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#3e4452", cursor: "pointer", fontSize: 16, padding: "4px 8px", borderRadius: 6 }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#3e4452"}
          >✕</button>
        </div>

        {/* Idle drop area */}
        {phase === "idle" && (
          <div
            onClick={() => fileRef.current?.click()}
            style={{ margin: 20, border: `2px dashed ${dragOver ? "#e8c547" : "#2a2e38"}`, borderRadius: 12, padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", background: dragOver ? "#e8c54708" : "transparent" }}
          >
            <span style={{ fontSize: 40, opacity: dragOver ? 1 : 0.4, filter: dragOver ? "drop-shadow(0 0 12px #e8c547)" : "none" }}>⎘</span>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: dragOver ? "#e8c547" : "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>
              {dragOver ? "Release to scan" : "Drag & drop .zip here"}
            </div>
            <div style={{ color: "#3e4452", fontSize: 11 }}>or click to browse</div>
            <input ref={fileRef} type="file" accept=".zip" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} />
          </div>
        )}

        {/* Scanning */}
        {phase === "scanning" && (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#4a5060", letterSpacing: "2px", animation: "pulse 1.2s ease-in-out infinite" }}>SCANNING…</div>
          </div>
        )}

        {/* Applying */}
        {phase === "applying" && (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#e8c547", letterSpacing: "2px", animation: "pulse 1.2s ease-in-out infinite" }}>WRITING FILES…</div>
          </div>
        )}

        {/* Results */}
        {(phase === "scanned" || phase === "done") && results && (
          <div style={{ maxHeight: 340, overflowY: "auto", padding: "8px 4px" }}>
            {results.map((r, i) => <FileRow key={i} item={r} idx={i} />)}
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div style={{ margin: 20, padding: "16px 20px", background: "#e8545411", border: "1px solid #e8545433", borderRadius: 10, color: "#e85454", fontFamily: "'Courier New', monospace", fontSize: 12 }}>
            {errorMsg}
          </div>
        )}

        {/* Summary bar */}
        {(phase === "scanned" || phase === "done") && summary && (
          <SummaryBar summary={summary} needsReindex={needsReindex} />
        )}

        {/* Actions */}
        {(phase === "scanned" || phase === "done" || phase === "error") && (
          <div style={{ display: "flex", gap: 10, padding: "14px 16px", justifyContent: "flex-end", borderTop: phase === "scanned" ? "1px solid #2a2e38" : "none" }}>
            <button
              onClick={() => { reset(); onClose?.(); }}
              style={{ fontFamily: "'Courier New', monospace", fontSize: 11, padding: "7px 18px", borderRadius: 7, background: "none", border: "1px solid #2a2e38", color: "#7a8090", cursor: "pointer", letterSpacing: "1px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#7a8090"; e.currentTarget.style.color = "#d4d8e0"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#7a8090"; }}
            >
              {phase === "done" ? "CLOSE" : "CANCEL"}
            </button>
            {phase === "scanned" && (
              <button
                onClick={handleApply}
                disabled={!canApply}
                style={{ fontFamily: "'Courier New', monospace", fontSize: 11, padding: "7px 22px", borderRadius: 7, letterSpacing: "1px", background: canApply ? "#e8c547" : "#2a2e38", border: "none", color: canApply ? "#111318" : "#4a5060", cursor: canApply ? "pointer" : "not-allowed", fontWeight: 700 }}
              >
                APPLY {canApply ? `(${summary.added + summary.conflicts})` : ""}
              </button>
            )}
            {phase === "error" && (
              <button
                onClick={reset}
                style={{ fontFamily: "'Courier New', monospace", fontSize: 11, padding: "7px 22px", borderRadius: 7, background: "#e8c547", border: "none", color: "#111318", cursor: "pointer", fontWeight: 700 }}
              >
                TRY AGAIN
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
