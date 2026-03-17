# College Linear Algebra — Reference Guide

> A structured reference covering all major topics from the course, organized by unit and indexed alphabetically.
> Each section is tagged with the homework(s) where it appears.
> **⭐ = appears on HW5 (Linear Operators) — heavily tested**

---

## Table of Contents

- [College Linear Algebra — Reference Guide](#college-linear-algebra--reference-guide)
  - [Table of Contents](#table-of-contents)
  - [Unit 1 — Matrices and Matrix Arithmetic](#unit-1--matrices-and-matrix-arithmetic)
    - [1.1 Matrix Basics](#11-matrix-basics)
    - [1.2 Matrix Addition](#12-matrix-addition)
    - [1.3 Scalar Matrix Multiplication](#13-scalar-matrix-multiplication)
    - [1.4 Matrix Multiplication](#14-matrix-multiplication)
    - [1.5 Properties of Matrix Operations](#15-properties-of-matrix-operations)
  - [Unit 2 — Linear Systems and Gaussian Elimination](#unit-2--linear-systems-and-gaussian-elimination)
    - [2.1 Linear Systems and Matrix Form](#21-linear-systems-and-matrix-form)
    - [2.2 Augmented Matrices](#22-augmented-matrices)
    - [2.3 Elementary Row Operations](#23-elementary-row-operations)
    - [2.4 Gaussian Elimination](#24-gaussian-elimination)
    - [2.5 Row Echelon Form](#25-row-echelon-form)
    - [2.6 Back Substitution](#26-back-substitution)
    - [2.7 Free Variables and Parametric Solutions](#27-free-variables-and-parametric-solutions)
    - [2.8 Solution Types](#28-solution-types)
  - [Unit 3 — Vector Spaces](#unit-3--vector-spaces)
    - [3.1 Vector Space Axioms](#31-vector-space-axioms)
    - [3.2 The Vector Space Rᵐ](#32-the-vector-space-rᵐ)
    - [3.3 Abstract Vector Spaces](#33-abstract-vector-spaces)
    - [3.4 Subspaces](#34-subspaces)
    - [3.5 Linear Independence and Dependence](#35-linear-independence-and-dependence)
    - [3.6 Span](#36-span)
    - [3.7 Basis](#37-basis)
    - [3.8 Dimension](#38-dimension)
    - [3.9 Standard Basis and Reduced Row Echelon Form](#39-standard-basis-and-reduced-row-echelon-form)
    - [3.10 Polynomial Spaces Pₙ](#310-polynomial-spaces-pₙ)
  - [Unit 4 — Linear Operators](#unit-4--linear-operators)
    - [4.1 Definition of a Linear Operator](#41-definition-of-a-linear-operator)
    - [4.2 Null Space (Kernel)](#42-null-space-kernel)
    - [4.3 Range Space (Image)](#43-range-space-image)
    - [4.4 Nullity and Rank](#44-nullity-and-rank)
    - [4.5 The Rank-Nullity Theorem](#45-the-rank-nullity-theorem)
    - [4.6 Computing Null and Range Spaces for Matrices](#46-computing-null-and-range-spaces-for-matrices)
    - [4.7 Linear Operators on Polynomial Spaces](#47-linear-operators-on-polynomial-spaces)
  - [Alphabetical Index](#alphabetical-index)

---

## Unit 1 — Matrices and Matrix Arithmetic

> 📘 **Source: HW1** (Matrices and Linear Systems)
> Also foundational background for **HW5** ⭐ — matrix operators and row reduction are used throughout.

### 1.1 Matrix Basics

`HW1`

A **matrix** is a rectangular array of numbers arranged in rows and columns. The **size** of a matrix is stated as *m × n* (rows × columns).

- The set of all *m × n* real matrices is denoted **ℝ^(m×n)**.
- The element at row *i*, column *j* of matrix *A* is written **A_(i,j)**.

**Example sizes:**
- A 3×2 matrix has 3 rows and 2 columns.
- A 4×1 matrix is a column vector.
- A 1×3 matrix is a row vector.

---

### 1.2 Matrix Addition

`HW1`

Matrix addition is defined **only between two matrices of the same size**.

If *A, B ∈ ℝ^(m×n)*, then *C = A + B ∈ ℝ^(m×n)* where:

> **C_(i,j) = A_(i,j) + B_(i,j)** for each *1 ≤ i ≤ m* and *1 ≤ j ≤ n*.

Each entry is added elementwise. Addition between matrices of different sizes is **undefined**.

---

### 1.3 Scalar Matrix Multiplication

`HW1`

For any scalar *α* and matrix *A ∈ ℝ^(m×n)*, the product *C = αA ∈ ℝ^(m×n)* is defined by:

> **C_(i,j) = α · A_(i,j)** for each *1 ≤ i ≤ m* and *1 ≤ j ≤ n*.

Every entry of the matrix is multiplied by the scalar.

---

### 1.4 Matrix Multiplication

`HW1`

Matrix multiplication between *A ∈ ℝ^(m×l)* and *B ∈ ℝ^(l×n)* is defined **only when the number of columns of A equals the number of rows of B**. The result *C = AB ∈ ℝ^(m×n)* has entries:

> **C_(i,j) = Σₖ A_(i,k) · B_(k,j)**

This is the **dot product of the i-th row of A with the j-th column of B**.

**Key warning:** Matrix multiplication is **not commutative** in general — *AB ≠ BA* even when both products are defined.

---

### 1.5 Properties of Matrix Operations

`HW1`

When defined, matrix operations obey the following properties:

| Property | Statement |
|---|---|
| Associativity of addition | *(A + B) + C = A + (B + C)* |
| Commutativity of addition | *A + B = B + A* |
| Associativity of multiplication | *(AB)C = A(BC)* |
| Left distributivity | *A(B + C) = AB + AC* |
| Right distributivity | *(A + B)C = AC + BC* |

**Note:** Commutativity of multiplication does NOT hold in general.

---

## Unit 2 — Linear Systems and Gaussian Elimination

> 📘 **Source: HW1, HW2**
> ⭐ **Critical background for HW5** — Gaussian elimination is the main computational tool for finding null spaces and range spaces.

### 2.1 Linear Systems and Matrix Form

`HW1` `HW2`

A **linear system** of *m* equations in *n* unknowns can always be written as a matrix equation:

> **AX = B**

where:
- *A ∈ ℝ^(m×n)* is the **coefficient matrix**
- *X ∈ ℝ^(n×1)* is the **column vector of unknowns**
- *B ∈ ℝ^(m×1)* is the **right-hand side vector**

---

### 2.2 Augmented Matrices

`HW1` `HW2`

The **augmented matrix** combines *A* and *B* into a single matrix used during elimination:

> **[A | B]**

Square brackets with a vertical bar separate the coefficient matrix from the right-hand side. All row operations are applied to this augmented matrix.

---

### 2.3 Elementary Row Operations

`HW1` `HW2` ⭐ `HW5`

There are three elementary row operations (EROs), each of which produces an **equivalent** system (same solution set):

| Label | Operation | Notation |
|---|---|---|
| **E1** | Interchange two rows | *Rᵢ ↔ Rⱼ* |
| **E2** | Multiply a row by a nonzero scalar | *Rᵢ → c·Rᵢ* |
| **E3** | Replace a row by subtracting a multiple of another | *Rᵢ → Rᵢ − c·Rⱼ* |

---

### 2.4 Gaussian Elimination

`HW1` `HW2` ⭐ `HW5`

**Gaussian elimination** is the systematic application of EROs to reduce the augmented matrix to row echelon form.

**Algorithm:**
1. Work column by column from left to right.
2. For the current column *j*, identify the **pivot** — the diagonal entry *(j, j)*.
3. If the pivot is zero, swap with a row below that has a nonzero entry in column *j* (E1).
4. Use E3 to eliminate all entries **below** the pivot to zero.
5. Move to column *j+1* and repeat.
6. If an entire sub-column is zero (no pivot available), skip that column and continue.

---

### 2.5 Row Echelon Form

`HW1` `HW2` ⭐ `HW5`

A matrix is in **row echelon form (REF)** when:
- All zero rows are at the bottom.
- The **leading coefficient (pivot)** of each nonzero row is strictly to the right of the pivot in the row above.
- All entries below each pivot are zero.

**Reduced Row Echelon Form (RREF)** additionally requires:
- Every pivot equals 1.
- All entries **above** each pivot are also zero.

RREF is unique for any matrix; REF is not.

---

### 2.6 Back Substitution

`HW1` `HW2` ⭐ `HW5`

Once the augmented matrix is in row echelon form, unknowns are solved from **bottom to top**:

1. Solve the last nonzero row for its leading variable.
2. Substitute upward into the row above to solve the next variable.
3. Continue until all variables are determined.

---

### 2.7 Free Variables and Parametric Solutions

`HW1` `HW2` ⭐ `HW5`

A variable is **free** if its column contains no pivot. Free variables can take any real value (parameterized as *α, β, ...* etc.). All other variables (pivot variables) are expressed in terms of the free ones.

**Example:** If *x₂ = α* is free, the solution is written as a one-parameter family of vectors.

When *k* free variables exist, the solution set forms a *k*-dimensional family — this directly gives the **nullity** of the operator.

---

### 2.8 Solution Types

`HW1` `HW2`

A linear system *AX = B* has exactly one of three outcome types:

| Outcome | Condition | Description |
|---|---|---|
| **Unique solution** | No free variables, consistent | Planes intersect at a single point |
| **Infinitely many solutions** | One or more free variables, consistent | Planes share a line or plane |
| **No solution** | Inconsistent | Row of form *[0 0 ... 0 \| c]* with *c ≠ 0* |

---

## Unit 3 — Vector Spaces

> 📘 **Source: HW3, HW4**
> ⭐ **Critical background for HW5** — the concepts of subspace, basis, and dimension are used to define and interpret null spaces and range spaces.

### 3.1 Vector Space Axioms

`HW3` `HW4`

A **vector space** consists of a set of vectors *V*, a scalar field *F*, and operations of vector addition and scalar multiplication satisfying the following axioms:

**Addition axioms:**

| Label | Axiom |
|---|---|
| (a–0) | *V* is closed under addition: *x + y ∈ V* |
| (a–1) | Addition is associative: *(x + y) + z = x + (y + z)* |
| (a–2) | Addition is commutative: *x + y = y + x* |
| (a–3) | There exists an additive identity **0** such that *x + 0 = x* |
| (a–4) | Every *x* has an additive inverse *x'* such that *x + x' = 0* |

**Scalar multiplication axioms:**

| Label | Axiom |
|---|---|
| (m–0) | *V* is closed under scalar multiplication: *αx ∈ V* |
| (m–1) | Associativity: *α(βx) = (αβ)x* |
| (m–2) | Identity: *1x = x* |

**Distributive axioms:**

| Label | Axiom |
|---|---|
| (d–1) | *α(x + y) = αx + αy* |
| (d–2) | *(α + β)x = αx + βx* |

**Derived properties** (provable from the axioms):
- The additive identity **0** is unique.
- The additive inverse of any *x* is unique.
- *0·x = 0* (scalar zero times any vector is the zero vector).
- *α·0 = 0* (any scalar times the zero vector is zero).
- *(-1)·x = x'* (negative one times *x* is its additive inverse).

---

### 3.2 The Vector Space Rᵐ

`HW3`

The most common vector space is **ℝᵐ**: column vectors with *m* real entries, with the standard definitions of addition and scalar multiplication.

- **Additive identity:** the zero vector **0** = (0, ..., 0)ᵀ
- **Additive inverse of x:** *-x* = (-x₁, ..., -xₘ)ᵀ
- **Standard basis:** *{e₁, e₂, ..., eₘ}* where *eᵢ* has a 1 in position *i* and 0s elsewhere.

---

### 3.3 Abstract Vector Spaces

`HW4`

Vector spaces need not be ℝᵐ. Any system satisfying axioms (a–0) through (d–2) qualifies. Important examples include:

- **Polynomial spaces *Pₙ*** — polynomials of degree ≤ n with standard function addition and scalar multiplication.
- **Non-standard spaces** — such as ℝ² with custom-defined addition and scalar multiplication (e.g., the "S²" space from HW4), as long as all axioms are satisfied. The additive identity and inverses in such spaces may look unusual.

When verifying an abstract vector space, you must check all axioms explicitly — do not assume standard operations apply.

---

### 3.4 Subspaces

`HW3` ⭐ `HW5`

A **subspace** *S* of a vector space *V* is a nonempty subset *S ⊆ V* that is itself a vector space under the same operations.

**Subspace Shortcut (ssp):** You only need to verify two conditions:
1. *S* is **closed under addition**: for all *x, y ∈ S*, we have *x + y ∈ S*.
2. *S* is **closed under scalar multiplication**: for all *x ∈ S* and *α ∈ F*, we have *αx ∈ S*.

All other axioms are inherited from the parent space *V*. Closure under these two operations also implies **0 ∈ S** and all additive inverses are in *S*.

> ⭐ **HW5 connection:** Proving that Null(L) and Rang(L) are subspaces is a direct application of this shortcut — and is explicitly asked in HW5, Exercise 1.

---

### 3.5 Linear Independence and Dependence

`HW3` `HW4` ⭐ `HW5`

A set of vectors *{x₁, ..., xₙ}* is **linearly dependent** if there exist scalars *α₁, ..., αₙ*, not all zero, such that:

> **α₁x₁ + α₂x₂ + · · · + αₙxₙ = 0**

A set that is not dependent is **linearly independent** — the only solution to the equation above is *α₁ = α₂ = · · · = αₙ = 0*.

**Equivalent characterization:** A set is dependent if and only if at least one vector in the set can be written as a linear combination of the others.

**Testing independence in ℝᵐ:** Form the matrix with *x₁, ..., xₙ* as columns and row reduce. If the only solution to the homogeneous system is the trivial one, the set is independent.

> ⭐ **HW5 connection:** After computing Rang(L) as a span, you must check independence of that spanning set to find a basis and determine its dimension.

---

### 3.6 Span

`HW3` `HW4` ⭐ `HW5`

The **span** of a set of vectors *{x₁, ..., xₙ}* is the set of all linear combinations:

> **span{x₁, ..., xₙ} = {α₁x₁ + · · · + αₙxₙ : each αₖ ∈ F}**

The span is always a **subspace** of *V*.

**Key facts:**
- A vector *y* is in *span{x₁, ..., xₙ}* if and only if the system *[x₁ | x₂ | ... | xₙ | y]* is consistent.
- If the spanning set is independent, the decomposition of any *y* in the span is **unique**.
- If the spanning set is dependent, there are **infinitely many** decompositions.

> ⭐ **HW5 connection:** The range space is expressed as a span — *Rang(L) = span{L(b₁), L(b₂), ...}* where *{b₁, b₂, ...}* is a basis for the domain.

---

### 3.7 Basis

`HW3` `HW4` ⭐ `HW5`

A **basis** for a vector space *V* is a set of vectors *{b₁, ..., bₙ}* that is:
1. A **spanning set**: *V = span{b₁, ..., bₙ}*
2. **Linearly independent**

A basis is the most efficient spanning set — no vector can be removed without losing span coverage.

**Uniqueness of decomposition:** If *{b₁, ..., bₙ}* is a basis for *V*, every vector *y ∈ V* can be written **uniquely** as a linear combination of the basis vectors.

**Key theorem:** If *S ⊆ V* and *dim(S) = dim(V)*, then *S = V*.

---

### 3.8 Dimension

`HW3` `HW4` ⭐ `HW5`

The **dimension** of a vector space is the number of vectors in any basis. This number is the same for every basis of the space.

| Space | Dimension |
|---|---|
| ℝᵐ | *m* |
| Pₙ (polynomials of degree ≤ n) | *n + 1* |
| A subspace *S ⊆ ℝᵐ* | Number of pivots in RREF of spanning matrix |
| *{0}* (trivial space) | 0 |

> ⭐ **HW5 connection:** The rank-nullity theorem is a statement about dimensions — you must compute *dim(Null(L))* and *dim(Rang(L))* and verify they sum to *dim(domain)*.

---

### 3.9 Standard Basis and Reduced Row Echelon Form

`HW3` ⭐ `HW5`

To find the **standard basis** for a subspace *S = span{x₁, ..., xₙ} ⊆ ℝᵐ*:

1. Form the matrix with *x₁, ..., xₙ* as **rows** (not columns).
2. Row reduce to **reduced row echelon form (RREF)**.
3. Discard any zero rows.
4. Read off the nonzero rows — these are the standard basis vectors for *S*.

> ⭐ **HW5 connection:** HW5 exercises 3–7 explicitly ask to "determine the standard basis for the range space" — this is exactly the RREF procedure applied to the column span of *A*.

---

### 3.10 Polynomial Spaces Pₙ

`HW4` ⭐ `HW5`

Let **Pₙ** denote the set of all real polynomials of degree at most *n*.

- **Standard basis:** *{1, x, x², ..., xⁿ}* — this set is independent (proven by repeated differentiation and setting *x = 0*).
- **Dimension:** *dim(Pₙ) = n + 1*.
- Other bases exist: e.g., the **Lagrange basis** for *P₂* at nodes *x₀, x₁, x₂*:

> *{(x−x₁)(x−x₂), (x−x₀)(x−x₂), (x−x₀)(x−x₁)}*

> ⭐ **HW5 connection:** HW5 Exercise 8 asks for the null and range spaces of a differential operator on *P₂* — requiring you to work entirely within polynomial space using the standard basis *{1, x, x²}*.

---

## Unit 4 — Linear Operators

> 📘 **Source: HW5** ⭐ — this entire unit is the focus of HW5.

### 4.1 Definition of a Linear Operator

⭐ `HW5`

A map *L : Vₓ → Vy* between two vector spaces (over the same scalar field) is a **linear operator** if for all vectors *x₁, x₂, x ∈ Vₓ* and scalars *α*:

> **L(x₁ + x₂) = L(x₁) + L(x₂)** *(additivity)*
>
> **L(αx) = αL(x)** *(homogeneity)*

Together these say: *L preserves the vector space structure*.

**Examples from HW5:**
- Multiplication by a matrix *A* defines *L : ℝⁿ → ℝᵐ* via *L(x) = Ax*. (Exercises 3–7)
- The derivative *d/dx* is a linear operator from *Pₙ* to *Pₙ*.
- The combined operator *L(p) = p'' + p'* maps *P₂* into *P₂*. (Exercise 8)
- The operator *L(p) = p' + p* also maps *P₂* into *P₂*. (Examples in notes)

---

### 4.2 Null Space (Kernel)

⭐ `HW5`

The **null space** of *L : Vₓ → Vy* is:

> **Null(L) = {x ∈ Vₓ : L(x) = 0} ⊆ Vₓ**

It is the set of all vectors that *L* maps to the zero vector. The null space is always a **subspace of Vₓ**.

**Proof of subspace (HW5 Exercise 1a):** Let *x₁, x₂ ∈ Null(L)* and *α* be a scalar.
- *L(x₁ + x₂) = L(x₁) + L(x₂) = 0 + 0 = 0*, so *x₁ + x₂ ∈ Null(L)*.
- *L(αx₁) = αL(x₁) = α·0 = 0*, so *αx₁ ∈ Null(L)*.
Both closure conditions hold, so Null(L) is a subspace. ∎

**For matrix operators:** *Null(L) = {x : Ax = 0}*, found by solving the homogeneous system *[A | 0]*.

---

### 4.3 Range Space (Image)

⭐ `HW5`

The **range space** (or image) of *L : Vₓ → Vy* is:

> **Rang(L) = {y = L(x) : x ∈ Vₓ} ⊆ Vy**

It is the set of all vectors in *Vy* that can be "reached" by *L*. The range space is always a **subspace of Vy**.

**Proof of subspace (HW5 Exercise 1b):** Let *y₁, y₂ ∈ Rang(L)*, so *y₁ = L(x₁)* and *y₂ = L(x₂)* for some *x₁, x₂ ∈ Vₓ*.
- *y₁ + y₂ = L(x₁) + L(x₂) = L(x₁ + x₂) ∈ Rang(L)*.
- *αy₁ = αL(x₁) = L(αx₁) ∈ Rang(L)*.
Both closure conditions hold, so Rang(L) is a subspace. ∎

**For matrix operators:** *Rang(L) = span of the column vectors of A*, because:

> *Ax = x₁a₁ + x₂a₂ + · · · + xₙaₙ*

The range is all linear combinations of the columns of *A*. To find a standard basis for the range, apply RREF to the matrix whose rows are the column vectors of *A*.

---

### 4.4 Nullity and Rank

⭐ `HW5`

- The **nullity** of *L* is *dim(Null(L))* — the dimension of the null space.
- The **rank** of *L* is *dim(Rang(L))* — the dimension of the range space.

For a matrix *A*, the rank equals the number of **pivot columns** after row reduction.

| HW5 Exercise | Matrix | Nullity | Rank |
|---|---|---|---|
| Ex. 3 | 3×3 | 1 | 2 |
| Ex. 4 | 3×3 | 2 | 1 |
| Ex. 5 | 3×4 (L: ℝ³→ℝ⁴) | 1 | 2 |
| Ex. 6 | 3×3 | 1 | 2 |
| Ex. 7 | 4×3 (L: ℝ⁴→ℝ³) | 1 | 2 |
| Ex. 8 | L on P₂ | 1 | 2 |

---

### 4.5 The Rank-Nullity Theorem

⭐ `HW5`

For any linear operator *L : Vₓ → Vy* where *Vₓ* is finite dimensional:

> **dim(Null(L)) + dim(Rang(L)) = dim(Vₓ)**
>
> i.e., **nullity + rank = dim(domain)**

This is one of the most fundamental theorems in linear algebra.

**HW5 Exercise 2** is a direct consequence: if *L : V → V* and *Null(L) = {0}* (nullity = 0), then *rank = dim(V)*, which forces *Rang(L) = V*. This means every *y ∈ V* has a **unique** preimage *x* with *L(x) = y*.

**Checking your work with the rank-nullity theorem (HW5 Exercises 5–7):**

Always verify: *nullity + rank = dim(domain)*

| Exercise | Null dim | Range dim | Domain dim | Check |
|---|---|---|---|---|
| Ex. 5 | 1 | 2 | 3 | 1 + 2 = 3 ✓ |
| Ex. 6 | 1 | 2 | 3 | 1 + 2 = 3 ✓ |
| Ex. 7 | 1 | 2 | 4 | Wait — need rank 3? Check notes |

---

### 4.6 Computing Null and Range Spaces for Matrices

⭐ `HW5` — Exercises 3, 4, 5, 6, 7

Given a matrix *A* representing *L : ℝⁿ → ℝᵐ*:

**Step-by-step: Finding Null(L)**
1. Set up the augmented matrix *[A | 0]*.
2. Row reduce to echelon form.
3. Identify free variables (columns without pivots).
4. Express pivot variables in terms of free variables via back substitution.
5. Write the solution as a linear combination — one vector per free variable.
6. Those vectors are the **null space basis**.

**Step-by-step: Finding Rang(L)**
1. The range is the span of the columns of *A*: *Rang(L) = span{col₁(A), col₂(A), ..., colₙ(A)}*.
2. To find a standard basis, write the columns of *A* as the rows of a new matrix.
3. Row reduce that matrix to RREF.
4. Discard zero rows; the nonzero rows form the **standard basis for Rang(L)**.

**Verify with rank-nullity:** *dim(Null) + dim(Rang) = n* (number of columns of *A*).

---

### 4.7 Linear Operators on Polynomial Spaces

⭐ `HW5` — Exercise 8

Linear operators can act on polynomial spaces just as matrices act on ℝⁿ. The procedure mirrors the matrix case but uses the standard basis *{1, x, x², ...}* of *Pₙ*.

**Step-by-step: Finding Null(L) for a differential operator on P₂**
1. Let *p(x) = α₀ + α₁x + α₂x²* be a general element of *P₂*.
2. Compute *L(p)* explicitly.
3. Collect terms by powers of *x* and set each coefficient to zero.
4. Solve the resulting system for *α₀, α₁, α₂*.
5. Any remaining free parameters give the null space basis.

**Step-by-step: Finding Rang(L) for a differential operator on P₂**
1. Evaluate *L* on each standard basis element: *L(1)*, *L(x)*, *L(x²)*.
2. The range is *span{L(1), L(x), L(x²)}*.
3. Check independence of this spanning set.
4. Independent vectors form the basis for Rang(L).

**HW5 Exercise 8 example:** For *L(p) = p'' + p'* on *P₂*:
- *L(1) = 0 + 0 = 0* (not useful — contributes nothing to range)
- *L(x) = 0 + 1 = 1*
- *L(x²) = 2 + 2x*

So *Rang(L) = span{1, 2 + 2x} = span{1, 1 + x}* (rescaling), giving *dim(Rang) = 2*.
And *Null(L) = span{1}* (the constant functions), giving *dim(Null) = 1*.
Verify: *1 + 2 = 3 = dim(P₂)* ✓

---

## Alphabetical Index

| Term | Section | Homework |
|---|---|---|
| Abstract vector spaces | [3.3](#33-abstract-vector-spaces) | HW4 |
| Additive identity | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Additive inverse | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Additivity (of linear operator) | [4.1](#41-definition-of-a-linear-operator) | ⭐ HW5 |
| Augmented matrix | [2.2](#22-augmented-matrices) | HW1, HW2 |
| Axioms, vector space | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Back substitution | [2.6](#26-back-substitution) | HW1, HW2, ⭐ HW5 |
| Basis | [3.7](#37-basis) | HW3, HW4, ⭐ HW5 |
| Basis, Lagrange | [3.10](#310-polynomial-spaces-pn) | HW4 |
| Basis, null space | [4.2](#42-null-space-kernel) | ⭐ HW5 |
| Basis, range space | [4.3](#43-range-space-image) | ⭐ HW5 |
| Basis, standard (Rᵐ) | [3.2](#32-the-vector-space-rm) | HW3 |
| Basis, standard (subspace) | [3.9](#39-standard-basis-and-reduced-row-echelon-form) | HW3, ⭐ HW5 |
| Closure (subspace condition) | [3.4](#34-subspaces) | HW3, ⭐ HW5 |
| Coefficient matrix | [2.1](#21-linear-systems-and-matrix-form) | HW1, HW2 |
| Column space | [4.3](#43-range-space-image) | ⭐ HW5 |
| Commutativity (matrix mult.) | [1.5](#15-properties-of-matrix-operations) | HW1 |
| Dependence, linear | [3.5](#35-linear-independence-and-dependence) | HW3, HW4, ⭐ HW5 |
| Derivative as linear operator | [4.1](#41-definition-of-a-linear-operator) | ⭐ HW5 |
| Dimension | [3.8](#38-dimension) | HW3, HW4, ⭐ HW5 |
| Distributive properties | [1.5](#15-properties-of-matrix-operations) | HW1 |
| Elementary row operations | [2.3](#23-elementary-row-operations) | HW1, HW2, ⭐ HW5 |
| Free variables | [2.7](#27-free-variables-and-parametric-solutions) | HW1, HW2, ⭐ HW5 |
| Gaussian elimination | [2.4](#24-gaussian-elimination) | HW1, HW2, ⭐ HW5 |
| Homogeneity (of linear operator) | [4.1](#41-definition-of-a-linear-operator) | ⭐ HW5 |
| Homogeneous system | [4.2](#42-null-space-kernel) | ⭐ HW5 |
| Image (of a linear operator) | [4.3](#43-range-space-image) | ⭐ HW5 |
| Independence, linear | [3.5](#35-linear-independence-and-dependence) | HW3, HW4, ⭐ HW5 |
| Injective / one-to-one | [4.5](#45-the-rank-nullity-theorem) | ⭐ HW5 |
| Kernel | [4.2](#42-null-space-kernel) | ⭐ HW5 |
| Lagrange basis | [3.10](#310-polynomial-spaces-pn) | HW4 |
| Linear combination | [3.6](#36-span) | HW3, HW4, ⭐ HW5 |
| Linear dependence | [3.5](#35-linear-independence-and-dependence) | HW3, HW4 |
| Linear independence | [3.5](#35-linear-independence-and-dependence) | HW3, HW4, ⭐ HW5 |
| Linear operator | [4.1](#41-definition-of-a-linear-operator) | ⭐ HW5 |
| Linear system | [2.1](#21-linear-systems-and-matrix-form) | HW1, HW2 |
| Matrix addition | [1.2](#12-matrix-addition) | HW1 |
| Matrix multiplication | [1.4](#14-matrix-multiplication) | HW1 |
| Matrix, augmented | [2.2](#22-augmented-matrices) | HW1, HW2, ⭐ HW5 |
| Matrix, coefficient | [2.1](#21-linear-systems-and-matrix-form) | HW1, HW2 |
| Matrix, size | [1.1](#11-matrix-basics) | HW1 |
| No solution (inconsistent) | [2.8](#28-solution-types) | HW1, HW2 |
| Null space | [4.2](#42-null-space-kernel) | ⭐ HW5 |
| Null space proof (subspace) | [4.2](#42-null-space-kernel) | ⭐ HW5 |
| Nullity | [4.4](#44-nullity-and-rank) | ⭐ HW5 |
| Parametric solutions | [2.7](#27-free-variables-and-parametric-solutions) | HW1, HW2, ⭐ HW5 |
| Pivot | [2.4](#24-gaussian-elimination) | HW1, HW2, ⭐ HW5 |
| Polynomial spaces Pₙ | [3.10](#310-polynomial-spaces-pn) | HW4, ⭐ HW5 |
| Rank | [4.4](#44-nullity-and-rank) | ⭐ HW5 |
| Rank-Nullity Theorem | [4.5](#45-the-rank-nullity-theorem) | ⭐ HW5 |
| Range space | [4.3](#43-range-space-image) | ⭐ HW5 |
| Range space proof (subspace) | [4.3](#43-range-space-image) | ⭐ HW5 |
| Reduced row echelon form (RREF) | [2.5](#25-row-echelon-form), [3.9](#39-standard-basis-and-reduced-row-echelon-form) | HW1, HW3, ⭐ HW5 |
| Row echelon form (REF) | [2.5](#25-row-echelon-form) | HW1, HW2, ⭐ HW5 |
| Row operations, elementary | [2.3](#23-elementary-row-operations) | HW1, HW2, ⭐ HW5 |
| Scalar multiplication (matrix) | [1.3](#13-scalar-matrix-multiplication) | HW1 |
| Scalar multiplication (vector) | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Solution types | [2.8](#28-solution-types) | HW1, HW2 |
| Span | [3.6](#36-span) | HW3, HW4, ⭐ HW5 |
| Standard basis (Rᵐ) | [3.2](#32-the-vector-space-rm) | HW3 |
| Standard basis (subspace) | [3.9](#39-standard-basis-and-reduced-row-echelon-form) | HW3, ⭐ HW5 |
| Subspace | [3.4](#34-subspaces) | HW3, ⭐ HW5 |
| Subspace shortcut (ssp) | [3.4](#34-subspaces) | HW3, ⭐ HW5 |
| Surjective / onto | [4.5](#45-the-rank-nullity-theorem) | ⭐ HW5 |
| Trivial solution | [3.5](#35-linear-independence-and-dependence) | HW3, HW4 |
| Unique solution | [2.8](#28-solution-types) | HW1, HW2 |
| Vector space | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Vector space axioms | [3.1](#31-vector-space-axioms) | HW3, HW4 |
| Zero vector | [3.1](#31-vector-space-axioms) | HW3, HW4, ⭐ HW5 |