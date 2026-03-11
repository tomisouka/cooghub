// ============ SINGLY LINKED LIST ============
class Node {
    int data;
    Node* next;
};

class LinkedList {
    Node* head;
    Node* tail;  // Optional, makes append O(1)
};

// The following are bare bones ADT
// ============ LINKED LIST-BASED STACK ============
class Node {
    int data;
    Node* next;
};

class Stack {
    Node* top;
    // push creates new node, sets as top
    // pop removes top, returns data
};


// ============ LINKED LIST-BASED QUEUE ============
class Node {
    int data;
    Node* next;
};

class Queue {
    Node* front;  // Dequeue from here
    Node* rear;   // Enqueue here
    // enqueue adds to rear
    // dequeue removes from front
};


// ============ LINKED LIST-BASED DEQUE (Double-Ended Queue) ============
class Node {
    int data;
    Node* next;
    Node* prev;  // Need doubly linked for efficient both-end operations
};

class Deque {
    Node* front;
    Node* rear;
    // Can insert/delete from both front and rear
};