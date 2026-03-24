# COSC 3340: Introduction to Automata and Computability
**Reference Notes — Dr. Rakesh Verma, University of Houston, Spring 2026**
*Textbook: Sipser, Introduction to the Theory of Computation, 3rd ed.*

---

## Table of Contents

1. [Course Fundamentals](#1-course-fundamentals)
2. [Discrete Math Basics](#2-discrete-math-basics)
   - [2.1 Propositions & Logic](#21-propositions--logic)
   - [2.2 Proof Techniques](#22-proof-techniques)
   - [2.3 Sets, Relations, Functions](#23-sets-relations-functions)
   - [2.4 Cardinality of Sets](#24-cardinality-of-sets)
3. [Strings, Languages & Computation Models](#3-strings-languages--computation-models)
   - [3.1 Alphabets, Strings, Languages](#31-alphabets-strings-languages)
   - [3.2 Decision Problems](#32-decision-problems)
   - [3.3 Computation Model Hierarchy](#33-computation-model-hierarchy)
4. [Deterministic Finite Automata (DFA)](#4-deterministic-finite-automata-dfa)
   - [4.1 Informal Definition & Operation](#41-informal-definition--operation)
   - [4.2 Formal Definition](#42-formal-definition)
   - [4.3 DFA Examples](#43-dfa-examples)
5. [Regular Languages & Closure Properties](#5-regular-languages--closure-properties)
   - [5.1 Closure Under Union and Intersection](#51-closure-under-union-and-intersection)
   - [5.2 Product Construction](#52-product-construction)
6. [Nondeterministic Finite Automata (NFA)](#6-nondeterministic-finite-automata-nfa)
   - [6.1 NFA Definition & Acceptance](#61-nfa-definition--acceptance)
   - [6.2 NFA vs. DFA — Equivalence](#62-nfa-vs-dfa--equivalence)
   - [6.3 Epsilon Closure](#63-epsilon-closure)
7. [Regular Expressions](#7-regular-expressions)
   - [7.1 Definition & Language](#71-definition--language)
   - [7.2 Regular Expressions ↔ Finite Automata](#72-regular-expressions--finite-automata)
   - [7.3 DFA → Regular Expression (GNFA)](#73-dfa--regular-expression-gnfa)
8. [Pumping Lemma for Regular Languages](#8-pumping-lemma-for-regular-languages)
   - [8.1 Statement](#81-statement)
   - [8.2 Proof Idea](#82-proof-idea)
   - [8.3 Applying the Pumping Lemma](#83-applying-the-pumping-lemma)
9. [Context-Free Grammars (CFG)](#9-context-free-grammars-cfg)
   - [9.1 Informal Introduction](#91-informal-introduction)
   - [9.2 Formal Definition](#92-formal-definition)
   - [9.3 Derivations & Parse Trees](#93-derivations--parse-trees)
   - [9.4 Ambiguity](#94-ambiguity)
   - [9.5 Chomsky Normal Form (CNF)](#95-chomsky-normal-form-cnf)
   - [9.6 Closure Properties of CFLs](#96-closure-properties-of-cfls)
10. [Pushdown Automata (PDA)](#10-pushdown-automata-pda)
    - [10.1 Informal Description](#101-informal-description)
    - [10.2 Formal Definition](#102-formal-definition)
    - [10.3 PDA ↔ CFG Equivalence](#103-pda--cfg-equivalence)
    - [10.4 Deterministic PDA (DPDA)](#104-deterministic-pda-dpda)
11. [Pumping Lemma for Context-Free Languages](#11-pumping-lemma-for-context-free-languages)
    - [11.1 Statement](#111-statement)
    - [11.2 Proof Idea](#112-proof-idea)
    - [11.3 Applications](#113-applications)
12. [Turing Machines (TM)](#12-turing-machines-tm)
    - [12.1 Informal Description](#121-informal-description)
    - [12.2 Formal Definition](#122-formal-definition)
    - [12.3 Configurations & Acceptance](#123-configurations--acceptance)
    - [12.4 TM Example: {0ⁿ1ⁿ}](#124-tm-example-0n1n)
13. [TM Variants & Schemas](#13-tm-variants--schemas)
    - [13.1 2-Way Infinite Tape TM](#131-2-way-infinite-tape-tm)
    - [13.2 Multi-Tape TM](#132-multi-tape-tm)
14. [Decidability & Undecidability](#14-decidability--undecidability)
    - [14.1 Diagonalization Principle](#141-diagonalization-principle)
    - [14.2 The Halting Problem](#142-the-halting-problem)
    - [14.3 Recognizability vs. Decidability](#143-recognizability-vs-decidability)
15. [Key Theorems Quick Reference](#15-key-theorems-quick-reference)
16. [Alphabetical Index](#alphabetical-index)

---

## 1. Course Fundamentals

**Core question:** Are there problems that no computer can ever solve?

This course studies the *limits of computation* — showing that faster hardware or better algorithms do not always help, because some problems are fundamentally unsolvable.

**Goals:**
- Define precisely what computation means
- Understand the abilities and limitations of each model of computation
- Prove why certain problems are undecidable

**Grading:** HW 5% | Participation 5% | Quiz 1 5% | Quiz 2 10% | Quiz 3 15% | Project 20% | Final 40%

---

## 2. Discrete Math Basics

### 2.1 Propositions & Logic

A **proposition** is a statement that is either true or false.

| Operator | Symbol | Meaning |
|---|---|---|
| Conjunction | P ∧ Q | AND |
| Disjunction | P ∨ Q | OR |
| Negation | ¬P | NOT |
| Implication | P ⇒ Q | equivalent to ¬P ∨ Q |

**Quantifiers:**
- Universal: ∀x — "for all x"
- Existential: ∃x — "there exists an x"
- Unique Existential: ∃!x — "there exists exactly one x"

**⚠ Order matters with quantifiers:** ∀x ∃y P(x,y) is NOT the same as ∃y ∀x P(x,y).

### 2.2 Proof Techniques

| Technique | When to Use | Key Idea |
|---|---|---|
| **Construction** | "There exists…" | Explicitly build the object and verify it works |
| **Contradiction** | "Prove X is true" | Assume ¬X, derive a contradiction |
| **Contrapositive** | "If P then Q" | Prove ¬Q ⇒ ¬P instead |
| **Induction** | Statements over N | Base case + inductive step |
| **Diagonalization** | Uncountability / undecidability | Build an object that differs from every item in a list |

### 2.3 Sets, Relations, Functions

- A **set** is a collection of distinct elements: A = {1,2,3}, B = {x | x is even}
- A **function** f : D → R assigns each element of domain D exactly one element of range R. Formally: ∀d ∈ D, ∃!r ∈ R such that f(d) = r
- A function is **one-to-one (injective)** if f(a₁) = f(a₂) ⇒ a₁ = a₂
- A function is **onto (surjective)** if ∀b ∈ R, ∃a ∈ D, f(a) = b
- A **bijection** is both one-to-one and onto

### 2.4 Cardinality of Sets

**Definition:** Two sets have the same cardinality if there exists a bijection between them.

**Countable** = finite OR has same cardinality as ℕ.  
**Uncountable** = strictly larger than ℕ.

| Set | Countable? | Proof method |
|---|---|---|
| ℕ | Yes (trivially) | Identity bijection |
| ℤ | Yes | Map: 0→0, 1→1, 2→−1, 3→2, 4→−2, … |
| ℚ | Yes | Diagonal enumeration |
| ℝ | **No** | Cantor's diagonal argument |
| 2^ℕ (all subsets of ℕ) | **No** | Diagonalization |

---

## 3. Strings, Languages & Computation Models

### 3.1 Alphabets, Strings, Languages

- **Alphabet (Σ):** A finite, non-empty set of symbols. E.g., Σ = {0,1} or Σ = {a,…,z}
- **String:** A finite sequence of symbols from Σ. E.g., "0101", "abca"
- **ε (epsilon):** The empty string (length 0). Identity for concatenation: εu = uε = u
- **Σ\*:** The set of ALL strings over Σ (including ε)
- **Language:** Any set of strings L ⊆ Σ\*
- **∅:** The empty language (no strings — distinct from {ε}!)

**String relations:**
- u is a **prefix** of v if ∃w such that v = uw
- u is a **suffix** of v if ∃w such that v = wu
- u is a **substring** of v if ∃x, y such that v = xuy

### 3.2 Decision Problems

A **decision problem** is a problem with a Yes/No answer. Every decision problem can be encoded as a language: the language of all strings encoding YES instances.

**Examples:**
- "Is this string a palindrome?" → L_pal
- "Does this program halt?" → Halting Problem
- "Is this code parsable?" → L_parse

### 3.3 Computation Model Hierarchy

There is a strict hierarchy of power:

```
DFA  <  PDA  <  Turing Machine
(Regular)  (Context-Free)  (Recursively Enumerable)
```

Each model can decide everything the weaker model can, and more.

---

## 4. Deterministic Finite Automata (DFA)

### 4.1 Informal Definition & Operation

A DFA has:
- A **finite set of states**
- An **initial (start) state**
- One or more **accepting (final) states** (possibly zero)
- An **input alphabet** Σ
- A **transition table**: (state, symbol) → next state

**How it works:**
1. Begin in the start state
2. Read each input symbol left to right
3. Follow the transition to the next state
4. After reading the entire string: if in an **accepting state** → ACCEPT; otherwise → REJECT

**Dead state (q_d):** A "trap" state — all transitions from it loop back to itself. Used to handle invalid inputs.

### 4.2 Formal Definition

A DFA is M = (Q, Σ, δ, s, F) where:
- Q — finite set of states
- Σ — input alphabet
- δ : Q × Σ → Q — transition function (total, deterministic)
- s ∈ Q — start state
- F ⊆ Q — set of accepting states

**Extended transition function:** δ\*(q, w) — state reached from q after reading string w.

**L(M)** = {w ∈ Σ\* | δ\*(s, w) ∈ F} — the language *recognized* by M.

### 4.3 DFA Examples

| Language | Key Idea |
|---|---|
| L = {a} | Two states + dead state; accept only after exactly one 'a' |
| L = {a^(2n+1) \| n ≥ 0} = {a, aaa, …} | Two states toggling on each 'a'; accept on odd count |
| L = {w \| w has even number of a's} | Two states; toggle on 'a', stay on 'b' |
| L = {w \| w has at least one 1 and even 0's follow last 1} | Three states |

---

## 5. Regular Languages & Closure Properties

**Regular language:** Any language recognized by a DFA. Equivalently: generated by a regular expression, recognized by an NFA.

### 5.1 Closure Under Union and Intersection

**Theorem:** If L₁ and L₂ are regular, then L₁ ∪ L₂ and L₁ ∩ L₂ are also regular.

Regular languages are also closed under: concatenation, Kleene star, complement, set difference.

### 5.2 Product Construction

To build a DFA for L₁ ∪ L₂ or L₁ ∩ L₂, simulate both DFAs in parallel.

Given M₁ = (Q₁, Σ, δ₁, s₁, F₁) and M₂ = (Q₂, Σ, δ₂, s₂, F₂), construct M = (Q, Σ, δ, s, F) where:
- Q = Q₁ × Q₂ (pairs of states)
- s = (s₁, s₂)
- δ((q₁, q₂), σ) = (δ₁(q₁, σ), δ₂(q₂, σ))
- **For Union:** F = (Q₁ × F₂) ∪ (F₁ × Q₂) — at least one DFA in accepting state
- **For Intersection:** F = F₁ × F₂ — both DFAs in accepting state

---

## 6. Nondeterministic Finite Automata (NFA)

### 6.1 NFA Definition & Acceptance

An NFA generalizes a DFA by allowing:
- **0 or more** next states for a given (state, symbol) pair (guessing)
- **ε-transitions** — change state without reading input

**Formal definition:** NFA M = (Q, Σ, Δ, s, F) where:
- Δ ⊆ Q × Σ_ε × Q (relation, not function; Σ_ε = Σ ∪ {ε})

**Acceptance:** A string w is accepted if *there exists* at least one sequence of guesses leading to an accepting state.

**L(M)** = {w | Δ\*(q₀, w) ∩ F ≠ ∅}

### 6.2 NFA vs. DFA — Equivalence

**Theorem:** For every NFA M there exists an equivalent DFA M'.  
NFAs are NOT more powerful — they recognize exactly the same class (regular languages).

**Subset construction (NFA → DFA):**  
Given NFA M = (Q, Σ, Δ, s, F), construct DFA M' = (Q', Σ, δ, s', F') where:
- Q' = 2^Q (power set — one DFA state per *subset* of NFA states)
- s' = {s}
- F' = {P ∈ Q' | P ∩ F ≠ ∅} — any subset containing an accepting state
- δ({p₁, …, pₘ}, σ) = Δ\*(p₁, σ) ∪ … ∪ Δ\*(pₘ, σ)

**Note:** Many DFA states may be unreachable in practice; only reachable states need to be constructed.

### 6.3 Epsilon Closure

**ε-closure(q)** = the set of all states reachable from q using only ε-transitions (including q itself).

When handling ε-transitions in the subset construction, the start state becomes ε-closure({s}).

---

## 7. Regular Expressions

### 7.1 Definition & Language

**Regular expressions** are a third way to describe regular languages — a *generator* model (vs. DFA/NFA which are *acceptors*).

**Base cases:**
- ε is a regular expression; L(ε) = {ε}
- ∅ is a regular expression; L(∅) = ∅
- For any symbol a ∈ Σ, a is a regular expression; L(a) = {a}

**Closure operations:** If r, s are regular expressions:
- r ∪ s (union): L(r ∪ s) = L(r) ∪ L(s)
- rs (concatenation): L(rs) = L(r)L(s)
- r\* (Kleene star): L(r\*) = (L(r))\*

**Examples over {a,b}:**
- (a ∪ b)\* — all strings over {a,b}
- (a ∪ b)\*ab — all strings ending in "ab"
- (a ∪ b)\*a(a ∪ b)\* — all strings containing at least one 'a'

**Tip:** Regular expressions are harder to design for languages defined by complement or intersection — you must express these using ∪, concatenation, and \*.

### 7.2 Regular Expressions ↔ Finite Automata

**Theorem:** Regular expressions generate exactly the class of regular languages.
- (a) Every regular expression has an equivalent NFA (by structural induction on the regex)
- (b) Every DFA has an equivalent regular expression (via GNFA construction)

### 7.3 DFA → Regular Expression (GNFA)

A **GNFA (Generalized NFA)** has transitions labeled by regular expressions.

**Conversion steps:**
1. Convert DFA → special GNFA: add a new start state (no incoming edges) and a new unique final state (no outgoing edges), connected via ε-transitions
2. Eliminate states one at a time (not start/final): when eliminating state q_rip between states q_i and q_j with labels R₁, R₂, R₃, R₄, replace with a single transition labeled (R₁)(R₂)\*(R₃) ∪ (R₄)
3. The label on the remaining single transition is the resulting regular expression

---

## 8. Pumping Lemma for Regular Languages

### 8.1 Statement

If A is an **infinite regular language**, then there exists a pumping length **p** such that for every string s ∈ A with |s| ≥ p, s can be divided as s = xyz satisfying:
1. For each i ≥ 0, xy^i z ∈ A
2. |y| > 0 (y is non-empty)
3. |xy| ≤ p

**Reading:** y is the "pumped" part — you can repeat it any number of times (or remove it, i=0) and stay in the language.

### 8.2 Proof Idea

If a DFA with n states accepts a string of length m > n, by the **Pigeonhole Principle**, some state must repeat on the path from start to accept. The portion of the string that causes the cycle is y — it can be repeated any number of times.

### 8.3 Applying the Pumping Lemma

**To prove L is NOT regular** (proof by contradiction):
1. Assume L is regular with pumping length p
2. Choose a specific string s ∈ L with |s| ≥ p (strategically chosen)
3. Consider ALL possible ways to split s = xyz with |xy| ≤ p and |y| > 0
4. Show that for ALL such splits, some pumping xy^i z ∉ L for some i
5. Contradiction — L is not regular

**Classic examples of non-regular languages:**
- L = {aⁿbⁿ | n ≥ 0} — requires counting unbounded n
- L = {ww^R | w ∈ {0,1}\*} — palindromes (DFA cannot reverse)
- L = {aⁿ | n is prime}

---

## 9. Context-Free Grammars (CFG)

### 9.1 Informal Introduction

A CFG is a finite set of **rules (productions)** of the form: \<nonterminal\> → string of terminals and nonterminals.

- **Terminals:** Symbols appearing in final generated strings (e.g., {a,b,c,…})
- **Nonterminals:** Placeholder symbols to which rules apply (e.g., S, A, B, E)
- **Start symbol S:** The nonterminal from which derivation begins
- **Production rule:** A → w means nonterminal A can be replaced by string w

**Example — arithmetic expressions:**  
`E → E + E | E * E | (E) | x | y`

### 9.2 Formal Definition

A CFG G = (V, T, P, S) where:
- V — finite set of **nonterminals**
- T — finite set of **terminals** (V ∩ T = ∅)
- P ⊆ V × (V ∪ T)\* — finite set of **productions**; write A → w for (A, w) ∈ P
- S ∈ V — **start symbol**

**L(G)** = {w ∈ T\* | S ⇒\* w} — all terminal strings derivable from S.  
A language L is **context-free (CFL)** if there exists a CFG G with L(G) = L.

### 9.3 Derivations & Parse Trees

- **One-step derivation (⇒):** u ⇒ v if u = xAy, v = xwy, and A → w is in P
- **Multi-step derivation (⇒\*):** 0 or more steps
- **Leftmost derivation:** Always replace the leftmost nonterminal
- **Rightmost derivation:** Always replace the rightmost nonterminal

**Parse tree:** A tree representation of a derivation where internal nodes are nonterminals, leaves are terminals (or ε), and children of a node A represent the right-hand side of the rule applied to A.

**Example:** S → aSb | ε generates L = {aⁿbⁿ | n ≥ 0}

### 9.4 Ambiguity

A CFG is **ambiguous** if some string has **two or more distinct leftmost derivations** (equivalently, two different parse trees).

- Grammar `E → E + E | E * E | (E) | x | y` is **ambiguous** — no precedence is enforced
- Grammar `E → E + T | T; T → T * F | F; F → (E) | x | y` is **unambiguous** — enforces precedence

A CFL is **inherently ambiguous** if every CFG generating it is ambiguous.  
Example: {aⁿbⁿcᵐ | n,m ≥ 0} ∪ {aᵐbⁿcⁿ | n,m ≥ 0}

### 9.5 Chomsky Normal Form (CNF)

A CFG is in **CNF** if every production is one of:
- A → a (terminal)
- A → BC, where B, C are nonterminals ≠ S

(Only S → ε is allowed additionally if ε ∈ L(G))

**Why CNF?** Simpler proofs, leads to efficient algorithms (e.g., CYK parsing).

**To convert any CFG to CNF:** Eliminate ε-productions, unit rules, and long right-hand sides.

### 9.6 Closure Properties of CFLs

| Operation | Closed? |
|---|---|
| Union | ✅ Yes |
| Concatenation | ✅ Yes |
| Kleene Star | ✅ Yes |
| Intersection | ❌ No |
| Complement | ❌ No |
| Intersection with a regular language | ✅ Yes |

**Example of non-closure under intersection:**  
L = {w | w has equal a's and b's} and L' = {w | w has equal b's and c's} are both CFLs.  
But L ∩ L' = {w | equal a's, b's, and c's} is **not** a CFL (shown via pumping lemma).

**DeMorgan:** Since CFLs are not closed under intersection, and they are closed under union, they also cannot be closed under complement.

---

## 10. Pushdown Automata (PDA)

### 10.1 Informal Description

A PDA is like an NFA augmented with an **infinite stack** (LIFO memory). It uses the stack to remember unbounded information during computation.

**In one move, a PDA can:**
- Change state
- Consume a symbol from input (or use ε — skip consuming)
- Pop a symbol from the stack (or use ε — don't pop)
- Push a symbol onto the stack (or push ε — don't push)

**Acceptance:** A string is accepted if the machine, starting in the start state, consumes the full input and reaches a final state (with stack in accepted configuration).

**Notation for transition:** In state q, consume input u, pop x from stack, go to state q', push w:  
`u, x → w` (label on edge from q to q')

### 10.2 Formal Definition

A PDA M = (K, Σ, Γ, Δ, s, F) where:
- K — finite set of states
- Σ — input alphabet
- Γ — stack alphabet
- s ∈ K — start state
- F ⊆ K — set of final states
- Δ ⊆ (K × Σ_ε × Γ_ε) × (K × Γ_ε) — transition relation

**Acceptance:** M accepts w if (f, ε, ε) ∈ Δ\*(s, w, ε) for some f ∈ F (reaches final state with empty stack after consuming w).

**Classic example:** PDA for L = {aⁿbⁿ | n ≥ 0}  
Push 'a's onto stack while reading a's; pop one 'a' for each 'b' read.

### 10.3 PDA ↔ CFG Equivalence

**Theorem:** L is a CFL if and only if some PDA recognizes L.

**CFG → PDA construction:**  
Given CFG G = (V, Σ, R, S), construct PDA M = (Q, Σ, V ∪ {$}, Δ, q_start, {q_accept}) where:
1. (q_start, ε, ε) → (q_loop, S$): push start symbol and marker
2. For each rule A → w: (q_loop, ε, A) → (q_loop, w): nondeterministically expand A
3. For each terminal a ∈ Σ: (q_loop, a, a) → (q_loop, ε): match terminal and pop
4. (q_loop, ε, $) → (q_accept, ε): accept when done

The PDA simulates a **leftmost derivation** of the input string.

**PDA → CFG construction (key idea):**  
First normalize the PDA to have a single accept state, empty stack before accepting, and each transition either pushes or pops (not both). Then construct nonterminals A_pq representing "all strings that take P from state p to state q with empty stack" and build rules accordingly.

### 10.4 Deterministic PDA (DPDA)

A PDA is **deterministic (DPDA)** if for every (q, a, b): δ(q, a, b) contains at most one element, AND if δ(q, ε, b) is non-empty, then δ(q, c, b) is empty for all c ∈ Σ.

A language is a **DCFL** if some DPDA recognizes it.

| Property | DPDA | NPDA |
|---|---|---|
| Power | Less powerful | More powerful |
| Palindromes (odd-length) | ✅ Yes | ✅ Yes |
| Palindromes (even-length) | ❌ No | ✅ Yes |
| NPDA → DPDA conversion | Not always possible | — |
| Languages accepted | DCFL ⊂ CFL | Full CFL |

---

## 11. Pumping Lemma for Context-Free Languages

### 11.1 Statement

If A is an **infinite CFL**, then there exists a pumping length **p** such that for every string s ∈ A with |s| ≥ p, s can be divided as **s = uvxyz** satisfying:
1. For each i ≥ 0, uv^i xy^i z ∈ A
2. |vy| > 0 (at least one of v, y is non-empty)
3. |vxy| ≤ p

**Key difference from regular pumping lemma:** There are now **two** pumped pieces (v and y), split by x in between. Both must be pumped simultaneously.

### 11.2 Proof Idea

For a sufficiently long string derived by a CFG in CNF, some path in the parse tree must have height > |V| (number of nonterminals). By the **Pigeonhole Principle**, some nonterminal R repeats on this path. The repeated R creates two subtrees — the outer one yields vRy, the inner one yields x. Since R can replace itself, v and y can be pumped simultaneously.

**Pumping length:** p = b^(|V|+2) where b = maximum branching factor of the grammar.

### 11.3 Applications

**To prove L is NOT context-free:**
1. Assume L is a CFL with pumping length p
2. Choose s ∈ L with |s| ≥ p
3. For ALL ways to split s = uvxyz with |vy| > 0, |vxy| ≤ p
4. Show uv^i xy^i z ∉ L for some i

**L = {aⁿbⁿcⁿ | n ≥ 0} is NOT context-free:**  
Take s = a^p b^p c^p. Since |vxy| ≤ p, v and y cannot span all three symbol types. In Case 1 (v, y each contain one symbol type), pumping disrupts the equal count. In Case 2 (v or y spans two types), pumping creates out-of-order symbols. Both cases yield a contradiction.

**Other non-CFLs:**
- {a^(n²) | n ≥ 0}
- {w ∈ {a,b,c}\* | w has equal a's, b's, and c's}

**Tips:** Closure properties can often shorten pumping lemma arguments. E.g., to show L is not a CFL, sometimes intersect with a regular language first to simplify.

---

## 12. Turing Machines (TM)

### 12.1 Informal Description

A TM has an **infinite read/write tape** (bi-directional) and a finite control. It is the most powerful computation model — it captures the intuitive notion of "algorithm."

**In one move, a TM can:**
1. Change state
2. Write a symbol on the scanned cell
3. Move the head one cell left (L) or right (R)

If no transition applies, the machine **halts**. A TM can be designed to compute functions, decide languages, or accept languages.

**Important distinction:**
- **Decide L:** TM always halts and accepts/rejects correctly
- **Recognize L:** TM accepts all strings in L but may loop (never halt) on strings not in L
- **Decidable ⊂ Recognizable (Turing-acceptable)**

### 12.2 Formal Definition

A TM M = (Q, Σ, Γ, δ, s) where:
- Q — finite set of states
- Σ — input alphabet (does not contain blank □)
- Γ ⊇ Σ ∪ {□} — tape alphabet (Γ is the full tape symbol set)
- s ∈ Q — start state
- δ : Q × Γ → Q × Γ × {L, R} — partial transition function

Special states: q_accept (halt and accept), q_reject (halt and reject).

### 12.3 Configurations & Acceptance

A **configuration** is a snapshot: uqv (tape content u to left of head, current state q, tape content v at and right of head).

- **Start configuration** on input w: q₀w
- **Accepting configuration:** state = q_accept
- **Rejecting configuration:** state = q_reject
- Accepting/rejecting are **halting** configurations — no further steps

**Configuration C₁ yields C₂** if TM can legally go from C₁ to C₂ in one step.

**M accepts w** if there exists a sequence C₁, C₂, …, Cₖ where:
1. C₁ is the start configuration q₀w
2. Each Cᵢ yields Cᵢ₊₁
3. Cₖ is an accepting configuration

**L(M)** = collection of all strings M accepts.

### 12.4 TM Example: {0ⁿ1ⁿ}

**English algorithm:**
1. Scan right; if 0 found, replace with x and move right; if not, reject
2. Scan past 0's and y's until reaching a 1
3. If 1 found, replace with y and move left; if not, reject
4. Move left past 0's and y's
5. If x found, move right; if 0 found go to step 2; if no 0 found, scan past y's and accept

**States and transitions (abbreviated):**

| State | Symbol | Next State | Action |
|---|---|---|---|
| q₀ | 0 | q₁ | Write x, move R |
| q₀ | y | q₃ | Write y, move R |
| q₁ | 0 | q₁ | Write 0, move R |
| q₁ | 1 | q₂ | Write y, move L |
| q₁ | y | q₁ | Write y, move R |
| q₂ | 0 | q₂ | Write 0, move L |
| q₂ | x | q₀ | Write x, move R |
| q₂ | y | q₂ | Write y, move L |
| q₃ | y | q₃ | Write y, move R |
| q₃ | □ | q₄ | Write □, move R |
| q₄ | □ | halt/accept | — |

---

## 13. TM Variants & Schemas

All variants below are **equivalent in power** to the basic TM — they recognize the same class of languages.

### 13.1 2-Way Infinite Tape TM

A TM where the tape extends infinitely in **both directions** (no leftmost cell).

**Simulation with basic TM:** Divide the tape into two tracks — upper track holds positions 0, 1, 2, … and lower track holds positions −1, −2, −3, … (reversed). A special marker $ marks the boundary. The basic TM simulates moves on each track, swapping which track is "active" at the boundary.

**Configuration:** Quadruple (q, w, a, u) — state, left tape content, current symbol, right tape content.

### 13.2 Multi-Tape TM

A TM with **k tapes**, each with its own independent read/write head.

**Theorem:** Every k-tape TM has an equivalent 1-tape TM.

**Simulation (Sipser's approach):** Store all k tape contents on a single tape, separated by □ delimiters. Use "dotted" symbols to track head positions. A single simulated step requires O(tape length) basic TM steps.

**Multi-tape TM schemas:** TMs can be composed sequentially. If I, M₁', F are TMs for initialization, simulation, and finalization, the composed machine is: >I → M₁' → F

---

## 14. Decidability & Undecidability

### 14.1 Diagonalization Principle

Given any set S and a relation R on S, **the complement of the diagonal differs from every row**.

**Application:** Used to show certain enumerations cannot be exhaustive — proving some sets are uncountable or some problems are undecidable.

**2^ℕ is uncountable:** Suppose 2^ℕ = {S₀, S₁, S₂, …} were countable. Define D = {i ∈ ℕ | i ∉ Sᵢ}. Then D differs from every Sᵢ at position i, so D cannot appear in the enumeration — contradiction.

### 14.2 The Halting Problem

**Halting Problem:** Is there a general TM H that, given any TM P and input X, always correctly decides whether P halts on X?

**Theorem:** The Halting Problem is **undecidable**.

**Proof by contradiction (diagonalization):**
1. Assume H decides halting correctly
2. Construct TM D(P): "Run H(P,P). If H says P halts on P, then loop forever. If H says P doesn't halt on P, then halt."
3. Run D(D): If H says D(D) halts → D(D) loops (contradiction). If H says D(D) doesn't halt → D(D) halts (contradiction).
4. Either way, contradiction — H cannot exist.

**Busy Beaver Problem (BB(n)):** Among all n-state TMs that halt on blank input, BB(n) = maximum number of 1s printed before halting. BB(n) is **not computable** — if it were, we could solve the halting problem.

### 14.3 Recognizability vs. Decidability

| Property | Language Class |
|---|---|
| Decided by TM (always halts) | **Decidable** (recursive) |
| Recognized by TM (may loop on non-inputs) | **Turing-recognizable** (recursively enumerable) |
| Neither recognized nor co-recognized | Undecidable and unrecognizable |

**{⟨M, w⟩ | M accepts w}** (A_TM) is Turing-recognizable but **not decidable**.  
Its complement is **not** Turing-recognizable.

**Reducibility:** If A reduces to B and B is decidable, then A is decidable. Contrapositive: if A is undecidable and A reduces to B, then B is undecidable.

---

## 15. Key Theorems Quick Reference

| Theorem | Statement |
|---|---|
| DFA = NFA | Every NFA has an equivalent DFA (subset construction) |
| DFA = Regex | Regular expressions generate exactly the regular languages |
| Pumping Lemma (Regular) | Every infinite regular language can be pumped in 3 pieces |
| CFL = PDA | Every CFL has an equivalent PDA, and vice versa |
| Pumping Lemma (CFL) | Every infinite CFL can be pumped in 5 pieces (uvxyz) |
| CFL closure | CFLs closed under ∪, concatenation, \*, ∩(regular); NOT closed under ∩, complement |
| Regular closure | Regular languages closed under all boolean operations + concatenation + \* |
| Church-Turing Thesis | Intuitive notion of algorithm = Turing machine |
| Halting Problem | Undecidable — no TM can decide whether an arbitrary TM halts |
| TM variants equivalence | Multi-tape, 2-way infinite tape, nondeterministic TM all equal basic TM in power |
| A_TM recognizable | {⟨M,w⟩ | M accepts w} is Turing-recognizable but not decidable |

---

## Alphabetical Index

| Term | Section |
|---|---|
| Acceptance (DFA) | [§4.1](#41-informal-definition--operation) |
| Acceptance (NFA) | [§6.1](#61-nfa-definition--acceptance) |
| Acceptance (PDA) | [§10.1](#101-informal-description) |
| Acceptance (TM) | [§12.3](#123-configurations--acceptance) |
| Alphabet (Σ) | [§3.1](#31-alphabets-strings-languages) |
| Ambiguity (CFG) | [§9.4](#94-ambiguity) |
| A_TM (accepting TM problem) | [§14.3](#143-recognizability-vs-decidability) |
| Bijection | [§2.3](#23-sets-relations-functions) |
| Busy Beaver Problem | [§14.2](#142-the-halting-problem) |
| Cardinality | [§2.4](#24-cardinality-of-sets) |
| CFG (Context-Free Grammar) | [§9](#9-context-free-grammars-cfg) |
| CFL (Context-Free Language) | [§9.2](#92-formal-definition) |
| Church-Turing Thesis | [§15](#15-key-theorems-quick-reference) |
| Chomsky Normal Form (CNF) | [§9.5](#95-chomsky-normal-form-cnf) |
| Closure properties (CFL) | [§9.6](#96-closure-properties-of-cfls) |
| Closure properties (Regular) | [§5](#5-regular-languages--closure-properties) |
| Computation model hierarchy | [§3.3](#33-computation-model-hierarchy) |
| Concatenation | [§3.1](#31-alphabets-strings-languages) |
| Configuration (TM) | [§12.3](#123-configurations--acceptance) |
| Context-Free Grammar | [§9](#9-context-free-grammars-cfg) |
| Countable / Uncountable | [§2.4](#24-cardinality-of-sets) |
| Dead state | [§4.1](#41-informal-definition--operation) |
| Decidable language | [§14.3](#143-recognizability-vs-decidability) |
| Decision problem | [§3.2](#32-decision-problems) |
| DFA (Deterministic Finite Automaton) | [§4](#4-deterministic-finite-automata-dfa) |
| Diagonal argument | [§14.1](#141-diagonalization-principle) |
| DPDA (Deterministic PDA) | [§10.4](#104-deterministic-pda-dpda) |
| Empty language (∅) | [§3.1](#31-alphabets-strings-languages) |
| Empty string (ε) | [§3.1](#31-alphabets-strings-languages) |
| Epsilon closure | [§6.3](#63-epsilon-closure) |
| Extended transition function (δ\*) | [§4.2](#42-formal-definition) |
| GNFA (Generalized NFA) | [§7.3](#73-dfa--regular-expression-gnfa) |
| Halting Problem | [§14.2](#142-the-halting-problem) |
| Inherently ambiguous CFL | [§9.4](#94-ambiguity) |
| Kleene star (\*) | [§7.1](#71-definition--language) |
| Language | [§3.1](#31-alphabets-strings-languages) |
| L(G) — language of grammar | [§9.2](#92-formal-definition) |
| L(M) — language of automaton | [§4.2](#42-formal-definition) |
| Leftmost derivation | [§9.3](#93-derivations--parse-trees) |
| Multi-tape TM | [§13.2](#132-multi-tape-tm) |
| NFA (Nondeterministic Finite Automaton) | [§6](#6-nondeterministic-finite-automata-nfa) |
| Nonterminal | [§9.1](#91-informal-introduction) |
| Parse tree | [§9.3](#93-derivations--parse-trees) |
| PDA (Pushdown Automaton) | [§10](#10-pushdown-automata-pda) |
| Pigeonhole Principle | [§8.2](#82-proof-idea) |
| Prefix, Suffix, Substring | [§3.1](#31-alphabets-strings-languages) |
| Production rule | [§9.1](#91-informal-introduction) |
| Proof by contradiction | [§2.2](#22-proof-techniques) |
| Pumping Lemma (CFL) | [§11](#11-pumping-lemma-for-context-free-languages) |
| Pumping Lemma (Regular) | [§8](#8-pumping-lemma-for-regular-languages) |
| Quantifiers (∀, ∃, ∃!) | [§2.1](#21-propositions--logic) |
| Recognizable language | [§14.3](#143-recognizability-vs-decidability) |
| Reducibility | [§14.3](#143-recognizability-vs-decidability) |
| Regular expression | [§7](#7-regular-expressions) |
| Regular language | [§5](#5-regular-languages--closure-properties) |
| Rightmost derivation | [§9.3](#93-derivations--parse-trees) |
| Start symbol | [§9.1](#91-informal-introduction) |
| Subset construction (NFA → DFA) | [§6.2](#62-nfa-vs-dfa--equivalence) |
| Terminal | [§9.1](#91-informal-introduction) |
| Transition function (δ) | [§4.2](#42-formal-definition) |
| Turing Machine (TM) | [§12](#12-turing-machines-tm) |
| TM configuration | [§12.3](#123-configurations--acceptance) |
| TM variants | [§13](#13-tm-variants--schemas) |
| 2-way infinite tape TM | [§13.1](#131-2-way-infinite-tape-tm) |
| Undecidable problem | [§14.2](#142-the-halting-problem) |

---

*End of reference — COSC 3340 Spring 2026*