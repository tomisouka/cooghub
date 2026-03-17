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

// BlobIframe — loads HTML via a data: URI so Vite's HMR WebSocket client
// (running in the parent page) cannot reach into this iframe's browsing context.
// srcDoc iframes share enough context with the parent that Chrome allows Vite's
// devtools/HMR bridge to inject @vite/client into them, causing CORS errors.
// A data: URI iframe is a fully opaque origin — no parent access possible.
// Anchor clicks are handled by an injected script since fragment nav doesn't
// work across opaque origins.
function BlobIframe({ html, file, bg }) {
  return (
    <iframe
      srcDoc={html}
      style={{ flex: 1, width: "100%", height: "100%", border: "none", background: bg, colorScheme: "dark", display: "block" }}
      sandbox="allow-scripts"
      title={file}
    />
  );
}

// Module-level cache — survives React Fast Refresh HMR remounts (unlike useState).
// Keys are "basePath/file", values are the processed HTML string.
// This prevents re-fetching on every HMR cycle, which was causing a fresh srcdoc
// to be built each time — and during that window Vite could inject @vite/client.
const _htmlCache = new Map();

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

export default function ReferenceViewer({ file, color = C.accent, highlight = null, highlightKey = null, basePath = "/references" }) {
  const [html,    setHtml]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef          = useRef(null);
  const scrollerRef           = useRef(null);
  const uid                   = useRef(`rv-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!file) return;

    const cacheKey = `${basePath}/${file}`;

    // If we already have this file cached (e.g. after HMR remount), use it directly.
    if (_htmlCache.has(cacheKey)) {
      setHtml(_htmlCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setHtml(null);
    setError(null);

    // Append ?raw so Vite serves the file directly from disk, bypassing
    // transformIndexHtml (inject @vite/client etc). In Tauri the asset protocol
    // serves files as-is — no Vite middleware — so ?raw is omitted there.
    const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;


    fetch(IS_TAURI ? cacheKey : `${cacheKey}?raw`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.text(); })
      .then(raw => {
        const id = uid.current;


        // Keep Google Fonts — stripping breaks font rendering on web
        // APK WebView: fonts load async and don't block layout meaningfully
        let processed = raw.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, "");

        // Strip ALL Vite dev-server injected scripts — nuclear: remove every
        // <script src> whose src contains /@vite, /@react-refresh, or /src/
        // Also strip the inline react-refresh preamble block.
        processed = processed.replace(/<script\b[^>]*\bsrc="[^"]*(?:\/@vite|\/@react-refresh|\/src\/)[^"]*"[^>]*>\s*<\/script>/gi, "");
        processed = processed.replace(/<script\b[^>]*\bsrc='[^']*(?:\/@vite|\/@react-refresh|\/src\/)[^']*'[^>]*>\s*<\/script>/gi, "");
        processed = processed.replace(/<script[^>]*>[\s\S]*?__vite_plugin_react_preamble[\s\S]*?<\/script>/gi, "");


        // If the file has <script> tags, render via srcdoc iframe so scripts execute.
        // dangerouslySetInnerHTML intentionally doesn't run scripts, so interactive
        // pages (DFA simulator, DP visualizer, inline search filters) need a real context.
        const hasScripts = /<script[\s>]/i.test(processed);
        if (hasScripts) {
          const val = { id, srcdoc: processed };
          _htmlCache.set(cacheKey, val);
          setHtml(val);
          setLoading(false);
          return;
        }

        // Pure HTML — extract <style> blocks and scope them to our container id
        // so they don't leak into the rest of the app
        const styles = [];
        // Re-inject Google Font links as @import so fonts actually load
        const fontLinks = [];
        raw.replace(/<link[^>]*fonts\.googleapis\.com[^>]*href=["']([^"']+)["'][^>]*>/gi, (_, href) => fontLinks.push(href));
        raw.replace(/<link[^>]*href=["']([^"']*fonts\.googleapis\.com[^"']*)["'][^>]*>/gi, (_, href) => fontLinks.push(href));
        if (fontLinks.length) styles.push(fontLinks.map(h => `@import url('${h}');`).join('\n'));
        processed = processed.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
          const scoped = css
            .replace(/:root\s*\{/g, `#${id} {`)
            // Replace bare `body` selector only — not class names like .card-body
            .replace(/(^|[\s,{})>+~])body(\s*[{,>+~:[])/gm, `$1#${id}$2`);
          // Prepend a fallback: ensure all text in this container is visible by default
          const withFallback = `#${id} { color: #d4d8e0; width: 100%; box-sizing: border-box; }\n` + scoped;
          styles.push(withFallback);
          return "";
        });

        // Extract <body> content only
        const bodyMatch = processed.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyHtml  = bodyMatch ? bodyMatch[1] : processed;

        const val = { id, styles: styles.join("\n"), body: bodyHtml };
        _htmlCache.set(cacheKey, val);
        setHtml(val);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [file, basePath]);

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

  // Scripted files — render via srcDoc iframe so JS executes correctly.
  // The fetch uses ?raw to bypass Vite's transformIndexHtml, so the HTML arrives
  // clean — no @vite/client, @react-refresh, or /src/main.jsx injected.
  if (html.srcdoc) {
    const injected = html.srcdoc.replace(
      /<head([^>]*)>/i,
      `<head$1>` +
      `<meta name="color-scheme" content="dark"><style>` +
      `html, body { min-height: unset !important; height: auto !important; }` +
      `body { overflow-y: auto !important; }` +
      `nav, header, .section-strip, [class*="strip"], [class*="nav"] { position: relative !important; top: auto !important; }` +
      // Intercept anchor clicks and scroll to target — needed because blob: URL iframes
      // can't use fragment navigation the same way as same-origin iframes.
      `</style><script>document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;e.preventDefault();var t=document.getElementById(a.getAttribute('href').slice(1));if(t)t.scrollIntoView({behavior:'smooth',block:'start'});});</script>`
    );
    return (
      <BlobIframe key={html.id} html={injected} file={file} bg={C.bg} />
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
        style={{ width: "100%", boxSizing: "border-box" }}
        dangerouslySetInnerHTML={{ __html: html.body }}
      />
    </div>
  );
}