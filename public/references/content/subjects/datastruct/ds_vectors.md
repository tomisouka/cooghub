# Data Structures Cheat Sheet

## What They Are

**Array** = Raw, basic storage (fixed size)

**Dynamic Array** = Resizable array (manual management)

**Vector** = Smart wrapper around dynamic array (auto-management + methods)

**Linked List** = Chain of nodes connected by pointers

---

## Visual

### Array
```
[10][20][30][40][50]  ← Fixed forever
```

### Dynamic Array
```
[10][20][30][ ][ ][ ]  ← Grows manually
```

### Vector
```
[10][20][30][ ][ ][ ][ ][ ]  ← Auto-grows, tracks size/capacity
```

### Linked List
```
[10]→[20]→[30]→NULL  ← Scattered nodes
```

---

## Quick Comparison

| | Memory | Access | Use When |
|---|---|---|---|
| **Array** | Block, fixed | Fast | Size known |
| **Vector** | Block, grows | Fast | Default choice ⭐ |
| **Linked List** | Scattered | Slow | Front insert/delete |

---

## Key Point

**Vector IS a dynamic array** — just with automatic management and methods built in.

Use Vector 99% of the time.

