Stability ≠ divide-and-conquer

Stability has nothing to do with divide-and-conquer

It only cares about equal elements keeping their original order

Examples:

Merge Sort → divide-and-conquer + stable

Bubble Sort → not divide-and-conquer but stable

Quick Sort → divide-and-conquer but unstable

------------------------------

💡 Metaphor-free way:

“Stable = equals stay in the same order they came in; unstable = equals may shuffle.”

--------------------------------

                           Sorting Stability
────────────────────────────────────────────────────────────────
           ┌─────────────────────────────┐
           │        Stable Sorts         │
           │-----------------------------│
           │ Merge Sort                  │
           │ Bubble Sort                 │
           │ Insertion Sort              │
           │ Counting Sort (if used)     │
           └─────────────────────────────┘
                    │
                    │
                    │
           ┌─────────────────────────────┐
           │       Unstable Sorts        │
           │-----------------------------│
           │ Quick Sort                  │
           │ Heap Sort                   │
           │ Selection Sort              │
           │ Shell Sort                  │
           │ Radix Sort (classic)        │
           └─────────────────────────────┘

