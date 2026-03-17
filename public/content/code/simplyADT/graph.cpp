// ============ GRAPH ADT ============
#include <vector>
class Graph {
    // Implementation can be adjacency matrix or list
    
public:
    // Add vertex - O(1) to O(V^2) depending on implementation
    void addVertex(int vertex);
    
    // Remove vertex - O(V + E)
    void removeVertex(int vertex);
    
    // Add edge - O(1)
    void addEdge(int from, int to);
    void addEdge(int from, int to, int weight);  // Weighted
    
    // Remove edge - O(1) to O(V)
    void removeEdge(int from, int to);
    
    // Get neighbors - O(1) to O(V)
    std::vector<int> getNeighbors(int vertex);
    
    // Traversals - O(V + E)
    void BFS(int start);  // Breadth-first search
    void DFS(int start);  // Depth-first search
    
    // Utility
    bool hasEdge(int from, int to);
    int vertexCount();
    int edgeCount();
};