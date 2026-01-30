<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 8: Greedy Algorithm)


---

**1. N Meetings in One Room**

- **Question Pattern:** You are given `N` meetings with start and end times. You need to find the maximum number of meetings that can be scheduled in the same room.
- **Approach:**
  - Sort meetings by their end time.
  - Schedule the meeting with the earliest end time and continue with the next meeting whose start time is greater than or equal to the end time of the last scheduled meeting.
  
- **Code (Optimized):**

  
```java
  public int maxMeetings(int start[], int end[], int n) {
      int count = 1;
      int lastEnd = end[0];
      for (int i = 1; i < n; i++) {
          if (start[i] > lastEnd) {
              count++;
              lastEnd = end[i];
          }
      }
      return count;
  }
  
```

- **Example Input:**
  - Input: `start = [1, 3, 0, 5, 8, 5], end = [2, 4, 6, 7, 9, 9]`
  - Output: `4`

- **Similar Problems:** Activity Selection Problem, Maximum Number of Meetings.

---

**2. Minimum Number of Platforms Required for a Railway**

- **Question Pattern:** Given arrival and departure times of trains, find the minimum number of platforms required at the railway station such that no train waits.
- **Approach:**
  - Sort arrival and departure times.
  - Use two pointers to iterate through the arrival and departure arrays and find the maximum number of trains at the station at any time.
  
- **Code (Optimized):**

  
```java
  public int findPlatform(int[] arr, int[] dep, int n) {
      Arrays.sort(arr);
      Arrays.sort(dep);
      int platforms = 1, result = 1;
      int i = 1, j = 0;
      while (i < n && j < n) {
          if (arr[i] <= dep[j]) {
              platforms++;
              i++;
          } else {
              platforms--;
              j++;
          }
          result = Math.max(result, platforms);
      }
      return result;
  }
  
```

- **Example Input:**
  - Input: `arr = [10, 15, 25, 30], dep = [20, 25, 30, 35]`
  - Output: `2`

- **Similar Problems:** Meeting Room II, Find the Minimum Number of Platforms.

---

**3. Job Sequencing Problem**

- **Question Pattern:** Given a set of jobs with deadlines and profits, find the maximum profit and the sequence of jobs that can be performed within the deadlines.
- **Approach:**
  - Sort the jobs in decreasing order of profits.
  - Use a greedy approach to assign jobs to available slots before the deadline.
  
- **Code (Optimized):**

  
```java
  public int jobScheduling(Job[] jobs, int n) {
      Arrays.sort(jobs, (a, b) -> b.profit - a.profit);
      int[] result = new int[n];
      Arrays.fill(result, -1);
      int maxProfit = 0;
      for (int i = 0; i < n; i++) {
          for (int j = Math.min(n, jobs[i].deadline) - 1; j >= 0; j--) {
              if (result[j] == -1) {
                  result[j] = i;
                  maxProfit += jobs[i].profit;
                  break;
              }
          }
      }
      return maxProfit;
  }
  
```

- **Example Input:**
  - Input: `jobs = [{1, 50}, {2, 20}, {3, 100}, {2, 70}]`
  - Output: `150`

- **Similar Problems:** Job Scheduling with Deadlines, Activity Selection Problem.

---

**4. Fractional Knapsack Problem**

- **Question Pattern:** Given weights and values of items, you need to find the maximum value you can carry in a knapsack of a given capacity. You can take fractions of items.
- **Approach:**
  - Calculate the value per weight ratio for each item.
  - Sort items by their value-to-weight ratio in descending order.
  - Take the highest value item first, and fill the knapsack.
  
- **Code (Optimized):**

  
```java
  public double fractionalKnapsack(int W, Item arr[], int n) {
      Arrays.sort(arr, (a, b) -> Double.compare(b.value / (double) b.weight, a.value / (double) a.weight));
      double maxValue = 0.0;
      for (int i = 0; i < n; i++) {
          if (W >= arr[i].weight) {
              W -= arr[i].weight;
              maxValue += arr[i].value;
          } else {
              maxValue += arr[i].value * (W / (double) arr[i].weight);
              break;
          }
      }
      return maxValue;
  }
  
```

- **Example Input:**
  - Input: `W = 50, arr = [{60, 10}, {100, 20}, {120, 30}]`
  - Output: `240`

- **Similar Problems:** 0/1 Knapsack Problem, Subset Sum Problem.

---

**5. Greedy Algorithm to Find Minimum Number of Coins**

- **Question Pattern:** Given an array of coins of different denominations, find the minimum number of coins required to make a certain amount.
- **Approach:**
  - Sort the coin denominations in descending order.
  - Start with the largest coin and subtract its value from the total until it cannot be used anymore.
  
- **Code (Optimized):**

  
```java
  public int minCoins(int[] coins, int V) {
      Arrays.sort(coins);
      int count = 0;
      for (int i = coins.length - 1; i >= 0; i--) {
          if (V >= coins[i]) {
              count += V / coins[i];
              V %= coins[i];
          }
      }
      return count;
  }
  
```

- **Example Input:**
  - Input: `coins = [9, 6, 5, 1], V = 11`
  - Output: `2 (Coins: 5, 6)`

- **Similar Problems:** Coin Change Problem, Minimum Number of Coins.

---

**6. Assign Cookies**

- **Question Pattern:** Given `N` children with different greed factors and `M` cookies with different sizes, find the maximum number of children who can be content with the cookies.
- **Approach:**
  - Sort both greed factors and cookie sizes in ascending order.
  - Assign the smallest cookie that satisfies each child's greed factor.
  
- **Code (Optimized):**

  
```java
  public int findContentChildren(int[] g, int[] s) {
      Arrays.sort(g);
      Arrays.sort(s);
      int i = 0, j = 0, count = 0;
      while (i < g.length && j < s.length) {
          if (g[i] <= s[j]) {
              count++;
              i++;
          }
          j++;
      }
      return count;
  }
  
```

- **Example Input:**
  - Input: `g = [1, 2, 3], s = [1, 1]`
  - Output: `1`

- **Similar Problems:** Assign Tasks to Servers, Distribute Candies.

---


<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>