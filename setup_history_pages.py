#!/usr/bin/env python3
"""
setup_history_pages.py
Run from the ROOT of your coogs-hub project (where package.json lives):
    python3 setup_history_pages.py
Creates 4 missing history HTML files + patches subjects.json.
"""
import json, os, sys

ROOT = os.getcwd()
SUBJECTS = os.path.join(ROOT, "public", "subjects.json")

if not os.path.exists(SUBJECTS):
    sys.exit("✗  Cannot find public/subjects.json — run from project root.")

# ─── Shared CSS ───────────────────────────────────────────────────────────────
SHARED_CSS = """
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
"""

SHARED_JS = """
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
function filterCards(q) {
  const lq = q.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.classList.toggle('hidden', lq && !card.textContent.toLowerCase().includes(lq));
  });
}
"""


def build_page(title, accent, h1, subtitle, timeline_html, sections_html):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {{
  --bg:       #0e1014;
  --surface:  #161920;
  --elevated: #1e222c;
  --border:   #2a2e38;
  --text:     #d4d8e0;
  --muted:    #7a8090;
  --dim:      #3a4052;
  --accent:   {accent};
}}
{SHARED_CSS}
</style>
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>{h1}</h1>
      <p class="sidebar-subtitle">{subtitle}</p>
    </div>
    <div class="sidebar-scroll">
      <div class="tl-label">Timeline</div>
      <div class="timeline">
{timeline_html}
      </div>
    </div>
  </aside>
  <div class="main">
    <div class="topbar">
      <span class="topbar-title">{h1}</span>
      <nav id="nav"></nav>
      <input id="search-input" type="text" placeholder="Search&hellip;" oninput="filterCards(this.value)">
    </div>
    <div class="content-scroll" id="content">
{sections_html}
    </div>
  </div>
</div>
<script>{SHARED_JS}</script>
</body>
</html>"""


def tl(year, title, desc, dot):
    return f"""        <div class="tl-item" style="--dot:{dot}">
          <div class="tl-year">{year}</div>
          <div class="tl-title">{title}</div>
          <div class="tl-desc">{desc}</div>
        </div>"""


def card(label, title, desc, color):
    return f"""        <div class="card" style="--card-color:{color}">
          <div class="card-bar"></div>
          <div class="card-body">
            <div class="card-label">{label}</div>
            <div class="card-title">{title}</div>
            <div class="card-desc">{desc}</div>
          </div>
        </div>"""


def section(title, sub, cards_html):
    return f"""      <h2 class="section-title">{title}</h2>
      <p class="section-sub">{sub}</p>
      <div class="card-grid">
{cards_html}
      </div>"""


# ═══════════════════════════════════════════════════════════
#  PAGE DATA
# ═══════════════════════════════════════════════════════════

PAGES = {}

# ── 1. ALGORITHMS ────────────────────────────────────────────
tl_algos = "\n".join([
    tl("~300 BC", "Euclidean Algorithm",       "Euclid formalizes GCD — arguably the oldest algorithm still in daily use.", "#e8c547"),
    tl("9th c.",  "Al-Khwarizmi",              "Persian mathematician whose name gives us the word <em>algorithm</em>. Formalized step-by-step arithmetic procedures.", "#4ecdc4"),
    tl("1843",    "Ada Lovelace",              "Wrote the first published algorithm intended for a machine — Bernoulli numbers on Babbage's Analytical Engine.", "#fb923c"),
    tl("1936",    "Turing Machine",            "Alan Turing formalizes computation. Establishes limits of what algorithms can solve.", "#a78bfa"),
    tl("1956",    "Dijkstra's Algorithm",      "Edsger Dijkstra solves shortest-path on weighted graphs. Powers GPS, routing, and network protocols today.", "#4ecdc4"),
    tl("1959–62", "Sorting Revolution",        "Quicksort (Hoare 1959), Merge Sort (von Neumann), Heapsort (Williams 1964) all formalized in this era.", "#e8c547"),
    tl("1965",    "Big-O Formalized",          "Knuth popularizes asymptotic notation for comparing algorithm efficiency — the language we use today.", "#ff6b9d"),
    tl("1970s",   "Dynamic Programming",       "Bellman coins DP in the 1950s; by the 1970s it powers bioinformatics, economics, and compiler optimization.", "#34d399"),
    tl("1984",    "NP-Completeness",           "Cook-Levin theorem (1971) and Karp's 21 NP-complete problems reshape how we classify hard problems.", "#4ecdc4"),
])

sec_algos = "\n\n".join([
    section("Complexity Classes", "How algorithms are categorized by growth rate and tractability.", "\n".join([
        card("Runtime",          "Big-O, &#937;, &#920;",  "<strong>O(f)</strong> = upper bound &nbsp;&#183;&nbsp; <strong>&#937;(f)</strong> = lower bound &nbsp;&#183;&nbsp; <strong>&#920;(f)</strong> = tight bound.<br>Common: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n&sup2;) &lt; O(2&#8319;)", "#4ecdc4"),
        card("Decision Problems","P vs NP",               "<strong>P</strong>: solvable in polynomial time. <strong>NP</strong>: verifiable in polynomial time. Whether P = NP is the biggest open question in CS.", "#e8c547"),
        card("Recurrences",      "Master Theorem",        "For T(n) = aT(n/b) + f(n): compare f(n) to n^(log&#8347; a). Gives O() directly for divide-and-conquer recurrences.", "#a78bfa"),
    ])),
    section("Sorting Algorithms", "Comparison-based and non-comparison sorts — time and stability at a glance.", "\n".join([
        card("O(n&sup2;) — Stable",        "Insertion Sort",    "Best O(n) on nearly-sorted data. Low constant factors make it faster than O(n log n) sorts for tiny n. In-place.", "#34d399"),
        card("O(n log n) — Stable",        "Merge Sort",        "Divide-and-conquer. Guaranteed O(n log n) worst case. Requires O(n) extra space. Foundation of TimSort.", "#4ecdc4"),
        card("O(n log n) avg — Unstable",  "Quick Sort",        "Pivot-based partition. O(n&sup2;) worst case (bad pivot). In practice fastest due to cache locality. Randomized pivot mitigates worst case.", "#e8c547"),
        card("O(n log n) — Unstable",      "Heap Sort",         "Uses max-heap. Guaranteed O(n log n) and O(1) extra space. Not cache-friendly, so slower in practice than Quicksort.", "#fb923c"),
        card("O(n + k) — Stable",          "Counting / Radix Sort", "Non-comparison. Beats O(n log n) when k (range) is small. Radix sort extends to multi-digit integers and strings.", "#ff6b9d"),
    ])),
    section("Graph Algorithms", "Traversal, shortest paths, and spanning trees.", "\n".join([
        card("Traversal — O(V+E)",              "BFS",              "<strong>Queue-based.</strong> Finds shortest path in unweighted graphs. Level-order traversal. Good for connected-component detection.", "#4ecdc4"),
        card("Traversal — O(V+E)",              "DFS",              "Stack/recursion based. Used for topological sort, cycle detection, SCC (Tarjan/Kosaraju), and maze solving.", "#a78bfa"),
        card("Shortest Path — O((V+E) log V)",  "Dijkstra",         "Non-negative weights only. Priority queue (min-heap). Single-source shortest path. Greedy — relaxes edges in order.", "#e8c547"),
        card("Shortest Path — O(VE)",           "Bellman-Ford",     "Handles negative weights. Detects negative cycles. Slower than Dijkstra — use when negative edges exist.", "#fb923c"),
        card("MST — O(E log E)",                "Kruskal &amp; Prim", "<strong>Kruskal</strong>: sort edges, Union-Find. <strong>Prim</strong>: grow tree greedily from a start vertex with priority queue.", "#34d399"),
    ])),
    section("Algorithm Paradigms", "High-level design strategies that cut across problem types.", "\n".join([
        card("Paradigm", "Divide &amp; Conquer", "Split into subproblems &#8594; solve recursively &#8594; combine. Examples: Merge Sort, Quick Sort, Binary Search, Strassen matrix multiply.", "#4ecdc4"),
        card("Paradigm", "Dynamic Programming", "Optimal substructure + overlapping subproblems. Memoization (top-down) or tabulation (bottom-up). Examples: LCS, Knapsack, Coin Change, Edit Distance.", "#a78bfa"),
        card("Paradigm", "Greedy",              "Make locally optimal choice at each step. Only works when greedy choice property holds. Examples: Dijkstra, Prim, Kruskal, Huffman coding, Activity Selection.", "#e8c547"),
        card("Paradigm", "Backtracking",        "Explore candidates recursively, prune branches that cannot lead to a solution. Examples: N-Queens, Sudoku, Subset Sum, Hamiltonian path.", "#ff6b9d"),
    ])),
])

PAGES["public/references/cosc/algos/algos_history.html"] = build_page(
    "Algorithms — History &amp; Reference", "#4ecdc4",
    "Algorithms", "COSC 3320 &middot; History, complexity, and core algorithm families.",
    tl_algos, sec_algos
)

# ── 2. DATA STRUCTURES ───────────────────────────────────────
tl_ds = "\n".join([
    tl("1945",   "Arrays &amp; Early Memory",  "Von Neumann architecture gives us contiguous memory. Arrays become the fundamental building block of all data structures.", "#e8c547"),
    tl("1955",   "Linked Lists",               "Invented at RAND Corporation for the IPL language. First dynamic structure — nodes connected by pointers, no contiguous memory required.", "#4ecdc4"),
    tl("1960",   "Hash Tables",                "H. P. Luhn proposes hashing at IBM. O(1) average lookup transforms database indexing and compiler symbol tables.", "#fb923c"),
    tl("1962",   "AVL Tree",                   "Adelson-Velsky and Landis publish the first self-balancing BST. Guarantees O(log n) operations regardless of insertion order.", "#a78bfa"),
    tl("1972",   "Red-Black Tree",             "Rudolf Bayer introduces symmetric B-trees, later refined as red-black trees. Powers std::map in C++ and TreeMap in Java.", "#34d399"),
    tl("1978",   "B-Tree",                     "Bayer &amp; McCreight design B-trees for disk storage. Still the backbone of every relational database index (InnoDB, PostgreSQL).", "#e8c547"),
    tl("1984",   "Fibonacci Heap",             "Fredman &amp; Tarjan achieve amortized O(1) decrease-key, improving Dijkstra's theoretical complexity.", "#ff6b9d"),
    tl("1990s",  "STL &amp; Generic Containers","C++ STL (Alexander Stepanov) standardizes vector, list, deque, map, unordered_map — bringing DS to every programmer.", "#4ecdc4"),
])

sec_ds = "\n\n".join([
    section("Linear Structures", "Sequential access patterns — the foundation of everything else.", "\n".join([
        card("Random Access — O(1)",       "Array / Vector",   "Contiguous memory. O(1) index access. O(n) insert/delete at arbitrary position. Dynamic arrays (vector) amortize growth to O(1) push_back.", "#e8c547"),
        card("Sequential Access — O(n)",   "Linked List",      "<strong>Singly</strong>: each node &#8594; next. <strong>Doubly</strong>: node &#8596; prev/next. <strong>Circular</strong>: tail points to head. O(1) insert/delete with a pointer.", "#4ecdc4"),
        card("LIFO — O(1) push/pop",       "Stack",            "Push and pop from the same end. Used in: function call frames, expression parsing, DFS, undo history, backtracking.", "#fb923c"),
        card("FIFO — O(1) enqueue/dequeue","Queue / Deque",    "Queue: enqueue back, dequeue front. Deque: O(1) at both ends. Used in: BFS, task scheduling, sliding window algorithms.", "#a78bfa"),
    ])),
    section("Trees", "Hierarchical structures — O(log n) operations when balanced.", "\n".join([
        card("Binary Search",   "BST",           "Left child &lt; parent &lt; right child. O(log n) avg for search/insert/delete. O(n) worst case (degenerate / sorted input).", "#e8c547"),
        card("Self-Balancing",  "AVL Tree",      "Balance factor |h_L &minus; h_R| &le; 1 at every node. Rotates (single/double) on insert/delete. Stricter balance than RB — better for read-heavy workloads.", "#4ecdc4"),
        card("Self-Balancing",  "Red-Black Tree","5 properties ensure O(log n). Less rigid than AVL &#8594; fewer rotations on insert/delete. Used in std::map, Linux kernel scheduler.", "#ff6b9d"),
        card("Priority Queue",  "Heap (Min/Max)","Complete binary tree stored in array. Parent &le; children (min-heap). O(log n) insert/extract. O(1) peek. Foundation of Heap Sort and Dijkstra.", "#fb923c"),
        card("Prefix / Strings","Trie",          "Each edge is a character. O(m) search where m = key length. Powers autocomplete, spell checkers, IP routing (patricia trie).", "#a78bfa"),
    ])),
    section("Hash Tables &amp; Graphs", "O(1) lookup and complex relationship modeling.", "\n".join([
        card("O(1) avg — Key-Value", "Hash Table", "Hash function maps key &#8594; bucket. Collision resolution: <strong>chaining</strong> (linked list per bucket) or <strong>open addressing</strong> (linear/quadratic probe). Load factor &lt; 0.75.", "#34d399"),
        card("Vertices + Edges",     "Graph",      "<strong>Adjacency matrix</strong>: O(V&sup2;) space, O(1) edge check. <strong>Adjacency list</strong>: O(V+E) space, better for sparse graphs. Directed or undirected, weighted or unweighted.", "#4ecdc4"),
    ])),
])

PAGES["public/references/cosc/datastruct/datastruct_history.html"] = build_page(
    "Data Structures — History &amp; Reference", "#e8c547",
    "Data Structures", "COSC 2436 &middot; History, trade-offs, and core structure families.",
    tl_ds, sec_ds
)

# ── 3. C++ ───────────────────────────────────────────────────
tl_cpp = "\n".join([
    tl("1972",   "C is Born",                  "Dennis Ritchie at Bell Labs creates C for Unix development. Becomes the dominant systems language of the 70s and 80s.", "#e8c547"),
    tl("1979",   '"C with Classes"',           "Bjarne Stroustrup starts adding object-oriented features to C. Classes, inheritance, and strong type checking come first.", "#fb923c"),
    tl("1985",   "C++ 1.0",                    "Officially named C++. Virtual functions, operator overloading, and references added. Cfront translates C++ to C.", "#4ecdc4"),
    tl("1998",   "C++98 / STL",                "First ISO standard. Alexander Stepanov's STL (templates, containers, iterators, algorithms) is included. Templates change everything.", "#a78bfa"),
    tl("2011",   "C++11 — Modern C++",         "auto, range-for, lambdas, move semantics, smart pointers (unique_ptr, shared_ptr), nullptr, constexpr. The biggest update in decades.", "#34d399"),
    tl("2014–17","C++14 / C++17",              "Generic lambdas, structured bindings, if constexpr, std::optional, std::variant, parallel algorithms, and filesystem library.", "#ff6b9d"),
    tl("2020",   "C++20 — Concepts &amp; Coroutines","Concepts constrain templates. Coroutines for async. Ranges library. Modules replace header files. Calendar/timezone in chrono.", "#4ecdc4"),
    tl("2023+",  "C++23 &amp; Beyond",         "std::print, import std, flat_map, stacktrace. C++ continues evolving while maintaining near-total backward compatibility.", "#e8c547"),
])

sec_cpp = "\n\n".join([
    section("Core Language", "Foundational C++ concepts — types, memory, and control flow.", "\n".join([
        card("Memory",             "Stack vs Heap",           "<strong>Stack</strong>: automatic duration, LIFO, fast. <strong>Heap</strong>: dynamic allocation via new/delete or malloc/free. Heap leaks if not freed. Prefer smart pointers.", "#fb923c"),
        card("Pointers &amp; References", "Raw Pointers",    "int* p = &amp;x; &nbsp;&#183;&nbsp; *p dereferences. Pointer arithmetic: p+1 moves by sizeof(T). References (int&amp; r = x) are aliases — cannot be null or rebound.", "#4ecdc4"),
        card("Modern C++ — C++11", "Smart Pointers",         "<strong>unique_ptr</strong>: sole ownership, move-only. <strong>shared_ptr</strong>: ref-counted shared ownership. <strong>weak_ptr</strong>: non-owning observer. Eliminates most manual delete.", "#a78bfa"),
        card("Type Deduction",     "auto &amp; decltype",    "<strong>auto</strong> deduces type from initializer. <strong>decltype(expr)</strong> yields the declared type of expr. <strong>auto&amp;</strong> binds by reference — avoids copies in range-for.", "#e8c547"),
    ])),
    section("OOP in C++", "Classes, inheritance, polymorphism — the C++ object model.", "\n".join([
        card("Encapsulation",    "Classes &amp; Structs",           "class defaults to private; struct to public. Constructor/destructor pair (RAII). Copy/move constructors and assignment operators.", "#34d399"),
        card("Polymorphism",     "virtual &amp; override",          "virtual enables dynamic dispatch via vtable. <strong>override</strong> keyword catches typos. <strong>= 0</strong> makes a function pure virtual &#8594; abstract class.", "#ff6b9d"),
        card("Inheritance",      "public / protected / private",    "<strong>public inheritance</strong>: IS-A relationship. <strong>private</strong>: implementation detail. Multiple inheritance allowed — use virtual base classes for diamond problem.", "#fb923c"),
        card("Generic Programming","Templates",                      "template&lt;typename T&gt; generates code at compile time. Template specialization for specific types. Basis of the entire STL — no runtime overhead.", "#4ecdc4"),
    ])),
    section("STL Essentials", "The containers and algorithms you use every day.", "\n".join([
        card("Sequence",     "vector / deque / list",   "<strong>vector</strong>: dynamic array, cache-friendly. <strong>deque</strong>: O(1) front/back. <strong>list</strong>: doubly linked, O(1) splice. Use vector by default.", "#e8c547"),
        card("Associative",  "map / unordered_map",     "<strong>map</strong>: red-black tree, O(log n), sorted. <strong>unordered_map</strong>: hash table, O(1) avg. Use unordered for speed; map for ordered iteration.", "#a78bfa"),
        card("Algorithms",   "&lt;algorithm&gt;",       "sort(), find(), count(), lower_bound(), binary_search(), min_element(), accumulate() (in &lt;numeric&gt;). Combine with lambdas for powerful one-liners.", "#34d399"),
    ])),
])

PAGES["public/references/cosc/cpp/cpp_history.html"] = build_page(
    "C++ — History &amp; Reference", "#fb923c",
    "C++", "COSC 1437 &middot; Language history, core features, and STL essentials.",
    tl_cpp, sec_cpp
)

# ── 4. PYTHON ────────────────────────────────────────────────
tl_py = "\n".join([
    tl("1989",    "Guido Starts Python",        "Guido van Rossum begins Python as a hobby project over the 1989 Christmas holiday. Named after Monty Python, not the snake.", "#e8c547"),
    tl("1991",    "Python 0.9 / 1.0",           "First public release. Already had classes, functions, exception handling, and the core types. \"Batteries included\" philosophy from the start.", "#4ecdc4"),
    tl("2000",    "Python 2.0",                 "List comprehensions, garbage collection (cycle detector), and Unicode support. Python 2 dominates for a decade.", "#fb923c"),
    tl("2008",    "Python 3.0",                 "Intentionally backward-incompatible redesign. print() as function, true division, str/bytes separation, improved syntax. A decade-long migration followed.", "#a78bfa"),
    tl("2020",    "Python 2 EOL",               "Python 2 officially end-of-life Jan 1 2020. The ecosystem fully migrates to Python 3. Python 3.8+ is modern Python.", "#34d399"),
    tl("2015–now","AI / Data Science Dominance","NumPy, Pandas, PyTorch, TensorFlow, scikit-learn make Python the default language for machine learning, data analysis, and research.", "#ff6b9d"),
    tl("2023+",   "Python 3.11–3.13",           "~25% faster than 3.10. Better error messages. Experimental JIT in 3.13. Type hint ecosystem (mypy, pyright, Pydantic) matures.", "#4ecdc4"),
])

sec_py = "\n\n".join([
    section("Core Language", "Python fundamentals — types, scope, and control flow.", "\n".join([
        card("Dynamic Typing",  "Built-in Types",           "int (arbitrary precision), float, str (immutable), bool, NoneType. type() and isinstance() for introspection. Everything is an object.", "#4ecdc4"),
        card("Scope — LEGB",    "Local / Enclosing / Global / Built-in", "Name lookup order: Local &#8594; Enclosing (closures) &#8594; Global &#8594; Built-in. global and nonlocal keywords modify outer scopes.", "#e8c547"),
        card("Comprehensions",  "List / Dict / Set / Generator", "[x*2 for x in range(10) if x%2==0] &nbsp;&#183;&nbsp; {k:v for k,v in d.items()} &nbsp;&#183;&nbsp; (x for x in items) creates a lazy generator — no list in memory.", "#fb923c"),
        card("Functions",       "*args / **kwargs / Defaults", "def f(*args, **kwargs). Default arg values are evaluated once at definition — mutable defaults (list/dict) are a classic gotcha. Use None as sentinel.", "#a78bfa"),
    ])),
    section("Data Structures in Python", "Built-in containers and their time complexities.", "\n".join([
        card("O(1) append / O(n) insert", "list",                  "Dynamic array. O(1) amortized append/pop. O(n) insert/delete at index. sort() is TimSort — stable, O(n log n).", "#e8c547"),
        card("O(1) avg — Key-Value",      "dict",                  "Hash map. O(1) avg get/set/del. Ordered by insertion since Python 3.7. dict.get(key, default) avoids KeyError. Use Counter, defaultdict from collections.", "#4ecdc4"),
        card("O(1) avg — Membership",     "set / frozenset",       "Hash set. O(1) add/discard/in. Union (|), intersection (&amp;), difference (-). frozenset is immutable — hashable, usable as dict key.", "#ff6b9d"),
        card("O(1) both ends",            "collections.deque",     "Double-ended queue. O(1) appendleft/popleft — list.pop(0) is O(n). Use for BFS queues and sliding window algorithms.", "#fb923c"),
    ])),
    section("OOP &amp; Modern Python", "Classes, type hints, and the ecosystem.", "\n".join([
        card("Classes",          "__init__ / dunder methods",  "Python OOP uses dunder (double-underscore) methods for operator overloading. __str__ for print, __len__ for len(), __eq__ for ==, __iter__ for loops.", "#a78bfa"),
        card("Type Hints",       "Annotations &amp; mypy",     "def f(x: int) -&gt; str. Hints are not enforced at runtime — use mypy or pyright for static checking. @dataclass auto-generates __init__ from type hints.", "#34d399"),
        card("Generators &amp; Async", "yield / async def / await", "yield turns a function into a generator — lazy evaluation. async def + await enables coroutine-based concurrency via asyncio without threads.", "#4ecdc4"),
    ])),
])

PAGES["public/references/languages/python_history.html"] = build_page(
    "Python — History &amp; Reference", "#4ecdc4",
    "Python", "Language history, core features, and built-in data structures.",
    tl_py, sec_py
)

# ═══════════════════════════════════════════════════════════
#  WRITE FILES
# ═══════════════════════════════════════════════════════════
for rel_path, html in PAGES.items():
    full = os.path.join(ROOT, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  ✓ {rel_path}")

# ═══════════════════════════════════════════════════════════
#  PATCH subjects.json
# ═══════════════════════════════════════════════════════════
print("\n▶ Patching public/subjects.json …")

with open(SUBJECTS, "r", encoding="utf-8") as f:
    data = json.load(f)

PATCHES = {
    "algos":      {"file": "algos_history.html",      "label": "Algorithms History & Reference",    "type": "iframe"},
    "datastruct": {"file": "datastruct_history.html",  "label": "Data Structures History & Reference","type": "iframe"},
    "cpp":        {"file": "cpp_history.html",         "label": "C++ History & Reference",           "type": "iframe"},
    "python":     {"file": "python_history.html",      "label": "Python History & Reference",        "type": "iframe"},
}

def patch_course(course):
    cid = course.get("id")
    if cid not in PATCHES:
        return
    entry = PATCHES[cid]
    refs = course.setdefault("references", [])
    # Remove any existing entry with the same file to avoid duplicates
    refs[:] = [r for r in refs if r.get("file") != entry["file"]]
    refs.insert(0, entry)

for dept in data.get("DEPARTMENTS", []):
    for course in dept.get("courses", []):
        patch_course(course)

for course in data.get("ALL_COURSES", []):
    patch_course(course)

with open(SUBJECTS, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("  ✓ subjects.json patched")
print()
print("═" * 56)
print("  Done! 4 history pages created + subjects.json patched.")
print("  algos / datastruct / cpp / python all wired up.")
print("═" * 56)
