// Array
class Stack {
    int arr[100];  // Fixed size
    int top;
};

// ============ DYNAMIC ARRAY (Manual Resize) ============
class Stack {
    int* arr;
    int capacity;
    int top;
};

// User must manually call resize when needed:
// if (stack is full) {
//     stack.resize();
// }
// stack.push(value);


// ============ VECTOR (Auto Resize) ============
class Stack {
    int* arr;
    int capacity;
    int top;
    
    void resize() {
        capacity *= 2;
        int* newArr = new int[capacity];
        for (int i = 0; i <= top; i++) newArr[i] = arr[i];
        delete[] arr;
        arr = newArr;
    }
    
    void push(int val) {
        if (top + 1 == capacity) {
            resize();  // AUTO-RESIZES inside push
        }
        arr[++top] = val;
    }
};

// User just calls:
// stack.push(value);  // Handles resizing automatically


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