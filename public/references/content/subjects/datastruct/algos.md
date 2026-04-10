# ⚙️ Algorithms Complexity Reference

> Comprehensive time and space complexity for all common algorithms

---

## 📑 Table of Contents

- [Searching Algorithms](#searching-algorithms)
- [Sorting Algorithms](#sorting-algorithms)
- [Graph Algorithms](#graph-algorithms)
- [Tree Algorithms](#tree-algorithms)
- [String Algorithms](#string-algorithms)
- [Dynamic Programming](#dynamic-programming)
- [Greedy Algorithms](#greedy-algorithms)
- [Divide and Conquer](#divide-and-conquer)
- [Backtracking](#backtracking)
- [Mathematical Algorithms](#mathematical-algorithms)
- [Bit Manipulation](#bit-manipulation)
- [Quick Reference](#quick-reference)

---

# ⚙️ ALGORITHMS

## Searching Algorithms

### Linear Search

**Visual:**

```
Array: [10, 25, 30, 45, 50]
Target: 30

Check each element sequentially:
[10] ✗ → [25] ✗ → [30] ✓ Found!

Worst case: Check all n elements
```

| Complexity       | Value |
| ---------------- | ----- |
| **Best case**    | O(1)  |
| **Average case** | O(n)  |
| **Worst case**   | O(n)  |
| **Space**        | O(1)  |

**Characteristics:**

- Sequential search through array
- Works on unsorted data
- Simple to implement
- No preprocessing required

**Use Cases:**

- Small datasets
- Unsorted data
- Single search operation

---

### Binary Search

**Visual:**

```
Sorted Array: [10, 20, 30, 40, 50, 60, 70, 80, 90]
Target: 70

Step 1: Check middle (50)  [10...50...90]  70 > 50, go right
Step 2: Check middle (80)  [60...80...90]  70 < 80, go left
Step 3: Check middle (70)  [60...70...80]  Found!

Each step eliminates half the search space
```

| Complexity       | Iterative | Recursive |
| ---------------- | --------- | --------- |
| **Best case**    | O(1)      | O(1)      |
| **Average case** | O(log n)  | O(log n)  |
| **Worst case**   | O(log n)  | O(log n)  |
| **Space**        | O(1)      | O(log n)  |

**Requirements:**

- ✅ Sorted array required
- ✅ Random access (array-based)

**Characteristics:**

- Divide and conquer approach
- Eliminates half of remaining elements each iteration
- Logarithmic time complexity

**Variants:**

- **Lower bound:** First occurrence
- **Upper bound:** Last occurrence
- **Exponential search:** For unbounded arrays

---

### Jump Search

**Visual:**

```
Array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
Jump size: √n = √12 ≈ 3
Target: 15

Jump: [1] → [7] → [13] → [19] (overshot)
Linear back: [13] → [15] ✓ Found!
```

| Complexity       | Value |
| ---------------- | ----- |
| **Best case**    | O(1)  |
| **Average case** | O(√n) |
| **Worst case**   | O(√n) |
| **Space**        | O(1)  |

**Characteristics:**

- Jump by fixed block size (√n optimal)
- Linear search within block
- Better than linear, worse than binary

**Use Cases:**

- Sorted arrays where binary search is costly
- Systems with expensive comparisons

---

### Interpolation Search

**Visual:**

```
Sorted, uniformly distributed: [10, 20, 30, 40, 50, 60, 70, 80, 90]
Target: 70

Position = low + ((target - arr[low]) / (arr[high] - arr[low])) × (high - low)

Estimates position based on value distribution
Works best with uniform distribution
```

| Complexity       | Value        |
| ---------------- | ------------ |
| **Best case**    | O(1)         |
| **Average case** | O(log log n) |
| **Worst case**   | O(n)         |
| **Space**        | O(1)         |

**Requirements:**

- Sorted array
- Uniformly distributed values

**Characteristics:**

- Probes position based on value
- Excellent for uniformly distributed data
- Degrades to O(n) for non-uniform data

---

### Ternary Search

**Visual:**

```
Array: [1, 2, 3, 4, 5, 6, 7, 8, 9]
Target: 7

Split into 3 parts at mid1 and mid2:
[1,2,3] [4,5,6] [7,8,9]
   ↑       ↑       ↑
  low    mid1    mid2   high

Similar to binary but 3-way split
```

| Complexity       | Value                              |
| ---------------- | ---------------------------------- |
| **Best case**    | O(1)                               |
| **Average case** | O(log₃ n)                          |
| **Worst case**   | O(log₃ n)                          |
| **Space**        | O(1) iterative, O(log n) recursive |

**Characteristics:**

- Divides array into three parts
- Useful for finding maximum/minimum in unimodal functions
- Slightly more comparisons than binary search

---

## Sorting Algorithms

### Bubble Sort

**Visual:**

```
Pass 1: [5, 2, 8, 1, 9]
        [2, 5, 8, 1, 9]  (5,2 swap)
        [2, 5, 1, 8, 9]  (8,1 swap)

Pass 2: [2, 1, 5, 8, 9]
        [1, 2, 5, 8, 9]  (2,1 swap)

Largest elements "bubble up" to the end
Adjacent elements swap if out of order
```

| Complexity       | Value | Notes                     |
| ---------------- | ----- | ------------------------- |
| **Best case**    | O(n)  | Already sorted, optimized |
| **Average case** | O(n²) | Random order              |
| **Worst case**   | O(n²) | Reverse sorted            |
| **Space**        | O(1)  | In-place                  |
| **Stable**       | ✅ Yes | Maintains relative order  |

**Characteristics:**

- Simple implementation
- Repeatedly swaps adjacent elements
- Adaptive (fast on nearly sorted data with optimization)
- Good for teaching, bad for production

**Optimizations:**

- Early termination if no swaps in a pass
- Reduce range each pass (sorted elements at end)

---

### Selection Sort

**Visual:**

```
[64, 25, 12, 22, 11]

Pass 1: Find min (11), swap with first
        [11, 25, 12, 22, 64]
         ↑ sorted

Pass 2: Find min (12), swap with second
        [11, 12, 25, 22, 64]
             ↑ sorted

Selects minimum and places it in position
```

| Complexity       | Value | Notes                 |
| ---------------- | ----- | --------------------- |
| **Best case**    | O(n²) | Same for all cases    |
| **Average case** | O(n²) |                       |
| **Worst case**   | O(n²) |                       |
| **Space**        | O(1)  | In-place              |
| **Stable**       | ❌ No  | Can swap non-adjacent |

**Characteristics:**

- Always O(n²) comparisons
- Fewer swaps than bubble sort
- Not adaptive (no benefit from sorted data)
- Simple but inefficient

---

### Insertion Sort

**Visual:**

```
[5, 2, 4, 6, 1, 3]

Step 1: [5 | 2, 4, 6, 1, 3]  (5 sorted)
Step 2: [2, 5 | 4, 6, 1, 3]  (insert 2)
Step 3: [2, 4, 5 | 6, 1, 3]  (insert 4)
Step 4: [2, 4, 5, 6 | 1, 3]  (6 in place)
Step 5: [1, 2, 4, 5, 6 | 3]  (insert 1)
Step 6: [1, 2, 3, 4, 5, 6]   (insert 3)

Builds sorted portion one element at a time
```

| Complexity       | Value | Notes          |
| ---------------- | ----- | -------------- |
| **Best case**    | O(n)  | Already sorted |
| **Average case** | O(n²) | Random order   |
| **Worst case**   | O(n²) | Reverse sorted |
| **Space**        | O(1)  | In-place       |
| **Stable**       | ✅ Yes |                |

**Characteristics:**

- Adaptive (fast on nearly sorted data)
- Online (can sort as it receives data)
- Efficient for small datasets
- Good for nearly sorted arrays

**Use Cases:**

- Small arrays (< 50 elements)
- Nearly sorted data
- As part of hybrid sorts (Timsort)

---

### Shell Sort

**Visual:**

```
Gap sequence: [5, 2, 1] for array size 10

Gap = 5: Compare elements 5 apart
[8,9,1,7,2,3,5,4,6,0]
 ↓       ↓
Compare 8 and 3, swap if needed

Gap = 2: Compare elements 2 apart
Gap = 1: Standard insertion sort

Reduces large inversions first
```

| Complexity       | Value                    | Notes                   |
| ---------------- | ------------------------ | ----------------------- |
| **Best case**    | O(n log n)               | Depends on gap sequence |
| **Average case** | O(n^1.5) or O(n(log n)²) | Gap dependent           |
| **Worst case**   | O(n²)                    | Poor gap sequence       |
| **Space**        | O(1)                     | In-place                |
| **Stable**       | ❌ No                     |                         |

**Characteristics:**

- Generalization of insertion sort
- Uses gap sequences to sort
- Performance depends heavily on gap sequence
- Better than insertion for medium-sized arrays

**Gap Sequences:**

- Shell: n/2, n/4, ..., 1
- Knuth: (3^k - 1)/2
- Sedgewick: More complex formulas

---

### Merge Sort

**Visual:**

```
Original: [38, 27, 43, 3, 9, 82, 10]

Divide:
        [38, 27, 43, 3, 9, 82, 10]
           /                \
    [38, 27, 43, 3]      [9, 82, 10]
       /      \             /     \
   [38,27]  [43,3]      [9,82]   [10]
    /  \     /  \        /  \      |
  [38][27] [43][3]    [9] [82]   [10]

Merge:
  [27,38] [3,43]      [9,82]   [10]
      \    /              \     /
   [3,27,38,43]        [9,10,82]
           \              /
      [3,9,10,27,38,43,82]

Divide until single elements, then merge in sorted order
```

| Complexity       | Value      | Notes                    |
| ---------------- | ---------- | ------------------------ |
| **Best case**    | O(n log n) | Consistent               |
| **Average case** | O(n log n) |                          |
| **Worst case**   | O(n log n) |                          |
| **Space**        | O(n)       | Requires auxiliary array |
| **Stable**       | ✅ Yes      |                          |

**Characteristics:**

- Divide and conquer algorithm
- Consistent O(n log n) performance
- Requires extra space
- Excellent for linked lists (O(1) space)
- Used in external sorting

**Variants:**

- **Top-down:** Recursive
- **Bottom-up:** Iterative
- **In-place:** Complex, not practical

---

### Quick Sort

**Visual:**

```
[10, 80, 30, 90, 40, 50, 70]
Pivot: 50 (choose last element)

Partition:
[10, 30, 40, 50, 90, 80, 70]
           ↑
         pivot placed correctly

Recursively sort:
[10, 30, 40] and [90, 80, 70]

Best case: Pivot divides evenly
Worst case: Pivot is min/max (already sorted)
```

| Complexity       | Value      | Notes                    |
| ---------------- | ---------- | ------------------------ |
| **Best case**    | O(n log n) | Good pivot selection     |
| **Average case** | O(n log n) | Random pivots            |
| **Worst case**   | O(n²)      | Poor pivot (sorted data) |
| **Space**        | O(log n)   | Recursion stack          |
| **Stable**       | ❌ No       | Standard implementation  |

**Characteristics:**

- Divide and conquer
- In-place sorting
- Cache-friendly
- Fast in practice despite O(n²) worst case

**Pivot Strategies:**

- **First/Last:** Simple but O(n²) on sorted
- **Random:** O(n log n) expected
- **Median-of-three:** Better average case
- **Median-of-medians:** Guaranteed O(n log n)

**Optimizations:**

- Switch to insertion sort for small subarrays
- Three-way partitioning for duplicates
- Tail recursion elimination

---

### Heap Sort

**Visual:**

```
Array: [4, 10, 3, 5, 1]

Build Max-Heap:
         10
        /  \
       5    3
      / \
     4   1

Extract max repeatedly:
[10, 5, 3, 4, 1]  → Remove 10
[5, 4, 3, 1]      → Remove 5
[4, 3, 1]         → Remove 4
[3, 1]            → Remove 3
[1]               → Done

Result: [1, 3, 4, 5, 10]
```

| Complexity       | Value      | Notes      |
| ---------------- | ---------- | ---------- |
| **Best case**    | O(n log n) |            |
| **Average case** | O(n log n) |            |
| **Worst case**   | O(n log n) | Guaranteed |
| **Space**        | O(1)       | In-place   |
| **Stable**       | ❌ No       |            |

**Characteristics:**

- Uses heap data structure
- In-place sorting
- No O(n²) worst case like quicksort
- Not cache-friendly (random access)

**Algorithm:**

1. Build max heap: O(n)
2. Repeatedly extract max: O(n log n)

---

### Counting Sort

**Visual:**

```
Input: [1, 4, 1, 2, 7, 5, 2]
Range: 1 to 7

Count array:
Index: 0  1  2  3  4  5  6  7
Count: 0  2  2  0  1  1  0  1

Cumulative:
Index: 0  1  2  3  4  5  6  7
Count: 0  2  4  4  5  6  6  7

Place elements in output:
Output: [1, 1, 2, 2, 4, 5, 7]

Not comparison-based!
```

| Complexity       | Value    | Notes       |
| ---------------- | -------- | ----------- |
| **Best case**    | O(n + k) | k = range   |
| **Average case** | O(n + k) |             |
| **Worst case**   | O(n + k) |             |
| **Space**        | O(k)     | Count array |
| **Stable**       | ✅ Yes    |             |

**Requirements:**

- Integer keys
- Known range [0, k]
- Small range relative to n

**Characteristics:**

- Not comparison-based
- Linear time when k = O(n)
- Used as subroutine in radix sort

---

### Radix Sort

**Visual:**

```
Input: [170, 45, 75, 90, 802, 24, 2, 66]

Sort by least significant digit (LSD):
Units:   [170, 90, 802, 2, 24, 45, 75, 66]
Tens:    [802, 2, 24, 45, 66, 170, 75, 90]
Hundreds:[2, 24, 45, 66, 75, 90, 170, 802]

Process digit by digit from right to left
Uses stable sort (counting sort) for each digit
```

| Complexity       | Value    | Notes      |
| ---------------- | -------- | ---------- |
| **Best case**    | O(d × n) | d = digits |
| **Average case** | O(d × n) |            |
| **Worst case**   | O(d × n) |            |
| **Space**        | O(n + k) | k = base   |
| **Stable**       | ✅ Yes    |            |

**Characteristics:**

- Not comparison-based
- Processes digit by digit
- Uses stable sort (counting sort) as subroutine
- Efficient for fixed-length integer keys

**Variants:**

- **LSD (Least Significant Digit):** Right to left
- **MSD (Most Significant Digit):** Left to right

---

### Bucket Sort

**Visual:**

```
Input: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12]
Range: [0, 1), 4 buckets

Bucket 0 [0.00-0.25): [0.17, 0.21, 0.12]
Bucket 1 [0.25-0.50): [0.39, 0.26]
Bucket 2 [0.50-0.75): [0.72]
Bucket 3 [0.75-1.00): [0.78, 0.94]

Sort each bucket (insertion sort):
Bucket 0: [0.12, 0.17, 0.21]
Bucket 1: [0.26, 0.39]
Bucket 2: [0.72]
Bucket 3: [0.78, 0.94]

Concatenate: [0.12, 0.17, 0.21, 0.26, 0.39, 0.72, 0.78, 0.94]
```

| Complexity       | Value    | Notes                |
| ---------------- | -------- | -------------------- |
| **Best case**    | O(n + k) | Uniform distribution |
| **Average case** | O(n + k) |                      |
| **Worst case**   | O(n²)    | All in one bucket    |
| **Space**        | O(n + k) | Buckets              |
| **Stable**       | ✅ Yes    | If using stable sort |

**Requirements:**

- Uniformly distributed data
- Known range

**Characteristics:**

- Distribution sort
- Works well with floating-point numbers
- Performance degrades with skewed distribution

---

### Tim Sort

**Visual:**

```
Hybrid of Merge Sort + Insertion Sort

1. Divide into runs (minimum size 32-64)
2. Sort runs with insertion sort
3. Merge runs with merge sort

[Run1: sorted] [Run2: sorted] [Run3: sorted]
        \           |           /
         \          |          /
          [Merge sort combines]

Optimized for real-world data
```

| Complexity       | Value      | Notes          |
| ---------------- | ---------- | -------------- |
| **Best case**    | O(n)       | Already sorted |
| **Average case** | O(n log n) |                |
| **Worst case**   | O(n log n) |                |
| **Space**        | O(n)       |                |
| **Stable**       | ✅ Yes      |                |

**Characteristics:**

- Hybrid algorithm
- Excellent on real-world data
- Exploits existing order
- Used in Python, Java

---

### Quickselect

**Visual:**

```
Find 3rd smallest in [7, 10, 4, 3, 20, 15]

Partition around pivot (3):
[3, 4, 7, 10, 20, 15]
 ↑
k=1 (want k=3, go right)

Partition [7, 10, 20, 15] around 15:
[7, 10, 15, 20]
     ↑
Found 3rd smallest!

Similar to quicksort but only recurse on one side
```

| Complexity       | Value | Notes       |
| ---------------- | ----- | ----------- |
| **Best case**    | O(n)  | Good pivots |
| **Average case** | O(n)  | Expected    |
| **Worst case**   | O(n²) | Poor pivots |
| **Space**        | O(1)  | Iterative   |

**Use Case:**

- Find kth smallest/largest element
- Median finding
- Order statistics

---

## Graph Algorithms

### Breadth-First Search (BFS)

**Visual:**

```
Graph:      0
           /|\
          1 2 3
         /|   |
        4 5   6

Queue-based traversal:
Level 0: [0]
Level 1: [1, 2, 3]
Level 2: [4, 5, 6]

Uses Queue: FIFO
Explores level by level
```

| Complexity | Adjacency List | Adjacency Matrix |
| ---------- | -------------- | ---------------- |
| **Time**   | O(V + E)       | O(V²)            |
| **Space**  | O(V)           | O(V)             |

**Characteristics:**

- Level-order traversal
- Uses queue
- Finds shortest path in unweighted graphs
- Explores all neighbors before going deeper

**Applications:**

- Shortest path (unweighted)
- Connected components
- Bipartite graph detection
- Level-order tree traversal
- Web crawling

**Algorithm:**

1. Start at source, mark as visited
2. Enqueue source
3. While queue not empty:
   - Dequeue vertex
   - Visit all unvisited neighbors
   - Mark and enqueue neighbors

---

### Depth-First Search (DFS)

**Visual:**

```
Graph:      0
           /|\
          1 2 3
         /|   |
        4 5   6

Stack-based/Recursive traversal:
Path: 0 → 1 → 4 → 5 → 2 → 3 → 6

Uses Stack: LIFO
Explores as deep as possible first
```

| Complexity            | Adjacency List | Adjacency Matrix |
| --------------------- | -------------- | ---------------- |
| **Time**              | O(V + E)       | O(V²)            |
| **Space (recursive)** | O(V)           | O(V)             |
| **Space (iterative)** | O(V)           | O(V)             |

**Characteristics:**

- Goes deep before going wide
- Uses stack (or recursion)
- Can be implemented iteratively or recursively

**Applications:**

- Cycle detection
- Topological sorting
- Path finding
- Connected components
- Solving puzzles (mazes, sudoku)
- Strongly connected components

**Algorithm:**

1. Start at source, mark as visited
2. Recursively visit all unvisited neighbors
3. Backtrack when no unvisited neighbors

---

### Dijkstra's Shortest Path

**Visual:**

```
Graph with weights:
    1
  / | \
 0  |  3
 |  2  |
 |  |  |
 4--5--6

Start: 0
Distance: [0, 1, 2, 3, 4, 5, 6]
          [0, ∞, ∞, ∞, ∞, ∞, ∞]

Priority Queue: Extract minimum distance
Relax edges: Update distances if shorter path found

Greedy: Always picks closest unvisited vertex
```

| Implementation     | Time Complexity  | Space |
| ------------------ | ---------------- | ----- |
| **Binary Heap**    | O((V + E) log V) | O(V)  |
| **Array**          | O(V²)            | O(V)  |
| **Fibonacci Heap** | O(E + V log V)   | O(V)  |

**Requirements:**

- ❌ No negative edge weights

**Characteristics:**

- Single-source shortest path
- Greedy algorithm
- Uses priority queue
- Optimal for non-negative weights

**Applications:**

- GPS navigation
- Network routing (OSPF)
- Social network analysis
- Robotics path planning

**Algorithm:**

1. Initialize distances (source = 0, others = ∞)
2. Add all vertices to priority queue
3. While queue not empty:
   - Extract vertex with minimum distance
   - Relax all edges from this vertex

---

### Bellman-Ford Shortest Path

**Visual:**

```
Graph (can have negative weights):
  0 --(2)→ 1
  |        |
 (6)      (-3)
  ↓        ↓
  2 --(1)→ 3

Relax all edges V-1 times:
Round 1: Update distances
Round 2: Update distances
...
Round V-1: Final distances

Check for negative cycles in round V
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(VE) |
| **Space**  | O(V)  |

**Features:**

- ✅ Handles negative weights
- ✅ Detects negative cycles
- Slower than Dijkstra

**Characteristics:**

- Single-source shortest path
- Relaxes all edges V-1 times
- Can detect negative cycles
- Dynamic programming approach

**Applications:**

- Negative edge weights
- Detecting arbitrage in currency exchange
- Distributed systems
- Network routing (RIP protocol)

**Algorithm:**

1. Initialize distances (source = 0, others = ∞)
2. Relax all edges V-1 times
3. Check for negative cycles (one more iteration)

---

### Floyd-Warshall All-Pairs Shortest Path

**Visual:**

```
Distance matrix (all pairs):
     0   1   2   3
0 [  0   5   ∞   10 ]
1 [  ∞   0   3   ∞  ]
2 [  ∞   ∞   0   1  ]
3 [  ∞   ∞   ∞   0  ]

For each vertex k as intermediate:
    For each pair (i,j):
        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

Dynamic programming: Build up solution
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(V³) |
| **Space**  | O(V²) |

**Characteristics:**

- All-pairs shortest path
- Dynamic programming
- ✅ Handles negative weights (no negative cycles)
- Dense matrix representation

**Applications:**

- Finding shortest paths between all pairs
- Transitive closure
- Checking graph connectivity
- Small graphs (V < 400)

**Algorithm:**

```
for k from 1 to V:
    for i from 1 to V:
        for j from 1 to V:
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

---

### Topological Sort

**Visual:**

```
DAG (Directed Acyclic Graph):
    A → B → D
    ↓   ↓
    C → E

DFS-based: Finish times
Order: A, C, B, E, D (or A, B, C, E, D)

Kahn's (BFS): Remove vertices with in-degree 0
Queue: [A] → [B, C] → [D, E] → [E] → []

Valid orderings respect dependencies
```

| Algorithm        | Time     | Space |
| ---------------- | -------- | ----- |
| **DFS-based**    | O(V + E) | O(V)  |
| **Kahn's (BFS)** | O(V + E) | O(V)  |

**Requirements:**

- ✅ Must be DAG (Directed Acyclic Graph)
- ❌ Fails if graph has cycle

**Characteristics:**

- Linear ordering of vertices
- For every edge u→v, u comes before v
- Multiple valid orderings may exist

**Applications:**

- Task scheduling with dependencies
- Build systems (Makefile)
- Course prerequisite ordering
- Compilation order
- Dependency resolution

**DFS Algorithm:**

1. Perform DFS on all vertices
2. Push vertex to stack after visiting all neighbors
3. Stack contains topological order

**Kahn's Algorithm:**

1. Find all vertices with in-degree 0
2. Remove vertex and its edges
3. Repeat until all vertices processed

---

### Prim's Minimum Spanning Tree

**Visual:**

```
Weighted graph:
    1--2
   /|\ |
  5 1 3 4
 /  | \|
0   |  3
 \  | /
  2 |/
    4

Start at 0, grow MST:
Step 1: Add edge 0-1 (weight 1)
Step 2: Add edge 1-4 (weight 1)
Step 3: Add edge 1-2 (weight 2)
Step 4: Add edge 1-3 (weight 3)

Always pick minimum weight edge connecting to MST
```

| Implementation     | Time             | Space |
| ------------------ | ---------------- | ----- |
| **Binary Heap**    | O((V + E) log V) | O(V)  |
| **Array**          | O(V²)            | O(V)  |
| **Fibonacci Heap** | O(E + V log V)   | O(V)  |

**Characteristics:**

- Greedy algorithm
- Grows MST one vertex at a time
- Uses priority queue
- Best for dense graphs

**Applications:**

- Network design (minimize cable length)
- Circuit design
- Clustering
- Approximation algorithms

**Algorithm:**

1. Start with arbitrary vertex
2. Add to MST
3. Among edges connecting MST to non-MST vertices, pick minimum
4. Repeat until all vertices in MST

---

### Kruskal's Minimum Spanning Tree

**Visual:**

```
Edges sorted by weight:
(0,1):1  (1,4):1  (1,2):2  (0,4):2  (1,3):3  (2,3):4

Process edges in order:
✓ (0,1):1  - Add (no cycle)
✓ (1,4):1  - Add (no cycle)
✓ (1,2):2  - Add (no cycle)
✗ (0,4):2  - Skip (creates cycle)
✓ (1,3):3  - Add (no cycle)
Done! 4 edges for 5 vertices

Uses Union-Find to detect cycles
```

| Complexity | Value                    |
| ---------- | ------------------------ |
| **Time**   | O(E log E) or O(E log V) |
| **Space**  | O(V)                     |

**Characteristics:**

- Greedy algorithm
- Edge-based approach
- Uses Union-Find for cycle detection
- Best for sparse graphs

**Applications:**

- Same as Prim's
- Better for sparse graphs

**Algorithm:**

1. Sort all edges by weight
2. For each edge (in sorted order):
   - If adding edge doesn't create cycle, add it
   - Use Union-Find to check cycles
3. Stop when V-1 edges added

---

### Tarjan's Strongly Connected Components

**Visual:**

```
Directed graph:
    0 → 1 → 2
    ↑   ↓   ↓
    4 ← 3   5

SCCs: {0,1,3,4}, {2}, {5}

Each SCC is a maximal set where every
vertex can reach every other vertex

Uses DFS + stack
Tracks discovery time and low-link values
```

| Complexity | Value    |
| ---------- | -------- |
| **Time**   | O(V + E) |
| **Space**  | O(V)     |

**Characteristics:**

- Single DFS pass
- Uses stack to track vertices
- Finds all SCCs in one traversal

**Applications:**

- Finding strongly connected components
- Analyzing social networks
- Compiler optimization
- Model checking

---

### Kosaraju's Strongly Connected Components

**Visual:**

```
Algorithm:
1. DFS on original graph, store finish times
2. Transpose graph (reverse all edges)
3. DFS on transposed graph in decreasing finish time

Original:   Transposed:
0 → 1       0 ← 1
↓   ↓       ↑   ↑
2 ← 3       2 → 3

Two DFS passes
```

| Complexity | Value    |
| ---------- | -------- |
| **Time**   | O(V + E) |
| **Space**  | O(V)     |

**Characteristics:**

- Two DFS passes
- Simpler to understand than Tarjan's
- Creates graph transpose

---

### A* Search Algorithm

**Visual:**

```
Grid pathfinding:
S = Start, G = Goal, # = Obstacle

S . . . #
. # . . #
. # . . .
. . . . G

f(n) = g(n) + h(n)
g(n) = cost from start to n
h(n) = heuristic estimate from n to goal

Explores nodes with lowest f(n) first
```

| Complexity  | Value                | Notes                |
| ----------- | -------------------- | -------------------- |
| **Time**    | O(b^d)               | b=branching, d=depth |
| **Space**   | O(b^d)               | Stores frontier      |
| **Optimal** | ✅ If h is admissible |                      |

**Requirements:**

- Admissible heuristic (never overestimates)

**Characteristics:**

- Informed search
- Uses heuristic to guide search
- Optimal with admissible heuristic
- Commonly used in games/robotics

**Heuristics:**

- Manhattan distance (grid)
- Euclidean distance
- Diagonal distance
- Custom domain-specific

**Applications:**

- Game pathfinding
- Robotics navigation
- GPS routing
- Puzzle solving

---

## Tree Algorithms

### Tree Traversals

**Visual:**

```
         1
        / \
       2   3
      / \
     4   5

Preorder (Root-Left-Right):  1, 2, 4, 5, 3
Inorder (Left-Root-Right):   4, 2, 5, 1, 3
Postorder (Left-Right-Root): 4, 5, 2, 3, 1
Level-order (BFS):           1, 2, 3, 4, 5
```

| Traversal       | Time | Space | Use Case                        |
| --------------- | ---- | ----- | ------------------------------- |
| **Preorder**    | O(n) | O(h)  | Copy tree, prefix expression    |
| **Inorder**     | O(n) | O(h)  | BST → sorted, infix expression  |
| **Postorder**   | O(n) | O(h)  | Delete tree, postfix expression |
| **Level-order** | O(n) | O(w)  | Level-wise processing           |

> h = height, w = max width

**Implementations:**

- **Recursive:** Natural, uses call stack
- **Iterative:** Uses explicit stack, more control
- **Morris:** O(1) space, modifies tree temporarily

---

### Lowest Common Ancestor (LCA)

**Visual:**

```
         1
        / \
       2   3
      / \   \
     4   5   6
    /
   7

LCA(7, 5) = 2
LCA(4, 6) = 1
LCA(7, 4) = 4

Lowest ancestor that has both nodes in its subtree
```

| Method               | Preprocessing | Query    | Space      |
| -------------------- | ------------- | -------- | ---------- |
| **Naive**            | O(1)          | O(n)     | O(1)       |
| **Parent pointers**  | O(n)          | O(h)     | O(n)       |
| **Binary lifting**   | O(n log n)    | O(log n) | O(n log n) |
| **Euler tour + RMQ** | O(n)          | O(1)     | O(n)       |

**Applications:**

- Range minimum query
- Distance between nodes
- Phylogenetic trees
- Version control systems

---

### Binary Lifting

**Visual:**

```
Tree with ancestors stored at powers of 2:

Node 7 ancestors:
up[7][0] = parent (2^0 = 1 step up)
up[7][1] = grandparent (2^1 = 2 steps up)
up[7][2] = 2^2 = 4 steps up
...

Can reach any ancestor in O(log n) jumps
Precompute: up[node][i] = up[up[node][i-1]][i-1]
```

| Complexity               | Value      |
| ------------------------ | ---------- |
| **Preprocessing**        | O(n log n) |
| **Query (LCA)**          | O(log n)   |
| **Query (kth ancestor)** | O(log n)   |
| **Space**                | O(n log n) |

**Applications:**

- LCA queries
- Finding kth ancestor
- Path queries in trees

---

## String Algorithms

### Naive Pattern Matching

**Visual:**

```
Text:    "ABABCABABA"
Pattern: "ABABA"

Positions:
ABABA
 ABABA
  ABABA
   ABABA
    ABABA  ✓ Match!

Check every position, compare character by character
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(nm) |
| **Space**  | O(1)  |

> n = text length, m = pattern length

**Characteristics:**

- Simple sliding window
- No preprocessing
- Inefficient for large texts

---

### KMP (Knuth-Morris-Pratt) Pattern Matching

**Visual:**

```
Pattern: "ABABC"
LPS:     [0,0,1,2,0]
         (Longest Proper Prefix which is also Suffix)

Text:    "ABABDABABCABAB"
Pattern: "ABABC"

Mismatch at D:
ABABDABABA...
ABABC
Instead of starting over, use LPS to skip:
ABABDABABA...
  ABABC    (jump to position 2)

No backtracking in text
```

| Phase                   | Time     | Space |
| ----------------------- | -------- | ----- |
| **Preprocessing (LPS)** | O(m)     | O(m)  |
| **Searching**           | O(n)     | O(1)  |
| **Total**               | O(n + m) | O(m)  |

**Characteristics:**

- No backtracking in text
- Preprocessing builds failure function (LPS)
- Linear time guarantee

**Applications:**

- String matching
- Text editors (search)
- DNA sequence matching

---

### Rabin-Karp Pattern Matching

**Visual:**

```
Pattern: "ABC" → hash = 123
Text:    "XYZABCDEF"

Compute hash for each window:
"XYZ" → hash = 456 (no match)
"YZA" → hash = 789 (no match)
"ZAB" → hash = 234 (no match)
"ABC" → hash = 123 (match! verify)

Rolling hash: Update hash in O(1)
hash(next) = (hash(current) - first_char) × base + new_char
```

| Complexity | Average  | Worst |
| ---------- | -------- | ----- |
| **Time**   | O(n + m) | O(nm) |
| **Space**  | O(1)     | O(1)  |

**Characteristics:**

- Uses rolling hash
- Good average case
- Can find multiple patterns simultaneously
- Spurious hits possible (hash collision)

**Applications:**

- Plagiarism detection
- Multiple pattern matching
- DNA sequence analysis

---

### Boyer-Moore Pattern Matching

**Visual:**

```
Text:    "WHICH FINALLY HALTS AT THIS POINT"
Pattern: "HALTS"

Start from right of pattern:
WHICH FINALLY HALTS...
HALTS (mismatch at I vs S)

Bad character rule: Skip based on rightmost occurrence
Good suffix rule: Skip based on matched suffix

Often skip multiple characters at once
```

| Complexity        | Average     | Worst             |
| ----------------- | ----------- | ----------------- |
| **Time**          | O(n/m) best | O(nm)             |
| **Preprocessing** | O(m + σ)    | σ = alphabet size |
| **Space**         | O(m + σ)    |                   |

**Characteristics:**

- Scans from right to left
- Two heuristics: bad character, good suffix
- Very fast in practice (sublinear average case)
- Best for large alphabets

---

### Longest Common Subsequence (LCS)

**Visual:**

```
X = "ABCBDAB"
Y = "BDCABA"

DP Table:
      ""  B  D  C  A  B  A
  ""   0  0  0  0  0  0  0
  A    0  0  0  0  1  1  1
  B    0  1  1  1  1  2  2
  C    0  1  1  2  2  2  2
  B    0  1  1  2  2  3  3
  D    0  1  2  2  2  3  3
  A    0  1  2  2  3  3  4
  B    0  1  2  2  3  4  4

LCS length: 4
LCS: "BDAB" or "BCAB" or "BCBA"
```

| Complexity | Value                |
| ---------- | -------------------- |
| **Time**   | O(mn)                |
| **Space**  | O(mn) or O(min(m,n)) |

**Characteristics:**

- Dynamic programming
- Finds longest subsequence common to both
- Not necessarily contiguous
- Can be optimized to O(min(m,n)) space

**Applications:**

- Diff tools (file comparison)
- DNA sequence alignment
- Plagiarism detection
- Version control

---

### Longest Common Substring

**Visual:**

```
X = "ABABC"
Y = "BABCA"

DP Table (only store if match):
      ""  B  A  B  C  A
  ""   0  0  0  0  0  0
  A    0  0  1  0  0  1
  B    0  1  0  2  0  0
  A    0  0  2  0  0  1
  B    0  1  0  3  0  0
  C    0  0  0  0  4  0

Longest common substring: "BABC" (length 4)
Must be contiguous!
```

| Complexity | Value                |
| ---------- | -------------------- |
| **Time**   | O(mn)                |
| **Space**  | O(mn) or O(min(m,n)) |

**Difference from LCS:**

- Must be **contiguous**
- Different DP recurrence

---

### Edit Distance (Levenshtein Distance)

**Visual:**

```
Transform "SATURDAY" → "SUNDAY"

Operations: Insert, Delete, Replace
DP Table:
         ""  S  U  N  D  A  Y
     ""   0  1  2  3  4  5  6
     S    1  0  1  2  3  4  5
     A    2  1  1  2  3  3  4
     T    3  2  2  2  3  4  4
     U    4  3  2  3  3  4  5
     R    5  4  3  3  4  4  5
     D    6  5  4  4  3  4  5
     A    7  6  5  5  4  3  4
     Y    8  7  6  6  5  4  3

Edit distance: 3
Operations: Delete T, Delete R, Delete A
```

| Complexity | Value                |
| ---------- | -------------------- |
| **Time**   | O(mn)                |
| **Space**  | O(mn) or O(min(m,n)) |

**Operations:**

- Insert character
- Delete character
- Replace character

**Applications:**

- Spell checkers
- DNA sequence alignment
- Fuzzy string matching
- Plagiarism detection

---

### Manacher's Algorithm (Longest Palindromic Substring)

**Visual:**

```
String: "babad"

Transform: "#b#a#b#a#d#" (add separators)

Expand around each center:
#b#a#b#a#d#
  ←→ (length 1)
    ←→ (length 3, "aba")
      ←→ (length 5, "babad")

Uses symmetry to avoid redundant checks
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n)  |
| **Space**  | O(n)  |

**Characteristics:**

- Linear time for longest palindrome
- Uses previously computed information
- Clever use of symmetry

**Naive approach:** O(n²) or O(n³)

---

### Z-Algorithm (Pattern Matching)

**Visual:**

```
String: "aabcaabxaaaz"

Z-array: [12, 1, 0, 0, 3, 1, 0, 0, 2, 2, 1, 0]
          ↑        ↑           ↑
         Full   "aab"       "aa"

Z[i] = length of longest substring starting at i
       which matches prefix of string

For pattern matching:
Concatenate: pattern + "$" + text
Z-values equal to pattern length indicate matches
```

| Complexity | Value    |
| ---------- | -------- |
| **Time**   | O(n + m) |
| **Space**  | O(n + m) |

**Applications:**

- Pattern matching (linear time)
- Finding all occurrences
- String preprocessing

---

### Trie-based Algorithms

**Covered in Data Structures section**

- Pattern matching with multiple patterns
- Autocomplete
- Spell checking
- IP routing

---

## Dynamic Programming

### Fibonacci Sequence

**Visual:**

```
Naive Recursion:
         fib(5)
        /      \
    fib(4)    fib(3)
    /   \      /   \
 fib(3) fib(2) ...

Overlapping subproblems!

Memoization/DP:
fib[0] = 0
fib[1] = 1
fib[2] = fib[1] + fib[0] = 1
fib[3] = fib[2] + fib[1] = 2
fib[4] = fib[3] + fib[2] = 3
fib[5] = fib[4] + fib[3] = 5
```

| Approach            | Time   | Space |
| ------------------- | ------ | ----- |
| **Naive Recursion** | O(2^n) | O(n)  |
| **Memoization**     | O(n)   | O(n)  |
| **Bottom-up DP**    | O(n)   | O(n)  |
| **Space-optimized** | O(n)   | O(1)  |

**Space Optimization:**
Only need last 2 values: `fib[i] = fib[i-1] + fib[i-2]`

---

### 0/1 Knapsack

**Visual:**

```
Items: [(value, weight)]
       [(60, 10), (100, 20), (120, 30)]
Capacity: 50

DP Table (items × capacity):
      0   10  20  30  40  50
  0   0   0   0   0   0   0
  1   0   60  60  60  60  60
  2   0   60  100 160 160 160
  3   0   60  100 160 180 220

dp[i][w] = max value using first i items with capacity w

Decision: Take item i or leave it
dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])
```

| Complexity | Value         |
| ---------- | ------------- |
| **Time**   | O(nW)         |
| **Space**  | O(nW) or O(W) |

**Characteristics:**

- Pseudo-polynomial time
- Each item used 0 or 1 times
- Can be space-optimized to O(W)

**Variants:**

- Unbounded knapsack (unlimited items)
- Fractional knapsack (greedy solution)

---

### Longest Increasing Subsequence (LIS)

**Visual:**

```
Array: [10, 9, 2, 5, 3, 7, 101, 18]

DP approach O(n²):
dp[i] = length of LIS ending at i
dp = [1, 1, 1, 2, 2, 3, 4, 4]

LIS length: 4
One LIS: [2, 3, 7, 101]

Binary Search approach O(n log n):
Maintain array of smallest tail elements for each length
```

| Approach          | Time       | Space |
| ----------------- | ---------- | ----- |
| **DP**            | O(n²)      | O(n)  |
| **Binary Search** | O(n log n) | O(n)  |

**Applications:**

- Stock price analysis
- Patience sorting
- Finding trends

---

### Matrix Chain Multiplication

**Visual:**

```
Matrices: A₁(10×20) × A₂(20×30) × A₃(30×40)

Different parenthesizations:
((A₁A₂)A₃): 10×20×30 + 10×30×40 = 18,000 ops
(A₁(A₂A₃)): 20×30×40 + 10×20×40 = 32,000 ops

DP finds optimal parenthesization:
dp[i][j] = min cost to multiply Aᵢ...Aⱼ

dp[i][j] = min(dp[i][k] + dp[k+1][j] + dims[i-1]×dims[k]×dims[j])
           for k in [i, j)
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n³) |
| **Space**  | O(n²) |

**Applications:**

- Compiler optimization
- Graphics (transformation chains)
- Database query optimization

---

### Coin Change

**Visual:**

```
Coins: [1, 2, 5]
Amount: 11

DP: Minimum coins to make each amount
dp[0] = 0
dp[1] = 1 (one 1-coin)
dp[2] = 1 (one 2-coin)
dp[3] = 2 (1+2)
dp[4] = 2 (2+2)
dp[5] = 1 (one 5-coin)
...
dp[11] = 3 (5+5+1)

dp[i] = min(dp[i-coin] + 1) for all coins ≤ i
```

| Problem            | Time  | Space |
| ------------------ | ----- | ----- |
| **Min coins**      | O(nS) | O(S)  |
| **Number of ways** | O(nS) | O(S)  |

> n = number of coins, S = target amount

**Variants:**

1. Minimum coins needed
2. Number of ways to make amount
3. Coin change with unlimited/limited coins

---

### Subset Sum

**Visual:**

```
Set: [3, 34, 4, 12, 5, 2]
Target: 9

DP Table (elements × sums):
      0  1  2  3  4  5  6  7  8  9
  {}  T  F  F  F  F  F  F  F  F  F
  3   T  F  F  T  F  F  F  F  F  F
  34  T  F  F  T  F  F  F  F  F  F
  4   T  F  F  T  T  F  F  T  F  F
  12  T  F  F  T  T  F  F  T  F  F
  5   T  F  F  T  T  T  F  T  T  T
  2   T  F  T  T  T  T  T  T  T  T

dp[9] = True (3+4+2 or 4+5)
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n × sum) |
| **Space**  | O(sum)     |

**NP-Complete** but pseudo-polynomial DP solution exists

---

### Rod Cutting

**Visual:**

```
Rod length: 8
Prices: [1, 5, 8, 9, 10, 17, 17, 20]
        (length 1, 2, 3, ...)

dp[i] = maximum revenue for rod of length i

dp[8] = max(
  1 + dp[7],   (cut 1)
  5 + dp[6],   (cut 2)
  8 + dp[5],   (cut 3)
  ...
  20           (no cut)
) = 22 (cut into 2+6)
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n²) |
| **Space**  | O(n)  |

**Applications:**

- Resource allocation
- Optimization problems

---

### Egg Dropping Problem

**Visual:**

```
n = 2 eggs, k = 10 floors

Find minimum trials in worst case to find
critical floor (where egg breaks)

DP: dp[eggs][floors] = min trials

Drop from floor x:
- Breaks: dp[eggs-1][x-1] (check below)
- Doesn't: dp[eggs][floors-x] (check above)

dp[2][10] = 4 trials worst case
```

| Complexity | Value  |
| ---------- | ------ |
| **Time**   | O(nk²) |
| **Space**  | O(nk)  |

> n = eggs, k = floors

---

## Greedy Algorithms

### Activity Selection

**Visual:**

```
Activities (start, end):
[(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11)]

Sort by end time:
(1,4), (3,5), (5,7), (6,10), (8,11)

Select:
✓ (1,4)   - select first
✗ (3,5)   - overlaps with (1,4)
✓ (5,7)   - no overlap
✗ (6,10)  - overlaps with (5,7)
✓ (8,11)  - no overlap

Greedy: Always pick earliest ending activity
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n log n) |
| **Space**  | O(1)       |

**Greedy Choice:**
Always select activity with earliest end time

**Optimal:** ✅ Yes (greedy gives optimal solution)

---

### Huffman Coding

**Visual:**

```
Characters: a(5), b(9), c(12), d(13), e(16), f(45)

Build tree (merge two smallest frequencies):
          (100)
         /     \
      (45)f   (55)
              /   \
           (25)   (30)
           / \     / \
        (12)c (13)d (14) (16)e
                    / \
                  (5)a (9)b

Codes:
f: 0
c: 100
d: 101
a: 1100
b: 1101
e: 111

Shorter codes for frequent characters
```

| Phase                     | Time       |
| ------------------------- | ---------- |
| **Build frequency table** | O(n)       |
| **Build tree**            | O(k log k) |
| **Generate codes**        | O(k)       |
| **Encode**                | O(n)       |

> n = input size, k = unique characters

**Characteristics:**

- Variable-length prefix-free codes
- Optimal prefix code
- Uses priority queue (min-heap)

---

### Fractional Knapsack

**Visual:**

```
Items (value, weight):
[(60,10), (100,20), (120,30)]
Capacity: 50

Value per weight:
60/10 = 6
100/20 = 5
120/30 = 4

Greedy: Take items by value/weight ratio
✓ Take all of item 1 (10kg, 60 value)
✓ Take all of item 2 (20kg, 100 value)
✓ Take 2/3 of item 3 (20kg, 80 value)

Total: 240 value
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n log n) |
| **Space**  | O(1)       |

**Difference from 0/1 Knapsack:**

- Can take fractions of items
- Greedy gives optimal solution
- 0/1 requires DP

---

### Job Sequencing with Deadlines

**Visual:**

```
Jobs (profit, deadline):
[(100,2), (19,1), (27,2), (25,1), (15,3)]

Sort by profit (descending):
(100,2), (27,2), (25,1), (19,1), (15,3)

Schedule:
Slot 1: Job with deadline 1 → profit 25
Slot 2: Job with deadline 2 → profit 100
Slot 3: Job with deadline 3 → profit 15

Total profit: 140
```

| Complexity | Value                               |
| ---------- | ----------------------------------- |
| **Time**   | O(n²) or O(n log n) with Union-Find |
| **Space**  | O(n)                                |

**Greedy Strategy:**
Schedule highest profit jobs as late as possible

---

## Divide and Conquer

### Merge Sort (covered in Sorting)

**Pattern:**

1. Divide: Split array in half
2. Conquer: Recursively sort halves
3. Combine: Merge sorted halves

---

### Quick Sort (covered in Sorting)

**Pattern:**

1. Divide: Partition around pivot
2. Conquer: Recursively sort partitions
3. Combine: Already sorted (in-place)

---

### Binary Search (covered in Searching)

**Pattern:**

1. Divide: Compare with middle
2. Conquer: Recurse on half
3. Combine: Direct answer

---

### Strassen's Matrix Multiplication

**Visual:**

```
Naive: O(n³) for n×n matrices

Strassen: O(n^2.807)

Divide matrices into quadrants:
A = [A11 A12]    B = [B11 B12]
    [A21 A22]        [B21 B22]

Compute 7 products instead of 8:
M1 = (A11 + A22)(B11 + B22)
M2 = (A21 + A22)B11
...

Combine to get C = AB
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n^2.807) |
| **Space**  | O(n²)      |

**Practical Note:**
Constant factors make it slower than naive for small n

---

### Closest Pair of Points

**Visual:**

```
Points in 2D plane:
Find minimum distance between any two points

Divide: Split by median x-coordinate
Conquer: Recursively find closest in each half
Combine: Check points near dividing line

         |
    •    |    •
  •      |  •
    •    |      •
         |  •

Only need to check points within δ of line
δ = min(left_min, right_min)
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n log n) |
| **Space**  | O(n)       |

**Naive:** O(n²) check all pairs

---

### Maximum Subarray (Kadane's Algorithm)

**Visual:**

```
Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Kadane's Algorithm:
Keep track of:
- max_so_far (global maximum)
- max_ending_here (maximum ending at current position)

At each position:
max_ending_here = max(arr[i], max_ending_here + arr[i])
max_so_far = max(max_so_far, max_ending_here)

Maximum subarray: [4, -1, 2, 1] = 6
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n)  |
| **Space**  | O(1)  |

**Divide and Conquer approach:** O(n log n)
**Kadane's (DP/Greedy):** O(n) - optimal

---

## Backtracking

### N-Queens Problem

**Visual:**

```
4-Queens on 4×4 board:

Solution 1:         Solution 2:
. Q . .            . . Q .
. . . Q            Q . . .
Q . . .            . . . Q
. . Q .            . Q . .

Place queens so no two attack each other
(row, column, diagonal constraints)

Backtrack when constraint violated
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n!) |
| **Space**  | O(n)  |

**Algorithm:**

1. Place queen in column
2. Check if safe
3. Recurse to next column
4. Backtrack if no solution

---

### Sudoku Solver

**Visual:**

```
9×9 grid with constraints:
- Each row: 1-9 once
- Each column: 1-9 once  
- Each 3×3 box: 1-9 once

5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9

Try values 1-9, backtrack on constraint violation
```

| Complexity | Value                 |
| ---------- | --------------------- |
| **Time**   | O(9^(n×n)) worst case |
| **Space**  | O(n×n)                |

**Optimizations:**

- Constraint propagation
- Choose cell with fewest possibilities
- Naked singles, hidden singles

---

### Subset Sum (Backtracking)

**Visual:**

```
Set: [3, 34, 4, 12, 5, 2]
Target: 9

Decision tree:
              {}
         /          \
       {3}          {}
      /   \        /   \
   {3,34} {3}   {34}   {}

Include/Exclude each element
Prune branches where sum > target
```

| Complexity | Value  |
| ---------- | ------ |
| **Time**   | O(2^n) |
| **Space**  | O(n)   |

**DP is better** when sum is reasonable
**Backtracking useful** when we need actual subset

---

### Hamiltonian Path/Cycle

**Visual:**

```
Graph:
  0---1---2
  |   |   |
  3---4---5

Hamiltonian Path: Visit each vertex exactly once
Example: 0-3-4-1-2-5

Hamiltonian Cycle: Path + return to start
Example: 0-1-4-3-5-2-0

Try all paths, backtrack on dead ends
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n!) |
| **Space**  | O(n)  |

**NP-Complete problem**

---

### Graph Coloring

**Visual:**

```
Graph:    1---2
         /|   |
        / |   |
       0  |   3
        \ |  /
         \| /
          4

Color with minimum colors so adjacent vertices
have different colors

Solution (3 colors):
0: Red
1: Blue
2: Green
3: Red
4: Green

Try colors, backtrack on conflict
```

| Complexity | Value  |
| ---------- | ------ |
| **Time**   | O(m^n) |
| **Space**  | O(n)   |

> m = colors, n = vertices

**Chromatic number:** Minimum colors needed

---

## Mathematical Algorithms

### Greatest Common Divisor (GCD) - Euclidean Algorithm

**Visual:**

```
GCD(48, 18):

48 = 18 × 2 + 12
18 = 12 × 1 + 6
12 = 6 × 2 + 0

GCD(48, 18) = 6

Repeatedly: gcd(a,b) = gcd(b, a mod b)
Until b = 0, then gcd = a
```

| Complexity | Value                              |
| ---------- | ---------------------------------- |
| **Time**   | O(log min(a,b))                    |
| **Space**  | O(1) iterative, O(log n) recursive |

**Extended Euclidean:**
Also finds x, y such that ax + by = gcd(a,b)

---

### Prime Number Algorithms

#### Sieve of Eratosthenes

**Visual:**

```
Find all primes ≤ 30:

2  3  4  5  6  7  8  9  10
11 12 13 14 15 16 17 18 19
20 21 22 23 24 25 26 27 28
29 30

Mark multiples of 2: 4,6,8,10,12...
Mark multiples of 3: 9,15,21,27...
Mark multiples of 5: 25...
...

Unmarked numbers are prime
```

| Complexity | Value          |
| ---------- | -------------- |
| **Time**   | O(n log log n) |
| **Space**  | O(n)           |

**Optimizations:**

- Only check up to √n
- Start marking from p²

---

#### Miller-Rabin Primality Test

**Visual:**

```
Probabilistic test for primality

Test n:
1. Write n-1 = 2^r × d (d odd)
2. Pick random a in [2, n-2]
3. Compute x = a^d mod n
4. If x = 1 or x = n-1, probably prime
5. Repeat r-1 times: x = x² mod n
6. If x = n-1, probably prime

Multiple rounds reduce error probability
```

| Complexity | k rounds    |
| ---------- | ----------- |
| **Time**   | O(k log³ n) |
| **Error**  | ≤ 4^(-k)    |

**Use Case:**
Fast primality testing for large numbers

---

### Fast Exponentiation (Exponentiation by Squaring)

**Visual:**

```
Compute 3^10:

3^10 = (3^5)²
3^5 = 3 × (3^2)²
3^2 = (3^1)²
3^1 = 3

Binary representation of 10: 1010
Result = 3^8 × 3^2 = 6561 × 9 = 59049

Only log(n) multiplications instead of n
```

| Complexity | Value          |
| ---------- | -------------- |
| **Time**   | O(log n)       |
| **Space**  | O(1) iterative |

**Applications:**

- Modular exponentiation (cryptography)
- Matrix exponentiation
- Computing large powers

---

### Matrix Exponentiation

**Visual:**

```
Fibonacci using matrix exponentiation:

[F(n+1)]   [1 1]^n   [1]
[F(n)  ] = [1 0]   × [0]

Compute matrix power in O(log n) using
exponentiation by squaring

Useful for linear recurrences
```

| Complexity | Value       |
| ---------- | ----------- |
| **Time**   | O(k³ log n) |
| **Space**  | O(k²)       |

> k = matrix dimension

---

### Catalan Numbers

**Visual:**

```
C(n) = number of valid parenthesizations

C(0) = 1: ""
C(1) = 1: "()"
C(2) = 2: "(())", "()()"
C(3) = 5: "((()))", "(()())", "(())()", "()(())", "()()()"

Formula: C(n) = (2n)! / ((n+1)! × n!)
Recurrence: C(n) = Σ C(i)×C(n-1-i) for i=0 to n-1
```

| Computation        | Time  |
| ------------------ | ----- |
| **DP**             | O(n²) |
| **Direct formula** | O(n)  |

**Applications:**

- Valid parentheses
- Binary trees count
- Path counting
- Polygon triangulation

---

## Bit Manipulation

### Basic Operations

**Visual:**

```
Number: 13 = 1101 (binary)

Set bit i:      13 | (1 << i)
Clear bit i:    13 & ~(1 << i)
Toggle bit i:   13 ^ (1 << i)
Check bit i:    (13 >> i) & 1
Clear LSB:      13 & (13-1)
Isolate LSB:    13 & -13

XOR properties:
a ^ a = 0
a ^ 0 = a
a ^ b ^ b = a
```

| Operation   | Time |
| ----------- | ---- |
| All bit ops | O(1) |

---

### Count Set Bits (Brian Kernighan's Algorithm)

**Visual:**

```
Count 1s in 13 (1101):

n = 1101
n-1 = 1100
n & (n-1) = 1100 (cleared rightmost 1)

n = 1100
n-1 = 1011
n & (n-1) = 1000

n = 1000
n-1 = 0111
n & (n-1) = 0000

3 iterations = 3 set bits
```

| Complexity | Value                 |
| ---------- | --------------------- |
| **Time**   | O(number of set bits) |
| **Space**  | O(1)                  |

---

### Power of Two Check

**Visual:**

```
Power of 2: exactly one bit set

8 = 1000
7 = 0111
8 & 7 = 0000 ✓

13 = 1101
12 = 1100
13 & 12 = 1100 ✗

if (n & (n-1)) == 0 and n != 0:
    n is power of 2
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(1)  |

---

### Find Single Number (XOR)

**Visual:**

```
Array: [2, 3, 4, 2, 3]
Every element appears twice except one

XOR all elements:
2 ^ 3 ^ 4 ^ 2 ^ 3
= (2 ^ 2) ^ (3 ^ 3) ^ 4
= 0 ^ 0 ^ 4
= 4

XOR cancels out pairs!
```

| Complexity | Value |
| ---------- | ----- |
| **Time**   | O(n)  |
| **Space**  | O(1)  |

---

### Subset Generation

**Visual:**

```
Set: {a, b, c}
Subsets: Use bits to represent inclusion

000 = {}
001 = {c}
010 = {b}
011 = {b, c}
100 = {a}
101 = {a, c}
110 = {a, b}
111 = {a, b, c}

For each number 0 to 2^n-1, check bits
```

| Complexity | Value      |
| ---------- | ---------- |
| **Time**   | O(n × 2^n) |
| **Space**  | O(1)       |

---

## Quick Reference

### Time Complexity Hierarchy

```
O(1)         ⚡ Constant      - Best
O(log n)     🚀 Logarithmic   - Excellent  
O(n)         ✅ Linear        - Good
O(n log n)   👍 Linearithmic  - Decent
O(n²)        ⚠️  Quadratic     - Bad
O(n³)        🐌 Cubic         - Worse
O(2^n)       🔥 Exponential   - Horrible
O(n!)        💀 Factorial     - Avoid!
```

---

### Algorithm Selection Guide

#### Searching

| Scenario                      | Algorithm            | Time             |
| ----------------------------- | -------------------- | ---------------- |
| Unsorted small array          | Linear Search        | O(n)             |
| Sorted array                  | Binary Search        | O(log n)         |
| Sorted + uniform distribution | Interpolation Search | O(log log n) avg |
| Unbounded sorted              | Exponential Search   | O(log n)         |

#### Sorting

| Scenario              | Algorithm           | Time       | Space         |
| --------------------- | ------------------- | ---------- | ------------- |
| General purpose       | Merge/Quick Sort    | O(n log n) | O(n)/O(log n) |
| Stable required       | Merge Sort          | O(n log n) | O(n)          |
| In-place required     | Quick/Heap Sort     | O(n log n) | O(log n)/O(1) |
| Nearly sorted         | Insertion/Tim Sort  | O(n) best  | O(1)/O(n)     |
| Small dataset         | Insertion Sort      | O(n²)      | O(1)          |
| Integer keys in range | Counting/Radix Sort | O(n+k)     | O(k)          |

#### Graph Problems

| Problem                           | Algorithm       | Time          |
| --------------------------------- | --------------- | ------------- |
| Shortest path (unweighted)        | BFS             | O(V+E)        |
| Shortest path (weighted, non-neg) | Dijkstra        | O((V+E)log V) |
| Shortest path (negative weights)  | Bellman-Ford    | O(VE)         |
| All-pairs shortest path           | Floyd-Warshall  | O(V³)         |
| Minimum spanning tree             | Prim/Kruskal    | O(E log V)    |
| Topological sort                  | DFS/Kahn's      | O(V+E)        |
| Strongly connected components     | Tarjan/Kosaraju | O(V+E)        |

#### String Problems

| Problem                    | Algorithm    | Time     |
| -------------------------- | ------------ | -------- |
| Pattern matching           | KMP          | O(n+m)   |
| Multiple pattern matching  | Aho-Corasick | O(n+m+z) |
| Longest common subsequence | DP           | O(nm)    |
| Edit distance              | DP           | O(nm)    |
| Longest palindrome         | Manacher     | O(n)     |

#### Optimization Problems

| Type                               | Approach            |
| ---------------------------------- | ------------------- |
| Optimal substructure + overlapping | Dynamic Programming |
| Greedy choice property             | Greedy Algorithm    |
| Explore all possibilities          | Backtracking        |
| Partition problem                  | Divide and Conquer  |

---

### Common Algorithm Patterns

**Sliding Window:**

- Two pointers moving in same direction
- Maintain window with certain property
- O(n) time for many problems

**Two Pointers:**

- One/both ends moving toward each other
- Sorted array problems
- O(n) time

**Fast & Slow Pointers:**

- Detect cycles
- Find middle element
- O(n) time

**Divide and Conquer:**

- Break into subproblems
- Solve recursively
- Combine solutions
- Often O(n log n)

**Dynamic Programming:**

- Optimal substructure
- Overlapping subproblems
- Memoization or tabulation
- Polynomial time for many NP problems

**Greedy:**

- Make locally optimal choice
- Hope for global optimum
- Fast but not always correct

**Backtracking:**

- Explore all possibilities
- Prune invalid branches
- Exponential time typically

---

### Master Theorem for Divide and Conquer

For recurrence: **T(n) = aT(n/b) + f(n)**

| Case  | Condition                  | Result                     |
| ----- | -------------------------- | -------------------------- |
| **1** | f(n) = O(n^(log_b(a) - ε)) | T(n) = Θ(n^log_b(a))       |
| **2** | f(n) = Θ(n^log_b(a))       | T(n) = Θ(n^log_b(a) log n) |
| **3** | f(n) = Ω(n^(log_b(a) + ε)) | T(n) = Θ(f(n))             |

**Examples:**

- Binary Search: T(n) = T(n/2) + O(1) → O(log n)
- Merge Sort: T(n) = 2T(n/2) + O(n) → O(n log n)
- Binary Tree: T(n) = 2T(n/2) + O(1) → O(n)

---

### Space-Time Tradeoffs

| More Space       | Get Better Time                     |
| ---------------- | ----------------------------------- |
| Hash table       | O(1) lookup vs O(n)                 |
| Memoization      | O(1) lookup vs O(2^n) recalculation |
| Auxiliary arrays | O(n log n) sort vs O(n²) in-place   |
| Preprocessing    | O(1) query vs O(n) search           |

**Choose based on constraints:**

- Space abundant → Optimize time
- Space limited → Accept slower time
- Balance both for production systems

---

### Key Takeaways

1. **Binary Search:** O(log n) on sorted data, always prefer over linear
2. **Hash Tables:** O(1) average for lookups, use when order doesn't matter
3. **Quick Sort:** O(n log n) average, best general-purpose in-place sort
4. **Merge Sort:** O(n log n) guaranteed, stable, use when stability matters
5. **BFS:** Shortest path in unweighted graphs, level-order
6. **DFS:** Explore deeply, detect cycles, topological sort
7. **Dijkstra:** Shortest path with non-negative weights
8. **DP:** Optimal substructure + overlapping subproblems
9. **Greedy:** Fast but verify correctness, not always optimal
10. **Backtracking:** When you need all solutions or exact answer

---

**Made with ❤️ for CS students**  
*Algorithms Only - No Data Structures*  
*Last Updated: 2026*