<link rel="stylesheet" href="../../assets/css/styles.css">

### Striver's SDE Sheet Notes (Day 17: Binary Tree)

---

**1. Inorder Traversal**

- **Question Pattern:** Traverse a binary tree in inorder (left, root, right) and return the traversal as an array.
- **Approach:**
  - Use recursion to visit the left subtree, the root, and then the right subtree.
  
- **Code (Recursive):**

  ```java
  public List<Integer> inorderTraversal(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      inorder(root, result);
      return result;
  }
  
  private void inorder(TreeNode node, List<Integer> result) {
      if (node == null) return;
      inorder(node.left, result);
      result.add(node.val);
      inorder(node.right, result);
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[1, 3, 2]`

---

**2. Preorder Traversal**

- **Question Pattern:** Traverse a binary tree in preorder (root, left, right) and return the traversal as an array.
- **Approach:**
  - Use recursion to visit the root, the left subtree, and then the right subtree.
  
- **Code (Recursive):**

  ```java
  public List<Integer> preorderTraversal(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      preorder(root, result);
      return result;
  }
  
  private void preorder(TreeNode node, List<Integer> result) {
      if (node == null) return;
      result.add(node.val);
      preorder(node.left, result);
      preorder(node.right, result);
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[1, 2, 3]`

---

**3. Postorder Traversal**

- **Question Pattern:** Traverse a binary tree in postorder (left, right, root) and return the traversal as an array.
- **Approach:**
  - Use recursion to visit the left subtree, the right subtree, and then the root.
  
- **Code (Recursive):**

  ```java
  public List<Integer> postorderTraversal(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      postorder(root, result);
      return result;
  }
  
  private void postorder(TreeNode node, List<Integer> result) {
      if (node == null) return;
      postorder(node.left, result);
      postorder(node.right, result);
      result.add(node.val);
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[3, 2, 1]`

---

**4. Morris Inorder Traversal**

- **Question Pattern:** Perform inorder traversal without using recursion or stack.
- **Approach:**
  - Use the concept of threaded binary trees. Modify the tree during traversal and restore it after visiting nodes.
  
- **Code:**

  ```java
  public List<Integer> morrisInorderTraversal(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      TreeNode current = root;
      
      while (current != null) {
          if (current.left == null) {
              result.add(current.val);
              current = current.right;
          } else {
              TreeNode pre = current.left;
              while (pre.right != null && pre.right != current) {
                  pre = pre.right;
              }
              if (pre.right == null) {
                  pre.right = current;
                  current = current.left;
              } else {
                  pre.right = null;
                  result.add(current.val);
                  current = current.right;
              }
          }
      }
      
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[1, 3, 2]`

---

**5. Morris Preorder Traversal**

- **Question Pattern:** Perform preorder traversal without using recursion or stack.
- **Approach:**
  - Use the threaded binary tree approach to visit nodes in preorder.
  
- **Code:**

  ```java
  public List<Integer> morrisPreorderTraversal(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      TreeNode current = root;
      
      while (current != null) {
          if (current.left == null) {
              result.add(current.val);
              current = current.right;
          } else {
              TreeNode pre = current.left;
              while (pre.right != null && pre.right != current) {
                  pre = pre.right;
              }
              if (pre.right == null) {
                  result.add(current.val);
                  pre.right = current;
                  current = current.left;
              } else {
                  pre.right = null;
                  current = current.right;
              }
          }
      }
      
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[1, 2, 3]`

---

**6. LeftView of Binary Tree**

- **Question Pattern:** Print the left view of a binary tree, which includes the first node at each level.
- **Approach:**
  - Use level order traversal (BFS) and print the first node at each level.
  
- **Code (BFS):**

  ```java
  public List<Integer> leftView(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      if (root == null) return result;
      
      Queue<TreeNode> queue = new LinkedList<>();
      queue.add(root);
      
      while (!queue.isEmpty()) {
          int size = queue.size();
          for (int i = 0; i < size; i++) {
              TreeNode node = queue.poll();
              if (i == 0) result.add(node.val);
              if (node.left != null) queue.add(node.left);
              if (node.right != null) queue.add(node.right);
          }
      }
      
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`
  - Output: `[1, 2, 4]`

---

**7. Bottom View of Binary Tree**

- **Question Pattern:** Print the bottom view of a binary tree, which includes the last node at each horizontal distance.
- **Approach:**
  - Use level order traversal (BFS) and maintain a map of horizontal distance to node value.
  
- **Code (BFS):**

  ```java
  public List<Integer> bottomView(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      if (root == null) return result;
      
      Map<Integer, Integer> map = new TreeMap<>();
      Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
      queue.add(new Pair<>(root, 0));
      
      while (!queue.isEmpty()) {
          Pair<TreeNode, Integer> pair = queue.poll();
          TreeNode node = pair.getKey();
          int hd = pair.getValue();
          
          map.put(hd, node.val);
          
          if (node.left != null) queue.add(new Pair<>(node.left, hd - 1));
          if (node.right != null) queue.add(new Pair<>(node.right, hd + 1));
      }
      
      result.addAll(map.values());
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`
  - Output: `[4, 2, 5, 6]`

---

**8. Top View of Binary Tree**

- **Question Pattern:** Print the top view of a binary tree, which includes the first node visible at each horizontal distance.
- **Approach:**
  - Similar to bottom view, but maintain the map and only update it if the horizontal distance is not already in the map.
  
- **Code (BFS):**

  ```java
  public List<Integer> topView(TreeNode root) {
      List<Integer> result = new ArrayList<>();
      if (root == null) return result;
      
      Map<Integer, Integer> map = new TreeMap<>();
      Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
      queue.add(new Pair<>(root, 0));
      
      while (!queue.isEmpty()) {
          Pair<TreeNode, Integer> pair = queue.poll();
          TreeNode node = pair.getKey();
          int hd = pair.getValue();
          
          if (!map.containsKey(hd)) {
              map.put(hd, node.val);
          }
          
          if (node.left != null) queue.add(new Pair<>(node.left, hd - 1));
          if (node.right != null) queue.add(new Pair<>(node.right, hd + 1));
      }
      
      result.addAll(map.values());
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`
  - Output: `[4, 2, 1, 3]`

---

**9. Preorder, Inorder, Postorder in a Single Traversal**

- **Question Pattern:** Traverse a binary tree and return the results of preorder, inorder, and postorder traversals in a single traversal.
- **

Approach:**
  - Use a single traversal (recursive or iterative) to collect all three traversal results.
  
- **Code (Recursive):**

  ```java
  public List<List<Integer>> threeOrders(TreeNode root) {
      List<List<Integer>> result = new ArrayList<>();
      List<Integer> preorder = new ArrayList<>();
      List<Integer> inorder = new ArrayList<>();
      List<Integer> postorder = new ArrayList<>();
      
      traverse(root, preorder, inorder, postorder);
      result.add(preorder);
      result.add(inorder);
      result.add(postorder);
      
      return result;
  }
  
  private void traverse(TreeNode node, List<Integer> preorder, List<Integer> inorder, List<Integer> postorder) {
      if (node == null) return;
      
      preorder.add(node.val);
      traverse(node.left, preorder, inorder, postorder);
      inorder.add(node.val);
      traverse(node.right, preorder, inorder, postorder);
      postorder.add(node.val);
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, null, 2, 3]`
  - Output: `[[1, 2, 3], [1, 3, 2], [3, 2, 1]]`

---

**10. Vertical Order Traversal**

- **Question Pattern:** Print the vertical order traversal of a binary tree.
- **Approach:**
  - Use BFS and a map to group nodes by their horizontal distance and then print the values in sorted order of their distances.
  
- **Code (BFS):**

  ```java
  public List<List<Integer>> verticalOrder(TreeNode root) {
      List<List<Integer>> result = new ArrayList<>();
      if (root == null) return result;
      
      Map<Integer, List<Integer>> map = new TreeMap<>();
      Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
      queue.add(new Pair<>(root, 0));
      
      while (!queue.isEmpty()) {
          Pair<TreeNode, Integer> pair = queue.poll();
          TreeNode node = pair.getKey();
          int hd = pair.getValue();
          
          map.putIfAbsent(hd, new ArrayList<>());
          map.get(hd).add(node.val);
          
          if (node.left != null) queue.add(new Pair<>(node.left, hd - 1));
          if (node.right != null) queue.add(new Pair<>(node.right, hd + 1));
      }
      
      result.addAll(map.values());
      return result;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`
  - Output: `[[4], [2], [1, 5, 6], [3]]`

---

**11. Root to Node Path in Binary Tree**

- **Question Pattern:** Find the path from the root to a given node in a binary tree.
- **Approach:**
  - Perform a DFS to find the node and store the path.
  
- **Code (DFS):**

  ```java
  public List<Integer> rootToNodePath(TreeNode root, int target) {
      List<Integer> path = new ArrayList<>();
      if (findPath(root, target, path)) {
          return path;
      }
      return new ArrayList<>();
  }
  
  private boolean findPath(TreeNode node, int target, List<Integer> path) {
      if (node == null) return false;
      
      path.add(node.val);
      
      if (node.val == target) return true;
      
      if (findPath(node.left, target, path) || findPath(node.right, target, path)) {
          return true;
      }
      
      path.remove(path.size() - 1);
      return false;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`, Target: `5`
  - Output: `[1, 3, 5]`

---

**12. Max Width of a Binary Tree**

- **Question Pattern:** Find the maximum width of a binary tree, defined as the maximum number of nodes at any level.
- **Approach:**
  - Use BFS to traverse each level and find the maximum width.
  
- **Code (BFS):**

  ```java
  public int maxWidth(TreeNode root) {
      if (root == null) return 0;
      
      Queue<TreeNode> queue = new LinkedList<>();
      queue.add(root);
      int maxWidth = 0;
      
      while (!queue.isEmpty()) {
          int size = queue.size();
          maxWidth = Math.max(maxWidth, size);
          
          for (int i = 0; i < size; i++) {
              TreeNode node = queue.poll();
              if (node.left != null) queue.add(node.left);
              if (node.right != null) queue.add(node.right);
          }
      }
      
      return maxWidth;
  }
  ```

- **Example Input:**
  - Input: Binary Tree: `[1, 2, 3, 4, null, 5, 6]`
  - Output: `4` (at level 2)

---


<script src="../../assets/js/accordion.js"></script>
<script src="../../assets/js/theme.js"></script>