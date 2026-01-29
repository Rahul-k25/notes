<link rel="stylesheet" href="assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 10: Recursion and Backtracking)

---

**1. Print All Permutations of a String/Array**

- **Question Pattern:** Given a string or array, print all possible permutations of the elements.
- **Approach:**
  - Use backtracking to generate all permutations by swapping elements.
  - Recursively fix one element at each position and generate permutations of the remaining elements.
  
- **Code (Optimized):**

  ```java
  public List<String> permute(String str) {
      List<String> result = new ArrayList<>();
      backtrack(str.toCharArray(), 0, result);
      return result;
  }

  private void backtrack(char[] str, int index, List<String> result) {
      if (index == str.length) {
          result.add(new String(str));
          return;
      }
      for (int i = index; i < str.length; i++) {
          swap(str, i, index);
          backtrack(str, index + 1, result);
          swap(str, i, index);  // backtrack
      }
  }

  private void swap(char[] str, int i, int j) {
      char temp = str[i];
      str[i] = str[j];
      str[j] = temp;
  }
  ```

- **Example Input:**
  - Input: `"ABC"`
  - Output: `["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]`

- **Similar Problems:** Permutation Sequence, Next Permutation.

---

**2. N Queens Problem**

- **Question Pattern:** Place `N` queens on an `N x N` chessboard such that no two queens threaten each other. Find all possible solutions.
- **Approach:**
  - Use backtracking to place queens row by row, ensuring no conflicts in columns, and diagonals.
  
- **Code (Optimized):**

  ```java
  public List<List<String>> solveNQueens(int n) {
      List<List<String>> result = new ArrayList<>();
      int[] board = new int[n];  // board[i] = column where queen is placed in row i
      backtrack(board, 0, n, result);
      return result;
  }

  private void backtrack(int[] board, int row, int n, List<List<String>> result) {
      if (row == n) {
          result.add(createBoard(board, n));
          return;
      }
      for (int col = 0; col < n; col++) {
          if (isSafe(board, row, col, n)) {
              board[row] = col;
              backtrack(board, row + 1, n, result);
          }
      }
  }

  private boolean isSafe(int[] board, int row, int col, int n) {
      for (int i = 0; i < row; i++) {
          if (board[i] == col || Math.abs(board[i] - col) == row - i) {
              return false;
          }
      }
      return true;
  }

  private List<String> createBoard(int[] board, int n) {
      List<String> boardRepresentation = new ArrayList<>();
      for (int i = 0; i < n; i++) {
          char[] row = new char[n];
          Arrays.fill(row, '.');
          row[board[i]] = 'Q';
          boardRepresentation.add(new String(row));
      }
      return boardRepresentation;
  }
  ```

- **Example Input:**
  - Input: `n = 4`
  - Output: `[[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]`

- **Similar Problems:** N-Queens II, Sudoku Solver.

---

**3. Sudoku Solver**

- **Question Pattern:** Given a partially filled `9x9` sudoku board, fill the board such that each row, column, and `3x3` subgrid contains the numbers `1-9` exactly once.
- **Approach:**
  - Use backtracking to fill the board while validating the current state at each step.
  
- **Code (Optimized):**

  ```java
  public void solveSudoku(char[][] board) {
      solve(board);
  }

  private boolean solve(char[][] board) {
      for (int i = 0; i < 9; i++) {
          for (int j = 0; j < 9; j++) {
              if (board[i][j] == '.') {
                  for (char c = '1'; c <= '9'; c++) {
                      if (isValid(board, i, j, c)) {
                          board[i][j] = c;
                          if (solve(board)) {
                              return true;
                          }
                          board[i][j] = '.';  // backtrack
                      }
                  }
                  return false;  // No valid number found, backtrack
              }
          }
      }
      return true;  // Solved
  }

  private boolean isValid(char[][] board, int row, int col, char c) {
      for (int i = 0; i < 9; i++) {
          if (board[row][i] == c || board[i][col] == c || board[row / 3 * 3 + i / 3][col / 3 * 3 + i % 3] == c) {
              return false;
          }
      }
      return true;
  }
  ```

- **Example Input:**
  - Input: 
    ```
    [["5","3",".",".","7",".",".",".","."],
     ["6",".",".","1","9","5",".",".","."],
     [".","9","8",".",".",".",".","6","."],
     ["8",".",".",".","6",".",".",".","3"],
     ["4",".",".","8",".","3",".",".","1"],
     ["7",".",".",".","2",".",".",".","6"],
     [".","6",".",".",".",".","2","8","."],
     [".",".",".","4","1","9",".",".","5"],
     [".",".",".",".","8",".",".","7","9"]]
    ```
  - Output: The solved sudoku grid.

- **Similar Problems:** N-Queens Problem, Backtracking.

---

**4. M Coloring Problem**

- **Question Pattern:** Given a graph with `N` vertices and `M` colors, determine if the graph can be colored using `M` colors such that no two adjacent vertices have the same color.
- **Approach:**
  - Use backtracking to assign colors to vertices and check the validity at each step.
  
- **Code (Optimized):**

  ```java
  public boolean graphColoring(int[][] graph, int m, int n) {
      int[] colors = new int[n];
      return solve(graph, m, 0, colors);
  }

  private boolean solve(int[][] graph, int m, int node, int[] colors) {
      if (node == graph.length) {
          return true;  // All nodes are colored
      }
      for (int color = 1; color <= m; color++) {
          if (isSafe(graph, node, color, colors)) {
              colors[node] = color;
              if (solve(graph, m, node + 1, colors)) {
                  return true;
              }
              colors[node] = 0;  // backtrack
          }
      }
      return false;  // No valid color found
  }

  private boolean isSafe(int[][] graph, int node, int color, int[] colors) {
      for (int i = 0; i < graph.length; i++) {
          if (graph[node][i] == 1 && colors[i] == color) {
              return false;  // adjacent nodes with same color
          }
      }
      return true;
  }
  ```

- **Example Input:**
  - Input: `graph = [[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 0]], m = 3`
  - Output: `true`

- **Similar Problems:** Graph Coloring, N-Queens Problem.

---

**5. Rat in a Maze**

- **Question Pattern:** A rat starts at the top-left corner of a maze and must find a path to the bottom-right corner. The rat can only move through cells that are not blocked.
- **Approach:**
  - Use backtracking to explore possible paths.
  - Mark cells as visited and backtrack if no valid move is possible.
  
- **Code (Optimized):**

  ```java
  public List<String> findPaths(int[][] maze, int n) {
      List<String> paths = new ArrayList<>();
      boolean[][] visited = new boolean[n][n];
      backtrack(maze, n, 0, 0, "", visited, paths);
      return paths;
  }

  private void backtrack(int[][] maze, int n, int x, int y, String path, boolean[][] visited, List<String> paths) {
      if (x < 0 || x >= n || y < 0 || y >= n || maze[x][y] == 0 || visited[x][y]) return;
      if (x == n - 1 && y == n - 1) {
          paths.add(path);
          return;
      }
      visited[x][y] = true;
      backtrack(maze, n, x + 1, y, path + "D", visited,

 paths);  // Down
      backtrack(maze, n, x - 1, y, path + "U", visited, paths);  // Up
      backtrack(maze, n, x, y + 1, path + "R", visited, paths);  // Right
      backtrack(maze, n, x, y - 1, path + "L", visited, paths);  // Left
      visited[x][y] = false;
  }
  ```

- **Example Input:**
  - Input: `maze = [[1, 0, 0, 0], [1, 1, 0, 1], [0, 1, 0, 0], [1, 1, 1, 1]]`
  - Output: `["DDRDR", "DRDDRR"]`

- **Similar Problems:** Knight's Tour, Word Break (Print All Ways).

---

**6. Word Break (Print All Ways)**

- **Question Pattern:** Given a string and a dictionary, print all possible ways to break the string into valid words from the dictionary.
- **Approach:**
  - Use backtracking to explore all possible ways of splitting the string.
  - At each step, check if the prefix exists in the dictionary, and recurse for the remaining part.
  
- **Code (Optimized):**

  ```java
  public List<String> wordBreak(String s, Set<String> wordDict) {
      List<String> result = new ArrayList<>();
      backtrack(s, wordDict, 0, "", result);
      return result;
  }

  private void backtrack(String s, Set<String> wordDict, int index, String current, List<String> result) {
      if (index == s.length()) {
          result.add(current.trim());
          return;
      }
      for (int i = index + 1; i <= s.length(); i++) {
          String prefix = s.substring(index, i);
          if (wordDict.contains(prefix)) {
              backtrack(s, wordDict, i, current + " " + prefix, result);
          }
      }
  }
  ```

- **Example Input:**
  - Input: `s = "catsanddog"`, `wordDict = ["cat", "cats", "and", "sand", "dog"]`
  - Output: `["cats and dog", "cat sand dog"]`

- **Similar Problems:** String Segmentation, Palindrome Partitioning.

--- 


<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>