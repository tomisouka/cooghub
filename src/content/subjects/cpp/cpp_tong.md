1. C++ (statically typed)

Every variable has a type known at compile time:

int x = 5;      // x can only ever be int
double y = 2.5; // y can only ever be double

If you try x = "hello", the compiler will error out before running the program.

Templates in C++ let you write generic code, but the type still must be known when you instantiate the template.

2. Python (dynamically typed)

Variables don’t have a fixed type; the type is checked at runtime:

x = 5        # x is currently an int
x = "hello"  # now x is a str

No compiler errors — Python only complains if you do something invalid when the code runs, e.g., x + 1 when x is "hello".

That’s why Python doesn’t need templates; the same function or class can handle any type automatically.

TL;DR Comparison
Feature	C++ (static)	Python (dynamic)
Variable types	Fixed at compile time	Determined at runtime
Type safety	Checked by compiler	Checked when code executes
Generic code	Templates (compile-time)	Just write normal code
Flexibility	Less flexible without templates	Very flexible, any type works