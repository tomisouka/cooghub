# 🎲 Combinations & Permutations
## Complete Guide to Counting

> Master the art of counting arrangements, selections, and possibilities

---

## 📋 TABLE OF CONTENTS

### 🎯 Fundamental Principles
- The Addition Principle (OR)
- The Multiplication Principle (AND)
- The Subtraction Principle (NOT)

### 🔢 Permutations
*Order matters!*
- Basic Permutations
- Permutations with Repetition
- Circular Permutations

### 🎁 Combinations
*Order doesn't matter*
- Basic Combinations
- Combinations with Repetition
- Multisets

### ⭐ Advanced Techniques
- Stars and Bars Method
- Inclusion-Exclusion Principle
- Pigeonhole Principle
- Generating Functions

### 📐 Binomial Theorem
- Pascal's Triangle
- Binomial Expansion
- Key Identities

### 💡 Problem-Solving Strategies
- When to Use What
- Decision Trees
- Common Patterns

---

## 🎯 FUNDAMENTAL COUNTING PRINCIPLES

### The Addition Principle (OR)

**If tasks are mutually exclusive:**

```
If task A can be done in m ways
AND task B can be done in n ways
AND tasks cannot be done together
THEN: Total = m + n ways
```

**Example**: Travel from NYC to LA
- By plane: 12 flights
- By train: 3 routes
- Total: 12 + 3 = **15 ways**

### The Multiplication Principle (AND)

**If tasks are sequential/independent:**

```
If task A can be done in m ways
AND for each, task B can be done in n ways
THEN: Total = m × n ways
```

**Example**: Outfit selection
- 5 shirts
- 3 pants
- Total outfits: 5 × 3 = **15 outfits**

### The Subtraction Principle (NOT)

```
Total = (All possibilities) - (Unwanted cases)
```

**Example**: 3-digit numbers not starting with 0
- All 3-digit numbers: 900 (from 100 to 999)
- Or: 9 × 10 × 10 = **900** (first digit: 1-9, others: 0-9)

---

## 🔢 PERMUTATIONS: Order Matters

### Definition

**Permutation**: An arrangement of objects where **order matters**.

**Notation**: P(n,r) or nPr or ₙPᵣ

### Formula: Permutations of n objects taken r at a time

```
P(n,r) = n!/(n-r)!
```

**Intuition**: 
- First position: n choices
- Second position: n-1 choices
- ...
- rth position: n-r+1 choices
- Multiply: n × (n-1) × ... × (n-r+1) = n!/(n-r)!

### Special Case: All n objects

```
P(n,n) = n!
```

**n! (n factorial) = n × (n-1) × (n-2) × ... × 2 × 1**

By definition: 0! = 1

---

## 📊 PERMUTATION EXAMPLES

### Example 1: Basic Permutation

**Problem**: How many ways to arrange 5 books on a shelf?

**Solution**:
- Position 1: 5 choices
- Position 2: 4 choices
- Position 3: 3 choices
- Position 4: 2 choices
- Position 5: 1 choice
- Total: 5! = 5 × 4 × 3 × 2 × 1 = **120 ways**

### Example 2: Partial Arrangement

**Problem**: How many 3-letter "words" can you make from the letters in COMPUTER (no repeats)?

**Solution**:
- 8 letters total
- Choose 3 positions
- P(8,3) = 8!/(8-3)! = 8!/5! = 8 × 7 × 6 = **336 words**

### Example 3: Restrictions

**Problem**: How many ways to arrange ABCDE if A and B must be together?

**Solution**:
- Treat AB as a single unit: [AB], C, D, E
- 4 units to arrange: 4! = 24
- But A and B can swap: 2! = 2
- Total: 4! × 2! = 24 × 2 = **48 ways**

### Example 4: Positions Matter

**Problem**: 10 runners in a race. How many ways for gold, silver, bronze?

**Solution**:
- Gold: 10 choices
- Silver: 9 choices
- Bronze: 8 choices
- P(10,3) = 10 × 9 × 8 = **720 ways**

---

## 🔄 PERMUTATIONS WITH REPETITION

### When objects are identical

**Formula**: For n objects with groups of identical items:

```
n! / (n₁! × n₂! × ... × nₖ!)
```

where n₁ objects of type 1, n₂ of type 2, etc.

### Example 1: Letters with Repetition

**Problem**: How many distinct arrangements of MISSISSIPPI?

**Solution**:
- Total letters: 11
- M: 1, I: 4, S: 4, P: 2
- 11! / (1! × 4! × 4! × 2!)
- = 11! / (1 × 24 × 24 × 2)
- = 39,916,800 / 1,152
- = **34,650 arrangements**

### Example 2: Colored Balls

**Problem**: Arrange 3 red, 2 blue, 1 green ball in a row.

**Solution**:
- Total: 6 balls
- 6! / (3! × 2! × 1!)
- = 720 / (6 × 2 × 1)
- = 720 / 12
- = **60 arrangements**

---

## ⭕ CIRCULAR PERMUTATIONS

### Formula

**For n distinct objects in a circle:**

```
(n-1)!
```

**Why?** Fix one object to break rotational symmetry.

### Example 1: Round Table

**Problem**: Seat 6 people at a round table.

**Solution**:
- Fix one person
- Arrange remaining 5: 5! = **120 ways**

### Example 2: Necklace

**Problem**: String 5 different beads on a necklace.

**Solution**:
- Circular: (5-1)! = 24
- But necklace can be flipped: 24/2 = **12 ways**

**General necklace formula**: (n-1)!/2

---

## 🎁 COMBINATIONS: Order Doesn't Matter

### Definition

**Combination**: A selection of objects where **order doesn't matter**.

**Notation**: C(n,r) or nCr or (n r) or ₙCᵣ

### Formula: Combinations of n objects taken r at a time

```
C(n,r) = n! / (r!(n-r)!)
```

**Also written as**: (n r) ← "n choose r"

**Intuition**: Permutations divided by arrangements of r objects
- C(n,r) = P(n,r) / r! = [n!/(n-r)!] / r! = n! / (r!(n-r)!)

### Important Properties

```
C(n,0) = 1           (one way to choose nothing)
C(n,n) = 1           (one way to choose everything)
C(n,1) = n           (n ways to choose 1 item)
C(n,r) = C(n,n-r)    (choosing r = leaving n-r)
```

---

## 🎯 COMBINATION EXAMPLES

### Example 1: Basic Selection

**Problem**: Choose 3 students from a class of 20 for a committee.

**Solution**:
- Order doesn't matter (same committee)
- C(20,3) = 20! / (3! × 17!)
- = (20 × 19 × 18) / (3 × 2 × 1)
- = 6,840 / 6
- = **1,140 ways**

### Example 2: Card Hands

**Problem**: How many 5-card poker hands from a 52-card deck?

**Solution**:
- C(52,5) = 52! / (5! × 47!)
- = (52 × 51 × 50 × 49 × 48) / (5 × 4 × 3 × 2 × 1)
- = 311,875,200 / 120
- = **2,598,960 hands**

### Example 3: Multiple Groups

**Problem**: From 10 people, choose 4 for team A and 3 for team B.

**Solution**:
- Choose 4 for A: C(10,4)
- Choose 3 for B from remaining 6: C(6,3)
- Total: C(10,4) × C(6,3)
- = 210 × 20
- = **4,200 ways**

### Example 4: At Least / At Most

**Problem**: From 8 items, choose at least 2.

**Solution**:
- Total - (choose 0 or 1)
- = C(8,0) + C(8,1) + C(8,2) + ... + C(8,8) - C(8,0) - C(8,1)
- = 2⁸ - 1 - 8
- = 256 - 9
- = **247 ways**

**Or**: C(8,2) + C(8,3) + ... + C(8,8)

---

## 🔁 COMBINATIONS WITH REPETITION

### Formula

**Choosing r items from n types with unlimited repetition:**

```
C(n+r-1, r) = C(n+r-1, n-1)
```

**Also called**: Multiset combinations

### Example 1: Ice Cream Scoops

**Problem**: Choose 3 scoops from 5 flavors (repetition allowed).

**Solution**:
- C(5+3-1, 3) = C(7,3)
- = 7! / (3! × 4!)
- = (7 × 6 × 5) / (3 × 2 × 1)
- = **35 ways**

**Possibilities**: 
- {V,V,V}, {V,V,C}, {V,C,C}, {C,C,C}, {V,V,S}, etc.

### Example 2: Equations

**Problem**: Number of non-negative integer solutions to x₁ + x₂ + x₃ = 10

**Solution**:
- Distribute 10 identical balls into 3 distinct boxes
- C(3+10-1, 10) = C(12, 10) = C(12,2)
- = (12 × 11) / 2
- = **66 solutions**

---

## ⭐ STARS AND BARS METHOD

### The Technique

**Problem**: Distribute n identical objects into k distinct bins.

**Visualization**: Use ★ for objects, | for dividers

**Example**: 7 stars, 3 bins
```
★★|★★★|★★  → bin1: 2, bin2: 3, bin3: 2
```

### Formula

**Number of ways to distribute n identical objects into k bins:**

```
C(n+k-1, k-1) = C(n+k-1, n)
```

**Think**: Place n stars and k-1 bars, choose positions for bars.

### Example 1: Distribute Items

**Problem**: Give 10 identical candies to 4 children (some can get 0).

**Solution**:
- C(10+4-1, 4-1) = C(13,3)
- = (13 × 12 × 11) / (3 × 2 × 1)
- = **286 ways**

### Example 2: With Constraints

**Problem**: Distribute 10 candies to 4 children, each gets at least 1.

**Solution**:
- Give 1 to each first: 10 - 4 = 6 remaining
- Distribute 6 among 4: C(6+4-1, 4-1) = C(9,3)
- = (9 × 8 × 7) / 6
- = **84 ways**

---

## 🎨 INCLUSION-EXCLUSION PRINCIPLE

### Formula

**For two sets A and B:**
```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

**For three sets A, B, C:**
```
|A ∪ B ∪ C| = |A| + |B| + |C| 
            - |A ∩ B| - |A ∩ C| - |B ∩ C|
            + |A ∩ B ∩ C|
```

### Example 1: Venn Diagram

**Problem**: In a class of 50:
- 30 take math
- 25 take physics
- 10 take both
How many take at least one?

**Solution**:
- |M ∪ P| = |M| + |P| - |M ∩ P|
- = 30 + 25 - 10
- = **45 students**

### Example 2: Derangements

**Problem**: How many ways to arrange {1,2,3,4} so no number is in original position?

**Solution**: Use inclusion-exclusion
- Total: 4! = 24
- At least one in place: more complex...
- Answer: **9 derangements**

**Derangement formula**: D(n) = n! × Σᵢ₌₀ⁿ (-1)ⁱ/i!

---

## 🐦 PIGEONHOLE PRINCIPLE

### Basic Principle

**If n+1 objects are placed in n boxes, at least one box contains ≥2 objects.**

### Generalized Version

**If n objects are placed in k boxes, at least one box contains ≥⌈n/k⌉ objects.**

### Example 1: Birthdays

**Problem**: How many people needed to guarantee 2 share a birth month?

**Solution**:
- 12 months (boxes)
- Need 12 + 1 = **13 people**

### Example 2: Socks

**Problem**: In a dark drawer: 10 black, 10 blue socks. How many to guarantee a matching pair?

**Solution**:
- 2 colors (boxes)
- Need 2 + 1 = **3 socks**

### Example 3: Numbers

**Problem**: Choose 6 numbers from {1,2,...,10}. Prove two sum to 11.

**Solution**:
- Pairs that sum to 11: (1,10), (2,9), (3,8), (4,7), (5,6)
- 5 pairs (boxes)
- Choosing 6 numbers (objects)
- By pigeonhole: must get both from some pair
- Those two sum to **11** ✓

---

## 📐 BINOMIAL THEOREM

### The Theorem

```
(x + y)ⁿ = Σᵣ₌₀ⁿ C(n,r) xⁿ⁻ʳ yʳ
         = C(n,0)xⁿ + C(n,1)xⁿ⁻¹y + ... + C(n,n)yⁿ
```

### Pascal's Triangle

```
                1
              1   1
            1   2   1
          1   3   3   1
        1   4   6   4   1
      1   5  10  10   5   1
    1   6  15  20  15   6   1
```

**Rule**: Each entry = sum of two above it
```
C(n,r) = C(n-1,r-1) + C(n-1,r)
```

### Example 1: Expand (x+y)⁴

**Solution**:
```
(x+y)⁴ = C(4,0)x⁴ + C(4,1)x³y + C(4,2)x²y² + C(4,3)xy³ + C(4,4)y⁴
       = 1x⁴ + 4x³y + 6x²y² + 4xy³ + 1y⁴
```

### Example 2: Find Coefficient

**Problem**: Coefficient of x⁵y³ in (x+y)⁸?

**Solution**:
- Need x⁵y³ where 5 + 3 = 8 ✓
- Coefficient = C(8,3) = C(8,5)
- = 8! / (3! × 5!)
- = (8 × 7 × 6) / (3 × 2 × 1)
- = **56**

### Example 3: Sum Identity

**Prove**: C(n,0) + C(n,1) + ... + C(n,n) = 2ⁿ

**Proof**: Use binomial theorem with x = y = 1:
```
(1+1)ⁿ = Σᵣ₌₀ⁿ C(n,r) × 1ⁿ⁻ʳ × 1ʳ = Σᵣ₌₀ⁿ C(n,r)
2ⁿ = Σᵣ₌₀ⁿ C(n,r)
```
∎

---

## 🎯 DISTINGUISHING PERMUTATIONS vs COMBINATIONS

### The Key Question

**DOES ORDER MATTER?**

| Situation | Order? | Use |
|-----------|--------|-----|
| **Passwords** | YES | Permutations |
| **Committees** | NO | Combinations |
| **Race winners** (1st, 2nd, 3rd) | YES | Permutations |
| **Pizza toppings** | NO | Combinations |
| **Lock combination** | YES | Permutations (ironically!) |
| **Selecting team members** | NO | Combinations |
| **Seating arrangement** | YES | Permutations |
| **Choosing ice cream flavors** | NO | Combinations |

### Decision Tree

```
Start
│
├─ Are items distinct?
│  ├─ NO → Use formula with repetition
│  └─ YES ↓
│
├─ Does order matter?
│  ├─ YES → PERMUTATIONS
│  │  ├─ All n items? → n!
│  │  ├─ r from n items? → P(n,r) = n!/(n-r)!
│  │  └─ Circular? → (n-1)!
│  │
│  └─ NO → COMBINATIONS
│     ├─ r from n items? → C(n,r) = n!/(r!(n-r)!)
│     └─ With repetition? → C(n+r-1,r)
```

---

## 💡 PROBLEM-SOLVING STRATEGIES

### Strategy 1: Complementary Counting

**Instead of counting what you want, count what you don't want and subtract.**

**Example**: Passwords with at least one digit
- Total passwords - passwords with no digits

### Strategy 2: Break into Cases

**Divide problem into mutually exclusive cases.**

**Example**: Committees with at least 2 women
- Case 1: Exactly 2 women
- Case 2: Exactly 3 women
- Case 3: Exactly 4 women
- Add them up

### Strategy 3: Fix and Permute

**Fix one element to handle symmetry or restrictions.**

**Example**: Circular arrangements → fix one person

### Strategy 4: Think Smaller

**Try n=1, n=2, n=3 to find pattern.**

**Example**: 
- n=1: 1 way
- n=2: 2 ways
- n=3: 6 ways
- Pattern: n! ✓

---

## 🔢 COMPREHENSIVE FORMULA SHEET

### Permutations

| Type | Formula | Example |
|------|---------|---------|
| **All n objects** | n! | 5 books: 5! = 120 |
| **r from n** | P(n,r) = n!/(n-r)! | 3 from 8: 8!/5! = 336 |
| **With repetition** | nʳ | 4-digit PIN: 10⁴ = 10,000 |
| **Identical objects** | n!/(n₁!n₂!...nₖ!) | MISSISSIPPI: 11!/(1!4!4!2!) |
| **Circular** | (n-1)! | 6 at round table: 5! = 120 |
| **Necklace** | (n-1)!/2 | 5 beads: 4!/2 = 12 |

### Combinations

| Type | Formula | Example |
|------|---------|---------|
| **r from n** | C(n,r) = n!/(r!(n-r)!) | 5-card hand: C(52,5) |
| **With repetition** | C(n+r-1,r) | 3 scoops, 5 flavors: C(7,3) |
| **All subsets** | 2ⁿ | Subsets of {1,2,3}: 2³ = 8 |

### Important Identities

```
C(n,r) = C(n,n-r)                    [Symmetry]
C(n,r) = C(n-1,r-1) + C(n-1,r)       [Pascal's identity]
Σᵣ₌₀ⁿ C(n,r) = 2ⁿ                    [Sum of row]
P(n,r) = C(n,r) × r!                 [Relation]
```

---

## 🎮 PRACTICE PROBLEMS

### Level 1: Basic

1. How many 4-letter "words" from the alphabet (26 letters)?
2. Choose 5 students from 30 for a committee
3. Arrange the letters in BANANA
4. Seat 8 people at a round table

### Level 2: Intermediate

5. 10 questions, must answer at least 6. How many ways?
6. Distribute 15 identical balls into 5 distinct boxes
7. 5-card poker hand with exactly 2 aces
8. Password: 8 characters, mix of letters and digits, at least one digit

### Level 3: Advanced

9. Number of onto functions from set of 5 elements to set of 3 elements
10. Derangements of {1,2,3,4,5}
11. Paths in grid from (0,0) to (5,3) moving only right/up
12. Number of ways to partition 10 into positive integers

---

## ✨ SOLUTIONS TO PRACTICE PROBLEMS

### Solutions (Brief)

1. **26⁴ = 456,976** (with repetition)
2. **C(30,5) = 142,506**
3. **6!/(3!×2!×1!) = 60**
4. **(8-1)! = 5,040**
5. **C(10,6) + C(10,7) + C(10,8) + C(10,9) + C(10,10) = 386**
6. **C(15+5-1, 5-1) = C(19,4) = 3,876**
7. **C(4,2) × C(48,3) = 6 × 17,296 = 103,776**
8. **Total - (only letters) = 62⁸ - 52⁸**
9. Use inclusion-exclusion: **3⁵ - C(3,1)×2⁵ + C(3,2)×1⁵ = 150**
10. **D(5) = 44**
11. **C(8,3) = 56** (choose 3 of 8 moves to be up)
12. **Partition function p(10) = 42** (requires dynamic programming or recursion)

---

## 🎓 KEY TAKEAWAYS

1. **Order matters** → Permutations
2. **Order doesn't matter** → Combinations
3. **Repetition allowed** → Use different formulas
4. **Restrictions present** → Break into cases or use complement
5. **Identical objects** → Divide by repetitions
6. **Multiple groups** → Multiply combinations
7. **At least/at most** → Use complement or sum cases
8. **Circular** → Fix one position

---

**🚀 Master these techniques and you'll solve any counting problem!**

---

*Practice makes perfect. The more problems you solve, the better you'll recognize which technique to use.*

**EOF** 🎯