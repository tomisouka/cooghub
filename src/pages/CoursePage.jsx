import { useState, useEffect, useRef } from "react";
import { getCourse } from "../data/subjects";
import { FLASHCARD_SETS } from "../data/flashcards";
import MarkdownViewer from "../components/MarkdownViewer";
import CodeViewer     from "../components/CodeViewer";
import HtmlViewer     from "../components/HtmlViewer";
import PDFViewer      from "../components/PDFViewer";

const BASE = "/references";
const FONT = "'Inter', 'Segoe UI', sans-serif";

const TABS = [
  { id: "references",  icon: "⊞",  label: "References"  },
  { id: "gopal",       icon: "📖", label: "Gopal"       },
  { id: "code",        icon: "⌥",  label: "Code"        },
  { id: "notes",       icon: "≡",  label: "Notes"       },
  { id: "assignments", icon: "✎",  label: "Assignments" },
  { id: "pdfs",        icon: "⎘",  label: "PDFs"        },
  { id: "flashcards",  icon: "⟁",  label: "Flashcards"  },
];

function flattenItems(items) {
  return items?.flatMap(item => item.type === "group" ? item.children : [item]) ?? [];
}

export default function CoursePage({ courseId, dest, onBack }) {
  const course = getCourse(courseId);
  if (!course) return null;

  const availableTabs = TABS.filter(t => {
    if (t.id === "flashcards") return !!course.flashcards;
    if (t.id === "gopal")      return !!course.gopal?.length;
    return course[t.id]?.length > 0;
  });

  const initialTab   = dest?.tab && availableTabs.find(t => t.id === dest.tab)
    ? dest.tab : availableTabs[0]?.id || "notes";
  const initialItems = initialTab === "code" ? course.code : course[initialTab];
  const initialFlat  = flattenItems(initialItems);
  const initialFile  = dest?.file || initialFlat?.[0]?.[initialTab === "code" ? "path" : "file"] || null;

  const [tab,          setTab]          = useState(initialTab);
  const [activeFile,   setActiveFile]   = useState(initialFile);
  const [codeHighlight, setCodeHighlight] = useState(initialTab === "code" ? dest?.query || null : null);
  const [collapsed,    setCollapsed]    = useState({});
  const [flipped,      setFlipped]      = useState(false);
  const [cardIdx,      setCardIdx]      = useState(0);
  const scrollContainerRef          = useRef(null);

  // Re-sync when dest changes (e.g. clicking a second search result for the same course)
  const prevDestRef  = useRef(dest);
  const destPdfPage  = useRef(dest?.pdfPage || null);
  const destPdfFile  = useRef(dest?.file    || null);
  useEffect(() => {
    if (dest && dest !== prevDestRef.current) {
      prevDestRef.current = dest;
      if (dest.tab)     setTab(dest.tab);
      if (dest.file)    setActiveFile(dest.file);
      if (dest.tab === "code") setCodeHighlight(dest.query || null);
      else setCodeHighlight(null);
      destPdfFile.current = dest.file    || null;
      destPdfPage.current = dest.pdfPage || null;
    }
  }, [dest]);

  const flashSet = course.flashcards
    ? FLASHCARD_SETS.find(s => s.id === course.flashcards)
    : null;

  function switchTab(id) {
    setTab(id);
    setCollapsed({});
    const items = id === "code" ? course.code : course[id];
    const flat  = flattenItems(items);
    const firstKey = flat?.[0]?.[id === "code" ? "path" : "file"] || null;
    setActiveFile(firstKey);
    setFlipped(false);
    setCardIdx(0);
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
      <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid #2a2e38", overflowY: "auto", display: "flex", flexDirection: "column", background: "#161920" }}>
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
            const isOpen = collapsed[item.label] === true;
            return (
              <div key={i}>
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [item.label]: !isOpen }))}
                  style={{
                    width: "100%", padding: "7px 16px 7px 12px",
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
                {isOpen && item.children.map((child, j) => {
                  const key = child[pathKey] || child.path || child.file;
                  const isActive = activeFile === key;
                  return (
                    <button key={j} onClick={() => { setActiveFile(key); setCodeHighlight(null); }} style={{
                      width: "100%", padding: "9px 16px 9px 24px",
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
                  );
                })}
              </div>
            );
          }

          const key = item[pathKey] || item.path || item.file;
          const isActive = activeFile === key;
          return (
            <button key={i} onClick={() => { setActiveFile(key); setCodeHighlight(null); }} style={{
              width: "100%", padding: "10px 16px",
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
          );
        })}
        </div>
      </div>
    );
  }

  function Viewer() {
    if (!activeFile) return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5060", fontFamily: FONT, fontSize: 14, fontWeight: 500 }}>
        select a file
      </div>
    );
    if (tab === "references" || tab === "gopal" || tab === "assignments") {
      const items = tab === "assignments" ? course.assignments : course[tab];
      const flat  = flattenItems(items);
      const item  = flat.find(r => r.file === activeFile);
      if (!item) return null;
      if (item.type === "iframe") return <iframe src={`${BASE}/${item.file}`} style={{ flex: 1, border: "none", background: "#fff" }} title={item.label} />;
      return <HtmlViewer ref_={{ ...item, color: course.color }} BASE="/references" />;
    }
    if (tab === "code") return <div style={{ flex: 1, overflowY: "auto" }}><CodeViewer filePath={activeFile} highlight={codeHighlight} /></div>;
    if (tab === "pdfs") {
      const page = destPdfFile.current === activeFile && destPdfPage.current
        ? destPdfPage.current : 1;
      return <PDFViewer file={activeFile} initialPage={page} highlight={dest?.query} />;
    }
    return (
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto" }}>
        <MarkdownViewer filePath={activeFile} color={course.color} highlight={dest?.query} scrollContainer={scrollContainerRef} />
      </div>
    );
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 24px", height: 52, flexShrink: 0, borderBottom: "1px solid #2a2e38", background: "#161920" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7a8090", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1, transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#d4d8e0"} onMouseLeave={e => e.currentTarget.style.color = "#7a8090"}>←</button>
        <span style={{ fontSize: 18 }}>{course.icon}</span>
        <span style={{ color: "#d4d8e0", fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{course.label}</span>
        {course.courseCode && <span style={{ color: "#7a8090", fontSize: 12, fontFamily: FONT, fontWeight: 500 }}>{course.courseCode}</span>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {availableTabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)} style={{
              padding: "5px 14px", border: "none", borderRadius: 6,
              background: tab === t.id ? "#21252e" : "transparent",
              color: tab === t.id ? course.color : "#8a90a0",
              fontSize: 12, cursor: "pointer", fontFamily: FONT, fontWeight: 600,
              borderBottom: tab === t.id ? `2px solid ${course.color}` : "2px solid transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = "#b0b8c8"; }}
              onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = "#8a90a0"; }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {tab === "flashcards" ? <Flashcards /> :
         <><FileList items={tab === "code" ? course.code : course[tab]} pathKey={tab === "code" ? "path" : "file"} /><Viewer /></>
        }
      </div>
    </div>
  );
}