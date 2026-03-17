// ============ DOUBLY LINKED LIST ============
class Node {
    int data;
    Node* next;
    Node* prev;  // Points to previous node
};

class DoublyLinkedList {
    Node* head;
    Node* tail;
};

// The following are bare bones ADT
// ============ DOUBLY LINKED LIST-BASED STACK ============
class Node {
    int data;
    Node* next;
    Node* prev;
};

class Stack {
    Node* top;
    // push creates new node, sets as top
    // pop removes top, returns data
};


// ============ DOUBLY LINKED LIST-BASED QUEUE ============
class Node {
    int data;
    Node* next;
    Node* prev;
};

class Queue {
    Node* front;  // Dequeue from here
    Node* rear;   // Enqueue here
    // enqueue adds to rear
    // dequeue removes from front
};


// ============ DOUBLY LINKED LIST-BASED DEQUE ============
class Node {
    int data;
    Node* next;
    Node* prev;
};

class Deque {
    Node* front;
    Node* rear;
    // Can insert/delete from both front and rear
};