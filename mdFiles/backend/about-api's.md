## **Learn about APIs**
APIs (Application Programming Interfaces) enable communication between different software applications. They define rules and protocols for accessing web services, databases, and other external systems.

### **1. REST (Representational State Transfer)**
REST is an architectural style for designing networked applications based on stateless communication. It uses HTTP methods for CRUD operations.

#### **Key Principles of REST:**
- Stateless: No session is stored on the server; each request contains all necessary information.
- Client-Server Architecture: Separation of concerns between frontend and backend.
- Uniform Interface: Uses standard HTTP methods (GET, POST, PUT, DELETE).
- Resource-Based: Operates on resources identified by URIs.
- Cacheable: Responses should be cacheable to improve performance.

#### **REST API Example in Java (Spring Boot)**
```java
@RestController
@RequestMapping("/users")
public class UserController {
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
```

---

### **2. JSON APIs**
JSON (JavaScript Object Notation) is a lightweight data interchange format that is widely used in APIs.

#### **Example JSON Response:**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
}
```

#### **Parsing JSON in Java (Jackson Library)**
```java
ObjectMapper objectMapper = new ObjectMapper();
User user = objectMapper.readValue(jsonString, User.class);
```

---

### **3. SOAP (Simple Object Access Protocol)**
SOAP is a protocol for exchanging structured information in web services using XML.

#### **Key Features of SOAP:**
- XML-based messaging protocol.
- Works over multiple protocols (HTTP, SMTP, TCP).
- Supports WS-Security for secure communication.
- Uses WSDL (Web Services Description Language) for defining service contracts.

#### **Example SOAP Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:ex="http://example.com">
   <soapenv:Header/>
   <soapenv:Body>
      <ex:GetUserRequest>
         <ex:id>1</ex:id>
      </ex:GetUserRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

#### **SOAP Web Service in Java (Spring Boot)**
```java
@Endpoint
public class UserEndpoint {
    private static final String NAMESPACE_URI = "http://example.com";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetUserRequest")
    @ResponsePayload
    public GetUserResponse getUser(@RequestPayload GetUserRequest request) {
        GetUserResponse response = new GetUserResponse();
        response.setUser(userService.getUserById(request.getId()));
        return response;
    }
}
```

---

### **4. gRPC (Google Remote Procedure Call)**
gRPC is a high-performance RPC framework that uses Protocol Buffers (protobufs) instead of JSON/XML.

#### **Advantages of gRPC:**
- Uses HTTP/2 for better performance.
- Supports streaming requests and responses.
- Language-independent.

#### **Defining gRPC Service (Proto File)**
```proto
syntax = "proto3";

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest {
  int32 id = 1;
}

message UserResponse {
  int32 id = 1;
  string name = 2;
  string email = 3;
}
```

#### **gRPC Server in Java**
```java
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    @Override
    public void getUser(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        UserResponse response = UserResponse.newBuilder()
                .setId(request.getId())
                .setName("John Doe")
                .setEmail("john@example.com")
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
```

---

### **5. GraphQL**
GraphQL is a query language for APIs that allows clients to request only the data they need.

#### **Advantages of GraphQL:**
- Fetches multiple resources in a single request.
- Avoids over-fetching and under-fetching of data.
- Strongly typed schema.

#### **Example GraphQL Query:**
```graphql
query {
  user(id: 1) {
    name
    email
  }
}
```

#### **GraphQL API in Java (Spring Boot)**
```java
@Component
public class UserGraphQLDataFetcher {
    @QueryMapping
    public User getUser(@Argument Long id) {
        return userService.getUserById(id);
    }
}
```

---

## **Authentication Methods**
Authentication ensures that only authorized users can access an API.

### **1. JWT (JSON Web Token)**
JWT is a token-based authentication system where a signed token is used for authentication.

#### **JWT Example in Java (Spring Boot)**
```java
String token = Jwts.builder()
    .setSubject("user")
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
    .signWith(SignatureAlgorithm.HS256, secretKey)
    .compact();
```

---

### **2. OAuth**
OAuth is an authorization framework that allows third-party apps to access a user's resources without sharing passwords.

#### **OAuth Flow:**
1. User logs in and authorizes access.
2. Authorization server issues an access token.
3. Client uses the token to access resources.

#### **OAuth Example in Java (Spring Security)**
```java
@EnableWebSecurity
public class SecurityConfig extends OAuth2AuthorizationServerConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.oauth2Login();
    }
}
```

---

### **3. Basic Authentication**
Basic Authentication encodes username and password in the request header.

#### **Example Header:**
```
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

#### **Basic Auth in Java**
```java
HttpHeaders headers = new HttpHeaders();
headers.setBasicAuth("username", "password");
```

---

### **4. Token Authentication**
Token authentication uses unique tokens instead of credentials for API requests.

#### **Token Example in Java**
```java
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer " + token);
```

---

### **5. Cookie-Based Authentication**
Uses cookies to store authentication tokens.

#### **Spring Boot Example**
```java
Cookie cookie = new Cookie("SESSIONID", sessionId);
response.addCookie(cookie);
```

---

### **6. OpenID**
OpenID is an authentication protocol that enables single sign-on (SSO).

#### **Example:**
```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.oauth2Login();
    }
}
```

---

### **7. SAML (Security Assertion Markup Language)**
SAML is an XML-based authentication framework for SSO.

#### **Example SAML Response:**
```xml
<saml:Assertion>
   <saml:Subject>
      <saml:NameID>user@example.com</saml:NameID>
   </saml:Subject>
</saml:Assertion>
```

---

