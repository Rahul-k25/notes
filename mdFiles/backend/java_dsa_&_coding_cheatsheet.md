<link rel="stylesheet" href="../../assets/css/styles.css">

# Java DSA & Coding Cheatsheet — Complete Reference

> **Scope:** String, StringBuilder, Arrays, Collections (List, Set, Map variants), Queue, Deque, Stack, PriorityQueue, Sorting (Comparator/Comparable), Streams, and more.  
> Every section includes: explanation → all methods → code examples → pros/cons/alternatives.

---

## Table of Contents

1. [String](#1-string)
2. [StringBuilder & StringBuffer](#2-stringbuilder--stringbuffer)
3. [Arrays (java.util.Arrays)](#3-arrays-javautilarrays)
4. [ArrayList](#4-arraylist)
5. [LinkedList](#5-linkedlist)
6. [ArrayDeque (Stack & Queue replacement)](#6-arraydeque-stack--queue-replacement)
7. [PriorityQueue (Min/Max Heap)](#7-priorityqueue-minmax-heap)
8. [HashMap](#8-hashmap)
9. [LinkedHashMap](#9-linkedhashmap)
10. [TreeMap](#10-treemap)
11. [HashSet](#11-hashset)
12. [LinkedHashSet](#12-linkedhashset)
13. [TreeSet](#13-treeset)
14. [Comparator & Comparable](#14-comparator--comparable)
15. [Sorting](#15-sorting)
16. [Java Streams](#16-java-streams)
17. [Collections Utility Class](#17-collections-utility-class)
18. [Math Utility Class](#18-math-utility-class)
19. [Bit Manipulation Tricks](#19-bit-manipulation-tricks)
20. [Quick Reference — Time Complexities](#20-quick-reference--time-complexities)

---

## 1. String

### What is it?
`String` in Java is **immutable** — every operation that seems to modify a string actually creates a new `String` object. Strings are stored in the **String Pool** (heap), and identical literals share the same reference.

**Key implication for DSA:** Concatenating strings in a loop is `O(n²)` — use `StringBuilder` instead.

### All Methods

```java
String s = "Hello, World!";

// ── Length & Access ──────────────────────────────────────────
s.length()               // 13  → number of chars
s.charAt(0)              // 'H' → char at index
s.indexOf('o')           // 4   → first occurrence (-1 if not found)
s.indexOf('o', 5)        // 8   → first occurrence starting from index 5
s.lastIndexOf('o')       // 8   → last occurrence
s.isEmpty()              // false
s.isBlank()              // false (Java 11+) → true if empty or only whitespace

// ── Substring ────────────────────────────────────────────────
s.substring(7)           // "World!"      → from index to end
s.substring(7, 12)       // "World"       → [start, end)

// ── Search & Compare ─────────────────────────────────────────
s.contains("World")      // true
s.startsWith("Hello")    // true
s.endsWith("!")          // true
s.equals("Hello, World!")          // true  → case-sensitive
s.equalsIgnoreCase("hello, world!") // true
s.compareTo("Hello, World!")       // 0     → lexicographic compare
s.compareToIgnoreCase("hello")     // positive (s > "hello" lexicographically)

// ── Case ─────────────────────────────────────────────────────
s.toUpperCase()          // "HELLO, WORLD!"
s.toLowerCase()          // "hello, world!"

// ── Trim & Strip ─────────────────────────────────────────────
"  hi  ".trim()          // "hi" → removes leading/trailing ASCII whitespace
"  hi  ".strip()         // "hi" → Unicode-aware (Java 11+), prefer this
"  hi  ".stripLeading()  // "hi  "
"  hi  ".stripTrailing() // "  hi"

// ── Replace ──────────────────────────────────────────────────
s.replace('l', 'r')      // "Herro, Worrd!" → replaces ALL occurrences (char)
s.replace("World", "Java") // "Hello, Java!"  → replaces ALL occurrences (string)
s.replaceAll("[aeiou]", "*") // regex-based replace all
s.replaceFirst("[aeiou]", "*") // regex-based replace first

// ── Split ────────────────────────────────────────────────────
"a,b,c".split(",")       // ["a", "b", "c"]
"a,b,c".split(",", 2)    // ["a", "b,c"]  → limit splits
"a  b  c".split("\\s+") // ["a", "b", "c"] → split on any whitespace

// ── Join ─────────────────────────────────────────────────────
String.join(", ", "a", "b", "c")      // "a, b, c"
String.join("-", List.of("x","y","z")) // "x-y-z"

// ── Conversion ───────────────────────────────────────────────
String.valueOf(42)         // "42"  → int to String
String.valueOf('c')        // "c"
String.valueOf(true)       // "true"
Integer.parseInt("42")     // 42   → String to int
Double.parseDouble("3.14") // 3.14
"hello".toCharArray()      // char[] {'h','e','l','l','o'}
new String(charArray)      // char[] back to String

// ── Char Classification (via Character class) ─────────────────
Character.isDigit('5')     // true
Character.isLetter('a')    // true
Character.isLetterOrDigit('a') // true
Character.isUpperCase('A') // true
Character.isLowerCase('a') // true
Character.isWhitespace(' ')// true
Character.toUpperCase('a') // 'A'
Character.toLowerCase('A') // 'a'
(char)('a' - 'a')          // 0  → trick: char to 0-25 index
(char)('a' + 1)            // 'b' → trick: index to char

// ── Formatting (Java 15+) ─────────────────────────────────────
String.format("Name: %s, Age: %d", "Luffy", 25) // "Name: Luffy, Age: 25"
"Hello %s".formatted("World")  // Java 15+ instance method

// ── Repeat ────────────────────────────────────────────────────
"ab".repeat(3)             // "ababab" (Java 11+)

// ── Lines (Java 11+) ──────────────────────────────────────────
"a\nb\nc".lines().collect(Collectors.toList()) // ["a", "b", "c"]

// ── intern() ─────────────────────────────────────────────────
// Forces the string into the pool; rarely needed in DSA
```

### Code Example — Frequency Count of Characters

```java
String s = "programming";
int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;
// freq[0] = 1 (a), freq[6] = 2 (g), freq[17] = 2 (r), etc.
```

### Code Example — Palindrome Check

```java
boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l) != s.charAt(r)) return false;
        l++; r--;
    }
    return true;
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Thread-safe (immutable) | Every modification creates a new object |
| Can be cached / shared | Concatenation in loops is O(n²) |
| String pool saves memory for literals | `==` comparison compares references, not content |

> **Use `StringBuilder`** for any mutation-heavy code. Use `String` for read-only values.

---

## 2. StringBuilder & StringBuffer

### What is it?
- `StringBuilder` — **mutable**, **not thread-safe**, faster. Use this in DSA always.
- `StringBuffer` — **mutable**, **thread-safe** (synchronized), slower. Use only in multi-threaded code.

Both have the same API. `StringBuilder` is preferred in competitive/DSA contexts.

### All Methods

```java
StringBuilder sb = new StringBuilder();
StringBuilder sb2 = new StringBuilder("hello");
StringBuilder sb3 = new StringBuilder(100); // pre-allocate capacity (avoids resizing)

// ── Append ────────────────────────────────────────────────────
sb.append("hello");       // appends String
sb.append(42);            // appends int (auto-converted)
sb.append('!');           // appends char
sb.append(true);          // appends boolean
sb.append(3.14);          // appends double
sb.append(new char[]{'a','b'}); // appends char[]

// ── Insert ────────────────────────────────────────────────────
sb.insert(0, "START ");   // inserts at index 0

// ── Delete ────────────────────────────────────────────────────
sb.delete(0, 5);          // deletes [start, end)
sb.deleteCharAt(2);       // deletes char at index

// ── Replace ───────────────────────────────────────────────────
sb.replace(0, 3, "HEY");  // replaces [start, end) with given string

// ── Reverse ───────────────────────────────────────────────────
sb.reverse();             // reverses in place — O(n), very useful!

// ── Access ────────────────────────────────────────────────────
sb.charAt(0)              // char at index
sb.indexOf("lo")          // first occurrence of substring
sb.lastIndexOf("l")       // last occurrence
sb.length()               // current length
sb.capacity()             // internal buffer size (default 16 + initial length)
sb.substring(2)           // returns String from index 2
sb.substring(1, 4)        // returns String [1, 4)

// ── Modify ────────────────────────────────────────────────────
sb.setCharAt(0, 'H');     // set char at index
sb.setLength(3);          // truncate or pad with '\0' to given length

// ── Convert ───────────────────────────────────────────────────
sb.toString();            // convert back to String

// ── Chaining (all mutating methods return 'this') ─────────────
String result = new StringBuilder()
    .append("Hello")
    .append(", ")
    .append("World")
    .reverse()
    .toString(); // "!dlroW ,olleH"
```

### Code Example — Reverse Words in a String

```java
String reverseWords(String s) {
    String[] words = s.trim().split("\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        sb.append(words[i]);
        if (i > 0) sb.append(" ");
    }
    return sb.toString();
}
```

### Code Example — Build Result in O(n) Instead of O(n²)

```java
// ❌ BAD — O(n²) due to String immutability
String result = "";
for (int i = 0; i < 10000; i++) result += i; // creates 10000 new String objects!

// ✅ GOOD — O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) sb.append(i);
String result = sb.toString();
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) amortized append | Not thread-safe (StringBuilder) |
| In-place reverse is extremely handy | Slightly more verbose than `+` operator |
| Pre-allocatable capacity | StringBuffer has overhead from synchronization |

---

## 3. Arrays (java.util.Arrays)

### What is it?
Java arrays are fixed-size, zero-indexed. `java.util.Arrays` is a utility class with static methods for sorting, searching, copying, and filling arrays.

### Declaration & Initialization

```java
int[] arr = new int[5];                   // [0, 0, 0, 0, 0]
int[] arr = {1, 2, 3, 4, 5};             // inline init
int[] arr = new int[]{1, 2, 3};          // explicit inline
int[][] matrix = new int[3][4];           // 3 rows, 4 cols
char[] chars = new char[26];              // for frequency maps
```

### All java.util.Arrays Methods

```java
import java.util.Arrays;

int[] arr = {5, 3, 1, 4, 2};

// ── Sort ──────────────────────────────────────────────────────
Arrays.sort(arr);                    // [1, 2, 3, 4, 5] — in-place, O(n log n) dual-pivot quicksort
Arrays.sort(arr, 1, 4);             // sort only [1..3] range (inclusive start, exclusive end)

// For objects — uses TimSort (stable)
Integer[] boxed = {5, 3, 1, 4, 2};
Arrays.sort(boxed);
Arrays.sort(boxed, Comparator.reverseOrder()); // descending

// Custom sort on int[] — must box to Integer[]
Integer[] a = Arrays.stream(arr).boxed().toArray(Integer[]::new);
Arrays.sort(a, (x, y) -> y - x); // descending

// ── Search (array must be sorted first!) ─────────────────────
Arrays.binarySearch(arr, 3)         // returns index of 3, or (-(insertion point) - 1) if not found

// ── Fill ──────────────────────────────────────────────────────
Arrays.fill(arr, 0)                 // fill entire array with 0
Arrays.fill(arr, 1, 4, -1)         // fill [1..3] with -1

// ── Copy ──────────────────────────────────────────────────────
int[] copy = Arrays.copyOf(arr, arr.length)    // shallow copy, same length
int[] copy = Arrays.copyOf(arr, 10)            // pads with 0s if longer
int[] copy = Arrays.copyOfRange(arr, 1, 4)     // copies [1..3]

// ── Compare & Equals ──────────────────────────────────────────
Arrays.equals(arr, copy)            // true if same length and same elements
Arrays.deepEquals(matrix1, matrix2) // for 2D arrays

// ── Convert to String ─────────────────────────────────────────
Arrays.toString(arr)                // "[1, 2, 3, 4, 5]"
Arrays.deepToString(matrix)         // "[[1, 2], [3, 4]]"

// ── Convert to List ───────────────────────────────────────────
// NOTE: Only works on Object arrays, not primitives
Integer[] boxed = {1, 2, 3};
List<Integer> list = Arrays.asList(boxed);  // Fixed-size! Cannot add/remove.
List<Integer> mutable = new ArrayList<>(Arrays.asList(boxed)); // mutable copy

// ── Stream ────────────────────────────────────────────────────
int sum = Arrays.stream(arr).sum();
int max = Arrays.stream(arr).max().getAsInt();
long count = Arrays.stream(arr).filter(x -> x > 2).count();
```

### Common Patterns in DSA

```java
// Prefix Sum Array
int[] prefix = new int[n + 1];
for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + arr[i];
int rangeSum = prefix[r+1] - prefix[l]; // sum of arr[l..r]

// 2D Matrix Traversal
for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        matrix[r][c] = r * cols + c;

// Sliding Window Max (monotonic deque — see ArrayDeque section)

// Two Pointers on Sorted Array
int l = 0, r = arr.length - 1;
while (l < r) { /* ... */ }
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Cache-friendly (contiguous memory) | Fixed size — no dynamic resizing |
| O(1) random access | Cannot store primitives in generic collections |
| Primitives avoid boxing overhead | `Arrays.asList()` returns fixed-size view |

> **Alternative:** Use `ArrayList<Integer>` when you need dynamic sizing. Use `int[]` for performance-critical inner loops.

---

## 4. ArrayList

### What is it?
`ArrayList<E>` is a **resizable array** backed by an `Object[]`. It doubles in size when capacity is exceeded (amortized O(1) add).

```java
import java.util.ArrayList;
import java.util.List;

List<Integer> list = new ArrayList<>();
List<Integer> list = new ArrayList<>(100); // pre-allocate capacity
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3)); // from array
List<Integer> list = new ArrayList<>(otherList); // copy constructor

// ── Add ───────────────────────────────────────────────────────
list.add(10);            // append to end — O(1) amortized
list.add(0, 99);         // insert at index — O(n) shifts everything right

// ── Access ────────────────────────────────────────────────────
list.get(0)              // O(1) random access
list.set(1, 55)          // O(1) replace element at index
list.size()              // number of elements
list.isEmpty()           // true if size == 0

// ── Remove ────────────────────────────────────────────────────
list.remove(0)           // remove by index — O(n) shifts
list.remove(Integer.valueOf(10)) // remove by value — O(n) scan + shift
                         // ⚠️ remove(int) vs remove(Object) — be careful!

// ── Search ────────────────────────────────────────────────────
list.contains(10)        // O(n) linear scan
list.indexOf(10)         // O(n) first index, -1 if not found
list.lastIndexOf(10)     // O(n) last index

// ── Sub & Copy ────────────────────────────────────────────────
list.subList(1, 4)       // view [1..3] — NOT a copy, backed by original
new ArrayList<>(list.subList(1, 4)) // independent copy of slice

// ── Modify ────────────────────────────────────────────────────
list.clear()             // remove all elements
list.addAll(otherList)   // append all
list.addAll(0, otherList)// insert all at index 0
list.removeAll(otherList)// remove all elements present in otherList
list.retainAll(otherList)// keep only elements present in otherList

// ── Sort ──────────────────────────────────────────────────────
Collections.sort(list)              // ascending (uses TimSort, stable)
list.sort(Comparator.reverseOrder())// descending
list.sort((a, b) -> b - a)          // custom comparator

// ── Convert ───────────────────────────────────────────────────
Object[] arr = list.toArray();
Integer[] arr = list.toArray(new Integer[0]); // typed array
int[] prim = list.stream().mapToInt(Integer::intValue).toArray(); // to int[]

// ── Iterator & ForEach ────────────────────────────────────────
for (int x : list) System.out.println(x);
list.forEach(System.out::println);
list.removeIf(x -> x < 0); // remove all negatives — O(n)

// ── replaceAll ────────────────────────────────────────────────
list.replaceAll(x -> x * 2); // multiply every element by 2
```

### Code Example — Grouping Elements (DSA Pattern)

```java
// Adjacency list for a graph
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
adj.get(0).add(1); // edge 0→1
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) amortized add at end | O(n) insert/delete in the middle |
| O(1) random access (like array) | Boxing overhead for primitives |
| Dynamic sizing | `subList` is a view — mutations affect original |

> **Alternative:** `LinkedList` for frequent insertion/deletion in the middle (though in practice, `ArrayList` wins due to cache locality). Use `int[]` if size is known and performance is critical.

---

## 5. LinkedList

### What is it?
`LinkedList<E>` implements both `List` and `Deque`. It's a **doubly-linked list** — each node has prev and next pointers. Efficient O(1) add/remove at head and tail, but O(n) random access.

> ⚠️ In competitive programming, `ArrayDeque` is almost always better than `LinkedList` for queue/deque operations (better cache locality).

```java
import java.util.LinkedList;

LinkedList<Integer> ll = new LinkedList<>();
LinkedList<Integer> ll = new LinkedList<>(Arrays.asList(1, 2, 3));

// ── List Interface Methods ────────────────────────────────────
ll.add(10)             // append to tail — O(1)
ll.add(0, 99)          // insert at index — O(n) traversal
ll.get(2)              // O(n) — traverses from nearest end
ll.set(1, 55)          // O(n)
ll.remove(Integer.valueOf(10)) // O(n) scan
ll.size()

// ── Deque/Queue Interface Methods (where LinkedList shines) ───
ll.addFirst(1)         // O(1) prepend
ll.addLast(2)          // O(1) append (same as add())
ll.removeFirst()       // O(1) remove head (throws if empty)
ll.removeLast()        // O(1) remove tail (throws if empty)
ll.pollFirst()         // O(1) remove head (returns null if empty)
ll.pollLast()          // O(1) remove tail (returns null if empty)
ll.peekFirst()         // O(1) view head (null if empty)
ll.peekLast()          // O(1) view tail (null if empty)
ll.getFirst()          // O(1) view head (throws if empty)
ll.getLast()           // O(1) view tail (throws if empty)
ll.offerFirst(5)       // O(1) prepend (queue-safe, returns boolean)
ll.offerLast(5)        // O(1) append  (queue-safe, returns boolean)

// ── Stack-like use (push/pop at head) ─────────────────────────
ll.push(99)            // same as addFirst()
ll.pop()               // same as removeFirst()
ll.peek()              // same as peekFirst()
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) add/remove at head and tail | O(n) random access (no index jump) |
| Good for implementing LRU Cache | Extra memory per node (prev + next pointers) |
| Implements both List and Deque | Poor cache locality vs ArrayList |

> **Prefer `ArrayDeque`** for pure deque/queue use. Use `LinkedList` only when you need both List and Deque APIs simultaneously.

---

## 6. ArrayDeque (Stack & Queue replacement)

### What is it?
`ArrayDeque<E>` is a **resizable circular array** that implements `Deque`. It's the **recommended replacement** for both `Stack` and `Queue` in Java.

- As a **Queue** → FIFO: `offer` (enqueue at tail) + `poll` (dequeue from head)
- As a **Stack** → LIFO: `push` (at head) + `pop` (from head)
- As a **Deque** → both ends

> `ArrayDeque` does **not allow null** elements (unlike LinkedList). Slightly faster than `LinkedList` for most operations.

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

Deque<Integer> deque = new ArrayDeque<>();
Queue<Integer> queue = new ArrayDeque<>(); // use as queue
Deque<Integer> stack = new ArrayDeque<>(); // use as stack

// ── Add / Offer ───────────────────────────────────────────────
deque.addFirst(1)      // insert at front (throws if capacity exceeded — rare)
deque.addLast(2)       // insert at back
deque.offerFirst(1)    // insert at front (returns false on failure)
deque.offerLast(2)     // insert at back
deque.push(99)         // same as addFirst — stack convention

// ── Remove / Poll ─────────────────────────────────────────────
deque.removeFirst()    // remove front (throws if empty)
deque.removeLast()     // remove back  (throws if empty)
deque.pollFirst()      // remove front (null if empty) ← prefer this
deque.pollLast()       // remove back  (null if empty) ← prefer this
deque.pop()            // same as removeFirst — stack convention

// ── Peek / Get ────────────────────────────────────────────────
deque.peekFirst()      // view front (null if empty) ← prefer this
deque.peekLast()       // view back  (null if empty)
deque.getFirst()       // view front (throws if empty)
deque.getLast()        // view back  (throws if empty)
deque.peek()           // same as peekFirst

// ── Queue-style API (when declared as Queue<T>) ───────────────
queue.offer(10)        // enqueue at tail
queue.poll()           // dequeue from head
queue.peek()           // view head

// ── Other ─────────────────────────────────────────────────────
deque.size()
deque.isEmpty()
deque.contains(5)      // O(n)
deque.clear()
deque.toArray()
```

### Code Example — BFS with Queue

```java
Queue<Integer> bfsQ = new ArrayDeque<>();
boolean[] visited = new boolean[n];
bfsQ.offer(start);
visited[start] = true;
while (!bfsQ.isEmpty()) {
    int node = bfsQ.poll();
    for (int neighbor : adj.get(node)) {
        if (!visited[neighbor]) {
            visited[neighbor] = true;
            bfsQ.offer(neighbor);
        }
    }
}
```

### Code Example — DFS with Stack (iterative)

```java
Deque<Integer> dfsStack = new ArrayDeque<>();
dfsStack.push(start);
while (!dfsStack.isEmpty()) {
    int node = dfsStack.pop();
    // process node
    for (int neighbor : adj.get(node)) {
        dfsStack.push(neighbor);
    }
}
```

### Code Example — Monotonic Deque (Sliding Window Maximum)

```java
// Given arr[], find max in every window of size k
int[] maxSlidingWindow(int[] arr, int k) {
    int n = arr.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        // Remove indices outside the window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1)
            deque.pollFirst();
        // Remove smaller elements (they'll never be max)
        while (!deque.isEmpty() && arr[deque.peekLast()] < arr[i])
            deque.pollLast();
        deque.offerLast(i);
        if (i >= k - 1) result[i - k + 1] = arr[deque.peekFirst()];
    }
    return result;
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) at both ends | Does not allow null |
| Better cache performance than LinkedList | O(n) contains/remove by value |
| Replaces Stack and Queue cleanly | Not thread-safe (use `BlockingDeque` for concurrency) |

---

## 7. PriorityQueue (Min/Max Heap)

### What is it?
`PriorityQueue<E>` is a **min-heap** by default — `poll()` always returns the smallest element. For a max-heap, use a reversed comparator.

**Internally:** Binary heap stored in an array. `offer()` and `poll()` are O(log n). `peek()` is O(1).

```java
import java.util.PriorityQueue;
import java.util.Collections;

// Min-Heap (default) — smallest element at top
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-Heap — largest element at top
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);

// With initial capacity
PriorityQueue<Integer> pq = new PriorityQueue<>(100);

// From existing collection
PriorityQueue<Integer> pq = new PriorityQueue<>(List.of(3, 1, 4, 1, 5));

// Custom object heap — sort by second element of int[]
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

// ── Core Methods ──────────────────────────────────────────────
pq.offer(5)            // insert — O(log n)  ← prefer over add()
pq.add(5)              // same as offer but throws on failure (rare)
pq.poll()              // remove & return min — O(log n)  (null if empty)
pq.remove()            // same but throws if empty
pq.peek()              // view min — O(1)  (null if empty)
pq.element()           // same but throws if empty
pq.size()
pq.isEmpty()
pq.contains(5)         // O(n) — heap is not sorted for search!
pq.remove(Integer.valueOf(5)) // remove specific element — O(n)
pq.clear()
pq.toArray()           // returns array in NO guaranteed order
```

### Code Example — Kth Largest Element

```java
// Keep a min-heap of size k. The top is always the kth largest.
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) minHeap.poll(); // evict smallest
    }
    return minHeap.peek(); // kth largest
}
```

### Code Example — Merge K Sorted Lists (Classic)

```java
// Each element: int[]{value, listIndex, elementIndex}
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
// offer the first element from each list, then poll and push next
```

### Code Example — Dijkstra's Shortest Path

```java
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]); // {node, dist}
int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
pq.offer(new int[]{src, 0});
while (!pq.isEmpty()) {
    int[] curr = pq.poll();
    int node = curr[0], d = curr[1];
    if (d > dist[node]) continue; // stale entry
    for (int[] edge : adj.get(node)) {
        int next = edge[0], weight = edge[1];
        if (dist[node] + weight < dist[next]) {
            dist[next] = dist[node] + weight;
            pq.offer(new int[]{next, dist[next]});
        }
    }
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(log n) insert + delete-min | O(n) search/delete by value |
| O(1) peek at min/max | Iterating doesn't give sorted order |
| Great for Dijkstra, Kth problems, scheduling | Cannot efficiently update priority of an element |

> **Trick for "decrease key":** Just insert a duplicate entry and skip stale ones when polling (check if dist[node] < d).

---

## 8. HashMap

### What is it?
`HashMap<K, V>` stores **key-value pairs** with O(1) average get/put/remove. Uses hashing internally. **Does not guarantee order.** Allows **one null key** and **multiple null values**.

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> map = new HashMap<>();
Map<String, Integer> map = new HashMap<>(100); // initial capacity
Map<String, Integer> map = new HashMap<>(otherMap); // copy constructor

// ── Put / Add ─────────────────────────────────────────────────
map.put("a", 1)              // insert or update, returns old value or null
map.putIfAbsent("a", 99)     // only puts if key not present, returns current value
map.putAll(otherMap)         // merge all entries

// ── Get ───────────────────────────────────────────────────────
map.get("a")                 // returns value or null
map.getOrDefault("z", 0)     // returns value or default — very useful!

// ── Remove ────────────────────────────────────────────────────
map.remove("a")              // remove by key, returns old value
map.remove("a", 1)           // remove only if key maps to this value (atomic)

// ── Check ─────────────────────────────────────────────────────
map.containsKey("a")         // O(1)
map.containsValue(1)         // O(n) — scans all values
map.isEmpty()
map.size()

// ── Iteration ─────────────────────────────────────────────────
for (Map.Entry<String, Integer> e : map.entrySet())
    System.out.println(e.getKey() + "=" + e.getValue());

for (String key : map.keySet())
    System.out.println(key);

for (int val : map.values())
    System.out.println(val);

map.forEach((k, v) -> System.out.println(k + "=" + v));

// ── Compute Methods (very powerful!) ──────────────────────────
// compute: apply function regardless of key presence
map.compute("a", (k, v) -> v == null ? 1 : v + 1);

// computeIfAbsent: only if key NOT present — great for grouping!
map.computeIfAbsent("list", k -> new ArrayList<>()).add("item");
// builds adjacency list, groups anagrams, etc.

// computeIfPresent: only if key IS present
map.computeIfPresent("a", (k, v) -> v + 10);

// merge: merge old and new value using a function
map.merge("a", 1, Integer::sum);  // if absent: put 1; if present: add 1 to old
// Equivalent to: map.put(k, map.containsKey(k) ? map.get(k) + 1 : 1)

// ── Replace ───────────────────────────────────────────────────
map.replace("a", 99)           // update only if key exists
map.replace("a", 1, 99)        // update only if key maps to exactly 1
map.replaceAll((k, v) -> v * 2) // apply function to all values

// ── Convert to Other Forms ────────────────────────────────────
map.entrySet()   // Set<Map.Entry<K,V>>
map.keySet()     // Set<K>
map.values()     // Collection<V>
```

### Frequency Count Pattern (Most Common DSA Use)

```java
// Count character frequencies
Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray())
    freq.merge(c, 1, Integer::sum);
// OR:
    freq.put(c, freq.getOrDefault(c, 0) + 1);

// Group anagrams
Map<String, List<String>> groups = new HashMap<>();
for (String word : words) {
    char[] chars = word.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}

// Subarray sum equals k (prefix sum + hashmap)
Map<Integer, Integer> prefixCount = new HashMap<>();
prefixCount.put(0, 1);
int sum = 0, count = 0;
for (int num : nums) {
    sum += num;
    count += prefixCount.getOrDefault(sum - k, 0);
    prefixCount.merge(sum, 1, Integer::sum);
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) average get/put/remove | No guaranteed iteration order |
| Flexible key types (any hashable object) | O(n) worst case if many hash collisions |
| Allows null key and values | Not thread-safe (use ConcurrentHashMap) |

---

## 9. LinkedHashMap

### What is it?
`LinkedHashMap<K, V>` extends `HashMap` and maintains **insertion order** (or access order for LRU). Backed by a doubly-linked list on top of the hash table.

```java
import java.util.LinkedHashMap;

Map<String, Integer> map = new LinkedHashMap<>();             // insertion-ordered
Map<String, Integer> map = new LinkedHashMap<>(16, 0.75f, true); // access-ordered (for LRU)

// All HashMap methods apply. Key difference: iteration is ordered.

// ── LRU Cache Pattern ─────────────────────────────────────────
// Override removeEldestEntry to auto-evict when size > capacity
int CAPACITY = 3;
Map<Integer, Integer> lruCache = new LinkedHashMap<>(CAPACITY, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > CAPACITY; // auto-remove least-recently-used
    }
};
lruCache.put(1, 1);
lruCache.put(2, 2);
lruCache.put(3, 3);
lruCache.get(1);    // access 1 → moves to end
lruCache.put(4, 4); // evicts 2 (least recently used)
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Maintains insertion/access order | Slightly more memory than HashMap |
| Perfect for LRU Cache implementation | Slightly slower than HashMap |
| Predictable iteration | |

---

## 10. TreeMap

### What is it?
`TreeMap<K, V>` stores keys in **sorted order** (natural ordering or custom Comparator). Backed by a **Red-Black Tree**. All operations are O(log n).

```java
import java.util.TreeMap;

TreeMap<Integer, String> tmap = new TreeMap<>();          // natural order (ascending)
TreeMap<Integer, String> tmap = new TreeMap<>(Comparator.reverseOrder()); // descending

// All Map methods apply (get, put, remove, containsKey…)

// ── Navigation Methods (TreeMap's killer feature) ─────────────
tmap.firstKey()             // smallest key
tmap.lastKey()              // largest key
tmap.floorKey(5)            // largest key ≤ 5 (null if none)
tmap.ceilingKey(5)          // smallest key ≥ 5 (null if none)
tmap.lowerKey(5)            // largest key < 5 (null if none)
tmap.higherKey(5)           // smallest key > 5 (null if none)

tmap.floorEntry(5)          // Map.Entry with largest key ≤ 5
tmap.ceilingEntry(5)        // Map.Entry with smallest key ≥ 5

// ── Range Views ───────────────────────────────────────────────
tmap.headMap(5)             // keys strictly less than 5
tmap.headMap(5, true)       // keys ≤ 5 (inclusive)
tmap.tailMap(5)             // keys ≥ 5
tmap.tailMap(5, false)      // keys strictly > 5
tmap.subMap(3, 7)           // keys in [3, 7)
tmap.subMap(3, true, 7, true) // keys in [3, 7]

// ── Descending View ───────────────────────────────────────────
tmap.descendingMap()        // reversed view of this map
tmap.descendingKeySet()     // reversed key set

// ── Poll (remove and return) ──────────────────────────────────
tmap.pollFirstEntry()       // remove and return entry with smallest key
tmap.pollLastEntry()        // remove and return entry with largest key
```

### Code Example — Count of Smaller Numbers (BST-like Query)

```java
// For each element, count how many previous elements are smaller
// Use TreeMap<value, count> and headMap().values().stream().mapToInt(Integer::intValue).sum()
TreeMap<Integer, Integer> tmap = new TreeMap<>();
for (int num : nums) {
    int smallerCount = tmap.headMap(num).values().stream().mapToInt(i -> i).sum();
    results.add(smallerCount);
    tmap.merge(num, 1, Integer::sum);
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Sorted keys always | O(log n) vs O(1) for HashMap |
| Powerful floor/ceiling navigation | No null keys (NullPointerException) |
| Range queries with headMap/tailMap | Overkill if order not needed |

---

## 11. HashSet

### What is it?
`HashSet<E>` stores **unique elements** with O(1) average add/remove/contains. Backed by a `HashMap` internally. **No order guarantee.** Allows one null.

```java
import java.util.HashSet;
import java.util.Set;

Set<Integer> set = new HashSet<>();
Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3, 2, 1)); // {1, 2, 3}
Set<Integer> set = new HashSet<>(otherSet); // copy

// ── Core Methods ──────────────────────────────────────────────
set.add(5)             // O(1) — returns true if added, false if duplicate
set.remove(5)          // O(1) — returns true if removed
set.contains(5)        // O(1) ← the main advantage of HashSet
set.size()
set.isEmpty()
set.clear()

// ── Bulk Operations ───────────────────────────────────────────
set.addAll(otherSet)      // union — modifies set in place
set.retainAll(otherSet)   // intersection — keeps only common elements
set.removeAll(otherSet)   // difference — removes all in otherSet
set.containsAll(otherSet) // true if set is a superset

// ── Convert ───────────────────────────────────────────────────
new HashSet<>(list)                           // list → set (remove duplicates)
new ArrayList<>(set)                          // set → list
set.toArray(new Integer[0])                   // set → array
set.stream().collect(Collectors.toList())     // set → list via stream

// ── Iteration ─────────────────────────────────────────────────
for (int x : set) System.out.println(x);
set.forEach(System.out::println);
```

### Common DSA Patterns

```java
// Detect duplicates in O(n)
boolean hasDuplicate(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    for (int x : arr) if (!seen.add(x)) return true;
    return false;
}

// Two Sum (pair with target sum)
Set<Integer> seen = new HashSet<>();
for (int x : arr) {
    if (seen.contains(target - x)) return true;
    seen.add(x);
}

// Longest Consecutive Sequence
Set<Integer> numSet = new HashSet<>();
for (int n : nums) numSet.add(n);
int longest = 0;
for (int n : numSet) {
    if (!numSet.contains(n - 1)) { // start of sequence
        int len = 1;
        while (numSet.contains(n + len)) len++;
        longest = Math.max(longest, len);
    }
}
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| O(1) add/remove/contains | No ordering |
| Duplicate elimination | O(n) worst case with bad hash |
| | Not sorted, no floor/ceiling |

---

## 12. LinkedHashSet

### What is it?
`LinkedHashSet<E>` extends `HashSet` and maintains **insertion order**. Backed by `LinkedHashMap`. Good for deduplication while preserving order.

```java
Set<Integer> set = new LinkedHashSet<>();
// All HashSet methods — iteration is in insertion order
```

> **Use case:** Remove duplicates from a list while keeping the order of first appearances.

```java
List<Integer> dedup(List<Integer> list) {
    return new ArrayList<>(new LinkedHashSet<>(list));
}
```

---

## 13. TreeSet

### What is it?
`TreeSet<E>` stores **unique, sorted elements**. Backed by a `TreeMap`. O(log n) for all operations. Supports navigation (floor, ceiling, etc.).

```java
import java.util.TreeSet;

TreeSet<Integer> ts = new TreeSet<>();                         // ascending
TreeSet<Integer> ts = new TreeSet<>(Comparator.reverseOrder()); // descending

// All Set methods (add, remove, contains) — O(log n)

// ── Navigation Methods (same as TreeMap's key navigation) ─────
ts.first()             // smallest element
ts.last()              // largest element
ts.floor(5)            // largest element ≤ 5
ts.ceiling(5)          // smallest element ≥ 5
ts.lower(5)            // largest element < 5
ts.higher(5)           // smallest element > 5

// ── Range Views ───────────────────────────────────────────────
ts.headSet(5)          // elements < 5
ts.headSet(5, true)    // elements ≤ 5
ts.tailSet(5)          // elements ≥ 5
ts.subSet(3, 7)        // elements in [3, 7)

// ── Poll ──────────────────────────────────────────────────────
ts.pollFirst()         // remove and return smallest
ts.pollLast()          // remove and return largest

// ── Descending ────────────────────────────────────────────────
ts.descendingSet()     // reversed view
ts.descendingIterator()
```

### Code Example — Closest Value in BST-like Structure

```java
// Find the value in set closest to target
TreeSet<Integer> ts = new TreeSet<>(existingData);
Integer floor = ts.floor(target);   // ≤ target
Integer ceil  = ts.ceiling(target); // ≥ target
int closest;
if (floor == null) closest = ceil;
else if (ceil == null) closest = floor;
else closest = (target - floor <= ceil - target) ? floor : ceil;
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Always sorted | O(log n) — slower than HashSet |
| floor/ceiling queries in O(log n) | No null elements |
| Range views are powerful | Overkill if no ordering needed |

---

## 14. Comparator & Comparable

### What is it?

- `Comparable<T>` — implemented **by the class itself**, defines its natural ordering via `compareTo()`. Used when the class has one obvious sort order.
- `Comparator<T>` — an **external** comparison strategy. Use when you want multiple sort orders or can't modify the class.

**Return convention for both:** negative → first < second, 0 → equal, positive → first > second.

### Comparable — Implementing Natural Order

```java
class Student implements Comparable<Student> {
    String name;
    int gpa;

    @Override
    public int compareTo(Student other) {
        return Double.compare(other.gpa, this.gpa); // descending GPA
        // For ascending: Double.compare(this.gpa, other.gpa)
        // For String: this.name.compareTo(other.name)
    }
}

List<Student> students = ...;
Collections.sort(students); // uses compareTo
Arrays.sort(studentArr);    // uses compareTo
```

### Comparator — All Ways to Create

```java
// ── Anonymous class (old style) ───────────────────────────────
Comparator<int[]> bySecond = new Comparator<int[]>() {
    public int compare(int[] a, int[] b) { return a[1] - b[1]; }
};

// ── Lambda (preferred) ────────────────────────────────────────
Comparator<int[]> bySecond = (a, b) -> a[1] - b[1];

// ── Comparator.comparing() factory methods ────────────────────
Comparator<Student> byName = Comparator.comparing(s -> s.name);
Comparator<Student> byGpa  = Comparator.comparingDouble(s -> s.gpa);
Comparator<Student> byGpaDesc = Comparator.comparingDouble(Student::getGpa).reversed();

// ── Chaining with thenComparing ───────────────────────────────
Comparator<Student> comp = Comparator
    .comparingDouble(Student::getGpa).reversed()  // primary: GPA descending
    .thenComparing(Student::getName);              // tie-break: name ascending

// ── Null-safe comparators ─────────────────────────────────────
Comparator<String> nullFirst = Comparator.nullsFirst(Comparator.naturalOrder());
Comparator<String> nullLast  = Comparator.nullsLast(Comparator.naturalOrder());

// ── Natural & Reverse ─────────────────────────────────────────
Comparator.naturalOrder()       // ascending
Comparator.reverseOrder()       // descending (for Comparable types)
```

### ⚠️ Integer Subtraction Trick — Danger!

```java
// ❌ WRONG — overflows for extreme values like Integer.MIN_VALUE
Comparator<Integer> bad = (a, b) -> a - b;

// ✅ CORRECT — use Integer.compare
Comparator<Integer> good = (a, b) -> Integer.compare(a, b);
Comparator<Integer> good = Integer::compare;

// ✅ Also correct for simple cases within safe range:
// If you KNOW values are non-negative and differences won't overflow, a-b is fine.
// In competitive programming: int[] values 0..10^9 difference can overflow!
```

### Common DSA Comparator Patterns

```java
// Sort 2D intervals by start time, break ties by end time descending
Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);

// Sort strings by length, then lexicographically
list.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));

// Sort array of arrays: primary by index 0 asc, secondary by index 1 desc
Arrays.sort(arr, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);

// Custom PriorityQueue — min by frequency, break ties by value
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
    a[1] != b[1] ? a[1] - b[1] : a[0] - b[0]
);
```

---

## 15. Sorting

### Arrays.sort vs Collections.sort

| | `Arrays.sort` | `Collections.sort` |
|---|---|---|
| Input | arrays | `List` |
| Algorithm (primitives) | Dual-Pivot Quicksort — O(n log n) avg, not stable | — |
| Algorithm (objects) | TimSort — O(n log n), stable | TimSort — O(n log n), stable |
| Custom order | Only for Object[] | Yes, with Comparator |

### All Sorting Methods

```java
// ── Primitive Arrays ──────────────────────────────────────────
int[] arr = {5, 3, 1, 4, 2};
Arrays.sort(arr);                      // ascending, in-place
Arrays.sort(arr, 1, 4);               // sort subarray [1..3]

// Descending for primitives — must box to Integer[]
Integer[] boxed = {5, 3, 1, 4, 2};
Arrays.sort(boxed, Comparator.reverseOrder());

// ── Object / Wrapper Arrays ───────────────────────────────────
String[] strs = {"banana", "apple", "cherry"};
Arrays.sort(strs);                     // natural (lexicographic)
Arrays.sort(strs, (a, b) -> a.length() - b.length()); // by length

// ── Lists ─────────────────────────────────────────────────────
List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 1, 4, 2));
Collections.sort(list);               // ascending
Collections.sort(list, Comparator.reverseOrder()); // descending
list.sort((a, b) -> b - a);           // list.sort() — same as Collections.sort

// ── Sorting with Multiple Criteria ───────────────────────────
// Sort students: by GPA desc, then by name asc
students.sort(Comparator.comparingDouble(Student::getGpa)
    .reversed()
    .thenComparing(Student::getName));

// ── Topological Sort (Kahn's Algorithm) ───────────────────────
// Using Queue + indegree array — see graph section patterns

// ── Counting Sort (O(n+k)) — for small integer ranges ─────────
int[] count = new int[maxVal + 1];
for (int x : arr) count[x]++;
int idx = 0;
for (int v = 0; v <= maxVal; v++)
    while (count[v]-- > 0) arr[idx++] = v;

// ── Bucket Sort (O(n)) — for uniformly distributed floats ─────
// Partition into n buckets, sort each, concatenate
```

---

## 16. Java Streams

### What is it?
Streams provide a **functional, declarative** way to process collections. A stream pipeline has three parts:
1. **Source** — collection, array, or generator
2. **Intermediate operations** — lazy, return a new Stream
3. **Terminal operation** — triggers execution, returns a result

> In DSA, streams are useful for **concise one-liners**, but can be slower than loops for hot paths.

### Creating Streams

```java
import java.util.stream.*;

// From collection
list.stream()
set.stream()

// From array
Arrays.stream(arr)             // IntStream for int[]
Arrays.stream(arr, 1, 4)       // range
Stream.of("a", "b", "c")      // varargs

// Primitive streams (avoid boxing overhead)
IntStream.range(0, 10)         // [0..9)
IntStream.rangeClosed(0, 10)   // [0..10]
IntStream.of(1, 2, 3)

// Infinite streams
Stream.iterate(0, n -> n + 2)         // 0, 2, 4, 6, ...
Stream.generate(Math::random)          // random doubles
Stream.iterate(0, n -> n < 100, n -> n + 1) // Java 9+: with termination condition
```

### Intermediate Operations (Lazy)

```java
stream
.filter(x -> x > 0)              // keep elements matching predicate
.map(x -> x * 2)                 // transform elements
.mapToInt(String::length)        // map to IntStream
.flatMap(list -> list.stream())  // flatten nested streams
.distinct()                      // remove duplicates
.sorted()                        // sort natural order
.sorted(Comparator.reverseOrder()) // sort custom
.limit(5)                        // take first 5
.skip(3)                         // skip first 3
.peek(x -> System.out.println(x)) // for debugging (side-effect only)
.takeWhile(x -> x < 10)         // Java 9+: take while predicate holds
.dropWhile(x -> x < 10)         // Java 9+: drop while predicate holds
```

### Terminal Operations

```java
// ── Aggregation ───────────────────────────────────────────────
stream.count()                    // number of elements
stream.sum()                      // IntStream/LongStream/DoubleStream only
stream.min(Comparator.naturalOrder()) // Optional<T>
stream.max(Comparator.naturalOrder()) // Optional<T>
stream.average()                  // OptionalDouble (numeric streams)

// ── Reduction ─────────────────────────────────────────────────
stream.reduce(0, Integer::sum)    // sum with identity
stream.reduce((a, b) -> a + b)    // Optional (no identity)

// ── Matching ──────────────────────────────────────────────────
stream.anyMatch(x -> x > 5)      // true if any match
stream.allMatch(x -> x > 0)      // true if all match
stream.noneMatch(x -> x < 0)     // true if none match

// ── Finding ───────────────────────────────────────────────────
stream.findFirst()                // Optional — first element
stream.findAny()                  // Optional — any element (faster in parallel)

// ── Collection ────────────────────────────────────────────────
stream.collect(Collectors.toList())
stream.collect(Collectors.toSet())
stream.collect(Collectors.toUnmodifiableList())
stream.collect(Collectors.joining(", "))          // "a, b, c"
stream.collect(Collectors.joining(", ", "[", "]")) // "[a, b, c]"

stream.collect(Collectors.groupingBy(String::length)) // Map<Integer, List<String>>
stream.collect(Collectors.groupingBy(
    String::length, Collectors.counting()))            // Map<Integer, Long>

stream.collect(Collectors.counting())
stream.collect(Collectors.summingInt(String::length))
stream.collect(Collectors.toMap(
    s -> s,            // key mapper
    String::length,    // value mapper
    (a, b) -> a))      // merge function for duplicate keys

stream.toArray()                  // Object[]
stream.toArray(Integer[]::new)    // Integer[]

// For IntStream:
IntStream.of(1,2,3).toArray()    // int[]
```

### Code Example — DSA Patterns with Streams

```java
// Max frequency character
char maxChar = s.chars()
    .mapToObj(c -> (char) c)
    .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .get().getKey();

// Sum of all digits in a number
int digitSum = String.valueOf(n).chars().map(c -> c - '0').sum();

// Top k frequent elements
Map<Integer, Long> freq = Arrays.stream(nums).boxed()
    .collect(Collectors.groupingBy(x -> x, Collectors.counting()));
List<Integer> topK = freq.entrySet().stream()
    .sorted(Map.Entry.<Integer,Long>comparingByValue().reversed())
    .limit(k)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());

// Convert int[] to List<Integer>
List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());

// Convert List<Integer> to int[]
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();
```

### Pros / Cons

| ✅ Pros | ❌ Cons |
|---|---|
| Concise and readable | Can be slower than loops (overhead) |
| Easy chaining | Hard to debug (stack traces obscure) |
| Parallelism via parallelStream() | Not suitable for index-based logic |

---

## 17. Collections Utility Class

```java
import java.util.Collections;

List<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5, 9));

// ── Sort & Shuffle ────────────────────────────────────────────
Collections.sort(list)                         // ascending
Collections.sort(list, Comparator.reverseOrder()) // descending
Collections.shuffle(list)                      // random order
Collections.shuffle(list, new Random(42))      // seeded shuffle

// ── Min / Max ─────────────────────────────────────────────────
Collections.min(list)                          // 1
Collections.max(list)                          // 9
Collections.min(list, Comparator.reverseOrder()) // 9 (min with custom comparator)

// ── Search ────────────────────────────────────────────────────
Collections.binarySearch(list, 4)  // list must be sorted! Returns index.

// ── Modify ────────────────────────────────────────────────────
Collections.reverse(list)          // reverse in-place
Collections.fill(list, 0)          // fill all with value
Collections.copy(dest, src)        // copy src into dest (dest.size() >= src.size())
Collections.swap(list, 0, 1)       // swap elements at indices

// ── Rotation ──────────────────────────────────────────────────
Collections.rotate(list, 2)        // rotate right by 2 (last 2 go to front)
Collections.rotate(list, -2)       // rotate left by 2

// ── Frequency & Disjoint ──────────────────────────────────────
Collections.frequency(list, 1)     // count occurrences of 1
Collections.disjoint(list, other)  // true if no common elements

// ── Unmodifiable & Synchronized Wrappers ─────────────────────
List<Integer> immutable = Collections.unmodifiableList(list)
Set<Integer> immutableSet = Collections.unmodifiableSet(set)
Map<K,V> immutableMap = Collections.unmodifiableMap(map)
List<Integer> syncList = Collections.synchronizedList(list)

// ── Singleton & Empty Collections ─────────────────────────────
Collections.singletonList(42)      // immutable single-element list
Collections.singleton(42)          // immutable single-element set
Collections.emptyList()            // immutable empty list
Collections.emptySet()
Collections.emptyMap()

// ── nCopies ───────────────────────────────────────────────────
Collections.nCopies(5, "x")       // ["x", "x", "x", "x", "x"]
```

---

## 18. Math Utility Class

```java
// ── Basic ─────────────────────────────────────────────────────
Math.abs(-5)            // 5
Math.max(3, 7)          // 7
Math.min(3, 7)          // 3

// ── Power & Root ──────────────────────────────────────────────
Math.pow(2, 10)         // 1024.0 (double)
Math.sqrt(16)           // 4.0
Math.cbrt(27)           // 3.0

// ── Log ───────────────────────────────────────────────────────
Math.log(Math.E)        // 1.0 (natural log)
Math.log10(100)         // 2.0

// ── Floor / Ceil / Round ──────────────────────────────────────
Math.floor(3.9)         // 3.0
Math.ceil(3.1)          // 4.0
Math.round(3.5)         // 4 (long)

// ── Useful Constants ──────────────────────────────────────────
Math.PI                 // 3.141592...
Math.E                  // 2.718281...
Integer.MAX_VALUE       // 2147483647 (2^31 - 1)
Integer.MIN_VALUE       // -2147483648
Long.MAX_VALUE          // 9223372036854775807

// ── GCD using Euclid's algorithm ──────────────────────────────
int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
int lcm(int a, int b) { return a / gcd(a, b) * b; }

// ── Fast exponentiation ───────────────────────────────────────
long modPow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
```

---

## 19. Bit Manipulation Tricks

```java
// ── Basic ─────────────────────────────────────────────────────
n & 1           // check if odd (1 = odd, 0 = even)
n >> 1          // divide by 2
n << 1          // multiply by 2
n & (n-1)       // clear lowest set bit  (also: n & (n-1) == 0 → power of 2 check)
n & (-n)        // isolate lowest set bit
n | (1 << k)    // set bit k
n & ~(1 << k)   // clear bit k
n ^ (1 << k)    // toggle bit k
(n >> k) & 1    // get bit k

// ── Count set bits ────────────────────────────────────────────
Integer.bitCount(n)     // built-in

// ── Tricks ────────────────────────────────────────────────────
a ^ a == 0              // XOR with itself = 0
a ^ 0 == a              // XOR with 0 = itself
a ^ b ^ a == b          // XOR is commutative & associative
// → Use to find single non-duplicate in array!
int single = 0;
for (int x : arr) single ^= x;
```

---

## 20. Quick Reference — Time Complexities

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| `int[]` / Array | O(1) | O(n) | O(n) | O(n) | Fixed size |
| `ArrayList` | O(1) | O(n) | O(1)* | O(n) | *amortized at end |
| `LinkedList` | O(n) | O(n) | O(1) at ends | O(1) at ends | Poor cache |
| `ArrayDeque` | O(1) at ends | O(n) | O(1) at ends | O(1) at ends | No null |
| `PriorityQueue` | O(1) peek | O(n) | O(log n) | O(log n) | Only min/max O(1) |
| `HashMap` | O(1) avg | O(1) avg | O(1) avg | O(1) avg | No order |
| `LinkedHashMap` | O(1) avg | O(1) avg | O(1) avg | O(1) avg | Insertion order |
| `TreeMap` | O(log n) | O(log n) | O(log n) | O(log n) | Sorted |
| `HashSet` | — | O(1) avg | O(1) avg | O(1) avg | No order |
| `LinkedHashSet` | — | O(1) avg | O(1) avg | O(1) avg | Insertion order |
| `TreeSet` | — | O(log n) | O(log n) | O(log n) | Sorted |
| `Arrays.sort` (primitives) | — | — | — | — | O(n log n) dual-pivot |
| `Arrays.sort` (objects) | — | — | — | — | O(n log n) TimSort stable |

---

## Collection Choosing Guide

```
Need key-value pairs?
  ├─ Need sorted keys / floor/ceiling queries? → TreeMap
  ├─ Need insertion order? → LinkedHashMap
  ├─ Need LRU Cache? → LinkedHashMap (access-order)
  └─ Just fast lookup? → HashMap

Need unique elements?
  ├─ Need sorted / floor/ceiling? → TreeSet
  ├─ Need insertion order? → LinkedHashSet
  └─ Just fast contains? → HashSet

Need sequential data?
  ├─ Need fast random access? → ArrayList (or int[])
  ├─ Need fast insert/delete at both ends? → ArrayDeque
  ├─ Need priority ordering (min/max fast)? → PriorityQueue
  └─ Need both List + Deque APIs? → LinkedList (rare)

Need stack? → ArrayDeque.push/pop (NOT java.util.Stack — it's legacy)
Need queue? → ArrayDeque.offer/poll (as Queue<T>)
Need deque? → ArrayDeque
```

---


<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>