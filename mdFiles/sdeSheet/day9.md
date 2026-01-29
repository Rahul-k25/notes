<link rel="stylesheet" href="assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 9: Recursion)

---

**1. Subset Sums**

- **Question Pattern:** Given a set of numbers, find all possible sums of subsets.
- **Approach:**
  - Use backtracking to explore all possible subsets.
  - For each subset, calculate the sum and add it to the result.
  
- **Code (Optimized):**

  ```java
  public List<Integer> subsetSums(int[] nums) {
      List<Integer> result = new ArrayList<>();
      backtrack(nums, 0, 0, result);
      return result;
  }

  private void backtrack(int[] nums, int index, int currentSum, List<Integer> result) {
      if (index == nums.length) {
          result.add(currentSum);
          return;
      }
      backtrack(nums, index + 1, currentSum + nums[index], result);  // Include current number
      backtrack(nums, index + 1, currentSum, result);  // Exclude current number
  }
  ```

- **Example Input:**
  - Input: `nums = [1, 2, 3]`
  - Output: `[0, 1, 2, 3, 3, 4, 5, 6]`

- **Similar Problems:** Subset Sum Problem, Power Set.

---

**2. Subset-II**

- **Question Pattern:** Given a collection of integers that might contain duplicates, find all possible subsets (power set).
- **Approach:**
  - Use backtracking to generate subsets and avoid duplicates by sorting the input array and skipping duplicates during recursion.
  
- **Code (Optimized):**

  ```java
  public List<List<Integer>> subsetsWithDup(int[] nums) {
      List<List<Integer>> result = new ArrayList<>();
      Arrays.sort(nums);
      backtrack(nums, 0, new ArrayList<>(), result);
      return result;
  }

  private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
      result.add(new ArrayList<>(current));
      for (int i = start; i < nums.length; i++) {
          if (i > start && nums[i] == nums[i - 1]) continue;  // Skip duplicates
          current.add(nums[i]);
          backtrack(nums, i + 1, current, result);
          current.remove(current.size() - 1);
      }
  }
  ```

- **Example Input:**
  - Input: `nums = [1, 2, 2]`
  - Output: `[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]`

- **Similar Problems:** Subset Sum II, Combination Sum II.

---

**3. Combination Sum-1**

- **Question Pattern:** Given a set of candidates and a target number, find all unique combinations where the candidates sum to the target.
- **Approach:**
  - Use backtracking to explore all combinations.
  - Add an element only if the remaining target is still valid.
  
- **Code (Optimized):**

  ```java
  public List<List<Integer>> combinationSum(int[] candidates, int target) {
      List<List<Integer>> result = new ArrayList<>();
      backtrack(candidates, 0, target, new ArrayList<>(), result);
      return result;
  }

  private void backtrack(int[] candidates, int start, int target, List<Integer> current, List<List<Integer>> result) {
      if (target == 0) {
          result.add(new ArrayList<>(current));
          return;
      }
      for (int i = start; i < candidates.length; i++) {
          if (candidates[i] > target) continue;
          current.add(candidates[i]);
          backtrack(candidates, i, target - candidates[i], current, result);  // Can reuse the same number
          current.remove(current.size() - 1);
      }
  }
  ```

- **Example Input:**
  - Input: `candidates = [2, 3, 6, 7], target = 7`
  - Output: `[[2, 2, 3], [7]]`

- **Similar Problems:** Combination Sum II, Coin Change Problem.

---

**4. Combination Sum-2**

- **Question Pattern:** Given a set of candidates and a target number, find all unique combinations where the candidates sum to the target. Each number in the candidates can only be used once.
- **Approach:**
  - Use backtracking and skip duplicate candidates to avoid repeated combinations.
  
- **Code (Optimized):**

  ```java
  public List<List<Integer>> combinationSum2(int[] candidates, int target) {
      List<List<Integer>> result = new ArrayList<>();
      Arrays.sort(candidates);
      backtrack(candidates, 0, target, new ArrayList<>(), result);
      return result;
  }

  private void backtrack(int[] candidates, int start, int target, List<Integer> current, List<List<Integer>> result) {
      if (target == 0) {
          result.add(new ArrayList<>(current));
          return;
      }
      for (int i = start; i < candidates.length; i++) {
          if (i > start && candidates[i] == candidates[i - 1]) continue;  // Skip duplicates
          if (candidates[i] > target) break;
          current.add(candidates[i]);
          backtrack(candidates, i + 1, target - candidates[i], current, result);
          current.remove(current.size() - 1);
      }
  }
  ```

- **Example Input:**
  - Input: `candidates = [10, 1, 2, 7, 6, 5], target = 8`
  - Output: `[[1, 2, 5], [1, 7], [2, 6]]`

- **Similar Problems:** Combination Sum-1, Subset Sum Problem.

---

**5. Palindrome Partitioning**

- **Question Pattern:** Given a string, partition it such that every substring is a palindrome. Return all possible palindrome partitioning.
- **Approach:**
  - Use backtracking to try all possible partitions.
  - For each partition, check if the substring is a palindrome.
  
- **Code (Optimized):**

  ```java
  public List<List<String>> partition(String s) {
      List<List<String>> result = new ArrayList<>();
      backtrack(s, 0, new ArrayList<>(), result);
      return result;
  }

  private void backtrack(String s, int start, List<String> current, List<List<String>> result) {
      if (start == s.length()) {
          result.add(new ArrayList<>(current));
          return;
      }
      for (int end = start + 1; end <= s.length(); end++) {
          String substring = s.substring(start, end);
          if (isPalindrome(substring)) {
              current.add(substring);
              backtrack(s, end, current, result);
              current.remove(current.size() - 1);
          }
      }
  }

  private boolean isPalindrome(String s) {
      int left = 0, right = s.length() - 1;
      while (left < right) {
          if (s.charAt(left) != s.charAt(right)) return false;
          left++;
          right--;
      }
      return true;
  }
  ```

- **Example Input:**
  - Input: `"aab"`
  - Output: `[["a", "a", "b"], ["aa", "b"]]`

- **Similar Problems:** Palindrome Substrings, Split Palindrome.

---

**6. K-th Permutation Sequence**

- **Question Pattern:** Given `n` and `k`, find the `k`-th permutation sequence of numbers from `1` to `n`.
- **Approach:**
  - Use factorial-based approach to find the `k`-th permutation by determining each element of the permutation.
  
- **Code (Optimized):**

  ```java
  public String getPermutation(int n, int k) {
      List<Integer> numbers = new ArrayList<>();
      for (int i = 1; i <= n; i++) numbers.add(i);
      int fact = 1;
      for (int i = 1; i < n; i++) fact *= i;
      k--;  // Convert k to zero-based index
      StringBuilder result = new StringBuilder();
      for (int i = n - 1; i >= 0; i--) {
          int index = k / fact;
          result.append(numbers.get(index));
          numbers.remove(index);
          if (i > 0) k %= fact;
          fact /= i;
      }
      return result.toString();
  }
  ```

- **Example Input:**
  - Input: `n = 3, k = 3`
  - Output: `"213"`

- **Similar Problems:** Permutation Sequence, Next Permutation.

---


<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>