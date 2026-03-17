// ============ DISJOINT SET (UNION-FIND) ============
class DisjointSet {
    int* parent;  // Parent of each element
    int* rank;    // Rank/height of tree (for optimization)
    int size;
    // Used to track connected components
    // Operations: find(x), union(x, y)
};

// ============ SKIP LIST ============
class Node {
    int data;
    Node** forward;  // Array of pointers to next nodes at different levels
    int level;       // Height of this node
};

class SkipList {
    Node* header;    // Header node
    int maxLevel;    // Maximum level of skip list
    int currentLevel; // Current highest level
    // Multi-level linked list for O(log n) search
    // Each level is a express lane for faster traversal
};