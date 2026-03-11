// src/components/ReferenceViewer.jsx
// Renders public/references/*.html natively inside the app.
//
// Approach: fetch the HTML, strip the Google Fonts <link> (which caused the
// APK WebView spinner), scope the original <style> blocks to a container div,
// and inject the body content as-is. Zero re-rendering, zero template parsing —
// every file looks exactly like it did before, just without the network dep.
//
// Highlight + scroll: TreeWalker marks query terms + double-rAF scroll.

import { useState, useEffect, useRef } from "react";

const FONT = "'Inter', 'Segoe UI', sans-serif";
const C = {
  bg:      "#111318",
  accent:  "#e8c547",
  textDim: "#4a5060",
  border:  "#2a2e38",
};

// ── Highlight utility ─────────────────────────────────────────────────────────

function highlightAndScroll(containerEl, query, scrollerEl) {
  if (!containerEl || !query) return;
  const q = query.toLowerCase().trim();

  containerEl.querySelectorAll("mark.rv-hl").forEach(m => {
    m.replaceWith(document.createTextNode(m.textContent));
  });
  containerEl.normalize();

  const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  let firstMark = null;
  for (const textNode of nodes) {
    const text  = textNode.textContent;
    const lower = text.toLowerCase();
    if (!lower.includes(q)) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    while (true) {
      const idx = lower.indexOf(q, last);
      if (idx === -1) break;
      if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
      const mark = document.createElement("mark");
      mark.className     = "rv-hl";
      mark.textContent   = text.slice(idx, idx + q.length);
      mark.style.cssText = "background:#e8c54766;color:inherit;border-radius:2px;padding:0 1px;";
      if (!firstMark) firstMark = mark;
      frag.appendChild(mark);
      last = idx + q.length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  }

  if (firstMark) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!firstMark.isConnected) return;
        if (scrollerEl) {
          const mRect = firstMark.getBoundingClientRect();
          const sRect = scrollerEl.getBoundingClientRect();
          scrollerEl.scrollBy({ top: mRect.top - sRect.top - scrollerEl.clientHeight / 2, behavior: "smooth" });
        } else {
          firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReferenceViewer({ file, color = C.accent, highlight = null, highlightKey = null }) {
  const [html,    setHtml]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef          = useRef(null);
  const scrollerRef           = useRef(null);
  const uid                   = useRef(`rv-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    setHtml(null);
    setError(null);

    fetch(`/references/${file}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.text(); })
      .then(raw => {
        const id = uid.current;

        // Strip Google Fonts <link> — this was blocking onLoad in the APK WebView
        let processed = raw.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, "");

        // If the file has <script> tags, render via srcdoc iframe so scripts execute.
        // dangerouslySetInnerHTML intentionally doesn't run scripts, so interactive
        // pages (DFA simulator, DP visualizer, inline search filters) need a real context.
        const hasScripts = /<script[\s>]/i.test(processed);
        if (hasScripts) {
          setHtml({ id, srcdoc: processed });
          setLoading(false);
          return;
        }

        // Pure HTML — extract <style> blocks and scope them to our container id
        // so they don't leak into the rest of the app
        const styles = [];
        processed = processed.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
          const scoped = css
            .replace(/:root\s*\{/g, `#${id} {`)
            // Replace bare `body` selector only — not class names like .card-body
            .replace(/(^|[\s,{})>+~])body(\s*[{,>+~:\[])/gm, `$1#${id}$2`);
          // Prepend a fallback: ensure all text in this container is visible by default
          const withFallback = `#${id} { color: #d4d8e0; }\n` + scoped;
          styles.push(withFallback);
          return "";
        });

        // Extract <body> content only
        const bodyMatch = processed.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyHtml  = bodyMatch ? bodyMatch[1] : processed;

        setHtml({ id, styles: styles.join("\n"), body: bodyHtml });
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [file]);

  useEffect(() => {
    if (!html || !highlight) return;
    if (html.srcdoc) return; // srcdoc iframes are cross-origin — can't walk their DOM

    // Double rAF ensures layout is done, then retry up to 5x if content isn't painted yet
    let cancelled = false;
    let attempts  = 0;

    function tryHighlight() {
      if (cancelled) return;
      const container = containerRef.current;
      if (!container || !container.textContent) {
        if (++attempts < 5) setTimeout(tryHighlight, 80);
        return;
      }
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!cancelled) highlightAndScroll(container, highlight, scrollerRef.current);
      }));
    }

    requestAnimationFrame(() => requestAnimationFrame(tryHighlight));
    return () => { cancelled = true; };
  }, [html, highlight, highlightKey]);

  if (loading) return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: C.bg,
    }}>
      <style>{`@keyframes rv-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        border: `3px solid ${C.border}`, borderTopColor: color,
        animation: "rv-spin 0.8s linear infinite",
      }} />
      <span style={{ color: C.textDim, fontSize: 12, fontFamily: FONT }}>{file}</span>
    </div>
  );

  if (error) return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      color: C.textDim, fontSize: 13, fontFamily: FONT,
    }}>
      could not load: {error}
    </div>
  );

  if (!html) return null;

  // Scripted files — render via srcdoc iframe so JS executes correctly.
  // Google Fonts link is already stripped so onLoad fires immediately.
  if (html.srcdoc) {
    // Inject color-scheme meta so browser renders dark scrollbars + no white flash
    const srcdoc = html.srcdoc.replace(
      /<head([^>]*)>/i,
      `<head$1><meta name="color-scheme" content="dark">`
    );
    return (
      <iframe
        srcDoc={srcdoc}
        style={{
          flex: 1, width: "100%", border: "none",
          background: C.bg, colorScheme: "dark",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin"
        title={file}
      />
    );
  }

  // Pure HTML — scoped styles + body content rendered natively
  return (
    <div
      ref={scrollerRef}
      style={{ flex: 1, overflowY: "auto", background: C.bg }}
    >
      <style>{html.styles}</style>
      <div
        id={html.id}
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html.body }}
      />
    </div>
  );
}