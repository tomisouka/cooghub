# 🎯 Algorithm ↔ Data Structure Compatibility Guide

> Quick reference: Which algorithms work with which data structures

---

## 📊 ARRAYS & ARRAY-BASED STRUCTURES

**Compatible Algorithms:**
- ✅ **Binary Search** (must be sorted)
- ✅ **Linear Search**
- ✅ **All Sorting Algorithms:**
  - Bubble Sort, Selection Sort, Insertion Sort, Shell Sort
  - Merge Sort, Quick Sort, Heap Sort
  - Counting Sort, Radix Sort, Bucket Sort
- ✅ **Quickselect** (kth element selection)
- ✅ **Two Pointers** technique
- ✅ **Sliding Window** technique

**Cannot Use:**
- ❌ Graph traversal (BFS, DFS) - need graph structure
- ❌ Tree traversals - need tree structure
- ❌ Heap operations directly - need heap structure

---

## 🔗 LINKED LISTS

**Compatible Algorithms:**
- ✅ **Linear Search**
- ✅ **Merge Sort** (efficient for linked lists!)
- ✅ **Insertion Sort**
- ✅ **Two Pointers** (fast/slow pointer technique)
- ✅ **Cycle Detection** (Floyd's algorithm)

**Cannot Use:**
- ❌ Binary Search - no random access
- ❌ Quick Sort - inefficient without random access
- ❌ Heap Sort - requires array structure
- ❌ Bucket/Radix/Counting Sort - require array indexing
- ❌ Quickselect - needs random access

---

## #️⃣ HASH TABLES

**Compatible Algorithms:**
- ✅ **Direct lookup/search** (O(1) average)
- ✅ **Frequency counting**
- ✅ **Two Sum** and similar pairing problems
- ✅ **Caching/Memoization** for DP

**Cannot Use:**
- ❌ Binary Search - unordered structure
- ❌ Sorting algorithms - hash tables don't maintain order
- ❌ Tree/Graph traversals - different structure
- ❌ Range queries - no ordering

---

## 🏗️ HEAPS (BINARY HEAP)

**Compatible Algorithms:**
- ✅ **Heap Sort**
- ✅ **Dijkstra's Shortest Path** (with priority queue)
- ✅ **Prim's MST** (with priority queue)
- ✅ **Huffman Coding** (build tree)
- ✅ **Top-K problems** (min/max heap)
- ✅ **Median maintenance** (two heap technique)

**Cannot Use:**
- ❌ Binary Search - heap is not fully sorted
- ❌ Quick Sort, Merge Sort - designed for arrays
- ❌ Graph traversal (BFS/DFS) - need adjacency structure

---

## 🧱 STACKS

**Compatible Algorithms:**
- ✅ **DFS** (Depth-First Search)
- ✅ **Expression evaluation** (infix/postfix)
- ✅ **Backtracking algorithms**
- ✅ **Parentheses matching**
- ✅ **Tree traversals** (iterative DFS)

**Cannot Use:**
- ❌ BFS - requires queue
- ❌ Sorting algorithms - stacks are LIFO only
- ❌ Binary Search - no random access
- ❌ Dijkstra's - requires priority queue

---

## 🧱 QUEUES

**Compatible Algorithms:**
- ✅ **BFS** (Breadth-First Search)
- ✅ **Level-order tree traversal**
- ✅ **Topological Sort** (Kahn's algorithm)
- ✅ **Sliding window** (with deque)
- ✅ **Cache algorithms** (LRU with deque)

**Cannot Use:**
- ❌ DFS - requires stack
- ❌ Sorting algorithms - queues are FIFO only
- ❌ Binary Search - no random access
- ❌ Tree traversals (except level-order)

---

## 🌳 BINARY SEARCH TREES (BST)

**Compatible Algorithms:**
- ✅ **Binary Search** (on sorted traversal)
- ✅ **In-order/Pre-order/Post-order Traversals**
- ✅ **DFS** variants
- ✅ **Range queries**
- ✅ **Floor/Ceiling operations**
- ✅ **Kth smallest/largest element**

**Cannot Use:**
- ❌ BFS directly - use level-order instead
- ❌ Array-based sorting - need to extract to array first
- ❌ Heap operations - different structure

---

## 🌲 AVL TREES / RED-BLACK TREES

**Compatible Algorithms:**
- ✅ **All BST algorithms** (search, traversals, range queries)
- ✅ **Self-balancing operations** (rotations)
- ✅ **Ordered set operations**

**Cannot Use:**
- ❌ Same restrictions as BST
- ❌ Simple sorting algorithms - designed for arrays

---

## 🌴 B-TREES

**Compatible Algorithms:**
- ✅ **Binary Search** (within nodes)
- ✅ **Range queries**
- ✅ **Database indexing operations**
- ✅ **Bulk loading**

**Cannot Use:**
- ❌ Standard tree traversals - different structure
- ❌ Array sorting algorithms
- ❌ Graph algorithms

---

## 🌿 TRIES

**Compatible Algorithms:**
- ✅ **Prefix search/matching**
- ✅ **Autocomplete**
- ✅ **Dictionary lookups**
- ✅ **DFS** (for traversal)
- ✅ **Longest common prefix**

**Cannot Use:**
- ❌ Binary Search - not a binary structure
- ❌ Sorting algorithms - different purpose
- ❌ Heap operations
- ❌ Standard graph algorithms

---

## 🌐 GRAPHS

### Graph Traversal Algorithms

**BFS (Breadth-First Search):**
- ✅ Works with: Adjacency List, Adjacency Matrix
- ✅ Use cases: Shortest path (unweighted), level-order traversal
- 🔧 Requires: Queue

**DFS (Depth-First Search):**
- ✅ Works with: Adjacency List, Adjacency Matrix
- ✅ Use cases: Cycle detection, topological sort, connectivity
- 🔧 Requires: Stack (or recursion)

### Shortest Path Algorithms

**Dijkstra's Algorithm:**
- ✅ Works with: Adjacency List (preferred), Adjacency Matrix
- ✅ Graph type: Non-negative weights
- 🔧 Requires: Priority Queue (min-heap)

**Bellman-Ford:**
- ✅ Works with: Adjacency List, Edge List
- ✅ Graph type: Negative weights allowed
- 🔧 Requires: Array for distances

**Floyd-Warshall:**
- ✅ Works with: Adjacency Matrix (preferred)
- ✅ Graph type: All pairs shortest path
- 🔧 Requires: 2D array

### Minimum Spanning Tree

**Kruskal's Algorithm:**
- ✅ Works with: Edge List (preferred)
- 🔧 Requires: Union-Find (Disjoint Set)

**Prim's Algorithm:**
- ✅ Works with: Adjacency List (preferred), Adjacency Matrix
- 🔧 Requires: Priority Queue

### Topological Sort

**DFS-based:**
- ✅ Works with: Adjacency List, Adjacency Matrix
- 🔧 Requires: Stack, visited array

**Kahn's Algorithm:**
- ✅ Works with: Adjacency List
- 🔧 Requires: Queue, in-degree array

---

## 🎲 SPECIAL COMPATIBILITY NOTES

### ✨ Arrays are Super Versatile
Arrays support the MOST algorithms:
- All searching algorithms
- All sorting algorithms  
- Can be converted to heaps, stacks, queues
- Foundation for many other structures

### 🔄 Sorting Algorithm Requirements

**REQUIRE SORTED INPUT:**
- Binary Search ⚠️

**REQUIRE ARRAY STRUCTURE:**
- Quick Sort (needs random access)
- Heap Sort (uses array-based heap)
- Counting/Radix/Bucket Sort (need indexing)

**WORK WELL WITH LINKED LISTS:**
- Merge Sort ⭐ (actually better than on arrays!)
- Insertion Sort

**WORK WITH ANY COMPARABLE DATA:**
- Bubble Sort, Selection Sort
- Quick Sort, Merge Sort, Heap Sort

### 🔗 Graph Representation Matters

**Adjacency Matrix** → Best for:
- Dense graphs
- Floyd-Warshall
- Checking if edge exists: O(1)

**Adjacency List** → Best for:
- Sparse graphs
- Dijkstra's, BFS, DFS
- Iterating neighbors efficiently

**Edge List** → Best for:
- Kruskal's MST
- Bellman-Ford
- When you just need edges

---

## 🎯 QUICK DECISION TREE

**Need to search sorted data?**
- Array → Binary Search ✅
- BST → Tree search ✅
- Hash Table → Direct lookup ✅
- Linked List → Must use Linear Search ⚠️

**Need to sort data?**
- Have array → Any sorting algorithm ✅
- Have linked list → Merge Sort or Insertion Sort ✅
- Have BST → In-order traversal gives sorted output ✅

**Need shortest path?**
- Unweighted graph → BFS ✅
- Weighted (non-negative) → Dijkstra's ✅
- Weighted (negative edges) → Bellman-Ford ✅
- All pairs → Floyd-Warshall ✅

**Need to traverse?**
- Tree → DFS or BFS (level-order) ✅
- Graph → DFS or BFS ✅
- Array → Simple iteration ✅
- Linked List → Sequential traversal ✅

---

## 💡 KEY COMPATIBILITY RULES

1. **Arrays are kings of flexibility** - support almost all algorithms
2. **Linked lists lose random access** - no binary search, inefficient quicksort
3. **Hash tables trade order for speed** - no sorting, no binary search
4. **Trees need tree algorithms** - can't use array-based sorts directly
5. **Graphs need graph algorithms** - specialized traversal methods
6. **Heaps are for priority** - not general sorting (except heap sort)
7. **Stacks = DFS, Queues = BFS** - natural pairing

---

**🎓 Pro Tip:** When choosing an algorithm, first identify your data structure's capabilities:
- Random access? → Can use binary search, quicksort
- Ordered? → Can use binary search, range queries  
- Priority-based? → Use heap algorithms
- Relationship-based? → Use graph algorithms

---

*Quick reference for your DSA journey* 🚀