<link rel="stylesheet" href="../assets/css/styles.css">

# Advanced SQL Study Notes


## Chapter 1: JOINS and Set Operations


## 1. Inner Join (Revisited with Advanced Understanding)

An inner join returns rows that have matching values in both tables. At the advanced level, understanding join cardinality and join ordering matters.

Key points:

* An inner join requires a matching condition.
* Rows without matches in either table are filtered out.
* The final cardinality depends on the uniqueness of join keys.

Example:

```sql
SELECT c.customer_id, c.name, o.order_id, o.amount
FROM customers c
INNER JOIN orders o
    ON c.customer_id = o.customer_id;
```

Follow-up questions:

1. What happens if the join key in the orders table is not unique?
2. How can you detect unintentional many-to-many joins?
3. How does the database optimizer decide join order?

---

## 2. Left Join

A left join returns all rows from the left table and the matching rows from the right table. If there is no match, NULLs appear on the right side.

Important details:

* Useful to detect missing relationships.
* Preserves all rows from the left table while extending them with optional data.

Example:

```sql
SELECT e.employee_id, e.name, d.department_name
FROM employees e
LEFT JOIN departments d
    ON e.department_id = d.department_id;
```

Follow-up questions:

1. How do you filter only non-matching rows?
2. What issues appear when using aggregates after a left join?
3. How to distinguish between real NULLs and NULLs from unmatched rows?

---

## 3. Right Join

A right join is the opposite of a left join. It returns all rows from the right table and matching rows from the left table.

Example:

```sql
SELECT p.product_id, p.product_name, s.sales_count
FROM sales_summary s
RIGHT JOIN products p
  ON p.product_id = s.product_id;
```

Note:
Right join is less preferred than left join in industry because left join keeps the “primary” table on the left side.

Follow-up questions:

1. When might a right join be necessary?
2. Why do most SQL developers rewrite right joins as left joins?

---

## 4. Full Outer Join

A full join returns all rows from both tables, with NULLs where no match exists.

Example:

```sql
SELECT a.customer_id, a.balance, b.last_order_date
FROM account_balances a
FULL OUTER JOIN customer_last_orders b
    ON a.customer_id = b.customer_id;
```

Use cases:

* Identifying mismatches between two datasets.
* Reconciling logs, audit tables, or imported datasets.

Follow-up questions:

1. How do you filter only rows that exist exclusively in one table?
2. Why do some databases not support full outer join natively?

---

## 5. Cross Join

A cross join returns the Cartesian product of two tables.

Example:

```sql
SELECT c.name, p.plan_name
FROM customers c
CROSS JOIN pricing_plans p;
```

Uses:

* Generating combinations.
* Creating time-series expansion.
* Statistical analysis requiring all possible pairs.

Follow-up questions:

1. How do you prevent accidental cross joins?
2. When is a cross join more efficient than generating combinations in application code?

---

## 6. Self Join

A self join is when a table is joined to itself. Mainly used for hierarchical or relational comparisons within the same dataset.

Example:

```sql
SELECT e.employee_id, e.name, m.name AS manager_name
FROM employees e
LEFT JOIN employees m
    ON e.manager_id = m.employee_id;
```

Follow-up questions:

1. How do you detect circular references in hierarchical data?
2. When should self-joins be replaced with recursive CTEs?

---

## 7. Anti Join

An anti join returns rows in one table that have no match in another.

Implemented using:

* LEFT JOIN + WHERE right_key IS NULL
* NOT EXISTS
* NOT IN (caution: NULL-related issues)

Best pattern:

```sql
SELECT c.customer_id
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

Follow-up questions:

1. Why is NOT EXISTS preferred over NOT IN?
2. How do null values cause logical errors in NOT IN?

---

## 8. Semi Join

A semi join returns rows where a match exists, but does not return columns from the right table.

Implemented using:

* WHERE EXISTS

Example:

```sql
SELECT c.customer_id, c.name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

Follow-up questions:

1. When is EXISTS more efficient than INNER JOIN?
2. How does a semi join differ from an inner join?

---

## 9. Set Operations (UNION, INTERSECT, EXCEPT)

### UNION / UNION ALL

* UNION removes duplicates.
* UNION ALL keeps duplicates.

Example:

```sql
SELECT name FROM table1
UNION
SELECT name FROM table2;
```

Follow-up:

1. What performance issues arise with UNION (without ALL)?
2. How does sorting affect UNION?

### INTERSECT

Returns rows common in both datasets.

Example:

```sql
SELECT email FROM leads
INTERSECT
SELECT email FROM customers;
```

### EXCEPT / MINUS

Returns rows from left that do not exist in right.

Example:

```sql
SELECT product_id FROM warehouse1
EXCEPT
SELECT product_id FROM warehouse2;
```

Follow-up:

1. How does EXCEPT differ from anti join?
2. When are set operations faster than joins?

---

---

## Chapter 2: Window Functions

Window functions allow operations across a set of rows without collapsing them into a single row like aggregates do. These are the foundation of analytical SQL.


## 1. Concept of Window Functions

Window functions operate "over" a logical window of rows.

Syntax:

```sql
function() OVER (
    PARTITION BY ...
    ORDER BY ...
    ROWS or RANGE frame_clause
)
```

A window function does not reduce row count.
It adds an analytical column.

Follow-up:

1. What is the difference between PARTITION BY and GROUP BY?
2. Why does a window function require an ORDER BY for ranking?

---

## 2. Ranking Functions

### Row_Number()

Assigns unique sequential ranking.

Example:

```sql
SELECT emp_id, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```

Useful for:

* Top-N queries
* Deduplication

### Rank()

Assigns the same rank for ties; skips next ranks.

### Dense_Rank()

Assigns the same rank for ties; does not skip.

Follow-up:

1. How do ties affect RANK and DENSE_RANK?
2. When would ROW_NUMBER cause unintended row loss in deduplication?

---

## 3. Aggregate Window Functions

Window versions of SUM, AVG, MIN, MAX, COUNT.

Example:

```sql
SELECT date, sales,
       SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales;
```

Key concepts:

* Running totals
* Moving averages
* Percentage contributions

Follow-up:

1. Why does missing ORDER BY cause incorrect analytics?
2. How does the frame clause modify results?

---

## 4. LAG and LEAD

Used for comparing current row with previous or next rows.

Example:

```sql
SELECT date, sales,
       LAG(sales) OVER (ORDER BY date) AS prev_sales
FROM daily_sales;
```

Applications:

* Difference calculations
* Trend analysis
* Sessionizing logs

Follow-up:

1. What happens when there is no previous row?
2. How does LAG differ from self join?

---

## 5. Window Frames (ROWS vs RANGE)

Window frame defines the subset of rows used for calculations.

Common frames:

* ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
* ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
* RANGE BETWEEN INTERVAL
* RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING

Example:

```sql
SUM(amount) OVER (
   ORDER BY transaction_time
   ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)
```

ROWS frame operates on physical row positions.
RANGE frame operates on value-based ranges.

Follow-up:

1. Why do RANGE frames cause larger windows on repeated values?
2. How does the default frame differ across databases?

---

---

# Chapter 3: Advanced Aggregations

---

## 1. Grouping Sets

Allows multiple grouping combinations in a single query.

Example:

```sql
SELECT region, product, SUM(sales)
FROM sales
GROUP BY GROUPING SETS (
    (region),
    (product),
    (region, product)
);
```

Follow-up:

1. How do grouping sets reduce multiple queries?
2. How to identify subtotal and grand-total rows?

---

## 2. Rollup

Generates hierarchical subtotals.

Example:

```sql
SELECT region, product, SUM(sales)
FROM sales
GROUP BY ROLLUP (region, product);
```

Produces:

* region + product
* region subtotal
* grand total

---

## 3. Cube

Generates all combinations of grouping sets.

Example:

```sql
SELECT region, product, quarter, SUM(sales)
FROM sales
GROUP BY CUBE (region, product, quarter);
```

Follow-up:

1. Why is cube expensive?
2. When should cube be avoided?

---

---

# Chapter 4: Recursive CTEs

---

## 1. Concept

Recursive CTEs are used for hierarchical data, graph traversal, nested categories, and generating sequences.

Structure:

```sql
WITH RECURSIVE cte_name AS (
    anchor_query
    UNION ALL
    recursive_query
)
SELECT * FROM cte_name;
```

---

## 2. Hierarchical Example

```sql
WITH RECURSIVE hierarchy AS (
    SELECT id, manager_id, name
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.manager_id, e.name
    FROM employees e
    JOIN hierarchy h
    ON e.manager_id = h.id
)
SELECT * FROM hierarchy;
```

Follow-up:

1. How do you prevent infinite recursion?
2. What is the maximum depth?
3. How to detect loops in hierarchy?

---

---

# Chapter 5: SQL on Semi-Structured Data (JSON, Arrays)

---

## 1. JSON Extraction

Example:

```sql
SELECT
    order_id,
    order_data->>'customer_name' AS customer,
    (order_data->'items')->0->>'product_name' AS first_item
FROM orders;
```

Key concepts:

* JSON operators differ by database
* Indexing JSON for performance
* Converting JSON arrays to rows using json_each/json_table

Follow-up:

1. What is the difference between -> and ->>?
2. [How to index JSON columns?](https://www.google.com/search?q=How+to+index+JSON+columns)

---

## 2. Arrays

Example:

```sql
SELECT customer_id,
       UNNEST(preferences) AS preference
FROM customer_profiles;
```

Follow-up:

1. [When should arrays be avoided in relational databases?](https://www.google.com/search?q=When+should+arrays+be+avoided+in+relational+databases)
2. [How do arrays affect normalization?](https://www.google.com/search?q=How+do+arrays+affect+normalization)

---

---

# Chapter 6: Query Optimization Foundations

This part introduces optimization fundamentals but does not go into the tuning playbook yet.

---

## 1. Importance of EXPLAIN / EXPLAIN ANALYZE

Use EXPLAIN to understand:

* Join order
* Index usage
* Table scans
* Filter pushdown
* Cardinality estimates

Example:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE amount > 500;
```

Follow-up:

1. [How do cardinality misestimates lead to slow queries?](https://www.google.com/search?q=How+do+cardinality+misestimates+lead+to+slow+queries)
2. [What is the difference between sequential scan and index scan?](https://www.google.com/search?q=What+is+the+difference+between+sequential+scan+and+index+scan)

---

## 2. Indexing Strategies

### Types:

* B-tree index
* Hash index
* Bitmap index
* Columnstore index

### When to index:

* High-cardinality columns
* Columns frequently used in WHERE, JOIN, ORDER BY

### When not to index:

* Highly volatile columns
* Low-cardinality boolean flags

Follow-up:

1. [Why does indexing slow down writes?](https://www.google.com/search?q=Why+does+indexing+slow+down+writes)
2. [How do composite indexes work?](https://www.google.com/search?q=How+do+composite+indexes+work)


<script src="../assets/js/accordion.js"></script>
<script src="../assets/js/theme.js"></script>