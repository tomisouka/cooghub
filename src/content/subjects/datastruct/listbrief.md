# 📊 Data Structures & Algorithms Complexity Cheat Sheet

> A comprehensive guide to time and space complexity for common data structures and algorithms

---

## 📋 Table of Contents

- [Array-Based Structures](#array-based-structures)
- [Linked Lists](#linked-lists)
- [Searching Algorithms](#searching-algorithms)
- [Sorting Algorithms](#sorting-algorithms)
- [Heaps](#heaps)
- [Stacks & Queues](#stacks--queues)
- [Hash Tables](#hash-tables)
- [Trees](#trees)
- [Balanced Trees](#balanced-trees)
- [B-Trees](#b-trees)
- [Graph Algorithms](#graph-algorithms)
- [Advanced Algorithms](#advanced-algorithms)

---

## 📦 Array-Based Structures

### Dynamic Array (ArrayList)

| Operation       | Average Case | Worst Case | Space |
| --------------- | ------------ | ---------- | ----- |
| Access          | O(1)         | O(1)       | O(n)  |
| Search          | O(n)         | O(n)       | O(1)  |
| Insert (end)    | O(1)*        | O(n)       | O(1)  |
| Insert (middle) | O(n)         | O(n)       | O(1)  |
| Delete (end)    | O(1)         | O(1)       | O(1)  |
| Delete (middle) | O(n)         | O(n)       | O(1)  |

*Amortized time complexity

---

## 🔗 Linked Lists

### Singly-Linked List

| Operation       | Average Case | Worst Case | Space |
| --------------- | ------------ | ---------- | ----- |
| Access          | O(n)         | O(n)       | O(n)  |
| Search          | O(n)         | O(n)       | O(1)  |
| Insert (head)   | O(1)         | O(1)       | O(1)  |
| Insert (tail)   | O(n)         | O(n)       | O(1)  |
| Insert (middle) | O(n)         | O(n)       | O(1)  |
| Delete (head)   | O(1)         | O(1)       | O(1)  |
| Delete (tail)   | O(n)         | O(n)       | O(1)  |
| Delete (middle) | O(n)         | O(n)       | O(1)  |

### Doubly-Linked List

| Operation          | Average Case | Worst Case | Space |
| ------------------ | ------------ | ---------- | ----- |
| Access             | O(n)         | O(n)       | O(n)  |
| Search             | O(n)         | O(n)       | O(1)  |
| Insert (head/tail) | O(1)         | O(1)       | O(1)  |
| Insert (middle)    | O(n)         | O(n)       | O(1)  |
| Delete (head/tail) | O(1)         | O(1)       | O(1)  |
| Delete (middle)    | O(n)         | O(n)       | O(1)  |

---

## 🔍 Searching Algorithms

| Algorithm                     | Best Case | Average Case | Worst Case | Space    |
| ----------------------------- | --------- | ------------ | ---------- | -------- |
| **Linear Search**             | O(1)      | O(n)         | O(n)       | O(1)     |
| **Binary Search**             | O(1)      | O(log n)     | O(log n)   | O(1)     |
| **Binary Search (Recursive)** | O(1)      | O(log n)     | O(log n)   | O(log n) |

> **Note:** Binary search requires a sorted array

---

## 🔃 Sorting Algorithms

### Comparison-Based Sorts

| Algorithm          | Best Case  | Average Case | Worst Case | Space    | Stable |
| ------------------ | ---------- | ------------ | ---------- | -------- | ------ |
| **Bubble Sort**    | O(n)       | O(n²)        | O(n²)      | O(1)     | ✅      |
| **Selection Sort** | O(n²)      | O(n²)        | O(n²)      | O(1)     | ❌      |
| **Insertion Sort** | O(n)       | O(n²)        | O(n²)      | O(1)     | ✅      |
| **Shell Sort**     | O(n log n) | O(n^1.5)     | O(n²)      | O(1)     | ❌      |
| **Merge Sort**     | O(n log n) | O(n log n)   | O(n log n) | O(n)     | ✅      |
| **Quick Sort**     | O(n log n) | O(n log n)   | O(n²)      | O(log n) | ❌      |
| **Heap Sort**      | O(n log n) | O(n log n)   | O(n log n) | O(1)     | ❌      |

### Non-Comparison Sorts

| Algorithm         | Best Case | Average Case | Worst Case | Space    | Stable |
| ----------------- | --------- | ------------ | ---------- | -------- | ------ |
| **Bucket Sort**   | O(n + k)  | O(n + k)     | O(n²)      | O(n + k) | ✅      |
| **Radix Sort**    | O(nk)     | O(nk)        | O(nk)      | O(n + k) | ✅      |
| **Counting Sort** | O(n + k)  | O(n + k)     | O(n + k)   | O(k)     | ✅      |

> **Legend:** k = number of buckets/range, n = number of elements

### Special Selection Algorithm

| Algorithm       | Best Case | Average Case | Worst Case | Space |
| --------------- | --------- | ------------ | ---------- | ----- |
| **Quickselect** | O(n)      | O(n)         | O(n²)      | O(1)  |

---

## 🏗️ Heaps

### Binary Heap (Min/Max)

| Operation      | Average Case | Worst Case | Space |
| -------------- | ------------ | ---------- | ----- |
| Find Min/Max   | O(1)         | O(1)       | O(n)  |
| Insert         | O(log n)     | O(log n)   | O(1)  |
| Delete Min/Max | O(log n)     | O(log n)   | O(1)  |
| Build Heap     | O(n)         | O(n)       | O(1)  |
| Heapify        | O(log n)     | O(log n)   | O(1)  |

### Priority Queue (using Heap)

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Enqueue   | O(log n)     | O(log n)   | O(n)  |
| Dequeue   | O(log n)     | O(log n)   | O(1)  |
| Peek      | O(1)         | O(1)       | O(1)  |

### Treap

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Search    | O(log n)     | O(n)       | O(n)  |
| Insert    | O(log n)     | O(n)       | O(1)  |
| Delete    | O(log n)     | O(n)       | O(1)  |

---

## 🧱 Stacks & Queues

### Stack (Array or Linked List)

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Push      | O(1)         | O(1)       | O(n)  |
| Pop       | O(1)         | O(1)       | O(1)  |
| Peek      | O(1)         | O(1)       | O(1)  |
| Search    | O(n)         | O(n)       | O(1)  |

### Queue (Array or Linked List)

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Enqueue   | O(1)         | O(1)       | O(n)  |
| Dequeue   | O(1)         | O(1)       | O(1)  |
| Peek      | O(1)         | O(1)       | O(1)  |
| Search    | O(n)         | O(n)       | O(1)  |

### Deque (Double-Ended Queue)

| Operation       | Average Case | Worst Case | Space |
| --------------- | ------------ | ---------- | ----- |
| Insert Front    | O(1)         | O(1)       | O(n)  |
| Insert Rear     | O(1)         | O(1)       | O(1)  |
| Delete Front    | O(1)         | O(1)       | O(1)  |
| Delete Rear     | O(1)         | O(1)       | O(1)  |
| Peek Front/Rear | O(1)         | O(1)       | O(1)  |

---

## #️⃣ Hash Tables

### Hash Map / Hash Set

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Search    | O(1)         | O(n)       | O(n)  |
| Insert    | O(1)         | O(n)       | O(1)  |
| Delete    | O(1)         | O(n)       | O(1)  |

### Collision Resolution Methods

| Method                | Average Search | Worst Search | Space Overhead |
| --------------------- | -------------- | ------------ | -------------- |
| **Chaining**          | O(1 + α)       | O(n)         | O(n)           |
| **Linear Probing**    | O(1 + 1/(1-α)) | O(n)         | O(m)           |
| **Quadratic Probing** | O(1 + 1/(1-α)) | O(n)         | O(m)           |
| **Double Hashing**    | O(1 + 1/(1-α)) | O(n)         | O(m)           |

> **Note:** α = load factor (n/m), m = table size, n = number of elements

---

## 🌳 Trees

### Binary Search Tree (Unbalanced)

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Search    | O(log n)     | O(n)       | O(n)  |
| Insert    | O(log n)     | O(n)       | O(1)  |
| Delete    | O(log n)     | O(n)       | O(1)  |
| Traversal | O(n)         | O(n)       | O(h)* |

*h = height of tree (space for recursion stack)

### Binary Tree Traversals

| Traversal             | Time Complexity | Space Complexity |
| --------------------- | --------------- | ---------------- |
| **Inorder**           | O(n)            | O(h)             |
| **Preorder**          | O(n)            | O(h)             |
| **Postorder**         | O(n)            | O(h)             |
| **Level Order (BFS)** | O(n)            | O(w)**           |

**w = maximum width of tree

### Trie (Prefix Tree)

| Operation     | Time Complexity | Space Complexity         |
| ------------- | --------------- | ------------------------ |
| Search        | O(m)            | O(alphabet_size × n × m) |
| Insert        | O(m)            | O(m)                     |
| Delete        | O(m)            | O(1)                     |
| Prefix Search | O(m + k)        | O(1)                     |

> **Note:** m = length of word, k = number of matches, n = number of words

---

## 🌲 Balanced Trees

### AVL Tree

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Search    | O(log n)     | O(log n)   | O(n)  |
| Insert    | O(log n)     | O(log n)   | O(1)  |
| Delete    | O(log n)     | O(log n)   | O(1)  |
| Height    | O(log n)     | O(log n)   | -     |

### Red-Black Tree

| Operation | Average Case | Worst Case | Space |
| --------- | ------------ | ---------- | ----- |
| Search    | O(log n)     | O(log n)   | O(n)  |
| Insert    | O(log n)     | O(log n)   | O(1)  |
| Delete    | O(log n)     | O(log n)   | O(1)  |
| Height    | O(log n)     | O(log n)   | -     |

> **Guarantee:** Height ≤ 2log(n+1)

---

## 🌴 B-Trees

### B-Tree (including 2-3-4 Trees)

| Operation   | Time Complexity | Space Complexity |
| ----------- | --------------- | ---------------- |
| Search      | O(log n)        | O(n)             |
| Insert      | O(log n)        | O(1)             |
| Delete      | O(log n)        | O(1)             |
| Split Node  | O(t)            | O(1)             |
| Merge Nodes | O(t)            | O(1)             |

> **Note:** t = minimum degree of B-tree (2-3-4 tree is B-tree with t=2)

### Advantages

- **Disk-friendly:** Minimizes disk I/O operations
- **Height:** Guaranteed O(log n) with large branching factor
- **Database use:** Commonly used in database indexing

---

## 🌐 Graph Algorithms

### Graph Representations

| Representation       | Space    | Check Edge   | Iterate Neighbors |
| -------------------- | -------- | ------------ | ----------------- |
| **Adjacency Matrix** | O(V²)    | O(1)         | O(V)              |
| **Adjacency List**   | O(V + E) | O(degree(V)) | O(degree(V))      |

### Graph Traversal

| Algorithm                      | Time Complexity | Space Complexity |
| ------------------------------ | --------------- | ---------------- |
| **BFS (Breadth-First Search)** | O(V + E)        | O(V)             |
| **DFS (Depth-First Search)**   | O(V + E)        | O(V)             |

### Shortest Path Algorithms

| Algorithm              | Time Complexity  | Space | Use Case                 |
| ---------------------- | ---------------- | ----- | ------------------------ |
| **Dijkstra's**         | O((V + E) log V) | O(V)  | Non-negative weights     |
| **Dijkstra's (array)** | O(V²)            | O(V)  | Dense graphs             |
| **Bellman-Ford**       | O(VE)            | O(V)  | Negative weights allowed |
| **Floyd-Warshall**     | O(V³)            | O(V²) | All pairs shortest path  |

### Topological Sort

| Algorithm        | Time Complexity | Space Complexity |
| ---------------- | --------------- | ---------------- |
| **DFS-based**    | O(V + E)        | O(V)             |
| **Kahn's (BFS)** | O(V + E)        | O(V)             |

> **Requirement:** Directed Acyclic Graph (DAG)

### Minimum Spanning Tree

| Algorithm                   | Time Complexity          | Space Complexity |
| --------------------------- | ------------------------ | ---------------- |
| **Kruskal's**               | O(E log E) or O(E log V) | O(V)             |
| **Prim's (binary heap)**    | O((V + E) log V)         | O(V)             |
| **Prim's (Fibonacci heap)** | O(E + V log V)           | O(V)             |

---

## 🧠 Advanced Algorithms

### Huffman Compression

| Operation  | Time Complexity | Space Complexity |
| ---------- | --------------- | ---------------- |
| Build Tree | O(n log n)      | O(n)             |
| Encode     | O(n)            | O(n)             |
| Decode     | O(n)            | O(n)             |

> **Note:** n = number of unique characters

### Dynamic Programming

| Complexity | Description                                    |
| ---------- | ---------------------------------------------- |
| **Time**   | O(number of subproblems × time per subproblem) |
| **Space**  | O(size of memoization table)                   |

**Common Examples:**

| Problem                    | Time  | Space                 |
| -------------------------- | ----- | --------------------- |
| Fibonacci                  | O(n)  | O(n) or O(1)*         |
| 0/1 Knapsack               | O(nW) | O(nW) or O(W)*        |
| Longest Common Subsequence | O(mn) | O(mn) or O(min(m,n))* |
| Edit Distance              | O(mn) | O(mn) or O(min(m,n))* |

*with space optimization

### Greedy Algorithms

| Property        | Description                          |
| --------------- | ------------------------------------ |
| **Time**        | Varies by problem (often O(n log n)) |
| **Space**       | Usually O(1) to O(n)                 |
| **Key Feature** | Makes locally optimal choices        |

**Examples:**

- Activity Selection: O(n log n)
- Huffman Coding: O(n log n)
- Dijkstra's: O((V + E) log V)
- Prim's/Kruskal's: O(E log V)

---

## 📝 Quick Reference: Big-O Complexity Chart

```
O(1)         ⚡ Constant      - Best
O(log n)     🚀 Logarithmic   - Excellent
O(n)         ✅ Linear        - Good
O(n log n)   👍 Linearithmic  - Decent
O(n²)        ⚠️  Quadratic     - Bad
O(n³)        🐌 Cubic         - Worse
O(2ⁿ)        🔥 Exponential   - Horrible
O(n!)        💀 Factorial     - Avoid!
```

---

## 🎯 Complexity Classes Summary

| Class            | Growth Rate | Examples                                  |
| ---------------- | ----------- | ----------------------------------------- |
| **Constant**     | Best        | Array access, hash table lookup           |
| **Logarithmic**  | Excellent   | Binary search, balanced tree ops          |
| **Linear**       | Good        | Linear search, array traversal            |
| **Linearithmic** | Decent      | Merge sort, heap sort, efficient sorts    |
| **Quadratic**    | Poor        | Bubble sort, selection sort, nested loops |
| **Exponential**  | Very Poor   | Recursive fibonacci, brute force          |
| **Factorial**    | Worst       | Traveling salesman (brute force)          |

---

## 💡 Tips for Choosing Data Structures

### When to Use What

| Use Case                             | Recommended Structure | Why                           |
| ------------------------------------ | --------------------- | ----------------------------- |
| Fast lookup                          | Hash Table            | O(1) average search           |
| Ordered data                         | BST / Balanced Tree   | O(log n) operations           |
| LIFO operations                      | Stack                 | O(1) push/pop                 |
| FIFO operations                      | Queue                 | O(1) enqueue/dequeue          |
| Priority access                      | Heap / Priority Queue | O(log n) insert/delete        |
| Range queries                        | Segment Tree / BIT    | O(log n) updates/queries      |
| Prefix matching                      | Trie                  | O(m) where m = word length    |
| Many-to-many relations               | Graph                 | Model complex relationships   |
| Sorted data (frequent insert/delete) | Red-Black Tree        | Guaranteed O(log n)           |
| Database indexing                    | B-Tree                | Disk-friendly, shallow height |

---

## 🔑 Key Takeaways

1. **Arrays:** Fast access O(1), slow insert/delete O(n)
2. **Linked Lists:** Fast insert/delete at ends O(1), slow access O(n)
3. **Hash Tables:** Best average case O(1), but worst case O(n)
4. **BST:** Good average O(log n), degrades to O(n) if unbalanced
5. **Balanced Trees:** Guaranteed O(log n) for all operations
6. **Heaps:** Perfect for priority queues, O(log n) insert/delete
7. **Graphs:** BFS/DFS are O(V + E), choice depends on use case
8. **Sorting:** O(n log n) is optimal for comparison-based sorts

---

**Made with ❤️ for DSA learners**  
*Last Updated: 2026*