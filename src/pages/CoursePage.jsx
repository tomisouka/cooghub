import { useState, useEffect, useRef } from "react";
import { getCourse } from "../data/subjects";
import { FLASHCARD_SETS } from "../data/flashcards";
import MarkdownViewer  from "../components/MarkdownViewer";
import CodeViewer      from "../components/CodeViewer";
import PDFViewer       from "../components/PDFViewer";
import ReferenceViewer from "../components/ReferenceViewer";
import { useIsMobile } from "../hooks/useIsMobile";
import { TABS } from "../data/tabs";

const BASE = "/references";
const FONT = "'Inter', 'Segoe UI', sans-serif";

// TABS imported from data/tabs.js

function flattenItems(items) {
  return items?.flatMap(item => item.type === "group" ? item.children : [item]) ?? [];
}

// ── PrevNextBar ───────────────────────────────────────────────────────────────
function PrevNextBar({ flat, activeFile, onPrev, onNext, isMobile, onBackToList }) {
  const flatIdx = flat ? flat.findIndex(r => r.file === activeFile) : -1;
  const hasPrev = flatIdx > 0;
  const hasNext = flat && flatIdx < flat.length - 1;
  const multiFile = flat && flat.length > 1;

  // On mobile: always render (for the back-to-list button).
  // On desktop: only render when there are multiple files.
  if (!isMobile && !multiFile) return null;
  if (flatIdx === -1 && !isMobile) return null;

  const btn = (enabled, onClick, label) => (
    <button onClick={() => enabled && onClick()} disabled={!enabled}
      style={{ background: "none", border: "none", cursor: enabled ? "pointer" : "default",
        color: enabled ? "#7a8090" : "#2a2e38", fontSize: 13, fontFamily: FONT, padding: "0 4px" }}
      onMouseEnter={e => { if (enabled) e.currentTarget.style.color = "#d4d8e0"; }}
      onMouseLeave={e => { if (enabled) e.currentTarget.style.color = "#7a8090"; }}
    >{label}</button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8,
      padding: "5px 14px", background: "#161920",
      borderBottom: "1px solid #2a2e38", flexShrink: 0 }}>
      {isMobile && onBackToList && (
        <button onClick={onBackToList}
          style={{ background: "none", border: "none", cursor: "pointer",
            color: "#7a8090", fontSize: 13, fontFamily: FONT, padding: "0 4px",
            fontWeight: 700, marginRight: 2 }}
          onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
          onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}
        >«</button>
      )}
      {multiFile && btn(hasPrev, onPrev, "← prev")}
      {flatIdx !== -1 && (
        <span style={{ color: "#4a5060", fontSize: 11, fontFamily: FONT, fontWeight: 500 }}>
          {multiFile ? `${flatIdx + 1} / ${flat.length}` : ""}
        </span>
      )}
      <span style={{ color: "#7a8090", fontSize: 11, fontFamily: FONT, fontWeight: 500,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
        maxWidth: isMobile ? "160px" : "300px" }}>
        {flat?.[flatIdx]?.label || activeFile?.split("/").pop() || ""}
      </span>
      {multiFile && btn(hasNext, onNext, "next →")}
    </div>
  );
}

// ── IframeWithLoader ──────────────────────────────────────────────────────────
// Proper component (has hooks) — shows a spinner while the iframe page loads,
// then fades it out. Stays mounted (display toggled) so scroll is preserved.
function IframeWithLoader({ src, title, visible }) {
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state when src changes (new page selected)
  useEffect(() => { setLoaded(false); }, [src]);

  return (
    <div style={{ position: "absolute", inset: 0, display: visible ? "block" : "none" }}>
      {/* Spinner overlay — shown until iframe fires onLoad */}
      {!loaded && src && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "#111318", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "3px solid #2a2e38", borderTopColor: "#e8c547",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "#4a5060", fontSize: 12, fontFamily: FONT }}>{title}</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", background: "#fff" }}
      />
    </div>
  );
}

export default function CoursePage({ courseId, dest, onBack, onBackToSearch }) {
  const course = getCourse(courseId);
  if (!course) return null;

  const availableTabs = TABS.filter(t => {
    if (t.id === "overview")   return !!course.overview;
    if (t.id === "flashcards") return !!course.flashcards;
    if (t.id === "gopal")      return !!course.gopal?.length;
    return course[t.id]?.length > 0;
  });

  const initialTab   = dest?.tab && availableTabs.find(t => t.id === dest.tab)
    ? dest.tab : availableTabs[0]?.id || "notes";
  const initialItems = initialTab === "code" ? course.code : (Array.isArray(course[initialTab]) ? course[initialTab] : []);
  const initialFlat  = flattenItems(initialItems);
  const initialFile  = dest?.file || initialFlat?.[0]?.[initialTab === "code" ? "path" : "file"] || null;

  const [tab,          setTab]          = useState(initialTab);
  const [activeFile,   setActiveFile]   = useState(initialFile);
  const [codeHighlight, setCodeHighlight] = useState(initialTab === "code" ? dest?.query || null : null);
  const [collapsed,    setCollapsed]    = useState({});
  const [flipped,      setFlipped]      = useState(false);
  const [cardIdx,      setCardIdx]      = useState(0);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);

  const isMobile                        = useIsMobile();
  // If arriving from search with a specific file, go straight to content on mobile
  const [showList,     setShowList]     = useState(!(isMobile && dest?.file));
  const scrollContainerRef              = useRef(null);
  const visitedFiles                    = useRef(new Set(initialFile ? [initialFile] : []));

  // Re-sync when dest changes (e.g. clicking a second search result for the same course)
  const prevDestRef  = useRef(null);
  const destPdfPage  = useRef(dest?.pdfPage || null);
  const destPdfFile  = useRef(dest?.file    || null);
  useEffect(() => {
    if (!dest) return;
    // Use a string key so we detect any change in target, not just object reference
    const key = `${dest.tab}::${dest.file}::${dest.pdfPage}`;
    if (key === prevDestRef.current) return;
    prevDestRef.current = key;
    if (dest.tab)     setTab(dest.tab);
    if (dest.file)  { setActiveFile(dest.file); visitedFiles.current.add(dest.file); }
    if (dest.tab === "code") setCodeHighlight(dest.query || null);
    else setCodeHighlight(null);
    destPdfFile.current = dest.file    || null;
    destPdfPage.current = dest.pdfPage || null;
    // On mobile, jump straight to content when navigating from search
    if (isMobile && dest.file) setShowList(false);
  }, [dest]);

  const flashSet = course.flashcards
    ? FLASHCARD_SETS.find(s => s.id === course.flashcards)
    : null;

  function switchTab(id) {
    setTab(id);
    setCollapsed({});
    const items = id === "code" ? course.code : (Array.isArray(course[id]) ? course[id] : []);
    const flat  = flattenItems(items);
    const firstKey = flat?.[0]?.[id === "code" ? "path" : "file"] || null;
    setActiveFile(firstKey);
    setFlipped(false);
    setCardIdx(0);
    if (isMobile) setShowList(true);
  }

  function FileList({ items, pathKey = "file" }) {
    const [filter, setFilter] = useState("");

    const query = filter.trim().toLowerCase();

    function itemMatchesFilter(item) {
      if (!query) return true;
      if (item.type === "group") return item.children.some(c => c.label.toLowerCase().includes(query));
      return item.label.toLowerCase().includes(query);
    }

    function filteredItems() {
      if (!query) return items;
      return items
        .map(item => {
          if (item.type !== "group") return itemMatchesFilter(item) ? item : null;
          const kids = item.children.filter(c => c.label.toLowerCase().includes(query));
          return kids.length ? { ...item, children: kids } : null;
        })
        .filter(Boolean);
    }

    const visibleItems = filteredItems();

    return (
      <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid #2a2e38", overflowY: "auto", display: "flex", flexDirection: "column", background: "#161920", position: "relative" }}>
        {(tab === "references" || tab === "gopal") && (
          <div style={{ padding: "10px 10px 6px", flexShrink: 0, borderBottom: "1px solid #1e2230" }}>
            <input
              type="text"
              placeholder="filter…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#21252e", border: "1px solid #2a2e38", borderRadius: 6,
                color: "#d4d8e0", fontSize: 12, fontFamily: FONT, fontWeight: 500,
                padding: "5px 9px", outline: "none",
              }}
            />
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {visibleItems.map((item, i) => {

          if (item.type === "group") {
            const isOpen   = collapsed[item.label] === true;
            const groupKey = `group:${item.label}`;
            return (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={() => setCollapsed(c => ({ ...c, [item.label]: !isOpen }))}
                    style={{
                      flex: 1, padding: "7px 8px 7px 12px",
                      background: "transparent", border: "none",
                      borderTop: i !== 0 ? "1px solid #1e2230" : "none",
                      borderBottom: "1px solid #1e2230",
                      color: course.color, fontSize: 10, fontFamily: FONT, fontWeight: 700,
                      cursor: "pointer", textAlign: "left", letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    {item.label}
                    <span style={{ fontSize: 9, color: "#7a8090", marginLeft: 4 }}>{isOpen ? "▾" : "▸"}</span>
                  </button>
                </div>
                {isOpen && item.children.map((child, j) => {
                  const key      = child[pathKey] || child.path || child.file;
                  const isActive = activeFile === key;
                  return (
                    <div
                      key={j}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <button onClick={() => { setActiveFile(key); setCodeHighlight(null); if (isMobile) setShowList(false); }} style={{
                        flex: 1, padding: "9px 8px 9px 24px",
                        background: isActive ? "#21252e" : "transparent",
                        border: "none",
                        borderLeft: `2px solid ${isActive ? course.color : "transparent"}`,
                        color: isActive ? "#d4d8e0" : "#8a90a0",
                        fontSize: 13, fontFamily: FONT, fontWeight: isActive ? 600 : 500,
                        cursor: "pointer", textAlign: "left", transition: "all 0.1s",
                      }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#b0b8c8"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#8a90a0"; }}
                      >
                        {query && <span style={{ fontSize: 10, color: "#4a5060", fontWeight: 600, marginRight: 5, letterSpacing: "0.5px" }}>{item.label} /</span>}
                        {child.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          }

          const key      = item[pathKey] || item.path || item.file;
          const isActive = activeFile === key;
          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center" }}
            >
              <button onClick={() => { setActiveFile(key); setCodeHighlight(null); if (isMobile) setShowList(false); }} style={{
                flex: 1, padding: "10px 8px 10px 16px",
                background: isActive ? "#21252e" : "transparent",
                border: "none",
                borderLeft: `2px solid ${isActive ? course.color : "transparent"}`,
                color: isActive ? "#d4d8e0" : "#8a90a0",
                fontSize: 13, fontFamily: FONT, fontWeight: isActive ? 600 : 500,
                cursor: "pointer", textAlign: "left", transition: "all 0.1s",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#b0b8c8"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#8a90a0"; }}
              >
                {item.label}
              </button>
            </div>
          );
        })}
        </div>
      </div>
    );
  }

  function Viewer(onBackToList = null) {
    if (!activeFile) return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontFamily: FONT, fontSize: 14, fontWeight: 500 }}>
        select a file
      </div>
    );

    if (tab === "references" || tab === "gopal" || tab === "assignments") {
      const items    = tab === "assignments" ? course.assignments : course[tab];
      const flat     = flattenItems(items);
      const flatIdx  = flat.findIndex(r => r.file === activeFile);
      const hasPrev  = flatIdx > 0;
      const hasNext  = flatIdx < flat.length - 1;

      // All items (references, gopal, assignments) render via ReferenceViewer.
      // type:"iframe" = scripted files (DFA sim, DP viz) → srcdoc iframe inside ReferenceViewer
      // type:"content" = ./content/ assignment HTMLs → fetched via /src/ basePath
      // everything else = public/references/ pages → default /references basePath
      const allItems = flat;

      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Prev / Next bar */}
          <PrevNextBar
            flat={flat} activeFile={activeFile} isMobile={isMobile}
            onBackToList={onBackToList}
            onPrev={() => { setActiveFile(flat[flat.findIndex(r => r.file === activeFile) - 1].file); }}
            onNext={() => { setActiveFile(flat[flat.findIndex(r => r.file === activeFile) + 1].file); }}
          />
          <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
            {allItems.map(item => {
              const isContent = item.type === "content";
              // content files live under src/content/ and are served by Vite at /src/content/
              const basePath  = isContent ? "/src/content" : "/references";
              const filePath  = isContent ? item.file.replace("./content/", "") : item.file;
              return (
                <div key={item.file} style={{
                  display: item.file === activeFile ? "flex" : "none",
                  position: "absolute", inset: 0, flexDirection: "column",
                }}>
                  {item.file === activeFile && (
                    <ReferenceViewer
                      file={filePath}
                      basePath={basePath}
                      color={course.color}
                      highlight={dest?.query || null}
                      highlightKey={dest?._ts || null}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (tab === "code") {
      const flat = flattenItems(course.code).map(i => ({ ...i, file: i.path }));
      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <PrevNextBar flat={flat} activeFile={activeFile} isMobile={isMobile}
            onBackToList={onBackToList}
            onPrev={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) - 1].file)}
            onNext={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) + 1].file)}
          />
          <div style={{ flex: 1, overflowY: "auto" }}><CodeViewer filePath={activeFile} highlight={codeHighlight} highlightKey={dest?._ts} /></div>
        </div>
      );
    }
    if (tab === "pdfs") {
      const flat = flattenItems(course.pdfs);
      const page = destPdfFile.current === activeFile && destPdfPage.current ? destPdfPage.current : 1;
      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <PrevNextBar flat={flat} activeFile={activeFile} isMobile={isMobile}
            onBackToList={onBackToList}
            onPrev={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) - 1].file)}
            onNext={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) + 1].file)}
          />
          <PDFViewer file={activeFile} initialPage={page} highlight={dest?.query} highlightKey={dest?._ts} />
        </div>
      );
    }
    // notes (markdown)
    {
      const flat = flattenItems(course.notes);
      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <PrevNextBar flat={flat} activeFile={activeFile} isMobile={isMobile}
            onBackToList={onBackToList}
            onPrev={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) - 1].file)}
            onNext={() => setActiveFile(flat[flat.findIndex(r => r.file === activeFile) + 1].file)}
          />
          <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto" }}>
            <MarkdownViewer filePath={activeFile} color={course.color} highlight={dest?.query} highlightKey={dest?._ts} scrollContainer={scrollContainerRef} />
          </div>
        </div>
      );
    }
  }

  function Flashcards() {
    if (!flashSet) return <div style={{ padding: 32, color: "#7a8090", fontFamily: FONT, fontSize: 14 }}>no flashcard set found</div>;
    const card = flashSet.cards[cardIdx];
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 40 }}>
        <div style={{ color: "#7a8090", fontFamily: FONT, fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
          {cardIdx + 1} / {flashSet.cards.length}
        </div>
        <div onClick={() => setFlipped(f => !f)} style={{
          width: "100%", maxWidth: 520, minHeight: 200, background: "#1a1d24",
          border: `1px solid ${flipped ? course.color + "66" : "#2a2e38"}`, borderRadius: 16,
          padding: "36px 40px", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{ fontSize: 11, color: "#7a8090", fontFamily: FONT, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
            {flipped ? "answer" : "question"}
          </div>
          <div style={{ fontSize: 16, color: flipped ? "#d4d8e0" : "#a0a8b8", textAlign: "center", lineHeight: 1.6, fontFamily: FONT, fontWeight: 500 }}>
            {flipped ? card.a : card.q}
          </div>
          {!flipped && <div style={{ fontSize: 12, color: "#4a5060", fontFamily: FONT }}>click to reveal</div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={cardIdx === 0}
            style={{ padding: "8px 20px", background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 8, color: cardIdx === 0 ? "#3a4052" : "#a0a8b8", cursor: cardIdx === 0 ? "default" : "pointer", fontSize: 13, fontFamily: FONT, fontWeight: 500 }}>
            ← prev
          </button>
          <button onClick={() => { setFlipped(false); setCardIdx(i => Math.min(flashSet.cards.length - 1, i + 1)); }} disabled={cardIdx === flashSet.cards.length - 1}
            style={{ padding: "8px 20px", background: "#1a1d24", border: "1px solid #2a2e38", borderRadius: 8, color: cardIdx === flashSet.cards.length - 1 ? "#3a4052" : course.color, cursor: cardIdx === flashSet.cards.length - 1 ? "default" : "pointer", fontSize: 13, fontFamily: FONT, fontWeight: 500 }}>
            next →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, padding: isMobile ? "0 12px" : "0 24px", height: 52, flexShrink: 0, borderBottom: "1px solid #2a2e38", background: "#161920" }}>
        {/* On mobile in content view, back arrow goes back to file list */}
        <button onClick={onBack}
          style={{ background: "none", border: "none", color: "#7a8090", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"}
          onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}>←</button>
        {!isMobile && tab !== "flashcards" && tab !== "overview" && (
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: "#1e2230", border: "1px solid #2a2e38", borderRadius: 5,
              color: "#7a8090", fontSize: 11, cursor: "pointer",
              padding: "3px 7px", lineHeight: 1, transition: "all 0.15s",
              fontFamily: FONT, fontWeight: 700,
            }}
            title={sidebarOpen ? "collapse sidebar" : "expand sidebar"}
            onMouseEnter={e => { e.currentTarget.style.color = "#d4d8e0"; e.currentTarget.style.borderColor = "#4a5060"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#7a8090"; e.currentTarget.style.borderColor = "#2a2e38"; }}
          >{sidebarOpen ? "« hide" : "» show"}</button>
        )}
        <span style={{ fontSize: 18 }}>{course.icon}</span>
        <span style={{ color: "#d4d8e0", fontSize: isMobile ? 13 : 15, fontWeight: 600, fontFamily: FONT }}>{course.label}</span>
        {course.courseCode && !isMobile && <span style={{ color: "#7a8090", fontSize: 12, fontFamily: FONT, fontWeight: 500 }}>{course.courseCode}</span>}
        {/* Back-to-search pill — shown when user arrived via search */}
        {onBackToSearch && dest?.query && (
          <button
            onClick={onBackToSearch}
            title={`Back to search: "${dest.query}"`}
            style={{
              background: "#1e2230", border: "1px solid #2a2e38", borderRadius: 20,
              color: "#e8c547", fontSize: 11, fontFamily: FONT, fontWeight: 600,
              padding: "3px 10px", cursor: "pointer", display: "flex", alignItems: "center",
              gap: 5, whiteSpace: "nowrap", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.background = "#252a38"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2e38"; e.currentTarget.style.background = "#1e2230"; }}
          >
            ⌕ {isMobile ? "" : `"${dest.query.length > 18 ? dest.query.slice(0, 18) + "…" : dest.query}"`}
            {isMobile && <span style={{ color: "#7a8090", fontWeight: 400 }}>back to search</span>}
          </button>
        )}
        {/* Tab bar */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, overflowX: "auto", maxWidth: isMobile ? "55vw" : "unset" }}>
          {availableTabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)} style={{
              padding: isMobile ? "5px 8px" : "5px 14px", border: "none", borderRadius: 6,
              background: tab === t.id ? "#21252e" : "transparent",
              color: tab === t.id ? course.color : "#8a90a0",
              fontSize: isMobile ? 11 : 12, cursor: "pointer", fontFamily: FONT, fontWeight: 600,
              borderBottom: tab === t.id ? `2px solid ${course.color}` : "2px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            }}
              onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = "#b0b8c8"; }}
              onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = "#8a90a0"; }}
            >
              {t.icon}{!isMobile && ` ${t.label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Body — Viewer() called as plain function (not <Viewer />) so React never
           unmounts/remounts it on re-render, keeping iframes alive across file switches.
           FileList and Flashcards are normal JSX — they have their own hooks and can't
           be called as plain functions without violating Rules of Hooks. */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, minWidth: 0, overflow: "hidden" }}>
        {tab === "overview" ? (
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "28px 18px 60px" : "52px 56px 72px" }}>
            {/* Course title block */}
            <div style={{ marginBottom: isMobile ? 32 : 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{course.icon}</span>
                <div>
                  <div style={{ color: course.color, fontSize: 11, fontWeight: 700, fontFamily: FONT, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>
                    {course.courseCode || "Course Overview"}
                  </div>
                  <h1 style={{ margin: 0, color: "#eceef4", fontSize: isMobile ? 24 : 32, fontWeight: 700, fontFamily: FONT, lineHeight: 1.2 }}>
                    {course.label}
                  </h1>
                </div>
              </div>
              {course.overview.tagline && (
                <p style={{ margin: "0", color: "#8090a8", fontSize: 15, fontFamily: FONT, fontWeight: 400, lineHeight: 1.6 }}>
                  {course.overview.tagline}
                </p>
              )}
            </div>

            {/* Lane cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}>
              {course.overview.lanes.map(lane => (
                <div key={lane.id} style={{
                  background: "#1c1f28",
                  border: `1px solid ${lane.color}44`,
                  borderTop: `4px solid ${lane.color}`,
                  borderRadius: 14,
                  padding: "24px 24px 20px",
                  display: "flex", flexDirection: "column", gap: 16,
                }}>
                  {/* Lane header */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 22, background: lane.color + "22",
                        border: `1px solid ${lane.color}44`,
                        borderRadius: 8, padding: "6px 10px", lineHeight: 1,
                      }}>{lane.icon}</span>
                      <span style={{ color: lane.color, fontSize: 17, fontWeight: 700, fontFamily: FONT }}>
                        {lane.title}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "#9098b0", fontSize: 13, fontFamily: FONT, lineHeight: 1.75, fontWeight: 400 }}>
                      {lane.description}
                    </p>
                  </div>

                  {/* Pinned files */}
                  {lane.pins?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#505870", fontFamily: FONT, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 2 }}>
                        Quick access
                      </div>
                      {lane.pins.map((pin, i) => (
                        <button
                          key={i}
                          onClick={() => { setTab(pin.tab); setActiveFile(pin.file); setCodeHighlight(null); if (isMobile) setShowList(false); }}
                          style={{
                            background: "#13151c", border: `1px solid ${lane.color}33`,
                            borderLeft: `3px solid ${lane.color}`,
                            borderRadius: 7, padding: "9px 13px",
                            color: "#c8d0e0", fontSize: 13, fontFamily: FONT, fontWeight: 500,
                            cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#1e2230"; e.currentTarget.style.color = "#eceef4"; e.currentTarget.style.borderLeftColor = lane.color; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#13151c"; e.currentTarget.style.color = "#c8d0e0"; e.currentTarget.style.borderLeftColor = lane.color + "88"; }}
                        >
                          {pin.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Go to full tab */}
                  <button
                    onClick={() => switchTab(lane.tab)}
                    style={{
                      marginTop: "auto",
                      background: lane.color + "18",
                      border: `1px solid ${lane.color}55`,
                      borderRadius: 8, padding: "10px 16px",
                      color: lane.color, fontSize: 13, fontFamily: FONT, fontWeight: 700,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = lane.color + "30"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = lane.color + "18"; }}
                  >
                    Open {lane.title} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : tab === "flashcards" ? <Flashcards /> : (
          <>
            {/* Mobile: show list OR content. Desktop: show sidebar (maybe collapsed) + content */}
            {isMobile ? (
              <>
                {showList && <FileList items={tab === "code" ? course.code : course[tab]} pathKey={tab === "code" ? "path" : "file"} />}
                {!showList && Viewer(() => setShowList(true))}
              </>
            ) : (
              <>
                {/* Desktop sidebar — always rendered, just collapsed to a thin strip */}
                {sidebarOpen
                  ? <FileList items={tab === "code" ? course.code : course[tab]} pathKey={tab === "code" ? "path" : "file"} />
                  : (
                    <div
                      onClick={() => setSidebarOpen(true)}
                      title="expand sidebar"
                      style={{
                        width: 24, flexShrink: 0,
                        borderRight: "1px solid #2a2e38",
                        background: "#161920",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#21252e"}
                      onMouseLeave={e => e.currentTarget.style.background = "#161920"}
                    >
                      <span style={{ color: "#7a8090", fontSize: 12, fontFamily: FONT, writingMode: "vertical-rl", userSelect: "none", fontWeight: 700 }}>»</span>
                    </div>
                  )
                }
                {Viewer()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}