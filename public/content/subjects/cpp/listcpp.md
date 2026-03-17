# 📘 C++ Programming Guide

---

## 🎯 Part 1: Procedural C++ (Fundamentals)

> Core syntax, control structures, and functional programming basics

---

### 1. 📖 Introduction to C++

C++ is a powerful, high-performance programming language that combines low-level memory control with high-level abstractions. Created by Bjarne Stroustrup in 1979, it extends the C language with object-oriented features while maintaining compatibility and efficiency.

**Key Features:**
- Compiled language (converts to machine code)
- Strong typing system
- Multi-paradigm (procedural, object-oriented, generic)
- Direct hardware access
- Standard Template Library (STL)

**Why Learn C++?**
- System programming (operating systems, drivers)
- Game development (high performance requirements)
- Embedded systems
- Competitive programming
- Foundation for understanding computer architecture

---

### 2. 🔢 Variables & Assignments

Variables are named storage locations in memory that hold data. Think of them as labeled boxes where you can store and retrieve values.

**Visual:**
```cpp
int age = 25;           // Integer: whole numbers
double price = 19.99;   // Double: decimal numbers
char grade = 'A';       // Char: single character
string name = "Alice";  // String: text

// Memory representation:
[age: 25] [price: 19.99] [grade: 'A'] [name: "Alice"]
   4 bytes    8 bytes       1 byte      variable size
```

#### 2.1 Variables (int)

Integers store whole numbers without decimal points.

```cpp
int score = 100;        // Positive integer
int temperature = -15;  // Negative integer
int population = 0;     // Zero

// Range: -2,147,483,648 to 2,147,483,647 (32-bit)
```

**Common Operations:**
```cpp
int x = 10;
int y = 3;

int sum = x + y;        // 13
int diff = x - y;       // 7
int product = x * y;    // 30
int quotient = x / y;   // 3 (integer division!)
int remainder = x % y;  // 1 (modulo)
```

---

#### 2.2 Variables and Assignments

**Declaration vs Initialization:**
```cpp
int count;              // Declaration only (garbage value)
count = 5;              // Assignment

int total = 0;          // Declaration + initialization (best practice)

// Multiple declarations:
int a, b, c;            // Three uninitialized integers
int x = 1, y = 2;       // Two initialized integers
```

**Assignment Chain:**
```cpp
int a, b, c;
a = b = c = 10;         // All get value 10 (right to left)
```

---

#### 2.3 Identifiers

Identifiers are names for variables, functions, classes, etc.

**Rules:**
- Must start with letter or underscore: `age`, `_temp`
- Can contain letters, digits, underscores: `score2`, `player_name`
- Cannot use C++ keywords: ~~`int`~~, ~~`class`~~, ~~`return`~~
- Case-sensitive: `Age` ≠ `age` ≠ `AGE`

**Naming Conventions:**
```cpp
// Variables: camelCase or snake_case
int playerScore;        // camelCase
int player_score;       // snake_case

// Constants: UPPER_CASE
const int MAX_PLAYERS = 10;

// Classes: PascalCase (later topic)
class GameEngine;
```

**Good vs Bad Names:**
```cpp
// ❌ Bad
int x;                  // Not descriptive
int n;                  // Ambiguous
int tmp123;             // Meaningless

// ✅ Good
int studentAge;         // Clear purpose
int totalScore;         // Descriptive
int itemCount;          // Self-documenting
```

---

#### 2.4 & 2.5 Arithmetic Expressions

**Basic Operators:**
```cpp
int a = 10, b = 3;

// Arithmetic
a + b    // 13 (addition)
a - b    // 7  (subtraction)
a * b    // 30 (multiplication)
a / b    // 3  (division - integer!)
a % b    // 1  (modulo - remainder)

// Operator Precedence (PEMDAS):
int result = 2 + 3 * 4;     // 14, not 20 (* before +)
int result2 = (2 + 3) * 4;  // 20 (parentheses first)
```

**Precedence Table:**
| Level | Operators | Description |
|-------|-----------|-------------|
| 1 | `()` | Parentheses (highest) |
| 2 | `*` `/` `%` | Multiplication, division, modulo |
| 3 | `+` `-` | Addition, subtraction |
| 4 | `=` | Assignment (lowest) |

**Compound Assignment:**
```cpp
int x = 10;
x += 5;     // x = x + 5  →  15
x -= 3;     // x = x - 3  →  12
x *= 2;     // x = x * 2  →  24
x /= 4;     // x = x / 4  →  6
x %= 4;     // x = x % 4  →  2

// Increment/Decrement
x++;        // x = x + 1 (post-increment)
++x;        // x = x + 1 (pre-increment)
x--;        // x = x - 1 (post-decrement)
--x;        // x = x - 1 (pre-decrement)
```

**Pre vs Post Increment:**
```cpp
int x = 5;
int y = x++;    // y = 5, then x = 6 (use then increment)
int z = ++x;    // x = 7, then z = 7 (increment then use)
```

---

#### 2.7 Floating-Point Numbers (double)

Doubles store decimal numbers with high precision.

```cpp
double pi = 3.14159;
double price = 29.99;
double temperature = -17.5;

// Double vs Float:
float f = 3.14f;        // ~7 decimal digits precision
double d = 3.14;        // ~15 decimal digits precision
```

**Visual:**
```
Float:  4 bytes → ±3.4 × 10³⁸ (7 digits precision)
Double: 8 bytes → ±1.7 × 10³⁰⁸ (15 digits precision)
```

**Arithmetic with Doubles:**
```cpp
double a = 10.5;
double b = 3.2;

double sum = a + b;      // 13.7
double product = a * b;  // 33.6
double quotient = a / b; // 3.28125 (decimal division!)

// Mixed operations:
int x = 10;
double y = 3.0;
double result = x / y;   // 3.33333... (at least one double → double result)
int result2 = x / 3;     // 3 (both int → int result)
```

---

#### 2.8 Scientific Notation

For very large or very small numbers:

```cpp
double avogadro = 6.022e23;      // 6.022 × 10²³
double electronMass = 9.109e-31; // 9.109 × 10⁻³¹
double distance = 1.5e8;         // 150,000,000

// Format: [number]e[exponent]
// Positive exponent: multiply by 10^n
// Negative exponent: divide by 10^n
```

---

#### 2.9 Constant Variables

Constants are variables whose values cannot change after initialization.

```cpp
const double PI = 3.14159;
const int MAX_STUDENTS = 30;
const string SCHOOL_NAME = "MIT";

// PI = 3.14;  // ❌ Error! Cannot modify const

// Benefits:
// 1. Prevents accidental changes
// 2. Documents intent
// 3. Compiler optimizations
// 4. More readable than magic numbers
```

**Magic Numbers vs Constants:**
```cpp
// ❌ Bad (magic numbers)
double area = radius * radius * 3.14159;
if (students > 30) { ... }

// ✅ Good (named constants)
const double PI = 3.14159;
const int MAX_STUDENTS = 30;
double area = radius * radius * PI;
if (students > MAX_STUDENTS) { ... }
```

---

#### 2.10 Using Math Functions

C++ provides a rich math library via `<cmath>`.

```cpp
#include <cmath>

double x = 16.0;
double y = -5.5;

// Power and roots
pow(2, 3)        // 8.0 (2³)
sqrt(16)         // 4.0 (square root)
cbrt(27)         // 3.0 (cube root)

// Rounding
ceil(4.3)        // 5.0 (round up)
floor(4.9)       // 4.0 (round down)
round(4.5)       // 5.0 (round to nearest)

// Absolute value
abs(-5)          // 5 (for integers)
fabs(-5.5)       // 5.5 (for doubles)

// Trigonometry (radians!)
sin(PI/2)        // 1.0
cos(0)           // 1.0
tan(PI/4)        // 1.0

// Logarithms
log(e)           // 1.0 (natural log)
log10(100)       // 2.0 (base-10 log)
exp(1)           // 2.71828 (e^1)
```

**Example:**
```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double radius = 5.0;
    const double PI = 3.14159;
    
    double area = PI * pow(radius, 2);
    double circumference = 2 * PI * radius;
    
    cout << "Area: " << area << endl;
    cout << "Circumference: " << circumference << endl;
    
    return 0;
}
```

---

#### 2.11 Integer Division and Modulo

**Integer Division:**
When both operands are integers, division truncates (removes decimal part).

```cpp
int a = 17;
int b = 5;

int quotient = a / b;    // 3 (not 3.4!)
int remainder = a % b;   // 2

// Visual:
//  17 ÷ 5 = 3 remainder 2
//  17 = (5 × 3) + 2
```

**Getting Decimal Result:**
```cpp
int a = 17;
int b = 5;

// Cast to double:
double result = (double)a / b;     // 3.4
double result2 = static_cast<double>(a) / b;  // 3.4 (C++ style)

// Or make one operand double:
double result3 = a / 5.0;          // 3.4
```

**Modulo Applications:**
```cpp
// Check even/odd:
if (num % 2 == 0) {
    cout << "Even";
} else {
    cout << "Odd";
}

// Check divisibility:
if (year % 4 == 0) {
    cout << "Leap year candidate";
}

// Wrap around (circular behavior):
int hour = (currentHour + 5) % 24;  // 23 + 5 = 4 (wraps at 24)
int dayOfWeek = (day % 7);          // 0=Sun, 1=Mon, ..., 6=Sat

// Get last digit:
int lastDigit = number % 10;        // 12345 % 10 = 5
```

---

#### 2.12 Type Conversions

**Implicit Conversion (Automatic):**
```cpp
int x = 10;
double y = x;        // int → double (safe, no data loss)

double a = 3.7;
int b = a;           // double → int (truncates! b = 3)

// Promotion in expressions:
int i = 5;
double d = 2.5;
double result = i + d;  // i promoted to double → 7.5
```

**Explicit Conversion (Casting):**
```cpp
// C-style cast:
double pi = 3.14159;
int wholePart = (int)pi;  // 3

// C++ style cast (preferred):
int wholePart2 = static_cast<int>(pi);  // 3

// Why cast?
int total = 17;
int count = 5;
double average = static_cast<double>(total) / count;  // 3.4 (not 3!)
```

**Conversion Hierarchy:**
```
bool → char → short → int → long → float → double → long double
(smaller)                                            (larger)

Safe: smaller → larger
Risky: larger → smaller (data loss!)
```

---

#### 2.13 Binary

Binary is base-2 number system (0s and 1s).

**Decimal to Binary:**
```
Decimal 13 = Binary 1101

13 ÷ 2 = 6 remainder 1  ↓
 6 ÷ 2 = 3 remainder 0  ↓
 3 ÷ 2 = 1 remainder 1  ↓
 1 ÷ 2 = 0 remainder 1  ↓

Read bottom to top: 1101
```

**Binary to Decimal:**
```
Binary 1101 = Decimal ?

Position:  3    2    1    0
Binary:    1    1    0    1
Value:    2³   2²   2¹   2⁰
         = 8  + 4  + 0  + 1  = 13
```

**Powers of 2:**
| Power | Value | Binary |
|-------|-------|--------|
| 2⁰ | 1 | 1 |
| 2¹ | 2 | 10 |
| 2² | 4 | 100 |
| 2³ | 8 | 1000 |
| 2⁴ | 16 | 10000 |
| 2⁵ | 32 | 100000 |
| 2⁸ | 256 | 100000000 |

**Binary in C++:**
```cpp
int x = 0b1101;        // Binary literal (C++14): 13
int y = 13;            // Decimal: 13
int z = 0xD;           // Hexadecimal: 13

// All represent the same value!
```

---

#### 2.14 Characters

Characters store single letters, digits, or symbols.

```cpp
char letter = 'A';      // Single quotes!
char digit = '5';       // Character '5', not number 5
char symbol = '$';
char newline = '\n';    // Escape sequence

// ASCII values:
char ch = 'A';
int ascii = ch;         // 65 (ASCII code for 'A')
char ch2 = 65;          // 'A' (from ASCII code)
```

**ASCII Table (Common Values):**
| Character | ASCII | Character | ASCII |
|-----------|-------|-----------|-------|
| '0' | 48 | 'A' | 65 |
| '9' | 57 | 'Z' | 90 |
| ' ' | 32 | 'a' | 97 |
| '\n' | 10 | 'z' | 122 |

**Escape Sequences:**
```cpp
'\n'    // Newline
'\t'    // Tab
'\\'    // Backslash
'\''    // Single quote
'\"'    // Double quote
'\0'    // Null character
```

**Character Operations:**
```cpp
char ch = 'A';
ch = ch + 1;            // 'B' (ASCII 66)
ch = ch + 32;           // 'b' (uppercase → lowercase trick)

// Character arithmetic:
char lowercase = 'a' + ('C' - 'A');  // 'c'
```

---

#### 2.15 Strings

Strings store sequences of characters (text).

```cpp
#include <string>
using namespace std;

string name = "Alice";
string greeting = "Hello, World!";
string empty = "";

// String operations:
string first = "Hello";
string last = "World";
string full = first + " " + last;  // "Hello World" (concatenation)

// Length:
int len = name.length();    // 5
int size = name.size();     // 5 (same as length)

// Access characters:
char firstChar = name[0];   // 'A'
char lastChar = name[4];    // 'e'

// Modify:
name[0] = 'B';              // "Blice"
```

**String Input:**
```cpp
string word;
cin >> word;                // Reads until whitespace

string line;
getline(cin, line);         // Reads entire line including spaces
```

**Common String Methods:**
```cpp
string str = "Hello";

str.length()                // 5
str.empty()                 // false
str.clear()                 // str = ""
str.append(" World")        // "Hello World"
str.substr(0, 4)           // "Hell" (start, length)
str.find("ll")             // 2 (position of "ll")
str.replace(0, 1, "J")     // "Jello"
```

---

#### 2.16 Integer Overflow

When a value exceeds the maximum (or minimum) of its type.

```cpp
#include <climits>  // For INT_MAX, INT_MIN

int max = INT_MAX;          // 2,147,483,647
cout << max << endl;        // 2147483647
cout << max + 1 << endl;    // -2147483648 (overflow! wraps around)

// Visual:
// MAX_VALUE → MAX_VALUE + 1 → MIN_VALUE (wraparound)
```

**Integer Ranges:**
| Type | Size | Min | Max |
|------|------|-----|-----|
| `short` | 2 bytes | -32,768 | 32,767 |
| `int` | 4 bytes | -2,147,483,648 | 2,147,483,647 |
| `long long` | 8 bytes | -9.2 × 10¹⁸ | 9.2 × 10¹⁸ |

**Avoiding Overflow:**
```cpp
// Use larger type:
long long bigNum = 2147483647LL;
bigNum = bigNum + 1;        // Safe!

// Check before operation:
if (a > INT_MAX - b) {
    cout << "Would overflow!";
} else {
    int sum = a + b;
}
```

---

#### 2.17 Numeric Data Types

**Integer Types:**
```cpp
short s = 32000;            // 2 bytes: -32,768 to 32,767
int i = 2000000000;         // 4 bytes: -2.1B to 2.1B
long l = 2000000000L;       // 4+ bytes (platform-dependent)
long long ll = 9000000000000000000LL;  // 8 bytes

// Unsigned (non-negative only):
unsigned int ui = 4000000000U;  // 0 to 4.3B (double the positive range)
```

**Floating-Point Types:**
```cpp
float f = 3.14f;            // 4 bytes, ~7 digits precision
double d = 3.14159265359;   // 8 bytes, ~15 digits precision
long double ld = 3.14159L;  // 8+ bytes, highest precision
```

**Choosing a Type:**
```cpp
// Small integers (-100 to 100): int
int score = 95;

// Large integers (billions): long long
long long worldPopulation = 8000000000LL;

// Decimals (most cases): double
double price = 19.99;

// High precision decimals: long double
long double scientificValue = 1.23456789012345L;
```

---

#### 2.18 Unsigned

Unsigned types can only store non-negative values (0 and positive).

```cpp
unsigned int count = 100;
unsigned int negativeTest = -1;  // Wraps to 4,294,967,295!

// Range comparison:
// int:           -2,147,483,648 to 2,147,483,647
// unsigned int:   0 to 4,294,967,295
```

**When to Use Unsigned:**
```cpp
✅ Array sizes/indices
unsigned int size = array.size();

✅ Bit manipulation
unsigned int flags = 0b1010;

✅ Never-negative quantities
unsigned int age = 25;

❌ General arithmetic (risk of underflow)
unsigned int a = 5;
unsigned int b = 10;
unsigned int diff = a - b;  // Wraps to huge positive number!
```

---

#### 2.19 Random Numbers

```cpp
#include <cstdlib>  // rand(), srand()
#include <ctime>    // time()

// Seed random generator (do once at program start):
srand(time(0));

// Generate random numbers:
int random = rand();                    // 0 to RAND_MAX
int diceRoll = rand() % 6 + 1;         // 1 to 6
int range = rand() % 100;              // 0 to 99
int range2 = rand() % 51 + 50;         // 50 to 100

// Formula: rand() % (max - min + 1) + min
```

**Modern C++ Random (C++11):**
```cpp
#include <random>

random_device rd;
mt19937 gen(rd());
uniform_int_distribution<> distrib(1, 6);

int diceRoll = distrib(gen);  // Better randomness
```

---

#### 2.20 Debugging

Finding and fixing errors in code.

**Types of Errors:**

**1. Syntax Errors (Compile-time):**
```cpp
int x = 5  // ❌ Missing semicolon
cout < x;  // ❌ Wrong operator
```

**2. Runtime Errors:**
```cpp
int x = 5;
int y = 0;
int result = x / y;  // ❌ Division by zero (crash!)
```

**3. Logic Errors:**
```cpp
// Calculate average (WRONG):
int avg = (a + b + c) / 3;  // Integer division!

// Correct:
double avg = (a + b + c) / 3.0;
```

**Debugging Techniques:**

```cpp
// 1. Print statements:
cout << "DEBUG: x = " << x << endl;
cout << "DEBUG: Reached line 42" << endl;

// 2. Check assumptions:
if (denominator == 0) {
    cout << "ERROR: Division by zero!" << endl;
    return 1;
}

// 3. Simplify:
// Instead of: int result = ((a + b) * c - d) / e;
int sum = a + b;
int product = sum * c;
int diff = product - d;
int result = diff / e;  // Easier to spot errors!
```

---

#### 2.21 Auto (since C++11)

Let the compiler deduce the type automatically.

```cpp
auto x = 5;          // int
auto y = 3.14;       // double
auto name = "Alice"; // const char* (C-string)
auto str = string("Hello");  // string

// Useful for complex types:
auto iter = myVector.begin();  // Instead of vector<int>::iterator
```

**When to Use:**
```cpp
✅ Complex type names:
auto it = map<string, vector<int>>::iterator;

✅ When type is obvious:
auto count = numbers.size();

❌ When type should be explicit:
auto x = 5;  // Less clear than: int x = 5;
```

---

#### 2.22 Style Guidelines

**Naming:**
```cpp
// Variables: camelCase or snake_case
int playerScore;
int player_score;

// Constants: UPPER_CASE
const int MAX_SIZE = 100;

// Be descriptive:
int s;          // ❌ What is s?
int studentCount;  // ✅ Clear!
```

**Indentation:**
```cpp
// ✅ Good
if (condition) {
    statement1;
    statement2;
}

// ❌ Bad
if (condition) {
statement1;
statement2;
}
```

**Spacing:**
```cpp
// ✅ Good
int sum = a + b;
if (x > 10) {

// ❌ Bad
int sum=a+b;
if(x>10){
```

**Comments:**
```cpp
// Single-line comment

/*
 * Multi-line comment
 * for longer explanations
 */

// Good comments explain WHY, not WHAT:
int result = price * 0.08;  // ❌ Multiply by 0.08
int tax = price * TAX_RATE;  // ✅ Calculate sales tax
```

---

