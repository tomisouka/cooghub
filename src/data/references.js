export const REFERENCES = [
  // Languages
  { id: "cpp_ref", label: "C++ Reference", category: "Languages", color: "#fb923c", file: "cosc/cpp/cpp_reference.html" },
  { id: "py_ref", label: "Python Reference", category: "Languages", color: "#4ecdc4", file: "languages/python_reference.html" },
  { id: "java_ref", label: "Java Reference", category: "Languages", color: "#e8c547", file: "languages/java_reference.html" },
  { id: "rust_ref", label: "Rust Reference", category: "Languages", color: "#ff6b9d", file: "languages/rust_reference.html" },
  { id: "c_ref", label: "C Reference", category: "Languages", color: "#34d399", file: "cosc/cpp/c_reference.html" },
  { id: "ts_ref", label: "TypeScript Reference", category: "Languages", color: "#4ecdc4", file: "languages/typescript_reference.html" },
  { id: "go_ref", label: "Go Reference", category: "Languages", color: "#34d399", file: "languages/go_reference.html" },
  { id: "cs_ref", label: "C# Reference", category: "Languages", color: "#a78bfa", file: "languages/csharp_reference.html" },
  { id: "sql_ref", label: "SQL Reference", category: "Languages", color: "#e8c547", file: "cosc/databases/sql_reference.html" },
  { id: "htmlcss_ref", label: "HTML/CSS Reference", category: "Languages", color: "#fb923c", file: "languages/htmlcss_reference.html" },
  { id: "arm_ref", label: "ARM / Comp Org", category: "Languages", color: "#34d399", file: "cosc/comporg/arm_reference.html" },
  // CS Core
  { id: "algo_ref", label: "Algorithms Guide", category: "CS Core", color: "#a78bfa", file: "cosc/algos/algorithms.html" },
  { id: "ds_ref", label: "Data Structures Guide", category: "CS Core", color: "#34d399", file: "cosc/datastruct/data_structures.html" },
  { id: "discrete_ref", label: "Discrete Math Guide", category: "CS Core", color: "#f472b6", file: "math/discrete/discrete_math.html" },
  { id: "linear_ref", label: "Linear Algebra Guide", category: "CS Core", color: "#fb923c", file: "math/linear/linear_algebra.html" },
  { id: "automata_ref", label: "Automata (Sipser)", category: "CS Core", color: "#ff6b9d", file: "cosc/automata/advanced/automata_sipser.html" },
  { id: "automata_sets", label: "Automata Reading Sets", category: "CS Core", color: "#ff6b9d", file: "cosc/automata/finite/automata_reading_sets.html" },
  { id: "jflap", label: "JFLAP Demo", category: "CS Core", color: "#ff6b9d", file: "cosc/automata/finite/jflap_demo.html" },
  // Math & Reference
  { id: "mathnotation", label: "Math Notation", category: "Reference", color: "#4ecdc4", file: "math/notation/math_notation.html" },
  { id: "math_science", label: "Math & Science Ref", category: "Reference", color: "#a78bfa", file: "math/notation/math_science.html" },
  // Side Tools
  { id: "iteration_viz", label: "Iteration Visualizer", category: "Tools", color: "#e8c547", file: "tools/iteration_visualizer.html" },
  { id: "recursion_dp", label: "Recursion / Memo / DP", category: "Tools", color: "#4ecdc4", file: "tools/recursion_memo_dp.html" },
  { id: "algo_toc", label: "Algorithms TOC", category: "Tools", color: "#a78bfa", file: "cosc/algos/tools/algorithms_toc.html" },
  { id: "ds_toc", label: "Data Structures TOC", category: "Tools", color: "#34d399", file: "cosc/datastruct/tools/ds_toc.html" },
  { id: "zy_ref", label: "Zybook Reference", category: "Tools", color: "#e8c547", file: "tools/zybook.html" },
  // AI / LLMs
  { id: "llm_ref", label: "Intro to LLMs", category: "AI", color: "#ff6b9d", file: "ai/llms_intro.html" },
  { id: "llm_explained", label: "LLM Explained", category: "AI", color: "#ff6b9d", file: "ai/llm_explained.html" },
  { id: "ai_agents", label: "AI Agents", category: "AI", color: "#f472b6", file: "ai/ai_agents.html" },
  { id: "agents", label: "Agents Guide", category: "AI", color: "#f472b6", file: "ai/agents_guide.html" },
  { id: "ai_landscape", label: "AI Landscape", category: "AI", color: "#4ecdc4", file: "ai/ai_landscape.html" },
  { id: "deep_learning", label: "Deep Learning", category: "AI", color: "#a78bfa", file: "ai/deep_learning.html" },
  { id: "machine_learning", label: "Machine Learning", category: "AI", color: "#a78bfa", file: "ai/machine_learning.html" },
  // Misc
  { id: "linux_ref", label: "Linux Reference", category: "Misc", color: "#a78bfa", file: "cosc/linux/linux_reference.html" },
  // Assignments — Algos
  { id: "algos_exam_review", label: "Algos Exam Intro Review", category: "Assignments", color: "#4ecdc4", file: "./content/assignments/algos/intro_exam_review.html" },
  // Assignments — Automata
  { id: "automata_hw1", label: "Automata HW1 Solutions", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/automata/hw1_solutions.html" },
  { id: "automata_hw2", label: "Automata HW2 Solutions", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/automata/hw2_solutions.html" },
  { id: "automata_quiz1", label: "Automata Quiz 1 Review", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/automata/quiz1_solutions.html" },
  { id: "automata_quiz2", label: "Automata Practice Quiz 2", category: "Assignments", color: "#ff6b9d", file: "./content/assignments/automata/quiz2_practice.html" },
  // Assignments — Linear
  { id: "linear_hw1", label: "Linear HW1", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw1.html" },
  { id: "linear_hw2", label: "Linear HW2", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw2.html" },
  { id: "linear_hw3", label: "Linear HW3", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw3.html" },
  { id: "linear_hw4", label: "Linear HW4 — Vector Spaces", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw4.html" },
  { id: "linear_hw5", label: "Linear HW5 — Linear Operators", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/hw5.html" },
  { id: "linear_exam1_review", label: "Linear Exam 1 Review", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/exam1_review.html" },
  { id: "linear_exam_checklist", label: "Linear Exam Checklist", category: "Assignments", color: "#f472b6", file: "./content/assignments/linear/exam_checklist.html" },
  // Practice
  { id: "practice_linear", label: "Linear Algebra Practice", category: "Practice", color: "#f472b6", file: "./content/practice/linear_exam1.html" },
  { id: "practice_algos", label: "Algos Exam Intro Practice", category: "Practice", color: "#4ecdc4", file: "./content/practice/algos_intro_exam.html" },
  { id: "practice_automata", label: "Automata Q1 Practice", category: "Practice", color: "#ff6b9d", file: "./content/practice/automata_quiz1.html" },
];