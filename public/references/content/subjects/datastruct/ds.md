# 📊 Data Structures Complexity Reference

> Comprehensive time and space complexity for all data structures

---

## 📑 Table of Contents

- [Array-Based Lists](#array-based-lists)
- [Linked Lists](#linked-lists)
- [Stacks](#stacks)
- [Queues](#queues)
- [Deques](#deques)
- [Hash Tables](#hash-tables)
- [Binary Trees](#binary-trees)
- [Binary Search Trees](#binary-search-trees)
- [Tries](#tries)
- [AVL Trees](#avl-trees)
- [Red-Black Trees](#red-black-trees)
- [Splay Trees](#splay-trees)
- [Heaps](#heaps)
- [Fibonacci Heaps](#fibonacci-heaps)
- [Treaps](#treaps)
- [Cartesian Trees](#cartesian-trees)
- [B-Trees](#b-trees)
- [2-3-4 Trees](#2-3-4-trees)
- [Skip Lists](#skip-lists)
- [Disjoint Set (Union-Find)](#disjoint-set-union-find)
- [Segment Trees](#segment-trees)
- [Fenwick Trees](#fenwick-trees-binary-indexed-tree)
- [Bloom Filters](#bloom-filters)
- [Graphs](#graphs)
- [Quick Reference](#quick-reference)

---

# 📊 DATA STRUCTURES

## Array-Based Lists

### Dynamic Array (ArrayList)

**Visual:**

```
Array: [10] [20] [30] [40] [50] [ ] [ ] [ ]
Index:   0    1    2    3    4   5   6   7
         ↑                        ↑
       Start                    End

Contiguous memory blocks
```

| Operation           | Best Case | Average Case | Worst Case | Space |
| ------------------- | --------- | ------------ | ---------- | ----- |
| Access by index     | O(1)      | O(1)         | O(1)       | O(n)  |
| Search (unsorted)   | O(1)      | O(n)         | O(n)       | O(1)  |
| Search (sorted)     | O(1)      | O(log n)     | O(log n)   | O(1)  |
| Insert at end       | O(1)      | O(1)*        | O(n)       | O(1)  |
| Insert at beginning | O(n)      | O(n)         | O(n)       | O(1)  |
| Insert at position  | O(n)      | O(n)         | O(n)       | O(1)  |
| Delete at end       | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at beginning | O(n)      | O(n)         | O(n)       | O(1)  |
| Delete at position  | O(n)      | O(n)         | O(n)       | O(1)  |

> *Amortized O(1) when using dynamic array with doubling strategy

**Characteristics:**

- Contiguous memory allocation
- Fast random access
- Slow insertion/deletion (requires shifting)
- Cache-friendly

---

## Linked Lists

### Singly-Linked List

**Visual:**

```
Head → [10|•]→[20|•]→[30|•]→[40|NULL]
        ↑                      ↑
      First                  Last

Each node: [data|next pointer]
```

| Operation          | Best Case | Average Case | Worst Case | Space |
| ------------------ | --------- | ------------ | ---------- | ----- |
| Access by index    | O(1)      | O(n)         | O(n)       | O(n)  |
| Search             | O(1)      | O(n)         | O(n)       | O(1)  |
| Insert at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Insert at tail     | O(1)*     | O(n)         | O(n)       | O(1)  |
| Insert at position | O(1)      | O(n)         | O(n)       | O(1)  |
| Delete at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at tail     | O(1)      | O(n)         | O(n)       | O(1)  |
| Delete at position | O(1)      | O(n)         | O(n)       | O(1)  |
| Traversal          | O(n)      | O(n)         | O(n)       | O(1)  |

> *O(1) if tail pointer is maintained

**Characteristics:**

- Non-contiguous memory
- No random access
- Fast insertion/deletion at ends
- Extra memory per node (pointer)

---

### Doubly-Linked List

**Visual:**

```
Head ⇄ [10] ⇄ [20] ⇄ [30] ⇄ [40] ⇄ Tail
       ↑  ↓   ↑  ↓   ↑  ↓   ↑  ↓
       prev   next   

Each node: [prev|data|next]
Bidirectional traversal
```

| Operation          | Best Case | Average Case | Worst Case | Space |
| ------------------ | --------- | ------------ | ---------- | ----- |
| Access by index    | O(1)      | O(n)         | O(n)       | O(n)  |
| Search             | O(1)      | O(n)         | O(n)       | O(1)  |
| Insert at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Insert at tail     | O(1)      | O(1)         | O(1)       | O(1)  |
| Insert at position | O(1)*     | O(n)         | O(n)       | O(1)  |
| Delete at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at tail     | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at position | O(1)*     | O(n)         | O(n)       | O(1)  |
| Reverse traversal  | O(n)      | O(n)         | O(n)       | O(1)  |

> *O(1) if you already have a pointer to the node  
> **Space overhead:** Doubly-linked lists use more memory per node (extra pointer)

**Advantages over singly-linked:**

- Bidirectional traversal
- O(1) deletion at tail
- Easier to delete a node with just a pointer to it

---

### Circular Lists

**Visual:**

```
     ┌──────────────────────┐
     ↓                      │
    [10]→[20]→[30]→[40]─────┘
     ↑
    Head (any node can be head)

Last node points back to first
```

| Operation          | Best Case | Average Case | Worst Case | Space |
| ------------------ | --------- | ------------ | ---------- | ----- |
| Access             | O(1)      | O(n)         | O(n)       | O(n)  |
| Search             | O(1)      | O(n)         | O(n)       | O(1)  |
| Insert at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Insert at tail     | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at head     | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete at tail     | O(1)*     | O(n)         | O(n)       | O(1)  |
| Complete traversal | O(n)      | O(n)         | O(n)       | O(1)  |

> *O(1) for circular doubly-linked, O(n) for circular singly-linked

**Use Cases:**

- Round-robin scheduling
- Circular buffers
- Game turn management
- Media playlists

---

## Stacks

### Array-Based Stack

**Visual:**

```
        Push →  [40] ← Pop
                [30]
                [20]
                [10]
                ────
               Bottom

LIFO: Last In, First Out
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Push      | O(1)      | O(1)*        | O(n)       | O(n)  |
| Pop       | O(1)      | O(1)         | O(1)       | O(1)  |
| Peek/Top  | O(1)      | O(1)         | O(1)       | O(1)  |
| Search    | O(1)      | O(n)         | O(n)       | O(1)  |
| Size      | O(1)      | O(1)         | O(1)       | O(1)  |
| isEmpty   | O(1)      | O(1)         | O(1)       | O(1)  |

> *Amortized O(1) with dynamic resizing

**Characteristics:**

- LIFO (Last In, First Out)
- Simple array implementation
- Cache-friendly
- May waste space or require resizing

---

### Linked List-Based Stack

**Visual:**

```
Top → [40|•]→[30|•]→[20|•]→[10|NULL]
       ↑                      ↓
      Push                  Bottom
      Pop

Push/Pop at head (O(1))
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Push      | O(1)      | O(1)         | O(1)       | O(n)  |
| Pop       | O(1)      | O(1)         | O(1)       | O(1)  |
| Peek/Top  | O(1)      | O(1)         | O(1)       | O(1)  |
| Search    | O(1)      | O(n)         | O(n)       | O(1)  |
| Size      | O(1)*     | O(1)*        | O(1)*      | O(1)  |
| isEmpty   | O(1)      | O(1)         | O(1)       | O(1)  |

> *O(1) if size counter is maintained, O(n) otherwise

**Advantages over array-based:**

- No resizing needed
- No wasted space
- Truly O(1) push operations

---

## Queues

### Linked List-Based Queue

**Visual:**

```
Front → [10|•]→[20|•]→[30|•]→[40|NULL] ← Rear
         ↑                              ↑
      Dequeue                       Enqueue

FIFO: First In, First Out
```

| Operation  | Best Case | Average Case | Worst Case | Space |
| ---------- | --------- | ------------ | ---------- | ----- |
| Enqueue    | O(1)      | O(1)         | O(1)       | O(n)  |
| Dequeue    | O(1)      | O(1)         | O(1)       | O(1)  |
| Front/Peek | O(1)      | O(1)         | O(1)       | O(1)  |
| Rear       | O(1)      | O(1)         | O(1)       | O(1)  |
| Search     | O(1)      | O(n)         | O(n)       | O(1)  |
| isEmpty    | O(1)      | O(1)         | O(1)       | O(1)  |

**Characteristics:**

- FIFO (First In, First Out)
- Requires head and tail pointers
- No wasted space

---

### Array-Based Queue (Circular)

**Visual:**

```
     ┌─────────────────┐
     │  [20][30][40]   │
     │  ↑         ↑    │
     │ Front    Rear   │
     └─────────────────┘

Circular buffer prevents shifting
Front and Rear wrap around
```

| Operation  | Best Case | Average Case | Worst Case | Space |
| ---------- | --------- | ------------ | ---------- | ----- |
| Enqueue    | O(1)      | O(1)*        | O(n)       | O(n)  |
| Dequeue    | O(1)      | O(1)         | O(1)       | O(1)  |
| Front/Peek | O(1)      | O(1)         | O(1)       | O(1)  |
| Rear       | O(1)      | O(1)         | O(1)       | O(1)  |
| Search     | O(1)      | O(n)         | O(n)       | O(1)  |
| isEmpty    | O(1)      | O(1)         | O(1)       | O(1)  |

> *Circular array implementation prevents need for shifting  
> Amortized O(1) with dynamic resizing

**Characteristics:**

- Cache-friendly
- Fixed or dynamic size
- Requires front and rear indices

---

## Deques

### Deque (Double-Ended Queue)

**Visual:**

```
Insert/Delete   ⇄   [10] ⇄ [20] ⇄ [30] ⇄ [40]   ⇄   Insert/Delete
    Front                                              Rear

Operations possible at both ends
```

| Operation    | Best Case | Average Case | Worst Case | Space |
| ------------ | --------- | ------------ | ---------- | ----- |
| Insert front | O(1)      | O(1)         | O(1)       | O(n)  |
| Insert rear  | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete front | O(1)      | O(1)         | O(1)       | O(1)  |
| Delete rear  | O(1)      | O(1)         | O(1)       | O(1)  |
| Peek front   | O(1)      | O(1)         | O(1)       | O(1)  |
| Peek rear    | O(1)      | O(1)         | O(1)       | O(1)  |
| Search       | O(1)      | O(n)         | O(n)       | O(1)  |

**Best Implemented Using:** Doubly-linked list or circular array

**Use Cases:**

- Implementing both stack and queue
- Palindrome checking
- Sliding window problems
- Undo/redo functionality

---

## Hash Tables

### Hash Table with Chaining

**Visual:**

```
Hash Table:
0: → [Alice,25] → NULL
1: → [Bob,30] → [Charlie,35] → NULL  (collision chain)
2: → NULL
3: → [David,40] → NULL
4: → [Eve,28] → NULL
...

Hash function maps keys to buckets
Collisions resolved with linked lists
```

| Operation | Best Case | Average Case | Worst Case | Space    |
| --------- | --------- | ------------ | ---------- | -------- |
| Search    | O(1)      | O(1 + α)     | O(n)       | O(n + m) |
| Insert    | O(1)      | O(1 + α)     | O(n)       | O(1)     |
| Delete    | O(1)      | O(1 + α)     | O(n)       | O(1)     |

> α = load factor = n/m (n = elements, m = table size)  
> Worst case occurs when all keys hash to same bucket

**Characteristics:**

- Handles collisions with linked lists
- Can exceed load factor of 1.0
- Good for unknown data size

---

### Hash Table with Linear Probing

**Visual:**

```
Index: 0    1    2    3    4    5    6
       [A] [B] [C] [ ] [D] [ ] [ ]
              ↑    ↑
            Hash  Probe

Collision: probe next slot linearly
until empty slot found
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Search    | O(1)      | O(1/(1-α))   | O(n)       | O(m)  |
| Insert    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |
| Delete    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |

> Clustering can degrade performance  
> α should be kept < 0.5 for good performance

**Characteristics:**

- Cache-friendly (sequential memory)
- Primary clustering problem
- Requires tombstones for deletion

---

### Hash Table with Quadratic Probing

**Visual:**

```
Index: 0    1    2    3    4    5    6    7
       [A] [ ] [B] [ ] [ ] [C] [ ] [ ]
            ↑       ↑       ↑
         Hash    +1²     +2²

Probe sequence: h, h+1², h+2², h+3²...
Reduces clustering
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Search    | O(1)      | O(1/(1-α))   | O(n)       | O(m)  |
| Insert    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |
| Delete    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |

> Reduces primary clustering  
> May still have secondary clustering  
> Table size should be prime

**Characteristics:**

- Better than linear probing
- i² probe sequence
- May not probe all slots

---

### Hash Table with Double Hashing

**Visual:**

```
h1(key) = primary hash
h2(key) = secondary hash (step size)

Probe: h1, h1+h2, h1+2×h2, h1+3×h2...

Index: 0    1    2    3    4    5    6    7
       [A] [ ] [ ] [B] [ ] [C] [ ] [ ]
            ↑           ↑           ↑
         Hash        +h2         +2×h2

Eliminates clustering completely
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Search    | O(1)      | O(1/(1-α))   | O(n)       | O(m)  |
| Insert    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |
| Delete    | O(1)      | O(1/(1-α))   | O(n)       | O(1)  |

> Best open addressing method  
> Eliminates both primary and secondary clustering  
> Second hash function must never evaluate to 0

**Characteristics:**

- Two hash functions
- Best distribution
- More complex implementation

**Hash Table Resizing:**

- Time: O(n)
- Typically done when α > 0.7
- New size usually double and prime

---

## Binary Trees

### Generic Binary Tree

**Visual:**

```
         50
        /  \
      30    70
     / \   / \
   20  40 60  80

Each node has at most 2 children
No ordering constraint
```

| Operation          | Best Case | Average Case | Worst Case | Space |
| ------------------ | --------- | ------------ | ---------- | ----- |
| Search             | O(log n)  | O(log n)     | O(n)       | O(n)  |
| Traversal          | O(n)      | O(n)         | O(n)       | O(h)* |
| Height calculation | O(n)      | O(n)         | O(n)       | O(h)  |
| Count nodes        | O(n)      | O(n)         | O(n)       | O(h)  |

> *h = height of tree (recursion stack space)  
> Best case assumes balanced tree

**Traversal Types:**

| Traversal         | Time | Space | Order               |
| ----------------- | ---- | ----- | ------------------- |
| Inorder           | O(n) | O(h)  | Left → Root → Right |
| Preorder          | O(n) | O(h)  | Root → Left → Right |
| Postorder         | O(n) | O(h)  | Left → Right → Root |
| Level-order (BFS) | O(n) | O(w)  | Level by level      |

> w = maximum width of tree

---

## Binary Search Trees

### BST (Unbalanced)

**Visual:**

```
         50
        /  \
      30    70
     / \   / \
   20  40 60  80

Property: Left < Node < Right
Inorder: 20,30,40,50,60,70,80 (sorted)

Worst case (unbalanced):
10
 \
  20
   \
    30  (degenerates to linked list)
```

| Operation             | Best Case | Average Case | Worst Case | Space |
| --------------------- | --------- | ------------ | ---------- | ----- |
| Search                | O(log n)  | O(log n)     | O(n)       | O(n)  |
| Insert                | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Delete                | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Find min/max          | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Successor/predecessor | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Inorder traversal     | O(n)      | O(n)         | O(n)       | O(h)  |

> Worst case O(n) occurs when tree degenerates to linked list  
> Performance heavily depends on insertion order

**BST Property:**

- Left subtree < Node < Right subtree
- Inorder traversal yields sorted sequence

**Deletion Cases:**

1. **Leaf node:** Simply remove
2. **One child:** Replace with child
3. **Two children:** Replace with inorder successor/predecessor

---

## Tries

### Trie (Prefix Tree)

**Visual:**

```
Words: "cat", "car", "dog"

        (root)
       /     \
      c       d
      |       |
      a       o
     / \      |
    t   r     g
   ($) ($)   ($)

$ = end of word marker
Paths from root spell words
```

| Operation               | Time Complexity | Space Complexity |
| ----------------------- | --------------- | ---------------- |
| Search word             | O(m)            | O(1)             |
| Insert word             | O(m)            | O(m)             |
| Delete word             | O(m)            | O(m)             |
| Prefix search           | O(p)            | O(1)             |
| Autocomplete            | O(p + n)        | O(n)             |
| Count words with prefix | O(p + n)        | O(1)             |

> m = length of word  
> p = length of prefix  
> n = number of words with that prefix  
> **Total space:** O(ALPHABET_SIZE × N × M) where N = number of words

**Characteristics:**

- Each node represents a character
- Path from root represents a word/prefix
- Space-intensive but fast for prefix operations

**Use Cases:**

- Autocomplete systems
- Spell checkers
- IP routing tables
- Dictionary implementations
- T9 predictive text

---

## AVL Trees

### AVL Tree (Self-Balancing BST)

**Visual:**

```
         50 (BF=0)
        /  \
   30(0)    70(0)
   / \      / \
 20  40   60  80

BF = Balance Factor = height(L) - height(R)
BF must be in {-1, 0, 1}

Example rotation (Right-Right case):
    30               40
      \             /  \
       40    =>   30    50
        \
         50
```

| Operation    | Best Case | Average Case | Worst Case | Space |
| ------------ | --------- | ------------ | ---------- | ----- |
| Search       | O(log n)  | O(log n)     | O(log n)   | O(n)  |
| Insert       | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Delete       | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Find min/max | O(log n)  | O(log n)     | O(log n)   | O(1)  |

**Height guarantee:** h ≤ 1.44 log₂(n + 2)

**Balancing Properties:**

- Balance factor: height(left) - height(right) ∈ {-1, 0, 1}
- Rotations: Single (LL, RR) or Double (LR, RL)
- At most 2 rotations per insertion
- At most O(log n) rotations per deletion

**Rotations:**

| Rotation Type     | Time | When Used        |
| ----------------- | ---- | ---------------- |
| Single Left (LL)  | O(1) | Left-left case   |
| Single Right (RR) | O(1) | Right-right case |
| Left-Right (LR)   | O(1) | Left-right case  |
| Right-Left (RL)   | O(1) | Right-left case  |

**Advantages:**

- Guaranteed O(log n) operations
- Stricter balancing than Red-Black trees
- Better for lookup-heavy workloads

**Disadvantages:**

- More rotations on insert/delete
- More complex implementation

---

## Red-Black Trees

### Red-Black Tree

**Visual:**

```
         50(B)
        /     \
    30(R)     70(B)
    /  \      /  \
 20(B) 40(B) 60(R) 80(R)

B = Black, R = Red
Properties:
1. Nodes are Red or Black
2. Root is Black
3. Red nodes have Black children
4. All paths have same # of Black nodes
```

| Operation    | Best Case | Average Case | Worst Case | Space |
| ------------ | --------- | ------------ | ---------- | ----- |
| Search       | O(log n)  | O(log n)     | O(log n)   | O(n)  |
| Insert       | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Delete       | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Find min/max | O(log n)  | O(log n)     | O(log n)   | O(1)  |

**Height guarantee:** h ≤ 2 log₂(n + 1)

**Properties:**

1. Every node is red or black
2. Root is black
3. Leaves (NIL) are black
4. Red nodes have black children (no two reds in a row)
5. All paths from node to leaves have same number of black nodes

**Balancing:**

| Operation | Rotations        | Recoloring |
| --------- | ---------------- | ---------- |
| Insert    | O(1) - at most 2 | O(log n)   |
| Delete    | O(1) - at most 3 | O(log n)   |

**Advantages over AVL:**

- Fewer rotations on insertion/deletion
- Better for write-heavy applications
- Used in Linux kernel, Java TreeMap, C++ std::map

**Disadvantages:**

- Less strictly balanced (slightly slower lookups)
- More complex implementation

---

## Splay Trees

### Splay Tree (Self-Adjusting BST)

**Visual:**

```
After accessing node 20, it splays to root:

Before:           After:
    50              20
   /  \            /  \
  30   70   =>   10    50
 /  \                 /  \
10  20              30    70

Recently accessed elements move to top
Self-optimizing for access patterns
```

| Operation    | Best Case | Average Case | Worst Case (single op) | Amortized | Space |
| ------------ | --------- | ------------ | ---------------------- | --------- | ----- |
| Search       | O(1)      | O(log n)     | O(n)                   | O(log n)  | O(n)  |
| Insert       | O(1)      | O(log n)     | O(n)                   | O(log n)  | O(1)  |
| Delete       | O(1)      | O(log n)     | O(n)                   | O(log n)  | O(1)  |
| Find min/max | O(1)      | O(log n)     | O(n)                   | O(log n)  | O(1)  |

**Characteristics:**

- Self-adjusting binary search tree
- Recently accessed elements move to root (via splaying)
- No balance information stored
- Amortized O(log n) performance

**Splay Operations:**

| Operation | Description                             | Time |
| --------- | --------------------------------------- | ---- |
| Zig       | Single rotation (node is child of root) | O(1) |
| Zig-Zig   | Double rotation (same direction)        | O(1) |
| Zig-Zag   | Double rotation (opposite direction)    | O(1) |

**Advantages:**

- Simple implementation (no balance factors or colors)
- Self-optimizing for access patterns
- Excellent for non-uniform access (frequently accessed items become faster)
- Good cache locality for recently accessed items

**Disadvantages:**

- Worst-case O(n) for single operation
- No guaranteed height bound
- Performance depends on access pattern
- Can degrade to linked list temporarily

**Use Cases:**

- Caches (LRU-like behavior)
- Applications with locality of reference
- When recent accesses predict future accesses
- Garbage collection algorithms

---

## Heaps

### Binary Heap (Min/Max)

**Visual:**

```
Min-Heap (array representation):
         10
        /  \
      20    30
     / \   / \
   40  50 60  70

Array: [10, 20, 30, 40, 50, 60, 70]
Index:  0   1   2   3   4   5   6

Parent of i: ⌊(i-1)/2⌋
Left child:  2i + 1
Right child: 2i + 2

Property: Parent ≤ Children (Min-Heap)
```

| Operation       | Best Case | Average Case | Worst Case | Space |
| --------------- | --------- | ------------ | ---------- | ----- |
| Find min/max    | O(1)      | O(1)         | O(1)       | O(n)  |
| Insert          | O(1)      | O(log n)     | O(log n)   | O(1)  |
| Delete min/max  | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Build heap      | O(n)      | O(n)         | O(n)       | O(1)  |
| Heapify down    | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Heapify up      | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Merge two heaps | O(n + m)  | O(n + m)     | O(n + m)   | O(1)  |

**Array representation:**

- Parent of i: ⌊(i-1)/2⌋
- Left child of i: 2i + 1
- Right child of i: 2i + 2

**Heap Property:**

- **Min-heap:** Parent ≤ Children
- **Max-heap:** Parent ≥ Children

**Characteristics:**

- Complete binary tree
- Array-based implementation
- Not a BST (only parent-child relationship)

---

### Priority Queue (using Heap)

| Operation       | Best Case | Average Case | Worst Case | Space |
| --------------- | --------- | ------------ | ---------- | ----- |
| Insert          | O(log n)  | O(log n)     | O(log n)   | O(n)  |
| Extract-min/max | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Peek            | O(1)      | O(1)         | O(1)       | O(1)  |
| Decrease key    | O(log n)  | O(log n)     | O(log n)   | O(1)  |
| Delete          | O(log n)  | O(log n)     | O(log n)   | O(1)  |

**Use Cases:**

- Dijkstra's shortest path
- Huffman coding
- Event-driven simulation
- Job scheduling
- A* pathfinding

---

## Fibonacci Heaps

### Fibonacci Heap

**Visual:**

```
Collection of min-heap-ordered trees:

  Root List (circular doubly-linked):
  ┌────────────────────────┐
  │                        │
  10 ←→ 15 ←→ 20 ←→ 25 ←→ 10
  ↓     ↓     ↓     ↓
  12    18    22    30
  ↓
  14

min → 10 (minimum always at root level)

Lazy consolidation: trees merged on extract-min
```

| Operation     | Amortized Time | Worst Case | Space |
| ------------- | -------------- | ---------- | ----- |
| Find min      | O(1)           | O(1)       | O(n)  |
| Insert        | O(1)           | O(1)       | O(1)  |
| Decrease key  | O(1)           | O(n)       | O(1)  |
| Merge (union) | O(1)           | O(1)       | O(1)  |
| Extract min   | O(log n)       | O(n)       | O(1)  |
| Delete        | O(log n)       | O(n)       | O(1)  |

**Characteristics:**

- Collection of heap-ordered trees
- Lazy consolidation (delayed structural changes)
- Better amortized times than binary heap for some operations
- More complex implementation

**Structure:**

- Circular doubly-linked list of roots
- Each node has degree (number of children)
- Marked/unmarked nodes for cascading cuts

**Advantages:**

- O(1) amortized decrease-key (vs O(log n) for binary heap)
- O(1) amortized merge (vs O(n) for binary heap)
- O(1) amortized insert
- Theoretically optimal for Dijkstra's and Prim's algorithms

**Disadvantages:**

- Complex implementation
- Large constant factors (slower in practice than binary heaps for small datasets)
- Poor cache performance
- High memory overhead per node

**Use Cases:**

- Dijkstra's algorithm (theoretically O(E + V log V))
- Prim's MST algorithm
- Theoretical importance in algorithm analysis
- When decrease-key is frequent

**Practical Note:**
Despite theoretical advantages, binary heaps often outperform Fibonacci heaps in practice due to better cache locality and simpler operations. Use only when decrease-key frequency justifies the complexity.

---

## Treaps

### Treap (Tree + Heap)

**Visual:**

```
Each node: (key, priority)

         (50,90)
        /       \
    (30,75)    (70,85)
    /   \      /   \
(20,60)(40,70)(60,80)(80,65)

Keys follow BST property
Priorities follow max-heap property
Priorities are random
```

| Operation | Best Case | Average Case | Worst Case | Space |
| --------- | --------- | ------------ | ---------- | ----- |
| Search    | O(log n)  | O(log n)     | O(n)       | O(n)  |
| Insert    | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Delete    | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Split     | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Merge     | O(log n)  | O(log n)     | O(n)       | O(1)  |

**Characteristics:**

- Randomized BST using priority values
- Each node has a key (BST property) and priority (heap property)
- Expected height: O(log n) with high probability
- Simpler to implement than AVL/Red-Black trees

**Properties:**

- BST property on keys
- Heap property on priorities (random)
- No explicit balancing needed

---

## Cartesian Trees

### Cartesian Tree

**Visual:**

```
Array: [9, 3, 7, 1, 8, 12, 10, 20, 15, 18, 5]
Index:  0  1  2  3  4   5   6   7   8   9  10

Cartesian Tree (Min-Heap on values):
              1(3)
            /      \
         3(1)       5(10)
        /   \          \
     9(0)   7(2)      12(5)
           /  \       /   \
         8(4) 10(6) 15(8) 18(9)
                    /
                 20(7)

(value, index)
- Inorder traversal gives original array order
- Heap property on values (parent < children)
- Unique tree for each array
```

| Operation                      | Time Complexity | Space Complexity |
| ------------------------------ | --------------- | ---------------- |
| Build (linear)                 | O(n)            | O(n)             |
| Build (naive)                  | O(n log n)      | O(n)             |
| Range Min Query (with LCA)     | O(log n)        | O(1) per query   |
| Find all minimums in subarrays | O(n)            | O(n)             |

**Characteristics:**

- Binary tree from a sequence
- Maintains both sequence order (inorder) and heap property (on values)
- Each array has exactly one Cartesian tree
- Root is the minimum element
- Recursively defined on subarrays

**Construction (Linear Time - Stack-based):**

```
For each element (left to right):
    Pop elements from stack while they are > current
    Current becomes right child of last popped
    Last popped becomes left child of current
    Push current onto stack
```

**Properties:**

1. **Inorder traversal** = original sequence
2. **Heap property** on values (min-heap or max-heap)
3. **Unique** for each sequence
4. **BST property** on indices (implicit)

**Build Time Complexity:**

- **Naive recursive:** O(n log n) average, O(n²) worst
- **Stack-based:** O(n) - each element pushed/popped once

**Advantages:**

- Unique representation of sequence
- Combines sequence order with hierarchy
- Linear-time construction
- Useful for range queries

**Disadvantages:**

- Static structure (rebuilding needed for updates)
- Can be unbalanced (degenerates to linked list)
- Not self-balancing like AVL or Red-Black trees

**Use Cases:**

- **Range Minimum Query (RMQ):** Combined with LCA
- **Suffix trees:** Building certain suffix tree variants
- **Computational geometry:** Convex hull algorithms
- **Pattern matching:** Finding all-nearest-smaller-values
- **Cartographic labeling:** Map label placement

**Relationship to Other Structures:**

- **Treap:** Randomized Cartesian tree (random priorities)
- **Binary Heap:** Complete tree Cartesian tree
- **BST:** Cartesian tree with sorted input

**Example Applications:**

| Problem                        | How Cartesian Tree Helps | Time               |
| ------------------------------ | ------------------------ | ------------------ |
| Range Min Query                | LCA in Cartesian tree    | O(log n) per query |
| All nearest smaller values     | Left/right subtrees      | O(n) total         |
| Maximum rectangle in histogram | Stack-based construction | O(n)               |

**Construction Example:**

```
Input: [3, 1, 4, 2]

Step 1: Insert 3       3
Step 2: Insert 1       1
                        \
                         3
Step 3: Insert 4       1
                        \
                         3
                          \
                           4
Step 4: Insert 2       1
                        \
                         2
                        / \
                       3   4

Final tree maintains:
- Inorder: 3,1,4,2 ✓
- Min-heap: 1 < {2,3,4} ✓
```

**RMQ with Cartesian Tree + LCA:**

1. Build Cartesian tree: O(n)
2. Preprocess for LCA: O(n)
3. Query RMQ(i,j) = LCA(node_i, node_j): O(1) or O(log n)

**Comparison:**

| Structure          | Build      | Query    | Update             | Balanced |
| ------------------ | ---------- | -------- | ------------------ | -------- |
| **Cartesian Tree** | O(n)       | O(log n) | O(n) rebuild       | No       |
| **Segment Tree**   | O(n)       | O(log n) | O(log n)           | Yes      |
| **Sparse Table**   | O(n log n) | O(1)     | O(n log n) rebuild | N/A      |

---

## B-Trees

### B-Tree

**Visual:**

```
B-Tree of order 3 (minimum degree t=2):
Each node: 1 to 4 keys, 2 to 5 children

              [40|60]
             /   |   \
      [10|20] [45|50] [70|80]
      / | \    / | \   / | \
    ...children...

All leaves at same level
Multiple keys per node (disk-friendly)
```

| Operation   | Time Complexity | Space Complexity |
| ----------- | --------------- | ---------------- |
| Search      | O(log n)        | O(n)             |
| Insert      | O(log n)        | O(1)             |
| Delete      | O(log n)        | O(1)             |
| Split node  | O(t)            | O(1)             |
| Merge nodes | O(t)            | O(1)             |

> t = minimum degree (order)  
> Each node has at most 2t-1 keys  
> Each internal node has at most 2t children

**Height:** h ≤ log_t((n+1)/2)

**Properties:**

- All leaves at same level
- Non-leaf nodes can have variable number of children
- Each node has minimum degree t

**Advantages:**

- **Disk-friendly:** Minimizes disk I/O operations
- **Height:** Guaranteed O(log n) with large branching factor
- **Database use:** Commonly used in database indexing
- **Cache-friendly:** Large nodes fit in disk blocks

**Use Cases:**

- File systems (NTFS, ext4, HFS+)
- Database indexing (MySQL InnoDB, PostgreSQL)
- Key-value stores

---

## 2-3-4 Trees

### 2-3-4 Tree (B-tree of order 4)

**Visual:**

```
Node types:
2-node: [30]      (1 key, 2 children)
3-node: [20|40]   (2 keys, 3 children)
4-node: [10|20|30] (3 keys, 4 children)

Example tree:
         [20|40]
        /   |   \
     [10] [30] [50|60]
              /  |  \
            ...children...

All leaves at same depth
```

| Operation      | Time Complexity | Space Complexity |
| -------------- | --------------- | ---------------- |
| Search         | O(log n)        | O(n)             |
| Insert         | O(log n)        | O(1)             |
| Delete         | O(log n)        | O(1)             |
| Split 4-node   | O(1)            | O(1)             |
| Fusion (merge) | O(1)            | O(1)             |
| Rotation       | O(1)            | O(1)             |

**Node types:**

- **2-node:** 1 key, 2 children
- **3-node:** 2 keys, 3 children
- **4-node:** 3 keys, 4 children

**Height:** O(log n)

**Properties:**

- All leaves at same level
- Perfect balance maintained
- No node has more than 3 keys

**Relationship:** 2-3-4 tree is isomorphic to Red-Black tree

- 2-node → Black node
- 3-node → Black with one red child
- 4-node → Black with two red children

---

## Skip Lists

### Skip List (Probabilistic Balanced Structure)

**Visual:**

```
Level 3: Head ────────────────────→ 40 ──→ NULL
Level 2: Head ──────→ 20 ─────────→ 40 ──→ NULL
Level 1: Head ──→ 10 → 20 ──→ 30 ─→ 40 ──→ NULL
Level 0: Head → 10 → 20 → 30 → 40 → 50 → NULL

Higher levels = "express lanes"
Probabilistic promotion (p=1/2)
Expected height: O(log n)
```

| Operation     | Best Case | Average Case | Worst Case | Space |
| ------------- | --------- | ------------ | ---------- | ----- |
| Search        | O(log n)  | O(log n)     | O(n)       | O(n)  |
| Insert        | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Delete        | O(log n)  | O(log n)     | O(n)       | O(1)  |
| Space (total) | O(n)      | O(n)         | O(n log n) | -     |

**Characteristics:**

- Probabilistic data structure (uses randomization)
- Multiple levels of linked lists
- Each level is a subset of the level below
- Top level acts as "express lane"

**Structure:**

- Level 0: Complete sorted list
- Level k: ~1/2 of level k-1 elements (probability p = 1/2)
- Expected height: O(log n)
- Expected number of levels: log₂(n)

**Level Assignment:**

```
Insert new element at level 0
For each level i = 1, 2, 3, ...:
    With probability 1/2: promote to level i
    Otherwise: stop
```

**Advantages:**

- Simpler to implement than AVL or Red-Black trees
- O(log n) expected time for all operations
- No rotations needed
- Concurrent access easier than trees
- Good cache locality (linked lists)

**Disadvantages:**

- Probabilistic guarantees (not deterministic)
- Worst case O(n) possible (extremely unlikely)
- More space overhead than binary search trees
- Requires good random number generator

**Use Cases:**

- Alternative to balanced trees when simplicity matters
- Concurrent data structures (easier to lock)
- Redis sorted sets implementation
- In-memory databases
- When you want O(log n) without complex balancing

**Space Analysis:**

- Average space: O(n) nodes with ~2n pointers total
- Each node appears in ~2 levels on average
- Space factor: 1/(1-p) where p = 1/2 → 2

---

## Disjoint Set (Union-Find)

### Disjoint Set / Union-Find

**Visual:**

```
Initial: Each element is its own set
{0} {1} {2} {3} {4} {5}

After Union(0,1), Union(2,3), Union(0,2):
    0
   / \
  1   2
      |
      3      {4} {5}

Parent array: [0, 0, 0, 2, 4, 5]
Index:         0  1  2  3  4  5

Find(3) → follows path 3→2→0 (root)
Path compression makes 3 point directly to 0
```

| Operation | Naive | Union by Rank | Path Compression | Both Optimizations |
| --------- | ----- | ------------- | ---------------- | ------------------ |
| Make-Set  | O(1)  | O(1)          | O(1)             | O(1)               |
| Find      | O(n)  | O(log n)      | O(log n)         | O(α(n))*           |
| Union     | O(1)  | O(log n)      | O(log n)         | O(α(n))*           |
| Space     | O(n)  | O(n)          | O(n)             | O(n)               |

> *α(n) = inverse Ackermann function, effectively O(1) for all practical values of n

**Structure:**

- Each set represented as a tree
- Each element points to its parent
- Root of tree is the representative of the set

**Optimizations:**

| Technique            | Description                                          | Effect           |
| -------------------- | ---------------------------------------------------- | ---------------- |
| **Union by Rank**    | Always attach smaller tree under root of deeper tree | Height ≤ log₂(n) |
| **Union by Size**    | Attach smaller tree under larger tree                | Height ≤ log₂(n) |
| **Path Compression** | Make found nodes point directly to root during Find  | Flattens tree    |

**Operations:**

```
Make-Set(x):    Create singleton set {x}
Find(x):        Return representative of set containing x
Union(x, y):    Merge sets containing x and y
Connected(x, y): Check if Find(x) == Find(y)
```

**Characteristics:**

- **With both optimizations:** Nearly O(1) amortized time per operation
- **Inverse Ackermann function α(n):**
  - α(n) ≤ 4 for all practical values (n < 2^65536)
  - Grows incredibly slowly
  - Effectively constant time

**Advantages:**

- Extremely fast in practice
- Simple implementation
- Near-constant time operations with optimizations
- Space-efficient O(n)

**Disadvantages:**

- No efficient way to split sets
- No efficient way to enumerate all elements in a set
- Cannot undo union operations
- Find modifies structure (with path compression)

**Use Cases:**

- **Kruskal's MST algorithm** - detecting cycles
- **Network connectivity** - checking if nodes are connected
- **Image processing** - connected component labeling
- **Social networks** - finding friend groups
- **Percolation** - checking if system percolates
- **Least common ancestor (LCA)** problems
- **Dynamic connectivity** - maintaining connected components

**Implementation Variants:**

| Variant                | Find Time   | Union Time  | Notes                          |
| ---------------------- | ----------- | ----------- | ------------------------------ |
| Quick Find             | O(1)        | O(n)        | Array-based, immediate answers |
| Quick Union            | O(n)        | O(n)        | Tree-based, can degenerate     |
| Weighted Quick Union   | O(log n)    | O(log n)    | Union by size/rank             |
| Path Compression       | O(log n)    | O(log n)    | Flattens trees on find         |
| **Both optimizations** | **O(α(n))** | **O(α(n))** | **Best - use this**            |

---

## Segment Trees

### Segment Tree (Range Query Tree)

**Visual:**

```
Array: [1, 3, 5, 7, 9, 11]
Query: Range sum

            [0-5: 36]
           /          \
      [0-2:9]        [3-5:27]
      /    \         /      \
  [0-1:4] [2:5]  [3-4:16] [5:11]
   /  \            /  \
[0:1][1:3]      [3:7][4:9]

Each node stores aggregate for its range
Query [2,4] visits marked nodes: O(log n)
```

| Operation           | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Build               | O(n)            | O(4n) ≈ O(n)     |
| Range Query         | O(log n)        | O(1)             |
| Point Update        | O(log n)        | O(1)             |
| Range Update (lazy) | O(log n)        | O(1)             |

**Characteristics:**

- Binary tree for range queries on arrays
- Each node represents an interval/segment
- Leaf nodes represent individual array elements
- Internal nodes represent merged information from children

**Structure:**

- Root represents entire array [0, n-1]
- For node representing [L, R]:
  - Left child: [L, mid]
  - Right child: [mid+1, R]
  - mid = (L + R) / 2
- Height: O(log n)
- Total nodes: ~4n (conservative bound)

**Supported Queries:**

- Range sum
- Range min/max
- Range GCD/LCM
- Count of elements in range
- Any associative operation

**Lazy Propagation:**

- Defers updates until needed
- O(log n) range updates
- Useful for range assignment/addition

**Array Representation:**

```
Node at index i:
- Left child: 2*i + 1
- Right child: 2*i + 2
- Parent: (i-1) / 2
```

**Advantages:**

- Flexible - supports many types of queries
- O(log n) queries and updates
- Can handle range updates with lazy propagation
- Straightforward to implement

**Disadvantages:**

- 4x space overhead
- More complex than Fenwick tree
- Slower constant factors than Fenwick tree
- No offline construction optimization

**Use Cases:**

- Range sum/min/max queries with updates
- Computational geometry
- Competitive programming
- Database range queries
- When you need both point and range updates

**Comparison with Fenwick Tree:**

- **Segment Tree:** More flexible, supports any associative operation
- **Fenwick Tree:** More space-efficient, faster, but limited to invertible operations

---

## Fenwick Trees (Binary Indexed Tree)

### Fenwick Tree / Binary Indexed Tree (BIT)

**Visual:**

```
Array: [3, 2, -1, 6, 5, 4, -3, 3]
Index:  1  2   3  4  5  6   7  8 (1-indexed)

BIT:   [3, 5,  -1, 10, 5, 9, -3, 19]

BIT[i] stores sum of elements based on LSB:
BIT[8] = sum[1-8]   (range size = 8)
BIT[6] = sum[5-6]   (range size = 2)
BIT[5] = sum[5-5]   (range size = 1)

    8
   /|\
  / | \
 4  6  7
/ \ |  |
1 2 5  7
  |
  3

Tree based on binary representation
```

| Operation        | Time Complexity | Space Complexity |
| ---------------- | --------------- | ---------------- |
| Build            | O(n)            | O(n)             |
| Prefix Sum Query | O(log n)        | O(1)             |
| Point Update     | O(log n)        | O(1)             |
| Range Query      | O(log n)        | O(1)             |

**Characteristics:**

- Space-efficient alternative to segment tree
- Based on binary representation of indices
- Stores partial sums in clever way
- 1-indexed for simpler implementation

**Structure:**

- Array-based (size n+1)
- BIT[i] stores sum of elements in range responsibility
- Range responsibility based on least significant bit
- Node i is responsible for 2^r elements (r = position of LSB)

**Key Insight:**

```
BIT[i] stores sum of elements from (i - 2^r + 1) to i
where r = position of rightmost set bit in i
```

**Operations:**

```
Update(i, delta):
    while i <= n:
        BIT[i] += delta
        i += i & (-i)  // Add LSB

PrefixSum(i):
    sum = 0
    while i > 0:
        sum += BIT[i]
        i -= i & (-i)  // Remove LSB
    return sum

RangeSum(L, R):
    return PrefixSum(R) - PrefixSum(L-1)
```

**Bit Trick:** `i & (-i)` extracts the lowest set bit

**Advantages:**

- Space-efficient: Only O(n) space (vs 4n for segment tree)
- Faster constant factors than segment tree
- Simple implementation (~20 lines of code)
- Cache-friendly
- Very fast in practice

**Disadvantages:**

- **Limited to invertible operations** (sum, XOR - not min/max)
- Less intuitive than segment tree
- Harder to extend to 2D
- Cannot easily support range updates without additional complexity
- 1-indexed can be confusing

**Supported Operations:**

- ✅ Range sum
- ✅ Range XOR
- ✅ Point update
- ❌ Range min/max (use segment tree instead)
- ❌ Range GCD (use segment tree instead)

**Use Cases:**

- Range sum queries with point updates
- Counting inversions
- Competitive programming
- When space efficiency matters
- Prefix sum queries

**2D Fenwick Tree:**

- Time: O(log n × log m) per operation
- Space: O(n × m)
- Useful for 2D range sum queries

**When to Use:**

- **Fenwick Tree:** Range sum, point updates, space matters
- **Segment Tree:** Range min/max, complex operations, range updates

---

## Bloom Filters

### Bloom Filter (Probabilistic Set)

**Visual:**

```
Bit array (size m=16):
[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]

Insert "Alice" with k=3 hash functions:
h1("Alice") = 3
h2("Alice") = 7  
h3("Alice") = 12

[0][0][0][1][0][0][0][1][0][0][0][0][1][0][0][0]
          ↑           ↑               ↑

Query "Alice": Check bits 3,7,12 → All 1 → "Probably in set"
Query "Bob": h1=2,h2=7,h3=9 → bit[2]=0 → "Definitely NOT in set"

False positives possible, false negatives impossible
```

| Operation          | Time Complexity | Space Complexity |
| ------------------ | --------------- | ---------------- |
| Insert             | O(k)            | O(1)             |
| Query (membership) | O(k)            | O(1)             |
| Delete             | Not supported*  | -                |

> k = number of hash functions  
> *Standard Bloom filters don't support deletion; use Counting Bloom Filter for deletion

**Characteristics:**

- Probabilistic data structure for set membership
- Space-efficient but allows false positives
- Never gives false negatives
- Cannot enumerate members

**Structure:**

- Bit array of size m
- k independent hash functions
- Each element hashed k times

**Insert Element:**

```
For each hash function h_i (i = 1 to k):
    Set bit at position h_i(x) to 1
```

**Query Element:**

```
For each hash function h_i (i = 1 to k):
    If bit at position h_i(x) is 0:
        Return "Definitely NOT in set"
Return "Probably in set"
```

**False Positive Probability:**

```
P(false positive) ≈ (1 - e^(-kn/m))^k

where:
    n = number of inserted elements
    m = bit array size
    k = number of hash functions

Optimal k = (m/n) × ln(2) ≈ 0.7 × (m/n)
```

**Space Efficiency:**

```
For 1% false positive rate: ~9.6 bits per element
For 0.1% false positive rate: ~14.4 bits per element

Compare to:
    Hash set: 32-64 bits per element (pointer)
    Sorted array: 32-64 bits per element
```

**Advantages:**

- **Extremely space-efficient** (bits per element, not bytes)
- O(k) time for insert and query (k is small constant)
- No false negatives
- Fixed memory size regardless of elements inserted
- No storage of actual elements (privacy benefit)

**Disadvantages:**

- **False positives possible** (configurable rate)
- **Cannot delete** from standard Bloom filter
- Cannot enumerate members
- Cannot get count of elements (unless using counting variant)
- Performance degrades as filter fills up

**Variants:**

| Variant                   | Features                        | Trade-off               |
| ------------------------- | ------------------------------- | ----------------------- |
| **Counting Bloom Filter** | Supports deletion               | 4-8x more space         |
| **Scalable Bloom Filter** | Grows dynamically               | More complex            |
| **Cuckoo Filter**         | Supports deletion, better space | More complex operations |

**Use Cases:**

- **Web caching:** Check if item in cache before disk lookup
- **Databases:** Avoid expensive disk lookups (BigTable, Cassandra)
- **Network routers:** Packet filtering
- **Spell checkers:** Quick dictionary lookup
- **Bitcoin:** Light clients checking transactions
- **Chrome:** Malicious URL detection
- **Medium:** Avoid showing articles already read
- **Email:** Spam filtering

**Example Configuration:**

```
For 1 million elements with 1% false positive rate:
    m ≈ 9.6 million bits ≈ 1.2 MB
    k ≈ 7 hash functions

Compare to hash set:
    8 bytes per pointer × 1M = 8 MB
    Bloom filter is 6-7x more space-efficient!
```

**When to Use:**

- Checking set membership is frequent
- False positives are acceptable
- Space is at a premium
- Don't need to delete elements (or use counting variant)
- Don't need to enumerate members

**When NOT to Use:**

- Need 100% accuracy (no false positives)
- Need to delete elements frequently
- Need to count or enumerate elements
- Dataset is small (overhead not worth it)

---

## Graphs

### Adjacency List Representation

**Visual:**

```
Graph:     0 ─── 1
           │   ╱ │
           │ ╱   │
           2 ─── 3

Adjacency List:
0: → 1 → 2
1: → 0 → 2 → 3
2: → 0 → 1 → 3
3: → 1 → 2

Each vertex maintains list of neighbors
Space-efficient for sparse graphs
```

| Operation            | Time Complexity | Space Complexity |
| -------------------- | --------------- | ---------------- |
| Add vertex           | O(1)            | O(1)             |
| Add edge             | O(1)            | O(1)             |
| Remove vertex        | O(V + E)        | O(1)             |
| Remove edge          | O(E)            | O(1)             |
| Check if edge exists | O(degree(V))    | O(1)             |
| Get all neighbors    | O(degree(V))    | O(degree(V))     |
| Get all edges        | O(V + E)        | O(1)             |

**Total Space:** O(V + E)

**Best for:** Sparse graphs (E << V²)

**Implementation:**

- Array/list of lists
- Array/list of hash sets
- Hash map of lists/sets

**Advantages:**

- Space-efficient for sparse graphs
- Fast neighbor iteration
- Easy to add vertices/edges

**Disadvantages:**

- Slow edge existence check
- More cache misses

---

### Adjacency Matrix Representation

**Visual:**

```
Graph:     0 ─── 1
           │   ╱ │
           │ ╱   │
           2 ─── 3

Adjacency Matrix:
    0  1  2  3
0 [ 0  1  1  0 ]
1 [ 1  0  1  1 ]
2 [ 1  1  0  1 ]
3 [ 0  1  1  0 ]

Matrix[i][j] = 1 if edge exists
Matrix[i][j] = 0 otherwise
(or weight for weighted graphs)
```

| Operation            | Time Complexity | Space Complexity |
| -------------------- | --------------- | ---------------- |
| Add vertex           | O(V²)           | O(V²)            |
| Add edge             | O(1)            | O(1)             |
| Remove vertex        | O(V²)           | O(V²)            |
| Remove edge          | O(1)            | O(1)             |
| Check if edge exists | O(1)            | O(1)             |
| Get all neighbors    | O(V)            | O(V)             |
| Get all edges        | O(V²)           | O(1)             |

**Total Space:** O(V²)

**Best for:** Dense graphs (E ≈ V²)

**Implementation:**

- 2D array or matrix
- Boolean or weighted values

**Advantages:**

- Fast edge existence check O(1)
- Fast edge addition/removal O(1)
- Simple implementation

**Disadvantages:**

- Space-inefficient for sparse graphs
- Slow to add/remove vertices
- Iterating neighbors requires O(V)

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
O(2ⁿ)        🔥 Exponential   - Horrible
O(n!)        💀 Factorial     - Avoid!
```

---

### Data Structure Selection Guide

| Need                             | Use                       | Time (ops)         |
| -------------------------------- | ------------------------- | ------------------ |
| Fast random access               | Array                     | O(1)               |
| Fast insert/delete at ends       | Linked List / Deque       | O(1)               |
| Fast search by key               | Hash Table                | O(1) avg           |
| Ordered data + fast search       | Balanced BST / Skip List  | O(log n)           |
| Priority access                  | Heap                      | O(log n)           |
| Fast decrease-key                | Fibonacci Heap            | O(1) amortized     |
| LIFO operations                  | Stack                     | O(1)               |
| FIFO operations                  | Queue                     | O(1)               |
| Prefix matching                  | Trie                      | O(m)               |
| Many-to-many relations           | Graph                     | -                  |
| Sorted + frequent changes        | Red-Black Tree            | O(log n)           |
| Access pattern locality          | Splay Tree                | O(log n) amortized |
| Database indexing                | B-Tree                    | O(log n)           |
| Guaranteed balance               | AVL Tree                  | O(log n)           |
| Simple balanced structure        | Skip List                 | O(log n) expected  |
| Set connectivity                 | Disjoint Set (Union-Find) | O(α(n)) ≈ O(1)     |
| Range queries (any operation)    | Segment Tree              | O(log n)           |
| Range sum queries                | Fenwick Tree              | O(log n)           |
| Range min query with LCA         | Cartesian Tree            | O(log n)           |
| Set membership (space-efficient) | Bloom Filter              | O(k) ≈ O(1)        |

---

### Comparison Summary

| Data Structure     | Search     | Insert    | Delete    | Space           | Notes                                       |
| ------------------ | ---------- | --------- | --------- | --------------- | ------------------------------------------- |
| **Array**          | O(n)       | O(n)      | O(n)      | O(n)            | Fast access O(1)                            |
| **Sorted Array**   | O(log n)   | O(n)      | O(n)      | O(n)            | Binary search                               |
| **Linked List**    | O(n)       | O(1)*     | O(1)*     | O(n)            | *at known position                          |
| **Hash Table**     | O(1)†      | O(1)†     | O(1)†     | O(n)            | †average case                               |
| **BST**            | O(log n)‡  | O(log n)‡ | O(log n)‡ | O(n)            | ‡balanced                                   |
| **AVL Tree**       | O(log n)   | O(log n)  | O(log n)  | O(n)            | Guaranteed balance                          |
| **Red-Black Tree** | O(log n)   | O(log n)  | O(log n)  | O(n)            | Fewer rotations                             |
| **Splay Tree**     | O(log n)§  | O(log n)§ | O(log n)§ | O(n)            | §amortized, self-adjusting                  |
| **Skip List**      | O(log n)∥  | O(log n)∥ | O(log n)∥ | O(n)            | ∥expected, probabilistic                    |
| **B-Tree**         | O(log n)   | O(log n)  | O(log n)  | O(n)            | Disk-friendly                               |
| **Binary Heap**    | O(n)       | O(log n)  | O(log n)  | O(n)            | Find-min O(1)                               |
| **Fibonacci Heap** | O(n)       | O(1)¶     | O(log n)¶ | O(n)            | ¶amortized, decrease-key O(1)               |
| **Treap**          | O(log n)∥  | O(log n)∥ | O(log n)∥ | O(n)            | ∥expected, randomized                       |
| **Cartesian Tree** | O(log n)   | -         | -         | O(n)            | Build O(n), static, RMQ via LCA             |
| **Trie**           | O(m)       | O(m)      | O(m)      | O(ALPHABET×N×M) | m = word length                             |
| **Disjoint Set**   | -          | -         | -         | O(n)            | Find/Union O(α(n)) ≈ O(1)                   |
| **Segment Tree**   | O(log n)** | O(log n)  | O(log n)  | O(n)            | **range queries                             |
| **Fenwick Tree**   | O(log n)** | O(log n)  | -         | O(n)            | **prefix sum queries                        |
| **Bloom Filter**   | O(k)††     | O(k)      | No‡‡      | O(m bits)       | ††membership test, ‡‡deletion not supported |

---

### Key Takeaways

1. **Arrays:** Fast access O(1), slow insert/delete O(n)
2. **Linked Lists:** Fast insert/delete at ends O(1), slow access O(n)
3. **Hash Tables:** Best average case O(1), but worst case O(n)
4. **BST:** Good average O(log n), degrades to O(n) if unbalanced
5. **Balanced Trees (AVL/RB):** Guaranteed O(log n) for all operations
6. **Splay Trees:** Self-adjusting, O(log n) amortized, great for locality
7. **Skip Lists:** Probabilistic O(log n), simpler than balanced trees
8. **B-Trees:** Disk-friendly with large branching factor
9. **Heaps:** Perfect for priority queues, O(log n) insert/delete, O(1) find-min
10. **Fibonacci Heaps:** O(1) amortized decrease-key, theoretical importance
11. **Tries:** O(m) operations where m = key length, not dependent on n
12. **Cartesian Trees:** O(n) build from array, useful for RMQ via LCA, static structure
13. **Disjoint Set:** Near O(1) amortized find/union with path compression
14. **Segment Trees:** O(log n) range queries, flexible for any associative operation
15. **Fenwick Trees:** O(log n) range sums, more space-efficient than segment trees
16. **Bloom Filters:** Probabilistic membership, extremely space-efficient, allows false positives
17. **Graphs:** Choice of representation depends on density (sparse vs dense)

---

**Made with ❤️ for CS students**  
*Data Structures Only - No Algorithms*  
*Last Updated: 2026*