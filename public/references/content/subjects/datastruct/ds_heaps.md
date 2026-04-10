💡 Metaphor:

Heap = house (permanent)

Stack = ladder you use to explore the house (temporary)

Heap (data structure) = tree used for priority queues

Heap (memory) = dynamic memory area
--------------------

ADT Layer:
- Stack ADT
- Queue ADT
- Priority Queue ADT

Data Structure Layer:
- Array
- Linked List
- Tree
- Heap (tree subtype)

Memory Layer:
- Stack memory (function calls)
- Heap memory (malloc / new)


--------------------

        Data Structure Layer
─────────────────────────────────
   ┌───────────┐
   │ Stack ADT │  <- can live in heap or stack memory
   └───────────┘
   ┌───────────┐
   │ Heap DS   │  <- tree-based heap, lives in memory
   └───────────┘
------------------

        Program Memory
─────────────────────────────────
   ┌───────────┐
   │ Stack Mem │  <- local vars, call frames
   └───────────┘
   ┌───────────┐
   │ Heap Mem  │  <- dynamic allocation (malloc/new)
   └───────────┘


------------------

       Tree Structure (Memory)
─────────────────────────────────
          ┌─────────────┐
          │ Binary Tree │
          │-------------│
          │ Nodes       │  <- permanent memory
          └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │   Heap      │
          │-------------│
          │ Complete    │
          │ binary tree │  <- permanent memory
          │ Heap property│
          └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │ Traversal   │
          │-------------│
          │ Stack/Queue │  <- temporary helper, not stored in structure
          └─────────────┘

