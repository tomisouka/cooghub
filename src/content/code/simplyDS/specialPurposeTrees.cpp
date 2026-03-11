// Heap (Min or Max) AKA Binary Heap
class Heap {
    int* arr;
    int size;
    int capacity;
};


// Trie (Prefix Tree)
class TrieNode {
    TrieNode* children[26];  // for 'a'-'z'
    bool isEndOfWord;
};

class Trie {
    TrieNode* root;
};


// B-Tree (Multi-way)
class BNode {
    int* keys;
    BNode** children;
    int numKeys;
    bool isLeaf;
};

class BTree {
    BNode* root;
    int degree;
};


// Segment Tree
class SegmentTree {
    int* tree;
    int n;
};