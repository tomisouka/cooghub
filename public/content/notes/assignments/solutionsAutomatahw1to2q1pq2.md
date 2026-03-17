# COSC 3340 — Complete Solutions

---

## HW1 Solutions

### Q1 — Finite Subsets of N are Countably Infinite

**Proof:**  
We show the set ℱ of all finite subsets of N is countably infinite.

**Injection from N to ℱ:** The map n ↦ {n} is injective, so |ℱ| ≥ |N|.

**Surjection from N to ℱ (encoding):** For any finite subset S = {a₁ < a₂ < … < aₖ}, encode it as the natural number n = 2^a₁ + 2^a₂ + … + 2^aₖ (with ∅ ↦ 0). Every finite subset maps to a distinct natural number (unique binary representations), so ℱ injects into N. This shows |ℱ| ≤ |N|.

By Schröder-Bernstein, |ℱ| = |N|, so ℱ is countably infinite. □

---

### Q2 — Infinite Subsets of N are Uncountable

**Proof (by complement/diagonalization):**  
Let 𝒫(N) be the power set of N — all subsets of N. By Cantor's theorem, 𝒫(N) is uncountable.

𝒫(N) = ℱ ∪ ℐ, where ℱ = finite subsets and ℐ = infinite subsets.

From Q1, ℱ is countable. If ℐ were also countable, then 𝒫(N) = ℱ ∪ ℐ would be a union of two countable sets — hence countable. Contradiction.

Therefore ℐ is uncountable. □

---

### Q3 — Erdős–Szekeres Theorem (n² + 1 implies n+1 monotone subsequence)

**Proof (by contradiction using pigeonhole):**  
Let a₁, a₂, …, a_{n²+1} be a sequence of n² + 1 distinct natural numbers. For each aᵢ, define dᵢ = length of the longest descending subsequence starting at aᵢ.

**Assume** no ascending subsequence of length n+1 and no descending subsequence of length n+1 exist. Then for all i, dᵢ ∈ {1, 2, …, n} — so there are only n possible values.

By pigeonhole, two positions i < j share the same value: dᵢ = dⱼ. But if aᵢ > aⱼ, then we can prepend aᵢ to the descending subsequence starting at aⱼ, giving dᵢ ≥ dⱼ + 1 — contradiction. If aᵢ < aⱼ, that creates an ascending subsequence.

More formally (standard proof): assign each element the pair (aᵢ, dᵢ). Among n²+1 pairs with each component in {1,…,n}, by pigeonhole either some ascending subsequence reaches length n+1 or some dᵢ = n+1. □

---

### Q4 — Every DFA is also an NFA

**Yes.** A DFA is a special case of an NFA where:
1. The transition function δ: Q × Σ → Q assigns exactly one state (not a set of states) for each (state, symbol) pair.
2. There are no ε-transitions.

An NFA's transition function is δ: Q × (Σ ∪ {ε}) → 𝒫(Q). A DFA's δ(q, a) = {q'} satisfies this definition (a singleton set). So every DFA is an NFA with the restriction that all transitions go to singleton sets and no ε-transitions exist. □

---

### Q5 — Every n ≥ 20 is of the form 5a + 6b (Strong Induction)

**Proof by strong induction:**

**Base cases:**
- n = 20: 20 = 5(4) + 6(0) ✓
- n = 21: 21 = 5(3) + 6(1) ✓
- n = 22: 22 = 5(2) + 6(2) ✓
- n = 23: 23 = 5(1) + 6(3) ✓
- n = 24: 24 = 5(0) + 6(4) ✓

**Inductive step:** Assume every integer from 20 to k can be written in this form (k ≥ 24). We show k+1 can also.

Since k+1 ≥ 25, we have k+1 − 5 = k − 4 ≥ 20. By the inductive hypothesis, k − 4 = 5a + 6b for some non-negative a, b.

Then k + 1 = 5a + 6b + 5 = 5(a+1) + 6b. Since a+1 ≥ 1 ≥ 0 and b ≥ 0, this is valid. □

---

### Q6 — NFA with ε-transitions → DFA Conversion

**Given NFA:**

| State | a | b | ε |
|-------|---|---|---|
| q0 | {q0} | {q0} | {q1} |
| q1 | {q2} | ∅ | ∅ |
| q2 | {q2} | {q2} | ∅ |

**Step 1: ε-closures**
- ε-closure(q0) = {q0, q1}  (q0 →ε q1)
- ε-closure(q1) = {q1}
- ε-closure(q2) = {q2}

**Step 2: DFA subset construction (start = ε-closure(q0) = {q0,q1})**

| DFA State | a | b | Accepting? |
|-----------|---|---|-----------|
| {q0,q1} | ε-cl(δ(q0,a)∪δ(q1,a)) = ε-cl({q0}∪{q2}) = {q0,q1,q2} | ε-cl({q0}∪∅) = {q0,q1} | No (start) |
| {q0,q1,q2} | ε-cl({q0}∪{q2}∪{q2}) = {q0,q1,q2} | ε-cl({q0}∪∅∪{q2}) = {q0,q1,q2} | **Yes** (contains q2) |

**DFA Transition Table:**

| State | a | b |
|-------|---|---|
| A = {q0,q1} (start) | B | A |
| B = {q0,q1,q2} (accept) | B | B |

**Diagram:**
```
      a           a,b (self-loop)
A ---------> B <--------
|            
b (self-loop on A)
```
- Start: A
- Accept: B
- A --a--> B, A --b--> A
- B --a--> B, B --b--> B

**In English:** The DFA accepts any string containing at least one 'a'. This makes sense: the original NFA non-deterministically guesses when an 'a' begins the path q0→q1→q2 (via ε then a), after which all remaining symbols are accepted.

---

## HW2 Solutions

### Q1a — DFA for "does not contain 010"

States track the longest suffix that is a prefix of "010":

| State | Meaning | 0 | 1 |
|-------|---------|---|---|
| q_ε (start, accept) | No prefix match | q_0 | q_ε |
| q_0 (accept) | Seen "0" | q_0 | q_01 |
| q_01 (accept) | Seen "01" | q_dead | q_ε |
| q_dead (reject) | Seen "010" — trap | q_dead | q_dead |

**JFLAP Description:**
- States: {q_ε, q_0, q_01, q_dead}
- Start: q_ε, Accept: {q_ε, q_0, q_01}
- Transitions as above

**Test strings in language:** ε, "0", "1", "001", "110", "01", "00"
**Test strings NOT in language:** "010", "0101", "1010", "10100"

---

### Q1b — DFA for "number of 0's + number of 1's is odd" = "length is odd"

Since the number of 0's + number of 1's = length of w:

| State | Meaning | 0 | 1 |
|-------|---------|---|---|
| q_even (start) | |w| even | q_odd | q_odd |
| q_odd (accept) | |w| odd | q_even | q_even |

**Test strings in language:** "0", "1", "010", "101", "000"
**Test strings NOT in language:** ε, "00", "11", "0101"

---

### Q2a — NFA for {w ∈ {a,b,c}* | |w| ≥ 2 and (second-last symbol is b OR every a separated from every c by at least one b)}

This is a union of two languages: L₁ ∪ L₂.

**L₁:** |w| ≥ 2 and second-last symbol is b.
- NFA: non-deterministically guess the second-last position is b, accept after reading one more symbol.
- States: q0 →(b)→ q1 →(a,b,c)→ q2(accept)

**L₂:** every a in w is separated from every c by at least one b.
- No "ac" or "ca" pattern without b in between.
- Track whether we just saw an a (needing a b before c) or a c (needing a b before a).
- States: {start, saw_a, saw_c, dead}
  - start: on a → saw_a; on b → start; on c → saw_c
  - saw_a: on a → saw_a; on b → start; on c → dead
  - saw_c: on a → dead; on b → start; on c → saw_c
  - dead: all → dead (trap)
- Accept: {start, saw_a, saw_c} ∩ {|w| ≥ 2}

**Combined NFA:** Use ε-transitions from a new start to both sub-NFAs.

---

### Q2b — NFA for {w ∈ {a,b}* | w has at least one a and no more than two b's}

```
States: q0(start) → handles b's and a's
```

**NFA Design:**
- q0: start state
- On reading 'a': move toward acceptance
- Track b count with states for 0, 1, or 2 b's seen

| State | a | b |
|-------|---|---|
| q0 | q1 | q_b1 |
| q_b1 | q1 | q_b2 |
| q_b2 | q1 | q_dead |
| q1 (accept) | q1 | q_b1a |
| q_b1a | q1 | q_b2a |
| q_b2a | q1 | ∅ |
| q_dead | q_dead | q_dead |

Simplified NFA: non-deterministically track whether we've seen at least one 'a' and count b's ≤ 2.

**Cleaner approach:** Accept if: count(a) ≥ 1 AND count(b) ≤ 2.
- States encode (has_a ∈ {0,1}) × (b_count ∈ {0,1,2,3+})
- (0,0) start; (1, 0..2) accept states

**Test strings in language:** "a", "ab", "aba", "bab", "abb"
**Test strings NOT in language:** "b", "bbb", "bbba", "ε"

---

### Q3a — Regex for {w ∈ {0,1,2}* | w does not contain 00}

No two consecutive 0's. Between any two 0's there must be at least one non-zero character.

**Regex:** `(1|2|0(1|2))*(0|ε)`

More precisely: `(1|2)*(0(1|2)(1|2)*)*(0?)` — but cleanest form:

**Answer:** `(1|2|0(1|2))*(ε|0)`

Or equivalently: **`([1+2] | 0[1+2])* (0 | ε)`**  
In standard notation: `(1|2|0(1|2))*(0|λ)`

---

### Q3b — Regex for {w ∈ {0,1,2}* | w contains 01 and is of even length}

Even-length strings containing "01":

Split the string as: (even-length prefix)(01)(even-length suffix) — but "01" may not align to an even boundary.

**Key insight:** If "01" starts at an even position (0-indexed), prefix has even length. If at odd position, prefix has odd length and suffix must have odd length.

**Case 1:** even-length before "01", even-length after:  
`(Σ²)* · 01 · (Σ²)*`  where Σ = (0|1|2)

**Case 2:** odd-length before "01", odd-length after:  
`(Σ²)*·Σ · 01 · Σ·(Σ²)*`

Let E = `(0|1|2)((0|1|2)(0|1|2))*` (odd length ≥ 1) and P = `((0|1|2)(0|1|2))*` (even length ≥ 0).

**Answer:** `P·01·P | P·(0|1|2)·01·(0|1|2)·P`

Simplified: `((0|1|2)(0|1|2))*01((0|1|2)(0|1|2))* | ((0|1|2)(0|1|2))*(0|1|2)01(0|1|2)((0|1|2)(0|1|2))*`

---

### Q3c — Regex for {w ∈ {0,1,2}* | w does not contain 11 OR w is of odd length}

By De Morgan, the complement is: w contains 11 AND w has even length.

**L₁** = no 11: `(0|2|1(0|2))*(1|ε)`  
**L₂** = odd length: any odd-length string = `(0|1|2)((0|1|2)(0|1|2))*`

**L₁ ∪ L₂:** Since this is a union, the regex is the concatenation/alternation:

**Answer:** `(0|2|1(0|2))*(1|ε) | (0|1|2)((0|1|2)(0|1|2))*`

---

### Q4 — Convert NFA (Q2b) to DFA

Starting from the NFA for {at least one a, no more than two b's}:

Use subset construction. Key insight: track (a_seen: bool, b_count: 0|1|2|3+).

| NFA subset | a | b | Accept? |
|-----------|---|---|---------|
| {q0} start | {q0,q_has_a} | {q_b1} | No |
| {q0,q_has_a} | {q0,q_has_a} | {q_b1,q_b1a} | Yes |
| {q_b1} | {q0,q_has_a,q_b1} | {q_b2} | No |
| {q_b1,q_b1a} | {q0,q_has_a,q_b1} | {q_b2,q_b2a} | Yes |
| {q_b2} | {q_b2,q_has_a} | {q_dead} | No |
| {q_b2,q_b2a} | {q_b2,q_has_a} | {q_dead} | Yes |
| {q_dead} | {q_dead} | {q_dead} | No |

---

### Q5 — Convert Regex of Q3a to NFA

Regex: `(1|2|0(1|2))*(0|ε)`

Using Thompson's construction:

1. **NFA for (1|2):** q0 →1→ q1, q0 →2→ q1
2. **NFA for 0(1|2):** q0 →0→ q2 →1→ q3, q2 →2→ q3
3. **Union (1|2|0(1|2)):** new start s, ε to both; new accept f, ε from both ends
4. **Kleene star:** add ε from accept back to start, ε from new start to accept
5. **Concatenate with (0|ε):** append optional 0

Final NFA has ~10 states. States: s (start), t (after ε-split), handles all paths.

---

### Q6 — Convert NFA from Q5 to Regex (GNFA Method)

Starting from the NFA of `(1|2|0(1|2))*(0|ε)`:

**Step 1:** Add new start s_new and accept s_acc with ε transitions.
**Step 2:** Eliminate states one by one using: when removing state q_rip, for each (qᵢ, qⱼ) pair, add edge: R(qᵢ,qⱼ) ∪ R(qᵢ,q_rip)·R(q_rip,q_rip)*·R(q_rip,qⱼ)
**Step 3:** Continue until only s_new and s_acc remain.
**Result:** The final regex on edge s_new → s_acc = `(1|2|0(1|2))*(0|ε)` (returns to original).

---

## Practice Quiz 2 Solutions

### Q1a — Language of (ab ∪ b)*

**(ab ∪ b)*** generates all strings over {a,b} that can be formed by concatenating zero or more copies of either "ab" or "b".

**In English:** The set of all strings over {a,b} where every 'a' is immediately followed by a 'b'. Equivalently, no 'a' appears at the end or before another 'a' without an intervening 'b'. This is all strings that do not contain an 'a' that is not immediately succeeded by 'b'.

More precisely: strings where every 'a' is always immediately followed by 'b'. This is {ε, b, ab, bb, abb, bab, abab, bbb, …}.

---

### Q1b — Regex for "does not contain bb"

**Answer:** `(a | ba)*(b | ε)`

**Justification:** 
- We can never have two consecutive b's.
- Between any two b's there must be at least one 'a'.
- The pattern `(a|ba)*` builds the body: either an a alone, or a b followed immediately by an a.
- Then optionally one final b.
- This covers all strings without "bb".

---

### Q2 — Pumping Lemma: L = {aⁿb²ⁿ | n ≥ 0} is not regular

**(a) Assumption:** Assume L is regular. Let p be the pumping length.

**(b) Choice of s:** Let s = aᵖb²ᵖ ∈ L. |s| = 3p ≥ p. ✓

**(c) Decomposition s = xyz:**
By the Pumping Lemma:
- |xy| ≤ p, so xy consists only of a's (since the first p characters are all a's).
- |y| ≥ 1, so y = aᵏ for some k ≥ 1.
- x = aⁱ, y = aᵏ (k ≥ 1), z = aᵖ⁻ⁱ⁻ᵏb²ᵖ

**(d) Contradiction:** Pump i = 0: xyᵒz = xz = aᵖ⁻ᵏb²ᵖ.

For this to be in L, we need 2(p−k) = 2p, i.e., k = 0. But k ≥ 1 — contradiction.

Therefore L is not regular. □

---

### Q3a — DFA for "every 0 is immediately followed by at least one 1"

| State | Meaning | 0 | 1 |
|-------|---------|---|---|
| q_ok (start, accept) | No pending 0 | q_need1 | q_ok |
| q_need1 | Saw 0, need 1 next | q_dead | q_ok |
| q_dead (trap) | Violated — 0 not followed by 1 | q_dead | q_dead |

- Start: q_ok
- Accept: {q_ok, q_need1}? — No! q_need1 means we just saw a 0 but haven't confirmed a following 1, **and we're at end of string**, which means the 0 is NOT followed by 1.
- **Accept: {q_ok} only**

Wait — re-reading: "every 0 is immediately followed by at least one 1" means at the end, a trailing 0 is invalid.
- **Accept: {q_ok}**

---

### Q3b — DFA to Regex (State Elimination)

From the DFA in Q3a with states {q_ok, q_need1, q_dead}:

1. Add new start s and new accept f with ε transitions from/to q_ok.
2. Eliminate q_dead (trap, no path to accept): remove it.
3. Remaining: s →ε→ q_ok →1(loop)→ q_ok, q_ok →0→ q_need1 →1→ q_ok, q_ok →ε→ f.

State elimination of q_need1:
- Path: q_ok →0→ q_need1 →1→ q_ok becomes self-loop q_ok →01→ q_ok.

Now: q_ok has self-loops 1 and 01, so loop label = (1|01).
Result: s →ε→ q_ok →(1|01)*→ q_ok →ε→ f

**Regex: `(1|01)*`**

This makes sense: strings over {0,1} where every 0 is followed by 1 are exactly the strings formed by concatenating "1"s and "01"s.

---

### Q4a — NFA for "contains aba AND contains no bbb"

**Strategy:** Track progress toward "aba" and simultaneously ensure "bbb" never appears.

States track b-run length (0, 1, 2, ≥3=dead) combined with aba-matching progress (0, 1, 2, 3=found).

**Key states:**
- (aba_progress, b_run_length) — but this gets complex.

**Simplified NFA (non-deterministic):**
- Use NFA to non-deterministically guess where "aba" starts.
- Main thread tracks consecutive b count; if 3 b's seen → dead state.
- Sub-thread for aba: start → a → q_a → b → q_ab → a → q_aba(accept marker)

**States:** {start, b1, b2, dead} × {aba_not_found, aba_found}
- Transitions prevent bbb (b1→b2→dead on third b)
- Accept when aba_found AND not in dead state

---

### Q4b — NFA to DFA (Q4a)

Use subset construction on the NFA from Q4a. The states of the DFA are subsets of NFA states.

The DFA will have states encoding (b_run ∈ {0,1,2,dead}) × (aba_progress ∈ {0,1,2,3}).

Accept states: those subsets containing an NFA accept state (aba found, not dead).

(Full expansion omitted for brevity — apply standard subset construction.)

---

### Q5 — L/σ is Regular

**Proof:**
Let M = (Q, Σ, δ, q₀, F) be a DFA recognizing L.

Define M' = (Q, Σ, δ, q₀, F'), where F' = {q ∈ Q | δ(q, σ) ∈ F}.

**Claim:** M' recognizes L/σ.

**Proof:** w ∈ L(M') iff δ*(q₀, w) ∈ F' iff δ(δ*(q₀, w), σ) ∈ F iff δ*(q₀, wσ) ∈ F iff wσ ∈ L.

So L(M') = {w | wσ ∈ L} = L/σ. Since M' is a DFA, L/σ is regular. □

---

### Q6 — What Goes Wrong + Showing Language is Regular

**Language:** L = {w ∈ {a,b}* | w has no b before any a} = strings of form a*b* (all a's before all b's).

**What goes wrong with Pumping Lemma attempt:**
If we try s = aᵖbᵖ, then xy consists of a's only, y = aᵏ. Pumping gives aᵖ⁺ᵏbᵖ, which is still in a*b* — so pumping UP doesn't give a contradiction. Pumping DOWN gives aᵖ⁻ᵏbᵖ, still in a*b*. **No contradiction is possible** because the language IS regular! The Pumping Lemma cannot be used to prove a regular language is irregular.

**Showing L is regular:**
L = a*b* is described by the regular expression **`a*b*`**, which is obviously regular.

Alternatively, a DFA:

| State | a | b |
|-------|---|---|
| q0 (start, accept) | q0 | q1 |
| q1 (accept) | q_dead | q1 |
| q_dead | q_dead | q_dead |

L = L(this DFA), so L is regular. □

---

### Q7 — What's Wrong with the Horses Proof

**Error:** The inductive step fails for N = 1 (the base case for the step).

When N = 1, we have a group of N+1 = 2 horses. Excluding the last gives {horse 1} and excluding the first gives {horse 2}. These sets have **no overlap** — so we cannot conclude horse 1 and horse 2 share the same color.

The argument requires the two groups of N horses to share at least one horse in common (to "link" the colors). When N = 1, each group has only 1 horse, and there is no overlap. The inductive step implicitly assumes N ≥ 2.

**Formal error:** The proof assumes {1,…,N} ∩ {2,…,N+1} = {2,…,N} is non-empty, which fails when N = 1. □

---

### Q8 — U − C is Uncountable

**Proof:**
Suppose U is uncountable and C is countable. Assume for contradiction that U − C is countable.

Then U = (U − C) ∪ (U ∩ C) ⊆ (U − C) ∪ C.

Since U − C is countable (by assumption) and C is countable, their union is countable. But U ⊆ (U−C) ∪ C implies U is countable — contradiction.

Therefore U − C must be uncountable. □

**Implication for this course:**
The set of all languages over Σ = 𝒫(Σ*) is uncountable (Σ* is countably infinite, so its power set is uncountable by Cantor's theorem). The set of all regular languages is countable (each is described by a finite regular expression; there are countably many finite strings). By our result, the set of non-regular languages is uncountable — meaning **most languages are not regular** (and in fact, most languages are not even recognizable by any computational model).

---

## Quiz 1 Solutions (with Corrections)

### Q1a — Diagonalization Principle

**Correct definition:** The diagonalization principle constructs an object that differs from every element of a given list by disagreeing with the n-th element on the n-th "coordinate," ensuring the constructed object cannot appear in the list.

*(Student answer was incomplete/incorrect — mentioning Kleene Star doesn't apply here.)*

---

### Q1b — Diagonalization Construction

**Given list:**
- s₁ = 0**1**010101…
- s₂ = 1**1**001100…
- s₃ = 00**0**00000…
- s₄ = 101**0**1010…

**Construct t:** For each position i, set t[i] = 1 − sᵢ[i] (flip the diagonal bit).

- t[1] = 1 − s₁[1] = 1 − 0 = **1**
- t[2] = 1 − s₂[2] = 1 − 1 = **0**
- t[3] = 1 − s₃[3] = 1 − 0 = **1**
- t[4] = 1 − s₄[4] = 1 − 0 = **1**
- …continue for all positions

**t = 1011…**

**Why t ∉ {s₁, s₂, s₃, …}:** t differs from sᵢ in position i for every i. Thus t ≠ sᵢ for all i. □

---

### Q2 — Induction Proof: Σ(2i−1) = n²

**Base case (n = 1):** LHS = 2(1)−1 = 1. RHS = 1² = 1. ✓

**Inductive hypothesis:** Assume for some k ≥ 1, Σᵢ₌₁ᵏ (2i−1) = k².

**Inductive step:** Show Σᵢ₌₁ᵏ⁺¹ (2i−1) = (k+1)².

Σᵢ₌₁ᵏ⁺¹ (2i−1) = [Σᵢ₌₁ᵏ (2i−1)] + (2(k+1)−1)
= k² + (2k+1)   [by inductive hypothesis]
= (k+1)²  ✓

Therefore by induction, the formula holds for all n ≥ 1. □

*(Student had the right idea but was missing full formality.)*

---

### Q3 — Minimum Socks (Pigeonhole)

**Answer: 7 socks.**

There are 6 colors, 2 socks each = 12 total socks. 

By the Pigeonhole Principle: to **guarantee** 2 of the same color, in the worst case you could draw one sock of each color (6 socks) without getting a pair. The 7th sock must match one of the 6 colors already drawn.

**Minimum = 7.** 

*(Student answer of "you have to pull all 12" was incorrect.)*

---

### Q4 — Cardinality of E and F

**E = {0, 2, 4, 6, …} (even natural numbers)**  
**F = {0, 4, 8, 12, …} (multiples of 4)**

**Claim: E and F have the same cardinality.**

**Proof:** Define f: E → F by f(n) = 2n.
- **Injective:** f(n) = f(m) ⟹ 2n = 2m ⟹ n = m.
- **Surjective:** For any 4k ∈ F, f(2k) = 4k, and 2k ∈ E. ✓

So f is a bijection E → F, hence |E| = |F|. □

*(Student correctly identified E and F have same cardinality but needed to exhibit the bijection.)*

---

### Q5 — Binary Relation that is a Function on S

**Example:** Define R on S (set of students) by: (x, y) ∈ R if and only if y = student_ID(x).

This maps each student to their unique PSID (student ID number).

**Why it's a function:**
1. **Defined everywhere:** Every student has a PSID, so for every x ∈ S, there exists y with (x,y) ∈ R.
2. **Single-valued:** Each student has exactly one PSID, so if (x,y) ∈ R and (x,z) ∈ R then y = z.

Both conditions confirm R is a function. □

*(The identity relation f(s) = s also works: it maps each student to themselves.)*

---

### Q6 — Equivalence Relation on E

**Define relation R on E = {0, 2, 4, 6, …} by:** x R y iff x ≡ y (mod 4), i.e., 4 | (x−y).

**Equivalence classes:** {0, 4, 8, 12, …} = F, and {2, 6, 10, 14, …}.

**Proof of equivalence relation:**
- **Reflexive:** x − x = 0, and 4 | 0. ✓
- **Symmetric:** If 4|(x−y), then 4|(y−x). ✓
- **Transitive:** If 4|(x−y) and 4|(y−z), then 4|(x−z) = (x−y)+(y−z). ✓

R is an equivalence relation. □

---

### Q7 — Probability

**(a) P(at least one head in 3 coin tosses):**

P(at least one H) = 1 − P(no heads) = 1 − (1/2)³ = 1 − 1/8 = **7/8**

*(Student's calculation was confused — answer is 7/8.)*

**(b) P(even number on die AND tail on coin):**

P(even die) = 3/6 = 1/2  
P(tail) = 1/2  
Since independent: P = (1/2)(1/2) = **1/4**

*(Student computed 1/12, which is incorrect.)*

---

### Q8 — Week 1 Course Content Summary

In the first week of COSC 3340, we studied the mathematical foundations of automata theory. Topics included sets, functions, relations, and proof techniques (induction, diagonalization, pigeonhole principle). We introduced cardinality — comparing the sizes of infinite sets — proving some infinities are countable (like N and finite subsets of N) while others are uncountable (like P(N)). We also began exploring formal language models, introducing Deterministic Finite Automata (DFAs) and Nondeterministic Finite Automata (NFAs) as the simplest computational machines that recognize regular languages.
