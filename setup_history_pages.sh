#!/usr/bin/env bash
# =============================================================================
#  setup_history_pages.sh
#  Run this from the ROOT of your coogs-hub project (where package.json lives).
#  Creates 4 missing history HTML files + patches subjects.json.
# =============================================================================
set -e
PROJ=$(pwd)

echo "▶ Working in: $PROJ"
echo ""

# ─── 0. Guard ─────────────────────────────────────────────────────────────────
if [ ! -f "$PROJ/public/subjects.json" ]; then
  echo "✗  Could not find public/subjects.json — are you in the project root?"
  exit 1
fi

# ─── 1. Create directories if needed ──────────────────────────────────────────
mkdir -p public/references/cosc/algos
mkdir -p public/references/cosc/datastruct
mkdir -p public/references/cosc/cpp
mkdir -p public/references/languages   # python lives here

# =============================================================================
#  SHARED CSS + JS template (inline function to avoid duplication)
# =============================================================================
write_history() {
  local FILE="$1"        # destination path
  local TITLE="$2"       # page <title> text
  local ACCENT="$3"      # CSS hex color  e.g. #4ecdc4
  local H1="$4"          # sidebar h1 text
  local SUBTITLE="$5"    # sidebar subtitle
  local TIMELINE="$6"    # raw HTML for timeline items
  local SECTIONS="$7"    # raw HTML for main content sections

  cat > "$FILE" << HTMLEOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${TITLE}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg:       #0e1014;
  --surface:  #161920;
  --elevated: #1e222c;
  --border:   #2a2e38;
  --text:     #d4d8e0;
  --muted:    #7a8090;
  --dim:      #3a4052;
  --accent:   ${ACCENT};
}
*{ box-sizing:border-box; margin:0; padding:0; }
body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; font-weight:500; line-height:1.6; -webkit-font-smoothing:antialiased; overflow:hidden; height:100vh; }
.layout { display:flex; height:100vh; overflow:hidden; }
.sidebar { width:300px; min-width:300px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; }
.sidebar-header { padding:20px 20px 14px; border-bottom:1px solid var(--border); flex-shrink:0; }
.sidebar-header h1 { font-family:'Fraunces',serif; font-size:1.2rem; font-weight:700; color:var(--accent); margin-bottom:4px; }
.sidebar-subtitle { color:var(--muted); font-size:0.78rem; line-height:1.5; }
.sidebar-scroll { flex:1; overflow-y:auto; padding:20px; }
.sidebar-scroll::-webkit-scrollbar { width:4px; }
.sidebar-scroll::-webkit-scrollbar-track { background:transparent; }
.sidebar-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
.tl-label { font-family:'DM Mono',monospace; font-size:0.68rem; font-weight:500; letter-spacing:1.5px; color:var(--muted); text-transform:uppercase; margin-bottom:14px; }
.timeline { position:relative; padding-left:22px; margin-bottom:28px; }
.timeline::before { content:''; position:absolute; left:5px; top:6px; bottom:6px; width:2px; background:linear-gradient(to bottom,var(--accent),var(--dim)); border-radius:2px; opacity:0.4; }
.tl-item { position:relative; margin-bottom:18px; cursor:default; }
.tl-item::before { content:''; position:absolute; left:-18px; top:5px; width:8px; height:8px; border-radius:50%; background:var(--dot); border:2px solid var(--bg); box-shadow:0 0 0 2px var(--dot); transition:transform 0.15s; }
.tl-item:hover::before { transform:scale(1.3); }
.tl-year { font-family:'DM Mono',monospace; font-size:0.7rem; font-weight:500; letter-spacing:0.5px; color:var(--dot); margin-bottom:2px; }
.tl-title { font-size:0.88rem; font-weight:700; color:var(--text); margin-bottom:3px; }
.tl-desc { font-size:0.82rem; color:var(--muted); line-height:1.6; }
.src-label { font-family:'DM Mono',monospace; font-size:0.68rem; font-weight:500; letter-spacing:1.5px; color:var(--muted); text-transform:uppercase; margin-bottom:10px; }
.src-card { background:var(--elevated); border:1px solid var(--border); border-radius:8px; padding:10px 12px; margin-bottom:8px; transition:border-color 0.15s; text-decoration:none; display:block; }
.src-card:hover { border-color:var(--accent); }
.src-card span { color:var(--text); font-size:0.82rem; font-weight:600; display:block; margin-bottom:2px; }
.src-card small { color:var(--muted); font-family:'DM Mono',monospace; font-size:0.7rem; }
.main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:10px 24px; display:flex; align-items:center; gap:12px; flex-shrink:0; }
.topbar-title { font-family:'Fraunces',serif; font-size:0.95rem; font-weight:700; color:var(--text); margin-right:8px; }
nav { display:flex; gap:4px; flex-wrap:wrap; flex:1; }
nav a { color:var(--muted); font-size:0.75rem; font-weight:600; text-decoration:none; padding:4px 10px; border-radius:6px; border:1px solid transparent; transition:all 0.15s; }
nav a:hover, nav a.active { color:var(--text); border-color:var(--border); background:var(--elevated); }
nav a.active { color:var(--accent); border-color:var(--accent); }
#search-input { margin-left:auto; background:var(--elevated); border:1px solid var(--border); border-radius:7px; color:var(--text); font-family:'Inter',sans-serif; font-size:0.8rem; padding:5px 11px; outline:none; width:180px; }
#search-input:focus { border-color:var(--accent); }
.content-scroll { flex:1; overflow-y:auto; padding:32px 32px 80px; }
.content-scroll::-webkit-scrollbar { width:6px; }
.content-scroll::-webkit-scrollbar-track { background:transparent; }
.content-scroll::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
.section-title { font-family:'Fraunces',serif; font-size:1.4rem; font-weight:700; margin:48px 0 6px; letter-spacing:-0.3px; }
.section-title:first-child { margin-top:0; }
.section-sub { color:var(--muted); font-size:0.86rem; margin-bottom:22px; }
.card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; margin-bottom:14px; }
.card { background:var(--surface); border:1px solid var(--border); border-radius:10px; overflow:hidden; transition:border-color 0.15s,transform 0.15s; }
.card:hover { border-color:var(--card-color,var(--accent)); transform:translateY(-2px); }
.card-bar { height:3px; background:var(--card-color,var(--accent)); }
.card-body { padding:14px 16px; }
.card-label { font-family:'DM Mono',monospace; font-size:0.72rem; color:var(--card-color,var(--accent)); font-weight:500; letter-spacing:0.5px; margin-bottom:5px; }
.card-title { font-weight:700; font-size:0.95rem; color:var(--text); margin-bottom:7px; }
.card-desc { color:var(--muted); font-size:0.92rem; line-height:1.7; }
.card-desc strong { color:var(--text); }
.hidden { display:none !important; }
</style>
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>${H1}</h1>
      <p class="sidebar-subtitle">${SUBTITLE}</p>
    </div>
    <div class="sidebar-scroll">
      <div class="tl-label">Timeline</div>
${TIMELINE}
    </div>
  </aside>
  <div class="main">
    <div class="topbar">
      <span class="topbar-title">${H1}</span>
      <nav id="nav"></nav>
      <input id="search-input" type="text" placeholder="Search…" oninput="filterCards(this.value)">
    </div>
    <div class="content-scroll" id="content">
${SECTIONS}
    </div>
  </div>
</div>
<script>
// Build nav from section titles
const sections = document.querySelectorAll('.section-title');
const nav = document.getElementById('nav');
sections.forEach(s => {
  const a = document.createElement('a');
  a.textContent = s.textContent;
  a.href = '#';
  a.onclick = e => {
    e.preventDefault();
    s.scrollIntoView({ behavior: 'smooth' });
    nav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  };
  nav.appendChild(a);
});
// Search
function filterCards(q) {
  const lq = q.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.classList.toggle('hidden', lq && !card.textContent.toLowerCase().includes(lq));
  });
}
</script>
</body>
</html>
HTMLEOF
  echo "  ✓ Created: $FILE"
}

# =============================================================================
#  1 — ALGORITHMS HISTORY
# =============================================================================
ALGOS_TL='      <div class="timeline">
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">~300 BC</div>
          <div class="tl-title">Euclidean Algorithm</div>
          <div class="tl-desc">Euclid formalizes GCD — arguably the oldest algorithm still in daily use.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">9th c.</div>
          <div class="tl-title">Al-Khwarizmi</div>
          <div class="tl-desc">Persian mathematician whose name gives us the word <em>algorithm</em>. Formalized step-by-step arithmetic procedures.</div>
        </div>
        <div class="tl-item" style="--dot:#fb923c">
          <div class="tl-year">1843</div>
          <div class="tl-title">Ada Lovelace</div>
          <div class="tl-desc">Wrote the first published algorithm intended for a machine — Bernoulli numbers on Babbage's Analytical Engine.</div>
        </div>
        <div class="tl-item" style="--dot:#a78bfa">
          <div class="tl-year">1936</div>
          <div class="tl-title">Turing Machine</div>
          <div class="tl-desc">Alan Turing formalizes computation. Establishes limits of what algorithms can solve.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1956</div>
          <div class="tl-title">Dijkstra's Algorithm</div>
          <div class="tl-desc">Edsger Dijkstra solves shortest-path on weighted graphs. Powers GPS, routing, and network protocols today.</div>
        </div>
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">1959–62</div>
          <div class="tl-title">Sorting Revolution</div>
          <div class="tl-desc">Quicksort (Hoare 1959), Merge Sort (von Neumann), Heapsort (Williams 1964) all formalized in this era.</div>
        </div>
        <div class="tl-item" style="--dot:#ff6b9d">
          <div class="tl-year">1965</div>
          <div class="tl-title">Big-O Formalized</div>
          <div class="tl-desc">Knuth popularizes asymptotic notation for comparing algorithm efficiency — the language we use today.</div>
        </div>
        <div class="tl-item" style="--dot:#34d399">
          <div class="tl-year">1970s</div>
          <div class="tl-title">Dynamic Programming</div>
          <div class="tl-desc">Bellman coins DP in the 1950s; by the 1970s it powers bioinformatics, economics, and compiler optimization.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1984</div>
          <div class="tl-title">NP-Completeness & Reductions</div>
          <div class="tl-desc">Cook-Levin theorem (1971) and Karp's 21 NP-complete problems reshape how we classify hard problems.</div>
        </div>
      </div>'

ALGOS_SECTIONS='      <h2 class="section-title">Complexity Classes</h2>
      <p class="section-sub">How algorithms are categorized by growth rate and tractability.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Runtime</div>
            <div class="card-title">Big-O, Ω, Θ</div>
            <div class="card-desc"><strong>O(f)</strong> = upper bound &nbsp;·&nbsp; <strong>Ω(f)</strong> = lower bound &nbsp;·&nbsp; <strong>Θ(f)</strong> = tight bound.<br>Common: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Decision Problems</div>
            <div class="card-title">P vs NP</div>
            <div class="card-desc"><strong>P</strong>: solvable in polynomial time. <strong>NP</strong>: verifiable in polynomial time. Whether P = NP is the biggest open question in CS.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Recurrences</div>
            <div class="card-title">Master Theorem</div>
            <div class="card-desc">For T(n) = aT(n/b) + f(n): compare f(n) to n^(log_b a). Gives O() directly for divide-and-conquer recurrences.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Sorting Algorithms</h2>
      <p class="section-sub">Comparison-based and non-comparison sorts — time and stability at a glance.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(n²) — Stable</div>
            <div class="card-title">Insertion Sort</div>
            <div class="card-desc">Best O(n) on nearly-sorted data. Low constant factors make it faster than O(n log n) sorts for tiny n. In-place.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(n log n) — Stable</div>
            <div class="card-title">Merge Sort</div>
            <div class="card-desc">Divide-and-conquer. Guaranteed O(n log n) worst case. Requires O(n) extra space. Foundation of TimSort.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(n log n) avg — Unstable</div>
            <div class="card-title">Quick Sort</div>
            <div class="card-desc">Pivot-based partition. O(n²) worst case (bad pivot). In practice fastest due to cache locality. Randomized pivot mitigates worst case.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(n log n) — Unstable</div>
            <div class="card-title">Heap Sort</div>
            <div class="card-desc">Uses max-heap. Guaranteed O(n log n) and O(1) extra space. Not cache-friendly, so slower in practice than Quicksort.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#ff6b9d">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(n + k) — Stable</div>
            <div class="card-title">Counting / Radix Sort</div>
            <div class="card-desc">Non-comparison. Beats O(n log n) when k (range) is small. Radix sort extends to multi-digit integers and strings.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Graph Algorithms</h2>
      <p class="section-sub">Traversal, shortest paths, and spanning trees.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Traversal — O(V+E)</div>
            <div class="card-title">BFS</div>
            <div class="card-desc">Queue-based. Finds shortest path in <strong>unweighted</strong> graphs. Level-order traversal. Good for connected-component detection.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Traversal — O(V+E)</div>
            <div class="card-title">DFS</div>
            <div class="card-desc">Stack/recursion based. Used for topological sort, cycle detection, SCC (Tarjan/Kosaraju), and maze solving.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Shortest Path — O((V+E) log V)</div>
            <div class="card-title">Dijkstra</div>
            <div class="card-desc">Non-negative weights only. Priority queue (min-heap). Single-source shortest path. Greedy — relaxes edges in order.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Shortest Path — O(VE)</div>
            <div class="card-title">Bellman-Ford</div>
            <div class="card-desc">Handles negative weights. Detects negative cycles. Slower than Dijkstra — use when negative edges exist.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">MST — O(E log E)</div>
            <div class="card-title">Kruskal & Prim</div>
            <div class="card-desc"><strong>Kruskal</strong>: sort edges, Union-Find. <strong>Prim</strong>: grow tree greedily from a start vertex with priority queue.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Algorithm Paradigms</h2>
      <p class="section-sub">High-level design strategies that cut across problem types.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Paradigm</div>
            <div class="card-title">Divide & Conquer</div>
            <div class="card-desc">Split into subproblems → solve recursively → combine. Examples: Merge Sort, Quick Sort, Binary Search, Strassen matrix multiply.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Paradigm</div>
            <div class="card-title">Dynamic Programming</div>
            <div class="card-desc">Optimal substructure + overlapping subproblems. Memoization (top-down) or tabulation (bottom-up). Examples: LCS, Knapsack, Coin Change, Edit Distance.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Paradigm</div>
            <div class="card-title">Greedy</div>
            <div class="card-desc">Make locally optimal choice at each step. Only works when greedy choice property holds. Examples: Dijkstra, Prim, Kruskal, Huffman coding, Activity Selection.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#ff6b9d">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Paradigm</div>
            <div class="card-title">Backtracking</div>
            <div class="card-desc">Explore candidates recursively, prune branches that can't lead to a solution. Examples: N-Queens, Sudoku, Subset Sum, Hamiltonian path.</div>
          </div>
        </div>
      </div>'

write_history \
  "public/references/cosc/algos/algos_history.html" \
  "Algorithms — History & Reference" \
  "#4ecdc4" \
  "Algorithms" \
  "COSC 3320 · History, complexity, and core algorithm families." \
  "$ALGOS_TL" \
  "$ALGOS_SECTIONS"

# =============================================================================
#  2 — DATA STRUCTURES HISTORY
# =============================================================================
DS_TL='      <div class="timeline">
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">1945</div>
          <div class="tl-title">Arrays & Early Memory</div>
          <div class="tl-desc">Von Neumann architecture gives us contiguous memory. Arrays become the fundamental building block of all data structures.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1955</div>
          <div class="tl-title">Linked Lists</div>
          <div class="tl-desc">Invented at RAND Corporation for the IPL language. First dynamic structure — nodes connected by pointers, no contiguous memory required.</div>
        </div>
        <div class="tl-item" style="--dot:#fb923c">
          <div class="tl-year">1960</div>
          <div class="tl-title">Hash Tables</div>
          <div class="tl-desc">H. P. Luhn proposes hashing at IBM. O(1) average lookup transforms database indexing and compiler symbol tables.</div>
        </div>
        <div class="tl-item" style="--dot:#a78bfa">
          <div class="tl-year">1962</div>
          <div class="tl-title">AVL Tree</div>
          <div class="tl-desc">Adelson-Velsky and Landis publish the first self-balancing BST. Guarantees O(log n) operations regardless of insertion order.</div>
        </div>
        <div class="tl-item" style="--dot:#34d399">
          <div class="tl-year">1972</div>
          <div class="tl-title">Red-Black Tree</div>
          <div class="tl-desc">Rudolf Bayer introduces symmetric B-trees, later refined as red-black trees. Powers std::map in C++ and TreeMap in Java.</div>
        </div>
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">1978</div>
          <div class="tl-title">B-Tree</div>
          <div class="tl-desc">Bayer & McCreight design B-trees for disk storage. Still the backbone of every relational database index (InnoDB, PostgreSQL).</div>
        </div>
        <div class="tl-item" style="--dot:#ff6b9d">
          <div class="tl-year">1984</div>
          <div class="tl-title">Fibonacci Heap</div>
          <div class="tl-desc">Fredman & Tarjan achieve amortized O(1) decrease-key, improving Dijkstra's theoretical complexity.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1990s</div>
          <div class="tl-title">STL & Generic Containers</div>
          <div class="tl-desc">C++ STL (Alexander Stepanov) standardizes vector, list, deque, map, unordered_map — bringing DS to every programmer.</div>
        </div>
      </div>'

DS_SECTIONS='      <h2 class="section-title">Linear Structures</h2>
      <p class="section-sub">Sequential access patterns — the foundation of everything else.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Random Access — O(1)</div>
            <div class="card-title">Array / Vector</div>
            <div class="card-desc">Contiguous memory. O(1) index access. O(n) insert/delete at arbitrary position. Dynamic arrays (vector) amortize growth to O(1) push_back.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Sequential Access — O(n)</div>
            <div class="card-title">Linked List</div>
            <div class="card-desc"><strong>Singly</strong>: each node → next. <strong>Doubly</strong>: node ↔ prev/next. <strong>Circular</strong>: tail points to head. O(1) insert/delete with a pointer.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">LIFO — O(1) push/pop</div>
            <div class="card-title">Stack</div>
            <div class="card-desc">Push and pop from the same end. Used in: function call frames, expression parsing, DFS, undo history, backtracking.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">FIFO — O(1) enqueue/dequeue</div>
            <div class="card-title">Queue / Deque</div>
            <div class="card-desc">Queue: enqueue back, dequeue front. Deque: O(1) at both ends. Used in: BFS, task scheduling, sliding window algorithms.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Trees</h2>
      <p class="section-sub">Hierarchical structures — O(log n) operations when balanced.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Binary Search</div>
            <div class="card-title">BST</div>
            <div class="card-desc">Left child &lt; parent &lt; right child. O(log n) avg for search/insert/delete. O(n) worst case (degenerate / sorted input).</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Self-Balancing</div>
            <div class="card-title">AVL Tree</div>
            <div class="card-desc">Balance factor |h_L − h_R| ≤ 1 at every node. Rotates (single/double) on insert/delete. Stricter balance than RB — better for read-heavy workloads.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#ff6b9d">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Self-Balancing</div>
            <div class="card-title">Red-Black Tree</div>
            <div class="card-desc">5 properties ensure O(log n). Less rigid than AVL → fewer rotations on insert/delete. Used in std::map, Linux kernel scheduler.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Priority Queue</div>
            <div class="card-title">Heap (Min/Max)</div>
            <div class="card-desc">Complete binary tree stored in array. Parent ≤ children (min-heap). O(log n) insert/extract. O(1) peek. Foundation of Heap Sort and Dijkstra.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Prefix / Strings</div>
            <div class="card-title">Trie</div>
            <div class="card-desc">Each edge is a character. O(m) search where m = key length. Powers autocomplete, spell checkers, IP routing (patricia trie).</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Hash Tables & Graphs</h2>
      <p class="section-sub">O(1) lookup and complex relationship modeling.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(1) avg — Key-Value</div>
            <div class="card-title">Hash Table</div>
            <div class="card-desc">Hash function maps key → bucket. Collision resolution: <strong>chaining</strong> (linked list per bucket) or <strong>open addressing</strong> (linear/quadratic probe). Load factor &lt; 0.75.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Vertices + Edges</div>
            <div class="card-title">Graph</div>
            <div class="card-desc"><strong>Adjacency matrix</strong>: O(V²) space, O(1) edge check. <strong>Adjacency list</strong>: O(V+E) space, better for sparse graphs. Directed or undirected, weighted or unweighted.</div>
          </div>
        </div>
      </div>'

write_history \
  "public/references/cosc/datastruct/datastruct_history.html" \
  "Data Structures — History & Reference" \
  "#e8c547" \
  "Data Structures" \
  "COSC 2436 · History, trade-offs, and core structure families." \
  "$DS_TL" \
  "$DS_SECTIONS"

# =============================================================================
#  3 — C++ HISTORY
# =============================================================================
CPP_TL='      <div class="timeline">
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">1972</div>
          <div class="tl-title">C is Born</div>
          <div class="tl-desc">Dennis Ritchie at Bell Labs creates C for Unix development. Becomes the dominant systems language of the 70s and 80s.</div>
        </div>
        <div class="tl-item" style="--dot:#fb923c">
          <div class="tl-year">1979</div>
          <div class="tl-title">"C with Classes"</div>
          <div class="tl-desc">Bjarne Stroustrup starts adding object-oriented features to C. Classes, inheritance, and strong type checking come first.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1985</div>
          <div class="tl-title">C++ 1.0</div>
          <div class="tl-desc">Officially named C++. Virtual functions, operator overloading, and references added. Cfront translates C++ to C.</div>
        </div>
        <div class="tl-item" style="--dot:#a78bfa">
          <div class="tl-year">1998</div>
          <div class="tl-title">C++98 / STL</div>
          <div class="tl-desc">First ISO standard. Alexander Stepanov's STL (templates, containers, iterators, algorithms) is included. Templates change everything.</div>
        </div>
        <div class="tl-item" style="--dot:#34d399">
          <div class="tl-year">2011</div>
          <div class="tl-title">C++11 — Modern C++</div>
          <div class="tl-desc">auto, range-for, lambdas, move semantics, smart pointers (unique_ptr, shared_ptr), nullptr, constexpr. The biggest update in decades.</div>
        </div>
        <div class="tl-item" style="--dot:#ff6b9d">
          <div class="tl-year">2014–17</div>
          <div class="tl-title">C++14 / C++17</div>
          <div class="tl-desc">Generic lambdas, structured bindings, if constexpr, std::optional, std::variant, parallel algorithms, and filesystem library.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">2020</div>
          <div class="tl-title">C++20 — Concepts & Coroutines</div>
          <div class="tl-desc">Concepts constrain templates. Coroutines for async. Ranges library. Modules replace header files. Calendar/timezone in chrono.</div>
        </div>
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">2023+</div>
          <div class="tl-title">C++23 & Beyond</div>
          <div class="tl-desc">std::print, import std, flat_map, stacktrace. C++ continues evolving while maintaining near-total backward compatibility.</div>
        </div>
      </div>'

CPP_SECTIONS='      <h2 class="section-title">Core Language</h2>
      <p class="section-sub">Foundational C++ concepts — types, memory, and control flow.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Memory</div>
            <div class="card-title">Stack vs Heap</div>
            <div class="card-desc"><strong>Stack</strong>: automatic duration, LIFO, fast. <strong>Heap</strong>: dynamic allocation via new/delete or malloc/free. Heap leaks if not freed. Prefer smart pointers.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Pointers & References</div>
            <div class="card-title">Raw Pointers</div>
            <div class="card-desc">int* p = &x; &nbsp;·&nbsp; *p dereferences. Pointer arithmetic: p+1 moves by sizeof(T). References (int& r = x) are aliases — cannot be null or rebound.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Modern C++ — C++11</div>
            <div class="card-title">Smart Pointers</div>
            <div class="card-desc"><strong>unique_ptr</strong>: sole ownership, move-only. <strong>shared_ptr</strong>: ref-counted shared ownership. <strong>weak_ptr</strong>: non-owning observer. Eliminates most manual delete.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Type Deduction</div>
            <div class="card-title">auto & decltype</div>
            <div class="card-desc"><strong>auto</strong> deduces type from initializer. <strong>decltype(expr)</strong> yields the declared type of expr. <strong>auto&</strong> binds by reference — avoids copies in range-for.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">OOP in C++</h2>
      <p class="section-sub">Classes, inheritance, polymorphism — the C++ object model.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Encapsulation</div>
            <div class="card-title">Classes & Structs</div>
            <div class="card-desc">class defaults to private; struct to public. Constructor/destructor pair (RAII). Copy/move constructors and assignment operators.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#ff6b9d">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Polymorphism</div>
            <div class="card-title">virtual & override</div>
            <div class="card-desc">virtual enables dynamic dispatch via vtable. <strong>override</strong> keyword catches typos. <strong>= 0</strong> makes a function pure virtual → abstract class.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Inheritance</div>
            <div class="card-title">public / protected / private</div>
            <div class="card-desc"><strong>public inheritance</strong>: IS-A relationship. <strong>private</strong>: implementation detail. Multiple inheritance allowed (with diamond problem) — use virtual base classes carefully.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Generic Programming</div>
            <div class="card-title">Templates</div>
            <div class="card-desc">template&lt;typename T&gt; generates code at compile time. Template specialization for specific types. Basis of the entire STL — no runtime overhead.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">STL Essentials</h2>
      <p class="section-sub">The containers and algorithms you use every day.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Sequence</div>
            <div class="card-title">vector / deque / list</div>
            <div class="card-desc"><strong>vector</strong>: dynamic array, cache-friendly. <strong>deque</strong>: O(1) front/back. <strong>list</strong>: doubly linked, O(1) splice. Use vector by default.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Associative</div>
            <div class="card-title">map / unordered_map</div>
            <div class="card-desc"><strong>map</strong>: red-black tree, O(log n), sorted. <strong>unordered_map</strong>: hash table, O(1) avg. Use unordered for speed; map for ordered iteration.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Algorithms Header</div>
            <div class="card-title">&lt;algorithm&gt;</div>
            <div class="card-desc">sort(), find(), count(), lower_bound(), binary_search(), min_element(), accumulate() (in &lt;numeric&gt;). Combine with lambdas for powerful one-liners.</div>
          </div>
        </div>
      </div>'

write_history \
  "public/references/cosc/cpp/cpp_history.html" \
  "C++ — History & Reference" \
  "#fb923c" \
  "C++" \
  "COSC 1437 · Language history, core features, and STL essentials." \
  "$CPP_TL" \
  "$CPP_SECTIONS"

# =============================================================================
#  4 — PYTHON HISTORY
# =============================================================================
PY_TL='      <div class="timeline">
        <div class="tl-item" style="--dot:#e8c547">
          <div class="tl-year">1989</div>
          <div class="tl-title">Guido Starts Python</div>
          <div class="tl-desc">Guido van Rossum begins Python as a hobby project over the 1989 Christmas holiday. Named after Monty Python, not the snake.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">1991</div>
          <div class="tl-title">Python 0.9 / 1.0</div>
          <div class="tl-desc">First public release. Already had classes, functions, exception handling, and the core types. "Batteries included" philosophy from the start.</div>
        </div>
        <div class="tl-item" style="--dot:#fb923c">
          <div class="tl-year">2000</div>
          <div class="tl-title">Python 2.0</div>
          <div class="tl-desc">List comprehensions, garbage collection (cycle detector), and Unicode support. Python 2 dominates for a decade.</div>
        </div>
        <div class="tl-item" style="--dot:#a78bfa">
          <div class="tl-year">2008</div>
          <div class="tl-title">Python 3.0</div>
          <div class="tl-desc">Intentionally backward-incompatible redesign. print() as function, true division, str/bytes separation, improved syntax. Adoption was slow — a decade-long migration.</div>
        </div>
        <div class="tl-item" style="--dot:#34d399">
          <div class="tl-year">2020</div>
          <div class="tl-title">Python 2 EOL</div>
          <div class="tl-desc">Python 2 officially end-of-life Jan 1 2020. The ecosystem fully migrates to Python 3. Python 3.8+ is modern Python.</div>
        </div>
        <div class="tl-item" style="--dot:#ff6b9d">
          <div class="tl-year">2015–now</div>
          <div class="tl-title">AI / Data Science Dominance</div>
          <div class="tl-desc">NumPy, Pandas, PyTorch, TensorFlow, scikit-learn make Python the default language for machine learning, data analysis, and research.</div>
        </div>
        <div class="tl-item" style="--dot:#4ecdc4">
          <div class="tl-year">2023+</div>
          <div class="tl-title">Python 3.11–3.13</div>
          <div class="tl-desc">Significant performance improvements (3.11 is ~25% faster than 3.10). Better error messages. Experimental JIT in 3.13. Type hint ecosystem matures.</div>
        </div>
      </div>'

PY_SECTIONS='      <h2 class="section-title">Core Language</h2>
      <p class="section-sub">Python fundamentals — types, scope, and control flow.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Dynamic Typing</div>
            <div class="card-title">Built-in Types</div>
            <div class="card-desc">int (arbitrary precision), float, str (immutable), bool, NoneType. type() and isinstance() for introspection. Everything is an object.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Scope — LEGB</div>
            <div class="card-title">Local / Enclosing / Global / Built-in</div>
            <div class="card-desc">Name lookup order: Local → Enclosing (closures) → Global → Built-in. global and nonlocal keywords modify outer scopes.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Comprehensions</div>
            <div class="card-title">List / Dict / Set / Generator</div>
            <div class="card-desc">[x*2 for x in range(10) if x%2==0] · {k:v for k,v in d.items()} · (x for x in items) creates a lazy generator — no list in memory.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Functions</div>
            <div class="card-title">*args / **kwargs / Defaults</div>
            <div class="card-desc">def f(*args, **kwargs). Default arg values evaluated once at definition — mutable defaults (list/dict) are a classic gotcha. Use None as sentinel.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Data Structures in Python</h2>
      <p class="section-sub">Built-in containers and their time complexities.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#e8c547">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(1) append / O(n) insert</div>
            <div class="card-title">list</div>
            <div class="card-desc">Dynamic array. O(1) amortized append/pop. O(n) insert/delete at index. Slicing [a:b] creates a copy. sort() is TimSort — stable, O(n log n).</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(1) avg — Key-Value</div>
            <div class="card-title">dict</div>
            <div class="card-desc">Hash map. O(1) avg get/set/del. Ordered by insertion since Python 3.7. dict.get(key, default) avoids KeyError. Use Counter, defaultdict from collections.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#ff6b9d">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(1) avg — Membership</div>
            <div class="card-title">set / frozenset</div>
            <div class="card-desc">Hash set. O(1) add/discard/in. Union (|), intersection (&), difference (-). frozenset is immutable — hashable, usable as dict key.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#fb923c">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">O(1) both ends</div>
            <div class="card-title">collections.deque</div>
            <div class="card-desc">Double-ended queue. O(1) appendleft/popleft — list.pop(0) is O(n). Use for BFS queues and sliding window algorithms.</div>
          </div>
        </div>
      </div>

      <h2 class="section-title">OOP & Modern Python</h2>
      <p class="section-sub">Classes, type hints, and the ecosystem.</p>
      <div class="card-grid">
        <div class="card" style="--card-color:#a78bfa">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Classes</div>
            <div class="card-title">__init__ / __repr__ / dunder methods</div>
            <div class="card-desc">Python OOP uses dunder (double-underscore) methods for operator overloading. __str__ for print, __len__ for len(), __eq__ for ==, __iter__ for loops.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#34d399">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Type Hints — Python 3.5+</div>
            <div class="card-title">Annotations & mypy</div>
            <div class="card-desc">def f(x: int) -&gt; str. Hints are not enforced at runtime — use mypy or pyright for static checking. dataclasses (@dataclass) auto-generate __init__ from hints.</div>
          </div>
        </div>
        <div class="card" style="--card-color:#4ecdc4">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">Generators & Async</div>
            <div class="card-title">yield / async def / await</div>
            <div class="card-desc">yield turns a function into a generator — lazy evaluation. async def + await enables coroutine-based concurrency via asyncio without threads.</div>
          </div>
        </div>
      </div>'

write_history \
  "public/references/languages/python_history.html" \
  "Python — History & Reference" \
  "#4ecdc4" \
  "Python" \
  "Language history, core features, and built-in data structures." \
  "$PY_TL" \
  "$PY_SECTIONS"

# =============================================================================
#  5 — Patch subjects.json
#  We use Python (available on any Mac/Linux) for the JSON surgery.
# =============================================================================
echo ""
echo "▶ Patching public/subjects.json …"

python3 - << 'PYEOF'
import json, copy, sys

with open("public/subjects.json", "r") as f:
    data = json.load(f)

# Helper: patch references array for a given course id (in DEPARTMENTS + ALL_COURSES)
def patch_course(courses_list, course_id, new_first_entry):
    for course in courses_list:
        if course.get("id") == course_id:
            refs = course.setdefault("references", [])
            # Remove any existing entry whose file matches (avoid duplicates)
            refs[:] = [r for r in refs if r.get("file") != new_first_entry["file"]]
            refs.insert(0, new_first_entry)

# Entries to add
PATCHES = {
    "algos": {
        "file": "algos_history.html",
        "label": "Algorithms History & Reference",
        "type": "iframe"
    },
    "datastruct": {
        "file": "datastruct_history.html",
        "label": "Data Structures History & Reference",
        "type": "iframe"
    },
    "cpp": {
        "file": "cpp_history.html",
        "label": "C++ History & Reference",
        "type": "iframe"
    },
    "python": {
        "file": "python_history.html",
        "label": "Python History & Reference",
        "type": "iframe"
    },
}

for dept in data.get("DEPARTMENTS", []):
    patch_course(dept.get("courses", []), "algos",      PATCHES["algos"])
    patch_course(dept.get("courses", []), "datastruct", PATCHES["datastruct"])
    patch_course(dept.get("courses", []), "cpp",        PATCHES["cpp"])
    patch_course(dept.get("courses", []), "python",     PATCHES["python"])

for course in data.get("ALL_COURSES", []):
    cid = course.get("id")
    if cid in PATCHES:
        refs = course.setdefault("references", [])
        refs[:] = [r for r in refs if r.get("file") != PATCHES[cid]["file"]]
        refs.insert(0, PATCHES[cid])

with open("public/subjects.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("  ✓ subjects.json patched")
PYEOF

echo ""
echo "════════════════════════════════════════════════════════"
echo "  Done! Created 4 history pages + patched subjects.json"
echo ""
echo "  New files:"
echo "    public/references/cosc/algos/algos_history.html"
echo "    public/references/cosc/datastruct/datastruct_history.html"
echo "    public/references/cosc/cpp/cpp_history.html"
echo "    public/references/languages/python_history.html"
echo ""
echo "  subjects.json: algos, datastruct, cpp, python now have"
echo "  their history file listed first in 'references'."
echo "════════════════════════════════════════════════════════"
