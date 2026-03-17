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

function extToTab(e, filename = "") {
  if (e === ".pdf") return "pdfs";
  if (e === ".html") {
    const isAssignment = /hw\d|quiz|exam|practice|review|solution/i.test(filename);
    return isAssignment ? "assignments" : "notes";
  }
  if (e === ".md" || e === ".txt") return "notes";
  if ([".cpp", ".py", ".c", ".h", ".js", ".ts"].includes(e)) return "code";
  return null;
}

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

function FileRow({ item, idx, groupLabel, onGroupLabel, showGroupInput, suggestions, onRename, tabOverride, onTabOverride }) {
  const e    = ext(item.filename);
  const icon = EXT_ICON[e] || "◌";
  const dim  = item.status === "skip" || item.status === "duplicate";
  const canGroup  = showGroupInput && (item.status === "ok" || item.status === "conflict");
  const canRename = showGroupInput && !dim;
  const showTabPicker = canGroup && e === ".html";
  const [focused,   setFocused]   = useState(false);
  const [renaming,  setRenaming]  = useState(false);
  const [draftName, setDraftName] = useState(item.filename);

  const filtered = suggestions?.length && focused
    ? suggestions.filter(s => !groupLabel || s.toLowerCase().includes(groupLabel.toLowerCase()))
    : [];

  function submitRename() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== item.filename) onRename?.(item.filename, trimmed);
    setRenaming(false);
  }

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "20px 1fr auto auto",
      gap: "0 14px", alignItems: "start", padding: "9px 16px",
      background: idx % 2 === 0 ? "#111318" : "transparent",
      borderRadius: 6, opacity: dim ? 0.45 : 1,
    }}>
      <span style={{ color: "#3e4452", fontSize: 13, fontFamily: "'Courier New', monospace", paddingTop: 2 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        {/* Filename — shows renamed target if applicable */}
        <div style={{ color: dim ? "#4a5060" : "#d4d8e0", fontSize: 12, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.filename}
          {item._renamedFrom && (
            <span style={{ color: "#3e4452", fontSize: 10, marginLeft: 6 }}>← {item._renamedFrom}</span>
          )}
        </div>

        {(item.reason && item.status !== "ok") && (
          <div style={{ color: "#4a5060", fontSize: 10, marginTop: 2, lineHeight: 1.4 }}>{item.reason}</div>
        )}
        {item.courseId && (
          <div style={{ color: "#3e4452", fontSize: 10, marginTop: 1, fontFamily: "'Courier New', monospace" }}>
            → {item.courseId}
          </div>
        )}

        {/* Rename row */}
        {canRename && (
          <div style={{ marginTop: 5 }}>
            {renaming ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter")  submitRename();
                    if (e.key === "Escape") { setRenaming(false); setDraftName(item.filename); }
                  }}
                  style={{
                    flex: 1, background: "#0d0f14",
                    border: "1px solid #e8c547", borderRadius: 5,
                    color: "#e8c547", fontSize: 10,
                    fontFamily: "'Courier New', monospace",
                    padding: "3px 8px", outline: "none",
                  }}
                />
                <button onMouseDown={submitRename}
                  style={{ background: "none", border: "none", color: "#e8c547", cursor: "pointer", fontSize: 10, fontFamily: "'Courier New', monospace", padding: "2px 6px" }}>
                  OK
                </button>
                <button onMouseDown={() => { setRenaming(false); setDraftName(item.filename); }}
                  style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 12 }}>
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setRenaming(true)}
                style={{
                  background: "none", border: "1px solid #2a2e38", borderRadius: 4,
                  color: "#4a5060", cursor: "pointer", fontSize: 10,
                  fontFamily: "'Courier New', monospace", padding: "2px 8px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.color = "#e8c547"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#4a5060"; }}
              >
                ✎ rename
              </button>
            )}
          </div>
        )}

        {/* Tab picker for .html files */}
        {showTabPicker && (
          <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
            {["notes", "assignments", "references"].map(t => (
              <button
                key={t}
                onClick={() => onTabOverride?.(item.filename, t)}
                style={{
                  padding: "2px 8px", borderRadius: 4, border: "1px solid",
                  fontSize: 9, fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.5px", textTransform: "uppercase", cursor: "pointer",
                  background: tabOverride === t ? "#e8c54722" : "transparent",
                  borderColor: tabOverride === t ? "#e8c547" : "#2a2e38",
                  color: tabOverride === t ? "#e8c547" : "#4a5060",
                  transition: "all 0.1s",
                }}
              >{t}</button>
            ))}
          </div>
        )}

        {/* Subsection group input */}
        {canGroup && (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={groupLabel || ""}
              onChange={e => onGroupLabel(item.filename, e.target.value)}
              placeholder="subsection (optional)"
              style={{
                marginTop: 5, width: "100%", boxSizing: "border-box",
                background: "#0d0f14", border: "1px solid #2a2e38", borderRadius: 5,
                color: groupLabel ? "#e8c547" : "#7a8090",
                fontSize: 10, fontFamily: "'Courier New', monospace",
                padding: "3px 8px", outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#e8c547"; setFocused(true); }}
              onBlur={e => { e.target.style.borderColor = "#2a2e38"; setFocused(false); }}
            />
            {filtered.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
                background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 5,
                marginTop: 2, overflow: "hidden",
              }}>
                {filtered.map(s => (
                  <button
                    key={s}
                    onMouseDown={e => { e.preventDefault(); onGroupLabel(item.filename, s); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "5px 8px", background: "none", border: "none",
                      color: "#e8c547", fontSize: 10, fontFamily: "'Courier New', monospace",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#21252e"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    ↳ {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <span style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", paddingTop: 2 }}>{fmt(item.size)}</span>
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

export default function DropZone({ open, onOpen, onClose, onDone }) {
  const [phase, setPhase]              = useState("idle");
  const [dragOver, setDragOver]        = useState(false);
  const [results, setResults]          = useState(null);
  const [summary, setSummary]          = useState(null);
  const [needsReindex, setNeeds]       = useState(false);
  const [errorMsg, setErrorMsg]        = useState("");
  const [zipName, setZipName]          = useState("");
  const [groupLabels, setGroupLabels]           = useState({});
  const [groupSuggestions, setGroupSuggestions] = useState({});
  const [tabOverrides, setTabOverrides]         = useState({}); // filename → tab override for .html
  const [renames, setRenames]                   = useState({}); // originalName → newName
  const [orphans, setOrphans]                   = useState([]);
  const fileRef     = useRef(null);
  const pendingFile = useRef(null);

  // Fetch orphaned (on-disk but unregistered) files on open
  useEffect(() => {
    fetch("/api/orphans").then(r => r.json()).then(d => {
      if (d.orphans?.length) setOrphans(d.orphans);
    }).catch(() => {});
  }, []);

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
    setGroupLabels({});
    setGroupSuggestions({});
    setRenames({});
    pendingFile.current = null;
  }, []);

  function handleRename(originalName, newName) {
    setRenames(prev => ({ ...prev, [originalName]: newName }));
    // Show new name in the row with a breadcrumb, but keep original status/courseId
    // — the real validation happens when APPLY sends the file under the new name.
    setResults(prev => prev.map(r =>
      r.filename !== originalName ? r
        : { ...r, filename: newName, _renamedFrom: r._renamedFrom || originalName }
    ));
    setGroupLabels(prev => {
      if (!prev[originalName]) return prev;
      const next = { ...prev };
      next[newName] = next[originalName];
      delete next[originalName];
      return next;
    });
  }

  async function handleFiles(fileList) {
    if (!fileList?.length) return;
    const files = [...fileList];

    // If a single zip, use the existing zip flow
    const isZip = files.length === 1 && files[0].name.endsWith(".zip");

    pendingFile.current = files;
    setZipName(files.length === 1 ? files[0].name : `${files.length} files`);
    setPhase("scanning");
    setDragOver(false);
    setErrorMsg("");

    try {
      let data;
      if (isZip) {
        const form = new FormData();
        form.append("zip", files[0]);
        const res = await fetch("/api/scan", { method: "POST", body: form });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Scan failed");
      } else {
        const form = new FormData();
        files.forEach(f => form.append("files", f));
        const res = await fetch("/api/scan-files", { method: "POST", body: form });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Scan failed");
      }
      setResults(data.results.filter(r => r.status !== "skip"));
      setSummary(data.summary);
      setPhase("scanned");

      // Fetch existing group names for each unique courseId+tab combo
      const combos = new Set();
      data.results.forEach(r => {
        if (r.courseId && r.ext) {
          const tab = extToTab(r.ext, r.filename);
          if (tab) combos.add(`${r.courseId}:${tab}`);
        }
      });
      combos.forEach(async key => {
        const [courseId, tab] = key.split(":");
        try {
          const res2 = await fetch(`/api/groups?courseId=${courseId}&tab=${tab}`);
          const d    = await res2.json();
          if (d.groups?.length) setGroupSuggestions(prev => ({ ...prev, [key]: d.groups }));
        } catch (err) { void err; }
      });
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  }

  async function handleApply() {
    if (!pendingFile.current?.length) return;
    const files = pendingFile.current;
    const isZip = files.length === 1 && files[0].name.endsWith(".zip");
    setPhase("applying");
    try {
      let data;
      if (isZip) {
        const form = new FormData();
        form.append("zip", files[0]);
        form.append("groupLabels", JSON.stringify(groupLabels));
        form.append("tabOverrides", JSON.stringify(tabOverrides));
        form.append("renames", JSON.stringify(renames));
        const res = await fetch("/api/upload", { method: "POST", body: form });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
      } else {
        const form = new FormData();
        files.forEach(f => form.append("files", f));
        form.append("groupLabels", JSON.stringify(groupLabels));
        form.append("tabOverrides", JSON.stringify(tabOverrides));
        form.append("renames", JSON.stringify(renames));
        const res = await fetch("/api/upload-files", { method: "POST", body: form });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
      }
      setResults(data.results.filter(r => r.status !== "skip"));
      setSummary(data.summary);
      setNeeds(data.needsReindex);
      setPhase("done");
      onDone?.();  // reload subjects.json so new files appear immediately
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files?.length) handleFiles(files);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  // eslint-disable-next-line no-unused-vars
  const canApply = phase === "scanned" && summary && (summary.added + summary.conflicts) > 0;

  // Recompute summary live from current results so renames that flip REJECTED→ok are reflected
  const liveSummary = results ? {
    total:      results.length,
    added:      results.filter(r => r.status === "ok").length,
    conflicts:  results.filter(r => r.status === "conflict").length,
    duplicates: results.filter(r => r.status === "duplicate").length,
    rejected:   results.filter(r => r.status === "rejected" && !renames[r._renamedFrom || r.filename] && !renames[r.filename]).length,
  } : summary;
  const liveApplyCount = results
    ? results.filter(r => r.status === "ok" || r.status === "conflict" || (r.status === "rejected" && (renames[r._renamedFrom || r.filename] || renames[r.filename]))).length
    : 0;
  const liveCanApply = phase === "scanned" && liveApplyCount > 0;

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
              {phase === "idle" || phase === "scanning" ? "Drop files to add them"
               : phase === "scanned"  ? `Ready to apply — ${zipName}`
               : phase === "applying" ? "Writing files…"
               : phase === "done"     ? `Done — ${zipName}`
               : "Error"}
            </div>
            <div style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", marginTop: 2 }}>
              {phase === "idle"    ? "zip, pdf, md, cpp, py… — filename must contain a course ID"
               : phase === "scanned" && liveSummary ? `${liveSummary.total} files scanned`
               : phase === "done"    && liveSummary ? `${liveSummary.added + liveSummary.conflicts} written, ${liveSummary.rejected} rejected`
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
              {dragOver ? "Release to scan" : "Drag & drop files here"}
            </div>
            <div style={{ color: "#3e4452", fontSize: 11 }}>or click to browse — zip, pdf, md, cpp, py, c…</div>
            <input ref={fileRef} type="file" accept=".zip,.pdf,.md,.txt,.html,.cpp,.py,.c,.h,.js,.ts" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          </div>
        )}

        {/* Hidden files — on disk but not registered */}
        {phase === "idle" && orphans.length > 0 && (
          <div style={{ margin: "0 20px 20px", border: "1px solid #2a2e38", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "8px 16px", background: "#111318", borderBottom: "1px solid #2a2e38", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#7a8090", fontSize: 10, fontFamily: "'Courier New', monospace", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                ◌ hidden — {orphans.length} file{orphans.length !== 1 ? "s" : ""} on disk, not registered
              </span>
            </div>
            {orphans.map((o, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                gap: "0 12px", alignItems: "center", padding: "8px 16px",
                background: i % 2 === 0 ? "#111318" : "transparent",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#7a8090", fontSize: 12, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {o.filename}
                  </div>
                  <div style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", marginTop: 1 }}>
                    → {o.courseId} · {fmt(o.size)}
                  </div>
                </div>
                <span style={{ color: "#4a5060", fontSize: 10, fontFamily: "'Courier New', monospace", whiteSpace: "nowrap" }}>not registered</span>
                <button
                  onClick={async () => {
                    try {
                      // Fetch the file from disk via a blob fetch trick isn't possible server-side,
                      // so we use a dedicated register endpoint
                      const res = await fetch("/api/register-orphan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ filename: o.filename, courseId: o.courseId }),
                      });
                      if (res.ok) setOrphans(prev => prev.filter(x => x.filename !== o.filename));
                    } catch (err) { void err; }
                  }}
                  style={{
                    fontFamily: "'Courier New', monospace", fontSize: 10, padding: "4px 12px",
                    borderRadius: 5, background: "none", border: "1px solid #2a2e38",
                    color: "#e8c547", cursor: "pointer", letterSpacing: "1px", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#e8c547"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2e38"}
                >
                  REGISTER
                </button>
              </div>
            ))}
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
            {results.map((r, i) => (
              <FileRow
                key={i} item={r} idx={i}
                showGroupInput={phase === "scanned"}
                groupLabel={groupLabels[r.filename] || ""}
                onGroupLabel={(filename, val) => setGroupLabels(prev => ({ ...prev, [filename]: val }))}
                suggestions={r.courseId && r.ext ? (groupSuggestions[`${r.courseId}:${extToTab(r.ext, r.filename)}`] || []) : []}
                onRename={handleRename}
                tabOverride={tabOverrides[r.filename] || extToTab(r.ext, r.filename)}
                onTabOverride={(filename, val) => setTabOverrides(prev => ({ ...prev, [filename]: val }))}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div style={{ margin: 20, padding: "16px 20px", background: "#e8545411", border: "1px solid #e8545433", borderRadius: 10, color: "#e85454", fontFamily: "'Courier New', monospace", fontSize: 12 }}>
            {errorMsg}
          </div>
        )}

        {/* Summary bar */}
        {(phase === "scanned" || phase === "done") && liveSummary && (
          <SummaryBar summary={liveSummary} needsReindex={needsReindex} />
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
                onClick={liveCanApply ? handleApply : undefined}
                disabled={!liveCanApply}
                style={{ fontFamily: "'Courier New', monospace", fontSize: 11, padding: "7px 22px", borderRadius: 7, letterSpacing: "1px", background: liveCanApply ? "#e8c547" : "#2a2e38", border: "none", color: liveCanApply ? "#111318" : "#4a5060", cursor: liveCanApply ? "pointer" : "not-allowed", fontWeight: 700 }}
              >
                APPLY {liveCanApply ? `(${liveApplyCount})` : ""}
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