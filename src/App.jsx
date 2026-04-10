import { useState, useEffect, useRef, useCallback } from "react";
import { highlightAll, clearHighlights, findNext, findPrev } from "./utils/domFind";
import { DataProvider, useData } from "./data/DataContext";
import Sidebar             from "./components/Sidebar";
import DropZone            from "./components/DropZone";
import FileInventoryModal  from "./components/FileInventoryModal";
import HomePage            from "./pages/HomePage";
import DeptPage            from "./pages/DeptPage";
import CoursePage          from "./pages/CoursePage";
import OsHubPage           from "./pages/OsHubPage";
import AgendaPage           from "./pages/AgendaPage";
import TicketsPage         from "./pages/TicketsPage";
import RoadMap             from "./pages/RoadMap";
import DeadlinesPage       from "./pages/DeadlinesPage";
import ProgressPage        from "./pages/ProgressPage";
import ResourcesPage      from "./pages/ResourcesPage";
import SignalNoisePage    from "./pages/SignalNoisePage";
import { useIsMobile }     from "./hooks/useIsMobile";

function AppInner() {
  const { NAV, getCourse, reloadData } = useData();
  const [nav, setNav]               = useState("home");
  const [course, setCourse]         = useState(null);
  const [hub,    setHub]            = useState(null);
  const [dest, setDest]             = useState(null);
  const [showDrop, setShowDrop]     = useState(false);
  const [showInventory, setShowInv] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);
  const isMobile                    = useIsMobile();

  // ── In-page find bar (Ctrl+F) ─────────────────────────────────────────────
  const [findOpen,  setFindOpen]  = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [findStats, setFindStats] = useState({ current: 0, total: 0 });
  const findInputRef = useRef(null);
  const findOpenRef  = useRef(false);

  const closeFind = useCallback(() => {
    setFindOpen(false);
    setFindQuery("");
    setFindStats({ current: 0, total: 0 });
    findOpenRef.current = false;
    clearHighlights();
  }, []);

  const handleFindChange = useCallback((val) => {
    setFindQuery(val);
    if (!val || !val.trim()) {
      setFindStats({ current: 0, total: 0 });
      clearHighlights();
      return;
    }
    // highlightAll now runs after rAF (post React commit) and returns 0 immediately.
    // Real count arrives via onUpdate once the DOM pass completes.
    highlightAll(val, (total) => {
      setFindStats({ current: total > 0 ? 1 : 0, total });
    });
    findInputRef.current?.focus();
  }, []);

  const handleNext = useCallback(() => {
    const stats = findNext();
    setFindStats(stats);
    findInputRef.current?.focus();
  }, []);

  const handlePrev = useCallback(() => {
    const stats = findPrev();
    setFindStats(stats);
    findInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setFindOpen(true);
        findOpenRef.current = true;
        setTimeout(() => { findInputRef.current?.focus(); findInputRef.current?.select(); }, 30);
      }
      if (e.key === "Escape" && findOpenRef.current) closeFind();
      if (e.key === "Enter" && findOpenRef.current && document.activeElement === findInputRef.current) {
        e.preventDefault();
        e.shiftKey ? handlePrev() : handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeFind, handleNext, handlePrev]);

  // Ctrl+Shift+I → open devtools in Tauri (right-click inspect is disabled in webview)
  useEffect(() => {
    const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
    if (!IS_TAURI) return;
    const handler = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
        getCurrentWebviewWindow().openDevtools();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function goTo(navId, courseId = null, destination = null) {
    setNav(navId);
    setDest(destination);
    if (courseId) {
      const entry = getCourse(courseId);
      if (entry?.isHub) { setHub(courseId); setCourse(null); }
      else               { setCourse(courseId); setHub(null); }
    } else {
      setCourse(null);
      setHub(null);
    }
  }

  function goBackToSearch() {
    setCourse(null);
    setHub(null);
    setDest(null);
    setNav("home");
  }

  function renderPage() {
    if (course) {
      const entry = getCourse(course);
      const backToHub = entry?.hubParent ? () => { setCourse(null); setDest(null); setHub(entry.hubParent); } : null;
      return (
        <CoursePage
          courseId={course}
          dest={dest}
          onBack={backToHub ?? (() => { setCourse(null); setDest(null); })}
          onBackToSearch={lastSearch ? goBackToSearch : null}
        />
      );
    }
    if (hub) {
      const hubData = getCourse(hub);
      return (
        <OsHubPage
          hubData={hubData}
          onSelectLane={(laneId) => { setCourse(laneId); setHub(null); }}
          onBack={() => { setHub(null); }}
        />
      );
    }
    switch (nav) {
      case "home":      return <HomePage goTo={goTo} openUpload={() => setShowDrop(true)} openInventory={() => setShowInv(true)} lastSearch={lastSearch} setLastSearch={setLastSearch} />;
      case "cosc":      return <DeptPage deptId="cosc" goTo={goTo} dest={dest} />;
      case "math":      return <DeptPage deptId="math" goTo={goTo} dest={dest} />;
      case "talk2me":   return <AgendaPage />;
      case "tickets":   return <TicketsPage />;
      case "roadmap":   return <RoadMap />;
      case "resources":  return <ResourcesPage />;
      case "signal":    return <SignalNoisePage />;
      case "deadlines": return <DeadlinesPage />;
      case "progress":  return <ProgressPage />;
      default:        return <HomePage goTo={goTo} openUpload={() => setShowDrop(true)} openInventory={() => setShowInv(true)} lastSearch={lastSearch} setLastSearch={setLastSearch} />;
    }
  }

  const FONT = "'Inter', 'Segoe UI', sans-serif";

  return (
    <div style={{
      background: "#111318", minHeight: "100vh",
      color: "#d4d8e0", fontFamily: FONT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body, button, input, textarea, select {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          font-weight: 500;
          -webkit-font-smoothing: antialiased;
        }

        * { min-color: inherit; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2a2e38; border-radius: 2px; }
        button:focus { outline: none; }

        h1, h2, h3, h4, h5, h6 { font-weight: 600; }

        /* Capacitor / notch safe areas */
        :root {
          --sat: env(safe-area-inset-top, 0px);
          --sab: env(safe-area-inset-bottom, 0px);
          --sal: env(safe-area-inset-left, 0px);
          --sar: env(safe-area-inset-right, 0px);
        }
      `}</style>

      {/* Desktop: left sidebar */}
      {!isMobile && (
        <Sidebar active={nav} setActive={(id) => { setCourse(null); setHub(null); setDest(null); setNav(id); if (id !== "home") setLastSearch(null); }} />
      )}

      {/* Main content */}
      <main style={{
        marginLeft: isMobile ? 0 : 72,
        paddingTop: isMobile ? "var(--sat)" : 0,
        height: isMobile ? "calc(100vh - 60px - var(--sab))" : "100vh",
        overflow: "hidden",
      }}>
        {renderPage()}
      </main>

      {/* Mobile: bottom nav bar */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          height: "calc(60px + var(--sab))",
          background: "#1a1d24", borderTop: "1px solid #2a2e38",
          display: "flex", alignItems: "flex-start", justifyContent: "space-around",
          paddingTop: 0,
          zIndex: 100,
        }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setCourse(null); setDest(null); setNav(item.id); if (item.id !== "home") setLastSearch(null); }}
              style={{
                flex: 1, height: 60, border: "none",
                background: "transparent",
                color: nav === item.id ? "#e8c547" : "#7a8090",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 3,
                cursor: "pointer",
                borderTop: `2px solid ${nav === item.id ? "#e8c547" : "transparent"}`,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, letterSpacing: "0.3px" }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      )}

      {/* ── Find bar ── */}
      {findOpen && (
        <div
          id="ctrl-f-bar"
          style={{
            position: "fixed", bottom: 0,
            left: isMobile ? 0 : 72, right: 0,
            background: "#1a1d24",
            borderTop: "1px solid #2a2e38",
            padding: "6px 10px",
            display: "flex", alignItems: "center", gap: 6,
            zIndex: 9999,
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.4)",
          }}>
          <span style={{ fontSize: 13, color: "#7a8090", userSelect: "none" }}>🔍</span>
          <input
            ref={findInputRef}
            value={findQuery}
            onChange={e => handleFindChange(e.target.value)}
            placeholder="Find on page…"
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1, maxWidth: 220,
              background: "#111318",
              border: "1px solid #2a2e38",
              borderRadius: 6,
              color: "#d4d8e0",
              padding: "4px 10px",
              fontSize: 13,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 12, color: "#7a8090", minWidth: 48, userSelect: "none" }}>
            {findStats.total === 0 ? (findQuery ? "No results" : "") : `${findStats.current} / ${findStats.total}`}
          </span>
          <button onClick={handlePrev} title="Previous (Shift+Enter)"
            style={{ background: "none", border: "none", color: "#7a8090", cursor: "pointer", fontSize: 15, padding: "2px 4px" }}
          >↑</button>
          <button onClick={handleNext} title="Next (Enter)"
            style={{ background: "none", border: "none", color: "#7a8090", cursor: "pointer", fontSize: 15, padding: "2px 4px" }}
          >↓</button>
          <button onClick={closeFind} title="Close (Esc)"
            style={{ background: "none", border: "none", color: "#7a8090", cursor: "pointer", fontSize: 16, padding: "2px 6px", marginLeft: 2 }}
          >✕</button>
        </div>
      )}

      <DropZone
        open={showDrop}
        onOpen={() => setShowDrop(true)}
        onClose={() => setShowDrop(false)}
        onDone={reloadData}
      />
      <FileInventoryModal
        open={showInventory}
        onClose={() => setShowInv(false)}
      />
    </div>
  );
}

export default function App() {
  return <DataProvider><AppInner /></DataProvider>;
}