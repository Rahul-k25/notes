# Spring Boot — Complete Preparation Guide

## Table of Contents

1. [Spring Boot Overview & Auto-Configuration](#chapter-1-spring-boot-overview--auto-configuration)
2. [Beans — Creation, Lifecycle, Annotations](#chapter-2-beans--creation-lifecycle-annotations)
3. [Dependency Injection](#chapter-3-dependency-injection)
4. [Bean Scopes — Singleton, Prototype, Request, Session](#chapter-4-bean-scopes)
5. [@Profile — Environment-Based Bean Activation](#chapter-5-profile--environment-based-bean-activation)
6. [Exception Handling — @ControllerAdvice & @ExceptionHandler](#chapter-6-exception-handling)
7. [Spring Data JPA — Complete Deep Dive](#chapter-7-spring-data-jpa)
8. [@Transactional — Transaction Management](#chapter-8-transactional)
9. [Building REST APIs — Controllers & Validation](#chapter-9-building-rest-apis)
10. [Spring Security & JWT](#chapter-10-spring-security--jwt)
11. [Actuator & @ConfigurationProperties](#chapter-11-actuator--configurationproperties)
12. [Testing Spring Boot Applications](#chapter-12-testing)
13. [AOP — Aspect-Oriented Programming](#chapter-13-aop--aspect-oriented-programming)
14. [Caching — @Cacheable, @CacheEvict, @CachePut](#chapter-14-caching)
15. [Spring Events — ApplicationEvent & @EventListener](#chapter-15-spring-events)
16. [Async Processing — @Async & @Scheduled](#chapter-16-async-processing)
17. [Spring Boot Microservices Essentials](#chapter-17-microservices-essentials)
18. [Database Migrations — Flyway & Liquibase](#chapter-18-database-migrations)
19. [Logging — SLF4J, Logback, MDC](#chapter-19-logging)
20. [Java 8+ Features Used in Spring Boot](#chapter-20-java-8-features-used-in-spring-boot)
21. [Design Patterns in Spring Boot](#chapter-21-design-patterns-in-spring-boot)
22. [Common Pitfalls & Gotchas](#chapter-22-common-pitfalls--gotchas)
23. [Quick Reference Cheatsheet](#chapter-23-quick-reference-cheatsheet)

---

# Chapter 1: Spring Boot Overview & Auto-Configuration

Spring Boot is an **opinionated framework** built on top of the Spring Framework. It eliminates boilerplate configuration by providing:

- **Auto-configuration** — inspects your classpath and registers beans automatically
- **Starter dependencies** — `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, etc.
- **Embedded server** — no WAR deployment needed; runs as a plain Java process
- **Actuator** — production-ready metrics and health endpoints out of the box

---

## @SpringBootApplication — The Trinity Annotation

This single annotation is actually a combination of **three** annotations:

```java
@SpringBootApplication
// is equivalent to:
@Configuration          // Marks class as a source of bean definitions
@EnableAutoConfiguration // Enables Spring Boot's auto-config mechanism
@ComponentScan          // Scans current package and sub-packages for components
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

> **How Auto-Configuration Works:**
> `@EnableAutoConfiguration` reads `META-INF/spring.factories` (Spring Boot 2.x) or `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3.x) and conditionally registers beans using `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`, etc.

---

# Chapter 2: Beans — Creation, Lifecycle, Annotations

A **Spring Bean** is a Java object instantiated, assembled, and managed by the Spring IoC (Inversion of Control) Container. The container is responsible for the **complete lifecycle** of a bean.

---

## 2.1 IoC Container

Spring has two container types:

| Container | Description |
|---|---|
| `BeanFactory` | Basic IoC. Lazy initialization. Lightweight. |
| `ApplicationContext` | Extension of BeanFactory. Supports i18n, events, eager init. **Used in Spring Boot.** |

---

## 2.2 Ways to Create / Register Beans

### 2.2.1 @Component and Stereotype Annotations

`@Component` is the generic stereotype. Spring provides specialized variants:

```java
// Generic component — use for utilities, helpers
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email != null && email.contains("@");
    }
}

// Service layer — business logic
@Service
public class UserService {
    public User findById(Long id) { return new User(); }
}

// Persistence layer — DAO/Repository
// Also adds SQL → Spring DataAccessException translation
@Repository
public class UserRepository {
    // ...
}

// Presentation layer — handles HTTP
@RestController
@RequestMapping("/api/users")
public class UserController {
    // ...
}
```

> **Note:** All four (`@Component`, `@Service`, `@Repository`, `@Controller`) are functionally equivalent for bean registration. The difference is **semantic** — they communicate the role of the class, and Spring applies layer-specific behavior (e.g., `@Repository` adds exception translation).

---

### 2.2.2 @Configuration + @Bean

Use `@Configuration` classes when:
- You need to wire **third-party classes** (you can't annotate their source)
- You need **complex construction logic** or builder patterns
- You need **multiple instances** of the same type

```java
@Configuration
public class AppConfig {

    // Method name = bean name (unless you specify name attribute)
    // Return type = bean type
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.registerModule(new JavaTimeModule());
        return mapper; // Spring manages this object
    }

    @Bean(name = "primaryDataSource")
    @Primary // preferred when multiple beans of same type exist
    public DataSource primaryDataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://localhost:5432/mydb");
        ds.setUsername("postgres");
        ds.setPassword("secret");
        return ds;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

---

### 2.2.3 @Bean vs @Component — When to Use Which

| Criteria | `@Component` | `@Bean` in `@Configuration` |
|---|---|---|
| Own class? | ✅ Annotate the class directly | Not needed (verbose) |
| Third-party class? | ❌ Cannot modify source | ✅ Wrap in `@Bean` method |
| Complex init logic? | Use `@PostConstruct` | ✅ Builder pattern in method |
| Multiple instances of same type? | Harder | ✅ Multiple `@Bean` methods |

---

## 2.3 Bean Lifecycle — Step by Step

This is a **critical topic**. Know the exact sequence:

```
1.  Spring reads bean definitions (@Component scan or @Bean methods)
2.  BeanDefinition objects registered in BeanDefinitionRegistry
3.  BeanFactoryPostProcessor runs (resolves @Value placeholders)
4.  Bean instantiation via constructor  ← Constructor called
5.  Dependency injection (setter / field)
6.  BeanNameAware.setBeanName() (if implemented)
7.  BeanFactoryAware.setBeanFactory() (if implemented)
8.  ApplicationContextAware.setApplicationContext() (if implemented)
9.  BeanPostProcessor.postProcessBeforeInitialization()
10. @PostConstruct method called  ← Most common hook
11. InitializingBean.afterPropertiesSet()
12. Custom init method (@Bean(initMethod="..."))
13. BeanPostProcessor.postProcessAfterInitialization()  ← Bean is READY
14. Bean used by the application
    --- ON SHUTDOWN ---
15. @PreDestroy called
16. DisposableBean.destroy()
17. Custom destroy method (@Bean(destroyMethod="..."))
```

```java
@Component
public class DatabaseConnectionPool implements InitializingBean, DisposableBean {

    @Value("${db.pool.size:10}")
    private int poolSize;

    // Step 4: Constructor called by Spring
    public DatabaseConnectionPool() {
        System.out.println("1. Constructor called");
    }

    // Step 10: Runs AFTER @Autowired injection is complete
    @PostConstruct
    public void init() {
        System.out.println("2. @PostConstruct - validating poolSize=" + poolSize);
        // Use for: validate config, open connections, warm-up cache
        if (poolSize <= 0) throw new IllegalArgumentException("Pool size must be positive");
    }

    // Step 11: from InitializingBean interface
    @Override
    public void afterPropertiesSet() {
        System.out.println("3. afterPropertiesSet - InitializingBean");
    }

    // Step 15: called on application shutdown
    @PreDestroy
    public void cleanUp() {
        System.out.println("4. @PreDestroy - closing connections");
    }

    // Step 16: from DisposableBean interface
    @Override
    public void destroy() {
        System.out.println("5. destroy - DisposableBean");
    }
}
```

> **Tip:** `@PostConstruct` is the most commonly used hook in practice. Use it for: validating config, initializing caches, opening connections. `@PreDestroy` for cleanup: closing connections, flushing buffers.

---

### Which Init/Destroy Hook to Use?

| Hook | Couples to Spring? | Use Case |
|---|---|---|
| `@PostConstruct` | No (JSR-250) | **Recommended** for your own classes |
| `afterPropertiesSet()` | Yes (Spring API) | Legacy, avoid |
| `@Bean(initMethod="...")` | No | **Recommended** for third-party beans |

---

### BeanPostProcessor — Intercepting ALL Beans

`BeanPostProcessor` intercepts **every** bean in the container. This is how Spring AOP works (it wraps beans in proxies here).

```java
@Component
public class LoggingBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        System.out.println("Before init: " + beanName);
        return bean; // MUST return the bean (or a wrapper/proxy)
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        System.out.println("After init: " + beanName);
        return bean;
    }
}
```

---

> **Q: What is the difference between `@PostConstruct`, `afterPropertiesSet`, and `init-method`?**
>
> All three are initialization hooks, called in this order:
> 1. `@PostConstruct` — annotation-based, no Spring coupling (JSR-250), **recommended**
> 2. `afterPropertiesSet()` — from `InitializingBean`, couples code to Spring API
> 3. `init-method` via `@Bean(initMethod="myInit")` — decoupled, best for third-party beans

---

# Chapter 3: Dependency Injection

Dependency Injection (DI) is the mechanism by which the Spring container **injects collaborating beans** into a bean, rather than the bean creating its own dependencies.

There are **three types**: Constructor Injection, Field Injection, and Setter Injection.

---

## 3.1 Constructor Injection (RECOMMENDED)

Dependencies are provided via the class constructor.

```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;
    private final PaymentGateway paymentGateway;

    // @Autowired is OPTIONAL since Spring 4.3 when there's only one constructor
    @Autowired
    public OrderService(OrderRepository orderRepository,
                        EmailService emailService,
                        PaymentGateway paymentGateway) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.paymentGateway = paymentGateway;
    }

    public Order placeOrder(OrderRequest request) {
        Order order = new Order(request);
        Order saved = orderRepository.save(order);
        emailService.sendConfirmation(order);
        paymentGateway.charge(order);
        return saved;
    }
}
```

### Why Constructor Injection is Best

| Reason | Explanation |
|---|---|
| **Immutability** | Fields can be `final` — the object cannot be modified after construction |
| **Mandatory dependencies** | Compiler forces you to provide all deps — no `NullPointerException` at runtime |
| **Testability** | Instantiate in unit tests without Spring by passing mocks to the constructor |
| **Detects circular deps early** | Spring throws `BeanCurrentlyInCreationException` at startup |
| **Visible design smell** | Too many constructor params → class has too many responsibilities |

```java
// Easy unit testing with constructor injection — no Spring context needed!
class OrderServiceTest {
    @Test
    void placeOrder_shouldSaveAndSendEmail() {
        OrderRepository mockRepo = mock(OrderRepository.class);
        EmailService mockEmail = mock(EmailService.class);
        PaymentGateway mockPayment = mock(PaymentGateway.class);

        // Direct instantiation — no Spring required
        OrderService service = new OrderService(mockRepo, mockEmail, mockPayment);

        when(mockRepo.save(any())).thenReturn(new Order());
        service.placeOrder(new OrderRequest("item1", 2));

        verify(mockEmail, times(1)).sendConfirmation(any());
    }
}
```

---

## 3.2 Field Injection (DISCOURAGED)

Spring injects the dependency directly into the field via reflection.

```java
@Service
public class ProductService {

    @Autowired  // Spring uses reflection — bypasses constructor
    private ProductRepository productRepository;

    @Autowired
    private CacheManager cacheManager;

    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }
}
```

> **Why it's discouraged:**
> - Fields cannot be `final` — object is mutable
> - Dependencies are hidden — you can't tell from the outside
> - Testing is harder — need Spring context or reflection hacks
> - Circular dependencies discovered at runtime, not startup

---

## 3.3 Setter Injection

Spring calls the setter method after construction. Useful for **optional dependencies**.

```java
@Service
public class NotificationService {

    private SmsProvider smsProvider;
    private EmailProvider emailProvider;

    @Autowired
    public void setSmsProvider(SmsProvider smsProvider) {
        this.smsProvider = smsProvider;
    }

    @Autowired(required = false) // optional dependency
    public void setEmailProvider(EmailProvider emailProvider) {
        this.emailProvider = emailProvider;
    }
}
```

---

## 3.4 Resolving Ambiguity: @Qualifier & @Primary

When multiple beans of the same type exist, Spring doesn't know which to inject.

```java
// Two implementations of the same interface
@Component("mysqlUserRepo")
public class MySQLUserRepository implements UserRepository { ... }

@Component("mongoUserRepo")
@Primary  // Used by default when no @Qualifier specified
public class MongoUserRepository implements UserRepository { ... }

// Injection
@Service
public class UserService {
    private final UserRepository primary;
    private final UserRepository mysql;

    @Autowired
    public UserService(
        UserRepository primary,                      // gets MongoUserRepository (@Primary)
        @Qualifier("mysqlUserRepo") UserRepository mysql  // explicit selection
    ) {
        this.primary = primary;
        this.mysql = mysql;
    }
}
```

---

## 3.5 @Value — Injecting Configuration Properties

```java
@Service
public class PaymentService {

    @Value("${payment.gateway.url}")
    private String gatewayUrl;

    @Value("${payment.timeout.seconds:30}")  // default value = 30
    private int timeoutSeconds;

    @Value("${payment.supported.currencies:USD,EUR,GBP}")
    private List<String> supportedCurrencies;

    // SpEL (Spring Expression Language)
    @Value("#{systemProperties['java.home']}")
    private String javaHome;

    @Value("#{T(java.lang.Math).PI}")
    private double pi;

    // Inject another bean's property via SpEL
    @Value("#{orderService.maxRetries}")
    private int maxRetries;
}
```

---

> **Q: What is the difference between `@Autowired`, `@Inject`, and `@Resource`?**
>
> - `@Autowired` (Spring): Injects by **type** first, then by **name**. Spring-specific.
> - `@Inject` (JSR-330): Same as `@Autowired` but from Java standard. Use `@Named` instead of `@Qualifier`. Portable.
> - `@Resource` (JSR-250): Injects by **name** first, then by **type**. Has `name` attribute. EJB-style.
>
> In practice: use `@Autowired` in Spring projects.

---

# Chapter 4: Bean Scopes

Bean scope defines how many instances the Spring container creates and how long they live.

| Scope | Annotation | Instances | Lifecycle |
|---|---|---|---|
| **singleton** | `@Scope("singleton")` | **ONE** per container | Application lifetime |
| **prototype** | `@Scope("prototype")` | **NEW** per injection | Caller manages |
| **request** | `@RequestScope` | ONE per HTTP request | HTTP request lifetime |
| **session** | `@SessionScope` | ONE per HTTP session | HTTP session lifetime |
| **application** | `@ApplicationScope` | ONE per ServletContext | App lifetime |
| **websocket** | `@Scope("websocket")` | ONE per WebSocket | WebSocket session |

---

## 4.1 Singleton Scope (DEFAULT)

The container creates **exactly one shared instance**. Every injection of that type returns the same object reference.

```java
// Default scope — @Scope("singleton") is implicit on all @Component/@Service etc.
@Service
public class ProductCatalogService {
    // This single instance is shared by ALL components that inject it
    // MUST be THREAD-SAFE if it holds mutable state

    private final Map<Long, Product> cache = new ConcurrentHashMap<>();

    public Product getProduct(Long id) {
        return cache.computeIfAbsent(id, this::loadFromDb);
    }
}
```

> ⚠️ **Singleton ≠ Singleton Design Pattern.** Spring singleton is **per-container**, not per-JVM. You can have multiple containers with different instances. Also, singleton beans must be **thread-safe** since they are shared across threads.

---

## 4.2 Prototype Scope

Spring creates a **NEW instance** every time the bean is requested. Spring does **NOT** manage the destruction of prototype beans.

```java
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) // new instance each time
public class ReportGenerator {
    // Stateful — each report needs its own instance
    private final List<String> reportLines = new ArrayList<>();
    private LocalDateTime startTime;

    @PostConstruct
    public void start() { this.startTime = LocalDateTime.now(); }

    public void addLine(String line) { reportLines.add(line); }
    public String generate() { return String.join("\n", reportLines); }
}
```

### ⚠️ Classic Mistake: Prototype inside Singleton

```java
// ❌ WRONG — Spring injects ONCE at startup
// You always get the SAME prototype instance!
@Service  // singleton
public class BadReportService {

    @Autowired
    private ReportGenerator generator; // injected ONCE — defeats prototype purpose!

    public String createReport(String type) {
        generator.addLine("Type: " + type);
        return generator.generate();
        // generator is the SAME object every call — state accumulates!
    }
}
```

### ✅ Fix 1: ApplicationContext.getBean()

```java
@Service
public class ReportService {

    @Autowired
    private ApplicationContext context;

    public String createReport(String type) {
        // Gets a NEW prototype instance each call
        ReportGenerator generator = context.getBean(ReportGenerator.class);
        generator.addLine("Type: " + type);
        return generator.generate();
    }
}
```

### ✅ Fix 2: @Lookup (Cleanest Approach)

```java
@Service
public abstract class ReportService {

    // Spring overrides this method via CGLIB proxy
    // Returns a NEW ReportGenerator on every call
    @Lookup
    public abstract ReportGenerator createReportGenerator();

    public String generateReport(String type) {
        ReportGenerator gen = createReportGenerator(); // new instance each time!
        gen.addLine("Type: " + type);
        return gen.generate();
    }
}
```

### ✅ Fix 3: ObjectFactory (Lazy supplier)

```java
@Service
public class ReportService {

    @Autowired
    private ObjectFactory<ReportGenerator> reportGeneratorFactory;

    public String createReport(String type) {
        ReportGenerator gen = reportGeneratorFactory.getObject(); // new instance
        gen.addLine("Type: " + type);
        return gen.generate();
    }
}
```

---

## 4.3 @RequestScope — One Instance Per HTTP Request

```java
@Component
@RequestScope  // = @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestContext {
    private String correlationId;
    private String userIp;
    private long requestStartTime = System.currentTimeMillis();

    // getters and setters...
}

// Inject into a singleton service — Spring injects a SCOPED PROXY
@Service
public class AuditService {

    @Autowired
    private RequestContext requestContext; // Spring injects a PROXY here

    // The proxy delegates to the actual per-request bean when called
    public void log(String event) {
        String id = requestContext.getCorrelationId(); // resolves to current request's instance
        System.out.println("[" + id + "] " + event);
    }
}
```

> **How Scoped Proxy Works:** Spring injects a proxy object (via CGLIB). When you call a method on the proxy, it looks up the actual request-scoped bean from the current HTTP request context and delegates to it.

---

## 4.4 @SessionScope — One Instance Per HTTP Session

```java
@Component
@SessionScope
public class ShoppingCart implements Serializable {
    private final List<CartItem> items = new ArrayList<>();
    private String userId;

    public void addItem(CartItem item) { items.add(item); }
    public void removeItem(Long productId) {
        items.removeIf(i -> i.getProductId().equals(productId));
    }
    public List<CartItem> getItems() { return Collections.unmodifiableList(items); }
    public BigDecimal getTotal() {
        return items.stream()
            .map(CartItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private ShoppingCart cart; // proxy — each HTTP session gets their own cart

    @PostMapping("/add")
    public ResponseEntity<Void> addItem(@RequestBody CartItemRequest request) {
        cart.addItem(new CartItem(request));
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cart.getItems());
    }
}
```

---

# Chapter 5: @Profile — Environment-Based Bean Activation

`@Profile` allows you to register beans **conditionally based on the active Spring profile**. This is the correct way to handle environment-specific configuration (dev, staging, prod).

```java
// ─── Interface ───────────────────────────────────────────────────
public interface NotificationSender {
    void send(String message, String recipient);
}

// ─── Dev profile: logs to console only ──────────────────────────
@Component
@Profile("dev")  // Only active when spring.profiles.active=dev
public class MockNotificationSender implements NotificationSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("[DEV] Mock email to " + recipient + ": " + message);
    }
}

// ─── Production profile: real SMTP ──────────────────────────────
@Component
@Profile("prod")
public class SmtpNotificationSender implements NotificationSender {
    @Autowired private JavaMailSender mailSender;

    @Override
    public void send(String message, String recipient) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(recipient);
        mail.setText(message);
        mailSender.send(mail);
    }
}

// ─── @Configuration with @Profile ────────────────────────────────
@Configuration
@Profile({"staging", "prod"})  // active for EITHER staging OR prod
public class CloudStorageConfig {
    @Bean
    public StorageClient storageClient() {
        return new S3StorageClient();
    }
}

@Configuration
@Profile("!prod")  // active for everything EXCEPT prod
public class H2DatabaseConfig {
    @Bean
    public DataSource h2DataSource() {
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).build();
    }
}
```

### Activating Profiles

```properties
# 1. application.properties
spring.profiles.active=dev

# 2. Command line
java -jar app.jar --spring.profiles.active=prod

# 3. Environment variable
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
```

```java
// 4. In tests
@SpringBootTest
@ActiveProfiles("test")
class MyTest { }

// 5. Programmatically
SpringApplication app = new SpringApplication(MyApp.class);
app.setAdditionalProfiles("dev");
app.run(args);
```

---

> **Q: Difference between `@Profile` and `@Conditional`?**
>
> `@Profile` is actually a **specialization of `@Conditional`**. `@Profile("prod")` is implemented using `@Conditional(ProfileCondition.class)`.
>
> `@Conditional` is the general-purpose mechanism — implement the `Condition` interface for any custom logic.
>
> Common built-in conditionals: `@ConditionalOnProperty`, `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnWebApplication`.
>
> **Use `@Profile` for environment toggling. Use `@Conditional` for feature flags, class presence checks, etc.**

---

# Chapter 6: Exception Handling

In a REST API, you want **consistent, structured error responses**. Spring provides this through `@ControllerAdvice` and `@ExceptionHandler`.

---

## 6.1 Custom Exception Classes

```java
// ─── Base Application Exception ──────────────────────────────────
public class AppException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public AppException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    // getters...
}

// ─── Specific Exceptions ──────────────────────────────────────────
public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id,
              HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}

public class DuplicateEmailException extends AppException {
    public DuplicateEmailException(String email) {
        super("Email already registered: " + email,
              HttpStatus.CONFLICT, "DUPLICATE_EMAIL");
    }
}

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
    }
}
```

---

## 6.2 Standard Error Response DTO

```java
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // don't serialize null fields
public class ApiErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String errorCode;
    private String message;
    private String path;
    private Map<String, String> fieldErrors; // for validation errors
}

// Example JSON response:
// {
//   "timestamp": "2024-01-15T10:30:00",
//   "status": 404,
//   "error": "Not Found",
//   "errorCode": "RESOURCE_NOT_FOUND",
//   "message": "User not found with id: 42",
//   "path": "/api/users/42"
// }
```

---

## 6.3 @ControllerAdvice — Global Exception Handler

`@ControllerAdvice` is a specialization of `@Component` that intercepts exceptions thrown by **any** `@Controller`/`@RestController` across the **entire application**.

```java
@RestControllerAdvice  // = @ControllerAdvice + @ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    @Autowired
    private HttpServletRequest request;

    // ─── Handle our custom application exceptions ─────────────────
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiErrorResponse> handleAppException(AppException ex) {
        ApiErrorResponse error = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(ex.getStatus().value())
            .error(ex.getStatus().getReasonPhrase())
            .errorCode(ex.getErrorCode())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();
        return ResponseEntity.status(ex.getStatus()).body(error);
    }

    // ─── Handle Bean Validation (@Valid) failures ─────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));

        ApiErrorResponse error = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .errorCode("VALIDATION_ERROR")
            .message("Request validation failed")
            .fieldErrors(fieldErrors)
            .path(request.getRequestURI())
            .build();
        return ResponseEntity.badRequest().body(error);
    }

    // ─── Handle path variable type mismatch ───────────────────────
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        String msg = String.format("Parameter '%s' should be of type '%s'",
            ex.getName(), ex.getRequiredType().getSimpleName());
        ApiErrorResponse error = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Type Mismatch")
            .errorCode("INVALID_PARAMETER")
            .message(msg)
            .build();
        return ResponseEntity.badRequest().body(error);
    }

    // ─── Handle HTTP method not allowed ──────────────────────────
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException ex) {
        ApiErrorResponse error = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.METHOD_NOT_ALLOWED.value())
            .error("Method Not Allowed")
            .errorCode("METHOD_NOT_ALLOWED")
            .message(ex.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(error);
    }

    // ─── Catch-all handler — ALWAYS include this! ─────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        // Log full stack trace internally but NEVER expose it to clients
        log.error("Unexpected error", ex);
        ApiErrorResponse error = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .errorCode("INTERNAL_ERROR")
            .message("An unexpected error occurred. Please try again later.")
            .build();
        return ResponseEntity.internalServerError().body(error);
    }
}
```

---

## 6.4 Local @ExceptionHandler (Controller-Specific)

You can also define `@ExceptionHandler` **inside** a specific controller. It takes **precedence over the global handler** for exceptions thrown in that controller.

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    // This handler applies ONLY to exceptions from THIS controller
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleUserNotFound(UserNotFoundException ex) {
        return ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(404)
            .message(ex.getMessage())
            .build();
    }
}
```

---

## 6.5 @ControllerAdvice Scoping

```java
// Handle exceptions only for specific packages
@ControllerAdvice(basePackages = "com.myapp.api.v1")
public class V1ExceptionHandler { ... }

// Handle for specific controller classes
@ControllerAdvice(assignableTypes = {UserController.class, OrderController.class})
public class UserOrderExceptionHandler { ... }

// Handle for controllers with specific annotation
@ControllerAdvice(annotations = RestController.class)
public class RestExceptionHandler { ... }
```

---

> **Q: Difference between `@ControllerAdvice` and `@RestControllerAdvice`?**
>
> `@RestControllerAdvice` = `@ControllerAdvice` + `@ResponseBody`
>
> - `@ControllerAdvice` — handler methods return **view names** by default (MVC apps with Thymeleaf/JSP)
> - `@RestControllerAdvice` — handler methods **serialize return values to JSON/XML** automatically
>
> In a Spring Boot REST application, **always use `@RestControllerAdvice`**.

---

# Chapter 7: Spring Data JPA

Spring Data JPA abstracts the persistence layer by providing **repository interfaces**. You declare what you want; Spring generates the implementation at runtime using Hibernate as the JPA provider.

---

## 7.1 Setup & Entity

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update     # create / create-drop / validate / none
spring.jpa.show-sql=true                  # print SQL to console (dev only!)
spring.jpa.properties.hibernate.format_sql=true
```

```java
@Entity
@Table(name = "users",
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB auto-increment
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING) // stores "ACTIVE" not ordinal 0/1
    private UserStatus status = UserStatus.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
               fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
}

@Entity
@Table(name = "orders")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();
}
```

---

## 7.2 Repository Hierarchy

| Interface | Methods Added | Use Case |
|---|---|---|
| `Repository<T,ID>` | None (marker) | Custom repos only |
| `CrudRepository<T,ID>` | save, findById, findAll, delete, count | Basic CRUD |
| `PagingAndSortingRepository<T,ID>` | findAll(Pageable), findAll(Sort) | + Pagination |
| `JpaRepository<T,ID>` | flush, saveAllAndFlush, deleteAllInBatch | **Most used** |

```java
// Extend JpaRepository — most feature-rich, most commonly used
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring generates the implementation at runtime via JDK proxies
}
```

---

## 7.3 Inbuilt / Derived Query Methods

Spring Data JPA parses the **method name** and generates JPQL automatically. This is called **query derivation**.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // ─── Find By ──────────────────────────────────────────────────
    Optional<User> findByEmail(String email);
    // SELECT u FROM User u WHERE u.email = ?1

    List<User> findByStatus(UserStatus status);
    // SELECT u FROM User u WHERE u.status = ?1

    List<User> findByNameContainingIgnoreCase(String keyword);
    // SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER('%keyword%')

    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    // SELECT u FROM User u WHERE u.createdAt BETWEEN ?1 AND ?2

    List<User> findByStatusAndCreatedAtAfter(UserStatus status, LocalDateTime date);
    // WHERE u.status = ?1 AND u.createdAt > ?2

    List<User> findByEmailEndingWith(String domain);
    // WHERE u.email LIKE '%domain'

    // ─── Count / Exists ───────────────────────────────────────────
    long countByStatus(UserStatus status);
    boolean existsByEmail(String email);

    // ─── Delete By ────────────────────────────────────────────────
    @Transactional
    long deleteByStatus(UserStatus status);

    // ─── Limit / Top ──────────────────────────────────────────────
    List<User> findTop5ByOrderByCreatedAtDesc();
    Optional<User> findFirstByStatusOrderByCreatedAtAsc(UserStatus status);

    // ─── Nested Property (underscore for disambiguation) ──────────
    List<User> findByOrders_TotalAmountGreaterThan(BigDecimal amount);
    // JOIN orders WHERE orders.totalAmount > ?1

    // ─── IN clause ────────────────────────────────────────────────
    List<User> findByStatusIn(List<UserStatus> statuses);
    // WHERE u.status IN (?1)

    // ─── Sorting via parameter ────────────────────────────────────
    List<User> findByStatus(UserStatus status, Sort sort);
}
```

### Derived Query Keyword Reference

| Keyword | Example | SQL Generated |
|---|---|---|
| `And` | `findByNameAndEmail` | `WHERE name=?1 AND email=?2` |
| `Or` | `findByNameOrEmail` | `WHERE name=?1 OR email=?2` |
| `Between` | `findByAgeBetween` | `WHERE age BETWEEN ?1 AND ?2` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?1` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?1` |
| `Like` | `findByNameLike` | `WHERE name LIKE ?1` (you add %) |
| `Containing` | `findByNameContaining` | `WHERE name LIKE '%?1%'` |
| `StartingWith` | `findByNameStartingWith` | `WHERE name LIKE '?1%'` |
| `EndingWith` | `findByNameEndingWith` | `WHERE name LIKE '%?1'` |
| `IgnoreCase` | `findByEmailIgnoreCase` | `WHERE UPPER(email) = UPPER(?1)` |
| `In` | `findByStatusIn` | `WHERE status IN (?1)` |
| `IsNull` | `findByDeletedAtIsNull` | `WHERE deletedAt IS NULL` |
| `IsNotNull` | `findByEmailIsNotNull` | `WHERE email IS NOT NULL` |
| `Not` | `findByStatusNot` | `WHERE status <> ?1` |
| `OrderBy` | `findByStatusOrderByNameAsc` | `ORDER BY name ASC` |

---

## 7.4 @Query — Custom JPQL and Native SQL

Use `@Query` when derived method names become too complex or the query is beyond what derivation supports.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // ─── JPQL (uses entity/field names, NOT table/column names) ───
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.status = :status")
    Optional<User> findByEmailAndStatus(
        @Param("email") String email,
        @Param("status") UserStatus status
    );

    // ─── Positional parameters ─────────────────────────────────────
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1% AND u.status = ?2")
    List<User> searchByNameAndStatus(String name, UserStatus status);

    // ─── JPQL with JOIN FETCH ──────────────────────────────────────
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders o " +
           "WHERE u.status = :status")
    List<User> findActiveUsersWithOrders(@Param("status") UserStatus status);

    // ─── Native SQL ────────────────────────────────────────────────
    @Query(value = "SELECT * FROM users WHERE YEAR(created_at) = :year",
           nativeQuery = true)
    List<User> findUsersRegisteredInYear(@Param("year") int year);

    // ─── Projection using interface ────────────────────────────────
    @Query("SELECT u.id as id, u.name as name, u.email as email FROM User u")
    List<UserSummary> findAllSummaries();

    // ─── Modifying query (UPDATE / DELETE) ────────────────────────
    @Modifying  // REQUIRED for UPDATE/DELETE
    @Transactional
    @Query("UPDATE User u SET u.status = :newStatus WHERE u.status = :oldStatus")
    int updateStatusBulk(
        @Param("oldStatus") UserStatus oldStatus,
        @Param("newStatus") UserStatus newStatus
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.createdAt < :cutoff AND u.status = 'INACTIVE'")
    int deleteInactiveUsersBefore(@Param("cutoff") LocalDateTime cutoff);

    // ─── @Query with Pageable ─────────────────────────────────────
    @Query(value = "SELECT u FROM User u WHERE u.status = :status",
           countQuery = "SELECT COUNT(u) FROM User u WHERE u.status = :status")
    Page<User> findByStatusPaged(@Param("status") UserStatus status, Pageable pageable);
}

// ─── Projection Interface ─────────────────────────────────────────
public interface UserSummary {
    Long getId();
    String getName();
    String getEmail();
}
```

---

## 7.5 Pagination & Sorting

Spring Data JPA provides first-class support via the `Pageable` interface.

```java
// ─── Repository ───────────────────────────────────────────────────
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    // Slice<T> = lighter than Page<T> (no COUNT query — good for infinite scroll)
    Slice<User> findByNameContaining(String keyword, Pageable pageable);
}

// ─── Service ──────────────────────────────────────────────────────
@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    public Page<User> getActiveUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findByStatus(UserStatus.ACTIVE, pageable);
    }

    public Page<User> getUsersMultiSort(int page, int size) {
        // Multiple sort columns
        Sort sort = Sort.by(
            Sort.Order.desc("createdAt"),
            Sort.Order.asc("name")
        );
        return userRepository.findAll(PageRequest.of(page, size, sort));
    }
}

// ─── Controller ───────────────────────────────────────────────────
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;

    // GET /api/users?page=0&size=10&sortBy=createdAt&direction=desc
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Page<User> pageResult = userService.getActiveUsers(page, size, sortBy, direction);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("pageSize", pageResult.getSize());
        response.put("isFirst", pageResult.isFirst());
        response.put("isLast", pageResult.isLast());
        response.put("hasNext", pageResult.hasNext());
        response.put("hasPrevious", pageResult.hasPrevious());

        return ResponseEntity.ok(response);
    }

    // Use @PageableDefault for clean controller methods
    @GetMapping("/search")
    public Page<User> search(
        @RequestParam String name,
        @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC)
        Pageable pageable) {
        return userRepository.findByNameContainingIgnoreCase(name, pageable);
    }
}
```

> **`Page<T>` vs `Slice<T>`:** `Page<T>` executes an additional `COUNT` query to get total pages/elements. `Slice<T>` only fetches the current page and knows if there's a `hasNext()` — more efficient for infinite scroll.

---

## 7.6 Criteria API vs Specification

Both are used for building **dynamic, programmatic queries**. The Specification pattern wraps the Criteria API in a cleaner, composable way.

### Criteria API — Direct (Verbose)

```java
@Repository
public class UserCriteriaRepository {

    @PersistenceContext
    private EntityManager em;

    public List<User> searchUsers(String name, UserStatus status, LocalDateTime from) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> root = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        if (name != null && !name.isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("name")),
                           "%" + name.toLowerCase() + "%"));
        }
        if (status != null) {
            predicates.add(cb.equal(root.get("status"), status));
        }
        if (from != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));
        query.orderBy(cb.desc(root.get("createdAt")));

        return em.createQuery(query).getResultList();
    }
}
```

### Specification Pattern — Clean & Composable ✅

The **Specification** pattern (from Eric Evans' DDD) encapsulates a single query predicate. Spring Data JPA's `Specification<T>` interface lets you combine them with `.and()` / `.or()` / `.not()`.

```java
// ─── Step 1: Repository must extend JpaSpecificationExecutor ──────
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> { }

// ─── Step 2: Specification factory class ─────────────────────────
public class UserSpecifications {

    public static Specification<User> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) return null; // null = no filter
            return cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, cb) -> {
            if (date == null) return null;
            return cb.greaterThanOrEqualTo(root.get("createdAt"), date);
        };
    }

    public static Specification<User> hasEmailDomain(String domain) {
        return (root, query, cb) -> {
            if (domain == null) return null;
            return cb.like(root.get("email"), "%@" + domain);
        };
    }

    public static Specification<User> hasOrdersAbove(BigDecimal amount) {
        return (root, query, cb) -> {
            if (amount == null) return null;
            Join<User, Order> orders = root.join("orders", JoinType.LEFT);
            query.distinct(true); // avoid duplicate users from JOIN
            return cb.greaterThan(orders.get("totalAmount"), amount);
        };
    }
}

// ─── Step 3: Service — compose Specifications freely ──────────────
@Service
public class UserSearchService {

    @Autowired private UserRepository userRepository;

    public Page<User> search(UserSearchRequest req, Pageable pageable) {
        Specification<User> spec = Specification
            .where(UserSpecifications.hasName(req.getName()))
            .and(UserSpecifications.hasStatus(req.getStatus()))
            .and(UserSpecifications.createdAfter(req.getCreatedAfter()))
            .and(UserSpecifications.hasEmailDomain(req.getEmailDomain()));

        return userRepository.findAll(spec, pageable);
    }

    // Compose with OR: premium users with big orders OR all admins
    public List<User> findPremiumOrAdmins() {
        Specification<User> premiumWithOrders =
            UserSpecifications.hasStatus(UserStatus.PREMIUM)
            .and(UserSpecifications.hasOrdersAbove(new BigDecimal("1000")));

        Specification<User> admins =
            UserSpecifications.hasStatus(UserStatus.ADMIN);

        return userRepository.findAll(premiumWithOrders.or(admins));
    }
}
```

### Criteria API vs Specification — Comparison

| Criteria API | Specification |
|---|---|
| Direct `EntityManager` usage | Uses Criteria API internally |
| Verbose, hard to reuse | Composable with `.and()` `.or()` `.not()` |
| No Spring Data integration | Works with `JpaSpecificationExecutor` |
| Good for very complex queries | Better for dynamic search filters |
| No predicate reuse across queries | Write once, combine anywhere |

---

## 7.7 The N+1 Query Problem ⚠️ (Critical Topic)

The N+1 problem occurs when fetching N entities triggers **N additional queries** to load a related lazy collection — resulting in `1 + N` database round trips instead of just `1`.

### Reproducing the Problem

```java
// Entity: User has List<Order> (LAZY fetch — default)

@Service
public class BadReportService {
    public void printAllUserOrders() {
        List<User> users = userRepository.findAll();
        // QUERY 1: SELECT * FROM users  → gets 100 users

        for (User user : users) {
            // QUERY 2 to 101: SELECT * FROM orders WHERE user_id = ?
            // Triggered each time you access the LAZY collection
            int orderCount = user.getOrders().size(); // ← 100 extra queries!
            System.out.println(user.getName() + " has " + orderCount + " orders");
        }
        // Total: 1 + 100 = 101 database queries for 100 users!
    }
}
```

### Solution 1: JOIN FETCH in JPQL ✅

```java
// Loads User + Orders in a SINGLE JOIN query
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders")
List<User> findAllWithOrders();

// With condition
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders o " +
       "WHERE u.status = :status")
List<User> findActiveUsersWithOrders(@Param("status") UserStatus status);

// IMPORTANT: Always use DISTINCT to prevent duplicate User rows from the JOIN
```

### Solution 2: @EntityGraph ✅

```java
// Define the graph on the entity class
@Entity
@NamedEntityGraph(
    name = "User.withOrders",
    attributeNodes = { @NamedAttributeNode("orders") }
)
public class User { ... }

// Use in repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"orders"})  // inline definition
    List<User> findByStatus(UserStatus status);

    @EntityGraph(value = "User.withOrders")    // named graph
    Optional<User> findWithOrdersById(Long id);

    // Deep graph: User → Orders → OrderItems
    @EntityGraph(attributePaths = {"orders", "orders.items"})
    List<User> findAllWithOrdersAndItems();
}
```

### Solution 3: Hibernate @BatchSize ✅

```java
// Instead of 100 individual queries, Hibernate batches them:
// SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 20)

@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
@BatchSize(size = 20)  // 100 users → ceil(100/20) = 5 queries
private List<Order> orders;

// Or set globally in application.properties:
// spring.jpa.properties.hibernate.default_batch_fetch_size=20
```

### Solution 4: DTO Projection with Constructor Expression ✅

```java
// Select only what you need — avoid loading entire entity graph
@Query("SELECT new com.app.dto.UserOrderSummary(u.id, u.name, COUNT(o)) " +
       "FROM User u LEFT JOIN u.orders o " +
       "GROUP BY u.id, u.name")
List<UserOrderSummary> findUserOrderSummaries();

@Value  // Lombok immutable DTO
public class UserOrderSummary {
    private final Long userId;
    private final String userName;
    private final Long orderCount;
}
```

### Solution 5: Understand FetchType Defaults

```java
// FetchType defaults (know these!):
// @OneToMany  → LAZY  (default) ← most N+1 sources come from here
// @ManyToOne  → EAGER (default) ← can also cause N+1 if in a list
// @ManyToMany → LAZY  (default)
// @OneToOne   → EAGER (default)

// ✅ Best practice: Keep everything LAZY
// Use JOIN FETCH or @EntityGraph per use-case when you need relations
```

### Detecting N+1 in Practice

```properties
# Enable SQL logging
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG

# Enable Hibernate statistics (shows query count)
spring.jpa.properties.hibernate.generate_statistics=true
logging.level.org.hibernate.stat=DEBUG
```

---

> **Q: How do you solve the N+1 problem?**
>
> 1. **Detect** it: enable `spring.jpa.show-sql=true` and count queries generated.
> 2. **For lists:** Use `JOIN FETCH` in `@Query`. Always add `DISTINCT` to avoid duplicate rows.
> 3. **For conditional eager loading:** Use `@EntityGraph` — cleaner, no JPQL needed.
> 4. **For bulk reads:** Use `@BatchSize` or `hibernate.default_batch_fetch_size`.
> 5. **For reports/aggregations:** Use DTO projections — fetch only what you need.
> 6. **Rule:** Keep `FetchType.LAZY` everywhere and only fetch eagerly per use-case. Never use `EAGER` globally for collections.

---

# Chapter 8: @Transactional

Spring's `@Transactional` is a declarative way to manage database transactions. When applied, Spring wraps the method in a **proxy** that opens a transaction before execution and commits or rolls back after.

---

## 8.1 Basic Usage

```java
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepo;
    @Autowired private InventoryRepository inventoryRepo;

    @Transactional  // Opens transaction. Commits on success. Rolls back on RuntimeException.
    public Order placeOrder(OrderRequest req) {
        // All operations share the SAME database transaction
        Order order = orderRepo.save(new Order(req));
        inventoryRepo.decrementStock(req.getProductId(), req.getQuantity());
        // If any exception is thrown here → BOTH operations are ROLLED BACK
        return order;
    }
}
```

---

## 8.2 @Transactional Attributes

```java
@Transactional(
    propagation = Propagation.REQUIRED,          // default
    isolation = Isolation.DEFAULT,                // default (DB's default isolation)
    readOnly = false,                            // default
    timeout = 30,                                // seconds, -1 = unlimited
    rollbackFor = { BusinessException.class },   // also rollback for checked exceptions
    noRollbackFor = { IgnorableException.class } // don't rollback for these
)
public void processPayment(PaymentRequest req) { ... }
```

---

## 8.3 Propagation Levels

| Propagation | Behavior |
|---|---|
| `REQUIRED` (default) | Join existing transaction OR create new one |
| `REQUIRES_NEW` | Always creates a NEW transaction. Suspends existing one |
| `SUPPORTS` | Join if exists, run without transaction if not |
| `NOT_SUPPORTED` | Always run without transaction. Suspends existing |
| `MANDATORY` | Must join existing transaction. Throws if none exists |
| `NEVER` | Must NOT run in transaction. Throws if one exists |
| `NESTED` | Execute in nested transaction (savepoint) within existing |

---

## 8.4 Common Pitfalls

### ⚠️ Pitfall 1: Self-Invocation Bypasses Proxy

```java
@Service
public class AuditService {

    @Transactional
    public void processData() {
        // ❌ This WON'T start a new transaction!
        // Calling @Transactional method within THE SAME CLASS bypasses the proxy
        this.saveAuditLog("processing");  // No new transaction!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveAuditLog(String event) {
        // This @Transactional is IGNORED when called via this.saveAuditLog()
    }
}

// ✅ Fix: Inject self with @Lazy to avoid circular dependency
@Service
public class DataService {

    @Autowired
    @Lazy
    private DataService self;

    @Transactional
    public void processData() {
        self.saveAuditLog("processing");  // Goes through proxy → works!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveAuditLog(String event) { ... }
}
```

### ⚠️ Pitfall 2: Only Works on Public Methods

`@Transactional` only works on `public` methods when called through the Spring proxy. Calling `private` or `protected` methods or calling from within the same class won't be intercepted.

### ⚠️ Pitfall 3: Only Rolls Back for RuntimeException by Default

```java
// ❌ Checked exceptions do NOT trigger rollback by default
@Transactional
public void riskyOperation() throws IOException {
    orderRepo.save(order);
    throw new IOException("disk full"); // ← transaction COMMITS despite exception!
}

// ✅ Fix
@Transactional(rollbackFor = IOException.class)
public void riskyOperation() throws IOException {
    orderRepo.save(order);
    throw new IOException("disk full"); // ← now rolls back
}
```

---

## 8.5 readOnly = true for Performance

```java
// @Transactional(readOnly = true) hints to Hibernate: skip dirty checking
// Benefits: no dirty checking, no flush, DB can route to read replica
@Transactional(readOnly = true)
public List<User> findAllUsers() {
    return userRepository.findAll();
}

@Transactional  // readOnly=false (default) for writes
public User createUser(CreateUserRequest req) {
    return userRepository.save(new User(req));
}
```

---

# Chapter 9: Building REST APIs

## 9.1 Complete REST Controller Pattern

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/v1/users?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(pageable));
    }

    // GET /api/v1/users/42
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // POST /api/v1/users
    @PostMapping
    public ResponseEntity<UserDTO> create(
            @Valid @RequestBody CreateUserRequest request) {
        UserDTO created = userService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created); // 201 Created with Location header
    }

    // PUT /api/v1/users/42
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    // PATCH /api/v1/users/42/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        userService.updateStatus(id, status);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // DELETE /api/v1/users/42
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
```

---

## 9.2 Bean Validation (@Valid)

```java
@Data
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$",
             message = "Password needs 8+ chars with uppercase, number, symbol")
    private String password;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18")
    @Max(value = 120)
    private Integer age;

    @Future(message = "Subscription end must be in the future")
    private LocalDate subscriptionEnd;

    @Valid          // Cascade validation to nested object
    @NotNull
    private AddressRequest address;
}
```

---

# Chapter 10: Spring Security & JWT

## 10.1 Security Filter Chain

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // enables @PreAuthorize, @PostAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable for REST APIs (stateless)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

## 10.2 JWT Authentication Filter

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // No JWT? Skip to next filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // strip "Bearer "
        final String userEmail = jwtService.extractUsername(jwt);

        // Only authenticate if user not already authenticated in SecurityContext
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

## 10.3 Method-Level Security

```java
@Service
public class DocumentService {

    // Only users with ADMIN role can access
    @PreAuthorize("hasRole('ADMIN')")
    public List<Document> getAllDocuments() { ... }

    // User can access only their own documents
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public Document getUserDocument(Long userId, Long docId) { ... }

    // Check after method execution
    @PostAuthorize("returnObject.owner == authentication.name")
    public Document getDocument(Long id) { ... }
}
```

---

# Chapter 11: Actuator & @ConfigurationProperties

## 11.1 Actuator Setup

```properties
# pom.xml
# spring-boot-starter-actuator dependency

# application.properties
management.endpoints.web.exposure.include=health,info,metrics,env,beans,mappings
management.endpoint.health.show-details=always
management.info.env.enabled=true

info.app.name=My App
info.app.version=1.0.0

# Available endpoints:
# /actuator/health     → UP/DOWN status, DB connectivity
# /actuator/info       → app info
# /actuator/metrics    → JVM metrics, HTTP request counts
# /actuator/env        → all environment properties
# /actuator/beans      → all Spring beans in context
# /actuator/mappings   → all @RequestMapping routes
# /actuator/loggers    → change log levels at runtime (POST)
```

---

## 11.2 Custom Health Indicator

```java
@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    @Autowired
    private ExternalApiClient apiClient;

    @Override
    public Health health() {
        try {
            boolean isUp = apiClient.ping();
            if (isUp) {
                return Health.up()
                    .withDetail("service", "external-api")
                    .withDetail("responseTime", "23ms")
                    .build();
            }
            return Health.down()
                .withDetail("service", "external-api")
                .withDetail("reason", "Ping returned false")
                .build();
        } catch (Exception e) {
            return Health.down(e)
                .withDetail("service", "external-api")
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}
```

---

## 11.3 @ConfigurationProperties — Type-Safe Configuration

```yaml
# application.yml
app:
  payment:
    gateway-url: https://api.stripe.com
    api-key: sk_test_xxx
    timeout-seconds: 30
    supported-currencies:
      - USD
      - EUR
      - GBP
```

```java
@ConfigurationProperties(prefix = "app.payment")
@Component
@Data
@Validated  // enables @NotNull, @Positive etc. on fields
public class PaymentProperties {

    @NotBlank
    private String gatewayUrl;

    @NotBlank
    private String apiKey;

    @Positive
    private int timeoutSeconds = 30;

    private List<String> supportedCurrencies = new ArrayList<>();
}

// Inject and use
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentProperties config;

    public void processPayment(Payment p) {
        String url = config.getGatewayUrl();
        int timeout = config.getTimeoutSeconds();
        // Type-safe, validated, IDE-autocomplete supported
    }
}
```

> **`@ConfigurationProperties` vs `@Value`:**
> - `@Value` is good for single, individual properties
> - `@ConfigurationProperties` is better for groups of related properties — type-safe, validates on startup, IDE autocompletion with `spring-configuration-metadata`

---

# Chapter 12: Testing

## 12.1 Unit Tests (No Spring Context)

```java
@ExtendWith(MockitoExtension.class)  // JUnit 5 + Mockito
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks  // Creates UserService and injects the mocks above
    private UserService userService;

    @Test
    void findById_whenUserExists_shouldReturnUser() {
        // given
        User user = User.builder().id(1L).name("Luffy").email("luffy@op.com").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // when
        User result = userService.findById(1L);

        // then
        assertThat(result.getName()).isEqualTo("Luffy");
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void findById_whenUserNotExists_shouldThrowResourceNotFoundException() {
        // given
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> userService.findById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with id: 99");
    }
}
```

---

## 12.2 @DataJpaTest — Repository Layer Tests

```java
@DataJpaTest  // Loads only JPA context + H2 in-memory DB
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findByEmail_whenExists_shouldReturn() {
        // given
        User user = User.builder()
            .name("Nami").email("nami@op.com").status(UserStatus.ACTIVE)
            .build();
        entityManager.persistAndFlush(user);

        // when
        Optional<User> found = userRepository.findByEmail("nami@op.com");

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Nami");
    }

    @Test
    void findTop5ByOrderByCreatedAtDesc_shouldReturnAtMost5() {
        // given — create 7 users
        IntStream.rangeClosed(1, 7).forEach(i ->
            entityManager.persistAndFlush(
                User.builder().name("User" + i).email("user" + i + "@op.com")
                    .status(UserStatus.ACTIVE).build()
            ));

        // when
        List<User> top5 = userRepository.findTop5ByOrderByCreatedAtDesc();

        // then
        assertThat(top5).hasSize(5);
    }
}
```

---

## 12.3 @SpringBootTest — Integration Tests

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean  // Replaces the real UserService bean in the Spring context
    private UserService userService;

    @Test
    void getUser_whenExists_shouldReturn200AndUserData() throws Exception {
        // given
        UserDTO userDTO = UserDTO.builder().id(1L).name("Zoro").build();
        when(userService.findById(1L)).thenReturn(userDTO);

        // when / then
        mockMvc.perform(get("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Zoro"))
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void createUser_whenValidRequest_shouldReturn201WithLocation() throws Exception {
        CreateUserRequest req = new CreateUserRequest("Sanji", "sanji@op.com", "Pass1@123", 21, null);
        UserDTO created = UserDTO.builder().id(2L).name("Sanji").build();
        when(userService.create(any())).thenReturn(created);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.name").value("Sanji"));
    }

    @Test
    void createUser_whenInvalidRequest_shouldReturn400WithFieldErrors() throws Exception {
        CreateUserRequest req = new CreateUserRequest("", "not-an-email", "weak", null, null);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.fieldErrors.name").exists())
            .andExpect(jsonPath("$.fieldErrors.email").exists());
    }
}
```

---

# Chapter 13: AOP — Aspect-Oriented Programming

AOP (Aspect-Oriented Programming) is one of the **core pillars of the Spring Framework**. It allows you to add cross-cutting concerns (logging, security, transactions, auditing) to your application **without modifying business logic code**.

> **Cross-cutting concerns** are features that span multiple layers — logging every method call, timing every service method, checking security before every controller method. Without AOP, you'd copy-paste this logic everywhere.

---

## 13.1 Core AOP Concepts

| Term | Meaning |
|---|---|
| **Aspect** | The class that contains cross-cutting logic (annotated `@Aspect`) |
| **Advice** | The actual code that runs (`@Before`, `@After`, `@Around`, etc.) |
| **Join Point** | A point during execution where advice can be applied (method call, exception) |
| **Pointcut** | An expression that matches which join points to intercept |
| **Weaving** | The process of applying aspects to target objects |
| **Proxy** | Spring wraps the target bean in a proxy object that intercepts calls |

---

## 13.2 How Spring AOP Works

Spring AOP uses **JDK Dynamic Proxies** (for interface-based beans) or **CGLIB proxies** (for class-based beans). When you call a method on a Spring bean, you're actually calling a proxy that intercepts the call, runs the advice, then delegates to the real bean.

```
Caller → [Spring Proxy] → Before Advice → Target Method → After Advice → Caller
```

> **Spring AOP vs AspectJ:**
> - **Spring AOP**: Proxy-based, runtime weaving, only works on Spring beans, supports method-level join points only. Simpler.
> - **AspectJ**: Compile-time/load-time weaving, works on any Java code, supports field/constructor join points too. More powerful but complex.
> - Spring Boot uses **Spring AOP** by default. You can integrate full AspectJ if needed.

---

## 13.3 Advice Types

```java
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // ─── @Before: runs BEFORE the method ──────────────────────────
    @Before("execution(* com.app.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        log.info("Entering: {}.{}() with args: {}", className, methodName,
            Arrays.toString(joinPoint.getArgs()));
    }

    // ─── @After: runs AFTER the method (always — success or exception) ──
    @After("execution(* com.app.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        log.info("Exiting: {}", joinPoint.getSignature().getName());
    }

    // ─── @AfterReturning: runs AFTER successful return ────────────
    @AfterReturning(
        pointcut = "execution(* com.app.service.*.*(..))",
        returning = "result"  // binds return value to 'result'
    )
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("Method {} returned: {}", joinPoint.getSignature().getName(), result);
    }

    // ─── @AfterThrowing: runs AFTER an exception is thrown ────────
    @AfterThrowing(
        pointcut = "execution(* com.app.service.*.*(..))",
        throwing = "ex"  // binds exception to 'ex'
    )
    public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
        log.error("Exception in {}: {}", joinPoint.getSignature().getName(), ex.getMessage());
    }

    // ─── @Around: wraps the method — most powerful ─────────────────
    @Around("execution(* com.app.service.*.*(..))")
    public Object measureTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String method = joinPoint.getSignature().toShortString();

        try {
            Object result = joinPoint.proceed(); // calls the actual method
            long elapsed = System.currentTimeMillis() - start;
            log.info("Method {} completed in {}ms", method, elapsed);
            return result;
        } catch (Throwable ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.error("Method {} failed after {}ms: {}", method, elapsed, ex.getMessage());
            throw ex; // re-throw — don't swallow
        }
    }
}
```

---

## 13.4 Pointcut Expressions

```java
@Aspect
@Component
public class PointcutExamples {

    // ─── Syntax: execution(modifier returnType package.class.method(args)) ──

    // All methods in any class in service package
    @Pointcut("execution(* com.app.service.*.*(..))")
    public void serviceLayer() {}

    // All public methods in any class
    @Pointcut("execution(public * *(..))")
    public void publicMethods() {}

    // Methods named "get*" with any args returning any type
    @Pointcut("execution(* get*(..))")
    public void getterMethods() {}

    // Methods with exactly one String argument
    @Pointcut("execution(* *(String))")
    public void singleStringArg() {}

    // All methods in classes annotated with @Service
    @Pointcut("within(@org.springframework.stereotype.Service *)")
    public void serviceBeans() {}

    // Methods annotated with a custom annotation
    @Pointcut("@annotation(com.app.annotation.Audited)")
    public void auditedMethods() {}

    // Combining pointcuts with &&, ||, !
    @Pointcut("serviceLayer() && !getterMethods()")
    public void serviceNonGetters() {}

    // All methods in UserService specifically
    @Pointcut("execution(* com.app.service.UserService.*(..))")
    public void userServiceMethods() {}
}
```

---

## 13.5 Real-World AOP Use Cases

### Use Case 1: @Around for Performance Monitoring

```java
// ─── Custom Annotation ────────────────────────────────────────────
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TrackPerformance {
    String value() default "";
}

// ─── Aspect ───────────────────────────────────────────────────────
@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Around("@annotation(trackPerformance)")
    public Object trackPerformance(ProceedingJoinPoint pjp,
                                   TrackPerformance trackPerformance) throws Throwable {
        String label = trackPerformance.value().isEmpty()
            ? pjp.getSignature().toShortString()
            : trackPerformance.value();

        StopWatch sw = new StopWatch();
        sw.start();
        try {
            return pjp.proceed();
        } finally {
            sw.stop();
            if (sw.getTotalTimeMillis() > 1000) {
                log.warn("SLOW: {} took {}ms", label, sw.getTotalTimeMillis());
            } else {
                log.info("{} took {}ms", label, sw.getTotalTimeMillis());
            }
        }
    }
}

// ─── Usage ────────────────────────────────────────────────────────
@Service
public class ReportService {

    @TrackPerformance("Monthly Report Generation")
    public Report generateMonthlyReport(int month, int year) {
        // No performance tracking code here — AOP handles it
        return buildReport(month, year);
    }
}
```

### Use Case 2: @Before for Audit Logging

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audited {
    String action();
}

@Aspect
@Component
@Slf4j
public class AuditAspect {

    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private SecurityContextHolder securityContextHolder;

    @AfterReturning("@annotation(audited)")
    public void audit(JoinPoint joinPoint, Audited audited) {
        String user = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        AuditLog log = AuditLog.builder()
            .action(audited.action())
            .performedBy(user)
            .timestamp(LocalDateTime.now())
            .methodArgs(Arrays.toString(joinPoint.getArgs()))
            .build();
        auditLogRepository.save(log);
    }
}

// Usage
@Service
public class UserService {

    @Audited(action = "USER_CREATED")
    public User createUser(CreateUserRequest req) { ... }

    @Audited(action = "USER_DELETED")
    public void deleteUser(Long id) { ... }
}
```

### Use Case 3: @Around for Retry Logic

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Retryable {
    int maxAttempts() default 3;
    long delayMs() default 1000;
    Class<? extends Exception>[] on() default { Exception.class };
}

@Aspect
@Component
@Slf4j
public class RetryAspect {

    @Around("@annotation(retryable)")
    public Object retry(ProceedingJoinPoint pjp, Retryable retryable) throws Throwable {
        int attempts = 0;
        Exception lastException = null;

        while (attempts < retryable.maxAttempts()) {
            try {
                return pjp.proceed();
            } catch (Exception ex) {
                boolean shouldRetry = Arrays.stream(retryable.on())
                    .anyMatch(type -> type.isAssignableFrom(ex.getClass()));

                if (!shouldRetry) throw ex;

                attempts++;
                lastException = ex;
                log.warn("Attempt {}/{} failed for {}: {}",
                    attempts, retryable.maxAttempts(),
                    pjp.getSignature().getName(), ex.getMessage());

                if (attempts < retryable.maxAttempts()) {
                    Thread.sleep(retryable.delayMs());
                }
            }
        }
        throw lastException;
    }
}

// Usage
@Service
public class PaymentService {
    @Retryable(maxAttempts = 3, delayMs = 2000, on = { PaymentGatewayException.class })
    public PaymentResult charge(PaymentRequest req) {
        return gateway.charge(req);
    }
}
```

---

> **Q: What is the difference between `@Before`, `@After`, and `@Around`?**
>
> - `@Before` — runs before the method. Cannot prevent the method from running.
> - `@After` — runs after the method always (success or exception). Like `finally`.
> - `@AfterReturning` — runs only on successful return. Can inspect the return value.
> - `@AfterThrowing` — runs only when an exception is thrown. Can inspect the exception.
> - `@Around` — wraps the entire method. Most powerful — can prevent execution, modify args, change return value, handle exceptions. Must call `pjp.proceed()` to invoke the target.

---

> **Q: Why does `@Transactional` not work when called from within the same class?**
>
> Because `@Transactional` works via **Spring AOP proxy**. When you call `this.method()`, you're calling on the **real object**, not the proxy. The proxy never intercepts the call, so no transaction is started. This is the same reason why `@Cacheable`, `@Async`, and `@Retryable` also fail on self-invocation.

---

# Chapter 14: Caching

Spring's caching abstraction allows you to add caching to any Spring-managed bean with simple annotations, **decoupled from the underlying cache provider** (Ehcache, Redis, Caffeine, etc.).

---

## 14.1 Setup

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<!-- For Redis cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- For Caffeine (in-memory, best for local caching) -->
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableCaching  // REQUIRED — enables Spring's caching proxy
public class MyApp { ... }
```

---

## 14.2 Cache Annotations

### @Cacheable — Cache the Result

```java
@Service
public class ProductService {

    // ─── Basic: cache result by 'id' parameter ───────────────────
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        // This method body runs ONLY if cache miss
        // On cache HIT, Spring returns the cached value directly
        log.info("Fetching product {} from DB", id); // won't print on cache hit
        return productRepository.findById(id).orElseThrow();
    }

    // ─── Conditional caching ─────────────────────────────────────
    @Cacheable(value = "products", key = "#id", condition = "#id > 0")
    public Product findByIdConditional(Long id) { ... }

    // ─── Unless: don't cache if result is null or empty ──────────
    @Cacheable(value = "products", key = "#name", unless = "#result == null")
    public Product findByName(String name) { ... }

    // ─── Multiple caches ──────────────────────────────────────────
    @Cacheable(value = {"products", "productCache"}, key = "#id")
    public Product findByIdMultiCache(Long id) { ... }

    // ─── SpEL in key: composite key ───────────────────────────────
    @Cacheable(value = "products", key = "#category + ':' + #page")
    public List<Product> findByCategory(String category, int page) { ... }

    // ─── Key from object field ────────────────────────────────────
    @Cacheable(value = "products", key = "#request.productId")
    public Product findByRequest(ProductRequest request) { ... }
}
```

### @CachePut — Update Cache Without Skipping Method

```java
// @CachePut ALWAYS runs the method AND updates the cache
// Use for CREATE and UPDATE operations

@CachePut(value = "products", key = "#result.id")
public Product createProduct(CreateProductRequest req) {
    Product saved = productRepository.save(new Product(req));
    return saved; // result stored in cache with key = saved.id
}

@CachePut(value = "products", key = "#id")
public Product updateProduct(Long id, UpdateProductRequest req) {
    Product product = findById(id);
    product.update(req);
    return productRepository.save(product); // also updates cache
}
```

### @CacheEvict — Remove from Cache

```java
// ─── Evict single entry ───────────────────────────────────────
@CacheEvict(value = "products", key = "#id")
public void deleteProduct(Long id) {
    productRepository.deleteById(id);
}

// ─── Evict ALL entries in the cache ──────────────────────────
@CacheEvict(value = "products", allEntries = true)
public void clearAllProductsCache() {
    log.info("Products cache cleared");
}

// ─── Evict BEFORE method runs (default is AFTER) ─────────────
@CacheEvict(value = "products", key = "#id", beforeInvocation = true)
public void evictBeforeUpdate(Long id) { ... }

// ─── Multiple evictions ────────────────────────────────────────
@Caching(evict = {
    @CacheEvict(value = "products", key = "#id"),
    @CacheEvict(value = "productsByCategory", allEntries = true)
})
public void deleteProductWithRelatedCaches(Long id) {
    productRepository.deleteById(id);
}
```

---

## 14.3 Cache Configuration — Caffeine (In-Memory)

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        // Default spec for all caches
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)                    // max 1000 entries
            .expireAfterWrite(10, TimeUnit.MINUTES) // TTL: 10 min
            .recordStats());                       // enable hit/miss stats

        return cacheManager;
    }

    // Per-cache configuration
    @Bean
    public CacheManager perCacheCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            buildCache("products", 500, 10),       // 500 entries, 10 min TTL
            buildCache("users", 200, 30),           // 200 entries, 30 min TTL
            buildCache("configurations", 100, 60)   // 100 entries, 60 min TTL
        ));
        return cacheManager;
    }

    private CaffeineCache buildCache(String name, int maxSize, int ttlMinutes) {
        return new CaffeineCache(name,
            Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(ttlMinutes, TimeUnit.MINUTES)
                .recordStats()
                .build());
    }
}
```

## 14.4 Cache Configuration — Redis (Distributed)

```java
@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        // Default config
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues(); // don't cache null results

        // Per-cache TTL overrides
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("users", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("sessions", defaultConfig.entryTtl(Duration.ofHours(24)));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
    }
}
```

```properties
# application.properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.data.redis.password=secret
spring.data.redis.timeout=2000ms
```

---

> **Q: What is the difference between `@Cacheable` and `@CachePut`?**
>
> - `@Cacheable`: Checks the cache first. If **cache hit**, returns cached value and **skips the method**. If **cache miss**, runs the method and caches the result.
> - `@CachePut`: **Always runs the method** and always updates the cache. Used for write operations (create/update) to keep the cache in sync.

> **Q: Why might `@Cacheable` not work?**
>
> 1. `@EnableCaching` not added to a config class
> 2. Self-invocation (calling `this.cachedMethod()` — proxy bypass)
> 3. Method is not `public`
> 4. The cached object is not `Serializable` (required for Redis)
> 5. No `CacheManager` bean configured

---

# Chapter 15: Spring Events

Spring's event mechanism implements the **Observer / Publish-Subscribe pattern**. It allows loose coupling between components — the publisher doesn't know about subscribers.

---

## 15.1 Custom Events

```java
// ─── Event class (extend ApplicationEvent or use plain POJO) ───
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;
    private final String ipAddress;

    public UserRegisteredEvent(Object source, User user, String ipAddress) {
        super(source);
        this.user = user;
        this.ipAddress = ipAddress;
    }

    public User getUser() { return user; }
    public String getIpAddress() { return ipAddress; }
}

// ─── Plain POJO event (Spring 4.2+, simpler) ──────────────────
@Data
@AllArgsConstructor
public class OrderPlacedEvent {
    private final Order order;
    private final String customerEmail;
    private final LocalDateTime placedAt;
}
```

---

## 15.2 Publishing Events

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher; // inject publisher

    @Transactional
    public User registerUser(RegisterUserRequest req) {
        User user = userRepository.save(new User(req));

        // Publish event — all listeners will be notified
        eventPublisher.publishEvent(new UserRegisteredEvent(this, user, req.getIpAddress()));
        // At this point, synchronous listeners have already run
        return user;
    }
}
```

---

## 15.3 Listening to Events

```java
// ─── Method 1: @EventListener (recommended, Spring 4.2+) ───────
@Component
@Slf4j
public class UserRegistrationListener {

    @Autowired private EmailService emailService;
    @Autowired private AuditService auditService;

    // Synchronous — runs in the same thread as the publisher
    @EventListener
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("New user registered: {}", event.getUser().getEmail());
        emailService.sendWelcomeEmail(event.getUser());
    }

    // Conditional — only handle event if condition is true
    @EventListener(condition = "#event.user.status == T(com.app.UserStatus).PREMIUM")
    public void onPremiumUserRegistered(UserRegisteredEvent event) {
        emailService.sendPremiumWelcomePackage(event.getUser());
    }

    // Asynchronous — runs in a different thread (non-blocking)
    @Async
    @EventListener
    public void sendAuditLog(UserRegisteredEvent event) {
        // Won't block the main thread
        auditService.log("USER_REGISTERED", event.getUser().getId(), event.getIpAddress());
    }
}

// ─── Method 2: @TransactionalEventListener ────────────────────
// Fires ONLY after the transaction that published the event COMMITS
// Critical for preventing side effects when the transaction rolls back
@Component
public class OrderEventListener {

    @Autowired private InventoryService inventoryService;
    @Autowired private ShipmentService shipmentService;

    // Only runs after the @Transactional method that published this event COMMITS
    // If transaction rolls back, this listener is NEVER called
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderPlaced(OrderPlacedEvent event) {
        // Safe! Transaction committed, order is definitely in DB
        inventoryService.reserveStock(event.getOrder());
        shipmentService.scheduleShipment(event.getOrder());
    }

    // Runs after rollback
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void onOrderFailed(OrderPlacedEvent event) {
        log.error("Order failed, releasing hold: {}", event.getOrder().getId());
    }
}
```

---

## 15.4 Built-in Spring Events

```java
@Component
public class SpringLifecycleListener {

    // Fired when ApplicationContext is fully initialized
    @EventListener(ApplicationReadyEvent.class)
    public void onAppReady() {
        log.info("Application is fully started and ready to serve requests");
        // Good for: pre-loading caches, sending startup notifications
    }

    // Fired when ApplicationContext starts refreshing
    @EventListener(ContextRefreshedEvent.class)
    public void onContextRefreshed() {
        log.info("Context refreshed");
    }

    // Fired when ApplicationContext is closing
    @EventListener(ContextClosedEvent.class)
    public void onContextClosed() {
        log.info("Application shutting down — performing cleanup");
    }
}
```

---

> **Q: What is the difference between `@EventListener` and `@TransactionalEventListener`?**
>
> - `@EventListener`: Fires **immediately** when the event is published, within the same thread and transaction. If the transaction rolls back afterward, the listener has already executed — potential for inconsistency.
> - `@TransactionalEventListener`: Fires only **after the transaction commits** (by default). If the transaction rolls back, the listener is never invoked. Use this when your listener has side effects (sending emails, calling external APIs, updating other systems) that should only happen after the DB write is confirmed.

---

# Chapter 16: Async Processing

---

## 16.1 @Async — Non-Blocking Method Execution

`@Async` makes a method run in a separate thread from Spring's task executor pool, returning immediately to the caller.

```java
@SpringBootApplication
@EnableAsync  // REQUIRED — enables Spring's async processing
public class MyApp { ... }

// ─── Async method returning void ─────────────────────────────────
@Service
@Slf4j
public class EmailService {

    @Async  // Runs in a thread pool, not the caller's thread
    public void sendWelcomeEmail(User user) {
        // This runs asynchronously — caller doesn't wait
        log.info("Sending welcome email to {}", user.getEmail());
        // simulate SMTP call
        emailClient.send(buildWelcomeEmail(user));
    }
}

// ─── Async method returning CompletableFuture ─────────────────────
@Service
public class ExternalApiService {

    @Async
    public CompletableFuture<ApiResponse> fetchData(String id) {
        ApiResponse response = externalApi.fetch(id); // blocking call, runs in thread pool
        return CompletableFuture.completedFuture(response);
    }
}

// ─── Combining multiple async calls ───────────────────────────────
@Service
public class DashboardService {

    @Autowired private ExternalApiService apiService;

    public DashboardData getDashboard(Long userId) throws Exception {
        // Launch all three in parallel
        CompletableFuture<UserStats> statsFuture = apiService.fetchUserStats(userId);
        CompletableFuture<List<Order>> ordersFuture = apiService.fetchOrders(userId);
        CompletableFuture<List<Notification>> notifsFuture = apiService.fetchNotifications(userId);

        // Wait for all to complete
        CompletableFuture.allOf(statsFuture, ordersFuture, notifsFuture).join();

        return DashboardData.builder()
            .stats(statsFuture.get())
            .orders(ordersFuture.get())
            .notifications(notifsFuture.get())
            .build();
    }
}
```

---

## 16.2 Custom Thread Pool for @Async

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);        // threads always alive
        executor.setMaxPoolSize(20);         // max threads under load
        executor.setQueueCapacity(100);      // queue size before new threads created
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // CallerRunsPolicy: when queue is full, caller thread runs the task (backpressure)
        executor.initialize();
        return executor;
    }

    // Handle exceptions in @Async void methods
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            log.error("Async exception in {}: {}", method.getName(), ex.getMessage());
            // Alert monitoring system
        };
    }
}

// Named executor — use different pools for different task types
@Bean(name = "emailExecutor")
public Executor emailExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(5);
    executor.setThreadNamePrefix("email-");
    executor.initialize();
    return executor;
}

// Usage
@Async("emailExecutor")  // Use the named executor
public void sendEmail(String to, String body) { ... }
```

---

## 16.3 @Scheduled — Recurring Tasks

```java
@SpringBootApplication
@EnableScheduling  // REQUIRED
public class MyApp { ... }

@Component
@Slf4j
public class ScheduledTasks {

    // ─── Fixed delay: N ms AFTER last completion ──────────────────
    @Scheduled(fixedDelay = 5000)  // 5 seconds after last run ends
    public void cleanExpiredSessions() {
        sessionService.deleteExpired();
        log.info("Expired sessions cleaned");
    }

    // ─── Fixed rate: every N ms (regardless of completion time) ───
    @Scheduled(fixedRate = 60_000)  // every 60 seconds
    public void sendHeartbeat() {
        monitoringService.ping();
    }

    // ─── Initial delay: wait before first run ─────────────────────
    @Scheduled(fixedRate = 30_000, initialDelay = 10_000)
    public void syncWithExternalService() {
        externalSync.synchronize();
    }

    // ─── Cron expression: full control ────────────────────────────
    // Syntax: second minute hour day-of-month month day-of-week
    @Scheduled(cron = "0 0 2 * * *")     // every day at 2:00 AM
    public void generateDailyReport() {
        reportService.generateDaily();
    }

    @Scheduled(cron = "0 0 9 * * MON")   // every Monday at 9:00 AM
    public void sendWeeklyDigest() {
        emailService.sendWeeklyDigest();
    }

    @Scheduled(cron = "0 0/15 8-18 * * MON-FRI") // every 15 min, 8AM-6PM, weekdays
    public void checkStockPrices() {
        stockService.checkPrices();
    }

    // ─── Using properties for schedule (configurable without redeployment) ─
    @Scheduled(cron = "${app.jobs.report.cron:0 0 3 * * *}")
    public void configurableJob() {
        // schedule comes from application.properties
    }
}
```

### Cron Expression Quick Reference

```
# Format: second minute hour day-of-month month day-of-week

# Every minute
0 * * * * *

# Every day at midnight
0 0 0 * * *

# Every Monday at 8 AM
0 0 8 * * MON

# First day of every month at 6 AM
0 0 6 1 * *

# Every 30 minutes
0 0/30 * * * *

# Weekdays at 9 AM
0 0 9 * * MON-FRI
```

---

> **Q: What happens if a `@Scheduled` task takes longer than its `fixedRate`?**
>
> By default, `@Scheduled` uses a **single-threaded** executor. If the task exceeds the `fixedRate`, the next execution waits until the current one completes — executions don't overlap. To allow parallel execution, configure a `TaskScheduler` with multiple threads or annotate with `@Async` as well.

---

# Chapter 17: Microservices Essentials

When moving to microservices with Spring Boot, several key patterns and tools are essential.

---

## 17.1 Service-to-Service Communication

### RestTemplate (Legacy)

```java
@Configuration
public class RestConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    }
}

@Service
public class OrderService {
    @Autowired private RestTemplate restTemplate;

    public Product getProduct(Long productId) {
        // Synchronous blocking call
        return restTemplate.getForObject(
            "http://product-service/api/products/{id}",
            Product.class, productId);
    }
}
```

### WebClient (Modern, Reactive) ✅

```java
@Configuration
public class WebClientConfig {
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
    }
}

@Service
public class ProductClient {

    private final WebClient webClient;

    public ProductClient(WebClient.Builder builder) {
        this.webClient = builder
            .baseUrl("http://product-service")
            .build();
    }

    // Async non-blocking
    public Mono<Product> getProduct(Long id) {
        return webClient.get()
            .uri("/api/products/{id}", id)
            .retrieve()
            .onStatus(HttpStatus::is4xxClientError, response ->
                Mono.error(new ProductNotFoundException(id)))
            .onStatus(HttpStatus::is5xxServerError, response ->
                Mono.error(new ServiceUnavailableException()))
            .bodyToMono(Product.class)
            .timeout(Duration.ofSeconds(5));
    }

    // Block for non-reactive contexts
    public Product getProductSync(Long id) {
        return getProduct(id).block();
    }

    // Parallel calls
    public Tuple2<Product, Inventory> getProductWithInventory(Long id) {
        return Mono.zip(
            getProduct(id),
            getInventory(id)
        ).block();
    }
}
```

---

## 17.2 OpenFeign — Declarative HTTP Client

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableFeignClients  // REQUIRED
public class MyApp { }

// ─── Feign client — just an interface! ───────────────────────────
@FeignClient(
    name = "product-service",
    url = "${services.product.url}",
    fallback = ProductClientFallback.class  // circuit breaker fallback
)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    Product getProduct(@PathVariable Long id);

    @GetMapping("/api/products")
    List<Product> getAllProducts(@RequestParam String category,
                                @RequestParam int page);

    @PostMapping("/api/products")
    Product createProduct(@RequestBody CreateProductRequest request);

    @DeleteMapping("/api/products/{id}")
    void deleteProduct(@PathVariable Long id);
}

// ─── Fallback for when service is down ───────────────────────────
@Component
public class ProductClientFallback implements ProductClient {
    @Override
    public Product getProduct(Long id) {
        return Product.builder().id(id).name("Unknown").build(); // safe default
    }

    @Override
    public List<Product> getAllProducts(String category, int page) {
        return Collections.emptyList();
    }
    // ...
}

// ─── Usage — feels like a local service call ──────────────────────
@Service
@RequiredArgsConstructor
public class OrderService {
    private final ProductClient productClient; // injected like any bean

    public Order placeOrder(OrderRequest req) {
        Product product = productClient.getProduct(req.getProductId()); // HTTP call!
        // ...
    }
}
```

---

## 17.3 Circuit Breaker — Resilience4j

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      productService:
        sliding-window-size: 10           # evaluate last 10 calls
        failure-rate-threshold: 50         # open if 50%+ fail
        wait-duration-in-open-state: 30s   # stay open for 30 sec
        permitted-number-of-calls-in-half-open-state: 3
  retry:
    instances:
      productService:
        max-attempts: 3
        wait-duration: 1s
  timelimiter:
    instances:
      productService:
        timeout-duration: 5s
```

```java
@Service
public class ProductService {

    @Autowired private ProductClient productClient;

    @CircuitBreaker(name = "productService", fallbackMethod = "getProductFallback")
    @Retry(name = "productService")
    @TimeLimiter(name = "productService")
    public CompletableFuture<Product> getProduct(Long id) {
        return CompletableFuture.supplyAsync(() -> productClient.getProduct(id));
    }

    // Fallback method — same signature + exception parameter
    public CompletableFuture<Product> getProductFallback(Long id, Exception ex) {
        log.warn("Circuit breaker opened for product {}: {}", id, ex.getMessage());
        return CompletableFuture.completedFuture(
            Product.builder().id(id).name("Unavailable").build()
        );
    }
}
```

---

## 17.4 Service Discovery — Eureka

```xml
<!-- Eureka Server -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>

<!-- Eureka Client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```java
// ─── Eureka Server ────────────────────────────────────────────────
@SpringBootApplication
@EnableEurekaServer
public class EurekaServer { }

// ─── Eureka Client (any microservice) ─────────────────────────────
@SpringBootApplication
@EnableDiscoveryClient
public class ProductService { }
```

```yaml
# Product service application.yml
spring:
  application:
    name: product-service  # This is how other services find you

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
  instance:
    prefer-ip-address: true
```

---

## 17.5 API Gateway — Spring Cloud Gateway

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: product-service
          uri: lb://product-service    # lb:// = load balanced via Eureka
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=0
            - AddRequestHeader=X-Gateway-Source, spring-gateway
            - name: CircuitBreaker
              args:
                name: productServiceCB
                fallbackUri: forward:/fallback/products

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
            - Method=GET,POST
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
```

---

## 17.6 Distributed Tracing — Micrometer + Zipkin

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

```yaml
management:
  tracing:
    sampling:
      probability: 1.0  # 100% sampling in dev (use 0.1 in prod)
  zipkin:
    tracing:
      endpoint: http://zipkin:9411/api/v2/spans

logging:
  pattern:
    level: "%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]"
```

With this setup, every request gets a `traceId` that flows across all microservices, allowing you to trace a single request end-to-end in Zipkin.

---

> **Q: What is a Circuit Breaker pattern?**
>
> A circuit breaker monitors calls to a remote service. It has three states:
> - **CLOSED**: Normal operation. All requests pass through.
> - **OPEN**: Too many failures detected. All requests fail immediately (short-circuit) with a fallback — no waiting for timeout.
> - **HALF-OPEN**: After a wait period, allows a limited number of test requests. If they succeed, transitions to CLOSED. If they fail, back to OPEN.
>
> **Why?** Without it, a slow downstream service causes your threads to pile up waiting for timeouts, eventually crashing your service too (cascading failure).

---

# Chapter 18: Database Migrations

Database migrations are **version-controlled SQL scripts** that evolve your schema alongside your code. This is critical for production deployments.

---

## 18.1 Flyway

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```properties
# application.properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true  # for existing DBs
spring.jpa.hibernate.ddl-auto=validate  # NEVER use create/update with Flyway!
```

```
# File naming convention (CRITICAL):
# V{version}__{description}.sql
# ↑ Capital V, version number, double underscore, description

src/main/resources/db/migration/
  V1__Create_users_table.sql
  V2__Add_email_index.sql
  V3__Create_orders_table.sql
  V3.1__Add_order_status_column.sql
  R__Create_report_views.sql    # Repeatable (R prefix) — runs when checksum changes
```

```sql
-- V1__Create_users_table.sql
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    status     VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- V2__Add_email_index.sql
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);

-- V3__Create_orders_table.sql
CREATE TABLE orders (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- V4__Add_audit_columns.sql
-- Never modify existing migrations! Always add new ones.
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN login_count   INTEGER DEFAULT 0;
```

> **Flyway Golden Rules:**
> - **NEVER modify** a migration that has already been applied. Flyway checksums each file and will fail on startup if a past migration is changed.
> - Always use `spring.jpa.hibernate.ddl-auto=validate` (not `update`) when using Flyway.
> - Test migrations in a staging environment before production.

---

## 18.2 Liquibase (Alternative)

```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

```yaml
# changelog in YAML (also supports XML, JSON, SQL)
# src/main/resources/db/changelog/db.changelog-master.yaml

databaseChangeLog:
  - changeSet:
      id: 1
      author: luffy
      changes:
        - createTable:
            tableName: users
            columns:
              - column:
                  name: id
                  type: BIGINT
                  autoIncrement: true
                  constraints:
                    primaryKey: true
              - column:
                  name: email
                  type: VARCHAR(255)
                  constraints:
                    nullable: false
                    unique: true

  - changeSet:
      id: 2
      author: luffy
      changes:
        - addColumn:
            tableName: users
            columns:
              - column:
                  name: last_login_at
                  type: TIMESTAMP
```

| Feature | Flyway | Liquibase |
|---|---|---|
| Script format | SQL only | SQL, XML, YAML, JSON |
| Learning curve | Lower | Higher |
| Rollback | Manual SQL | Built-in rollback support |
| Community | Large | Large |
| Spring Boot integration | Excellent | Excellent |
| Best for | Simple SQL-first teams | Complex, multi-DB environments |

---

# Chapter 19: Logging

## 19.1 SLF4J + Logback

Spring Boot uses **Logback** by default with **SLF4J** as the logging facade.

```java
// Using @Slf4j Lombok annotation (recommended — no boilerplate)
@Service
@Slf4j
public class OrderService {

    public Order processOrder(OrderRequest req) {
        // ─── Different log levels ─────────────────────────────
        log.trace("Trace: very detailed, for debugging internals");
        log.debug("Processing order request: {}", req.getId());
        log.info("Order {} created for user {}", req.getId(), req.getUserId());
        log.warn("Order {} amount {} exceeds threshold", req.getId(), req.getAmount());
        log.error("Order {} processing failed", req.getId(), exception); // pass Throwable as last arg

        // ─── Avoid string concatenation — use {} placeholders ─
        // ❌ WRONG: log.debug("User: " + user.getName()); // string built even if DEBUG disabled
        // ✅ CORRECT: log.debug("User: {}", user.getName()); // lazy — string only built if DEBUG on

        // ─── Structured logging with multiple fields ──────────
        log.info("Order processed: orderId={}, userId={}, amount={}, status={}",
            order.getId(), order.getUserId(), order.getAmount(), order.getStatus());

        return order;
    }
}
```

---

## 19.2 Logback Configuration

```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>

    <!-- Console appender for development -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level [%X{traceId}] %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Rolling file appender for production -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <maxFileSize>50MB</maxFileSize>
            <maxHistory>30</maxHistory>     <!-- keep 30 days -->
            <totalSizeCap>2GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>%d{ISO8601} [%thread] %-5level [%X{traceId},%X{spanId}] %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Spring profiles: different config per environment -->
    <springProfile name="dev">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>

    <springProfile name="prod">
        <logger name="com.myapp" level="INFO"/>
        <logger name="org.hibernate.SQL" level="WARN"/>  <!-- no SQL in prod! -->
        <root level="WARN">
            <appender-ref ref="FILE"/>
        </root>
    </springProfile>

    <!-- Suppress noisy framework logs -->
    <logger name="org.springframework" level="WARN"/>
    <logger name="org.hibernate" level="WARN"/>

</configuration>
```

---

## 19.3 MDC — Mapped Diagnostic Context

MDC lets you attach **contextual data** (user ID, request ID, tenant) to every log line within a thread, without passing it explicitly to every method. Essential for debugging distributed systems.

```java
// ─── MDC Filter — adds request context to every log line ─────────
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MdcLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        try {
            // Add context to MDC — available in ALL log calls for this thread
            String requestId = Optional
                .ofNullable(request.getHeader("X-Request-Id"))
                .orElse(UUID.randomUUID().toString());

            MDC.put("requestId", requestId);
            MDC.put("method", request.getMethod());
            MDC.put("path", request.getRequestURI());
            MDC.put("clientIp", request.getRemoteAddr());

            // Add user info if authenticated
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                MDC.put("userId", auth.getName());
            }

            response.setHeader("X-Request-Id", requestId); // echo back in response
            chain.doFilter(request, response);
        } finally {
            MDC.clear(); // ALWAYS clear MDC to prevent thread pool leakage
        }
    }
}

// Now every log line in this request automatically includes requestId, userId etc.
// log.info("Order created"); 
// → 10:30:15.123 [http-nio-8080] INFO [reqId=abc-123,userId=42] OrderService - Order created
```

---

## 19.4 Log Levels and When to Use Them

| Level | When to Use | Example |
|---|---|---|
| `TRACE` | Extremely detailed, step-by-step | Loop iterations, variable values mid-algorithm |
| `DEBUG` | Useful for debugging, disabled in prod | Method entry/exit, query parameters |
| `INFO` | Normal business events | Order created, user logged in, job started |
| `WARN` | Unexpected but recoverable | Retry attempt, deprecated API used, slow query |
| `ERROR` | Errors requiring attention | Exception caught, external service down, data loss |

```properties
# application.properties — controlling log levels at runtime
logging.level.root=WARN
logging.level.com.myapp=INFO           # your package: INFO
logging.level.com.myapp.service=DEBUG  # specific package: DEBUG
logging.level.org.hibernate.SQL=DEBUG  # see SQL queries
logging.level.org.hibernate.type.descriptor.sql=TRACE  # see bound parameters

# Change log level at runtime via Actuator (no restart needed!)
# POST /actuator/loggers/com.myapp.service
# {"configuredLevel": "DEBUG"}
```

---

# Chapter 20: Java 8+ Features Used in Spring Boot


## 20.1 Optional — Avoiding NullPointerException

```java
@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    // ─── Return Optional from service ────────────────────────────
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ─── Consuming Optional correctly ─────────────────────────────
    public UserDTO getUserOrDefault(String email) {
        return userRepository.findByEmail(email)
            .map(user -> new UserDTO(user))          // transform if present
            .orElse(UserDTO.anonymous());             // default if empty
    }

    public User getUserOrThrow(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public void processIfExists(String email) {
        userRepository.findByEmail(email)
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .ifPresent(user -> emailService.sendPromotion(user));
    }

    // ─── Common Optional anti-patterns ───────────────────────────
    // ❌ BAD: defeats the purpose of Optional
    if (optional.isPresent()) {
        User user = optional.get();
    }

    // ✅ GOOD: use map/flatMap/orElse
    optional.map(User::getName).orElse("Unknown");
}
```

---

## 20.2 Stream API

```java
@Service
public class ReportService {

    public Map<UserStatus, Long> countUsersByStatus(List<User> users) {
        return users.stream()
            .collect(Collectors.groupingBy(User::getStatus, Collectors.counting()));
    }

    public List<String> getActiveUserEmails(List<User> users) {
        return users.stream()
            .filter(u -> u.getStatus() == UserStatus.ACTIVE)
            .sorted(Comparator.comparing(User::getName))
            .map(User::getEmail)
            .distinct()
            .collect(Collectors.toList());
    }

    public Optional<User> findHighestSpender(List<User> users) {
        return users.stream()
            .max(Comparator.comparing(u -> u.getOrders().stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)));
    }

    public BigDecimal getTotalRevenue(List<Order> orders) {
        return orders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Parallel stream — be careful with shared mutable state
    public long countExpensiveOrders(List<Order> orders, BigDecimal threshold) {
        return orders.parallelStream()
            .filter(o -> o.getTotalAmount().compareTo(threshold) > 0)
            .count();
    }
}
```

---

## 20.3 Functional Interfaces & Lambda

```java
// Common functional interfaces
Function<String, Integer>  parse    = Integer::parseInt;          // T → R
Predicate<String>          isEmail  = s -> s.contains("@");       // T → boolean
Consumer<User>             printer  = user -> System.out.println(user.getName()); // T → void
Supplier<User>             creator  = () -> new User();           // () → T
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n); // T,U → R

// ─── In Spring: used everywhere ───────────────────────────────────
// Repository: findAll(Specification<T>) uses Specification functional interface
// WebClient: onStatus(Predicate, Function)
// @Bean: ObjectProvider<T>.getIfAvailable(Supplier<T>)
// StreamAPI: .filter(Predicate) .map(Function) .forEach(Consumer)
```

---

## 20.4 CompletableFuture

```java
@Service
public class AsyncOrderService {

    // ─── Chaining async operations ────────────────────────────────
    public CompletableFuture<OrderConfirmation> processOrder(OrderRequest req) {
        return CompletableFuture
            .supplyAsync(() -> validateOrder(req))           // Run in thread pool
            .thenApplyAsync(validated -> chargePayment(validated))  // chain
            .thenApplyAsync(charged -> createShipment(charged))
            .thenApply(shipment -> buildConfirmation(shipment))
            .exceptionally(ex -> {
                log.error("Order processing failed", ex);
                return OrderConfirmation.failed(ex.getMessage());
            });
    }

    // ─── Running multiple tasks in parallel ───────────────────────
    public DashboardData loadDashboard(Long userId) {
        CompletableFuture<UserStats> stats = CompletableFuture.supplyAsync(() -> loadStats(userId));
        CompletableFuture<List<Order>> orders = CompletableFuture.supplyAsync(() -> loadOrders(userId));
        CompletableFuture<List<Notification>> notifs = CompletableFuture.supplyAsync(() -> loadNotifs(userId));

        return CompletableFuture.allOf(stats, orders, notifs)
            .thenApply(v -> DashboardData.of(
                stats.join(), orders.join(), notifs.join()))
            .join();
    }
}
```

---

# Chapter 21: Design Patterns in Spring Boot

Spring Boot is built on design patterns. Knowing which pattern is used where shows depth of understanding.

---

## 21.1 Singleton Pattern

Every `@Component`, `@Service`, `@Repository` with default scope is a Singleton — one instance per Spring container.

```java
@Service  // Singleton by default
public class CurrencyConverter {
    // Thread-safe, stateless service — perfect singleton
    public BigDecimal convert(BigDecimal amount, String from, String to) { ... }
}
```

---

## 21.2 Factory Pattern — @Bean

`@Configuration` classes act as factories for beans.

```java
@Configuration
public class DataSourceFactory {

    @Bean
    @Profile("dev")
    public DataSource h2DataSource() {
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).build();
    }

    @Bean
    @Profile("prod")
    public DataSource postgresDataSource() {
        return new HikariDataSource(buildProdConfig());
    }
}
```

---

## 21.3 Proxy Pattern — AOP, @Transactional, @Cacheable

Spring wraps beans in **proxy objects** for AOP, transactions, and caching. The proxy intercepts method calls and adds behavior.

```
Client calls → [CGLIB Proxy: opens transaction, checks cache] → Real Bean Method
```

---

## 21.4 Template Method Pattern — JdbcTemplate, RestTemplate

Defines the skeleton of an algorithm, deferring some steps to subclasses/callbacks.

```java
@Service
public class DataService {
    @Autowired private JdbcTemplate jdbcTemplate;

    public List<User> findUsers(String status) {
        // JdbcTemplate handles: connection, statement, error handling, closing
        // You only provide: SQL + RowMapper
        return jdbcTemplate.query(
            "SELECT * FROM users WHERE status = ?",
            (rs, rowNum) -> User.builder()
                .id(rs.getLong("id"))
                .name(rs.getString("name"))
                .build(),
            status
        );
    }
}
```

---

## 21.5 Strategy Pattern — Multiple Implementations

```java
// ─── Strategy interface ───────────────────────────────────────────
public interface PaymentStrategy {
    PaymentResult process(PaymentRequest request);
    String getType();
}

// ─── Concrete strategies ──────────────────────────────────────────
@Component
public class CreditCardPayment implements PaymentStrategy {
    @Override
    public PaymentResult process(PaymentRequest request) { ... }
    @Override
    public String getType() { return "CREDIT_CARD"; }
}

@Component
public class UpiPayment implements PaymentStrategy {
    @Override
    public PaymentResult process(PaymentRequest request) { ... }
    @Override
    public String getType() { return "UPI"; }
}

// ─── Context: selects strategy at runtime ─────────────────────────
@Service
public class PaymentService {

    private final Map<String, PaymentStrategy> strategies;

    // Spring injects ALL PaymentStrategy beans as a Map (key = bean name)
    @Autowired
    public PaymentService(List<PaymentStrategy> strategyList) {
        this.strategies = strategyList.stream()
            .collect(Collectors.toMap(PaymentStrategy::getType, Function.identity()));
    }

    public PaymentResult processPayment(PaymentRequest request) {
        PaymentStrategy strategy = strategies.get(request.getPaymentType());
        if (strategy == null) throw new UnsupportedPaymentTypeException(request.getPaymentType());
        return strategy.process(request);
    }
}
```

---

## 21.6 Observer Pattern — Spring Events

```java
// Publisher
eventPublisher.publishEvent(new OrderPlacedEvent(order));

// Observer 1
@EventListener
public void sendEmail(OrderPlacedEvent event) { ... }

// Observer 2
@EventListener
public void updateInventory(OrderPlacedEvent event) { ... }

// Publisher doesn't know about observers — loose coupling
```

---

## 21.7 Builder Pattern — ResponseEntity, Pageable

```java
// ResponseEntity uses builder
return ResponseEntity.status(HttpStatus.CREATED)
    .header("X-Custom-Header", "value")
    .contentType(MediaType.APPLICATION_JSON)
    .body(dto);

// PageRequest builder
PageRequest.of(0, 10, Sort.by("name").ascending());
```

---

## 21.8 Decorator Pattern — Filter Chain

Spring Security's `FilterChain` is a classic decorator — each filter wraps the next.

```
Request → JwtFilter → CorsFilter → RateLimitFilter → Controller
Response ← JwtFilter ← CorsFilter ← RateLimitFilter ← Controller
```

---

# Chapter 22: Common Pitfalls & Gotchas


## 22.1 The Proxy Bypass Problem

```java
// @Transactional, @Cacheable, @Async, @Retryable — ALL fail on self-invocation

@Service
public class UserService {

    @Transactional
    public void createUserWithProfile(CreateUserRequest req) {
        createUser(req);        // ❌ self-call — no transaction!
        createProfile(req);     // ❌ self-call — no transaction!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createUser(CreateUserRequest req) { ... }

    @Transactional
    public void createProfile(CreateUserRequest req) { ... }
}

// ✅ Fix: move methods to a separate bean OR inject self
```

---

## 22.2 LazyInitializationException

```java
// ❌ COMMON MISTAKE: Accessing lazy collection OUTSIDE @Transactional
@RestController
public class UserController {
    @Autowired private UserRepository userRepository;

    @GetMapping("/{id}")
    public String getOrders(@PathVariable Long id) {
        User user = userRepository.findById(id).get(); // transaction ends here!
        return user.getOrders().size() + " orders"; // ❌ LazyInitializationException!
        // Hibernate session is closed, lazy collection cannot be loaded
    }
}

// ✅ Fixes:
// 1. Use @Transactional on the controller method (discouraged — controller shouldn't have transactions)
// 2. Use @EntityGraph or JOIN FETCH in repository method
// 3. Load what you need in the service layer (within @Transactional)
// 4. Use DTOs projected from the query
```

---

## 22.3 open-in-view Anti-Pattern

```properties
# Spring Boot enables this by DEFAULT — causes silent N+1 problems!
spring.jpa.open-in-view=true   # default

# What it does: keeps Hibernate session open until the HTTP response is sent
# This lets lazy collections load in the view layer (controller/serializer)
# But: causes accidental lazy loading → unpredictable query counts

# ✅ Disable it — forces you to be explicit about what you load
spring.jpa.open-in-view=false
```

---

## 22.4 @Transactional on Interface vs Class

```java
// ❌ Putting @Transactional on an interface is unreliable with CGLIB proxies
public interface UserService {
    @Transactional  // ❌ May not work with class-based proxy
    User createUser(CreateUserRequest req);
}

// ✅ Always put @Transactional on the implementation class
@Service
public class UserServiceImpl implements UserService {
    @Transactional  // ✅ Correct — on the class
    public User createUser(CreateUserRequest req) { ... }
}
```

---

## 22.5 equals() and hashCode() in JPA Entities

```java
// ❌ Using @Data (Lombok) on JPA entities is dangerous!
// Lombok @Data generates equals/hashCode using ALL fields
// Including 'id' which is null before persist → breaks Set/HashMap usage

@Entity
@Data  // ❌ Don't use on entities
public class User { ... }

// ✅ Use @EqualsAndHashCode with only stable fields
@Entity
@Getter @Setter
@EqualsAndHashCode(of = "email")  // Use a natural/business key, not id
public class User {
    @Id @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String email; // stable business key

    // equals/hashCode based on email only — consistent before and after persist
}
```

---

## 22.6 Circular Dependency

```java
// ❌ Circular dependency — Spring cannot resolve
@Service
public class ServiceA {
    @Autowired private ServiceB serviceB; // A needs B
}

@Service
public class ServiceB {
    @Autowired private ServiceA serviceA; // B needs A → circular!
}

// ✅ Fix 1: Restructure — extract common logic into ServiceC
// ✅ Fix 2: @Lazy on one injection
@Service
public class ServiceA {
    @Autowired @Lazy
    private ServiceB serviceB; // proxy injected, resolved on first use
}

// ✅ Fix 3: Use setter injection (allows post-construction wiring)
// ✅ Fix 4: Use ApplicationContext.getBean() (runtime lookup)
```

---

## 22.7 @SpringBootTest is Slow — Use Slices

```java
// ❌ Full context for every test — very slow
@SpringBootTest
class ProductRepositoryTest { ... }

// ✅ Use test slices — only load what you need
@DataJpaTest        // only JPA context
@WebMvcTest         // only MVC layer (controllers, filters)
@DataRedisTest      // only Redis
@JsonTest           // only JSON serialization

// @WebMvcTest — fast, only loads controller layer
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean UserService userService; // mock the service layer
}
```

---

## 22.8 Thread Safety in Singleton Beans

```java
// ❌ DANGEROUS: mutable state in a singleton bean
@Service
public class CounterService {
    private int count = 0;  // shared across ALL threads!

    public int increment() {
        return ++count;  // ❌ Race condition!
    }
}

// ✅ Use atomic types or synchronized
@Service
public class CounterService {
    private final AtomicInteger count = new AtomicInteger(0);

    public int increment() {
        return count.incrementAndGet(); // ✅ Thread-safe
    }
}

// ✅ Or use stateless service (preferred)
@Service
public class UserService {
    // No instance variables that change — all state in method parameters/locals
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
}
```

---

## 22.9 Checked vs Unchecked Exceptions in @Transactional

```java
// Spring only rolls back on RuntimeException (unchecked) by default!

@Transactional
public void processPayment() throws IOException {
    chargeCard();
    throw new IOException("Connection lost"); // ❌ COMMITS despite exception!
}

// ✅ Fix 1: Wrap in RuntimeException
@Transactional
public void processPayment() {
    try {
        chargeCard();
    } catch (IOException e) {
        throw new PaymentProcessingException("Connection lost", e); // unchecked
    }
}

// ✅ Fix 2: Explicit rollbackFor
@Transactional(rollbackFor = IOException.class)
public void processPayment() throws IOException { ... }
```

---

## 22.10 @Value Not Working in @PostConstruct

```java
// ❌ WRONG: @Value injection happens AFTER constructor, but before @PostConstruct
@Component
public class MyService {
    @Value("${app.max-size}")
    private int maxSize;

    // ✅ This WORKS — @PostConstruct runs after @Value injection is complete
    @PostConstruct
    public void init() {
        System.out.println(maxSize); // ✅ Value is set here
    }

    // ❌ This FAILS — constructor runs BEFORE @Value injection
    public MyService() {
        System.out.println(maxSize); // ❌ maxSize = 0 (default int value)
    }
}
```

---

# Chapter 23: Quick Reference Cheatsheet

## Annotations Summary

| Annotation | Purpose |
|---|---|
| `@SpringBootApplication` | Entry point. `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan` |
| `@Component` | Generic bean. Detected by component scan. |
| `@Service` | Business layer bean. Semantic alias for `@Component`. |
| `@Repository` | DAO layer bean. Adds exception translation. |
| `@RestController` | `@Controller` + `@ResponseBody`. Handles HTTP, returns JSON. |
| `@Configuration` | Class provides bean definitions via `@Bean` methods. |
| `@Bean` | Method produces a Spring-managed bean. |
| `@Autowired` | Inject dependency by type. |
| `@Qualifier("name")` | Resolve ambiguity when multiple beans of same type exist. |
| `@Primary` | Preferred bean when multiple candidates exist. |
| `@Value("${key}")` | Inject property from `application.properties`. |
| `@PostConstruct` | Run after dependency injection, before bean is used. |
| `@PreDestroy` | Run before bean is destroyed on shutdown. |
| `@Transactional` | Wrap method in a database transaction. |
| `@Profile("dev")` | Register bean only when specified profile is active. |
| `@Scope("prototype")` | Create new instance each time bean is requested. |
| `@RequestScope` | One bean instance per HTTP request. |
| `@SessionScope` | One bean instance per HTTP session. |
| `@ExceptionHandler` | Handle specific exceptions in a controller. |
| `@ControllerAdvice` | Global exception handler across all controllers. |
| `@Valid` | Trigger Bean Validation on method parameter. |
| `@Entity` | JPA entity mapped to a database table. |
| `@Id` / `@GeneratedValue` | Primary key and its generation strategy. |
| `@OneToMany` / `@ManyToOne` | JPA relationship mapping. |
| `@Query` | Custom JPQL or native SQL on repository method. |
| `@Modifying` | Marks `@Query` as `UPDATE` or `DELETE` operation. |
| `@EntityGraph` | Specify which related entities to eagerly fetch. |
| `@BatchSize(size=N)` | Hibernate: batch N collections in one `IN` query. |
| `@PageableDefault` | Default pagination/sort for `Pageable` controller params. |
| `@EnableWebSecurity` | Enable Spring Security configuration. |
| `@PreAuthorize` | Method-level security with SpEL expression. |
| `@ConfigurationProperties` | Bind properties file to a type-safe Java class. |
| `@Conditional` | Register bean only if a condition is met. |
| `@Lookup` | Override method to return new prototype bean from singleton. |

---

## Final Checklist

### Core Spring
- [ ] Explain IoC and DI with examples
- [ ] Describe the complete bean lifecycle (all steps)
- [ ] Constructor vs field injection — argue why constructor is better
- [ ] How does `@Transactional` work internally (proxy)?
- [ ] Self-invocation bypass — why and how to fix

### JPA/Database
- [ ] What is the N+1 problem? Demonstrate with code. Give 3 solutions.
- [ ] Difference between `@Query` and derived methods
- [ ] When to use Specification vs Criteria API
- [ ] FetchType defaults for each relationship type
- [ ] What does `open-in-view` do?

### Design & Architecture
- [ ] Explain AOP — pointcut, advice, join point, weaving
- [ ] Implement a custom annotation with AOP
- [ ] Which design patterns does Spring use? Give 5 examples.
- [ ] Circuit breaker pattern — 3 states and transitions

### Async & Performance
- [ ] Difference between `@Async` and `@Scheduled`
- [ ] What happens on self-invocation of `@Cacheable`?
- [ ] How to handle exceptions in `@Async` void methods?

### Testing
- [ ] Difference between `@SpringBootTest`, `@DataJpaTest`, `@WebMvcTest`
- [ ] `@MockBean` vs `@Mock` — when to use each
- [ ] How to test an `@Async` method

---

---
## Top 20 Must-Know Questions

**1. What is the Spring IoC Container?**
The IoC container instantiates, configures, and manages beans. `ApplicationContext` is the primary interface. It inverts the control of object creation from the developer to the framework.

**2. Difference between `@Component`, `@Service`, `@Repository`, `@Controller`?**
All are specializations of `@Component` for component scanning. `@Repository` adds exception translation. `@Service` and `@Controller` are purely semantic. `@RestController` adds `@ResponseBody`.

**3. Constructor vs Field injection — which is preferred and why?**
Constructor injection is preferred: fields can be `final` (immutable), dependencies are explicit, testing is easy (no Spring needed), circular deps detected at startup. Field injection hides dependencies, prevents immutability, and requires reflection.

**4. What is Bean Scope? Name all scopes.**
Scope defines how many instances are created. **Singleton** (default, 1 per container), **Prototype** (new per request), **Request** (1 per HTTP request), **Session** (1 per HTTP session), **Application** (1 per ServletContext), **WebSocket** (1 per WS session).

**5. What is the N+1 problem in JPA?**
Loading N entities triggers N additional queries for lazy collections = 1+N DB round trips. Fix with JOIN FETCH, `@EntityGraph`, `@BatchSize`, or DTO projections.

**6. Difference between Criteria API and Specification?**
Both build dynamic queries. Criteria API is verbose and low-level. Specification wraps Criteria in composable predicates via `.and()`/`.or()` and works with `JpaSpecificationExecutor`.

**7. What does `@Transactional` do? What are its pitfalls?**
Wraps a method in a DB transaction. Pitfalls: self-invocation bypasses the proxy, only works on `public` methods, checked exceptions don't trigger rollback by default.

**8. What is `@ControllerAdvice`?**
A global exception handler that intercepts exceptions from any `@Controller`. `@ExceptionHandler` inside it handles specific exception types. `@RestControllerAdvice` adds `@ResponseBody`.

**9. What is `@Profile`?**
Conditionally registers beans based on `spring.profiles.active`. Built on `@Conditional`. Use `!prod` to activate for everything except production.

**10. What is auto-configuration in Spring Boot?**
Spring Boot reads `AutoConfiguration.imports`, finds auto-config classes, and registers beans if `@Conditional` conditions are met (e.g., `@ConditionalOnClass`, `@ConditionalOnMissingBean`).

**11. What is `@SpringBootApplication`?**
Shortcut for `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`. Bootstraps the application.

**12. What is the bean lifecycle order?**
Constructor → `@PostConstruct` → `afterPropertiesSet()` → `init-method` → **[in use]** → `@PreDestroy` → `destroy()` → `destroyMethod`

**13. How to inject a prototype bean into a singleton?**
`@Autowired` alone gives the same instance always. Solutions: `ApplicationContext.getBean()`, `ObjectFactory<T>`, or `@Lookup` method injection.

**14. Difference between `@Query` and derived query methods?**
Derived methods: Spring generates JPQL from the method name automatically. `@Query`: you write JPQL or native SQL. Use `@Query` when method names become unreadable or queries are complex.

**15. What is `FetchType.LAZY` vs `EAGER`?**
`LAZY`: related entity loaded on first access (uses proxy). `EAGER`: always loaded with a JOIN. Best practice: keep `LAZY`, use `JOIN FETCH` per use-case.

**16. What is `@Modifying`?**
Required for `@Query` methods that `UPDATE` or `DELETE`. Without it, Spring throws an exception. Must be combined with `@Transactional`.

**17. How does pagination work in Spring Data?**
Repository methods accept `Pageable`. Use `PageRequest.of(page, size, sort)`. Returns `Page<T>` (includes COUNT query) or `Slice<T>` (no COUNT, just `hasNext()`).

**18. What is `@EntityGraph`?**
Declarative way to fetch related entities eagerly for a specific query or method, without changing the global `FetchType`. Cleaner alternative to `JOIN FETCH`.

**19. What is `@ConfigurationProperties`?**
Binds a prefix from `application.properties`/`yml` to a type-safe Java class. Better than `@Value` for groups of related properties. Supports validation with `@Validated`.

**20. What is `BeanPostProcessor`?**
Intercepts every bean after creation. Called before and after initialization. Spring AOP creates proxies via `BeanPostProcessor`. You can wrap beans in custom proxies here.

---

