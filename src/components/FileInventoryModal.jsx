// src/components/FileInventoryModal.jsx
import { useState, useEffect, useRef, useCallback } from "react";

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

function FileRow({ f, odd, onRegister, onIndex, registering, indexing, indexResult, indent, onRename, selected, onToggleSelect, atLimit }) {
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
        {/* Filename + label + course */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: selected ? "#f0a0a0" : isOk ? "#d4d8e0" : "#b0b6c2",
            fontSize: 13, fontFamily: MONO,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {f.filename}
          </div>
          {isOk && f.label && f.label !== f.filename && (
            <div style={{ color: "#4a5568", fontSize: 10, fontFamily: FONT, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {f.label}
            </div>
          )}
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
          <ActionBtn label="DELETE" color="#e85454" onClick={() => { setConfirmDelete(false); onToggleSelect?.(); }} />
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
  const [data, setData]          = useState(null);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState(null);
  const [registering, setReg]    = useState(null);
  const [indexing, setIdx]       = useState(null);
  const [indexResult, setResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null); // { ok, text }
  const [saving, setSaving]      = useState(false);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [passwordDraft,  setPasswordDraft]  = useState("");
  const [passwordErr,    setPasswordErr]    = useState(false);
  const [diagLog, setDiagLog]    = useState(null); // diagnostic output
  // Ghost groups scrubbed from server data — auto-deleted silently on next save
  const ghostGroupsRef = useRef([]);

  async function runDiagnostics() {
    setDiagLog("running…");
    const lines = [];

    // 1. Raw inventory fetch
    try {
      const res = await fetch("/api/inventory");
      const raw = await res.json();
      lines.push("=== RAW /api/inventory ===");
      // Find all groups in raw data
      for (const c of (raw.courses || [])) {
        for (const [tab, items] of Object.entries(c.tabs || {})) {
          for (const item of (items || [])) {
            if (item.type === "group") {
              lines.push(`  ${c.id}.${tab}: group "${item.label}" children=${item.children?.length ?? 0}`);
            }
          }
        }
      }
    } catch (e) { lines.push(`inventory fetch error: ${e.message}`); }

    // 2. Ghost groups currently tracked
    lines.push(`\n=== ghostGroupsRef (${ghostGroupsRef.current.length} entries) ===`);
    for (const g of ghostGroupsRef.current) {
      lines.push(`  ${g.courseId}.${g.tab}: "${g.label}"`);
    }

    // 3. Try DELETE for each ghost and log exact response
    lines.push("\n=== DELETE attempts ===");
    for (const g of ghostGroupsRef.current) {
      try {
        const res = await fetch("/api/group", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: g.courseId, tab: g.tab, label: g.label }),
        });
        const body = await res.json().catch(() => ({}));
        lines.push(`  DELETE ${g.courseId}.${g.tab} "${g.label}" → ${res.status} ${JSON.stringify(body)}`);
      } catch (e) {
        lines.push(`  DELETE ${g.courseId}.${g.tab} "${g.label}" → THREW: ${e.message}`);
      }
    }

    setDiagLog(lines.join("\n"));
  }

  // ── Unified pending state ──────────────────────────────────────────────────
  // All changes are staged here. Nothing hits the server until Save is clicked.
  // pendingItems: Map<`${courseId}:${tab}`, item[]>  — reordered/mutated tab items
  // pendingFileDeletes: Set<filename>                — files marked for deletion
  // pendingSectionDeletes: { courseId, tab, label }[] — sections marked for deletion
  const [pendingItems,          setPendingItems]          = useState(new Map());
  const [pendingFileDeletes,    setPendingFileDeletes]    = useState(new Set());
  const [pendingSectionDeletes, setPendingSectionDeletes] = useState([]);

  const hasPending = pendingItems.size > 0 || pendingFileDeletes.size > 0 || pendingSectionDeletes.length > 0;

  function resetPending() {
    setPendingItems(new Map());
    setPendingFileDeletes(new Set());
    setPendingSectionDeletes([]);
    setConfirmingSave(false);
    setPasswordDraft("");
    setPasswordErr(false);
  }

  // Build displayData — pending items overlaid on server data, staged deletes visually hidden
  const displayData = (() => {
    if (!data) return data;
    if (!hasPending) return data;
    return {
      ...data,
      courses: (data.courses || []).map(c => {
        const newTabs = Object.fromEntries(
          Object.entries(c.tabs).map(([tabKey, items]) => {
            const key = `${c.id}:${tabKey}`;
            let result = pendingItems.has(key) ? pendingItems.get(key) : items;
            // Hide staged section deletes
            result = result.map(item => {
              if (item.type === "group") {
                const isDeleted = pendingSectionDeletes.some(d => d.courseId === c.id && d.tab === tabKey && d.label === item.label);
                if (isDeleted) return null;
                // Hide staged file deletes from children
                const newChildren = (item.children || []).filter(ch => !pendingFileDeletes.has(ch.filename));
                return { ...item, children: newChildren };
              }
              // Hide staged flat file deletes
              if (!item.type && pendingFileDeletes.has(item.filename)) return null;
              return item;
            }).filter(Boolean);
            return [tabKey, result];
          })
        );
        return { ...c, tabs: newTabs };
      }),
    };
  })();

  function stageItemsChange(courseId, tab, newItems) {
    setPendingItems(prev => {
      const next = new Map(prev);
      next.set(`${courseId}:${tab}`, newItems);
      return next;
    });
  }

  function stageFileDelete(filename) {
    setPendingFileDeletes(prev => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename); // toggle off
      else next.add(filename);
      return next;
    });
  }

  function unstageSectionDelete(courseId, tab, label) {
    setPendingSectionDeletes(prev => prev.filter(d => !(d.courseId === courseId && d.tab === tab && d.label === label)));
  }

  function stageSectionDelete(courseId, tab, label) {
    // Toggle — clicking ✕ again unstages
    const already = pendingSectionDeletes.some(d => d.courseId === courseId && d.tab === tab && d.label === label);
    if (already) {
      unstageSectionDelete(courseId, tab, label);
    } else {
      setPendingSectionDeletes(prev => [...prev, { courseId, tab, label }]);
    }
  }

  // ── Save all pending changes ───────────────────────────────────────────────
  async function saveAll() {
    setSaving(true);
    const errors = [];

    // 1. Reorders
    for (const [key, items] of pendingItems.entries()) {
      const [courseId, tab] = key.split(":");
      try {
        const res = await fetch("/api/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, tab, items }),
        });
        if (!res.ok) errors.push(`reorder ${courseId}.${tab}: ${(await res.json()).error}`);
      } catch (e) { errors.push(`reorder ${key}: ${e.message}`); }
    }

    // 2. File deletes — need meta to know which endpoint
    for (const filename of pendingFileDeletes) {
      // Search flat registered/unindexed lists first — they already carry courseId and tab
      let meta = null;
      const allRegistered = [...(data?.registered || []), ...(data?.unindexed || [])];
      const foundFlat = allRegistered.find(f => f.filename === filename);
      if (foundFlat?.courseId && foundFlat?.tab) {
        // Server DELETE /file expects `file` = the full filePath from subjects.js
        // e.g. "./content/subjects/automata/list.md" or just "list.pdf" for PDFs
        meta = { courseId: foundFlat.courseId, tab: foundFlat.tab, file: foundFlat.filePath || filename };
      } else {
        // Fallback: traverse course tree
        for (const c of (data?.courses || [])) {
          for (const [tabKey, items] of Object.entries(c.tabs || {})) {
            const flat = (items || []).flatMap(item => item.type === "group" ? (item.children || []) : [item]);
            const hit = flat.find(f => f.filename === filename);
            if (hit) { meta = { courseId: c.id, tab: tabKey, file: hit.filePath || filename }; break; }
          }
          if (meta) break;
        }
      }
      // Also check orphans
      const isOrphan = (data?.orphans || []).some(o => o.filename === filename);

      try {
        let res;
        if (meta) {
          res = await fetch("/api/file", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(meta),
          });
        } else if (isOrphan) {
          res = await fetch("/api/orphan", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
          });
        }
        if (res && !res.ok) errors.push(`delete ${filename}: ${(await res.json()).error}`);
      } catch (e) { errors.push(`delete ${filename}: ${e.message}`); }
    }

    // 3. Section deletes — staged + any ghost groups scrubbed from server data
    const allSectionDeletes = [
      ...pendingSectionDeletes,
      ...ghostGroupsRef.current,
    ];
    for (const { courseId, tab, label } of allSectionDeletes) {
      try {
        const res = await fetch("/api/group", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, tab, label }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg = (body.error || "").toLowerCase();
          // Any "not found" / "does not exist" / 404 means already gone — treat as success
          if (!msg.includes("not found") && !msg.includes("does not exist") && res.status !== 404) {
            errors.push(`delete section ${label}: ${body.error || res.status}`);
          }
        }
      } catch (e) { errors.push(`delete section ${label}: ${e.message}`); }
    }
    ghostGroupsRef.current = []; // clear after attempt

    setSaving(false);
    resetPending();

    if (errors.length) {
      setStatusMsg({ ok: false, text: `✕ ${errors.length} error(s): ${errors[0]}` });
    } else {
      setStatusMsg({ ok: true, text: "✓ all changes saved" });
      setTimeout(() => setStatusMsg(null), 2500);
    }

    await reload();
  }

  // Strip empty groups from server data — ghost groups that exist on server
  // but have no children cause "Group not found" errors and confuse the UI.
  // Records stripped groups into ghostGroupsRef so saveAll can auto-delete them.
  function scrubEmptyGroups(d) {
    if (!d?.courses) return d;
    const ghosts = [];
    const result = {
      ...d,
      courses: d.courses.map(c => ({
        ...c,
        tabs: Object.fromEntries(
          Object.entries(c.tabs).map(([k, items]) => [
            k,
            (items || []).filter(item => {
              if (item.type === "group" && (!item.children || item.children.length === 0)) {
                ghosts.push({ courseId: c.id, tab: k, label: item.label });
                return false;
              }
              return true;
            }),
          ])
        ),
      })),
    };
    ghostGroupsRef.current = ghosts;
    return result;
  }

  useEffect(() => {
    if (!open) { resetPending(); setStatusMsg(null); return; }
    setLoading(true);
    setError(null);
    fetch("/api/inventory")
      .then(r => r.json())
      .then(d => { setData(scrubEmptyGroups(d)); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [open]);

  async function reload() {
    fetch("/api/inventory")
      .then(r => r.json())
      .then(d => setData(scrubEmptyGroups(d)))
      .catch(() => {});
  }

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
        setStatusMsg({ ok: true, text: `Renamed ${filename} → ${newName}` });
      } else {
        setStatusMsg({ ok: false, text: `Error: ${d.error}` });
      }
    } catch (e) {
      setStatusMsg({ ok: false, text: `Error: ${e.message}` });
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

  // ── Drag-to-reorder state ────────────────────────────────────────────────
  const dragFrom     = useRef(null);
  const dragOverIdx  = useRef(null);
  const [dragActive,    setDragActive]    = useState(false);
  const [dragSourceIdx, setDragSourceIdx] = useState(null);
  const [dropTarget,      setDropTarget]      = useState(null);
  const [dropTargetGroup, setDropTargetGroup] = useState(null);
  const dragFromGroup = useRef(null);

  const onDragStart = useCallback((courseId, tab, allItems, idx) => {
    dragFrom.current    = { courseId, tab, allItems, idx };
    dragOverIdx.current = idx;
    setDragActive(true);
    setDragSourceIdx(idx);
  }, []);

  const onDragEnter = useCallback((idx) => {
    dragOverIdx.current = idx;
    setDropTarget(idx);
  }, []);

  const onDragEnd = useCallback(() => {
    setDragActive(false);
    setDropTarget(null);
    setDropTargetGroup(null);
    setDragSourceIdx(null);
    if (!dragFrom.current) return;
    const { courseId, tab, allItems, idx: fromIdx } = dragFrom.current;
    const toIdx = dragOverIdx.current;
    dragFrom.current    = null;
    dragOverIdx.current = null;
    if (fromIdx === toIdx || toIdx === null) return;
    const newItems = [...allItems];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    stageItemsChange(courseId, tab, newItems);
  }, []);

  const onDropOnGroup = useCallback((courseId, tab, allItems, targetGroup) => {
    if (!dragFrom.current) return;
    const { idx: fromIdx } = dragFrom.current;
    dragFrom.current = null;
    setDragActive(false);
    setDropTargetGroup(null);
    setDragSourceIdx(null);
    const newItems = allItems.map((item, i) =>
      i === fromIdx ? { ...item, group: targetGroup } : item
    );
    stageItemsChange(courseId, tab, newItems);
  }, []);

  // ── SP3: Add subsection state ─────────────────────────────────────────────
  const [addingSection, setAddingSection] = useState(null);
  const [sectionDraft,  setSectionDraft]  = useState("");
  const [sectionErr,    setSectionErr]    = useState(false);

  async function handleAddSection() {
    const label = sectionDraft.trim();
    if (!label) { setSectionErr(true); return; }
    try {
      const res = await fetch("/api/add-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: addingSection.courseId, tab: addingSection.tab, label }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setAddingSection(null);
      setSectionDraft("");
      setSectionErr(false);
      await reload();
    } catch (err) { void err; setSectionErr(true); }
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
              <button
                onClick={runDiagnostics}
                style={{ background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#4a5060", fontFamily: MONO, fontSize: 9, padding: "3px 8px", cursor: "pointer", letterSpacing: "0.5px" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#4a90d9"; e.currentTarget.style.color = "#4a90d9"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#4a5060"; }}
                title="Run diagnostics on ghost groups"
              >diag</button>
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

        {/* Diagnostic log panel */}
        {diagLog && (
          <div style={{
            padding: "12px 20px", flexShrink: 0,
            background: "#0d1018", borderBottom: "1px solid #2a2e38",
            fontFamily: MONO, fontSize: 11, color: "#6b9fd4",
            whiteSpace: "pre-wrap", maxHeight: 220, overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#4a90d9", fontWeight: 700, letterSpacing: "1px" }}>DIAGNOSTICS</span>
              <button onClick={() => setDiagLog(null)} style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
            {diagLog}
          </div>
        )}

        {/* Status message banner */}
        {statusMsg && (
          <div style={{
            padding: "10px 24px", flexShrink: 0,
            background: statusMsg.ok ? "#34d39912" : "#e8545415",
            borderBottom: `1px solid ${statusMsg.ok ? "#34d39930" : "#e8545433"}`,
            color: statusMsg.ok ? "#34d399" : "#e85454",
            fontSize: 12, fontFamily: FONT,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {statusMsg.text}
            <button onClick={() => setStatusMsg(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        )}

        {/* ── Pending changes bar ── */}
        {hasPending && (
          <div style={{
            padding: "10px 24px",
            background: "#111820",
            borderBottom: "1px solid #e8c54730",
            display: "flex", alignItems: "center", gap: 14,
            flexShrink: 0, flexWrap: "wrap",
          }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#e8c547", letterSpacing: "0.5px" }}>
              {[
                pendingFileDeletes.size > 0 && `${pendingFileDeletes.size} file${pendingFileDeletes.size !== 1 ? "s" : ""} to delete`,
                pendingSectionDeletes.length > 0 && `${pendingSectionDeletes.length} section${pendingSectionDeletes.length !== 1 ? "s" : ""} to delete`,
                pendingItems.size > 0 && `${pendingItems.size} tab${pendingItems.size !== 1 ? "s" : ""} reordered`,
              ].filter(Boolean).join(" · ")} — unsaved
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={resetPending}
              style={{ background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#6070a0", fontFamily: MONO, fontSize: 10, padding: "4px 12px", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6070a0"; e.currentTarget.style.color = "#94a3b8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#6070a0"; }}
            >discard</button>

            {!confirmingSave ? (
              <button
                onClick={() => { setConfirmingSave(true); setPasswordDraft(""); setPasswordErr(false); }}
                disabled={saving}
                style={{
                  padding: "5px 18px", borderRadius: 6,
                  background: saving ? "#34d39930" : "#34d39925",
                  border: "1px solid #34d39960",
                  color: "#34d399", fontFamily: MONO, fontSize: 11,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = "#34d39940"; }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = "#34d39925"; }}
              >
                {saving ? "saving…" : "✓ save all"}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  autoFocus
                  type="password"
                  placeholder="password…"
                  value={passwordDraft}
                  onChange={e => { setPasswordDraft(e.target.value); setPasswordErr(false); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      if (passwordDraft === "Jesiah") { setConfirmingSave(false); setPasswordDraft(""); saveAll(); }
                      else setPasswordErr(true);
                    }
                    if (e.key === "Escape") { setConfirmingSave(false); setPasswordDraft(""); setPasswordErr(false); }
                  }}
                  style={{
                    background: "#1a1d24",
                    border: `1px solid ${passwordErr ? "#e85454" : "#3e4452"}`,
                    borderRadius: 5, color: "#d4d8e0",
                    fontFamily: MONO, fontSize: 11,
                    padding: "4px 10px", outline: "none", width: 120,
                  }}
                />
                {passwordErr && (
                  <span style={{ color: "#e85454", fontSize: 10, fontFamily: MONO }}>wrong</span>
                )}
                <button
                  onClick={() => {
                    if (passwordDraft === "Jesiah") { setConfirmingSave(false); setPasswordDraft(""); saveAll(); }
                    else setPasswordErr(true);
                  }}
                  style={{
                    padding: "5px 14px", borderRadius: 6,
                    background: "#34d39925", border: "1px solid #34d39960",
                    color: "#34d399", fontFamily: MONO, fontSize: 11, cursor: "pointer",
                  }}
                >confirm</button>
                <button
                  onClick={() => { setConfirmingSave(false); setPasswordDraft(""); setPasswordErr(false); }}
                  style={{ background: "none", border: "none", color: "#4a5060", cursor: "pointer", fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#4a5060"}
                >✕</button>
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
                      selected={pendingFileDeletes.has(f.filename)}
                      onToggleSelect={() => stageFileDelete(f.filename)}
                      atLimit={false}
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
                      onRename={handleRename}
                      selected={pendingFileDeletes.has(f.filename)}
                      onToggleSelect={() => stageFileDelete(f.filename)}
                      atLimit={false}
                    />
                  ))}
                </Section>
              )}

              {/* Course tree */}
              {(displayData?.courses || []).map(course => (
                <Section key={course.id} title={course.label} icon="✓" color="#34d399"
                  count={Object.values(course.tabs).flat().length} defaultOpen={false}
                >
                  {Object.entries(course.tabs).map(([tabKey, items]) => {
                    if (!items) return null;
                    // groupOrder preserves the order sections appear in items
                    const groupOrder = [];
                    const groupMap   = {};
                    const flat       = [];
                    for (const item of items) {
                      if (item.type === "group") {
                        // Raw group object from subjects.json (children array format)
                        if (!groupMap[item.label]) { groupMap[item.label] = []; groupOrder.push(item.label); }
                        for (const child of (item.children || [])) {
                          groupMap[item.label].push({ ...child, group: item.label });
                        }
                      } else if (item.group) {
                        // Flat format: file with .group string (after reorder/pending)
                        if (!groupMap[item.group]) { groupMap[item.group] = []; groupOrder.push(item.group); }
                        groupMap[item.group].push(item);
                      } else if (!item._emptyGroup) {
                        flat.push(item);
                      }
                    }
                    // groups is an ordered array of [label, items] pairs
                    const groups = groupOrder.map(label => [label, groupMap[label] || []]);

                    // mkRow — inlined drag row (not a component — avoids remount on every render)
                    const availableGroups = groupOrder;
                    const mkRow = (f, i, globalIdx, isIndented) => {
                      const isSameDrag    = dragActive && dragFrom.current?.courseId === course.id && dragFrom.current?.tab === tabKey;
                      const isBeingDragged = isSameDrag && dragSourceIdx === globalIdx;
                      const isDropHere     = isSameDrag && dropTarget === globalIdx && dragSourceIdx !== globalIdx;
                      return (
                        <div
                          key={f.filename + i}
                          draggable
                          onDragStart={() => onDragStart(course.id, tabKey, items, globalIdx)}
                          onDragEnter={e => { e.preventDefault(); onDragEnter(globalIdx); }}
                          onDragOver={e => e.preventDefault()}
                          onDragEnd={onDragEnd}
                          style={{
                            display: "flex", alignItems: "stretch",
                            background: isDropHere ? "#1a2535" : "transparent",
                            opacity: isBeingDragged ? 0.3 : 1,
                            transition: "background 0.1s, opacity 0.1s",
                          }}
                        >
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 22, flexShrink: 0, cursor: "grab",
                            color: "#4a5568", fontSize: 13, userSelect: "none",
                            paddingLeft: isIndented ? 8 : 4,
                          }} title="drag to reorder">⠿</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <FileRow
                              f={{ ...f, _section: "registered", courseId: course.id, _tab: tabKey }}
                              odd={i % 2 === 0}
                              indent={isIndented}
                              selected={pendingFileDeletes.has(f.filename)}
                              onToggleSelect={() => stageFileDelete(f.filename)}
                              atLimit={false}
                            />
                          </div>
                          {/* SP5: move to section */}
                          {availableGroups.length > 0 && (
                            <div style={{ display: "flex", alignItems: "center", paddingRight: 8, flexShrink: 0 }}>
                              <select
                                value={f.group || ""}
                                onChange={e => {
                                  const newGroup = e.target.value || null;
                                  const newItems = items.map(it =>
                                    it.filename === f.filename ? { ...it, group: newGroup } : it
                                  );
                                  // Stage as pending — user must hit Save
                                  stageItemsChange(course.id, tabKey, newItems);
                                }}
                                style={{
                                  background: "#111318", border: "1px solid #2a2e38",
                                  borderRadius: 4, color: "#4a5568",
                                  fontFamily: MONO, fontSize: 9, padding: "2px 4px",
                                  cursor: "pointer", outline: "none",
                                }}
                              >
                                <option value="">no section</option>
                                {availableGroups.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    };

                    const isAddingHere = addingSection?.courseId === course.id && addingSection?.tab === tabKey;

                    return (
                      <div key={tabKey} style={{ borderTop: "1px solid #1e2229" }}>
                        {/* Tab header */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 20px 6px", background: "#111318",
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
                          <div style={{ flex: 1 }} />
                          {/* SP3: Add subsection button */}
                          {!isAddingHere && (
                            <button
                              onClick={() => { setAddingSection({ courseId: course.id, tab: tabKey }); setSectionDraft(""); setSectionErr(false); }}
                              style={{ background: "none", border: "1px solid #2a2e38", borderRadius: 4, color: "#4a5060", fontFamily: MONO, fontSize: 9, padding: "2px 8px", cursor: "pointer", letterSpacing: "0.5px" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = TAB_COLOR[tabKey] || "#7a8090"; e.currentTarget.style.color = TAB_COLOR[tabKey] || "#7a8090"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#4a5060"; }}
                            >+ subsection</button>
                          )}
                        </div>

                        {/* SP3: New subsection input */}
                        {isAddingHere && (
                          <div style={{ padding: "8px 20px", background: "#0d1018", borderBottom: "1px solid #1e2229", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#4a5060", fontSize: 10, fontFamily: MONO }}>↳</span>
                            <input
                              autoFocus
                              value={sectionDraft}
                              onChange={e => { setSectionDraft(e.target.value); setSectionErr(false); }}
                              onKeyDown={e => {
                                if (e.key === "Enter") handleAddSection();
                                if (e.key === "Escape") { setAddingSection(null); setSectionDraft(""); }
                              }}
                              placeholder="subsection name…"
                              style={{
                                flex: 1, background: "#1a1d24",
                                border: `1px solid ${sectionErr ? "#e85454" : "#3e4452"}`,
                                borderRadius: 5, color: "#d4d8e0",
                                fontFamily: MONO, fontSize: 11,
                                padding: "4px 9px", outline: "none",
                              }}
                            />
                            <button
                              onClick={handleAddSection}
                              style={{ background: "#4ecdc420", border: "1px solid #4ecdc460", borderRadius: 4, color: "#4ecdc4", fontFamily: MONO, fontSize: 10, padding: "4px 12px", cursor: "pointer" }}
                            >add</button>
                            <button
                              onClick={() => { setAddingSection(null); setSectionDraft(""); }}
                              style={{ background: "none", border: "none", color: "#4a5060", fontFamily: MONO, fontSize: 12, cursor: "pointer" }}
                            >✕</button>
                          </div>
                        )}
                        {groups.map(([groupLabel, gItems], groupIdx) => {
                          const realItems = gItems.filter(f => !f._emptyGroup);
                          const isGroupDropTarget = dropTargetGroup === groupLabel;
                          const isSectionDrag = dragFromGroup.current?.courseId === course.id && dragFromGroup.current?.tab === tabKey;
                          const isSectionBeingDragged = isSectionDrag && dragFromGroup.current?.label === groupLabel;
                          return (
                          <div
                            key={groupLabel}
                            style={{ opacity: isSectionBeingDragged ? 0.4 : 1, transition: "opacity 0.1s" }}
                          >
                            <div
                              draggable
                              onDragStart={e => {
                                e.stopPropagation();
                                dragFromGroup.current = { courseId: course.id, tab: tabKey, label: groupLabel, idx: groupIdx };
                                setDragActive(true);
                              }}
                              onDragEnter={e => {
                                e.preventDefault(); e.stopPropagation();
                                setDropTargetGroup(groupLabel);
                                // If dragging a section, reorder sections
                                if (dragFromGroup.current && dragFromGroup.current.courseId === course.id && dragFromGroup.current.tab === tabKey) {
                                  const fromIdx = dragFromGroup.current.idx;
                                  if (fromIdx !== groupIdx) {
                                    const newGroups = [...groups];
                                    const [moved] = newGroups.splice(fromIdx, 1);
                                    newGroups.splice(groupIdx, 0, moved);
                                    dragFromGroup.current = { ...dragFromGroup.current, idx: groupIdx };
                                    // Rebuild items with new section order
                                    const sectionLabels = newGroups.map(([l]) => l);
                                    const newItems = [
                                      ...sectionLabels.flatMap(label => newGroups.find(([l]) => l === label)?.[1] || []),
                                      ...flat,
                                    ];
                                    stageItemsChange(course.id, tabKey, newItems);
                                  }
                                }
                              }}
                              onDragOver={e => e.preventDefault()}
                              onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTargetGroup(null); }}
                              onDragEnd={() => { dragFromGroup.current = null; setDragActive(false); setDropTargetGroup(null); }}
                              onDrop={e => {
                                e.preventDefault(); e.stopPropagation();
                                setDropTargetGroup(null);
                                // If a file is being dragged (not a section), assign to this group
                                if (dragFrom.current) onDropOnGroup(course.id, tabKey, items, groupLabel);
                              }}
                              style={{
                                padding: "5px 20px 4px 28px",
                                background: isGroupDropTarget ? "#1a2535" : "#0f1218",
                                display: "flex", alignItems: "center", gap: 6,
                                border: isGroupDropTarget ? "1px dashed #4a90d9" : "1px solid transparent",
                                transition: "background 0.1s",
                                cursor: "grab",
                              }}>
                              <span style={{ color: "#4a5568", fontSize: 11, userSelect: "none", paddingRight: 2 }}>⠿</span>
                              <span style={{ color: "#4a5568", fontSize: 10, fontFamily: MONO }}>↳</span>
                              <span style={{ color: isGroupDropTarget ? "#4a90d9" : (realItems.length === 0 ? "#6b7280" : "#94a3b8"), fontSize: 10, fontFamily: MONO, letterSpacing: "0.5px" }}>{groupLabel}</span>
                              <span style={{ color: "#4a5568", fontSize: 10, fontFamily: MONO }}>({realItems.length})</span>
                              <div style={{ flex: 1 }} />
                              {(() => {
                                const isStaged = pendingSectionDeletes.some(d => d.courseId === course.id && d.tab === tabKey && d.label === groupLabel);
                                return (
                                  <button
                                    onClick={() => stageSectionDelete(course.id, tabKey, groupLabel)}
                                    style={{
                                      background: isStaged ? "#e8545420" : "none",
                                      border: `1px solid ${isStaged ? "#e85454" : "#2a2e38"}`,
                                      borderRadius: 3, color: isStaged ? "#e85454" : "#3e4452",
                                      fontFamily: MONO, fontSize: 9, padding: "1px 7px", cursor: "pointer",
                                      transition: "all 0.15s",
                                    }}
                                    onMouseEnter={e => { if (!isStaged) { e.currentTarget.style.borderColor = "#e85454"; e.currentTarget.style.color = "#e85454"; } }}
                                    onMouseLeave={e => { if (!isStaged) { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#3e4452"; } }}
                                    title={isStaged ? "click to unmark" : "mark for deletion"}
                                  >{isStaged ? "✕ staged" : "✕"}</button>
                                );
                              })()}
                            </div>
                            {realItems.length === 0 && (
                              <div style={{ padding: "6px 20px 6px 44px", color: "#4a5568", fontSize: 11, fontFamily: MONO, fontStyle: "italic" }}>
                                {isGroupDropTarget ? "↓ drop here" : "empty · use dropdown or drag a file here"}
                              </div>
                            )}
                            {realItems.map((f, i) =>
                              mkRow(f, i, items.indexOf(f), true)
                            )}
                          </div>
                          );
                        })}

                        {/* Flat items */}
                        {flat.map((f, i) =>
                          mkRow(f, i, items.indexOf(f), false)
                        )}
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