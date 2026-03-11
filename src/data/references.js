export const REFERENCES = [
  // Languages
  { id: "cpp_ref", label: "C++ Reference", category: "Languages", color: "#fb923c", file: "languages/cpp_reference.html" },
  { id: "py_ref", label: "Python Reference", category: "Languages", color: "#4ecdc4", file: "languages/python_reference.html" },
  { id: "java_ref", label: "Java Reference", category: "Languages", color: "#e8c547", file: "languages/java_reference.html" },
  { id: "rust_ref", label: "Rust Reference", category: "Languages", color: "#ff6b9d", file: "languages/rust_reference.html" },
  { id: "c_ref", label: "C Reference", category: "Languages", color: "#34d399", file: "languages/c_reference.html" },
  { id: "ts_ref", label: "TypeScript Reference", category: "Languages", color: "#4ecdc4", file: "languages/typescript_reference.html" },
  { id: "go_ref", label: "Go Reference", category: "Languages", color: "#34d399", file: "languages/go_reference.html" },
  { id: "cs_ref", label: "C# Reference", category: "Languages", color: "#a78bfa", file: "languages/csharp_reference.html" },
  { id: "sql_ref", label: "SQL Reference", category: "Languages", color: "#e8c547", file: "languages/sql_reference.html" },
  { id: "htmlcss_ref", label: "HTML/CSS Reference", category: "Languages", color: "#fb923c", file: "languages/htmlcss_reference.html" },
  { id: "arm_ref", label: "ARM / Comp Org", category: "Languages", color: "#34d399", file: "languages/comp_org_arm_reference.html" },
  // CS Core
  { id: "algo_ref", label: "Algorithms Guide", category: "CS Core", color: "#a78bfa", file: "algorithms.html" },
  { id: "ds_ref", label: "Data Structures Guide", category: "CS Core", color: "#34d399", file: "data-structures.html" },
  { id: "discrete_ref", label: "Discrete Math Guide", category: "CS Core", color: "#f472b6", file: "discrete-math-guide.html" },
  { id: "linear_ref", label: "Linear Algebra Guide", category: "CS Core", color: "#fb923c", file: "linear-algebra-guide.html" },
  { id: "automata_ref", label: "Automata (Sipser)", category: "CS Core", color: "#ff6b9d", file: "automata-sisper-reference.html" },
  { id: "automata_sets", label: "Automata Reading Sets", category: "CS Core", color: "#ff6b9d", file: "reading-sets-automata.html" },
  { id: "jflap", label: "JFLAP Demo", category: "CS Core", color: "#ff6b9d", file: "jflap-demo.html" },
  // Math & Reference
  { id: "mathnotation", label: "Math Notation", category: "Reference", color: "#4ecdc4", file: "mathnotation_enhanced.html" },
  { id: "math_science", label: "Math & Science Ref", category: "Reference", color: "#a78bfa", file: "math_science_ref.html" },
  // Side Tools
  { id: "iteration_viz", label: "Iteration Visualizer", category: "Tools", color: "#e8c547", file: "side/iteration-visualizer.html" },
  { id: "recursion_dp", label: "Recursion / Memo / DP", category: "Tools", color: "#4ecdc4", file: "side/recursion-memo-dp.html" },
  { id: "algo_toc", label: "Algorithms TOC", category: "Tools", color: "#a78bfa", file: "side/algorithms_toc.html" },
  { id: "ds_toc", label: "Data Structures TOC", category: "Tools", color: "#34d399", file: "side/data_structures_toc.html" },
  { id: "zy_ref", label: "Zybook Reference", category: "Tools", color: "#e8c547", file: "side/zy.html" },
  // AI / LLMs
  { id: "llm_ref", label: "Intro to LLMs", category: "AI", color: "#ff6b9d", file: "llms/introllms.html" },
  { id: "llm_explained", label: "LLM Explained", category: "AI", color: "#ff6b9d", file: "llms/llm-explained.html" },
  { id: "ai_agents", label: "AI Agents", category: "AI", color: "#f472b6", file: "llms/ai-agents.html" },
  { id: "agents", label: "Agents Guide", category: "AI", color: "#f472b6", file: "llms/agents.html" },
  { id: "ai_landscape", label: "AI Landscape", category: "AI", color: "#4ecdc4", file: "llms/ai-landscape.html" },
  { id: "deep_learning", label: "Deep Learning", category: "AI", color: "#a78bfa", file: "llms/deep-learning.html" },
  { id: "machine_learning", label: "Machine Learning", category: "AI", color: "#a78bfa", file: "llms/machine-learning.html" },
  // Misc
  { id: "linux_ref", label: "Linux Reference", category: "Misc", color: "#a78bfa", file: "linux_reference.html" },
  // Assignments — Algos
  { id: "algos_exam_review", label: "Algos Exam Intro Review", category: "Assignments", color: "#4ecdc4", file: "./content/assignments/algos_intro_exam_review.html" },
  // Assignments — Automata
  { id: "automata_hw1", label: "Automata HW1 Solutions", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/hw1_problems_solutionsAutomata.html" },
  { id: "automata_hw2", label: "Automata HW2 Solutions", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/hw2_problems_solutionsAutomata.html" },
  { id: "automata_quiz1", label: "Automata Quiz 1 Review", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/quiz1_review_solutionsAutomata.html" },
  { id: "automata_quiz2", label: "Automata Practice Quiz 2", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/practice_quiz2_solutionsAutomata.html" },
  // Assignments — Linear
  { id: "linear_hw1", label: "Linear HW1", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/linear_algebra_hw1.html" },
  { id: "linear_hw2", label: "Linear HW2", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/linear_algebra_hw2.html" },
  { id: "linear_hw3", label: "Linear HW3", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/linear_algebra_hw3.html" },
  { id: "linear_hw4", label: "Linear HW4 — Vector Spaces", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw4_vector_spaces.html" },
  { id: "linear_hw5", label: "Linear HW5 — Linear Operators", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw5_linear_operators.html" },
  { id: "linear_exam1_review", label: "Linear Exam 1 Review", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/linAlg_exam1_review.html" },
  { id: "linear_exam_checklist", label: "Linear Exam Checklist", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/linear-exam-checklist.html" },
  // Practice
  { id: "practice_linear", label: "Linear Algebra Practice", category: "Practice", color: "#f472b6", file: "./content/practice/2318E1.html" },
  { id: "practice_algos", label: "Algos Exam Intro Practice", category: "Practice", color: "#4ecdc4", file: "./content/practice/3320Eintro.html" },
  { id: "practice_automata", label: "Automata Q1 Practice", category: "Practice", color: "#ff6b9d", file: "./content/practice/3340Q1.html" },
];