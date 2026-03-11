// src/pages/TicketsPage.jsx

const TICKETS = {
  bugs: [
    {
      id: "001",
      status: "OPEN",
      title: "Search scroll-to-match not working correctly",
      filed: "2026-03-09",
      area: ["MarkdownViewer.jsx", "CoursePage.jsx", "search.js"],
      description: "Clicking a search result navigates to the correct course + tab + file, but does not scroll to the matched text. MutationObserver + debounce fires but scroll lands at the top or wrong position.",
      next: "Try requestAnimationFrame after observer to ensure layout is done. Or IntersectionObserver on the first <mark> instead of manual offset math.",
    },
    {
      id: "002",
      status: "OPEN",
      title: "PDF page jump unreliable",
      filed: "2026-03-09",
      area: ["CoursePage.jsx"],
      description: "#page=N fragment on iframe forces remount via key prop, but Chrome's PDF viewer doesn't always honor the fragment on large PDFs.",
      next: "Replace native iframe with pdfjs-dist canvas renderer (see #003) for full programmatic page control.",
    },
  ],
  features: [
    {
      id: "003",
      status: "OPEN",
      title: "In-app PDF viewer with page control",
      filed: "2026-03-09",
      area: ["new PDFViewer.jsx"],
      description: "Replace <iframe> with a pdfjs-dist canvas-based viewer. Page nav, jump-to input, initialPage prop for search result deep-linking. Future: highlight matched text on rendered page.",
      next: null,
    },
    {
      id: "004",
      status: "OPEN",
      title: "knowledge/index.js cleanup",
      filed: "2026-03-09",
      area: ["src/data/knowledge/index.js"],
      description: "Still re-exports the 10 language files even though they moved to src/data/languages/. Should only export what's in knowledge/.",
      next: null,
    },
    {
      id: "005",
      status: "OPEN",
      title: "Talk2Me search navigation",
      filed: "2026-03-09",
      area: ["Talk2MePage.jsx", "search.js"],
      description: "resolveResult returns { page: 'talk2me', sectionId, file } but Talk2MePage doesn't accept these props to jump to the matched section on arrival.",
      next: null,
    },
    {
      id: "006",
      status: "OPEN",
      title: "Empty courses need content",
      filed: "2026-03-09",
      area: ["subjects.js"],
      description: "Courses with no notes/code yet: comporg, python, algebra, precalc, calc1, calc2, stats.",
      next: null,
    },
  ],
  done: [
    { id: "D001", title: "PDF full-text indexing",              filed: "2026-03-09", description: "scripts/index-pdfs.js indexes 14 PDFs into public/pdf-index.json (~15MB). Skips re-index if PDFs unchanged." },
    { id: "D002", title: "Unified search with PDF results",     filed: "2026-03-09", description: "Notes + code + Talk2Me + PDFs in one query. PDF index lazy-loaded. Results grouped by type with snippets and page badges." },
    { id: "D003", title: "Search result term highlighting",     filed: "2026-03-09", description: "HighlightText component wraps matches in amber inside result card labels and snippets." },
    { id: "D004", title: "Search navigation to course/tab/file",filed: "2026-03-09", description: "Result click carries { tab, file, pdfPage, query } through App state into CoursePage." },
    { id: "D005", title: "Department/course hierarchy rebuild", filed: "2026-03-09", description: "Full rebuild: DEPARTMENTS → courses → typed buckets. DeptPage, CoursePage, updated subjects.js." },
    { id: "D006", title: "git.js knowledge file",              filed: "2026-03-09", description: "115-entry Git reference. Sections: Setup, Clone, Staging, Branches, Merge/Rebase, Remote, Log, Undo, Stash, Tags, Worktree, Inspection, .gitignore, Concepts, GitHub, Flags." },
    { id: "D007", title: "Talk2MePage readability overhaul",   filed: "2026-03-10", description: "Rebuilt Talk2MePage. Section tabs now show icon + label + file count badge. Filter input redesigned with search icon and clear button. Each file row shows a txt/md type badge. Empty state upgraded with icon, color-tinted card, and quick-pick buttons for first 5 files. Footer shows filtered result count." },
    { id: "D008", title: ".txt file rendering overhaul",       filed: "2026-03-10", description: "Replaced raw pre monospace dump in MarkdownViewer with a line-by-line React renderer. ALL-CAPS and colon-ending lines become styled section headers with accent underline. Indented lines de-emphasized. Blank lines become spacers, --- becomes hr. Font upgraded to Inter 16px at 1.9 line height." },
    { id: "D009", title: "Markdown body font size bump",       filed: "2026-03-10", description: "Bumped all .md-body sizes: paragraphs/lists 14px to 16px, inline code 12px to 14px, code blocks 13px to 15px, table text 13px to 15px, headings proportionally increased. Line height and spacing adjusted throughout." },
    { id: "D010", title: "CodeViewer astigmatism-friendly redesign", filed: "2026-03-10", description: "Full readability pass for astigmatism. JetBrains Mono loaded via Google Fonts (guaranteed monospace). Font weight 700, size 18px, line height 2.0. All token colors desaturated to cut halo/vibration on dark bg: dusty blue keywords, sage green strings, steel blue functions, warm sand types, muted teal operators. Comments italic weight 500. Background warmed to #13151c." },
  ],
};

const STATUS_COLOR = {
  OPEN:        { bg: "#1a1d24", border: "#e85454", text: "#e85454" },
  "IN PROGRESS":{ bg: "#1a1d24", border: "#e8c547", text: "#e8c547" },
  DONE:        { bg: "#1a1d24", border: "#34d399", text: "#34d399" },
};

function Badge({ label, color }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: "'Courier New', monospace",
      letterSpacing: "1.5px", textTransform: "uppercase",
      color, border: `1px solid ${color}55`,
      borderRadius: 4, padding: "2px 7px",
      background: `${color}11`,
    }}>
      {label}
    </span>
  );
}

function TicketCard({ ticket, type }) {
  const isOpen = type !== "done";
  const statusColor = isOpen
    ? (ticket.status === "IN PROGRESS" ? "#e8c547" : "#e85454")
    : "#34d399";

  return (
    <div style={{
      background: "#1a1d24",
      border: `1px solid #2a2e38`,
      borderLeft: `3px solid ${statusColor}`,
      borderRadius: 10, padding: "16px 20px",
      marginBottom: 10,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          fontFamily: "'Courier New', monospace", fontSize: 10,
          color: "#3e4452",
        }}>
          #{ticket.id}
        </span>
        <Badge label={ticket.status || "DONE"} color={statusColor} />
        <span style={{ color: "#3e4452", fontSize: 10, fontFamily: "'Courier New', monospace", marginLeft: "auto" }}>
          {ticket.filed}
        </span>
      </div>

      {/* Title */}
      <div style={{ color: "#d4d8e0", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        {ticket.title}
      </div>

      {/* Area tags */}
      {ticket.area && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
          {ticket.area.map(a => (
            <span key={a} style={{
              fontSize: 10, color: "#4a5060",
              fontFamily: "'Courier New', monospace",
              background: "#21252e", borderRadius: 4,
              padding: "1px 7px", border: "1px solid #2a2e38",
            }}>
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div style={{ color: "#7a8090", fontSize: 12, lineHeight: 1.6, marginBottom: ticket.next ? 10 : 0 }}>
        {ticket.description}
      </div>

      {/* Next step */}
      {ticket.next && (
        <div style={{
          marginTop: 8, padding: "8px 12px",
          background: "#21252e", borderRadius: 6,
          borderLeft: "2px solid #e8c54744",
          color: "#7a8090", fontSize: 11, lineHeight: 1.6,
          fontFamily: "'Courier New', monospace",
        }}>
          → {ticket.next}
        </div>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <div style={{ height: "100vh", overflowY: "auto", padding: "48px 52px 64px" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: 11,
          color: "#3e4452", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10,
        }}>
          docs / tickets
        </div>
        <h1 style={{
          fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 400,
          color: "#d4d8e0", letterSpacing: "-0.5px", marginBottom: 6,
        }}>
          Issues & Backlog
        </h1>
        <div style={{ color: "#3e4452", fontSize: 12, fontFamily: "'Courier New', monospace" }}>
          {TICKETS.bugs.length + TICKETS.features.length} open · {TICKETS.done.length} done
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
        {[
          { label: "Bugs",     count: TICKETS.bugs.length,     color: "#e85454" },
          { label: "Features", count: TICKETS.features.length, color: "#4ecdc4" },
          { label: "Done",     count: TICKETS.done.length,     color: "#34d399" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#1a1d24", border: "1px solid #2a2e38",
            borderRadius: 10, padding: "16px 24px", minWidth: 110,
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 4 }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11, color: "#3e4452", fontFamily: "'Courier New', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bugs */}
      <Section label="🐛 Bugs" color="#e85454">
        {TICKETS.bugs.map(t => <TicketCard key={t.id} ticket={t} type="bug" />)}
      </Section>

      {/* Features */}
      <Section label="🚀 Features" color="#4ecdc4">
        {TICKETS.features.map(t => <TicketCard key={t.id} ticket={t} type="feature" />)}
      </Section>

      {/* Done */}
      <Section label="✅ Done" color="#34d399">
        {TICKETS.done.map(t => <TicketCard key={t.id} ticket={{ ...t, status: "DONE" }} type="done" />)}
      </Section>

    </div>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 16, paddingBottom: 10,
        borderBottom: `1px solid #2a2e38`,
      }}>
        <span style={{ color, fontSize: 13 }}>{label.split(" ")[0]}</span>
        <span style={{
          fontFamily: "'Courier New', monospace", fontSize: 11,
          color: "#7a8090", letterSpacing: "2px", textTransform: "uppercase",
        }}>
          {label.split(" ").slice(1).join(" ")}
        </span>
      </div>
      {children}
    </div>
  );
}