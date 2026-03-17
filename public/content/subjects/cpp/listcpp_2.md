## 🎯 Part 2: Object-Oriented Programming

> Classes, objects, encapsulation, and data abstraction

---

### 8. 🏗️ Structures

Structures group related data of different types together into a single unit.

**Visual:**

```cpp
struct Student {
    string name;
    int age;
    double gpa;
};

// Memory layout:
Student alice;
[name: "Alice"][age: 20][gpa: 3.8]
```

#### 8.1 Grouping Data

Before structs, related data is scattered:

```cpp
// ❌ Scattered variables:
string student1Name = "Alice";
int student1Age = 20;
double student1GPA = 3.8;

string student2Name = "Bob";
int student2Age = 21;
double student2GPA = 3.5;

// Hard to manage, error-prone!
```

With structs, data is organized:

```cpp
// ✅ Organized with struct:
struct Student {
    string name;
    int age;
    double gpa;
};

Student student1 = {"Alice", 20, 3.8};
Student student2 = {"Bob", 21, 3.5};
```

**Defining and Using Structs:**

```cpp
struct Point {
    double x;
    double y;
};

// Create instances:
Point p1;               // Uninitialized
Point p2 = {3.0, 4.0}; // Initialize with values
Point p3 = {};          // Zero-initialize all members

// Access members:
p1.x = 5.0;
p1.y = 10.0;
cout << "Point: (" << p1.x << ", " << p1.y << ")" << endl;

// Calculate distance from origin:
double distance = sqrt(p1.x * p1.x + p1.y * p1.y);
```

**Nested Structs:**

```cpp
struct Address {
    string street;
    string city;
    string state;
    int zipCode;
};

struct Person {
    string name;
    int age;
    Address home;  // Nested struct
};

Person person;
person.name = "Alice";
person.age = 25;
person.home.city = "Boston";
person.home.state = "MA";
person.home.zipCode = 02101;
```

---

#### 8.2 Structs and Functions

Structs can be passed to and returned from functions.

**Pass by Value (Copy):**

```cpp
struct Rectangle {
    double width;
    double height;
};

// Function receives a copy
double calculateArea(Rectangle rect) {
    return rect.width * rect.height;
}

Rectangle r = {5.0, 3.0};
double area = calculateArea(r);  // r is copied
```

**Pass by Reference (No Copy):**

```cpp
// Function receives reference (more efficient for large structs)
double calculateArea(const Rectangle& rect) {
    return rect.width * rect.height;
}

// Modify original struct:
void scaleRectangle(Rectangle& rect, double factor) {
    rect.width *= factor;
    rect.height *= factor;
}

Rectangle r = {5.0, 3.0};
scaleRectangle(r, 2.0);  // r is modified: 10.0 x 6.0
```

**Return Struct from Function:**

```cpp
struct Circle {
    double x, y;      // center
    double radius;
};

Circle createCircle(double x, double y, double r) {
    Circle c;
    c.x = x;
    c.y = y;
    c.radius = r;
    return c;
}

// Or use initializer:
Circle createCircle(double x, double y, double r) {
    return {x, y, r};  // Simpler!
}

Circle myCircle = createCircle(0, 0, 5.0);
```

**Example: Student Database**

```cpp
struct Student {
    string name;
    int id;
    double gpa;
};

void printStudent(const Student& s) {
    cout << "Name: " << s.name << endl;
    cout << "ID: " << s.id << endl;
    cout << "GPA: " << s.gpa << endl;
}

Student findTopStudent(const Student students[], int size) {
    Student top = students[0];
    for (int i = 1; i < size; i++) {
        if (students[i].gpa > top.gpa) {
            top = students[i];
        }
    }
    return top;
}

int main() {
    Student roster[3] = {
        {"Alice", 101, 3.8},
        {"Bob", 102, 3.5},
        {"Charlie", 103, 3.9}
    };

    Student topStudent = findTopStudent(roster, 3);
    printStudent(topStudent);
}
```

---

#### 8.3 Structs and Vectors

Vectors can store structs, enabling dynamic collections.

```cpp
struct Book {
    string title;
    string author;
    int year;
    double price;
};

vector<Book> library;

// Add books:
Book book1 = {"1984", "George Orwell", 1949, 15.99};
library.push_back(book1);

library.push_back({"Brave New World", "Aldous Huxley", 1932, 14.99});
library.push_back({"Fahrenheit 451", "Ray Bradbury", 1953, 13.99});

// Access books:
cout << library[0].title << endl;  // "1984"

// Iterate through library:
for (int i = 0; i < library.size(); i++) {
    cout << library[i].title << " by " << library[i].author << endl;
}

// Range-based for loop:
for (const Book& book : library) {
    cout << book.title << ": $" << book.price << endl;
}

// Find books by author:
vector<Book> findByAuthor(const vector<Book>& books, const string& author) {
    vector<Book> results;
    for (const Book& book : books) {
        if (book.author == author) {
            results.push_back(book);
        }
    }
    return results;
}
```

**Sorting Structs:**

```cpp
#include <algorithm>

// Sort by price:
bool compareByPrice(const Book& a, const Book& b) {
    return a.price < b.price;
}

sort(library.begin(), library.end(), compareByPrice);

// Sort by year:
bool compareByYear(const Book& a, const Book& b) {
    return a.year < b.year;
}

sort(library.begin(), library.end(), compareByYear);
```

---

#### 8.4 Seat Reservation Example

Complete application managing seat reservations.

```cpp
struct Seat {
    int row;
    int number;
    bool isReserved;
    string passengerName;
};

const int ROWS = 10;
const int SEATS_PER_ROW = 6;

void initializeSeats(vector<Seat>& seats) {
    for (int r = 1; r <= ROWS; r++) {
        for (int s = 1; s <= SEATS_PER_ROW; s++) {
            Seat seat = {r, s, false, ""};
            seats.push_back(seat);
        }
    }
}

void displaySeats(const vector<Seat>& seats) {
    cout << "   A B C   D E F" << endl;
    for (int r = 1; r <= ROWS; r++) {
        cout << setw(2) << r << " ";
        for (int s = 1; s <= SEATS_PER_ROW; s++) {
            int index = (r - 1) * SEATS_PER_ROW + (s - 1);
            cout << (seats[index].isReserved ? "X" : "O") << " ";
            if (s == 3) cout << "  ";  // Aisle
        }
        cout << endl;
    }
}

bool reserveSeat(vector<Seat>& seats, int row, int seatNum, const string& name) {
    if (row < 1 || row > ROWS || seatNum < 1 || seatNum > SEATS_PER_ROW) {
        return false;
    }

    int index = (row - 1) * SEATS_PER_ROW + (seatNum - 1);

    if (seats[index].isReserved) {
        return false;
    }

    seats[index].isReserved = true;
    seats[index].passengerName = name;
    return true;
}

int main() {
    vector<Seat> seats;
    initializeSeats(seats);

    displaySeats(seats);

    if (reserveSeat(seats, 5, 2, "Alice")) {
        cout << "Seat 5B reserved for Alice" << endl;
    }

    displaySeats(seats);
}
```

---

#### 8.5 Command-Line Arguments

Programs can accept input when launched from command line.

```cpp
int main(int argc, char* argv[]) {
    // argc: argument count (number of arguments)
    // argv: argument vector (array of C-strings)

    cout << "Number of arguments: " << argc << endl;

    for (int i = 0; i < argc; i++) {
        cout << "argv[" << i << "]: " << argv[i] << endl;
    }

    return 0;
}

// Running: ./program hello world 123
// Output:
// Number of arguments: 4
// argv[0]: ./program
// argv[1]: hello
// argv[2]: world
// argv[3]: 123
```

**Processing Arguments:**

```cpp
int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "Usage: " << argv[0] << " <name> <age>" << endl;
        return 1;
    }

    string name = argv[1];
    int age = stoi(argv[2]);  // Convert string to int

    cout << "Hello " << name << ", you are " << age << " years old." << endl;

    return 0;
}

// Running: ./program Alice 25
// Output: Hello Alice, you are 25 years old.
```

**Flags and Options:**

```cpp
int main(int argc, char* argv[]) {
    bool verbose = false;
    string filename;

    for (int i = 1; i < argc; i++) {
        string arg = argv[i];

        if (arg == "-v" || arg == "--verbose") {
            verbose = true;
        } else if (arg == "-f" || arg == "--file") {
            if (i + 1 < argc) {
                filename = argv[++i];
            }
        }
    }

    if (verbose) {
        cout << "Verbose mode enabled" << endl;
    }

    if (!filename.empty()) {
        cout << "Processing file: " << filename << endl;
    }

    return 0;
}

// Running: ./program -v --file data.txt
```

---

#### 8.6 Command Args and Files

Combining command-line arguments with file operations.

```cpp
#include <fstream>

struct Student {
    string name;
    int id;
    double gpa;
};

void loadStudentsFromFile(const string& filename, vector<Student>& students) {
    ifstream inFile(filename);

    if (!inFile) {
        cerr << "Error: Cannot open file " << filename << endl;
        return;
    }

    Student s;
    while (inFile >> s.name >> s.id >> s.gpa) {
        students.push_back(s);
    }

    inFile.close();
}

void saveStudentsToFile(const string& filename, const vector<Student>& students) {
    ofstream outFile(filename);

    if (!outFile) {
        cerr << "Error: Cannot create file " << filename << endl;
        return;
    }

    for (const Student& s : students) {
        outFile << s.name << " " << s.id << " " << s.gpa << endl;
    }

    outFile.close();
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "Usage: " << argv[0] << " <input_file> <output_file>" << endl;
        return 1;
    }

    string inputFile = argv[1];
    string outputFile = argv[2];

    vector<Student> students;
    loadStudentsFromFile(inputFile, students);

    // Process students (e.g., sort by GPA):
    sort(students.begin(), students.end(), 
         [](const Student& a, const Student& b) { return a.gpa > b.gpa; });

    saveStudentsToFile(outputFile, students);

    cout << "Processed " << students.size() << " students" << endl;

    return 0;
}

// Running: ./program students.txt sorted.txt
```

---

### 9. 🎨 Objects and Classes

Classes extend structs by adding functions (methods) and access control.

#### 9.1 Objects: Intro

An **object** is an instance of a class that bundles data (attributes) and functions (methods) together.

**Key Concepts:**

- **Class**: Blueprint/template for creating objects
- **Object**: Instance of a class
- **Member variables**: Data belonging to the class
- **Member functions**: Functions that operate on the class data

**Visual:**

```
Class (Blueprint):          Object (Instance):
┌─────────────────┐        ┌─────────────────┐
│   Car           │   →    │   myCar         │
├─────────────────┤        ├─────────────────┤
│ - brand         │        │ brand: "Toyota" │
│ - speed         │        │ speed: 60       │
├─────────────────┤        ├─────────────────┤
│ + accelerate()  │        │ accelerate()    │
│ + brake()       │        │ brake()         │
└─────────────────┘        └─────────────────┘
```

---

#### 9.2 Using a Class

```cpp
class Circle {
public:
    double radius;

    double getArea() {
        return 3.14159 * radius * radius;
    }

    double getCircumference() {
        return 2 * 3.14159 * radius;
    }
};

int main() {
    // Create objects:
    Circle c1;
    c1.radius = 5.0;

    Circle c2;
    c2.radius = 10.0;

    // Call member functions:
    cout << "Circle 1 area: " << c1.getArea() << endl;
    cout << "Circle 2 area: " << c2.getArea() << endl;

    return 0;
}
```

**Objects vs Structs:**

```cpp
// Struct: passive data
struct Point {
    double x, y;
};

// Class: data + behavior
class Point {
public:
    double x, y;

    double distanceFromOrigin() {
        return sqrt(x * x + y * y);
    }

    void moveBy(double dx, double dy) {
        x += dx;
        y += dy;
    }
};
```

---

#### 9.3 Defining a Class

**Basic Class Structure:**

```cpp
class ClassName {
private:
    // Private members (hidden from outside)
    int privateData;

public:
    // Public members (accessible from outside)
    void publicMethod() {
        // Can access private members
        privateData = 10;
    }
};
```

**Example: BankAccount**

```cpp
class BankAccount {
private:
    string accountNumber;
    double balance;

public:
    void setAccountNumber(string accNum) {
        accountNumber = accNum;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }

    double getBalance() {
        return balance;
    }
};

int main() {
    BankAccount account;
    account.setAccountNumber("12345");
    account.deposit(1000.0);
    account.withdraw(250.0);
    cout << "Balance: $" << account.getBalance() << endl;  // $750

    // account.balance = 1000000;  // ❌ Error! balance is private
}
```

---

#### 9.4 Inline Members

Member functions can be defined inside the class (inline) or outside.

**Inline (inside class):**

```cpp
class Rectangle {
private:
    double width, height;

public:
    // Inline definition
    double getArea() {
        return width * height;
    }

    double getPerimeter() {
        return 2 * (width + height);
    }
};
```

**Outside class:**

```cpp
class Rectangle {
private:
    double width, height;

public:
    double getArea();        // Declaration only
    double getPerimeter();   // Declaration only
};

// Definitions outside class
double Rectangle::getArea() {
    return width * height;
}

double Rectangle::getPerimeter() {
    return 2 * (width + height);
}
```

**When to use each:**

- **Inline**: Short, simple functions (1-3 lines)
- **Outside**: Longer functions, better organization

---

#### 9.5 Mutators, Accessors, and Helpers

**Accessors (Getters):** Return private data

```cpp
class Person {
private:
    string name;
    int age;

public:
    // Accessors (getters)
    string getName() const {
        return name;
    }

    int getAge() const {
        return age;
    }
};
```

**Mutators (Setters):** Modify private data with validation

```cpp
class Person {
private:
    string name;
    int age;

public:
    // Mutators (setters)
    void setName(string n) {
        name = n;
    }

    void setAge(int a) {
        if (a >= 0 && a <= 150) {  // Validation!
            age = a;
        }
    }
};
```

**Helper Functions:** Private functions used internally

```cpp
class Calculator {
private:
    // Helper function (private)
    bool isValidInput(double x) {
        return x >= 0;
    }

public:
    double squareRoot(double x) {
        if (!isValidInput(x)) {
            return -1;  // Error code
        }
        return sqrt(x);
    }
};
```

**Complete Example:**

```cpp
class Temperature {
private:
    double celsius;

    // Helper
    double celsiusToFahrenheit(double c) {
        return c * 9.0 / 5.0 + 32.0;
    }

    double celsiusToKelvin(double c) {
        return c + 273.15;
    }

public:
    // Mutator
    void setCelsius(double c) {
        if (c >= -273.15) {  // Absolute zero check
            celsius = c;
        }
    }

    // Accessors
    double getCelsius() const {
        return celsius;
    }

    double getFahrenheit() const {
        return celsiusToFahrenheit(celsius);
    }

    double getKelvin() const {
        return celsiusToKelvin(celsius);
    }
};
```

---

#### 9.6 Constructors and Initialization

Constructors are special functions that initialize objects.

**Default Constructor:**

```cpp
class Point {
private:
    double x, y;

public:
    // Default constructor
    Point() {
        x = 0;
        y = 0;
    }

    void print() {
        cout << "(" << x << ", " << y << ")" << endl;
    }
};

Point p;  // Calls default constructor, initializes to (0, 0)
p.print();  // (0, 0)
```

**Parameterized Constructor:**

```cpp
class Point {
private:
    double x, y;

public:
    // Parameterized constructor
    Point(double xVal, double yVal) {
        x = xVal;
        y = yVal;
    }
};

Point p(3.0, 4.0);  // Calls parameterized constructor
```

**Multiple Constructors:**

```cpp
class Rectangle {
private:
    double width, height;

public:
    // Default constructor
    Rectangle() {
        width = 0;
        height = 0;
    }

    // Square constructor (one parameter)
    Rectangle(double side) {
        width = side;
        height = side;
    }

    // Rectangle constructor (two parameters)
    Rectangle(double w, double h) {
        width = w;
        height = h;
    }
};

Rectangle r1;           // 0 x 0
Rectangle r2(5.0);      // 5 x 5 (square)
Rectangle r3(4.0, 6.0); // 4 x 6
```

---

#### 9.7 Classes with Vectors

Classes can contain vectors as member variables.

```cpp
class GradeBook {
private:
    string courseName;
    vector<double> grades;

public:
    GradeBook(string name) {
        courseName = name;
    }

    void addGrade(double grade) {
        if (grade >= 0 && grade <= 100) {
            grades.push_back(grade);
        }
    }

    double getAverage() const {
        if (grades.empty()) {
            return 0;
        }

        double sum = 0;
        for (double grade : grades) {
            sum += grade;
        }
        return sum / grades.size();
    }

    double getHighest() const {
        if (grades.empty()) {
            return 0;
        }

        double highest = grades[0];
        for (double grade : grades) {
            if (grade > highest) {
                highest = grade;
            }
        }
        return highest;
    }

    int getCount() const {
        return grades.size();
    }
};

int main() {
    GradeBook math("Calculus");
    math.addGrade(85.5);
    math.addGrade(92.0);
    math.addGrade(78.5);

    cout << "Average: " << math.getAverage() << endl;
    cout << "Highest: " << math.getHighest() << endl;
    cout << "Count: " << math.getCount() << endl;
}
```

---

#### 9.8 Separate Files

Large programs split classes into header (.h) and implementation (.cpp) files.

**Rectangle.h (Header):**

```cpp
#ifndef RECTANGLE_H
#define RECTANGLE_H

class Rectangle {
private:
    double width;
    double height;

public:
    Rectangle();
    Rectangle(double w, double h);

    void setWidth(double w);
    void setHeight(double h);
    double getWidth() const;
    double getHeight() const;

    double getArea() const;
    double getPerimeter() const;
};

#endif
```

**Rectangle.cpp (Implementation):**

```cpp
#include "Rectangle.h"

Rectangle::Rectangle() {
    width = 0;
    height = 0;
}

Rectangle::Rectangle(double w, double h) {
    width = w;
    height = h;
}

void Rectangle::setWidth(double w) {
    if (w > 0) {
        width = w;
    }
}

void Rectangle::setHeight(double h) {
    if (h > 0) {
        height = h;
    }
}

double Rectangle::getWidth() const {
    return width;
}

double Rectangle::getHeight() const {
    return height;
}

double Rectangle::getArea() const {
    return width * height;
}

double Rectangle::getPerimeter() const {
    return 2 * (width + height);
}
```

**main.cpp (Usage):**

```cpp
#include <iostream>
#include "Rectangle.h"
using namespace std;

int main() {
    Rectangle r(5.0, 3.0);
    cout << "Area: " << r.getArea() << endl;
    cout << "Perimeter: " << r.getPerimeter() << endl;

    return 0;
}
```

**Include Guards:**

```cpp
#ifndef CLASSNAME_H  // If not defined
#define CLASSNAME_H  // Define it

// Class declaration

#endif  // End if
```

Prevents multiple inclusion of the same header.

---

#### 9.9 Choosing Classes

**When to create a class:**

✅ **Represents a real-world entity**

```cpp
class Car { ... }
class Student { ... }
class BankAccount { ... }
```

✅ **Groups related data and operations**

```cpp
class ShoppingCart {
    vector<Item> items;
    void addItem();
    double getTotal();
};
```

✅ **Needs data hiding/validation**

```cpp
class Password {
private:
    string hash;  // Hidden from outside
public:
    bool verify(string input);
};
```

❌ **Don't create class for:**

- Simple data grouping (use struct)
- Unrelated functions (use namespace or separate functions)
- Single-use code

---

#### 9.10 Unit Testing (Classes)

Testing individual class methods.

```cpp
class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }

    int multiply(int a, int b) {
        return a * b;
    }

    double divide(int a, int b) {
        if (b == 0) {
            return -1;  // Error code
        }
        return static_cast<double>(a) / b;
    }
};

void testCalculator() {
    Calculator calc;

    // Test add:
    assert(calc.add(2, 3) == 5);
    assert(calc.add(-1, 1) == 0);
    assert(calc.add(0, 0) == 0);

    // Test multiply:
    assert(calc.multiply(3, 4) == 12);
    assert(calc.multiply(0, 5) == 0);
    assert(calc.multiply(-2, 3) == -6);

    // Test divide:
    assert(calc.divide(10, 2) == 5.0);
    assert(calc.divide(7, 2) == 3.5);
    assert(calc.divide(5, 0) == -1);  // Error case

    cout << "All tests passed!" << endl;
}
```

---

#### 9.11 Constructor Overloading

Multiple constructors with different parameters.

```cpp
class Date {
private:
    int day, month, year;

public:
    // Default: today's date
    Date() {
        day = 1;
        month = 1;
        year = 2024;
    }

    // Year only
    Date(int y) {
        day = 1;
        month = 1;
        year = y;
    }

    // Month and year
    Date(int m, int y) {
        day = 1;
        month = m;
        year = y;
    }

    // Full date
    Date(int d, int m, int y) {
        day = d;
        month = m;
        year = y;
    }

    void print() {
        cout << month << "/" << day << "/" << year << endl;
    }
};

Date d1;              // 1/1/2024
Date d2(2025);        // 1/1/2025
Date d3(6, 2025);     // 6/1/2025
Date d4(15, 6, 2025); // 6/15/2025
```

---

#### 9.12 Initialization Lists

More efficient way to initialize member variables.

**Without initialization list:**

```cpp
class Point {
private:
    double x, y;

public:
    Point(double xVal, double yVal) {
        x = xVal;  // Assignment (less efficient)
        y = yVal;
    }
};
```

**With initialization list:**

```cpp
class Point {
private:
    double x, y;

public:
    Point(double xVal, double yVal) : x(xVal), y(yVal) {
        // Direct initialization (more efficient)
    }
};
```

**Required for const members:**

```cpp
class Circle {
private:
    const double PI;  // Must be initialized
    double radius;

public:
    Circle(double r) : PI(3.14159), radius(r) {
        // PI must be in initialization list
    }
};
```

**With vectors:**

```cpp
class StudentRoster {
private:
    vector<string> names;
    int maxSize;

public:
    StudentRoster(int size) : maxSize(size), names() {
        // names() calls default vector constructor
    }
};
```

---

#### 9.13 `this` Keyword

Pointer to the current object.

```cpp
class Person {
private:
    string name;
    int age;

public:
    void setName(string name) {
        this->name = name;  // this->name is member, name is parameter
    }

    void setAge(int age) {
        this->age = age;
    }

    Person& setNameChainable(string name) {
        this->name = name;
        return *this;  // Return reference to current object
    }

    Person& setAgeChainable(int age) {
        this->age = age;
        return *this;
    }
};

// Method chaining:
Person p;
p.setNameChainable("Alice").setAgeChainable(25);
```

**Comparing objects:**

```cpp
class Point {
private:
    double x, y;

public:
    Point(double x, double y) : x(x), y(y) {}

    bool equals(const Point& other) {
        return this->x == other.x && this->y == other.y;
    }
};

Point p1(3, 4);
Point p2(3, 4);
if (p1.equals(p2)) {
    cout << "Points are equal" << endl;
}
```

---

#### 9.14 Operator Overloading

Defining how operators work with custom classes.

**Arithmetic Operators:**

```cpp
class Complex {
private:
    double real, imag;

public:
    Complex(double r, double i) : real(r), imag(i) {}

    // Overload + operator
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // Overload - operator
    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }

    // Overload * operator
    Complex operator*(const Complex& other) const {
        double r = real * other.real - imag * other.imag;
        double i = real * other.imag + imag * other.real;
        return Complex(r, i);
    }

    void print() const {
        cout << real << " + " << imag << "i" << endl;
    }
};

Complex c1(3, 4);
Complex c2(1, 2);
Complex c3 = c1 + c2;  // Uses overloaded +
c3.print();  // 4 + 6i
```

**Stream Operators:**

```cpp
class Point {
private:
    double x, y;

public:
    Point(double x, double y) : x(x), y(y) {}

    // Overload << (output)
    friend ostream& operator<<(ostream& os, const Point& p) {
        os << "(" << p.x << ", " << p.y << ")";
        return os;
    }

    // Overload >> (input)
    friend istream& operator>>(istream& is, Point& p) {
        is >> p.x >> p.y;
        return is;
    }
};

Point p(3, 4);
cout << p << endl;  // (3, 4)

Point p2(0, 0);
cin >> p2;  // User enters: 5 6
cout << p2 << endl;  // (5, 6)
```

---

#### 9.15 Comparison Operators

```cpp
class Fraction {
private:
    int numerator, denominator;

public:
    Fraction(int n, int d) : numerator(n), denominator(d) {}

    // Convert to decimal for comparison
    double getValue() const {
        return static_cast<double>(numerator) / denominator;
    }

    bool operator==(const Fraction& other) const {
        return getValue() == other.getValue();
    }

    bool operator!=(const Fraction& other) const {
        return !(*this == other);
    }

    bool operator<(const Fraction& other) const {
        return getValue() < other.getValue();
    }

    bool operator>(const Fraction& other) const {
        return getValue() > other.getValue();
    }

    bool operator<=(const Fraction& other) const {
        return !(*this > other);
    }

    bool operator>=(const Fraction& other) const {
        return !(*this < other);
    }
};

Fraction f1(1, 2);  // 0.5
Fraction f2(2, 4);  // 0.5
Fraction f3(3, 4);  // 0.75

if (f1 == f2) cout << "f1 equals f2" << endl;
if (f3 > f1) cout << "f3 is greater than f1" << endl;
```

---

#### 9.16 Vector ADT (Abstract Data Type)

Creating a custom vector-like class.

```cpp
class IntVector {
private:
    int* data;
    int capacity;
    int size;

    void resize() {
        capacity *= 2;
        int* newData = new int[capacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }

public:
    IntVector() : capacity(10), size(0) {
        data = new int[capacity];
    }

    ~IntVector() {
        delete[] data;
    }

    void push_back(int value) {
        if (size == capacity) {
            resize();
        }
        data[size++] = value;
    }

    int get(int index) const {
        if (index >= 0 && index < size) {
            return data[index];
        }
        return -1;  // Error
    }

    int getSize() const {
        return size;
    }

    void print() const {
        for (int i = 0; i < size; i++) {
            cout << data[i] << " ";
        }
        cout << endl;
    }
};
```

---

#### 9.17 Namespaces

Organize code and prevent name conflicts.

```cpp
namespace MathUtils {
    const double PI = 3.14159;

    double square(double x) {
        return x * x;
    }

    double cube(double x) {
        return x * x * x;
    }
}

namespace StringUtils {
    string toUpper(string str) {
        for (char& c : str) {
            c = toupper(c);
        }
        return str;
    }

    string toLower(string str) {
        for (char& c : str) {
            c = tolower(c);
        }
        return str;
    }
}

// Usage:
double area = MathUtils::PI * MathUtils::square(5);
string upper = StringUtils::toUpper("hello");

// Or use using:
using namespace MathUtils;
double vol = PI * cube(3);
```

---

#### 9.18 Static Members

Shared among all objects of a class.

```cpp
class BankAccount {
private:
    string accountNumber;
    double balance;
    static int totalAccounts;  // Shared by all objects
    static double totalDeposits;

public:
    BankAccount(string accNum) : accountNumber(accNum), balance(0) {
        totalAccounts++;
    }

    void deposit(double amount) {
        balance += amount;
        totalDeposits += amount;
    }

    static int getTotalAccounts() {
        return totalAccounts;
    }

    static double getTotalDeposits() {
        return totalDeposits;
    }
};

// Initialize static members outside class:
int BankAccount::totalAccounts = 0;
double BankAccount::totalDeposits = 0.0;

// Usage:
BankAccount acc1("12345");
BankAccount acc2("67890");
BankAccount acc3("11111");

acc1.deposit(1000);
acc2.deposit(2000);

cout << "Total accounts: " << BankAccount::getTotalAccounts() << endl;  // 3
cout << "Total deposits: $" << BankAccount::getTotalDeposits() << endl;  // $3000
```

---
