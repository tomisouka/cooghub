// ============ ARRAY (FIXED) ============
class Array {
    int arr[100];  // Fixed size
};

// The following are bare bones ADT
// ============ ARRAY-BASED STACK ============
class Stack {
    int arr[100];  // Fixed size
    int top;
    // push adds to top
    // pop removes from top
};


// ============ ARRAY-BASED QUEUE ============
class Queue {
    int arr[100];  // Fixed size
    int front;
    int rear;
    int size;
    // enqueue adds to rear
    // dequeue removes from front
    // Circular implementation to reuse space
};


// ============ ARRAY-BASED DEQUE (Double-Ended Queue) ============
class Deque {
    int arr[100];  // Fixed size
    int front;
    int rear;
    int size;
    // Can insert/delete from both front and rear
    // Circular implementation
};