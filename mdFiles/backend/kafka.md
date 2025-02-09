## Kafka

Since using Spring Boot, Here is a full end-to-end Kafka project using Spring Boot, covering:

1. Kafka Producer (Spring Boot) – Sends messages


2. Kafka Consumer (Spring Boot) – Reads messages


3. Processing Layer – Kafka Streams


4. Database (PostgreSQL/MySQL) – Stores processed data


5. REST API & UI (Spring Boot + Thymeleaf) – Displays logs




---

### Step 1: Set Up Kafka

Download Kafka and start Zookeeper & Kafka Broker
```
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties  

# Start Kafka Broker
bin/kafka-server-start.sh config/server.properties  

# Create a topic
bin/kafka-topics.sh --create --topic logs --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

---
### Step 2: Create Spring Boot Project

Use Spring Initializr to create a project with:

- Spring Web

- Spring Boot Kafka

- Spring Data JPA

- PostgreSQL/MySQL

- Thymeleaf (for UI)





### Step 3: Configure application.properties

Update Kafka & Database settings:
```java
# Kafka Configuration
spring.kafka.bootstrap-servers=localhost:9092  
spring.kafka.consumer.group-id=log-group  
spring.kafka.consumer.auto-offset-reset=earliest  

# Database Configuration (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/logsdb  
spring.datasource.username=postgres  
spring.datasource.password=secret  
spring.jpa.hibernate.ddl-auto=update

```


### Step 4: Define Kafka Model (LogMessage.java)

Create a class to store log data.
```java
package com.example.kafkalogs.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs")
public class LogMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String level;
    private String message;
    private LocalDateTime timestamp;

    // Constructors
    public LogMessage() {}
    public LogMessage(String level, String message, LocalDateTime timestamp) {
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getters and Setters
}
```


### Step 5: Create Kafka Producer (LogProducer.java)

Sends log messages to Kafka.
```java
package com.example.kafkalogs.kafka;

import com.example.kafkalogs.model.LogMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class LogProducer {
    private final KafkaTemplate<String, LogMessage> kafkaTemplate;

    public LogProducer(KafkaTemplate<String, LogMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLog(String level, String message) {
        LogMessage log = new LogMessage(level, message, LocalDateTime.now());
        kafkaTemplate.send("logs", log);
    }
}


```

### Step 6: Create Kafka Consumer (LogConsumer.java)

Consumes Kafka messages and saves them to the database.
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

    @KafkaListener(topics = "logs", groupId = "log-group")
    public void consumeLog(LogMessage log) {
        logRepository.save(log);
        System.out.println("Received and saved log: " + log.getMessage());
    }
}


```

### Step 7: Create Repository (LogRepository.java)

Stores logs in PostgreSQL/MySQL.
```java
package com.example.kafkalogs.repository;

import com.example.kafkalogs.model.LogMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<LogMessage, Long> {
}


```

### Step 8: Create REST API (LogController.java)

Provides endpoints to send and view logs.
```java
package com.example.kafkalogs.controller;

import com.example.kafkalogs.kafka.LogProducer;
import com.example.kafkalogs.model.LogMessage;
import com.example.kafkalogs.repository.LogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogController {
    private final LogProducer logProducer;
    private final LogRepository logRepository;

    public LogController(LogProducer logProducer, LogRepository logRepository) {
        this.logProducer = logProducer;
        this.logRepository = logRepository;
    }

    @PostMapping("/send")
    public String sendLog(@RequestParam String level, @RequestParam String message) {
        logProducer.sendLog(level, message);
        return "Log sent to Kafka!";
    }

    @GetMapping("/all")
    public List<LogMessage> getAllLogs() {
        return logRepository.findAll();
    }
}


```

### Step 9: Create UI (dashboard.html)

Displays logs in a web page.
```java
<!DOCTYPE html>
<html>
<head>
    <title>Real-Time Log Dashboard</title>
</head>
<body>
    <h1>Log Messages</h1>
    <table border="1">
        <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Timestamp</th>
        </tr>
        <tr th:each="log : ${logs}">
            <td th:text="${log.level}"></td>
            <td th:text="${log.message}"></td>
            <td th:text="${log.timestamp}"></td>
        </tr>
    </table>
</body>
</html>


```

### Step 10: Create Web Controller (DashboardController.java)

Loads logs into the UI.
```java
package com.example.kafkalogs.controller;

import com.example.kafkalogs.repository.LogRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    private final LogRepository logRepository;

    public DashboardController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @GetMapping("/")
    public String showDashboard(Model model) {
        model.addAttribute("logs", logRepository.findAll());
        return "dashboard";
    }
}

```


### Step 11: Run the Application

1. Start Kafka & PostgreSQL


2. Run Spring Boot application


3. Send logs via API:



curl -X POST "http://localhost:8080/logs/send?level=INFO&message=Service%20Started"

4. Open http://localhost:8080/ in your browser to see logs.




---

### Summary of Flow

1. Spring Boot Producer → Sends logs to Kafka


2. Kafka Consumer → Reads logs & saves to DB


3. Spring Boot REST API → Provides logs


4. Web UI (Thymeleaf) → Displays logs



Would you like to integrate Kafka Streams, Grafana, or ElasticSearch for advanced processing?

