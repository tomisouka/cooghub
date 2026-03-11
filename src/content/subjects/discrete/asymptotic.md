# ⚡ Asymptotic Analysis & Algorithm Complexity Proofs
## Proving Big-O, Omega, and Theta - Complete Master Guide

> Master the art of analyzing and proving algorithm running times with advanced techniques and comprehensive examples

---

## 📋 TABLE OF CONTENTS

### 🎯 Asymptotic Notation
- **Big-O (O)** → Upper Bound
- **Big-Omega (Ω)** → Lower Bound
- **Big-Theta (Θ)** → Tight Bound
- **Little-o (o)** → Strict Upper Bound
- **Little-omega (ω)** → Strict Lower Bound

### ✅ Proving Bounds
- Direct Definition Method (10+ Examples)
- Limit Method (Advanced Techniques)
- Common Pitfalls & Edge Cases

### 🔁 Analyzing Algorithms
- Single & Nested Loops
- Logarithmic & Exponential Patterns
- Conditional Statements
- Multiple Variables & Parameters
- **NEW:** Complex Loop Patterns
- **NEW:** Binary Search Variations

### 🔄 Recurrence Relations
- Substitution Method (Detailed)
- Recursion Tree Method (Visual)
- Master Theorem (Extended Cases)
- Akra-Bazzi Method (General Form)
- **NEW:** Advanced Recurrences
- **NEW:** Non-Standard Patterns

### 🎨 Advanced Techniques
- Amortized Analysis (3 Methods)
- Probabilistic Analysis
- Lower Bounds (Decision Trees)
- **NEW:** Potential Functions
- **NEW:** Competitive Analysis
- **NEW:** Smoothed Analysis

### 🧮 Mathematical Foundations
- **NEW:** Summation Formulas
- **NEW:** Series Manipulation
- **NEW:** L'Hôpital's Rule Applications
- **NEW:** Stirling's Approximation

### 🎓 Advanced Topics
- **NEW:** Cache Complexity
- **NEW:** Parallel Algorithms
- **NEW:** Space-Time Tradeoffs
- **NEW:** Average vs Worst Case

### 🏋️ Practice Problems
- 30+ Graded Problems
- Detailed Solutions

---

## 🎯 ASYMPTOTIC NOTATION: FORMAL DEFINITIONS

### Big-O (O) - Upper Bound

**Intuitive**: "f grows at most as fast as g"

**Formal Definition**:
```
f(n) = O(g(n)) if and only if:
∃ c > 0, n₀ > 0 such that ∀n ≥ n₀:
    0 ≤ f(n) ≤ c·g(n)
```

**English**: f is Big-O of g if you can find constants c and n₀ such that f(n) is always below c·g(n) for all n past n₀.

**Visual**:
```
     f(n)
      |         
      |        c·g(n)
      |       /
      |      /
      |  ___/_____ f(n)
      | /
      |/
      +-------------- n
           n₀
```

**Key Properties**:
- Reflexive: f(n) = O(f(n))
- Transitive: If f = O(g) and g = O(h), then f = O(h)
- **NOT symmetric**: f = O(g) does NOT imply g = O(f)
- Constant multiplication: O(cf(n)) = O(f(n)) for c > 0

**Examples**:
- `3n + 5 = O(n)` ✓
- `n² = O(n³)` ✓
- `100n = O(n)` ✓
- `n log n = O(n²)` ✓
- `2ⁿ + n³ = O(2ⁿ)` ✓ (exponential dominates)
- `log(n!) = O(n log n)` ✓ (Stirling's approximation)

### Big-Omega (Ω) - Lower Bound

**Intuitive**: "f grows at least as fast as g"

**Formal Definition**:
```
f(n) = Ω(g(n)) if and only if:
∃ c > 0, n₀ > 0 such that ∀n ≥ n₀:
    0 ≤ c·g(n) ≤ f(n)
```

**Equivalently**: f = Ω(g) ⟺ g = O(f)

**English**: f is Big-Omega of g if you can find constants c and n₀ such that f(n) is always above c·g(n) for all n past n₀.

**Examples**:
- `3n² + 5n = Ω(n²)` ✓
- `n³ = Ω(n²)` ✓
- `100n² = Ω(n)` ✓
- `n log n = Ω(n)` ✓
- `2ⁿ = Ω(nᵏ)` ✓ for any constant k

### Big-Theta (Θ) - Tight Bound

**Intuitive**: "f grows at the same rate as g"

**Formal Definition**:
```
f(n) = Θ(g(n)) if and only if:
    f(n) = O(g(n)) AND f(n) = Ω(g(n))

Equivalently:
∃ c₁, c₂ > 0, n₀ > 0 such that ∀n ≥ n₀:
    0 ≤ c₁·g(n) ≤ f(n) ≤ c₂·g(n)
```

**English**: f is sandwiched between two multiples of g.

**Visual**:
```
        c₂·g(n)
       /
      /___f(n)___
     /
    /
   / c₁·g(n)
  /
 +-------------- n
      n₀
```

**Key Properties**:
- Symmetric: f = Θ(g) ⟺ g = Θ(f)
- Transitive: If f = Θ(g) and g = Θ(h), then f = Θ(h)
- Reflexive: f = Θ(f)

**Examples**:
- `3n² + 5n = Θ(n²)` ✓
- `100n log n = Θ(n log n)` ✓
- `(n² + n)/2 = Θ(n²)` ✓
- `log₂ n = Θ(log₁₀ n)` ✓ (log bases differ by constant)
- `n! = Θ(√n · (n/e)ⁿ)` ✓ (Stirling's formula)

### Little-o (o) - Strict Upper Bound

**Intuitive**: "f grows strictly slower than g"

**Formal Definition**:
```
f(n) = o(g(n)) if and only if:
∀ c > 0, ∃ n₀ > 0 such that ∀n ≥ n₀:
    0 ≤ f(n) < c·g(n)

Equivalently:
    lim[n→∞] f(n)/g(n) = 0
```

**Note**: The key difference from Big-O is that little-o requires the inequality to hold for **all** c > 0, not just some c.

**Examples**:
- `n = o(n²)` ✓
- `log n = o(n)` ✓
- `n² ≠ o(n²)` ✗ (not strictly slower)
- `n log n = o(n²)` ✓
- `√n = o(n)` ✓
- `n^0.999 = o(n)` ✓

### Little-omega (ω) - Strict Lower Bound

**Intuitive**: "f grows strictly faster than g"

**Formal Definition**:
```
f(n) = ω(g(n)) if and only if:
    lim[n→∞] f(n)/g(n) = ∞
```

**Equivalently**: f = ω(g) ⟺ g = o(f)

**Examples**:
- `n² = ω(n)` ✓
- `n log n = ω(n)` ✓
- `2ⁿ = ω(nᵏ)` ✓ for any constant k
- `n! = ω(2ⁿ)` ✓

---

## 📊 NOTATION COMPARISON TABLE

| Notation | Meaning | Analogy | Limit | Set Relationship |
|----------|---------|---------|-------|------------------|
| `f = O(g)` | f ≤ g | `≤` | lim f/g ≤ some constant | f ⊆ O(g) |
| `f = Ω(g)` | f ≥ g | `≥` | lim f/g ≥ some constant > 0 | f ⊆ Ω(g) |
| `f = Θ(g)` | f = g | `=` | 0 < lim f/g < ∞ | f ⊆ Θ(g) = O(g) ∩ Ω(g) |
| `f = o(g)` | f < g | `<` | lim f/g = 0 | f ⊆ o(g) ⊂ O(g) |
| `f = ω(g)` | f > g | `>` | lim f/g = ∞ | f ⊆ ω(g) ⊂ Ω(g) |

**Important Relations**:
```
o(g) ⊂ O(g)
ω(g) ⊂ Ω(g)
Θ(g) = O(g) ∩ Ω(g)
f = Θ(g) ⟺ f = O(g) AND f = Ω(g)
```

---

## ✅ PROVING BIG-O: Method 1 (Direct Definition)

### Template

**To prove**: f(n) = O(g(n))

**Strategy**:
1. Find suitable c > 0
2. Find suitable n₀ > 0
3. Prove: ∀n ≥ n₀, f(n) ≤ c·g(n)

### Example 1: Linear Function

**CLAIM**: 3n + 5 = O(n)

**PROOF**:
Need to show: ∃c, n₀ such that 3n + 5 ≤ c·n for all n ≥ n₀

**Finding c and n₀**:
```
3n + 5 ≤ c·n
3n + 5 ≤ c·n

For n ≥ 5:
    5 ≤ n (since n ≥ 5)
    3n + 5 ≤ 3n + n = 4n
    
So: 3n + 5 ≤ 4n for all n ≥ 5
```

**Choose**: c = 4, n₀ = 5

**Verification**: For all n ≥ 5:
```
3n + 5 ≤ 3n + n = 4n ✓
```

Therefore: 3n + 5 = O(n) ∎

### Example 2: Quadratic Function

**CLAIM**: 2n² + 3n + 1 = O(n²)

**PROOF**:
For n ≥ 1:
```
2n² + 3n + 1 ≤ 2n² + 3n² + n²    [since 3n ≤ 3n² and 1 ≤ n² for n ≥ 1]
              = 6n²
```

**Choose**: c = 6, n₀ = 1

Therefore: 2n² + 3n + 1 = O(n²) ∎

**Alternative (tighter bound)**:
For n ≥ 3:
```
3n ≤ n²  (since n ≥ 3)
1 ≤ n²   (since n ≥ 1)

2n² + 3n + 1 ≤ 2n² + n² + n² = 4n²
```

**Choose**: c = 4, n₀ = 3 (tighter!) ∎

### Example 3: Logarithmic

**CLAIM**: 5 log₂ n + 3 = O(log n)

**PROOF**:
For n ≥ 8 (i.e., log₂ n ≥ 3):
```
3 ≤ log₂ n

5 log₂ n + 3 ≤ 5 log₂ n + log₂ n = 6 log₂ n
```

**Choose**: c = 6, n₀ = 8

Therefore: 5 log₂ n + 3 = O(log n) ∎

### Example 4: Polynomial with Negative Terms

**CLAIM**: n² - 100n + 50 = O(n²)

**PROOF**:
For n ≥ 1:
```
n² - 100n + 50 ≤ n²    [need to verify]

This doesn't work for small n!
For n = 50: 2500 - 5000 + 50 = -2450 < 0

Better approach:
|n² - 100n + 50| ≤ n² + 100n + 50
                 ≤ n² + 100n² + n²    [for n ≥ 1]
                 = 102n²
```

**Choose**: c = 102, n₀ = 1

Therefore: n² - 100n + 50 = O(n²) ∎

**Note**: Big-O can handle negative values! The definition uses 0 ≤ f(n) when f is eventually positive.

### Example 5: Multiple Logarithms

**CLAIM**: log n + log² n = O(log² n)

**PROOF**:
For n ≥ 2 (so log n ≥ 1):
```
log n ≤ log² n    [since log n ≥ 1]

log n + log² n ≤ log² n + log² n = 2 log² n
```

**Choose**: c = 2, n₀ = 2

Therefore: log n + log² n = O(log² n) ∎

### Example 6: Exponential Function

**CLAIM**: 3·2ⁿ + 5n² = O(2ⁿ)

**PROOF**:
For n ≥ 5:
```
5n² ≤ 5·2ⁿ    [since 2ⁿ grows faster than n²]

To verify: Need 5n² ≤ 5·2ⁿ
           n² ≤ 2ⁿ

Check: n=5: 25 ≤ 32 ✓
For n ≥ 5, 2ⁿ grows exponentially while n² grows polynomially.

3·2ⁿ + 5n² ≤ 3·2ⁿ + 5·2ⁿ = 8·2ⁿ
```

**Choose**: c = 8, n₀ = 5

Therefore: 3·2ⁿ + 5n² = O(2ⁿ) ∎

### Example 7: Square Root

**CLAIM**: n + √n = O(n)

**PROOF**:
For n ≥ 1:
```
√n ≤ n    [since √n · √n = n and √n ≤ n for n ≥ 1]

n + √n ≤ n + n = 2n
```

**Choose**: c = 2, n₀ = 1

Therefore: n + √n = O(n) ∎

### Example 8: Fractional Powers

**CLAIM**: n^(2/3) + n^(1/2) = O(n^(2/3))

**PROOF**:
For n ≥ 1:
```
n^(1/2) ≤ n^(2/3)    [since 1/2 < 2/3 and n ≥ 1]

n^(2/3) + n^(1/2) ≤ n^(2/3) + n^(2/3) = 2n^(2/3)
```

**Choose**: c = 2, n₀ = 1

Therefore: n^(2/3) + n^(1/2) = O(n^(2/3)) ∎

### Example 9: Factorial Bound

**CLAIM**: n! = O(nⁿ)

**PROOF**:
```
n! = 1 · 2 · 3 · ... · n
   ≤ n · n · n · ... · n    [each factor ≤ n]
   = nⁿ
```

**Choose**: c = 1, n₀ = 1

Therefore: n! = O(nⁿ) ∎

### Example 10: Harmonic Sum

**CLAIM**: H_n = 1 + 1/2 + 1/3 + ... + 1/n = O(log n)

**PROOF** (Integral approximation):
```
H_n ≤ 1 + ∫₁ⁿ (1/x) dx
    = 1 + [ln x]₁ⁿ
    = 1 + ln n
    ≤ 2 ln n    [for n ≥ e]
    = 2 log_e n
```

**Choose**: c = 2, n₀ = 3

Therefore: H_n = O(log n) ∎

---

## 🎯 PROVING BIG-O: Method 2 (Limit Method)

### The Limit Theorem

```
If lim[n→∞] f(n)/g(n) = L, then:

• If L < ∞       → f(n) = O(g(n))
• If L > 0       → f(n) = Ω(g(n))
• If 0 < L < ∞   → f(n) = Θ(g(n))
• If L = 0       → f(n) = o(g(n))
• If L = ∞       → f(n) = ω(g(n))
```

**When to use**: 
- When direct method is algebraically messy
- When you need to compare growth rates
- When dealing with limits naturally

### Example 1: Polynomial

**CLAIM**: 3n² + 5n = Θ(n²)

**PROOF**:
```
lim[n→∞] (3n² + 5n) / n²
= lim[n→∞] (3n²/n² + 5n/n²)
= lim[n→∞] (3 + 5/n)
= 3 + 0
= 3
```

Since 0 < 3 < ∞, we have: 3n² + 5n = Θ(n²) ∎

### Example 2: Log vs Polynomial

**CLAIM**: log n = o(n)

**PROOF** (using L'Hôpital's Rule):
```
lim[n→∞] log n / n
= lim[n→∞] (1/n) / 1     [L'Hôpital]
= lim[n→∞] 1/n
= 0
```

Therefore: log n = o(n) ∎

### Example 3: Exponential vs Polynomial

**CLAIM**: 2ⁿ = ω(n³)

**PROOF**:
```
lim[n→∞] 2ⁿ / n³
= lim[n→∞] 2ⁿ ln 2 / 3n²     [L'Hôpital]
= lim[n→∞] 2ⁿ (ln 2)² / 6n   [L'Hôpital]
= lim[n→∞] 2ⁿ (ln 2)³ / 6    [L'Hôpital]
= ∞
```

Therefore: 2ⁿ = ω(n³) ∎

### Example 4: √n log n vs n

**CLAIM**: √n log n = o(n)

**PROOF**:
```
lim[n→∞] (√n log n) / n
= lim[n→∞] log n / √n
= lim[n→∞] (1/n) / (1/(2√n))     [L'Hôpital]
= lim[n→∞] (1/n) · (2√n)
= lim[n→∞] 2/√n
= 0
```

Therefore: √n log n = o(n) ∎

### Example 5: Factorial vs Exponential

**CLAIM**: n! = ω(2ⁿ)

**PROOF** (using Stirling's approximation):

Stirling's formula: n! ≈ √(2πn) · (n/e)ⁿ

```
lim[n→∞] n! / 2ⁿ
≈ lim[n→∞] [√(2πn) · (n/e)ⁿ] / 2ⁿ
= lim[n→∞] √(2πn) · (n/(2e))ⁿ

Since n/(2e) ≈ n/5.44 > 1 for n > 6,
and (n/(2e))ⁿ grows without bound,
the limit = ∞
```

Therefore: n! = ω(2ⁿ) ∎

### Example 6: Log Factorial

**CLAIM**: log(n!) = Θ(n log n)

**PROOF**:
Using Stirling: n! ≈ √(2πn) · (n/e)ⁿ

```
log(n!) ≈ log[√(2πn) · (n/e)ⁿ]
        = log√(2πn) + log(n/e)ⁿ
        = (1/2)log(2πn) + n log(n/e)
        = (1/2)log(2πn) + n log n - n log e
        = (1/2)log(2πn) + n log n - n

lim[n→∞] log(n!) / (n log n)
= lim[n→∞] [(1/2)log(2πn) + n log n - n] / (n log n)
= lim[n→∞] [1 - n/(n log n) + (log(2πn))/(2n log n)]
= 1 - 0 + 0
= 1
```

Therefore: log(n!) = Θ(n log n) ∎

### Example 7: n^(log n)

**CLAIM**: n^(log n) = ω(n^k) for any constant k

**PROOF**:
```
n^(log n) = 2^(log n · log n) = 2^((log n)²)

lim[n→∞] 2^((log n)²) / n^k
= lim[n→∞] 2^((log n)²) / 2^(k log n)
= lim[n→∞] 2^((log n)² - k log n)

As n → ∞, (log n)² grows without bound while k log n is linear in log n
Therefore (log n)² - k log n → ∞
So 2^((log n)² - k log n) → ∞
```

Therefore: n^(log n) = ω(n^k) ∎

---

## 🔍 PROVING BIG-OMEGA AND THETA

### Proving Big-Omega

**Example 1**: 3n² + 5n = Ω(n²)

**PROOF**:
For all n ≥ 1:
```
3n² + 5n ≥ 3n²    [dropping positive term]
```

**Choose**: c = 3, n₀ = 1

Therefore: 3n² + 5n = Ω(n²) ∎

**Example 2**: n! = Ω(2ⁿ/√n)

**PROOF** (using Stirling):
```
n! ≈ √(2πn) · (n/e)ⁿ

For large n:
n! ≥ (n/e)ⁿ
   = (n/e)ⁿ
   > (n/3)ⁿ    [since e < 3]
   ≥ 2ⁿ        [for n ≥ 6, since (n/3)ⁿ > 2ⁿ]

More precisely:
n! ≥ √(2πn) · (n/e)ⁿ / 2
   ≥ √n · (n/e)ⁿ / 2    [for large n]
```

Therefore: n! = Ω(2ⁿ/√n) ✓

### Proving Big-Theta (Method 1: Double Proof)

**Example**: 3n² + 5n = Θ(n²)

**PROOF**:

**Part 1 (Upper Bound)**: Proved 3n² + 5n = O(n²) with c₂ = 6, n₀ = 1

**Part 2 (Lower Bound)**: Proved 3n² + 5n = Ω(n²) with c₁ = 3, n₀ = 1

**Combining**: For all n ≥ 1:
```
3n² ≤ 3n² + 5n ≤ 6n²
c₁·n² ≤ f(n) ≤ c₂·n²
```

Therefore: 3n² + 5n = Θ(n²) ∎

### Proving Big-Theta (Method 2: Limit)

**Example 1**: (n² + n) / 2 = Θ(n²)

**PROOF**:
```
lim[n→∞] [(n² + n)/2] / n²
= lim[n→∞] (n² + n) / (2n²)
= lim[n→∞] (1 + 1/n) / 2
= 1/2
```

Since 0 < 1/2 < ∞, we have Θ(n²) ∎

**Example 2**: Σᵢ₌₁ⁿ i² = Θ(n³)

**PROOF**:
Using the formula: Σᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6

```
lim[n→∞] [n(n+1)(2n+1)/6] / n³
= lim[n→∞] (n+1)(2n+1) / (6n²)
= lim[n→∞] (2n² + 3n + 1) / (6n²)
= lim[n→∞] (2 + 3/n + 1/n²) / 6
= 2/6
= 1/3
```

Since 0 < 1/3 < ∞, we have: Σᵢ₌₁ⁿ i² = Θ(n³) ∎

---

## 🔁 ANALYZING ALGORITHMS: LOOPS

### Single Loop

**Algorithm**:
```python
sum = 0
for i in range(n):
    sum += i
```

**Analysis**:
- Loop runs: n times
- Each iteration: O(1)
- Total: **T(n) = Θ(n)**

### Nested Loops (Independent)

**Algorithm**:
```python
for i in range(n):
    for j in range(m):
        print(i, j)
```

**Analysis**:
- Outer loop: n iterations
- Inner loop: m iterations each time
- Total: **T(n,m) = Θ(nm)**

If m = n: **T(n) = Θ(n²)**

### Nested Loops (Dependent)

**Algorithm**:
```python
for i in range(n):
    for j in range(i):
        print(i, j)
```

**Analysis**:
```
i = 0: 0 iterations
i = 1: 1 iteration
i = 2: 2 iterations
...
i = n-1: n-1 iterations

Total = 0 + 1 + 2 + ... + (n-1)
      = (n-1)n/2
      = n²/2 - n/2
      = Θ(n²)
```

**Formal Proof**:
```
T(n) = Σᵢ₌₀ⁿ⁻¹ i
     = (n-1)n/2
     = (n² - n)/2

lim[n→∞] [(n² - n)/2] / n²
= lim[n→∞] (1 - 1/n) / 2
= 1/2

Therefore: T(n) = Θ(n²) ∎
```

### Triple Nested Loops

**Algorithm**:
```python
for i in range(n):
    for j in range(i):
        for k in range(j):
            print(i, j, k)
```

**Analysis**:
```
T(n) = Σᵢ₌₀ⁿ⁻¹ Σⱼ₌₀ⁱ⁻¹ j
     = Σᵢ₌₀ⁿ⁻¹ [i(i-1)/2]
     = (1/2) Σᵢ₌₀ⁿ⁻¹ (i² - i)
     = (1/2) [Σi² - Σi]
     = (1/2) [(n-1)n(2n-1)/6 - (n-1)n/2]
     = Θ(n³)
```

**Detailed Calculation**:
```
Σᵢ₌₀ⁿ⁻¹ i² = (n-1)n(2n-1)/6
Σᵢ₌₀ⁿ⁻¹ i = (n-1)n/2

T(n) = (1/2)[(n-1)n(2n-1)/6 - (n-1)n/2]
     = (n-1)n/2 · [(2n-1)/6 - 1/2]
     = (n-1)n/2 · [(2n-1-3)/6]
     = (n-1)n/2 · [(2n-4)/6]
     = (n-1)n(n-2)/6

lim[n→∞] [(n-1)n(n-2)/6] / n³ = 1/6

Therefore: T(n) = Θ(n³) ∎
```

### Logarithmic Loop

**Algorithm**:
```python
i = 1
while i < n:
    i = i * 2
```

**Analysis**:
After k iterations: i = 2ᵏ

Loop stops when: 2ᵏ ≥ n
Therefore: k ≥ log₂ n

**T(n) = Θ(log n)**

**Formal Proof**:
```
Loop invariant: i = 2^iteration
Stops when: 2^k ≥ n
Taking log: k ≥ log₂ n
Therefore: k = ⌈log₂ n⌉ = Θ(log n) ∎
```

### Logarithmic with Linear Work

**Algorithm**:
```python
i = n
while i > 1:
    for j in range(n):
        print(j)
    i = i // 2
```

**Analysis**:
```
Outer loop: log₂ n iterations
Inner loop: n iterations each time
Total: n · log₂ n

T(n) = Θ(n log n)
```

### Harmonic Loop

**Algorithm**:
```python
for i in range(1, n+1):
    for j in range(1, n+1, i):  # step by i
        print(j)
```

**Analysis**:
```
i = 1: n iterations
i = 2: n/2 iterations
i = 3: n/3 iterations
...
i = n: 1 iteration

Total = n(1 + 1/2 + 1/3 + ... + 1/n)
      = n · H_n
      = Θ(n log n)  [since H_n = Θ(log n)]
```

### Square Root Loop

**Algorithm**:
```python
i = 0
while i * i < n:
    i += 1
```

**Analysis**:
```
Stops when: i² ≥ n
Therefore: i ≥ √n

T(n) = Θ(√n)
```

### Exponential Loop

**Algorithm**:
```python
def factorial_loop(n):
    result = 1
    for i in range(1, n+1):
        for j in range(result):
            print(j)
        result = result * i
```

**Analysis**:
```
i = 1: result = 1, inner loop = 1
i = 2: result = 2, inner loop = 2
i = 3: result = 6, inner loop = 6
...
i = k: result = k!, inner loop = k!

Total = 1 + 1 + 2 + 6 + 24 + ... + (n-1)!
      ≈ n! [dominated by last term]
      = Θ(n!)
```

### Nested Logarithmic Loops

**Algorithm**:
```python
i = n
while i > 1:
    j = n
    while j > 1:
        print(i, j)
        j = j // 2
    i = i // 2
```

**Analysis**:
```
Outer loop: log₂ n iterations
Inner loop: log₂ n iterations each time
Total: (log₂ n) · (log₂ n)

T(n) = Θ(log² n)
```

### Conditional Loop Complexity

**Algorithm**:
```python
for i in range(n):
    if i % 2 == 0:
        for j in range(i):
            print(j)
    else:
        for j in range(i, n):
            print(j)
```

**Analysis**:
```
Even i: j loop runs i times
Odd i: j loop runs (n - i) times

Even iterations: 0 + 2 + 4 + ... + (n-2) ≈ n²/4
Odd iterations: n + (n-2) + (n-4) + ... ≈ n²/4

Total ≈ n²/4 + n²/4 = n²/2

T(n) = Θ(n²)
```

---

## 🌳 RECURRENCE RELATIONS

### Method 1: Substitution Method

**Steps**:
1. Guess the solution
2. Prove by induction

**Example 1**: Binary Search

**Recurrence**:
```
T(n) = T(n/2) + O(1)
T(1) = O(1)
```

**Guess**: T(n) = O(log n)

**PROOF by Induction**:

**Base Case**: T(1) = c₁ = O(1) ✓

**Inductive Hypothesis**: T(k) ≤ c log k for all k < n

**Inductive Step**: Show T(n) ≤ c log n
```
T(n) = T(n/2) + c₂
     ≤ c log(n/2) + c₂         [by IH]
     = c(log n - log 2) + c₂
     = c log n - c + c₂
     ≤ c log n                  [if c ≥ c₂]
```

Choose c ≥ c₂. Therefore: T(n) = O(log n) ∎

**Example 2**: Merge Sort

**Recurrence**:
```
T(n) = 2T(n/2) + O(n)
T(1) = O(1)
```

**Guess**: T(n) = O(n log n)

**PROOF**:

**Base Case**: T(1) = c₁ ✓

**IH**: T(k) ≤ c k log k for k < n

**Inductive Step**:
```
T(n) = 2T(n/2) + c₂n
     ≤ 2·c(n/2)log(n/2) + c₂n     [by IH]
     = cn(log n - log 2) + c₂n
     = cn log n - cn + c₂n
     ≤ cn log n                    [if c ≥ c₂]
```

Therefore: T(n) = O(n log n) ∎

**Example 3**: Towers of Hanoi

**Recurrence**:
```
T(n) = 2T(n-1) + 1
T(1) = 1
```

**Guess**: T(n) = Θ(2ⁿ)

**PROOF**:
```
T(1) = 1
T(2) = 2(1) + 1 = 3
T(3) = 2(3) + 1 = 7
T(4) = 2(7) + 1 = 15

Pattern: T(n) = 2ⁿ - 1

Base case: T(1) = 2¹ - 1 = 1 ✓

IH: T(k) = 2ᵏ - 1

Inductive step:
T(k+1) = 2T(k) + 1
       = 2(2ᵏ - 1) + 1
       = 2ᵏ⁺¹ - 2 + 1
       = 2ᵏ⁺¹ - 1 ✓
```

Therefore: T(n) = 2ⁿ - 1 = Θ(2ⁿ) ∎

### Method 2: Recursion Tree

**Visual approach**: Draw tree of recursive calls.

**Example 1**: T(n) = 2T(n/2) + n

**Tree**:
```
Level 0:           n                    Cost: n
                 /   \
Level 1:       n/2   n/2                Cost: n
              / \   / \
Level 2:    n/4 n/4 n/4 n/4            Cost: n
            ...
Level log n: 1  1  1  ...  1           Cost: n
             (n leaves)

Total levels: log₂ n + 1
Cost per level: n
Total: n × (log₂ n + 1) = Θ(n log n)
```

**Example 2**: T(n) = T(n/3) + T(2n/3) + n

```
Level 0:             n                     Cost: n
                   /   \
Level 1:         n/3   2n/3                Cost: n/3 + 2n/3 = n
                / \    / \
Level 2:      n/9 2n/9 2n/9 4n/9          Cost: n
              ...

Height: log₃/₂ n (longest path)
Cost per level: ≤ n
Total: O(n log n)
```

**Example 3**: T(n) = 3T(n/4) + n²

```
Level 0:                 n²                     Cost: n²
                    /    |    \
Level 1:      (n/4)²  (n/4)²  (n/4)²          Cost: 3(n/4)² = 3n²/16
             / | \    / | \    / | \
Level 2:   9·(n/16)²                           Cost: 9n²/256
           ...

Height: log₄ n
Geometric series: n² [1 + 3/16 + (3/16)² + ...]
                = n² · [1/(1 - 3/16)]
                = n² · 16/13
                = Θ(n²)
```

### Method 3: Master Theorem

**Standard Form**: T(n) = aT(n/b) + f(n)

**Where**:
- a ≥ 1 (number of subproblems)
- b > 1 (factor by which n is reduced)
- f(n) = additional work per level
- Critical value: n^(log_b a)

**Three Cases**:

**Case 1**: If f(n) = O(n^(log_b a - ε)) for some ε > 0
```
Then: T(n) = Θ(n^(log_b a))
```
*Work dominated by leaves*

**Case 2**: If f(n) = Θ(n^(log_b a) · log^k n) for some k ≥ 0
```
Then: T(n) = Θ(n^(log_b a) · log^(k+1) n)
```
*Work evenly distributed*

**Case 3**: If f(n) = Ω(n^(log_b a + ε)) for some ε > 0
AND af(n/b) ≤ cf(n) for some c < 1 and large n (regularity)
```
Then: T(n) = Θ(f(n))
```
*Work dominated by root*

### Master Theorem Examples

**Example 1**: T(n) = 9T(n/3) + n

**Analysis**:
- a = 9, b = 3, f(n) = n
- n^(log_b a) = n^(log₃ 9) = n²
- Compare f(n) = n with n²
- n = O(n²⁻ᵉ) for ε = 1

**Case 1 applies**: T(n) = **Θ(n²)**

**Example 2**: T(n) = T(2n/3) + 1

**Analysis**:
- a = 1, b = 3/2, f(n) = 1
- n^(log_b a) = n^(log₃/₂ 1) = n⁰ = 1
- f(n) = 1 = Θ(1) = Θ(n⁰ · log⁰ n)

**Case 2 applies with k=0**: T(n) = **Θ(log n)**

**Example 3**: T(n) = 3T(n/4) + n log n

**Analysis**:
- a = 3, b = 4, f(n) = n log n
- n^(log_b a) = n^(log₄ 3) ≈ n^0.793
- f(n) = n log n = Ω(n^(0.793 + ε)) for ε = 0.2
- Check regularity: 3(n/4) log(n/4) ≤ c·n log n
  - = (3/4)n log n - (3/4)n log 4
  - ≤ (3/4)n log n for large n ✓ with c = 3/4

**Case 3 applies**: T(n) = **Θ(n log n)**

**Example 4**: T(n) = 2T(n/2) + n log n

**Analysis**:
- a = 2, b = 2, f(n) = n log n
- n^(log_b a) = n^(log₂ 2) = n
- Compare f(n) = n log n with n
- f(n) = n log n = Θ(n · log¹ n)

**Case 2 applies with k=1**: T(n) = **Θ(n log² n)**

**Example 5**: T(n) = 4T(n/2) + n² log n

**Analysis**:
- a = 4, b = 2, f(n) = n² log n
- n^(log_b a) = n^(log₂ 4) = n²
- f(n) = n² log n = Θ(n² · log¹ n)

**Case 2 applies with k=1**: T(n) = **Θ(n² log² n)**

**Example 6**: T(n) = 2T(n/2) + n/log n

**Analysis**:
- a = 2, b = 2, f(n) = n/log n
- n^(log_b a) = n
- f(n) = n/log n = O(n)
- BUT: n/log n is NOT O(n^(1-ε)) for any ε > 0

**Master Theorem doesn't apply!**
Actual answer: T(n) = Θ(n log log n) (requires other methods)

### Method 4: Akra-Bazzi Method

**Most General Form**: 
```
T(n) = Σᵢ₌₁ᵏ aᵢT(n/bᵢ) + f(n)
```

**Solution**:
Find p such that Σᵢ₌₁ᵏ aᵢ/bᵢᵖ = 1

Then:
```
T(n) = Θ(nᵖ [1 + ∫₁ⁿ f(u)/uᵖ⁺¹ du])
```

**Example**: T(n) = T(n/3) + T(2n/3) + n

**Solution**:
```
Find p: 1/(3ᵖ) + 1/(3/2)ᵖ = 1

Solving: p = 1

T(n) = Θ(n [1 + ∫₁ⁿ u/u² du])
     = Θ(n [1 + ∫₁ⁿ 1/u du])
     = Θ(n [1 + ln n])
     = Θ(n log n)
```

---

## 📊 MASTER THEOREM QUICK REFERENCE

| Recurrence | a | b | n^(log_b a) | f(n) comparison | Case | Result |
|------------|---|---|-------------|----------------|------|--------|
| T(n) = 2T(n/2) + 1 | 2 | 2 | n | 1 < n | 1 | Θ(n) |
| T(n) = 2T(n/2) + n | 2 | 2 | n | n = n | 2 | Θ(n log n) |
| T(n) = 2T(n/2) + n² | 2 | 2 | n | n² > n | 3 | Θ(n²) |
| T(n) = 4T(n/2) + n | 4 | 2 | n² | n < n² | 1 | Θ(n²) |
| T(n) = 4T(n/2) + n² | 4 | 2 | n² | n² = n² | 2 | Θ(n² log n) |
| T(n) = 4T(n/2) + n³ | 4 | 2 | n² | n³ > n² | 3 | Θ(n³) |
| T(n) = T(n/2) + 1 | 1 | 2 | 1 | 1 = 1 | 2 | Θ(log n) |
| T(n) = 8T(n/2) + n² | 8 | 2 | n³ | n² < n³ | 1 | Θ(n³) |
| T(n) = 2T(n/2) + n log n | 2 | 2 | n | n log n (k=1) | 2 | Θ(n log² n) |
| T(n) = 3T(n/4) + n√n | 3 | 4 | n^0.793 | n^1.5 > n^0.793 | 3 | Θ(n√n) |

---

## 🎨 AMORTIZED ANALYSIS

### What is it?

**Amortized analysis**: Average cost per operation over a worst-case sequence.

**Not the same as average case!** 
- Average case: Expected cost over random inputs
- Amortized: Average cost in worst-case sequence

### Three Methods:
1. Aggregate Method
2. Accounting Method
3. Potential Method

### Method 1: Aggregate Method

**Idea**: Find total cost of n operations, divide by n.

**Example**: Dynamic Array

**Operations**:
- Append: Add element to end
- If full: Double array size, copy all elements

**Naive Analysis**: O(n) worst case per append

**PROOF (Aggregate Method)**:

Starting with size 1, after n appends:
```
Copying happens at sizes: 1, 2, 4, 8, ..., 2ᵏ where 2ᵏ ≤ n

Cost of copying: 1 + 2 + 4 + ... + 2ᵏ
                = 2ᵏ⁺¹ - 1
                < 2·2ᵏ
                ≤ 2n

Regular appends: n
Total cost: n + 2n = 3n
Amortized cost: 3n/n = O(1) per operation
```

Therefore: **O(1) amortized** ∎

### Method 2: Accounting Method

**Idea**: Charge different amounts for operations. Overcharge cheap operations to pay for expensive ones.

**Example**: Dynamic Array

**Strategy**:
```
Charge $3 per append:
- $1 for the append itself
- $2 saved as "credit" for future copying
```

**Analysis**:
```
When array doubles from size k to 2k:
- Need to copy k elements (cost: $k)
- Each of those k elements has $2 credit
- Total credit: $2k
- After paying $k for copying, $k credit remains

Credit never goes negative!
```

**Amortized cost**: **$3 = O(1)** per append ∎

**Example 2**: Binary Counter

**Operation**: Increment a k-bit binary counter

**Accounting**:
```
Charge $2 per increment:
- $1 to flip bit from 0→1
- $1 as credit for that bit

When bit flips 1→0, use its credit
```

**Analysis**:
```
Each increment:
- Flips one 0→1 (use $1, pay $1 credit)
- Flips some 1→0 (use stored credits)

Total charge: $2 per increment
```

**Amortized cost**: **O(1)** per increment ∎

### Method 3: Potential Method

**Idea**: Define potential function Φ(D) representing "stored energy"

**Amortized cost** = Actual cost + ΔΦ

**Requirements**:
- Φ(D₀) = 0 (initial state)
- Φ(Dᵢ) ≥ 0 for all i (potential never negative)

**Example 1**: Dynamic Array

**Potential Function**:
```
Φ(D) = 2 × (# elements) - (array size)
     = 2 × filled - size
```

**Analysis for append**:

**Case 1**: Array not full
```
Before: filled = f, size = s
After:  filled = f+1, size = s

Actual cost: 1
ΔΦ = [2(f+1) - s] - [2f - s] = 2
Amortized = 1 + 2 = 3
```

**Case 2**: Array full (need to double)
```
Before: filled = s, size = s
After:  filled = s+1, size = 2s

Actual cost: s + 1 (copy s + append 1)
ΔΦ = [2(s+1) - 2s] - [2s - s]
   = 2 - s
Amortized = (s + 1) + (2 - s) = 3
```

**Both cases**: Amortized cost = **O(1)** ∎

**Example 2**: Binary Counter (k bits)

**Potential Function**:
```
Φ(D) = # of 1-bits in counter
```

**Analysis for increment**:
```
Suppose increment flips tᵢ bits:
- First t₁ bits are 1 (flip to 0)
- Next bit is 0 (flip to 1)

Actual cost: tᵢ (number of bit flips)
ΔΦ = 1 - (tᵢ - 1) = 2 - tᵢ
Amortized = tᵢ + (2 - tᵢ) = 2
```

**Amortized cost**: **O(1)** per increment ∎

### Advanced Example: Splay Trees

**Potential Function**:
```
Φ(T) = Σ (log size(subtree rooted at v))
       over all nodes v
```

**Amortized cost of operations**: **O(log n)**

This is a powerful result showing that even though individual splay operations can take O(n), the amortized cost is logarithmic.

---

## 🎲 PROBABILISTIC ANALYSIS

### Expected Running Time

**Expected Value**: E[X] = Σ xᵢ · P(xᵢ)

**Example 1**: Quicksort

**Worst Case**: O(n²) (sorted array, bad pivot)

**Best Case**: O(n log n) (perfect pivot)

**Expected Case**: O(n log n) (random pivot)

**PROOF (Detailed)**:

Let Xᵢⱼ = indicator that elements i and j are compared

```
E[# comparisons] = E[Σᵢ₌₁ⁿ⁻¹ Σⱼ₌ᵢ₊₁ⁿ Xᵢⱼ]
                  = Σᵢ₌₁ⁿ⁻¹ Σⱼ₌ᵢ₊₁ⁿ E[Xᵢⱼ]
                  = Σᵢ₌₁ⁿ⁻¹ Σⱼ₌ᵢ₊₁ⁿ P(i and j compared)
```

Elements i and j are compared iff one of them is chosen as first pivot in their range.

```
P(i and j compared) = 2/(j - i + 1)

Total = Σᵢ₌₁ⁿ⁻¹ Σⱼ₌ᵢ₊₁ⁿ 2/(j - i + 1)
      = Σᵢ₌₁ⁿ⁻¹ Σₖ₌₂ⁿ⁻ⁱ⁺¹ 2/k       [let k = j - i + 1]
      ≤ Σᵢ₌₁ⁿ⁻¹ 2(H_n - 1)
      = 2(n-1)(H_n - 1)
      = Θ(n log n)
```

Therefore: **E[T(n)] = O(n log n)** ∎

**Example 2**: Randomized Selection (Find kth element)

**Expected Time**: O(n)

**PROOF (Sketch)**:
```
If pivot is "good" (splits 25%-75%), we make progress
P(good pivot) = 1/2

Expected recursion depth: O(log n)
Work per level: O(n)
Expected total: O(n) [using geometric series]
```

**Example 3**: Hash Table with Chaining

**Load factor**: α = n/m (n items, m slots)

**Expected search time**: Θ(1 + α)

**PROOF**:
```
E[search time] = E[1 + chain length]
                = 1 + E[chain length]
                = 1 + α
```

### Probabilistic Inequalities

**Markov's Inequality**:
```
If X ≥ 0, then P(X ≥ a) ≤ E[X]/a
```

**Chebyshev's Inequality**:
```
P(|X - E[X]| ≥ kσ) ≤ 1/k²
```

**Chernoff Bounds**: (for sum of independent random variables)
```
Much tighter bounds for tail probabilities
```

---

## 📉 PROVING LOWER BOUNDS

### Comparison-Based Sorting Lower Bound

**THEOREM**: Any comparison-based sorting algorithm requires Ω(n log n) comparisons in the worst case.

**PROOF (Decision Tree)**:

**Setup**:
- Decision tree models all possible comparison sequences
- Each internal node = one comparison
- Each leaf = one permutation (sorted output)
- Need n! different leaves (one for each permutation)

**Tree Properties**:
- Binary tree (each comparison has 2 outcomes)
- Height h = worst-case # of comparisons
- Leaves L ≥ n! (need to distinguish all permutations)

**Lower Bound on Height**:
```
Binary tree with height h has at most 2ʰ leaves
Therefore: 2ʰ ≥ n!
Taking log: h ≥ log₂(n!)
```

**Using Stirling's Approximation**:
```
n! ≈ √(2πn) · (n/e)ⁿ

log₂(n!) ≈ log₂[√(2πn) · (n/e)ⁿ]
         = (1/2)log₂(2πn) + n log₂(n/e)
         = (1/2)log₂(2πn) + n log₂ n - n log₂ e
         = n log₂ n - n log₂ e + (1/2)log₂(2πn)
         = Θ(n log n)
```

Therefore: **Any comparison-based sort needs Ω(n log n) comparisons** ∎

### Element Uniqueness Lower Bound

**THEOREM**: Determining if all elements in array are unique requires Ω(n log n) comparisons.

**PROOF (Reduction)**:

**Key Idea**: If we could solve uniqueness in o(n log n), we could sort in o(n log n).

**Reduction**:
```
Given array A to sort:
1. Check if A has duplicates: o(n log n)
2. If yes, done
3. If no, use uniqueness info to sort efficiently
```

Since sorting requires Ω(n log n), uniqueness requires **Ω(n log n)** ∎

### Adversary Arguments

**Example**: Finding Maximum

**THEOREM**: Finding max in unsorted array requires n-1 comparisons.

**PROOF (Adversary)**:

**Adversary Strategy**:
- Initially, all elements could be max
- Each comparison eliminates exactly one candidate
- Need to eliminate n-1 candidates
- Therefore: need **n-1 comparisons** ∎

**Lower Bound**: Ω(n)
**Upper Bound**: O(n) (simple scan)
**Optimal**: Θ(n)

---

## 🧮 MATHEMATICAL FOUNDATIONS

### Common Summation Formulas

**Arithmetic Series**:
```
Σᵢ₌₁ⁿ i = n(n+1)/2 = Θ(n²)

Σᵢ₌₁ⁿ (2i-1) = n² [sum of first n odd numbers]
```

**Geometric Series**:
```
Σᵢ₌₀ⁿ rⁱ = (rⁿ⁺¹ - 1)/(r - 1) for r ≠ 1

Σᵢ₌₀^∞ rⁱ = 1/(1-r) for |r| < 1
```

**Powers**:
```
Σᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6 = Θ(n³)

Σᵢ₌₁ⁿ i³ = [n(n+1)/2]² = Θ(n⁴)

Σᵢ₌₁ⁿ iᵏ = Θ(nᵏ⁺¹)
```

**Logarithmic**:
```
Σᵢ₌₁ⁿ log i = log(n!) = Θ(n log n)

Σᵢ₌₁ⁿ i log i = Θ(n² log n)
```

**Harmonic Numbers**:
```
H_n = Σᵢ₌₁ⁿ 1/i = Θ(log n)

More precisely: H_n = ln n + γ + O(1/n)
where γ ≈ 0.5772 (Euler-Mascheroni constant)
```

### Stirling's Approximation

**Formula**:
```
n! ≈ √(2πn) · (n/e)ⁿ

More precisely:
√(2πn) · (n/e)ⁿ ≤ n! ≤ √(2πn) · (n/e)ⁿ · e^(1/(12n))
```

**Logarithmic Form**:
```
log(n!) = n log n - n log e + (1/2)log(2πn) + O(1/n)
        = n log n - n·1.443 + 0.5 log n + O(1)
        = Θ(n log n)
```

**Applications**:
- Analyzing factorials
- Combinatorial formulas
- Lower bounds (e.g., sorting)

### L'Hôpital's Rule

**When to use**: Limits of form 0/0 or ∞/∞

**Rule**:
```
If lim[n→∞] f(n)/g(n) is 0/0 or ∞/∞, then:
lim[n→∞] f(n)/g(n) = lim[n→∞] f'(n)/g'(n)
```

**Examples**:
```
lim[n→∞] log n / n
= lim[n→∞] (1/n) / 1
= 0

lim[n→∞] nᵏ / 2ⁿ
= lim[n→∞] k·nᵏ⁻¹ / (2ⁿ ln 2)
= ... (apply k times)
= 0
```

---

## ⚠️ COMMON MISTAKES

### Mistake 1: Confusing O and Θ

**WRONG**: "This is O(n²) so it's slow"
- O(n²) includes O(n), O(log n), O(1)!

**RIGHT**: "This is Θ(n²)" or "This is O(n²) and Ω(n²)"

### Mistake 2: Dropping Coefficients Too Early

**In analysis**: Keep coefficients until final answer
```
WRONG: 3n + 5 ≤ n for large n
RIGHT: 3n + 5 ≤ 4n for n ≥ 5
```

**In notation**: 3n = O(n) ✓, but during analysis track the 3

### Mistake 3: Ignoring Base Cases in Recurrences

**WRONG**: Solving T(n) = 2T(n/2) + n without T(1)

**RIGHT**: Always specify and verify base case!

### Mistake 4: Misusing Master Theorem

**WRONG**: Applying to T(n) = 2T(n/2) + n/log n
- Requires f(n) to be polynomial, not polylog!

**Examples where it doesn't apply**:
- T(n) = 2T(n/2) + n/log n
- T(n) = 2T(n/2) + n log log n
- T(n) = T(√n) + 1

### Mistake 5: Assuming Average = Amortized

**Average**: Expected case over random inputs
**Amortized**: Average over worst-case sequence

**Example**: Hash table
- Average case assumes random keys
- Amortized analysis considers worst-case key sequence

### Mistake 6: Forgetting Absolute Values

**Issue**: Big-O requires f(n) ≥ 0 eventually

```
WRONG: n - n² = O(n²)
RIGHT: |n - n²| = n² - n = O(n²) for n ≥ 1
```

### Mistake 7: Incorrect Limit Application

**WRONG**:
```
lim[n→∞] (n² + n) = ∞
lim[n→∞] n² = ∞
So (n² + n)/n² = ∞/∞ = 1 ???
```

**RIGHT**: Apply limit laws or L'Hôpital correctly

### Mistake 8: Confusing Upper and Lower Bounds

**Statement**: "Algorithm A is O(n²)"

**Does NOT mean**: "A is slow" or "A always takes n² time"

**Means**: "A takes at most c·n² time for large n"

---

## 🎯 DECISION FLOWCHART

```
What are you analyzing?
│
├─ Simple loop → Count iterations
│  └─ Nested loops → Multiply / Sum iteration counts
│
├─ Recursive algorithm → Write recurrence
│  ├─ Divide and conquer? → Try Master Theorem
│  ├─ Master Theorem applies? → Done!
│  ├─ Doesn't apply? → Substitution or Tree method
│  ├─ Multiple variables? → Akra-Bazzi or Tree
│  └─ Non-standard? → Guess and verify
│
├─ Worst case varies? → Consider amortized analysis
│  ├─ Simple total cost? → Aggregate method
│  ├─ Can assign charges? → Accounting method
│  └─ Need precise analysis? → Potential method
│
├─ Random inputs? → Probabilistic analysis
│  ├─ Calculate E[cost]
│  └─ Use indicator random variables
│
└─ Proving lower bound? →
   ├─ Comparison-based? → Decision tree
   ├─ Adversary argument
   └─ Reduction from known hard problem
```

---

## 🏋️ PRACTICE PROBLEMS

### Level 1: Basic Proofs (5 problems)

1. Prove: 5n² + 3n + 7 = Θ(n²)
2. Prove: log₂ n = Θ(log₁₀ n)
3. Prove: n! = ω(2ⁿ)
4. Prove: 2ⁿ⁺¹ = Θ(2ⁿ)
5. Prove: √n + log n = Θ(√n)

### Level 2: Loop Analysis (5 problems)

6. Analyze:
```python
for i in range(n):
    for j in range(i*i):
        print(j)
```

7. Analyze:
```python
i = n
while i > 1:
    for j in range(i):
        print(j)
    i = i // 2
```

8. Analyze:
```python
for i in range(1, n+1):
    j = 1
    while j < i:
        print(j)
        j = j * 2
```

9. Analyze:
```python
for i in range(n):
    for j in range(1, n+1, i+1):  # step by i+1
        print(j)
```

10. Analyze:
```python
i = 1
while i < n:
    for j in range(i):
        print(j)
    i = i * 3
```

### Level 3: Recurrences (10 problems)

11. Solve: T(n) = 3T(n/4) + n
12. Solve: T(n) = T(n-1) + n
13. Solve: T(n) = 2T(n/2) + n log n
14. Solve: T(n) = √n T(√n) + n
15. Solve: T(n) = 4T(n/2) + n²/log n
16. Solve: T(n) = 2T(n/4) + √n
17. Solve: T(n) = T(n/3) + T(2n/3) + n
18. Solve: T(n) = T(n-1) + n log n
19. Solve: T(n) = 9T(n/3) + n² log n
20. Solve: T(n) = T(n-2) + log n

### Level 4: Advanced Topics (10 problems)

21. Prove that finding the median requires Ω(n) comparisons
22. Analyze expected time for randomized quickselect
23. Amortized analysis of binary counter (increment operation)
24. Prove: log(n!) = Θ(n log n) using Stirling
25. Analyze: Fibonacci sequence using recursion tree
26. Design potential function for stack with multipop
27. Prove: Any algorithm that finds both min and max requires at least ⌈3n/2⌉ - 2 comparisons
28. Analyze skip list expected search time
29. Prove: Ω(n log n) lower bound for convex hull
30. Smoothed analysis of simplex algorithm (conceptual)

---

## ✨ SOLUTIONS TO PRACTICE PROBLEMS

### Solutions 1-5: Basic Proofs

**1. Prove: 5n² + 3n + 7 = Θ(n²)**

Use limit method:
```
lim[n→∞] (5n² + 3n + 7)/n²
= lim[n→∞] (5 + 3/n + 7/n²)
= 5
```
Since 0 < 5 < ∞, we have **Θ(n²)** ∎

**2. Prove: log₂ n = Θ(log₁₀ n)**

```
log₂ n = log₁₀ n / log₁₀ 2
       = (1/log₁₀ 2) · log₁₀ n
       ≈ 3.322 · log₁₀ n
```
Constant factor → **Θ(log₁₀ n)** ∎

**3. Prove: n! = ω(2ⁿ)**

Using Stirling: n! ≈ √(2πn) · (n/e)ⁿ
```
lim[n→∞] n! / 2ⁿ
≈ lim[n→∞] [√(2πn) · (n/e)ⁿ] / 2ⁿ
= lim[n→∞] √(2πn) · (n/(2e))ⁿ

Since n/(2e) > 1 for n > 2e ≈ 5.44,
the term (n/(2e))ⁿ → ∞
```
Therefore: n! = **ω(2ⁿ)** ∎

**4. Prove: 2ⁿ⁺¹ = Θ(2ⁿ)**

```
2ⁿ⁺¹ = 2 · 2ⁿ

lim[n→∞] 2ⁿ⁺¹ / 2ⁿ = 2
```
Constant factor → **Θ(2ⁿ)** ∎

**5. Prove: √n + log n = Θ(√n)**

```
lim[n→∞] (√n + log n) / √n
= lim[n→∞] (1 + log n/√n)
= 1 + lim[n→∞] log n/√n
= 1 + 0  [since log n = o(√n)]
= 1
```
Therefore: **Θ(√n)** ∎

### Solutions 6-10: Loop Analysis

**6. Nested with i²:**
```
T(n) = Σᵢ₌₀ⁿ⁻¹ i²
     = (n-1)n(2n-1)/6
     = Θ(n³)
```

**7. Logarithmic outer, linear inner:**
```
T(n) = n + n/2 + n/4 + ... + 1
     = n(1 + 1/2 + 1/4 + ...)
     = n · 2
     = Θ(n)
```

**8. Outer linear, inner logarithmic:**
```
T(n) = Σᵢ₌₁ⁿ log₂ i
     = log₂(n!)
     = Θ(n log n)
```

**9. Variable step size:**
```
T(n) = Σᵢ₌₀ⁿ⁻¹ ⌊n/(i+1)⌋
     ≈ n · Hₙ
     = Θ(n log n)
```

**10. Exponential growth:**
```
T(n) = 1 + 3 + 9 + ... + 3^(log₃ n)
     = (3^(log₃ n + 1) - 1)/2
     = (3n - 1)/2
     = Θ(n)
```

### Solutions 11-20: Recurrences

**11. T(n) = 3T(n/4) + n**

Master Theorem:
- a=3, b=4, f(n)=n
- n^(log₄ 3) ≈ n^0.793
- n > n^0.793

Case 3: **Θ(n)**

**12. T(n) = T(n-1) + n**

```
T(n) = n + (n-1) + (n-2) + ... + 1
     = n(n+1)/2
     = Θ(n²)
```

**13. T(n) = 2T(n/2) + n log n**

Master Theorem with k=1:
- a=2, b=2, f(n)=n log n
- n^(log₂ 2) = n
- f(n) = n · log¹ n

Case 2: **Θ(n log² n)**

**14. T(n) = √n T(√n) + n**

Let m = log n, S(m) = T(2ᵐ):
```
S(m) = 2^(m/2) S(m/2) + 2ᵐ
```
Solving: **Θ(n log log n)**

**15. T(n) = 4T(n/2) + n²/log n**

Master Theorem doesn't apply directly.
Using recursion tree: **Θ(n² log log n)**

**16. T(n) = 2T(n/4) + √n**

Master Theorem:
- a=2, b=4, f(n)=√n
- n^(log₄ 2) = n^0.5 = √n
- f(n) = Θ(√n)

Case 2: **Θ(√n log n)**

**17. T(n) = T(n/3) + T(2n/3) + n**

Akra-Bazzi or recursion tree: **Θ(n log n)**

**18. T(n) = T(n-1) + n log n**

```
T(n) = Σᵢ₌₁ⁿ i log i
     = Θ(n² log n)
```

**19. T(n) = 9T(n/3) + n² log n**

Master Theorem:
- a=9, b=3, f(n)=n² log n
- n^(log₃ 9) = n²
- f(n) = n² · log n

Case 2 with k=1: **Θ(n² log² n)**

**20. T(n) = T(n-2) + log n**

```
T(n) ≈ log n + log(n-2) + log(n-4) + ...
     ≈ Σᵢ₌₁ⁿ/² log(2i)
     = Θ(n log n)
```

### Solutions 21-25: Advanced Topics

**21. Median lower bound:**

Adversary argument: Must examine all elements (otherwise adversary places median in unexamined part). **Ω(n)**

**22. Randomized quickselect:**

Expected recursion depth O(log n), but geometric series gives: **E[T(n)] = Θ(n)**

**23. Binary counter:**

Potential function Φ = # of 1-bits. Each increment has amortized cost **O(1)**.

**24. Stirling's formula:**

```
log(n!) = log[√(2πn) · (n/e)ⁿ]
        = (1/2)log(2πn) + n log(n/e)
        = Θ(n log n)
```

**25. Fibonacci recursion tree:**

```
T(n) = T(n-1) + T(n-2) + O(1)

Tree has Θ(φⁿ) nodes where φ = (1+√5)/2
Total work: Θ(φⁿ) = Θ(2^(0.694n))
```

---

## 🎓 KEY TAKEAWAYS

1. **Big-O = upper bound**, not exact growth rate (use Θ for tight bounds)
2. **Prove formally** with constants c, n₀ or using limits
3. **Master Theorem** handles most divide-and-conquer recurrences
4. **Recursion trees** provide intuition and verify answers
5. **Substitution method** requires good initial guess
6. **Amortized ≠ average**: amortized is worst-case averaged over sequence
7. **Lower bounds** require adversarial arguments or information theory
8. **Keep coefficients** during analysis, drop only in final Big-O notation
9. **Stirling's approximation** crucial for factorial analysis
10. **Multiple methods** often lead to same answer (good verification!)

---

## 📚 COMMON GROWTH RATES (Slowest to Fastest)

```
O(1)           Constant          Array access, arithmetic
O(log log n)   Double log        Interpolation search iterations
O(log n)       Logarithmic       Binary search, balanced BST
O(√n)          Square root       Block-based algorithms
O(n)           Linear            Single pass through data
O(n log n)     Linearithmic      Optimal sorting, divide-and-conquer
O(n²)          Quadratic         Nested loops, naive algorithms
O(n³)          Cubic             Matrix multiplication (naive)
O(n^k)         Polynomial        k nested loops
O(2ⁿ)          Exponential       Recursive enumeration
O(n!)          Factorial         Generate all permutations
O(nⁿ)          Super-exponential Extremely slow
```

**Dominance Chain**:
```
1 ≪ log log n ≪ log n ≪ √n ≪ n ≪ n log n ≪ n√n ≪ n² ≪ n³ ≪ 2ⁿ ≪ n! ≪ nⁿ

where f ≪ g means f = o(g)
```

**Important Relationships**:
```
log n = o(n^ε) for any ε > 0
n^k = o(n^(k+ε)) for any ε > 0
polynomial = o(exponential)
exponential = o(factorial) [for most cases]
```

---

## 🚀 ADVANCED ANALYSIS TECHNIQUES

### Smoothed Analysis

**Idea**: Average case over slightly perturbed worst-case inputs

**Example**: Simplex algorithm
- Worst case: Exponential
- Average case: Polynomial
- **Smoothed**: Polynomial (explains practical efficiency)

### Competitive Analysis

**For online algorithms**: Compare to optimal offline algorithm

**Competitive Ratio**: max (ALG/OPT)

**Example**: Ski rental problem, paging algorithms

### Cache-Oblivious Algorithms

**Complexity includes cache misses**

**Example**: Cache-oblivious matrix transpose
- I/O complexity: Θ(n²/B + n²/(LB)) cache misses
- Where B = block size, L = cache lines

---

**🚀 Master these techniques and you'll ace any algorithm analysis!**

---

*"The purpose of computing is insight, not numbers."* — Richard Hamming

With asymptotic analysis, we gain insight into how algorithms scale, allowing us to make informed decisions about which algorithms to use as problem sizes grow.

**EOF** ⚡