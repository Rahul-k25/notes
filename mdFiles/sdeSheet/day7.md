<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 7: LinkedList and Arrays)


---

**1. Rotate a LinkedList**

- **Question Pattern:** Rotate a linked list to the right by `k` places.
- **Approach:**
  - Find the length of the list.
  - Make the list circular by connecting the last node to the head.
  - Break the circle at the `(n-k % n)`th node to rotate.
  
- **Code (Optimized):**

  ```java
  public ListNode rotateRight(ListNode head, int k) {
      if (head == null || head.next == null || k == 0) return head;
      ListNode temp = head;
      int length = 1;
      while (temp.next != null) {
          temp = temp.next;
          length++;
      }
      temp.next = head;  // Make the list circular
      k = k % length;
      for (int i = 0; i < length - k; i++) {
          temp = temp.next;
      }
      head = temp.next;
      temp.next = null;  // Break the circle
      return head;
  }
  ```

- **Example Input:**
  - Input: `head = [1,2,3,4,5], k = 2`
  - Output: `[4,5,1,2,3]`

- **Similar Problems:** Rotate Array, Rotate Matrix.

---

**2. Clone a Linked List with Random and Next Pointer**

- **Question Pattern:** Clone a linked list where each node has a `next` pointer and a `random` pointer.
- **Approach:**
  - Use a hash map to map original nodes to their clones.
  - Traverse the original list and create clones of each node, linking them.
  
- **Code (Optimized):**

  ```java
  public Node copyRandomList(Node head) {
      if (head == null) return null;
      Map<Node, Node> map = new HashMap<>();
      Node current = head;
      while (current != null) {
          map.put(current, new Node(current.val));
          current = current.next;
      }
      current = head;
      while (current != null) {
          map.get(current).next = map.get(current.next);
          map.get(current).random = map.get(current.random);
          current = current.next;
      }
      return map.get(head);
  }
  ```

- **Example Input:**
  - Input: `head = [1,2,3,4] with random pointers`
  - Output: Cloned list with correct `next` and `random` pointers.

- **Similar Problems:** Merge Sorted Linked Lists, Clone Binary Tree.

---

**3. 3 Sum**

- **Question Pattern:** Given an array of integers, find all unique triplets in the array which gives the sum of zero.
- **Approach:**
  - Sort the array.
  - Use a two-pointer technique to find pairs that sum up to the negative of the current element.
  
- **Code (Optimized):**

  ```java
  public List<List<Integer>> threeSum(int[] nums) {
      List<List<Integer>> result = new ArrayList<>();
      Arrays.sort(nums);
      for (int i = 0; i < nums.length - 2; i++) {
          if (i > 0 && nums[i] == nums[i - 1]) continue;
          int left = i + 1, right = nums.length - 1;
          while (left < right) {
              int sum = nums[i] + nums[left] + nums[right];
              if (sum == 0) {
                  result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                  while (left < right && nums[left] == nums[left + 1]) left++;
                  while (left < right && nums[right] == nums[right - 1]) right--;
                  left++;
                  right--;
              } else if (sum < 0) {
                  left++;
              } else {
                  right--;
              }
          }
      }
      return result;
  }
  ```

- **Example Input:**
  - Input: `nums = [-1,0,1,2,-1,-4]`
  - Output: `[[-1, -1, 2], [-1, 0, 1]]`

- **Similar Problems:** 4 Sum, Subarray Sum Equals K.

---

**4. Trapping Rainwater**

- **Question Pattern:** Given an array of non-negative integers representing the height of bars, find the amount of water that can be trapped after raining.
- **Approach:**
  - Use two pointers, one from the left and one from the right.
  - Track the maximum height from both sides and calculate the trapped water based on the shorter bar at each position.
  
- **Code (Optimized):**

  ```java
  public int trap(int[] height) {
      if (height == null || height.length == 0) return 0;
      int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, result = 0;
      while (left <= right) {
          if (height[left] <= height[right]) {
              if (height[left] >= leftMax) leftMax = height[left];
              else result += leftMax - height[left];
              left++;
          } else {
              if (height[right] >= rightMax) rightMax = height[right];
              else result += rightMax - height[right];
              right--;
          }
      }
      return result;
  }
  ```

- **Example Input:**
  - Input: `height = [0,1,0,2,1,0,1,3,2,1,2,1]`
  - Output: `6`

- **Similar Problems:** Container With Most Water, Largest Rectangle in Histogram.

---

**5. Remove Duplicates from Sorted Array**

- **Question Pattern:** Given a sorted array, remove the duplicates in-place such that each element appears only once, and return the new length of the array.
- **Approach:**
  - Use a two-pointer approach. One pointer to iterate through the array and the other to keep track of unique elements.
  
- **Code (Optimized):**

  ```java
  public int removeDuplicates(int[] nums) {
      if (nums.length == 0) return 0;
      int index = 1;
      for (int i = 1; i < nums.length; i++) {
          if (nums[i] != nums[i - 1]) {
              nums[index] = nums[i];
              index++;
          }
      }
      return index;
  }
  ```

- **Example Input:**
  - Input: `nums = [1,1,2]`
  - Output: `2 (Array: [1, 2])`

- **Similar Problems:** Remove Duplicates from Sorted List, Remove Element.

---

**6. Max Consecutive Ones**

- **Question Pattern:** Given a binary array, find the maximum number of consecutive 1’s in the array.
- **Approach:**
  - Traverse the array while keeping count of the consecutive 1's and update the result when encountering a 0.
  
- **Code (Optimized):**

  ```java
  public int findMaxConsecutiveOnes(int[] nums) {
      int maxCount = 0, currentCount = 0;
      for (int num : nums) {
          if (num == 1) {
              currentCount++;
              maxCount = Math.max(maxCount, currentCount);
          } else {
              currentCount = 0;
          }
      }
      return maxCount;
  }
  ```

- **Example Input:**
  - Input: `nums = [1,1,0,1,1,1]`
  - Output: `3`

- **Similar Problems:** Longest Substring with At Most K Distinct Characters, Longest Consecutive Sequence.

---

<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>