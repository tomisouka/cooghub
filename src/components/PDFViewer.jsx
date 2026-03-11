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
    const clampedScaleX = item.width > 0
      ? Math.min(Math.max(
          (item.width * viewport.scale) / (item.str.length * fontHeight * 0.55),
          0.1), 4)
      : 1;

    // Span — selectable text, transparent, scaleX-stretched to match canvas glyphs
    const span = document.createElement("span");
    span.textContent = item.str;
    span.style.cssText = [
      `position:absolute`,
      `left:${tx[4]}px`,
      `top:${tx[5] - ascent}px`,
      `font-size:${fontHeight}px`,
      `transform:scaleX(${clampedScaleX})`,
      `transform-origin:0% 0%`,
      `white-space:pre`,
      `color:transparent`,
      `cursor:text`,
    ].join(";");
    container.appendChild(span);

    // Highlights — separate overlay divs using raw canvas coordinates,
    // completely independent of the span's scaleX transform
    if (q && item.str.toLowerCase().includes(q)) {
      const text    = item.str;
      const low     = text.toLowerCase();
      const itemW   = item.width * viewport.scale; // total canvas width of this item
      const charW   = itemW / text.length;          // per-character canvas width
      const top     = tx[5] - ascent;

      let last = 0;
      while (true) {
        const idx = low.indexOf(q, last);
        if (idx === -1) break;

        const hlLeft  = tx[4] + idx * charW;
        const hlWidth = q.length * charW;

        const mark = document.createElement("div");
        mark.className = "pdf-hl";
        mark.style.cssText = [
          `position:absolute`,
          `left:${hlLeft}px`,
          `top:${top}px`,
          `width:${hlWidth}px`,
          `height:${fontHeight}px`,
          `pointer-events:none`,
        ].join(";");
        container.appendChild(mark);

        last = idx + q.length;
      }
    }
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
  const [renderScale, setRenderScale] = useState(1.4); // only changes when pinch ends
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
  const scaleRef        = useRef(scale);
  const pinchRef        = useRef(null);
  const scrollRef       = useRef(null);

  // Keep scaleRef in sync so touch handlers never read stale closure
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  // Ref callback — fires the moment the scroll div is mounted, guaranteed non-null
  const attachScrollRef = (el) => {
    if (!el || scrollRef.current === el) return;  // already attached
    scrollRef.current = el;

    function getPinchDist(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onTouchStart(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchRef.current = { startDist: getPinchDist(e.touches), startScale: scaleRef.current };
      }
    }

    function onTouchMove(e) {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const dist  = getPinchDist(e.touches);
        const ratio = dist / pinchRef.current.startDist;
        const next  = Math.max(0.6, Math.min(3, +(pinchRef.current.startScale * ratio).toFixed(2)));
        scaleRef.current = next;
        setScale(next);
      }
    }

    function onTouchEnd(e) {
      if (e.touches.length < 2) {
        if (pinchRef.current) {
          // Pinch just ended — commit the scale for re-render
          setRenderScale(scaleRef.current);
        }
        pinchRef.current = null;
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true  });
  };

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
    doRender(pdf, currentPage, renderScale, activeQueryRef.current);
  }, [pdf, currentPage, renderScale]);

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
    doRender(doc, target, renderScale, q);
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
    <div style={{ display:"flex", flexDirection:"column", flex:1, minWidth:0, height:"100%", background:"#111318" }}>

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

        <button style={btn(scale<=0.6)} onClick={()=>{ const n=Math.max(0.6,+(scale-0.2).toFixed(1)); setScale(n); setRenderScale(n); scaleRef.current=n; }}
          onMouseEnter={e=>{if(scale>0.6)e.currentTarget.style.color="#d4d8e0"}}
          onMouseLeave={e=>e.currentTarget.style.color=dim(scale<=0.6)}>−</button>
        <span style={{color:"#4a5060",fontSize:11,fontFamily:FONT,minWidth:34,textAlign:"center"}}>{Math.round(scale*100)}%</span>
        <button style={btn(scale>=3)} onClick={()=>{ const n=Math.min(3,+(scale+0.2).toFixed(1)); setScale(n); setRenderScale(n); scaleRef.current=n; }}
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

      <div
        ref={attachScrollRef}
        style={{flex:1, overflow:"auto", background:"#1a1a1a", padding:"24px", touchAction:"pan-x pan-y pinch-zoom"}}>

        <div style={{
          position:"relative", display:"inline-block", boxShadow:"0 4px 32px rgba(0,0,0,0.6)",
          margin:"0 auto",
          transformOrigin:"top left",
          transform: scale !== renderScale ? `scale(${scale / renderScale})` : "none",
        }}>
          {rendering && (
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#11131888",zIndex:10,color:"#4a5060",fontFamily:FONT,fontSize:13}}>
              rendering…
            </div>
          )}
          <canvas ref={canvasRef} style={{display:"block"}}/>
          <div ref={textLayerRef} className="textLayer"/>
        </div>
      </div>

      <style>{`
        .pdf-hl {
          background: #e8c54799;
          border-radius: 2px;
          z-index: 1;
        }
        .textLayer span {
          z-index: 2;
        }
      `}</style>
    </div>
  );
}