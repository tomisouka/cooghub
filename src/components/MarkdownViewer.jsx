import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mdFiles, txtFiles } from "../globs";

function MarkdownViewer({ filePath, color = "#e8c547", highlight = null, scrollContainer = null, highlightKey = null }) {
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!filePath) return;
    setContent(null);
    setError(false);
    const isTxt = filePath.endsWith(".txt");
    const loader = isTxt ? txtFiles[filePath] : mdFiles[filePath];
    if (!loader) { setError(true); return; }
    loader().then(setContent).catch(() => setError(true));
  }, [filePath]);

  // Highlight + scroll — waits for ReactMarkdown to fully stabilize before highlighting
  useEffect(() => {
    if (!content || !highlight || !bodyRef.current) return;
    const q = highlight.toLowerCase();
    let debounceTimer = null;

    function doHighlight() {
      const el = bodyRef.current;
      if (!el) return;

      // Remove any previous highlights first
      el.querySelectorAll("mark.search-hl").forEach(m => {
        m.replaceWith(document.createTextNode(m.textContent));
      });
      el.normalize();

      // Walk all text nodes and wrap matches
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
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
          mark.className = "search-hl";
          mark.textContent = text.slice(idx, idx + q.length);
          mark.style.cssText = "background:#e8c54766;color:inherit;border-radius:2px;padding:0 1px;";
          if (!firstMark) firstMark = mark;
          frag.appendChild(mark);
          last = idx + q.length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        textNode.parentNode.replaceChild(frag, textNode);
      }

      // Scroll to first match using IntersectionObserver — avoids layout-timing bugs
      if (firstMark) {
        const scroller = scrollContainer?.current || null;
        // If already visible, just scroll it into view immediately
        firstMark.scrollIntoView({ behavior: "smooth", block: "center" });

        // For custom scroll containers (the CoursePage ref), also adjust the
        // container's own scrollTop so the mark lands in the center
        if (scroller) {
          // Use rAF to let the browser finish layout before reading rects
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!firstMark.isConnected) return;
              const markRect   = firstMark.getBoundingClientRect();
              const scrollRect = scroller.getBoundingClientRect();
              const offset     = markRect.top - scrollRect.top - (scroller.clientHeight / 2);
              scroller.scrollBy({ top: offset, behavior: "smooth" });
            });
          });
        }
      }
    }

    // Watch for DOM mutations — debounce so we only run AFTER React finishes rendering
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        observer.disconnect();
        doHighlight();
      }, 80);
    });

    observer.observe(bodyRef.current, { childList: true, subtree: true });

    // Also try immediately in case content is already rendered (e.g. cached)
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (bodyRef.current?.textContent.trim().length > 10) {
        observer.disconnect();
        doHighlight();
      }
    }, 80);

    return () => { observer.disconnect(); clearTimeout(debounceTimer); };
  }, [content, highlight, highlightKey]);

  if (error) return (
    <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>
      could not load file
    </div>
  );

  if (!content) return (
    <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>
      loading...
    </div>
  );

  const isTxt = filePath && filePath.endsWith(".txt");

  if (isTxt) {
    const lines = content.split("\n");
    return (
      <div ref={bodyRef} style={{ padding: "32px 40px", maxWidth: 780 }}>
        <style>{`
          .txt-body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #c0c6d4; }
          .txt-section-header {
            font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
            text-transform: uppercase; color: ${color};
            margin: 32px 0 12px; padding-bottom: 7px;
            border-bottom: 1px solid ${color}30;
          }
          .txt-section-header:first-child { margin-top: 0; }
          .txt-bold-label {
            font-weight: 700; color: #dde2ee; font-size: 16px; margin: 20px 0 4px;
          }
          .txt-line {
            font-size: 16px; line-height: 1.9; color: #b0b6c4; margin: 0 0 3px;
          }
          .txt-line-indent { padding-left: 22px; color: #8890a0; }
          .txt-spacer { height: 8px; }
          .txt-separator { border: none; border-top: 1px solid #2a2e38; margin: 20px 0; }
        `}</style>
        <div className="txt-body">
          {lines.map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} className="txt-spacer" />;
            if (/^[-=*_]{3,}$/.test(trimmed)) return <hr key={i} className="txt-separator" />;
            const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]{2,}/.test(trimmed) && trimmed.length > 3 && trimmed.length < 80;
            const isLabelColon = trimmed.endsWith(":") && trimmed.length < 60 && trimmed.split(" ").length <= 6;
            if (isAllCaps || isLabelColon) {
              return <div key={i} className="txt-section-header">{trimmed.replace(/:$/, "")}</div>;
            }
            const isIndented = line.startsWith("  ") || line.startsWith("\t");
            return <div key={i} className={`txt-line${isIndented ? " txt-line-indent" : ""}`}>{trimmed}</div>;
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", lineHeight: 1.75, color: "#c8c8c8" }}>
      <style>{`
        .md-body h1 { font-family: 'Georgia', serif; font-size: 30px; font-weight: 400; color: #f0f0f0; margin: 0 0 22px; letter-spacing: -0.5px; }
        .md-body h2 { font-family: 'Georgia', serif; font-size: 22px; font-weight: 400; color: #e0e0e0; margin: 34px 0 14px; border-bottom: 1px solid #2a2e38; padding-bottom: 8px; }
        .md-body h3 { font-size: 17px; color: ${color}; margin: 26px 0 10px; font-weight: 600; }
        .md-body h4 { font-size: 14px; color: #888; margin: 18px 0 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .md-body p { margin: 0 0 14px; font-size: 16px; }
        .md-body ul, .md-body ol { margin: 0 0 14px 22px; font-size: 16px; }
        .md-body li { margin-bottom: 6px; }
        .md-body code { font-family: 'Courier New', monospace; background: #1a1d24; border: 1px solid #2a2e38; border-radius: 4px; padding: 2px 7px; font-size: 14px; color: ${color}; }
        .md-body pre { background: #161920; border: 1px solid #2a2e38; border-radius: 8px; padding: 18px; margin: 14px 0; overflow-x: auto; }
        .md-body pre code { background: none; border: none; padding: 0; color: #a0a0a0; font-size: 15px; }
        .md-body blockquote { border-left: 3px solid ${color}44; margin: 14px 0; padding: 10px 18px; color: #888; background: #161920; border-radius: 0 6px 6px 0; font-size: 16px; }
        .md-body strong { color: #e0e0e0; font-weight: 600; }
        .md-body em { color: #aaa; }
        .md-body a { color: ${color}; text-decoration: none; }
        .md-body a:hover { text-decoration: underline; }
        .md-body hr { border: none; border-top: 1px solid #2a2e38; margin: 26px 0; }
        .md-body table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 15px; }
        .md-body th { background: #1a1d24; color: #888; padding: 9px 14px; text-align: left; border: 1px solid #2a2e38; font-family: 'Courier New', monospace; font-size: 12px; text-transform: uppercase; }
        .md-body td { padding: 9px 14px; border: 1px solid #2a2e38; color: #bbb; font-size: 15px; }
        .md-body tr:nth-child(even) td { background: #161920; }
      `}</style>
      <div className="md-body" ref={bodyRef}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownViewer;