<link rel="stylesheet" href="assets/css/styles.css">

# Topics (Inprogress)

Here is a comprehensive list of **Java topics** that will be covered in the notes, categorized by difficulty level and subject area. The goal is to include every relevant topic with detailed explanations, examples, and best practices.

---

### **1. Basics of Java**
1. What is Java?  
   - Features of Java (WORA, OOP, Rich API, etc.)
   - JVM, JRE, and JDK  
2. Hello World Program  
   - Compilation and Execution  
3. Variables and Data Types  
   - Primitive and Non-Primitive Data Types  
   - Type Casting (Widening and Narrowing)  
4. Operators in Java  
   - Arithmetic, Relational, Logical, Bitwise, etc.  
5. Input/Output in Java  
   - `Scanner` and `BufferedReader` for input  
   - Printing Output using `System.out.println`  
6. Comments in Java  
   - Single-line, Multi-line, and Documentation Comments  

---

### **2. Control Flow**
1. Conditional Statements  
   - `if`, `else if`, and `else`  
   - Ternary Operator  
2. Switch Case  
   - Syntax and Fall-Through Behavior  
3. Loops in Java  
   - `for`, `while`, and `do-while` Loops  
   - Enhanced `for` Loop  
4. Break and Continue  
5. Nested Loops  

---

### **3. Object-Oriented Programming (OOP)**
1. Classes and Objects  
   - Creating Classes and Objects  
   - `this` Keyword  
2. Constructors  
   - Default, Parameterized, and Copy Constructors  
3. Inheritance  
   - `super` Keyword  
   - Method Overriding  
   - `final` Keyword in Inheritance  
4. Polymorphism  
   - Compile-Time Polymorphism (Method Overloading)  
   - Runtime Polymorphism (Method Overriding)  
5. Abstraction  
   - Abstract Classes  
   - Interfaces (Pre-Java 8 and Post-Java 8)  
6. Encapsulation  
   - Getters and Setters  
   - Access Modifiers (`private`, `protected`, `public`, `default`)  
7. Static and Non-Static Members  
8. Nested and Inner Classes  
9. `Object` Class Methods  
   - `toString`, `equals`, `hashCode`, etc.

---

### **4. Arrays and Strings**
1. Arrays  
   - Single-Dimensional and Multi-Dimensional Arrays  
   - Array Manipulation (`Arrays` Class)  
2. Strings  
   - Immutable Nature of Strings  
   - String Methods (`charAt`, `substring`, `equals`, etc.)  
   - `StringBuilder` and `StringBuffer`  
3. String Tokenization (`split` and `StringTokenizer`)  

---

### **5. Collections Framework**
1. List Interface  
   - `ArrayList`, `LinkedList`, `Vector`  
2. Set Interface  
   - `HashSet`, `LinkedHashSet`, `TreeSet`  
3. Map Interface  
   - `HashMap`, `LinkedHashMap`, `TreeMap`, `Hashtable`  
4. Queue Interface  
   - `PriorityQueue`, `Deque`  
5. Collections Utility Class  
   - Sorting, Searching, etc.  

---

### **6. Exception Handling**
1. Types of Exceptions  
   - Checked and Unchecked Exceptions  
2. Try-Catch-Finally  
3. Throw and Throws  
4. Custom Exceptions  

---

### **7. Input/Output (I/O)**
1. File Handling  
   - Reading and Writing Files (`FileReader`, `FileWriter`, `BufferedReader`, etc.)  
2. Serialization and Deserialization  
3. Working with `java.nio`  

---

### **8. Multithreading and Concurrency**
1. Thread Lifecycle  
2. Creating Threads  
   - Extending `Thread` Class  
   - Implementing `Runnable` Interface  
3. Synchronization  
   - `synchronized` Keyword  
   - Inter-thread Communication (`wait`, `notify`, `notifyAll`)  
4. Executor Framework  
   - `ExecutorService` and Thread Pools  
5. Concurrency Utilities  
   - `CountDownLatch`, `CyclicBarrier`, `Semaphore`, etc.  

---

### **9. Advanced Java Features**
1. Lambda Expressions  
2. Functional Interfaces (`Predicate`, `Consumer`, `Supplier`, etc.)  
3. Stream API  
   - Filtering, Mapping, Reducing, Collectors  
4. Optional Class  
5. Annotations  
   - Built-in Annotations (`@Override`, `@FunctionalInterface`)  
   - Custom Annotations  
6. Reflection API  
7. Generics  

---

### **10. Java 8 and Beyond**
1. Features Introduced in Java 8  
   - Default Methods in Interfaces  
   - Stream API and Functional Programming  
   - Date and Time API (`LocalDate`, `LocalTime`, `Duration`, etc.)  
2. Enhancements in Later Versions  
   - Module System (Java 9)  
   - Var Keyword (Java 10)  
   - Switch Expressions (Java 12+)  
   - Records (Java 14)  
   - Text Blocks (Java 15)  

---

### **11. JDBC (Java Database Connectivity)**
1. Connecting Java with Databases  
2. CRUD Operations  
3. Prepared Statements  
4. Transactions  

---

### **12. Design Patterns**
1. Singleton Pattern  
2. Factory Pattern  
3. Builder Pattern  
4. Observer Pattern  
5. Dependency Injection  

---

### **13. Miscellaneous Topics**
1. Enums  
2. `final`, `finally`, and `finalize`  
3. Garbage Collection  
4. JVM Architecture  
5. Working with Regular Expressions (`Pattern` and `Matcher`)  
6. Debugging and Logging (`Logger`, `Log4j`)  

---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---

## Java Basics

#### 1. Data Types and Variables

##### **Primitive Data Types**
- **Definition**: Basic building blocks of data in Java, directly stored in memory.
- **Types**:
  - **int**: Stores integers (e.g., 1, -10). Example:
    ```java
    int age = 25;
    ```
  - **float**: Stores decimal numbers with single precision. Example:
    ```java
    float price = 19.99f;
    ```
  - **double**: Stores decimal numbers with double precision. Example:
    ```java
    double salary = 12345.67;
    ```
  - **char**: Stores a single character. Example:
    ```java
    char grade = 'A';
    ```
  - **boolean**: Stores true or false. Example:
    ```java
    boolean isEligible = true;
    ```

##### **Reference Data Types**
- **Definition**: Store references to objects in memory.
- **Examples**:
  - **String**: Sequence of characters. Example:
    ```java
    String name = "John Doe";
    ```
  - **Arrays**: Collection of elements of the same type. Example:
    ```java
    int[] numbers = {1, 2, 3, 4, 5};
    ```
  - **Objects**: Instances of classes. Example:
    ```java
    class Person {
        String name;
        int age;
    }

    Person p = new Person();
    p.name = "Alice";
    p.age = 30;
    ```

---
## 2. Operators

##### **Arithmetic Operators**
- Used for mathematical operations.
- Example:
  ```java
  int a = 10, b = 5;
  System.out.println(a + b); // Addition
  System.out.println(a - b); // Subtraction
  System.out.println(a * b); // Multiplication
  System.out.println(a / b); // Division
  System.out.println(a % b); // Modulus
  ```

##### **Relational Operators**
- Compare two values and return boolean results.
- Example:
  ```java
  int x = 10, y = 20;
  System.out.println(x > y); // Greater than
  System.out.println(x < y); // Less than
  System.out.println(x == y); // Equal to
  System.out.println(x != y); // Not equal to
  ```

##### **Logical Operators**
- Combine multiple boolean expressions.
- Example:
  ```java
  boolean a = true, b = false;
  System.out.println(a && b); // Logical AND
  System.out.println(a || b); // Logical OR
  System.out.println(!a);    // Logical NOT
  ```

##### **Bitwise Operators**
- Perform operations on bits.
- Example:
  ```java
  int a = 5, b = 3; // Binary: a = 0101, b = 0011
  System.out.println(a & b); // Bitwise AND
  System.out.println(a | b); // Bitwise OR
  System.out.println(a ^ b); // Bitwise XOR
  ```

##### **Unary Operators**
- Operate on a single operand.
- Example:
  ```java
  int a = 10;
  System.out.println(+a); // Unary plus
  System.out.println(-a); // Unary minus
  System.out.println(++a); // Increment
  System.out.println(--a); // Decrement
  ```

##### **Ternary Operator**
- Short-hand for if-else.
- Example:
  ```java
  int a = 10, b = 20;
  int max = (a > b) ? a : b;
  System.out.println(max); // Prints 20
  ```

---
## 3. Control Flow Statements

##### **If-Else**
- Conditional execution of code.
- Example:
  ```java
  int age = 18;
  if (age >= 18) {
      System.out.println("Adult");
  } else {
      System.out.println("Minor");
  }
  ```

##### **Switch-Case**
- Multiple conditions with specific cases.
- Example:
  ```java
  int day = 3;
  switch (day) {
      case 1: System.out.println("Monday"); break;
      case 2: System.out.println("Tuesday"); break;
      case 3: System.out.println("Wednesday"); break;
      default: System.out.println("Invalid day");
  }
  ```

##### **Loops**

###### **For Loop**
- Example:
  ```java
  for (int i = 0; i < 5; i++) {
      System.out.println(i);
  }
  ```

###### **While Loop**
- Example:
  ```java
  int i = 0;
  while (i < 5) {
      System.out.println(i);
      i++;
  }
  ```

###### **Do-While Loop**
- Example:
  ```java
  int i = 0;
  do {
      System.out.println(i);
      i++;
  } while (i < 5);
  ```

##### **Break and Continue**
- **Break**: Exit the loop.
- **Continue**: Skip the current iteration.
- Example:
  ```java
  for (int i = 0; i < 10; i++) {
      if (i == 5) break;
      if (i % 2 == 0) continue;
      System.out.println(i);
  }
  ```

---
## 4. Input and Output

##### **Scanner Class for User Input**
- Example:
  ```java
  import java.util.Scanner;

  public class InputExample {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);

          System.out.println("Enter your name:");
          String name = scanner.nextLine();

          System.out.println("Enter your age:");
          int age = scanner.nextInt();

          System.out.println("Hello, " + name + ". You are " + age + " years old.");
      }
  }
  ```

##### **Basic Output Using System.out**
- Example:
  ```java
  public class OutputExample {
      public static void main(String[] args) {
          System.out.println("Hello, World!"); // Print with newline
          System.out.print("This is inline");  // Print inline
      }
  }
  ```



<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>