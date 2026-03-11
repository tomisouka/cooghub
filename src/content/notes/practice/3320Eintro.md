# COSC 3320 Intro Exam – Solutions with Highlighted Answers

## Problem 1: Combinatorics (30 points)

> 📖 **Concept:** Combinatorics — Permutations, Combinations, Arrangements with Repetition

We have $n$ students and $k \le n$ movie tickets.

---

### (a) Tickets for different movies, each student gets at most one ticket (8 points)

**Informal explanation:**  
You have $k$ distinct tickets and $n$ students. First, pick which $k$ students get tickets ($\binom{n}{k}$ ways). Then decide which ticket goes to which of those chosen students ($k!$ ways). Multiply them together.

**Formal name:** **Permutations** of $n$ items taken $k$ at a time.

$$P(n,k) = \frac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1)$$

**Your answer:** Mentioned $n!$ and "distinct elements" but no correct formula. ❌

---

### (b) Tickets for different movies, each student can get any number of tickets (7 points)

**Informal explanation:**  
Each ticket can go to any of the $n$ students independently. First ticket: $n$ choices, second ticket: $n$ choices, … , $k$-th ticket: $n$ choices. Multiply them.

**Formal name:** **Arrangements with repetition** (functions from a $k$-set to an $n$-set).

$$n^k$$

**Your answer:** Wrote $P(n,k)$ (answer for part a). ❌ (You lost 4 points.)

---

### (c) Tickets for the same movie, each student gets at most one ticket (7 points)

**Informal explanation:**  
Tickets are identical, so you just choose which $k$ students receive one. Order doesn't matter.

**Formal name:** **Combinations** (binomial coefficient).

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

**Your answer:** Correct! ✅ (Full credit)

---

### (d) Rank the three answers asymptotically for $k = \lfloor n/2 \rfloor$ (8 points)

**Informal explanation:**  
When $n$ is large:
- $\binom{n}{n/2}$ grows like $2^n$ (exponential).
- $\frac{n!}{(n/2)!}$ grows roughly like $n^{n/2}$ but is a bit smaller.
- $n^{n/2}$ is pure $n^{n/2}$ and is the largest.

So from slowest to fastest:
$$\binom{n}{n/2} \;\; \ll \;\; \frac{n!}{(n/2)!} \;\; \ll \;\; n^{n/2}$$

**Formal notation:**  
$$\binom{n}{n/2} = o\!\left(\frac{n!}{(n/2)!}\right) \quad\text{and}\quad \frac{n!}{(n/2)!} = o\!\left(n^{n/2}\right)$$

**Your answer:** Gave some equalities but no clear ordering. ❌

---

## Problem 2: Induction (30 points)

> 📖 **Concept:** Mathematical Induction

**Statement:** For any positive integer $n$, $6^n - 1$ is divisible by $5$.

---

### 1. Induction variable (2 points)

$$n$$

**Your answer:** "variable we are solving for" – essentially correct. ✅

---

### 2. Base case (3 points)

$$n = 1:\; 6^1 - 1 = 5,\text{ which is divisible by }5$$

**Your answer:** Correct. ✅

---

### 3. Induction hypothesis (7 points)

$$\text{Assume that for some positive integer }k,\; 6^k - 1 = 5m \text{ for some integer }m.$$

**Your answer:** "Assume $6^n - 1$ is divisible by 5 for $n$" – a bit vague, lost 3 points. ❌ Partial credit.

---

### 4. Induction step (15 points)

**What to prove:** If $6^k - 1$ is divisible by $5$, then $6^{k+1} - 1$ is also divisible by $5$.

**Proof:**

$$\begin{aligned}
6^{k+1} - 1 &= 6\cdot 6^k - 1 \\
&= 6(6^k - 1) + 6 - 1 \\
&= 6(6^k - 1) + 5 \\
&= 6(5m) + 5 \quad\text{(by induction hypothesis)}\\
&= 5(6m + 1)
\end{aligned}$$

Thus $6^{k+1} - 1$ is a multiple of $5$. ✅

**Your answer:** Incomplete and messy – lost 7 points. ❌

---

### 5. Weak or strong induction? (3 points)

$$\text{Weak induction, because }P(k+1)\text{ depends only on }P(k).$$

**Your answer:** Correct. ✅

---

## Problem 3: Algorithms (40 points)

> 📖 **Concept:** Recursive Algorithms & Recurrence Relations — *Pandurangan, Introduction to Algorithms*

Array $A[1..n]$ of 0s and 1s is **good** if it has an even number of 1s.

---

### (a) Recursive algorithm (pseudocode) (20 points)

**Informal explanation (linear recursion):**  
Check the last element. If it's 0, the parity is the same as for the first $n-1$ elements. If it's 1, the parity flips. Recurse on the first $n-1$ elements.

**Pseudocode:**

```
function isGood(A, n):
  if n == 0:
    return True
  else:
    prev = isGood(A, n-1)
    if A[n] == 0:
      return prev
    else:
      return not prev
```

**Your answer:** Too vague ("divide and conquer," "split mid"). ❌

---

### (b) Proof of correctness using induction (10 points)

**Informal proof:**  
We prove by induction on $n$ that `isGood(A, n)` returns `True` iff the first $n$ elements have an even number of 1s.

**Base case** $n=0$: Returns True, and empty array has 0 ones (even).

**Inductive hypothesis:** For any $m < n$, $\text{isGood}(A,m)$ is correct.

**Inductive step:** Consider array of size $n$.  
Let $p = \text{isGood}(A, n-1)$. By hypothesis, $p$ is True iff first $n-1$ have even ones.  
If $A[n] = 0$, total parity same as $p$, so return $p$.  
If $A[n] = 1$, parity flips, so return $\text{not } p$.  
Thus the algorithm is correct for size $n$.

**Your answer:** No induction proof given. ❌

---

### (c) Recurrence for runtime (5 points)

**Informal reasoning:**  
Each call does constant work + one recursive call on size $n-1$.

$$T(n) = T(n-1) + O(1),\quad T(0) = O(1)$$

**Your answer:** $T(n) = T(n-1) + 1$ – correct. ✅

---

### (d) Solve the recurrence and find the runtime (5 points)

**Informal solution:**  
Unfolding gives $T(n) = T(0) + n \cdot O(1) = O(n)$.

$$T(n) = O(n)$$

**Your answer:** $T(n) = O(n)$ – correct. ✅

---

## Final Summary

| Problem Part | Correct Answer | Your Result |
|--------------|----------------|-------------|
| 1(a) | $\frac{n!}{(n-k)!}$ | ❌ |
| 1(b) | $n^k$ | ❌ |
| 1(c) | $\binom{n}{k}$ | ✅ |
| 1(d) | $\binom{n}{n/2} = o\!\left(\frac{n!}{(n/2)!}\right) = o\!\left(n^{n/2}\right)$ | ❌ |
| 2.1 | $n$ | ✅ |
| 2.2 | $n=1: 6^1-1=5$ | ✅ |
| 2.3 | Assume $6^k-1=5m$ | ❌ Partial |
| 2.4 | $6^{k+1}-1 = 5(6m+1)$ | ❌ |
| 2.5 | Weak induction | ✅ |
| 3(a) | Linear recursion pseudocode | ❌ |
| 3(b) | Induction proof (see above) | ❌ |
| 3(c) | $T(n) = T(n-1) + 1$ | ✅ |
| 3(d) | $T(n) = O(n)$ | ✅ |

**Total as marked: 22/100.**  
Use the highlighted answers as your study guide. Practice writing clear pseudocode and rigorous induction proofs – they are key to doing well on algorithm exams. Good luck! 🚀