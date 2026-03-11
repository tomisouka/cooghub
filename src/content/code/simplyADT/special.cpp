// ============ DISJOINT SET (UNION-FIND) ADT ============
class DisjointSet {
    int* parent;
    int* rank;
    
public:
    // Make set - O(1)
    void makeSet(int x);
    
    // Find - O(α(n)) with path compression (nearly O(1))
    int find(int x);
    
    // Union - O(α(n)) with union by rank (nearly O(1))
    void unionSets(int x, int y);
    
    // Utility
    bool connected(int x, int y);
};


// ============ SKIP LIST ADT ============
struct Node {
    int value;
    Node** forward;
    int level;
};

class SkipList {
    Node* header; // struct Node needed here part of the ds though
    
public:
    // Insert - O(log n) average
    void insert(int value);
    
    // Delete - O(log n) average
    void remove(int value);
    
    // Search - O(log n) average
    bool search(int value);
    
    // Utility
    bool isEmpty();
};