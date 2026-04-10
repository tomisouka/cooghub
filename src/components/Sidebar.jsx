import { useData } from "../data/DataContext";

const ICON_MAP = {
  home:      "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  deadlines: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  talk2me:   "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 9H7V9h8v2zm3-4H7V5h11v2z",
  signal:    "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
  progress:  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
  resources: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

function NavIcon({ id, active }) {
  const path = ICON_MAP[id];
  if (!path) return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "#e8c547" : "#3d4460"} style={{ transition: "fill 0.2s", flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

export default function Sidebar({ active, setActive }) {
  const { NAV } = useData();

  return (
    <aside style={{
      width: 68,
      minHeight: "100vh",
      background: "#0c0e14",
      borderRight: "1px solid #181c26",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 18,
      paddingBottom: 16,
      gap: 2,
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo mark */}
      <div style={{
        width: 34,
        height: 34,
        background: "linear-gradient(135deg, #e8c547 0%, #c5a22a 100%)",
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 22,
        flexShrink: 0,
        boxShadow: "0 2px 14px #e8c54728",
      }}>
        <span style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: 12,
          fontWeight: 700,
          color: "#0c0e14",
          letterSpacing: "-0.5px",
        }}>CG</span>
      </div>

      {NAV.map(item => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            title={item.label}
            style={{
              width: 48,
              height: 48,
              border: "none",
              borderRadius: 12,
              background: isActive ? "#161b28" : "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              position: "relative",
              transition: "background 0.15s",
              outline: "none",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#12151f"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {isActive && (
              <div style={{
                position: "absolute",
                left: -1,
                top: "50%",
                transform: "translateY(-50%)",
                width: 3,
                height: 20,
                background: "#e8c547",
                borderRadius: "0 3px 3px 0",
              }} />
            )}
            <NavIcon id={item.id} active={isActive} />
            <span style={{
              fontSize: 8.5,
              fontWeight: 700,
              fontFamily: "'DM Mono', 'Courier New', monospace",
              letterSpacing: "0.5px",
              color: isActive ? "#e8c547" : "#30364a",
              transition: "color 0.2s",
              textTransform: "uppercase",
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 8, color: "#1e2336", fontFamily: "monospace", letterSpacing: "1px" }}>v2</div>
    </aside>
  );
}
