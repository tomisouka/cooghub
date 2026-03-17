// ============ NODE STRUCTURE ============
struct Node {  // shared node for BinaryTree & BST
    int data;
    Node* left;
    Node* right;
    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};

// ============ BINARY TREE ADT ============
class BinaryTree {
    Node* root;
    
public:
    // Insert - O(n) for general binary tree
    void insert(int value);
    
    // Delete - O(n)
    void remove(int value);
    
    // Search - O(n)
    bool search(int value);
    
    // Traversals - O(n)
    void inorder();      // Left, Root, Right
    void preorder();     // Root, Left, Right
    void postorder();    // Left, Right, Root
    void levelorder();   // Level by level (BFS)
    
    // Utility
    int height();
    int size();
    bool isEmpty();
};


// ============ BINARY SEARCH TREE (BST) ADT ============
class BST {
    Node* root;
    
public:
    // Insert - O(log n) average, O(n) worst
    void insert(int value);
    
    // Delete - O(log n) average, O(n) worst
    void remove(int value);
    
    // Search - O(log n) average, O(n) worst
    bool search(int value);
    
    // Min/Max - O(log n) average, O(n) worst
    int findMin();
    int findMax();
    
    // Successor/Predecessor - O(log n)
    int successor(int value);
    int predecessor(int value);
    
    // Traversals - O(n)
    void inorder();
    void preorder();
    void postorder();
};


// ============ BINARY HEAP ADT (Min/Max) ============
class BinaryHeap {
    int* arr;
    int size;
    
public:
    // Insert - O(log n)
    void insert(int value);
    
    // Extract Min/Max - O(log n)
    int extractMin();  // For min-heap
    int extractMax();  // For max-heap
    
    // Peek - O(1)
    int peek();
    
    // Heapify - O(n)
    void heapify();
    
    // Utility
    bool isEmpty();
    int getSize();
};


// ============ TRIE ADT ============
#include <string>
#include <unordered_map>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    TrieNode() : isEndOfWord(false) {}
};

class Trie {
    TrieNode* root;
    
public:
    // Insert - O(m) where m = word length
    void insert(std::string word);
    
    // Search - O(m)
    bool search(std::string word);
    
    // Prefix search - O(m)
    bool startsWith(std::string prefix);
    
    // Delete - O(m)
    void remove(std::string word);
    
    // Utility
    bool isEmpty();
};