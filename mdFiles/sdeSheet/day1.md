<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Days 1-9)

  ---

  #### **Day 1: Arrays**

  **1. Set Matrix Zeroes**
  - **Question Pattern:** Given an M x N matrix, if an element is 0, set its entire row and column to 0.
  - **Approach:**
  - **Optimized:** Use the first row and column as markers instead of extra space.
  - Iterate through the matrix to identify zero locations and mark the corresponding first row/column elements.
  - Update the matrix in a second pass.
  - **Code (Optimized):**
  
```java
  public void setZeroes(int[][] matrix) {
      int rows = matrix.length, cols = matrix[0].length;
      boolean firstRowZero = false, firstColZero = false;

      // Check if the first row or column should be zeroed
      for (int i = 0; i < rows; i++) if (matrix[i][0] == 0) firstColZero = true;
      for (int j = 0; j < cols; j++) if (matrix[0][j] == 0) firstRowZero = true;

      // Mark zeroes in the first row/column
      for (int i = 1; i < rows; i++)
          for (int j = 1; j < cols; j++)
              if (matrix[i][j] == 0) {
                  matrix[i][0] = 0;
                  matrix[0][j] = 0;
              }

      // Zero out rows/columns based on markers
      for (int i = 1; i < rows; i++)
          for (int j = 1; j < cols; j++)
              if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;

      // Handle the first row and column separately
      if (firstRowZero) for (int j = 0; j < cols; j++) matrix[0][j] = 0;
      if (firstColZero) for (int i = 0; i < rows; i++) matrix[i][0] = 0;
  }
  
```
  - **Example Input:**
  - Input: `[[1, 1, 1], [1, 0, 1], [1, 1, 1]]`
  - Output: `[[1, 0, 1], [0, 0, 0], [1, 0, 1]]`
  - **Similar Problems:** Rotate Matrix (90 degrees), Spiral Matrix Traversal.

  ---

  **2. Pascal's Triangle**
  - **Question Pattern:** Generate the first `n` rows of Pascal’s Triangle.
  - **Approach:**
  - Use the property: `res[i][j] = res[i-1][j-1] + res[i-1][j]`.
  - Utilize lists to dynamically construct rows.
  - **Code:**
  
```java
  public List<List<Integer>> generate(int numRows) {
      List<List<Integer>> triangle = new ArrayList<>();

      for (int i = 0; i < numRows; i++) {
          List<Integer> row = new ArrayList<>();
          row.add(1);  // First element of each row
          for (int j = 1; j < i; j++) {
              row.add(triangle.get(i - 1).get(j - 1) + triangle.get(i - 1).get(j));
          }
          if (i > 0) row.add(1);  // Last element
          triangle.add(row);
      }

      return triangle;
  }
  
```
  - **Example Input:**
  - Input: `5`
  - Output: `[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]`
  - **Similar Problems:** Pascal’s Triangle II (return nth row).

  ---

  **3. Next Permutation**
  - **Question Pattern:** Rearrange an array into its next lexicographically greater permutation. If no such permutation exists, rearrange it as the lowest possible order.
  - **Approach:**
  - **Optimized:**
      1. Find the first decreasing element from the end.
      2. Swap it with the next larger element.
      3. Reverse the subarray to the right of the swapped element.
  - **Code (Optimized):**
  
```java
  public void nextPermutation(int[] nums) {
      int n = nums.length, i = n - 2;

      // Find the first decreasing element
      while (i >= 0 && nums[i] >= nums[i + 1]) i--;

      if (i >= 0) {
          // Find the next larger element to swap
          int j = n - 1;
          while (nums[j] <= nums[i]) j--;
          int temp = nums[i];
          nums[i] = nums[j];
          nums[j] = temp;
      }

      // Reverse the remaining elements
      reverse(nums, i + 1, n - 1);
  }

  private void reverse(int[] nums, int start, int end) {
      while (start < end) {
          int temp = nums[start];
          nums[start] = nums[end];
          nums[end] = temp;
          start++;
          end--;
      }
  }
  
```
  - **Example Input:**
  - Input: `[1, 2, 3]`
  - Output: `[1, 3, 2]`
  - **Similar Problems:** Kth Permutation Sequence, Permutations of a String/Array.

  ---

  **4. Kadane's Algorithm**
  - **Question Pattern:** Find the largest sum of any contiguous subarray in an array.
  - **Approach:**
  - Maintain a running sum (`currentSum`) and a maximum sum (`maxSum`).
  - Reset `currentSum` to 0 if it goes negative.
  - Return `maxSum`.
  - **Code (Optimized):**
  
```java
  public int maxSubArray(int[] nums) {
      int currentSum = 0, maxSum = nums[0];

      for (int num : nums) {
          currentSum = Math.max(num, currentSum + num);
          maxSum = Math.max(maxSum, currentSum);
      }

      return maxSum;
  }
  
```
  - **Example Input:**
  - Input: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`
  - Output: `6` (Subarray: `[4, -1, 2, 1]`)
  - **Similar Problems:** Maximum Circular Subarray Sum, Longest Subarray with Positive Product.

  ---

  **5. Sort Colors (Dutch National Flag Algorithm)**
  - **Question Pattern:** Given an array with elements 0, 1, and 2, sort it in-place.
  - **Approach:**
  - Use three pointers: `low`, `mid`, and `high`.
  - Swap elements to partition the array into three sections (0s, 1s, and 2s).
  - **Code (Optimized):**
  
```java
  public void sortColors(int[] nums) {
      int low = 0, mid = 0, high = nums.length - 1;

      while (mid <= high) {
          if (nums[mid] == 0) {
              int temp = nums[low];
              nums[low] = nums[mid];
              nums[mid] = temp;
              low++; mid++;
          } else if (nums[mid] == 1) {
              mid++;
          } else {
              int temp = nums[mid];
              nums[mid] = nums[high];
              nums[high] = temp;
              high--;
          }
      }
  }
  
```
  - **Example Input:**
  - Input: `[2, 0, 2, 1, 1, 0]`
  - Output: `[0, 0, 1, 1, 2, 2]`
  - **Similar Problems:** Partition Array, Segregate Even and Odd Numbers.

  ---

  #### **Day 1: Arrays**

  **6. Best Time to Buy and Sell Stock**

  - **Question Pattern:** Find the maximum profit you can achieve by buying and selling a single stock on different days. You may only hold one stock at a time.
  - **Approach:**
  - Traverse the array while keeping track of the minimum price seen so far.
  - Calculate the profit for each day as the difference between the current price and the minimum price.
  - Update the maximum profit if the calculated profit is greater.
  - **Code (Optimized):**

  
```java
  public int maxProfit(int[] prices) {
      int minPrice = Integer.MAX_VALUE;
      int maxProfit = 0;

      for (int price : prices) {
          if (price < minPrice) {
              minPrice = price;
          } else if (price - minPrice > maxProfit) {
              maxProfit = price - minPrice;
          }
      }

      return maxProfit;
  }
  
```

  - **Example Input:**
  - Input: `[7, 1, 5, 3, 6, 4]`
  - Output: `5` (Buy on day 2 at price 1 and sell on day 5 at price 6)
  - **Similar Problems:** Maximum Subarray Sum, Buy and Sell Stock with Cooldown, Buy and Sell Stock K Times.

  ---

<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>