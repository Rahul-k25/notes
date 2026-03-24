<link rel="stylesheet" href="../../assets/css/styles.css">

## Kafka

### Part 1: Introduction to Kafka Fundamentals

Before touching code, a beginner must understand the "Who, What, and Why" of Kafka.

#### 1. What is Kafka?

Imagine a very busy restaurant.

* **Without Kafka:** The waiter (Producer) takes an order and stands at the kitchen counter staring at the chef (Consumer) until the food is ready. If the chef is slow, the waiter is stuck. This is "Synchronous" communication.
* **With Kafka:** The waiter writes the order on a ticket and pins it to a board (Kafka). The waiter immediately goes to serve other tables. The chef looks at the board whenever they are ready and picks up the next ticket. This is "Asynchronous" communication.

**Key Definition:** Kafka is a **distributed event streaming platform**. It acts as a middleman that stores "messages" (data) so that different parts of a software system can talk to each other without being directly connected.

#### 2. Core Components (The Vocabulary)

* **Producer:** The application that *sends* the data (e.g., a web server logging a user click).
* **Consumer:** The application that *receives* and processes the data (e.g., a database saver or an analytics engine).
* **Broker:** A Kafka server. It receives messages from producers, stores them on disk, and serves them to consumers.
* **Topic:** Think of this as a **folder** or a **category** name. Producers send messages to a specific topic, and consumers "subscribe" to that topic to get the data.
* **Partition:** A topic is split into "partitions." Imagine a topic as a long logbook; partitions are like having multiple logbooks for the same topic so that multiple people can read/write at the same time (Scaling).
* **Zookeeper:** (Used in older versions/current standard setups) It acts as a **coordinator** or "manager" that keeps track of which brokers are alive and who is the leader of a partition.

---

### Part 2: Setting Up the Environment

*The original guide starts here, but it misses explaining the commands.*

#### Step 1: Install and Start Kafka

1. **Download:** Get the latest binary from [kafka.apache.org](https://kafka.apache.org/).
2. **Start Zookeeper:** Kafka needs a coordinator to run.

```bash
# Open a terminal and run:
bin/zookeeper-server-start.sh config/zookeeper.properties

```


3. **Start Kafka Broker:** Now start the actual engine.

```bash
# Open a NEW terminal and run:
bin/kafka-server-start.sh config/server.properties

```


4. **Create a Topic:** We need a place to send our messages. Let's call it `logs`.

```bash
bin/kafka-topics.sh --create --topic logs --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

```


* `--bootstrap-server localhost:9092`: This is the default address where Kafka lives.
* `--partitions 1`: We are using 1 "lane" for our data.
* `--replication-factor 1`: We only want 1 copy of our data (fine for local testing).



---

### Part 3: The Spring Boot "Glue"

To make Spring Boot talk to Kafka, we need dependencies.

**What was missing in the guide:** A beginner needs to know that Kafka communicates using **Bytes**. However, our Java code uses **Objects**. We need a **Serializer** (to turn Java objects into bytes) and a **Deserializer** (to turn bytes back into Java objects).

**Project Dependencies (pom.xml):**
If using Maven, you must ensure these are present:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>

```

*Note: Jackson is needed to convert our Java objects into JSON strings, which Kafka can then send.*

### Part 4: Building the "Brain" (The Producer)

Now we need to create the service that actually sends the messages.

#### 1. What is a KafkaTemplate?

A beginner might ask: *"How does Java actually talk to Kafka?"* In Spring Boot, we use **KafkaTemplate**. Think of it like a "post office." You give it your message and the address (Topic), and it handles all the complicated network stuff to get it to the Kafka broker.

#### 2. The Producer Code (with explanations)

The original guide had a simple producer, but it didn't show how to handle the "Success" or "Failure" of a sent message. If the Kafka server is down, your application shouldn't just crash or pretend it worked.

```java
package com.example.kafkalogs.kafka;

import com.example.kafkalogs.model.LogMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class LogProducer {
    // String is the Key (usually a unique ID), LogMessage is the Value
    private final KafkaTemplate<String, LogMessage> kafkaTemplate;

    public LogProducer(KafkaTemplate<String, LogMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLog(String level, String message) {
        LogMessage log = new LogMessage(level, message, LocalDateTime.now());
        
        // Sending to the topic named "logs"
        // In real apps, we use .whenComplete() to check if the message actually arrived
        kafkaTemplate.send("logs", log).whenComplete((result, ex) -> {
            if (ex == null) {
                System.out.println("Sent message=[" + log.getMessage() + 
                    "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                System.err.println("Unable to send message due to : " + ex.getMessage());
            }
        });
    }
}

```

> **What is an Offset?** (Beginner Concept): Every message in Kafka is assigned a number (0, 1, 2...). This is called an **Offset**. It's like a page number in a book so Kafka knows exactly where each message is.

---

### Part 5: The "Listener" (The Consumer)

The Consumer "listens" for new messages.

#### 1. The `@KafkaListener` Annotation

This is the magic part of Spring Boot. You just put this annotation on a method, and Spring will automatically run that method whenever a new message arrives in the topic.

#### 2. The Consumer Code

```java
package com.example.kafkalogs.kafka;

import com.example.kafkalogs.model.LogMessage;
import com.example.kafkalogs.repository.LogRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class LogConsumer {
    private final LogRepository logRepository;

    public LogConsumer(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    // groupId: Messages are divided among consumers with the same group ID.
    // If you have 2 instances of this app, Kafka will send half the logs to each.
    @KafkaListener(topics = "logs", groupId = "log-group")
    public void consumeLog(LogMessage log) {
        logRepository.save(log);
        System.out.println("Received and saved: " + log.getMessage());
    }
}

```

---

### Part 6: Why `application.properties` Matters

The original guide provided the properties but didn't explain the most important part for beginners: **Serialization**.

Kafka only understands **Zeros and Ones (Bytes)**. Java understands **Objects**.

* **Serializer:** Turns your `LogMessage` object into JSON bytes (Producer side).
* **Deserializer:** Turns those JSON bytes back into a `LogMessage` object (Consumer side).

**Update your `application.properties` with these critical lines:**

```properties
# THE SERVER ADDRESS
spring.kafka.bootstrap-servers=localhost:9092

# PRODUCER SETTINGS
# We use String for the key and JSON for our object
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer

# CONSUMER SETTINGS
spring.kafka.consumer.group-id=log-group
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer

# IMPORTANT: Tell Spring it's safe to trust our model package for JSON
spring.kafka.consumer.properties.spring.json.trusted.packages=com.example.kafkalogs.model

```

> **Warning:** If you miss the `trusted.packages` line, your consumer will throw a security error because it doesn't trust the incoming data to be converted into your Java class!

---
### Part 7: The Data Warehouse (Database & Repository)

Now that our "Post Office" (Kafka) is working, we need a place to store the mail once it’s delivered. This is where **Spring Data JPA** and **PostgreSQL** come in.

#### 1. Why a Database?

Kafka is a "streaming" platform—it’s great for moving data. But if you want to look up a log from three days ago efficiently or create a search feature, you should store the results in a permanent database like **PostgreSQL** or **MySQL**.

#### 2. The Entity (The Blueprint)

We use the `@Entity` annotation to tell Spring that this class represents a table in our database.

```java
package com.example.kafkalogs.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity 
@Table(name = "logs") // This creates a table named 'logs' automatically
public class LogMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Database handles the ID auto-increment
    private Long id;
    
    private String level;    // e.g., INFO, ERROR, WARN
    private String message;  // The actual log text
    private LocalDateTime timestamp;

    // Standard empty constructor (Required by JPA)
    public LogMessage() {}

    public LogMessage(String level, String message, LocalDateTime timestamp) {
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getters and Setters (Omitted for brevity, but you MUST include them)
}

```

#### 3. The Repository (The Data Access)

Beginners often wonder: *"Do I need to write SQL queries like `INSERT INTO...`?"* No. Spring Data JPA provides the `JpaRepository`. Just by extending this interface, you get methods like `.save()`, `.findAll()`, and `.delete()` for free.

```java
package com.example.kafkalogs.repository;

import com.example.kafkalogs.model.LogMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<LogMessage, Long> {
    // No code needed here! Spring handles the implementation.
}

```

---

### Part 8: Connecting the Dots (REST API)

We need a way to **trigger** a message. We will create a REST Controller so we can send an HTTP request that tells our Producer to send a message to Kafka.

```java
package com.example.kafkalogs.controller;

import com.example.kafkalogs.kafka.LogProducer;
import com.example.kafkalogs.model.LogMessage;
import com.example.kafkalogs.repository.LogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs") // Better naming practice to use /api/
public class LogController {
    private final LogProducer logProducer;
    private final LogRepository logRepository;

    public LogController(LogProducer logProducer, LogRepository logRepository) {
        this.logProducer = logProducer;
        this.logRepository = logRepository;
    }

    // Endpoint to TRIGGER the producer
    @PostMapping("/send")
    public String sendToKafka(@RequestParam String level, @RequestParam String message) {
        logProducer.sendLog(level, message);
        return "Message successfully queued for Kafka!";
    }

    // Endpoint to READ from the database
    @GetMapping("/all")
    public List<LogMessage> fetchFromDb() {
        return logRepository.findAll();
    }
}

```

---

### Part 9: How to Test (The "Moment of Truth")

The original guide didn't explain *how* to see if it's working. Follow these steps:

1. **Run the App:** Click 'Run' in your IDE (IntelliJ/Eclipse).
2. **Send a Message:** Use a tool like **Postman** or your browser to hit this URL:
`POST http://localhost:8080/api/logs/send?level=ERROR&message=DatabaseConnectionFailed`
3. **Check the Console:** You should see:
* `Sent message=[DatabaseConnectionFailed]...` (from Producer)
* `Received and saved: DatabaseConnectionFailed` (from Consumer)


4. **Verify Storage:** Go to:
`GET http://localhost:8080/api/logs/all`
You should see a JSON list containing your message.

---

### Part 10: Common Beginner Errors (Troubleshooting)

When working with Kafka for the first time, things rarely work perfectly on the first try. Here is how to fix the "Big Three" mistakes beginners make.

#### 1. The "Connection Refused" Error

**Symptoms:** Your Spring Boot app crashes on startup or logs `Connection to node -1 could not be established. Broker may not be available.`

* **The Cause:** You forgot to start Kafka, or you started Kafka but forgot Zookeeper.
* **The Fix:** 1.  Ensure Zookeeper is running on port **2181**.
2.  Ensure Kafka Broker is running on port **9092**.
3.  If you are using Docker, make sure you've mapped the ports correctly.

#### 2. The "Class Not Found" / Serialization Error

**Symptoms:** The Producer sends the message, but the Consumer logs a massive error saying `java.lang.IllegalArgumentException: The class 'com.example.LogMessage' is not in the trusted packages`.

* **The Cause:** Kafka receives raw bytes. When the Consumer tries to turn those bytes back into a Java Object, Spring Boot blocks it for security reasons because it doesn't "trust" the package.
* **The Fix:** Add this to your `application.properties`:
```properties
spring.kafka.consumer.properties.spring.json.trusted.packages=*

```


*(Using `*` trusts all packages, which is fine for local learning.)*

#### 3. The "Silent Consumer" (No Data Received)

**Symptoms:** You send a message, the Producer says "Success," but the Consumer does absolutely nothing.

* **The Cause:** The Consumer group might be reading from the "latest" offset. If you sent the message *before* the consumer was fully started, it will ignore the old messages.
* **The Fix:** 1.  Check your `group-id`. If you change it to something new (e.g., `group-id=test-2`), Kafka treats you as a brand new reader.
2.  Ensure `auto-offset-reset=earliest` is in your properties. This tells Kafka: "If I've never seen this data before, start from the very beginning of the log."

---

### Final Summary of the "Kafka Journey"

1. **Zookeeper** manages the **Brokers**.
2. **Producers** convert Java Objects into **JSON Bytes** (Serialization).
3. **Topics** act as the mailbox where messages sit.
4. **Consumers** pull the bytes and convert them back into **Java Objects** (Deserialization).
5. **JPA/Hibernate** saves that object into your permanent **Database**.

---

### One Last Beginner Tip: Visualizing Kafka

If you find the terminal/command line confusing, you can download a tool called **Offset Explorer (formerly Kafka Tool)**. It provides a visual UI where you can click on your topics and actually see the messages sitting inside Kafka. It's much easier than reading raw terminal logs!



<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>