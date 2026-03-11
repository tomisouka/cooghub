// ============ HASH TABLE/MAP ADT ============
#include <vector>
class HashTable {
    // Array + collision handling
    
public:
    // Put - O(1) average, O(n) worst
    void put(int key, int value);
    
    // Get - O(1) average, O(n) worst
    int get(int key);
    
    // Remove - O(1) average, O(n) worst
    void remove(int key);
    
    // Contains - O(1) average, O(n) worst
    bool contains(int key);
    
    // Utility
    std::vector<int> keys();
    std::vector<int> values();
    int size();
    bool isEmpty();
};


// ============ HASH SET ADT ============
class HashSet {
    // Array + collision handling (keys only)
    
public:
    // Add - O(1) average, O(n) worst
    void add(int value);
    
    // Remove - O(1) average, O(n) worst
    void remove(int value);
    
    // Contains - O(1) average, O(n) worst
    bool contains(int value);
    
    // Utility
    int size();
    bool isEmpty();
};