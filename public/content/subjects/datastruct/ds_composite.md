# Pure vs Composite Data Structures

## Definition

### Pure Structure
Uses **ONE type** of basic structure (can use multiple instances of it)

### Composite Structure
Combines **DIFFERENT types** of basic structures

---

## The Logic

**Pure:** Same tool (possibly multiple times)
```
Array + Array = Pure
Linked List + Linked List = Pure
```

**Composite:** Different tools combined
```
Array + Linked List = Composite
Array + Tree = Composite
```

---

## Examples

### Pure Structures ✅

**Array**
```cpp
int arr[100];  // Just array
```

**Linked List**
```cpp
Node* head;  // Just nodes with pointers
```

**Heap**
```cpp
int* arr;  // Just one array
```

**Disjoint Set**
```cpp
int* parent;  // Array #1
int* rank;    // Array #2
// Two arrays, but BOTH are arrays → Pure
```

**Graph (Adjacency Matrix)**
```cpp
int** adjMatrix;  // 2D array (still just array)
```

---

### Composite Structures ❌

**Hash Table**
```cpp
int* table;           // Array
LinkedList* buckets;  // + Linked Lists
// Array + Linked List → Composite
```

**Graph (Adjacency List)**
```cpp
vector<int>* adjList;  // Array of vectors/lists
// Array + Lists → Composite
```

---

## Analogy

**Pure:** "I used 2 hammers"
- Same type of tool
- Disjoint Set uses 2 arrays

**Composite:** "I used a hammer and a screwdriver"
- Different types of tools
- Hash Table uses array AND linked lists

---

## Quick Test

| Structure | What It Uses | Type |
|-----------|-------------|------|
| Array | Array | Pure |
| Heap | Array | Pure |
| Disjoint Set | Array + Array | Pure ✅ |
| Binary Tree | Nodes + Pointers | Pure |
| Hash Table | Array + Linked Lists | Composite ❌ |
| Graph (Adj List) | Array + Lists | Composite ❌ |

---

## Bottom Line

**If it only uses ONE type of basic structure (even multiple instances), it's PURE.**

**If it combines DIFFERENT types of structures, it's COMPOSITE.**
