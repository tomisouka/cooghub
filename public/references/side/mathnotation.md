# 🔣 Mathematical Symbols Quick Reference
## Discrete Math • Automata Theory • Linear Algebra

> Your cheat sheet for mathematical notation across CS theory domains

---

## 📋 TABLE OF CONTENTS

| # | Section | Topics |
|---|---------|--------|
| 1 | [Set Theory](#-set-theory-symbols) | Operations, builder notation, power sets |
| 2 | [Logic](#-logic-symbols) | Propositional, predicate, quantifiers |
| 3 | [Relations](#-relation-symbols) | Ordering, equality, equivalence, divisibility |
| 4 | [Number Sets](#-number-sets) | ℕ, ℤ, ℚ, ℝ, ℂ |
| 5 | [Functions & Mappings](#-functions--mappings) | Notation, sequences, series |
| 6 | [Strings & Languages](#-string--language-symbols) | Alphabets, Kleene star, closure |
| 7 | [Automata Theory](#-automata-theory-symbols) | DFA, NFA, PDA, TM, configurations |
| 8 | [Complexity Theory](#-complexity-theory-symbols) | Big-O, complexity classes, reductions |
| 9 | [Graph Theory](#-graph-theory-symbols) | Vertices, edges, paths, special graphs |
| 10 | [Combinatorics & Counting](#-combinatorics--counting) | Factorials, permutations, combinations |
| 11 | [Linear Algebra](#-linear-algebra-symbols) | Vectors, matrices, eigenvalues, spaces |
| 12 | [Number Theory](#-number-theory--modular-arithmetic) | Modular arithmetic, GCD, totient |
| 13 | [Special Symbols & Operators](#-special-symbols--operators) | Calculus, probability, miscellaneous |
| 14 | [Typography Conventions](#-typography-conventions) | Bold, italic, Greek, blackboard bold |
| 15 | [Reading Complex Expressions](#-reading-complex-expressions) | Parsing guide |
| 16 | [Common Abbreviations](#-common-abbreviations) | iff, WLOG, QED, s.t., etc. |
| 17 | [Quick Lookup Tables](#-quick-lookup-tables) | Greek alphabet, operator precedence |
| 18 | [Pro Tips](#-pro-tips) | Context, ambiguity, disambiguation |
| 19 | [Symbol Index](#-symbol-index) | All symbols A–Z |

---

## 🎯 SET THEORY SYMBOLS

### Basic Set Operations

| Symbol | Name | Meaning | Example | Read As |
|--------|------|---------|---------|---------|
| `∅` or `{}` | Empty set | Set with no elements | `∅ = {}` | "the empty set" |
| `∈` | Element of | x belongs to set A | `3 ∈ {1,2,3}` | "3 is in" |
| `∉` | Not in | x not in set A | `4 ∉ {1,2,3}` | "4 is not in" |
| `⊆` | Subset | A contained in B (possibly equal) | `{1,2} ⊆ {1,2,3}` | "subset of" |
| `⊂` | Proper subset | A ⊂ B and A ≠ B | `{1,2} ⊂ {1,2,3}` | "proper subset of" |
| `⊇` | Superset | A contains B | `{1,2,3} ⊇ {1,2}` | "superset of" |
| `⊃` | Proper superset | A ⊃ B and A ≠ B | `{1,2,3} ⊃ {1,2}` | "proper superset of" |
| `∪` | Union | Elements in A or B | `{1,2} ∪ {2,3} = {1,2,3}` | "union" |
| `∩` | Intersection | Elements in A and B | `{1,2} ∩ {2,3} = {2}` | "intersect" |
| `\` or `−` | Set difference | In A but not B | `{1,2,3} \ {2} = {1,3}` | "minus" |
| `⊕` | Symmetric diff | In A or B but not both | `{1,2} ⊕ {2,3} = {1,3}` | "XOR" |
| `×` | Cartesian product | All ordered pairs | `{1,2} × {a,b}` | "cross" |
| `𝒫(A)` or `2^A` | Power set | All subsets of A | `𝒫({1,2})` | "power set of A" |
| `\|A\|` or `#A` | Cardinality | Number of elements | `\|{1,2,3}\| = 3` | "size of A" |
| `Ā` or `A^c` or `A'` | Complement | Not in A (relative to U) | `Ā = U \ A` | "A complement" |

### Set Builder Notation

```
{x | P(x)}     or     {x : P(x)}
```
**Read**: "The set of all x such that P(x) is true"

**Examples**:
- `{x | x ∈ ℕ ∧ x < 5} = {0,1,2,3,4}`
- `{x² | x ∈ {1,2,3}} = {1,4,9}`
- `{n | n ≡ 0 (mod 2)} = ` {even numbers}

[↑ Back to top](#-table-of-contents)

---

## 🧮 LOGIC SYMBOLS

### Propositional Logic

| Symbol | Name | Meaning | Truth | Read As |
|--------|------|---------|-------|---------|
| `∧` | AND / Conjunction | Both must be true | `T∧T=T`, else F | "and" |
| `∨` | OR / Disjunction | At least one true | `F∨F=F`, else T | "or" |
| `¬` or `~` or `!` | NOT / Negation | Opposite value | `¬T=F`, `¬F=T` | "not" |
| `⊕` | XOR / Exclusive OR | Exactly one true | `T⊕F=T`, `T⊕T=F` | "XOR" |
| `→` or `⇒` | Implication | If...then | `T→F=F`, else T | "implies" |
| `↔` or `⇔` | Biconditional | If and only if (iff) | `T↔T=T`, `T↔F=F` | "iff" |
| `⊤` | Tautology | Always true | Top | "true" |
| `⊥` | Contradiction | Always false | Bottom | "false" |

### Predicate Logic (Quantifiers)

| Symbol | Name | Meaning | Example | Read As |
|--------|------|---------|---------|---------|
| `∀` | Universal quantifier | For all / every | `∀x ∈ ℕ, x ≥ 0` | "for all x" |
| `∃` | Existential quantifier | There exists / some | `∃x ∈ ℕ, x > 100` | "there exists x" |
| `∃!` | Unique existence | Exists exactly one | `∃!x, x² = 4 ∧ x > 0` | "exists unique x" |
| `∄` | Does not exist | No such element | `∄x ∈ ℕ, x < 0` | "does not exist" |

### Logical Relations

| Symbol | Name | Meaning | Context |
|--------|------|---------|---------|
| `⊢` | Proves / Entails | Syntactic consequence | `A ∧ B ⊢ A` |
| `⊨` | Models / Satisfies | Semantic entailment | `𝓜 ⊨ φ` |
| `≡` | Logically equivalent | Same truth value | `¬(A∧B) ≡ ¬A∨¬B` |

[↑ Back to top](#-table-of-contents)

---

## 📊 RELATION SYMBOLS

### Ordering Relations

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `<` | Less than | Strictly smaller | `2 < 3` |
| `>` | Greater than | Strictly larger | `5 > 3` |
| `≤` or `⩽` | Less than or equal | At most | `2 ≤ 3`, `3 ≤ 3` |
| `≥` or `⩾` | Greater than or equal | At least | `3 ≥ 2` |
| `≪` | Much less than | Asymptotically smaller | `log n ≪ n` |
| `≫` | Much greater than | Asymptotically larger | `2ⁿ ≫ n²` |

### Equality & Equivalence

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `=` | Equals | Identical value | `2 + 2 = 4` |
| `≠` | Not equal | Different values | `2 ≠ 3` |
| `≡` | Equivalent to | Defined as / identical | `a ≡ b (mod n)` |
| `≈` | Approximately | Close to | `π ≈ 3.14` |
| `~` | Similar / Equivalent | Equivalence relation | `a ~ b` |
| `:=` or `≔` | Defined as | Assignment / definition | `f(x) := x²` |
| `∝` | Proportional to | Scales linearly | `A ∝ r²` |

### Divisibility

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `\|` or `∣` | Divides | a divides b evenly | `3 \| 15` |
| `∤` | Does not divide | Remainder exists | `3 ∤ 16` |

[↑ Back to top](#-table-of-contents)

---

## 🔢 NUMBER SETS

### Standard Number Systems

| Symbol | Name | Contains | Notation |
|--------|------|----------|----------|
| `ℕ` | Natural numbers | Non-negative integers | `{0, 1, 2, 3, ...}` |
| `ℕ⁺` or `ℤ⁺` | Positive integers | Counting numbers | `{1, 2, 3, ...}` |
| `ℤ` | Integers | Whole numbers | `{..., -2, -1, 0, 1, 2, ...}` |
| `ℤ⁻` | Negative integers | Below zero | `{..., -3, -2, -1}` |
| `ℚ` | Rationals | Fractions | `{p/q \| p,q ∈ ℤ, q ≠ 0}` |
| `ℝ` | Real numbers | All decimals | Continuous number line |
| `ℝ⁺` | Positive reals | Above zero | `{x ∈ ℝ \| x > 0}` |
| `ℂ` | Complex numbers | Real + imaginary | `{a + bi \| a,b ∈ ℝ}` |
| `i` or `j` | Imaginary unit | √(-1) | `i² = -1` |

[↑ Back to top](#-table-of-contents)

---

## 📐 FUNCTIONS & MAPPINGS

### Function Notation

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `f: A → B` | Function from A to B | Maps A to B | `f: ℝ → ℝ` |
| `f(x)` | Function application | Evaluate f at x | `f(2) = 5` |
| `f ∘ g` | Composition | Apply g then f | `(f∘g)(x) = f(g(x))` |
| `f⁻¹` | Inverse function | Reverses f | `f⁻¹(5) = 2` if `f(2)=5` |
| `dom(f)` | Domain | Valid inputs | Set A |
| `ran(f)` or `im(f)` | Range / Image | Possible outputs | Subset of B |
| `f\|_S` | Restriction | f limited to subset S | Smaller domain |

### Sequences & Series

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `aₙ` | nth term | Element at position n | `a₅` |
| `{aₙ}` | Sequence | Ordered list | `{1, 2, 4, 8, ...}` |
| `⟨a,b⟩` or `(a,b)` | Ordered pair | Position matters | `⟨1,2⟩ ≠ ⟨2,1⟩` |
| `Σ` | Summation | Sum over range | `Σᵢ₌₁ⁿ i = n(n+1)/2` |
| `Π` | Product | Multiply over range | `Πᵢ₌₁ⁿ i = n!` |
| `lim` | Limit | Approaches value | `lim(x→∞) 1/x = 0` |

[↑ Back to top](#-table-of-contents)

---

## 🔤 STRING & LANGUAGE SYMBOLS

### Alphabet & Strings

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `Σ` | Alphabet | Finite set of symbols | `Σ = {0,1}` or `{a,b,c}` |
| `w` or `s` | String | Sequence of symbols | `w = 0110` |
| `ε` or `λ` or `ϵ` | Empty string | Zero-length string | `\|ε\| = 0` |
| `\|w\|` | Length | Number of symbols | `\|0110\| = 4` |
| `wʳ` or `w^R` | Reverse | String backwards | `(abc)ʳ = cba` |
| `xy` or `x·y` | Concatenation | x followed by y | `01 · 10 = 0110` |
| `wⁿ` | Repetition | w repeated n times | `0³ = 000` |
| `w[i]` | Character at i | ith symbol (0-indexed) | `0110[2] = 1` |

### Languages

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `L` | Language | Set of strings | `L = {0ⁿ1ⁿ \| n ≥ 0}` |
| `Σ*` | Kleene star | All strings over Σ | `{0,1}* = {ε,0,1,00,01,...}` |
| `Σ⁺` | Positive closure | Non-empty strings | `Σ⁺ = Σ* \ {ε}` |
| `L₁L₂` | Concatenation | All xy where x∈L₁, y∈L₂ | Language product |
| `L*` | Kleene closure | All concatenations of L | `{0,1}*` |
| `L⁺` | Positive closure | L* without ε | `L⁺ = LL*` |
| `L^R` | Reversal | All reversed strings | `{w^R \| w ∈ L}` |
| `L̄` or `L^c` | Complement | Σ* \ L | Not in L |

[↑ Back to top](#-table-of-contents)

---

## 🤖 AUTOMATA THEORY SYMBOLS

### Automata Components

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `Q` | States | Finite set of states | `Q = {q₀, q₁, q₂}` |
| `q₀` | Initial state | Starting state | Marked with → |
| `F` | Final states | Accepting states | `F ⊆ Q` |
| `δ` | Transition function | State change rule | `δ(q,a) = q'` |
| `Γ` | Stack alphabet | PDA stack symbols | `Γ = {Z₀, A, B}` |
| `Z₀` | Initial stack | Bottom of stack | Starting symbol |

### Automata Types

| Notation | Name | Meaning |
|----------|------|---------|
| `DFA` | Deterministic Finite Automaton | One next state per input |
| `NFA` | Nondeterministic FA | Multiple possible next states |
| `ε-NFA` | Epsilon-NFA | Has ε-transitions |
| `PDA` | Pushdown Automaton | FA + stack |
| `TM` | Turing Machine | Unlimited tape |
| `LBA` | Linear Bounded Automaton | Limited tape |

### Configuration Notation

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `⊢` | Yields in one step | Single transition | `q₀w ⊢ q₁w'` |
| `⊢*` | Yields in zero or more | Multi-step | `q₀w ⊢* qf` |
| `├` | Turnstile | Derives (CFG) | `S ├ aSb` |
| `⇒` | Derives | Grammar derivation | `S ⇒ AB ⇒ aaB` |
| `⇒*` | Derives (multi-step) | Zero or more steps | `S ⇒* w` |

[↑ Back to top](#-table-of-contents)

---

## ⚡ COMPLEXITY THEORY SYMBOLS

### Asymptotic Notation (Big-O Family)

| Symbol | Name | Meaning | Intuition |
|--------|------|---------|-----------|
| `O(f)` | Big-O | Upper bound | "At most" |
| `Ω(f)` | Big-Omega | Lower bound | "At least" |
| `Θ(f)` | Big-Theta | Tight bound | "Exactly" (both O and Ω) |
| `o(f)` | Little-o | Strict upper bound | "Strictly less than" |
| `ω(f)` | Little-omega | Strict lower bound | "Strictly more than" |
| `~` | Asymptotically equal | Same growth rate | `f ~ g` |

### Complexity Classes

| Symbol | Name | Meaning |
|--------|------|---------|
| `P` | Polynomial time | Solvable in O(nᵏ) |
| `NP` | Nondeterministic polynomial | Verifiable in O(nᵏ) |
| `coNP` | Complement of NP | Complement in NP |
| `PSPACE` | Polynomial space | Uses O(nᵏ) space |
| `EXPTIME` | Exponential time | O(2^(nᵏ)) time |
| `L` | Logarithmic space | O(log n) space |
| `NL` | Nondeterministic log-space | ND O(log n) space |
| `BPP` | Bounded-error probabilistic | Randomized poly-time |

### Reduction Notation

| Symbol | Name | Meaning |
|--------|------|---------|
| `A ≤_m B` | Mapping reducible | Computable function reduces A to B |
| `A ≤_p B` | Polynomial-time reducible | Poly-time function reduces A to B |
| `A ≤_L B` | Log-space reducible | Log-space reduces A to B |
| `A ≤_T B` | Turing reducible | Oracle reduction |

[↑ Back to top](#-table-of-contents)

---

## 📈 GRAPH THEORY SYMBOLS

### Graph Components

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `G = (V,E)` | Graph | Vertices and edges | `V = {1,2,3}`, `E = {(1,2),(2,3)}` |
| `V` or `V(G)` | Vertex set | Nodes | `V = {a,b,c}` |
| `E` or `E(G)` | Edge set | Connections | `E = {ab, bc}` |
| `n` or `\|V\|` | Order | Number of vertices | `n = 5` |
| `m` or `\|E\|` | Size | Number of edges | `m = 7` |
| `u ∼ v` or `uv` | Adjacent | Edge between u and v | Neighbors |
| `deg(v)` | Degree | Number of edges at v | `deg(v) = 3` |
| `δ(G)` | Minimum degree | Smallest vertex degree | Min connections |
| `Δ(G)` | Maximum degree | Largest vertex degree | Max connections |

### Special Graphs

| Symbol | Name | Meaning |
|--------|------|---------|
| `Kₙ` | Complete graph | All vertices connected |
| `Kₘ,ₙ` | Complete bipartite | Two sets, fully connected between |
| `Cₙ` | Cycle graph | n vertices in a cycle |
| `Pₙ` | Path graph | n vertices in a path |
| `Qₙ` | Hypercube | n-dimensional cube graph |

### Path & Distance

| Symbol | Name | Meaning |
|--------|------|---------|
| `u → v` | Directed edge | Edge from u to v |
| `u ↔ v` | Path | u connected to v |
| `d(u,v)` | Distance | Shortest path length |
| `diam(G)` | Diameter | Maximum distance |
| `girth(G)` | Girth | Shortest cycle length |

[↑ Back to top](#-table-of-contents)

---

## 🔢 COMBINATORICS & COUNTING

### Counting Functions

| Symbol | Name | Meaning | Formula |
|--------|------|---------|---------|
| `n!` | Factorial | n × (n-1) × ... × 1 | `5! = 120` |
| `P(n,k)` | Permutations | Ordered selections | `n!/(n-k)!` |
| `C(n,k)` or `(n k)` | Combinations | Unordered selections | `n!/(k!(n-k)!)` |
| `⌊x⌋` | Floor | Largest integer ≤ x | `⌊3.7⌋ = 3` |
| `⌈x⌉` | Ceiling | Smallest integer ≥ x | `⌈3.2⌉ = 4` |

### Common Sequences

| Symbol | Name | Definition |
|--------|------|------------|
| `Fₙ` | Fibonacci | `F₀=0, F₁=1, Fₙ=Fₙ₋₁+Fₙ₋₂` |
| `Cₙ` | Catalan | `(2n n)/(n+1)` |
| `Bₙ` | Bell numbers | Number of partitions of n elements |

[↑ Back to top](#-table-of-contents)

---

## 📐 LINEAR ALGEBRA SYMBOLS

### Vectors

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `𝐯` or `v⃗` or **v** | Vector | Column vector | `[1, 2, 3]ᵀ` |
| `v_i` or `vᵢ` | ith component | Element at position i | `v₂ = 5` |
| `‖𝐯‖` | Norm / Length | Magnitude | `‖𝐯‖ = √(v₁² + v₂² + ...)` |
| `‖𝐯‖₁` | L¹ norm | Manhattan distance | `\|v₁\| + \|v₂\| + ...` |
| `‖𝐯‖₂` | L² norm | Euclidean distance | `√(v₁² + v₂² + ...)` |
| `‖𝐯‖_∞` | L∞ norm | Maximum absolute value | `max(\|vᵢ\|)` |
| `𝐮 · 𝐯` or `⟨𝐮,𝐯⟩` | Dot product | Inner product | `u₁v₁ + u₂v₂ + ...` |
| `𝐮 × 𝐯` | Cross product | Perpendicular vector (3D) | Returns vector |
| `𝐮 ⊗ 𝐯` | Tensor product | Outer product | Matrix |

### Matrices

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `A` or `𝐀` | Matrix | 2D array | `[aᵢⱼ]` |
| `aᵢⱼ` or `A[i,j]` | Entry | Element at row i, col j | `a₂₃` |
| `Aᵀ` or `A^T` | Transpose | Rows ↔ columns | `(Aᵀ)ᵢⱼ = Aⱼᵢ` |
| `A⁻¹` | Inverse | AA⁻¹ = I | Only if det(A) ≠ 0 |
| `A*` or `A^H` | Conjugate transpose | Hermitian transpose | `(A*)ᵢⱼ = (Āⱼᵢ)` |
| `det(A)` or `\|A\|` | Determinant | Scalar value | Volume scaling |
| `tr(A)` | Trace | Sum of diagonal | `Σaᵢᵢ` |
| `rank(A)` | Rank | Dimension of column space | Number of pivots |
| `null(A)` | Null space | Ker(A) = {𝐯 \| A𝐯=𝟎} | Solution space |

### Special Matrices

| Symbol | Name | Properties |
|--------|------|------------|
| `I` or `Iₙ` | Identity matrix | `Iᵢⱼ = 1 if i=j, else 0` |
| `O` or `𝟎` | Zero matrix | All entries 0 |
| `diag(d₁,...,dₙ)` | Diagonal matrix | Non-zero only on diagonal |

### Matrix Properties

| Symbol | Name | Definition |
|--------|------|------------|
| `A = Aᵀ` | Symmetric | Equal to transpose |
| `A = -Aᵀ` | Skew-symmetric | Negative of transpose |
| `AAᵀ = I` | Orthogonal | Preserves lengths |
| `A = A*` | Hermitian | Self-conjugate |

### Vector Spaces

| Symbol | Name | Meaning |
|--------|------|---------|
| `ℝⁿ` | n-dimensional reals | Vectors of n real numbers |
| `ℂⁿ` | n-dimensional complex | Vectors of n complex numbers |
| `span(𝐯₁,...,𝐯ₖ)` | Span | All linear combinations |
| `dim(V)` | Dimension | Number of basis vectors |
| `𝐯 ⊥ 𝐮` | Orthogonal | 𝐯 · 𝐮 = 0 |

### Eigenvalues & Eigenvectors

| Symbol | Name | Meaning | Equation |
|--------|------|---------|----------|
| `λ` | Eigenvalue | Scaling factor | `A𝐯 = λ𝐯` |
| `𝐯` | Eigenvector | Direction preserved | `A𝐯 = λ𝐯` |
| `spec(A)` | Spectrum | Set of all eigenvalues | `{λ₁, λ₂, ...}` |

[↑ Back to top](#-table-of-contents)

---

## 🔐 NUMBER THEORY & MODULAR ARITHMETIC

### Modular Arithmetic

| Symbol | Name | Meaning | Example |
|--------|------|---------|---------|
| `a ≡ b (mod n)` | Congruent modulo n | Same remainder when ÷ n | `7 ≡ 2 (mod 5)` |
| `a mod n` | Modulo | Remainder of a ÷ n | `7 mod 5 = 2` |
| `ℤₙ` or `ℤ/nℤ` | Integers mod n | `{0, 1, 2, ..., n-1}` | `ℤ₅ = {0,1,2,3,4}` |
| `gcd(a,b)` | Greatest common divisor | Largest common factor | `gcd(12,8) = 4` |
| `lcm(a,b)` | Least common multiple | Smallest common multiple | `lcm(4,6) = 12` |
| `φ(n)` | Euler's totient | Count of coprime integers | `φ(6) = 2` |

[↑ Back to top](#-table-of-contents)

---

## 🎯 SPECIAL SYMBOLS & OPERATORS

### Calculus & Analysis

| Symbol | Name | Meaning |
|--------|------|---------|
| `∞` | Infinity | Unbounded |
| `→` | Approaches | Limit notation |
| `d/dx` | Derivative | Rate of change |
| `∫` | Integral | Area under curve |
| `∂` | Partial derivative | Multi-variable derivative |
| `∇` | Nabla / Gradient | Vector of partials |

### Probability

| Symbol | Name | Meaning |
|--------|------|---------|
| `P(A)` | Probability of A | Likelihood |
| `A \| B` | Conditional | A given B |
| `E[X]` | Expected value | Average outcome |
| `Var(X)` | Variance | Spread |
| `~` | Distributed as | `X ~ N(μ,σ²)` |

### Miscellaneous

| Symbol | Name | Meaning |
|--------|------|---------|
| `∴` | Therefore | Conclusion follows |
| `∵` | Because | Reason |
| `□` or `∎` | Q.E.D. | End of proof |
| `□` | Necessary | Modal logic |
| `◊` | Possible | Modal logic |
| `※` | Reference mark | See note |

[↑ Back to top](#-table-of-contents)

---

## 🎨 TYPOGRAPHY CONVENTIONS

### Common Styling

| Style | Used For | Example |
|-------|----------|---------|
| **Bold** | Vectors, matrices | **v**, **A** |
| *Italic* | Variables, scalars | *n*, *x*, *f* |
| `Monospace` | Code, algorithms | `while`, `return` |
| CAPITALS | Sets, classes | REGULAR, NP-COMPLETE |
| Script | Languages, families | 𝓛, 𝓕 |
| Blackboard | Number sets | ℕ, ℤ, ℚ, ℝ, ℂ |
| Greek | Parameters, angles | α, β, θ, λ, σ |

[↑ Back to top](#-table-of-contents)

---

## 💡 READING COMPLEX EXPRESSIONS

### How to Parse Symbols

**Example 1**: `∀ε > 0, ∃N ∈ ℕ, ∀n > N: |aₙ - L| < ε`

**Read**: "For all epsilon greater than zero, there exists N in the natural numbers such that for all n greater than N, the absolute value of a_n minus L is less than epsilon"

**Example 2**: `L = {w ∈ Σ* | |w|_a = |w|_b}`

**Read**: "L is the set of all strings w in Sigma star such that the number of a's equals the number of b's"

**Example 3**: `A ≤_p B ⟹ (B ∈ P ⟹ A ∈ P)`

**Read**: "If A is polynomial-time reducible to B, then if B is in P, then A is in P"

[↑ Back to top](#-table-of-contents)

---

## 🔑 COMMON ABBREVIATIONS

| Abbrev | Full Name |
|--------|-----------|
| **iff** | if and only if (↔) |
| **WLOG** | without loss of generality |
| **QED** | quod erat demonstrandum (thus proven) |
| **s.t.** | such that |
| **w.r.t.** | with respect to |
| **i.e.** | id est (that is) |
| **e.g.** | exempli gratia (for example) |
| **etc.** | et cetera (and so on) |
| **resp.** | respectively |

[↑ Back to top](#-table-of-contents)

---

## 🎯 QUICK LOOKUP TABLES

### Greek Alphabet (Common in Math)

| Lower | Upper | Name | Common Use |
|-------|-------|------|------------|
| α | Α | alpha | angles, constants |
| β | Β | beta | angles, coefficients |
| γ | Γ | gamma | angles, Gamma function |
| δ | Δ | delta | change, small value |
| ε, ϵ | Ε | epsilon | small positive, empty string |
| θ | Θ | theta | angles, Big-Theta |
| λ | Λ | lambda | eigenvalue, empty string |
| μ | Μ | mu | mean, measure |
| π | Π | pi | 3.14159..., product |
| σ | Σ | sigma | standard deviation, sum |
| φ, ϕ | Φ | phi | golden ratio, Euler's totient |
| ω | Ω | omega | angular velocity, Big-Omega |

### Precedence (High to Low)

1. Parentheses: `()`, `[]`, `{}`
2. Exponents: `^`, superscripts
3. Functions: `f(x)`, `sin(x)`
4. Negation: `¬`, `-`
5. Multiplication: `×`, `·`, adjacency
6. Division: `/`, `÷`
7. Addition, Subtraction: `+`, `-`
8. Comparisons: `<`, `>`, `≤`, `≥`
9. Set operations: `∩`, `∪`, `\`
10. Logical AND: `∧`
11. Logical OR: `∨`
12. Implication: `→`, `⇒`
13. Quantifiers: `∀`, `∃`

[↑ Back to top](#-table-of-contents)

---

## 🎓 PRO TIPS

### Context Matters!
- `|x|` could mean: absolute value, cardinality, length, determinant
- `f'` could mean: derivative or complement
- `*` could mean: Kleene star, convolution, or multiplication
- `()` could mean: grouping, ordered pair, or open interval

### When in Doubt:
1. **Check the domain** - what field of math?
2. **Read nearby text** - definitions matter
3. **Look at types** - sets? numbers? strings?
4. **Context clues** - what makes sense here?

[↑ Back to top](#-table-of-contents)

---

## 🗂 SYMBOL INDEX

> All symbols listed alphabetically by **name**. Click any section link to jump there.

| Symbol | Name | Section |
|--------|------|---------|
| `𝐮 · 𝐯` | AND (conjunction) | [Logic](#-logic-symbols) |
| `∧` | AND (conjunction) | [Logic](#-logic-symbols) |
| `≈` | Approximately equal | [Relations](#-relation-symbols) |
| `Ā` / `A^c` | Complement (set) | [Set Theory](#-set-theory-symbols) |
| `L̄` / `L^c` | Complement (language) | [Strings & Languages](#-string--language-symbols) |
| `ℂ` | Complex numbers | [Number Sets](#-number-sets) |
| `ℂⁿ` | Complex vector space | [Linear Algebra](#-linear-algebra-symbols) |
| `≡` | Congruent modulo n | [Number Theory](#-number-theory--modular-arithmetic) |
| `∩` | Intersection | [Set Theory](#-set-theory-symbols) |
| `↔` / `⇔` | Biconditional (iff) | [Logic](#-logic-symbols) |
| `∵` | Because | [Special Symbols](#-special-symbols--operators) |
| `⊥` | Contradiction / Bottom | [Logic](#-logic-symbols) |
| `×` | Cartesian product | [Set Theory](#-set-theory-symbols) |
| `⌈x⌉` | Ceiling | [Combinatorics](#-combinatorics--counting) |
| `C(n,k)` | Combinations | [Combinatorics](#-combinatorics--counting) |
| `f ∘ g` | Composition | [Functions & Mappings](#-functions--mappings) |
| `xy` / `x·y` | Concatenation (strings) | [Strings & Languages](#-string--language-symbols) |
| `L₁L₂` | Concatenation (languages) | [Strings & Languages](#-string--language-symbols) |
| `⊕` | Symmetric difference / XOR | [Set Theory](#-set-theory-symbols), [Logic](#-logic-symbols) |
| `d/dx` | Derivative | [Special Symbols](#-special-symbols--operators) |
| `det(A)` | Determinant | [Linear Algebra](#-linear-algebra-symbols) |
| `δ` | Transition function / Delta | [Automata](#-automata-theory-symbols) |
| `dim(V)` | Dimension | [Linear Algebra](#-linear-algebra-symbols) |
| `∣` | Divides | [Relations](#-relation-symbols) |
| `dom(f)` | Domain | [Functions & Mappings](#-functions--mappings) |
| `𝐮 · 𝐯` | Dot product | [Linear Algebra](#-linear-algebra-symbols) |
| `∅` | Empty set | [Set Theory](#-set-theory-symbols) |
| `ε` / `λ` | Empty string | [Strings & Languages](#-string--language-symbols) |
| `∈` | Element of | [Set Theory](#-set-theory-symbols) |
| `λ` | Eigenvalue | [Linear Algebra](#-linear-algebra-symbols) |
| `spec(A)` | Eigenvalue spectrum | [Linear Algebra](#-linear-algebra-symbols) |
| `E[X]` | Expected value | [Special Symbols](#-special-symbols--operators) |
| `∃` | Existential quantifier | [Logic](#-logic-symbols) |
| `∃!` | Exists unique | [Logic](#-logic-symbols) |
| `n!` | Factorial | [Combinatorics](#-combinatorics--counting) |
| `F` | Final states | [Automata](#-automata-theory-symbols) |
| `⌊x⌋` | Floor | [Combinatorics](#-combinatorics--counting) |
| `∀` | For all (universal) | [Logic](#-logic-symbols) |
| `f: A → B` | Function notation | [Functions & Mappings](#-functions--mappings) |
| `Γ` | Gamma / Stack alphabet | [Automata](#-automata-theory-symbols) |
| `gcd(a,b)` | Greatest common divisor | [Number Theory](#-number-theory--modular-arithmetic) |
| `∇` | Gradient / Nabla | [Special Symbols](#-special-symbols--operators) |
| `G = (V,E)` | Graph | [Graph Theory](#-graph-theory-symbols) |
| `>` | Greater than | [Relations](#-relation-symbols) |
| `≥` | Greater than or equal | [Relations](#-relation-symbols) |
| `≫` | Much greater than | [Relations](#-relation-symbols) |
| `A^H` / `A*` | Hermitian (conjugate transpose) | [Linear Algebra](#-linear-algebra-symbols) |
| `i` | Imaginary unit | [Number Sets](#-number-sets) |
| `→` / `⇒` | Implication | [Logic](#-logic-symbols) |
| `q₀` | Initial state | [Automata](#-automata-theory-symbols) |
| `∫` | Integral | [Special Symbols](#-special-symbols--operators) |
| `∩` | Intersection | [Set Theory](#-set-theory-symbols) |
| `ℤ` | Integers | [Number Sets](#-number-sets) |
| `A⁻¹` | Inverse (matrix) | [Linear Algebra](#-linear-algebra-symbols) |
| `f⁻¹` | Inverse (function) | [Functions & Mappings](#-functions--mappings) |
| `L` | Language | [Strings & Languages](#-string--language-symbols) |
| `lcm(a,b)` | Least common multiple | [Number Theory](#-number-theory--modular-arithmetic) |
| `<` | Less than | [Relations](#-relation-symbols) |
| `≤` | Less than or equal | [Relations](#-relation-symbols) |
| `≪` | Much less than | [Relations](#-relation-symbols) |
| `lim` | Limit | [Functions & Mappings](#-functions--mappings) |
| `≡` | Logically equivalent | [Logic](#-logic-symbols) |
| `A ≤_L B` | Log-space reduction | [Complexity](#-complexity-theory-symbols) |
| `A ≤_m B` | Mapping reduction | [Complexity](#-complexity-theory-symbols) |
| `⊨` | Models / Satisfies | [Logic](#-logic-symbols) |
| `a mod n` | Modulo | [Number Theory](#-number-theory--modular-arithmetic) |
| `ℕ` | Natural numbers | [Number Sets](#-number-sets) |
| `¬` | NOT / Negation | [Logic](#-logic-symbols) |
| `≠` | Not equal | [Relations](#-relation-symbols) |
| `∉` | Not element of | [Set Theory](#-set-theory-symbols) |
| `∄` | Does not exist | [Logic](#-logic-symbols) |
| `∤` | Does not divide | [Relations](#-relation-symbols) |
| `‖𝐯‖` | Norm / Length | [Linear Algebra](#-linear-algebra-symbols) |
| `null(A)` | Null space | [Linear Algebra](#-linear-algebra-symbols) |
| `O(f)` | Big-O (upper bound) | [Complexity](#-complexity-theory-symbols) |
| `o(f)` | Little-o (strict upper) | [Complexity](#-complexity-theory-symbols) |
| `Ω(f)` | Big-Omega (lower bound) | [Complexity](#-complexity-theory-symbols) |
| `ω(f)` | Little-omega (strict lower) | [Complexity](#-complexity-theory-symbols) |
| `⟨a,b⟩` | Ordered pair | [Functions & Mappings](#-functions--mappings) |
| `𝐯 ⊥ 𝐮` | Orthogonal | [Linear Algebra](#-linear-algebra-symbols) |
| `∂` | Partial derivative | [Special Symbols](#-special-symbols--operators) |
| `P(n,k)` | Permutations | [Combinatorics](#-combinatorics--counting) |
| `φ(n)` | Euler's totient (Phi) | [Number Theory](#-number-theory--modular-arithmetic) |
| `A ≤_p B` | Poly-time reduction | [Complexity](#-complexity-theory-symbols) |
| `𝒫(A)` | Power set | [Set Theory](#-set-theory-symbols) |
| `Π` | Product (over range) | [Functions & Mappings](#-functions--mappings) |
| `∝` | Proportional to | [Relations](#-relation-symbols) |
| `⊢` | Proves / Entails / Yields | [Logic](#-logic-symbols), [Automata](#-automata-theory-symbols) |
| `⊢*` | Yields (multi-step) | [Automata](#-automata-theory-symbols) |
| `□` / `∎` | Q.E.D. | [Special Symbols](#-special-symbols--operators) |
| `Q` | States (set) | [Automata](#-automata-theory-symbols) |
| `ℚ` | Rationals | [Number Sets](#-number-sets) |
| `rank(A)` | Rank | [Linear Algebra](#-linear-algebra-symbols) |
| `ran(f)` | Range / Image | [Functions & Mappings](#-functions--mappings) |
| `ℝ` | Real numbers | [Number Sets](#-number-sets) |
| `ℝⁿ` | Real vector space | [Linear Algebra](#-linear-algebra-symbols) |
| `wʳ` | Reverse (string) | [Strings & Languages](#-string--language-symbols) |
| `L^R` | Reversal (language) | [Strings & Languages](#-string--language-symbols) |
| `{aₙ}` | Sequence | [Functions & Mappings](#-functions--mappings) |
| `\` | Set difference | [Set Theory](#-set-theory-symbols) |
| `Σ` | Alphabet / Summation | [Strings & Languages](#-string--language-symbols), [Functions](#-functions--mappings) |
| `Σ*` | Kleene star | [Strings & Languages](#-string--language-symbols) |
| `Σ⁺` | Positive closure | [Strings & Languages](#-string--language-symbols) |
| `span(...)` | Span | [Linear Algebra](#-linear-algebra-symbols) |
| `⊆` | Subset | [Set Theory](#-set-theory-symbols) |
| `⊂` | Proper subset | [Set Theory](#-set-theory-symbols) |
| `⊇` | Superset | [Set Theory](#-set-theory-symbols) |
| `⊃` | Proper superset | [Set Theory](#-set-theory-symbols) |
| `~` | Similar / Asymptotically equal | [Relations](#-relation-symbols), [Complexity](#-complexity-theory-symbols) |
| `⊤` | Tautology / Top | [Logic](#-logic-symbols) |
| `Θ(f)` | Big-Theta (tight bound) | [Complexity](#-complexity-theory-symbols) |
| `∴` | Therefore | [Special Symbols](#-special-symbols--operators) |
| `tr(A)` | Trace | [Linear Algebra](#-linear-algebra-symbols) |
| `Aᵀ` | Transpose | [Linear Algebra](#-linear-algebra-symbols) |
| `A ≤_T B` | Turing reduction | [Complexity](#-complexity-theory-symbols) |
| `∪` | Union | [Set Theory](#-set-theory-symbols) |
| `∨` | OR (disjunction) | [Logic](#-logic-symbols) |
| `Var(X)` | Variance | [Special Symbols](#-special-symbols--operators) |
| `⊗` | Tensor / outer product | [Linear Algebra](#-linear-algebra-symbols) |
| `⇒` | Derives (grammar) | [Automata](#-automata-theory-symbols) |
| `⇒*` | Derives multi-step | [Automata](#-automata-theory-symbols) |
| `ℤₙ` | Integers mod n | [Number Theory](#-number-theory--modular-arithmetic) |

[↑ Back to top](#-table-of-contents)

---

**🚀 Quick Reference Complete!**

*Bookmark this for your theory exams and problem sets* 📚

---

**Last Updated**: 2026 | For CS Theory Students Everywhere 💻