
## 🎯 Part 3: Memory Management & Advanced Features

> Pointers, dynamic memory, inheritance, polymorphism, and modern C++ features

---

### 10. 🎯 Pointers

Pointers store memory addresses of variables.

**Visual:**
```
Variable:    int x = 42;
Memory:      Address: 0x1000  →  Value: 42

Pointer:     int* ptr = &x;
             ptr = 0x1000  (stores address of x)
             *ptr = 42     (value at that address)
```

#### 10.1 Why Pointers?

**Reasons to use pointers:**

1. **Dynamic memory allocation** (heap)
2. **Efficient array/large data passing**
3. **Data structures** (linked lists, trees)
4. **Polymorphism** (virtual functions)
5. **Hardware interfacing** (low-level programming)

---

#### 10.2 Pointer Basics

```cpp
int x = 42;
int* ptr = &x;  // ptr stores address of x

// & = address-of operator
// * = dereference operator (get value at address)

cout << x << endl;      // 42 (value)
cout << &x << endl;     // 0x7fff... (address)
cout << ptr << endl;    // 0x7fff... (same address)
cout << *ptr << endl;   // 42 (value at address)

// Modify through pointer:
*ptr = 100;
cout << x << endl;      // 100 (x changed!)
```

**Pointer Types:**

```cpp
int* intPtr;       // Points to int
double* dblPtr;    // Points to double
char* charPtr;     // Points to char
string* strPtr;    // Points to string

// Pointer must match type:
int x = 10;
double* ptr = &x;  // ❌ Error! Type mismatch
```

**Null Pointers:**

```cpp
int* ptr = nullptr;  // Points to nothing (C++11)
int* ptr2 = NULL;    // Old style (avoid)

if (ptr == nullptr) {
    cout << "Pointer is null" << endl;
}

// Always check before dereferencing:
if (ptr != nullptr) {
    cout << *ptr << endl;
}
```

---

#### 10.3 `new`, `delete`, `->`

**Dynamic Memory Allocation:**

```cpp
// Stack allocation (automatic):
int x = 5;  // Destroyed when out of scope

// Heap allocation (manual):
int* ptr = new int;  // Allocate memory
*ptr = 10;
delete ptr;          // Free memory (required!)
ptr = nullptr;       // Good practice
```

**Arrays on Heap:**

```cpp
int size = 100;
int* arr = new int[size];  // Allocate array

// Use like regular array:
arr[0] = 10;
arr[1] = 20;

delete[] arr;  // Free array (note [])
arr = nullptr;
```

**Objects on Heap:**

```cpp
class Point {
public:
    double x, y;
    Point(double x, double y) : x(x), y(y) {}
    void print() {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};

// Stack:
Point p1(3, 4);
p1.print();
p1.x = 5;  // Use . for stack objects

// Heap:
Point* p2 = new Point(5, 6);
p2->print();     // Use -> for pointers
p2->x = 7;       // Same as (*p2).x
delete p2;
```

**Arrow Operator:**

```cpp
Point* ptr = new Point(3, 4);

// These are equivalent:
ptr->x = 10;
(*ptr).x = 10;

// -> is shorthand for (*ptr).
```

---

#### 10.4 String Functions with Pointers

```cpp
// C-strings (char arrays):
char str[] = "Hello";
char* ptr = str;  // Points to first character

cout << ptr << endl;     // "Hello" (prints whole string)
cout << *ptr << endl;    // 'H' (first character)
cout << *(ptr + 1) << endl;  // 'e' (second character)

// Pointer arithmetic:
ptr++;  // Move to next character
cout << ptr << endl;  // "ello"
```

**Custom String Functions:**

```cpp
int stringLength(const char* str) {
    int len = 0;
    while (*str != '\0') {  // Until null terminator
        len++;
        str++;  // Move to next character
    }
    return len;
}

void stringCopy(char* dest, const char* src) {
    while (*src != '\0') {
        *dest = *src;
        dest++;
        src++;
    }
    *dest = '\0';  // Add null terminator
}

char str1[] = "Hello";
cout << stringLength(str1) << endl;  // 5

char str2[20];
stringCopy(str2, str1);
cout << str2 << endl;  // "Hello"
```

---

#### 10.5 First Linked List

```cpp
struct Node {
    int data;
    Node* next;
};

class LinkedList {
private:
    Node* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    void insert(int value) {
        Node* newNode = new Node;
        newNode->data = value;
        newNode->next = head;
        head = newNode;
    }
    
    void print() {
        Node* current = head;
        while (current != nullptr) {
            cout << current->data << " ";
            current = current->next;
        }
        cout << endl;
    }
    
    bool search(int value) {
        Node* current = head;
        while (current != nullptr) {
            if (current->data == value) {
                return true;
            }
            current = current->next;
        }
        return false;
    }
    
    ~LinkedList() {
        Node* current = head;
        while (current != nullptr) {
            Node* next = current->next;
            delete current;
            current = next;
        }
    }
};

LinkedList list;
list.insert(10);
list.insert(20);
list.insert(30);
list.print();  // 30 20 10
```

---

#### 10.6 Heap vs Stack

**Stack:**
- Automatic memory management
- Fast allocation/deallocation
- Limited size (~1-8 MB)
- Local variables, function calls
- LIFO (Last In, First Out)

**Heap:**
- Manual memory management (new/delete)
- Slower allocation/deallocation
- Large size (limited by RAM)
- Dynamic data structures
- Fragmentation possible

**Visual:**

```
Memory Layout:

High Address
┌──────────────┐
│    Stack     │ ← Grows down
│   (Local)    │   int x = 5;
├──────────────┤   
│     ↓        │
│              │
│     ↑        │
├──────────────┤
│    Heap      │ ← Grows up
│  (Dynamic)   │   new int(10);
└──────────────┘
Low Address
```

**Example:**

```cpp
void function() {
    // Stack allocation:
    int x = 10;          // Fast, auto-cleaned
    int arr[100];        // Fixed size
    
    // Heap allocation:
    int* ptr = new int(20);      // Manual cleanup
    int* bigArr = new int[10000]; // Dynamic size
    
    delete ptr;
    delete[] bigArr;
}  // x and arr auto-destroyed, ptr memory leaked if not deleted!
```

---

#### 10.7 Memory Leaks

Memory leak: allocated memory that's never freed.

**Leak Example:**

```cpp
void leakyFunction() {
    int* ptr = new int(42);
    // Oops! Forgot to delete
}  // ptr destroyed, but memory still allocated (leak!)

// Call 1000 times:
for (int i = 0; i < 1000; i++) {
    leakyFunction();  // Leaks 4 bytes × 1000 = 4KB
}
```

**Common Leak Scenarios:**

```cpp
// 1. Forgetting delete:
void leak1() {
    int* p = new int(10);
}  // Leak!

// 2. Reassigning before delete:
int* ptr = new int(10);
ptr = new int(20);  // Leak! Lost first allocation

// 3. Exception before delete:
void leak3() {
    int* p = new int(10);
    throw exception();  // Exception thrown, delete never reached
    delete p;  // Never executed
}

// 4. Early return:
void leak4() {
    int* p = new int(10);
    if (condition) {
        return;  // Leak! Return before delete
    }
    delete p;
}
```

**Preventing Leaks:**

```cpp
// 1. Always pair new with delete:
int* ptr = new int(10);
// ... use ptr ...
delete ptr;
ptr = nullptr;

// 2. Use RAII (Resource Acquisition Is Initialization):
class SafeInt {
private:
    int* data;
public:
    SafeInt(int val) {
        data = new int(val);
    }
    ~SafeInt() {
        delete data;  // Auto-cleanup
    }
};

// 3. Use smart pointers (modern C++):
#include <memory>
unique_ptr<int> ptr(new int(10));  // Auto-deleted
// Or:
auto ptr = make_unique<int>(10);
```

---

#### 10.8 Destructors

Special function called when object is destroyed.

```cpp
class StringHolder {
private:
    char* data;
    int size;
    
public:
    // Constructor:
    StringHolder(const char* str) {
        size = strlen(str) + 1;
        data = new char[size];
        strcpy(data, str);
        cout << "Allocated memory" << endl;
    }
    
    // Destructor:
    ~StringHolder() {
        delete[] data;
        cout << "Freed memory" << endl;
    }
    
    void print() {
        cout << data << endl;
    }
};

void test() {
    StringHolder s1("Hello");
    s1.print();
}  // Destructor called automatically, memory freed
```

**Destructor Rules:**
- Name: `~ClassName()`
- No parameters, no return type
- Called automatically when object destroyed
- One per class
- Free dynamically allocated memory here

---

#### 10.9 Copy Constructors

Called when object is copied.

**Shallow Copy (Default):**

```cpp
class Array {
private:
    int* data;
    int size;
    
public:
    Array(int s) : size(s) {
        data = new int[size];
    }
    
    ~Array() {
        delete[] data;
    }
};

Array a1(10);
Array a2 = a1;  // Shallow copy: both point to same memory!
// When a2 destroyed: delete[] data
// When a1 destroyed: delete[] data again! (double-free error!)
```

**Deep Copy (Custom Constructor):**

```cpp
class Array {
private:
    int* data;
    int size;
    
public:
    Array(int s) : size(s) {
        data = new int[size];
    }
    
    // Copy constructor (deep copy):
    Array(const Array& other) : size(other.size) {
        data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = other.data[i];
        }
    }
    
    ~Array() {
        delete[] data;
    }
};

Array a1(10);
Array a2 = a1;  // Deep copy: separate memory allocated
// Both can be safely destroyed
```

---

#### 10.10 Copy Assignment Operator

Called when existing object assigned to.

```cpp
class Array {
private:
    int* data;
    int size;
    
public:
    Array(int s) : size(s) {
        data = new int[size];
    }
    
    Array(const Array& other) : size(other.size) {
        data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = other.data[i];
        }
    }
    
    // Copy assignment operator:
    Array& operator=(const Array& other) {
        if (this != &other) {  // Check self-assignment
            delete[] data;     // Free old memory
            
            size = other.size;
            data = new int[size];
            for (int i = 0; i < size; i++) {
                data[i] = other.data[i];
            }
        }
        return *this;
    }
    
    ~Array() {
        delete[] data;
    }
};

Array a1(10);
Array a2(20);
a2 = a1;  // Calls copy assignment operator
```

---

#### 10.11 Rule of Three

If a class needs one of these, it probably needs all three:

1. **Destructor**
2. **Copy constructor**
3. **Copy assignment operator**

```cpp
class DynamicArray {
private:
    int* data;
    int size;
    
public:
    // Constructor:
    DynamicArray(int s) : size(s) {
        data = new int[size];
    }
    
    // 1. Destructor:
    ~DynamicArray() {
        delete[] data;
    }
    
    // 2. Copy constructor:
    DynamicArray(const DynamicArray& other) : size(other.size) {
        data = new int[size];
        for (int i = 0; i < size; i++) {
            data[i] = other.data[i];
        }
    }
    
    // 3. Copy assignment operator:
    DynamicArray& operator=(const DynamicArray& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new int[size];
            for (int i = 0; i < size; i++) {
                data[i] = other.data[i];
            }
        }
        return *this;
    }
};
```

**Modern C++ (Rule of Five):**
Adds move constructor and move assignment for efficiency.

---

### 11. 🌳 Inheritance

Inheritance allows classes to inherit properties and methods from other classes.

**Visual:**

```
Base Class (Parent):
┌─────────────────┐
│    Animal       │
├─────────────────┤
│ - name          │
│ - age           │
├─────────────────┤
│ + eat()         │
│ + sleep()       │
└─────────────────┘
        ↑
        │ inherits
        │
┌───────┴─────────┐
│      Dog        │
├─────────────────┤
│ + bark()        │
└─────────────────┘
```

#### 11.1 Derived Classes

```cpp
// Base class:
class Animal {
protected:  // Accessible to derived classes
    string name;
    int age;
    
public:
    Animal(string n, int a) : name(n), age(a) {}
    
    void eat() {
        cout << name << " is eating" << endl;
    }
    
    void sleep() {
        cout << name << " is sleeping" << endl;
    }
};

// Derived class:
class Dog : public Animal {
private:
    string breed;
    
public:
    Dog(string n, int a, string b) : Animal(n, a), breed(b) {}
    
    void bark() {
        cout << name << " says woof!" << endl;
    }
};

Dog myDog("Buddy", 3, "Golden Retriever");
myDog.eat();    // Inherited from Animal
myDog.sleep();  // Inherited from Animal
myDog.bark();   // Defined in Dog
```

---

#### 11.2 Member Access

**Access Specifiers:**

| Specifier | In Class | Derived Class | Outside |
|-----------|----------|---------------|---------|
| `private` | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ |

```cpp
class Base {
private:
    int privateVar;    // Only Base can access
    
protected:
    int protectedVar;  // Base and derived can access
    
public:
    int publicVar;     // Everyone can access
};

class Derived : public Base {
public:
    void test() {
        // privateVar = 10;    // ❌ Error!
        protectedVar = 20;     // ✅ OK
        publicVar = 30;        // ✅ OK
    }
};
```

---

#### 11.3 Overriding

Derived class can replace base class methods.

```cpp
class Shape {
public:
    virtual void draw() {  // virtual allows overriding
        cout << "Drawing a shape" << endl;
    }
    
    virtual double getArea() {
        return 0;
    }
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    void draw() override {  // override keyword (C++11)
        cout << "Drawing a circle" << endl;
    }
    
    double getArea() override {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    void draw() override {
        cout << "Drawing a rectangle" << endl;
    }
    
    double getArea() override {
        return width * height;
    }
};

Shape* s1 = new Circle(5);
Shape* s2 = new Rectangle(4, 6);

s1->draw();  // "Drawing a circle"
s2->draw();  // "Drawing a rectangle"
```

---

#### 11.4 Is-a vs Has-a

**Is-a (Inheritance):**

```cpp
// Dog IS-A Animal (inheritance)
class Dog : public Animal {
    // ...
};

// Circle IS-A Shape
class Circle : public Shape {
    // ...
};
```

**Has-a (Composition):**

```cpp
// Car HAS-A Engine (composition)
class Engine {
    int horsepower;
};

class Car {
private:
    Engine engine;  // Composition
    int doors;
};

// University HAS-A list of Students
class University {
private:
    vector<Student> students;  // Composition
};
```

**When to use each:**
- **Inheritance (is-a)**: When derived class is a type of base class
- **Composition (has-a)**: When class contains or uses another class

---

#### 11.6 Polymorphism / Virtuals

Polymorphism: same interface, different implementations.

```cpp
class Employee {
protected:
    string name;
    double baseSalary;
    
public:
    Employee(string n, double s) : name(n), baseSalary(s) {}
    
    virtual double calculatePay() {  // Virtual function
        return baseSalary;
    }
    
    virtual void print() {
        cout << "Employee: " << name << endl;
    }
    
    virtual ~Employee() {}  // Virtual destructor (important!)
};

class Manager : public Employee {
private:
    double bonus;
    
public:
    Manager(string n, double s, double b) 
        : Employee(n, s), bonus(b) {}
    
    double calculatePay() override {
        return baseSalary + bonus;
    }
    
    void print() override {
        cout << "Manager: " << name << endl;
    }
};

class Developer : public Employee {
private:
    int hoursOvertime;
    double overtimeRate;
    
public:
    Developer(string n, double s, int ot, double rate)
        : Employee(n, s), hoursOvertime(ot), overtimeRate(rate) {}
    
    double calculatePay() override {
        return baseSalary + (hoursOvertime * overtimeRate);
    }
    
    void print() override {
        cout << "Developer: " << name << endl;
    }
};

// Polymorphism in action:
vector<Employee*> employees;
employees.push_back(new Manager("Alice", 80000, 10000));
employees.push_back(new Developer("Bob", 70000, 10, 50));
employees.push_back(new Employee("Charlie", 50000));

for (Employee* emp : employees) {
    emp->print();
    cout << "Pay: $" << emp->calculatePay() << endl;
}
// Calls correct version based on actual object type!
```

---

#### 11.7 & 11.8 Abstract Classes

Abstract class: cannot be instantiated, serves as interface.

```cpp
class Shape {  // Abstract base class
public:
    virtual double getArea() = 0;  // Pure virtual (= 0)
    virtual double getPerimeter() = 0;
    virtual void draw() = 0;
    
    virtual ~Shape() {}
};

// Cannot do this:
// Shape s;  // ❌ Error! Cannot instantiate abstract class

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double getArea() override {
        return 3.14159 * radius * radius;
    }
    
    double getPerimeter() override {
        return 2 * 3.14159 * radius;
    }
    
    void draw() override {
        cout << "Drawing circle with radius " << radius << endl;
    }
};

class Rectangle : public Shape {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double getArea() override {
        return width * height;
    }
    
    double getPerimeter() override {
        return 2 * (width + height);
    }
    
    void draw() override {
        cout << "Drawing rectangle " << width << "x" << height << endl;
    }
};

// Use polymorphism:
Shape* shapes[] = {
    new Circle(5),
    new Rectangle(4, 6)
};

for (int i = 0; i < 2; i++) {
    shapes[i]->draw();
    cout << "Area: " << shapes[i]->getArea() << endl;
    cout << "Perimeter: " << shapes[i]->getPerimeter() << endl;
}
```

**Interface (Pure Abstract Class):**

```cpp
class Drawable {
public:
    virtual void draw() = 0;
    virtual ~Drawable() {}
};

class Movable {
public:
    virtual void move(int dx, int dy) = 0;
    virtual ~Movable() {}
};

// Multiple inheritance from interfaces:
class GameObject : public Drawable, public Movable {
private:
    int x, y;
    
public:
    void draw() override {
        cout << "Drawing at (" << x << ", " << y << ")" << endl;
    }
    
    void move(int dx, int dy) override {
        x += dx;
        y += dy;
    }
};
```

---

#### 11.10 UML (Unified Modeling Language)

Visual representation of classes and relationships.

**UML Class Diagram:**

```
┌─────────────────────┐
│      Shape          │ ← Class name
├─────────────────────┤
│ # PI: double        │ ← Attributes (# = protected)
├─────────────────────┤
│ + getArea(): double │ ← Methods (+ = public)
│ + draw(): void      │
└─────────────────────┘
         △
         │ (inheritance)
         │
    ┌────┴────┐
    │         │
┌───┴────┐ ┌─┴──────┐
│ Circle │ │Rectangle│
├────────┤ ├─────────┤
│-radius │ │-width   │
│        │ │-height  │
└────────┘ └─────────┘
```

**Access Symbols:**
- `+` public
- `-` private
- `#` protected

**Relationship Symbols:**
- `△` Inheritance
- `◇` Aggregation (has-a)
- `◆` Composition (strong has-a)
- `→` Dependency

---

### 12. ⚠️ Exceptions

Handle errors gracefully instead of crashing.

#### 12.1 Basics

```cpp
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw runtime_error("Division by zero!");
    }
    return a / b;
}

int main() {
    try {
        int result = divide(10, 0);
        cout << "Result: " << result << endl;
    }
    catch (runtime_error& e) {
        cout << "Error: " << e.what() << endl;
    }
    
    cout << "Program continues..." << endl;
    return 0;
}
```

---

#### 12.2 Functions and Exceptions

```cpp
double calculateAverage(const vector<int>& numbers) {
    if (numbers.empty()) {
        throw invalid_argument("Cannot calculate average of empty vector");
    }
    
    int sum = 0;
    for (int num : numbers) {
        sum += num;
    }
    return static_cast<double>(sum) / numbers.size();
}

try {
    vector<int> grades;
    double avg = calculateAverage(grades);
}
catch (invalid_argument& e) {
    cout << "Error: " << e.what() << endl;
}
```

---

#### 12.3 Multiple Handlers

```cpp
void processFile(const string& filename) {
    ifstream file(filename);
    
    if (!file) {
        throw runtime_error("File not found");
    }
    
    int value;
    if (!(file >> value)) {
        throw invalid_argument("Invalid data format");
    }
    
    if (value < 0) {
        throw out_of_range("Value out of range");
    }
}

try {
    processFile("data.txt");
}
catch (runtime_error& e) {
    cout << "File error: " << e.what() << endl;
}
catch (invalid_argument& e) {
    cout << "Format error: " << e.what() << endl;
}
catch (out_of_range& e) {
    cout << "Range error: " << e.what() << endl;
}
catch (...) {  // Catch all
    cout << "Unknown error" << endl;
}
```

---

### 13. 📋 Templates

Write generic code that works with any type.

#### 13.1 Function Templates

```cpp
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << maximum(10, 20) << endl;         // int
    cout << maximum(3.5, 2.1) << endl;       // double
    cout << maximum('a', 'z') << endl;       // char
    cout << maximum("apple", "banana") << endl;  // string
}
```

**Multiple Template Parameters:**

```cpp
template <typename T1, typename T2>
void printPair(T1 first, T2 second) {
    cout << first << " - " << second << endl;
}

printPair(1, "one");        // int, string
printPair(2.5, 'A');        // double, char
```

---

#### 13.2 Class Templates

```cpp
template <typename T>
class Box {
private:
    T value;
    
public:
    Box(T v) : value(v) {}
    
    void setValue(T v) {
        value = v;
    }
    
    T getValue() const {
        return value;
    }
    
    void print() const {
        cout << "Value: " << value << endl;
    }
};

Box<int> intBox(42);
intBox.print();  // Value: 42

Box<string> strBox("Hello");
strBox.print();  // Value: Hello

Box<double> dblBox(3.14);
dblBox.print();  // Value: 3.14
```

**Template Vector:**

```cpp
template <typename T>
class SimpleVector {
private:
    T* data;
    int size;
    int capacity;
    
public:
    SimpleVector() : size(0), capacity(10) {
        data = new T[capacity];
    }
    
    ~SimpleVector() {
        delete[] data;
    }
    
    void push_back(const T& value) {
        if (size == capacity) {
            resize();
        }
        data[size++] = value;
    }
    
    T get(int index) const {
        return data[index];
    }
    
    int getSize() const {
        return size;
    }
    
private:
    void resize() {
        capacity *= 2;
        T* newData = new T[capacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }
};

SimpleVector<int> intVec;
intVec.push_back(10);
intVec.push_back(20);

SimpleVector<string> strVec;
strVec.push_back("Hello");
strVec.push_back("World");
```