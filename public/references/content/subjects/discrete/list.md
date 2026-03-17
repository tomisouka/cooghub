# Discrete Mathematics: A Complete Guide
## From Foundations to Advanced Concepts

---

## Table of Contents
1. [The Foundations: Logic and Proofs](#foundations)
2. [Basic Structures](#basic-structures)
3. [Algorithms](#algorithms)
4. [Number Theory and Cryptography](#number-theory)
5. [Advanced Topics](#advanced-topics)

---

## Part 1: The Foundations - Logic and Proofs {#foundations}

### 1.1 Propositional Logic

**What is it?**
Propositional logic is the foundation of mathematical reasoning. It deals with statements that are either true or false (but not both).

**Key Concepts:**

**Propositions**: A declarative sentence that is either true or false.
- Example: "2 + 2 = 4" (true)
- Example: "The sky is green" (false)
- NOT a proposition: "Go outside!" (command)
- NOT a proposition: "Is it raining?" (question)

**Logical Connectives**: Ways to combine propositions

1. **NOT (¬)** - Negation
   - ¬p is true when p is false, and vice versa
   - Example: If p = "It is raining", then ¬p = "It is not raining"

2. **AND (∧)** - Conjunction
   - p ∧ q is true only when both p and q are true
   - Example: "It is raining AND it is cold"

3. **OR (∨)** - Disjunction
   - p ∨ q is true when at least one of p or q is true
   - Example: "It is raining OR it is snowing"

4. **IF-THEN (→)** - Implication
   - p → q reads as "if p, then q"
   - Only false when p is true and q is false
   - Example: "If it rains, then the ground is wet"

5. **IF AND ONLY IF (↔)** - Biconditional
   - p ↔ q is true when p and q have the same truth value
   - Example: "You pass the course if and only if you score above 60%"

**Truth Tables**: A systematic way to determine truth values

Example for p ∧ q:
```
p  |  q  | p ∧ q
---+-----+------
T  |  T  |  T
T  |  F  |  F
F  |  T  |  F
F  |  F  |  F
```

**Why does this matter?**
Logic is the language of mathematics and computer science. Every proof, every program condition, every algorithm uses these basic building blocks.

---

### 1.2 Applications of Propositional Logic

**Translating English to Logic:**
This is a crucial skill. You need to convert everyday statements into logical formulas.

Example:
- English: "You can go to the party if you finish your homework"
- Let p = "You finish your homework"
- Let q = "You can go to the party"
- Logic: p → q

**System Specifications:**
In computer science, we use logic to specify how systems should behave.

Example: "The system is in a safe state if the backup is running or the main server is idle"
- Let b = "backup is running"
- Let i = "main server is idle"
- Let s = "system is safe"
- Logic: (b ∨ i) → s

**Logic Circuits:**
Computer hardware uses logic gates (AND, OR, NOT gates) that implement these logical operations.

---

### 1.3 Propositional Equivalences

**What are they?**
Two logical statements are equivalent if they always have the same truth value, regardless of the truth values of their components.

**Important Equivalences:**

1. **De Morgan's Laws** (super important!)
   - ¬(p ∧ q) ≡ ¬p ∨ ¬q
   - ¬(p ∨ q) ≡ ¬p ∧ ¬q
   - Translation: "Not (both p and q)" = "either not p or not q"

2. **Double Negation**
   - ¬(¬p) ≡ p
   - Two negatives make a positive

3. **Commutative Laws**
   - p ∧ q ≡ q ∧ p
   - p ∨ q ≡ q ∨ p
   - Order doesn't matter for AND and OR

4. **Associative Laws**
   - (p ∧ q) ∧ r ≡ p ∧ (q ∧ r)
   - (p ∨ q) ∨ r ≡ p ∨ (q ∨ r)
   - Grouping doesn't matter

5. **Distributive Laws**
   - p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)
   - p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)

6. **Identity Laws**
   - p ∧ T ≡ p (AND with true doesn't change anything)
   - p ∨ F ≡ p (OR with false doesn't change anything)

7. **Domination Laws**
   - p ∨ T ≡ T (OR with true is always true)
   - p ∧ F ≡ F (AND with false is always false)

**Why learn these?**
These equivalences let you simplify complex logical statements and prove that two different-looking statements mean the same thing.

---

### 1.4 Predicates and Quantifiers

**Moving Beyond Simple Propositions:**

A **predicate** is a statement that contains variables and becomes a proposition when you assign values to those variables.

Example:
- P(x) = "x > 3"
- This isn't true or false until we specify what x is
- P(5) is true (because 5 > 3)
- P(2) is false (because 2 is not > 3)

**Quantifiers** let us make statements about multiple values:

1. **Universal Quantifier (∀)** - "for all"
   - ∀x P(x) means "P(x) is true for every x in the domain"
   - Example: ∀x (x² ≥ 0) means "every number squared is non-negative"
   - This is true for all real numbers

2. **Existential Quantifier (∃)** - "there exists"
   - ∃x P(x) means "there is at least one x for which P(x) is true"
   - Example: ∃x (x² = 4) means "there exists a number whose square is 4"
   - This is true (x = 2 or x = -2)

**Negating Quantifiers** (very important!):
- ¬(∀x P(x)) ≡ ∃x ¬P(x)
  - "Not everything has property P" = "Something doesn't have property P"
- ¬(∃x P(x)) ≡ ∀x ¬P(x)
  - "Nothing has property P" = "Everything doesn't have property P"

**Example:**
Statement: "All students passed the exam"
- ∀x (Student(x) → Passed(x))
Negation: "At least one student didn't pass"
- ∃x (Student(x) ∧ ¬Passed(x))

---

### 1.5 Nested Quantifiers

**What are they?**
When you have multiple quantifiers in the same statement.

**Order Matters!**

Example with different meanings:
1. ∀x ∃y (x < y)
   - "For every x, there exists a y such that x < y"
   - True for real numbers (you can always find a bigger number)

2. ∃y ∀x (x < y)
   - "There exists a y such that for all x, x < y"
   - False for real numbers (there's no number bigger than all numbers)

**Common Patterns:**

1. **∀x ∀y** - "for all x and for all y"
   - Example: ∀x ∀y (x + y = y + x) - addition is commutative

2. **∃x ∃y** - "there exists an x and there exists a y"
   - Example: ∃x ∃y (x + y = 0) - there exist numbers that sum to zero

3. **∀x ∃y** - "for every x, there exists a y"
   - Example: ∀x ∃y (x + y = 0) - every number has an additive inverse

4. **∃x ∀y** - "there exists an x such that for all y"
   - Example: ∃x ∀y (x · y = y) - there exists an identity element (1)

**Translating Complex Statements:**

Example: "Every student has at least one friend"
- Let S(x) = "x is a student"
- Let F(x, y) = "x and y are friends"
- Logic: ∀x (S(x) → ∃y F(x, y))

---

### 1.6 Rules of Inference

**What are they?**
Rules that allow us to derive new true statements from existing true statements. This is how we build proofs!

**Basic Rules:**

1. **Modus Ponens** (most fundamental)
   - If p → q is true, and p is true
   - Then q must be true
   - Example: "If it rains, the ground is wet" + "It is raining" → "The ground is wet"

2. **Modus Tollens** (reasoning by contrapositive)
   - If p → q is true, and ¬q is true
   - Then ¬p must be true
   - Example: "If it rains, the ground is wet" + "The ground is not wet" → "It didn't rain"

3. **Hypothetical Syllogism** (chaining)
   - If p → q and q → r are both true
   - Then p → r is true
   - Example: "If you study, you pass" + "If you pass, you graduate" → "If you study, you graduate"

4. **Disjunctive Syllogism**
   - If p ∨ q is true, and ¬p is true
   - Then q must be true
   - Example: "It's raining or snowing" + "It's not raining" → "It's snowing"

5. **Addition**
   - If p is true
   - Then p ∨ q is true (for any q)
   - Example: "It's raining" → "It's raining or snowing"

6. **Simplification**
   - If p ∧ q is true
   - Then p is true (and q is true)
   - Example: "It's raining and cold" → "It's raining"

7. **Conjunction**
   - If p is true and q is true
   - Then p ∧ q is true
   - Example: "It's raining" + "It's cold" → "It's raining and cold"

**Why these matter:**
These are the building blocks of every mathematical proof. When you write a proof, you're applying these rules step by step.

---

### 1.7 Introduction to Proofs

**What is a proof?**
A proof is a valid argument that establishes the truth of a mathematical statement using logic, definitions, and previously proven results.

**Types of Proofs:**

**1. Direct Proof**
- Assume p is true
- Use logic and known facts to show q must be true
- Therefore, p → q

Example: Prove "If n is even, then n² is even"
```
Proof:
Assume n is even.
Then n = 2k for some integer k (definition of even).
So n² = (2k)² = 4k² = 2(2k²).
Since 2k² is an integer, n² = 2(2k²) is even.
Therefore, if n is even, then n² is even. ∎
```

**2. Proof by Contrapositive**
- To prove p → q
- Instead prove ¬q → ¬p (which is equivalent)

Example: Prove "If n² is odd, then n is odd"
```
Proof (by contrapositive):
We'll prove: if n is even, then n² is even.
Assume n is even.
Then n = 2k for some integer k.
So n² = 4k² = 2(2k²), which is even.
Therefore, if n² is odd, then n must be odd. ∎
```

**3. Proof by Contradiction**
- Assume the statement is false
- Show this leads to a logical contradiction
- Therefore, the statement must be true

Example: Prove "√2 is irrational"
```
Proof (by contradiction):
Assume √2 is rational.
Then √2 = a/b where a, b are integers with no common factors.
Then 2 = a²/b², so 2b² = a².
This means a² is even, so a is even. Let a = 2k.
Then 2b² = (2k)² = 4k², so b² = 2k².
This means b² is even, so b is even.
But this contradicts our assumption that a and b have no common factors!
Therefore, √2 must be irrational. ∎
```

**4. Proof by Cases**
- Break the problem into separate cases
- Prove each case individually

Example: Prove "|xy| = |x||y|"
```
Proof (by cases):
Case 1: x ≥ 0 and y ≥ 0
  Then xy ≥ 0, so |xy| = xy = |x||y|. ✓
Case 2: x ≥ 0 and y < 0
  Then xy ≤ 0, so |xy| = -xy = x(-y) = |x||y|. ✓
Case 3: x < 0 and y ≥ 0
  Then xy ≤ 0, so |xy| = -xy = (-x)y = |x||y|. ✓
Case 4: x < 0 and y < 0
  Then xy > 0, so |xy| = xy = (-x)(-y) = |x||y|. ✓
All cases covered. ∎
```

---

### 1.8 Proof Methods and Strategy

**Mathematical Induction** (one of the most powerful proof techniques!)

**Principle of Mathematical Induction:**
To prove a statement P(n) is true for all positive integers n:

1. **Base Case**: Prove P(1) is true
2. **Inductive Step**: Prove that IF P(k) is true, THEN P(k+1) is true
3. **Conclusion**: By induction, P(n) is true for all n ≥ 1

**Why does this work?**
Think of it like dominoes:
- Base case: The first domino falls
- Inductive step: Each domino knocks down the next one
- Conclusion: All dominoes fall

**Example: Prove that 1 + 2 + 3 + ... + n = n(n+1)/2**

```
Proof (by induction):

Base Case (n = 1):
  Left side: 1
  Right side: 1(1+1)/2 = 1
  ✓ True for n = 1

Inductive Step:
  Assume P(k) is true: 1 + 2 + ... + k = k(k+1)/2
  We need to prove P(k+1): 1 + 2 + ... + k + (k+1) = (k+1)(k+2)/2
  
  Starting with the left side:
  1 + 2 + ... + k + (k+1)
  = [k(k+1)/2] + (k+1)           [by inductive hypothesis]
  = k(k+1)/2 + 2(k+1)/2
  = (k+1)(k+2)/2                  ✓
  
Therefore, by induction, the formula is true for all n ≥ 1. ∎
```

**Strong Induction:**
Like regular induction, but in the inductive step, you assume P(1), P(2), ..., P(k) are all true, then prove P(k+1).

**Common Proof Strategies:**

1. **Work backwards from what you want to prove**
   - Start with the conclusion and figure out what would make it true

2. **Look for similar problems**
   - Use techniques from similar proofs

3. **Try small cases first**
   - Test with specific numbers to understand the pattern

4. **Use definitions carefully**
   - Always go back to the precise definition of terms

5. **Don't be afraid to restart**
   - If one approach isn't working, try a different proof method

---

## Part 2: Basic Structures {#basic-structures}

Now that we have the logical foundations, we can build mathematical structures on top of them.

### 2.1 Sets

**What is a set?**
A set is an unordered collection of distinct objects. Sets are fundamental to all of mathematics.

**Notation:**
- Sets: A, B, C (capital letters)
- Elements: a, b, c (lowercase letters)
- a ∈ A means "a is an element of A"
- a ∉ A means "a is not an element of A"

**Ways to Describe Sets:**

1. **Roster Method** (list the elements):
   - A = {1, 2, 3, 4, 5}
   - B = {red, blue, green}

2. **Set-Builder Notation** (describe the property):
   - A = {x | x is a positive integer less than 6}
   - B = {x | x is a primary color}
   - Read as: "the set of all x such that..."

**Important Sets:**
- ℕ = {0, 1, 2, 3, ...} (natural numbers)
- ℤ = {..., -2, -1, 0, 1, 2, ...} (integers)
- ℚ = {p/q | p, q ∈ ℤ, q ≠ 0} (rational numbers)
- ℝ = all real numbers
- ∅ = {} (empty set - contains no elements)

**Special Relationships:**

1. **Subset**: A ⊆ B means every element of A is also in B
   - {1, 2} ⊆ {1, 2, 3, 4}
   - Every set is a subset of itself: A ⊆ A
   - The empty set is a subset of every set: ∅ ⊆ A

2. **Proper Subset**: A ⊂ B means A ⊆ B but A ≠ B
   - {1, 2} ⊂ {1, 2, 3}

3. **Equality**: A = B means A ⊆ B and B ⊆ A
   - They have exactly the same elements
   - {1, 2, 3} = {3, 1, 2} (order doesn't matter)

**Cardinality:**
|A| is the number of elements in A
- |{1, 2, 3}| = 3
- |∅| = 0

**Power Set:**
P(A) is the set of all subsets of A
- If A = {1, 2}, then P(A) = {∅, {1}, {2}, {1, 2}}
- If |A| = n, then |P(A)| = 2ⁿ

---

### 2.2 Set Operations

Sets can be combined and manipulated using operations, just like numbers.

**Basic Operations:**

1. **Union** (A ∪ B): Elements in A OR B (or both)
   - {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}
   - Think: "everything from both sets"

2. **Intersection** (A ∩ B): Elements in both A AND B
   - {1, 2, 3} ∩ {3, 4, 5} = {3}
   - Think: "only what they share"

3. **Difference** (A - B or A \ B): Elements in A but NOT in B
   - {1, 2, 3} - {3, 4, 5} = {1, 2}
   - Think: "remove B from A"

4. **Complement** (Ā or A'): All elements NOT in A (within some universal set U)
   - If U = {1, 2, 3, 4, 5} and A = {1, 2}, then Ā = {3, 4, 5}

**Venn Diagrams:**
Visual representations of sets as circles. Overlapping regions show intersections.

**Important Set Identities:**

1. **De Morgan's Laws for Sets**:
   - (A ∪ B)' = A' ∩ B'
   - (A ∩ B)' = A' ∪ B'
   - These mirror the logic laws!

2. **Identity Laws**:
   - A ∪ ∅ = A
   - A ∩ U = A

3. **Domination Laws**:
   - A ∪ U = U
   - A ∩ ∅ = ∅

4. **Distributive Laws**:
   - A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)
   - A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)

**Disjoint Sets:**
A and B are disjoint if A ∩ B = ∅ (they share no elements)

**Partition:**
A partition of set A is a collection of disjoint subsets whose union equals A.
- Example: {{1, 2}, {3, 4}, {5}} is a partition of {1, 2, 3, 4, 5}

---

### 2.3 Functions

**What is a function?**
A function f from set A to set B assigns exactly one element of B to each element of A.

**Notation:**
- f: A → B (read as "f maps A to B")
- f(a) = b means f maps element a to element b
- A is the **domain** (input set)
- B is the **codomain** (possible output set)
- The **range** is the actual outputs: {f(a) | a ∈ A} ⊆ B

**Example:**
f: ℝ → ℝ defined by f(x) = x²
- Domain: all real numbers
- Codomain: all real numbers
- Range: [0, ∞) (non-negative numbers only)

**Types of Functions:**

**1. One-to-One (Injective)**
- Different inputs give different outputs
- f(a₁) = f(a₂) implies a₁ = a₂
- Example: f(x) = 2x is one-to-one
- NOT one-to-one: f(x) = x² (because f(-2) = f(2) = 4)

**2. Onto (Surjective)**
- Every element in the codomain is mapped to by some input
- For every b ∈ B, there exists a ∈ A such that f(a) = b
- Example: f: ℝ → ℝ where f(x) = x³ is onto
- NOT onto: f: ℝ → ℝ where f(x) = x² (nothing maps to -1)

**3. Bijection (One-to-One and Onto)**
- Perfect pairing between domain and codomain
- Every input maps to a unique output, and every output has an input
- Example: f(x) = 2x + 1 from ℝ to ℝ

**Special Functions:**

**Floor and Ceiling:**
- ⌊x⌋ (floor): Largest integer ≤ x
  - ⌊3.7⌋ = 3, ⌊-2.3⌋ = -3
- ⌈x⌉ (ceiling): Smallest integer ≥ x
  - ⌈3.7⌉ = 4, ⌈-2.3⌉ = -2

**Composition:**
If f: A → B and g: B → C, then (g ∘ f): A → C
- (g ∘ f)(x) = g(f(x))
- Apply f first, then g

**Inverse Functions:**
If f: A → B is a bijection, then f⁻¹: B → A exists
- f⁻¹(b) = a if and only if f(a) = b
- f(f⁻¹(x)) = x and f⁻¹(f(x)) = x

---

### 2.4 Sequences and Summations

**Sequences:**
A sequence is an ordered list of numbers. Think of it as a function from positive integers to real numbers.

**Notation:**
- {aₙ} or a₁, a₂, a₃, ...
- aₙ is the nth term

**Defining Sequences:**

1. **Explicit Formula**: Direct formula for aₙ
   - aₙ = 2n means: 2, 4, 6, 8, 10, ...

2. **Recursive Definition**: Define terms using previous terms
   - a₁ = 1, aₙ = 2aₙ₋₁ means: 1, 2, 4, 8, 16, ...
   - Famous example: Fibonacci sequence
     - F₁ = 1, F₂ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂
     - Gives: 1, 1, 2, 3, 5, 8, 13, 21, ...

**Arithmetic Sequences:**
Constant difference between consecutive terms
- aₙ = a₁ + (n-1)d
- Example: 3, 7, 11, 15, ... (d = 4)

**Geometric Sequences:**
Constant ratio between consecutive terms
- aₙ = a₁ · rⁿ⁻¹
- Example: 2, 6, 18, 54, ... (r = 3)

**Summations:**
Sum of terms in a sequence

**Notation:**
- Σᵢ₌₁ⁿ aᵢ = a₁ + a₂ + ... + aₙ
- i is the **index** (starting at 1, ending at n)

**Important Formulas:**

1. **Sum of first n integers:**
   - Σᵢ₌₁ⁿ i = 1 + 2 + ... + n = n(n+1)/2

2. **Sum of first n squares:**
   - Σᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6

3. **Geometric series:**
   - Σᵢ₌₀ⁿ arⁱ = a(rⁿ⁺¹ - 1)/(r - 1) for r ≠ 1

4. **Infinite geometric series** (when |r| < 1):
   - Σᵢ₌₀^∞ arⁱ = a/(1-r)

**Properties of Summations:**
- Σ(aᵢ + bᵢ) = Σaᵢ + Σbᵢ
- Σ(c · aᵢ) = c · Σaᵢ
- Summation is linear!

---

### 2.5 Cardinality of Sets

**Comparing Infinite Sets:**

When sets are finite, we just count elements. But how do we compare infinite sets?

**Key Idea**: Two sets have the same cardinality if we can create a bijection between them.

**Countably Infinite:**
A set is countably infinite if we can create a bijection with ℕ (natural numbers).
- We can "list" all elements (even though the list is infinite)

**Examples:**
1. **ℤ (integers) is countably infinite**
   - List as: 0, 1, -1, 2, -2, 3, -3, ...
   - We can pair each integer with a natural number

2. **ℚ (rationals) is countably infinite** (surprising!)
   - Use Cantor's diagonal argument
   - Create a systematic list of all fractions

**Uncountably Infinite:**
Sets that are "bigger" than ℕ - cannot be listed

**Example:**
**ℝ (real numbers) is uncountably infinite**
- Cantor's diagonal proof shows this
- There are "more" real numbers than natural numbers!

**Cantor's Theorem:**
For any set A, |A| < |P(A)|
- The power set is always strictly larger
- This means there are infinitely many "sizes" of infinity!

---

### 2.6 Matrices

**What is a matrix?**
A rectangular array of numbers arranged in rows and columns.

**Notation:**
```
A = [a₁₁  a₁₂  a₁₃]
    [a₂₁  a₂₂  a₂₃]
```
- aᵢⱼ is the element in row i, column j
- This is a 2×3 matrix (2 rows, 3 columns)

**Matrix Operations:**

**1. Addition** (must have same dimensions):
```
[1 2]   [5 6]   [6  8]
[3 4] + [7 8] = [10 12]
```

**2. Scalar Multiplication**:
```
2 · [1 2] = [2 4]
    [3 4]   [6 8]
```

**3. Matrix Multiplication** (A is m×n, B is n×p → AB is m×p):
```
[1 2] · [5 6] = [1·5+2·7  1·6+2·8] = [19 22]
[3 4]   [7 8]   [3·5+4·7  3·6+4·8]   [43 50]
```
- Element (i,j) of AB = (row i of A) · (column j of B)

**Special Matrices:**

1. **Identity Matrix** (I):
   ```
   I₃ = [1 0 0]
        [0 1 0]
        [0 0 1]
   ```
   - AI = IA = A (like multiplying by 1)

2. **Zero Matrix** (O):
   - All entries are 0
   - A + O = A

3. **Transpose** (Aᵀ):
   - Flip rows and columns
   - If A is m×n, then Aᵀ is n×m

**Properties:**
- Matrix multiplication is NOT commutative: AB ≠ BA (usually)
- Matrix multiplication IS associative: (AB)C = A(BC)
- (AB)ᵀ = BᵀAᵀ

**Applications:**
- Solving systems of linear equations
- Computer graphics transformations
- Network analysis
- Data representation in ML/AI

---

## Part 3: Algorithms {#algorithms}

Now we move from abstract mathematics to computation - how do we actually solve problems?

### 3.1 Algorithms

**What is an algorithm?**
An algorithm is a finite sequence of well-defined instructions for solving a problem.

**Characteristics of a Good Algorithm:**
1. **Input**: Has specified inputs
2. **Output**: Produces correct outputs
3. **Definiteness**: Each step is precisely defined
4. **Finiteness**: Terminates after a finite number of steps
5. **Effectiveness**: Each step can be carried out

**Pseudocode Conventions:**
We'll use pseudocode (not real code, but structured English) to describe algorithms.

```
procedure algorithm_name(input parameters)
    statements
    return output
```

**Example 1: Finding Maximum**
```
procedure max(a₁, a₂, ..., aₙ: integers)
    max_value := a₁
    for i := 2 to n
        if aᵢ > max_value then
            max_value := aᵢ
    return max_value
```

**Example 2: Linear Search**
Find position of x in a list
```
procedure linear_search(x: element, a₁, a₂, ..., aₙ: list)
    i := 1
    while (i ≤ n and aᵢ ≠ x)
        i := i + 1
    if i ≤ n then
        location := i
    else
        location := 0  // not found
    return location
```

**Example 3: Binary Search** (much faster, but requires sorted list!)
```
procedure binary_search(x: element, a₁, a₂, ..., aₙ: sorted list)
    left := 1
    right := n
    while left ≤ right
        middle := ⌊(left + right)/2⌋
        if x = a_middle then
            return middle
        else if x < a_middle then
            right := middle - 1
        else
            left := middle + 1
    return 0  // not found
```

**Why Binary Search is Powerful:**
- Linear search: might check all n elements
- Binary search: eliminates half the remaining elements each step
- Much faster for large lists!

**Sorting Algorithms:**

**Bubble Sort** (simple but slow):
```
procedure bubble_sort(a₁, a₂, ..., aₙ: real numbers)
    for i := 1 to n-1
        for j := 1 to n-i
            if aⱼ > aⱼ₊₁ then
                swap aⱼ and aⱼ₊₁
```
- Repeatedly swaps adjacent elements if they're in wrong order
- Largest element "bubbles" to the end each pass

**Insertion Sort** (like sorting playing cards):
```
procedure insertion_sort(a₁, a₂, ..., aₙ: real numbers)
    for j := 2 to n
        key := aⱼ
        i := j - 1
        while i > 0 and aᵢ > key
            aᵢ₊₁ := aᵢ
            i := i - 1
        aᵢ₊₁ := key
```
- Takes each element and inserts it into correct position in sorted portion

**Greedy Algorithms:**
Make locally optimal choice at each step, hoping for global optimum.

**Example: Making Change**
```
procedure make_change(amount: cents)
    coins := [25, 10, 5, 1]  // quarters, dimes, nickels, pennies
    count := 0
    for each coin_value in coins
        while amount ≥ coin_value
            amount := amount - coin_value
            count := count + 1
    return count
```
- Always use largest coin possible
- Greedy works optimally for US coins!

---

### 3.2 The Growth of Functions

**Why Study Growth?**
We want to know: "How does runtime/memory increase as input size increases?"

**Big-O Notation** (Upper Bound):

**Definition**: f(x) is O(g(x)) if there exist constants C and k such that:
|f(x)| ≤ C|g(x)| for all x > k

**Translation**: f doesn't grow faster than g (up to a constant factor)

**Common Growth Rates** (from slowest to fastest):
1. **O(1)** - Constant
   - Accessing array element: a[5]
   - Same time regardless of input size!

2. **O(log n)** - Logarithmic
   - Binary search
   - Very efficient! log₂(1,000,000) ≈ 20

3. **O(n)** - Linear
   - Linear search
   - Finding max in unsorted list
   - Time proportional to input size

4. **O(n log n)** - Linearithmic
   - Efficient sorting (merge sort, quick sort)
   - Best possible for comparison-based sorting!

5. **O(n²)** - Quadratic
   - Bubble sort, insertion sort
   - Nested loops over n elements

6. **O(n³)** - Cubic
   - Some matrix algorithms
   - Gets slow quickly!

7. **O(2ⁿ)** - Exponential
   - Trying all subsets
   - VERY slow - impractical for n > 30 or so

8. **O(n!)** - Factorial
   - Trying all permutations
   - Extremely slow - impractical for n > 10

**Visual Comparison** (for n = 100):
- O(1): 1 operation
- O(log n): ~7 operations
- O(n): 100 operations
- O(n log n): ~700 operations
- O(n²): 10,000 operations
- O(2ⁿ): ~10³⁰ operations (more than atoms in universe!)

**Example Calculations:**

Is 3n² + 5n + 2 = O(n²)?
```
We need: 3n² + 5n + 2 ≤ C·n² for all n > k

Choose k = 1 and C = 10:
For n > 1: 3n² + 5n + 2 ≤ 3n² + 5n² + 2n² = 10n²
Yes! 3n² + 5n + 2 is O(n²)
```

**Important Properties:**
- If f₁(x) is O(g(x)) and f₂(x) is O(g(x)), then (f₁ + f₂)(x) is O(g(x))
- If f₁(x) is O(g₁(x)) and f₂(x) is O(g₂(x)), then (f₁ · f₂)(x) is O(g₁(x) · g₂(x))

**Big-Omega Notation** (Lower Bound):
f(x) is Ω(g(x)) if g(x) is O(f(x))
- f grows at least as fast as g

**Big-Theta Notation** (Tight Bound):
f(x) is Θ(g(x)) if f(x) is both O(g(x)) and Ω(g(x))
- f and g grow at the same rate

**Example:**
3n² + 5n is:
- O(n²), O(n³), O(2ⁿ) - all valid upper bounds
- Ω(n²), Ω(n), Ω(1) - all valid lower bounds
- Θ(n²) - tight bound (best description!)

---

### 3.3 Complexity of Algorithms

**Time Complexity:**
How many operations does the algorithm perform?

**Space Complexity:**
How much memory does the algorithm use?

**Analyzing Algorithms:**

**Example 1: Finding Maximum**
```
procedure max(a₁, a₂, ..., aₙ)
    max_value := a₁           // 1 operation
    for i := 2 to n           // n-1 iterations
        if aᵢ > max_value     // 1 comparison per iteration
            max_value := aᵢ   // 1 assignment (sometimes)
    return max_value          // 1 operation
```
- Best case: Θ(n) - first element is max
- Worst case: Θ(n) - elements in increasing order
- Average case: Θ(n)
- **Time complexity: Θ(n)**

**Example 2: Linear Search**
```
procedure linear_search(x, a₁, ..., aₙ)
    for i := 1 to n
        if aᵢ = x
            return i
    return 0
```
- Best case: Θ(1) - found at first position
- Worst case: Θ(n) - not in list or at end
- Average case: Θ(n) - expected to check n/2 elements
- **Time complexity: O(n)**

**Example 3: Binary Search**
```
Binary search on sorted list of size n
```
- Each step eliminates half the elements
- After k steps: n, n/2, n/4, ..., n/2^k
- Stop when n/2^k = 1, so 2^k = n, thus k = log₂ n
- **Time complexity: O(log n)**

**Example 4: Bubble Sort**
```
procedure bubble_sort(a₁, ..., aₙ)
    for i := 1 to n-1        // n-1 iterations
        for j := 1 to n-i    // decreasing iterations
            if aⱼ > aⱼ₊₁
                swap
```
- Outer loop: n-1 times
- Inner loop: (n-1) + (n-2) + ... + 1 = n(n-1)/2
- Total comparisons: ≈ n²/2
- **Time complexity: O(n²)**

**Example 5: Merge Sort** (divide and conquer!)
```
1. Divide list into two halves
2. Recursively sort each half
3. Merge the sorted halves
```
- Recurrence: T(n) = 2T(n/2) + n
- Solution: T(n) = O(n log n)
- **Much better than O(n²) for large n!**

**Comparison of Sorting Algorithms:**

| Algorithm      | Best Case | Average Case | Worst Case | Space  |
|---------------|-----------|--------------|------------|--------|
| Bubble Sort   | O(n)      | O(n²)        | O(n²)      | O(1)   |
| Insertion Sort| O(n)      | O(n²)        | O(n²)      | O(1)   |
| Merge Sort    | O(n log n)| O(n log n)   | O(n log n) | O(n)   |
| Quick Sort    | O(n log n)| O(n log n)   | O(n²)      | O(log n)|

**Tractable vs. Intractable Problems:**

**Tractable**: Can be solved in polynomial time (O(nᵏ) for some constant k)
- Sorting, searching, shortest path

**Intractable**: Best known algorithms are exponential
- Traveling salesman problem (exact solution)
- Many NP-complete problems

**P vs. NP** (biggest open question in computer science):
- **P**: Problems solvable in polynomial time
- **NP**: Problems whose solutions can be verified in polynomial time
- **Question**: Does P = NP?
- **Importance**: If P = NP, many "hard" problems become "easy"!

**Practical Implications:**

For n = 1,000,000:
- O(n) algorithm: ~1 second
- O(n log n) algorithm: ~20 seconds
- O(n²) algorithm: ~11 days
- O(2ⁿ) algorithm: never finishes (even if started at Big Bang!)

**Rule of Thumb:**
- n ≤ 10: O(n!) is acceptable
- n ≤ 20: O(2ⁿ) is acceptable
- n ≤ 500: O(n³) is acceptable
- n ≤ 10,000: O(n²) is acceptable
- n ≤ 1,000,000: O(n log n) is acceptable
- Any n: O(n), O(log n), O(1) are great!

---

## Part 4: Number Theory and Cryptography {#number-theory}

Number theory is the study of integers and their properties. It seems abstract but has crucial applications in cryptography and computer security!

### 4.1 Divisibility and Modular Arithmetic

**Divisibility:**

**Definition**: a divides b (written a | b) if there exists an integer c such that b = ac.
- 3 | 12 because 12 = 3 × 4
- 5 ∤ 12 (5 does not divide 12)

**Properties:**
1. If a | b and a | c, then a | (b + c)
2. If a | b, then a | bc for any integer c
3. If a | b and b | c, then a | c (transitivity)

**Division Algorithm:**
For any integer a and positive integer d, there exist unique integers q and r such that:
a = dq + r, where 0 ≤ r < d

- a: dividend
- d: divisor
- q: quotient
- r: remainder

Example: 17 = 5(3) + 2
- q = 3, r = 2

**Modular Arithmetic** (the foundation of cryptography!)

**Definition**: a ≡ b (mod m) means m | (a - b)
- Read as: "a is congruent to b modulo m"
- Equivalent to: a and b have the same remainder when divided by m

**Examples:**
- 17 ≡ 5 (mod 12) because 17 - 5 = 12
- 23 ≡ 3 (mod 10) because both have remainder 3 when divided by 10
- 14 ≡ 2 (mod 4) because 14 = 4(3) + 2 and 2 = 4(0) + 2

**Clock Arithmetic:**
Think of mod 12 as a 12-hour clock:
- 15 o'clock ≡ 3 o'clock (mod 12)
- 7 + 8 ≡ 3 (mod 12)

**Properties of Modular Arithmetic:**
1. If a ≡ b (mod m) and c ≡ d (mod m), then:
   - (a + c) ≡ (b + d) (mod m)
   - (a - c) ≡ (b - d) (mod m)
   - (ac) ≡ (bd) (mod m)

2. (a + b) mod m = ((a mod m) + (b mod m)) mod m
3. (ab) mod m = ((a mod m)(b mod m)) mod m

**Computing Large Powers:**
To compute 7⁵⁰ mod 13:
```
7¹ ≡ 7 (mod 13)
7² ≡ 49 ≡ 10 (mod 13)
7⁴ ≡ 10² ≡ 100 ≡ 9 (mod 13)
7⁸ ≡ 9² ≡ 81 ≡ 3 (mod 13)
7¹⁶ ≡ 3² ≡ 9 (mod 13)
7³² ≡ 9² ≡ 81 ≡ 3 (mod 13)

7⁵⁰ = 7³² · 7¹⁶ · 7²
    ≡ 3 · 9 · 10
    ≡ 270
    ≡ 10 (mod 13)
```

---

### 4.2 Integer Representations and Algorithms

**Base Representations:**

**Decimal (base 10)**: Uses digits 0-9
- 234₁₀ = 2(10²) + 3(10¹) + 4(10⁰)

**Binary (base 2)**: Uses digits 0-1
- 1011₂ = 1(2³) + 0(2²) + 1(2¹) + 1(2⁰) = 11₁₀
- Fundamental to computers!

**Hexadecimal (base 16)**: Uses 0-9, A-F
- 2F₁₆ = 2(16¹) + 15(16⁰) = 47₁₀
- Common in programming

**General Base b:**
(aₙaₙ₋₁...a₁a₀)ᵦ = aₙbⁿ + aₙ₋₁bⁿ⁻¹ + ... + a₁b + a₀

**Converting from Decimal to Base b:**
```
Algorithm: Repeatedly divide by b, collect remainders

Example: Convert 123₁₀ to binary
123 ÷ 2 = 61 remainder 1
61 ÷ 2 = 30 remainder 1
30 ÷ 2 = 15 remainder 0
15 ÷ 2 = 7 remainder 1
7 ÷ 2 = 3 remainder 1
3 ÷ 2 = 1 remainder 1
1 ÷ 2 = 0 remainder 1

Read remainders bottom to top: 1111011₂
```

**Binary Addition:**
```
  1101
+ 1011
------
 11000

(carries)
 1111
  1101
+ 1011
------
 11000
```

**Binary Multiplication:**
```
    1101
  × 1011
  ------
    1101
   1101
  0000
 1101
--------
10001111
```

**Algorithms for Integer Operations:**

**Addition**: O(n) where n is number of digits
**Multiplication** (grade school): O(n²)
**Division**: O(n²)

**Fast algorithms exist:**
- Karatsuba multiplication: O(n^1.58)
- FFT-based multiplication: O(n log n)

---

### 4.3 Primes and Greatest Common Divisors

**Prime Numbers:**

**Definition**: An integer p > 1 is prime if its only positive divisors are 1 and p.
- Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, ...
- 2 is the only even prime!
- Composite: numbers > 1 that are not prime

**Fundamental Theorem of Arithmetic:**
Every integer > 1 can be uniquely written as a product of primes.
- 60 = 2² × 3 × 5
- 100 = 2² × 5²

**Prime Number Theorem:**
Number of primes ≤ n is approximately n/ln(n)
- Primes become less common but never run out!
- Infinitely many primes (Euclid's proof)

**Testing for Primes:**

**Trial Division** (naive method):
```
procedure is_prime(n)
    if n ≤ 1 then return false
    if n = 2 then return true
    if n is even then return false
    for i := 3 to √n step 2
        if i | n then return false
    return true
```
- Time complexity: O(√n)
- Only need to check up to √n

**Greatest Common Divisor (GCD):**

**Definition**: gcd(a, b) is the largest integer that divides both a and b.
- gcd(12, 18) = 6
- gcd(17, 19) = 1 (coprime)

**Euclidean Algorithm** (very efficient!):
```
procedure gcd(a, b)
    while b ≠ 0
        r := a mod b
        a := b
        b := r
    return a
```

**Example: gcd(252, 105)**
```
252 = 105(2) + 42
105 = 42(2) + 21
42 = 21(2) + 0

gcd(252, 105) = 21
```

**Why it works:**
- gcd(a, b) = gcd(b, a mod b)
- Each step reduces the size
- Time complexity: O(log n) - very fast!

**Extended Euclidean Algorithm:**
Finds gcd(a, b) AND integers s, t such that:
gcd(a, b) = sa + tb

**Example: gcd(252, 105) = 21**
```
Working backwards:
21 = 105 - 42(2)
21 = 105 - [252 - 105(2)](2)
21 = 105 - 252(2) + 105(4)
21 = 105(5) + 252(-2)

So s = -2, t = 5
Verify: 252(-2) + 105(5) = -504 + 525 = 21 ✓
```

**Applications:**
- Simplifying fractions: 252/105 = 12/5
- Finding modular inverses (needed for RSA!)
- Solving linear Diophantine equations

**Least Common Multiple (LCM):**
lcm(a, b) = ab / gcd(a, b)
- lcm(12, 18) = 216 / 6 = 36

---

### 4.4 Solving Congruences

**Linear Congruences:**
Solve: ax ≡ b (mod m)
- Find x such that ax leaves remainder b when divided by m

**Example: 3x ≡ 4 (mod 7)**
```
Try values:
x = 0: 3(0) = 0 ≢ 4 (mod 7)
x = 1: 3(1) = 3 ≢ 4 (mod 7)
x = 2: 3(2) = 6 ≢ 4 (mod 7)
x = 3: 3(3) = 9 ≡ 2 (mod 7)
x = 4: 3(4) = 12 ≡ 5 (mod 7)
x = 5: 3(5) = 15 ≡ 1 (mod 7)
x = 6: 3(6) = 18 ≡ 4 (mod 7) ✓

Solution: x ≡ 6 (mod 7)
```

**Existence of Solutions:**
ax ≡ b (mod m) has a solution if and only if gcd(a, m) | b

**Modular Inverse:**
If gcd(a, m) = 1, then a has an inverse modulo m.
- āa ≡ 1 (mod m)
- Use extended Euclidean algorithm to find ā!

**Example: Find inverse of 3 modulo 7**
```
gcd(7, 3):
7 = 3(2) + 1
1 = 7 - 3(2)
1 = 7(1) + 3(-2)

So 3(-2) ≡ 1 (mod 7)
-2 ≡ 5 (mod 7)

Therefore 3⁻¹ ≡ 5 (mod 7)
Verify: 3(5) = 15 ≡ 1 (mod 7) ✓
```

**Chinese Remainder Theorem (CRT):**

**Problem**: Solve simultaneous congruences:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₙ (mod mₙ)
```

**Condition**: m₁, m₂, ..., mₙ must be pairwise coprime

**Example:**
```
x ≡ 2 (mod 3)
x ≡ 3 (mod 5)
x ≡ 2 (mod 7)

From first: x = 3k + 2 for some k
Substitute into second:
3k + 2 ≡ 3 (mod 5)
3k ≡ 1 (mod 5)
k ≡ 2 (mod 5) [since 3(2) = 6 ≡ 1 (mod 5)]
So k = 5j + 2, thus x = 3(5j + 2) + 2 = 15j + 8

Substitute into third:
15j + 8 ≡ 2 (mod 7)
15j ≡ -6 ≡ 1 (mod 7)
j ≡ 1 (mod 7) [since 15(1) = 15 ≡ 1 (mod 7)]
So j = 7i + 1, thus x = 15(7i + 1) + 8 = 105i + 23

Solution: x ≡ 23 (mod 105)
```

**Applications:**
- Calendar calculations
- Secret sharing schemes
- Parallel computation

---

### 4.5 Applications of Congruences

**Hash Functions:**
Map large data to fixed-size values using modular arithmetic.
```
hash(x) = x mod m
```
- Used in hash tables, checksums
- m often chosen as prime for better distribution

**Pseudorandom Number Generators:**
Linear congruential generator:
```
xₙ₊₁ = (axₙ + c) mod m
```
- Simple but not cryptographically secure

**Check Digits:**

**ISBN-10** (books):
```
d₁d₂d₃d₄d₅d₆d₇d₈d₉d₁₀
Check: d₁(10) + d₂(9) + ... + d₁₀(1) ≡ 0 (mod 11)
```

**UPC** (barcodes):
```
Alternating weights of 3 and 1
Check digit makes sum ≡ 0 (mod 10)
```

**Credit Cards (Luhn Algorithm):**
```
1. Double every second digit from right
2. If doubled value > 9, subtract 9
3. Sum all digits
4. Result ≡ 0 (mod 10)
```

**Error Detection Codes:**
- Detect transmission errors
- Based on modular arithmetic
- Examples: CRC, parity bits

---

### 4.6 Cryptography

**Classical Cryptography:**

**Caesar Cipher:**
Shift each letter by k positions.
```
Encryption: C ≡ P + k (mod 26)
Decryption: P ≡ C - k (mod 26)

Example (k=3):
HELLO → KHOOR
```
- Very weak! Only 26 possible keys

**Affine Cipher:**
```
Encryption: C ≡ aP + b (mod 26)
Decryption: P ≡ ā(C - b) (mod 26)

Requires gcd(a, 26) = 1
```

**Modern Cryptography:**

**RSA (Public Key Cryptography)** - Revolutionary!

**Key Generation:**
```
1. Choose two large primes p and q
2. Compute n = pq
3. Compute φ(n) = (p-1)(q-1)  [Euler's totient]
4. Choose e with gcd(e, φ(n)) = 1
5. Compute d ≡ e⁻¹ (mod φ(n))

Public key: (n, e)
Private key: (n, d)
```

**Encryption/Decryption:**
```
Encryption: C ≡ Mᵉ (mod n)
Decryption: M ≡ Cᵈ (mod n)
```

**Small Example:**
```
1. p = 3, q = 11, so n = 33
2. φ(33) = (3-1)(11-1) = 20
3. Choose e = 3 (gcd(3, 20) = 1)
4. Find d: 3d ≡ 1 (mod 20)
   d = 7 (since 3×7 = 21 ≡ 1 (mod 20))

Public key: (33, 3)
Private key: (33, 7)

Encrypt M = 2:
C ≡ 2³ ≡ 8 (mod 33)

Decrypt C = 8:
M ≡ 8⁷ (mod 33)
  ≡ 2 (mod 33) ✓
```

**Why RSA Works:**
Based on Euler's theorem:
- If gcd(M, n) = 1, then M^φ(n) ≡ 1 (mod n)
- Mᵉᵈ ≡ M (mod n) when ed ≡ 1 (mod φ(n))

**Security:**
- Hard to factor large n into p and q
- With p, q being 1024-bit primes, factoring is infeasible!
- Best known: months on supercomputer for 2048-bit number

**Digital Signatures:**
Reverse the process:
```
Sign: S ≡ Mᵈ (mod n)  [use private key]
Verify: M ≡ Sᵉ (mod n)  [use public key]
```
- Only private key holder can create valid signature
- Anyone can verify with public key

**Diffie-Hellman Key Exchange:**
Allows two parties to establish shared secret over public channel!
```
Public: prime p, generator g

Alice:
  - Chooses secret a
  - Sends A = gᵃ mod p

Bob:
  - Chooses secret b
  - Sends B = gᵇ mod p

Shared secret:
  Alice computes: Bᵃ = (gᵇ)ᵃ = g^(ab) mod p
  Bob computes: Aᵇ = (gᵃ)ᵇ = g^(ab) mod p
```

**Applications:**
- HTTPS (secure web browsing)
- Email encryption (PGP)
- Digital signatures
- Cryptocurrency (blockchain)
- Secure messaging

---

## Part 5: Advanced Topics {#advanced-topics}

### 5.1 Graphs and Graph Models

**What is a graph?**
A graph G = (V, E) consists of:
- V: set of vertices (nodes)
- E: set of edges (connections between nodes)

**Why graphs?**
Graphs model relationships and networks everywhere:
- Social networks (people and friendships)
- Road maps (cities and highways)
- Internet (computers and connections)
- Molecules (atoms and bonds)

**Types of Graphs:**

**1. Undirected Graph:**
Edges have no direction - relationship is symmetric.
```
Example: Facebook friends
   A --- B
   |     |
   C --- D
```

**2. Directed Graph (Digraph):**
Edges have direction - relationship might not be symmetric.
```
Example: Twitter followers
   A --> B
   ↓     ↑
   C <-- D
```

**3. Weighted Graph:**
Edges have values (weights).
```
Example: Road network with distances
   A -5- B
   |     |
   3     2
   |     |
   C -4- D
```

**4. Simple Graph:**
- No loops (edge from vertex to itself)
- No multiple edges between same vertices

**5. Multigraph:**
- Multiple edges allowed between same vertices
- Example: Multiple flights between cities

**Graph Terminology:**

**Degree:**
- **Undirected**: deg(v) = number of edges incident to v
- **Directed**: 
  - deg⁻(v) = in-degree (edges coming in)
  - deg⁺(v) = out-degree (edges going out)

**Handshaking Theorem:**
In any undirected graph: Σ deg(v) = 2|E|
- Sum of all degrees = twice the number of edges
- Every edge contributes 2 to the total degree sum

**Path:**
Sequence of vertices v₁, v₂, ..., vₙ where each consecutive pair is connected.
- **Length**: number of edges in the path
- **Simple path**: no repeated vertices

**Cycle:**
Path that starts and ends at the same vertex.
- **Simple cycle**: no repeated vertices (except first/last)

**Connected Graph:**
There exists a path between every pair of vertices.

**Component:**
Maximal connected subgraph.

---

### 5.2 Graph Representations

**How to Store Graphs in a Computer?**

**1. Adjacency Matrix:**
A matrix where A[i][j] = 1 if there's an edge from i to j, else 0.

```
Graph:        Matrix:
   1 - 2         1  2  3
   |   |      1 [0  1  1]
   3---       2 [1  0  1]
              3 [1  1  0]
```

**Pros:**
- O(1) time to check if edge exists
- Good for dense graphs

**Cons:**
- O(n²) space
- Wasteful for sparse graphs

**For weighted graphs:** Store weight instead of 1.

**2. Adjacency List:**
For each vertex, store a list of its neighbors.

```
Graph:        Lists:
   1 - 2      1: [2, 3]
   |   |      2: [1, 3]
   3---       3: [1, 2]
```

**Pros:**
- O(n + m) space (n vertices, m edges)
- Efficient for sparse graphs
- Easy to iterate over neighbors

**Cons:**
- O(deg(v)) time to check if specific edge exists

**3. Edge List:**
Simply list all edges.
```
[(1,2), (1,3), (2,3)]
```
- Rarely used alone
- Simple but inefficient for most operations

---

### 5.3 Graph Connectivity

**Connected Components:**
Finding all connected components in a graph.

**Algorithm (using DFS or BFS):**
```
procedure find_components(G)
    for each vertex v
        visited[v] := false
    component_count := 0
    
    for each vertex v
        if not visited[v]
            component_count := component_count + 1
            explore_component(v, component_count)
    
    return component_count

procedure explore_component(v, comp_id)
    visited[v] := true
    component[v] := comp_id
    for each neighbor u of v
        if not visited[u]
            explore_component(u, comp_id)
```

**Cut Vertex (Articulation Point):**
Vertex whose removal disconnects the graph.
- Critical in network reliability!

**Cut Edge (Bridge):**
Edge whose removal disconnects the graph.

**Example:**
```
   A---B---C
       |
       D
```
- B is a cut vertex
- Edge (B,C) is a bridge

---

### 5.4 Euler and Hamilton Paths

**Euler Path/Circuit:**

**Euler Path**: Path using every edge exactly once.
**Euler Circuit**: Euler path that starts and ends at same vertex.

**Theorem (Euler):**
- **Euler circuit** exists ⟺ all vertices have even degree
- **Euler path** exists ⟺ exactly 0 or 2 vertices have odd degree

**Example: Seven Bridges of Königsberg**
```
Famous problem that started graph theory!
Can you cross all 7 bridges exactly once?

   Land A
    / | \
   B1 B2 B3    (bridges)
  /   |   \
Land B-B4-Land C
  \   |   /
   B5 B6 B7
  \   |   /
   Land D

Each land area is a vertex, each bridge is an edge.
All vertices have odd degree → No Euler path exists!
```

**Finding Euler Circuit (Fleury's Algorithm):**
```
1. Start at any vertex
2. Follow edges, marking them as used
3. Never use a bridge unless no other choice
4. Continue until all edges used
```

**Hamilton Path/Circuit:**

**Hamilton Path**: Path visiting every vertex exactly once.
**Hamilton Circuit**: Hamilton path that returns to start.

**Key Difference from Euler:**
- Euler: use every **edge** once
- Hamilton: visit every **vertex** once

**Important:**
No simple test exists for Hamilton paths/circuits!
- This is an NP-complete problem
- Must try different possibilities

**Sufficient Conditions (Dirac's Theorem):**
If G has n ≥ 3 vertices and every vertex has degree ≥ n/2,
then G has a Hamilton circuit.

**Applications:**
- Traveling Salesman Problem
- DNA sequencing
- Circuit board drilling

---

### 5.5 Shortest Path Problems

**Problem**: Find shortest path between two vertices in weighted graph.

**Dijkstra's Algorithm** (for non-negative weights):

```
procedure dijkstra(G, source)
    for each vertex v
        dist[v] := ∞
        prev[v] := null
    dist[source] := 0
    
    Q := all vertices
    while Q is not empty
        u := vertex in Q with minimum dist[u]
        remove u from Q
        
        for each neighbor v of u
            alt := dist[u] + weight(u, v)
            if alt < dist[v]
                dist[v] := alt
                prev[v] := u
    
    return dist, prev
```

**How it works:**
1. Maintain tentative distances to all vertices
2. Greedily pick closest unvisited vertex
3. Update distances to neighbors
4. Repeat until all vertices visited

**Time Complexity:**
- With simple array: O(n²)
- With binary heap: O((n + m) log n)
- With Fibonacci heap: O(n log n + m)

**Example:**
```
Find shortest path from A to E:

    2     3
  A---B---C
  |   |   |
  1   1   1
  |   |   |
  D---E---F
    1     2

Step-by-step:
1. Start at A, dist[A]=0
2. Visit A's neighbors: B(2), D(1)
3. Pick D (shortest), update E: dist[E]=2
4. Pick B, update C: dist[C]=5, E: dist[E]=3 (no update)
5. Continue...

Final: A→D→E is shortest (length 2)
```

**Bellman-Ford Algorithm** (handles negative weights):
```
procedure bellman_ford(G, source)
    for each vertex v
        dist[v] := ∞
    dist[source] := 0
    
    repeat n-1 times:
        for each edge (u, v) with weight w
            if dist[u] + w < dist[v]
                dist[v] := dist[u] + w
    
    // Check for negative cycles
    for each edge (u, v) with weight w
        if dist[u] + w < dist[v]
            return "negative cycle exists"
    
    return dist
```

**Floyd-Warshall Algorithm** (all-pairs shortest paths):
Finds shortest paths between ALL pairs of vertices.
```
Time: O(n³)
Uses dynamic programming!
```

**Applications:**
- GPS navigation
- Network routing
- Game AI pathfinding
- Social network analysis

---

### 5.6 Trees

**What is a tree?**
A tree is a connected graph with no cycles.

**Equivalent Definitions** (any one defines a tree):
1. Connected graph with no cycles
2. Connected graph with n vertices and n-1 edges
3. Graph where any two vertices connected by exactly one path
4. Minimal connected graph (removing any edge disconnects it)
5. Maximal acyclic graph (adding any edge creates cycle)

**Tree Terminology:**

**Rooted Tree:**
Tree with one vertex designated as root.
```
      Root
      / \
    Child Child
   /  |   \
 Leaf Leaf Leaf
```

**Parent/Child:**
- If edge from u to v, u is parent of v, v is child of u

**Ancestor/Descendant:**
- Ancestors: parent, parent's parent, etc.
- Descendants: children, children's children, etc.

**Leaf:**
Vertex with no children (degree 1 in rooted tree).

**Internal Vertex:**
Non-leaf vertex.

**Siblings:**
Vertices with same parent.

**Height:**
Maximum distance from root to any leaf.

**Level:**
Distance from root (root is at level 0).

**Binary Tree:**
Each vertex has at most 2 children.
```
       A
      / \
     B   C
    / \   \
   D   E   F
```

**Full Binary Tree:**
Every internal vertex has exactly 2 children.

**Complete Binary Tree:**
All levels filled except possibly last, which fills left to right.

**Perfect Binary Tree:**
All internal vertices have 2 children, all leaves at same level.
- Height h has 2^(h+1) - 1 vertices

**Balanced Tree:**
All leaves approximately same distance from root.
- Important for efficiency!

---

### 5.7 Tree Traversal

**How to Visit Every Node in a Tree?**

**1. Depth-First Search (DFS):**

**Pre-order** (Root → Left → Right):
```
procedure preorder(node)
    if node ≠ null
        visit(node)
        preorder(node.left)
        preorder(node.right)
```

**In-order** (Left → Root → Right):
```
procedure inorder(node)
    if node ≠ null
        inorder(node.left)
        visit(node)
        inorder(node.right)
```
- For binary search trees, gives sorted order!

**Post-order** (Left → Right → Root):
```
procedure postorder(node)
    if node ≠ null
        postorder(node.left)
        postorder(node.right)
        visit(node)
```
- Used for deleting trees, evaluating expressions

**Example Tree:**
```
     A
    / \
   B   C
  / \
 D   E
```

- **Pre-order**: A, B, D, E, C
- **In-order**: D, B, E, A, C
- **Post-order**: D, E, B, C, A

**2. Breadth-First Search (BFS):**
Visit level by level.

```
procedure bfs(root)
    queue := empty queue
    enqueue(queue, root)
    
    while queue not empty
        node := dequeue(queue)
        visit(node)
        for each child of node
            enqueue(queue, child)
```

**Example**: A, B, C, D, E (level by level)

**Applications:**
- File system traversal
- Expression tree evaluation
- Decision trees in AI
- Syntax trees in compilers

---

### 5.8 Spanning Trees

**What is a spanning tree?**
A subgraph that:
1. Is a tree (connected, no cycles)
2. Includes all vertices of original graph

**Every connected graph has a spanning tree!**

**Minimum Spanning Tree (MST):**
Spanning tree with minimum total edge weight.

**Applications:**
- Network design (minimize cable cost)
- Clustering algorithms
- Approximation algorithms

**Prim's Algorithm:**
```
procedure prim(G, start)
    MST := {start}
    edges := []
    
    while |MST| < |V|
        find minimum weight edge (u,v) where
            u ∈ MST and v ∉ MST
        add v to MST
        add edge (u,v) to edges
    
    return edges
```

**How it works:**
1. Start with any vertex
2. Repeatedly add cheapest edge to unvisited vertex
3. Grow tree one edge at a time

**Time Complexity:** O((n + m) log n) with heap

**Kruskal's Algorithm:**
```
procedure kruskal(G)
    sort all edges by weight
    MST := []
    
    for each edge (u,v) in sorted order
        if adding (u,v) doesn't create cycle
            add (u,v) to MST
        if |MST| = n-1
            break
    
    return MST
```

**How it works:**
1. Sort edges by weight
2. Add edges in order, skipping those creating cycles
3. Use Union-Find data structure to detect cycles efficiently

**Time Complexity:** O(m log m) = O(m log n)

**Example:**
```
Graph:           MST:
  1              1
A---B          A   B
| X |    →     |   |
3 5 2          3   2
| X |          |   |
C---D          C   D
  4
```

Both algorithms give same total weight (often multiple MSTs exist).

---

### 5.9 Boolean Algebra

**Why Boolean Algebra?**
Foundation of digital circuits and computer hardware!

**Boolean Values:**
- 0 (false, off, low voltage)
- 1 (true, on, high voltage)

**Basic Boolean Operations:**

**1. NOT (¬ or '):**
```
x | ¬x
--+---
0 | 1
1 | 0
```

**2. AND (·):**
```
x y | x·y
----+----
0 0 | 0
0 1 | 0
1 0 | 0
1 1 | 1
```

**3. OR (+):**
```
x y | x+y
----+----
0 0 | 0
0 1 | 1
1 0 | 1
1 1 | 1
```

**Boolean Expressions:**
Combine variables with operations:
- F(x, y, z) = x·y + x'·z
- G(x, y) = (x + y)·(x' + y')

**Boolean Laws:**

**Identity Laws:**
- x + 0 = x
- x · 1 = x

**Domination Laws:**
- x + 1 = 1
- x · 0 = 0

**Idempotent Laws:**
- x + x = x
- x · x = x

**Complement Laws:**
- x + x' = 1
- x · x' = 0

**De Morgan's Laws:**
- (x + y)' = x'·y'
- (x·y)' = x' + y'

**Distributive Laws:**
- x·(y + z) = x·y + x·z
- x + y·z = (x + y)·(x + z)

**Absorption Laws:**
- x + x·y = x
- x·(x + y) = x

---

### 5.10 Logic Gates

**Physical Implementation of Boolean Operations:**

**Basic Gates:**

**NOT Gate (Inverter):**
```
Input → [NOT] → Output
   x  →  [ ⊳ ] →  x'
```

**AND Gate:**
```
x → ┐
    ├─[D]─→ x·y
y → ┘
```

**OR Gate:**
```
x → ┐
    ├─[≥1]─→ x+y
y → ┘
```

**Universal Gates:**

**NAND Gate** (NOT-AND):
```
x·y' = (x·y)'
```
- Can build ANY Boolean function using only NAND!

**NOR Gate** (NOT-OR):
```
(x+y)' 
```
- Also universal!

**Other Important Gates:**

**XOR Gate** (Exclusive-OR):
```
x ⊕ y = x·y' + x'·y
Output 1 if inputs differ
```

**XNOR Gate:**
```
(x ⊕ y)' = x·y + x'·y'
Output 1 if inputs same
```

**Building Circuits:**

**Half Adder** (adds two bits):
```
Inputs: x, y
Outputs: s (sum), c (carry)

s = x ⊕ y
c = x·y
```

**Full Adder** (adds three bits):
```
Inputs: x, y, cᵢₙ (carry in)
Outputs: s (sum), c_out (carry out)

s = x ⊕ y ⊕ cᵢₙ
c_out = x·y + cᵢₙ·(x ⊕ y)
```

**Multi-bit Addition:**
Chain full adders together!
```
    FA     FA     FA     FA
   ↓ ↓    ↓ ↓    ↓ ↓    ↓ ↓
  [x₃y₃] [x₂y₂] [x₁y₁] [x₀y₀]
     ↓      ↓      ↓      ↓
    s₃     s₂     s₁     s₀
```

**Karnaugh Maps (K-maps):**
Visual method for simplifying Boolean expressions.

**Example: Simplify F(x,y,z) = Σ(1,3,6,7)**
```
    yz
x   00 01 11 10
0   0  1  1  0
1   0  0  1  1

Groupings:
- Top right pair: x'·y
- Bottom right pair: x·z

Simplified: F = x'·y + x·z
```

---

### 5.11 Finite-State Machines

**What is a Finite-State Machine (FSM)?**
Mathematical model of computation with:
- Finite set of states
- Transitions between states based on inputs
- Outputs (for some types)

**Types:**

**1. Moore Machine:**
Output depends only on current state.

**2. Mealy Machine:**
Output depends on current state AND input.

**FSM Components:**
- S: finite set of states
- I: input alphabet
- O: output alphabet  
- f: transition function (S × I → S)
- g: output function
- s₀: initial state

**Example: Vending Machine**
```
States: S0 (0¢), S1 (25¢), S2 (50¢)
Inputs: Quarter (25¢)
Outputs: Nothing, Dispense

S0 --quarter--> S1
S1 --quarter--> S2
S2 --quarter--> S0 (dispense soda)
```

**State Diagram:**
```
    quarter        quarter      quarter
S0 -------→ S1 --------→ S2 --------→ S0
(0¢)           (25¢)           (50¢)   ↓
                                    dispense
```

**Applications:**
- Protocol design
- Pattern matching
- Text processing
- Game AI
- Traffic lights

---

### 5.12 Regular Expressions and Languages

**Regular Expression:**
Pattern that describes a set of strings.

**Basic Operations:**

**1. Concatenation:** ab (string "ab")

**2. Union (|):** a|b (either "a" or "b")

**3. Kleene Star (*):** a* (zero or more "a"s)
- ε, a, aa, aaa, ...

**4. Plus (+):** a+ (one or more "a"s)
- a, aa, aaa, ...

**Examples:**

**Email:** `[a-z]+@[a-z]+\.[a-z]+`

**Phone:** `\d{3}-\d{3}-\d{4}`

**URL:** `https?://[a-z\.]+`

**Regular Languages:**
Languages that can be described by regular expressions.

**Equivalence:**
- Regular expressions
- Finite automata
- Regular grammars

All describe the same class of languages!

**Non-Regular Languages:**
Some languages cannot be expressed with regular expressions.

**Example:** {aⁿbⁿ | n ≥ 0} (equal a's and b's)
- Requires counting/memory
- Needs more powerful model (context-free grammar)

---

### 5.13 Turing Machines

**The Ultimate Model of Computation!**

**What is a Turing Machine?**
Theoretical device with:
- Infinite tape (memory)
- Read/write head
- Finite set of states
- Transition function

**Components:**
```
Tape: ... □ □ a b c □ □ ...
             ↑
           Head

States: q₀, q₁, q₂, ...
Transitions: δ(state, symbol) → (new_state, write_symbol, move)
```

**Example: Incrementing Binary Number**
```
Input: 1011 (11 in decimal)
Output: 1100 (12 in decimal)

Algorithm:
1. Move to rightmost digit
2. Change 1→0, move left, repeat
3. When see 0, change to 1, halt
4. If all 1s, add leading 1
```

**Church-Turing Thesis:**
"Any algorithm can be computed by a Turing machine."
- Defines what is "computable"
- Foundation of computer science!

**Halting Problem:**
**Question**: Can we write a program that determines if any program halts?
**Answer**: NO! (proven by Turing)
- Fundamental limitation of computation
- Some problems are undecidable

**Computational Complexity Classes:**

**P:** Problems solvable in polynomial time
- Sorting, searching, shortest path

**NP:** Problems verifiable in polynomial time
- Includes P
- Traveling salesman, graph coloring

**NP-Complete:** Hardest problems in NP
- If any NP-complete problem is in P, then P = NP!
- Probably not equal (but unproven)

**NP-Hard:** At least as hard as NP-complete
- May not even be in NP

**Practical Implications:**
- P problems: Can solve efficiently
- NP-complete: Use approximations/heuristics
- Understanding limits of computation

---

## Summary and Connections

**How It All Fits Together:**

**Logic → Proofs → Mathematics**
Everything builds on logical reasoning.

**Sets → Functions → Structures**
Basic building blocks for all mathematics.

**Algorithms → Efficiency → Practical Computing**
Theory meets practice.

**Number Theory → Cryptography → Security**
Abstract mathematics protects real-world systems.

**Graphs → Modeling → Problem Solving**
Universal tool for representing relationships.

**Trees → Hierarchy → Efficiency**
Fundamental to algorithms and data structures.

**Boolean Algebra → Circuits → Computers**
How abstract logic becomes physical computation.

**Automata → Languages → Computation Theory**
What can and cannot be computed.

**Key Skills Developed:**

1. **Logical Thinking:** Breaking problems into clear steps
2. **Abstraction:** Seeing patterns and generalizing
3. **Proof Techniques:** Rigorous argumentation
4. **Algorithm Design:** Solving problems efficiently
5. **Mathematical Modeling:** Representing real-world problems
6. **Complexity Analysis:** Understanding computational limits

**Applications Everywhere:**

- **Computer Science:** Algorithms, data structures, AI, security
- **Engineering:** Circuit design, optimization, signal processing
- **Operations Research:** Scheduling, routing, resource allocation
- **Biology:** DNA sequencing, protein folding, phylogenetics
- **Social Sciences:** Network analysis, voting theory, game theory
- **Finance:** Risk modeling, algorithmic trading, blockchain
- **Physics:** Quantum computing, statistical mechanics

**Study Tips:**

1. **Practice, Practice, Practice:** Do lots of problems
2. **Understand, Don't Memorize:** Focus on why, not just what
3. **Draw Pictures:** Visualize concepts (graphs, trees, diagrams)
4. **Start Simple:** Try small examples first
5. **Build Connections:** See how topics relate
6. **Write Proofs:** Practice clear, logical arguments
7. **Code It Up:** Implement algorithms to understand them
8. **Teach Others:** Best way to solidify understanding

**Next Steps:**

- Explore advanced topics in areas that interest you
- Apply concepts to real projects
- Study specific algorithms in depth
- Learn about complexity theory
- Investigate applications in your field

---

**Congratulations!** You now have a comprehensive foundation in discrete mathematics. These concepts underpin all of computer science and much of modern mathematics. Keep building on this foundation, and you'll be amazed at what you can accomplish!

**Remember:** Discrete math is not just about memorizing facts - it's about developing a way of thinking that lets you solve complex problems with clarity and precision. Keep practicing, stay curious, and enjoy the journey! 🚀