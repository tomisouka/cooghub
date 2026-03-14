import { useState, useEffect, useRef } from "react";

const FONT = "'Inter', 'Segoe UI', sans-serif";
const MONO = "'DM Mono', 'Fira Code', monospace";

const COURSES = [
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
// Sources: COSC 3320 (algos), COSC 3340 (automata), COSC 3360 (OS — Rincon),
//          COSC 3380 (DB — Uma), algos_list.md, list.md (linear algebra)
// diff: 1=beginner, 2=early, 3=intermediate, 4=advanced
const SKILL_TREE = [

  // ── ALGORITHMS (COSC 3320 — Gopal Pandurangan) ────────────────────────────
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

  // ── AUTOMATA (COSC 3340 — Rakesh Verma + schedule) ───────────────────────
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

  // ── OPERATING SYSTEMS (COSC 3360 — Carlos Rincon) ─────────────────────────
  // Based on syllabus: Stallings OS, 3 exam units
  { category: "OS Fundamentals", color: "#fb923c", skills: [
    { id: "os_overview",      label: "OS Overview & Structure",    course: "opsystems", diff: 1 },
    { id: "process_desc",     label: "Process Description & Control", course: "opsystems", diff: 1 },
    { id: "threads",          label: "Threads & Multithreading",   course: "opsystems", diff: 2 },
    { id: "fork_syscall",     label: "fork() & Process Trees",     course: "opsystems", diff: 2 },
  ]},

  { category: "Concurrency & IPC", color: "#fb923c", skills: [
    { id: "ipc_pipes",        label: "IPC — Pipes & Shared Memory",course: "opsystems", diff: 2 },
    { id: "ipc_sockets",      label: "IPC — Sockets & RPC",        course: "opsystems", diff: 3 },
    { id: "mutex_sync",       label: "Mutual Exclusion & Semaphores", course: "opsystems", diff: 2 },
    { id: "condition_vars",   label: "Condition Variables",        course: "opsystems", diff: 3 },
    { id: "deadlock",         label: "Deadlock — Prevention, Avoidance, Detection", course: "opsystems", diff: 3 },
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

  // ── DATABASES (COSC 3380 — Uma Ramamurthy) ────────────────────────────────
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
    { id: "cpp_stl",          label: "STL — vectors, maps, sets",  course: "cpp",      diff: 2 },
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

const ALL_SKILLS   = SKILL_TREE.flatMap(c => c.skills);
const TOTAL_SKILLS = ALL_SKILLS.length;
const MAX_LEVEL    = 4;
const MAX_XP       = TOTAL_SKILLS * MAX_LEVEL * 200;

const DIFF_LABELS = ["", "Beginner", "Early", "Intermediate", "Advanced"];

const LEVEL_META = [
  { label: "Not started", color: "#3a4052", bg: "#1a1f2e",   },
  { label: "Seen it",     color: "#fb923c", bg: "#fb923c18", },
  { label: "Understand",  color: "#e8c547", bg: "#e8c54718", },
  { label: "Can apply",   color: "#4ecdc4", bg: "#4ecdc418", },
  { label: "Mastered",    color: "#34d399", bg: "#34d39918", },
];

// Skills grouped by course
const SKILLS_BY_COURSE = COURSES.map(course => ({
  ...course,
  skills: ALL_SKILLS.filter(s => s.course === course.id).sort((a, b) => a.diff - b.diff),
})).filter(c => c.skills.length > 0);

// Courses actively being taken this semester (Spring 2026)
// Used as default tier assignments — overridden by user via TIERS_KEY in localStorage
const DEFAULT_TIERS = {
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

const STORAGE_KEY = "coogs_deadlines";
const SKILLS_KEY  = "coogs_skill_levels";
const TIERS_KEY   = "coogs_course_tiers";

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getDaysUntil(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr + "T00:00:00") - now) / 86400000);
}
function urgencyColor(d) {
  if (d < 0) return "#ff4444"; if (d === 0) return "#ff6b9d";
  if (d <= 2) return "#fb923c"; if (d <= 7) return "#e8c547"; return "#34d399";
}
function urgencyLabel(d) {
  if (d < 0) return "OVERDUE"; if (d === 0) return "TODAY";
  if (d === 1) return "TOMORROW"; return `${d}D`;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── Level up modal ────────────────────────────────────────────────────────────
function LevelUpModal({ skill, currentLevel, targetLevel, onConfirm, onCancel }) {
  const [note, setNote] = useState("");
  const from = LEVEL_META[currentLevel];
  const to   = LEVEL_META[targetLevel];
  const isDown = targetLevel < currentLevel;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 14, padding: 24, maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>{isDown ? "Step back" : "Level up"}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{skill.label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 12, color: from.color, fontFamily: MONO, background: from.bg, padding: "3px 10px", borderRadius: 6 }}>{from.label}</span>
          <span style={{ fontSize: 14, color: "#4a5060" }}>→</span>
          <span style={{ fontSize: 12, color: to.color, fontFamily: MONO, background: to.bg, padding: "3px 10px", borderRadius: 6 }}>{to.label}</span>
        </div>
        <div style={{ fontSize: 12, color: "#7a8090", marginBottom: 8 }}>
          {isDown ? "What made you realize you need more work?" : "What makes you confident in this level up?"}
        </div>
        <textarea autoFocus value={note} onChange={e => setNote(e.target.value)}
          placeholder={isDown ? "e.g. Tried a problem and got stuck..." : "e.g. Implemented from scratch, passed all test cases..."}
          style={{ width: "100%", minHeight: 90, background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, color: "#d4d8e0", fontFamily: FONT, fontSize: 13, padding: "10px 12px", resize: "vertical", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => onConfirm(note)} disabled={!note.trim()} style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: note.trim() ? "pointer" : "not-allowed",
            background: note.trim() ? to.color : "#2a2e38", color: note.trim() ? "#0f1117" : "#4a5060",
            fontFamily: FONT, fontSize: 12, fontWeight: 700,
          }}>Confirm</button>
          <button onClick={onCancel} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>Cancel</button>
        </div>
        <div style={{ fontSize: 11, color: "#3a4052", marginTop: 8, textAlign: "center" }}>Note required to change level</div>
      </div>
    </div>
  );
}

// ── Radar chart ───────────────────────────────────────────────────────────────
function RadarChart({ skillLevels }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const draw = () => {
      canvasRef.current?._chart?.destroy();
      // Use top-level categories for radar
      const cats = [
        { label: "Algorithms",  color: "#4ecdc4", ids: ALL_SKILLS.filter(s => s.course === "algos") },
        { label: "Automata",    color: "#ff6b9d", ids: ALL_SKILLS.filter(s => s.course === "automata") },
        { label: "Data Struct", color: "#e8c547", ids: ALL_SKILLS.filter(s => s.course === "datastruct") },
        { label: "Systems",     color: "#fb923c", ids: ALL_SKILLS.filter(s => ["comporg","opsystems"].includes(s.course)) },
        { label: "Databases",   color: "#f472b6", ids: ALL_SKILLS.filter(s => s.course === "databases") },
        { label: "Linear Alg",  color: "#60a5fa", ids: ALL_SKILLS.filter(s => s.course === "linear") },
        { label: "C++ / Py",    color: "#fb7185", ids: ALL_SKILLS.filter(s => ["cpp","python"].includes(s.course)) },
        { label: "Discrete",    color: "#a78bfa", ids: ALL_SKILLS.filter(s => s.course === "discrete") },
      ];
      const pcts = cats.map(c => c.ids.length > 0
        ? Math.round((c.ids.reduce((a,s) => a + (skillLevels[s.id]?.level||0)/MAX_LEVEL, 0) / c.ids.length) * 100)
        : 0
      );
      canvasRef.current._chart = new window.Chart(canvasRef.current, {
        type: "radar",
        data: {
          labels: cats.map(c => c.label),
          datasets: [
            { data: pcts, backgroundColor: "#a78bfa18", borderColor: "#a78bfa", borderWidth: 2, pointBackgroundColor: cats.map(c => c.color), pointRadius: 5 },
            { data: cats.map(() => 100), backgroundColor: "transparent", borderColor: "#2a2e38", borderWidth: 1, borderDash: [4,4], pointRadius: 0 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: "#1e2130" }, pointLabels: { color: "#7a8090", font: { size: 10, family: "Inter, sans-serif", weight: "600" } }, angleLines: { color: "#1e2130" } } },
        },
      });
    };
    if (!window.Chart) { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"; s.onload = draw; document.head.appendChild(s); }
    else draw();
    return () => canvasRef.current?._chart?.destroy();
  }, [skillLevels]);
  return <div style={{ position: "relative", width: "100%", height: 220 }}><canvas ref={canvasRef} /></div>;
}

// ── Projection chart ──────────────────────────────────────────────────────────
function ProjectionChart({ skillLevels }) {
  const canvasRef = useRef(null);
  const now = new Date();
  const allEntries = Object.values(skillLevels).flatMap(s => s.log || []);
  const thirtyAgo = new Date(now); thirtyAgo.setDate(now.getDate() - 30);
  const recentPts = allEntries.filter(e => new Date(e.ts) >= thirtyAgo).reduce((a, e) => a + (e.to - e.from), 0);
  const dailyRate = Math.max(recentPts / 30, 0.05);
  const totalPts  = Object.values(skillLevels).reduce((a, s) => a + (s.level || 0), 0);
  const maxPts    = TOTAL_SKILLS * MAX_LEVEL;
  const daysLeft  = dailyRate > 0 ? Math.ceil((maxPts - totalPts) / dailyRate) : null;
  const masteryDate = daysLeft ? (() => { const d = new Date(now); d.setDate(now.getDate() + daysLeft); return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; })() : null;

  useEffect(() => {
    if (!canvasRef.current) return;
    const sorted = [...allEntries].sort((a,b) => new Date(a.ts) - new Date(b.ts));
    const pastLabels = [], pastData = [];
    for (let w = 8; w >= 0; w--) {
      const d = new Date(now); d.setDate(now.getDate() - w * 7);
      pastLabels.push(`${MONTHS[d.getMonth()]} ${d.getDate()}`);
      pastData.push(sorted.filter(e => new Date(e.ts) <= d).reduce((a,e) => a + (e.to - e.from), 0));
    }
    const futLabels = [], futData = [];
    for (let w = 1; w <= 12; w++) {
      const d = new Date(now); d.setDate(now.getDate() + w * 7);
      futLabels.push(`${MONTHS[d.getMonth()]} ${d.getDate()}`);
      futData.push(Math.min(totalPts + dailyRate * w * 7, maxPts));
    }
    const allLabels  = [...pastLabels, ...futLabels];
    const pastFull   = [...pastData, ...Array(12).fill(null)];
    const futureFull = [...Array(8).fill(null), totalPts, ...futData];
    const draw = () => {
      canvasRef.current?._chart?.destroy();
      canvasRef.current._chart = new window.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: allLabels,
          datasets: [
            { label: "Actual",    data: pastFull,   borderColor: "#a78bfa", backgroundColor: "#a78bfa18", borderWidth: 2, pointRadius: 3, pointBackgroundColor: "#a78bfa", fill: true, tension: 0.3, spanGaps: false },
            { label: "Projected", data: futureFull, borderColor: "#a78bfa", backgroundColor: "#a78bfa08", borderWidth: 2, borderDash: [6,4], pointRadius: 0, fill: true, tension: 0.3, spanGaps: false },
            { label: "Max",       data: allLabels.map(() => maxPts), borderColor: "#2a2e38", borderWidth: 1, borderDash: [3,3], pointRadius: 0, fill: false },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${Math.round(ctx.raw||0)} / ${maxPts} levels` } } },
          scales: {
            x: { ticks: { color: "#4a5060", font: { size: 10, family: MONO }, maxRotation: 45, autoSkip: true, maxTicksLimit: 8 }, grid: { color: "#1e2130" } },
            y: { min: 0, max: maxPts, ticks: { color: "#4a5060", font: { size: 10, family: MONO }, stepSize: Math.ceil(maxPts/5) }, grid: { color: "#1e2130" } },
          },
        },
      });
    };
    if (!window.Chart) { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"; s.onload = draw; document.head.appendChild(s); }
    else draw();
    return () => canvasRef.current?._chart?.destroy();
  }, [skillLevels]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, padding: "10px 14px", flex: 1, minWidth: 100 }}>
          <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Daily rate</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#4ecdc4", fontFamily: MONO }}>{dailyRate.toFixed(2)} <span style={{ fontSize: 10, color: "#4a5060" }}>lvl/day</span></div>
        </div>
        <div style={{ background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8, padding: "10px 14px", flex: 1, minWidth: 100 }}>
          <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Total progress</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", fontFamily: MONO }}>{totalPts} <span style={{ fontSize: 10, color: "#4a5060" }}>/ {maxPts}</span></div>
        </div>
        {masteryDate && (
          <div style={{ background: "#0f1117", border: "1px solid #34d39933", borderRadius: 8, padding: "10px 14px", flex: 2, minWidth: 160 }}>
            <div style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Full mastery</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#34d399", fontFamily: MONO }}>{masteryDate} <span style={{ fontSize: 10, color: "#4a5060" }}>({daysLeft}d)</span></div>
          </div>
        )}
      </div>
      <div style={{ position: "relative", width: "100%", height: 200 }}><canvas ref={canvasRef} /></div>
    </div>
  );
}

// ── XP bars ───────────────────────────────────────────────────────────────────
function XPBars({ skillLevels }) {
  const totalXP = Object.values(skillLevels).reduce((a, s) => a + (s.level || 0) * 200, 0);
  return (
    <div>
      {COURSES.map(c => {
        const cs = ALL_SKILLS.filter(s => s.course === c.id);
        if (!cs.length) return null;
        const total = cs.reduce((a, s) => a + (skillLevels[s.id]?.level || 0), 0);
        const max   = cs.length * MAX_LEVEL;
        const pct   = Math.round((total / max) * 100);
        const lvl   = Math.floor(total / cs.length) + 1;
        return (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 100, fontSize: 10, fontWeight: 600, color: "#7a8090", textAlign: "right", flexShrink: 0 }}>{c.label}</div>
            <div style={{ flex: 1, height: 7, background: "#1e2130", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: c.color, borderRadius: 4, transition: "width 0.8s" }} />
            </div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: c.color, width: 44, flexShrink: 0 }}>LVL {lvl}</div>
          </div>
        );
      })}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #1e2130", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4a5060", fontFamily: MONO }}>TOTAL XP</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#e8c547", fontFamily: MONO }}>{totalXP.toLocaleString()} <span style={{ fontSize: 10, color: "#4a5060" }}>/ {MAX_XP.toLocaleString()}</span></span>
      </div>
    </div>
  );
}

// ── Study heatmap ─────────────────────────────────────────────────────────────
function StudyHeatmap({ studyLog }) {
  const TOTAL_WEEKS = 36; // wide enough that today (~18 weeks in) sits near center
  const PAST_WEEKS  = 18; // weeks before today's week
  const today = new Date(2026, 2, 14); // Mar 14 2026 — local time, not UTC
  const todayLabel = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const intensities = ["#1a1f2e","#4ecdc433","#4ecdc466","#4ecdc499","#4ecdc4"];
  const DAY_LABELS  = ["S","M","T","W","T","F","S"]; // row 0=Sun … 6=Sat
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Columns start on Sunday. S M T W T F S display order.
  const todayDow = today.getDay(); // 0=Sun,1=Mon…
  const thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() - todayDow);
  const gridStart = new Date(thisSunday);
  gridStart.setDate(thisSunday.getDate() - PAST_WEEKS * 7);

  // Build all columns: each column = one week (Sun→Sat, rows 0=Sun..6=Sat)
  // We'll display rows Mon..Sun (remap below) to match reference image
  const cols = [];
  const monthLabels = [];
  let lastMonth = null;

  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const col = [];
    let colMonthLabel = null;

    // Owner = month of this column's Sunday. Always.
    // Dead cells = any day whose month != owner. 
    // Leading dead cells: when a new month starts mid-week (those early days are dead in prev column).
    // Trailing dead cells: when a month ends mid-week (remaining days are dead).
    const colSunday = new Date(gridStart);
    colSunday.setDate(gridStart.getDate() + w * 7);
    const colMonth = colSunday.getMonth();
    const colYear  = colSunday.getFullYear();

    // Month label appears on the column whose SUNDAY is the 1st or later in that month
    // i.e. the first column that is fully owned by the new month
    if (colSunday.getDate() === 1 || (w > 0 && colSunday.getMonth() !== lastMonth)) {
      const mo = colMonth;
      if (mo !== lastMonth) {
        colMonthLabel = MONTH_NAMES[mo] + " '" + String(colYear).slice(2);
        lastMonth = mo;
      }
    }

    // Find the day-of-week that the 1st of colMonth falls on (for leading dead cells)
    const firstOfMonth = new Date(colYear, colMonth, 1);
    const firstDow = firstOfMonth.getDay(); // 0=Sun…6=Sat — leading dead cells before this dow

    for (let dow = 0; dow < 7; dow++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + dow);
      const key = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      // Trailing dead: day spills into next month
      const isTrailingDead = date.getMonth() !== colMonth || date.getFullYear() !== colYear;
      // Leading dead: this is the first column of a month (has a label) and dow is before the 1st
      const isLeadingDead = !!colMonthLabel && dow < firstDow;
      const isDead = isTrailingDead || isLeadingDead;
      const level = (isFuture || isDead) ? 0 : Math.min(studyLog[key] || 0, 4);
      col[dow] = (
        <div key={dow} title={isDead ? "" : key} style={{
          width: 11, height: 11,
          background: isDead ? "transparent" : isFuture ? "#0d1117" : intensities[level],
          borderRadius: 2,
          opacity: isDead ? 0 : isFuture ? 0.25 : 1,
          cursor: "default",
        }} />
      );
    }

    cols.push(col);
    monthLabels.push(colMonthLabel);
  }

  let streak = 0; const sd = new Date(today);
  while (studyLog[sd.toISOString().slice(0, 10)]) { streak++; sd.setDate(sd.getDate() - 1); }

  const CELL = 11, GAP = 3;

  return (
    <div>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#4a5060" }}>Last {PAST_WEEKS} weeks &nbsp;·&nbsp; <span style={{ color: "#7a8090" }}>{todayLabel}</span></span>
        {streak > 0 && <span style={{ fontSize: 11, fontFamily: MONO, color: "#4ecdc4", fontWeight: 700 }}>✦ {streak} day streak</span>}
      </div>

      {/* grid with day-labels on left */}
      <div style={{ display: "flex", gap: 6 }}>
        {/* Day labels — paddingTop must match month row: height(14) + marginBottom(4) = 18 */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, paddingTop: 18 }}>
          {DAY_LABELS.map((lbl, i) => (
            <div key={i} style={{ width: 8, height: CELL, fontSize: 8, color: "#4a5060", lineHeight: `${CELL}px`, textAlign: "right" }}>
              {lbl}
            </div>
          ))}
        </div>

        {/* Month labels + cell grid */}
        <div style={{ overflowX: "hidden" }}>
          {/* Month label row — each label spans the pixel width of its month's columns */}
          <div style={{ display: "flex", marginBottom: 4, height: 14 }}>
            {monthLabels.map((ml, i) => {
              if (!ml) return null;
              // Count how many consecutive columns belong to this month
              let span = 0;
              for (let j = i; j < monthLabels.length; j++) {
                if (j === i || !monthLabels[j]) span++;
                else break;
              }
              const colW = CELL + GAP; // width of one normal column
              const monthGapBefore = (ml && i > 0) ? 20 : 0;
              const totalW = span * colW - GAP; // subtract trailing gap
              return (
                <div key={i} style={{ width: totalW, flexShrink: 0, marginLeft: monthGapBefore, fontSize: 9, color: "#7a8090", whiteSpace: "nowrap", overflow: "visible" }}>
                  {ml}
                </div>
              );
            })}
          </div>

          {/* Cell columns */}
          <div style={{ display: "flex" }}>
            {cols.map((col, w) => {
              const isMonthStart = monthLabels[w] && w > 0;
              return (
                <div key={w} style={{ display: "flex", flexDirection: "column", gap: GAP, marginLeft: isMonthStart ? 20 : (w > 0 ? GAP : 0), position: "relative" }}>
                  {isMonthStart && (
                    <div style={{ position: "absolute", left: -11, top: 0, bottom: 0, width: 1, background: "#e85454", opacity: 0.4 }} />
                  )}
                  {col}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#4a5060" }}>Less</span>
        {intensities.map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />)}
        <span style={{ fontSize: 10, color: "#4a5060" }}>More</span>
      </div>
    </div>
  );
}

// ── Course skill group ────────────────────────────────────────────────────────
function CourseSkillGroup({ course, skills, skillLevels, onLevelChange, onDeleteLog, tier, onCycleTier }) {
  const [expanded, setExpanded]       = useState(false);
  const [expandedSkill, setExpanded2] = useState(null);
  const [showTierDrop, setShowTierDrop] = useState(false);
  const [delTarget, setDelTarget]     = useState(null); // { skillId, entryIndex }
  const [delStep,   setDelStep]       = useState("pw"); // "pw" | "confirm"
  const [pwInput,   setPwInput]       = useState("");
  const [pwError,   setPwError]       = useState(false);

  function startDel(skillId, entryIndex) { setDelTarget({ skillId, entryIndex }); setDelStep("pw"); setPwInput(""); setPwError(false); }
  function cancelDel() { setDelTarget(null); setPwInput(""); setPwError(false); }
  function submitPw() {
    if (pwInput === "Jesiah") { setPwError(false); setDelStep("confirm"); }
    else { setPwError(true); setPwInput(""); }
  }
  function confirmDel() { onDeleteLog(delTarget.skillId, delTarget.entryIndex); cancelDel(); }

  const masteredCount = skills.filter(s => (skillLevels[s.id]?.level || 0) === MAX_LEVEL).length;
  const totalLevels   = skills.reduce((a, s) => a + (skillLevels[s.id]?.level || 0), 0);
  const pct           = Math.round((totalLevels / (skills.length * MAX_LEVEL)) * 100);

  const TIER_META = {
    current:  { label: "Current",  color: "#4ecdc4", icon: "◈" },
    research: { label: "Research", color: "#a78bfa", icon: "◉" },
    ambition: { label: "Ambition", color: "#fb923c", icon: "◇" },
  };
  const tm = TIER_META[tier] || TIER_META.ambition;

  const diffGroups = [1,2,3,4]
    .map(d => ({ diff: d, label: DIFF_LABELS[d], skills: skills.filter(s => s.diff === d) }))
    .filter(g => g.skills.length > 0);

  return (
    <div style={{ background: "#1a1f2e", border: `1px solid ${course.color}22`, borderRadius: 12, overflow: "visible", marginBottom: 10, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 }}>

        {/* Tier badge — click to open dropdown */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); setShowTierDrop(v => !v); }} style={{
            padding: "3px 9px", borderRadius: 5,
            border: `1px solid ${tm.color}44`, background: tm.color + "18",
            color: tm.color, cursor: "pointer", fontFamily: MONO,
            fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {tm.icon} {tm.label} <span style={{ fontSize: 8, opacity: 0.7 }}>▾</span>
          </button>

          {showTierDrop && (
            <>
              {/* Click-away overlay */}
              <div onClick={() => setShowTierDrop(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0,
                background: "#1e2130", border: "1px solid #2a2e38", borderRadius: 8,
                padding: 6, zIndex: 100, minWidth: 130,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {Object.entries(TIER_META).map(([key, meta]) => (
                  <button key={key} onClick={e => { e.stopPropagation(); onCycleTier(key); setShowTierDrop(false); }} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: tier === key ? meta.color + "22" : "transparent",
                    color: tier === key ? meta.color : "#7a8090",
                    fontFamily: FONT, fontSize: 12, fontWeight: 600, textAlign: "left",
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: 11 }}>{meta.icon}</span>
                    {meta.label}
                    {tier === key && <span style={{ marginLeft: "auto", fontSize: 10, color: meta.color }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Course info + expand */}
        <button onClick={() => setExpanded(v => !v)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: course.color, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#d4d8e0", marginBottom: 4 }}>{course.label}</div>
            <div style={{ height: 4, background: "#2a2e38", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: course.color, borderRadius: 2, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ fontSize: 11, fontFamily: MONO, color: course.color, flexShrink: 0 }}>{masteredCount}/{skills.length}</div>
          <div style={{ fontSize: 14, color: "#4a5060", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "none" }}>›</div>
        </button>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          {diffGroups.map(group => (
            <div key={group.diff} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4a5060", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "1px" }}>{group.label}</div>
                <div style={{ flex: 1, height: 1, background: "#2a2e38" }} />
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: group.diff }, (_, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: course.color, opacity: 0.4 + i * 0.2 }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {group.skills.map(skill => {
                  const level = skillLevels[skill.id]?.level || 0;
                  const meta  = LEVEL_META[level];
                  const isOpen = expandedSkill === skill.id;
                  const log   = skillLevels[skill.id]?.log || [];
                  return (
                    <div key={skill.id} style={{ background: "#0f1117", border: `1px solid ${meta.color}33`, borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => setExpanded2(isOpen ? null : skill.id)} style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                          {Array.from({ length: MAX_LEVEL }, (_, i) => (
                            <div key={i} style={{ width: 14, height: 5, borderRadius: 2, background: i < level ? LEVEL_META[i+1].color : "#2a2e38" }} />
                          ))}
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: level > 0 ? "#d4d8e0" : "#5a6070" }}>{skill.label}</span>
                        </div>
                        <span style={{ fontSize: 10, color: meta.color, fontFamily: MONO, fontWeight: 700, flexShrink: 0 }}>{meta.label}</span>
                        <span style={{ fontSize: 12, color: "#4a5060", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", flexShrink: 0 }}>›</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #1a1f2e" }}>
                          <div style={{ display: "flex", gap: 6, marginTop: 12, marginBottom: 12 }}>
                            {level > 0 && (
                              <button onClick={() => onLevelChange(skill, level - 1)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #2a2e38", background: "transparent", color: "#4a5060", cursor: "pointer", fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>▼ {LEVEL_META[level-1].label}</button>
                            )}
                            {level < MAX_LEVEL && (
                              <button onClick={() => onLevelChange(skill, level + 1)} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${LEVEL_META[level+1].color}55`, background: LEVEL_META[level+1].bg, color: LEVEL_META[level+1].color, cursor: "pointer", fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>▲ Level up to {LEVEL_META[level+1].label}</button>
                            )}
                            {level === MAX_LEVEL && (
                              <div style={{ fontSize: 12, color: "#34d399", fontFamily: MONO, padding: "6px 0" }}>✓ Fully mastered</div>
                            )}
                          </div>
                          {log.length > 0 && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Progress log</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {[...log].reverse().map((entry, i) => {
                                  const realIdx = log.length - 1 - i;
                                  const isDeleting = delTarget?.skillId === skill.id && delTarget?.entryIndex === realIdx;
                                  return (
                                  <div key={i} style={{ background: "#161920", borderRadius: 8, padding: "8px 12px", borderLeft: `2px solid ${LEVEL_META[entry.to]?.color || "#4a5060"}` }}>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                                      <span style={{ fontSize: 10, color: LEVEL_META[entry.from]?.color, fontFamily: MONO }}>{LEVEL_META[entry.from]?.label}</span>
                                      <span style={{ fontSize: 10, color: "#4a5060" }}>→</span>
                                      <span style={{ fontSize: 10, color: LEVEL_META[entry.to]?.color, fontFamily: MONO, fontWeight: 700 }}>{LEVEL_META[entry.to]?.label}</span>
                                      <span style={{ fontSize: 10, color: "#3a4052", marginLeft: "auto", fontFamily: MONO }}>{new Date(entry.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                      {!isDeleting && <button onClick={() => startDel(skill.id, realIdx)} style={{ background: "none", border: "none", color: "#3a4052", cursor: "pointer", fontSize: 11, padding: "0 2px", fontFamily: MONO }} title="delete entry">✕</button>}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#5a6070", fontStyle: "italic", lineHeight: 1.5 }}>"{entry.note}"</div>
                                    {isDeleting && (
                                      <div style={{ marginTop: 8 }}>
                                        {delStep === "pw" ? (
                                          <>
                                            <div style={{ fontSize: 10, color: "#8090a8", fontFamily: MONO, marginBottom: 5, letterSpacing: "1px" }}>password required</div>
                                            <input autoFocus type="password" value={pwInput}
                                              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                                              onKeyDown={e => { if (e.key === "Enter") submitPw(); if (e.key === "Escape") cancelDel(); }}
                                              placeholder="password"
                                              style={{ width: "100%", boxSizing: "border-box", background: "#0d0f14", border: `1px solid ${pwError ? "#e85454" : "#2a2e38"}`, borderRadius: 5, color: "#d4d8e0", fontSize: 12, fontFamily: MONO, padding: "5px 8px", outline: "none", marginBottom: 5 }}
                                            />
                                            {pwError && <div style={{ fontSize: 10, color: "#e85454", fontFamily: MONO, marginBottom: 5 }}>incorrect</div>}
                                            <div style={{ display: "flex", gap: 6 }}>
                                              <button onClick={cancelDel} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                                              <button onClick={submitPw} style={{ flex: 1, padding: "4px 0", background: "#2a2e38", border: "none", borderRadius: 5, color: "#d4d8e0", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>next</button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div style={{ fontSize: 11, color: "#e8eaf0", fontFamily: MONO, marginBottom: 8 }}>delete this entry? level will revert.</div>
                                            <div style={{ display: "flex", gap: 6 }}>
                                              <button onClick={cancelDel} style={{ flex: 1, padding: "4px 0", background: "none", border: "1px solid #2a2e38", borderRadius: 5, color: "#8090a8", fontSize: 11, fontFamily: MONO, cursor: "pointer" }}>cancel</button>
                                              <button onClick={confirmDel} style={{ flex: 1, padding: "4px 0", background: "#e85454", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, fontFamily: MONO, fontWeight: 700, cursor: "pointer" }}>delete</button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DeadlinesPage() {
  const [deadlines,   setDeadlines]   = useState(() => load(STORAGE_KEY, []));
  const [skillLevels, setSkillLevels] = useState(() => load(SKILLS_KEY, {}));
  const [view,        setView]        = useState("month");
  const [tab,         setTab]         = useState("school");
  const [showAdd,     setShowAdd]     = useState(false);
  const [modal,       setModal]       = useState(null);
  const [skillMode,   setSkillMode]   = useState("current");
  const [courseTiers, setCourseTiers] = useState(() => load(TIERS_KEY, DEFAULT_TIERS));
  const [today]                       = useState(new Date());
  const [calDate,     setCalDate]     = useState(new Date());
  const [form, setForm] = useState({ title: "", course: "", date: "", time: "", notes: "", type: "school", priority: "normal" });

  useEffect(() => save(STORAGE_KEY, deadlines),   [deadlines]);
  useEffect(() => save(SKILLS_KEY,  skillLevels), [skillLevels]);
  useEffect(() => save(TIERS_KEY,   courseTiers), [courseTiers]);

  function cycleTier(courseId, newTier) {
    setCourseTiers(prev => ({ ...prev, [courseId]: newTier }));
  }


  function openAddWithDate(y, m, d) {
    const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    setForm(f => ({ ...f, date: dateStr, type: tab }));
    setShowAdd(true);
  }

  function addDeadline() {
    if (!form.title || !form.date) return;
    setDeadlines(prev => [...prev, { ...form, id: Date.now().toString(), done: false }].sort((a,b) => a.date.localeCompare(b.date)));
    setForm({ title: "", course: "", date: "", time: "", notes: "", type: tab, priority: "normal" });
    setShowAdd(false);
  }

  function toggleDone(id) {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
  }

  function handleLevelChange(skill, targetLevel) {
    setModal({ skill, from: skillLevels[skill.id]?.level || 0, to: targetLevel });
  }

  function confirmLevelChange(note) {
    if (!modal) return;
    const { skill, from, to } = modal;
    setSkillLevels(prev => ({
      ...prev,
      [skill.id]: { level: to, log: [...(prev[skill.id]?.log || []), { ts: new Date().toISOString(), from, to, note }] },
    }));
    setModal(null);
  }

  function handleDeleteLog(skillId, entryIndex) {
    setSkillLevels(prev => {
      const entry = prev[skillId] || { level: 0, log: [] };
      const newLog = entry.log.filter((_, i) => i !== entryIndex);
      // revert level to the `to` of the previous entry, or 0 if log is now empty
      const newLevel = newLog.length > 0 ? newLog[newLog.length - 1].to : 0;
      return { ...prev, [skillId]: { level: newLevel, log: newLog } };
    });
  }

  const calYear = calDate.getFullYear(), calMonth = calDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate()+i); return d; });

  const filtered = deadlines.filter(d => d.type===tab && !d.done);
  const done     = deadlines.filter(d => d.type===tab && d.done);
  const totalPts = Object.values(skillLevels).reduce((a,s) => a+(s.level||0), 0);
  const maxPts   = TOTAL_SKILLS * MAX_LEVEL;
  const pct      = Math.round((totalPts/maxPts)*100);

  const sect = (title, children, extra) => (
    <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>{title}</div>
        {extra}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#0f1117", fontFamily: FONT, color: "#d4d8e0" }}>
      {modal && <LevelUpModal skill={modal.skill} currentLevel={modal.from} targetLevel={modal.to} onConfirm={confirmLevelChange} onCancel={() => setModal(null)} />}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 100px" }}>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Coogs Hub</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Deadlines & Progress</h1>
        </div>

        {/* Overall progress */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase" }}>Overall mastery</span>
              <span style={{ fontSize: 11, fontFamily: MONO, color: "#a78bfa" }}>{totalPts}/{maxPts} · {TOTAL_SKILLS} skills</span>
            </div>
            <div style={{ height: 6, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #4ecdc4, #a78bfa)", borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#a78bfa", fontFamily: MONO, flexShrink: 0 }}>{pct}%</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["school","research"].map(t => (
            <button key={t} onClick={() => { setTab(t); setForm(f=>({...f,type:t})); }} style={{
              padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FONT,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
              background: tab===t ? (t==="school"?"#e8c547":"#a78bfa") : "#1a1f2e",
              color: tab===t ? "#0f1117" : "#4a5060",
            }}>{t==="school"?"◈ School":"◉ Research"}</button>
          ))}
          <button onClick={() => setShowAdd(v=>!v)} style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 8, border: `1px solid ${showAdd?"#e8c547":"#2a2e38"}`, background: "transparent", color: showAdd?"#e8c547":"#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>+ Add deadline</button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5060", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>New Deadline</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inputStyle} />
              <select value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} style={inputStyle}>
                <option value="">No course</option>
                {COURSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inputStyle} />
              <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={inputStyle} />
              <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={inputStyle}>
                <option value="low">Low priority</option>
                <option value="normal">Normal</option>
                <option value="high">High priority</option>
              </select>
              <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={addDeadline} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: tab==="school"?"#e8c547":"#a78bfa", color: "#0f1117", fontFamily: FONT, fontSize: 12, fontWeight: 700 }}>Add</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #2a2e38", background: "transparent", color: "#7a8090", cursor: "pointer", fontFamily: FONT, fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Calendar */}
        {sect("Calendar",
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["month","week"].map(v => <button key={v} onClick={()=>setView(v)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 11, fontWeight: 700, background: view===v?"#2a2e38":"transparent", color: view===v?"#d4d8e0":"#4a5060" }}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
              </div>
              {view==="month" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={()=>setCalDate(new Date(calYear,calMonth-1,1))} style={navBtn}>‹</button>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#d4d8e0", fontFamily: MONO }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={()=>setCalDate(new Date(calYear,calMonth+1,1))} style={navBtn}>›</button>
                </div>
              )}
            </div>
            {view==="month" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d=><div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#4a5060", fontFamily: MONO, padding: "4px 0" }}>{d}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                  {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
                  {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
                    const isToday = today.getDate()===day&&today.getMonth()===calMonth&&today.getFullYear()===calYear;
                    const str = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                    const dots = deadlines.filter(dl=>dl.date===str&&!dl.done);
                    return (
                      <div key={day} onClick={()=>openAddWithDate(calYear,calMonth,day)}
                        onMouseEnter={e=>{if(!isToday)e.currentTarget.style.background="#1a1f2e";}}
                        onMouseLeave={e=>{if(!isToday)e.currentTarget.style.background="transparent";}}
                        style={{ minHeight: 44, padding: "4px 6px", borderRadius: 6, cursor: "pointer", background: isToday?"#1e2a40":"transparent", border: isToday?"1px solid #7eb8f7":"1px solid transparent" }}>
                        <div style={{ fontSize: 11, fontWeight: isToday?700:500, color: isToday?"#7eb8f7":"#5a6070", fontFamily: MONO }}>{day}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 2 }}>
                          {dots.map(dl=>{const c=COURSES.find(c=>c.id===dl.course);return<div key={dl.id} title={dl.title} style={{width:6,height:6,borderRadius:"50%",background:c?c.color:"#e8c547"}}/>;} )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {view==="week" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                {weekDays.map((d,i)=>{
                  const str=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                  const isToday=d.toDateString()===today.toDateString();
                  const items=deadlines.filter(dl=>dl.date===str&&!dl.done);
                  return(
                    <div key={i} onClick={()=>openAddWithDate(d.getFullYear(),d.getMonth(),d.getDate())}
                      style={{background:isToday?"#1e2a40":"#1a1f2e",border:`1px solid ${isToday?"#7eb8f7":"#2a2e38"}`,borderRadius:8,padding:"10px 8px",minHeight:80,cursor:"pointer"}}>
                      <div style={{fontSize:10,fontWeight:700,color:isToday?"#7eb8f7":"#4a5060",fontFamily:MONO,marginBottom:6}}>{DAYS[d.getDay()]} {d.getDate()}</div>
                      {items.map(dl=>{const c=COURSES.find(c=>c.id===dl.course);return<div key={dl.id} style={{fontSize:10,padding:"2px 6px",borderRadius:4,marginBottom:3,background:(c?c.color:"#e8c547")+"22",color:c?c.color:"#e8c547",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl.title}</div>;})}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Upcoming */}
        {sect(`Upcoming — ${tab}`,
          <>
            {filtered.length===0
              ? <div style={{fontSize:13,color:"#4a5060",padding:"12px 0"}}>No upcoming deadlines. Click a day or use + Add.</div>
              : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {filtered.map(dl=>{
                    const days=getDaysUntil(dl.date),uc=urgencyColor(days),course=COURSES.find(c=>c.id===dl.course);
                    return(
                      <div key={dl.id} style={{background:"#0f1117",border:`1px solid ${uc}33`,borderLeft:`3px solid ${uc}`,borderRadius:"0 10px 10px 0",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                        <button onClick={()=>toggleDone(dl.id)} style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${uc}`,background:"transparent",cursor:"pointer",flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#d4d8e0",marginBottom:2}}>{dl.title}</div>
                          <div style={{display:"flex",gap:8}}>
                            {course&&<span style={{fontSize:10,color:course.color,fontFamily:MONO}}>{course.label}</span>}
                            <span style={{fontSize:10,color:"#4a5060",fontFamily:MONO}}>{dl.date}{dl.time?` · ${dl.time}`:""}</span>
                          </div>
                        </div>
                        <div style={{fontSize:10,fontWeight:700,fontFamily:MONO,color:uc,background:uc+"18",border:`1px solid ${uc}33`,borderRadius:6,padding:"3px 8px",flexShrink:0}}>{urgencyLabel(days)}</div>
                        <button onClick={()=>setDeadlines(p=>p.filter(d=>d.id!==dl.id))} style={{background:"transparent",border:"none",color:"#3a4052",cursor:"pointer",fontSize:13,padding:0}}>✕</button>
                      </div>
                    );
                  })}
                </div>
            }
            {done.length>0&&(
              <details style={{marginTop:12}}>
                <summary style={{fontSize:11,color:"#4a5060",cursor:"pointer",userSelect:"none"}}>{done.length} completed</summary>
                <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                  {done.map(dl=>(
                    <div key={dl.id} style={{background:"#0f1117",border:"1px solid #1e2130",borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:10,opacity:0.5}}>
                      <button onClick={()=>toggleDone(dl.id)} style={{width:14,height:14,borderRadius:"50%",border:"2px solid #34d399",background:"#34d399",cursor:"pointer",flexShrink:0}}/>
                      <div style={{flex:1,fontSize:12,color:"#4a5060",textDecoration:"line-through"}}>{dl.title}</div>
                      <button onClick={()=>setDeadlines(p=>p.filter(d=>d.id!==dl.id))} style={{background:"transparent",border:"none",color:"#3a4052",cursor:"pointer",fontSize:12}}>✕</button>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}

        {sect("Study activity", (() => {
          const derivedLog = {};
          deadlines.filter(d => d.done && d.date).forEach(d => {
            derivedLog[d.date] = Math.min((derivedLog[d.date] || 0) + 1, 4);
          });
          return <StudyHeatmap studyLog={derivedLog} />;
        })())}
        {sect("Learning projection", <ProjectionChart skillLevels={skillLevels} />)}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Skill radar</div>
            <RadarChart skillLevels={skillLevels} />
          </div>
          <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>XP levels</div>
            <XPBars skillLevels={skillLevels} />
          </div>
        </div>

        {/* Skills by course */}
        <div style={{ background: "#161920", border: "1px solid #2a2e38", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5060", letterSpacing: "2px", textTransform: "uppercase" }}>Skills by course</div>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "#4a5060" }}>{TOTAL_SKILLS} skills · {totalPts}/{maxPts}</span>
          </div>
          <div style={{ fontSize: 11, color: "#4a5060", marginBottom: 12 }}>Expanded from COSC 3320, 3340, 3360, 3380 syllabi + notes · Each level change requires a note</div>

          {/* 3-tier tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[
              { id: "current",  label: "◈ Current",  color: "#4ecdc4" },
              { id: "research", label: "◉ Research",  color: "#a78bfa" },
              { id: "ambition", label: "◇ Ambition",  color: "#fb923c" },
            ].map(t => (
              <button key={t.id} onClick={() => setSkillMode(t.id)} style={{
                padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: FONT, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                background: skillMode === t.id ? t.color : "#1a1f2e",
                color: skillMode === t.id ? "#0f1117" : "#4a5060",
                transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
            <span style={{ fontSize: 10, color: "#3a4052", marginLeft: 8, alignSelf: "center" }}>Tap tier badge on a course to reassign</span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {LEVEL_META.map((m, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: m.color }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color }} /> {m.label}
              </span>
            ))}
          </div>

          {SKILLS_BY_COURSE
            .filter(c => (courseTiers[c.id] || "ambition") === skillMode)
            .map(course => (
              <CourseSkillGroup
                key={course.id}
                course={course}
                skills={course.skills}
                skillLevels={skillLevels}
                onLevelChange={handleLevelChange}
                onDeleteLog={handleDeleteLog}
                tier={courseTiers[course.id] || "ambition"}
                onCycleTier={newTier => cycleTier(course.id, newTier)}
              />
            ))
          }

          {SKILLS_BY_COURSE.filter(c => (courseTiers[c.id] || "ambition") === skillMode).length === 0 && (
            <div style={{ fontSize: 13, color: "#4a5060", padding: "20px 0", textAlign: "center" }}>
              No courses in this tier yet. Tap a tier badge on any course to move it here.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  background: "#0f1117", border: "1px solid #2a2e38", borderRadius: 8,
  color: "#d4d8e0", fontFamily: "'Inter', sans-serif", fontSize: 13,
  padding: "8px 12px", outline: "none", width: "100%", boxSizing: "border-box",
};

const navBtn = {
  background: "transparent", border: "none", color: "#7a8090",
  cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1,
};