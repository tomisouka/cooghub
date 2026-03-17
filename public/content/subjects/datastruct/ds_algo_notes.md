# DSA Cheat Sheet

## Core Concepts

### Data Structure

- The container that holds data
- Examples: Array, Linked List, Hash Set, Stack, Queue, Tree, Graph

### ADT (Abstract Data Type)

- The operations/interface you can perform
- Examples: Insert, Delete, Search, Push, Pop, Enqueue, Dequeue

### Algorithm

- Step-by-step procedure to solve a problem
- Formal definition: Input → Steps → Output → Terminates
- DSA context: Named, classic algorithms
- Examples: Binary Search, MergeSort, QuickSort, DFS, BFS, Dijkstra's

### Pattern/Technique

- Common approach to solve problems
- Examples: Two pointers, Sliding window, Hash lookup, Prefix sum
- NOT a named algorithm, just a useful trick

---

## Quick Test: What Am I Looking At?

| You see...                              | It's a...                  |
| --------------------------------------- | -------------------------- |
| "I'm using a hash set"                  | Data Structure             |
| "I'm calling `.insert()` and `.find()`" | ADT Operations             |
| "I'm doing Binary Search"               | Algorithm (classic, named) |
| "I'm looping and counting"              | Pattern/Technique          |

---

## Example: Jewels in Stones Problem

```cpp
unordered_set<char> jewelSet(jewels.begin(), jewels.end());
for (char stone : stones) {
    if (jewelSet.find(stone) != jewelSet.end()) {
        count++;
    }
}
```

**Breakdown:**

- Data Structure: Hash Set (`unordered_set`)
- ADT Operations: Insert (construction), Find (lookup)
- Algorithm: None (too trivial to be named)
- Pattern: Hash-based membership testing for O(1) lookups

---

## Key Distinctions

### Trivial (Too Simple for Names)

- Loop and count
- Find max in array
- Simple hash lookups

### Classic Algorithms (The Big Names)

- Binary Search
- MergeSort, QuickSort, HeapSort
- DFS, BFS
- Dijkstra's, Prim's, Kruskal's
- Dynamic Programming (Knapsack, LCS, etc.)

### Advanced/Complex

- Suffix arrays
- Network flow algorithms
- Advanced graph algorithms

---

## Remember

**Not everything is an algorithm!**
Sometimes you're just using the right data structure to solve a problem efficiently.

When studying DSA:

1. Learn **data structures** (how to organize data)
2. Learn **classic algorithms** (proven methods to solve problems)
3. Practice **problems** (apply data structures + algorithms + patterns)
