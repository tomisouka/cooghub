#include <algorithm>
#include <queue>

// ============ ACTIVITY SELECTION ============
// Type: Iterative (Greedy)
// Time: O(n log n)
// Space: O(1)
// Use: Select maximum non-overlapping activities

struct Activity {
    int start, finish;
};

bool activityCompare(Activity a1, Activity a2) {
    return a1.finish < a2.finish;
}

int activitySelection(Activity arr[], int n) {
    std::sort(arr, arr + n, activityCompare);
    
    int count = 1;
    int lastFinish = arr[0].finish;
    
    for (int i = 1; i < n; i++) {
        if (arr[i].start >= lastFinish) {
            count++;
            lastFinish = arr[i].finish;
        }
    }
    
    return count;
}


// ============ FRACTIONAL KNAPSACK ============
// Type: Iterative (Greedy)
// Time: O(n log n)
// Space: O(1)
// Use: Maximize value, can take fractions of items

struct Item {
    int value, weight;
};

bool itemCompare(Item a, Item b) {
    double r1 = (double)a.value / a.weight;
    double r2 = (double)b.value / b.weight;
    return r1 > r2;
}

double fractionalKnapsack(Item arr[], int n, int capacity) {
    std::sort(arr, arr + n, itemCompare);
    
    double totalValue = 0.0;
    
    for (int i = 0; i < n; i++) {
        if (capacity >= arr[i].weight) {
            capacity -= arr[i].weight;
            totalValue += arr[i].value;
        } else {
            totalValue += arr[i].value * ((double)capacity / arr[i].weight);
            break;
        }
    }
    
    return totalValue;
}


// ============ HUFFMAN CODING ============
// Type: Iterative (uses priority queue)
// Time: O(n log n)
// Space: O(n)
// Use: Optimal prefix-free encoding

struct HuffmanNode {
    char data;
    int freq;
    HuffmanNode *left, *right;
    
    HuffmanNode(char d, int f) : data(d), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};

HuffmanNode* huffmanCoding(char data[], int freq[], int n) {
    std::priority_queue<HuffmanNode*, std::vector<HuffmanNode*>, Compare> pq;
    
    for (int i = 0; i < n; i++) {
        pq.push(new HuffmanNode(data[i], freq[i]));
    }
    
    while (pq.size() > 1) {
        HuffmanNode* left = pq.top(); pq.pop();
        HuffmanNode* right = pq.top(); pq.pop();
        
        HuffmanNode* top = new HuffmanNode('$', left->freq + right->freq);
        top->left = left;
        top->right = right;
        
        pq.push(top);
    }
    
    return pq.top();
}


// ============ JOB SEQUENCING WITH DEADLINES ============
// Type: Iterative (Greedy)
// Time: O(n²) or O(n log n) with Union-Find
// Space: O(n)
// Use: Maximize profit with job deadlines

struct Job {
    char id;
    int deadline;
    int profit;
};

bool jobCompare(Job a, Job b) {
    return a.profit > b.profit;
}

int jobSequencing(Job arr[], int n) {
    std::sort(arr, arr + n, jobCompare);
    
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i].deadline > maxDeadline) {
            maxDeadline = arr[i].deadline;
        }
    }
    
    int slot[maxDeadline];
    bool filled[maxDeadline];
    
    for (int i = 0; i < maxDeadline; i++) {
        filled[i] = false;
    }
    
    int totalProfit = 0;
    
    for (int i = 0; i < n; i++) {
        for (int j = arr[i].deadline - 1; j >= 0; j--) {
            if (!filled[j]) {
                filled[j] = true;
                slot[j] = i;
                totalProfit += arr[i].profit;
                break;
            }
        }
    }
    
    return totalProfit;
}


// ============ MINIMUM PLATFORMS ============
// Type: Iterative (Greedy)
// Time: O(n log n)
// Space: O(1)
// Use: Minimum platforms needed at railway station

int minPlatforms(int arrival[], int departure[], int n) {
    std::sort(arrival, arrival + n);
    std::sort(departure, departure + n);
    
    int platforms = 1;
    int maxPlatforms = 1;
    int i = 1, j = 0;
    
    while (i < n && j < n) {
        if (arrival[i] <= departure[j]) {
            platforms++;
            i++;
        } else {
            platforms--;
            j++;
        }
        
        if (platforms > maxPlatforms) {
            maxPlatforms = platforms;
        }
    }
    
    return maxPlatforms;
}


// ============ COIN CHANGE (GREEDY) ============
// Type: Iterative (Greedy)
// Time: O(n)
// Space: O(1)
// Use: Minimum coins for amount (works for canonical coin systems like USD)
// Note: Does NOT always work (e.g., coins = {1, 3, 4}, amount = 6)

int coinChangeGreedy(int coins[], int n, int amount) {
    std::sort(coins, coins + n, std::greater<int>());
    
    int count = 0;
    
    for (int i = 0; i < n; i++) {
        while (amount >= coins[i]) {
            amount -= coins[i];
            count++;
        }
    }
    
    return amount == 0 ? count : -1;
}