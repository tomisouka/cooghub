// ============ CARTESIAN TREE ============
class Node {
    int key;       // Inorder value
    int priority;  // Heap priority
    Node* left;
    Node* right;
};

class CartesianTree {
    Node* root;
    // Combines BST property (inorder) with heap property (priority)
    // Used in range minimum queries
};


// ============ SPLAY TREE ============
class Node {
    int data;
    Node* left;
    Node* right;
    Node* parent;
};

class SplayTree {
    Node* root;
    // Self-adjusting BST
    // Recently accessed elements move to root (splaying)
    // Amortized O(log n) operations
};


// ============ KD TREE (K-Dimensional Tree) ============
class Node {
    int* point;    // K-dimensional point
    Node* left;
    Node* right;
    int dimension; // Which dimension to split on
};

class KDTree {
    Node* root;
    int k;  // Number of dimensions
    // Used for multidimensional search (e.g., nearest neighbor)
    // Alternates splitting dimension at each level
};