#include <algorithm>
#include <cfloat>
#include <climits>
#include <cmath>

// ============ MERGE SORT ============
// Type: Recursive (D&C)
// Time: O(n log n)
// Space: O(n)
// Use: Stable sorting, divide and conquer example
// Note: Full implementation in sorting.cpp

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}


// ============ QUICK SORT ============
// Type: Recursive (D&C)
// Time: O(n log n) average, O(n²) worst
// Space: O(log n)
// Use: In-place sorting, divide and conquer
// Note: Full implementation in sorting.cpp

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}


// ============ BINARY SEARCH ============
// Type: Recursive (D&C)
// Time: O(log n)
// Space: O(log n)
// Use: Search in sorted array
// Note: Full implementation in searching.cpp

int binarySearch(int arr[], int l, int r, int target) {
    if (l > r) return -1;
    
    int mid = l + (r - l) / 2;
    
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearch(arr, mid + 1, r, target);
    return binarySearch(arr, l, mid - 1, target);
}


// ============ MAXIMUM SUBARRAY (D&C APPROACH) ============
// Type: Recursive (D&C)
// Time: O(n log n)
// Space: O(log n)
// Use: Find max sum subarray using divide and conquer

int maxCrossingSum(int arr[], int l, int m, int r) {
    int sum = 0;
    int leftSum = INT_MIN;
    for (int i = m; i >= l; i--) {
        sum += arr[i];
        if (sum > leftSum) leftSum = sum;
    }
    
    sum = 0;
    int rightSum = INT_MIN;
    for (int i = m + 1; i <= r; i++) {
        sum += arr[i];
        if (sum > rightSum) rightSum = sum;
    }
    
    return leftSum + rightSum;
}

int maxSubarrayDC(int arr[], int l, int r) {
    if (l == r) return arr[l];
    
    int m = l + (r - l) / 2;
    
    return std::max({maxSubarrayDC(arr, l, m),
                    maxSubarrayDC(arr, m + 1, r),
                    maxCrossingSum(arr, l, m, r)});
}


// ============ STRASSEN'S MATRIX MULTIPLICATION ============
// Type: Recursive (D&C)
// Time: O(n^2.807)
// Space: O(n²)
// Use: Faster matrix multiplication for large matrices

void addMatrix(int A[][2], int B[][2], int C[][2], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
}

void subtractMatrix(int A[][2], int B[][2], int C[][2], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = A[i][j] - B[i][j];
        }
    }
}

void strassenMultiply(int A[][2], int B[][2], int C[][2], int n) {
    if (n == 1) {
        C[0][0] = A[0][0] * B[0][0];
        return;
    }
    
    // Divide matrices into quadrants and compute 7 products
    // Simplified version - full implementation is complex
    // This is a conceptual outline
}


// ============ CLOSEST PAIR OF POINTS ============
// Type: Recursive (D&C)
// Time: O(n log n)
// Space: O(n)
// Use: Find closest pair of points in 2D plane

struct Point {
    int x, y;
};

float dist(Point p1, Point p2) {
    return sqrt((p1.x - p2.x) * (p1.x - p2.x) + 
                (p1.y - p2.y) * (p1.y - p2.y));
}

float bruteForce(Point P[], int n) {
    float min = FLT_MAX;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (dist(P[i], P[j]) < min) {
                min = dist(P[i], P[j]);
            }
        }
    }
    return min;
}

float stripClosest(Point strip[], int size, float d) {
    float min = d;
    
    for (int i = 0; i < size; i++) {
        for (int j = i + 1; j < size && (strip[j].y - strip[i].y) < min; j++) {
            if (dist(strip[i], strip[j]) < min) {
                min = dist(strip[i], strip[j]);
            }
        }
    }
    
    return min;
}

float closestUtil(Point Px[], Point Py[], int n) {
    if (n <= 3) return bruteForce(Px, n);
    
    int mid = n / 2;
    Point midPoint = Px[mid];
    
    Point Pyl[mid], Pyr[n - mid];
    int li = 0, ri = 0;
    for (int i = 0; i < n; i++) {
        if (Py[i].x <= midPoint.x && li < mid) {
            Pyl[li++] = Py[i];
        } else {
            Pyr[ri++] = Py[i];
        }
    }
    
    float dl = closestUtil(Px, Pyl, mid);
    float dr = closestUtil(Px + mid, Pyr, n - mid);
    float d = std::min(dl, dr);
    
    Point strip[n];
    int j = 0;
    for (int i = 0; i < n; i++) {
        if (abs(Py[i].x - midPoint.x) < d) {
            strip[j++] = Py[i];
        }
    }
    
    return std::min(d, stripClosest(strip, j, d));
}


// ============ COUNT INVERSIONS ============
// Type: Recursive (D&C, similar to merge sort)
// Time: O(n log n)
// Space: O(n)
// Use: Count number of inversions in array

int mergeAndCount(int arr[], int temp[], int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    int invCount = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            invCount += (mid - i + 1);
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left; i <= right; i++) {
        arr[i] = temp[i];
    }
    
    return invCount;
}

int countInversions(int arr[], int temp[], int left, int right) {
    int invCount = 0;
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        invCount += countInversions(arr, temp, left, mid);
        invCount += countInversions(arr, temp, mid + 1, right);
        invCount += mergeAndCount(arr, temp, left, mid, right);
    }
    return invCount;
}