<link rel="stylesheet" href="../../assets/css/styles.css">


## **1. What is an API?**

Imagine you are at a restaurant.

* **You (The Client):** Want food.
* **The Kitchen (The Server):** Prepares the food.
* **The Waiter (The API):** Takes your order to the kitchen and brings the food back to you.

An **API (Application Programming Interface)** is the messenger that takes your request, tells the system what you want, and delivers the response back to you. It allows two different programs (like your Mobile App and a Database) to talk to each other.

### **How it works: The Request-Response Cycle**

Every API interaction involves:

1. **Request:** The client sends a message (URL + Data).
2. **Processing:** The server does some work (calculates data, checks database).
3. **Response:** The server sends back the result (Data + Status Code).

---

## **2. REST**

**REST** stands for *Representational State Transfer*. It is not a rule, but a "style" of building APIs that makes them fast and easy to scale.

### **The 4 Main HTTP Methods**

To talk to a REST API, you use these actions:

* **GET:** Read data (e.g., Get a list of users).
* **POST:** Create data (e.g., Register a new user).
* **PUT:** Update data (e.g., Change a user's password).
* **DELETE:** Remove data (e.g., Delete an account).

### **Code Example: Creating a simple REST Controller (Java Spring Boot)**


```java
@RestController
@RequestMapping("/api/v1/books") // The URL path starts here
public class BookController {

    // 1. GET Request: Fetching all books
    // URL: GET http://localhost:8080/api/v1/books
    @GetMapping
    public List<String> getAllBooks() {
        return Arrays.asList("The Alchemist", "Clean Code", "Harry Potter");
    }

    // 2. POST Request: Adding a new book
    // URL: POST http://localhost:8080/api/v1/books
    @PostMapping
    public String addBook(@RequestBody String bookName) {
        return "Book '" + bookName + "' has been added to the library!";
    }
}

```

### **Understanding Status Codes**

When the server responds, it sends a 3-digit number to tell you what happened:

* **200 OK:** Everything went perfect.
* **201 Created:** Success! Something new was created (used with POST).
* **400 Bad Request:** You sent something wrong (client error).
* **401 Unauthorized:** You forgot your ID/Password.
* **404 Not Found:** The "page" or "data" doesn't exist.
* **500 Internal Server Error:** The server's code crashed.

---

## **3. Data Formats: JSON vs XML**

APIs need a language to exchange data.

### **JSON (The Modern Choice)**

It looks like a JavaScript object. It is lightweight and easy to read.

```json
{
  "user_id": 101,
  "name": "Rahul",
  "is_admin": true,
  "skills": ["Java", "API Design"]
}

```

### **XML (The Older Choice)**

Used mostly in SOAP APIs. It is more "wordy" and uses tags like HTML.

```xml
<User>
  <UserId>101</UserId>
  <Name>Rahul</Name>
</User>

```

---

## **4. SOAP (Simple Object Access Protocol)**

If REST is like a casual letter, **SOAP** is like a legal contract inside a sealed envelope. It is a strict protocol used primarily by banks and giant enterprises because it is highly secure and formal.

* **Format:** Only uses **XML**.
* **Protocol:** Can work over HTTP, SMTP (email), or TCP.
* **The Contract (WSDL):** SOAP uses a file called a **WSDL** (Web Services Description Language). It’s a manual that tells the client exactly what functions are available. If you don't follow the manual exactly, the request fails.

### **Code Example: A SOAP Request (XML)**

Everything is wrapped in an "Envelope."

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.example.com/webservice">
   <soapenv:Header/>
   <soapenv:Body>
      <web:GetStockPrice>
         <web:StockTicker>GOOGL</web:StockTicker>
      </web:GetStockPrice>
   </soapenv:Body>
</soapenv:Envelope>

```

---

## **5. GraphQL (The "Menu" API)**

In REST, if you want a user’s name and their posts, you might have to call `/users/1` and then `/users/1/posts`. This is called **Over-fetching** (getting data you don't need) or **Under-fetching** (not getting enough).

**GraphQL** (created by Facebook) solves this. The client asks for **exactly** what it wants, and the server returns **only** that.

### **Key Concepts:**

* **One Endpoint:** Unlike REST (which has many URLs), GraphQL usually has only one: `/graphql`.
* **Schema:** Defines what data is available.
* **Query:** The request sent by the client.

### **Code Example: Fetching specific data**

**The Request (Query):**
"Hey Server, give me the user with ID 1, but I only want their `username` and `email`."

```graphql
query {
  user(id: "1") {
    username
    email
  }
}

```

**The Response (JSON):**
The server ignores all other fields (like password or age) and only gives what was asked.

```json
{
  "data": {
    "user": {
      "username": "rahul_dev",
      "email": "rahul@example.com"
    }
  }
}

```

---

## **6. gRPC (Google Remote Procedure Call)**

gRPC is built for **speed**. It is used for communication *between* internal servers (Microservices) rather than between a browser and a server.

### **Why is it so fast?**

1. **Protocol Buffers (Protobuf):** Instead of sending text (JSON/XML), it sends **Binary data** (1s and 0s). It’s much smaller and faster to process.
2. **HTTP/2:** It stays open and allows multiple messages to be sent at once without waiting.

### **Code Example: Defining the Service (.proto file)**

You define your data and functions in a `.proto` file.

```proto
syntax = "proto3";

// Defining the request message
message GreetingRequest {
  string name = 1;
}

// Defining the response message
message GreetingResponse {
  string message = 1;
}

// Defining the service (the function)
service Greeter {
  rpc SayHello (GreetingRequest) returns (GreetingResponse);
}

```

**Analogy:**

* **REST:** Sending a handwritten letter.
* **GraphQL:** Checking boxes on a form to get specific info.
* **gRPC:** Using a high-speed fiber-optic cable to talk to the computer in the next room.

---

## **7. Summary Comparison Table**

| Feature | REST | SOAP | GraphQL | gRPC |
| --- | --- | --- | --- | --- |
| **Data Format** | JSON, XML, Text | XML Only | JSON | Protobuf (Binary) |
| **Flexibility** | High | Low (Strict) | Extreme | Medium |
| **Speed** | Fast | Slow | Fast | Blazing Fast |
| **Best For** | Public Web APIs | Banking / Legacy | Mobile Apps | Microservices |


---

## **8. Webhooks (The "Don't Call Us, We'll Call You" API)**

In a normal API (REST), the client asks the server: *"Is my package here yet?"* every 5 minutes. This is called **Polling**, and it wastes a lot of resources.

A **Webhook** reverses this. You give the server a URL, and the server "pings" you only when something actually happens.

* **Example:** When a customer pays you on Stripe, Stripe sends a "Payment Success" message to your server automatically.

### **Code Example: A Webhook Receiver (Node.js/Express)**

*This is the code on YOUR server waiting for the external service to call it.*

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// This is the endpoint the external service (like GitHub or Stripe) will "hit"
app.post('/my-webhook-receiver', (req, res) => {
    const event = req.body;

    if (event.type === 'payment.success') {
        console.log("Money received! Updating database...");
    }

    // Always send a 200 OK back so the sender knows you got it
    res.status(200).send('Event Received');
});

```

---

## **9. WebSockets (The "Phone Call" API)**

REST is like sending a text message—you send one, you get one back, and the connection closes.
**WebSockets** are like an open phone call. Once the connection is made, both the client and server can talk to each other at any time without reconnecting.

* **Best for:** Chat apps (WhatsApp), Live Sports Scores, Stock Market tickers.

---

## **10. API Security & Authentication (Thoroughly Explained)**

The original page listed names but didn't explain *how* they work for a beginner. Let's fix that.

### **A. API Keys (The Simple Passphrase)**

The simplest form. You include a long string (key) in your request header.

* **Best for:** Public data (Weather APIs, Google Maps).
* **Risk:** If someone steals your key, they can impersonate you.

### **B. Basic Auth (Username & Password)**

You send your username and password encoded in the header.

* **Header Example:** `Authorization: Basic dXNlcjpwYXNz`
* **Warning:** Never use this without **HTTPS**, or hackers can easily decode your password.

### **C. JWT (JSON Web Token - The "ID Badge")**

When you log in, the server gives you a "Digital Badge" (the token). You show this badge every time you make a request.

* **Why it's great:** The server doesn't need to check the database for every single request. It just looks at the badge to see if the "Signature" is valid.

**Structure of a JWT:**

1. **Header:** Algorithm used.
2. **Payload:** User data (e.g., `user_id: 5`).
3. **Signature:** A secret code that proves the token hasn't been tampered with.

### **D. OAuth2 (The "Valet Key")**

Imagine you give a valet your car key. You don't want them to have your house keys or open your glove box.
**OAuth2** allows an app (like Spotify) to access another app (like Facebook) to get your "Friend List" without ever seeing your Facebook password.

---

## **11. API Documentation & Testing (Crucial Missing Topic)**

1. **Swagger / OpenAPI:** This is a tool that automatically generates a "website" for your API. It lists every URL, what data it needs, and even lets you click a "Try it out" button.
2. **Postman:** This is the #1 tool for developers. It’s a "browser for APIs." You use it to send GET/POST requests manually to see if your code is working before you write the frontend.

---



<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>