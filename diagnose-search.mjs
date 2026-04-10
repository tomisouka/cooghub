/**
 * diagnose-search.mjs
 * Run from your project root: node diagnose-search.mjs
 * Tests everything that can be tested without a browser.
 * For DOM checks, see the console paste in diagnose-search.js
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = new URL(".", import.meta.url).pathname;

let passed = 0, failed = 0;
function pass(msg)        { passed++; console.log(`✅  ${msg}`); }
function fail(msg, detail){ failed++; console.log(`❌  ${msg}`); if (detail) console.log(`    → ${detail}`); }
function info(msg)        { console.log(`ℹ️   ${msg}`); }
function section(msg)     { console.log(`\n── ${msg} ──`); }

// ── file existence ────────────────────────────────────────────────────────────
section("1. FILE EXISTS");
const files = {
  domFind:  "src/utils/domFind.js",
  search:   "src/search.js",
  app:      "src/App.jsx",
  home:     "src/pages/HomePage.jsx",
  index:    "src/index.css",
};
const src = {};
for (const [key, rel] of Object.entries(files)) {
  const abs = resolve(ROOT, rel);
  if (existsSync(abs)) {
    src[key] = readFileSync(abs, "utf8");
    pass(`${rel} exists (${src[key].length} chars)`);
  } else {
    fail(`${rel} MISSING`);
    src[key] = "";
  }
}

// ── domFind.js checks ─────────────────────────────────────────────────────────
section("2. domFind.js — approach");
const df = src.domFind;
const usesCSSHL   = df.includes("CSS.highlights");
const usesMarks   = df.includes("document.createElement(\"mark\")") || df.includes("createElement('mark')");
const usesMutObs  = df.split("\n").some(l => !l.trim().startsWith("*") && !l.trim().startsWith("//") && l.includes("MutationObserver"));
const usesRAF     = df.includes("requestAnimationFrame");
const usesOverlay = df.includes("getClientRects") && df.includes("createElementNS");

if (usesOverlay) pass("Uses SVG overlay + Range.getClientRects() — works on WebKitGTK/Linux");
else if (usesCSSHL) pass("Uses CSS Custom Highlight API (primary mode)");
else            fail("No highlight approach found");
if (usesMarks)  pass("Has <mark> fallback for older WebView2 (dual-mode)");
else            info("<mark> fallback not present — CSS-only mode");
if (!usesMutObs)pass("No MutationObserver (removed — it caused infinite loops)");
else            fail("MutationObserver still present — caused infinite re-highlight loop");
if (usesRAF)    pass("Uses requestAnimationFrame (waits for React paint)");
else            fail("No requestAnimationFrame — highlights may run before React commits");

section("3. domFind.js — case insensitivity");
if (df.includes("query.toLowerCase()"))         pass("query lowercased before search");
else                                             fail("query is NOT lowercased — search is case sensitive");
if (df.includes(".toLowerCase()") && df.includes(".indexOf(q")) pass("text compared case-insensitively");
else                                             fail("text comparison may be case sensitive");

section("4. domFind.js — minimum query length");
const hasOldGuard = df.includes("length < 2");
const hasNewGuard = df.includes("length < 1");
if (!hasOldGuard) pass("Old '< 2' guard removed — single char queries work");
else              fail("Still has 'length < 2' guard — single char queries blocked");
if (hasNewGuard)  pass("Has '< 1' guard — empty queries correctly blocked");
else              fail("No length guard at all — empty string will scan entire DOM");

section("5. domFind.js — input/textarea support");
if (df.includes("querySelectorAll(\"input, textarea\")") || df.includes("querySelectorAll('input, textarea')"))
  pass("Scans input/textarea fields");
else
  fail("No input/textarea scan — values typed into fields won't be found");
if (df.includes("type === \"password\"") || df.includes("type === 'password'"))
  pass("Skips password inputs");
else
  fail("Does NOT skip password inputs — password values exposed in search");
if (df.includes("ctrl-f-bar"))
  pass("Skips the find bar itself");
else
  fail("Does NOT skip #ctrl-f-bar — find bar text will match itself");

section("6. domFind.js — clear on new query");
if (df.includes("clearOverlay") || df.includes("CSS.highlights.delete"))
  pass("clearHighlights() properly cleans up all highlights");
else
  fail("clearHighlights() may not clean up — stale highlights could persist");

// ── search.js checks ──────────────────────────────────────────────────────────
section("7. search.js — minimum query length");
const searchGuards = (src.search.match(/length < \d/g) || []);
info(`Guards found in search.js: ${JSON.stringify(searchGuards)}`);
if (searchGuards.every(g => g === "length < 1"))
  pass("All search.js guards are '< 1' — single char + full string search works");
else
  fail("Some search.js guards still use '< 2'", searchGuards.filter(g => g !== "length < 1").join(", "));

// ── App.jsx checks ────────────────────────────────────────────────────────────
section("8. App.jsx — find bar wiring");
const app = src.app;
if (app.includes("highlightAll"))             pass("App.jsx calls highlightAll");
else                                          fail("App.jsx does NOT call highlightAll — Ctrl+F bar does nothing");
if (!app.includes("const total = highlightAll"))
                                              pass("App.jsx does not use synchronous return value of highlightAll");
else                                          fail("App.jsx uses synchronous return — will always show 0/0 initially");
if (app.includes("onUpdate") || app.includes("total =>"))
                                              pass("App.jsx uses onUpdate callback for real match count");
else                                          fail("App.jsx has no onUpdate callback — stats never update");
if (app.includes("clearHighlights"))          pass("App.jsx imports clearHighlights");
else                                          fail("clearHighlights not imported in App.jsx");
if (app.includes("id=\"ctrl-f-bar\""))        pass("Find bar has id=ctrl-f-bar");
else                                          fail("Find bar missing id=ctrl-f-bar — domFind can't exclude it from search");

// ── HomePage.jsx checks ───────────────────────────────────────────────────────
section("9. HomePage.jsx — semantic search wiring");
const home = src.home;
const homeGuard = (home.match(/length < \d/g) || []);
if (homeGuard.every(g => g === "length < 1"))
  pass("HomePage search guard is '< 1'");
else
  fail("HomePage search guard still blocks short queries", homeGuard.join(", "));

// ── index.css checks ──────────────────────────────────────────────────────────
section("10. index.css — highlight styles");
const css = src.index;
if (css.includes("ctrl-f-hl") || css.includes("ctrl-f-field"))
  info("index.css has ctrl-f classes (legacy mark-based styles — OK to keep, unused now)");
if (df.includes("ctrl-f-styles") || df.includes("ctrl-f-highlight-styles"))
  pass("domFind.js injects ::highlight() styles itself at runtime");
else
  fail("domFind.js does NOT inject ::highlight() styles — highlights will be invisible");

// ── simulate the core matching logic ─────────────────────────────────────────
section("11. LOGIC SIMULATION — core search algorithm");

function simulateSearch(textNodes, fields, query) {
  if (!query || query.trim().length < 1) return { textMatches: 0, fieldMatches: 0 };
  const q = query.toLowerCase();
  let textMatches = 0, fieldMatches = 0;
  for (const text of textNodes) {
    const lower = text.toLowerCase();
    let pos = 0, idx;
    while ((idx = lower.indexOf(q, pos)) !== -1) { textMatches++; pos = idx + q.length; }
  }
  for (const val of fields) {
    if (val.toLowerCase().includes(q)) fieldMatches++;
  }
  return { textMatches, fieldMatches };
}

const cases = [
  { q: "french",    nodes: ["FRENCH is the subject", "today is good"],  fields: ["FRENCH", "COSC 3320"], expectT: 1, expectF: 1 },
  { q: "FRENCH",    nodes: ["french toast"],                             fields: [],                      expectT: 1, expectF: 0 },
  { q: "a",         nodes: ["agenda"],                                   fields: ["data structures"],     expectT: 2, expectF: 1 },
  { q: "cosc",      nodes: [],                                           fields: ["COSC 3320"],            expectT: 0, expectF: 1 },
  { q: "algo",      nodes: ["Algorithms"],                               fields: [],                      expectT: 1, expectF: 0 },
  { q: "shot",      nodes: ["SHOT", "shot clock"],                       fields: ["big shot"],             expectT: 2, expectF: 1 },
  { q: "",          nodes: ["anything"],                                  fields: ["anything"],            expectT: 0, expectF: 0 },
  { q: "   ",       nodes: ["anything"],                                  fields: [],                     expectT: 0, expectF: 0 },
  { q: "xyz99",     nodes: ["nothing here"],                             fields: ["nope"],                 expectT: 0, expectF: 0 },
  { q: "kusuo",     nodes: ["Kusuo Saiki"],                              fields: [],                      expectT: 1, expectF: 0 },
];

for (const c of cases) {
  const { textMatches, fieldMatches } = simulateSearch(c.nodes, c.fields, c.q);
  const ok = textMatches === c.expectT && fieldMatches === c.expectF;
  if (ok) pass(`query="${c.q}" → text:${textMatches} field:${fieldMatches}`);
  else    fail(`query="${c.q}" → text:${textMatches} (expected ${c.expectT}), field:${fieldMatches} (expected ${c.expectF})`);
}

// ── final ─────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`RESULT: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("✅ All static checks pass. If search still broken in-app:");
  console.log("   → CSS.highlights may not be supported in your WebView2 version");
  console.log("   → Run the browser console paste (diagnose-search.js) to confirm");
} else {
  console.log(`❌ ${failed} issue(s) found — fix these first, then re-test in app`);
}
