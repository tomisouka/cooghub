import { useState } from "react";

import Sidebar      from "./components/Sidebar";
import DropZone     from "./components/DropZone";
import HomePage     from "./pages/HomePage";
import DeptPage     from "./pages/DeptPage";
import CoursePage   from "./pages/CoursePage";
import Talk2MePage  from "./pages/Talk2MePage";
import TicketsPage  from "./pages/TicketsPage";

export default function App() {
  const [nav, setNav]           = useState("home");
  const [course, setCourse]     = useState(null);
  const [dest, setDest]         = useState(null);
  const [showDrop, setShowDrop] = useState(false);

  function goTo(navId, courseId = null, destination = null) {
    setNav(navId);
    setCourse(courseId);
    setDest(destination);
  }

  function renderPage() {
    if (course) {
      return (
        <CoursePage
          courseId={course}
          dest={dest}
          onBack={() => { setCourse(null); setDest(null); }}
        />
      );
    }
    switch (nav) {
      case "home":    return <HomePage goTo={goTo} openUpload={() => setShowDrop(true)} />;
      case "cosc":    return <DeptPage deptId="cosc" goTo={goTo} />;
      case "math":    return <DeptPage deptId="math" goTo={goTo} />;
      case "talk2me": return <Talk2MePage />;
      case "tickets": return <TicketsPage />;
      default:        return <HomePage goTo={goTo} openUpload={() => setShowDrop(true)} />;
    }
  }

  return (
    <div style={{
      background: "#111318", minHeight: "100vh",
      color: "#d4d8e0", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Global readability — no thin weights anywhere */
        body, button, input, textarea, select {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          font-weight: 500;
          -webkit-font-smoothing: antialiased;
        }

        /* Bump up all dim/muted text so it's actually readable */
        * { min-color: inherit; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2a2e38; border-radius: 2px; }
        button:focus { outline: none; }

        /* Kill any inherited font-weight: 300 or 400 from component inline styles */
        h1, h2, h3, h4, h5, h6 { font-weight: 600; }
      `}</style>
      <Sidebar active={nav} setActive={(id) => { setCourse(null); setDest(null); setNav(id); }} />
      <main style={{ marginLeft: 72, height: "100vh", overflow: "hidden" }}>
        {renderPage()}
      </main>
      <DropZone
        open={showDrop}
        onOpen={() => setShowDrop(true)}
        onClose={() => setShowDrop(false)}
      />
    </div>
  );
}