# Algorithms: A Complete Guide
## From Problem Solving to Advanced Techniques

---

## Table of Contents
1. [Problem Solving and Algorithms](#problem-solving)
2. [Mathematical Induction](#induction)
3. [Recursion](#recursion)
4. [Divide and Conquer](#divide-conquer)
5. [Dynamic Programming](#dynamic-programming)
6. [Greedy Algorithms](#greedy)
7. [Randomized Algorithms](#randomized)
8. [Hashing and Fingerprinting](#hashing)
9. [Number-Theoretic Algorithms](#number-theory-algos)
10. [Graph Algorithms](#graphs)
11. [NP-Completeness](#np-complete)

---

## Part 1: Problem Solving and Algorithms {#problem-solving}

### 1.1 What is an Algorithm?

**Definition:**
An algorithm is a step-by-step procedure to solve a problem. Think of it as a recipe - a precise set of instructions that, when followed correctly, produces the desired result.

**Key Properties of Algorithms:**
1. **Well-defined inputs**: What data does it need?
2. **Well-defined outputs**: What result does it produce?
3. **Finiteness**: It must terminate (not run forever)
4. **Definiteness**: Each step must be clear and unambiguous
5. **Effectiveness**: Steps must be basic enough to be carried out

**Example: Making a PB&J Sandwich**
```
1. Get two slices of bread
2. Get peanut butter and jelly
3. Spread peanut butter on one slice
4. Spread jelly on the other slice
5. Put the slices together
6. Done!
```

This is an algorithm! It has inputs (ingredients), outputs (sandwich), and clear steps.

---

### 1.2 Two Warm-Up Problems

Let's start with simple problems to understand algorithmic thinking.

#### Problem 1: Find the Celebrity

**Problem Statement:**
You're at a party with n people. A celebrity is someone who:
- Everyone knows the celebrity
- The celebrity knows nobody

You can only ask questions like "Does person A know person B?"
Find the celebrity (if one exists) with minimum questions.

**Naive Approach:**
Ask everyone about everyone else.
- Total questions: n(n-1) ≈ n²

**Clever Algorithm:**
```
1. Start with two people: A and B
2. Ask: "Does A know B?"
   - If YES: A is not the celebrity (celebrities know nobody)
             → Eliminate A, continue with B
   - If NO: B is not the celebrity (everyone knows celebrity)
            → Eliminate B, continue with A
3. Repeat until one candidate remains
4. Verify the candidate is actually a celebrity
```

**Analysis:**
- Each question eliminates one person
- Questions needed: n - 1 to find candidate + 2(n-1) to verify
- Total: 3n - 3 questions (much better than n²!)

**Key Insight:**
Smart algorithms eliminate possibilities efficiently.

---

#### Problem 2: Tiling a Board

**Problem Statement:**
You have a 2×n board and 2×1 dominoes. How many ways can you completely tile the board?

**Small Examples:**
```
n=1:  Only 1 way (one vertical domino)
┌─┐
│ │
└─┘

n=2:  2 ways
┌──┐    ┌─┬─┐
│  │    │ │ │
└──┘    └─┴─┘

n=3:  3 ways
(vertical-vertical-vertical OR horizontal-horizontal + vertical OR vertical + horizontal-horizontal)
```

**Pattern Recognition:**
Let T(n) = number of ways to tile a 2×n board

**Recursive Insight:**
For a 2×n board, you can start with either:
1. One vertical domino → leaves 2×(n-1) board → T(n-1) ways
2. Two horizontal dominoes → leaves 2×(n-2) board → T(n-2) ways

**Recurrence Relation:**
T(n) = T(n-1) + T(n-2)

With T(1) = 1, T(2) = 2

This is the Fibonacci sequence!
- T(3) = T(2) + T(1) = 2 + 1 = 3
- T(4) = T(3) + T(2) = 3 + 2 = 5
- T(5) = 8, T(6) = 13, ...

**Key Insight:**
Breaking problems into smaller subproblems is powerful!

---

### 1.3 Problem: Prime Number Checking

**Problem:** Given integer n, determine if n is prime.

**Understanding the Problem:**
- Prime: A number > 1 whose only divisors are 1 and itself
- Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...
- Non-primes: 4, 6, 8, 9, 10, 12, 14, 15...

**First Attempt - Naive Algorithm:**
```
Algorithm IsPrime(n)
    if n ≤ 1
        return false
    if n = 2
        return true
    for i = 2 to n-1
        if n mod i = 0
            return false  // found a divisor!
    return true  // no divisors found
```

**Analysis:**
- Checks every number from 2 to n-1
- Time complexity: O(n)
- Works, but slow for large n!

**Improvement - Key Insight:**
If n has a divisor d where d > √n, then n/d < √n must also be a divisor.
So we only need to check up to √n!

**Faster Algorithm:**
```
Algorithm FastIsPrime(n)
    if n ≤ 1
        return false
    if n = 2
        return true
    if n is even
        return false
    for i = 3 to √n step 2  // only check odd numbers
        if n mod i = 0
            return false
    return true
```

**Analysis:**
- Time complexity: O(√n)
- Massive improvement! For n = 1,000,000:
  - Naive: 1,000,000 checks
  - Fast: ~1,000 checks

**Example:**
Is 97 prime?
- √97 ≈ 9.85
- Check: 3, 5, 7, 9
- 97 mod 3 = 1 (not divisible)
- 97 mod 5 = 2 (not divisible)
- 97 mod 7 = 6 (not divisible)
- 97 mod 9 = 7 (not divisible)
- Result: 97 is prime! ✓

---

### 1.4 Problem: Search

**Problem:** Given a list of n elements and a target value x, find if x exists in the list.

**Linear Search:**
```
Algorithm LinearSearch(A[1..n], x)
    for i = 1 to n
        if A[i] = x
            return i  // found at position i
    return -1  // not found
```

**Analysis:**
- Best case: O(1) - found at first position
- Worst case: O(n) - not in list or at end
- Average case: O(n) - expected to check n/2 elements

**Binary Search (for sorted arrays):**
```
Algorithm BinarySearch(A[1..n], x)
    left = 1
    right = n
    while left ≤ right
        mid = ⌊(left + right)/2⌋
        if A[mid] = x
            return mid  // found!
        else if A[mid] < x
            left = mid + 1  // search right half
        else
            right = mid - 1  // search left half
    return -1  // not found
```

**How Binary Search Works:**
```
Search for 7 in [1, 3, 5, 7, 9, 11, 13]

Step 1: mid = 4, A[4] = 7
        Found! Return 4

Search for 12 in [1, 3, 5, 7, 9, 11, 13]

Step 1: mid = 4, A[4] = 7 < 12
        Search right half: [9, 11, 13]
        
Step 2: mid = 6, A[6] = 11 < 12
        Search right half: [13]
        
Step 3: mid = 7, A[7] = 13 > 12
        Search left half: []
        
Not found! Return -1
```

**Analysis:**
- Each step cuts search space in half
- If n = 1024, max steps = log₂(1024) = 10
- Time complexity: O(log n)
- Requires sorted array!

**Comparison:**
For n = 1,000,000:
- Linear search: up to 1,000,000 comparisons
- Binary search: at most 20 comparisons

---

### 1.5 The RAM Model of Computation

**What is the RAM Model?**
To analyze algorithms, we need a model of how computers work.

**Random Access Machine (RAM):**
- Has infinite memory (array of cells)
- Each cell holds one number
- Basic operations take constant time:
  - Arithmetic: +, -, ×, ÷, mod
  - Comparison: <, >, =, ≤, ≥
  - Array access: A[i]
  - Assignment: x = y

**Why This Model?**
- Abstracts away hardware details
- Close enough to real computers
- Makes analysis tractable

**Example:**
```
Algorithm Example(n)
    x = 5           // 1 operation (constant time)
    y = x + 3       // 2 operations (constant time)
    for i = 1 to n  // n iterations
        z = i * 2   // 2 operations per iteration
    return z
```

Total operations: 1 + 2 + n(2) = 2n + 3
As n grows, dominated by 2n term → O(n)

---

### 1.6 Asymptotic Notation: Big-O, Big-Ω, and Big-Θ

**Why Do We Need This?**
We want to describe how runtime grows with input size, ignoring:
- Constant factors (computer speed, compiler optimization)
- Lower-order terms (not significant for large n)

#### Big-O Notation (Upper Bound)

**Definition:**
f(n) is O(g(n)) if there exist constants c and n₀ such that:
f(n) ≤ c·g(n) for all n ≥ n₀

**Translation:**
f doesn't grow faster than g (up to constant factors, for large enough n)

**Examples:**

1. **Is 3n + 5 = O(n)?**
   - Need: 3n + 5 ≤ c·n for n ≥ n₀
   - Choose c = 4, n₀ = 5
   - For n ≥ 5: 3n + 5 ≤ 3n + n = 4n ✓
   - Yes! 3n + 5 is O(n)

2. **Is n² = O(n)?**
   - Need: n² ≤ c·n for all large n
   - This means n ≤ c (dividing by n)
   - Can't find constant c that works for all n!
   - No! n² is NOT O(n)

3. **Is 2n² + 3n + 1 = O(n²)?**
   - For large n: 2n² + 3n + 1 ≤ 2n² + 3n² + n² = 6n²
   - Choose c = 6, works for all n ≥ 1
   - Yes! 2n² + 3n + 1 is O(n²)

**Common Big-O Classes (from fastest to slowest):**
- O(1) - Constant
- O(log n) - Logarithmic
- O(n) - Linear
- O(n log n) - Linearithmic
- O(n²) - Quadratic
- O(n³) - Cubic
- O(2ⁿ) - Exponential
- O(n!) - Factorial

#### Big-Ω Notation (Lower Bound)

**Definition:**
f(n) is Ω(g(n)) if there exist constants c and n₀ such that:
f(n) ≥ c·g(n) for all n ≥ n₀

**Translation:**
f grows at least as fast as g

**Example:**
3n² + 5n is Ω(n²) because:
- 3n² + 5n ≥ 3n² for all n ≥ 0
- Choose c = 3, n₀ = 0

#### Big-Θ Notation (Tight Bound)

**Definition:**
f(n) is Θ(g(n)) if f(n) is both O(g(n)) AND Ω(g(n))

**Translation:**
f and g grow at the same rate

**Example:**
3n² + 5n is Θ(n²) because:
- It's O(n²): 3n² + 5n ≤ 6n² for large n
- It's Ω(n²): 3n² + 5n ≥ 3n² for all n
- Therefore Θ(n²) - tight bound!

**Visual Understanding:**
```
If f(n) = Θ(g(n)):

    |
f(n)|     ┌─ c₁·g(n) (upper bound)
    |    ╱
    |   ╱ ← f(n) sandwiched between
    |  ╱
    | ╱
    |╱
    └─ c₂·g(n) (lower bound)
    └──────────────────────── n
```

**Rules for Big-O:**

1. **Drop constant factors:**
   - 5n² + 3n + 7 → O(n²)

2. **Drop lower-order terms:**
   - n³ + n² + n + 1 → O(n³)

3. **Sum of functions:**
   - If f₁(n) is O(g(n)) and f₂(n) is O(h(n))
   - Then f₁(n) + f₂(n) is O(max(g(n), h(n)))
   - Example: O(n²) + O(n log n) = O(n²)

4. **Product of functions:**
   - O(f(n)) · O(g(n)) = O(f(n)·g(n))
   - Example: O(n) · O(log n) = O(n log n)

---

### 1.7 Common Algorithm Runtimes

Let's understand what different runtimes mean in practice:

**O(1) - Constant Time:**
```
Algorithm GetFirstElement(A[1..n])
    return A[1]
```
- Doesn't depend on n
- Always same number of operations
- Examples: Array access, basic arithmetic

**O(log n) - Logarithmic:**
```
Binary search, finding element in balanced BST
```
- Doubles problem size → only adds one step
- Very efficient!
- Examples: Binary search, balanced tree operations

**O(n) - Linear:**
```
Algorithm Sum(A[1..n])
    sum = 0
    for i = 1 to n
        sum = sum + A[i]
    return sum
```
- One pass through the data
- Most basic algorithms
- Examples: Finding max, linear search

**O(n log n) - Linearithmic:**
```
Efficient sorting algorithms
```
- Slightly worse than linear
- Best possible for comparison-based sorting
- Examples: MergeSort, QuickSort, HeapSort

**O(n²) - Quadratic:**
```
Algorithm BubbleSort(A[1..n])
    for i = 1 to n
        for j = 1 to n-i
            if A[j] > A[j+1]
                swap A[j] and A[j+1]
```
- Nested loops over data
- Gets slow quickly
- Examples: Bubble sort, selection sort, simple matrix operations

**O(2ⁿ) - Exponential:**
```
Generate all subsets of n elements
```
- Doubles with each additional element
- Impractical for n > 30
- Examples: Brute force solutions to hard problems

**O(n!) - Factorial:**
```
Generate all permutations of n elements
```
- Extremely slow
- Impractical for n > 10
- Examples: Brute force traveling salesman

**Practical Comparison:**
```
For n = 1,000:

O(1):       1 operation
O(log n):   ~10 operations
O(n):       1,000 operations
O(n log n): ~10,000 operations
O(n²):      1,000,000 operations
O(2ⁿ):      10³⁰⁰+ operations (impossible!)
O(n!):      Way beyond universe's atoms!
```

---

### 1.8 Analyzing Algorithm Runtime

**Step-by-Step Process:**

**Example 1: Simple Loop**
```
Algorithm Example1(n)
    sum = 0              // 1 operation
    for i = 1 to n       // n iterations
        sum = sum + i    // 2 operations per iteration
    return sum           // 1 operation
```

Analysis:
- Setup: 1 operation
- Loop: n iterations × 2 operations = 2n
- Return: 1 operation
- Total: 1 + 2n + 1 = 2n + 2
- **Runtime: O(n)**

**Example 2: Nested Loops**
```
Algorithm Example2(n)
    count = 0
    for i = 1 to n
        for j = 1 to n
            count = count + 1
    return count
```

Analysis:
- Outer loop: n iterations
- Inner loop: n iterations for each outer iteration
- Total: n × n = n²
- **Runtime: O(n²)**

**Example 3: Halving Loop**
```
Algorithm Example3(n)
    i = n
    while i > 1
        i = i / 2
        // do something
```

Analysis:
- How many times can we halve n before reaching 1?
- n, n/2, n/4, n/8, ..., 2, 1
- After k steps: n/2ᵏ = 1
- Solving: 2ᵏ = n, so k = log₂ n
- **Runtime: O(log n)**

**Example 4: Logarithmic Growth**
```
Algorithm Example4(n)
    i = 1
    while i < n
        i = i * 2
        // do something
```

Analysis:
- Sequence: 1, 2, 4, 8, 16, ..., until i ≥ n
- After k steps: i = 2ᵏ
- Stop when 2ᵏ ≥ n, so k = log₂ n
- **Runtime: O(log n)**

**Example 5: Two Separate Loops**
```
Algorithm Example5(n)
    for i = 1 to n
        // do something    // O(n)
    
    for j = 1 to n
        for k = 1 to n
            // do something  // O(n²)
```

Analysis:
- First loop: O(n)
- Second loop: O(n²)
- Total: O(n) + O(n²) = O(n²)  (larger term dominates)

---

### 1.9 Best, Worst, and Average Case

**Different Cases Matter:**

**Example: Linear Search**
```
Algorithm LinearSearch(A[1..n], x)
    for i = 1 to n
        if A[i] = x
            return i
    return -1
```

**Best Case: Θ(1)**
- Target is at first position
- Only 1 comparison needed

**Worst Case: Θ(n)**
- Target not in array or at end
- Must check all n elements

**Average Case: Θ(n)**
- On average, find target halfway through
- Expected comparisons: n/2
- Still Θ(n) (constant factor doesn't matter)

**Which Case to Report?**
- Usually report **worst case** (most common)
- Sometimes average case for randomized algorithms
- Best case rarely useful (too optimistic)

---

### 1.10 Space Complexity

**Not Just Time!**
Algorithms also use memory (space).

**Space Complexity:**
Amount of memory used as a function of input size.

**Example 1: Constant Space**
```
Algorithm Sum(A[1..n])
    sum = 0      // 1 variable
    for i = 1 to n
        sum = sum + A[i]
    return sum
```
- Only uses variable `sum` (and loop counter)
- **Space: O(1)** - doesn't grow with n
- (Not counting input array itself)

**Example 2: Linear Space**
```
Algorithm CopyArray(A[1..n])
    B[1..n] = new array
    for i = 1 to n
        B[i] = A[i]
    return B
```
- Creates new array of size n
- **Space: O(n)**

**Example 3: Recursive Space**
```
Algorithm Factorial(n)
    if n = 0
        return 1
    return n * Factorial(n-1)
```
- Each recursive call uses stack space
- Maximum depth: n
- **Space: O(n)** due to call stack

**Time-Space Tradeoffs:**
Often can trade time for space or vice versa.

Example: Computing Fibonacci numbers
1. Recursive: O(2ⁿ) time, O(n) space
2. Iterative: O(n) time, O(1) space
3. Memoization: O(n) time, O(n) space

---

This covers the fundamentals of problem-solving and algorithm analysis! You now understand:
- What algorithms are
- How to think about problems algorithmically
- How to measure and compare algorithm efficiency
- The key asymptotic notations (Big-O, Big-Ω, Big-Θ)
- Common runtime classes and what they mean
- How to analyze simple algorithms

**Next:** We'll build on this foundation with mathematical induction, then dive into powerful algorithm design techniques!

---

## Part 2: Mathematical Induction and Algorithms {#induction}

Mathematical induction is a proof technique that's incredibly powerful for proving algorithm correctness and analyzing recursive algorithms.

### 2.1 The Principle of Mathematical Induction

**What is it?**
A method to prove statements about all natural numbers (or any well-ordered set).

**The Domino Analogy:**
Imagine an infinite line of dominoes:
1. If the first domino falls (base case)
2. And each domino knocks down the next (inductive step)
3. Then all dominoes fall (conclusion)

**Formal Structure:**

**To prove P(n) is true for all n ≥ 1:**

1. **Base Case:** Prove P(1) is true

2. **Inductive Hypothesis:** Assume P(k) is true for some arbitrary k ≥ 1

3. **Inductive Step:** Prove that P(k) → P(k+1)
   (If P(k) is true, then P(k+1) must be true)

4. **Conclusion:** By induction, P(n) is true for all n ≥ 1

---

### 2.2 Example: Sum of First n Natural Numbers

**Claim:** 1 + 2 + 3 + ... + n = n(n+1)/2

**Proof by Induction:**

**Base Case (n = 1):**
- Left side: 1
- Right side: 1(1+1)/2 = 1
- ✓ True for n = 1

**Inductive Hypothesis:**
Assume the formula holds for n = k:
1 + 2 + 3 + ... + k = k(k+1)/2

**Inductive Step:**
We need to show it holds for n = k+1:
1 + 2 + 3 + ... + k + (k+1) = (k+1)(k+2)/2

Starting from left side:
```
1 + 2 + ... + k + (k+1)
= [1 + 2 + ... + k] + (k+1)
= k(k+1)/2 + (k+1)           [by inductive hypothesis]
= k(k+1)/2 + 2(k+1)/2
= (k+1)(k+2)/2               ✓
```

**Conclusion:**
By induction, the formula holds for all n ≥ 1. ∎

---

### 2.3 Celebrity Problem Revisited

**Using Induction to Prove Correctness:**

**Algorithm Reminder:**
```
FindCelebrity(people[1..n])
    candidate = 1
    for i = 2 to n
        if candidate knows i
            candidate = i
    // verify candidate
    for i = 1 to n
        if i ≠ candidate
            if candidate knows i OR i doesn't know candidate
                return "No celebrity"
    return candidate
```

**Claim:** After the first loop, if there's a celebrity, it must be the candidate.

**Proof by Induction:**

**Base Case (n = 2):**
- Compare person 1 and 2
- If 1 knows 2: candidate = 2 (1 can't be celebrity)
- If 1 doesn't know 2: candidate = 1 (2 can't be celebrity)
- ✓ Correct for n = 2

**Inductive Hypothesis:**
Assume algorithm correctly identifies candidate among first k people.

**Inductive Step:**
When we add person k+1:
- Ask: "Does candidate know k+1?"
  - If YES: candidate knows someone → can't be celebrity
           → Update candidate to k+1
  - If NO: k+1 knows candidate (or we'd find out in verification)
          → k+1 can't be celebrity
          → Keep current candidate

Either way, we've correctly eliminated one person!

**Conclusion:**
By induction, after n-1 comparisons, if a celebrity exists, they're the candidate. ∎

---

### 2.4 Tiling Problem Revisited

**Recall:** Ways to tile a 2×n board with 2×1 dominoes.

**Claim:** T(n) = T(n-1) + T(n-2) where T(1) = 1, T(2) = 2

**Proof by Strong Induction:**

Strong induction assumes P(1), P(2), ..., P(k) all hold when proving P(k+1).

**Base Cases:**
- T(1) = 1 ✓ (one vertical domino)
- T(2) = 2 ✓ (two vertical OR two horizontal)

**Inductive Hypothesis:**
Assume T(i) = T(i-1) + T(i-2) holds for all i ≤ k

**Inductive Step:**
For a 2×(k+1) board, first tile can be:

1. **Vertical domino:** Leaves 2×k board
   - Can tile in T(k) ways

2. **Two horizontal dominoes:** Leaves 2×(k-1) board
   - Can tile in T(k-1) ways

Total: T(k+1) = T(k) + T(k-1) ✓

**Conclusion:**
By strong induction, the recurrence holds for all n ≥ 1. ∎

---

### 2.5 Using Induction for Loop Invariants

**Loop Invariant:**
A property that remains true before and after each iteration of a loop.

**Why Useful?**
Helps prove algorithm correctness!

**Example: Insertion Sort**
```
Algorithm InsertionSort(A[1..n])
    for j = 2 to n
        key = A[j]
        i = j - 1
        while i > 0 AND A[i] > key
            A[i+1] = A[i]
            i = i - 1
        A[i+1] = key
```

**Loop Invariant:**
"At the start of each iteration of the outer loop, the subarray A[1..j-1] is sorted."

**Proof:**

**Initialization (Base Case):**
- Before first iteration (j = 2), subarray A[1..1] contains one element
- One element is trivially sorted ✓

**Maintenance (Inductive Step):**
- Assume A[1..j-1] is sorted before iteration j
- Inner loop inserts A[j] into correct position
- After iteration, A[1..j] is sorted ✓

**Termination:**
- Loop ends when j = n + 1
- At this point, A[1..n] is sorted ✓

This proves insertion sort works correctly!

---

### 2.6 Induction with Algorithms: Finding Maximum

**Algorithm:**
```
Algorithm FindMax(A[1..n])
    if n = 1
        return A[1]
    else
        max_rest = FindMax(A[2..n])
        if A[1] > max_rest
            return A[1]
        else
            return max_rest
```

**Claim:** FindMax correctly returns the maximum element.

**Proof by Induction:**

**Base Case (n = 1):**
- Array has one element
- Returns that element
- ✓ Correct (it's trivially the maximum)

**Inductive Hypothesis:**
Assume FindMax works correctly for arrays of size k.

**Inductive Step:**
For array of size k+1:
- FindMax(A[2..k+1]) returns max of elements 2 through k+1 (by IH)
- We compare A[1] with this max
- Return the larger one
- ✓ This is the maximum of all k+1 elements

**Conclusion:**
By induction, FindMax is correct for all n ≥ 1. ∎

---

**Key Takeaway:**
Mathematical induction is essential for:
1. Proving recurrence relations
2. Proving algorithm correctness
3. Analyzing recursive algorithms
4. Understanding loop invariants

You'll use these techniques throughout algorithm design!

---

## Part 3: Recursion {#recursion}

Recursion is when a function calls itself. It's one of the most powerful and elegant programming techniques!

### 3.1 What is Recursion?

**Definition:**
A recursive function is one that solves a problem by solving smaller instances of the same problem.

**Two Essential Components:**

1. **Base Case(s):** Simple case(s) that can be solved directly without recursion
   - Prevents infinite recursion
   - Usually the smallest/simplest input

2. **Recursive Case:** Breaks problem into smaller subproblems
   - Makes progress toward base case
   - Calls itself on smaller inputs

**Simple Example: Factorial**
```
n! = n × (n-1) × (n-2) × ... × 2 × 1

Algorithm Factorial(n)
    if n = 0                    // Base case
        return 1
    else                         // Recursive case
        return n * Factorial(n-1)
```

**How it works:**
```
Factorial(4)
= 4 * Factorial(3)
= 4 * (3 * Factorial(2))
= 4 * (3 * (2 * Factorial(1)))
= 4 * (3 * (2 * (1 * Factorial(0))))
= 4 * (3 * (2 * (1 * 1)))
= 4 * (3 * (2 * 1))
= 4 * (3 * 2)
= 4 * 6
= 24
```

---

### 3.2 Problem: Greatest Common Divisor (GCD)

**Problem:** Find the largest integer that divides both a and b.

**Euclidean Algorithm (Ancient!):**

**Key Insight:**
gcd(a, b) = gcd(b, a mod b)

**Why?**
Any divisor of both a and b also divides (a - b), (a - 2b), ..., and (a mod b).

**Recursive Algorithm:**
```
Algorithm GCD(a, b)
    if b = 0                    // Base case
        return a
    else                         // Recursive case
        return GCD(b, a mod b)
```

**Example: GCD(48, 18)**
```
GCD(48, 18)
= GCD(18, 48 mod 18)    // 48 mod 18 = 12
= GCD(18, 12)
= GCD(12, 18 mod 12)    // 18 mod 12 = 6
= GCD(12, 6)
= GCD(6, 12 mod 6)      // 12 mod 6 = 0
= GCD(6, 0)
= 6                      // Base case!
```

**Analysis:**
- Each step: (a, b) → (b, a mod b)
- b decreases by at least half every two steps
- Time complexity: **O(log min(a, b))**
- Very efficient!

**Correctness Proof:**

**Claim:** gcd(a, b) = gcd(b, a mod b)

**Proof:**
Let d = gcd(a, b) and d' = gcd(b, a mod b).

We need to show d = d'.

Since a = bq + r where r = a mod b:

1. **d divides d':**
   - d divides a and b
   - So d divides (a - bq) = r
   - Therefore d divides both b and r
   - So d divides gcd(b, r) = d'

2. **d' divides d:**
   - d' divides b and r
   - So d' divides (bq + r) = a
   - Therefore d' divides both a and b
   - So d' divides gcd(a, b) = d

Since d divides d' and d' divides d, we have d = d'. ∎

---

### 3.3 Recursive Maximum Finding

**Problem:** Find maximum element in array A[1..n]

**Non-Recursive (Iterative) Version:**
```
Algorithm MaxIterative(A[1..n])
    max = A[1]
    for i = 2 to n
        if A[i] > max
            max = A[i]
    return max
```
- Time: O(n)
- Space: O(1)

**Recursive Version (Divide and Conquer):**
```
Algorithm MaxRecursive(A[1..n])
    if n = 1                               // Base case
        return A[1]
    else
        mid = ⌊n/2⌋
        max_left = MaxRecursive(A[1..mid])    // Solve left half
        max_right = MaxRecursive(A[mid+1..n]) // Solve right half
        return max(max_left, max_right)       // Combine
```

**Example: A = [3, 7, 2, 9, 1, 5, 6, 4]**
```
MaxRecursive([3,7,2,9,1,5,6,4])
    ├─ MaxRecursive([3,7,2,9])
    │   ├─ MaxRecursive([3,7])
    │   │   ├─ MaxRecursive([3]) → 3
    │   │   └─ MaxRecursive([7]) → 7
    │   │   → max(3,7) = 7
    │   └─ MaxRecursive([2,9])
    │       ├─ MaxRecursive([2]) → 2
    │       └─ MaxRecursive([9]) → 9
    │       → max(2,9) = 9
    │   → max(7,9) = 9
    └─ MaxRecursive([1,5,6,4])
        ├─ MaxRecursive([1,5])
        │   ├─ MaxRecursive([1]) → 1
        │   └─ MaxRecursive([5]) → 5
        │   → max(1,5) = 5
        └─ MaxRecursive([6,4])
            ├─ MaxRecursive([6]) → 6
            └─ MaxRecursive([4]) → 4
            → max(6,4) = 6
        → max(5,6) = 6
→ max(9,6) = 9
```

**Analysis:**
Recurrence relation: T(n) = 2T(n/2) + O(1)
- Two recursive calls on arrays of size n/2
- O(1) time to compare results

Solution: T(n) = O(n)
- Same as iterative version!
- But uses O(log n) space for recursion stack

---

### 3.4 Solving Recurrence Relations

**What is a Recurrence?**
An equation that defines a sequence in terms of previous values.

**Why Important?**
Recursive algorithms naturally lead to recurrence relations for their runtime.

#### Method 1: Recursion Tree

**Example: T(n) = 2T(n/2) + n**

Draw tree showing all recursive calls:
```
Level 0:          n                   Cost: n
                 / \
Level 1:      n/2   n/2              Cost: n/2 + n/2 = n
             / \   / \
Level 2:  n/4 n/4 n/4 n/4            Cost: 4(n/4) = n
         ...

Height: log₂ n levels
Each level costs: n
Total: n log₂ n

Therefore: T(n) = O(n log n)
```

#### Method 2: Guess and Verify

**Example: T(n) = T(n-1) + 1, T(1) = 1**

**Step 1: Guess**
Compute first few values:
- T(1) = 1
- T(2) = T(1) + 1 = 2
- T(3) = T(2) + 1 = 3
- T(4) = T(3) + 1 = 4

Guess: T(n) = n

**Step 2: Verify by Induction**

Base case: T(1) = 1 ✓

Inductive step:
Assume T(k) = k, show T(k+1) = k+1
```
T(k+1) = T(k) + 1
       = k + 1    (by IH)
       ✓
```

Therefore T(n) = n = O(n).

#### Method 3: Master Theorem

**For recurrences of form:**
T(n) = aT(n/b) + f(n)

where a ≥ 1, b > 1, and f(n) is asymptotically positive.

**Three Cases:**

**Case 1:** If f(n) = O(n^(log_b a - ε)) for some ε > 0
- **Then: T(n) = Θ(n^(log_b a))**
- Work dominated by leaves of recursion tree

**Case 2:** If f(n) = Θ(n^(log_b a))
- **Then: T(n) = Θ(n^(log_b a) log n)**
- Work evenly distributed across levels

**Case 3:** If f(n) = Ω(n^(log_b a + ε)) for some ε > 0
         AND af(n/b) ≤ cf(n) for some c < 1
- **Then: T(n) = Θ(f(n))**
- Work dominated by root

**Examples:**

**Example 1: T(n) = 2T(n/2) + n**
- a = 2, b = 2, f(n) = n
- n^(log_b a) = n^(log₂ 2) = n^1 = n
- f(n) = n = Θ(n^(log_b a))
- **Case 2: T(n) = Θ(n log n)** ✓

**Example 2: T(n) = 4T(n/2) + n**
- a = 4, b = 2, f(n) = n
- n^(log_b a) = n^(log₂ 4) = n² 
- f(n) = n = O(n^(2-ε)) for ε = 1
- **Case 1: T(n) = Θ(n²)** ✓

**Example 3: T(n) = 2T(n/2) + n²**
- a = 2, b = 2, f(n) = n²
- n^(log_b a) = n^1 = n
- f(n) = n² = Ω(n^(1+ε)) for ε = 1
- Check regularity: 2(n/2)² = n²/2 ≤ cn² for c = 1/2 < 1 ✓
- **Case 3: T(n) = Θ(n²)** ✓

---

### 3.5 Classic Recursive Examples

#### Fibonacci Numbers

**Naive Recursive:**
```
Algorithm Fibonacci(n)
    if n ≤ 1
        return n
    return Fibonacci(n-1) + Fibonacci(n-2)
```

**Problem:** Exponential time O(2ⁿ)!
- Recomputes same values many times
- Fibonacci(5) calls Fibonacci(3) twice, Fibonacci(2) three times, etc.

**Call tree for Fibonacci(5):**
```
                    fib(5)
                   /      \
              fib(4)        fib(3)
             /    \        /     \
        fib(3)  fib(2)  fib(2)  fib(1)
       /    \   /   \   /   \
   fib(2) fib(1) ...
   /   \
fib(1) fib(0)
```

**Better: Memoization** (covered in Dynamic Programming!)

#### Tower of Hanoi

**Problem:**
Move n disks from peg A to peg C using peg B as auxiliary.
Rules:
- Move one disk at a time
- Never place larger disk on smaller disk

**Recursive Solution:**
```
Algorithm Hanoi(n, source, dest, aux)
    if n = 1
        move disk from source to dest
    else
        Hanoi(n-1, source, aux, dest)   // Move n-1 to auxiliary
        move disk from source to dest    // Move largest
        Hanoi(n-1, aux, dest, source)   // Move n-1 to destination
```

**Analysis:**
T(n) = 2T(n-1) + 1
- T(1) = 1
- T(2) = 3
- T(3) = 7
- T(4) = 15
- T(n) = 2ⁿ - 1

**Minimum moves needed: 2ⁿ - 1** (provably optimal!)

#### Binary Search (Recursive)

```
Algorithm BinarySearchRecursive(A[1..n], x, left, right)
    if left > right
        return -1  // not found
    
    mid = ⌊(left + right)/2⌋
    
    if A[mid] = x
        return mid
    else if A[mid] < x
        return BinarySearchRecursive(A, x, mid+1, right)
    else
        return BinarySearchRecursive(A, x, left, mid-1)
```

**Recurrence:** T(n) = T(n/2) + O(1)
**Solution:** T(n) = O(log n)

---

### 3.6 Tail Recursion

**What is Tail Recursion?**
A recursive call is tail-recursive if it's the last operation in the function.

**Non-Tail Recursive:**
```
Algorithm Factorial(n)
    if n = 0
        return 1
    return n * Factorial(n-1)  // Multiply AFTER recursive call
```

**Tail Recursive:**
```
Algorithm FactorialTail(n, accumulator)
    if n = 0
        return accumulator
    return FactorialTail(n-1, n * accumulator)  // No work after call

// Call as: FactorialTail(n, 1)
```

**Why Care?**
- Tail-recursive functions can be optimized into loops by compiler
- Saves stack space: O(1) instead of O(n)
- Many functional languages do this automatically

---

### 3.7 When to Use Recursion?

**Good Use Cases:**
- Problem naturally recursive (trees, divide-and-conquer)
- Clear base and recursive cases
- Cleaner/simpler than iterative version

**Avoid When:**
- Simple iteration is clearer
- Deep recursion (stack overflow risk)
- Lots of redundant computation (unless you use memoization)

**Key Principles:**
1. **Always have base case(s)**
2. **Make progress toward base case**
3. **Don't assume recursion works - prove it!**
4. **Consider stack depth**
5. **Watch for redundant computation**

---

## Part 4: Divide and Conquer {#divide-conquer}

Divide and Conquer is one of the most powerful algorithm design techniques!

### 4.1 The Divide and Conquer Strategy

**Three Steps:**

1. **DIVIDE:** Break the problem into smaller subproblems
2. **CONQUER:** Solve subproblems recursively  
3. **COMBINE:** Merge solutions to get final answer

**MergeSort is the classic example** - splits array, sorts halves, merges results in O(n log n) time.

**QuickSort** uses divide and conquer differently - partition around pivot, recurse on both sides.

**Key applications:** Binary search, finding closest pair of points, fast Fourier transform, Strassen's matrix multiplication.

---

## Part 5: Dynamic Programming {#dynamic-programming}

DP solves problems with overlapping subproblems by storing solutions!

### 5.1 The DP Recipe

**When to use DP:**
1. Optimal substructure
2. Overlapping subproblems

**Classic problems:**
- Fibonacci (memoization turns O(2^n) into O(n))
- Longest Common Subsequence: O(mn)
- 0/1 Knapsack: O(nW)
- Matrix Chain Multiplication: O(n³)
- Edit Distance
- Longest Increasing Subsequence: O(n²) or O(n log n)

**Two approaches:** Top-down (memoization) or bottom-up (tabulation)

---

## Part 6: Greedy Algorithms {#greedy}

Make locally optimal choices!

**Works for:** Activity selection, Huffman coding, MST (Kruskal/Prim), Dijkstra's algorithm

**Doesn't work for:** 0/1 knapsack, longest path

**Must prove greedy choice property and optimal substructure!**

---

## Part 7: Graph Algorithms {#graphs}

**Traversal:**
- DFS: O(V+E), uses stack/recursion
- BFS: O(V+E), uses queue, finds shortest paths

**Shortest Paths:**
- Dijkstra: O(E log V), no negative weights
- Bellman-Ford: O(VE), handles negative weights
- Floyd-Warshall: O(V³), all pairs

**MST:**
- Kruskal: O(E log E), sort edges
- Prim: O(E log V), grow from vertex

**Other:** Topological sort, strongly connected components, max flow

---

## Part 8: NP-Completeness {#np-complete}

**P:** Polynomial-time solvable  
**NP:** Polynomial-time verifiable  
**NP-Complete:** Hardest problems in NP

**If P ≠ NP** (widely believed), NP-complete problems have no efficient exact algorithms.

**Classic NP-complete problems:** SAT, 3-SAT, clique, vertex cover, Hamiltonian path, TSP, subset sum

**Coping strategies:** Approximation algorithms, heuristics, special cases, exponential algorithms for small inputs

---

## The Complete Algorithm Toolkit

**You now know:**
- Problem-solving fundamentals and Big-O analysis
- Mathematical induction for proofs
- Recursion and recurrence relations
- Divide & Conquer (MergeSort, QuickSort, binary search)
- Dynamic Programming (memoization, tabulation, classic problems)
- Greedy algorithms (activity selection, Huffman, MST)
- Graph algorithms (DFS, BFS, shortest paths, MST)
- NP-completeness theory

**Master these fundamentals, practice on real problems, and you'll be able to design efficient algorithms for any challenge!** 🚀