Reality Layers
┌────────────────────┐
│ Algorithms         │  ← steps that use rules
├────────────────────┤
│ Abstract Data Types│  ← what ops are allowed
├────────────────────┤
│ Data Structures    │  ← how data is stored
└────────────────────┘



ADT (idea)
  ↓
Data Structure (storage)
  ↓
Algorithm (actions)
-----------------------------

Problem
  ↓
ADT  ← bridge (what you want)
  ↓
Data Structure ← where you are (storage)
  ↓
Algorithm ← how you deliver

-----------------------------

Lock this in 🔒

If data exists → you need a data structure

If you operate on it → you need an algorithm

If they interact → an ADT is implied

ADT is the agreement layer.
------------------------------

Algorithms
  ↑ use
ADTs
  ↑ define allowed ops
Data Structures
  ↑ implement

ops = operations


💡 Metaphor:
Ops = buttons on a machine. The ADT says which buttons exist, the data structure is the machine, and the algorithm is what happens when you press a button.



Mental trick 🧠

Algorithm = verbs / actions (sort, search, traverse)

Data Structure = nouns / storage (array, list, tree)

ADT = contract / interface (stack, queue, map)
