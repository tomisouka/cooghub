#include <vector>
#include <algorithm>
#include <climits>

// ============ FIBONACCI (TOP-DOWN / MEMOIZATION) ============
// Type: Recursive with memoization
// Time: O(n)
// Space: O(n)
// Use: Compute Fibonacci with caching

int fibMemo(int n, int memo[]) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}


// ============ FIBONACCI (BOTTOM-UP / TABULATION) ============
// Type: Iterative
// Time: O(n)
// Space: O(n)
// Use: Compute Fibonacci iteratively

int fibTab(int n) {
    if (n <= 1) return n;
    
    int dp[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}


// ============ CLIMBING STAIRS ============
// Type: Iterative (DP)
// Time: O(n)
// Space: O(n)
// Use: Count ways to climb n stairs (1 or 2 steps at a time)

int climbStairs(int n) {
    if (n <= 2) return n;
    
    int dp[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}


// ============ COIN CHANGE ============
// Type: Iterative (DP)
// Time: O(n * amount)
// Space: O(amount)
// Use: Find minimum coins needed to make amount

int coinChange(int coins[], int n, int amount) {
    int dp[amount + 1];
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        dp[i] = INT_MAX;
    }
    
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < n; j++) {
            if (coins[j] <= i && dp[i - coins[j]] != INT_MAX) {
                dp[i] = std::min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }
    
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}


// ============ 0/1 KNAPSACK ============
// Type: Iterative (DP)
// Time: O(n * W) where W is capacity
// Space: O(n * W)
// Use: Maximize value within weight constraint

int knapsack(int weights[], int values[], int n, int W) {
    int dp[n + 1][W + 1];
    
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0) {
                dp[i][w] = 0;
            } else if (weights[i - 1] <= w) {
                dp[i][w] = std::max(values[i - 1] + dp[i - 1][w - weights[i - 1]], 
                                   dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][W];
}


// ============ LONGEST COMMON SUBSEQUENCE (LCS) ============
// Type: Iterative (DP)
// Time: O(m * n)
// Space: O(m * n)
// Use: Find longest common subsequence between two strings

int lcs(char X[], char Y[], int m, int n) {
    int dp[m + 1][n + 1];
    
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0 || j == 0) {
                dp[i][j] = 0;
            } else if (X[i - 1] == Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}


// ============ LONGEST INCREASING SUBSEQUENCE (LIS) ============
// Type: Iterative (DP)
// Time: O(n²)
// Space: O(n)
// Use: Find length of longest increasing subsequence

int lis(int arr[], int n) {
    int dp[n];
    
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
    }
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
    }
    
    int max = dp[0];
    for (int i = 1; i < n; i++) {
        if (dp[i] > max) {
            max = dp[i];
        }
    }
    
    return max;
}


// ============ EDIT DISTANCE (LEVENSHTEIN) ============
// Type: Iterative (DP)
// Time: O(m * n)
// Space: O(m * n)
// Use: Minimum edits to transform one string to another

int editDistance(char str1[], char str2[], int m, int n) {
    int dp[m + 1][n + 1];
    
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0) {
                dp[i][j] = j;
            } else if (j == 0) {
                dp[i][j] = i;
            } else if (str1[i - 1] == str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + std::min({dp[i - 1][j],      // Delete
                                        dp[i][j - 1],        // Insert
                                        dp[i - 1][j - 1]});  // Replace
            }
        }
    }
    
    return dp[m][n];
}


// ============ MATRIX CHAIN MULTIPLICATION ============
// Type: Iterative (DP)
// Time: O(n³)
// Space: O(n²)
// Use: Minimize scalar multiplications for matrix chain

int matrixChainMultiplication(int p[], int n) {
    int dp[n][n];
    
    for (int i = 1; i < n; i++) {
        dp[i][i] = 0;
    }
    
    for (int len = 2; len < n; len++) {
        for (int i = 1; i < n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                }
            }
        }
    }
    
    return dp[1][n - 1];
}


// ============ KADANE'S ALGORITHM (MAXIMUM SUBARRAY) ============
// Type: Iterative (DP)
// Time: O(n)
// Space: O(1)
// Use: Find maximum sum contiguous subarray

int maxSubarraySum(int arr[], int n) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    
    for (int i = 1; i < n; i++) {
        maxEndingHere = std::max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = std::max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}