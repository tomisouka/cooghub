# 🎯 Mathematical Induction & Proof Techniques
## Complete Guide to Proving Theorems

> Master the art of mathematical reasoning and rigorous proof

---

## 📋 TABLE OF CONTENTS

### 🎓 Proof Fundamentals
- What is a Proof?
- Proof Structure & Components
- Types of Mathematical Statements

### ➡️ Direct Proofs
- Straightforward Logical Reasoning
- Working from Assumptions to Conclusions

### 🔄 Indirect Proofs
- **Proof by Contrapositive** → Proving ¬Q → ¬P
- **Proof by Contradiction** → Assume opposite, find contradiction
- **Proof by Cases** → Divide into exhaustive cases

### 🎯 Mathematical Induction
- **Weak Induction** → Base case + P(k) → P(k+1)
- **Strong Induction** → Using all previous cases
- **Structural Induction** → For recursive structures

### ∃ Existence & Uniqueness
- **Existence Proofs** → Constructive vs Non-constructive
- **Uniqueness Proofs** → Proving "exactly one"

### 🔍 Other Proof Methods
- Proof by Exhaustion
- Counterexamples
- Common Mistakes to Avoid

### 🎯 Strategy & Practice
- Proof Strategy Flowchart
- Tips for Writing Good Proofs
- Practice Problems

---

## 🎓 PROOF FUNDAMENTALS

### What is a Proof?

A **proof** is a logical argument that establishes the truth of a mathematical statement beyond any doubt.

**Components**:
- **Axioms**: Accepted truths (no proof needed)
- **Definitions**: Precise meanings of terms
- **Theorems**: Statements to be proved
- **Lemmas**: Helper theorems
- **Corollaries**: Easy consequences of theorems

### Proof Structure

```
THEOREM: [Statement to prove]

PROOF:
  [Given/Assumptions]
  [Logical steps with justifications]
  [Conclusion]
∎ (Q.E.D.)
```

---

## ➡️ DIRECT PROOF

### Method
Assume `P` is true, use logic and known facts to show `Q` must be true.

**Structure**: `P → Q`
1. Assume P
2. Apply definitions, axioms, previously proven theorems
3. Reach Q through logical steps

### Example 1: Sum of Even Numbers

**THEOREM**: If `n` and `m` are even integers, then `n + m` is even.

**PROOF**:
- **Given**: `n` and `m` are even
- **Definition**: An integer is even if it equals 2k for some integer k
- Since `n` is even: `n = 2a` for some integer `a`
- Since `m` is even: `m = 2b` for some integer `b`
- Therefore: `n + m = 2a + 2b = 2(a + b)`
- Since `a + b` is an integer, `n + m = 2(a + b)` is even
∎

### Example 2: Inequality

**THEOREM**: If `a > b` and `c > 0`, then `ac > bc`.

**PROOF**:
- **Given**: `a > b` and `c > 0`
- Since `a > b`, we have `a - b > 0`
- Multiplying both sides by `c > 0`: `c(a - b) > 0`
- Distributing: `ca - cb > 0`
- Adding `cb` to both sides: `ca > cb`
- Therefore: `ac > bc`
∎

---

## 🔄 PROOF BY CONTRAPOSITIVE

### Method
Instead of proving `P → Q`, prove the contrapositive: `¬Q → ¬P`

**Why it works**: `P → Q` is logically equivalent to `¬Q → ¬P`

**When to use**:
- Direct proof seems difficult
- Negation of conclusion is easier to work with
- You can't easily assume P

### Example 1: Divisibility

**THEOREM**: If `n²` is even, then `n` is even.

**DIRECT** would require: Assume `n²` is even → show `n` is even ❌ (hard!)

**CONTRAPOSITIVE**: Assume `n` is odd → show `n²` is odd ✅

**PROOF**:
- **Contrapositive**: If `n` is odd, then `n²` is odd
- **Given**: `n` is odd
- Then `n = 2k + 1` for some integer `k`
- `n² = (2k + 1)² = 4k² + 4k + 1 = 2(2k² + 2k) + 1`
- This is of the form `2m + 1`, so `n²` is odd
∎

### Example 2: Prime Numbers

**THEOREM**: If `n` is an integer and `n² + 3n + 2` is even, then `n` is even.

**CONTRAPOSITIVE**: If `n` is odd, then `n² + 3n + 2` is odd.

**PROOF**:
- **Given**: `n` is odd, so `n = 2k + 1`
- `n² + 3n + 2 = (2k+1)² + 3(2k+1) + 2`
- `= 4k² + 4k + 1 + 6k + 3 + 2`
- `= 4k² + 10k + 6`
- `= 2(2k² + 5k + 3)` ← EVEN! ❌

Wait, this gives even! So the original theorem is **FALSE**.

**Counterexample**: `n = 1` (odd)
- `n² + 3n + 2 = 1 + 3 + 2 = 6` (even) ✓
- But we can't conclude the original theorem is true!

---

## 💥 PROOF BY CONTRADICTION

### Method
1. Assume the **opposite** of what you want to prove
2. Show this leads to a **contradiction**
3. Conclude the original statement must be true

**Structure**:
- Want to prove: `P`
- Assume: `¬P`
- Derive contradiction: `Q ∧ ¬Q`
- Conclude: `P` must be true

**When to use**:
- Statement involves "no", "never", "infinitely many"
- Direct proof unclear
- Classic problems (irrationality, infinitude of primes)

### Example 1: √2 is Irrational

**THEOREM**: √2 is irrational.

**PROOF**:
- **Assume for contradiction**: √2 is rational
- Then √2 = a/b where a, b ∈ ℤ, b ≠ 0, gcd(a,b) = 1 (lowest terms)
- Squaring: 2 = a²/b²
- Therefore: 2b² = a²
- So `a²` is even
- By previous theorem: `a` is even
- Write `a = 2k` for some integer k
- Substituting: 2b² = (2k)² = 4k²
- Therefore: b² = 2k²
- So `b²` is even
- Therefore `b` is even
- **CONTRADICTION**: Both a and b are even, so gcd(a,b) ≥ 2
- But we assumed gcd(a,b) = 1!
- Therefore √2 is irrational
∎

### Example 2: Infinitude of Primes

**THEOREM**: There are infinitely many prime numbers.

**PROOF** (Euclid):
- **Assume for contradiction**: There are finitely many primes
- List them all: p₁, p₂, p₃, ..., pₙ
- Consider: N = (p₁ × p₂ × p₃ × ... × pₙ) + 1
- N is either prime or composite
  
**Case 1**: N is prime
- Then N is a new prime not in our list (N > pₙ)
- **CONTRADICTION**: We listed all primes!

**Case 2**: N is composite
- Then N has a prime divisor p
- p must be one of p₁, p₂, ..., pₙ
- But N = (product of all primes) + 1
- So N leaves remainder 1 when divided by any pᵢ
- **CONTRADICTION**: p cannot divide N!

- Therefore there are infinitely many primes
∎

---

## 🔀 PROOF BY CASES

### Method
Break the problem into **exhaustive** and **mutually exclusive** cases.

**Structure**:
1. Identify all possible cases
2. Prove statement holds in each case
3. Conclude it holds for all cases

### Example 1: Absolute Value

**THEOREM**: For all integers n, |n(n+1)| is even.

**PROOF**:
We consider two cases based on parity of n.

**Case 1**: n is even
- Then n = 2k for some integer k
- n(n+1) = 2k(2k+1) = 2[k(2k+1)]
- So n(n+1) is even
- Therefore |n(n+1)| is even

**Case 2**: n is odd
- Then n = 2k+1 for some integer k
- n+1 = 2k+2 = 2(k+1)
- n(n+1) = (2k+1)·2(k+1) = 2[(2k+1)(k+1)]
- So n(n+1) is even
- Therefore |n(n+1)| is even

Since n must be either even or odd, |n(n+1)| is always even.
∎

### Example 2: Maximum Function

**THEOREM**: For all real numbers a, b: max(a,b) = (a+b+|a-b|)/2

**PROOF**:

**Case 1**: a ≥ b
- Then max(a,b) = a
- Also a - b ≥ 0, so |a-b| = a-b
- (a+b+|a-b|)/2 = (a+b+a-b)/2 = 2a/2 = a
- Therefore the formula holds ✓

**Case 2**: a < b
- Then max(a,b) = b
- Also a - b < 0, so |a-b| = -(a-b) = b-a
- (a+b+|a-b|)/2 = (a+b+b-a)/2 = 2b/2 = b
- Therefore the formula holds ✓

In both cases, the formula is correct.
∎

---

## 🎯 MATHEMATICAL INDUCTION

### The Principle

**Domino Effect**: If you can knock down the first domino, and each domino knocks down the next, then all dominos fall.

**Formal Statement**:
To prove P(n) for all n ≥ n₀:
1. **Base Case**: Prove P(n₀) is true
2. **Inductive Step**: Prove P(k) → P(k+1) for arbitrary k ≥ n₀
3. **Conclusion**: P(n) is true for all n ≥ n₀

### Structure Template

```
THEOREM: P(n) holds for all n ≥ n₀

PROOF BY INDUCTION:

BASE CASE (n = n₀):
  [Show P(n₀) is true]

INDUCTIVE HYPOTHESIS:
  Assume P(k) is true for some arbitrary k ≥ n₀
  [State what P(k) means]

INDUCTIVE STEP:
  [Prove P(k+1) using P(k)]
  [Show P(k) → P(k+1)]

CONCLUSION:
  By mathematical induction, P(n) holds for all n ≥ n₀
∎
```

---

## 🔢 WEAK INDUCTION - Examples

### Example 1: Sum Formula

**THEOREM**: For all n ≥ 1: 1 + 2 + 3 + ... + n = n(n+1)/2

**PROOF**:

**BASE CASE** (n = 1):
- LHS: 1
- RHS: 1(1+1)/2 = 1
- LHS = RHS ✓

**INDUCTIVE HYPOTHESIS**:
Assume for some k ≥ 1:
```
1 + 2 + 3 + ... + k = k(k+1)/2
```

**INDUCTIVE STEP**:
Need to show: 1 + 2 + 3 + ... + k + (k+1) = (k+1)(k+2)/2

Starting with LHS:
```
1 + 2 + 3 + ... + k + (k+1)
= [1 + 2 + 3 + ... + k] + (k+1)
= k(k+1)/2 + (k+1)              [by IH]
= k(k+1)/2 + 2(k+1)/2
= [k(k+1) + 2(k+1)]/2
= [(k+1)(k + 2)]/2
= (k+1)(k+2)/2
```
This equals RHS ✓

**CONCLUSION**: By induction, the formula holds for all n ≥ 1.
∎

### Example 2: Geometric Sum

**THEOREM**: For all n ≥ 0 and r ≠ 1: 1 + r + r² + ... + rⁿ = (rⁿ⁺¹ - 1)/(r - 1)

**PROOF**:

**BASE CASE** (n = 0):
- LHS: 1
- RHS: (r¹ - 1)/(r - 1) = (r - 1)/(r - 1) = 1
- LHS = RHS ✓

**INDUCTIVE HYPOTHESIS**:
Assume for k ≥ 0: 1 + r + r² + ... + rᵏ = (rᵏ⁺¹ - 1)/(r - 1)

**INDUCTIVE STEP**:
```
1 + r + r² + ... + rᵏ + rᵏ⁺¹
= [1 + r + r² + ... + rᵏ] + rᵏ⁺¹
= (rᵏ⁺¹ - 1)/(r - 1) + rᵏ⁺¹         [by IH]
= (rᵏ⁺¹ - 1)/(r - 1) + rᵏ⁺¹(r-1)/(r-1)
= [rᵏ⁺¹ - 1 + rᵏ⁺¹(r-1)]/(r - 1)
= [rᵏ⁺¹ - 1 + rᵏ⁺² - rᵏ⁺¹]/(r - 1)
= (rᵏ⁺² - 1)/(r - 1)
= (r⁽ᵏ⁺¹⁾⁺¹ - 1)/(r - 1)            ✓
```

By induction, proven for all n ≥ 0.
∎

### Example 3: Divisibility

**THEOREM**: For all n ≥ 1, 7ⁿ - 1 is divisible by 6.

**PROOF**:

**BASE CASE** (n = 1):
- 7¹ - 1 = 6 = 6·1 ✓

**INDUCTIVE HYPOTHESIS**:
Assume 7ᵏ - 1 = 6m for some integer m (i.e., 6 | 7ᵏ - 1)

**INDUCTIVE STEP**:
```
7ᵏ⁺¹ - 1 
= 7·7ᵏ - 1
= 7·7ᵏ - 7 + 7 - 1
= 7(7ᵏ - 1) + 6
= 7(6m) + 6          [by IH]
= 6(7m + 1)
```

Since 7m + 1 is an integer, 6 | 7ᵏ⁺¹ - 1 ✓

By induction, proven for all n ≥ 1.
∎

### Example 4: Inequality

**THEOREM**: For all n ≥ 4: 2ⁿ > n²

**PROOF**:

**BASE CASE** (n = 4):
- LHS: 2⁴ = 16
- RHS: 4² = 16
- Actually 16 = 16, not > ! Let's try n = 5

**BASE CASE** (n = 5):
- LHS: 2⁵ = 32
- RHS: 5² = 25
- 32 > 25 ✓

**INDUCTIVE HYPOTHESIS**:
Assume 2ᵏ > k² for some k ≥ 5

**INDUCTIVE STEP**:
Need to show: 2ᵏ⁺¹ > (k+1)²

```
2ᵏ⁺¹ = 2·2ᵏ
     > 2·k²              [by IH]
     = k² + k²
     > k² + 2k + 1       [need to show k² > 2k + 1]
     = (k+1)²
```

**Verify** k² > 2k + 1 for k ≥ 5:
- k² - 2k - 1 > 0
- For k = 5: 25 - 10 - 1 = 14 > 0 ✓
- Increasing for larger k ✓

Therefore 2ᵏ⁺¹ > (k+1)²

By induction, 2ⁿ > n² for all n ≥ 5.
∎

---

## 💪 STRONG INDUCTION

### The Principle

**Difference from Weak Induction**:
- **Weak**: Assume P(k) to prove P(k+1)
- **Strong**: Assume P(1), P(2), ..., P(k) to prove P(k+1)

**When to use**: When proving P(k+1) requires multiple previous cases.

### Structure Template

```
PROOF BY STRONG INDUCTION:

BASE CASE(S):
  [Prove P(1), P(2), ... as needed]

STRONG INDUCTIVE HYPOTHESIS:
  Assume P(j) is true for all 1 ≤ j ≤ k

INDUCTIVE STEP:
  [Prove P(k+1) using any/all of P(1),...,P(k)]

CONCLUSION:
  By strong induction, P(n) holds for all n ≥ 1
∎
```

### Example 1: Every Integer ≥ 2 Has Prime Factorization

**THEOREM**: Every integer n ≥ 2 can be written as a product of primes.

**PROOF**:

**BASE CASE** (n = 2):
- 2 is prime, so 2 = 2 (product of one prime) ✓

**STRONG INDUCTIVE HYPOTHESIS**:
Assume every integer j with 2 ≤ j ≤ k has a prime factorization.

**INDUCTIVE STEP**:
Consider k + 1:

**Case 1**: k + 1 is prime
- Then k + 1 is its own prime factorization ✓

**Case 2**: k + 1 is composite
- Then k + 1 = a·b where 2 ≤ a, b < k + 1
- By IH, a has prime factorization: a = p₁p₂...pᵣ
- By IH, b has prime factorization: b = q₁q₂...qₛ
- Therefore k + 1 = a·b = p₁p₂...pᵣq₁q₂...qₛ
- This is a prime factorization of k + 1 ✓

By strong induction, every n ≥ 2 has a prime factorization.
∎

### Example 2: Fibonacci Inequality

**THEOREM**: For the Fibonacci sequence F₁=1, F₂=1, Fₙ=Fₙ₋₁+Fₙ₋₂:
```
Fₙ ≥ ((1+√5)/2)ⁿ⁻² for all n ≥ 3
```

Let φ = (1+√5)/2 (golden ratio)

**PROOF**:

**BASE CASES**:
- n = 3: F₃ = 2, φ¹ = φ ≈ 1.618, so 2 > 1.618 ✓
- n = 4: F₄ = 3, φ² ≈ 2.618, so 3 > 2.618 ✓

**STRONG INDUCTIVE HYPOTHESIS**:
Assume Fⱼ ≥ φʲ⁻² for all 3 ≤ j ≤ k

**INDUCTIVE STEP**:
```
Fₖ₊₁ = Fₖ + Fₖ₋₁
     ≥ φᵏ⁻² + φᵏ⁻³        [by IH]
     = φᵏ⁻³(φ + 1)
     = φᵏ⁻³ · φ²          [golden ratio: φ² = φ + 1]
     = φᵏ⁻¹
     = φ⁽ᵏ⁺¹⁾⁻²           ✓
```

By strong induction, proven for all n ≥ 3.
∎

### Example 3: Postage Problem

**THEOREM**: Any amount ≥ 12 cents can be formed using 4-cent and 5-cent stamps.

**PROOF**:

**BASE CASES**:
- n = 12: 3×4 = 12 ✓
- n = 13: 2×4 + 1×5 = 13 ✓
- n = 14: 1×4 + 2×5 = 14 ✓
- n = 15: 3×5 = 15 ✓

**STRONG INDUCTIVE HYPOTHESIS**:
Assume any amount j cents with 12 ≤ j ≤ k can be formed.

**INDUCTIVE STEP**:
Consider k + 1 cents.
Since k + 1 ≥ 16, we have k + 1 - 4 ≥ 12.
By IH, k + 1 - 4 = k - 3 cents can be formed.
Add one 4-cent stamp: (k - 3) + 4 = k + 1 ✓

By strong induction, any amount ≥ 12 can be formed.
∎

---

## 🏗️ STRUCTURAL INDUCTION

### The Principle

Used for **recursively defined structures**:
- Lists, trees, formulas, strings

**Steps**:
1. **Base case**: Prove for simplest structures
2. **Inductive step**: If property holds for parts, show it holds for composite

### Example 1: Binary Trees

**Definition**: A binary tree is either:
- Empty (∅)
- A node with left and right subtrees

**THEOREM**: A binary tree with n nodes has exactly n + 1 empty subtrees.

**PROOF**:

**BASE CASE**: Empty tree
- n = 0 nodes
- 1 empty subtree (itself)
- 0 + 1 = 1 ✓

**INDUCTIVE STEP**:
Assume tree T has:
- Root node
- Left subtree L with nₗ nodes
- Right subtree R with nᵣ nodes

By IH:
- L has nₗ + 1 empty subtrees
- R has nᵣ + 1 empty subtrees

Tree T has:
- Total nodes: n = 1 + nₗ + nᵣ
- Empty subtrees: (nₗ + 1) + (nᵣ + 1) = nₗ + nᵣ + 2
- Need to show: nₗ + nᵣ + 2 = n + 1
- n + 1 = (1 + nₗ + nᵣ) + 1 = nₗ + nᵣ + 2 ✓

By structural induction, proven.
∎

### Example 2: Balanced Parentheses

**Definition**: Balanced strings are:
- ε (empty string)
- (S) where S is balanced
- ST where S and T are balanced

**THEOREM**: Every balanced string has equal numbers of ( and ).

**PROOF**:

**BASE CASE**: ε has 0 of each ✓

**INDUCTIVE STEP**:

**Case 1**: String is (S)
- By IH, S has n left and n right parens
- (S) has n+1 left and n+1 right parens ✓

**Case 2**: String is ST
- By IH, S has nₛ of each, T has nₜ of each
- ST has nₛ + nₜ of each ✓

By structural induction, proven.
∎

---

## ∃ EXISTENCE PROOFS

### Constructive Proof
**Show exactly how to construct an object.**

**Example**: There exists an irrational number.

**PROOF**: √2 is irrational (proved earlier). ∎

### Non-Constructive Proof
**Prove existence without construction.**

**Example**: There exist irrational numbers a and b such that aᵇ is rational.

**PROOF**:
Consider √2^(√2).

**Case 1**: √2^(√2) is rational
- Let a = b = √2 (both irrational)
- Then aᵇ is rational ✓

**Case 2**: √2^(√2) is irrational
- Let a = √2^(√2) (irrational) and b = √2 (irrational)
- Then aᵇ = (√2^(√2))^(√2) = √2^(√2·√2) = √2² = 2 (rational) ✓

One of these cases must be true, so such a and b exist!
(We don't know which case, but we proved existence)
∎

---

## ! UNIQUENESS PROOFS

### Method
Prove "there exists **exactly one**" object with property P:

1. **Existence**: Show at least one exists
2. **Uniqueness**: Assume two exist, prove they're identical

### Example: Additive Identity

**THEOREM**: There exists a unique real number e such that for all x ∈ ℝ: x + e = x.

**PROOF**:

**Existence**: e = 0 works, since x + 0 = x for all x. ✓

**Uniqueness**: 
Suppose e₁ and e₂ both work.
- Since e₁ works: e₂ + e₁ = e₂
- Since e₂ works: e₂ + e₁ = e₁
- Therefore: e₁ = e₂

So the identity is unique.
∎

---

## 🔍 PROOF BY EXHAUSTION

### Method
Check **all possible cases** individually.

**When to use**: Finite, manageable number of cases.

### Example: Small Cases

**THEOREM**: For 1 ≤ n ≤ 4, n² + n + 41 is prime.

**PROOF**:
- n = 1: 1 + 1 + 41 = 43 (prime) ✓
- n = 2: 4 + 2 + 41 = 47 (prime) ✓
- n = 3: 9 + 3 + 41 = 53 (prime) ✓
- n = 4: 16 + 4 + 41 = 61 (prime) ✓

All cases checked.
∎

**Note**: For n = 40: 1600 + 40 + 41 = 1681 = 41² (not prime!)

---

## ❌ COUNTEREXAMPLES

### Method
To **disprove** "For all n, P(n)", find **one** n where P(n) is false.

### Example 1

**Claim**: For all n ≥ 1, n² + n + 41 is prime.

**Counterexample**: n = 40
- 40² + 40 + 41 = 1681 = 41²
- Not prime!

Claim is **FALSE**.

### Example 2

**Claim**: If n² is divisible by 4, then n is divisible by 4.

**Counterexample**: n = 6
- n² = 36, and 4 | 36 ✓
- But 4 ∤ 6

Claim is **FALSE**.

**Correct statement**: If n² is divisible by 4, then n is divisible by 2.

---

## ⚠️ COMMON MISTAKES IN PROOFS

### 1. Assuming What You're Trying to Prove

**WRONG**:
```
Prove: n² + n is even for all n
"Proof": Assume n² + n is even...
```

**RIGHT**: Start with what you know (n is an integer), derive the conclusion.

### 2. Confusing "If P then Q" with "If Q then P"

**Statement**: If n is divisible by 6, then n is divisible by 2.

**WRONG**: "Since 12 is divisible by 2, it's divisible by 6." (False!)

### 3. Forgetting the Base Case in Induction

**WRONG**:
```
Inductive step looks good, but base case fails!
```

**Must check both!**

### 4. Using Examples as Proof

**WRONG**:
```
Claim: All primes are odd.
"Proof": 3, 5, 7, 11, 13 are all odd.
```

**Counterexample**: 2 is prime and even!

### 5. Circular Reasoning

**WRONG**:
```
Prove: A = B
"Proof": Since A = B, we have A = B.
```

**Must use independent facts!**

### 6. Incomplete Case Analysis

**WRONG**:
```
Prove for all n...
Case 1: n is even [proof]
[Forgot case 2: n is odd!]
```

### 7. Weak Induction When Strong Needed

**Problem**: Proving P(k+1) requires P(k-1), not just P(k).

**Solution**: Use strong induction!

### 8. Misusing "Without Loss of Generality" (WLOG)

**WRONG**: "WLOG assume a < b" when order actually matters!

**RIGHT**: Use WLOG only when cases are truly symmetric.

---

## 🎯 PROOF STRATEGY FLOWCHART

```
What type of statement?
│
├─ "For all n..." → Try INDUCTION or DIRECT PROOF
│  ├─ Can you get P(k+1) from P(k)? → Weak induction
│  ├─ Need multiple previous cases? → Strong induction
│  └─ Recursive structure? → Structural induction
│
├─ "If P then Q" → 
│  ├─ Q easy to reach from P? → Direct proof
│  ├─ ¬Q easier to work with? → Contrapositive
│  └─ Both hard? → Try contradiction
│
├─ "There exists..." → EXISTENCE PROOF
│  ├─ Can you build it? → Constructive
│  └─ Just prove it exists? → Non-constructive
│
├─ "Exactly one..." → UNIQUENESS PROOF
│
├─ Small finite cases? → EXHAUSTION
│
└─ Disprove claim? → Find COUNTEREXAMPLE
```

---

## 💡 TIPS FOR WRITING GOOD PROOFS

1. **Start with what you know** (givens, definitions)
2. **State your goal clearly**
3. **Use proper notation** and define variables
4. **Justify each step** (cite theorems, definitions)
5. **Write in complete sentences** (math + words)
6. **Be precise** but not pedantic
7. **End clearly** with ∎ or QED
8. **Read it aloud** - does it make sense?

---

## 🎓 PRACTICE PROBLEMS

Try proving these on your own:

1. For all n ≥ 1: 1² + 2² + ... + n² = n(n+1)(2n+1)/6
2. If n is odd, then n² ≡ 1 (mod 8)
3. √3 is irrational
4. For all n ≥ 0: Fₙ + Fₙ₊₁ = Fₙ₊₂ (Fibonacci)
5. Any amount ≥ 8 cents can be made with 3-cent and 5-cent stamps
6. Every natural number > 1 is either prime or has a prime divisor
7. For all n ≥ 1: 1 + 3 + 5 + ... + (2n-1) = n²

---

**🎯 Master these techniques and you'll be proving theorems like a pro!** 🚀

---

*Remember: Mathematics is not about memorizing proofs—it's about understanding the logical flow and being able to construct your own arguments.*

**EOF** ✨