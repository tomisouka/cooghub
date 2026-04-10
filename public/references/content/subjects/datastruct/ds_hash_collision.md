                     Map ADT (Operations)
                     ──────────────────
                     insert(key, value)
                     get(key)
                     remove(key)
                               │
                               │
                       Hash Table DS
                       ─────────────
                - Array of buckets
                - Hash function: h(key)
                - Stores key/value pairs
                               │
                               │
                    Collision Handling (DS)
                               │
          ┌───────────────┬───────────────┬───────────────┬───────────────┐
          │               │               │               │
   Linear Probing   Quadratic Probing  Double Hashing     Chaining
      (Array)          (Array)           (Array)    (Array + Linked List)
   ─────────────    ─────────────    ─────────────    ─────────────────
   - Move to next      - Jump i²        - Jump by        - Linked list at
     empty slot         steps            h2(key)          each bucket

