<link rel="stylesheet" href="assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 5: LinkedList)

**1. Reverse Linked List**

- **Question Pattern:** Reverse a singly linked list.
- **Approach:**
  - Initialize three pointers: `prev`, `current`, and `next`.
  - Traverse the list, adjusting pointers to reverse the direction of the links.
  - Continue until all nodes are reversed.

- **Code (Optimized):**

  ```java
  public ListNode reverseList(ListNode head) {
      ListNode prev = null;
      ListNode current = head;
      while (current != null) {
          ListNode next = current.next;
          current.next = prev;
          prev = current;
          current = next;
      }
      return prev;
  }
  ```

- **Example Input:**
  - Input: `1 -> 2 -> 3 -> 4 -> 5`
  - Output: `5 -> 4 -> 3 -> 2 -> 1`

- **Similar Problems:** Reverse Linked List II, Reverse Nodes in k-Group.

**2. Middle of the Linked List**

- **Question Pattern:** Find the middle node of a singly linked list.
- **Approach:**
  - Use the slow and fast pointer technique.
  - Move the slow pointer one step and the fast pointer two steps at a time.
  - When the fast pointer reaches the end, the slow pointer will be at the middle.

- **Code (Optimized):**

  ```java
  public ListNode middleNode(ListNode head) {
      ListNode slow = head;
      ListNode fast = head;
      while (fast != null && fast.next != null) {
          slow = slow.next;
          fast = fast.next.next;
      }
      return slow;
  }
  ```

- **Example Input:**
  - Input: `1 -> 2 -> 3 -> 4 -> 5`
  - Output: `3`

- **Similar Problems:** Linked List Cycle, Detect Cycle in Linked List.

**3. Merge Two Sorted Lists**

- **Question Pattern:** Merge two sorted linked lists into one sorted list.
- **Approach:**
  - Use a dummy node to simplify edge cases.
  - Compare the heads of both lists, attach the smaller node to the merged list, and move the pointer.
  - Continue until all nodes from both lists are merged.

- **Code (Optimized):**

  ```java
  public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
      ListNode dummy = new ListNode(0);
      ListNode current = dummy;
      while (l1 != null && l2 != null) {
          if (l1.val < l2.val) {
              current.next = l1;
              l1 = l1.next;
          } else {
              current.next = l2;
              l2 = l2.next;
          }
          current = current.next;
      }
      current.next = (l1 != null) ? l1 : l2;
      return dummy.next;
  }
  ```

- **Example Input:**
  - Input: `l1 = 1 -> 2 -> 4`, `l2 = 1 -> 3 -> 4`
  - Output: `1 -> 1 -> 2 -> 3 -> 4 -> 4`

- **Similar Problems:** Merge k Sorted Lists, Merge Two Sorted Arrays.

**4. Remove N-th Node From End of List**

- **Question Pattern:** Remove the n-th node from the end of a singly linked list.
- **Approach:**
  - Use the slow and fast pointer technique.
  - Move the fast pointer `n` steps ahead.
  - Move both pointers one step at a time until the fast pointer reaches the end.
  - The slow pointer will be just before the node to be removed.

- **Code (Optimized):**

  ```java
  public ListNode removeNthFromEnd(ListNode head, int n) {
      ListNode dummy = new ListNode(0);
      dummy.next = head;
      ListNode slow = dummy;
      ListNode fast = dummy;
      for (int i = 1; i <= n + 1; i++) {
          fast = fast.next;
      }
      while (fast != null) {
          slow = slow.next;
          fast = fast.next;
      }
      slow.next = slow.next.next;
      return dummy.next;
  }
  ```

- **Example Input:**
  - Input: `head = 1 -> 2 -> 3 -> 4 -> 5`, `n = 2`
  - Output: `1 -> 2 -> 3 -> 5`

- **Similar Problems:** Remove Duplicates from Sorted List, Delete Node in a Linked List.

**5. Palindrome Linked List**

- **Question Pattern:** Determine if a singly linked list is a palindrome.
- **Approach:**
  - Find the middle of the list using the slow and fast pointer technique.
  - Reverse the second half of the list.
  - Compare the first half with the reversed second half.

- **Code (Optimized):**

  ```java
  public boolean isPalindrome(ListNode head) {
      if (head == null || head.next == null) return true;
      ListNode slow = head;
      ListNode fast = head;
      while (fast != null && fast.next != null) {
          slow = slow.next;
          fast = fast.next.next;
      }
      ListNode prev = null;
      while (slow != null) {
          ListNode next = slow.next;
          slow.next = prev;
          prev = slow;
          slow = next;
      }
      while (prev != null) {
          if (head.val != prev.val) return false;
          head = head.next;
          prev = prev.next;
      }
      return true;
  }
  ```

- **Example Input:**
  - Input: `1 -> 2 -> 2 -> 1`
  - Output: `true`

- **Similar Problems:** Linked List Cycle, Reverse Linked List.


 

<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>