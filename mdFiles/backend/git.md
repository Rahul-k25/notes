<link rel="stylesheet" href="assets/css/styles.css">

## **Git - Version Control System**

Git is a distributed version control system (VCS) that tracks changes in source code during software development. It allows multiple developers to collaborate efficiently, manage code versions, and revert changes when necessary.

---

## **1. What is Git?**
Git is a free and open-source distributed version control system designed to handle projects of all sizes efficiently. It helps developers track changes, collaborate with teams, and manage different versions of code.

### **Key Features:**
- **Distributed System:** Every developer has a complete copy of the repository.
- **Branching & Merging:** Enables working on separate features and merging them.
- **Lightweight & Fast:** Efficient performance for large projects.
- **Data Integrity:** Uses cryptographic hashing (SHA-1) to ensure data integrity.
- **Collaboration & Code Review:** Platforms like GitHub, GitLab, and Bitbucket enhance teamwork.

📖 **Related Resources:**
- [Official Git Documentation](https://git-scm.com/doc)
- [Git Tutorial - Atlassian](https://www.atlassian.com/git/tutorials)

---

## **2. Git vs Other Version Control Systems**

| Feature        | Git (Distributed VCS) | SVN (Centralized VCS) |
|--------------|---------------------|------------------|
| Repository Structure | Every user has a full repo | Centralized server |
| Offline Work | Fully supports offline commits | Limited offline functionality |
| Branching & Merging | Easy and fast | Complex and slow |
| Speed & Performance | Faster due to local storage | Slower, dependent on server |
| Security | SHA-1 hashing ensures data integrity | Less secure |

📖 **Related Resources:**
- [Git vs SVN - GeeksforGeeks](https://www.geeksforgeeks.org/difference-between-git-and-svn/)

---

## **3. Basic Git Workflow**

### **Step 1: Initialize a Repository**
```sh
git init
```
Creates a new Git repository.

### **Step 2: Clone a Repository**
```sh
git clone <repository-url>
```
Copies an existing repository from a remote server.

### **Step 3: Check Status**
```sh
git status
```
Displays changes and the state of the working directory.

### **Step 4: Add Files to Staging Area**
```sh
git add <file-name>
git add .  # Adds all files
```
Prepares files for commit.

### **Step 5: Commit Changes**
```sh
git commit -m "Your commit message"
```
Saves changes to the repository with a message.

### **Step 6: Push Changes to Remote Repository**
```sh
git push origin main  # Push to main branch
```
Uploads local changes to a remote repository.

### **Step 7: Pull Changes from Remote Repository**
```sh
git pull origin main
```
Fetches and merges changes from the remote repository.

📖 **Related Resources:**
- [Git Basics - GitHub Docs](https://docs.github.com/en/get-started/using-git)

---

## **4. Git Branching & Merging**
Branches allow developers to work on features independently without affecting the main codebase.

### **Creating a Branch**
```sh
git branch feature-branch
```
Creates a new branch.

### **Switching to a Branch**
```sh
git checkout feature-branch
```
Switches to an existing branch.

### **Merging Branches**
```sh
git checkout main
git merge feature-branch
```
Combines changes from `feature-branch` into `main`.

### **Deleting a Branch**
```sh
git branch -d feature-branch
```
Removes a branch after merging.

📖 **Related Resources:**
- [Git Branching - Git Docs](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

---

## **5. Git Remote Repositories**

Git allows collaboration via remote repositories hosted on platforms like GitHub, GitLab, and Bitbucket.

### **Add a Remote Repository**
```sh
git remote add origin <repository-url>
```
Links a local repository to a remote one.

### **View Remote Repositories**
```sh
git remote -v
```
Lists remote repositories linked to the project.

### **Fetch Remote Changes**
```sh
git fetch origin
```
Retrieves latest changes without merging.

📖 **Related Resources:**
- [Git Remotes - GitHub Docs](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories)

---

## **6. Handling Git Conflicts**
Merge conflicts occur when changes from different branches affect the same lines of code.

### **Steps to Resolve Conflicts:**
1. Identify conflicts using `git status`.
2. Manually edit the conflicting files.
3. Mark the conflict as resolved:
   ```sh
   git add <file-name>
   ```
4. Commit the resolution:
   ```sh
   git commit -m "Resolved merge conflict"
   ```

📖 **Related Resources:**
- [Handling Git Conflicts - Git Docs](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented)

---

## **7. Git Reverting & Resetting**

### **Undoing Changes (Reset vs Revert vs Checkout)**
- **Revert a Commit:**
  ```sh
  git revert <commit-id>
  ```
  Creates a new commit that undoes the specified commit.

- **Reset to a Previous Commit:**
  ```sh
  git reset --hard <commit-id>
  ```
  Moves HEAD to a previous commit and discards changes.

- **Checkout an Old Commit (Read-Only):**
  ```sh
  git checkout <commit-id>
  ```
  Temporarily switches to an old commit.

📖 **Related Resources:**
- [Git Reset vs Revert vs Checkout - Atlassian](https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting)

---

## **8. Git Best Practices**
- Use **meaningful commit messages**.
- Commit **small, atomic changes**.
- Regularly **fetch and merge** to stay updated.
- Avoid **pushing directly to main** (use pull requests).
- Use **.gitignore** to exclude unnecessary files.
- Regularly **backup** your repository remotely.

📖 **Related Resources:**
- [Best Git Practices - GitHub Docs](https://docs.github.com/en/github/getting-started-with-github/git-and-github-learning-resources)





<script src="assets/js/accordion.js"></script>
<script src="assets/js/theme.js"></script>