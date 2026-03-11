# Algorithm Categories Guide

## 1. Sorting Algorithms

**What:** Algorithms that arrange elements in a specific order (ascending/descending)

**When to use:** Organizing data, preprocessing for other algorithms, improving search efficiency

**Key characteristics:**
- **Stability:** Does it preserve relative order of equal elements?
- **In-place:** Does it need extra space?
- **Adaptive:** Does it perform better on partially sorted data?

**Categories:**
- **Simple sorts:** O(n²) - Bubble, Selection, Insertion
- **Efficient sorts:** O(n log n) - Merge, Quick, Heap
- **Special sorts:** Linear time for specific cases - Counting, Radix, Bucket

---

## 2. Searching Algorithms

**What:** Algorithms that find specific elements or verify their existence

**When to use:** Locating data, checking membership, finding patterns

**Key characteristics:**
- **Data requirement:** Sorted vs unsorted
- **Search space:** Array, tree, graph
- **Completeness:** Guaranteed to find if exists

**Categories:**
- **Linear search:** Check every element - O(n)
- **Binary variants:** Divide search space - O(log n)
- **Graph traversal:** DFS, BFS - explore nodes/edges

---

## 3. Graph Algorithms

**What:** Algorithms that solve problems on graphs (nodes + edges)

**When to use:** Networks, relationships, paths, connectivity problems

**Key characteristics:**
- **Graph type:** Directed/undirected, weighted/unweighted
- **Problem type:** Path, cycle, connectivity, optimization

**Categories:**
- **Shortest path:** Dijkstra's, Bellman-Ford, Floyd-Warshall
- **Minimum spanning tree:** Kruskal's, Prim's
- **Topological sorting:** Order dependencies (DAGs)
- **Cycle detection:** Find loops in graphs

---

## 4. Tree Algorithms

**What:** Algorithms that operate on tree data structures (hierarchical)

**When to use:** Hierarchical data, expression evaluation, file systems

**Key characteristics:**
- **Tree type:** Binary, BST, AVL, etc.
- **Operation type:** Traversal, modification, querying

**Categories:**
- **Traversals:** Inorder, Preorder, Postorder, Level-order
- **Tree queries:** Height, LCA, diameter, balance check
- **Tree modifications:** Rotations (AVL), balancing

---

## 5. Dynamic Programming (DP)

**What:** Break problem into overlapping subproblems, store results to avoid recomputation

**When to use:** Optimization problems with overlapping subproblems and optimal substructure

**Key characteristics:**
- **Memoization (top-down):** Recursive with caching
- **Tabulation (bottom-up):** Iterative table filling
- **State transition:** How subproblems relate

**Categories:**
- **1D DP:** Fibonacci, Climbing Stairs, Coin Change
- **2D DP:** Knapsack, LCS, Edit Distance
- **Optimization:** Maximize/minimize under constraints

**When NOT to use:** Greedy works, no overlapping subproblems, exponential state space

---

## 6. Greedy Algorithms

**What:** Make locally optimal choice at each step, hoping for global optimum

**When to use:** Optimization problems with greedy choice property

**Key characteristics:**
- **Greedy choice:** Local optimum leads to global optimum
- **Fast:** Usually O(n log n) or better
- **No backtracking:** Commit to choices immediately

**Categories:**
- **Selection problems:** Activity selection, job sequencing
- **Optimization:** Fractional knapsack, Huffman coding
- **Scheduling:** Minimum platforms, task assignment

**When NOT to use:** Greedy doesn't guarantee optimal solution (use DP instead)

---

## 7. Divide & Conquer

**What:** Break problem into smaller subproblems, solve recursively, combine results

**When to use:** Problem can be divided into independent subproblems

**Key characteristics:**
- **Divide:** Break into subproblems
- **Conquer:** Solve subproblems recursively
- **Combine:** Merge solutions

**Categories:**
- **Sorting:** Merge Sort, Quick Sort
- **Searching:** Binary Search
- **Mathematical:** Strassen's matrix multiplication
- **Geometric:** Closest pair of points

---

## 8. Backtracking

**What:** Try all possibilities, backtrack when solution path fails

**When to use:** Finding all solutions, constraint satisfaction, puzzles

**Key characteristics:**
- **Exhaustive search:** Explore all possibilities
- **Pruning:** Abandon paths that can't lead to solution
- **Incremental:** Build solution step-by-step

**Categories:**
- **Puzzles:** N-Queens, Sudoku
- **Combinatorial:** Permutations, Combinations, Subset Sum
- **Path finding:** Knight's Tour, Rat in Maze

**When NOT to use:** Solution space too large without pruning, optimization problem (use DP/Greedy)

---

## Quick Comparison

| Category | Approach | Time Complexity | Space | Use Case |
|----------|----------|----------------|-------|----------|
| **Sorting** | Compare/organize | O(n log n) typical | O(1)-O(n) | Order data |
| **Searching** | Find/verify | O(log n)-O(n) | O(1)-O(n) | Locate elements |
| **Graph** | Traverse/optimize | O(V+E) typical | O(V) | Networks, paths |
| **Tree** | Traverse/query | O(n) or O(log n) | O(h) | Hierarchies |
| **DP** | Memoize subproblems | O(n²)-O(n³) | O(n²) | Optimization |
| **Greedy** | Local optimum | O(n log n) | O(1)-O(n) | Fast optimization |
| **D&C** | Divide, solve, merge | O(n log n) | O(log n)-O(n) | Recursive problems |
| **Backtracking** | Try all, backtrack | O(2^n)-O(n!) | O(n) | Constraint solving |

---

## How to Choose

**Optimization problem?**
- Try **Greedy** first (fast but may not work)
- Use **DP** if greedy fails (slower but optimal)

**Search problem?**
- Sorted data → **Binary Search**
- Graph/Tree → **DFS/BFS**
- Unsorted → **Linear Search**

**Need all solutions?**
- Use **Backtracking**

**Divide into independent parts?**
- Use **Divide & Conquer**

**Graph/network problem?**
- Use **Graph Algorithms**

**Hierarchical data?**
- Use **Tree Algorithms**