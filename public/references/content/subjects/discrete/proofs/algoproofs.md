# 🔬 Algorithm Correctness & Complexity Proofs
## Complete Guide to Proving Algorithms Work and Analyzing Their Efficiency

> Master the art of proving your algorithms are correct, efficient, and optimal

---

## 📋 TABLE OF CONTENTS

### 🎯 Foundations of Algorithm Proofs
- [What Makes an Algorithm Correct?](#what-makes-an-algorithm-correct)
- [Types of Correctness Proofs](#types-of-correctness-proofs)
- [Loop Invariants](#loop-invariants)
- [Preconditions and Postconditions](#preconditions-and-postconditions)

### ⏱️ Time Complexity Analysis
- [Counting Operations](#counting-operations)
- [Best, Worst, Average Case](#best-worst-average-case)
- [Amortized Analysis](#amortized-analysis-detailed)
- [Recurrence Relations](#recurrence-relations-for-algorithms)

### 💾 Space Complexity Analysis
- [Memory Usage Proofs](#space-complexity-analysis)
- [In-Place Algorithms](#in-place-algorithms)
- [Stack Space in Recursion](#recursive-space-complexity)

### 🔍 Sorting Algorithm Proofs
- [Bubble Sort](#bubble-sort-proof) - O(n²)
- [Insertion Sort](#insertion-sort-proof) - O(n²)
- [Merge Sort](#merge-sort-proof) - O(n log n)
- [Quick Sort](#quick-sort-proof) - O(n log n) expected
- [Heap Sort](#heap-sort-proof) - O(n log n)
- [Counting Sort](#counting-sort-proof) - O(n+k)

### 🌲 Tree & Graph Algorithm Proofs
- [Binary Search Tree Operations](#bst-operations-proof)
- [AVL Tree Rotations](#avl-tree-proof)
- [Dijkstra's Algorithm](#dijkstras-algorithm-proof)
- [Bellman-Ford Algorithm](#bellman-ford-proof)
- [Kruskal's MST](#kruskals-algorithm-proof)
- [Prim's MST](#prims-algorithm-proof)

### 🎒 Dynamic Programming Proofs
- [Optimal Substructure](#optimal-substructure-proof)
- [Overlapping Subproblems](#overlapping-subproblems)
- [Knapsack Problem](#knapsack-proof)
- [Longest Common Subsequence](#lcs-proof)
- [Matrix Chain Multiplication](#matrix-chain-proof)

### 🔄 Greedy Algorithm Proofs
- [Greedy Choice Property](#greedy-choice-property)
- [Activity Selection](#activity-selection-proof)
- [Huffman Coding](#huffman-coding-proof)
- [Minimum Spanning Tree](#mst-greedy-proof)

### 🔒 Complexity Lower Bounds
- [Decision Tree Model](#decision-tree-lower-bounds)
- [Adversary Arguments](#adversary-arguments)
- [Information-Theoretic Bounds](#information-theoretic-bounds)

### 📊 Practice Problems
- [25 Algorithm Proof Exercises](#-practice-problems)
- [Detailed Solutions](#-detailed-solutions)

---

## 🎯 FOUNDATIONS OF ALGORITHM PROOFS

### <a id="what-makes-an-algorithm-correct"></a>What Makes an Algorithm Correct?

**Definition**: An algorithm is **correct** if:
1. **Termination**: It halts for all valid inputs
2. **Correctness**: When it halts, it produces the correct output

**Three-Part Framework**:
```
1. PRECONDITION: What must be true before algorithm starts
2. ALGORITHM: The procedure itself
3. POSTCONDITION: What must be true when algorithm ends
```

### <a id="types-of-correctness-proofs"></a>Types of Correctness Proofs

**1. Direct Proof**
- Show algorithm satisfies specification directly
- Good for simple algorithms

**2. Proof by Induction**
- On input size n
- On number of loop iterations
- Most common for recursive algorithms

**3. Loop Invariant Method**
- Find property that holds before, during, after each iteration
- Standard technique for iterative algorithms

**4. Proof by Contradiction**
- Assume algorithm produces wrong output
- Show this leads to contradiction

---

### <a id="loop-invariants"></a>Loop Invariants

**Definition**: A loop invariant is a condition that:
1. **Initialization**: True before first iteration
2. **Maintenance**: If true before iteration, remains true after
3. **Termination**: When loop ends, invariant + termination condition → correctness

**Template**:
```
INVARIANT: [Statement about algorithm state]

PROOF:
  Initialization: Show invariant true before loop starts
  Maintenance: Assume true at iteration k, show true at k+1
  Termination: Use invariant + loop exit condition → desired result
∎
```

### Example: Linear Search

**Algorithm**:
```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
```

**PROOF of Correctness**:

**Loop Invariant**: "At the start of iteration i, target is not in arr[0..i-1]"

**Initialization** (i = 0):
- arr[0..−1] is empty → target not in empty subarray ✓

**Maintenance**: 
Assume invariant true at start of iteration i.
- If arr[i] = target: return i (correct!)
- If arr[i] ≠ target: i increments to i+1
  - Invariant for i+1: target not in arr[0..i]
  - This is true because: not in arr[0..i-1] (by IH) and arr[i] ≠ target ✓

**Termination**:
Loop exits when:
- **Case 1**: Found target at position i → return i ✓
- **Case 2**: i = len(arr) → target not in arr[0..len(arr)-1] → return -1 ✓

Therefore algorithm is correct. ∎

---

### <a id="preconditions-and-postconditions"></a>Preconditions and Postconditions

**Formal Specification**:
```
{P} Algorithm {Q}

P = Precondition (input requirements)
Q = Postcondition (output guarantees)
```

**Hoare Triple**: If P is satisfied before algorithm executes, and algorithm terminates, then Q is satisfied after.

### Example: Binary Search

```python
def binary_search(arr, target):
    # PRECONDITION: arr is sorted in ascending order
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
    # POSTCONDITION: returns index i where arr[i] = target,
    #                or -1 if target not in arr
```

**PROOF of Correctness**:

**Loop Invariant**: "If target exists in arr, it's in arr[left..right]"

**Initialization**:
- left = 0, right = len(arr) - 1
- If target in arr, it's in arr[0..len(arr)-1] ✓

**Maintenance**:
Assume target in arr[left..right] at start of iteration.
- If arr[mid] = target: return mid ✓
- If arr[mid] < target: target must be in arr[mid+1..right]
  - Set left = mid + 1 maintains invariant ✓
- If arr[mid] > target: target must be in arr[left..mid-1]
  - Set right = mid - 1 maintains invariant ✓

**Termination**:
- **Case 1**: Found target → return correct index ✓
- **Case 2**: left > right → search space empty → target not in arr → return -1 ✓

**Complexity**: T(n) = T(n/2) + O(1) = **Θ(log n)** ∎

---

## ⏱️ TIME COMPLEXITY ANALYSIS

### <a id="counting-operations"></a>Counting Operations

**Strategy**: Count primitive operations
- Assignments
- Comparisons
- Arithmetic operations
- Array accesses
- Function calls

### Example: Finding Maximum

```python
def find_max(arr):
    max_val = arr[0]          # 1 operation
    for i in range(1, len(arr)):  # n-1 iterations
        if arr[i] > max_val:      # 1 comparison per iteration
            max_val = arr[i]      # 0 or 1 assignment per iteration
    return max_val            # 1 operation
```

**Time Complexity Analysis**:
```
Total operations:
- Initial assignment: 1
- Loop iterations: n-1
- Comparisons: n-1
- Assignments: at most n-1
- Return: 1

T(n) = 1 + (n-1) + (n-1) + (n-1) + 1
     = 3n - 1
     = Θ(n)
```

**PROOF that algorithm is optimal**:

**Lower Bound**: Must examine all n elements (adversary argument)

**Proof**: Suppose algorithm examines only n-1 elements.
- Let unexamined element be x
- Adversary can set x to any value
- If adversary sets x > current max, algorithm gives wrong answer
- Therefore must examine all n elements → **Ω(n)** ∎

Combined with O(n) upper bound → **Θ(n)** is optimal ∎

---

### <a id="best-worst-average-case"></a>Best, Worst, Average Case Analysis

### Example: Insertion Sort

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

**Best Case**: Already sorted array
```
Inner while loop: 0 iterations each time
T_best(n) = Θ(n)
```

**Worst Case**: Reverse sorted array
```
Iteration i: i comparisons and shifts
Total: 1 + 2 + 3 + ... + (n-1) = n(n-1)/2
T_worst(n) = Θ(n²)
```

**Average Case**: Random permutation
```
Each element on average in middle of sorted portion
Expected comparisons at iteration i: i/2

Total: (1 + 2 + ... + (n-1))/2 = n(n-1)/4
T_avg(n) = Θ(n²)
```

**PROOF of Average Case**:

For random permutation:
- Probability that arr[i] < arr[j] for i < j is 1/2
- Expected number of inversions: C(n,2) × 1/2 = n(n-1)/4
- Each swap fixes one inversion
- Therefore expected swaps: **Θ(n²)** ∎

---

### <a id="amortized-analysis-detailed"></a>Amortized Analysis

### Three Methods Compared

**1. Aggregate Method**: Total cost / number of operations

**2. Accounting Method**: Charge different amounts per operation

**3. Potential Method**: Define potential function Φ

### Example: Dynamic Array (Vector)

**Operations**:
- `push_back(x)`: Add element to end
- If full: allocate array of double size, copy all elements

```python
class DynamicArray:
    def __init__(self):
        self.capacity = 1
        self.size = 0
        self.arr = [None]
    
    def push_back(self, x):
        if self.size == self.capacity:
            # Resize: O(n)
            new_arr = [None] * (2 * self.capacity)
            for i in range(self.size):
                new_arr[i] = self.arr[i]
            self.arr = new_arr
            self.capacity *= 2
        
        self.arr[self.size] = x
        self.size += 1
```

### Method 1: Aggregate Analysis

**PROOF**:

Starting from capacity 1, after n push_back operations:

**Copying costs**:
- Copy when size = 1, 2, 4, 8, ..., 2^k where 2^k ≤ n
- Total copies: 1 + 2 + 4 + 8 + ... + 2^k
  = 2^(k+1) - 1
  < 2 × 2^k
  ≤ 2n

**Total cost**: 
- n insertions: n
- Copying: ≤ 2n
- Total: ≤ 3n

**Amortized cost**: 3n / n = **O(1)** per operation ∎

### Method 2: Accounting Method

**Charge $3 per push_back**:
- $1 for the insertion
- $2 "savings" for future copying

**When we double from size k to 2k**:
- Need to copy k elements
- Each of those k elements has $2 saved
- Total saved: $2k
- Cost to copy k elements: $k
- Leftover: $k (for future copies)

**Credit never negative** → Amortized **O(1)** ∎

### Method 3: Potential Method

**Potential Function**: Φ(D) = 2×size - capacity

**Initial**: Φ(D₀) = 0

**Analysis**:

**No resize**: size = s, capacity = c
```
Actual cost: 1
ΔΦ = [2(s+1) - c] - [2s - c] = 2
Amortized = 1 + 2 = 3
```

**Resize**: size = capacity = c
```
Actual cost: c + 1
ΔΦ = [2(c+1) - 2c] - [2c - c] = 2 - c
Amortized = (c + 1) + (2 - c) = 3
```

Both cases: Amortized cost = **O(1)** ∎

---

### <a id="recurrence-relations-for-algorithms"></a>Recurrence Relations for Algorithms

### Template for Divide-and-Conquer

```
T(n) = a·T(n/b) + f(n)

where:
  a = number of recursive calls
  n/b = size of each subproblem
  f(n) = work done outside recursive calls
```

### Master Theorem (Extended)

**Form**: T(n) = a·T(n/b) + f(n)

**Compare** f(n) with n^(log_b a):

**Case 1**: f(n) = O(n^(log_b a - ε)) for some ε > 0
```
→ T(n) = Θ(n^(log_b a))  [recursion dominates]
```

**Case 2**: f(n) = Θ(n^(log_b a) × log^k n) for k ≥ 0
```
→ T(n) = Θ(n^(log_b a) × log^(k+1) n)  [balanced]
```

**Case 3**: f(n) = Ω(n^(log_b a + ε)) for some ε > 0
AND a·f(n/b) ≤ c·f(n) for some c < 1 (regularity condition)
```
→ T(n) = Θ(f(n))  [non-recursive work dominates]
```

---

## 🔍 SORTING ALGORITHM PROOFS

### <a id="bubble-sort-proof"></a>Bubble Sort

**Algorithm**:
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
```

**PROOF of Correctness**:

**Outer Loop Invariant**: "After iteration i, the last i elements are sorted and in final position"

**Initialization** (i = 0): No elements in final position ✓

**Maintenance**: 
Assume last i elements sorted.
- Inner loop bubbles largest element in arr[0..n-i-1] to position n-i-1
- Now last i+1 elements are sorted ✓

**Termination**: After n-1 iterations, last n-1 elements sorted → all n elements sorted ✓

**Time Complexity**:

**Worst Case**: 
```
Outer loop: n iterations
Inner loop iteration i: n - i - 1 comparisons

Total: Σᵢ₌₀ⁿ⁻¹ (n - i - 1)
     = (n-1) + (n-2) + ... + 1 + 0
     = n(n-1)/2
     = Θ(n²)
```

**Best Case** (already sorted):
```
One pass through, no swaps, early termination
T_best(n) = Θ(n)
```

**Space**: O(1) in-place ∎

---

### <a id="insertion-sort-proof"></a>Insertion Sort

**Algorithm**:
```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

**PROOF of Correctness**:

**Loop Invariant**: "At start of iteration i, arr[0..i-1] is sorted"

**Initialization** (i = 1): arr[0..0] has one element → sorted ✓

**Maintenance**:
Assume arr[0..i-1] sorted.
- Insert arr[i] into correct position in arr[0..i-1]
- Shift larger elements right
- Now arr[0..i] is sorted ✓

**Termination**: After i = n, arr[0..n-1] is sorted ✓

**Time Complexity**:

**Best Case**: O(n) - already sorted
**Worst Case**: O(n²) - reverse sorted
**Average Case**: O(n²)

**Space**: O(1) in-place

**When to use**: Small arrays or nearly sorted data ∎

---

### <a id="merge-sort-proof"></a>Merge Sort

**Algorithm**:
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

**PROOF of Correctness** (Induction on n):

**Base Case** (n ≤ 1): Array of size ≤ 1 is sorted ✓

**Inductive Hypothesis**: merge_sort correctly sorts arrays of size < n

**Inductive Step**: For array of size n:
1. Split into two halves of size n/2
2. By IH, both halves sorted correctly
3. merge() combines two sorted arrays into one sorted array

**Proof that merge() is correct**:

**Loop Invariant**: "result contains smallest elements from left and right in sorted order"

- Always append smaller of left[i] or right[j]
- When one array exhausted, append remainder
- Result is sorted ✓

**Time Complexity**:

**Recurrence**: T(n) = 2T(n/2) + Θ(n)

**Master Theorem**:
- a = 2, b = 2, f(n) = n
- n^(log₂ 2) = n
- Case 2: f(n) = Θ(n)

**Result**: T(n) = **Θ(n log n)** in all cases ✓

**Space**: O(n) for auxiliary arrays

**Advantage**: Stable sort, guaranteed O(n log n) ∎

---

### <a id="quick-sort-proof"></a>Quick Sort

**Algorithm**:
```python
def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

**PROOF of Correctness**:

**Partition Invariant**: After partition(arr, low, high):
1. arr[low..pi-1] ≤ pivot
2. arr[pi] = pivot (in final position)
3. arr[pi+1..high] ≥ pivot

**Proof of Partition**:

**Loop Invariant**: 
- arr[low..i] contains elements ≤ pivot
- arr[i+1..j-1] contains elements > pivot
- arr[j..high-1] not yet examined

**Initialization**: i = low-1, no elements in either group ✓

**Maintenance**: 
- If arr[j] ≤ pivot: swap with arr[i+1], increment i
- If arr[j] > pivot: leave in place
- Invariant maintained ✓

**Termination**: All elements examined, swap pivot to position i+1 ✓

**Time Complexity**:

**Best Case**: Balanced partitions
```
T(n) = 2T(n/2) + Θ(n)
     = Θ(n log n)
```

**Worst Case**: Unbalanced partitions (sorted array)
```
T(n) = T(n-1) + Θ(n)
     = Θ(n²)
```

**Average Case**: Random pivot selection
```
E[T(n)] = Θ(n log n)
```

**PROOF of Average Case**:

Using indicator random variables Xᵢⱼ = "i and j are compared"

```
E[comparisons] = E[Σᵢ<ⱼ Xᵢⱼ]
                = Σᵢ<ⱼ P(Xᵢⱼ = 1)
                = Σᵢ<ⱼ 2/(j-i+1)
                = Θ(n log n)
```

**Space**: O(log n) for recursion stack (balanced)

**Randomized QuickSort**: Choose random pivot → expected O(n log n) ∎

---

### <a id="heap-sort-proof"></a>Heap Sort

**Algorithm**:
```python
def heap_sort(arr):
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
```

**PROOF of Correctness**:

**Heap Property**: For max heap, parent ≥ children

**Phase 1 - Build Heap**:

**Loop Invariant**: "Nodes i+1, i+2, ..., n-1 are roots of max heaps"

**Initialization**: Leaves (n/2 to n-1) are trivial heaps ✓

**Maintenance**: 
- heapify(i) assumes left and right subtrees are heaps
- Makes subtree rooted at i a heap
- Now i, i+1, ..., n-1 are heap roots ✓

**Termination**: After i = 0, entire array is a heap ✓

**Phase 2 - Sort**:

**Loop Invariant**: "arr[i+1..n-1] contains largest i elements in sorted order, arr[0..i] is a max heap"

**Maintenance**:
- Swap arr[0] (max) with arr[i]
- Now arr[i..n-1] sorted
- Heapify arr[0..i-1] ✓

**Termination**: All elements sorted ✓

**Time Complexity**:

**Build Heap**: O(n)
- Though heapify is O(log n), sum over all levels:
- Σₕ₌₀^(log n) (n/2^(h+1)) × h = O(n)

**Sorting Phase**: O(n log n)
- n-1 extractions × O(log n) per heapify

**Total**: **Θ(n log n)** in all cases

**Space**: O(1) in-place

**Advantage**: Guaranteed O(n log n), in-place ∎

---

### <a id="counting-sort-proof"></a>Counting Sort

**Algorithm**:
```python
def counting_sort(arr, max_val):
    count = [0] * (max_val + 1)
    output = [0] * len(arr)
    
    # Count occurrences
    for num in arr:
        count[num] += 1
    
    # Cumulative count
    for i in range(1, max_val + 1):
        count[i] += count[i - 1]
    
    # Build output array
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1
    
    return output
```

**PROOF of Correctness**:

**Phase 1**: count[i] = number of elements equal to i ✓

**Phase 2**: count[i] = number of elements ≤ i
- This gives final position of each value

**Phase 3**: Place each element in its correct sorted position
- Traverse backwards to maintain stability
- count[arr[i]] gives position, then decrement ✓

**Time Complexity**:

```
Phase 1: O(n) - count occurrences
Phase 2: O(k) - compute cumulative counts
Phase 3: O(n) - place elements

Total: O(n + k) where k = max_val
```

**Space**: O(n + k)

**When to use**: When k = O(n), i.e., range is not too large

**Advantage**: 
- **Linear time** when k = O(n)
- **Stable** sort
- Not comparison-based → beats O(n log n) lower bound ∎

---

## 🌲 TREE & GRAPH ALGORITHM PROOFS

### <a id="bst-operations-proof"></a>Binary Search Tree Operations

**Insertion**:
```python
def insert(root, key):
    if root is None:
        return Node(key)
    
    if key < root.val:
        root.left = insert(root.left, key)
    elif key > root.val:
        root.right = insert(root.right, key)
    
    return root
```

**PROOF of Correctness**:

**BST Property**: For every node:
- All values in left subtree < node.val
- All values in right subtree > node.val

**Induction on tree size**:

**Base**: Empty tree → create new node ✓

**Inductive Step**: 
- If key < root.val: insert in left subtree (which is BST by IH)
  - Result maintains BST property ✓
- If key > root.val: insert in right subtree (which is BST by IH)
  - Result maintains BST property ✓

**Time Complexity**: O(h) where h = height
- Best case (balanced): O(log n)
- Worst case (skewed): O(n)

---

### <a id="avl-tree-proof"></a>AVL Tree Rotations

**AVL Property**: |height(left) - height(right)| ≤ 1 for all nodes

**Right Rotation**:
```python
def right_rotate(y):
    x = y.left
    T2 = x.right
    
    x.right = y
    y.left = T2
    
    # Update heights
    y.height = max(height(y.left), height(y.right)) + 1
    x.height = max(height(x.left), height(x.right)) + 1
    
    return x
```

**PROOF that rotation maintains BST property**:

**Before rotation**:
```
      y
     / \
    x   C
   / \
  A   B
```

**After rotation**:
```
    x
   / \
  A   y
     / \
    B   C
```

**BST Property Preserved**:
- A < x: Was in left subtree, still in left subtree ✓
- x < B < y: B moves from x's right to y's left, maintains order ✓
- y < C: Was in right subtree, still in right subtree ✓

**PROOF that rotation fixes imbalance**:

Before: height(x) - height(C) = 2 (imbalanced)
After: heights differ by at most 1 ✓

**Time Complexity**: O(1) per rotation

**Insertion Complexity**: O(log n) with at most 2 rotations ∎

---

### <a id="dijkstras-algorithm-proof"></a>Dijkstra's Algorithm

**Algorithm** (with min-heap):
```python
def dijkstra(graph, source):
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    visited = set()
    pq = [(0, source)]  # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if u in visited:
            continue
        visited.add(u)
        
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    
    return dist
```

**PROOF of Correctness**:

**Invariant**: "For all nodes in visited, dist[u] = shortest path distance from source"

**Initialization**: visited = {}, dist[source] = 0 ✓

**Maintenance**: 
When extracting u with smallest dist[u]:

**Claim**: No shorter path to u exists

**Proof by Contradiction**:
Suppose shorter path exists: source → ... → x → y → ... → u

Let (x,y) be first edge where y ∉ visited

Then:
- dist[x] = shortest path to x (by invariant)
- dist[y] ≤ dist[x] + weight(x,y) < dist[u]
- But we extracted u (not y) → dist[u] ≤ dist[y]
- **CONTRADICTION** ⚡

Therefore dist[u] is shortest path ✓

**Termination**: All reachable nodes visited, all have shortest paths ✓

**Time Complexity**:

With binary heap:
- Extract-min: O(log V) × V times = O(V log V)
- Decrease-key: O(log V) × E times = O(E log V)

**Total**: **O((V + E) log V)**

With Fibonacci heap: **O(V log V + E)**

**Requirement**: Non-negative edge weights ∎

---

### <a id="bellman-ford-proof"></a>Bellman-Ford Algorithm

**Algorithm**:
```python
def bellman_ford(graph, source):
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    # Relax all edges |V| - 1 times
    for _ in range(len(graph) - 1):
        for u in graph:
            for v, weight in graph[u]:
                if dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
    
    # Check for negative cycles
    for u in graph:
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                return None  # Negative cycle detected
    
    return dist
```

**PROOF of Correctness**:

**Path Relaxation Property**: If shortest path is p = (v₀, v₁, ..., vₖ):
- After relaxing edges (v₀,v₁), (v₁,v₂), ..., (vᵢ₋₁,vᵢ) in order
- dist[vᵢ] = shortest path distance to vᵢ

**Invariant**: "After iteration i, all shortest paths with ≤ i edges are found"

**Proof by Induction**:

**Base** (i = 0): dist[source] = 0 ✓

**Inductive Step**: 
Assume all shortest paths with ≤ i edges are correct.

Consider shortest path to v with i+1 edges: (v₀, ..., vᵢ, v)
- By IH: dist[vᵢ] is correct
- Relaxing edge (vᵢ, v) sets dist[v] = dist[vᵢ] + weight(vᵢ,v)
- This is the shortest path with i+1 edges ✓

**Termination**: After |V|-1 iterations, all shortest paths found (max |V|-1 edges) ✓

**Negative Cycle Detection**:
If we can still relax an edge, a negative cycle exists ✓

**Time Complexity**: **O(VE)**

**Advantage**: Works with negative edges (but not negative cycles) ∎

---

### <a id="kruskals-algorithm-proof"></a>Kruskal's Algorithm (MST)

**Algorithm**:
```python
def kruskal(graph):
    edges = []
    for u in graph:
        for v, weight in graph[u]:
            edges.append((weight, u, v))
    
    edges.sort()  # Sort by weight
    
    parent = {node: node for node in graph}
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    mst = []
    for weight, u, v in edges:
        if find(u) != find(v):
            mst.append((u, v, weight))
            union(u, v)
    
    return mst
```

**PROOF of Correctness** (Cut Property):

**Cut Property**: For any cut (S, V-S), the minimum weight edge crossing the cut is in some MST.

**Greedy Choice Property**: Kruskal always picks minimum weight edge that doesn't create cycle.

**Proof by Induction** on number of edges:

**Base**: No edges selected → trivially correct ✓

**Inductive Step**: 
Assume first k edges form forest F that's part of some MST T.

Next edge e = (u,v) is minimum weight edge not creating cycle in F.

**Case 1**: e ∈ T → T still contains F ∪ {e} ✓

**Case 2**: e ∉ T
- Adding e to T creates cycle C
- C contains another edge e' connecting components of F
- Since edges sorted, weight(e) ≤ weight(e')
- MST T' = T - {e'} + {e} has weight ≤ T
- Therefore T' is also MST containing F ∪ {e} ✓

**Termination**: Algorithm produces spanning tree with minimum weight ✓

**Time Complexity**:
- Sort edges: O(E log E)
- Union-Find: O(E × α(V)) where α is inverse Ackermann
- **Total**: **O(E log E)** or **O(E log V)** ∎

---

### <a id="prims-algorithm-proof"></a>Prim's Algorithm (MST)

**Algorithm**:
```python
def prim(graph, start):
    mst = []
    visited = {start}
    edges = [(weight, start, to) for to, weight in graph[start]]
    heapq.heapify(edges)
    
    while edges:
        weight, frm, to = heapq.heappop(edges)
        
        if to in visited:
            continue
        
        visited.add(to)
        mst.append((frm, to, weight))
        
        for next_to, next_weight in graph[to]:
            if next_to not in visited:
                heapq.heappush(edges, (next_weight, to, next_to))
    
    return mst
```

**PROOF of Correctness** (Growing Tree Property):

**Invariant**: "Tree T is subset of some MST"

**Initialization**: T = {start} is subset of MST ✓

**Maintenance**:
Pick minimum weight edge (u,v) where u ∈ T, v ∉ T

**By Cut Property**: This edge is in some MST containing T

Therefore T ∪ {(u,v)} is subset of MST ✓

**Termination**: When all vertices added, T is spanning tree with minimum weight ✓

**Time Complexity**:
- With binary heap: **O(E log V)**
- With Fibonacci heap: **O(E + V log V)**

**Comparison with Kruskal**:
- Prim: Better for dense graphs
- Kruskal: Better for sparse graphs ∎

---

## 🎒 DYNAMIC PROGRAMMING PROOFS

### <a id="optimal-substructure-proof"></a>Optimal Substructure

**Definition**: Optimal solution contains optimal solutions to subproblems

### <a id="overlapping-subproblems"></a>Overlapping Subproblems

**Definition**: Same subproblems solved multiple times

**Two conditions needed for DP**:
1. Optimal substructure
2. Overlapping subproblems

---

### <a id="knapsack-proof"></a>0/1 Knapsack Problem

**Problem**: Given n items with weights wᵢ and values vᵢ, and capacity W, maximize value without exceeding capacity.

**Algorithm**:
```python
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(W + 1):
            # Don't take item i
            dp[i][w] = dp[i-1][w]
            
            # Take item i (if fits)
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], 
                              dp[i-1][w - weights[i-1]] + values[i-1])
    
    return dp[n][W]
```

**PROOF of Correctness**:

**Optimal Substructure**:

For optimal solution to items {1,...,i} with capacity w:

**Case 1**: Item i not in optimal solution
- Optimal value = optimal solution for items {1,...,i-1} with capacity w

**Case 2**: Item i in optimal solution
- Optimal value = vᵢ + optimal solution for items {1,...,i-1} with capacity w-wᵢ

**Recurrence**:
```
dp[i][w] = max(dp[i-1][w], 
               dp[i-1][w-wᵢ] + vᵢ)
```

**Base Case**: dp[0][w] = 0 (no items → value 0) ✓

**Proof by Induction** on i:

Assume dp[i-1][·] is correct for all capacities.

**Case 1**: Don't take item i
- dp[i][w] = dp[i-1][w] is optimal by IH ✓

**Case 2**: Take item i
- dp[i][w] = dp[i-1][w-wᵢ] + vᵢ is optimal by IH ✓

Taking max gives optimal solution ✓

**Time Complexity**: **O(nW)**
**Space**: O(nW), can optimize to O(W)

**Note**: Pseudo-polynomial (polynomial in W, which is exponential in bits) ∎

---

### <a id="lcs-proof"></a>Longest Common Subsequence

**Problem**: Find longest subsequence common to two sequences

**Algorithm**:
```python
def lcs(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

**PROOF of Optimal Substructure**:

Let X = (x₁, ..., xₘ) and Y = (y₁, ..., yₙ)

**Case 1**: xₘ = yₙ
- LCS ends with xₘ = yₙ
- Remaining is LCS of X[1..m-1] and Y[1..n-1]

**Case 2**: xₘ ≠ yₙ
- LCS doesn't include xₘ or doesn't include yₙ (or both)
- LCS is max of:
  - LCS(X[1..m-1], Y[1..n])
  - LCS(X[1..m], Y[1..n-1])

**Recurrence**:
```
       ⎧ dp[i-1][j-1] + 1         if X[i] = Y[j]
dp[i][j] = ⎨
       ⎩ max(dp[i-1][j], dp[i][j-1])  otherwise
```

**Time Complexity**: **O(mn)**
**Space**: O(mn), can optimize to O(min(m,n)) ∎

---

### <a id="matrix-chain-proof"></a>Matrix Chain Multiplication

**Problem**: Given matrices A₁,...,Aₙ with dimensions p₀×p₁, p₁×p₂, ..., pₙ₋₁×pₙ, find optimal parenthesization to minimize scalar multiplications.

**Algorithm**:
```python
def matrix_chain_order(p):
    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for k in range(i, j):
                cost = (dp[i][k] + dp[k+1][j] + 
                       p[i] * p[k+1] * p[j+1])
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[0][n-1]
```

**PROOF of Optimal Substructure**:

Optimal parenthesization of Aᵢ...Aⱼ splits at some k:
```
(Aᵢ...Aₖ)(Aₖ₊₁...Aⱼ)
```

**Cost** = Cost(Aᵢ...Aₖ) + Cost(Aₖ₊₁...Aⱼ) + pᵢ × pₖ₊₁ × pⱼ₊₁

For optimal solution, both subchains must be optimal (otherwise could improve)

**Recurrence**:
```
dp[i][j] = min{dp[i][k] + dp[k+1][j] + pᵢ·pₖ₊₁·pⱼ₊₁}  for i ≤ k < j
```

**Time Complexity**: **O(n³)**
**Space**: O(n²) ∎

---

## 🔄 GREEDY ALGORITHM PROOFS

### <a id="greedy-choice-property"></a>Greedy Choice Property

**Definition**: Can make locally optimal choice at each step and reach global optimum

**Two properties needed**:
1. **Greedy Choice Property**: Locally optimal choice leads to globally optimal solution
2. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems

---

### <a id="activity-selection-proof"></a>Activity Selection

**Problem**: Select maximum number of non-overlapping activities

**Greedy Strategy**: Always pick activity that finishes earliest

**Algorithm**:
```python
def activity_selection(activities):
    # activities = [(start, end), ...]
    activities.sort(key=lambda x: x[1])  # Sort by end time
    
    selected = [activities[0]]
    last_end = activities[0][1]
    
    for start, end in activities[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected
```

**PROOF of Correctness** (Exchange Argument):

**Claim**: Greedy solution is optimal

**Proof by Induction**:

Let A = {a₁, ..., aₙ} be activities sorted by finish time
Let G = greedy solution, O = optimal solution

**If G = O**: Done ✓

**If G ≠ O**: Let aₖ be first activity in G but not in O

Since O is optimal, |O| ≥ |G|

**Exchange**: Replace first activity in O with a₁
- a₁ finishes earliest
- Any activity compatible with first activity in O is compatible with a₁
- New solution O' has same size as O and includes a₁

**Repeat**: Continue replacing to make O' = G

Therefore G is optimal ✓

**Time Complexity**: **O(n log n)** for sorting ∎

---

### <a id="huffman-coding-proof"></a>Huffman Coding

**Problem**: Optimal prefix-free binary code for given character frequencies

**Greedy Strategy**: Repeatedly combine two least frequent symbols

**Algorithm**:
```python
def huffman_coding(freq):
    import heapq
    
    heap = [(f, i, chr(i)) for i, f in enumerate(freq)]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        f1, _, left = heapq.heappop(heap)
        f2, _, right = heapq.heappop(heap)
        
        merged_freq = f1 + f2
        merged_node = (left, right)
        heapq.heappush(heap, (merged_freq, id(merged_node), merged_node))
    
    return heap[0][2]
```

**PROOF of Correctness**:

**Lemma 1**: Two lowest frequency characters can be sibling leaves in optimal tree

**Proof**: 
Let x, y be lowest frequency characters
Let a, b be siblings at maximum depth in optimal tree T

**Exchange**: Swap x with a, y with b → tree T'
- Cost(T') = Cost(T) + (fₐ - fₓ)·dₐ + (f_b - f_y)·d_b
- Since fₓ ≤ fₐ and f_y ≤ f_b and dₐ ≥ d_x, d_b ≥ d_y
- Cost(T') ≤ Cost(T)

Therefore T' is optimal with x, y as siblings ✓

**Lemma 2**: If x, y are siblings, can replace with single node of frequency fₓ + f_y

**Proof by Induction** on number of characters:

**Base**: One character → trivial ✓

**Inductive Step**:
- Combine x, y into z with f_z = fₓ + f_y
- By IH, Huffman on remaining characters is optimal
- By Lemma 1, x and y can be siblings
- Therefore overall tree is optimal ✓

**Time Complexity**: **O(n log n)** with heap ∎

---

## 🔒 COMPLEXITY LOWER BOUNDS

### <a id="decision-tree-lower-bounds"></a>Decision Tree Model

**For comparison-based algorithms**:
- Each comparison is binary decision (a < b?)
- Decision tree represents all possible execution paths
- Height = worst-case number of comparisons

### Comparison-Based Sorting Lower Bound

**THEOREM**: Any comparison-based sorting algorithm requires Ω(n log n) comparisons in worst case.

**PROOF**:

**Setup**:
- n! possible permutations of n elements
- Each permutation corresponds to one leaf in decision tree
- Decision tree has ≥ n! leaves

**Tree Height**:
- Binary tree with L leaves has height ≥ log₂ L
- Height h ≥ log₂(n!)

**Stirling's Approximation**: n! ≈ √(2πn) (n/e)ⁿ

```
log₂(n!) = log₂(√(2πn) (n/e)ⁿ)
         = (1/2)log₂(2πn) + n log₂(n/e)
         = O(1) + n log₂ n - n log₂ e
         = Θ(n log n)
```

Therefore: h = **Ω(n log n)** ∎

**Corollary**: Merge sort and heap sort are asymptotically optimal ∎

---

### <a id="adversary-arguments"></a>Adversary Arguments

**Technique**: Construct adversary that forces algorithm to do maximum work

### Example: Finding Both Min and Max

**THEOREM**: Finding both min and max requires at least ⌈3n/2⌉ - 2 comparisons.

**PROOF** (Adversary):

**Algorithm Strategy**: Divide elements into pairs, compare within pairs
- Winners (larger): candidates for max
- Losers (smaller): candidates for min

**Counting**:
- Pair comparisons: ⌊n/2⌋
- Find max among winners: n/2 - 1 comparisons
- Find min among losers: n/2 - 1 comparisons

**Total**: 
```
⌊n/2⌋ + 2(⌈n/2⌉ - 1)
= ⌊n/2⌋ + ⌈n/2⌉ + ⌈n/2⌉ - 2
= n + ⌈n/2⌉ - 2
= ⌈3n/2⌉ - 2
```

**Lower Bound Proof**:
- Element becomes candidate for max: must win a comparison
- Element becomes candidate for min: must lose a comparison
- n-2 elements (except final min and max) need both types
- Final min: only losses
- Final max: only wins

Minimum comparisons = ⌈3n/2⌉ - 2 ✓

**Therefore algorithm is optimal** ∎

---

### <a id="information-theoretic-bounds"></a>Information-Theoretic Bounds

**Principle**: Must extract enough information to determine answer

### Example: Element Uniqueness

**THEOREM**: Determining if all elements in array are distinct requires Ω(n log n) comparisons.

**PROOF** (Reduction from Sorting):

**Suppose** uniqueness solvable in o(n log n) comparisons.

**Then** we can sort in o(n log n):
1. Check uniqueness: o(n log n)
2. If not unique: done (elements not sortable uniquely)
3. If unique: Use uniqueness info to sort in O(n) additional comparisons

**Total**: o(n log n) + O(n) = o(n log n)

**But** sorting requires Ω(n log n)

**CONTRADICTION** ⚡

Therefore uniqueness requires **Ω(n log n)** ∎

---

## 📊 PRACTICE PROBLEMS

### Algorithm Correctness (Problems 1-8)

1. **Prove correctness of selection sort** using loop invariants

2. **Binary search invariant**: Prove loop invariant holds throughout

3. **Kadane's algorithm** (max subarray sum): Prove correctness

4. **Dutch National Flag**: Prove 3-way partitioning is correct

5. **Floyd's cycle detection**: Prove tortoise and hare algorithm works

6. **Euclidean algorithm** (GCD): Prove correctness by strong induction

7. **Topological sort** (DFS): Prove produces valid ordering

8. **Union-Find with path compression**: Prove maintains disjoint sets

### Time Complexity Analysis (Problems 9-16)

9. Analyze: `for i in range(n): for j in range(i, n, i): print(j)`

10. **Fibonacci recursive** vs **iterative** vs **matrix**: Compare time

11. **Two-pointer technique** for 2-sum: Prove O(n) with sorted array

12. **Rabin-Karp string matching**: Prove expected O(n+m)

13. **Reservoir sampling**: Prove uniformly random in O(n) time

14. **QuickSelect**: Prove expected O(n) for finding kth element

15. **Median of medians**: Prove worst-case O(n) selection

16. **Tarjan's SCC**: Prove O(V+E) time complexity

### Space Complexity (Problems 17-20)

17. **Merge sort**: Can we do O(1) space? Prove or provide counterexample

18. **Tree traversals**: Compare space for recursive vs iterative

19. **BFS vs DFS**: Which uses more space? Prove bounds

20. **Dynamic programming**: Space-optimize Fibonacci, LCS, knapsack

### Advanced Proofs (Problems 21-25)

21. **Prove NP-completeness** of 3-SAT reduction to Clique

22. **Approximation algorithm**: Prove 2-approximation for Vertex Cover

23. **Randomized algorithm**: Analyze Las Vegas vs Monte Carlo algorithms

24. **Online algorithm**: Prove competitive ratio for paging

25. **Parallel algorithm**: Prove work and span for parallel merge sort

---

## ✨ DETAILED SOLUTIONS

### Solution 1: Selection Sort

**Algorithm**:
```python
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
```

**Loop Invariant**: "After iteration i, arr[0..i-1] contains i smallest elements in sorted order"

**Initialization** (i=0): arr[0..-1] is empty → trivially sorted ✓

**Maintenance**:
- Find minimum in arr[i..n-1]
- Swap with arr[i]
- Now arr[0..i] contains i+1 smallest elements sorted ✓

**Termination**: After i=n-1, arr[0..n-1] is sorted ✓

**Time**: Θ(n²) always (must scan remaining elements)

---

### Solution 3: Kadane's Algorithm

**Algorithm**:
```python
def max_subarray(arr):
    max_ending_here = max_so_far = arr[0]
    
    for x in arr[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

**Loop Invariant**: "max_ending_here = maximum sum ending at current position"

**Proof**: 
For position i, either:
1. Start new subarray at i: max = arr[i]
2. Extend previous: max = max_ending_here + arr[i]

Take maximum of both ✓

**Correctness**: max_so_far tracks overall maximum ✓

**Time**: O(n), **optimal** (must examine all elements)

---

### Solution 10: Fibonacci Comparison

**Recursive** (naive):
```python
def fib_recursive(n):
    if n <= 1:
        return n
    return fib_recursive(n-1) + fib_recursive(n-2)
```
Time: T(n) = T(n-1) + T(n-2) + O(1) = **Θ(φⁿ)** where φ ≈ 1.618

**Iterative**:
```python
def fib_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a + b
    return b
```
Time: **Θ(n)**

**Matrix** (using fast exponentiation):
```python
def fib_matrix(n):
    def matrix_mult(A, B):
        return [[A[0][0]*B[0][0] + A[0][1]*B[1][0],
                A[0][0]*B[0][1] + A[0][1]*B[1][1]],
                [A[1][0]*B[0][0] + A[1][1]*B[1][0],
                A[1][0]*B[0][1] + A[1][1]*B[1][1]]]
    
    def matrix_power(M, n):
        if n == 1:
            return M
        if n % 2 == 0:
            half = matrix_power(M, n // 2)
            return matrix_mult(half, half)
        return matrix_mult(M, matrix_power(M, n-1))
    
    if n <= 1:
        return n
    M = [[1, 1], [1, 0]]
    result = matrix_power(M, n)
    return result[0][1]
```
Time: **Θ(log n)** - **fastest!**

---

## 🎓 KEY TAKEAWAYS

1. **Loop invariants** are powerful for proving iterative algorithms
2. **Induction** is natural for recursive algorithms
3. **Recurrence relations** capture divide-and-conquer complexity
4. **Master Theorem** solves most divide-and-conquer recurrences
5. **Amortized analysis** shows average cost over sequences
6. **Lower bounds** prove algorithms are optimal
7. **Greedy algorithms** need exchange arguments or staying ahead proofs
8. **Dynamic programming** needs optimal substructure and overlapping subproblems
9. **Space complexity** often tradeable with time
10. **Decision trees** provide universal lower bounds for comparison-based algorithms

---

## 📖 INDEX

### A
- **Adversary Arguments** - [Finding min/max](#adversary-arguments)
- **Amortized Analysis** - [Dynamic array](#amortized-analysis-detailed), Three methods
- **AVL Trees** - [Rotation proofs](#avl-tree-proof)
- **Average Case** - [Insertion sort](#insertion-sort-proof), [Quick sort](#quick-sort-proof)

### B
- **Bellman-Ford** - [Negative edge handling](#bellman-ford-proof)
- **Best Case** - [Analysis techniques](#best-worst-average-case)
- **Binary Search** - [Correctness proof](#preconditions-and-postconditions)
- **Binary Search Trees** - [Operations](#bst-operations-proof)
- **Bubble Sort** - [Loop invariant proof](#bubble-sort-proof)

### C
- **Complexity Lower Bounds** - [Decision trees](#decision-tree-lower-bounds)
- **Counting Sort** - [Linear time sorting](#counting-sort-proof)

### D
- **Decision Trees** - [Sorting lower bound](#decision-tree-lower-bounds)
- **Dijkstra's Algorithm** - [Correctness proof](#dijkstras-algorithm-proof)
- **Dynamic Programming** - [Knapsack](#knapsack-proof), [LCS](#lcs-proof), [Matrix chain](#matrix-chain-proof)

### G
- **Greedy Algorithms** - [Activity selection](#activity-selection-proof), [Huffman](#huffman-coding-proof)
- **Graph Algorithms** - [Dijkstra](#dijkstras-algorithm-proof), [Bellman-Ford](#bellman-ford-proof)

### H
- **Heap Sort** - [Build heap + extract](#heap-sort-proof)
- **Huffman Coding** - [Optimal prefix codes](#huffman-coding-proof)

### I
- **Information-Theoretic** - [Element uniqueness](#information-theoretic-bounds)
- **Insertion Sort** - [Correctness + complexity](#insertion-sort-proof)
- **In-Place Algorithms** - Space analysis

### K
- **Knapsack** - [0/1 dynamic programming](#knapsack-proof)
- **Kruskal's Algorithm** - [MST greedy proof](#kruskals-algorithm-proof)

### L
- **LCS** - [Longest common subsequence](#lcs-proof)
- **Linear Search** - [Loop invariant example](#loop-invariants)
- **Loop Invariants** - [Definition and method](#loop-invariants)
- **Lower Bounds** - [Sorting Ω(n log n)](#decision-tree-lower-bounds)

### M
- **Master Theorem** - [Extended version](#recurrence-relations-for-algorithms)
- **Matrix Chain** - [Optimal parenthesization](#matrix-chain-proof)
- **Merge Sort** - [Divide-and-conquer proof](#merge-sort-proof)
- **MST** - [Kruskal](#kruskals-algorithm-proof), [Prim](#prims-algorithm-proof)

### O
- **Optimal Substructure** - [DP property](#optimal-substructure-proof)
- **Overlapping Subproblems** - [DP property](#overlapping-subproblems)

### P
- **Postconditions** - [Algorithm specifications](#preconditions-and-postconditions)
- **Preconditions** - [Input requirements](#preconditions-and-postconditions)
- **Prim's Algorithm** - [MST growing tree](#prims-algorithm-proof)

### Q
- **Quick Sort** - [Randomized analysis](#quick-sort-proof)

### R
- **Recurrence Relations** - [Solving techniques](#recurrence-relations-for-algorithms)

### S
- **Sorting Algorithms** - All comparison-based sorts
- **Space Complexity** - [Memory analysis](#space-complexity-analysis)
- **Stirling's Approximation** - Used in lower bound proofs

### T
- **Time Complexity** - [Counting operations](#counting-operations)

### W
- **Worst Case** - [Analysis techniques](#best-worst-average-case)

---

**🚀 Master algorithm proofs and become an expert in correctness and complexity analysis!**

---

*"An algorithm must be seen to be believed."* — Donald Knuth

And with rigorous proofs, we can believe with certainty!

**EOF** 🔬