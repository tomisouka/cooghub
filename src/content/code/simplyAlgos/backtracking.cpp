#include <vector>
#include <cstdlib>

// ============ N-QUEENS PROBLEM ============
// Type: Recursive (Backtracking)
// Time: O(n!)
// Space: O(n²)
// Use: Place n queens on n×n board so no two attack each other

bool isSafe(int board[], int row, int col, int n) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col || 
            abs(board[i] - col) == abs(i - row)) {
            return false;
        }
    }
    return true;
}

bool solveNQueensUtil(int board[], int row, int n) {
    if (row == n) {
        return true;  // All queens placed
    }
    
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row] = col;
            
            if (solveNQueensUtil(board, row + 1, n)) {
                return true;
            }
            
            // Backtrack
            board[row] = -1;
        }
    }
    
    return false;
}

bool solveNQueens(int n) {
    int board[n];
    for (int i = 0; i < n; i++) board[i] = -1;
    
    return solveNQueensUtil(board, 0, n);
}


// ============ SUDOKU SOLVER ============
// Type: Recursive (Backtracking)
// Time: O(9^(n*n)) worst case
// Space: O(n²)
// Use: Solve 9×9 Sudoku puzzle

bool isSafeSudoku(int grid[9][9], int row, int col, int num) {
    // Check row
    for (int x = 0; x < 9; x++) {
        if (grid[row][x] == num) return false;
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (grid[x][col] == num) return false;
    }
    
    // Check 3×3 box
    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] == num) return false;
        }
    }
    
    return true;
}

bool solveSudoku(int grid[9][9], int row, int col) {
    if (row == 9 - 1 && col == 9) {
        return true;  // Reached end
    }
    
    if (col == 9) {
        row++;
        col = 0;
    }
    
    if (grid[row][col] != 0) {
        return solveSudoku(grid, row, col + 1);
    }
    
    for (int num = 1; num <= 9; num++) {
        if (isSafeSudoku(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid, row, col + 1)) {
                return true;
            }
            
            // Backtrack
            grid[row][col] = 0;
        }
    }
    
    return false;
}


// ============ SUBSET SUM ============
// Type: Recursive (Backtracking)
// Time: O(2^n)
// Space: O(n)
// Use: Find if subset with given sum exists

bool subsetSumUtil(int arr[], int n, int sum, int index) {
    if (sum == 0) {
        return true;  // Found subset
    }
    
    if (index == n) {
        return false;  // No more elements
    }
    
    // Include current element
    if (arr[index] <= sum) {
        if (subsetSumUtil(arr, n, sum - arr[index], index + 1)) {
            return true;
        }
    }
    
    // Exclude current element
    return subsetSumUtil(arr, n, sum, index + 1);
}

bool subsetSum(int arr[], int n, int sum) {
    return subsetSumUtil(arr, n, sum, 0);
}


// ============ PERMUTATIONS ============
// Type: Recursive (Backtracking)
// Time: O(n!)
// Space: O(n)
// Use: Generate all permutations of array

void permuteUtil(int arr[], int l, int r) {
    if (l == r) {
        // Print or store permutation
        return;
    }
    
    for (int i = l; i <= r; i++) {
        // Swap
        int temp = arr[l];
        arr[l] = arr[i];
        arr[i] = temp;
        
        permuteUtil(arr, l + 1, r);
        
        // Backtrack (swap back)
        temp = arr[l];
        arr[l] = arr[i];
        arr[i] = temp;
    }
}

void permute(int arr[], int n) {
    permuteUtil(arr, 0, n - 1);
}


// ============ COMBINATIONS ============
// Type: Recursive (Backtracking)
// Time: O(n choose k)
// Space: O(k)
// Use: Generate all combinations of size k

void combinationUtil(int arr[], int n, int k, int index, int data[], int i) {
    if (index == k) {
        // Print or store combination
        return;
    }
    
    if (i >= n) {
        return;
    }
    
    // Include current element
    data[index] = arr[i];
    combinationUtil(arr, n, k, index + 1, data, i + 1);
    
    // Exclude current element
    combinationUtil(arr, n, k, index, data, i + 1);
}

void combinations(int arr[], int n, int k) {
    int data[k];
    combinationUtil(arr, n, k, 0, data, 0);
}


// ============ KNIGHT'S TOUR ============
// Type: Recursive (Backtracking)
// Time: O(8^(n²))
// Space: O(n²)
// Use: Visit all squares on chessboard with knight

int xMove[8] = {2, 1, -1, -2, -2, -1, 1, 2};
int yMove[8] = {1, 2, 2, 1, -1, -2, -2, -1};

bool isSafeKnight(int x, int y, int sol[][8], int n) {
    return (x >= 0 && x < n && y >= 0 && y < n && sol[x][y] == -1);
}

bool knightTourUtil(int x, int y, int movei, int sol[][8], int n) {
    if (movei == n * n) {
        return true;  // All squares visited
    }
    
    for (int k = 0; k < 8; k++) {
        int nextX = x + xMove[k];
        int nextY = y + yMove[k];
        
        if (isSafeKnight(nextX, nextY, sol, n)) {
            sol[nextX][nextY] = movei;
            
            if (knightTourUtil(nextX, nextY, movei + 1, sol, n)) {
                return true;
            }
            
            // Backtrack
            sol[nextX][nextY] = -1;
        }
    }
    
    return false;
}

bool knightTour(int n) {
    int sol[8][8];
    
    for (int x = 0; x < n; x++) {
        for (int y = 0; y < n; y++) {
            sol[x][y] = -1;
        }
    }
    
    sol[0][0] = 0;
    
    return knightTourUtil(0, 0, 1, sol, n);
}


// ============ RAT IN A MAZE ============
// Type: Recursive (Backtracking)
// Time: O(2^(n²))
// Space: O(n²)
// Use: Find path from top-left to bottom-right in maze

bool isSafeMaze(int maze[][10], int x, int y, int n) {
    return (x >= 0 && x < n && y >= 0 && y < n && maze[x][y] == 1);
}

bool ratInMazeUtil(int maze[][10], int x, int y, int sol[][10], int n) {
    if (x == n - 1 && y == n - 1) {
        sol[x][y] = 1;
        return true;  // Reached destination
    }
    
    if (isSafeMaze(maze, x, y, n)) {
        sol[x][y] = 1;
        
        // Move right
        if (ratInMazeUtil(maze, x + 1, y, sol, n)) {
            return true;
        }
        
        // Move down
        if (ratInMazeUtil(maze, x, y + 1, sol, n)) {
            return true;
        }
        
        // Backtrack
        sol[x][y] = 0;
        return false;
    }
    
    return false;
}

bool ratInMaze(int maze[][10], int n) {
    int sol[10][10] = {0};
    
    return ratInMazeUtil(maze, 0, 0, sol, n);
}