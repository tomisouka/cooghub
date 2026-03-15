import { useState, useRef, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

async function api(method, path, body) {
  if (IS_TAURI) return null; // handled per-call
  const opts = method === "GET" ? {} : {
    method, headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const res = await fetch(path, opts);
  return res.json();
}

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Courier New', monospace";

const SAVE_TARGETS = [
  { id: null,         label: "Entries",     color: "#f472b6", icon: "✦" },
  { id: "datastruct", label: "Data Struct", color: "#4ecdc4", icon: "◈" },
  { id: "algos",      label: "Algorithms",  color: "#e8c547", icon: "◈" },
  { id: "automata",   label: "Automata",    color: "#a78bfa", icon: "◈" },
  { id: "comporg",    label: "Comp Org",    color: "#fb923c", icon: "◈" },
  { id: "databases",  label: "Databases",   color: "#60a5fa", icon: "◈" },
  { id: "opsystems",  label: "OS",          color: "#34d399", icon: "◈" },
  { id: "cpp",        label: "C++",         color: "#fb923c", icon: "{}" },
  { id: "python",     label: "Python",      color: "#4ecdc4", icon: "𝜆" },
  { id: "linux",      label: "Linux",       color: "#34d399", icon: "⌘" },
];

function slugDate() {
  const d = new Date();
  const mon = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  return `${mon}${d.getDate()}`;
}

function fmtSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}b`;
  return `${(bytes / 1024).toFixed(1)}kb`;
}

function fmtDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDateTime(ms) {
  if (!ms) return "";
  const d = new Date(ms);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} · ${time}`;
}

// ── Save To popover ───────────────────────────────────────────────
function SaveToPopover({ target, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: 8,
          background: open ? "#1e2230" : "#181c28",
          border: `1px solid ${open ? target.color + "80" : "#2a2e38"}`,
          color: target.color, cursor: "pointer",
          fontFamily: FONT, fontSize: 12, fontWeight: 700,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.borderColor = target.color + "55"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = "#2a2e38"; }}
      >
        <span style={{ fontSize: 14 }}>{target.icon}</span>
        <span>{target.label}</span>
        <span style={{ fontSize: 10, color: "#55607a", marginLeft: 2 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          zIndex: 200, width: 200,
          background: "#1a1d24", border: "1px solid #2a2e38",
          borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "8px 14px 6px",
            fontSize: 9, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: "#3a4052", fontFamily: MONO,
          }}>
            Save to
          </div>
          {SAVE_TARGETS.map(t => {
            const active = target.id === t.id;
            return (
              <button
                key={String(t.id)}
                onClick={() => { onSelect(t); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", border: "none",
                  background: active ? "#21253a" : "transparent",
                  color: active ? t.color : "#8090a8",
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  cursor: "pointer", textAlign: "left", fontFamily: FONT,
                  borderLeft: `2px solid ${active ? t.color : "transparent"}`,
                  transition: "all 0.1s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#1e2230"; e.currentTarget.style.color = "#d4d8e0"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8090a8"; } }}
              >
                <span style={{ fontSize: 13, width: 16, flexShrink: 0 }}>{t.icon}</span>
                <span>{t.label}</span>
                {active && <span style={{ marginLeft: "auto", fontSize: 10 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Entries sidebar ───────────────────────────────────────────────
function EntriesSidebar({ refreshTrigger, onSelect, activeFile, onDeleted }) {
  const [entries,    setEntries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmDel, setConfirmDel] = useState(null); // filename pending delete
  const [delStep,    setDelStep]    = useState("pw");  // "pw" | "confirm"
  const [pwInput,    setPwInput]    = useState("");
  const [pwError,    setPwError]    = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  function openDelete(filename) {
    setConfirmDel(filename);
    setDelStep("pw");
    setPwInput("");
    setPwError(false);
  }

  function cancelDelete() {
    setConfirmDel(null);
    setPwInput("");
    setPwError(false);
  }

  function submitPw() {
    if (pwInput === "Jesiah") { setPwError(false); setDelStep("confirm"); }
    else { setPwError(true); setPwInput(""); }
  }

  const load = useCallback(() => {
    setLoading(true);
    (IS_TAURI
      ? invoke("list_entries").then(entries => ({ entries }))
      : fetch("/api/list-entries").then(r => r.json())
    ).then(d => { setEntries(d.entries || []); setLoading(false); })
     .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load, refreshTrigger]);

  async function handleDelete(filename) {
    setDeleting(true);
    try {
      const ok = IS_TAURI
        ? await invoke("delete_entry", { filename }).then(() => true).catch(() => false)
        : await fetch("/api/delete-entry", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename }) }).then(r => r.ok);
      if (ok) {
        setEntries(prev => prev.filter(e => e.filename !== filename));
        setConfirmDel(null);
        if (onDeleted) onDeleted(filename);
      }
    } catch (_) {}
    setDeleting(false);
  }

  return (
    <div style={{
      width: 240, flexShrink: 0,
      borderLeft: "1px solid #2a2e3a",
      background: "#15181f",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 12px",
        borderBottom: "1px solid #2a2e3a",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "#8090b0", fontFamily: MONO,
        }}>
          Entries
        </span>
        {entries.length > 0 && (
          <span style={{ fontSize: 11, color: "#8090b0", fontFamily: MONO }}>
            {entries.length}
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <div style={{ padding: "20px 16px", fontSize: 12, color: "#6070a0", fontFamily: MONO }}>
            loading…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div style={{ padding: "20px 16px", fontSize: 12, color: "#6070a0", fontStyle: "italic", lineHeight: 1.6 }}>
            No entries yet
          </div>
        )}

        {!loading && entries.map(e => {
          const isActive  = e.filename === activeFile;
          const isConfirm = confirmDel === e.filename;
          return (
            <div
              key={e.filename}
              style={{
                padding: "11px 14px",
                borderBottom: "1px solid #1e2230",
                borderLeft: isActive ? "2px solid #f472b6" : "2px solid transparent",
                background: isConfirm ? "rgba(232,84,84,0.08)" : isActive ? "rgba(244,114,182,0.07)" : "transparent",
                cursor: "pointer",
                transition: "background 0.1s",
                position: "relative",
              }}
              onClick={() => { if (!isConfirm) onSelect(e.filename); }}
              onMouseEnter={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "#1c2030"; }}
              onMouseLeave={ev => { if (!isActive && !isConfirm) ev.currentTarget.style.background = "transparent"; }}
            >
              {/* Filename */}
              <div style={{
                fontFamily: MONO, fontSize: 12,
                color: isActive ? "#f472b6" : "#c8d0e8",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginBottom: 6, paddingRight: 20,
              }}>
                {e.filename}
              </div>

              {/* Created */}
              {e.birthtime && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{
                    fontSize: 9, fontFamily: MONO, letterSpacing: "1.5px",
                    textTransform: "uppercase", color: "#405070",
                  }}>
                    created
                  </span>
                  <span style={{ fontSize: 11, color: "#6070a0", fontFamily: FONT }}>
                    {fmtDateTime(e.birthtime)}
                  </span>
                </div>
              )}

              {/* Edited — only show if different from created */}
              {e.mtime && e.mtime !== e.birthtime && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                  <span style={{
                    fontSize: 9, fontFamily: MONO, letterSpacing: "1.5px",
                    textTransform: "uppercase", color: isActive ? "#c060a0" : "#506080",
                  }}>
                    edited
                  </span>
                  <span style={{ fontSize: 11, color: isActive ? "#c878b8" : "#8090a8", fontFamily: FONT }}>
                    {fmtDateTime(e.mtime)}
                  </span>
                </div>
              )}

              {/* Size */}
              {e.size > 0 && (
                <span style={{ fontSize: 10, color: "#405070", fontFamily: MONO }}>
                  {fmtSize(e.size)}
                </span>
              )}

              {/* Delete flow */}
              {isConfirm ? (
                <div onClick={ev => ev.stopPropagation()} style={{ marginTop: 8 }}>
                  {delStep === "pw" ? (
                    <>
                      <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 5, letterSpacing: "1px" }}>
                        password required
                      </div>
                      <input
                        autoFocus
                        type="password"
                        value={pwInput}
                        onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                        onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDelete(); }}
                        placeholder="password"
                        style={{
                          width: "100%", boxSizing: "border-box",
                          background: "#0d0f14",
                          border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`,
                          borderRadius: 5, color: "#d4d8e0", fontSize: 12,
                          fontFamily: MONO, padding: "5px 8px", outline: "none",
                          marginBottom: 5,
                        }}
                      />
                      {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 5 }}>incorrect</div>}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={submitPw} style={{ flex: 1, padding: "4px 0", background: "#2a2e38", border: "none", borderRadius: 5, color: "#d4d8e0", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 8, lineHeight: 1.5 }}>
                        delete <span style={{ color: "#e85454" }}>{confirmDel}</span>?
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={cancelDelete} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                        <button onClick={() => handleDelete(confirmDel)} disabled={deleting} style={{ flex: 1, padding: "4px 0", background: "#e85454", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: deleting ? "default" : "pointer", opacity: deleting ? 0.6 : 1 }}>
                          {deleting ? "…" : "delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={ev => { ev.stopPropagation(); openDelete(e.filename); }}
                  title="Delete entry"
                  style={{
                    position: "absolute", top: 10, right: 10,
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3a4050", fontSize: 13, padding: 2, lineHeight: 1,
                    transition: "color 0.1s",
                  }}
                  onMouseEnter={ev => { ev.currentTarget.style.color = "#e85454"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.color = "#3a4050"; }}
                >✕</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function Talk2MePage() {
  const [target,     setTarget]     = useState(SAVE_TARGETS[0]);
  const [title,      setTitle]      = useState("");
  const [body,       setBody]       = useState("");
  const [status,     setStatus]     = useState(null);
  const [errMsg,     setErrMsg]     = useState("");
  const [refresh,    setRefresh]    = useState(0);
  const [activeFile, setActiveFile] = useState(null); // currently loaded entry filename
  const [editMode,   setEditMode]   = useState(false);  // true = editing existing, false = new
  const textRef = useRef(null);

  async function handleSelectEntry(filename) {
    // Clicking the active entry deselects (clears editor)
    if (filename === activeFile) {
      setActiveFile(null);
      setTitle("");
      setBody("");
      return;
    }
    try {
      let raw = "";
    if (IS_TAURI) {
      raw = await invoke("read_entry", { filename }).catch(() => "");
    } else {
      const res = await fetch(`/api/read-entry?filename=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (!res.ok) return;
      raw = data.content || "";
    }
      // Parse optional leading # Title
      const lines = raw.split("\n");
      if (lines[0].startsWith("# ")) {
        setTitle(lines[0].slice(2).trim());
        // skip the blank line after the title if present
        const rest = lines[1] === "" ? lines.slice(2) : lines.slice(1);
        setBody(rest.join("\n").trimEnd());
      } else {
        setTitle("");
        setBody(raw.trimEnd());
      }
      setActiveFile(filename);
      setEditMode(false); // loaded but not yet in edit mode
      setStatus(null);
      textRef.current?.focus();
    } catch (_) {}
  }

  function buildFilename() {
    const base = title.trim()
      ? title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40)
      : "entry";
    const prefix = target.id ? `${target.id}_` : "";
    return `${prefix}${base}_${slugDate()}.md`;
  }

  async function handleSave() {
    if (!body.trim()) return;
    setStatus("saving");
    setErrMsg("");

    const filename = (editMode && activeFile) ? activeFile : buildFilename();
    const content  = title.trim()
      ? `# ${title.trim()}\n\n${body.trim()}\n`
      : `${body.trim()}\n`;

    try {
      if (IS_TAURI) {
        await invoke("save_entry", { filename, content, courseId: target.id || null });
      } else {
        const res = await fetch("/api/save-entry", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, content, courseId: target.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "save failed");
      }

      setStatus("ok");
      if (!target.id) setRefresh(r => r + 1);

      setTimeout(() => {
        setTitle("");
        setBody("");
        setStatus(null);
        textRef.current?.focus();
      }, 1200);
    } catch (err) {
      setStatus("err");
      setErrMsg(err.message);
    }
  }

  const canSave   = body.trim().length > 0 && status !== "saving";
  const charCount = body.length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: FONT, background: "#111318" }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 20px", height: 54, flexShrink: 0,
        borderBottom: "1px solid #1e2230",
        background: "#15181f",
      }}>
        <SaveToPopover target={target} onSelect={setTarget} />

        <div style={{ flex: 1 }} />

        {status === "ok" && (
          <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>✓ saved</span>
        )}
        {status === "err" && (
          <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }} title={errMsg}>
            ✗ {errMsg.slice(0, 40)}
          </span>
        )}
        {status === "saving" && (
          <span style={{ fontSize: 12, color: "#55607a" }}>saving…</span>
        )}

        {activeFile && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #4ecdc455",
              background: "#4ecdc418", color: "#4ecdc4",
              fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer",
            }}
          >
            ✎ Edit
          </button>
        )}
        {editMode && (
          <button
            onClick={() => { setEditMode(false); setActiveFile(null); setTitle(""); setBody(""); setStatus(null); }}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #4a506055",
              background: "transparent", color: "#7a8090",
              fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer",
            }}
          >
            ✕ Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            padding: "8px 22px", borderRadius: 8, border: "none",
            background: canSave ? target.color : "#1e2230",
            color: canSave ? "#0e1014" : "#3a4052",
            fontSize: 13, fontWeight: 700, fontFamily: FONT,
            cursor: canSave ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          Save entry
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 32px 24px", gap: 14, overflow: "hidden" }}>

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              background: "transparent", border: "none", borderBottom: "1px solid #23262f",
              outline: "none", color: "#d4d8e8",
              fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700,
              padding: "4px 0 10px", flexShrink: 0,
            }}
          />

          <textarea
            ref={textRef}
            placeholder="Write something…"
            value={body}
            onChange={e => setBody(e.target.value)}
            readOnly={!!activeFile && !editMode}
            autoFocus
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#c0c6d4", fontFamily: FONT, fontSize: "0.97rem",
              lineHeight: 1.8, resize: "none", padding: 0,
            }}
          />

          <div style={{
            display: "flex", alignItems: "center",
            flexShrink: 0, paddingTop: 12, borderTop: "1px solid #1e2230",
          }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#3a4052" }}>
              {body.trim() ? ((editMode && activeFile) ? activeFile : buildFilename()) : "…"}
            </span>
            {charCount > 0 && (
              <span style={{ fontSize: 11, color: "#3a4052", marginLeft: 14 }}>
                {charCount} chars
              </span>
            )}
          </div>
        </div>

        {/* Entries sidebar */}
        <EntriesSidebar refreshTrigger={refresh} onSelect={handleSelectEntry} activeFile={activeFile} onDeleted={f => { if (f === activeFile) { setActiveFile(null); setTitle(""); setBody(""); } }} />

      </div>
    </div>
  );
}