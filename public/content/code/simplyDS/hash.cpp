// ============ HASH-BASED STRUCTURES - PURE ============

// (None - Hash structures are inherently composite)
// Hash structures require combining arrays with other structures
// for collision handling (linked lists, trees, etc.)


// ============ HASH-BASED STRUCTURES - COMPOSITE ============
#include <vector>

// Hash Table - Chaining (Linked List)
class Node {
    int key;
    int value;
    Node* next;
};

class HashTable {
    Node** table;  // Array of linked lists
    int size;
    // Uses hash function to map keys to indices
    // Collision handling: chaining with linked lists
};


// Hash Set - Chaining (Linked List)
class Node {
    int key;
    Node* next;
};

class HashSet {
    Node** table;  // Array of linked lists
    int size;
    // Stores only keys for membership testing
};


// Hash Table - Open Addressing (Probing)
class HashTable {
    int* keys;     // Array of keys
    int* values;   // Array of values
    bool* occupied;  // Array of flags
    int size;
    // Collision handling: probing (linear, quadratic, double hashing)
};


// Bloom Filter - Probabilistic Set
class BloomFilter {
    bool* bitArray;  // Bit array
    int size;
    // Multiple hash functions
    // Probabilistic membership testing (may have false positives)
};