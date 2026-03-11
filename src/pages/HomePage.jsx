import { useState, useEffect, useRef } from "react";
import { DEPARTMENTS } from "../data/subjects";
import { buildSearchIndex, loadPdfIndex, searchTextIndex, searchPdfIndex, resolveResult } from "../search";

const FONT = "'Inter', 'Segoe UI', sans-serif";

function HighlightSnippet({ text, query }) {
  if (!query || !text) return <span>{text}</span>;
  const q = query.trim().toLowerCase();
  if (!q) return <span>{text}</span>;
  const parts = [];
  let last = 0;
  const lower = text.toLowerCase();
  while (true) {
    const idx = lower.indexOf(q, last);
    if (idx === -1) { parts.push(<span key={last}>{text.slice(last)}</span>); break; }
    if (idx > last) parts.push(<span key={last}>{text.slice(last, idx)}</span>);
    parts.push(<mark key={idx} style={{ background: "#e8c54755", color: "#e8c547", borderRadius: 2, padding: "0 1px" }}>{text.slice(idx, idx + q.length)}</mark>);
    last = idx + q.length;
  }
  return <>{parts}</>;
}

export default function HomePage({ goTo, openUpload }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [index, setIndex]       = useState(null);
  const [pdfIdx, setPdfIdx]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const debounce                = useRef(null);
  const inputRef                = useRef(null);
  const dropdownRef             = useRef(null);

  // Build indexes on mount
  useEffect(() => {
    buildSearchIndex().then(setIndex);
    loadPdfIndex().then(setPdfIdx);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleQuery(q) {
    setQuery(q);
    clearTimeout(debounce.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debounce.current = setTimeout(() => {
      setLoading(true);
      const text = index ? searchTextIndex(index, q) : [];
      const pdfs = pdfIdx ? searchPdfIndex(pdfIdx, q) : [];
      setResults([...text, ...pdfs].slice(0, 20));
      setLoading(false);
    }, 200);
  }

  function handleResult(r) {
    const dest = resolveResult(r);
    if (!dest) return;
    const q = query;
    setQuery("");
    setResults([]);
    if (dest.page === "talk2me") { goTo("talk2me"); return; }
    goTo(dest.page, dest.courseId, { ...dest, query: q });
  }

  const typeColor = { note: "#4ecdc4", code: "#e8c547", pdf: "#e85454", talk2me: "#a78bfa" };

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 48px", fontFamily: FONT,
    }}>
      <div style={{ width: "100%", maxWidth: 680 }}>

        {/* Title */}
        <h1 style={{
          fontSize: 48, fontWeight: 700, color: "#f0f0f0",
          marginBottom: 8, letterSpacing: "-0.5px",
        }}>
          Coogs <span style={{ color: "#e8c547" }}>Hub</span>
        </h1>
        <p style={{ color: "#7a8090", fontSize: 14, fontWeight: 500, marginBottom: 40 }}>
          Spring 2026 — search notes, code, and PDFs
        </p>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 48 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#1a1d24", border: "1px solid #2a2e38",
            borderRadius: 12, padding: "14px 18px",
            transition: "border-color 0.15s",
          }}
            onFocus={() => {}}
          >
            <span style={{ color: "#4a5060", fontSize: 16 }}>⌕</span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleQuery(e.target.value)}
              placeholder="Search notes, code, PDFs…"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#d4d8e0", fontSize: 15, fontFamily: FONT, fontWeight: 500,
              }}
            />
            <button
              onClick={() => openUpload?.()}
              style={{
                background: "none", border: "1px solid #2a2e38", borderRadius: 7,
                color: "#7a8090", fontSize: 11, fontFamily: FONT, fontWeight: 600,
                letterSpacing: "1.5px", textTransform: "uppercase",
                padding: "6px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.color = "#e8c547"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.color = "#7a8090"; }}
            >
              ⊕ Add Files
            </button>
          </div>

          {/* Results dropdown */}
          {(results.length > 0 || (loading && query.length >= 2)) && (
            <div ref={dropdownRef} style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
              background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 12,
              zIndex: 50, boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              display: "flex", flexDirection: "column",
              maxHeight: "min(520px, 65vh)",
            }}>
              {/* Header: result count */}
              <div style={{
                padding: "8px 18px", borderBottom: "1px solid #2a2e38",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <span style={{ color: "#4a5060", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>
                  {loading ? "searching…" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
                </span>
                <span style={{ color: "#2a2e38", fontSize: 11 }}>scroll to see all</span>
              </div>
              {/* Scrollable results */}
              <div style={{ overflowY: "auto", flex: 1 }}>
              {results.map((r, i) => (
                <div
                  key={r.id || i}
                  onClick={() => handleResult(r)}
                  style={{
                    padding: "12px 18px", cursor: "pointer",
                    borderBottom: "1px solid #21252e",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#21252e"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "1px",
                      color: typeColor[r.type] || "#7a8090",
                      textTransform: "uppercase",
                    }}>
                      {r.type}
                    </span>
                    <span style={{ color: "#d4d8e0", fontSize: 13, fontWeight: 600 }}>
                      <HighlightSnippet text={r.label} query={query} />
                    </span>
                    {r.page && <span style={{ color: "#4a5060", fontSize: 11 }}>p.{r.page}</span>}
                  </div>
                  {r.snippet && (
                    <div style={{
                      color: "#7a8090", fontSize: 12, fontWeight: 400,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      <HighlightSnippet text={r.snippet} query={query} />
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* COSC / MATH buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => goTo(dept.id)}
              style={{
                background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 12,
                padding: "28px 32px", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s", fontFamily: FONT,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = dept.color; e.currentTarget.style.background = "#21252e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.background = "#1a1d24"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{dept.icon}</div>
              <div style={{ color: dept.color, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                {dept.label}
              </div>
              <div style={{ color: "#7a8090", fontSize: 13, fontWeight: 500 }}>
                {dept.courses.length} courses
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}