#include <vector>
#include <queue>
#include <climits>
#include <algorithm>

// ============ DIJKSTRA'S ALGORITHM ============
// Type: Iterative (uses priority queue)
// Time: O((V + E) log V) with min-heap
// Space: O(V)
// Use: Single-source shortest path, non-negative weights

void dijkstra(std::vector<std::pair<int, int>> adj[], int V, int src) {
    std::priority_queue<std::pair<int, int>, 
                       std::vector<std::pair<int, int>>, 
                       std::greater<std::pair<int, int>>> pq;
    
    std::vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}


// ============ BELLMAN-FORD ALGORITHM ============
// Type: Iterative
// Time: O(V * E)
// Space: O(V)
// Use: Single-source shortest path, handles negative weights, detects negative cycles

struct Edge {
    int src, dest, weight;
};

bool bellmanFord(Edge edges[], int V, int E, int src, int dist[]) {
    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
    }
    dist[src] = 0;
    
    for (int i = 0; i < V - 1; i++) {
        for (int j = 0; j < E; j++) {
            int u = edges[j].src;
            int v = edges[j].dest;
            int w = edges[j].weight;
            
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (int j = 0; j < E; j++) {
        int u = edges[j].src;
        int v = edges[j].dest;
        int w = edges[j].weight;
        
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            return false;  // Negative cycle detected
        }
    }
    return true;
}


// ============ FLOYD-WARSHALL ALGORITHM ============
// Type: Iterative
// Time: O(V³)
// Space: O(V²)
// Use: All-pairs shortest path

void floydWarshall(int graph[][100], int V) {
    int dist[V][V];
    
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            dist[i][j] = graph[i][j];
        }
    }
    
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}


// ============ KRUSKAL'S ALGORITHM (MST) ============
// Type: Iterative (uses Union-Find)
// Time: O(E log E)
// Space: O(V)
// Use: Minimum Spanning Tree, edge-based approach

struct EdgeMST {
    int src, dest, weight;
    bool operator<(const EdgeMST& other) const {
        return weight < other.weight;
    }
};

int find(int parent[], int i) {
    if (parent[i] != i) {
        parent[i] = find(parent, parent[i]);
    }
    return parent[i];
}

void unionSets(int parent[], int rank[], int x, int y) {
    int xroot = find(parent, x);
    int yroot = find(parent, y);
    
    if (rank[xroot] < rank[yroot]) {
        parent[xroot] = yroot;
    } else if (rank[xroot] > rank[yroot]) {
        parent[yroot] = xroot;
    } else {
        parent[yroot] = xroot;
        rank[xroot]++;
    }
}

void kruskal(EdgeMST edges[], int V, int E) {
    std::sort(edges, edges + E);
    
    int parent[V];
    int rank[V] = {0};
    
    for (int i = 0; i < V; i++) {
        parent[i] = i;
    }
    
    int mstWeight = 0;
    int edgeCount = 0;
    
    for (int i = 0; i < E && edgeCount < V - 1; i++) {
        int x = find(parent, edges[i].src);
        int y = find(parent, edges[i].dest);
        
        if (x != y) {
            edgeCount++;
            mstWeight += edges[i].weight;
            unionSets(parent, rank, x, y);
        }
    }
}


// ============ PRIM'S ALGORITHM (MST) ============
// Type: Iterative (uses priority queue)
// Time: O((V + E) log V)
// Space: O(V)
// Use: Minimum Spanning Tree, vertex-based approach

void prim(std::vector<std::pair<int, int>> adj[], int V) {
    std::priority_queue<std::pair<int, int>, 
                       std::vector<std::pair<int, int>>, 
                       std::greater<std::pair<int, int>>> pq;
    
    std::vector<bool> inMST(V, false);
    std::vector<int> key(V, INT_MAX);
    
    pq.push({0, 0});
    key[0] = 0;
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        if (inMST[u]) continue;
        inMST[u] = true;
        
        for (auto edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (!inMST[v] && weight < key[v]) {
                key[v] = weight;
                pq.push({key[v], v});
            }
        }
    }
}


// ============ TOPOLOGICAL SORT (DFS-based) ============
// Type: Recursive
// Time: O(V + E)
// Space: O(V)
// Use: DAG ordering, dependency resolution

#include <stack>

void topologicalSortUtil(int v, std::vector<int> adj[], bool visited[], std::stack<int>& Stack) {
    visited[v] = true;
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            topologicalSortUtil(u, adj, visited, Stack);
        }
    }
    
    Stack.push(v);
}

void topologicalSort(std::vector<int> adj[], int V) {
    std::stack<int> Stack;
    bool visited[V] = {false};
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            topologicalSortUtil(i, adj, visited, Stack);
        }
    }
    
    // Stack now contains topological order
}


// ============ KAHN'S ALGORITHM (Topological Sort BFS-based) ============
// Type: Iterative (uses queue)
// Time: O(V + E)
// Space: O(V)
// Use: Topological sort, detects cycles

void kahnTopologicalSort(std::vector<int> adj[], int V) {
    std::vector<int> inDegree(V, 0);
    
    for (int u = 0; u < V; u++) {
        for (int v : adj[u]) {
            inDegree[v]++;
        }
    }
    
    std::queue<int> q;
    for (int i = 0; i < V; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }
    
    int count = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        count++;
        
        for (int v : adj[u]) {
            inDegree[v]--;
            if (inDegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    // If count != V, graph has a cycle
}


// ============ CYCLE DETECTION (Undirected Graph) ============
// Type: Recursive (DFS-based)
// Time: O(V + E)
// Space: O(V)
// Use: Detect cycles in undirected graphs

bool isCyclicUtil(int v, std::vector<int> adj[], bool visited[], int parent) {
    visited[v] = true;
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            if (isCyclicUtil(u, adj, visited, v)) {
                return true;
            }
        } else if (u != parent) {
            return true;
        }
    }
    return false;
}

bool isCyclic(std::vector<int> adj[], int V) {
    bool visited[V] = {false};
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            if (isCyclicUtil(i, adj, visited, -1)) {
                return true;
            }
        }
    }
    return false;
}