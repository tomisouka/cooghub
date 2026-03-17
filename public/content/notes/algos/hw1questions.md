Based on the requirements for COSC 3320 Homework 1, here are the mandatory rules and questions you must address:

### **Submission Rules**

* **Zero-Point Rule (Exercise 6):** You must include a unique LeetCode submission URL and a screenshot of the "Accepted" status. Failure to provide both results in a zero for the programming section.


* **No Global Sorting (Exercise 6):** You are strictly prohibited from using built-in sorting functions like `sort()` or `sorted()` on the entire input array. The algorithm must achieve $O(n)$ average time complexity using a selection strategy.


* 
**Mandatory Group Size (Exercise 6):** You must implement the "Median of Medians" algorithm using **groups of 7**, not the standard groups of 5 found in many textbooks.


* 
**Method Completeness (Exercise 3):** You must solve the recurrence using three distinct methods: Mathematical Induction, Unrolling (Recursion Tree), and the Master Theorem.


* 
**Regularity Condition (Exercise 3):** When using the Master Theorem Case 3, you must explicitly verify the regularity condition ($af(n/b) \leq cf(n)$).


* **Justification Requirement:** Simply stating a final answer is insufficient; every exercise requires a reasoning and justification section to receive full credit.

### **Questions to Complete**

* **Exercise 1 (1.5c):** Rank the given functions by order of growth and justify the placement of "trick" terms like $n^{1/\log n}$ and $2^{\lg n}$.
* 
**Exercise 2 (2.8):** Determine the winning conditions for the Stone Game and provide a formal inductive proof for Alice's strategy.


* 
**Exercise 3 (3.1):** Solve the recurrence $T(n) = 2T(n/2) + n^2$ using all three required methods.


* **Exercise 4 (3.9):** Determine the minimum number of comparisons needed to find both the maximum and minimum elements in an array.
* **Exercise 5 (4.15):** Analyze the number of "SAME/DIFFERENT" queries required to identify a majority element in a set of chips.
* 
**Exercise 6:** Implement $O(n)$ selection for "K Closest Points to Origin" on LeetCode using a Group-of-7 Median-of-Medians approach.