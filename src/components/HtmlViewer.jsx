import { useState, useEffect } from "react";
import { htmlFiles } from "../globs";

function HtmlViewer({ ref_, BASE }) {
  const [htmlContent, setHtmlContent] = useState(null);
  const isContent = ref_.file.startsWith("./content/");

  useEffect(() => {
    if (!isContent) { setHtmlContent(null); return; }
    const loader = htmlFiles[ref_.file];
    if (!loader) { setHtmlContent(""); return; }
    loader().then(setHtmlContent).catch(() => setHtmlContent(""));
  }, [ref_.file]);

  return (
    <>
      <div style={{
        padding: "12px 20px", borderBottom: "1px solid #1a1a1a",
        display: "flex", alignItems: "center", gap: 12,
        fontFamily: "'Courier New', monospace", fontSize: 12, color: "#555", flexShrink: 0,
      }}>
        <span style={{ color: ref_.color }}>◈</span>
        {ref_.label}
        {!isContent && (
          <a href={`${BASE}/${ref_.file}`} target="_blank" rel="noopener noreferrer"
            style={{ marginLeft: "auto", color: "#444", fontSize: 11, textDecoration: "none" }}>
            open in new tab →
          </a>
        )}
      </div>
      {isContent ? (
        htmlContent === null
          ? <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>loading...</div>
          : htmlContent === ""
          ? <div style={{ padding: 24, fontFamily: "'Courier New', monospace", color: "#444", fontSize: 13 }}>could not load file</div>
          : <div style={{ flex: 1, overflowY: "auto", background: "#fff", padding: "24px 32px" }}
              dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <iframe src={`${BASE}/${ref_.file}`} style={{ flex: 1, border: "none", background: "#fff" }} title={ref_.label} />
      )}
    </>
  );
}


export default HtmlViewer;
