import { useState } from "react";
import { DataProvider, useData } from "./data/DataContext";
import Sidebar             from "./components/Sidebar";
import DropZone            from "./components/DropZone";
import FileInventoryModal  from "./components/FileInventoryModal";
import HomePage            from "./pages/HomePage";
import DeptPage            from "./pages/DeptPage";
import CoursePage          from "./pages/CoursePage";
import OsHubPage           from "./pages/OsHubPage";
import Talk2MePage         from "./pages/Talk2MePage";
import TicketsPage         from "./pages/TicketsPage";
import RoadMap             from "./pages/RoadMap";
import DeadlinesPage       from "./pages/DeadlinesPage";
import ResourcesPage      from "./pages/ResourcesPage";
import { useIsMobile }     from "./hooks/useIsMobile";

function AppInner() {
  const { NAV, getCourse } = useData();
  const [nav, setNav]               = useState("home");
  const [course, setCourse]         = useState(null);
  const [hub,    setHub]            = useState(null);
  const [dest, setDest]             = useState(null);
  const [showDrop, setShowDrop]     = useState(false);
  const [showInventory, setShowInv] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);
  const isMobile                    = useIsMobile();

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
      case "talk2me":   return <Talk2MePage dest={dest} />;
      case "tickets":   return <TicketsPage />;
      case "roadmap":   return <RoadMap />;
      case "resources":  return <ResourcesPage />;
      case "deadlines": return <DeadlinesPage />;
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

      <DropZone
        open={showDrop}
        onOpen={() => setShowDrop(true)}
        onClose={() => setShowDrop(false)}
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
