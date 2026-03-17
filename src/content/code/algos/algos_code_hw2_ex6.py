#!/usr/bin/env python3
"""
COSC 3320 – Homework 2, Exercise 6
Problem: Partition array into contiguous subarrays of size at most k.
         Each subarray's values all become the subarray's maximum.
         Maximize the total sum of all values after replacement.

DP Formulation:
  Let dp[i] = maximum achievable sum for the first i elements (A[0..i-1]).

  Base case:
    dp[0] = 0  (empty prefix, no elements, sum is 0)

  Recurrence:
    For each position i (1..n), consider every group of length j = 1..min(i,k)
    that ends at position i  (group covers A[i-j .. i-1]):
      - The max of that group is max(A[i-j : i])
      - Its contribution is j * max(A[i-j : i])
      - dp[i] = max over j of  dp[i-j] + j * max(A[i-j : i])

  Answer: dp[n]

Efficient implementation:
  The inner loop scans j = 1..k while maintaining a running max — O(k) per i.
  Total: O(n * k).  For n, k up to ~10^4 this is fast enough in Python.
  For very large n*k we use sys.stdin for fast I/O.

Time complexity : O(n * k)
Space complexity: O(n)
"""

import sys

def max_sum_partition(A, k):
    """
    Compute the maximum total sum after partitioning array A into
    contiguous subarrays each of size at most k, where every element
    in a subarray is replaced by the subarray's maximum.

    Parameters
    ----------
    A : list[int]  – input array of n positive integers (0-indexed)
    k : int        – maximum allowed subarray size (1 <= k <= n)

    Returns
    -------
    int – optimal total sum
    """
    n = len(A)

    # dp[i] = best total sum achievable using exactly the first i elements
    dp = [0] * (n + 1)           # dp[0] = 0 by definition (empty prefix)

    for i in range(1, n + 1):
        # Enumerate all groups of length j that end at index i-1 (0-based)
        # Group spans A[i-j .. i-1]; j ranges from 1 to min(i, k)
        current_max = 0           # max of A[i-j .. i-1] grows as j increases
        best = -1

        for j in range(1, min(i, k) + 1):
            # Grow the group one element to the left: A[i-j]
            current_max = max(current_max, A[i - j])

            # Value of placing A[i-j..i-1] in one group + best for the rest
            candidate = dp[i - j] + j * current_max

            if candidate > best:
                best = candidate

        dp[i] = best             # store the best choice for prefix of length i

    return dp[n]                 # answer: best sum for the entire array


def main():
    """
    Read input from stdin, invoke the DP solver, and print the result.

    Input format:
        Line 1:    n k          (array length and max group size)
        Lines 2..n+1: one integer per line (the array values)

    Output:
        A single integer on its own line: the maximum achievable sum.
    """
    # Fast bulk read — important for large inputs
    data = sys.stdin.buffer.read().split()
    ptr = 0

    n = int(data[ptr]); ptr += 1   # number of elements
    k = int(data[ptr]); ptr += 1   # maximum group size

    # Read all n values
    A = [int(data[ptr + i]) for i in range(n)]

    # Solve and output
    print(max_sum_partition(A, k))


if __name__ == "__main__":
    main()
