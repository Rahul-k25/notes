<link rel="stylesheet" href="assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 11: Binary Search)

---

**1. The N-th Root of an Integer**

- **Question Pattern:** Find the N-th root of an integer `x`. This means finding a number `r` such that `r^n = x`.
- **Approach:**
  - Use binary search to find the integer N-th root. Narrow the search space based on whether the current guess is smaller or larger than the desired value.
  
- **Code (Optimized):**

  ```java
  public int NthRoot(int n, int x) {
      int low = 1, high = x;
      while (low <= high) {
          int mid = low + (high - low) / 2;
          long midPow = (long) Math.pow(mid, n);
          if (midPow == x) {
              return mid;
          } else if (midPow < x) {
              low = mid + 1;
          } else {
              high = mid - 1;
          }
      }
      return -1;  // No integer nth root found
  }
  ```

- **Example Input:**
  - Input: `x = 27, n = 3`
  - Output: `3 (because 3^3 = 27)`

- **Similar Problems:** Square Root of a Number, Cube Root of a Number.

---

**2. Matrix Median**

- **Question Pattern:** Given a matrix where each row is sorted, find the median of the matrix.
- **Approach:**
  - Use binary search to find the median by counting elements smaller than a potential median.
  - Search for the number of elements less than or equal to a mid-value for every row in the matrix.
  
- **Code (Optimized):**

  ```java
  public int findMedian(int[][] matrix) {
      int rows = matrix.length, cols = matrix[0].length;
      int low = matrix[0][0], high = matrix[0][cols - 1];
      
      for (int i = 1; i < rows; i++) {
          low = Math.min(low, matrix[i][0]);
          high = Math.max(high, matrix[i][cols - 1]);
      }

      int desired = (rows * cols + 1) / 2;

      while (low < high) {
          int mid = low + (high - low) / 2;
          int count = 0;

          for (int i = 0; i < rows; i++) {
              count += countLessEqual(matrix[i], mid);
          }

          if (count < desired) {
              low = mid + 1;
          } else {
              high = mid;
          }
      }
      
      return low;
  }

  private int countLessEqual(int[] row, int mid) {
      int low = 0, high = row.length;
      while (low < high) {
          int midIndex = low + (high - low) / 2;
          if (row[midIndex] <= mid) {
              low = midIndex + 1;
          } else {
              high = midIndex;
          }
      }
      return low;
  }
  ```

- **Example Input:**
  - Input: 
    ```
    [[1, 3, 5],
     [2, 6, 9],
     [3, 6, 9]]
    ```
  - Output: `5`

- **Similar Problems:** Find Median of Two Sorted Arrays, Find K-th Smallest Element in a Sorted Matrix.

---

**3. Find the Element that Appears Once in a Sorted Array, and the Rest Element Appears Twice (Binary Search)**

- **Question Pattern:** In a sorted array where all elements appear twice except one, find the element that appears only once.
- **Approach:**
  - Use binary search to find the unique element. Split the array into two parts and check for even/odd indices to identify the half where the unique element is located.
  
- **Code (Optimized):**

  ```java
  public int findSingleElement(int[] nums) {
      int low = 0, high = nums.length - 1;
      while (low < high) {
          int mid = low + (high - low) / 2;
          if (mid % 2 == 1) mid--;  // Make sure mid is always even
          
          if (nums[mid] == nums[mid + 1]) {
              low = mid + 2;  // Move to the right part
          } else {
              high = mid;  // Move to the left part
          }
      }
      return nums[low];
  }
  ```

- **Example Input:**
  - Input: `[1, 1, 2, 2, 3, 4, 4]`
  - Output: `3`

- **Similar Problems:** Find the Single Non-Duplicate Element, Find the Element that Appears Once in an Array.

---

**4. Search Element in a Sorted and Rotated Array / Find Pivot Where It is Rotated**

- **Question Pattern:** Given a rotated sorted array, search for an element in it or find the pivot where the rotation has occurred.
- **Approach:**
  - Use modified binary search to find the pivot or the element. Compare the mid element with the start and end elements to decide which part of the array to search in.
  
- **Code (Optimized):**

  ```java
  public int search(int[] nums, int target) {
      int low = 0, high = nums.length - 1;

      while (low <= high) {
          int mid = low + (high - low) / 2;

          if (nums[mid] == target) return mid;

          if (nums[low] <= nums[mid]) {  // Left half is sorted
              if (nums[low] <= target && target < nums[mid]) {
                  high = mid - 1;
              } else {
                  low = mid + 1;
              }
          } else {  // Right half is sorted
              if (nums[mid] < target && target <= nums[high]) {
                  low = mid + 1;
              } else {
                  high = mid - 1;
              }
          }
      }

      return -1;
  }
  ```

- **Example Input:**
  - Input: `nums = [4, 5, 6, 7, 0, 1, 2], target = 0`
  - Output: `4`

- **Similar Problems:** Search in a Rotated Sorted Array, Find Pivot in a Rotated Array.

---

**5. Median of 2 Sorted Arrays**

- **Question Pattern:** Given two sorted arrays, find their median.
- **Approach:**
  - Use binary search to partition the arrays in such a way that the left half contains exactly half the elements of the two arrays combined.
  
- **Code (Optimized):**

  ```java
  public double findMedianSortedArrays(int[] nums1, int[] nums2) {
      if (nums1.length > nums2.length) {
          return findMedianSortedArrays(nums2, nums1);
      }
      
      int x = nums1.length, y = nums2.length;
      int low = 0, high = x;
      
      while (low <= high) {
          int partitionX = (low + high) / 2;
          int partitionY = (x + y + 1) / 2 - partitionX;
          
          int maxX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
          int minX = (partitionX == x) ? Integer.MAX_VALUE : nums1[partitionX];
          
          int maxY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
          int minY = (partitionY == y) ? Integer.MAX_VALUE : nums2[partitionY];
          
          if (maxX <= minY && maxY <= minX) {
              if ((x + y) % 2 == 0) {
                  return (Math.max(maxX, maxY) + Math.min(minX, minY)) / 2.0;
              } else {
                  return Math.max(maxX, maxY);
              }
          } else if (maxX > minY) {
              high = partitionX - 1;
          } else {
              low = partitionX + 1;
          }
      }
      return -1;
  }
  ```

- **Example Input:**
  - Input: `nums1 = [1, 3], nums2 = [2]`
  - Output: `2.0`

- **Similar Problems:** Median of Two Sorted Arrays (Binary Search), Find the K-th Smallest Element.

---

**6. K-th Element of Two Sorted Arrays**

- **Question Pattern:** Given two sorted arrays, find the k-th smallest element in the combined array.
- **Approach:**
  - Use binary search to partition the arrays and find the k-th element by comparing elements at different partitions.
  
- **Code (Optimized):**

  ```java
  public int findKthElement(int[] nums1, int[] nums2, int k) {
      if (nums1.length > nums2.length) {
          return findKthElement(nums2, nums1, k);
      }
      
      int low = 0, high = nums1.length;
      
      while (low <= high) {
          int partitionX = (low + high) / 2;
          int partitionY = k - partitionX;
          
          int

 maxX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
          int minX = (partitionX == nums1.length) ? Integer.MAX_VALUE : nums1[partitionX];
          
          int maxY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
          int minY = (partitionY == nums2.length) ? Integer.MAX_VALUE : nums2[partitionY];
          
          if (maxX <= minY && maxY <= minX) {
              return Math.max(maxX, maxY);
          } else if (maxX > minY) {
              high = partitionX - 1;
          } else {
              low = partitionX + 1;
          }
      }
      
      return -1;
  }
  ```

- **Example Input:**
  - Input: `nums1 = [1, 3], nums2 = [2], k = 2`
  - Output: `2`

- **Similar Problems:** Find K-th Smallest Element in Two Sorted Arrays.

---

**7. Allocate Minimum Number of Pages**

- **Question Pattern:** Given `n` books and `m` students, allocate the books to the students in such a way that the maximum number of pages allocated to a student is minimized.
- **Approach:**
  - Use binary search to minimize the maximum pages assigned to any student by checking if a certain maximum is feasible.
  
- **Code (Optimized):**

  ```java
  public boolean isValid(int[] arr, int n, int m, int mid) {
      int studentCount = 1, pages = 0;
      for (int i = 0; i < n; i++) {
          if (pages + arr[i] > mid) {
              studentCount++;
              pages = arr[i];
              if (studentCount > m) {
                  return false;
              }
          } else {
              pages += arr[i];
          }
      }
      return true;
  }

  public int allocatePages(int[] arr, int n, int m) {
      int low = arr[0], high = 0;
      for (int i = 0; i < n; i++) {
          high += arr[i];
      }
      
      int result = -1;
      
      while (low <= high) {
          int mid = low + (high - low) / 2;
          
          if (isValid(arr, n, m, mid)) {
              result = mid;
              high = mid - 1;
          } else {
              low = mid + 1;
          }
      }
      
      return result;
  }
  ```

- **Example Input:**
  - Input: `arr = [12, 34, 67, 90], n = 4, m = 2`
  - Output: `113`

- **Similar Problems:** Minimum Pages Allocation, Job Scheduling Problem.

---

**8. Aggressive Cows**

- **Question Pattern:** Given `n` stalls and `k` cows, place the cows in such a way that the minimum distance between any two cows is maximized.
- **Approach:**
  - Use binary search on the distance between cows, checking for the maximum possible distance that can be achieved.
  
- **Code (Optimized):**

  ```java
  public boolean isPossible(int[] arr, int n, int k, int mid) {
      int count = 1, lastPosition = arr[0];
      for (int i = 1; i < n; i++) {
          if (arr[i] - lastPosition >= mid) {
              count++;
              lastPosition = arr[i];
              if (count == k) return true;
          }
      }
      return false;
  }

  public int aggressiveCows(int[] arr, int n, int k) {
      Arrays.sort(arr);
      int low = 1, high = arr[n - 1] - arr[0], result = -1;
      
      while (low <= high) {
          int mid = low + (high - low) / 2;
          
          if (isPossible(arr, n, k, mid)) {
              result = mid;
              low = mid + 1;
          } else {
              high = mid - 1;
          }
      }
      
      return result;
  }
  ```

- **Example Input:**
  - Input: `arr = [1, 2, 4, 8, 9], n = 5, k = 3`
  - Output: `3`

- **Similar Problems:** Minimum Distance Between Two Elements, Aggressive Cows.

---


<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>