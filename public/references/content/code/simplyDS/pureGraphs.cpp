// ============ GRAPH REPRESENTATIONS - PURE ============

// Adjacency Matrix
class Graph {
    int** adjMatrix;  // 2D array
    int numVertices;
    // adjMatrix[i][j] = 1 if edge exists from i to j
    // adjMatrix[i][j] = 0 if no edge
};


// Incidence Matrix
class Graph {
    int** incMatrix;  // 2D array (vertices × edges)
    int numVertices;
    int numEdges;
    // incMatrix[v][e] = 1 if vertex v is incident to edge e
};