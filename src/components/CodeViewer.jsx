import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cppFiles, pyFiles } from "../globs";

const FONT = "'Inter', 'Segoe UI', sans-serif";

function CodeViewer({ filePath, highlight = null, highlightKey = null }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);
  const [matchLines, setMatchLines] = useState([]);
  const [matchIdx, setMatchIdx]     = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!filePath) return;
    setContent(null);
    setError(false);
    const isPy = filePath.endsWith(".py");
    if (isPy) {
      // Python files live in public/content/ — fetch via HTTP
      fetch(`/content/${filePath.replace("./content/", "")}`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(setContent)
        .catch(() => setError(true));
      return;
    }
    const loader = cppFiles[filePath];
    if (!loader) { setError(true); return; }
    loader().then(setContent).catch(() => setError(true));
  }, [filePath]);

  // Build match line list whenever content, query, or key changes
  useEffect(() => {
    if (!content || !highlight) { setMatchLines([]); return; }
    const q = highlight.toLowerCase();
    const lines = content.split("\n");
    const hits = lines.reduce((acc, line, i) => {
      if (line.toLowerCase().includes(q)) acc.push(i + 1);
      return acc;
    }, []);
    setMatchLines(hits);
    setMatchIdx(0);
  }, [content, highlight, highlightKey]);

  // Scroll to current match + inject inline word highlights
  useEffect(() => {
    if (!matchLines.length || !containerRef.current || !highlight) return;
    const lineNum = matchLines[matchIdx];
    const q = highlight.toLowerCase();

    // react-syntax-highlighter with wrapLines renders each line as a direct
    // child span of the <code> element — grab them that way
    const codeEl = containerRef.current.querySelector("code");
    if (!codeEl) return;

    // Get all line spans (direct children of <code>)
    const lineSpans = Array.from(codeEl.children);
    const target = lineSpans[lineNum - 1];
    if (!target) return;

    // Scroll to line
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    // Inject inline word highlights into this line's text nodes
    // Clear any previous injected marks first
    codeEl.querySelectorAll(".code-hl").forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });

    // Walk text nodes in the target line span and wrap matches
    function wrapMatches(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const low  = text.toLowerCase();
        const idx  = low.indexOf(q);
        if (idx === -1) return;

        const before = document.createTextNode(text.slice(0, idx));
        const mark   = document.createElement("mark");
        mark.className = "code-hl";
        mark.textContent = text.slice(idx, idx + q.length);
        const after  = document.createTextNode(text.slice(idx + q.length));

        const frag = document.createDocumentFragment();
        frag.appendChild(before);
        frag.appendChild(mark);
        frag.appendChild(after);
        node.parentNode.replaceChild(frag, node);
        // recurse on the after node in case of multiple matches
        wrapMatches(after);
      } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains("code-hl")) {
        Array.from(node.childNodes).forEach(wrapMatches);
      }
    }
    wrapMatches(target);

  }, [matchIdx, matchLines, highlight]);

  if (error) return (
    <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>
      could not load file — make sure cpp files are copied to src/content/code/
    </div>
  );

  if (!content) return (
    <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>
      loading...
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {highlight && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "7px 16px", background: "#161920",
          borderBottom: "1px solid #2a2e38", flexShrink: 0,
        }}>
          <span style={{ color: "#e8c547", fontSize: 11, fontFamily: FONT, fontWeight: 600 }}>
            "{highlight}"
          </span>
          {matchLines.length === 0 ? (
            <span style={{ color: "#4a5060", fontSize: 11, fontFamily: FONT }}>no matches</span>
          ) : (
            <>
              <span style={{ color: "#7a8090", fontSize: 11, fontFamily: FONT }}>
                {matchIdx + 1} / {matchLines.length} — line {matchLines[matchIdx]}
              </span>
              <button onClick={() => setMatchIdx(i => Math.max(0, i - 1))} disabled={matchIdx === 0}
                style={{ background: "none", border: "none", color: matchIdx === 0 ? "#2a2e38" : "#7a8090", cursor: matchIdx === 0 ? "default" : "pointer", fontSize: 14, padding: "0 2px" }}>
                ↑
              </button>
              <button onClick={() => setMatchIdx(i => Math.min(matchLines.length - 1, i + 1))} disabled={matchIdx === matchLines.length - 1}
                style={{ background: "none", border: "none", color: matchIdx === matchLines.length - 1 ? "#2a2e38" : "#7a8090", cursor: matchIdx === matchLines.length - 1 ? "default" : "pointer", fontSize: 14, padding: "0 2px" }}>
                ↓
              </button>
            </>
          )}
        </div>
      )}
      <div ref={containerRef} style={{ flex: 1, overflowY: "auto" }}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap" />
        <style dangerouslySetInnerHTML={{ __html: `
          .code-viewer-wrap,
          .code-viewer-wrap *,
          .code-viewer-wrap code[class*="language-"],
          .code-viewer-wrap pre[class*="language-"],
          .code-viewer-wrap span {
            font-family: 'JetBrains Mono', 'Courier New', monospace !important;
            font-size: 18px !important;
            line-height: 2 !important;
            font-weight: 700 !important;
          }

          /* Comments — readable muted green, italic */
          .code-viewer-wrap .token.comment,
          .code-viewer-wrap .token.prolog,
          .code-viewer-wrap .token.doctype {
            color: #7a9272 !important;
            font-style: italic !important;
            font-weight: 500 !important;
          }

          /* Plain identifiers */
          .code-viewer-wrap .token.plain { color: #cdd4de !important; }

          /* Keywords — dusty blue */
          .code-viewer-wrap .token.keyword { color: #7aaccc !important; }

          /* Strings */
          .code-viewer-wrap .token.string,
          .code-viewer-wrap .token.char { color: #96bc78 !important; }

          /* Numbers */
          .code-viewer-wrap .token.number { color: #c9855a !important; }

          /* Functions */
          .code-viewer-wrap .token.function { color: #7ab0d4 !important; }

          /* Types / builtins */
          .code-viewer-wrap .token.class-name,
          .code-viewer-wrap .token.builtin { color: #c8a96e !important; }

          /* Operators */
          .code-viewer-wrap .token.operator { color: #6aaa9a !important; }

          /* Punctuation */
          .code-viewer-wrap .token.punctuation { color: #7a8898 !important; }

          /* Preprocessor */
          .code-viewer-wrap .token.macro,
          .code-viewer-wrap .token.directive-hash,
          .code-viewer-wrap .token.directive { color: #a882b8 !important; }

          /* Inline search highlight */
          .code-hl {
            background: #e8c547bb;
            color: #111 !important;
            border-radius: 3px;
            padding: 0 2px;
            font-weight: 700 !important;
          }
        ` }} />
        <div className="code-viewer-wrap" style={{ height: "100%" }}>
          <SyntaxHighlighter
            language={filePath?.endsWith(".py") ? "python" : "cpp"}
            style={vscDarkPlus}
            customStyle={{
              background: "#13151c",
              border: "none",
              borderRadius: 0,
              margin: 0,
              padding: "28px 28px",
              fontSize: "18px",
              lineHeight: "2",
              minHeight: "100%",
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontWeight: "700",
            }}
            showLineNumbers
            lineNumberStyle={{
              color: "#3a4858",
              minWidth: "3.2em",
              fontSize: "13px",
              userSelect: "none",
              fontWeight: "400",
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            }}
            wrapLines={true}
            lineProps={lineNum => ({
              style: lineNum === matchLines[matchIdx]
                ? { display: "block", background: "#e8c54720" }
                : { display: "block" }
            })}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

export default CodeViewer;