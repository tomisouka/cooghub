// src/pages/TicketsPage.jsx

const TICKETS = {
  bugs: [

    {
      id: "007",
      status: "OPEN",
      title: "PDF search highlight visually misaligned",
      filed: "2026-03-11",
      area: ["src/components/PDFViewer.jsx → buildTextLayer()"],
      description: "Search highlights land at the correct DOM position but appear visually offset — the amber box floats over the wrong word due to scaleX() transform drift on <mark> elements inside transformed spans.",
      next: "Compute inverse scaleX on each <mark> and apply compensating translateX. Or render highlights as absolutely-positioned overlay divs using raw transform matrix coordinates.",
    },
    {
      id: "010",
      status: "OPEN",
      priority: "LOW",
      title: "Sticky nav bars visible inside srcdoc iframes",
      filed: "2026-03-11",
      area: ["src/components/ReferenceViewer.jsx"],
      description: "Scripted reference files (automata, jflap-demo, etc.) render via srcdoc iframe. Files with position:sticky nav bars (e.g. automata-sisper-reference.html) show the nav pinned inside the iframe viewport, which looks odd when embedded in the app. Not a regression — old iframes had the same behavior.",
      next: "Inject a <style> block into the srcdoc overriding position:sticky/fixed to position:relative so the nav scrolls naturally with content.",
    },
    {
      id: "001",
      status: "OPEN",
      title: "Search scroll-to-match unreliable in MarkdownViewer",
      filed: "2026-03-09",
      area: ["MarkdownViewer.jsx", "CoursePage.jsx", "search.js"],
      description: "Clicking a search result navigates to the correct course + tab + file, but scroll to first match is unreliable. Double-rAF approach improved it but it still misfires on large documents.",
      next: "Try IntersectionObserver on the first <mark> instead of manual getBoundingClientRect() offset math.",
    },
  ],
  features: [
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
      description: "resolveResult returns { page: 'talk2me', sectionId, file } but Talk2MePage doesn't consume these props to jump to the matched section on arrival.",
      next: null,
    },
    {
      id: "006",
      status: "OPEN",
      title: "Empty courses need content",
      filed: "2026-03-09",
      area: ["subjects.js", "public/notes/"],
      description: "Courses with no notes/code yet: comporg, python, algebra, precalc, calc1, calc2, stats.",
      next: null,
    },
  ],
  done: [
        { id: "011", title: "Full-text reference search — sessionStorage cache + block-aware extraction", filed: "2026-03-11", description: "Replaced div.textContent with a block-aware extractText() walker (spaces at TD/TH/DIV/H1-H6 boundaries). Added sessionStorage persistence keyed by version stamp — survives HMR, auto-invalidates on code change." },
    { id: "D001", title: "PDF full-text indexing",               filed: "2026-03-09", description: "scripts/index-pdfs.js indexes 14 PDFs into public/pdf-index.json (~15MB). Skips re-index if PDFs unchanged. Runs on pnpm dev / pnpm build." },
    { id: "D002", title: "Unified search with PDF results",      filed: "2026-03-09", description: "Notes + code + Talk2Me + PDFs in one query. PDF index lazy-loaded. Results grouped by type with snippets and page badges." },
    { id: "D003", title: "Search result term highlighting",      filed: "2026-03-09", description: "HighlightText component wraps matches in amber inside result card labels and snippets." },
    { id: "D004", title: "Search navigation to course/tab/file", filed: "2026-03-09", description: "Result click carries { tab, file, pdfPage, query } through App state into CoursePage." },
    { id: "D005", title: "Department/course hierarchy rebuild",  filed: "2026-03-09", description: "Full rebuild: DEPARTMENTS → courses → typed buckets. DeptPage, CoursePage, updated subjects.js." },
    { id: "D006", title: "git.js knowledge file",               filed: "2026-03-09", description: "115-entry Git reference. Sections: Setup, Clone, Staging, Branches, Merge/Rebase, Remote, Log, Undo, Stash, Tags, Worktree, Inspection, .gitignore, Concepts, GitHub, Flags." },
    { id: "D007", title: "Talk2MePage readability overhaul",    filed: "2026-03-10", description: "Rebuilt Talk2MePage. Section tabs with icon + label + file count badge. Filter input redesigned. Each file row shows a txt/md type badge. Empty state upgraded. Footer shows filtered result count." },
    { id: "D008", title: ".txt file rendering overhaul",        filed: "2026-03-10", description: "Replaced raw pre monospace dump with a line-by-line React renderer. ALL-CAPS and colon-ending lines become styled headers. Blank lines become spacers, --- becomes hr. Font upgraded to Inter 16px at 1.9 line height." },
    { id: "D009", title: "Markdown body font size bump",        filed: "2026-03-10", description: "Bumped all .md-body sizes: paragraphs/lists 14→16px, inline code 12→14px, code blocks 13→15px, table text 13→15px, headings proportionally increased." },
    { id: "D010", title: "CodeViewer astigmatism-friendly redesign", filed: "2026-03-10", description: "JetBrains Mono 700 18px, line height 2.0. All token colors desaturated. Background warmed to #13151c." },
    { id: "008",  title: "IframeWithLoader spinner never resolves in APK", filed: "2026-03-11", description: "Google Fonts <link> in all reference HTMLs blocked onLoad in Capacitor WebView. Fixed by ReferenceViewer which strips the Fonts link and renders natively." },
    { id: "009",  title: "ReferenceViewer.jsx built and wired in", filed: "2026-03-11", description: "Native React renderer for all 90+ reference HTMLs. Fetches file, strips Google Fonts link, scopes original <style> blocks to a unique container ID, injects body HTML as-is. Scripted files (DFA simulator, DP visualizer) render via srcdoc iframe so JS executes." },
    { id: "002",  title: "PDF page jump unreliable",            filed: "2026-03-09", description: "Fixed by replacing native iframe with pdfjs-dist canvas renderer (PDFViewer.jsx). Full programmatic page control, initialPage prop, search result deep-linking." },
    { id: "003",  title: "In-app PDF viewer with page control", filed: "2026-03-09", description: "PDFViewer.jsx built with pdfjs-dist. Page number display, prev/next, jump-to input, initialPage prop for search result deep-linking." },
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
        {ticket.priority === "HIGH" && (
          <Badge label="⚠ HIGH PRIORITY" color="#ff6b35" />
        )}
        {ticket.priority === "LOW" && (
          <Badge label="low" color="#4a5060" />
        )}
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
          {TICKETS.bugs.length} bugs · {TICKETS.features.length} features · {TICKETS.done.length} done
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