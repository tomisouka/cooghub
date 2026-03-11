#include <queue>
#include <stack>
#include <algorithm>

struct Node {
    int data;
    Node* left;
    Node* right;
    int height;  // For AVL
};

// ============ INORDER TRAVERSAL (RECURSIVE) ============
// Type: Recursive
// Time: O(n)
// Space: O(h) where h is height
// Use: Get sorted order in BST

void inorderRecursive(Node* root) {
    if (root == nullptr) return;
    inorderRecursive(root->left);
    // Process root->data here
    inorderRecursive(root->right);
}


// ============ INORDER TRAVERSAL (ITERATIVE) ============
// Type: Iterative (uses stack)
// Time: O(n)
// Space: O(h)
// Use: Get sorted order without recursion

void inorderIterative(Node* root) {
    std::stack<Node*> s;
    Node* curr = root;
    
    while (curr != nullptr || !s.empty()) {
        while (curr != nullptr) {
            s.push(curr);
            curr = curr->left;
        }
        curr = s.top();
        s.pop();
        // Process curr->data here
        curr = curr->right;
    }
}


// ============ PREORDER TRAVERSAL (RECURSIVE) ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Copy tree, prefix expression

void preorderRecursive(Node* root) {
    if (root == nullptr) return;
    // Process root->data here
    preorderRecursive(root->left);
    preorderRecursive(root->right);
}


// ============ PREORDER TRAVERSAL (ITERATIVE) ============
// Type: Iterative (uses stack)
// Time: O(n)
// Space: O(h)
// Use: Copy tree without recursion

void preorderIterative(Node* root) {
    if (root == nullptr) return;
    std::stack<Node*> s;
    s.push(root);
    
    while (!s.empty()) {
        Node* curr = s.top();
        s.pop();
        // Process curr->data here
        
        if (curr->right) s.push(curr->right);
        if (curr->left) s.push(curr->left);
    }
}


// ============ POSTORDER TRAVERSAL (RECURSIVE) ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Delete tree, postfix expression

void postorderRecursive(Node* root) {
    if (root == nullptr) return;
    postorderRecursive(root->left);
    postorderRecursive(root->right);
    // Process root->data here
}


// ============ POSTORDER TRAVERSAL (ITERATIVE) ============
// Type: Iterative (uses two stacks)
// Time: O(n)
// Space: O(h)
// Use: Delete tree without recursion

void postorderIterative(Node* root) {
    if (root == nullptr) return;
    std::stack<Node*> s1, s2;
    s1.push(root);
    
    while (!s1.empty()) {
        Node* curr = s1.top();
        s1.pop();
        s2.push(curr);
        
        if (curr->left) s1.push(curr->left);
        if (curr->right) s1.push(curr->right);
    }
    
    while (!s2.empty()) {
        Node* curr = s2.top();
        s2.pop();
        // Process curr->data here
    }
}


// ============ LEVEL-ORDER TRAVERSAL (BFS) ============
// Type: Iterative (uses queue)
// Time: O(n)
// Space: O(w) where w is max width
// Use: Level-by-level processing

void levelOrder(Node* root) {
    if (root == nullptr) return;
    std::queue<Node*> q;
    q.push(root);
    
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        // Process curr->data here
        
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
}


// ============ LOWEST COMMON ANCESTOR (LCA) ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Find common ancestor of two nodes

Node* lowestCommonAncestor(Node* root, int n1, int n2) {
    if (root == nullptr) return nullptr;
    
    if (root->data == n1 || root->data == n2) {
        return root;
    }
    
    Node* left = lowestCommonAncestor(root->left, n1, n2);
    Node* right = lowestCommonAncestor(root->right, n1, n2);
    
    if (left != nullptr && right != nullptr) {
        return root;
    }
    
    return (left != nullptr) ? left : right;
}


// ============ TREE HEIGHT/DEPTH ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Find maximum depth of tree

int height(Node* root) {
    if (root == nullptr) {
        return 0;
    }
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    return std::max(leftHeight, rightHeight) + 1;
}


// ============ CHECK IF BALANCED ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Verify tree is height-balanced

bool isBalanced(Node* root) {
    if (root == nullptr) return true;
    
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    
    if (abs(leftHeight - rightHeight) <= 1 && 
        isBalanced(root->left) && 
        isBalanced(root->right)) {
        return true;
    }
    
    return false;
}


// ============ DIAMETER OF TREE ============
// Type: Recursive
// Time: O(n)
// Space: O(h)
// Use: Find longest path between any two nodes

int diameterUtil(Node* root, int& diameter) {
    if (root == nullptr) return 0;
    
    int leftHeight = diameterUtil(root->left, diameter);
    int rightHeight = diameterUtil(root->right, diameter);
    
    diameter = std::max(diameter, leftHeight + rightHeight);
    
    return std::max(leftHeight, rightHeight) + 1;
}

int diameter(Node* root) {
    int d = 0;
    diameterUtil(root, d);
    return d;
}


// ============ AVL TREE ROTATIONS ============
// Type: Iterative
// Time: O(1)
// Space: O(1)
// Use: Balance AVL trees

int getHeight(Node* node) {
    return node == nullptr ? 0 : node->height;
}

// Right Rotation
Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    y->height = std::max(getHeight(y->left), getHeight(y->right)) + 1;
    x->height = std::max(getHeight(x->left), getHeight(x->right)) + 1;
    
    return x;
}

// Left Rotation
Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    
    y->left = x;
    x->right = T2;
    
    x->height = std::max(getHeight(x->left), getHeight(x->right)) + 1;
    y->height = std::max(getHeight(y->left), getHeight(y->right)) + 1;
    
    return y;
}

// Get balance factor
int getBalance(Node* node) {
    return node == nullptr ? 0 : getHeight(node->left) - getHeight(node->right);
}

// Balance node (handles all 4 cases)
Node* balanceNode(Node* node) {
    int balance = getBalance(node);
    
    // Left-Left Case
    if (balance > 1 && getBalance(node->left) >= 0) {
        return rightRotate(node);
    }
    
    // Left-Right Case
    if (balance > 1 && getBalance(node->left) < 0) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    
    // Right-Right Case
    if (balance < -1 && getBalance(node->right) <= 0) {
        return leftRotate(node);
    }
    
    // Right-Left Case
    if (balance < -1 && getBalance(node->right) > 0) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    
    return node;
}