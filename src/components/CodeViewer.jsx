import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cppFiles } from "../globs";

const FONT = "'Inter', 'Segoe UI', sans-serif";

function CodeViewer({ filePath, highlight = null }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);
  const [matchLines, setMatchLines] = useState([]);
  const [matchIdx, setMatchIdx]     = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!filePath) return;
    setContent(null);
    setError(false);
    const loader = cppFiles[filePath];
    if (!loader) { setError(true); return; }
    loader().then(setContent).catch(() => setError(true));
  }, [filePath]);

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
  }, [content, highlight]);

  useEffect(() => {
    if (!matchLines.length || !containerRef.current) return;
    const lineNum = matchLines[matchIdx];
    const rows = containerRef.current.querySelectorAll(".linenumber, [class*='line-number']");
    const codeLines = containerRef.current.querySelectorAll("span.token-line, .token-line");
    const target = codeLines[lineNum - 1];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.background = "#e8c54730";
      setTimeout(() => { if (target) target.style.background = ""; }, 1200);
    }
  }, [matchIdx, matchLines]);

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
        ` }} />
        <div className="code-viewer-wrap" style={{ height: "100%" }}>
          <SyntaxHighlighter
            language="cpp"
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
              style: matchLines.includes(lineNum)
                ? { display: "block", background: "#e8c54718" }
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