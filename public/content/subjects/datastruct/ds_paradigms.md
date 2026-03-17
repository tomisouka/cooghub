💡 Takeaways:

Paradigm = strategy

Algorithm = executable steps

ADT = abstract interface / concept → how you want to use data

Data Structure = actual storage / implementation

-------------------

          Paradigm → Algorithm → ADT → Data Structure
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │       Divide & Conquer      │  ← Paradigm
           │-----------------------------│
           │ Merge Sort                  │  ← Algorithm
           │ Quick Sort                  │
           │ Quickselect                 │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │          ADT                │
           │-----------------------------│
           │ List ADT                    │
           │ Stack ADT (for recursion)   │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │      Data Structures        │
           │-----------------------------│
           │ Arrays                      │
           │ Linked Lists (merge optimized) 
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │          Greedy             │  ← Paradigm
           │-----------------------------│
           │ Huffman Compression         │  ← Algorithm
           │ Other greedy algorithms     │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │          ADT                │
           │-----------------------------│
           │ Priority Queue ADT          │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │      Data Structures        │
           │-----------------------------│
           │ Heap                        │
           │ Array / List (depends)      │
           └─────────────────────────────┘
─────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │    Dynamic Programming      │  ← Paradigm
           │-----------------------------│
           │ Fibonacci (memoized)       │  ← Algorithm
           │ Matrix Chain Multiplication │
           │ Other DP algorithms        │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │          ADT                │
           │-----------------------------│
           │ Array ADT                   │
           │ Map ADT                     │
           └─────────────────────────────┘
                    │
                    ▼
           ┌─────────────────────────────┐
           │      Data Structures        │
           │-----------------------------│
           │ Arrays                      │
           │ Hash Tables                 │
           └─────────────────────────────┘

