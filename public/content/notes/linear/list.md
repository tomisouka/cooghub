# ⚡ LINEAR ALGEBRA // HACKER'S MATRIX MANUAL ⚡

```
██╗     ██╗███╗   ██╗ █████╗ ██╗     ██████╗ 
██║     ██║████╗  ██║██╔══██╗██║     ██╔══██╗
██║     ██║██╔██╗ ██║███████║██║     ██████╔╝
██║     ██║██║╚██╗██║██╔══██║██║     ██╔══██╗
███████╗██║██║ ╚████║██║  ██║███████╗██████╔╝
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═════╝ 
```

> **"Give me a matrix and a place to stand, and I will invert the world."**

---

## 📋 NAVIGATION MAP

```
├─ [PRE] PREREQUISITES ───────────── Notation & Fundamentals
├─ [0x01] MATRICES & SYSTEMS ─────── Gaussian Elimination
├─ [0x02] VECTOR SPACES ──────────── Independence & Bases
├─ [0x03] LINEAR MAPS ────────────── Transformations
├─ [0x04] DETERMINANTS ───────────── The Magic Number
├─ [0x05] EIGENVALUES ────────────── Eigenvectors & Spectra
├─ [0x06] DIAGONALIZATION ────────── Matrix Functions
├─ [0x07] JORDAN FORM ────────────── 2×2 Canonical Form
└─ [0x08] ORTHOGONALITY ──────────── Gram-Schmidt & Schur
```

---

## [PRE] :: PREREQUISITES & NOTATION

### 🎯 ESSENTIAL NOTATION

| Symbol | Meaning | Example |
|--------|---------|---------|
| `ℝⁿ` | n-dimensional real space | `ℝ³ = {(x,y,z) \| x,y,z ∈ ℝ}` |
| `ℂⁿ` | n-dimensional complex space | `ℂ² = {(a+bi, c+di)}` |
| `𝔽ⁿ` | n-dimensional field space | Generic field F |
| `Mₘₓₙ(ℝ)` | m×n real matrices | All m-row, n-column matrices |
| `Aᵢⱼ` or `[A]ᵢⱼ` | Entry in row i, column j | `A₂₃` = element at (2,3) |
| `Aᵀ` | Transpose | Flip rows ↔ columns |
| `A*` or `A̅ᵀ` | Conjugate transpose | `(A*)ᵢⱼ = (Āⱼᵢ)` |
| `A⁻¹` | Inverse | `AA⁻¹ = I` |
| `det(A)` or `\|A\|` | Determinant | Scalar value |
| `tr(A)` | Trace | Sum of diagonal entries |
| `rank(A)` | Rank | Dimension of column/row space |
| `null(A)` | Nullity | Dimension of null space |
| `dim(V)` | Dimension | Number of basis vectors |
| `span(S)` | Span | All linear combinations of S |
| `⟨v,w⟩` | Inner product | Dot product in ℝⁿ |
| `‖v‖` | Norm | Length of vector |
| `ker(T)` | Kernel | Null space of T |
| `im(T)` | Image | Range of T |
| `λ` | Eigenvalue | Characteristic value |
| `I` or `Iₙ` | Identity matrix | Diagonal of 1s |
| `0` | Zero vector/matrix | All entries 0 |
| `⊕` | Direct sum | V ⊕ W |

### 📐 VECTOR NOTATION

```
Column vector:        Row vector:           Matrix:
    ⎡ x₁ ⎤               [x₁ x₂ x₃]          ⎡ a₁₁ a₁₂ ⎤
v = ⎢ x₂ ⎥          v = [x₁, x₂, x₃]    A = ⎢ a₂₁ a₂₂ ⎥
    ⎣ x₃ ⎦                                   ⎣ a₃₁ a₃₂ ⎦
```

### 🔧 FUNDAMENTAL OPERATIONS

| Operation | Notation | Definition |
|-----------|----------|------------|
| **Scalar mult** | `cv` | `cv = [cx₁, cx₂, ..., cxₙ]` |
| **Vector add** | `u + v` | `[u₁+v₁, u₂+v₂, ..., uₙ+vₙ]` |
| **Dot product** | `u·v` or `⟨u,v⟩` | `u₁v₁ + u₂v₂ + ... + uₙvₙ` |
| **Matrix mult** | `AB` | `[AB]ᵢⱼ = Σₖ AᵢₖBₖⱼ` |
| **Transpose** | `Aᵀ` | `[Aᵀ]ᵢⱼ = Aⱼᵢ` |

### ⚡ QUICK FACTS

```
✓ Matrix multiplication is NOT commutative: AB ≠ BA (usually)
✓ Matrix multiplication IS associative: (AB)C = A(BC)
✓ Transpose rules: (AB)ᵀ = BᵀAᵀ  (reverse order!)
✓ Inverse rules: (AB)⁻¹ = B⁻¹A⁻¹  (reverse order!)
✓ det(AB) = det(A)·det(B)
✓ det(Aᵀ) = det(A)
```

---

## [0x01] :: MATRICES & SYSTEMS OF EQUATIONS

### 🎯 CORE CONCEPT: Ax = b

```
Linear System:              Matrix Form:
x₁ + 2x₂ = 5               ⎡1  2⎤ ⎡x₁⎤   ⎡5⎤
3x₁ - x₂ = 1               ⎣3 -1⎦ ⎣x₂⎦ = ⎣1⎦
                              A     x  =  b
```

**Goal**: Find x such that Ax = b

---

### 🔄 GAUSSIAN ELIMINATION

**Algorithm**: Row reduce to **Row Echelon Form (REF)** or **Reduced Row Echelon Form (RREF)**

#### Elementary Row Operations
1. **Swap rows**: `Rᵢ ↔ Rⱼ`
2. **Scale row**: `Rᵢ → cRᵢ` (c ≠ 0)
3. **Add multiple**: `Rᵢ → Rᵢ + cRⱼ`

#### Row Echelon Form (REF)
```
⎡ • * * * ⎤
⎢ 0 • * * ⎥  • = pivot (first nonzero in row)
⎢ 0 0 0 • ⎥  * = any value
⎣ 0 0 0 0 ⎦  Pivots form staircase pattern
```

**Properties**:
- All zero rows at bottom
- Each pivot right of pivot above
- Entries below pivots are 0

#### Reduced Row Echelon Form (RREF)
```
⎡ 1 0 * 0 ⎤
⎢ 0 1 * 0 ⎥  Pivots = 1
⎢ 0 0 0 1 ⎥  Entries above & below pivots = 0
⎣ 0 0 0 0 ⎦
```

**Properties**: REF + pivots are 1 + entries above pivots are 0

---

### 🎲 SOLUTION TYPES

**Augmented Matrix**: `[A|b]`

```
⎡ 1  2 | 5 ⎤
⎣ 3 -1 | 1 ⎦
```

| RREF Pattern | Solution Type | Example |
|--------------|---------------|---------|
| No pivot in last column | Unique or infinite | ✓ Consistent |
| Pivot in last column `[0 0 | 1]` | No solution | ✗ Inconsistent |
| Pivots in all columns (except last) | Unique solution | 1 solution |
| Free variables (non-pivot columns) | Infinite solutions | ∞ solutions |

**Free Variables**: Columns without pivots (except augmented column)

---

### 📊 GAUSSIAN ELIMINATION ALGORITHM

```python
# Forward Elimination (to REF)
for col in range(min(m,n)):
    # Find pivot
    find nonzero entry in column col, row ≥ col
    swap to make it row col
    
    # Eliminate below
    for row in range(col+1, m):
        eliminate entry using: Row[row] -= (Row[row][col]/Row[col][col]) * Row[col]

# Back Substitution (to RREF)
for col in range(pivots-1, -1, -1):
    # Scale pivot to 1
    Row[col] /= Row[col][pivot_col]
    
    # Eliminate above
    for row in range(col):
        Row[row] -= Row[row][pivot_col] * Row[col]
```

**Complexity**: `O(n³)` operations

---

### 🔑 MATRIX INVERSE

**Definition**: `A⁻¹` exists if `AA⁻¹ = A⁻¹A = I`

**Existence**: A is invertible ⟺ A is square and det(A) ≠ 0

**Finding Inverse via Gaussian Elimination**:
```
[A | I] → row operations → [I | A⁻¹]
```

**Example**:
```
⎡ 1  2 | 1  0 ⎤  →  ⎡ 1  0 | -1   2 ⎤
⎣ 3  7 | 0  1 ⎦  →  ⎣ 0  1 |  3  -1 ⎦

A⁻¹ = ⎡-1   2⎤
      ⎣ 3  -1⎦
```

---

### 🎯 KEY THEOREMS

**Invertible Matrix Theorem (IMT)**:
For n×n matrix A, the following are equivalent:
1. A is invertible
2. det(A) ≠ 0
3. rank(A) = n
4. null(A) = 0
5. Columns of A are linearly independent
6. Rows of A are linearly independent
7. Ax = 0 has only trivial solution
8. Ax = b has unique solution for all b
9. Columns of A span ℝⁿ
10. A is a product of elementary matrices

---

## [0x02] :: VECTOR SPACES

### 📦 VECTOR SPACE DEFINITION

A set V with operations + and · is a **vector space** over field 𝔽 if:

```
Axioms (for all u,v,w ∈ V and c,d ∈ 𝔽):
1. u + v ∈ V                    (Closure under +)
2. u + v = v + u                (Commutativity)
3. (u + v) + w = u + (v + w)    (Associativity)
4. ∃ 0: v + 0 = v               (Additive identity)
5. ∃ -v: v + (-v) = 0           (Additive inverse)
6. cv ∈ V                       (Closure under ·)
7. c(u + v) = cu + cv           (Distributivity)
8. (c + d)v = cv + dv           (Distributivity)
9. c(dv) = (cd)v                (Associativity)
10. 1v = v                      (Multiplicative identity)
```

---

### 🌟 STANDARD VECTOR SPACES

| Space | Description | Dimension |
|-------|-------------|-----------|
| `ℝⁿ` | n-tuples of reals | n |
| `ℂⁿ` | n-tuples of complex | n |
| `Mₘₓₙ(ℝ)` | m×n matrices | m·n |
| `Pₙ` | Polynomials of degree ≤ n | n+1 |
| `P` | All polynomials | ∞ |
| `C[a,b]` | Continuous functions on [a,b] | ∞ |
| `ℝ^∞` | Infinite sequences | ∞ |

---

### 🔗 LINEAR COMBINATIONS

**Definition**: `v = c₁v₁ + c₂v₂ + ... + cₖvₖ`
- v is a **linear combination** of {v₁, v₂, ..., vₖ}

**Example**:
```
[5]   [1]      [0]
[1] = 2[2]  +  [-3]
[0]   [3]      [6]
```

---

### 🎪 SPAN

**Definition**: `span(S) = {all linear combinations of vectors in S}`

```
span({v₁, v₂, ..., vₖ}) = {c₁v₁ + c₂v₂ + ... + cₖvₖ | cᵢ ∈ 𝔽}
```

**Geometric Intuition**:
- `span({v})` = line through origin
- `span({v₁, v₂})` = plane through origin (if v₁, v₂ not parallel)
- `span({v₁, v₂, v₃})` = ℝ³ (if not coplanar)

**Properties**:
- `span(S)` is always a vector space (subspace)
- `span(S)` is the **smallest** subspace containing S
- If `S ⊆ T`, then `span(S) ⊆ span(T)`

---

### ⚔️ LINEAR INDEPENDENCE

**Definition**: Vectors {v₁, v₂, ..., vₖ} are **linearly independent** if:
```
c₁v₁ + c₂v₂ + ... + cₖvₖ = 0  ⟹  c₁ = c₂ = ... = cₖ = 0
```

**Equivalently**: Only trivial combination gives zero vector

**Linearly Dependent**: NOT linearly independent
```
∃ cᵢ ≠ 0 such that c₁v₁ + c₂v₂ + ... + cₖvₖ = 0
⟺ One vector is a linear combination of others
```

---

### 🧪 INDEPENDENCE TEST (MATRIX METHOD)

Form matrix A with vectors as columns:
```
A = [v₁ v₂ ... vₖ]
```

**Result**:
- **Independent** ⟺ Ax = 0 has only trivial solution ⟺ rank(A) = k
- **Dependent** ⟺ Ax = 0 has nontrivial solution ⟺ rank(A) < k

**Example**:
```
v₁ = [1,2,3]ᵀ, v₂ = [4,5,6]ᵀ, v₃ = [7,8,9]ᵀ

A = ⎡1 4 7⎤  row reduce  ⎡1 4 7⎤
    ⎢2 5 8⎥      →       ⎢0 1 2⎥  rank = 2 < 3
    ⎣3 6 9⎦              ⎣0 0 0⎦  → DEPENDENT
```

---

### 👑 BASIS

**Definition**: Set B is a **basis** for V if:
1. B is linearly independent
2. B spans V

**Properties**:
- Every vector in V has **unique** representation as linear combination of basis vectors
- Any two bases of V have the **same number** of elements

**Standard Basis for ℝⁿ**:
```
e₁ = [1,0,0,...,0]ᵀ
e₂ = [0,1,0,...,0]ᵀ
...
eₙ = [0,0,0,...,1]ᵀ
```

---

### 📏 DIMENSION

**Definition**: `dim(V) = number of vectors in any basis of V`

**Examples**:
- `dim(ℝⁿ) = n`
- `dim(Mₘₓₙ) = m·n`
- `dim(Pₙ) = n + 1`
- `dim({0}) = 0`

---

### 🎯 THE BIG THEOREM

**For vectors in V with dim(V) = n:**

| # of Vectors | Independent? | Spanning? | Basis? |
|--------------|--------------|-----------|--------|
| < n | Can be | **NO** | **NO** |
| = n | ⟺ Spanning | ⟺ Independent | ⟺ Both |
| > n | **NO** | Can be | **NO** |

**Key Insight**: For dim(V) = n:
- n independent vectors → basis
- n spanning vectors → basis
- < n vectors can't span
- \> n vectors can't be independent

---

### 🔍 SUBSPACES

**Definition**: W ⊆ V is a **subspace** if W is a vector space under same operations

**Subspace Test**: W is subspace of V if:
1. 0 ∈ W
2. u, v ∈ W ⟹ u + v ∈ W (closed under addition)
3. v ∈ W, c ∈ 𝔽 ⟹ cv ∈ W (closed under scalar mult)

**Important Subspaces**:
- **Column space** `col(A)`: span of columns of A
- **Row space** `row(A)`: span of rows of A
- **Null space** `null(A)`: `{x | Ax = 0}`
- **Left null space**: `null(Aᵀ)`

---

### 📊 RANK-NULLITY THEOREM

**For A ∈ Mₘₓₙ:**
```
rank(A) + null(A) = n
```

Where:
- `rank(A) = dim(col(A)) = dim(row(A))` = # of pivot columns
- `null(A) = dim(null(A))` = # of free variables

**Consequences**:
- `rank(A) ≤ min(m,n)`
- `rank(Aᵀ) = rank(A)`
- For square matrix: `rank(A) = n ⟺ null(A) = 0 ⟺ A invertible`

---

## [0x03] :: LINEAR MAPS & TRANSFORMATIONS

### 🔄 LINEAR TRANSFORMATION

**Definition**: `T: V → W` is **linear** if:
1. `T(u + v) = T(u) + T(v)` (preserves addition)
2. `T(cv) = cT(v)` (preserves scalar multiplication)

**Equivalent**: `T(cu + dv) = cT(u) + dT(v)`

**Consequence**: `T(0) = 0` always

---

### 🎯 MATRIX REPRESENTATION

Every linear map `T: ℝⁿ → ℝᵐ` can be represented by m×n matrix A:
```
T(x) = Ax
```

**Construction**: If T: ℝⁿ → ℝᵐ, then:
```
A = [T(e₁) T(e₂) ... T(eₙ)]
```
where eᵢ are standard basis vectors

**Example**:
```
T([x,y]) = [2x+y, x-y, 3y]

T(e₁) = T([1,0]) = [2,1,0]
T(e₂) = T([0,1]) = [1,-1,3]

A = ⎡ 2  1⎤
    ⎢ 1 -1⎥
    ⎣ 0  3⎦
```

---

### 🔑 KEY SUBSPACES OF LINEAR MAP

For `T: V → W`:

| Name | Notation | Definition | Interpretation |
|------|----------|------------|----------------|
| **Kernel** | `ker(T)` | `{v ∈ V | T(v) = 0}` | "What maps to zero" |
| **Image/Range** | `im(T)` or `range(T)` | `{T(v) | v ∈ V}` | "What can be reached" |
| **Null space** | `null(T)` | Same as ker(T) | (for matrices) |
| **Column space** | `col(A)` | Same as im(T) | (for matrices) |

**Properties**:
- `ker(T)` is subspace of V
- `im(T)` is subspace of W
- T is **injective** (one-to-one) ⟺ `ker(T) = {0}`
- T is **surjective** (onto) ⟺ `im(T) = W`

---

### 📐 RANK-NULLITY (GENERAL FORM)

For `T: V → W`:
```
dim(ker(T)) + dim(im(T)) = dim(V)
```

Also written:
```
nullity(T) + rank(T) = dim(V)
```

---

### 🎪 COMPOSITION & INVERSE

**Composition**: If `S: U → V` and `T: V → W`:
```
(T ∘ S)(u) = T(S(u))
```

**Matrix form**: `[T ∘ S] = [T][S]`

**Inverse**: `T: V → W` has inverse `T⁻¹: W → V` if:
```
T ∘ T⁻¹ = I_W  and  T⁻¹ ∘ T = I_V
```

**Existence**: T invertible ⟺ T bijective ⟺ ker(T) = {0} and im(T) = W

---

### 🌟 CHANGE OF BASIS

**Setup**: Two bases B = {v₁,...,vₙ} and C = {w₁,...,wₙ} for V

**Change of basis matrix**: `P` where columns are B vectors in C coordinates
```
[v]_C = P[v]_B
```

**Inverse**: `P⁻¹ = `change from C to B

**Similar matrices**: A and B represent same transformation in different bases:
```
B = P⁻¹AP
```
where P is change-of-basis matrix

---

## [0x04] :: DETERMINANTS

### 🎯 THE DETERMINANT

**Definition (2×2)**:
```
det(⎡a b⎤) = ad - bc
    ⎣c d⎦
```

**Definition (3×3)** via cofactor expansion:
```
det(⎡a b c⎤)
    ⎢d e f⎥ = a·det(⎡e f⎤) - b·det(⎡d f⎤) + c·det(⎡d e⎤)
    ⎣g h i⎦         ⎣h i⎦         ⎣g i⎦         ⎣g h⎦
```

**General (n×n)**: Cofactor expansion along row i:
```
det(A) = Σⱼ (-1)^(i+j) Aᵢⱼ det(Mᵢⱼ)
```
where Mᵢⱼ = minor (delete row i, column j)

---

### 🔧 COFACTOR & MINOR

**Minor** `Mᵢⱼ`: Determinant of (n-1)×(n-1) matrix by deleting row i, column j

**Cofactor** `Cᵢⱼ`:
```
Cᵢⱼ = (-1)^(i+j) det(Mᵢⱼ)
```

**Sign pattern**:
```
⎡ +  -  +  - ⎤
⎢ -  +  -  + ⎥
⎢ +  -  +  - ⎥
⎣ -  +  -  + ⎦
```

---

### ⚡ DETERMINANT PROPERTIES

**Elementary row operations**:
1. **Swap rows**: `det` changes sign
2. **Scale row by c**: `det` multiplied by c
3. **Add multiple of row**: `det` unchanged

**Key properties**:
```
✓ det(AB) = det(A)·det(B)
✓ det(Aᵀ) = det(A)
✓ det(A⁻¹) = 1/det(A)  (if A invertible)
✓ det(cA) = cⁿ det(A)  (for n×n matrix)
✓ det(I) = 1
✓ Row/column of zeros → det = 0
✓ Two identical rows/columns → det = 0
✓ Triangular matrix → det = product of diagonal
```

---

### 🎯 GEOMETRIC INTERPRETATION

**det(A) = signed volume of parallelepiped** formed by column vectors

```
2D: |det(A)| = area of parallelogram
3D: |det(A)| = volume of parallelepiped
nD: |det(A)| = n-dimensional volume
```

**Sign**:
- Positive: Preserves orientation
- Negative: Reverses orientation
- Zero: Collapses to lower dimension

---

### 🔑 CRAMER'S RULE

Solving `Ax = b` where A is n×n invertible:
```
xᵢ = det(Aᵢ) / det(A)
```

where `Aᵢ` = A with column i replaced by b

**Example**:
```
x + 2y = 5      A = ⎡1  2⎤  b = ⎡5⎤
3x - y = 1          ⎣3 -1⎦      ⎣1⎦

det(A) = -1 - 6 = -7

x = det(⎡5  2⎤) / (-7) = (-5-2)/(-7) = 1
        ⎣1 -1⎦

y = det(⎡1  5⎤) / (-7) = (1-15)/(-7) = 2
        ⎣3  1⎦
```

**Note**: Inefficient for large systems (use Gaussian elimination instead)

---

### 🎪 ADJUGATE MATRIX

**Definition**:
```
adj(A) = [Cᵢⱼ]ᵀ  (transpose of cofactor matrix)
```

**Inverse formula**:
```
A⁻¹ = (1/det(A)) · adj(A)
```

---

## [0x05] :: EIGENVALUES & EIGENVECTORS

### 👑 THE EIGENVALUE EQUATION

**Definition**: λ is **eigenvalue** of A, v is corresponding **eigenvector** if:
```
Av = λv  (where v ≠ 0)
```

**Interpretation**: v is scaled by λ (not rotated)

**Geometric meaning**: Eigenvectors point in "pure scaling" directions

---

### 🔍 FINDING EIGENVALUES

**Characteristic equation**:
```
det(A - λI) = 0
```

**Characteristic polynomial**:
```
p(λ) = det(A - λI)
```

**Process**:
1. Compute `det(A - λI)`
2. Solve polynomial equation for λ
3. For each λ, solve `(A - λI)v = 0` to get eigenvectors

---

### 🧪 EXAMPLE

```
A = ⎡3  1⎤
    ⎣0  2⎦

Step 1: Characteristic polynomial
det(A - λI) = det(⎡3-λ   1 ⎤)
                  ⎣ 0   2-λ⎦

= (3-λ)(2-λ) - 0
= λ² - 5λ + 6
= (λ-2)(λ-3) = 0

Eigenvalues: λ₁ = 2, λ₂ = 3

Step 2: Find eigenvectors

For λ₁ = 2:
(A - 2I)v = 0
⎡1  1⎤ ⎡v₁⎤   ⎡0⎤
⎣0  0⎦ ⎣v₂⎦ = ⎣0⎦

v₁ + v₂ = 0  →  v₁ = [-1]  (or any scalar multiple)
                     [ 1]

For λ₂ = 3:
(A - 3I)v = 0
⎡0  1⎤ ⎡v₁⎤   ⎡0⎤
⎣0 -1⎦ ⎣v₂⎦ = ⎣0⎦

v₂ = 0  →  v₂ = [1]  (or any scalar multiple)
                [0]
```

---

### 📊 EIGENSPACE

**Definition**: For eigenvalue λ:
```
E_λ = {v | Av = λv} = ker(A - λI)
```

**Properties**:
- E_λ is a subspace (called eigenspace)
- dim(E_λ) = geometric multiplicity of λ
- Every nonzero vector in E_λ is an eigenvector

---

### 🎯 MULTIPLICITY

**Algebraic multiplicity**: Multiplicity of λ as root of characteristic polynomial

**Geometric multiplicity**: `dim(E_λ)` = # of linearly independent eigenvectors for λ

**Relationship**: `1 ≤ geometric ≤ algebraic`

---

### ⚡ PROPERTIES OF EIGENVALUES

For n×n matrix A:

```
✓ trace(A) = sum of eigenvalues (with multiplicity)
✓ det(A) = product of eigenvalues (with multiplicity)
✓ A invertible ⟺ all eigenvalues nonzero
✓ If A symmetric real → all eigenvalues real
✓ If A symmetric → eigenvectors orthogonal (for different λ)
✓ Eigenvalues of Aᵀ = eigenvalues of A
✓ Eigenvalues of A⁻¹ = 1/(eigenvalues of A)
✓ Eigenvalues of Aᵏ = (eigenvalues of A)ᵏ
```

---

### 🌟 SPECIAL MATRICES

| Type | Eigenvalue Property |
|------|---------------------|
| **Symmetric** (Aᵀ=A) | All real eigenvalues |
| **Skew-symmetric** (Aᵀ=-A) | All pure imaginary |
| **Orthogonal** (AᵀA=I) | All have |λ|=1 |
| **Positive definite** | All λ > 0 |
| **Triangular** | Eigenvalues = diagonal entries |

---

## [0x06] :: DIAGONALIZATION

### 🎯 DIAGONALIZATION

**Definition**: A is **diagonalizable** if:
```
A = PDP⁻¹
```
where D is diagonal and P is invertible

**Equivalently**: ∃ basis of eigenvectors

---

### 🔑 DIAGONALIZATION THEOREM

**A is diagonalizable ⟺ A has n linearly independent eigenvectors**

**Construction**:
```
P = [v₁ v₂ ... vₙ]  (columns = eigenvectors)
D = ⎡λ₁  0  ...  0 ⎤
    ⎢ 0 λ₂  ...  0 ⎥  (diagonal = eigenvalues)
    ⎢ ⋮  ⋮   ⋱   ⋮ ⎥
    ⎣ 0  0  ... λₙ ⎦
```

**Verification**: `AP = PD ⟺ A[v₁ ... vₙ] = [λ₁v₁ ... λₙvₙ]`

---

### 🧪 DIAGONALIZATION ALGORITHM

```
1. Find eigenvalues: solve det(A - λI) = 0
2. For each λᵢ: find basis for eigenspace E_λᵢ
3. Check: total # of eigenvectors = n?
   YES → Form P from eigenvectors, D from eigenvalues
   NO  → A not diagonalizable
4. Verify: A = PDP⁻¹
```

---

### 🎪 POWERS OF MATRICES

If `A = PDP⁻¹`, then:
```
Aᵏ = PD^k P⁻¹
```

Where:
```
D^k = ⎡λ₁^k   0   ...   0  ⎤
      ⎢  0   λ₂^k ...   0  ⎥
      ⎢  ⋮     ⋮   ⋱    ⋮  ⎥
      ⎣  0     0   ... λₙ^k⎦
```

**Fast computation**: Computing `A^1000` becomes easy!

---

### 🌟 MATRIX FUNCTIONS

For diagonalizable A:
```
f(A) = P f(D) P⁻¹

where f(D) = ⎡f(λ₁)   0     ...    0   ⎤
             ⎢  0    f(λ₂)   ...    0   ⎥
             ⎢  ⋮      ⋮      ⋱     ⋮   ⎥
             ⎣  0      0     ... f(λₙ) ⎦
```

**Applications**:
- **Exponential**: `e^(At) = P e^(Dt) P⁻¹` (differential equations)
- **Square root**: `√A = P √D P⁻¹`
- **Logarithm**: `log(A) = P log(D) P⁻¹`

**Example (exponential)**:
```
e^(Dt) = ⎡e^(λ₁t)    0      ...     0    ⎤
         ⎢   0     e^(λ₂t)   ...     0    ⎥
         ⎢   ⋮        ⋮       ⋱      ⋮    ⎥
         ⎣   0        0      ... e^(λₙt) ⎦
```

---

### 🔥 APPLICATIONS

**Differential equations**: `dx/dt = Ax`
```
Solution: x(t) = e^(At) x(0)
```

**Discrete dynamical systems**: `xₙ₊₁ = Axₙ`
```
Solution: xₙ = Aⁿ x₀
```

**Markov chains**: Long-term behavior from dominant eigenvalue

**Vibrations**: Normal modes = eigenvectors, frequencies ~ eigenvalues

---

## [0x07] :: JORDAN FORM (2×2 CASE)

### 🎯 MOTIVATION

Not all matrices are diagonalizable!

**Example**:
```
A = ⎡λ  1⎤
    ⎣0  λ⎦

Eigenvalue λ with algebraic mult 2,
but geometric mult 1 (only one eigenvector)
→ NOT DIAGONALIZABLE
```

**Jordan Form**: "Almost diagonal" - next best thing

---

### 👑 JORDAN CANONICAL FORM (2×2)

Every 2×2 matrix similar to one of:

**Case 1: Two distinct eigenvalues** `λ₁ ≠ λ₂`
```
J = ⎡λ₁  0 ⎤  (diagonal - fully diagonalizable)
    ⎣ 0  λ₂⎦
```

**Case 2: Repeated eigenvalue λ, two eigenvectors**
```
J = ⎡λ  0⎤  (diagonal)
    ⎣0  λ⎦
```

**Case 3: Repeated eigenvalue λ, one eigenvector**
```
J = ⎡λ  1⎤  (Jordan block)
    ⎣0  λ⎦
```

**Key**: Case 3 is the "defective" case

---

### 🔧 JORDAN BLOCK

**Definition**: k×k Jordan block with eigenvalue λ:
```
J_k(λ) = ⎡λ  1  0  ...  0⎤
         ⎢0  λ  1  ...  0⎥
         ⎢0  0  λ  ...  0⎥
         ⎢⋮  ⋮  ⋮   ⋱   ⋮⎥
         ⎣0  0  0  ...  λ⎦
```

For 2×2:
```
J₂(λ) = ⎡λ  1⎤
        ⎣0  λ⎦
```

---

### 🧪 FINDING JORDAN FORM (2×2)

```
Algorithm:
1. Find eigenvalues (characteristic polynomial)

2. For each eigenvalue λ:
   - Find geometric multiplicity = dim(ker(A - λI))
   
3. Compare:
   - Algebraic mult = Geometric mult? → Diagonal block
   - Algebraic mult > Geometric mult? → Jordan block
```

**Example**:
```
A = ⎡2  1⎤
    ⎣0  2⎦

Eigenvalue: λ = 2 (algebraic mult = 2)

ker(A - 2I) = ker(⎡0  1⎤) = span{⎡1⎤}
                   ⎣0  0⎦         ⎣0⎦

Geometric mult = 1 < 2
→ Jordan form: J = ⎡2  1⎤
                   ⎣0  2⎦
```

---

### 🎪 GENERALIZED EIGENVECTORS

For Jordan block `J₂(λ)`, need:
- **Eigenvector** v₁: `(A - λI)v₁ = 0`
- **Generalized eigenvector** v₂: `(A - λI)v₂ = v₁`

**Example**:
```
A = ⎡2  1⎤
    ⎣0  2⎦

Eigenvector: v₁ = ⎡1⎤  (from (A-2I)v₁=0)
                  ⎣0⎦

Generalized: (A-2I)v₂ = v₁
⎡0  1⎤ ⎡x⎤   ⎡1⎤
⎣0  0⎦ ⎣y⎦ = ⎣0⎦  →  v₂ = ⎡0⎤
                              ⎣1⎦

P = [v₁ v₂] = ⎡1  0⎤
              ⎣0  1⎦

A = PJP⁻¹ where J = ⎡2  1⎤
                     ⎣0  2⎦
```

---

### ⚡ POWERS OF JORDAN BLOCKS

For `J = ⎡λ  1⎤`:
         ⎣0  λ⎦
```
J² = ⎡λ²   2λ⎤
     ⎣0    λ² ⎦

J³ = ⎡λ³   3λ²⎤
     ⎣0    λ³ ⎦

J^n = ⎡λⁿ   nλⁿ⁻¹⎤
      ⎣0     λⁿ  ⎦
```

**General formula**:
```
J_k(λ)^n = ⎡(n,0)λⁿ   (n,1)λⁿ⁻¹  ... (n,k-1)λⁿ⁻ᵏ⁺¹⎤
           ⎢   0       (n,0)λⁿ    ... (n,k-2)λⁿ⁻ᵏ⁺²⎥
           ⎢   ⋮           ⋮        ⋱        ⋮      ⎥
           ⎣   0          0        ...   (n,0)λⁿ   ⎦
```

where `(n,k) = C(n,k)` = binomial coefficient

---

## [0x08] :: GRAM-SCHMIDT & ORTHOGONALITY

### 📐 INNER PRODUCT

**Standard inner product** on ℝⁿ:
```
⟨u, v⟩ = u·v = u₁v₁ + u₂v₂ + ... + uₙvₙ = uᵀv
```

**Properties**:
1. `⟨u, v⟩ = ⟨v, u⟩` (symmetric)
2. `⟨cu, v⟩ = c⟨u, v⟩` (linear)
3. `⟨u+v, w⟩ = ⟨u,w⟩ + ⟨v,w⟩` (distributive)
4. `⟨v, v⟩ ≥ 0` with equality iff v = 0 (positive definite)

---

### 📏 NORM (LENGTH)

**Definition**:
```
‖v‖ = √(⟨v,v⟩) = √(v₁² + v₂² + ... + vₙ²)
```

**Properties**:
- `‖v‖ ≥ 0` with equality iff v = 0
- `‖cv‖ = |c|·‖v‖`
- **Triangle inequality**: `‖u + v‖ ≤ ‖u‖ + ‖v‖`

**Unit vector**: `‖v‖ = 1`

**Normalize**: `û = v/‖v‖` makes unit vector

---

### ⊥ ORTHOGONALITY

**Definition**: u and v are **orthogonal** if:
```
⟨u, v⟩ = 0
```

Notation: `u ⊥ v`

**Geometric interpretation**: Perpendicular (90° angle)

**Pythagorean theorem**: If u ⊥ v, then:
```
‖u + v‖² = ‖u‖² + ‖v‖²
```

---

### 🎯 ORTHOGONAL & ORTHONORMAL SETS

**Orthogonal set**: All pairs orthogonal
```
S = {v₁, v₂, ..., vₖ} where vᵢ ⊥ vⱼ for i ≠ j
```

**Orthonormal set**: Orthogonal + all unit vectors
```
⟨vᵢ, vⱼ⟩ = δᵢⱼ = {1 if i=j, 0 if i≠j}
```

**Key property**: Orthogonal sets are **linearly independent**

---

### 👑 ORTHOGONAL BASIS

**Orthogonal basis**: Basis where all vectors mutually orthogonal

**Orthonormal basis**: Orthogonal basis with unit vectors

**Advantage**: Easy to find coordinates!
```
If {v₁, ..., vₙ} orthonormal basis, then:
x = ⟨x,v₁⟩v₁ + ⟨x,v₂⟩v₂ + ... + ⟨x,vₙ⟩vₙ
```

**Standard basis**: Always orthonormal!

---

### 🔧 GRAM-SCHMIDT PROCESS

**Goal**: Convert basis {v₁, v₂, ..., vₙ} to orthogonal basis {u₁, u₂, ..., uₙ}

**Algorithm**:
```
u₁ = v₁

u₂ = v₂ - (⟨v₂,u₁⟩/⟨u₁,u₁⟩)u₁

u₃ = v₃ - (⟨v₃,u₁⟩/⟨u₁,u₁⟩)u₁ - (⟨v₃,u₂⟩/⟨u₂,u₂⟩)u₂

...

uₖ = vₖ - Σᵢ₌₁ᵏ⁻¹ (⟨vₖ,uᵢ⟩/⟨uᵢ,uᵢ⟩)uᵢ
```

**Key idea**: Subtract projection onto previous vectors

**Normalization**: Divide by ‖uₖ‖ to get orthonormal basis

---

### 🧪 GRAM-SCHMIDT EXAMPLE

```
Input: v₁ = [1,1,0], v₂ = [1,0,1]

Step 1: u₁ = v₁ = [1,1,0]

Step 2: u₂ = v₂ - proj_{u₁}(v₂)
        
proj_{u₁}(v₂) = (⟨v₂,u₁⟩/⟨u₁,u₁⟩)u₁
              = (1·1 + 0·1 + 1·0)/(1² + 1² + 0²) · [1,1,0]
              = (1/2)[1,1,0]
              = [1/2, 1/2, 0]

u₂ = [1,0,1] - [1/2,1/2,0] = [1/2, -1/2, 1]

Step 3: Normalize (optional)
ê₁ = u₁/‖u₁‖ = [1,1,0]/√2 = [1/√2, 1/√2, 0]
ê₂ = u₂/‖u₂‖ = [1/2,-1/2,1]/√(3/2) = [1/√6, -1/√6, 2/√6]
```

---

### 🎪 PROJECTION

**Orthogonal projection** of v onto u:
```
proj_u(v) = (⟨v,u⟩/⟨u,u⟩)u
```

**Projection onto subspace** W with orthonormal basis {u₁, ..., uₖ}:
```
proj_W(v) = ⟨v,u₁⟩u₁ + ⟨v,u₂⟩u₂ + ... + ⟨v,uₖ⟩uₖ
```

**Orthogonal complement**: `v - proj_W(v)` is orthogonal to W

---

### 🔲 ORTHOGONAL MATRICES

**Definition**: Q is **orthogonal** if:
```
QᵀQ = QQᵀ = I  ⟺  Qᵀ = Q⁻¹
```

**Equivalent**: Columns form orthonormal basis

**Properties**:
- `‖Qx‖ = ‖x‖` (preserves length)
- `⟨Qx, Qy⟩ = ⟨x, y⟩` (preserves angles)
- `det(Q) = ±1`
- Eigenvalues have |λ| = 1

**Examples**:
- Rotation matrices
- Reflection matrices  
- Permutation matrices

---

### 👑 SCHUR'S LEMMA (SCHUR DECOMPOSITION)

**Theorem**: Every square matrix A has **Schur form**:
```
A = QTQ*
```
where:
- Q is unitary (orthogonal if real)
- T is upper triangular
- Q* is conjugate transpose of Q

**For real matrices with real eigenvalues**:
```
A = QTQᵀ
```
where Q orthogonal, T upper triangular

---

### 🔥 SCHUR FORM PROPERTIES

**Key insights**:
- Diagonal of T = eigenvalues of A
- Every matrix is "almost diagonal" via orthogonal transformation
- Eigenvalues appear on diagonal

**Relationship to diagonalization**:
- If A diagonalizable: T is diagonal
- If A not diagonalizable: T has off-diagonal entries

**Algorithm sketch**:
1. Find eigenvalue λ₁ and eigenvector v₁
2. Extend v₁ to orthonormal basis via Gram-Schmidt
3. Form Q₁ with v₁ as first column
4. Compute Q₁*AQ₁ (has λ₁ in corner)
5. Recursively apply to (n-1)×(n-1) block

---

### 🌟 SPECTRAL THEOREM

**For real symmetric matrices** (Aᵀ = A):
```
A = QDQᵀ
```
where:
- Q is orthogonal (columns = orthonormal eigenvectors)
- D is diagonal (diagonal = eigenvalues)

**Key properties of symmetric matrices**:
1. All eigenvalues are **real**
2. Eigenvectors for distinct eigenvalues are **orthogonal**
3. Always **diagonalizable**
4. Can choose **orthonormal basis** of eigenvectors

**Applications**:
- Principal Component Analysis (PCA)
- Quadratic forms
- Optimization
- Physics (moment of inertia, etc.)

---

## 🗺️ THE GRAND MAP

```
┌────────────────────────────────────────────────────┐
│           LINEAR ALGEBRA UNIVERSE                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Vector Spaces                                     │
│  ↓                                                 │
│  Linear Independence & Span                        │
│  ↓                                                 │
│  Basis & Dimension                                 │
│  ↓                                                 │
│  Linear Transformations                            │
│  ↓                                                 │
│  Matrix Representation                             │
│  ↓                                                 │
│  ┌──────────────────────────────────┐             │
│  │  Eigenvalues & Eigenvectors      │             │
│  └──────────────────────────────────┘             │
│           ↙              ↘                         │
│    Diagonalizable?    Not Diagonalizable          │
│           ↓                ↓                       │
│       A = PDP⁻¹      Jordan Form                  │
│           ↓                                        │
│    Matrix Functions                                │
│    (e^A, A^n, √A, ...)                            │
│                                                    │
│  ┌──────────────────────────────────┐             │
│  │  Orthogonality                   │             │
│  │  ↓                               │             │
│  │  Gram-Schmidt                    │             │
│  │  ↓                               │             │
│  │  Orthonormal Bases               │             │
│  │  ↓                               │             │
│  │  Spectral Theorem (Symmetric)    │             │
│  │  A = QDQᵀ                        │             │
│  └──────────────────────────────────┘             │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎯 QUICK REFERENCE TABLES

### 🔍 MATRIX PROPERTIES DECODER

| Property | Definition | Test | Implications |
|----------|------------|------|--------------|
| **Invertible** | `∃A⁻¹: AA⁻¹=I` | `det(A)≠0` | rank=n, ker={0} |
| **Symmetric** | `Aᵀ=A` | Check entries | Real eigenvalues, orthogonal eigenvectors |
| **Orthogonal** | `AᵀA=I` | Check `AᵀA` | Preserves length, `det=±1` |
| **Diagonal** | Off-diag=0 | Visual | Eigenvalues on diagonal |
| **Triangular** | Upper/lower | Visual | Eigenvalues on diagonal |
| **Positive definite** | `xᵀAx>0 ∀x≠0` | Eigenvalues | All λ > 0 |
| **Normal** | `AAᵀ=AᵀA` | Check | Schur decomp to diagonal |

---

### 🎪 DIMENSION CHEAT SHEET

| Space | Standard Basis | Dimension |
|-------|----------------|-----------|
| `ℝⁿ` | `{e₁, ..., eₙ}` | n |
| `Mₘₓₙ` | `{Eᵢⱼ}` (single 1 entry) | m·n |
| `Pₙ` | `{1, x, x², ..., xⁿ}` | n+1 |
| `Sym_n` | Symmetric n×n | n(n+1)/2 |
| `Skew_n` | Skew-symmetric n×n | n(n-1)/2 |

---

### ⚡ COMPUTATIONAL COMPLEXITY

| Operation | Complexity | Notes |
|-----------|------------|-------|
| **Matrix mult** (n×n) | O(n³) | Strassen: O(n^2.807) |
| **Gaussian elim** | O(n³) | Exact solution |
| **Determinant** | O(n³) | Via row reduction |
| **Inverse** | O(n³) | Via Gaussian elim |
| **Eigenvalues** | O(n³) | Iterative methods |
| **Matrix power** A^k | O(log k) | If diagonalizable |

---

### 🔑 KEY THEOREMS SUMMARY

| Theorem | Statement | Application |
|---------|-----------|-------------|
| **Rank-Nullity** | `rank+null=n` | Count solutions |
| **Invertible Matrix** | 10+ equivalent conditions | Test invertibility |
| **Spectral (Symmetric)** | `A=QDQᵀ` | Diagonalize symmetric |
| **Schur** | `A=QTQ*` | Almost diagonal |
| **Cayley-Hamilton** | `p(A)=0` | Polynomial of matrix |
| **Gram-Schmidt** | Orthogonalize any basis | Get orthonormal |

---

### 🧮 FORMULA ARSENAL

#### Matrix Operations
```
(AB)ᵀ = BᵀAᵀ
(AB)⁻¹ = B⁻¹A⁻¹
(Aᵀ)⁻¹ = (A⁻¹)ᵀ
det(AB) = det(A)det(B)
det(cA) = cⁿdet(A)
tr(AB) = tr(BA)
```

#### Eigenvalues
```
det(A) = ∏λᵢ
tr(A) = Σλᵢ
det(A-λI) = characteristic polynomial
If Av=λv, then A^k v = λ^k v
```

#### Projections
```
proj_u(v) = (v·u/u·u)u
proj_W(v) = Σᵢ(v·uᵢ)uᵢ  (uᵢ orthonormal)
```

#### Gram-Schmidt
```
uₖ = vₖ - Σᵢ₌₁^(k-1) (vₖ·uᵢ/uᵢ·uᵢ)uᵢ
```

---

## 💡 PROBLEM-SOLVING STRATEGIES

### 🎯 Proof Strategies

**Linear Independence**:
- Set up `c₁v₁ + ... + cₖvₖ = 0`
- Show only trivial solution
- OR: Form matrix and check rank

**Subspace**:
- Check 0 ∈ W
- Check closure under + and ·
- OR: Show W = ker(T) or im(T)

**Diagonalizability**:
- Find eigenvalues
- Check: # indep eigenvectors = n?
- If symmetric: automatically yes!

---

### 🔧 Computational Strategies

**Solving Ax = b**:
1. Check if solution exists (rank test)
2. Use Gaussian elimination (RREF)
3. Free variables → parametric solution

**Finding eigenvalues**:
1. Compute det(A - λI)
2. Solve characteristic polynomial
3. For each λ: solve (A - λI)v = 0

**Diagonalizing**:
1. Find all eigenvalues
2. Find all eigenvectors
3. Form P from eigenvectors
4. Form D from eigenvalues
5. Check: A = PDP⁻¹

**Gram-Schmidt**:
1. Start with u₁ = v₁
2. For each k: subtract projections onto all previous uᵢ
3. Normalize if needed

---

### 🧠 Intuition Builders

**Matrices as transformations**:
- Rotation: Orthogonal matrix
- Scaling: Diagonal matrix
- Shear: Upper/lower triangular
- Projection: Idempotent (A² = A)

**Eigenvalues**:
- Directions of pure scaling
- λ > 1: expansion
- 0 < λ < 1: contraction
- λ < 0: reflection + scaling
- λ = 0: collapse dimension

**Determinant**:
- Volume scaling factor
- 0 → collapses dimension
- Negative → orientation flip

---

## 🏆 APPLICATIONS SHOWCASE

### 🎮 Computer Graphics
- Rotation matrices (3D graphics)
- Perspective projection
- Coordinate transformations

### 📊 Data Science
- PCA (Principal Component Analysis)
- SVD (Singular Value Decomposition)
- Least squares regression

### 🔬 Physics
- Quantum mechanics (Hermitian operators)
- Moment of inertia tensor
- Normal modes of vibration

### 🤖 Machine Learning
- Neural network weights
- Gradient descent
- Dimensionality reduction

### 📈 Differential Equations
- Systems: `dx/dt = Ax`
- Solution: `x(t) = e^(At)x(0)`
- Stability analysis via eigenvalues

---

## 🚨 COMMON PITFALLS

| Mistake | Correction |
|---------|------------|
| `(AB)ᵀ = AᵀBᵀ` | `(AB)ᵀ = BᵀAᵀ` ⚠️ Order reverses! |
| `(A+B)⁻¹ = A⁻¹+B⁻¹` | NO simple formula ❌ |
| `det(A+B) = det(A)+det(B)` | False in general ❌ |
| `AB = BA` | Usually false ❌ |
| Eigenvalue 0 → not invertible | ✅ Correct |
| Eigenvector can be 0 | ❌ Must be nonzero |
| `rank(A) = # rows` | Only if rows independent |
| Confusing null(A) with {0} | null(A) is a subspace |

---

## 📚 FURTHER STUDY

**Core Texts**:
- Strang: *Introduction to Linear Algebra*
- Axler: *Linear Algebra Done Right*
- Hoffman/Kunze: *Linear Algebra*
- Meyer: *Matrix Analysis and Applied Linear Algebra*

**Advanced Topics**:
- Singular Value Decomposition (SVD)
- Jordan Canonical Form (n×n)
- Tensor products
- Spectral theory
- Numerical linear algebra

**Applications**:
- Quantum computing
- Control theory
- Optimization
- Graph theory

---

```
┌──────────────────────────────────────────────────┐
│  "Linear algebra is the study of two operations: │
│   addition and multiplication. Everything else   │
│   is just bookkeeping." — Gilbert Strang         │
└──────────────────────────────────────────────────┘
```

**EOF** 🎯