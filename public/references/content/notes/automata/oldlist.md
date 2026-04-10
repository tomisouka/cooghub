# Theory of Computation - Quick Reference Guide

## Introduction (Chapter 0)

### Core Areas
- **Automata Theory** - Study of abstract machines and computational models
- **Computability Theory** - What problems can be solved by computation
- **Complexity Theory** - How efficiently problems can be solved

### Mathematical Foundations
- Sets, sequences, tuples
- Functions and relations
- Graphs
- Strings and languages
- Boolean logic

### Proof Techniques
- **Proof by Construction** - Building an example that demonstrates the claim
- **Proof by Contradiction** - Assuming the opposite and finding a logical impossibility
- **Proof by Induction** - Proving base case and inductive step

---

## Part One: Automata and Languages

## Chapter 1: Regular Languages

### 1.1 Finite Automata (FA)
- **Definition**: Simplest computational model with finite memory
- **Components**: States, alphabet, transitions, start state, accept states
- **Computation**: Processes input string symbol by symbol
- **Regular Operations**: Union, concatenation, star

### 1.2 Nondeterminism
- **NFAs (Nondeterministic Finite Automata)**: Can have multiple possible transitions
- **Key Result**: NFAs and DFAs are equivalent in power
- **Closure**: Regular languages closed under all regular operations

### 1.3 Regular Expressions
- **Definition**: Algebraic notation for describing regular languages
- **Operators**: Union (∪), concatenation (·), star (*)
- **Equivalence**: Regular expressions ≡ Finite automata

### 1.4 Nonregular Languages
- **Pumping Lemma**: Tool to prove languages are NOT regular
- **Application**: Shows languages like {0ⁿ1ⁿ | n ≥ 0} are nonregular

---

## Chapter 2: Context-Free Languages

### 2.1 Context-Free Grammars (CFG)
- **Definition**: Rules for generating strings (production rules)
- **Components**: Variables, terminals, start variable, productions
- **Ambiguity**: Multiple parse trees for same string
- **Chomsky Normal Form**: Standardized CFG format

### 2.2 Pushdown Automata (PDA)
- **Definition**: FA + stack memory
- **Power**: Recognizes context-free languages
- **Equivalence**: PDAs ≡ CFGs

### 2.3 Non-Context-Free Languages
- **Pumping Lemma for CFLs**: Tool to prove languages are NOT context-free
- **Example**: {aⁿbⁿcⁿ | n ≥ 0} is not context-free

### 2.4 Deterministic Context-Free Languages (DCFL)
- **DPDAs**: Deterministic pushdown automata
- **Properties**: Subset of CFLs with useful closure properties
- **Parsing**: LR(k) grammars for efficient parsing

---

## Part Two: Computability Theory

## Chapter 3: The Church-Turing Thesis

### 3.1 Turing Machines (TM)
- **Definition**: Unlimited memory model (infinite tape)
- **Components**: Tape, head, states, transition function
- **Power**: Most powerful computational model

### 3.2 Variants of Turing Machines
- **Multitape TMs**: Multiple tapes for convenience
- **Nondeterministic TMs**: Multiple computational paths
- **Enumerators**: Generate strings in a language
- **Key Result**: All variants have equal computational power

### 3.3 The Definition of Algorithm
- **Church-Turing Thesis**: Intuitive notion of algorithm = Turing machine
- **Hilbert's Problems**: Historical context for computability questions

---

## Chapter 4: Decidability

### 4.1 Decidable Languages
- **Definition**: Language with a TM that halts on all inputs
- **Examples**:
  - Problems about regular languages (membership, emptiness, equivalence)
  - Some problems about context-free languages

### 4.2 Undecidability
- **Diagonalization Method**: Technique from set theory
- **Halting Problem (Aₜₘ)**: Undecidable - can't determine if TM halts on input
- **Turing-Unrecognizable**: Languages that no TM can recognize

---

## Chapter 5: Reducibility

### 5.1 Undecidable Problems from Language Theory
- Using **reductions** to prove undecidability
- **Computation Histories**: Technique for proving undecidability

### 5.2 Simple Undecidable Problems
- Post Correspondence Problem (PCP)

### 5.3 Mapping Reducibility
- **Definition**: Problem A reduces to B if solution to B solves A
- **Applications**: Proving undecidability and incomputability

---

## Chapter 6: Advanced Computability Topics

### 6.1 The Recursion Theorem
- **Self-reference**: Programs that reference their own description
- **Applications**: Quines, fixed-point theorem

### 6.2 Decidability of Logical Theories
- Some theories decidable (e.g., Presburger arithmetic)
- Some theories undecidable (e.g., first-order logic)

### 6.3 Turing Reducibility
- More general form of reducibility using oracles

### 6.4 Information Theory
- **Kolmogorov Complexity**: Minimal description length
- **Incompressibility**: Random strings
- **Applications**: Defining randomness formally

---

## Part Three: Complexity Theory

## Chapter 7: Time Complexity

### 7.1 Measuring Complexity
- **Big-O Notation**: Upper bounds on growth rates
- **Small-o Notation**: Strict upper bounds
- **Analysis**: Worst-case running time

### 7.2 The Class P
- **Definition**: Problems solvable in polynomial time
- **Examples**: Path finding, linear programming, primality testing

### 7.3 The Class NP
- **Definition**: Problems verifiable in polynomial time
- **Examples**: SAT, clique, vertex cover, Hamiltonian path
- **P vs NP**: Major open question in computer science

### 7.4 NP-Completeness
- **Definition**: Hardest problems in NP
- **Polynomial-Time Reducibility**: Efficient transformations between problems
- **Cook-Levin Theorem**: SAT is NP-complete

### 7.5 Additional NP-Complete Problems
- Vertex Cover
- Hamiltonian Path
- Subset Sum

---

## Chapter 8: Space Complexity

### 8.1 Savitch's Theorem
- **Result**: NSPACE(f(n)) ⊆ SPACE(f²(n))

### 8.2 The Class PSPACE
- **Definition**: Problems solvable using polynomial space

### 8.3 PSPACE-Completeness
- **TQBF (True Quantified Boolean Formula)**: PSPACE-complete
- **Game Theory**: Winning strategies, generalized geography

### 8.4 Classes L and NL
- **L**: Logarithmic space
- **NL**: Nondeterministic logarithmic space

### 8.5 NL-Completeness
- **Graph Reachability**: NL-complete problem

### 8.6 NL equals coNL
- **Immerman-Szelepcsényi Theorem**: NL = coNL

---

## Chapter 9: Intractability

### 9.1 Hierarchy Theorems
- More time/space strictly allows solving more problems
- **Exponential Space Completeness**

### 9.2 Relativization
- Limits of diagonalization for P vs NP

### 9.3 Circuit Complexity
- Boolean circuits as computational model

---

## Chapter 10: Advanced Complexity Topics

### 10.1 Approximation Algorithms
- Near-optimal solutions for NP-hard problems

### 10.2 Probabilistic Algorithms
- **BPP Class**: Bounded-error probabilistic polynomial time
- **Primality Testing**: Efficient probabilistic algorithms
- **Read-Once Branching Programs**

### 10.3 Alternation
- Alternating Turing machines
- **Polynomial Time Hierarchy**

### 10.4 Interactive Proof Systems
- **Graph Nonisomorphism**
- **Result**: IP = PSPACE

### 10.5 Parallel Computation
- **Uniform Boolean Circuits**
- **Class NC**: Nick's Class (efficiently parallelizable)
- **P-Completeness**: Problems unlikely to parallelize

### 10.6 Cryptography
- **Secret Keys**: Symmetric encryption
- **Public-Key Cryptosystems**: Asymmetric encryption
- **One-Way Functions**: Easy to compute, hard to invert
- **Trapdoor Functions**: One-way with secret backdoor

---

## Quick Reference: Complexity Classes

| Class | Definition | Example Problems |
|-------|------------|------------------|
| **P** | Polynomial time | PATH, PRIMES, linear programming |
| **NP** | Nondeterministic polynomial time | SAT, CLIQUE, HAMPATH |
| **NP-Complete** | Hardest problems in NP | SAT, VERTEX-COVER, SUBSET-SUM |
| **PSPACE** | Polynomial space | TQBF, game strategies |
| **L** | Logarithmic space | Undirected graph connectivity |
| **NL** | Nondeterministic log space | Directed graph reachability |
| **BPP** | Bounded-error probabilistic | Probabilistic primality |
| **NC** | Efficiently parallelizable | Matrix multiplication, sorting |

## Key Relationships

```
L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE ⊆ EXPTIME
```

- **Known**: L ≠ PSPACE, P ≠ EXPTIME
- **Unknown**: P vs NP, NP vs PSPACE
- **Special**: NL = coNL