import { NAV } from "../data/nav";

export default function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width: 72, minHeight: "100vh",
      background: "#1a1d24",
      borderRight: "1px solid #2a2e38",
      display: "flex", flexDirection: "column",
      alignItems: "center", paddingTop: 24, gap: 4,
      position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      <div style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 16, fontWeight: 700,
        color: "#e8c547", marginBottom: 20, letterSpacing: "0px",
      }}>CG</div>

      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          title={item.label}
          style={{
            width: 52, height: 52, border: "none", borderRadius: 10,
            background: active === item.id ? "#21252e" : "transparent",
            color: active === item.id ? "#e8c547" : "#7a8090",
            fontSize: 18, cursor: "pointer",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", position: "relative",
          }}
          onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.color = "#b0b8c8"; }}
          onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.color = "#7a8090"; }}
        >
          <span>{item.icon}</span>
          <span style={{
            fontSize: 10, marginTop: 3, fontWeight: 600,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.3px", opacity: 0.9,
          }}>
            {item.label}
          </span>
          {active === item.id && (
            <div style={{
              position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
              width: 3, height: 24, background: "#e8c547", borderRadius: "0 2px 2px 0",
            }} />
          )}
        </button>
      ))}
    </aside>
  );
}