<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 2: Arrays & Mathematics)

---

#### **Day 2: Arrays & Mathematics**

---

**1. Rotate Matrix (90 Degrees Clockwise)**

- **Question Pattern:** Rotate a given NxN 2D matrix by 90 degrees clockwise in-place.
- **Approach:**
  - **Optimized:**
    1. Transpose the matrix.
    2. Reverse each row.

- **Code (Optimized):**


```java
public void rotate(int[][] matrix) {
    int n = matrix.length;

    // Transpose the matrix
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // Reverse each row
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - j - 1];
            matrix[i][n - j - 1] = temp;
        }
    }
}

```

- **Example Input:**
  - Input: `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`
  - Output: `[[7, 4, 1], [8, 5, 2], [9, 6, 3]]`
- **Similar Problems:** Rotate 90 degrees counter-clockwise, Spiral Matrix Traversal.

---

**2. Merge Overlapping Intervals**

- **Question Pattern:** Merge all overlapping intervals and return the result as a list of intervals.
- **Approach:**
  - **Optimized:**
    1. Sort the intervals by their start times.
    2. Traverse the intervals and merge if overlapping.

- **Code (Optimized):**


```java
public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();

    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}

```

- **Example Input:**
  - Input: `[[1, 3], [2, 6], [8, 10], [15, 18]]`
  - Output: `[[1, 6], [8, 10], [15, 18]]`
- **Similar Problems:** Insert Interval, Meeting Rooms Problem.

---

**3. Merge Two Sorted Arrays Without Extra Space**

- **Question Pattern:** Merge two sorted arrays, `arr1` and `arr2`, where `arr1` has enough space to accommodate elements of `arr2`.
- **Approach:**
  - **Optimized:**
    1. Use a two-pointer approach starting from the ends of both arrays.
    2. Place the largest elements in the correct position from the back.

- **Code (Optimized):**


```java
public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;

    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }

    while (j >= 0) {
        nums1[k--] = nums2[j--];
    }
}

```

- **Example Input:**
  - Input: `nums1 = [1, 2, 3, 0, 0, 0], m = 3`, `nums2 = [2, 5, 6], n = 3`
  - Output: `[1, 2, 2, 3, 5, 6]`
- **Similar Problems:** Merge K Sorted Lists, Two Sorted Lists.

---

**4. Find the Duplicate Number**

- **Question Pattern:** Given an array of integers where each integer is between 1 and n, find the duplicate number.
- **Approach:**
  - **Optimized:** Use Floyd’s Tortoise and Hare algorithm to detect a cycle (similar to finding a cycle in a linked list).

- **Code (Optimized):**


```java
public int findDuplicate(int[] nums) {
    int slow = nums[0];
    int fast = nums[0];

    // Detect cycle
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);

    // Find the entry point of the cycle
    fast = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }

    return slow;
}

```

- **Example Input:**
  - Input: `[1, 3, 4, 2, 2]`
  - Output: `2`
- **Similar Problems:** Find All Duplicates in an Array, Detect Cycle in Linked List.

---

**5. Repeat and Missing Number**

- **Question Pattern:** Find the one missing number and one repeating number in an array of size n containing numbers from 1 to n.
- **Approach:**
  - **Optimized:** Use mathematical equations based on sums and XOR properties.

- **Code (Optimized):**


```java
public int[] findErrorNums(int[] nums) {
    int xor = 0, xor1 = 0, xor0 = 0;
    int n = nums.length;

    for (int num : nums) xor ^= num;
    for (int i = 1; i <= n; i++) xor ^= i;

    int rightmostBit = xor & -xor;
    for (int num : nums) {
        if ((num & rightmostBit) == 0) xor0 ^= num;
        else xor1 ^= num;
    }

    for (int i = 1; i <= n; i++) {
        if ((i & rightmostBit) == 0) xor0 ^= i;
        else xor1 ^= i;
    }

    for (int num : nums) {
        if (num == xor0) return new int[] {xor0, xor1};
    }

    return new int[] {xor1, xor0};
}

```

- **Example Input:**
  - Input: `[1, 2, 2, 4]`
  - Output: `[2, 3]`
- **Similar Problems:** First Missing Positive, Find All Missing Numbers.

---

**6. Inversion of Array (Count Inversions)**

- **Question Pattern:** Count the number of inversions in an array (pairs (i, j) where i < j and arr[i] > arr[j]).
- **Approach:**
  - **Optimized:** Use merge sort and count inversions during the merge process.

- **Code (Optimized):**


```java
public int countInversions(int[] nums) {
    return mergeSort(nums, 0, nums.length - 1);
}

private int mergeSort(int[] nums, int left, int right) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;
    int inversions = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);
    inversions += merge(nums, left, mid, right);

    return inversions;
}

private int merge(int[] nums, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    int inversions = 0;

    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) {
            temp[k++] = nums[i++];
        } else {
            temp[k++] = nums[j++];
            inversions += (mid - i + 1);
        }
    }

    while (i <= mid) {
        temp[k++] = nums[i++];
    }

    while (j <= right) {
        temp[k++] = nums[j++];
    }

    for (i = left, k = 0; i <= right; i++, k++) {
        nums[i] = temp[k];
    }

    return inversions;
}

```

- **Example Input:**
  - Input: `[8, 4, 2, 1]`
  - Output: `6` (Inversions: (8,4), (8,2), (8,1), (4,2), (4,1), (2,1))
- **Similar Problems:** Count Inversions in Linked List, Sort Colors (Dutch National Flag).

**7. Reverse Pairs**

- **Question Pattern:** Find all reverse pairs `(i, j)` where `i < j` and `nums[i] > 2 * nums[j]` in the given array.
  
- **Approach:**
  - **Optimized:** Utilize the merge sort technique and count the reverse pairs during the merge step.

- **Code (Optimized):**


```java
public int reversePairs(int[] nums) {
    return mergeSort(nums, 0, nums.length - 1);
}

private int mergeSort(int[] nums, int left, int right) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;
    int count = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);
    count += merge(nums, left, mid, right);

    return count;
}

private int merge(int[] nums, int left, int mid, int right) {
    int count = 0;
    int j = mid + 1;

    // Count reverse pairs
    for (int i = left; i <= mid; i++) {
        while (j <= right && nums[i] > 2L * nums[j]) {
            j++;
        }
        count += (j - mid - 1);
    }

    // Merge step
    List<Integer> temp = new ArrayList<>();
    int i = left, k = mid + 1;
    while (i <= mid && k <= right) {
        if (nums[i] <= nums[k]) {
            temp.add(nums[i++]);
        } else {
            temp.add(nums[k++]);
        }
    }

    while (i <= mid) temp.add(nums[i++]);
    while (k <= right) temp.add(nums[k++]);

    for (i = left; i <= right; i++) {
        nums[i] = temp.get(i - left);
    }

    return count;
}

```

- **Example Input:**
  - Input: `[1, 3, 2, 3, 1]`
  - Output: `2` (Reverse pairs: `(3,1)` and `(3,1)`).
  
- **Similar Problems:** Count Inversions, Smaller Elements after Self.

---


<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>