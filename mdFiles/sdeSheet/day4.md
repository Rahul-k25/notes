### Striver's SDE Sheet Notes (Day 4: Arrays & Hashing)

---

**1. Two Sum**

- **Question Pattern:** Find two numbers in an array that add up to a target sum.
- **Approach:**
  - Use a hash map to store the complement of each number while traversing the array.
  - If the complement exists in the map, return the indices.

- **Code (Optimized):**

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (numMap.containsKey(complement)) {
            return new int[] { numMap.get(complement), i };
        }
        numMap.put(nums[i], i);
    }
    return new int[0];
}
```

- **Example Input:**
  - Input: `nums = [2, 7, 11, 15], target = 9`
  - Output: `[0, 1]`
- **Similar Problems:** 3Sum, 4Sum, Subarray Sum Equals K.

---

**2. 4-Sum**

- **Question Pattern:** Find all unique quadruplets in an array that sum to a target.
- **Approach:**
  - Sort the array and use two pointers within a nested loop.
  - Avoid duplicates using conditions during traversal.

- **Code (Optimized):**

```java
public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int left = j + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    return result;
}
```

- **Example Input:**
  - Input: `nums = [1, 0, -1, 0, -2, 2], target = 0`
  - Output: `[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]`
- **Similar Problems:** 3Sum, Two Sum, K-Sum.

---

**3. Longest Consecutive Sequence**

- **Question Pattern:** Find the length of the longest consecutive sequence of integers in an unsorted array.
- **Approach:**
  - Use a hash set to store all elements.
  - For each element, check if it's the start of a sequence, and count the sequence length.

- **Code (Optimized):**

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }

    int maxLength = 0;
    for (int num : numSet) {
        if (!numSet.contains(num - 1)) {
            int currentNum = num;
            int length = 1;

            while (numSet.contains(currentNum + 1)) {
                currentNum++;
                length++;
            }
            maxLength = Math.max(maxLength, length);
        }
    }

    return maxLength;
}
```

- **Example Input:**
  - Input: `[100, 4, 200, 1, 3, 2]`
  - Output: `4` (Sequence: `[1, 2, 3, 4]`)
- **Similar Problems:** Longest Arithmetic Subsequence, Longest Increasing Subsequence.

---

**4. Largest Subarray with K Sum**

- **Question Pattern:** Find the length of the largest subarray whose sum equals K.
- **Approach:**
  - Use a hash map to store prefix sums and their first occurrences.
  - If `(prefix sum - K)` exists, update the maximum length.

- **Code (Optimized):**

```java
public int maxSubArrayLen(int[] nums, int k) {
    Map<Integer, Integer> prefixSumMap = new HashMap<>();
    int maxLength = 0, sum = 0;

    for (int i = 0; i < nums.length; i++) {
        sum += nums[i];

        if (sum == k) {
            maxLength = i + 1;
        }
        if (prefixSumMap.containsKey(sum - k)) {
            maxLength = Math.max(maxLength, i - prefixSumMap.get(sum - k));
        }
        prefixSumMap.putIfAbsent(sum, i);
    }

    return maxLength;
}
```

- **Example Input:**
  - Input: `nums = [1, -1, 5, -2, 3], k = 3`
  - Output: `4` (Subarray: `[1, -1, 5, -2]`)
- **Similar Problems:** Subarray Sum Equals K, Largest Subarray with Equal Number of 0s and 1s.

---

**5. Count Subarrays with Given XOR**

- **Question Pattern:** Count the number of subarrays whose XOR equals a given value.
- **Approach:**
  - Use a hash map to store the frequency of prefix XOR values.
  - For each prefix XOR, check if `(prefix XOR ^ target)` exists in the hash map.

- **Code (Optimized):**

```java
public int subarraysWithXor(int[] nums, int target) {
    Map<Integer, Integer> prefixXorMap = new HashMap<>();
    int xor = 0, count = 0;

    for (int num : nums) {
        xor ^= num;
        if (xor == target) count++;
        if (prefixXorMap.containsKey(xor ^ target)) {
            count += prefixXorMap.get(xor ^ target);
        }
        prefixXorMap.put(xor, prefixXorMap.getOrDefault(xor, 0) + 1);
    }

    return count;
}
```

- **Example Input:**
  - Input: `nums = [4, 2, 2, 6, 4]`, Target: `6`
  - Output: `4`
- **Similar Problems:** Count Subarrays with Given Sum, Subarray Sums Divisible by K.

---

**6. Longest Substring Without Repeating Characters**

- **Question Pattern:** Find the length of the longest substring in a given string without repeating characters.
- **Approach:**
  - Use the sliding window technique with a hash map to track character indices.
  - Expand the window while characters are unique, and shrink when duplicates are found.

- **Code (Optimized):**

```java
public int lengthOfLongestSubstring(String s) {
    int n = s.length(), maxLength = 0;
    Map<Character, Integer> charIndexMap = new HashMap<>();
    int left = 0;

    for (int right = 0; right < n; right++) {
        if (charIndexMap.containsKey(s.charAt(right))) {
            left = Math.max(charIndexMap.get(s.charAt(right)) + 1, left);
        }
        charIndexMap.put(s.charAt(right), right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

- **Example Input:**
  - Input: `"abcabcbb"`
  - Output: `3 (Longest substring: "abc")`

- **Similar Problems:** Longest Subarray with At Most K Distinct Elements, Find Anagrams in a String.

