#!/usr/bin/env python3
"""
fill-databases-content.py
Fills in the empty content-scroll section of databases_reference.html
Run from project root: python3 scripts/fill-databases-content.py
"""

import os

CONTENT = """
<!-- ══════════════════════════════════════════════
       SECTION 1 — RELATIONAL
  ═══════════════════════════════════════════════ -->
<div id="relational">
  <div class="section-title">Relational Databases</div>
  <div class="section-sub">Tables, rows, columns — data organized by relationships</div>
  <div class="card-grid">

    <div class="card" style="--card-color:#60a5fa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Core Concept</div><div class="card-title">Tables & Relations</div>
      <div class="card-desc">Data stored in <strong>tables</strong> (relations). Each row is a <strong>tuple</strong>, each column is an <strong>attribute</strong>. Tables relate to each other via <strong>keys</strong>. Structure defined by a <strong>schema</strong> before data is inserted.</div>
    </div></div>

    <div class="card" style="--card-color:#a78bfa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Primary Key</div><div class="card-title">Unique row identifier</div>
      <div class="card-desc">A column (or set of columns) that <strong>uniquely identifies</strong> each row. Cannot be NULL. Every table should have one.<br><br><code>PRIMARY KEY (id)</code> — auto-incremented integer is the most common pattern.</div>
    </div></div>

    <div class="card" style="--card-color:#34d399"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Foreign Key</div><div class="card-title">Links between tables</div>
      <div class="card-desc">A column that references the <strong>primary key</strong> of another table. Enforces <strong>referential integrity</strong> — you can't reference a row that doesn't exist.<br><br><code>FOREIGN KEY (user_id) REFERENCES users(id)</code></div>
    </div></div>

    <div class="card" style="--card-color:#f97316"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Normalization</div><div class="card-title">Eliminate redundancy</div>
      <div class="card-desc"><strong>1NF:</strong> atomic values, no repeating groups.<br><strong>2NF:</strong> no partial dependencies on composite key.<br><strong>3NF:</strong> no transitive dependencies.<br><strong>BCNF:</strong> every determinant is a candidate key.<br><br>Goal: one fact in one place.</div>
    </div></div>

    <div class="card" style="--card-color:#e8c547"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Joins</div><div class="card-title">Combining tables</div>
      <div class="card-desc"><strong>INNER JOIN:</strong> only matching rows.<br><strong>LEFT JOIN:</strong> all left rows + matches.<br><strong>RIGHT JOIN:</strong> all right rows + matches.<br><strong>FULL OUTER:</strong> all rows from both.<br><strong>CROSS JOIN:</strong> cartesian product.<br><br><code>SELECT * FROM a JOIN b ON a.id = b.a_id</code></div>
    </div></div>

    <div class="card" style="--card-color:#4ecdc4"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Constraints</div><div class="card-title">Data integrity rules</div>
      <div class="card-desc"><code>NOT NULL</code> — column must have a value.<br><code>UNIQUE</code> — no duplicate values.<br><code>CHECK</code> — custom condition must be true.<br><code>DEFAULT</code> — fallback value if none given.<br><br>Constraints are enforced at the DB level, not app level.</div>
    </div></div>

  </div>

  <pre class="code-block"><span class="cmt">-- Basic SQL DDL + DML</span>
<span class="kw">CREATE TABLE</span> users (
  id    <span class="ty">INTEGER</span> <span class="kw">PRIMARY KEY</span> AUTOINCREMENT,
  name  <span class="ty">TEXT</span>    <span class="kw">NOT NULL</span>,
  email <span class="ty">TEXT</span>    <span class="kw">UNIQUE NOT NULL</span>
);

<span class="kw">INSERT INTO</span> users (name, email) <span class="kw">VALUES</span> (<span class="str">'Alice'</span>, <span class="str">'alice@uh.edu'</span>);
<span class="kw">SELECT</span> * <span class="kw">FROM</span> users <span class="kw">WHERE</span> name <span class="kw">LIKE</span> <span class="str">'A%'</span>;
<span class="kw">UPDATE</span> users <span class="kw">SET</span> email = <span class="str">'a@uh.edu'</span> <span class="kw">WHERE</span> id = <span class="num">1</span>;
<span class="kw">DELETE FROM</span> users <span class="kw">WHERE</span> id = <span class="num">1</span>;</pre>
</div>

<!-- ══════════════════════════════════════════════
       SECTION 2 — NoSQL
  ═══════════════════════════════════════════════ -->
<div id="nosql">
  <div class="section-title">NoSQL</div>
  <div class="section-sub">When tables aren't the right shape for your data</div>
  <div class="card-grid">

    <div class="card" style="--card-color:#60a5fa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Document Store</div><div class="card-title">JSON-like records</div>
      <div class="card-desc">Data stored as <strong>documents</strong> (JSON/BSON). No fixed schema — each document can have different fields. Great for hierarchical or variable data.<br><br>Examples: <span class="ex-tag">MongoDB</span> <span class="ex-tag">CouchDB</span> <span class="ex-tag">Firestore</span></div>
      <div class="card-examples"></div>
    </div></div>

    <div class="card" style="--card-color:#a78bfa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Key-Value Store</div><div class="card-title">Fastest lookup</div>
      <div class="card-desc">Data stored as <strong>key → value</strong> pairs. No structure enforced on values. O(1) lookups. Used for caching, sessions, leaderboards.<br><br>Examples: <span class="ex-tag">Redis</span> <span class="ex-tag">DynamoDB</span> <span class="ex-tag">Memcached</span></div>
      <div class="card-examples"></div>
    </div></div>

    <div class="card" style="--card-color:#34d399"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Wide-Column</div><div class="card-title">Rows with dynamic columns</div>
      <div class="card-desc">Like a table but each row can have <strong>different columns</strong>. Optimized for reading/writing large amounts of data across many nodes.<br><br>Examples: <span class="ex-tag">Cassandra</span> <span class="ex-tag">HBase</span> <span class="ex-tag">BigTable</span></div>
      <div class="card-examples"></div>
    </div></div>

    <div class="card" style="--card-color:#f97316"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Graph DB</div><div class="card-title">Nodes & edges</div>
      <div class="card-desc">Data stored as <strong>nodes</strong> (entities) and <strong>edges</strong> (relationships). Best for highly connected data where relationships matter as much as the data itself.<br><br>Examples: <span class="ex-tag">Neo4j</span> <span class="ex-tag">Amazon Neptune</span></div>
      <div class="card-examples"></div>
    </div></div>

    <div class="card" style="--card-color:#e8c547"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">CAP Theorem</div><div class="card-title">Pick 2 of 3</div>
      <div class="card-desc">Distributed systems can guarantee at most 2 of:<br><strong>C</strong>onsistency — every read gets latest write.<br><strong>A</strong>vailability — every request gets a response.<br><strong>P</strong>artition tolerance — works despite network splits.<br><br>NoSQL systems typically choose AP or CP.</div>
    </div></div>

    <div class="card" style="--card-color:#4ecdc4"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">BASE vs ACID</div><div class="card-title">NoSQL consistency model</div>
      <div class="card-desc"><strong>B</strong>asically <strong>A</strong>vailable — system always responds.<br><strong>S</strong>oft state — state may change over time.<br><strong>E</strong>ventually consistent — all nodes converge eventually.<br><br>Trades strong consistency for availability and partition tolerance.</div>
    </div></div>

  </div>
</div>

<!-- ══════════════════════════════════════════════
       SECTION 3 — TRANSACTIONS
  ═══════════════════════════════════════════════ -->
<div id="transactions">
  <div class="section-title">Transactions</div>
  <div class="section-sub">All-or-nothing operations that keep data consistent</div>
  <div class="card-grid">

    <div class="card" style="--card-color:#60a5fa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">ACID</div><div class="card-title">The 4 guarantees</div>
      <div class="card-desc"><strong>Atomicity:</strong> all ops succeed or none do.<br><strong>Consistency:</strong> DB stays in valid state.<br><strong>Isolation:</strong> concurrent txns don't interfere.<br><strong>Durability:</strong> committed data survives crashes.<br><br>These are what make relational DBs reliable.</div>
    </div></div>

    <div class="card" style="--card-color:#a78bfa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Atomicity</div><div class="card-title">All or nothing</div>
      <div class="card-desc">If any operation in a transaction fails, the <strong>entire transaction is rolled back</strong>. Bank transfer: debit + credit must both succeed, or neither happens.<br><br><code>BEGIN; UPDATE ...; UPDATE ...; COMMIT;</code><br><code>ROLLBACK;</code> — undo everything.</div>
    </div></div>

    <div class="card" style="--card-color:#34d399"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Isolation Levels</div><div class="card-title">How much txns see each other</div>
      <div class="card-desc"><strong>Read Uncommitted:</strong> sees dirty reads.<br><strong>Read Committed:</strong> only sees committed data.<br><strong>Repeatable Read:</strong> same query returns same result.<br><strong>Serializable:</strong> fully isolated, as if sequential.<br><br>Higher isolation = more locking = slower.</div>
    </div></div>

    <div class="card" style="--card-color:#f97316"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Concurrency Problems</div><div class="card-title">What isolation prevents</div>
      <div class="card-desc"><strong>Dirty read:</strong> reading uncommitted data.<br><strong>Non-repeatable read:</strong> same query, different result.<br><strong>Phantom read:</strong> new rows appear mid-txn.<br><strong>Lost update:</strong> two txns overwrite each other.<br><strong>Deadlock:</strong> two txns wait on each other.</div>
    </div></div>

    <div class="card" style="--card-color:#e8c547"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Locking</div><div class="card-title">Controlling concurrent access</div>
      <div class="card-desc"><strong>Shared lock (S):</strong> read — multiple allowed.<br><strong>Exclusive lock (X):</strong> write — blocks all others.<br><strong>Optimistic locking:</strong> no locks, check for conflict at commit.<br><strong>Pessimistic locking:</strong> lock before reading.<br><br><code>SELECT ... FOR UPDATE</code> — explicit row lock.</div>
    </div></div>

    <div class="card" style="--card-color:#4ecdc4"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">2-Phase Commit</div><div class="card-title">Distributed transactions</div>
      <div class="card-desc"><strong>Phase 1 (Prepare):</strong> coordinator asks all nodes "can you commit?" Each votes yes/no.<br><strong>Phase 2 (Commit):</strong> if all say yes, coordinator sends commit. If any say no, abort.<br><br>Ensures atomicity across multiple databases/nodes.</div>
    </div></div>

  </div>

  <pre class="code-block"><span class="cmt">-- Transaction example: bank transfer</span>
<span class="kw">BEGIN</span>;
  <span class="kw">UPDATE</span> accounts <span class="kw">SET</span> balance = balance - <span class="num">100</span> <span class="kw">WHERE</span> id = <span class="num">1</span>;
  <span class="kw">UPDATE</span> accounts <span class="kw">SET</span> balance = balance + <span class="num">100</span> <span class="kw">WHERE</span> id = <span class="num">2</span>;
  <span class="cmt">-- if anything fails, ROLLBACK automatically</span>
<span class="kw">COMMIT</span>;</pre>
</div>

<!-- ══════════════════════════════════════════════
       SECTION 4 — INDEXING
  ═══════════════════════════════════════════════ -->
<div id="indexing">
  <div class="section-title">Indexing</div>
  <div class="section-sub">Making queries fast — and why it costs you</div>
  <div class="card-grid">

    <div class="card" style="--card-color:#60a5fa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">What is an Index</div><div class="card-title">A sorted lookup structure</div>
      <div class="card-desc">An index is a separate data structure that stores a <strong>sorted copy</strong> of a column's values with pointers to the actual rows. Makes lookups O(log n) instead of O(n) full table scans.<br><br>Trade-off: <strong>faster reads, slower writes</strong>, more disk space.</div>
    </div></div>

    <div class="card" style="--card-color:#a78bfa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">B-Tree Index</div><div class="card-title">Default index type</div>
      <div class="card-desc">Most databases use a <strong>B+ tree</strong> by default. Balanced tree — all leaf nodes at same depth. Supports: equality (<code>=</code>), range (<code>&lt; &gt;</code>), ORDER BY, and prefix matching.<br><br>Self-balancing on insert/delete. O(log n) search.</div>
    </div></div>

    <div class="card" style="--card-color:#34d399"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Hash Index</div><div class="card-title">O(1) equality lookups</div>
      <div class="card-desc">Uses a <strong>hash map</strong> internally. Extremely fast for equality checks (<code>=</code>). <strong>Cannot</strong> support range queries, sorting, or LIKE.<br><br>Used internally by some engines (InnoDB adaptive hash). PostgreSQL supports explicit hash indexes.</div>
    </div></div>

    <div class="card" style="--card-color:#f97316"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Composite Index</div><div class="card-title">Multi-column index</div>
      <div class="card-desc">Index on multiple columns. Order matters — <code>(a, b)</code> helps queries filtering on <code>a</code> or <code>(a, b)</code> but <strong>not</strong> on <code>b</code> alone.<br><br><code>CREATE INDEX idx ON t(a, b);</code><br><br>Leftmost prefix rule — use the index from left to right.</div>
    </div></div>

    <div class="card" style="--card-color:#e8c547"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Covering Index</div><div class="card-title">No table lookup needed</div>
      <div class="card-desc">An index that contains <strong>all columns</strong> needed by a query. The DB never needs to touch the actual table — answers entirely from the index.<br><br>Most performant read pattern. Design indexes around your most critical queries.</div>
    </div></div>

    <div class="card" style="--card-color:#4ecdc4"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">EXPLAIN</div><div class="card-title">See what the DB is doing</div>
      <div class="card-desc"><code>EXPLAIN SELECT ...</code> — shows the query execution plan. Look for:<br><strong>Seq Scan</strong> — full table scan (bad on large tables).<br><strong>Index Scan</strong> — using the index.<br><strong>Index Only Scan</strong> — covering index hit.<br><br>Use this to diagnose slow queries.</div>
    </div></div>

  </div>

  <pre class="code-block"><span class="cmt">-- Creating indexes</span>
<span class="kw">CREATE INDEX</span> idx_users_email <span class="kw">ON</span> users(email);
<span class="kw">CREATE INDEX</span> idx_orders_user_date <span class="kw">ON</span> orders(user_id, created_at);
<span class="kw">CREATE UNIQUE INDEX</span> idx_unique_username <span class="kw">ON</span> users(username);

<span class="cmt">-- Check query plan</span>
<span class="kw">EXPLAIN ANALYZE SELECT</span> * <span class="kw">FROM</span> users <span class="kw">WHERE</span> email = <span class="str">'alice@uh.edu'</span>;</pre>
</div>

<!-- ══════════════════════════════════════════════
       SECTION 5 — DESIGN
  ═══════════════════════════════════════════════ -->
<div id="design">
  <div class="section-title">Design</div>
  <div class="section-sub">Schema design, migrations, and modeling patterns</div>
  <div class="card-grid">

    <div class="card" style="--card-color:#60a5fa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">ER Diagram</div><div class="card-title">Entity-Relationship Model</div>
      <div class="card-desc">Visual tool for designing schemas before writing SQL. <strong>Entities</strong> become tables, <strong>attributes</strong> become columns, <strong>relationships</strong> become foreign keys.<br><br>Cardinality: <strong>1:1</strong>, <strong>1:N</strong>, <strong>M:N</strong> (needs junction table).</div>
    </div></div>

    <div class="card" style="--card-color:#a78bfa"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Many-to-Many</div><div class="card-title">Junction tables</div>
      <div class="card-desc">Can't directly store M:N in SQL. Use a <strong>junction/bridge table</strong> with two foreign keys.<br><br>Students ↔ Courses:<br><code>enrollments(student_id, course_id)</code><br><br>The junction table can also hold extra data (grade, date enrolled).</div>
    </div></div>

    <div class="card" style="--card-color:#34d399"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Migrations</div><div class="card-title">Versioned schema changes</div>
      <div class="card-desc">Never modify production schema manually. Use <strong>migration files</strong> — versioned scripts with <code>up</code> (apply) and <code>down</code> (rollback).<br><br>Tools: Flyway, Liquibase, Prisma Migrate, Django migrations. Track applied migrations in a <code>schema_migrations</code> table.</div>
    </div></div>

    <div class="card" style="--card-color:#f97316"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Denormalization</div><div class="card-title">Controlled redundancy</div>
      <div class="card-desc">Sometimes intentionally <strong>duplicate data</strong> to avoid expensive joins. Common in read-heavy systems.<br><br>Example: store <code>username</code> in <code>comments</code> table to avoid joining <code>users</code> on every comment fetch. Accept the write complexity.</div>
    </div></div>

    <div class="card" style="--card-color:#e8c547"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Soft Delete</div><div class="card-title">Don't actually delete rows</div>
      <div class="card-desc">Instead of <code>DELETE</code>, add a <code>deleted_at TIMESTAMP</code> column. Set it on "delete", filter it on reads.<br><br>Preserves data for audit logs, undo features, analytics. Add an index on <code>deleted_at</code> or use partial indexes to keep queries fast.</div>
    </div></div>

    <div class="card" style="--card-color:#4ecdc4"><div class="card-bar"></div><div class="card-body">
      <div class="card-label">Pagination</div><div class="card-title">Efficient large result sets</div>
      <div class="card-desc"><strong>Offset:</strong> <code>LIMIT 20 OFFSET 100</code> — simple but slow on large offsets (scans all skipped rows).<br><br><strong>Cursor:</strong> <code>WHERE id &gt; last_seen_id LIMIT 20</code> — O(1) regardless of page. Use for infinite scroll / APIs. Requires stable sort order.</div>
    </div></div>

  </div>

  <div class="section-title" style="font-size:1.1rem; margin-top:32px;">Migration Pattern</div>
  <div class="migration-step" style="--step-color:#60a5fa">
    <div class="ms-label">Step 1</div>
    <div class="ms-title">Write the migration file</div>
    <div class="ms-desc">Create a versioned file: <code>20240101_add_email_to_users.sql</code>. Include both <code>UP</code> (apply) and <code>DOWN</code> (rollback) statements.</div>
  </div>
  <div class="migration-step" style="--step-color:#a78bfa">
    <div class="ms-label">Step 2</div>
    <div class="ms-title">Test on staging</div>
    <div class="ms-desc">Run migration on a copy of production data. Verify no data loss, no constraint violations, acceptable run time.</div>
  </div>
  <div class="migration-step" style="--step-color:#34d399">
    <div class="ms-label">Step 3</div>
    <div class="ms-title">Apply to production</div>
    <div class="ms-desc">Run during low-traffic window if altering large tables. Monitor for locks. Use <code>ALTER TABLE ... ADD COLUMN</code> with a default — safe in PostgreSQL, requires care in MySQL.</div>
  </div>
  <div class="migration-step" style="--step-color:#f97316">
    <div class="ms-label">Step 4</div>
    <div class="ms-title">Verify & commit</div>
    <div class="ms-desc">Confirm schema change applied. Update ORM models. The migration tool records the version — future runs skip it automatically.</div>
  </div>

</div>
"""

filepath = "public/references/databases_reference.html"

if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run from project root.")
    exit(1)

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

MARKER = '<div class="content-scroll">'
idx = content.find(MARKER)
if idx == -1:
    print("ERROR: could not find content-scroll div")
    exit(1)

# Find where the empty comment ends and the closing tags begin
insert_at = idx + len(MARKER)

# Check if content is already filled
if 'id="relational"' in content:
    print("Content already filled — stripping old content first...")
    import re
    content = re.sub(
        r'(<div class="content-scroll">).*?(</div>\s*</div>\s*\n<script>)',
        r'\1\n\2',
        content, flags=re.DOTALL
    )
    insert_at = content.find(MARKER) + len(MARKER)

new_content = content[:insert_at] + "\n" + CONTENT + "\n" + content[insert_at:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"✓ Content injected into {filepath}")
print("  Run: python3 scripts/inject-collapsible.py  (to re-apply mobile CSS)")
