# 🔥 THEORY OF COMPUTATION // HACKER'S FIELD GUIDE 🔥

```
████████╗ ██████╗  ██████╗
╚══██╔══╝██╔═══██╗██╔════╝
   ██║   ██║   ██║██║     
   ██║   ██║   ██║██║     
   ██║   ╚██████╔╝╚██████╗
   ╚═╝    ╚═════╝  ╚═════╝
```

> **"If you can't prove it with a Turing machine, it can't be computed."**

---

## 📋 NAVIGATION MAP

```
├─ [PRE] PREREQUISITES ───────────── Discrete Math Toolkit
├─ [0x00] FOUNDATIONS ────────────── Mathematical Toolkit
├─ [0x01] AUTOMATA & LANGUAGES ───── Pattern Recognition
├─ [0x02] COMPUTABILITY ──────────── What's Possible?
└─ [0x03] COMPLEXITY ─────────────── What's Practical?
```

---

## [PRE] :: DISCRETE MATH PREREQUISITES

### 🎯 ESSENTIAL SYMBOLS REFERENCE CHART

#### Set Theory Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `∅` or `{}` | Empty set | Set with no elements | `∅ = {}` |
| `ε` or `λ` | Empty string | String with no characters | `ε ∈ Σ*` |
| `∈` | Element of | x is in set A | `3 ∈ {1,2,3}` |
| `∉` | Not element of | x is not in set A | `4 ∉ {1,2,3}` |
| `⊆` | Subset | A is subset of B | `{1,2} ⊆ {1,2,3}` |
| `⊂` | Proper subset | A ⊂ B and A ≠ B | `{1,2} ⊂ {1,2,3}` |
| `⊇` | Superset | A contains all of B | `{1,2,3} ⊇ {1,2}` |
| `⊃` | Proper superset | A ⊃ B and A ≠ B | `{1,2,3} ⊃ {1,2}` |
| `∪` | Union | Elements in A or B | `{1,2} ∪ {2,3} = {1,2,3}` |
| `∩` | Intersection | Elements in A and B | `{1,2} ∩ {2,3} = {2}` |
| `\` or `−` | Set difference | Elements in A but not B | `{1,2,3} \ {2} = {1,3}` |
| `×` | Cartesian product | Ordered pairs | `{1,2} × {a,b} = {(1,a),(1,b),(2,a),(2,b)}` |
| `𝒫(A)` or `2^A` | Power set | All subsets of A | `𝒫({1,2}) = {∅,{1},{2},{1,2}}` |
| `|A|` | Cardinality | Number of elements | `|{1,2,3}| = 3` |
| `Ā` or `A^c` | Complement | Elements not in A | If U={1,2,3}, A={1}, then Ā={2,3} |

#### Logic Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `∧` | AND (conjunction) | Both true | `T ∧ T = T` |
| `∨` | OR (disjunction) | At least one true | `T ∨ F = T` |
| `¬` or `~` | NOT (negation) | Opposite truth value | `¬T = F` |
| `⊕` | XOR (exclusive or) | Exactly one true | `T ⊕ F = T` |
| `→` or `⇒` | Implication | If...then | `T → F = F` |
| `↔` or `⇔` | Biconditional | If and only if | `T ↔ T = T` |
| `∀` | Universal quantifier | For all | `∀x ∈ ℕ, x ≥ 0` |
| `∃` | Existential quantifier | There exists | `∃x ∈ ℕ, x > 100` |
| `∃!` | Unique existence | Exists exactly one | `∃!x, x² = 4 ∧ x > 0` |
| `⊢` | Entails/Proves | Logically follows | `A ∧ B ⊢ A` |
| `⊨` | Models/Satisfies | Semantic entailment | `{T,F} ⊨ φ` |
| `⊥` | Contradiction | Always false | Bottom |
| `⊤` | Tautology | Always true | Top |

#### Number Sets

| Symbol | Name | Elements |
|--------|------|----------|
| `ℕ` | Natural numbers | `{0, 1, 2, 3, ...}` or `{1, 2, 3, ...}` |
| `ℤ` | Integers | `{..., -2, -1, 0, 1, 2, ...}` |
| `ℤ⁺` | Positive integers | `{1, 2, 3, ...}` |
| `ℚ` | Rational numbers | `{p/q | p,q ∈ ℤ, q ≠ 0}` |
| `ℝ` | Real numbers | All decimal numbers |
| `ℝ⁺` | Positive reals | `{x ∈ ℝ | x > 0}` |
| `ℂ` | Complex numbers | `{a + bi | a,b ∈ ℝ}` |

#### Sequence & Function Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `f: A → B` | Function | Maps from A to B | `f: ℕ → ℕ` |
| `f ∘ g` | Composition | `(f ∘ g)(x) = f(g(x))` | Chain functions |
| `f⁻¹` | Inverse function | Reverses f | If `f(2)=5`, then `f⁻¹(5)=2` |
| `⟨a,b⟩` or `(a,b)` | Ordered pair | Position matters | `⟨1,2⟩ ≠ ⟨2,1⟩` |
| `⟨a₁,...,aₙ⟩` | n-tuple | Ordered sequence | `⟨1,2,3⟩` |
| `aₙ` | Subscript | nth element | `a₅` = 5th element |
| `Σ` | Summation | Sum over range | `Σᵢ₌₁ⁿ i = 1+2+...+n` |
| `Π` | Product | Product over range | `Πᵢ₌₁ⁿ i = 1×2×...×n = n!` |

#### String & Language Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `Σ` | Alphabet | Finite set of symbols | `Σ = {0,1}` |
| `Σ*` | Kleene star | All strings over Σ | `{0,1}* = {ε,0,1,00,01,10,11,...}` |
| `Σ⁺` | Positive closure | All non-empty strings | `Σ⁺ = Σ* \ {ε}` |
| `ε` or `λ` | Empty string | String of length 0 | `|ε| = 0` |
| `w` | String | Sequence of symbols | `w = 0110` |
| `|w|` | Length | Number of symbols | `|0110| = 4` |
| `wʳ` or `w^R` | Reverse | String backwards | `(abc)ʳ = cba` |
| `xy` | Concatenation | x followed by y | `01 · 10 = 0110` |
| `xⁿ` | Repetition | x repeated n times | `0³ = 000` |
| `L` | Language | Set of strings | `L = {0ⁿ1ⁿ | n ≥ 0}` |

#### Relation Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `≤` | Less than or equal | Ordering | `2 ≤ 3` |
| `≥` | Greater than or equal | Ordering | `3 ≥ 2` |
| `<` | Less than | Strict ordering | `2 < 3` |
| `>` | Greater than | Strict ordering | `3 > 2` |
| `≡` | Equivalent to | Same as | `2+2 ≡ 4` |
| `≠` | Not equal | Different | `2 ≠ 3` |
| `≈` | Approximately | Close to | `π ≈ 3.14` |
| `~` | Equivalent/Related | Equivalence relation | `a ~ b` |
| `∝` | Proportional to | Scales with | `A ∝ r²` |
| `≪` | Much less than | Asymptotically smaller | `log n ≪ n` |
| `≫` | Much greater than | Asymptotically larger | `2ⁿ ≫ n²` |

#### Special Operators

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `⌊x⌋` | Floor | Largest integer ≤ x | `⌊3.7⌋ = 3` |
| `⌈x⌉` | Ceiling | Smallest integer ≥ x | `⌈3.2⌉ = 4` |
| `x mod n` | Modulo | Remainder of x ÷ n | `7 mod 3 = 1` |
| `n!` | Factorial | `n × (n-1) × ... × 1` | `4! = 24` |
| `(n k)` or `C(n,k)` | Binomial coefficient | n choose k | `(4 2) = 6` |

#### Graph Theory Symbols

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `G = (V,E)` | Graph | Vertices and Edges | `G = ({1,2,3}, {(1,2),(2,3)})` |
| `deg(v)` | Degree | Number of edges at v | `deg(v) = 3` |
| `δ(G)` | Min degree | Minimum vertex degree | — |
| `Δ(G)` | Max degree | Maximum vertex degree | — |
| `Kₙ` | Complete graph | All vertices connected | `K₅` has 10 edges |
| `Kₘ,ₙ` | Complete bipartite | Two sets fully connected | — |
| `path` | Path | Sequence of edges | `v₁→v₂→v₃` |
| `cycle` | Cycle | Closed path | Loop back to start |

---

### 📚 SET THEORY FOUNDATIONS

#### Set Builder Notation

```
{x | P(x)}  or  {x : P(x)}
```
"The set of all x such that property P(x) holds"

**Examples**:
- `{x | x ∈ ℕ ∧ x < 5} = {0,1,2,3,4}`
- `{x² | x ∈ {1,2,3}} = {1,4,9}`
- `{w | w ∈ {0,1}* ∧ |w| = 3} = {000,001,010,011,100,101,110,111}`

#### Set Operations

| Operation | Definition | Venn Diagram Hint |
|-----------|------------|-------------------|
| **Union** | `A ∪ B = {x | x ∈ A ∨ x ∈ B}` | Everything in either circle |
| **Intersection** | `A ∩ B = {x | x ∈ A ∧ x ∈ B}` | Overlapping region |
| **Difference** | `A \ B = {x | x ∈ A ∧ x ∉ B}` | A minus overlap |
| **Complement** | `Ā = U \ A` | Everything outside A |
| **Symmetric Diff** | `A ⊕ B = (A \ B) ∪ (B \ A)` | XOR region |

#### Important Set Properties

**De Morgan's Laws**:
```
¬(A ∧ B) ≡ ¬A ∨ ¬B
¬(A ∨ B) ≡ ¬A ∧ ¬B

(A ∪ B)^c = A^c ∩ B^c
(A ∩ B)^c = A^c ∪ B^c
```

**Distributive Laws**:
```
A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)
A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)
```

**Power Set Size**:
```
|𝒫(A)| = 2^|A|
```

**Cartesian Product Size**:
```
|A × B| = |A| × |B|
```

---

### 🔢 FUNCTIONS & RELATIONS

#### Function Types

| Type | Definition | Example |
|------|------------|---------|
| **Injective** (one-to-one) | `f(a) = f(b) → a = b` | `f(x) = 2x` |
| **Surjective** (onto) | `∀y ∈ B, ∃x: f(x) = y` | `f: ℝ → ℝ, f(x) = x³` |
| **Bijective** | Both injective & surjective | `f(x) = 2x + 1` |
| **Total** | Defined for all inputs | `f: ℕ → ℕ` |
| **Partial** | May be undefined | `f(x) = 1/x` undefined at 0 |

#### Relations

**Relation**: `R ⊆ A × B`
- `aRb` means `(a,b) ∈ R`

**Relation Properties** (for `R ⊆ A × A`):

| Property | Definition | Example |
|----------|------------|---------|
| **Reflexive** | `∀a ∈ A: aRa` | `a ≤ a` |
| **Symmetric** | `aRb → bRa` | `a = b` |
| **Antisymmetric** | `aRb ∧ bRa → a = b` | `a ≤ b` |
| **Transitive** | `aRb ∧ bRc → aRc` | `a < b < c` |

**Equivalence Relation**: Reflexive + Symmetric + Transitive
- Creates **equivalence classes**: `[a] = {b | aRb}`

**Partial Order**: Reflexive + Antisymmetric + Transitive
- Example: `⊆` on sets, `≤` on numbers

---

### 🎲 COMBINATORICS ESSENTIALS

#### Counting Principles

**Sum Rule**: If A and B disjoint:
```
|A ∪ B| = |A| + |B|
```

**Product Rule**: For independent choices:
```
|A × B| = |A| × |B|
```

**Permutations** (order matters):
```
P(n,k) = n!/(n-k)!
```

**Combinations** (order doesn't matter):
```
C(n,k) = (n k) = n!/(k!(n-k)!)
```

**Pigeonhole Principle**:
```
If n items in m boxes and n > m,
then some box has ≥ ⌈n/m⌉ items
```

---

### 🧮 BOOLEAN ALGEBRA

#### Truth Tables

| A | B | ¬A | A∧B | A∨B | A⊕B | A→B | A↔B |
|---|---|-------|-----|-----|-----|-----|-----|
| 0 | 0 | 1     | 0   | 0   | 0   | 1   | 1   |
| 0 | 1 | 1     | 0   | 1   | 1   | 1   | 0   |
| 1 | 0 | 0     | 0   | 1   | 1   | 0   | 0   |
| 1 | 1 | 0     | 1   | 1   | 0   | 1   | 1   |

#### Boolean Laws

**Identity**:
```
A ∧ 1 = A
A ∨ 0 = A
```

**Domination**:
```
A ∨ 1 = 1
A ∧ 0 = 0
```

**Idempotent**:
```
A ∨ A = A
A ∧ A = A
```

**Double Negation**:
```
¬¬A = A
```

**De Morgan**:
```
¬(A ∧ B) = ¬A ∨ ¬B
¬(A ∨ B) = ¬A ∧ ¬B
```

---

### 📊 GRAPH THEORY BASICS

#### Graph Definitions

**Graph**: `G = (V, E)`
- `V` = vertices (nodes)
- `E` = edges (connections)
- `E ⊆ V × V` (directed) or `E ⊆ {{u,v} | u,v ∈ V}` (undirected)

**Types**:
- **Simple**: No self-loops, no multiple edges
- **Directed**: Edges have direction
- **Weighted**: Edges have weights
- **Complete**: All vertices connected
- **Bipartite**: Vertices in two sets, edges between sets only

**Degree**: Number of edges at vertex
```
Σ deg(v) = 2|E|  (Handshake Lemma)
```

**Path**: Sequence of vertices connected by edges
**Cycle**: Path that returns to start
**Connected**: Path exists between any two vertices

---

### 🔄 PROOF TECHNIQUES (Quick Reference)

#### 1. Direct Proof
```
Assume P
→ logical steps
→ Conclude Q
```

#### 2. Proof by Contradiction
```
Assume ¬Q
→ derive contradiction
→ Therefore Q
```

#### 3. Proof by Contrapositive
```
Instead of P → Q
Prove ¬Q → ¬P (equivalent)
```

#### 4. Proof by Induction
```
Base case: P(0) is true
Inductive step: P(k) → P(k+1)
Conclusion: ∀n ≥ 0, P(n)
```

**Strong Induction**:
```
Assume P(0), P(1), ..., P(k)
Prove P(k+1)
```

#### 5. Proof by Construction
```
Build explicit example satisfying property
```

#### 6. Proof by Counterexample
```
To disprove ∀x: P(x)
Find one x where ¬P(x)
```

---

### 🎯 ESSENTIAL FORMULAS

#### Summations
```
Σ(i=1 to n) i = n(n+1)/2

Σ(i=1 to n) i² = n(n+1)(2n+1)/6

Σ(i=0 to n) rⁱ = (rⁿ⁺¹ - 1)/(r - 1)  [geometric series]

Σ(i=0 to ∞) rⁱ = 1/(1-r)  for |r| < 1
```

#### Logarithms
```
log(ab) = log(a) + log(b)
log(a/b) = log(a) - log(b)
log(aᵇ) = b·log(a)
log_a(b) = log(b)/log(a)  [change of base]

log₂(n!) = Θ(n log n)  [Stirling's approximation]
```

#### Exponentials
```
a^m · a^n = a^(m+n)
(a^m)^n = a^(mn)
a^m / a^n = a^(m-n)
```

---

### ⚡ COMMON PITFALLS & GOTCHAS

| Error | Correct | Note |
|-------|---------|------|
| `∅ = {∅}` | `∅ ≠ {∅}` | Empty set vs set containing empty set |
| `ε = ∅` | `ε ≠ ∅` | Empty string vs empty set |
| `{ε} = ∅` | `{ε} ≠ ∅` | Set with empty string has 1 element |
| `0 ∈ ℕ` | Depends! | Sometimes ℕ = {0,1,2,...}, sometimes {1,2,...} |
| `log n = ln n` | Usually `log = log₂` in CS | Context matters |
| `2^(n+1) = 2^n + 2^n` | ✓ | But `2^(n+1) ≠ 2^n + 1` |

---

### 🧪 QUICK SANITY CHECKS

**Set operations**:
```
|A ∪ B| = |A| + |B| - |A ∩ B|  [Inclusion-Exclusion]
A ⊆ B ⟺ A ∩ B = A
A ⊆ B ⟺ A ∪ B = B
```

**String operations**:
```
|xy| = |x| + |y|
|xⁿ| = n·|x|
|ε| = 0
εw = wε = w
```

**Cardinality**:
```
|Σⁿ| = |Σ|ⁿ  [strings of length exactly n]
|Σ*| = infinite
|𝒫(A)| = 2^|A|
```

---

---

## [0x00] :: FOUNDATIONS

### 🧰 PROOF ARSENAL

| Technique | Use Case | Attack Pattern |
|-----------|----------|----------------|
| **Construction** | Build explicit example | "Here's how to do it" |
| **Contradiction** | Assume opposite → crash | "This can't exist" |
| **Induction** | Base case + step = ∀ | "Dominoes fall forever" |

### 🔧 MATHEMATICAL PRIMITIVES

- **Sets** → Collections of objects: `{0, 1, 2, ...}`
- **Sequences** → Ordered lists: `(a₁, a₂, a₃, ...)`
- **Functions** → Mappings: `f: A → B`
- **Graphs** → `G = (V, E)` nodes + edges
- **Strings** → `w ∈ Σ*` sequences over alphabet
- **Boolean Logic** → `∧ ∨ ¬ → ↔` truth tables

---

## [0x01] :: AUTOMATA & LANGUAGES

```
┌─────────────────────────────────────────┐
│  CHOMSKY HIERARCHY (Power Levels)      │
├─────────────────────────────────────────┤
│  Type 3: REGULAR          [DFA/NFA]    │
│  Type 2: CONTEXT-FREE     [PDA]        │
│  Type 1: CONTEXT-SENSITIVE [LBA]       │
│  Type 0: RECURSIVELY ENUM  [TM]        │
└─────────────────────────────────────────┘
```

---

## 📟 CHAPTER 1 :: REGULAR LANGUAGES

### ⚙️ FINITE AUTOMATA (FA)

**Core Concept**: State machine with finite memory

```
    ┌───┐  1   ┌───┐
 →  │ q₀ │ ──→ │ q₁ │ ⊙
    └───┘      └───┘
      ↺ 0        ↺ 1
```

**Formal Definition**: `M = (Q, Σ, δ, q₀, F)`
- `Q` = finite set of states
- `Σ` = alphabet (input symbols)
- `δ: Q × Σ → Q` = transition function
- `q₀ ∈ Q` = start state
- `F ⊆ Q` = accept states

**Regular Operations**:
- **Union**: `A ∪ B` → strings in A OR B
- **Concatenation**: `A ∘ B` → string from A followed by B
- **Star**: `A*` → zero or more concatenations of A

---

### 🎲 NONDETERMINISM

**Key Insight**: Multiple valid next moves = parallel universes

**NFA → DFA Conversion**:
```
NFA state {q₁, q₂, q₃} becomes DFA state
Power set construction: 2ⁿ possible DFA states
```

**Closure Properties**:
- ✅ Union, Concatenation, Star
- ✅ Complement, Intersection
- ✅ ALL regular operations

---

### 🔤 REGULAR EXPRESSIONS

**Regex = Algebraic shorthand for regular languages**

| Operator | Meaning | Example |
|----------|---------|---------|
| `∅` | Empty language | No strings |
| `ε` | Empty string | "" |
| `a` | Single symbol | "a" |
| `R₁ ∪ R₂` | Union | `0 ∪ 1` = {0, 1} |
| `R₁ ∘ R₂` | Concatenation | `0 ∘ 1` = {01} |
| `R*` | Star (0+ times) | `(01)*` = {ε, 01, 0101, ...} |

**EQUIVALENCE THEOREM**: `Regular Expressions ≡ Finite Automata`

---

### 🚫 PUMPING LEMMA (Breaking Regular Languages)

**Exploit**: If `L` is regular, long strings have loops

```
For regular L, ∃ pumping length p:
  If |w| ≥ p, then w = xyz where:
    1. |xy| ≤ p
    2. |y| > 0
    3. xy^i z ∈ L for all i ≥ 0
```

**Attack Pattern**:
1. Assume `L` is regular
2. Let `p` be pumping length
3. Choose `w ∈ L` with `|w| ≥ p`
4. Show NO split `xyz` works
5. **CONTRADICTION** → `L` is NOT regular

**Classic Example**: `{0ⁿ1ⁿ | n ≥ 0}` is NOT regular
- Try pumping → asymmetry between 0s and 1s
- Pumping breaks balance → 💥

---

## 🔄 CHAPTER 2 :: CONTEXT-FREE LANGUAGES

### 📝 CONTEXT-FREE GRAMMARS (CFG)

**Power Up**: Recursive structure + memory stack

```
S → 0S1    (recursion)
S → ε      (base case)

Generates: {0ⁿ1ⁿ | n ≥ 0}
```

**Formal Definition**: `G = (V, Σ, R, S)`
- `V` = variables (non-terminals)
- `Σ` = terminals
- `R` = production rules
- `S` = start variable

**Parse Tree**: Shows derivation structure
```
        S
       / \
      0   S   1
         / \
        0   S  1
            |
            ε
```

**Ambiguity**: Multiple parse trees for same string
- **Problem**: Unclear meaning
- **Example**: `E → E + E | E × E | a`
  - String `a + a × a` has 2 parse trees

**Chomsky Normal Form (CNF)**:
```
A → BC    (2 variables)
A → a     (1 terminal)
S → ε     (if ε ∈ L)
```

---

### 📚 PUSHDOWN AUTOMATA (PDA)

**Upgrade**: FA + Stack (infinite memory)

```
┌─────────────┐
│   STACK     │ ← Push/Pop
├─────────────┤
│     ⋮       │
│     X       │
│     Z       │
└─────────────┘
      ↕
   ┌────┐
   │ q₀ │ ← States
   └────┘
```

**Formal Definition**: `M = (Q, Σ, Γ, δ, q₀, F)`
- `Γ` = stack alphabet
- `δ: Q × Σ_ε × Γ_ε → P(Q × Γ_ε)` = transition function

**POWER**: `PDAs ≡ CFGs`

---

### 🚫 PUMPING LEMMA v2.0 (Context-Free Edition)

```
For CFL L, ∃ pumping length p:
  If |w| ≥ p, then w = uvxyz where:
    1. |vxy| ≤ p
    2. |vy| > 0
    3. uv^i xy^i z ∈ L for all i ≥ 0
```

**Classic Kill**: `{aⁿbⁿcⁿ | n ≥ 0}` is NOT context-free
- Must pump v and y
- Can't maintain 3-way balance → 💥

---

### ⚡ DETERMINISTIC CFLs

**DPDA**: Only one valid transition at a time
- **Subset** of CFLs
- **Better**: Closed under complement
- **Parsers**: LR(k) grammars → deterministic parsing

---

## [0x02] :: COMPUTABILITY THEORY

```
╔════════════════════════════════════════╗
║  "There exist problems that cannot be  ║
║   solved by ANY algorithm, period."    ║
╚════════════════════════════════════════╝
```

---

## 🖥️ CHAPTER 3 :: CHURCH-TURING THESIS

### 🎰 TURING MACHINES

**Ultimate Computational Model**: Infinite tape + read/write head

```
... □ □ 0 1 0 1 □ □ ...
          ↑
        [HEAD]
          |
       ┌──┴──┐
       │ q₂  │ ← Current State
       └─────┘
```

**Formal Definition**: `M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)`
- `Γ` = tape alphabet (includes blank `□`)
- `δ: Q × Γ → Q × Γ × {L, R}` = transition function
  - Read symbol → Write symbol, Move head, Change state

**Operations**:
- Read/Write on tape
- Move head Left/Right
- Change state
- Accept/Reject

**Computation**:
1. Input on tape, head at leftmost position
2. Execute transitions
3. Halt in `q_accept` (accept) or `q_reject` (reject)
4. Or loop forever (no decision)

---

### 🔀 TM VARIANTS (All Equivalent!)

| Variant | Description | Overhead |
|---------|-------------|----------|
| **Multitape** | k tapes instead of 1 | O(t²) simulation |
| **Nondeterministic** | Multiple valid moves | Exponential search tree |
| **Enumerator** | Prints strings in L | Can loop |
| **Two-way infinite** | Tape extends both ways | Trivial conversion |

**CHURCH-TURING THESIS**: "Anything computable = computable by TM"
- Not a theorem (unprovable)
- Philosophical claim about "algorithm"
- 100+ years, no counterexample

---

## 🎯 CHAPTER 4 :: DECIDABILITY

### ✅ DECIDABLE = Always Halts

**Decidable Language**: `L` has TM that halts on ALL inputs
- Accept if `w ∈ L`
- Reject if `w ∉ L`
- **NEVER** loops forever

**Examples**:
- `A_DFA = {⟨B, w⟩ | B is DFA, w ∈ L(B)}` ✅
- `E_DFA = {⟨A⟩ | A is DFA, L(A) = ∅}` ✅
- `EQ_DFA = {⟨A, B⟩ | A, B are DFAs, L(A) = L(B)}` ✅
- `A_CFG = {⟨G, w⟩ | G is CFG, w ∈ L(G)}` ✅
- `E_CFG = {⟨G⟩ | G is CFG, L(G) = ∅}` ✅

---

### ❌ UNDECIDABILITY (The Big Crash)

**HALTING PROBLEM**: `A_TM = {⟨M, w⟩ | M is TM, M accepts w}`

**THEOREM**: `A_TM` is UNDECIDABLE

**Proof by Diagonalization**:
```python
# Assume H decides A_TM
def H(M, w):
    if M accepts w: return ACCEPT
    else: return REJECT

# Build adversarial D
def D(M):
    if H(M, ⟨M⟩) == ACCEPT:
        REJECT  # Do opposite
    else:
        ACCEPT

# What does D(⟨D⟩) do?
# If D accepts ⟨D⟩ → H says D accepts → D rejects
# If D rejects ⟨D⟩ → H says D rejects → D accepts
# CONTRADICTION! H cannot exist.
```

**CONSEQUENCES**:
- Can't write bug detector that always terminates
- Can't write perfect virus scanner
- Fundamental limits on software verification

---

### 🔻 HIERARCHY OF UNDECIDABILITY

```
┌─────────────────────────────────┐
│  DECIDABLE (Recursively Dec.)   │
├─────────────────────────────────┤
│  RECOGNIZABLE (Recursively Enum)│
│  - A_TM (halting problem)       │
├─────────────────────────────────┤
│  UNRECOGNIZABLE                 │
│  - Ā_TM (complement of halting) │
└─────────────────────────────────┘
```

---

## 🔗 CHAPTER 5 :: REDUCIBILITY

### 🎣 REDUCTION = "If I can solve B, I can solve A"

**Mapping Reduction**: `A ≤_m B`
```
Computable function f:
  w ∈ A ⟺ f(w) ∈ B
```

**Properties**:
- If `A ≤_m B` and `B` decidable → `A` decidable
- If `A ≤_m B` and `A` undecidable → `B` undecidable

**Attack Pattern**:
1. Want to prove `B` undecidable
2. Find known undecidable `A`
3. Show `A ≤_m B`
4. **Conclusion**: `B` is undecidable

---

### 🧩 CLASSIC UNDECIDABLE PROBLEMS

| Problem | Description | Status |
|---------|-------------|--------|
| `A_TM` | Does TM M accept w? | ❌ Undecidable |
| `HALT_TM` | Does TM M halt on w? | ❌ Undecidable |
| `E_TM` | Is L(M) = ∅? | ❌ Undecidable |
| `REGULAR_TM` | Is L(M) regular? | ❌ Undecidable |
| `EQ_TM` | Do M₁, M₂ accept same language? | ❌ Undecidable |
| `PCP` | Post Correspondence Problem | ❌ Undecidable |

---

### 🎲 POST CORRESPONDENCE PROBLEM (PCP)

**Input**: Domino tiles with strings top and bottom
```
┌───┬───┬───┐
│ ab│ b │ aba│  ← Top
├───┼───┼───┤
│abc│ ca│ a  │  ← Bottom
└───┴───┴───┘
```

**Question**: Can you arrange (with repetition) so top = bottom?

**Answer**: UNDECIDABLE
- Simple to state
- Impossible to solve algorithmically
- Used to prove other problems undecidable

---

## 🧬 CHAPTER 6 :: ADVANCED COMPUTABILITY

### 🔄 RECURSION THEOREM

**Mind-Bender**: Program can obtain its own source code

```python
# Quine: Program that prints itself
def SELF():
    print(source_code(SELF))
```

**Applications**:
- Self-replicating programs
- Viruses
- Fixed-point theorems
- Prove Rice's theorem

---

### 📊 KOLMOGOROV COMPLEXITY

**Definition**: `K(x)` = length of shortest program that outputs `x`

```
K("00000000") ≈ 20  (small: "print '0' * 8")
K("01101001") ≈ 100 (large: random-looking)
```

**Incompressibility**: Most strings are incompressible
- **Random** = incompressible
- Can't compress all strings (pigeonhole principle)

---

## [0x03] :: COMPLEXITY THEORY

```
╔═══════════════════════════════════════╗
║  "It's not whether you CAN compute,   ║
║   it's whether you can compute FAST"  ║
╚═══════════════════════════════════════╝
```

---

## ⏱️ CHAPTER 7 :: TIME COMPLEXITY

### 📏 ASYMPTOTIC NOTATION

| Notation | Meaning | Example |
|----------|---------|---------|
| `O(f(n))` | Upper bound | "At most f(n)" |
| `Ω(f(n))` | Lower bound | "At least f(n)" |
| `Θ(f(n))` | Tight bound | "Exactly f(n)" |
| `o(f(n))` | Strict upper | "Strictly less than f(n)" |

**Growth Rates** (slowest → fastest):
```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
```

---

### 🟢 CLASS P (Polynomial Time)

**Definition**: Solvable in `O(nᵏ)` time for some constant `k`

```
P = ⋃ TIME(nᵏ)
    k≥0
```

**Philosophy**: "Efficient" = polynomial time
- `n`, `n log n`, `n²`, `n³` → Practical
- `2ⁿ`, `n!` → Intractable

**Examples in P**:
- ✅ **PATH**: Is there path from s to t?
- ✅ **PRIMES**: Is n prime? (AKS algorithm)
- ✅ **LINEAR-PROGRAMMING**: Optimize linear function
- ✅ **MATCHING**: Find maximum matching in graph
- ✅ **SORT**: Sort n numbers

---

### 🔶 CLASS NP (Nondeterministic Polynomial)

**Definition**: Verifiable in polynomial time

```
NP = Problems where "yes" instances have
     polynomial-size certificates
```

**Certificate**: Proof that answer is "yes"
- If `w ∈ L`, there exists certificate `c`
- Can verify `w ∈ L` using `c` in poly time

**Examples in NP**:
- **SAT**: Is Boolean formula satisfiable?
  - Certificate: Satisfying assignment
- **HAMPATH**: Does graph have Hamiltonian path?
  - Certificate: The path itself
- **CLIQUE**: Does graph have k-clique?
  - Certificate: The k vertices
- **SUBSET-SUM**: Does subset sum to target?
  - Certificate: The subset

---

### 💀 P vs NP (The Million Dollar Question)

```
┌─────────────────────────────────┐
│         Is P = NP?              │
├─────────────────────────────────┤
│  👍 Most believe P ≠ NP         │
│  👎 No proof either way         │
│  💰 $1,000,000 prize            │
└─────────────────────────────────┘
```

**If P = NP** (unlikely):
- ✅ Fast solutions to all "search" problems
- ✅ Break all current cryptography
- ✅ Perfect protein folding, scheduling, routing
- ✅ "Checking = Solving"

**If P ≠ NP** (likely):
- ❌ Some problems inherently hard
- ✅ Cryptography remains secure
- ❌ No fast algorithm for NP-complete problems

---

### 🔥 NP-COMPLETENESS (The Hardest Problems)

**Definition**: Problem is NP-complete if:
1. Problem is in NP
2. Every problem in NP reduces to it

```
     NP-Complete
         ↓
   "If I can solve this,
    I can solve EVERYTHING in NP"
```

**Cook-Levin Theorem**: **SAT is NP-complete**
- First NP-complete problem
- Proof: Reduce any NP problem to SAT
- Every TM computation → Boolean formula

---

### 🎯 NP-COMPLETE HIT LIST

| Problem | Description | Reduction From |
|---------|-------------|----------------|
| **SAT** | Boolean satisfiability | — (Cook-Levin) |
| **3SAT** | SAT with 3 literals/clause | SAT |
| **CLIQUE** | k vertices all connected | 3SAT |
| **VERTEX-COVER** | Cover edges with k vertices | 3SAT |
| **HAMPATH** | Visit all vertices once | VERTEX-COVER |
| **SUBSET-SUM** | Subset sums to target | 3SAT |
| **TSP** | Shortest tour visiting all | HAMPATH |
| **KNAPSACK** | Maximize value in capacity | SUBSET-SUM |

**Polynomial-Time Reduction**: `A ≤_p B`
```
If A ≤_p B and B ∈ P, then A ∈ P
If A ≤_p B and A is NP-complete, then B is NP-complete
```

---

## 💾 CHAPTER 8 :: SPACE COMPLEXITY

### 📦 SPACE CLASSES

```
L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE ⊆ EXPTIME ⊆ EXPSPACE
```

| Class | Definition | Example |
|-------|------------|---------|
| **L** | Log space | Undirected connectivity |
| **NL** | Nondeterministic log space | Directed connectivity |
| **PSPACE** | Polynomial space | TQBF, chess |
| **EXPSPACE** | Exponential space | Regex equivalence |

---

### 🔄 SAVITCH'S THEOREM

**Result**: `NSPACE(f(n)) ⊆ SPACE(f²(n))`

**Meaning**: Can simulate nondeterministic space with deterministic space
- Cost: Square the space bound
- Application: `NPSPACE = PSPACE`

---

### 👑 PSPACE-COMPLETENESS

**TQBF (True Quantified Boolean Formula)**: PSPACE-complete

```
∃x₁ ∀x₂ ∃x₃ ... φ(x₁, x₂, x₃, ...)
```

**Applications**:
- **Game Theory**: Winning strategies (chess, go)
- **Planning**: Can robot reach goal?
- **Verification**: Does program satisfy spec?

**Generalized Geography**: PSPACE-complete game
- Players alternate naming cities
- Each city starts with last letter of previous
- First player unable to move loses

---

### 🌊 NL-COMPLETENESS

**PATH (Directed Graph Reachability)**: NL-complete
- Input: Directed graph G, nodes s, t
- Question: Path from s to t?
- Space: O(log n) to store current node

**Immerman-Szelepcsényi Theorem**: `NL = coNL`
- Surprising result!
- Not known if `NP = coNP`

---

## 📊 CHAPTER 9 :: INTRACTABILITY

### 📈 HIERARCHY THEOREMS

**Time Hierarchy**: More time → strictly more power
```
TIME(n) ⊊ TIME(n²) ⊊ TIME(2ⁿ)
```

**Space Hierarchy**: More space → strictly more power
```
SPACE(n) ⊊ SPACE(n²)
```

**Consequences**:
- `P ≠ EXPTIME` (proven!)
- `L ≠ PSPACE` (proven!)
- But `P vs NP` still open

---

### 🎭 RELATIVIZATION

**Oracles**: TM with access to "black box" solver

**Oracle Barriers**:
- Some oracles: `Pᴬ = NPᴬ`
- Some oracles: `Pᴮ ≠ NPᴮ`
- **Conclusion**: Diagonalization can't solve P vs NP

---

### 🔌 CIRCUIT COMPLEXITY

**Boolean Circuits**: Directed acyclic graphs
- AND, OR, NOT gates
- Input wires → Output wire

**SIZE(f(n))**: Circuits with ≤ f(n) gates

**P/poly**: Polynomial-size circuits
- Includes some undecidable languages!
- Non-uniform: Different circuit per input length

---

## 🚀 CHAPTER 10 :: ADVANCED TOPICS

### 📐 APPROXIMATION ALGORITHMS

**Philosophy**: Can't solve optimally → get close

**Example**: VERTEX-COVER
- Optimal: NP-complete
- 2-approximation: Polynomial time
- Solution ≤ 2 × OPT

---

### 🎰 PROBABILISTIC ALGORITHMS

**Class BPP**: Bounded-error Probabilistic Polynomial
```
Pr[M accepts w ∈ L] ≥ 2/3
Pr[M rejects w ∉ L] ≥ 2/3
```

**Primality Testing**:
- Deterministic (AKS): `O(n¹²)` (polynomial)
- Randomized (Miller-Rabin): `O(k·n²)` (very fast)
- Error probability: `2⁻ᵏ`

**Amplification**: Run k times, take majority
- Error drops exponentially

---

### ⚡ ALTERNATION

**Alternating TM**: States alternate ∃ and ∀
```
∃ state: Accept if ANY successor accepts
∀ state: Accept if ALL successors accept
```

**Results**:
- `AP = PSPACE`
- `ATIME(f(n)) = SPACE(f(n))`
- `ASPACE(f(n)) = TIME(2^O(f(n)))`

**Polynomial Hierarchy**:
```
Σ₀ᴾ = Π₀ᴾ = P
Σₖ₊₁ᴾ = NPᐰᵏᴾ
Πₖ₊₁ᴾ = coNPᐰᵏᴾ
```

---

### 🎭 INTERACTIVE PROOF SYSTEMS

**Model**: Prover + Verifier interaction

```
PROVER (unlimited power)
   ↕ random challenges
VERIFIER (polynomial time)
```

**Graph Non-Isomorphism**: In IP
- Prover convinces verifier graphs not isomorphic
- Uses randomness

**IP = PSPACE**: Shocking result!

---

### ⚙️ PARALLEL COMPUTATION

**Class NC (Nick's Class)**: Efficiently parallelizable
```
NC = Problems in O(logᵏ n) time
     with polynomial processors
```

**Examples in NC**:
- ✅ Matrix multiplication
- ✅ Sorting
- ✅ Graph connectivity

**P-Complete**: Unlikely to parallelize
- Circuit evaluation
- Linear programming

---

### 🔐 CRYPTOGRAPHY

**One-Way Functions**: Easy to compute, hard to invert
```
f: {0,1}ⁿ → {0,1}ⁿ
- Given x, easy to compute f(x)
- Given f(x), hard to find x
```

**Existence**: Implies `P ≠ NP`

**Trapdoor Functions**: One-way with secret backdoor
- Public key encryption
- RSA: Hard to factor, easy with p, q

---

## 🗺️ THE GRAND MAP

```
┌────────────────────────────────────────────────────────┐
│                  COMPLEXITY UNIVERSE                    │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┐ ⊆ ┌──────┐ ⊆ ┌────┐ ⊆ ┌────┐ ⊆ ┌────────┐ │
│  │  L   │    │  NL  │    │ P  │    │ NP │    │ PSPACE │ │
│  └──────┘    └──────┘    └────┘    └────┘    └────────┘ │
│     ║            ║          ║         ║            ║     │
│  [LOG]       [LOG]      [POLY]   [VERIFY]      [POLY]   │
│  SPACE     ND-SPACE     TIME      POLY        SPACE     │
│                                                         │
│  ┌────────┐ ⊆ ┌──────────┐                            │
│  │EXPTIME │    │ EXPSPACE │                            │
│  └────────┘    └──────────┘                            │
│                                                         │
├────────────────────────────────────────────────────────┤
│  KNOWN SEPARATIONS:                                    │
│    • L ≠ PSPACE (Space Hierarchy)                      │
│    • P ≠ EXPTIME (Time Hierarchy)                      │
│    • NL = coNL (Immerman-Szelepcsényi)                 │
│                                                         │
│  UNKNOWN (BIG QUESTIONS):                              │
│    • P vs NP ($1M prize)                               │
│    • NP vs PSPACE                                      │
│    • L vs P                                            │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 QUICK REFERENCE TABLES

### 🔍 DECIDABILITY REFERENCE

| Problem | Input | Question | Decidable? |
|---------|-------|----------|------------|
| `A_DFA` | DFA M, string w | Does M accept w? | ✅ |
| `E_DFA` | DFA M | Is L(M) empty? | ✅ |
| `EQ_DFA` | DFAs M₁, M₂ | L(M₁) = L(M₂)? | ✅ |
| `A_CFG` | CFG G, string w | Does G generate w? | ✅ |
| `E_CFG` | CFG G | Is L(G) empty? | ✅ |
| `EQ_CFG` | CFGs G₁, G₂ | L(G₁) = L(G₂)? | ❌ |
| `A_TM` | TM M, string w | Does M accept w? | ❌ |
| `HALT_TM` | TM M, string w | Does M halt on w? | ❌ |
| `E_TM` | TM M | Is L(M) empty? | ❌ |
| `REGULAR_TM` | TM M | Is L(M) regular? | ❌ |

---

### ⚡ COMPLEXITY CLASSES CHEAT SHEET

| Class | Time/Space | Verifier | Complete Problem |
|-------|------------|----------|------------------|
| **L** | O(log n) space | — | Undirected connectivity |
| **NL** | ND O(log n) space | — | Directed connectivity |
| **P** | O(nᵏ) time | — | PATH, PRIMES |
| **NP** | Verify O(nᵏ) | Poly time | SAT, CLIQUE, HAMPATH |
| **coNP** | Complement of NP | — | UNSAT, TAUTOLOGY |
| **PSPACE** | O(nᵏ) space | — | TQBF, Geography |
| **EXPTIME** | O(2^(nᵏ)) time | — | Chess (generalized) |
| **BPP** | Randomized poly | 2/3 correct | Primality (Miller-Rabin) |
| **NC** | O(logᵏ n) parallel | — | Matrix mult, sorting |

---

### 🛠️ REDUCTION TYPES

| Type | Notation | Resources | Use |
|------|----------|-----------|-----|
| **Mapping** | `A ≤_m B` | Computable function | Undecidability |
| **Polynomial** | `A ≤_p B` | Poly-time function | NP-completeness |
| **Log-space** | `A ≤_L B` | Log-space function | NL/L-completeness |
| **Turing** | `A ≤_T B` | Oracle access | General reducibility |

---

## 💡 KEY INSIGHTS & HEURISTICS

### 🎯 Problem-Solving Strategies

**Proving Non-Regularity**:
1. Try Pumping Lemma
2. Look for unbounded counting
3. Check closure properties

**Proving Undecidability**:
1. Reduce from `A_TM` or `HALT_TM`
2. Use Rice's Theorem (non-trivial properties)
3. Build self-referential construction

**Proving NP-Completeness**:
1. Show in NP (certificate + verifier)
2. Reduce from known NP-complete (SAT, 3SAT, etc.)
3. Build polynomial gadgets

**Complexity Lower Bounds**:
1. Reduction from hard problem
2. Diagonalization / Hierarchy theorems
3. Circuit lower bounds (harder)

---

### 🧠 Mental Models

**Regular vs Context-Free**:
```
Regular:     Counting to k (finite states)
Context-Free: Counting to n (stack)
```

**Decidable vs Undecidable**:
```
Decidable:     Always answers
Undecidable:   Might loop forever
```

**P vs NP**:
```
P:  Finding solutions fast
NP: Checking solutions fast
```

**PSPACE vs NP**:
```
NP:      Guess & verify (short certificate)
PSPACE:  Unlimited guessing (reuse space)
```

---

## 🏁 FINAL BOSS BATTLES

### 🔥 Open Problems

| Problem | Difficulty | Bounty |
|---------|------------|--------|
| **P vs NP** | ⭐⭐⭐⭐⭐ | $1,000,000 |
| **NP vs PSPACE** | ⭐⭐⭐⭐⭐ | Fame |
| **L vs P** | ⭐⭐⭐⭐ | Fame |
| **BPP vs P** | ⭐⭐⭐ | Fame |

---

## 📚 FURTHER EXPLORATIONS

**Classic Texts**:
- Sipser: *Introduction to the Theory of Computation*
- Hopcroft/Ullman: *Introduction to Automata Theory*
- Papadimitriou: *Computational Complexity*
- Arora/Barak: *Computational Complexity: A Modern Approach*

**Online Resources**:
- Scott Aaronson's Blog
- Complexity Zoo (complexityzoo.net)
- Stack Exchange (cstheory)

---

```
┌─────────────────────────────────────────────┐
│  "In theory, there is no difference between │
│   theory and practice. In practice, there   │
│   is." — Yogi Berra (complexity theorist?)  │
└─────────────────────────────────────────────┘
```

**EOF** 🎮