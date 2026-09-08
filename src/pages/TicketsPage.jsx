// src/pages/TicketsPage.jsx
// Tickets data lives in dev-log/tickets.js — never bundled into production.
// In Tauri/prod this page is hidden from nav entirely.
// In dev (browser), data is loaded via GET /api/load-tickets from the Express server.

import { useState, useEffect } from "react";
import { useData } from "../data/DataContext";
import { TICKET_STATUS_MAP as STATIC_STATUS_MAP } from "../data/uiConfig";
import { useIsMobile } from "../hooks/useIsMobile";

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const INITIAL_TICKETS = {};
const INITIAL_TODO    = [];

// Module-level STATUS_MAP — updated after data loads via context
let STATUS_MAP = STATIC_STATUS_MAP;


const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

const FIELD_CONFIG = [
  { key: "component", label: "Component", color: "#60a5fa", icon: "◈" },
  { key: "function",  label: "Function",  color: "#a78bfa", icon: "⚙" },
  { key: "error",     label: "Error",     color: "#f87171", icon: "✕" },
  { key: "solution",  label: "Solution",  color: "#34d399", icon: "✓" },
];

const SECTION_META = {
  DeadlinesPage: { icon: "◷", color: "#e8c547" },
  CoursePage:    { icon: "⊞", color: "#4ecdc4" },
  Talk2MePage:   { icon: "✦", color: "#ff6b9d" },
  FileSystem:    { icon: "⎘", color: "#fb923c" },
  Search:        { icon: "⌕", color: "#a78bfa" },
  Global:        { icon: "◎", color: "#60a5fa" },
  Android:       { icon: "⌘", color: "#34d399" },
  DataLayer:     { icon: "≡", color: "#f472b6" },
};

function Chip({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10, fontFamily: FONT, fontWeight: 700,
      letterSpacing: "0.5px", textTransform: "uppercase",
      color, background: bg || color + "22",
      border: `1px solid ${color}55`,
      borderRadius: 5, padding: "2px 8px", flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function TicketCard({ ticket, defaultExpanded = true }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const status = ticket.status || "OPEN";
  const isDone = status === "CLOSED" || status === "DONE";
  const cfg = STATUS_MAP[status] || STATUS_MAP["OPEN"];
  const fields = FIELD_CONFIG.filter(f => ticket[f.key]);

  return (
    <div style={{
      background: "#161920",
      border: `1px solid ${isDone ? "#2e3345" : cfg.color + "55"}`,
      borderLeft: `4px solid ${cfg.color}`,
      borderRadius: 12, marginBottom: 10, overflow: "hidden",
    }}>
      <div onClick={() => setExpanded(e => !e)} style={{
        display: "flex", alignItems: "flex-start", flexWrap: "wrap",
        gap: 6, padding: "12px 14px", cursor: "pointer",
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 700,
          color: cfg.color, background: cfg.color + "22",
          border: `1px solid ${cfg.color}44`,
          borderRadius: 4, padding: "2px 7px", flexShrink: 0,
        }}>#{ticket.id}</span>

        <Chip label={status} color={cfg.color} bg={cfg.bg} />
        {ticket.priority?.toLowerCase() === "high" && <Chip label="⚠ HIGH" color="#ff8040" />}

        <span style={{
          color: isDone ? "#8090a8" : "#eceef4",
          fontSize: 13, fontWeight: 600, fontFamily: FONT,
          lineHeight: 1.35, flex: 1, minWidth: 160,
        }}>{ticket.title}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
          {ticket.filed && (
            <span style={{ fontSize: 10, color: "#4a5060", fontFamily: FONT }}>
              {ticket.closed ? `${ticket.filed} → ${ticket.closed}` : ticket.filed}
            </span>
          )}
          <span style={{ fontSize: 11, color: "#4a5060" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && fields.length > 0 && (
        <div style={{
          borderTop: "1px solid #2a2e38", padding: "12px 14px 14px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {fields.map(({ key, label, color, icon }) => (
            <div key={key}>
              <div style={{ marginBottom: 4 }}>
                <span style={{
                  fontFamily: FONT, fontSize: 10, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  color, background: color + "18", border: `1px solid ${color}40`,
                  borderRadius: 4, padding: "2px 8px",
                }}>{icon} {label}</span>
              </div>
              <p style={{
                color: "#9aa0b0", fontSize: 12, lineHeight: 1.7,
                fontFamily: FONT, fontWeight: 400, margin: 0, paddingLeft: 2,
              }}>{ticket[key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionBlock({ name, tickets }) {
  const meta = SECTION_META[name] || { icon: "◆", color: "#7a8090" };
  const open   = tickets.filter(t => t.status === "OPEN" || t.status === "IN PROGRESS");
  const closed = tickets.filter(t => t.status === "CLOSED" || t.status === "DONE");
  const [showClosed, setShowClosed] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);

  return (
    <div style={{ marginBottom: 32 }}>
      <div onClick={() => setCollapsed(c => !c)} style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: collapsed ? 0 : 12,
        paddingBottom: 10, borderBottom: "1px solid #2a2e38", cursor: "pointer",
      }}>
        <span style={{ fontSize: 14 }}>{meta.icon}</span>
        <span style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 700,
          color: meta.color, letterSpacing: "1px", textTransform: "uppercase",
        }}>{name}</span>
        {open.length > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#fff",
            background: meta.color + "30", border: `1px solid ${meta.color}50`,
            borderRadius: 12, padding: "1px 8px", fontFamily: FONT,
          }}>{open.length} open</span>
        )}
        <span style={{ fontSize: 10, color: "#4a5060", fontFamily: FONT }}>{closed.length} closed</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#4a5060" }}>{collapsed ? "▼" : "▲"}</span>
      </div>

      {!collapsed && (
        <>
          {open.length === 0 && !showClosed && (
            <p style={{ color: "#4a5060", fontFamily: FONT, fontSize: 11, marginBottom: 8 }}>No open tickets.</p>
          )}
          {open.map(t => <TicketCard key={t.id} ticket={t} defaultExpanded={true} />)}
          {closed.length > 0 && (
            <div onClick={() => setShowClosed(s => !s)} style={{
              fontSize: 11, color: "#4a5060", fontFamily: FONT,
              cursor: "pointer", marginTop: 6, userSelect: "none",
            }}>
              {showClosed ? "▲" : "▼"} {closed.length} closed
            </div>
          )}
          {showClosed && closed.map(t => <TicketCard key={t.id} ticket={t} defaultExpanded={false} />)}
        </>
      )}
    </div>
  );
}

export default function TicketsPage() {
  const { TICKET_STATUS_MAP } = useData();
  STATUS_MAP = TICKET_STATUS_MAP || STATIC_STATUS_MAP;
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [_todoItems, setTodoItems] = useState(INITIAL_TODO);

  useEffect(() => {
    if (IS_TAURI) return; // hidden in prod — no data to load
    fetch("/api/load-tickets")
      .then(r => r.json())
      .then(data => {
        if (data.TICKETS)    setTickets(data.TICKETS);
        if (data.TODO_ITEMS) setTodoItems(data.TODO_ITEMS);
      })
      .catch(e => console.error("tickets load error", e));
  }, []);

  const allTickets  = Object.values(tickets).flat();
  const totalOpen   = allTickets.filter(t => t.status === "OPEN" || t.status === "IN PROGRESS").length;
  const totalClosed = allTickets.filter(t => t.status === "CLOSED" || t.status === "DONE").length;
  const isMobile = useIsMobile();
  return (
    <div style={{
      height: "100%", overflowY: "auto",
      padding: isMobile ? "24px 16px 80px" : "44px 52px 72px",
      fontFamily: FONT, background: "#0f1117",
    }}>
      <div style={{ marginBottom: isMobile ? 28 : 36 }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "#4a5060",
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10,
        }}>docs / tickets</div>
        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: isMobile ? 22 : 28,
          fontWeight: 400, color: "#d4d8e0",
          letterSpacing: "-0.5px", margin: "0 0 8px",
        }}>Issues &amp; Backlog</h1>
        <div style={{ color: "#7a8090", fontSize: 11, fontFamily: FONT }}>
          {totalOpen} open · {totalClosed} resolved · {Object.keys(tickets).length} sections
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: isMobile ? 28 : 36, flexWrap: "wrap" }}>
        {[
          { label: "Open",     count: totalOpen,   color: "#ff6060" },
          { label: "Resolved", count: totalClosed, color: "#4ddd99" },
          { label: "Sections", count: Object.keys(tickets).length, color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#161920", border: `1px solid ${s.color}33`,
            borderTop: `3px solid ${s.color}`, borderRadius: 12,
            padding: isMobile ? "10px 16px" : "14px 22px", minWidth: 80,
          }}>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: s.color, marginBottom: 4, lineHeight: 1 }}>{s.count}</div>
            <div style={{ fontSize: 10, color: "#4a5060", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {Object.entries(tickets).map(([name, tickets]) => (
        <SectionBlock key={name} name={name} tickets={tickets} />
      ))}
    </div>
  );
}