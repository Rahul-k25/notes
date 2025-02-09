## **1. How does the Internet work?**
The internet is a global network of interconnected computers and devices that communicate using standardized protocols. It enables data transfer, communication, and services like websites, emails, and streaming.

### **Key Concepts:**
- **Packets & Data Transfer:** Data is broken into packets and transmitted over networks.
- **Protocols:** Standard rules for communication (TCP/IP, HTTP, HTTPS, FTP, etc.).
- **Internet Service Providers (ISPs):** Companies that provide access to the internet.
- **Client-Server Model:** Clients (browsers, mobile apps) request data from servers (websites, APIs).
- **Routing & IP Addresses:** Data is sent between devices using unique IP addresses.
- **Subnetworks & Autonomous Systems:** The internet is structured into networks managed by ISPs and organizations.

**📖 Related Resources:**
- [How the Internet Works – FreeCodeCamp](https://www.freecodecamp.org/news/how-does-the-internet-work/)
- [CS50 Lecture on Internet](https://cs50.harvard.edu/web/2020/weeks/0/)

---

## **2. What is HTTP?**
HTTP (HyperText Transfer Protocol) is the foundation of communication on the web. It defines how requests and responses are sent between clients (browsers) and servers.

### **Key Concepts:**
- **HTTP Request-Response Cycle:** Clients send requests; servers respond with data.
- **HTTP Methods:**
  - `GET`: Retrieve data.
  - `POST`: Send data.
  - `PUT`: Update data.
  - `DELETE`: Remove data.
- **Status Codes:**
  - `200 OK`: Successful response.
  - `404 Not Found`: Resource not available.
  - `500 Internal Server Error`: Server-side issue.
- **Headers & Body:** Metadata and content exchanged in requests and responses.
- **Connectionless & Stateless:** Each request is independent; servers don't retain client state.

**📖 Related Resources:**
- [MDN Web Docs on HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [HTTP Explained – GeeksforGeeks](https://www.geeksforgeeks.org/http-hypertext-transfer-protocol/)

---

## **3. What is a Domain Name?**
A domain name is a human-readable address used to access websites. It maps to an IP address using the Domain Name System (DNS).

### **Key Concepts:**
- **Structure:**
  - `www.example.com`
    - `www`: Subdomain.
    - `example`: Domain name.
    - `.com`: Top-Level Domain (TLD).
- **Domain Registrars:** Companies that sell domain names (GoDaddy, Namecheap, Google Domains).
- **DNS Resolution:** Converts domain names into IP addresses.
- **Types of Domains:**
  - TLD (Top-Level Domains): `.com`, `.org`, `.net`, etc.
  - ccTLD (Country Code TLD): `.us`, `.in`, `.uk`, etc.
  - Subdomains: `blog.example.com`, `shop.example.com`.

**📖 Related Resources:**
- [ICANN - Domain Names](https://www.icann.org/)
- [What is a Domain Name? – Namecheap](https://www.namecheap.com/resources/what-is-a-domain-name/)

---

## **4. What is Hosting?**
Web hosting is the service of storing and serving website files on the internet. Hosting providers offer servers and infrastructure to keep websites online.

### **Key Concepts:**
- **Types of Hosting:**
  - **Shared Hosting:** Multiple websites on a single server.
  - **VPS Hosting:** Virtualized private resources on a shared server.
  - **Dedicated Hosting:** A full server dedicated to one website.
  - **Cloud Hosting:** Websites hosted on a network of virtual servers.
  - **Managed Hosting:** Hosting providers manage server maintenance.
- **CDN (Content Delivery Network):** Improves performance by caching content globally.
- **SSL (Secure Sockets Layer):** Encrypts communication for security.

**📖 Related Resources:**
- [Web Hosting Guide – Hostinger](https://www.hostinger.com/tutorials/what-is-web-hosting)
- [Cloud Hosting Explained – AWS](https://aws.amazon.com/what-is-cloud-hosting/)

---

## **5. DNS and How It Works?**
The Domain Name System (DNS) is a hierarchical system that translates domain names into IP addresses.

### **Key Concepts:**
- **DNS Query Process:**
  1. User enters `www.example.com` in a browser.
  2. The browser asks the recursive DNS resolver for the IP address.
  3. The resolver queries the Root DNS Server.
  4. The Root Server directs it to the TLD Name Server (`.com` server).
  5. The TLD server directs it to the Authoritative Name Server for `example.com`.
  6. The resolver fetches and returns the IP address to the browser.
- **Types of DNS Records:**
  - `A Record`: Maps domain to IPv4 address.
  - `AAAA Record`: Maps domain to IPv6 address.
  - `CNAME Record`: Alias for another domain.
  - `MX Record`: Mail server mapping.
- **DNS Caching:** Speeds up resolution by storing recent queries.

**📖 Related Resources:**
- [Cloudflare DNS Guide](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [How DNS Works – MDN](https://developer.mozilla.org/en-US/docs/Learn/Performance/DNS)

---

## **6. Browsers and How They Work?**
Web browsers are software applications that retrieve, interpret, and display web pages.

### **Key Concepts:**
- **Rendering Engine:** Converts HTML, CSS, and JavaScript into a visual page.
  - Chrome: Blink.
  - Firefox: Gecko.
  - Safari: WebKit.
- **Steps in Page Rendering:**
  1. **Parsing HTML:** Creates a DOM (Document Object Model).
  2. **Parsing CSS:** Creates a CSSOM (CSS Object Model).
  3. **Render Tree Construction:** Combines DOM & CSSOM.
  4. **Layout & Painting:** Determines positions & renders content.
  5. **Compositing:** Combines elements into the final page.
- **JavaScript Engine:**
  - Executes JavaScript code.
  - Uses Just-In-Time (JIT) Compilation for performance.
- **Browser Components:**
  - **UI Layer:** Address bar, tabs, navigation buttons.
  - **Networking:** Manages HTTP requests.
  - **Storage:** Cookies, LocalStorage, IndexedDB.

**📖 Related Resources:**
- [Inside a Modern Browser – Google Developers](https://developer.chrome.com/docs/web-platform/how-browsers-work/)
- [MDN Guide on Browsers](https://developer.mozilla.org/en-US/docs/Web/Performance)
