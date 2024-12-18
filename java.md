### Java Basics

---
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
#### 2. Operators

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
#### 3. Control Flow Statements

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
#### 4. Input and Output

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

