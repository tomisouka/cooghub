import { useState, useEffect, useRef } from "react";

const FONT = "'Inter', 'Segoe UI', sans-serif";
const PDFJS_VERSION = "3.11.174";

let pdfjsLib = null;
async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  if (window.pdfjsLib) { pdfjsLib = window.pdfjsLib; return pdfjsLib; }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
    script.onload = () => {
      pdfjsLib = window.pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
      resolve(pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function buildTextLayer(page, viewport, container, hlQuery) {
  const textContent = await page.getTextContent();
  container.innerHTML = "";
  container.style.width  = `${viewport.width}px`;
  container.style.height = `${viewport.height}px`;

  const q = hlQuery?.trim().toLowerCase();

  textContent.items.forEach(item => {
    if (!item.str?.trim()) return;
    const tx = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
    const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
    const style = textContent.styles?.[item.fontName];
    const ascent = style?.ascent ? style.ascent * fontHeight : fontHeight * 0.8;
    const scaleX = item.width > 0
      ? (item.width * viewport.scale) / (item.str.length * fontHeight * 0.55)
      : 1;

    const span = document.createElement("span");
    span.style.cssText = [
      `position:absolute`,
      `left:${tx[4]}px`,
      `top:${tx[5] - ascent}px`,
      `font-size:${fontHeight}px`,
      `transform:scaleX(${Math.min(Math.max(scaleX, 0.1), 4)})`,
      `transform-origin:0% 0%`,
      `white-space:pre`,
      `color:transparent`,
      `cursor:text`,
    ].join(";");

    if (q && item.str.toLowerCase().includes(q)) {
      const text = item.str;
      const low  = text.toLowerCase();
      let last = 0;
      while (true) {
        const idx = low.indexOf(q, last);
        if (idx === -1) { span.appendChild(document.createTextNode(text.slice(last))); break; }
        if (idx > last) span.appendChild(document.createTextNode(text.slice(last, idx)));
        const mark = document.createElement("mark");
        mark.className = "pdf-hl";
        mark.textContent = text.slice(idx, idx + q.length);
        span.appendChild(mark);
        last = idx + q.length;
      }
    } else {
      span.textContent = item.str;
    }
    container.appendChild(span);
  });
}

async function findInPdf(pdfDoc, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = [];
  for (let p = 1; p <= pdfDoc.numPages; p++) {
    const page    = await pdfDoc.getPage(p);
    const content = await page.getTextContent();
    const text    = content.items.map(i => i.str).join("").toLowerCase();
    if (text.includes(q)) hits.push(p);
  }
  return hits;
}

export default function PDFViewer({ file, initialPage = 1, highlight = null }) {
  const [pdf,         setPdf]         = useState(null);
  const [numPages,    setNumPages]    = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage,   setInputPage]   = useState(String(initialPage));
  const [scale,       setScale]       = useState(1.4);
  const [rendering,   setRendering]   = useState(false);
  const [loadErr,     setLoadErr]     = useState(null);
  const [searchQuery, setSearchQuery] = useState(highlight || "");
  const [matches,     setMatches]     = useState([]);
  const [matchIdx,    setMatchIdx]    = useState(0);
  const [searching,   setSearching]   = useState(false);
  const [searchRan,   setSearchRan]   = useState(false);

  const canvasRef       = useRef(null);
  const textLayerRef    = useRef(null);
  const renderTask      = useRef(null);
  const pdfRef          = useRef(null);
  const activeQueryRef  = useRef(highlight || "");

  useEffect(() => {
    if (!file) return;
    setLoadErr(null); setPdf(null); setMatches([]); setSearchRan(false);
    setCurrentPage(initialPage); setInputPage(String(initialPage));
    getPdfJs()
      .then(lib => lib.getDocument(`/pdfs/${file}`).promise)
      .then(doc => { pdfRef.current = doc; setPdf(doc); setNumPages(doc.numPages); })
      .catch(() => setLoadErr("Could not load PDF."));
    return () => renderTask.current?.cancel();
  }, [file]);

  useEffect(() => {
    if (pdf && highlight && !searchRan) {
      setSearchRan(true);
      runSearch(highlight, pdf);
    }
  }, [pdf, highlight]);

  useEffect(() => {
    if (!pdf) return;
    doRender(pdf, currentPage, scale, activeQueryRef.current);
  }, [pdf, currentPage, scale]);

  async function doRender(pdfDoc, pageNum, sc, hlQuery) {
    renderTask.current?.cancel();
    setRendering(true);
    try {
      const page     = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: sc });
      const canvas   = canvasRef.current;
      if (!canvas) { setRendering(false); return; }
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      const task = page.render({ canvasContext: canvas.getContext("2d"), viewport });
      renderTask.current = task;
      await task.promise;
      setRendering(false);
      if (textLayerRef.current)
        await buildTextLayer(page, viewport, textLayerRef.current, hlQuery);
    } catch (e) {
      if (e?.name !== "RenderingCancelledException") setRendering(false);
    }
  }

  async function runSearch(q, pdfDoc) {
    const doc = pdfDoc || pdfRef.current;
    if (!doc || !q?.trim()) { setMatches([]); setSearchRan(true); return; }
    activeQueryRef.current = q;
    setSearching(true); setSearchRan(true);
    const found = await findInPdf(doc, q);
    setMatches(found); setMatchIdx(0);
    const target = found.length > 0 ? found[0] : currentPage;
    goToPage(target);
    setSearching(false);
    doRender(doc, target, scale, q);
  }

  function goToPage(n) {
    const p = Math.max(1, Math.min(numPages || 9999, n));
    setCurrentPage(p); setInputPage(String(p));
  }

  function prevMatch() {
    if (!matches.length) return;
    const idx = Math.max(0, matchIdx - 1); setMatchIdx(idx); goToPage(matches[idx]);
  }
  function nextMatch() {
    if (!matches.length) return;
    const idx = Math.min(matches.length - 1, matchIdx + 1); setMatchIdx(idx); goToPage(matches[idx]);
  }

  const dim = d => d ? "#2a2e38" : "#7a8090";
  const btn = d => ({ background:"none", border:"none", cursor: d?"default":"pointer", color:dim(d), fontSize:16, padding:"0 5px", fontFamily:FONT, lineHeight:1, transition:"color 0.1s" });

  if (loadErr) return <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#4a5060", fontFamily:FONT }}>{loadErr}</div>;
  if (!pdf)    return <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#4a5060", fontFamily:FONT }}>loading pdf…</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#111318" }}>

      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:"#161920", borderBottom:"1px solid #2a2e38", flexShrink:0, flexWrap:"wrap" }}>

        <button style={btn(currentPage<=1)} onClick={()=>goToPage(currentPage-1)}
          onMouseEnter={e=>{if(currentPage>1)e.currentTarget.style.color="#d4d8e0"}}
          onMouseLeave={e=>e.currentTarget.style.color=dim(currentPage<=1)}>←</button>
        <input value={inputPage}
          onChange={e=>{setInputPage(e.target.value);const n=parseInt(e.target.value);if(!isNaN(n))goToPage(n);}}
          onBlur={()=>setInputPage(String(currentPage))}
          style={{width:40,textAlign:"center",background:"#21252e",border:"1px solid #2a2e38",borderRadius:5,color:"#d4d8e0",fontSize:12,fontFamily:FONT,fontWeight:600,padding:"3px 4px",outline:"none"}}/>
        <span style={{color:"#4a5060",fontSize:12,fontFamily:FONT}}>/ {numPages}</span>
        <button style={btn(currentPage>=numPages)} onClick={()=>goToPage(currentPage+1)}
          onMouseEnter={e=>{if(currentPage<numPages)e.currentTarget.style.color="#d4d8e0"}}
          onMouseLeave={e=>e.currentTarget.style.color=dim(currentPage>=numPages)}>→</button>

        <div style={{width:1,height:16,background:"#2a2e38",margin:"0 2px"}}/>

        <button style={btn(scale<=0.6)} onClick={()=>setScale(s=>Math.max(0.6,+(s-0.2).toFixed(1)))}
          onMouseEnter={e=>{if(scale>0.6)e.currentTarget.style.color="#d4d8e0"}}
          onMouseLeave={e=>e.currentTarget.style.color=dim(scale<=0.6)}>−</button>
        <span style={{color:"#4a5060",fontSize:11,fontFamily:FONT,minWidth:34,textAlign:"center"}}>{Math.round(scale*100)}%</span>
        <button style={btn(scale>=3)} onClick={()=>setScale(s=>Math.min(3,+(s+0.2).toFixed(1)))}
          onMouseEnter={e=>{if(scale<3)e.currentTarget.style.color="#d4d8e0"}}
          onMouseLeave={e=>e.currentTarget.style.color=dim(scale>=3)}>+</button>

        <div style={{width:1,height:16,background:"#2a2e38",margin:"0 2px"}}/>

        <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&runSearch(searchQuery)}
          placeholder="search pdf…"
          style={{background:"#21252e",border:"1px solid #2a2e38",borderRadius:6,color:"#d4d8e0",fontSize:12,fontFamily:FONT,fontWeight:500,padding:"4px 10px",outline:"none",width:150}}/>
        <button onClick={()=>runSearch(searchQuery)}
          style={{background:"#21252e",border:"1px solid #2a2e38",borderRadius:6,cursor:"pointer",padding:"4px 10px",color:"#7a8090",fontSize:11,fontFamily:FONT,fontWeight:600}}
          onMouseEnter={e=>e.currentTarget.style.color="#e8c547"}
          onMouseLeave={e=>e.currentTarget.style.color="#7a8090"}>
          {searching?"…":"find"}
        </button>

        {searchRan && !searching && (
          matches.length > 0 ? (
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{color:"#e8c547",fontSize:11,fontFamily:FONT,fontWeight:600,whiteSpace:"nowrap"}}>
                {matchIdx+1}/{matches.length} pages
              </span>
              <button style={btn(matchIdx===0)} onClick={prevMatch}
                onMouseEnter={e=>{if(matchIdx>0)e.currentTarget.style.color="#d4d8e0"}}
                onMouseLeave={e=>e.currentTarget.style.color=dim(matchIdx===0)}>↑</button>
              <button style={btn(matchIdx===matches.length-1)} onClick={nextMatch}
                onMouseEnter={e=>{if(matchIdx<matches.length-1)e.currentTarget.style.color="#d4d8e0"}}
                onMouseLeave={e=>e.currentTarget.style.color=dim(matchIdx===matches.length-1)}>↓</button>
            </div>
          ) : (
            <span style={{color:"#4a5060",fontSize:11,fontFamily:FONT}}>no matches</span>
          )
        )}
      </div>

      <div style={{flex:1,overflow:"auto",background:"#1a1a1a",display:"flex",justifyContent:"center",padding:"24px 0"}}>
        <div style={{position:"relative",display:"inline-block",boxShadow:"0 4px 32px rgba(0,0,0,0.6)"}}>
          {rendering && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#11131888",zIndex:10,color:"#4a5060",fontFamily:FONT,fontSize:13}}>
              rendering…
            </div>
          )}
          <canvas ref={canvasRef} style={{display:"block"}}/>
          <div ref={textLayerRef} className="textLayer"/>
        </div>
      </div>

      <style>{`.pdf-hl { background: #e8c547bb !important; color: #111 !important; border-radius: 2px; padding: 0 1px; }`}</style>
    </div>
  );
}