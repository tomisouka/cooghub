// src/components/FileInventoryModal.jsx
import { useState, useEffect } from "react";

const MONO = "'Courier New', monospace";
const FONT = "'Inter', 'Segoe UI', sans-serif";

const COURSE_IDS = [
  "datastruct", "algos", "automata", "cpp", "comporg", "python",
  "algebra", "precalc", "calc1", "calc2", "discrete", "linear", "stats",
];

function detectCourseClient(filename) {
  const lower = filename.toLowerCase();
  return COURSE_IDS.find(id => lower.includes(id)) ?? null;
}

function fmt(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Pill({ label, color }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: MONO, letterSpacing: "1px",
      color, border: `1px solid ${color}55`,
      borderRadius: 5, padding: "3px 8px",
      background: `${color}15`, whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function ActionBtn({ label, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: MONO, fontSize: 10, padding: "4px 12px",
        borderRadius: 5, background: "none",
        border: `1px solid ${disabled ? "#2a2e38" : color}`,
        color: disabled ? "#4a5060" : color,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.5px", whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${color}18`; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
    >
      {label}
    </button>
  );
}

function IndexCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px", background: "#21252e",
      borderRadius: 8, border: "1px solid #2a2e38",
      marginTop: 8,
    }}>
      <span style={{ color: "#4ecdc4", fontSize: 12, fontFamily: MONO, letterSpacing: "1px" }}>
        indexing
      </span>
      <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 700, color: "#4ecdc4" }}>
        {count}s
      </span>
    </div>
  );
}

function FileRow({ f, odd, onRegister, onIndex, registering, indexing, indexResult, indent, onDelete, onRename, selected, onToggleSelect, atLimit }) {
  const isOrphan        = f._section === "orphan";
  const isUnindexed     = f._section === "unindexed";
  const isOk            = f._section === "registered";
  const isUnknown       = f.courseId === "unknown";
  const isPdfNotIndexed = !isUnindexed && f.indexed === false && f.filename?.endsWith(".pdf");

  const [reassigning, setReassigning] = useState(false);
  const [pickedCourse, setPicked]     = useState("");
  const [renaming, setRenaming]       = useState(false);
  const [newName, setNewName]         = useState(f.filename);
  const [renameErr, setRenameErr]     = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleRenameSubmit() {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === f.filename) { setRenaming(false); return; }
    if (!trimmed.toLowerCase().endsWith(".pdf")) { setRenameErr("Must end in .pdf"); return; }
    setRenameErr("");
    onRename?.(f.filename, trimmed);
    setRenaming(false);
  }

  function handleReassignRegister() {
    if (!pickedCourse) return;
    onRegister?.({ ...f, courseId: pickedCourse });
    setReassigning(false);
  }

  // Clicking the row background selects/deselects — but not if at limit and not selected
  function handleRowClick(e) {
    // Don't select if user clicked a button/input inside the row
    if (e.target.closest("button, input, select, a")) return;
    if (!selected && atLimit) return;
    onToggleSelect?.();
  }

  const selBg = selected
    ? "rgba(232, 84, 84, 0.07)"
    : odd ? "#13161d" : "transparent";

  return (
    <div
      onClick={handleRowClick}
      style={{
        padding: "11px 20px 11px " + (indent ? "36px" : "20px"),
        background: selBg,
        borderBottom: "1px solid #1e2229",
        borderLeft: selected ? "2px solid #e85454" : "2px solid transparent",
        cursor: (!selected && atLimit) ? "default" : "pointer",
        transition: "background 0.1s, border-color 0.1s",
        userSelect: "none",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = odd ? "#181c28" : "#161920"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = selBg; }}
    >
      {/* Main row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 72px 110px auto",
        gap: "0 16px", alignItems: "center",
      }}>
        {/* Filename + course */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: selected ? "#f0a0a0" : isOk ? "#d4d8e0" : "#b0b6c2",
            fontSize: 13, fontFamily: MONO,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {f.filename}
          </div>
          <div style={{ marginTop: 2 }}>
            <span style={{ color: isUnknown ? "#e85454" : "#4a5568", fontSize: 11, fontFamily: FONT }}>
              {isUnknown ? "unknown course" : f.courseId}
            </span>
          </div>
        </div>

        <span style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, whiteSpace: "nowrap" }}>
          {fmt(f.size)}
        </span>
        <span style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, whiteSpace: "nowrap" }}>
          {fmtDate(f.mtime)}
        </span>

        <div style={{ display: "flex", gap: 7, alignItems: "center", justifyContent: "flex-end" }}>
          {isOrphan && !isUnknown && (
            <>
              <Pill label="not registered" color="#e85454" />
              <ActionBtn label="RENAME" color="#7a8090" onClick={() => { setRenaming(r => !r); setConfirmDelete(false); }} />
              <ActionBtn label="DELETE" color="#e85454" onClick={() => { setConfirmDelete(d => !d); setRenaming(false); }} />
              <ActionBtn
                label={registering === f.filename ? "…" : "REGISTER"}
                color="#e8c547"
                onClick={() => onRegister?.(f)}
                disabled={registering === f.filename}
              />
            </>
          )}
          {isOrphan && isUnknown && (
            <>
              <Pill label="unknown" color="#e85454" />
              <ActionBtn
                label="REASSIGN"
                color="#e8c547"
                onClick={() => setReassigning(r => !r)}
                disabled={false}
              />
            </>
          )}
          {isUnindexed && (
            <>
              <Pill label="not indexed" color="#e8c547" />
              <ActionBtn
                label={indexing === f.filename ? "…" : "INDEX"}
                color="#4ecdc4"
                onClick={() => onIndex?.(f)}
                disabled={indexing === f.filename}
              />
            </>
          )}
          {isPdfNotIndexed && (
            <>
              <Pill label="not indexed" color="#e8c54766" />
              <ActionBtn
                label={indexing === f.filename ? "…" : "INDEX"}
                color="#4ecdc488"
                onClick={() => onIndex?.(f)}
                disabled={indexing === f.filename}
              />
            </>
          )}
          {isOk && <Pill label="ok" color="#34d399" />}
        </div>
      </div>

      {/* Index counter + result — shown for both unindexed section and course-tree not-indexed */}
      {(isUnindexed || isPdfNotIndexed) && indexing === f.filename && (
        <IndexCounter />
      )}
      {(isUnindexed || isPdfNotIndexed) && indexResult && indexResult.filename === f.filename && (
        <div style={{
          marginTop: 8, padding: "8px 14px",
          background: indexResult.ok ? "#4ecdc415" : "#e8545415",
          borderRadius: 8,
          border: `1px solid ${indexResult.ok ? "#4ecdc433" : "#e8545433"}`,
          color: indexResult.ok ? "#4ecdc4" : "#e85454",
          fontSize: 12, fontFamily: FONT,
        }}>
          {indexResult.ok ? "✓ " : "✕ "}{indexResult.msg}
        </div>
      )}

      {/* Rename panel */}
      {renaming && (
        <div style={{
          marginTop: 10, padding: "12px 14px",
          background: "#21252e", borderRadius: 8, border: "1px solid #2a2e38",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ color: "#7a8090", fontSize: 12, fontFamily: FONT, flexShrink: 0 }}>Rename to:</span>
          <input
            value={newName}
            onChange={e => { setNewName(e.target.value); setRenameErr(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenaming(false); }}
            style={{
              flex: 1, minWidth: 200,
              background: "#1a1d24", border: `1px solid ${renameErr ? "#e85454" : "#3e4452"}`,
              borderRadius: 6, color: "#d4d8e0",
              fontSize: 12, fontFamily: MONO, padding: "5px 10px", outline: "none",
            }}
            autoFocus
          />
          {renameErr && <span style={{ color: "#e85454", fontSize: 11, fontFamily: FONT }}>{renameErr}</span>}
          <ActionBtn label="RENAME" color="#e8c547" onClick={handleRenameSubmit} />
          <button onClick={() => { setRenaming(false); setNewName(f.filename); setRenameErr(""); }}
            style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 13 }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
          >cancel</button>
        </div>
      )}

      {/* Confirm delete panel */}
      {confirmDelete && (
        <div style={{
          marginTop: 10, padding: "12px 14px",
          background: "#21252e", borderRadius: 8, border: "1px solid #e8545433",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ color: "#e85454", fontSize: 12, fontFamily: FONT, flex: 1 }}>
            Delete <span style={{ fontFamily: MONO }}>{f.filename}</span> from disk? This cannot be undone.
          </span>
          <ActionBtn label="DELETE" color="#e85454" onClick={() => { setConfirmDelete(false); onDelete?.(f.filename); }} />
          <button onClick={() => setConfirmDelete(false)}
            style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 13 }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
          >cancel</button>
        </div>
      )}

      {/* Reassign inline panel */}
      {reassigning && (
        <div style={{
          marginTop: 10, padding: "12px 14px",
          background: "#21252e", borderRadius: 8,
          border: "1px solid #2a2e38",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ color: "#7a8090", fontSize: 12, fontFamily: FONT, flexShrink: 0 }}>
            Assign to course:
          </span>
          <select
            value={pickedCourse}
            onChange={e => setPicked(e.target.value)}
            style={{
              background: "#1a1d24", border: "1px solid #3e4452", borderRadius: 6,
              color: pickedCourse ? "#d4d8e0" : "#4a5060",
              fontSize: 12, fontFamily: MONO, padding: "5px 10px",
              outline: "none", cursor: "pointer", flex: 1, minWidth: 120,
            }}
          >
            <option value="">pick a course…</option>
            {COURSE_IDS.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          <ActionBtn
            label={registering === f.filename ? "…" : "REGISTER"}
            color="#e8c547"
            onClick={handleReassignRegister}
            disabled={!pickedCourse || registering === f.filename}
          />
          <button
            onClick={() => { setReassigning(false); setPicked(""); }}
            style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 13 }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, color, icon, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "12px 20px", background: "#111318",
          border: "none", borderTop: "1px solid #2a2e38",
          borderBottom: open ? "1px solid #2a2e38" : "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ color, fontSize: 13 }}>{icon}</span>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color }}>
          {title}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: "#4a5060", marginLeft: 2 }}>
          ({count})
        </span>
        <span style={{ marginLeft: "auto", color: "#3e4452", fontSize: 12 }}>
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

const MAX_SELECT = 10;

export default function FileInventoryModal({ open, onClose }) {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [registering, setReg]   = useState(null);
  const [indexing, setIdx]      = useState(null);
  const [indexResult, setResult] = useState(null);
  const [indexMsg, setMsg]      = useState(null);
  const [selected, setSelected] = useState(new Map()); // filename → file meta
  const [deleteStep, setDeleteStep] = useState(null); // null | "password" | "confirm"
  const [pwInput, setPwInput]   = useState("");
  const [pwError, setPwError]   = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    if (!open) { setSelected(new Map()); setDeleteStep(null); setPwInput(""); setPwError(false); return; }
    setLoading(true);
    setError(null);
    setMsg(null);
    fetch("/api/inventory")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [open]);

  async function handleRegister(f) {
    setReg(f.filename);
    try {
      const res = await fetch("/api/register-orphan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: f.filename, courseId: f.courseId }),
      });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          orphans: prev.orphans.filter(o => o.filename !== f.filename),
          registered: [...prev.registered, { ...f, indexed: false }],
          unindexed: [...prev.unindexed, { ...f }],
        }));
      }
    } finally {
      setReg(null);
    }
  }

  async function handleDelete(filename) {
    try {
      const res = await fetch("/api/orphan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setData(prev => ({ ...prev, orphans: prev.orphans.filter(o => o.filename !== filename) }));
        setMsg(`Deleted ${filename}`);
      } else {
        const d = await res.json();
        setMsg(`Error: ${d.error}`);
      }
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
  }

  async function handleRename(filename, newName) {
    try {
      const res = await fetch("/api/rename-orphan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, newName }),
      });
      const d = await res.json();
      if (res.ok) {
        setData(prev => ({
          ...prev,
          orphans: prev.orphans.map(o =>
            o.filename === filename ? { ...o, filename: newName, courseId: detectCourseClient(newName) ?? o.courseId } : o
          ),
        }));
        setMsg(`Renamed ${filename} → ${newName}`);
      } else {
        setMsg(`Error: ${d.error}`);
      }
    } catch (e) {
      setMsg(`Error: ${e.message}`);
    }
  }

  async function handleIndex(f) {
    setIdx(f.filename);
    setResult(null);
    const start = Date.now();
    try {
      const res = await fetch("/api/index-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: f.filename }),
      });
      const elapsed = Math.round((Date.now() - start) / 1000);
      const d = await res.json();
      if (res.ok) {
        setResult({ filename: f.filename, ok: true, msg: `indexed for ${elapsed}s — complete!` });
        setData(prev => ({
          ...prev,
          unindexed: prev.unindexed.filter(u => u.filename !== f.filename),
          registered: prev.registered.map(r =>
            r.filename === f.filename ? { ...r, indexed: true } : r
          ),
        }));
      } else {
        const elapsed2 = Math.round((Date.now() - start) / 1000);
        setResult({ filename: f.filename, ok: false, msg: `indexed for ${elapsed2}s — failed! ${d.error}${d.detail ? ": " + d.detail.slice(0, 120) : ""}` });
      }
    } catch (e) {
      const elapsed = Math.round((Date.now() - start) / 1000);
      setResult({ filename: f.filename, ok: false, msg: `indexed for ${elapsed}s — failed! ${e.message}` });
    } finally {
      setIdx(null);
    }
  }

  function toggleSelect(filename, meta) {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else if (next.size < MAX_SELECT) {
        next.set(filename, meta || { filename, _section: "orphan" });
      }
      return next;
    });
    setDeleteStep(null);
    setPwInput("");
    setPwError(false);
  }

  async function handleBulkDelete() {
    setBulkDeleting(true);
    const toDelete = [...selected.entries()];
    let deleted = 0;

    for (const [filename, meta] of toDelete) {
      try {
        let res;
        if ((meta._section === "registered" || meta._section === "unindexed") && meta.courseId && meta._tab) {
          res = await fetch("/api/file", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: meta.courseId, tab: meta._tab, file: meta.filePath || meta.file || filename }),
          });
        } else {
          // Orphan or unindexed — delete from disk only
          res = await fetch("/api/orphan", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
          });
        }

        if (res.ok) {
          deleted++;
          setSelected(prev => { const n = new Map(prev); n.delete(filename); return n; });
          setData(prev => {
            if (!prev) return prev;
            if (meta._section === "registered" || meta._section === "unindexed") {
              return {
                ...prev,
                registered: prev.registered.filter(r => r.filename !== filename),
                unindexed: (prev.unindexed || []).filter(u => u.filename !== filename),
                courses: (prev.courses || []).map(c => ({
                  ...c,
                  tabs: Object.fromEntries(
                    Object.entries(c.tabs).map(([k, items]) => [
                      k, items.filter(item => item.filename !== filename),
                    ])
                  ),
                })),
              };
            }
            return { ...prev, orphans: (prev.orphans || []).filter(o => o.filename !== filename) };
          });
        }
      } catch (_) {}
    }

    setBulkDeleting(false);
    setDeleteStep(null);
    setPwInput("");
    setPwError(false);
    setMsg(`Deleted ${deleted} of ${toDelete.length} file${toDelete.length !== 1 ? "s" : ""}`);
  }

  const TAB_LABEL = {
    notes: "Notes", references: "References", gopal: "Gopal",
    assignments: "Assignments", code: "Code", pdfs: "PDFs",
  };
  const TAB_COLOR = {
    notes: "#4ecdc4", references: "#a78bfa", gopal: "#fb923c",
    assignments: "#e8c547", code: "#34d399", pdfs: "#4ecdc4",
  };
  const TAB_ICON = {
    notes: "≡", references: "⌘", gopal: "∿",
    assignments: "✎", code: "⌥", pdfs: "⎘",
  };

  const unindexed = (data?.unindexed || []).map(f => ({ ...f, _section: "unindexed", _tab: f.tab || "pdfs" }));

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        background: "rgba(6,6,6,0.82)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 820, maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 80px)",
          background: "#1a1d24", border: "1px solid #2a2e38",
          borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "20px 24px 16px", borderBottom: "1px solid #2a2e38",
          flexShrink: 0,
        }}>
          <span style={{ color: "#e8c547", fontSize: 20 }}>⎘</span>
          <div>
            <div style={{ color: "#d4d8e0", fontSize: 15, fontWeight: 700, fontFamily: FONT }}>
              File Inventory
            </div>
            <div style={{ color: "#6b7280", fontSize: 12, fontFamily: FONT, marginTop: 2 }}>
              {data
                ? `${data.registered.length} files across ${data.courses?.length ?? 0} courses · ${unindexed.length} unindexed`
                : "loading…"}
            </div>
          </div>
          {data && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <Pill label={`${data.registered.length} registered`} color="#34d399" />
              {unindexed.length > 0 && <Pill label={`${unindexed.length} unindexed`} color="#e8c547" />}
              {(data.orphans?.length > 0) && <Pill label={`${data.orphans.length} orphans`} color="#e85454" />}
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: data ? 10 : "auto",
              background: "none", border: "none",
              color: "#4a5060", cursor: "pointer", fontSize: 18,
              padding: "4px 8px", borderRadius: 6, lineHeight: 1,
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
          >✕</button>
        </div>

        {/* Index message banner */}
        {indexMsg && (
          <div style={{
            padding: "10px 24px",
            background: indexMsg.startsWith("Error") ? "#e8545415" : "#4ecdc415",
            borderBottom: `1px solid ${indexMsg.startsWith("Error") ? "#e8545433" : "#4ecdc433"}`,
            color: indexMsg.startsWith("Error") ? "#e85454" : "#4ecdc4",
            fontSize: 12, fontFamily: FONT,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            {indexMsg.startsWith("Error") ? "✕ " : "↻ "}{indexMsg}
            <button onClick={() => setMsg(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        )}

        {/* ── Selection action bar — appears when files are tapped ── */}
        {selected.size > 0 && (
          <div style={{
            padding: "10px 24px",
            background: "#1a1014",
            borderBottom: "1px solid #e8545430",
            display: "flex", alignItems: "center", gap: 14,
            flexShrink: 0, flexWrap: "wrap",
          }}>
            {/* Left: count + deselect */}
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#e85454", letterSpacing: "0.5px" }}>
              {selected.size} selected{selected.size === MAX_SELECT ? ` · max ${MAX_SELECT}` : ""}
            </span>
            <button
              onClick={() => { setSelected(new Map()); setDeleteStep(null); setPwInput(""); setPwError(false); }}
              style={{ background: "none", border: "none", color: "#6070a0", cursor: "pointer", fontSize: 11, fontFamily: FONT }}
              onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
              onMouseLeave={e => e.currentTarget.style.color = "#6070a0"}
            >
              deselect all
            </button>

            <div style={{ flex: 1 }} />

            {/* Step: idle */}
            {!deleteStep && (
              <button
                onClick={() => { setDeleteStep("password"); setPwInput(""); setPwError(false); }}
                style={{
                  padding: "6px 18px", borderRadius: 6,
                  background: "#e8545420", border: "1px solid #e8545460",
                  color: "#e85454", fontFamily: MONO, fontSize: 11,
                  cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e8545435"}
                onMouseLeave={e => e.currentTarget.style.background = "#e8545420"}
              >
                DELETE {selected.size} FILE{selected.size !== 1 ? "S" : ""}
              </button>
            )}

            {/* Step: password */}
            {deleteStep === "password" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#8090a0", fontFamily: MONO, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Password
                </span>
                <input
                  autoFocus
                  type="password"
                  value={pwInput}
                  onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      if (pwInput === "Jesiah") { setPwError(false); setDeleteStep("confirm"); }
                      else { setPwError(true); setPwInput(""); }
                    }
                    if (e.key === "Escape") { setDeleteStep(null); setPwInput(""); setPwError(false); }
                  }}
                  placeholder="enter password"
                  style={{
                    background: "#1e2230", border: `1px solid ${pwError ? "#e85454" : "#3e4452"}`,
                    borderRadius: 6, color: "#d4d8e0", fontFamily: MONO,
                    fontSize: 12, padding: "5px 10px", outline: "none", width: 140,
                  }}
                />
                {pwError && (
                  <span style={{ fontSize: 11, color: "#e85454", fontFamily: FONT }}>incorrect</span>
                )}
                <button
                  onClick={() => {
                    if (pwInput === "Jesiah") { setPwError(false); setDeleteStep("confirm"); }
                    else { setPwError(true); setPwInput(""); }
                  }}
                  style={{
                    padding: "5px 14px", borderRadius: 6, border: "none",
                    background: "#2a2e38", color: "#d4d8e0",
                    fontFamily: MONO, fontSize: 11, cursor: "pointer",
                  }}
                >
                  Continue
                </button>
                <button
                  onClick={() => { setDeleteStep(null); setPwInput(""); setPwError(false); }}
                  style={{ background: "none", border: "none", color: "#6070a0", cursor: "pointer", fontSize: 12, fontFamily: FONT }}
                  onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6070a0"}
                >
                  cancel
                </button>
              </div>
            )}

            {/* Step: confirm */}
            {deleteStep === "confirm" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#e85454", fontFamily: FONT }}>
                  Permanently delete {selected.size} file{selected.size !== 1 ? "s" : ""}?
                </span>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  style={{
                    padding: "6px 16px", borderRadius: 6, background: "#e85454",
                    border: "none", color: "#fff", fontFamily: MONO, fontSize: 11,
                    cursor: bulkDeleting ? "not-allowed" : "pointer",
                    opacity: bulkDeleting ? 0.6 : 1,
                  }}
                >
                  {bulkDeleting ? "deleting…" : "confirm delete"}
                </button>
                <button
                  onClick={() => { setDeleteStep(null); setPwInput(""); }}
                  style={{ background: "none", border: "none", color: "#6070a0", cursor: "pointer", fontSize: 12, fontFamily: FONT }}
                  onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#6070a0"}
                >
                  cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading && (
            <div style={{ padding: "56px 32px", textAlign: "center" }}>
              <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
              <div style={{ fontFamily: MONO, fontSize: 13, color: "#4a5060", letterSpacing: "2px", animation: "pulse 1.2s ease-in-out infinite" }}>
                LOADING…
              </div>
            </div>
          )}

          {error && (
            <div style={{ margin: 20, padding: "14px 20px", background: "#e8545411", border: "1px solid #e8545433", borderRadius: 10, color: "#e85454", fontFamily: FONT, fontSize: 13 }}>
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Unindexed PDFs — always first */}
              {unindexed.length > 0 && (
                <Section title="Not Indexed" icon="⚠" color="#e8c547" count={unindexed.length} defaultOpen={true}>
                  {unindexed.map((f, i) => (
                    <FileRow key={f.filename} f={f} odd={i % 2 === 0}
                      onIndex={handleIndex} indexing={indexing}
                      indexResult={indexResult?.filename === f.filename ? indexResult : null}
                      selected={selected.has(f.filename)}
                      onToggleSelect={() => toggleSelect(f.filename, f)}
                      atLimit={selected.size >= MAX_SELECT}
                    />
                  ))}
                </Section>
              )}

              {/* Orphans */}
              {data.orphans?.length > 0 && (
                <Section title="Orphans — on disk, not registered" icon="◌" color="#e85454" count={data.orphans.length} defaultOpen={false}>
                  {data.orphans.map((f, i) => (
                    <FileRow key={f.filename} f={{ ...f, _section: "orphan" }} odd={i % 2 === 0}
                      onRegister={handleRegister} registering={registering}
                      onDelete={handleDelete} onRename={handleRename}
                      selected={selected.has(f.filename)}
                      onToggleSelect={() => toggleSelect(f.filename, { ...f, _section: "orphan" })}
                      atLimit={selected.size >= MAX_SELECT}
                    />
                  ))}
                </Section>
              )}

              {/* Course tree */}
              {(data.courses || []).map(course => (
                <Section key={course.id} title={course.label} icon="✓" color="#34d399"
                  count={Object.values(course.tabs).flat().length} defaultOpen={false}
                >
                  {Object.entries(course.tabs).map(([tabKey, items]) => {
                    if (!items?.length) return null;
                    // Group items by their group label
                    const groups = {};
                    const flat   = [];
                    for (const item of items) {
                      if (item.group) {
                        if (!groups[item.group]) groups[item.group] = [];
                        groups[item.group].push(item);
                      } else {
                        flat.push(item);
                      }
                    }
                    return (
                      <div key={tabKey} style={{ borderTop: "1px solid #1e2229" }}>
                        {/* Tab header */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 20px 6px",
                          background: "#111318",
                        }}>
                          <span style={{ color: TAB_COLOR[tabKey] || "#7a8090", fontSize: 12 }}>
                            {TAB_ICON[tabKey] || "·"}
                          </span>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: TAB_COLOR[tabKey] || "#7a8090", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                            {TAB_LABEL[tabKey] || tabKey}
                          </span>
                          <span style={{ fontFamily: MONO, fontSize: 10, color: "#3e4452" }}>
                            ({items.length})
                          </span>
                        </div>

                        {/* Subsections */}
                        {Object.entries(groups).map(([groupLabel, gItems]) => (
                          <div key={groupLabel}>
                            <div style={{
                              padding: "5px 20px 4px 32px",
                              background: "#0f1218",
                              display: "flex", alignItems: "center", gap: 6,
                            }}>
                              <span style={{ color: "#3e4452", fontSize: 10, fontFamily: MONO }}>↳</span>
                              <span style={{ color: "#4a5568", fontSize: 10, fontFamily: MONO, letterSpacing: "0.5px" }}>
                                {groupLabel}
                              </span>
                              <span style={{ color: "#3e4452", fontSize: 10, fontFamily: MONO }}>
                                ({gItems.length})
                              </span>
                            </div>
                            {gItems.map((f, i) => (
                              <FileRow key={f.filename + i} f={{ ...f, _section: "registered", courseId: course.id, _tab: tabKey }} odd={i % 2 === 0} indent
                                selected={selected.has(f.filename)}
                                onToggleSelect={() => toggleSelect(f.filename, { ...f, _section: "registered", courseId: course.id, _tab: tabKey })}
                                atLimit={selected.size >= MAX_SELECT}
                              />
                            ))}
                          </div>
                        ))}

                        {/* Flat items */}
                        {flat.map((f, i) => (
                          <FileRow key={f.filename + i} f={{ ...f, _section: "registered", courseId: course.id, _tab: tabKey }} odd={i % 2 === 0}
                            selected={selected.has(f.filename)}
                            onToggleSelect={() => toggleSelect(f.filename, { ...f, _section: "registered", courseId: course.id, _tab: tabKey })}
                            atLimit={selected.size >= MAX_SELECT}
                          />
                        ))}
                      </div>
                    );
                  })}
                </Section>
              ))}

              {data.registered.length === 0 && (
                <div style={{ padding: "56px 32px", textAlign: "center", color: "#4a5060", fontFamily: FONT, fontSize: 14 }}>
                  No files registered yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}