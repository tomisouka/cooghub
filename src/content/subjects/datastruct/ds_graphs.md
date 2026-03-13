                         Graph ADT (Operations)
                         ───────────────────────
                         addVertex(v)
                         addEdge(u,v,weight)
                         removeVertex(v)
                         removeEdge(u,v)
                         neighbors(v)
                         isDirected()
                         isWeighted()
                                   │
                                   │
                        Graph Data Structures
                        ─────────────────────
                ┌───────────────┬───────────────┬───────────────┐
                │               │               │
        Adjacency List     Adjacency Matrix   Edge List
        ─────────────     ─────────────     ─────────────
        - Array of lists    - 2D array       - List of edges
        - Efficient for     - Quick lookup   - Useful for Kruskal
          sparse graphs      - Dense graphs

                                   │
                                   │
                         Graph Algorithms
                         ─────────────────────
          ┌──────────────┬──────────────┬──────────────┬──────────────┬───────────────┐
          │              │              │              │               │
        BFS            DFS           Dijkstra      Bellman-Ford     Topological Sort
      (Queue)       (Stack/Rec)   (Priority Q)     (Edge relax)       (Uses DFS)
          
          ┌──────────────┬───────────────┐
          │                              │
      Minimum Spanning Tree (MST)        All-Pairs Shortest Path
          │
          │
  ┌──────────────┬───────────────┐
  │                              │
Prim’s Algorithm                Kruskal’s Algorithm
(Priority Q / Heap)          (Edge List / Union-Find)

          ┌───────────────┐
          │
  Special / Heuristic Algorithms
  (Greedy / Dynamic Programming)

