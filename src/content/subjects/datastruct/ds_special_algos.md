Algorithm

Huffman → builds optimal prefix codes using priority queue

Greedy → pick the “locally best” choice repeatedly (Activity selection, Coin change, Fractional Knapsack)

Dynamic Programming → solve subproblems, store solutions in arrays/matrices (Fibonacci, Knapsack, Matrix Chain)

Heuristics → approximate or rule-based solutions for complex problems (A*, Traveling Salesman, other problem-specific

--------------------------------------------------------
 rules)                 Special Algorithms ADT
                 ─────────────────────────
                 encode(data) / solve(problem)
                 getOptimalSolution()
                           │
                           │
                 Supporting Data Structures
                 ─────────────────────────
        ┌──────────────┬──────────────┬──────────────┬──────────────┐
        │              │              │              │
    Priority Queue    Array        Tree / Heap   Custom Structures
     (Huffman,        (DP)       (Greedy ops)    (Problem-specific)
      Greedy)       subproblems

                           │
                           │
                 Algorithms Layer
                 ─────────────────────────
        ┌──────────────┬──────────────┬──────────────┬──────────────┐
        │              │              │              │
     Huffman       Greedy          Dynamic        Heuristics
    Compression   Algorithms     Programming
        │              │              │              │
  ┌───────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │           │  │              │  │              │  │              │
Build prefix   Activity Sel.   Fibonacci       A* Search
Tree → Encode  Coin Change    Knapsack        TSP approx
Data          Fractional      Matrix Chain    Other problem-specific
Compression   Knapsack        Subproblems    heuristics

