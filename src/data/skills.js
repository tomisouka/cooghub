// src/data/skills.js
// Single source of truth for COURSES, SKILL_TREE, and all derived skill constants.
// Imported by ProgressPage and DeadlinesPage -- edit here, nowhere else.

export const COURSES = [
  { id: "datastruct", label: "Data Structures",  color: "#e8c547" },
  { id: "algos",      label: "Algorithms",        color: "#4ecdc4" },
  { id: "automata",   label: "Automata",           color: "#ff6b9d" },
  { id: "comporg",    label: "Comp Org",           color: "#34d399" },
  { id: "databases",  label: "Databases",          color: "#f472b6" },
  { id: "opsystems",  label: "Operating Systems",  color: "#fb923c" },
  { id: "cpp",        label: "C++",                color: "#fb7185" },
  { id: "python",     label: "Python",             color: "#38bdf8" },
  { id: "discrete",   label: "Discrete Math",      color: "#a78bfa" },
  { id: "linear",     label: "Linear Algebra",     color: "#60a5fa" },
];

// ── SKILL TREE ────────────────────────────────────────────────────────────────
// Sources: COSC 3320 (algos), COSC 3340 (automata), COSC 3360 (OS -- Rincon),
//          COSC 3380 (DB -- Uma), algos_list.md, list.md (linear algebra)
// diff: 1=beginner, 2=early, 3=intermediate, 4=advanced
export const SKILL_TREE = [

  // ── ALGORITHMS (COSC 3320 -- Gopal Pandurangan) ────────────────────────────
  { category: "Algorithm Foundations", color: "#4ecdc4", skills: [
    { id: "algo_what",        label: "What is an Algorithm",      course: "algos",   diff: 1 },
    { id: "ram_model",        label: "RAM Model of Computation",  course: "algos",   diff: 1 },
    { id: "bigo_notation",    label: "Big-O / Ω / Θ Notation",    course: "algos",   diff: 1 },
    { id: "runtime_classes",  label: "Common Runtime Classes",    course: "algos",   diff: 1 },
    { id: "algo_analysis",    label: "Analyzing Algorithm Runtime",course: "algos",  diff: 2 },
    { id: "best_worst_avg",   label: "Best / Worst / Avg Case",   course: "algos",   diff: 2 },
    { id: "space_complexity", label: "Space Complexity",          course: "algos",   diff: 2 },
  ]},

  { category: "Math for Algorithms", color: "#4ecdc4", skills: [
    { id: "math_induction",   label: "Mathematical Induction",    course: "algos",   diff: 1 },
    { id: "strong_induction", label: "Strong Induction",          course: "algos",   diff: 2 },
    { id: "loop_invariants",  label: "Loop Invariants",           course: "algos",   diff: 2 },
    { id: "recurrences",      label: "Solving Recurrences",       course: "algos",   diff: 3 },
    { id: "master_theorem",   label: "Master Theorem",            course: "algos",   diff: 3 },
    { id: "recursion_tree",   label: "Recursion Tree Method",     course: "algos",   diff: 3 },
  ]},

  { category: "Recursion", color: "#4ecdc4", skills: [
    { id: "recursion_basics", label: "Recursion Basics",          course: "algos",   diff: 1 },
    { id: "gcd_euclid",       label: "GCD / Euclidean Algorithm", course: "algos",   diff: 1 },
    { id: "recursion_proof",  label: "Proving Recursive Correctness", course: "algos", diff: 2 },
    { id: "tail_recursion",   label: "Tail Recursion",            course: "algos",   diff: 2 },
    { id: "fibonacci_memo",   label: "Fibonacci & Memoization",   course: "algos",   diff: 2 },
    { id: "hanoi",            label: "Tower of Hanoi",            course: "algos",   diff: 3 },
  ]},

  { category: "Divide & Conquer", color: "#4ecdc4", skills: [
    { id: "dc_strategy",      label: "Divide & Conquer Strategy", course: "algos",   diff: 2 },
    { id: "mergesort",        label: "MergeSort",                 course: "algos",   diff: 2 },
    { id: "quicksort",        label: "QuickSort",                 course: "algos",   diff: 2 },
    { id: "binary_search",    label: "Binary Search",             course: "algos",   diff: 1 },
    { id: "closest_pair",     label: "Closest Pair of Points",    course: "algos",   diff: 3 },
    { id: "strassen",         label: "Strassen Matrix Multiply",  course: "algos",   diff: 4 },
    { id: "fft",              label: "Fast Fourier Transform",     course: "algos",   diff: 4 },
  ]},

  { category: "Dynamic Programming", color: "#4ecdc4", skills: [
    { id: "dp_concept",       label: "DP Concept & When to Use",  course: "algos",   diff: 2 },
    { id: "dp_topdown",       label: "Top-Down (Memoization)",    course: "algos",   diff: 2 },
    { id: "dp_bottomup",      label: "Bottom-Up (Tabulation)",    course: "algos",   diff: 3 },
    { id: "lcs",              label: "Longest Common Subsequence",course: "algos",   diff: 3 },
    { id: "knapsack",         label: "0/1 Knapsack",              course: "algos",   diff: 3 },
    { id: "edit_distance",    label: "Edit Distance",             course: "algos",   diff: 3 },
    { id: "lis",              label: "Longest Increasing Subseq", course: "algos",   diff: 4 },
    { id: "matrix_chain",     label: "Matrix Chain Multiplication",course: "algos",  diff: 4 },
  ]},

  { category: "Greedy Algorithms", color: "#4ecdc4", skills: [
    { id: "greedy_concept",   label: "Greedy Choice Property",    course: "algos",   diff: 2 },
    { id: "activity_select",  label: "Activity Selection",        course: "algos",   diff: 2 },
    { id: "huffman",          label: "Huffman Coding",            course: "algos",   diff: 3 },
    { id: "greedy_proof",     label: "Proving Greedy Correctness",course: "algos",   diff: 3 },
  ]},

  { category: "Graph Algorithms", color: "#4ecdc4", skills: [
    { id: "graph_basics",     label: "Graph Representations",     course: "algos",   diff: 1 },
    { id: "dfs",              label: "DFS",                       course: "algos",   diff: 2 },
    { id: "bfs",              label: "BFS",                       course: "algos",   diff: 2 },
    { id: "topo_sort",        label: "Topological Sort",          course: "algos",   diff: 2 },
    { id: "dijkstra",         label: "Dijkstra's Algorithm",      course: "algos",   diff: 3 },
    { id: "bellman_ford",     label: "Bellman-Ford",              course: "algos",   diff: 3 },
    { id: "floyd_warshall",   label: "Floyd-Warshall",            course: "algos",   diff: 3 },
    { id: "kruskal",          label: "Kruskal's MST",             course: "algos",   diff: 3 },
    { id: "prim",             label: "Prim's MST",                course: "algos",   diff: 3 },
    { id: "scc",              label: "Strongly Connected Components", course: "algos", diff: 4 },
  ]},

  { category: "NP-Completeness", color: "#4ecdc4", skills: [
    { id: "p_vs_np",          label: "P vs NP",                   course: "algos",   diff: 3 },
    { id: "np_def",           label: "NP & NP-Complete Definitions", course: "algos", diff: 3 },
    { id: "reductions",       label: "Polynomial Reductions",     course: "algos",   diff: 4 },
    { id: "sat_3sat",         label: "SAT & 3-SAT",               course: "algos",   diff: 4 },
    { id: "np_classic",       label: "Classic NP-Complete Problems", course: "algos", diff: 4 },
    { id: "approx_algorithms",label: "Approximation Algorithms",  course: "algos",   diff: 4 },
  ]},

  // ── AUTOMATA (COSC 3340 -- Rakesh Verma + schedule) ───────────────────────
  { category: "Automata Foundations", color: "#ff6b9d", skills: [
    { id: "proof_techniques", label: "Proof Techniques & Discrete Math", course: "automata", diff: 1 },
    { id: "set_cardinality",  label: "Set Cardinality & Countability", course: "automata", diff: 2 },
    { id: "dfa_basics",       label: "Deterministic Finite Automata (DFA)", course: "automata", diff: 1 },
    { id: "nfa_basics",       label: "Nondeterministic FA (NFA)",  course: "automata", diff: 2 },
    { id: "dfa_nfa_equiv",    label: "DFA ↔ NFA Equivalence",      course: "automata", diff: 2 },
    { id: "diagonalization",  label: "Diagonalization Principle",  course: "automata", diff: 3 },
  ]},

  { category: "Regular Languages", color: "#ff6b9d", skills: [
    { id: "regular_lang",     label: "Regular Languages",          course: "automata", diff: 1 },
    { id: "closure_props",    label: "Closure Properties",         course: "automata", diff: 2 },
    { id: "regex_theory",     label: "Regular Expressions",        course: "automata", diff: 2 },
    { id: "regex_equiv",      label: "Equivalence of Representations", course: "automata", diff: 3 },
    { id: "pumping_lemma_rl", label: "Pumping Lemma (Regular)",    course: "automata", diff: 3 },
  ]},

  { category: "Turing Machines", color: "#ff6b9d", skills: [
    { id: "tm_basic",         label: "Basic Turing Machine",       course: "automata", diff: 2 },
    { id: "ntm",              label: "Nondeterministic TM (NTM)",  course: "automata", diff: 3 },
    { id: "dtm_ntm_equiv",    label: "DTM ↔ NTM Equivalence",      course: "automata", diff: 3 },
    { id: "machine_schemas",  label: "Machine Schemas",            course: "automata", diff: 3 },
    { id: "universal_tm",     label: "Universal Turing Machine",   course: "automata", diff: 4 },
    { id: "church_turing",    label: "Church-Turing Thesis",       course: "automata", diff: 4 },
  ]},

  { category: "Computability", color: "#ff6b9d", skills: [
    { id: "turing_accept",    label: "Turing-Acceptability",       course: "automata", diff: 3 },
    { id: "turing_decide",    label: "Turing-Decidability",        course: "automata", diff: 3 },
    { id: "halting_problem",  label: "The Halting Problem",        course: "automata", diff: 4 },
    { id: "undecidable",      label: "Undecidable Problems",       course: "automata", diff: 4 },
    { id: "reducibility",     label: "Reducibility",               course: "automata", diff: 4 },
  ]},

  { category: "Context-Free & PDAs", color: "#ff6b9d", skills: [
    { id: "cfg_basics",       label: "Context-Free Grammars (CFG)",course: "automata", diff: 2 },
    { id: "pda_basics",       label: "Pushdown Automata (PDA)",    course: "automata", diff: 3 },
    { id: "pda_cfg_equiv",    label: "PDA ↔ CFG Equivalence",      course: "automata", diff: 3 },
    { id: "pumping_lemma_cfl",label: "Pumping Lemma (CFL)",        course: "automata", diff: 4 },
    { id: "unsolvable_gram",  label: "Unsolvable Grammar Problems",course: "automata", diff: 4 },
  ]},

  // ── DATA STRUCTURES ────────────────────────────────────────────────────────
  { category: "DS Foundations", color: "#e8c547", skills: [
    { id: "arrays",           label: "Arrays & Pointers",          course: "datastruct", diff: 1 },
    { id: "linked",           label: "Linked Lists",               course: "datastruct", diff: 1 },
    { id: "stacks_queues",    label: "Stacks & Queues",            course: "datastruct", diff: 1 },
    { id: "recursion_ds",     label: "Recursion",                  course: "datastruct", diff: 2 },
    { id: "complexity_ds",    label: "Time & Space Complexity",    course: "datastruct", diff: 1 },
  ]},

  { category: "Trees & Hashing", color: "#e8c547", skills: [
    { id: "trees",            label: "Trees & BST",                course: "datastruct", diff: 2 },
    { id: "avl",              label: "AVL Trees",                  course: "datastruct", diff: 3 },
    { id: "heaps",            label: "Heaps & Priority Queues",    course: "datastruct", diff: 2 },
    { id: "hashtables",       label: "Hash Tables",                course: "datastruct", diff: 2 },
    { id: "hash_collision",   label: "Hash Collision Strategies",  course: "datastruct", diff: 3 },
    { id: "btree",            label: "B-Trees",                    course: "datastruct", diff: 4 },
  ]},

  { category: "Graphs (DS)", color: "#e8c547", skills: [
    { id: "graphs_rep",       label: "Graph Representations",      course: "datastruct", diff: 2 },
    { id: "graph_traversal",  label: "Graph Traversal",            course: "datastruct", diff: 2 },
    { id: "weighted_graphs",  label: "Weighted Graphs",            course: "datastruct", diff: 3 },
  ]},

  // ── LINEAR ALGEBRA (from list.md) ─────────────────────────────────────────
  { category: "Linear Algebra Foundations", color: "#60a5fa", skills: [
    { id: "la_notation",      label: "Matrix Notation & Operations", course: "linear", diff: 1 },
    { id: "gaussian_elim",    label: "Gaussian Elimination",       course: "linear",  diff: 1 },
    { id: "rref",             label: "REF & RREF",                 course: "linear",  diff: 1 },
    { id: "solution_types",   label: "Types of Solutions (Ax=b)", course: "linear",   diff: 2 },
    { id: "matrix_inverse",   label: "Matrix Inverse",             course: "linear",  diff: 2 },
  ]},

  { category: "Vector Spaces", color: "#60a5fa", skills: [
    { id: "vector_spaces",    label: "Vector Spaces & Subspaces",  course: "linear",  diff: 2 },
    { id: "span_independence",label: "Span & Linear Independence", course: "linear",  diff: 2 },
    { id: "basis_dimension",  label: "Basis & Dimension",          course: "linear",  diff: 2 },
    { id: "rank_nullity",     label: "Rank-Nullity Theorem",       course: "linear",  diff: 3 },
    { id: "kernel_image",     label: "Kernel & Image",             course: "linear",  diff: 3 },
  ]},

  { category: "Linear Maps & Determinants", color: "#60a5fa", skills: [
    { id: "linear_maps",      label: "Linear Transformations",     course: "linear",  diff: 2 },
    { id: "determinants",     label: "Determinants",               course: "linear",  diff: 2 },
    { id: "det_properties",   label: "Determinant Properties",     course: "linear",  diff: 3 },
  ]},

  { category: "Eigenvalues & Advanced", color: "#60a5fa", skills: [
    { id: "eigenvalues",      label: "Eigenvalues & Eigenvectors", course: "linear",  diff: 3 },
    { id: "diagonalization",  label: "Diagonalization",            course: "linear",  diff: 3 },
    { id: "jordan_form",      label: "Jordan Normal Form",         course: "linear",  diff: 4 },
    { id: "orthogonality",    label: "Orthogonality & Inner Product", course: "linear", diff: 3 },
    { id: "gram_schmidt",     label: "Gram-Schmidt & QR",          course: "linear",  diff: 4 },
    { id: "spectral_theorem", label: "Spectral Theorem",           course: "linear",  diff: 4 },
  ]},

  // ── COMP ORG ──────────────────────────────────────────────────────────────
  { category: "Computer Organization", color: "#34d399", skills: [
    { id: "memory",           label: "Memory Management",          course: "comporg",  diff: 1 },
    { id: "assembly",         label: "Assembly / ARM",             course: "comporg",  diff: 2 },
    { id: "memory_hierarchy", label: "Memory Hierarchy",          course: "comporg",  diff: 2 },
    { id: "io_techniques",    label: "I/O Techniques (DMA, IRQ)", course: "comporg",  diff: 3 },
  ]},

  // ── OPERATING SYSTEMS (COSC 3360 -- Carlos Rincon) ─────────────────────────
  // Based on syllabus: Stallings OS, 3 exam units
  { category: "OS Fundamentals", color: "#fb923c", skills: [
    { id: "os_overview",      label: "OS Overview & Structure",    course: "opsystems", diff: 1 },
    { id: "process_desc",     label: "Process Description & Control", course: "opsystems", diff: 1 },
    { id: "threads",          label: "Threads & Multithreading",   course: "opsystems", diff: 2 },
    { id: "fork_syscall",     label: "fork() & Process Trees",     course: "opsystems", diff: 2 },
  ]},

  { category: "Concurrency & IPC", color: "#fb923c", skills: [
    { id: "ipc_pipes",        label: "IPC -- Pipes & Shared Memory",course: "opsystems", diff: 2 },
    { id: "ipc_sockets",      label: "IPC -- Sockets & RPC",        course: "opsystems", diff: 3 },
    { id: "mutex_sync",       label: "Mutual Exclusion & Semaphores", course: "opsystems", diff: 2 },
    { id: "condition_vars",   label: "Condition Variables",        course: "opsystems", diff: 3 },
    { id: "deadlock",         label: "Deadlock -- Prevention, Avoidance, Detection", course: "opsystems", diff: 3 },
  ]},

  { category: "Scheduling & Memory", color: "#fb923c", skills: [
    { id: "cpu_scheduling",   label: "CPU Scheduling (FCFS, RR, SPN)", course: "opsystems", diff: 2 },
    { id: "realtime_sched",   label: "Real-Time Scheduling (EDF, RM)", course: "opsystems", diff: 3 },
    { id: "memory_mgmt",      label: "Memory Management Techniques", course: "opsystems", diff: 2 },
    { id: "virtual_memory",   label: "Virtual Memory & Paging",    course: "opsystems", diff: 3 },
    { id: "page_replacement", label: "Page Replacement (FIFO, LRU, CLOCK)", course: "opsystems", diff: 3 },
    { id: "filesystem",       label: "File Systems & RAID",         course: "opsystems", diff: 3 },
    { id: "disk_scheduling",  label: "Disk Scheduling Algorithms", course: "opsystems", diff: 4 },
  ]},

  // ── DATABASES (COSC 3380 -- Uma Ramamurthy) ────────────────────────────────
  // Based on syllabus: Elmasri & Navathe, topics list
  { category: "DB Foundations", color: "#f472b6", skills: [
    { id: "db_intro",         label: "Intro to Databases & DBMS",  course: "databases", diff: 1 },
    { id: "relational_model", label: "Relational Data Model",      course: "databases", diff: 1 },
    { id: "er_model",         label: "ER Model & Conceptual Design",course: "databases", diff: 2 },
    { id: "rel_algebra",      label: "Relational Algebra",         course: "databases", diff: 2 },
  ]},

  { category: "SQL", color: "#f472b6", skills: [
    { id: "sql_basics",       label: "Basic SQL Queries",          course: "databases", diff: 1 },
    { id: "sql_joins",        label: "Joins & Filters",            course: "databases", diff: 2 },
    { id: "sql_aggregation",  label: "Aggregations & Grouping",    course: "databases", diff: 2 },
    { id: "sql_transactions", label: "SQL Transaction Processing", course: "databases", diff: 3 },
  ]},

  { category: "DB Design & Internals", color: "#f472b6", skills: [
    { id: "normalization",    label: "Normalization (1NF–BCNF)",   course: "databases", diff: 3 },
    { id: "db_security",      label: "Database Security",          course: "databases", diff: 2 },
    { id: "indexing_db",      label: "Indexing & Storage",         course: "databases", diff: 3 },
    { id: "query_optimizer",  label: "Query Optimizer",            course: "databases", diff: 4 },
    { id: "locking_recovery", label: "Locking & Recovery Manager", course: "databases", diff: 4 },
    { id: "nosql_dist",       label: "NoSQL & Distributed Databases", course: "databases", diff: 3 },
    { id: "db_app_dev",       label: "Database App Development",   course: "databases", diff: 3 },
  ]},

  // ── C++ ───────────────────────────────────────────────────────────────────
  { category: "C++ Fundamentals", color: "#fb923c", skills: [
    { id: "cpp_syntax",       label: "C++ Syntax & Compile/Run",   course: "cpp",      diff: 1 },
    { id: "cpp_pointers",     label: "Pointers & References",      course: "cpp",      diff: 1 },
    { id: "cpp_malloc",       label: "malloc / new / delete",      course: "cpp",      diff: 2 },
    { id: "cpp_static_auto",  label: "static, auto & type deduction", course: "cpp",  diff: 2 },
    { id: "cpp_adt",          label: "Abstract Data Types in C++", course: "cpp",      diff: 2 },
  ]},

  { category: "C++ OOP", color: "#fb923c", skills: [
    { id: "cpp_classes",      label: "Classes & Objects",          course: "cpp",      diff: 1 },
    { id: "cpp_inheritance",  label: "Inheritance",                course: "cpp",      diff: 2 },
    { id: "cpp_polymorphism", label: "Polymorphism & Virtual",     course: "cpp",      diff: 3 },
    { id: "cpp_templates",    label: "Templates",                  course: "cpp",      diff: 3 },
    { id: "cpp_stl",          label: "STL -- vectors, maps, sets",  course: "cpp",      diff: 2 },
    { id: "cpp_raii",         label: "RAII & Smart Pointers",      course: "cpp",      diff: 3 },
    { id: "cpp_move",         label: "Move Semantics (C++11+)",     course: "cpp",      diff: 4 },
  ]},

  // ── PYTHON ────────────────────────────────────────────────────────────────
  { category: "Python Fundamentals", color: "#4ecdc4", skills: [
    { id: "py_syntax",        label: "Python Syntax & Types",      course: "python",   diff: 1 },
    { id: "py_functions",     label: "Functions & Scope",          course: "python",   diff: 1 },
    { id: "py_lists_dicts",   label: "Lists, Dicts & Comprehensions", course: "python", diff: 1 },
    { id: "py_oop",           label: "OOP in Python",              course: "python",   diff: 2 },
    { id: "py_exceptions",    label: "Exceptions & Error Handling",course: "python",   diff: 2 },
    { id: "py_file_io",       label: "File I/O",                   course: "python",   diff: 2 },
  ]},

  { category: "Python Advanced", color: "#4ecdc4", skills: [
    { id: "py_generators",    label: "Generators & Iterators",     course: "python",   diff: 3 },
    { id: "py_decorators",    label: "Decorators",                 course: "python",   diff: 3 },
    { id: "py_async",         label: "Async / Await",              course: "python",   diff: 4 },
    { id: "py_stdlib",        label: "Standard Library (os, sys, re)", course: "python", diff: 2 },
  ]},

  // ── DISCRETE MATH ─────────────────────────────────────────────────────────
  { category: "Discrete Math", color: "#a78bfa", skills: [
    { id: "proofs",           label: "Proof Techniques",           course: "discrete", diff: 1 },
    { id: "combinatorics",    label: "Combinatorics",              course: "discrete", diff: 2 },
    { id: "probability",      label: "Probability",                course: "discrete", diff: 3 },
    { id: "number_theory",    label: "Number Theory",              course: "discrete", diff: 3 },
  ]},
];

export const ALL_SKILLS   = SKILL_TREE.flatMap(c => c.skills);
export const TOTAL_SKILLS = ALL_SKILLS.length;
export const MAX_LEVEL    = 4;
export const MAX_XP       = TOTAL_SKILLS * MAX_LEVEL * 200;

export const DIFF_LABELS = ["", "Beginner", "Early", "Intermediate", "Advanced"];

export const LEVEL_META = [
  { label: "Not started", color: "#3a4052", bg: "#1a1f2e",   },
  { label: "Seen it",     color: "#fb923c", bg: "#fb923c18", },
  { label: "Understand",  color: "#e8c547", bg: "#e8c54718", },
  { label: "Can apply",   color: "#4ecdc4", bg: "#4ecdc418", },
  { label: "Mastered",    color: "#34d399", bg: "#34d39918", },
];

// Skills grouped by course
export const SKILLS_BY_COURSE = COURSES.map(course => ({
  ...course,
  skills: ALL_SKILLS.filter(s => s.course === course.id).sort((a, b) => a.diff - b.diff),
})).filter(c => c.skills.length > 0);

// Courses actively being taken this semester (Spring 2026)
// Used as default tier assignments -- overridden by user via TIERS_KEY in localStorage
export const DEFAULT_TIERS = {
  algos:      "current",
  automata:   "current",
  opsystems:  "current",
  databases:  "current",
  linear:     "current",
  datastruct: "research",
  discrete:   "research",
  comporg:    "research",
  cpp:        "ambition",
  python:     "ambition",
};

