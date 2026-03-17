                           Tree ADT
                           ───────────────
                  insert(node), remove(node)
                  traverse(order), find(node)
                  getHeight(), isBalanced()
                             │
                             │
                  Supporting Data Structures
                  ─────────────────────────
        ┌──────────────┬──────────────┬──────────────┬──────────────┐
        │              │              │              │
       Nodes         Pointers /     Arrays /       Heaps
     (value + left   References     Lists          (priority queues)
      + right)       (for links)   (for B-trees)
                             │
                             │
                     Tree Algorithms
                     ─────────────────────────
        ┌──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
        │              │              │              │             │
     Binary Tree    Binary Search   AVL / Red-     B-Trees /   Tree Traversals
                    Tree (BST)      Black Tree     2-3-4      ┌──────────────┐
                    Search/Insert   Rotations,     Trees      │ Preorder     │
                    /Remove         Balance Ops               │ Inorder      │
                                                              │ Postorder    │
                                                              │ Level-order  │
                                                              └──────────────┘
                             │
                             │
                Specialized Tree Algorithms
                ─────────────────────────────
        ┌──────────────┬──────────────┐
        │                              │
      Treaps                       Tries
(Priority + BST)           (Prefix-based search)

