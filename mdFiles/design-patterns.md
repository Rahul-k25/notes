# **1. Seven Design Patterns from the Video**

### **1.1 Singleton Pattern**
**Definition**: Ensures that a class has only one instance and provides a global point of access to it.

**Why Use It?**
- Prevents multiple instances that might cause inconsistency.
- Saves memory and optimizes performance.
- Used when only one instance of a class is required throughout the lifecycle of an application.

**Implementation in Java:**
```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {} // Private constructor prevents instantiation

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
**Real-World Example**:
- **Database Connection**: A database should have only one active connection pool instance.
- **Logging System**: Ensures that logs are managed in a centralized manner.

---

### **1.2 Factory Pattern**
**Definition**: A creational design pattern that provides an interface for creating objects but allows subclasses to alter the type of objects that will be created.

**Why Use It?**
- Encapsulates object creation logic.
- Promotes loose coupling by avoiding direct instantiation using `new`.
- Helps when the exact type of the object isn’t known until runtime.

**Implementation in Java:**
```java
// Step 1: Define an interface
interface Shape {
    void draw();
}

// Step 2: Implement concrete classes
class Circle implements Shape {
    public void draw() {
        System.out.println("Drawing a Circle");
    }
}

class Rectangle implements Shape {
    public void draw() {
        System.out.println("Drawing a Rectangle");
    }
}

// Step 3: Create a Factory class
class ShapeFactory {
    public static Shape getShape(String shapeType) {
        if (shapeType.equalsIgnoreCase("CIRCLE")) {
            return new Circle();
        } else if (shapeType.equalsIgnoreCase("RECTANGLE")) {
            return new Rectangle();
        }
        return null;
    }
}

// Step 4: Use the Factory
public class FactoryPatternExample {
    public static void main(String[] args) {
        Shape shape1 = ShapeFactory.getShape("CIRCLE");
        shape1.draw();

        Shape shape2 = ShapeFactory.getShape("RECTANGLE");
        shape2.draw();
    }
}
```
**Real-World Example**:
- **Notification System**: A factory can create SMS, email, or push notifications dynamically.
- **Payment System**: Supports multiple payment methods (credit card, PayPal, Bitcoin) by creating different objects.

---

### **1.3 Observer Pattern**
**Definition**: A behavioral design pattern in which an object (the subject) maintains a list of dependents (observers) that need to be notified of any state changes.

**Why Use It?**
- Useful when multiple objects need to be updated when a subject changes.
- Promotes decoupling between the subject and its observers.

**Implementation in Java:**
```java
import java.util.ArrayList;
import java.util.List;

// Step 1: Define the Observer Interface
interface Observer {
    void update(String message);
}

// Step 2: Create Concrete Observers
class User implements Observer {
    private String name;
    
    public User(String name) {
        this.name = name;
    }

    public void update(String message) {
        System.out.println(name + " received notification: " + message);
    }
}

// Step 3: Define the Subject (Publisher)
class NotificationService {
    private List<Observer> observers = new ArrayList<>();

    public void subscribe(Observer observer) {
        observers.add(observer);
    }

    public void unsubscribe(Observer observer) {
        observers.remove(observer);
    }

    public void notifyUsers(String message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}

// Step 4: Use the Pattern
public class ObserverPatternExample {
    public static void main(String[] args) {
        NotificationService service = new NotificationService();

        Observer user1 = new User("Alice");
        Observer user2 = new User("Bob");

        service.subscribe(user1);
        service.subscribe(user2);

        service.notifyUsers("New article published!");
    }
}
```
**Real-World Example**:
- **YouTube Subscriptions**: Users (observers) receive notifications when a new video is uploaded.
- **Stock Market**: Investors get alerts when stock prices change.

---

### **1.4 Strategy Pattern**
**Definition**: A behavioral design pattern that allows selecting an algorithm’s implementation at runtime.

**Why Use It?**
- Allows runtime selection of different algorithms without modifying existing code.
- Promotes the Open/Closed Principle (OCP).

**Implementation in Java:**
```java
// Step 1: Create a strategy interface
interface PaymentStrategy {
    void pay(int amount);
}

// Step 2: Implement concrete strategies
class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid $" + amount + " using Credit Card.");
    }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid $" + amount + " using PayPal.");
    }
}

// Step 3: Create a context class
class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public ShoppingCart(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// Step 4: Use the Strategy pattern
public class StrategyPatternExample {
    public static void main(String[] args) {
        ShoppingCart cart1 = new ShoppingCart(new CreditCardPayment());
        cart1.checkout(100);

        ShoppingCart cart2 = new ShoppingCart(new PayPalPayment());
        cart2.checkout(200);
    }
}
```
**Real-World Example**:
- **Payment Processing**: Choose between credit card, PayPal, or Bitcoin dynamically.
- **Sorting Algorithms**: A `SortContext` class can switch between Bubble Sort, Merge Sort, or Quick Sort.

---

### **1.5 Decorator Pattern**
**Definition**: A structural design pattern that allows adding behavior to an object dynamically.

**Why Use It?**
- Avoids subclassing.
- Provides flexibility to add/remove features dynamically.

**Implementation in Java:**
```java
// Step 1: Create a base interface
interface Coffee {
    String getDescription();
    double cost();
}

// Step 2: Implement a basic concrete class
class SimpleCoffee implements Coffee {
    public String getDescription() {
        return "Simple Coffee";
    }

    public double cost() {
        return 5.0;
    }
}

// Step 3: Create a Decorator class
abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;

    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public String getDescription() {
        return coffee.getDescription();
    }

    public double cost() {
        return coffee.cost();
    }
}

// Step 4: Create concrete decorators
class Milk extends CoffeeDecorator {
    public Milk(Coffee coffee) {
        super(coffee);
    }

    public String getDescription() {
        return coffee.getDescription() + ", Milk";
    }

    public double cost() {
        return coffee.cost() + 1.5;
    }
}

// Step 5: Use the pattern
public class DecoratorPatternExample {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + " $" + coffee.cost());

        Coffee coffeeWithMilk = new Milk(coffee);
        System.out.println(coffeeWithMilk.getDescription() + " $" + coffeeWithMilk.cost());
    }
}
```
**Real-World Example**:
- **Adding Toppings to a Pizza**.
- **Enhancing Coffee with Sugar, Milk, or Cream**.

---

Awesome! Let’s continue with the rest of the design patterns from the video and then add some additional ones that are equally important.  

---

## **1.6 Command Pattern**  
### **Definition**  
The Command pattern is a behavioral design pattern that encapsulates a request as an object, allowing parameterization of clients with different requests, queuing of requests, and logging the history of executed actions.  

### **Why Use It?**  
- Decouples the sender and receiver of commands.  
- Useful in implementing undo/redo operations.  
- Helps in creating a queue of operations (e.g., macro commands in a text editor).  

---

### **Implementation in Java:**  
```java
// Step 1: Create a Command Interface
interface Command {
    void execute();
}

// Step 2: Create Concrete Commands
class Light {
    public void turnOn() {
        System.out.println("Light is ON");
    }

    public void turnOff() {
        System.out.println("Light is OFF");
    }
}

class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }
}

class LightOffCommand implements Command {
    private Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOff();
    }
}

// Step 3: Create an Invoker (Remote Control)
class RemoteControl {
    private Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
    }
}

// Step 4: Use the Command Pattern
public class CommandPatternExample {
    public static void main(String[] args) {
        Light light = new Light();

        Command lightOn = new LightOnCommand(light);
        Command lightOff = new LightOffCommand(light);

        RemoteControl remote = new RemoteControl();
        
        remote.setCommand(lightOn);
        remote.pressButton();

        remote.setCommand(lightOff);
        remote.pressButton();
    }
}
```
---

### **Real-World Example**
- **TV Remote**: Buttons on the remote act as command invokers.  
- **Text Editor (Undo/Redo Functionality)**: Every action (delete, insert, paste) is a command stored in a history stack.  

---

## **1.7 Adapter Pattern**  
### **Definition**  
The Adapter pattern is a structural design pattern that allows objects with incompatible interfaces to work together by converting one interface into another.  

### **Why Use It?**  
- Bridges the gap between incompatible classes.  
- Used when integrating old systems with new ones.  
- Provides a wrapper for legacy code.  

---

### **Implementation in Java:**  
```java
// Step 1: Define the Target Interface
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Step 2: Create an Adaptee class (Incompatible Interface)
class AdvancedMediaPlayer {
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file: " + fileName);
    }
}

// Step 3: Create an Adapter class
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMediaPlayer;

    public MediaAdapter() {
        this.advancedMediaPlayer = new AdvancedMediaPlayer();
    }

    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("MP4")) {
            advancedMediaPlayer.playMp4(fileName);
        }
    }
}

// Step 4: Create the Client class
class AudioPlayer implements MediaPlayer {
    private MediaAdapter mediaAdapter;

    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("MP4")) {
            mediaAdapter = new MediaAdapter();
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media type: " + audioType);
        }
    }
}

// Step 5: Use the Adapter Pattern
public class AdapterPatternExample {
    public static void main(String[] args) {
        AudioPlayer player = new AudioPlayer();
        player.play("MP4", "song.mp4");
    }
}
```

---

### **Real-World Example**
- **USB to Ethernet Adapter**: Allows a USB port to connect to an Ethernet cable.  
- **Java’s InputStreamReader**: Adapts an InputStream to a Reader.  

---

# **2. Additional Important Design Patterns**
The video covered some essential design patterns, but there are a few more that you should definitely know.

---

## **2.1 Builder Pattern** (Creational Pattern)
### **Definition**  
The Builder pattern allows for constructing complex objects step by step, separating the construction logic from the object’s representation.

### **Why Use It?**  
- Makes object creation more readable when an object has many optional parameters.  
- Solves the problem of telescoping constructors.  

---

### **Implementation in Java:**  
```java
// Step 1: Define a Product class
class Computer {
    private String CPU;
    private int RAM;
    private boolean hasGraphicsCard;

    private Computer(ComputerBuilder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.hasGraphicsCard = builder.hasGraphicsCard;
    }

    public void showSpecs() {
        System.out.println("CPU: " + CPU + ", RAM: " + RAM + "GB, Graphics Card: " + hasGraphicsCard);
    }

    // Step 2: Create a Builder class
    static class ComputerBuilder {
        private String CPU;
        private int RAM;
        private boolean hasGraphicsCard;

        public ComputerBuilder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }

        public ComputerBuilder setRAM(int RAM) {
            this.RAM = RAM;
            return this;
        }

        public ComputerBuilder setGraphicsCard(boolean hasGraphicsCard) {
            this.hasGraphicsCard = hasGraphicsCard;
            return this;
        }

        public Computer build() {
            return new Computer(this);
        }
    }
}

// Step 3: Use the Builder Pattern
public class BuilderPatternExample {
    public static void main(String[] args) {
        Computer myPC = new Computer.ComputerBuilder()
                .setCPU("Intel i9")
                .setRAM(32)
                .setGraphicsCard(true)
                .build();

        myPC.showSpecs();
    }
}
```
---

### **Real-World Example**
- **Building Custom Pizza Orders** (With/Without Extra Cheese, Veggies, Toppings).  
- **Creating HTTP Requests in Java (Builder Pattern is used in OkHttp)**.  

---

## **2.2 Proxy Pattern** (Structural Pattern)
### **Definition**  
A Proxy acts as an intermediary between a client and an object, controlling access to it.

### **Why Use It?**  
- Adds security (e.g., restricting access).  
- Implements lazy loading.  

---

### **Implementation in Java:**  
```java
interface Internet {
    void connectTo(String server);
}

class RealInternet implements Internet {
    public void connectTo(String server) {
        System.out.println("Connecting to " + server);
    }
}

class ProxyInternet implements Internet {
    private RealInternet realInternet = new RealInternet();
    private static List<String> bannedSites = List.of("blocked.com", "malware.com");

    public void connectTo(String server) {
        if (bannedSites.contains(server.toLowerCase())) {
            System.out.println("Access Denied to " + server);
            return;
        }
        realInternet.connectTo(server);
    }
}

public class ProxyPatternExample {
    public static void main(String[] args) {
        Internet internet = new ProxyInternet();
        internet.connectTo("example.com");
        internet.connectTo("blocked.com");
    }
}
```
---

### **Real-World Example**
- **VPN Proxy**: Restricts access to blocked websites.  
- **Lazy Loading of Images in Web Browsers**.  

---

# **Conclusion**
We covered:
- **The 7 Patterns from the Video**
- **Additional Essential Patterns**
- **Real-World Examples for Each**