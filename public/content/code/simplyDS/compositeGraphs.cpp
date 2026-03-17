// ============ GRAPH REPRESENTATIONS - COMPOSITE ============
#include <vector>
#include <unordered_map>

// Adjacency List
class Graph {
    std::vector<int>* adjList;  // Array of vectors/lists
    int numVertices;
    // adjList[i] contains list of neighbors of vertex i
};


// Edge List
class Graph {
    std::vector<std::pair<int, int>> edges;  // Vector of pairs
    int numVertices;
    // Each pair (u, v) represents an edge
};


// Adjacency Map
class Graph {
    std::unordered_map<int, std::vector<int>> adjMap;  // Hash map of vectors
    // Useful for sparse graphs with non-sequential vertices
};