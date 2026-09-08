/**
 * domFind.js — overlay-based in-page search
 *
 * Uses Range.getClientRects() to find where text is on screen, then
 * draws highlight rectangles on a position:fixed SVG overlay that sits
 * above the page. Zero DOM mutation — React can re-render all it wants.
 *
 * Works on WebKitGTK (Linux/Tauri), WebView2 (Windows), and Chrome.
 * No CSS.highlights dependency. No <mark> injection.
 *
 * input/textarea values: highlighted with a CSS outline class since
 * you cannot get character-level rects from a form field value.
 *
 * Case insensitive. Any query length ≥ 1 char supported.
 */

// ── overlay SVG ───────────────────────────────────────────────────────────────

const OVERLAY_ID   = "ctrl-f-overlay";
const FIELD_HL     = "ctrl-f-field-hl";
const FIELD_ACTIVE = "ctrl-f-field-hl-active";

function injectStyles() {
  if (document.getElementById("ctrl-f-styles")) return;
  const s = document.createElement("style");
  s.id = "ctrl-f-styles";
  s.textContent = `
    #${OVERLAY_ID} {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      overflow: visible;
    }
    .${FIELD_HL}     { outline: 2px solid #e8c54766 !important; outline-offset: 1px !important; }
    .${FIELD_ACTIVE} { outline: 2px solid #e8c547cc !important; outline-offset: 1px !important; background-color: #e8c54718 !important; }
  `;
  document.head.appendChild(s);
}

function getOverlay() {
  let svg = document.getElementById(OVERLAY_ID);
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = OVERLAY_ID;
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    document.body.appendChild(svg);
  }
  return svg;
}

function clearOverlay() {
  const svg = document.getElementById(OVERLAY_ID);
  if (svg) svg.innerHTML = "";
}

function drawRect(x, y, w, h, fill, stroke) {
  const svg  = getOverlay();
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x",      x);
  rect.setAttribute("y",      y);
  rect.setAttribute("width",  w);
  rect.setAttribute("height", h);
  rect.setAttribute("fill",   fill);
  if (stroke) {
    rect.setAttribute("stroke",       stroke);
    rect.setAttribute("stroke-width", "1.5");
  }
  rect.setAttribute("rx", "2");
  svg.appendChild(rect);
  return rect;
}

// ── iframe bridge ─────────────────────────────────────────────────────────────
// When a srcdoc iframe is active (ReferenceViewer sets window._ctrlFIframe),
// we postMessage search commands to it and merge its match count with ours.

let _iframeCount   = 0;  // matches reported back from iframe
let _iframeOnUpdate = null;

function postIframe(action, query) {
  const ref = window._ctrlFIframe?.current;
  if (!ref?.contentWindow) return false;
  ref.contentWindow.postMessage({ target: "ctrl-f-iframe", action, query }, "*");
  return true;
}

// Listen for count back from iframe
if (typeof window !== "undefined") {
  window.addEventListener("message", (e) => {
    if (!e.data || e.data.type !== "ctrl-f-count") return;
    _iframeCount = e.data.total ?? 0;
    // Refire onUpdate with combined count
    if (_iframeOnUpdate) {
      _iframeOnUpdate(matches.length + _iframeCount);
    }
  });
}



// matches[] = { type: "range"|"field", range?, el?, rects? }
let matches      = [];
let currentIndex = -1;
let _activeQuery = "";
let _rafId       = null;

// ── helpers ───────────────────────────────────────────────────────────────────

function nearestScroller(el) {
  let node = el?.parentElement;
  while (node && node !== document.body) {
    const ov = getComputedStyle(node).overflowY;
    if (ov === "auto" || ov === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

function scrollIntoView(el) {
  const sc = nearestScroller(el);
  if (sc) {
    const r = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
    sc.scrollBy({ top: r.top - sr.top - sc.clientHeight / 2, behavior: "smooth" });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function isInFindBar(el) { return !!el?.closest?.("#ctrl-f-bar"); }

function makeWalker() {
  return document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const tag = node.parentElement?.tagName?.toLowerCase();
      if (["script","style","noscript","textarea","input"].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (isInFindBar(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
}

// ── public API ────────────────────────────────────────────────────────────────

let _scrollHandler = null;

export function clearHighlights() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  _activeQuery = "";
  _iframeCount  = 0;
  _iframeOnUpdate = null;
  clearOverlay();
  document.querySelectorAll(`.${FIELD_HL},.${FIELD_ACTIVE}`).forEach(el => {
    el.classList.remove(FIELD_HL, FIELD_ACTIVE);
  });
  matches = []; currentIndex = -1;
  postIframe("clear");

  if (_scrollHandler) {
    window.removeEventListener("scroll",  _scrollHandler, true);
    window.removeEventListener("resize",  _scrollHandler);
    _scrollHandler = null;
  }
}

export function highlightAll(query, onUpdate) {
  clearHighlights();
  if (!query || query.trim().length < 1) return 0;

  injectStyles();
  _activeQuery    = query;
  _iframeOnUpdate = onUpdate;

  // Tell the iframe to search too — it will postMessage back with its count
  postIframe("search", query);

  _rafId = requestAnimationFrame(() => {
    _rafId = requestAnimationFrame(() => {
      _rafId = null;
      const count = _run(query);
      // Report combined count (iframe may add to this via message listener)
      onUpdate?.(count + _iframeCount);
    });
  });

  return 0;
}

export function findNext() {
  // If parent has matches, cycle those first; then hand off to iframe
  if (matches.length) {
    currentIndex = (currentIndex + 1) % matches.length;
    _redraw();
    scrollToCurrent();
    return { current: currentIndex + 1, total: matches.length + _iframeCount };
  }
  if (_iframeCount) {
    postIframe("next");
    return { current: 1, total: _iframeCount }; // iframe will postMessage back
  }
  return { current: 0, total: 0 };
}

export function findPrev() {
  if (matches.length) {
    currentIndex = (currentIndex - 1 + matches.length) % matches.length;
    _redraw();
    scrollToCurrent();
    return { current: currentIndex + 1, total: matches.length + _iframeCount };
  }
  if (_iframeCount) {
    postIframe("prev");
    return { current: 1, total: _iframeCount };
  }
  return { current: 0, total: 0 };
}

export function getStats() {
  return { current: currentIndex + 1, total: matches.length };
}

// ── core run ──────────────────────────────────────────────────────────────────

function _run(query) {
  matches = []; currentIndex = -1;
  const q = query.toLowerCase();

  // ── text nodes → Range objects ────────────────────────────────────────────
  const walker = makeWalker();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent, lower = text.toLowerCase();
    let pos = 0, idx;
    while ((idx = lower.indexOf(q, pos)) !== -1) {
      const range = new Range();
      range.setStart(node, idx);
      range.setEnd(node, idx + q.length);
      matches.push({ type: "range", range, el: node.parentElement });
      pos = idx + q.length;
    }
  }

  // ── input/textarea values ─────────────────────────────────────────────────
  document.body.querySelectorAll("input, textarea").forEach(field => {
    if (field.type === "password" || field.type === "hidden") return;
    if (isInFindBar(field)) return;
    if ((field.value ?? "").toLowerCase().includes(q)) {
      matches.push({ type: "field", el: field });
    }
  });

  if (matches.length) {
    currentIndex = 0; _redraw(); scrollToCurrent();

    // Keep overlay aligned when user scrolls or resizes
    if (!_scrollHandler) {
      _scrollHandler = () => _redraw();
      window.addEventListener("scroll", _scrollHandler, true);
      window.addEventListener("resize", _scrollHandler);
    }
  }
  return matches.length;
}

// ── draw all rects ────────────────────────────────────────────────────────────

function _redraw() {
  clearOverlay();

  // Clear field classes
  document.querySelectorAll(`.${FIELD_HL},.${FIELD_ACTIVE}`).forEach(el => {
    el.classList.remove(FIELD_HL, FIELD_ACTIVE);
  });

  matches.forEach((m, i) => {
    const isActive = i === currentIndex;

    if (m.type === "range") {
      const rects = m.range.getClientRects();
      for (const r of rects) {
        if (r.width < 1 || r.height < 1) continue;
        drawRect(
          r.left, r.top, r.width, r.height,
          isActive ? "#e8c547cc" : "#e8c54755",
          isActive ? "#e8c547"   : null,
          isActive
        );
      }
    } else {
      // field match — CSS outline
      m.el.classList.add(isActive ? FIELD_ACTIVE : FIELD_HL);
    }
  });
}

function scrollToCurrent() {
  const m = matches[currentIndex];
  if (!m) return;
  if (m.type === "range") {
    scrollIntoView(m.el);
  } else {
    scrollIntoView(m.el);
  }
}