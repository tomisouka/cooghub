// ============ ARRAY/LIST ADT ============
class Array {
    int arr[100];
    int size;
    
public:
    // Access - O(1)
    int get(int index);
    
    // Update - O(1)
    void set(int index, int value);
    
    // Insert - O(n)
    void insert(int index, int value);
    
    // Delete - O(n)
    void remove(int index);
    
    // Search - O(n)
    int search(int value);
    
    // Utility
    int length();
    bool isEmpty();
};


// ============ STACK ADT ============
class Stack {
    int* arr;
    int top;
    
public:
    // Push - O(1)
    void push(int value);
    
    // Pop - O(1)
    int pop();
    
    // Peek - O(1)
    int peek();
    
    // Utility
    bool isEmpty();
    int size();
};


// ============ QUEUE ADT ============
class Queue {
    int* arr;
    int front;
    int rear;
    
public:
    // Enqueue - O(1)
    void enqueue(int value);
    
    // Dequeue - O(1)
    int dequeue();
    
    // Front - O(1)
    int front();
    
    // Utility
    bool isEmpty();
    int size();
};


// ============ DEQUE ADT ============
class Deque {
    int* arr;
    int front;
    int rear;
    
public:
    // Push operations - O(1)
    void pushFront(int value);
    void pushBack(int value);
    
    // Pop operations - O(1)
    int popFront();
    int popBack();
    
    // Peek operations - O(1)
    int peekFront();
    int peekBack();
    
    // Utility
    bool isEmpty();
    int size();
};