// ============ CIRCULAR SINGLY LINKED LIST ============
class Node {
    int data;
    Node* next;
};

class CircularLinkedList {
    Node* tail;  // tail->next points back to head
    // No head pointer needed, tail->next is the head
};

// The following are bare bones ADT
// ============ CIRCULAR LINKED LIST-BASED STACK ============
class Node {
    int data;
    Node* next;
};

class Stack {
    Node* top;
    // top->next eventually loops back
    // push creates new node, sets as top
    // pop removes top, returns data
};


// ============ CIRCULAR LINKED LIST-BASED QUEUE ============
class Node {
    int data;
    Node* next;
};

class Queue {
    Node* rear;  // rear->next is front
    // enqueue adds after rear
    // dequeue removes from rear->next (front)
};


// ============ CIRCULAR LINKED LIST-BASED DEQUE ============
class Node {
    int data;
    Node* next;
    Node* prev;  // Need doubly linked for efficient both-end operations
};

class Deque {
    Node* head;  // head->prev points to tail, tail->next points to head
    // Can insert/delete from both front and rear
};