# 🤖 Theory of Computation: Automata, Languages & Computability
## Complete Guide to Formal Proofs in Automata Theory and Computability

> Master formal languages, automata, decidability, and the limits of computation

---

## 📋 TABLE OF CONTENTS

### Part I: General Proof Techniques

#### 🎯 [Foundational Proof Methods](#part-i-general-proof-techniques)
- [Set Theory & Cardinality](#set-theory-and-cardinality)
- [Diagonalization Arguments](#diagonalization-method)
- [Closure Properties](#closure-properties)
- [Proof by Construction](#proof-by-construction)
- [Proof by Contradiction](#proof-by-contradiction-automata)

#### 🔤 [Regular Languages](#regular-languages-proofs)
- [DFA Correctness Proofs](#dfa-correctness-proofs)
- [NFA to DFA Conversion](#nfa-to-dfa-subset-construction)
- [Regular Expression Equivalence](#regex-equivalence-proof)
- [GNFA - DFA to Regex Conversion](#gnfa-conversion)
- [Pumping Lemma for Regular Languages](#pumping-lemma-regular)
- [Myhill-Nerode Theorem](#myhill-nerode-theorem)

#### 📚 [Context-Free Languages](#context-free-languages)
- [CFG Derivation Proofs](#cfg-correctness-proofs)
- [Pushdown Automata](#pda-proofs)
- [Pumping Lemma for CFLs](#pumping-lemma-cfl)
- [Chomsky Normal Form](#chomsky-normal-form)
- [CYK Algorithm](#cyk-parsing-algorithm)

#### 🔢 [Turing Machines & Computability](#turing-machines)
- [TM Configuration Proofs](#tm-correctness-proofs)
- [Church-Turing Thesis](#church-turing-thesis)
- [Universal Turing Machine](#universal-turing-machine)
- [Halting Problem](#halting-problem-proof)
- [Rice's Theorem](#rices-theorem)

#### ♾️ [Decidability & Undecidability](#decidability)
- [Decidable Languages](#decidable-languages)
- [Undecidable Problems](#undecidable-problems)
- [Reduction Proofs](#reduction-technique)
- [Post Correspondence Problem](#post-correspondence-problem)

#### 🎓 [Complexity Theory](#complexity-classes)
- [P and NP](#p-and-np)
- [NP-Completeness Proofs](#np-completeness)
- [Cook-Levin Theorem](#cook-levin-theorem)
- [Space Complexity](#space-complexity)

---

### Part II: Mathematical Induction Proofs

#### 🔄 [Structural Induction](#part-ii-induction-proofs)
- [Induction on String Length](#induction-on-strings)
- [Induction on Derivation Trees](#induction-on-parse-trees)
- [Induction on Computation Steps](#induction-on-tm-steps)

#### 🌲 [Tree-Based Induction](#tree-induction)
- [Parse Tree Induction](#parse-tree-induction)
- [Syntax Tree Proofs](#syntax-tree-proofs)

#### 🔁 [Recursive Definition Proofs](#recursive-proofs)
- [Regular Expression Induction](#regex-induction)
- [Grammar Induction](#grammar-induction)

---

### 📊 [Practice Problems](#practice-problems)
- 30 Graded Exercises
- [Detailed Solutions](#detailed-solutions)

### 📖 [Comprehensive Index](#index)

---

# PART I: GENERAL PROOF TECHNIQUES

## 🎯 FOUNDATIONAL PROOF METHODS

### <a id="set-theory-and-cardinality"></a>Set Theory & Cardinality

**Definitions**:
- **Countable**: Set with same cardinality as ℕ (natural numbers)
- **Uncountable**: Larger cardinality than ℕ
- **Bijection**: One-to-one and onto function

**Key Results**:
- ℕ is countable (trivially)
- ℤ (integers) is countable
- ℚ (rationals) is countable
- ℝ (reals) is uncountable
- Power set of ℕ is uncountable

### THEOREM: ℤ is Countable

**PROOF** (Explicit Bijection):

Define f: ℕ → ℤ:
```
f(n) = {  n/2        if n is even
       { -(n+1)/2    if n is odd

f(0) = 0
f(1) = -1
f(2) = 1
f(3) = -2
f(4) = 2
...
```

**Injective**: Suppose f(m) = f(n)
- If both even: m/2 = n/2 → m = n ✓
- If both odd: -(m+1)/2 = -(n+1)/2 → m = n ✓
- If different parity: impossible (one positive, one negative/zero) ✓

**Surjective**: For any k ∈ ℤ:
- If k ≥ 0: f(2k) = k ✓
- If k < 0: f(-2k-1) = k ✓

Therefore ℤ is countable. ∎

### THEOREM: ℚ is Countable

**PROOF** (Dovetailing):

Arrange rationals in grid:
```
    1/1  1/2  1/3  1/4  ...
    2/1  2/2  2/3  2/4  ...
    3/1  3/2  3/3  3/4  ...
    4/1  4/2  4/3  4/4  ...
    ...
```

**Enumerate diagonally**:
```
1/1 → 1/2 → 2/1 → 3/1 → 2/2 → 1/3 → 1/4 → 2/3 → 3/2 → 4/1 → ...
```

**Skip duplicates** (e.g., 2/2 = 1/1)

This gives bijection ℕ → ℚ ✓

Therefore ℚ is countable. ∎

---

### <a id="diagonalization-method"></a>Diagonalization Arguments

**Cantor's Diagonal Method**: Fundamental technique for uncountability proofs

### THEOREM: ℝ is Uncountable

**PROOF** (Cantor's Diagonalization):

**Assume for contradiction**: ℝ is countable

Focus on interval (0,1). If countable, can list all:
```
r₁ = 0.d₁₁ d₁₂ d₁₃ d₁₄ ...
r₂ = 0.d₂₁ d₂₂ d₂₃ d₂₄ ...
r₃ = 0.d₃₁ d₃₂ d₃₃ d₃₄ ...
r₄ = 0.d₄₁ d₄₂ d₄₃ d₄₄ ...
...
```

**Construct**: x = 0.x₁ x₂ x₃ x₄ ... where:
```
xᵢ = { 5  if dᵢᵢ ≠ 5
     { 7  if dᵢᵢ = 5
```

**Claim**: x ∉ {r₁, r₂, r₃, ...}

**Proof**: 
- x ≠ r₁ because x₁ ≠ d₁₁
- x ≠ r₂ because x₂ ≠ d₂₂
- x ≠ rₙ because xₙ ≠ dₙₙ

Therefore x is real in (0,1) but not in list.

**CONTRADICTION** ⚡

Therefore ℝ is uncountable. ∎

**Why avoid 0 and 9**: Prevents issues like 0.5000... = 0.4999...

---

### THEOREM: Set of All Languages is Uncountable

**PROOF** (Power Set Argument):

Let Σ = {0,1}. Then Σ* is countable (strings are finite).

**Language** = subset of Σ*

**Set of all languages** = 𝒫(Σ*) (power set)

**By Cantor's Theorem**: |𝒫(Σ*)| > |Σ*|

Since Σ* is countable, 𝒫(Σ*) is uncountable.

Therefore most languages are not describable by finite algorithms! ∎

---

### THEOREM: Set of Turing Machines is Countable

**PROOF**:

Each TM has finite description:
- Finite state set Q
- Finite tape alphabet Γ
- Finite transition function δ

Can encode TM as string over fixed alphabet.

**Bijection**: Enumerate all strings lexicographically
- Valid TM encodings → valid TMs
- Invalid strings → skip

Therefore TMs are countable. ∎

**COROLLARY**: Most languages are undecidable!

**Proof**: 
- Languages: uncountable
- TMs: countable
- Each TM recognizes at most 1 language
- Therefore most languages have no TM! ∎

---

### <a id="closure-properties"></a>Closure Properties

**Definition**: Language class C is **closed** under operation ⊕ if:
```
L₁, L₂ ∈ C  →  L₁ ⊕ L₂ ∈ C
```

### THEOREM: Regular Languages Closed Under Union

**PROOF** (Construction):

Given DFAs M₁ = (Q₁, Σ, δ₁, q₁, F₁) and M₂ = (Q₂, Σ, δ₂, q₂, F₂)

**Construct** M = (Q, Σ, δ, q₀, F) where:
```
Q = Q₁ × Q₂  (Cartesian product)
q₀ = (q₁, q₂)
δ((p,q), a) = (δ₁(p,a), δ₂(q,a))
F = (F₁ × Q₂) ∪ (Q₁ × F₂)  (accept if either accepts)
```

**Correctness**:

M accepts w iff M₁ accepts w OR M₂ accepts w

After reading w:
- M in state (p,q)
- M₁ would be in state p
- M₂ would be in state q

M accepts iff (p,q) ∈ F
         iff p ∈ F₁ or q ∈ F₂
         iff M₁ accepts or M₂ accepts ✓

Therefore L(M) = L(M₁) ∪ L(M₂) ∎

---

### THEOREM: Regular Languages Closed Under Concatenation

**PROOF** (NFA Construction):

Given NFAs N₁, N₂ for L₁, L₂

**Construct** N for L₁L₂:
```
States: Q₁ ∪ Q₂
Start: q₁ (start of N₁)
Accept: F₂ (accept states of N₂)
Transitions:
  - All transitions from N₁
  - All transitions from N₂
  - ε-transitions from F₁ to q₂
```

**Correctness**:

String w ∈ L₁L₂ iff w = xy where x ∈ L₁, y ∈ L₂

N accepts w by:
1. Following N₁ on x, reaching state in F₁
2. ε-transition to q₂
3. Following N₂ on y, reaching state in F₂ ✓

Therefore L(N) = L₁L₂ ∎

---

### THEOREM: Regular Languages Closed Under Complement

**PROOF** (DFA Complement):

Given DFA M = (Q, Σ, δ, q₀, F)

**Construct** M' = (Q, Σ, δ, q₀, Q - F)

**Correctness**:

For any w ∈ Σ*:
- M reaches state q after reading w
- M accepts w iff q ∈ F
- M' accepts w iff q ∈ Q - F iff q ∉ F
- Therefore M' accepts w iff M rejects w ✓

Therefore L(M') = Σ* - L(M) = L̄ ∎

**Note**: Must use DFA (not NFA)! NFAs can have multiple paths.

---

## 🔤 REGULAR LANGUAGES PROOFS

### <a id="dfa-correctness-proofs"></a>DFA Correctness Proofs

**Template**:
1. Define invariant on states
2. Prove by induction on |w|
3. Show invariant implies correctness

### Example: DFA for "ends in 01"

**DFA**:
```
States: {q₀, q₁, q₂}  (q₂ is accepting)
q₀ --0--> q₁
q₀ --1--> q₀
q₁ --0--> q₁
q₁ --1--> q₂
q₂ --0--> q₁
q₂ --1--> q₀
```

**State Meaning**:
- q₀: last symbol is 1 or empty
- q₁: last symbol is 0
- q₂: last two symbols are 01 (ACCEPT)

**PROOF of Correctness**:

**Claim**: After reading w, DFA is in:
- q₀ if w is empty or ends in 1
- q₁ if w ends in 0 (but not 01)
- q₂ if w ends in 01

**Proof by Induction** on |w|:

**Base** (|w| = 0): Empty string → state q₀ ✓

**Inductive Step**: Assume claim holds for strings of length n.

Consider string wa (length n+1):

**Case 1**: DFA at q₀ after w
- If a = 0: go to q₁ (now ends in 0) ✓
- If a = 1: stay at q₀ (now ends in 1) ✓

**Case 2**: DFA at q₁ after w
- If a = 0: stay at q₁ (now ends in 0) ✓
- If a = 1: go to q₂ (now ends in 01) ✓

**Case 3**: DFA at q₂ after w
- If a = 0: go to q₁ (now ends in 0, not 01) ✓
- If a = 1: go to q₀ (now ends in 1) ✓

By induction, claim holds for all w. ∎

**Correctness**: DFA accepts w iff in q₂ iff w ends in 01 ✓

---

### <a id="nfa-to-dfa-subset-construction"></a>NFA to DFA Conversion (Subset Construction)

**THEOREM**: For every NFA, there exists an equivalent DFA.

**PROOF** (Construction):

Given NFA N = (Q, Σ, δ, q₀, F)

**Construct** DFA M = (Q', Σ, δ', q₀', F') where:
```
Q' = 𝒫(Q)  (power set - each state is a set of NFA states)
q₀' = ε-closure({q₀})
F' = {S ∈ Q' : S ∩ F ≠ ∅}
δ'(S, a) = ⋃_{q ∈ S} ε-closure(δ(q, a))
```

**ε-closure(S)** = {q : reachable from some p ∈ S via ε-transitions only}

**Correctness** (Induction on |w|):

**Invariant**: After reading w, DFA in state S iff NFA could be in any state in S

**Base** (w = ε): 
- DFA in q₀' = ε-closure({q₀})
- NFA can be in any state reachable by ε-transitions from q₀
- Matches invariant ✓

**Inductive Step**: After reading w, DFA in state S (by IH: NFA can be in states S)

Read symbol a:
- DFA moves to δ'(S, a) = ⋃_{q ∈ S} ε-closure(δ(q, a))
- NFA from state q ∈ S can go to any state in δ(q, a), then follow ε-transitions
- Therefore NFA can be in any state in ⋃_{q ∈ S} ε-closure(δ(q, a))
- Matches new DFA state ✓

**Acceptance**: 
- DFA accepts iff final state S has S ∩ F ≠ ∅
- This means NFA could be in some accepting state
- NFA accepts iff it could be in accepting state ✓

Therefore L(M) = L(N) ∎

**Complexity**: |Q'| ≤ 2^|Q| (can be exponential!)

---

### <a id="regex-equivalence-proof"></a>Regular Expression Equivalence

**THEOREM** (Kleene's Theorem): A language is regular iff it's described by a regular expression.

**Part 1**: Regular expression → NFA

**PROOF** (Structural Induction on regex):

**Base Cases**:
- ∅: NFA with no accept states
- ε: NFA with start = accept state, no transitions
- a ∈ Σ: NFA with two states, transition on a

**Inductive Cases**:

**Union** (R₁ | R₂): 
```
Add new start state with ε-transitions to both sub-NFAs
```

**Concatenation** (R₁R₂):
```
Add ε-transitions from accept states of R₁ to start of R₂
```

**Star** (R₁*):
```
Add new start/accept state with:
- ε-transition to old start
- ε-transitions from old accepts to old start
```

By induction, every regex has equivalent NFA ✓

**Part 2**: DFA → Regular expression (via GNFA)

---

### <a id="gnfa-conversion"></a>GNFA (Generalized NFA) Method

**GNFA**: Like NFA but transitions labeled with regular expressions (not just symbols)

**Key Property**: Can have regex on each transition

**Purpose**: Systematic way to convert any DFA to regex by eliminating states one at a time

### THEOREM: Every DFA has an Equivalent Regular Expression

**PROOF** (State Elimination via GNFA):

**Step 1**: Convert DFA to GNFA
```
Given DFA M = (Q, Σ, δ, q₀, F)

Create GNFA G with:
- New start state q_start with ε-transition to q₀
- New single accept state q_accept
- ε-transitions from all states in F to q_accept
- Convert each DFA transition δ(q,a) = p to regex transition q --a--> p
```

**Step 2**: Eliminate states one by one

For each state q_rip ∉ {q_start, q_accept}:

**For all pairs of states (q_i, q_j)**:

Old paths from q_i to q_j:
1. Direct: R_old (existing regex from q_i to q_j)
2. Via q_rip: (q_i --R₁--> q_rip --R₂--> q_rip --R₃--> q_j)
   Where R₂ is the loop at q_rip

**New transition**: R_new = R_old | R₁R₂*R₃

```
Example:
       R₁        R₂         R₃
  q_i ----> q_rip ---> q_rip ---> q_j
   |                                |
   |            R_old               |
   +--------------------------------+

After eliminating q_rip:
       R_old | R₁R₂*R₃
  q_i ----------------------> q_j
```

**Step 3**: Final regex

When only q_start and q_accept remain:
- Single transition q_start --R--> q_accept
- R is the desired regular expression ✓

**Correctness**:

**Invariant**: After eliminating k states, GNFA accepts same language as original DFA

**Base** (k=0): GNFA equivalent to DFA ✓

**Inductive Step**: Eliminating state q_rip preserves language
- Any path using q_rip is captured by R₁R₂*R₃
- Any direct path preserved by R_old
- Union captures all possibilities ✓

**Termination**: After |Q|-2 eliminations, have regex ✓

Therefore every DFA has equivalent regex. ∎

---

### Example: DFA to Regex via GNFA

**DFA**: Accepts strings ending in 01

```
States: {q₀, q₁, q₂}
Transitions:
  δ(q₀, 0) = q₁
  δ(q₀, 1) = q₀
  δ(q₁, 0) = q₁
  δ(q₁, 1) = q₂
  δ(q₂, 0) = q₁
  δ(q₂, 1) = q₀
Accept: q₂
```

**Step 1**: Convert to GNFA
```
Add q_start --ε--> q₀
Add q₂ --ε--> q_accept

        ε          0         1         ε
q_start --> q₀ <-----> q₁ -----> q₂ --> q_accept
             |    1         0,1    ^
             +--------------------> |
                      1             0
```

**Step 2**: Eliminate q₁

Paths affected:
- q₀ to q₂: Was q₀ --0--> q₁ --1--> q₂
  - R₁ = 0, R₂ = 0, R₃ = 1
  - New: 0·0*·1 = 00*1

After eliminating q₁:
```
        ε                     00*1              ε
q_start --> q₀ ----------------------> q₂ --> q_accept
             |                          ^
             |           1              |
             +--------------------------|
                         1              0
```

**Step 3**: Eliminate q₀

Path q_start to q₂:
- Via q₀: ε · (1)*00*1 = (1)*00*1

Path q₂ to q₂:
- Via q₀: 0 · (1)* · 0 = 0(1)*0  (self-loop at q₂)
- Old self-loop: ∅
- Combined: 0(1)*0

After eliminating q₀:
```
              (1)*00*1
q_start --------------------> q₂ --> q_accept
                               | 0(1)*0
                               +----+
```

**Step 4**: Eliminate q₂

Final regex:
```
R = (1)*00*1 · (0(1)*0)* · ε
  = (1)*00*1(0(1)*0)*
```

**Simplified**: (1)*00*1(0(1)*0)*

This accepts strings ending in 01 ✓

**Alternative simplification**: (0|1)*01

(Can be shown equivalent by regex algebra)

---

### GNFA State Elimination Algorithm (Formal)

```python
def DFA_to_Regex(M):
    # M = (Q, Σ, δ, q₀, F)
    
    # Step 1: Convert to GNFA
    G = create_GNFA(M)
    # G has: q_start --ε--> q₀, all q ∈ F --ε--> q_accept
    
    # Step 2: Eliminate states
    R = Q - {q_start, q_accept}  # Rippable states
    
    while len(R) > 0:
        q_rip = R.pop()  # Choose any state to eliminate
        
        # For all pairs of remaining states
        for q_i in G.states - {q_rip}:
            for q_j in G.states - {q_rip}:
                # Get regexes
                R_old = G.transition(q_i, q_j)  # May be ∅
                R1 = G.transition(q_i, q_rip)
                R2 = G.transition(q_rip, q_rip)  # Self-loop
                R3 = G.transition(q_rip, q_j)
                
                # New transition
                R_new = R_old | (R1 · R2* · R3)
                G.set_transition(q_i, q_j, R_new)
        
        G.remove_state(q_rip)
    
    # Step 3: Return final regex
    return G.transition(q_start, q_accept)
```

**Complexity**: O(n³ · 4^n) where n = |Q|
- n states to eliminate
- For each: n² pairs to update
- Regex size grows exponentially

**Optimizations**:
- Eliminate states in good order (minimize regex size)
- Apply algebraic simplifications: ∅|R = R, ε·R = R, etc.

---

### Key Insights About GNFA Method

**Why it works**:
1. Every path through eliminated state captured by regex
2. R₂* handles arbitrary looping at eliminated state
3. Union preserves all alternative paths

**Advantages**:
- Systematic algorithm
- Constructive proof
- Always terminates

**Disadvantages**:
- Resulting regex may be complex
- Not unique (depends on elimination order)
- May need simplification

**Alternative**: Dynamic programming (similar to CYK but for regex)

---

### <a id="pumping-lemma-regular"></a>Pumping Lemma for Regular Languages

**THEOREM** (Pumping Lemma): If L is regular, then ∃p (pumping length) such that:
```
∀s ∈ L with |s| ≥ p, ∃ decomposition s = xyz where:
  1. |xy| ≤ p
  2. |y| ≥ 1
  3. ∀i ≥ 0: xy^i z ∈ L
```

**PROOF**:

L regular → L = L(M) for some DFA M with n states

**Choose** p = n (number of states)

**Let** s ∈ L with |s| ≥ p

Processing s visits states q₀, q₁, ..., q_{|s|}

**First p+1 states**: q₀, q₁, ..., q_p

By **Pigeonhole Principle**: Some state repeats in first p+1 states

Let j < k ≤ p be indices where q_j = q_k

**Decompose** s = xyz where:
- x = first j symbols
- y = symbols j+1 to k (the loop)
- z = remaining symbols

**Properties**:
1. |xy| = k ≤ p ✓
2. |y| = k - j ≥ 1 ✓
3. Can repeat loop any number of times:
   - xy⁰z: skip loop → still reaches same final state
   - xy¹z: original s → accepted
   - xy²z: go around loop twice → still reaches same final state
   - ∀i ≥ 0: xy^i z ∈ L ✓

Therefore pumping lemma holds. ∎

---

### Using Pumping Lemma to Prove Non-Regularity

**Template**:
1. Assume L is regular (for contradiction)
2. Get pumping length p
3. Choose string s ∈ L with |s| ≥ p (strategically!)
4. Show that for ALL decompositions s = xyz with |xy| ≤ p, |y| ≥ 1:
   - ∃i such that xy^i z ∉ L
5. Contradiction → L is not regular

### Example 1: L = {0ⁿ1ⁿ : n ≥ 0}

**PROOF** that L is not regular:

**Assume** L is regular. Let p be pumping length.

**Choose** s = 0^p 1^p (clearly s ∈ L and |s| = 2p ≥ p)

By pumping lemma, s = xyz with |xy| ≤ p, |y| ≥ 1

**Key observation**: Since |xy| ≤ p, both x and y consist only of 0's

So y = 0^k for some k ≥ 1

**Pump**: Consider xy²z = 0^p 1^p with extra k zeros
```
xy²z = 0^(p+k) 1^p
```

Since k ≥ 1: p + k > p, so xy²z has more 0's than 1's

Therefore xy²z ∉ L

**CONTRADICTION** ⚡

Therefore L is not regular. ∎

---

### Example 2: L = {ww : w ∈ {0,1}*}

**PROOF** that L is not regular:

**Assume** L is regular. Let p be pumping length.

**Choose** s = 0^p 1 0^p 1 (clearly s ∈ L and |s| = 2p + 2 ≥ p)

By pumping lemma, s = xyz with |xy| ≤ p, |y| ≥ 1

**Key observation**: y consists only of 0's from first half

So y = 0^k for some k ≥ 1

**Pump down**: Consider xy⁰z = xz
```
xz = 0^(p-k) 1 0^p 1
```

For xz to be in L, must have form ww for some w

But first half: 0^(p-k) 1
Second half: 0^p 1

These are different lengths (p-k < p)

Therefore xz ∉ L

**CONTRADICTION** ⚡

Therefore L is not regular. ∎

---

### <a id="myhill-nerode-theorem"></a>Myhill-Nerode Theorem

**Definition**: Strings x, y are **distinguishable** with respect to L if:
```
∃z: xz ∈ L ⟺ yz ∉ L
```

**Equivalence relation** ≡_L:
```
x ≡_L y  iff  ∀z: xz ∈ L ⟺ yz ∈ L
```

**Index of ≡_L** = number of equivalence classes

**THEOREM** (Myhill-Nerode): The following are equivalent:
1. L is regular
2. ≡_L has finite index
3. L is union of some equivalence classes of ≡_L

**Moreover**: Minimum DFA for L has exactly n states, where n = index of ≡_L

**PROOF** (1 → 2):

Assume L regular, accepted by DFA M with n states.

For string w, let δ*(q₀, w) be state reached after reading w.

**Claim**: If δ*(q₀, x) = δ*(q₀, y), then x ≡_L y

**Proof**: For any z:
- M accepts xz iff δ*(δ*(q₀, x), z) ∈ F
- M accepts yz iff δ*(δ*(q₀, y), z) ∈ F
- Since δ*(q₀, x) = δ*(q₀, y), these are the same
- Therefore xz ∈ L ⟺ yz ∈ L ✓

**Conclusion**: At most n equivalence classes (one per state)

Therefore ≡_L has finite index ✓

---

### Example: Minimum DFA for L = {w : w ends in 01}

**Equivalence classes**:

[ε] = {w : w empty or ends in 1}
[0] = {w : w ends in 0 but not 01}
[01] = {w : w ends in 01}

**Verification**:
- ε ≡_L 1 ≡_L 11 ≡_L 111 (all distinguishable from others by z = 01)
- 0 ≡_L 10 ≡_L 110 (all distinguishable by z = 1)
- 01 ≡_L 101 ≡_L 1101 (all distinguishable by z = ε)

**Three equivalence classes → minimum DFA has 3 states** ✓

---

## 📚 CONTEXT-FREE LANGUAGES

### <a id="cfg-correctness-proofs"></a>CFG Correctness Proofs

**Template**:
1. Prove L(G) ⊆ L (every derivation produces string in L)
2. Prove L ⊆ L(G) (every string in L has a derivation)

### Example: G generates {0ⁿ1ⁿ : n ≥ 0}

**Grammar**:
```
S → ε
S → 0S1
```

**PROOF**:

**Part 1**: L(G) ⊆ {0ⁿ1ⁿ : n ≥ 0}

**Claim**: If S ⇒* w, then w = 0ⁿ1ⁿ for some n ≥ 0

**Proof by Induction** on length of derivation:

**Base** (1 step): S ⇒ ε, so w = 0⁰1⁰ ✓

**Inductive Step**: Derivation has k+1 steps
- Must use S → 0S1 first: S ⇒ 0S1 ⇒^k w
- So w = 0w'1 where S ⇒^k w'
- By IH: w' = 0ⁿ1ⁿ for some n
- Therefore w = 0·0ⁿ1ⁿ·1 = 0^(n+1)1^(n+1) ✓

By induction, L(G) ⊆ {0ⁿ1ⁿ : n ≥ 0} ✓

**Part 2**: {0ⁿ1ⁿ : n ≥ 0} ⊆ L(G)

**Claim**: For all n ≥ 0, S ⇒* 0ⁿ1ⁿ

**Proof by Induction** on n:

**Base** (n = 0): S ⇒ ε = 0⁰1⁰ ✓

**Inductive Step**: By IH, S ⇒* 0ⁿ1ⁿ

Need to show S ⇒* 0^(n+1)1^(n+1):
```
S ⇒ 0S1 ⇒* 0·0ⁿ1ⁿ·1 = 0^(n+1)1^(n+1) ✓
```

By induction, {0ⁿ1ⁿ : n ≥ 0} ⊆ L(G) ✓

**Conclusion**: L(G) = {0ⁿ1ⁿ : n ≥ 0} ∎

---

### <a id="pda-proofs"></a>Pushdown Automata Proofs

**PDA** = NFA + Stack

**Configuration**: (state, remaining input, stack contents)

**Acceptance**: By final state or empty stack

### Example: PDA for {0ⁿ1ⁿ : n ≥ 0}

**Informal Description**:
1. Push 0's onto stack
2. Pop 0's for each 1
3. Accept if stack empty

**Formal PDA**: M = (Q, Σ, Γ, δ, q₀, Z₀, F)
```
Q = {q₀, q₁, q₂}
Σ = {0, 1}
Γ = {0, Z₀}  (Z₀ = bottom marker)
F = {q₂}

Transitions:
δ(q₀, ε, Z₀) = {(q₂, Z₀)}  (accept empty string)
δ(q₀, 0, Z₀) = {(q₀, 0Z₀)}  (push first 0)
δ(q₀, 0, 0) = {(q₀, 00)}    (push more 0's)
δ(q₀, 1, 0) = {(q₁, ε)}     (start popping)
δ(q₁, 1, 0) = {(q₁, ε)}     (pop for each 1)
δ(q₁, ε, Z₀) = {(q₂, Z₀)}  (accept if empty)
```

**PROOF of Correctness**:

**Invariant**: After reading 0^i 1^j with i ≥ j:
- In state q₀ if j = 0
- In state q₁ if j > 0
- Stack contains 0^(i-j) Z₀

**Part 1**: L(M) ⊆ {0ⁿ1ⁿ : n ≥ 0}

If M accepts w, then:
- w = 0^i 1^j for some i, j (by structure of transitions)
- Stack empty at end → i = j
- Therefore w ∈ {0ⁿ1ⁿ : n ≥ 0} ✓

**Part 2**: {0ⁿ1ⁿ : n ≥ 0} ⊆ L(M)

For w = 0ⁿ1ⁿ:
- Push n zeros: (q₀, 0ⁿ1ⁿ, Z₀) ⊢* (q₀, 1ⁿ, 0ⁿZ₀)
- Pop n zeros: (q₀, 1ⁿ, 0ⁿZ₀) ⊢* (q₁, ε, Z₀)
- Accept: (q₁, ε, Z₀) ⊢ (q₂, ε, Z₀) ✓

Therefore L(M) = {0ⁿ1ⁿ : n ≥ 0} ∎

---

### <a id="pumping-lemma-cfl"></a>Pumping Lemma for Context-Free Languages

**THEOREM**: If L is context-free, then ∃p such that:
```
∀s ∈ L with |s| ≥ p, ∃ decomposition s = uvxyz where:
  1. |vxy| ≤ p
  2. |vy| ≥ 1
  3. ∀i ≥ 0: uv^i xy^i z ∈ L
```

**PROOF**:

L is CFL → L = L(G) for some CFG G

Convert G to Chomsky Normal Form (all rules A → BC or A → a)

Let b = max branching factor, h = height of parse tree

For string of length n, parse tree has height ≥ log_b(n)

**Choose** p = b^(|V|+1) where |V| = number of variables

For s with |s| ≥ p, parse tree has height > |V|

**By Pigeonhole**: Some variable A repeats on path from root to leaf

**Decompose**:
```
      S
     ...
      A   (first occurrence)
     /|\
    u A y
      |
      x   (second occurrence A)
```

Can replace first A with second A (pump out) or repeat (pump in):
```
s = uvxyz
uv²xy²z = u(vxy)vxyz  (repeat A subtree)
uxz = uxz  (skip A subtree)
```

All properties satisfied ✓

---

### Example: L = {0ⁿ1ⁿ2ⁿ : n ≥ 0} is not Context-Free

**PROOF**:

**Assume** L is CFL. Let p be pumping length.

**Choose** s = 0^p 1^p 2^p

By pumping lemma, s = uvxyz with |vxy| ≤ p, |vy| ≥ 1

**Case Analysis**:

**Case 1**: vxy contains only 0's
- Pumping up adds more 0's → unequal counts ✗

**Case 2**: vxy contains only 1's
- Pumping up adds more 1's → unequal counts ✗

**Case 3**: vxy contains only 2's
- Pumping up adds more 2's → unequal counts ✗

**Case 4**: vxy spans two different symbols (say 0's and 1's)
- Pumping up creates 001100 pattern → wrong order ✗

**Case 5**: vxy spans all three symbols
- Impossible since |vxy| ≤ p but 0^p 1^p 2^p requires span > p

In all cases, pumping fails!

**CONTRADICTION** ⚡

Therefore L is not context-free. ∎

---

### <a id="chomsky-normal-form"></a>Chomsky Normal Form

**Definition**: CFG is in CNF if all rules have form:
- A → BC (two variables)
- A → a (single terminal)
- S → ε (only if S not on any right side)

**THEOREM**: Every CFL has a CNF grammar.

**PROOF** (Construction):

**Step 1**: Eliminate ε-productions
- Find nullable variables
- For each rule with nullable variables, add versions with/without them

**Step 2**: Eliminate unit productions (A → B)
- If A →* B and B → α is non-unit, add A → α

**Step 3**: Convert to CNF form
- For A → B₁B₂...Bₖ with k > 2, introduce new variables:
  - A → B₁C₁
  - C₁ → B₂C₂
  - ...
  - Cₖ₋₂ → Bₖ₋₁Bₖ

- For A → α where α contains terminals and variables, replace terminals:
  - Add Ta → a
  - Use Ta instead of a

**Result**: Equivalent CNF grammar ✓

---

### <a id="cyk-parsing-algorithm"></a>CYK Parsing Algorithm

**Given**: CNF grammar G, string w of length n

**Goal**: Determine if w ∈ L(G)

**Algorithm** (Dynamic Programming):

```python
def CYK(G, w):
    n = len(w)
    table = [[set() for _ in range(n)] for _ in range(n)]
    
    # Base case: substrings of length 1
    for i in range(n):
        for A → a in G:
            if a == w[i]:
                table[i][i].add(A)
    
    # Substrings of length 2 to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for k in range(i, j):
                for A → BC in G:
                    if B in table[i][k] and C in table[k+1][j]:
                        table[i][j].add(A)
    
    return S in table[0][n-1]
```

**Correctness**:

**Invariant**: table[i][j] contains all variables A such that A ⇒* w[i..j]

**Base Case**: Single symbols correctly identified ✓

**Inductive Case**: For substring w[i..j]:
- Try all splits at position k: w[i..k] and w[k+1..j]
- If B ⇒* w[i..k] and C ⇒* w[k+1..j] (by IH)
- And A → BC is a rule
- Then A ⇒ BC ⇒* w[i..k]w[k+1..j] = w[i..j] ✓

**Time Complexity**: O(n³|G|)

**Space**: O(n²)

Therefore CYK correctly parses in polynomial time ∎

---

## 🔢 TURING MACHINES

### <a id="tm-correctness-proofs"></a>TM Correctness Proofs

**Turing Machine**: M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)

**Configuration**: (state, tape contents, head position)

**Computation**: Sequence of configurations

**Acceptance**: Reach q_accept

### Example: TM for L = {0ⁿ1ⁿ : n ≥ 0}

**High-Level Algorithm**:
1. Scan right, cross off one 0 and one 1
2. Return to start
3. Repeat until no more pairs
4. Accept if all symbols crossed off

**Formal Description**: (States and transitions omitted for brevity)

**PROOF of Correctness**:

**Invariant**: After k complete cycles:
- k 0's and k 1's are crossed off
- Remaining string has form 0^(n-k)1^(n-k) (for input 0ⁿ1ⁿ)

**Induction on k**:

**Base** (k = 0): No symbols crossed off → 0ⁿ1ⁿ remains ✓

**Inductive Step**: After k cycles, tape has X^k 0^(n-k) 1^(n-k) X^k
- Cross off one 0, one 1
- Now X^(k+1) 0^(n-k-1) 1^(n-k-1) X^(k+1) ✓

**Termination**: After n cycles:
- All symbols crossed off
- Accept ✓

**Rejection**: If 0's and 1's don't match, one will run out first → reject ✓

Therefore L(M) = {0ⁿ1ⁿ : n ≥ 0} ∎

---

### <a id="church-turing-thesis"></a>Church-Turing Thesis

**Thesis** (not a theorem!): Any effectively computable function can be computed by a Turing Machine.

**Evidence**:
- All proposed models equivalent (λ-calculus, μ-recursive, TM, RAM, etc.)
- No counterexample in 90+ years
- All practical algorithms implementable on TM

**Not provable**: "Effectively computable" is informal concept

---

### <a id="universal-turing-machine"></a>Universal Turing Machine

**THEOREM**: There exists a TM U such that:
```
U(⟨M⟩, w) = {  accept  if M accepts w
             { reject  if M rejects w
             { loop    if M loops on w
```

Where ⟨M⟩ = encoding of TM M

**PROOF** (Construction):

U simulates M on w:
1. Store ⟨M⟩ (states, transitions) on tape
2. Store current state of M
3. Store tape contents of M
4. Simulate each step:
   - Look up transition in ⟨M⟩
   - Update state and tape
   - Move head

U accepts iff M accepts ✓

**Significance**: 
- Programs are data (stored on tape)
- Foundation of stored-program computers
- Enables software! ∎

---

### <a id="halting-problem-proof"></a>Halting Problem

**THEOREM**: The halting problem is undecidable.

**Halting Problem**: H = {⟨M, w⟩ : M halts on input w}

**PROOF** (Diagonalization):

**Assume for contradiction**: H is decidable by TM R

R has property:
```
R(⟨M⟩, w) = { accept  if M halts on w
            { reject  if M loops on w
```

**Construct** TM D:
```python
D(⟨M⟩):
    if R(⟨M⟩, ⟨M⟩) accepts:  # M halts on its own encoding
        loop forever
    else:  # M loops on its own encoding
        accept
```

**What happens when we run D(⟨D⟩)?**

**Case 1**: R(⟨D⟩, ⟨D⟩) accepts
- Means D halts on ⟨D⟩
- Then D loops forever (by construction)
- **CONTRADICTION**: D both halts and loops ⚡

**Case 2**: R(⟨D⟩, ⟨D⟩) rejects
- Means D loops on ⟨D⟩
- Then D accepts (by construction)
- **CONTRADICTION**: D both loops and halts ⚡

Either case leads to contradiction!

Therefore R cannot exist, so H is undecidable. ∎

**Key Insight**: Diagonalization - D does opposite of what R predicts!

---

### <a id="rices-theorem"></a>Rice's Theorem

**THEOREM**: Every non-trivial property of the language of a TM is undecidable.

**Non-trivial property**: 
- Some TMs have it, some don't
- Property depends only on L(M), not M itself

**Examples of non-trivial properties**:
- "L(M) is empty"
- "L(M) is finite"
- "L(M) is regular"
- "L(M) contains ε"

**PROOF** (Reduction from Halting Problem):

Let P be a non-trivial property.

WLOG assume P(∅) = false (otherwise use complement)

Since P is non-trivial, ∃ TM M_yes with P(L(M_yes)) = true

**Claim**: If P is decidable, then Halting Problem is decidable

**Proof**: Given ⟨M, w⟩, construct TM M':
```
M'(x):
    1. Simulate M on w
    2. If M halts, simulate M_yes on x
    3. If M_yes accepts, accept
```

**Key observation**:
- If M halts on w: L(M') = L(M_yes) → P(L(M')) = true
- If M loops on w: L(M') = ∅ → P(L(M')) = false

So: M halts on w iff P(L(M')) = true

If P were decidable, could decide halting!

**CONTRADICTION** ⚡

Therefore P is undecidable. ∎

---

## ♾️ DECIDABILITY

### <a id="decidable-languages"></a>Decidable Languages

**Decidable** (Recursive): TM halts on all inputs, accepts L

**Examples**:
- All regular languages (DFA → TM)
- All CFLs (PDA → TM with stack simulation)
- A_DFA = {⟨D, w⟩ : DFA D accepts w}
- E_DFA = {⟨D⟩ : L(D) = ∅}
- EQ_DFA = {⟨D₁, D₂⟩ : L(D₁) = L(D₂)}

### THEOREM: A_DFA is Decidable

**PROOF** (Construction):

Build TM M:
```
M(⟨D⟩, w):
    1. Simulate D on w
    2. If D accepts, accept
    3. If D rejects, reject
```

**Correctness**:
- D is DFA → always halts
- M simulates D → M halts
- M accepts iff D accepts ✓

Therefore A_DFA is decidable. ∎

---

### THEOREM: E_DFA is Decidable

**PROOF** (Construction):

Build TM M:
```
M(⟨D⟩):
    1. Mark start state of D
    2. Mark all states reachable from marked states
    3. If any marked state is accepting:
        reject
    4. If no marked accepting states:
        accept
```

**Correctness**:
- Marks exactly reachable states
- L(D) = ∅ iff no reachable accepting states
- M accepts iff L(D) = ∅ ✓

Therefore E_DFA is decidable. ∎

---

### <a id="undecidable-problems"></a>Undecidable Problems

**Recognizable** (Recursively Enumerable): TM accepts exactly L (may loop on rejection)

**Co-recognizable**: Complement is recognizable

**Decidable** ⟺ Recognizable AND Co-recognizable

### THEOREM: Halting Problem is Recognizable but Not Decidable

**Recognizable**:
```
U(⟨M⟩, w):
    Simulate M on w
    If M accepts, accept
    If M rejects, reject
    (If M loops, U loops)
```

U accepts exactly H ✓

**Not decidable**: Proved by diagonalization ✓

**Not co-recognizable**: 
If H̄ were recognizable, then H would be decidable (run both in parallel)

But H is not decidable → H̄ not recognizable ∎

---

### <a id="reduction-technique"></a>Reduction Proofs

**Reduction**: A ≤_m B (A reduces to B) if:
```
Computable function f: Σ* → Σ* such that:
  w ∈ A ⟺ f(w) ∈ B
```

**Key Property**: If A ≤_m B then:
- B decidable → A decidable
- A undecidable → B undecidable (contrapositive!)

### Example: E_TM is Undecidable

**Problem**: E_TM = {⟨M⟩ : L(M) = ∅}

**PROOF** (Reduction from A_TM):

A_TM = {⟨M, w⟩ : M accepts w} is undecidable

**Reduction**: A_TM ≤_m E_TM

**Construction**: Given ⟨M, w⟩, build TM M':
```
M'(x):
    1. Ignore x
    2. Simulate M on w
    3. If M accepts w, accept
```

**Key observation**:
```
M accepts w ⟺ L(M') = Σ* (non-empty)
M rejects/loops on w ⟺ L(M') = ∅
```

Therefore:
```
⟨M, w⟩ ∈ A_TM ⟺ ⟨M'⟩ ∉ E_TM
⟨M, w⟩ ∉ A_TM ⟺ ⟨M'⟩ ∈ E_TM
```

So A_TM ≤_m E̅_TM (complement)

If E_TM decidable, then E̅_TM decidable, then A_TM decidable

But A_TM undecidable → E_TM undecidable ∎

---

### <a id="post-correspondence-problem"></a>Post Correspondence Problem

**Problem**: Given domino tiles, can we arrange sequence to match top and bottom?

**Example**:
```
Tiles: [ab/abab], [b/a], [aba/b]

Solution: [ab/abab] [b/a] [aba/b] [ab/abab] [b/a]
Top:    ab        b       aba     ab        b     = abbaaabb
Bottom: abab      a       b       abab      a     = abbaaabb ✓
```

**THEOREM**: PCP is undecidable.

**PROOF** (Reduction from A_TM):

Given ⟨M, w⟩, construct PCP instance that has solution iff M accepts w.

Tiles encode:
- Initial configuration
- Transition rules
- Final accepting configuration

(Full construction complex - omitted)

Since A_TM is undecidable, PCP is undecidable. ∎

---

## 🎓 COMPLEXITY CLASSES

### <a id="p-and-np"></a>P and NP

**P**: Languages decidable in polynomial time by deterministic TM

**NP**: Languages decidable in polynomial time by non-deterministic TM

**Equivalently**: L ∈ NP iff ∃ polynomial-time verifier V:
```
w ∈ L ⟺ ∃ certificate c: V(w, c) accepts
```

**Examples**:
- **P**: Sorting, shortest path, primality testing
- **NP**: SAT, Hamiltonian path, clique, vertex cover
- **NP-complete**: Hardest problems in NP

**P ⊆ NP**: Any deterministic algorithm is trivially non-deterministic

**P = NP?**: **Unknown!** Biggest open problem in CS

---

### <a id="np-completeness"></a>NP-Completeness

**Definition**: L is NP-complete if:
1. L ∈ NP
2. Every language in NP reduces to L (L is NP-hard)

**Polynomial-time reduction**: A ≤_p B if:
```
∃ polynomial-time computable f: w ∈ A ⟺ f(w) ∈ B
```

**Key Property**: If L is NP-complete and L ∈ P, then P = NP

### <a id="cook-levin-theorem"></a>Cook-Levin Theorem

**THEOREM**: SAT is NP-complete.

**SAT**: Boolean satisfiability
```
Given: φ = (x₁ ∨ ¬x₂) ∧ (¬x₁ ∨ x₃) ∧ ...
Question: ∃ assignment making φ true?
```

**PROOF** (Sketch):

**Part 1**: SAT ∈ NP

**Verifier**: Given formula φ and assignment a
- Evaluate φ with a
- Accept if true

Polynomial time ✓

**Part 2**: Every L ∈ NP reduces to SAT

For any NP language L:
- Has NTM M deciding L in polynomial time p(n)
- Given w, construct formula φ_w:
  - Variables for each cell of computation
  - Clauses for initial configuration
  - Clauses for transitions
  - Clauses for accepting configuration
- φ_w satisfiable iff M accepts w
- Construction polynomial time ✓

Therefore SAT is NP-complete. ∎

---

### Common NP-Complete Problems (via Reduction)

**3-SAT** ≤_p **Clique** ≤_p **Vertex Cover** ≤_p **Hamiltonian Path** ≤_p **TSP**

### Example: 3-SAT ≤_p Clique

**3-SAT**: CNF with exactly 3 literals per clause

**Clique**: Find k-clique (k vertices all connected)

**Reduction**: Given 3-SAT formula φ with m clauses:

**Construct graph G**:
- Vertex for each literal in each clause
- Edge between literals in different clauses if they're compatible (not x and ¬x)

**Claim**: φ satisfiable ⟺ G has m-clique

**Proof**:
- If φ satisfiable: pick one true literal per clause → m vertices → all compatible → m-clique ✓
- If G has m-clique: one literal per clause, all compatible → satisfying assignment ✓

**Polynomial construction** ✓

Therefore 3-SAT ≤_p Clique, so Clique is NP-complete. ∎

---

# PART II: INDUCTION PROOFS

## 🔄 STRUCTURAL INDUCTION

### <a id="induction-on-strings"></a>Induction on String Length

**Template**:
```
CLAIM: P(w) holds for all strings w

PROOF:
  Base case: P(ε) [or P(a) for each a ∈ Σ]
  Inductive step: P(w) → P(wa) [or P(aw)]
∎
```

### Example: DFA State Reachability

**CLAIM**: For DFA M, δ*(q, xy) = δ*(δ*(q, x), y)

**PROOF** by induction on |y|:

**Base** (y = ε):
```
δ*(q, xε) = δ*(q, x)
δ*(δ*(q, x), ε) = δ*(q, x)
Equal ✓
```

**Inductive Step**: Assume P(y), prove P(ya)
```
δ*(q, x(ya))
= δ*(q, (xy)a)
= δ(δ*(q, xy), a)     [definition]
= δ(δ*(δ*(q, x), y), a)  [by IH]
= δ*(δ*(q, x), ya)    [definition]
```

By induction, claim holds for all y. ∎

---

### <a id="induction-on-parse-trees"></a>Induction on Derivation Trees

**Template**:
```
CLAIM: P(T) holds for all parse trees T

PROOF:
  Base case: Leaves (terminals) satisfy P
  Inductive step: If children satisfy P, root satisfies P
∎
```

### Example: Number of Nodes in CNF Parse Tree

**CLAIM**: For CNF grammar, if parse tree has yield of length n, it has exactly 2n-1 nodes.

**PROOF** by structural induction on parse tree:

**Base case** (height 1):
- Single leaf → n = 1
- Nodes = 1
- 2(1) - 1 = 1 ✓

**Inductive step** (height h > 1):
- Root labeled A → BC (CNF rule)
- Left subtree: yield length n₁, nodes 2n₁-1 (by IH)
- Right subtree: yield length n₂, nodes 2n₂-1 (by IH)
- Total yield: n = n₁ + n₂
- Total nodes: 1 + (2n₁-1) + (2n₂-1) = 2n₁ + 2n₂ - 1 = 2(n₁+n₂) - 1 = 2n - 1 ✓

By induction, claim holds. ∎

---

### <a id="induction-on-tm-steps"></a>Induction on Computation Steps

**Template**:
```
CLAIM: After t steps, configuration has property P(t)

PROOF:
  Base case: t = 0, initial configuration
  Inductive step: P(t) → P(t+1)
∎
```

### Example: TM Halts in Bounded Steps

**CLAIM**: TM M for {0ⁿ1ⁿ} (crossing off) halts in O(n²) steps on input of length n.

**PROOF** by induction on n:

**Base** (n = 0, 1): Constant time ✓

**Inductive Step**: Assume M halts in cn² steps for inputs of length n.

For input of length n+2:
- One scan to cross off one 0 and one 1: O(n) steps
- Recursively process remaining n symbols: cn² steps (by IH)
- Total: cn² + O(n) = c(n+1)² for large enough c ✓

By induction, M halts in O(n²) steps. ∎

---

## 🌲 TREE INDUCTION

### <a id="parse-tree-induction"></a>Parse Tree Induction

### Example: Ambiguity Detection

**CLAIM**: If grammar G is ambiguous, then ∃w with two different parse trees.

**Proof Strategy**:
- Find w with two leftmost derivations
- Build parse trees by induction on derivation length
- Trees are different ✓

### Example: CFL Pumping Lemma (Complete Proof)

**THEOREM**: If L is CFL, then ∃p such that any s ∈ L with |s| ≥ p can be pumped.

**PROOF**:

L is CFL → has CFG G in CNF

**Claim 1**: Parse tree of height h generates strings of length ≤ 2^(h-1)

**Proof by induction on h**:

**Base** (h = 1): Only leaves → length 1 = 2⁰ ✓

**Inductive Step**: Height h+1
- Root has two subtrees of height ≤ h
- By IH, each generates strings of length ≤ 2^(h-1)
- Total: 2^(h-1) + 2^(h-1) = 2^h ✓

**Claim 2**: String of length n requires parse tree of height ≥ log₂(n) + 1

**Proof**: Contrapositive of Claim 1 ✓

**Main Proof**:

Let p = 2^|V| where |V| = number of variables

For s with |s| ≥ p:
- Parse tree has height ≥ log₂(p) + 1 = |V| + 1
- Path from root to some leaf has length > |V|
- By Pigeonhole: Some variable A repeats on this path

[Rest follows standard pumping lemma proof]

Therefore CFL pumping lemma holds. ∎

---

## 🔁 RECURSIVE PROOFS

### <a id="regex-induction"></a>Regular Expression Induction

**Template**:
```
CLAIM: P(R) holds for all regular expressions R

PROOF:
  Base cases: P(∅), P(ε), P(a) for each a ∈ Σ
  Inductive cases: P(R₁) ∧ P(R₂) → P(R₁|R₂)
                   P(R₁) ∧ P(R₂) → P(R₁R₂)
                   P(R₁) → P(R₁*)
∎
```

### Example: Star Height

**Definition**: star-height(R) = max nesting depth of Kleene stars

**CLAIM**: For any regex R, star-height(R) ≥ 0

**PROOF** by structural induction on R:

**Base cases**:
- R = ∅: star-height = 0 ✓
- R = ε: star-height = 0 ✓
- R = a: star-height = 0 ✓

**Inductive cases**:

**Union**: star-height(R₁|R₂) = max(star-height(R₁), star-height(R₂)) ≥ 0 by IH ✓

**Concatenation**: star-height(R₁R₂) = max(star-height(R₁), star-height(R₂)) ≥ 0 by IH ✓

**Star**: star-height(R₁*) = star-height(R₁) + 1 ≥ 1 > 0 ✓

By induction, claim holds for all regexes. ∎

---

### <a id="grammar-induction"></a>Grammar Induction

### Example: Derivation Length

**CLAIM**: For CFG in CNF generating string w, shortest derivation has length 2|w| - 1.

**PROOF** by induction on |w|:

**Base** (|w| = 1):
- Must use rule A → a (length 1)
- 2(1) - 1 = 1 ✓

**Inductive Step**: |w| = n+1

Write w = w₁w₂ where |w₁| = k, |w₂| = n+1-k

Shortest derivation:
```
S ⇒ AB ⇒* w₁B ⇒* w₁w₂
```

Steps:
- S ⇒ AB: 1 step
- A ⇒* w₁: 2k-1 steps (by IH)
- B ⇒* w₂: 2(n+1-k)-1 steps (by IH)

Total: 1 + (2k-1) + (2(n+1-k)-1) = 1 + 2k - 1 + 2n + 2 - 2k - 1 = 2n + 1 = 2(n+1) - 1 ✓

By induction, claim holds. ∎

---

## 📊 PRACTICE PROBLEMS

### Regular Languages (1-8)

1. **Prove**: DFA for L accepts w iff reading w backward from final states reaches initial state (for reversible DFA)

2. **Prove using Myhill-Nerode**: L = {0^i 1^j : i ≠ j} is not regular

3. **Pumping Lemma**: Prove L = {0^(n²) : n ≥ 0} is not regular

4. **Closure**: Prove regular languages closed under reversal

5. **Minimization**: Prove minimum DFA for L = {w : w has odd number of 1's} has exactly 2 states

6. **NFA**: Prove any NFA with n states can be converted to DFA with at most 2^n states

7. **Regex**: Prove (a*b*)* = (a|b)* using language equivalence

8. **Decidability**: Prove equivalence of two DFAs is decidable

### Context-Free Languages (9-16)

9. **CFG**: Prove grammar S → aSb | SS | ε generates all balanced parentheses (with a=(, b=))

10. **Pumping**: Prove L = {a^i b^j c^k : i < j < k} is not context-free

11. **PDA**: Construct and prove correct PDA for L = {ww^R : w ∈ {0,1}*}

12. **CNF**: Prove every CNF derivation of string w has exactly 2|w|-1 steps

13. **CYK**: Prove correctness of CYK algorithm by induction on substring length

14. **Ambiguity**: Prove grammar S → SS | aSb | ε is ambiguous

15. **Closure**: Prove CFLs are closed under union but not intersection

16. **Inherent Ambiguity**: Prove L = {a^n b^m c^m d^n} ∪ {a^n b^n c^m d^m} is inherently ambiguous

### Turing Machines & Computability (17-24)

17. **TM Simulation**: Prove 2-tape TM can be simulated by 1-tape TM

18. **Counting**: Prove there are countably many TMs but uncountably many languages

19. **Diagonalization**: Prove A_TM = {⟨M,w⟩ : M accepts w} is undecidable

20. **Reduction**: Prove REGULAR_TM = {⟨M⟩ : L(M) is regular} is undecidable

21. **Co-Recognizable**: Prove H̄ is not recognizable

22. **Rice**: Use Rice's theorem to prove "L(M) is infinite" is undecidable

23. **Computation History**: Prove A_TM ≤_m HALT_TM using computation histories

24. **Oracle**: Prove that even with halting oracle, some problems remain undecidable

### Complexity (25-30)

25. **Verifier**: Prove CLIQUE is in NP by giving polynomial-time verifier

26. **Reduction**: Prove 3-SAT ≤_p HAMPATH

27. **Space**: Prove PSPACE ⊇ NP

28. **Hierarchy**: Prove there exist problems in NP not in P (assuming P ≠ NP)

29. **Complement**: Prove coNP problems are closed under complement

30. **Savitch**: Prove PSPACE = NPSPACE using Savitch's theorem

---

## ✨ DETAILED SOLUTIONS

### Solution 2: L = {0^i 1^j : i ≠ j} not regular

**Using Myhill-Nerode**:

**Claim**: ≡_L has infinite index

**Proof**: Consider strings 0^k for k ≥ 0

**Distinguishability**: For m ≠ n:
- String z = 1^m distinguishes 0^m and 0^n
- 0^m 1^m ∈ L (since m = m is false!)
- Wait, need i ≠ j, so 0^m 1^m ∉ L
- Actually: 0^m 1^m ∉ L but 0^n 1^m ∈ L (if n ≠ m) ✓

Therefore strings {0^k : k ≥ 0} are all pairwise distinguishable.

Infinite equivalence classes → not regular by Myhill-Nerode. ∎

---

### Solution 10: L = {a^i b^j c^k : i < j < k} not CFL

**Using Pumping Lemma**:

**Assume** L is CFL with pumping length p.

**Choose** s = a^p b^(p+1) c^(p+2)

Clearly s ∈ L and |s| ≥ p.

By pumping lemma: s = uvxyz with |vxy| ≤ p, |vy| ≥ 1

**Case Analysis**:

**Case 1**: vxy contains only a's or only b's or only c's
- Pumping up increases one symbol type → violates i < j < k

**Case 2**: vxy spans two symbol types
- **Subcase 2a**: vxy spans a's and b's
  - v has a's, y has b's (or vice versa)
  - Pumping up: uv²xy²z adds both a's and b's
  - But increases both by same amount → still i < j
  - However, doesn't increase c's → eventually j ≥ k ✗

- **Subcase 2b**: vxy spans b's and c's
  - Similar argument ✗

**Case 3**: vxy spans all three symbols
- Impossible since |vxy| ≤ p but need span > p

All cases fail!

**CONTRADICTION** ⚡

Therefore L is not context-free. ∎

---

### Solution 19: A_TM Undecidable

**Using Diagonalization**:

**Assume** A_TM decidable by TM H:
```
H(⟨M⟩, w) = accept if M accepts w
           reject if M rejects/loops on w
```

**Construct** TM D:
```
D(⟨M⟩):
    if H(⟨M⟩, ⟨M⟩) accepts:
        loop forever
    else:
        accept
```

**Run** D(⟨D⟩):

If H(⟨D⟩, ⟨D⟩) accepts:
- Means D accepts ⟨D⟩
- But then D loops (by construction)
- CONTRADICTION ⚡

If H(⟨D⟩, ⟨D⟩) rejects:
- Means D rejects or loops on ⟨D⟩
- But then D accepts (by construction)
- CONTRADICTION ⚡

Therefore H cannot exist, so A_TM is undecidable. ∎

---

## 📖 INDEX

### A
- **Acceptance** - [DFA](#dfa-correctness-proofs), [PDA](#pda-proofs), [TM](#tm-correctness-proofs)
- **Ambiguity** - CFG property
- **A_TM** - [Undecidable](#halting-problem-proof)

### C
- **Cantor** - [Diagonalization](#diagonalization-method)
- **Cardinality** - [Countable/Uncountable](#set-theory-and-cardinality)
- **CFG** - [Correctness proofs](#cfg-correctness-proofs)
- **CFL** - [Pumping lemma](#pumping-lemma-cfl)
- **Chomsky Normal Form** - [CNF construction](#chomsky-normal-form)
- **Church-Turing Thesis** - [Effective computability](#church-turing-thesis)
- **Closure Properties** - [Regular](#closure-properties), CFL
- **Clique** - NP-complete problem
- **Complement** - [Regular languages closed](#closure-properties)
- **Computability** - [Turing machines](#turing-machines)
- **Cook-Levin** - [SAT is NP-complete](#cook-levin-theorem)
- **Countable** - [ℤ](#set-theory-and-cardinality), [ℚ](#set-theory-and-cardinality), [TMs](#set-theory-and-cardinality)
- **CYK Algorithm** - [Parsing in O(n³)](#cyk-parsing-algorithm)

### D
- **Decidability** - [Decidable languages](#decidable-languages)
- **DFA** - [Correctness proofs](#dfa-correctness-proofs)
- **Diagonalization** - [Cantor's method](#diagonalization-method), [Halting problem](#halting-problem-proof)

### E
- **E_TM** - Emptiness problem
- **Equivalence** - [DFA equivalence decidable](#decidable-languages)

### G
- **GNFA** - [Generalized NFA](#gnfa-conversion), [DFA to Regex](#gnfa-conversion)
- **Grammar Induction** - [Derivation length](#grammar-induction)
- **Halting Problem** - [Undecidable](#halting-problem-proof)

### I
- **Induction** - [Strings](#induction-on-strings), [Parse trees](#induction-on-parse-trees), [TM steps](#induction-on-tm-steps)

### L
- **Languages** - Regular, CFL, Decidable, Recognizable

### M
- **Myhill-Nerode** - [Theorem](#myhill-nerode-theorem)

### N
- **NFA** - [To DFA conversion](#nfa-to-dfa-subset-construction)
- **NP** - [Complexity class](#p-and-np)
- **NP-Complete** - [Cook-Levin](#cook-levin-theorem), [SAT](#cook-levin-theorem)

### P
- **P** - [Polynomial time](#p-and-np)
- **Parse Tree** - [Induction on](#parse-tree-induction)
- **PCP** - [Post Correspondence Problem](#post-correspondence-problem)
- **PDA** - [Pushdown automata](#pda-proofs)
- **Pumping Lemma** - [Regular](#pumping-lemma-regular), [CFL](#pumping-lemma-cfl)

### R
- **Recognizable** - vs Decidable
- **Reduction** - [Technique](#reduction-technique)
- **Regular Expression** - [Equivalence to DFA](#regex-equivalence-proof)
- **Rice's Theorem** - [Non-trivial properties](#rices-theorem)

### S
- **SAT** - [NP-complete](#cook-levin-theorem)
- **Structural Induction** - [On parse trees](#parse-tree-induction)
- **Subset Construction** - [NFA to DFA](#nfa-to-dfa-subset-construction)

### T
- **TM** - [Turing Machine](#turing-machines)
- **3-SAT** - NP-complete

### U
- **Uncountable** - [Real numbers](#diagonalization-method), [Languages](#set-theory-and-cardinality)
- **Undecidability** - [Halting problem](#halting-problem-proof), [Rice's theorem](#rices-theorem)
- **Universal TM** - [Construction](#universal-turing-machine)

---

**🚀 Master these techniques and understand the fundamental limits of computation!**

---

*"We can only see a short distance ahead, but we can see plenty there that needs to be done."* — Alan Turing

With these proof techniques, we can rigorously establish what can and cannot be computed!

**EOF** 🤖