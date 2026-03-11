// ============ LINEAR SEARCH ============
// Type: Iterative
// Time: O(n)
// Space: O(1)
// Use: Unsorted data, small datasets

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;  // Not found
}


// ============ BINARY SEARCH (ITERATIVE) ============
// Type: Iterative
// Time: O(log n)
// Space: O(1)
// Use: Sorted arrays, efficient search

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;  // Not found
}


// ============ BINARY SEARCH (RECURSIVE) ============
// Type: Recursive
// Time: O(log n)
// Space: O(log n) - recursion stack
// Use: Sorted arrays, recursive approach

int binarySearchRecursive(int arr[], int left, int right, int target) {
    if (left > right) {
        return -1;  // Not found
    }
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    }
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, mid + 1, right, target);
    }
    return binarySearchRecursive(arr, left, mid - 1, target);
}


// ============ JUMP SEARCH ============
// Type: Iterative
// Time: O(√n)
// Space: O(1)
// Use: Sorted arrays, alternative to binary search

#include <cmath>

int jumpSearch(int arr[], int n, int target) {
    int step = sqrt(n);
    int prev = 0;
    
    while (arr[std::min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) {
            return -1;
        }
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev == std::min(step, n)) {
            return -1;
        }
    }
    
    if (arr[prev] == target) {
        return prev;
    }
    return -1;
}


// ============ INTERPOLATION SEARCH ============
// Type: Iterative
// Time: O(log log n) average, O(n) worst
// Space: O(1)
// Use: Uniformly distributed sorted data

int interpolationSearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left == right) {
            if (arr[left] == target) return left;
            return -1;
        }
        
        int pos = left + ((target - arr[left]) * (right - left)) / 
                         (arr[right] - arr[left]);
        
        if (arr[pos] == target) {
            return pos;
        }
        if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }
    return -1;
}


// ============ EXPONENTIAL SEARCH ============
// Type: Iterative (uses binary search)
// Time: O(log n)
// Space: O(1)
// Use: Unbounded/infinite arrays, sorted data

int exponentialSearch(int arr[], int n, int target) {
    if (arr[0] == target) {
        return 0;
    }
    
    int i = 1;
    while (i < n && arr[i] <= target) {
        i *= 2;
    }
    
    return binarySearch(arr + i / 2, std::min(i, n) - i / 2, target) + i / 2;
}


// ============ DEPTH-FIRST SEARCH (DFS) ============
// Type: Recursive
// Time: O(V + E) where V=vertices, E=edges
// Space: O(V)
// Use: Graph/tree traversal, pathfinding

#include <vector>

void dfsRecursive(int node, std::vector<int> adj[], bool visited[]) {
    visited[node] = true;
    // Process node here
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfsRecursive(neighbor, adj, visited);
        }
    }
}

void DFS(int start, std::vector<int> adj[], int V) {
    bool visited[V] = {false};
    dfsRecursive(start, adj, visited);
}


// ============ BREADTH-FIRST SEARCH (BFS) ============
// Type: Iterative (uses queue)
// Time: O(V + E) where V=vertices, E=edges
// Space: O(V)
// Use: Graph/tree traversal, shortest path in unweighted graph

#include <queue>

void BFS(int start, std::vector<int> adj[], int V) {
    bool visited[V] = {false};
    std::queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        // Process node here
        
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}