💡 Notes:

ADT = interface / abstract idea → “what operations I can do”

Data Structure = implementation → “how it actually works in memory”

Some ADTs can use multiple underlying structures (e.g., List ADT → array or linked list)

----------------------------------

                Abstract Data Types (ADTs)
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │           List ADT          │
           │-----------------------------│
           │ - insert / remove / search  │
           │ - traversal                 │
           │ Implemented by: Arrays,     │
           │ Linked Lists                │
           └─────────────────────────────┘
                    │
           ┌────────┴─────────┐
           │                  │
┌─────────────────────┐  ┌─────────────────────┐
│  Array List          │  │ Linked List          │
│  - fixed/resizeable  │  │ - singly / doubly    │
└─────────────────────┘  └─────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │           Stack ADT         │
           │-----------------------------│
           │ - push / pop / peek         │
           │ Implemented by: Arrays,     │
           │ Linked Lists                │
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │           Queue ADT         │
           │-----------------------------│
           │ - enqueue / dequeue / peek  │
           │ Implemented by: Arrays,     │
           │ Linked Lists                │
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │           Deque ADT         │
           │-----------------------------│
           │ - add/remove front & back   │
           │ Implemented by: Arrays,     │
           │ Linked Lists                │
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │            Map ADT          │
           │-----------------------------│
           │ - insert / remove / search  │
           │ Implemented by: Hash Tables,│
           │ Trees                       │
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │       Priority Queue ADT     │
           │-----------------------------│
           │ - insert / extract-min/max  │
           │ Implemented by: Heaps,      │
           │ Trees, Arrays               │
           └─────────────────────────────┘


-------------------------------------------------------------

Algorithm → “walk, punch, grab” using ADT
ADT → “arms & legs” you can control
Data Structure → “body” you’re controlling
Memory → “where the body lives” (stack/heap)

