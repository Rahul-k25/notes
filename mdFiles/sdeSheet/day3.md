### Striver's SDE Sheet Notes (Day 3: Arrays & Strings)

---

**1. Search in a 2D Matrix**

- **Question Pattern:** Given a 2D matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row, search for a target value.
- **Approach:**
  - Treat the matrix as a 1D sorted array and use binary search.

- **Code (Optimized):**

```java
public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return false;
    int rows = matrix.length, cols = matrix[0].length;
    int low = 0, high = rows * cols - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int midVal = matrix[mid / cols][mid % cols];

        if (midVal == target) return true;
        else if (midVal < target) low = mid + 1;
        else high = mid - 1;
    }

    return false;
}
```

- **Example Input:**
  - Matrix: `[[1, 3, 5], [7, 10, 11], [12, 14, 16]]`, Target: `10`
  - Output: `true`
- **Similar Problems:** Search a 2D Matrix II, Find Target in Rotated Sorted Array.

---

**2. Pow(x, n)**

- **Question Pattern:** Implement exponentiation for a given base `x` and integer exponent `n`.
- **Approach:**
  - Use divide and conquer to optimize the computation.

- **Code (Optimized):**

```java
public double myPow(double x, int n) {
    if (n == 0) return 1;
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }

    double half = myPow(x, n / 2);
    return (n % 2 == 0) ? half * half : half * half * x;
}
```

- **Example Input:**
  - Base: `2.0`, Exponent: `10`
  - Output: `1024.0`
- **Similar Problems:** Implement sqrt(x), Calculate Fibonacci using Fast Doubling.

---

**3. Majority Element (n/2 times)**

- **Question Pattern:** Find the element that appears more than `n/2` times in an array.
- **Approach:**
  - Use Moore's Voting Algorithm for linear time complexity and constant space.

- **Code (Optimized):**

```java
public int majorityElement(int[] nums) {
    int count = 0, candidate = 0;
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}
```

- **Example Input:**
  - Input: `[2, 2, 1, 1, 1, 2, 2]`
  - Output: `2`
- **Similar Problems:** Majority Element II, Check if All Characters Occur the Same Number of Times.

---

**4. Majority Element (n/3 times)**

- **Question Pattern:** Find all elements that appear more than `n/3` times in an array.
- **Approach:**
  - Extend Moore's Voting Algorithm to allow for two potential candidates.

- **Code (Optimized):**

```java
public List<Integer> majorityElement(int[] nums) {
    int count1 = 0, count2 = 0, candidate1 = 0, candidate2 = 1;
    for (int num : nums) {
        if (num == candidate1) {
            count1++;
        } else if (num == candidate2) {
            count2++;
        } else if (count1 == 0) {
            candidate1 = num;
            count1 = 1;
        } else if (count2 == 0) {
            candidate2 = num;
            count2 = 1;
        } else {
            count1--;
            count2--;
        }
    }

    count1 = count2 = 0;
    for (int num : nums) {
        if (num == candidate1) count1++;
        else if (num == candidate2) count2++;
    }

    List<Integer> result = new ArrayList<>();
    if (count1 > nums.length / 3) result.add(candidate1);
    if (count2 > nums.length / 3) result.add(candidate2);

    return result;
}
```

- **Example Input:**
  - Input: `[3, 2, 3]`
  - Output: `[3]`
- **Similar Problems:** Boyer-Moore Voting Algorithm Variants, Count Frequent Elements in a Stream.

---

**5. Grid Unique Paths**

- **Question Pattern:** Find the number of unique paths in a grid from the top-left corner to the bottom-right corner, moving only right or down.
- **Approach:**
  - Use combinatorics to calculate the total number of moves.

- **Code (Optimized):**

```java
public int uniquePaths(int m, int n) {
    int N = m + n - 2;
    int r = Math.min(m - 1, n - 1);
    long res = 1;

    for (int i = 1; i <= r; i++) {
        res = res * (N - r + i) / i;
    }

    return (int) res;
}
```

- **Example Input:**
  - Grid Size: `m = 3, n = 7`
  - Output: `28`
- **Similar Problems:** Minimum Path Sum, Knight's Dialer.

---

**6. Reverse Pairs**

- **Question Pattern:** Count the reverse pairs in an array (pairs (i, j) where i < j and arr[i] > 2 * arr[j]).
- **Approach:**
  - Use a modified merge sort to count pairs efficiently.

- **Code (Optimized):**

```java
public int reversePairs(int[] nums) {
    return mergeSort(nums, 0, nums.length - 1);
}

private int mergeSort(int[] nums, int left, int right) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;
    int count = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);

    int j = mid + 1;
    for (int i = left; i <= mid; i++) {
        while (j <= right && nums[i] > 2L * nums[j]) j++;
        count += (j - mid - 1);
    }

    merge(nums, left, mid, right);
    return count;
}

private void merge(int[] nums, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) {
            temp[k++] = nums[i++];
        } else {
            temp[k++] = nums[j++];
        }
    }

    while (i <= mid) temp[k++] = nums[i++];
    while (j <= right) temp[k++] = nums[j++];

    System.arraycopy(temp, 0, nums, left, temp.length);
}
```

- **Example Input:**
  - Input: `[1, 3, 2, 3, 1]`
  - Output: `2` (Reverse Pairs: (3, 1), (3, 1))
- **Similar Problems:** Count Inversions, Count Significant Inversions.

