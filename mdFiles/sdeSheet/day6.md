<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 6: LinkedList part-II)

---

**1. Find Intersection Point of Y LinkedList**

- **Question Pattern:** Given two linked lists, find the intersection point (if any).
- **Approach:**
  - Use two pointers, one for each linked list.
  - Traverse both lists, and once a pointer reaches the end of a list, redirect it to the beginning of the other list.
  - Both pointers will meet at the intersection point, if there is one.
  
- **Code (Optimized):**

  
```java
  public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
      if (headA == null || headB == null) return null;
      ListNode pA = headA, pB = headB;
      while (pA != pB) {
          pA = (pA == null) ? headB : pA.next;
          pB = (pB == null) ? headA : pB.next;
      }
      return pA;
  }
  
```

- **Example Input:**
  - Input: `headA = [4,1,8,4,5], headB = [5,0,1,8,4,5]`
  - Output: `[8,4,5]`

- **Similar Problems:** Cycle in a Linked List, Merge Two Sorted Lists.

---

**2. Detect a Cycle in Linked List**

- **Question Pattern:** Determine if a linked list has a cycle.
- **Approach:**
  - Use Floyd's Tortoise and Hare algorithm.
  - Traverse the list using two pointers, one moving one step at a time and the other two steps at a time.
  - If the pointers meet, a cycle exists.
  
- **Code (Optimized):**

  
```java
  public boolean hasCycle(ListNode head) {
      ListNode slow = head, fast = head;
      while (fast != null && fast.next != null) {
          slow = slow.next;
          fast = fast.next.next;
          if (slow == fast) return true;
      }
      return false;
  }
  
```

- **Example Input:**
  - Input: `head = [3,2,0,-4]` (Cycle at node 2)
  - Output: `true`

- **Similar Problems:** Linked List Cycle Length, Linked List Intersection.

---

**3. Reverse a Linked List in Groups of Size k**

- **Question Pattern:** Reverse the nodes of a linked list in groups of size `k`.
- **Approach:**
  - Use a loop to reverse every `k` nodes, keeping track of the previous, current, and next nodes.
  - For the last part (less than `k` nodes), leave them as is.
  
- **Code (Optimized):**

  
```java
  public ListNode reverseKGroup(ListNode head, int k) {
      if (head == null || k == 1) return head;
      ListNode dummy = new ListNode(0);
      dummy.next = head;
      ListNode curr = dummy, nex = dummy, pre = dummy;
      int count = 0;
      while (curr.next != null) {
          curr = curr.next;
          count++;
      }
      while (count >= k) {
          curr = pre.next;
          nex = curr.next;
          for (int i = 1; i < k; i++) {
              curr.next = nex.next;
              nex.next = pre.next;
              pre.next = nex;
              nex = curr.next;
          }
          pre = curr;
          count -= k;
      }
      return dummy.next;
  }
  
```

- **Example Input:**
  - Input: `head = [1,2,3,4,5], k = 3`
  - Output: `[3,2,1,4,5]`

- **Similar Problems:** Reverse Linked List, Rotate List.

---

**4. Check if a Linked List is Palindrome or Not**

- **Question Pattern:** Determine if a linked list is a palindrome.
- **Approach:**
  - Use the slow and fast pointer technique to find the middle of the list.
  - Reverse the second half and compare it with the first half.
  
- **Code (Optimized):**

  
```java
  public boolean isPalindrome(ListNode head) {
      if (head == null || head.next == null) return true;
      ListNode slow = head, fast = head;
      while (fast != null && fast.next != null) {
          slow = slow.next;
          fast = fast.next.next;
      }
      slow = reverse(slow);
      fast = head;
      while (slow != null) {
          if (slow.val != fast.val) return false;
          slow = slow.next;
          fast = fast.next;
      }
      return true;
  }

  private ListNode reverse(ListNode head) {
      ListNode prev = null;
      while (head != null) {
          ListNode next = head.next;
          head.next = prev;
          prev = head;
          head = next;
      }
      return prev;
  }
  
```

- **Example Input:**
  - Input: `head = [1,2,2,1]`
  - Output: `true`

- **Similar Problems:** Linked List Cycle Detection, Reverse Linked List.

---

**5. Find the Starting Point of the Loop in a Linked List**

- **Question Pattern:** Given a linked list with a cycle, find the starting point of the loop.
- **Approach:**
  - Use the Tortoise and Hare method to detect a cycle.
  - Once a cycle is detected, move one pointer to the head and keep the other at the meeting point. Move both pointers one step at a time; they will meet at the start of the cycle.
  
- **Code (Optimized):**

  
```java
  public ListNode detectCycle(ListNode head) {
      ListNode slow = head, fast = head;
      while (fast != null && fast.next != null) {
          slow = slow.next;
          fast = fast.next.next;
          if (slow == fast) {
              slow = head;
              while (slow != fast) {
                  slow = slow.next;
                  fast = fast.next;
              }
              return slow;
          }
      }
      return null;
  }
  
```

- **Example Input:**
  - Input: `head = [3,2,0,-4], cycleStart = 2`
  - Output: `[2]`

- **Similar Problems:** Linked List Cycle, Remove Cycle in Linked List.

---

**6. Flattening of a Linked List**

- **Question Pattern:** Flatten a linked list where each node may have a next pointer and a child pointer.
- **Approach:**
  - Use a depth-first search (DFS) approach to flatten the linked list recursively. Each time a child pointer is encountered, flatten the child list first.
  
- **Code (Optimized):**

  
```java
  public Node flatten(Node head) {
      if (head == null) return null;
      Node current = head;
      while (current != null) {
          if (current.child != null) {
              Node temp = current.next;
              current.next = flatten(current.child);
              current.next.prev = current;
              current.child = null;
              while (current.next != null) {
                  current = current.next;
              }
              current.next = temp;
              if (temp != null) temp.prev = current;
          }
          current = current.next;
      }
      return head;
  }
  
```

- **Example Input:**
  - Input: `head = [1,2,3,4,5,6] with child nodes`
  - Output: Flattened list.

- **Similar Problems:** Merge Two Sorted Lists, Linked List Flattening.

---

<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>