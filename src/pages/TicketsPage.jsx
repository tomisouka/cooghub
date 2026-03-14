// src/pages/TicketsPage.jsx
// Data lives in src/data/tickets.js — edit there, not here.

import { useState } from "react";
import { TICKETS, TODO_ITEMS } from "../data/tickets";
import { useIsMobile } from "../hooks/useIsMobile";
import { TICKET_STATUS_MAP as STATUS_MAP, TICKET_FIELD_CONFIG as FIELD_CONFIG } from "../data/uiConfig";

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'Courier New', monospace";


function Chip({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11, fontFamily: FONT, fontWeight: 700,
      letterSpacing: "0.5px", textTransform: "uppercase",
      color, background: bg || color + "22",
      border: `1px solid ${color}55`,
      borderRadius: 6, padding: "3px 10px",
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function TicketCard({ ticket, type }) {
  const [expanded, setExpanded] = useState(type !== "done");
  const isDone = type === "done";
  const status = ticket.status || (isDone ? "DONE" : "OPEN");
  const cfg = STATUS_MAP[status] || STATUS_MAP["OPEN"];
  const hasUIUpdate = ticket.solution?.toLowerCase().includes("ui update");
  const fields = FIELD_CONFIG.filter(f => ticket[f.key]);

  return (
    <div style={{
      background: "#1e2230",
      border: `1px solid ${isDone ? "#2e3345" : cfg.color + "55"}`,
      borderLeft: `5px solid ${cfg.color}`,
      borderRadius: 12,
      marginBottom: 14,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "flex-start", flexWrap: "wrap",
          gap: 8, padding: "16px 18px", cursor: "pointer",
        }}
      >
        {/* ID */}
        <span style={{
          fontFamily: MONO, fontSize: 12, fontWeight: 700,
          color: cfg.color,
          background: cfg.color + "22",
          border: `1px solid ${cfg.color}44`,
          borderRadius: 5, padding: "3px 9px", flexShrink: 0,
        }}>
          #{ticket.id}
        </span>

        <Chip label={status} color={cfg.color} bg={cfg.bg} />

        {ticket.priority?.toLowerCase() === "high" && (
          <Chip label="⚠ HIGH" color="#ff8040" />
        )}
        {hasUIUpdate && (
          <Chip label="🎨 UI UPDATE" color="#50c8ff" />
        )}

        {/* Title — largest, most readable element */}
        <span style={{
          color: isDone ? "#9098b0" : "#eceef4",
          fontSize: 15, fontWeight: 700, fontFamily: FONT,
          lineHeight: 1.35, flex: 1, minWidth: 160,
        }}>
          {ticket.title}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexShrink: 0 }}>
          {ticket.filed && (
            <span style={{ fontSize: 12, color: "#5a6070", fontFamily: FONT, fontWeight: 500 }}>
              {ticket.filed}
            </span>
          )}
          <span style={{ fontSize: 13, color: "#5a6070" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Body */}
      {expanded && fields.length > 0 && (
        <div style={{
          borderTop: `1px solid #2e3345`,
          padding: "16px 18px 18px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {fields.map(({ key, label, color, icon }) => (
            <div key={key}>
              <div style={{ marginBottom: 7 }}>
                <span style={{
                  fontFamily: FONT, fontSize: 11, fontWeight: 700,
                  letterSpacing: "1px", textTransform: "uppercase",
                  color, background: color + "18",
                  border: `1px solid ${color}40`,
                  borderRadius: 5, padding: "3px 10px",
                }}>
                  {icon} {label}
                </span>
              </div>
              <p style={{
                color: "#cdd2e0",
                fontSize: 14, lineHeight: 1.8,
                fontFamily: FONT, fontWeight: 400,
                margin: 0, paddingLeft: 2,
              }}>
                {ticket[key]}
              </p>
            </div>
          ))}

          {isDone && ticket.closed && (
            <div style={{ fontSize: 12, color: "#5a6070", fontFamily: FONT, fontWeight: 500, marginTop: 2 }}>
              Closed {ticket.closed}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ label, color, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 44 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: open ? 18 : 0,
          paddingBottom: 14, borderBottom: "1px solid #2e3345",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 18 }}>{label.split(" ")[0]}</span>
        <span style={{
          fontFamily: FONT, fontSize: 14, fontWeight: 700,
          color: "#d8dce8", letterSpacing: "0.5px", textTransform: "uppercase",
        }}>
          {label.split(" ").slice(1).join(" ")}
        </span>
        <span style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#fff",
          background: color + "30", border: `1px solid ${color}50`,
          borderRadius: 12, padding: "2px 10px",
        }}>
          {count}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#5a6070" }}>
          {open ? "▲" : "▼"}
        </span>
      </div>
      {open && children}
    </div>
  );
}

const openBugs     = TICKETS.bugs.filter(t => t.status !== "DONE");
const openFeatures = TICKETS.features.filter(t => t.status !== "DONE");

export default function TicketsPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{
      height: "100%", overflowY: "auto",
      padding: isMobile ? "28px 18px 80px" : "52px 56px 72px",
      fontFamily: FONT, background: "#13151c",
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 32 : 48 }}>
        <div style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#505870",
          letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 12,
        }}>
          docs / tickets
        </div>
        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: isMobile ? 28 : 38,
          fontWeight: 400, color: "#eceef4",
          letterSpacing: "-0.5px", margin: "0 0 10px",
        }}>
          Issues &amp; Backlog
        </h1>
        <div style={{ color: "#7080a0", fontSize: 14, fontFamily: FONT, fontWeight: 500 }}>
          {openBugs.length} open bugs · {openFeatures.length} open features · {TICKETS.done.length} resolved
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: isMobile ? 36 : 52, flexWrap: "wrap" }}>
        {[
          { label: "Open Bugs",     count: openBugs.length,     color: "#ff6060" },
          { label: "Open Features", count: openFeatures.length, color: "#b8a0ff" },
          { label: "Resolved",      count: TICKETS.done.length, color: "#4ddd99" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#1e2230",
            border: `1px solid ${s.color}33`,
            borderTop: `4px solid ${s.color}`,
            borderRadius: 12,
            padding: isMobile ? "16px 22px" : "20px 32px",
            minWidth: 110,
          }}>
            <div style={{
              fontSize: isMobile ? 28 : 36, fontWeight: 800,
              color: s.color, marginBottom: 6, fontFamily: FONT, lineHeight: 1,
            }}>
              {s.count}
            </div>
            <div style={{
              fontSize: 12, color: "#8090a8", fontFamily: FONT,
              fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <Section label="🐛 Bugs" color="#ff6060" count={openBugs.length}>
        {openBugs.length === 0
          ? <p style={{ color: "#505870", fontFamily: FONT, fontSize: 14 }}>No open bugs.</p>
          : openBugs.map(t => <TicketCard key={t.id} ticket={t} type="bug" />)
        }
      </Section>

      <Section label="🚀 Features" color="#b8a0ff" count={openFeatures.length}>
        {openFeatures.length === 0
          ? <p style={{ color: "#505870", fontFamily: FONT, fontSize: 14 }}>No open features.</p>
          : openFeatures.map(t => <TicketCard key={t.id} ticket={t} type="feature" />)
        }
      </Section>

      <Section label="✅ Done" color="#4ddd99" count={TICKETS.done.length} defaultOpen={false}>
        {TICKETS.done.map(t => <TicketCard key={t.id} ticket={{ ...t, status: "DONE" }} type="done" />)}
      </Section>
    </div>
  );
}