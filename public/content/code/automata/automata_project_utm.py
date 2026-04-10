"""
utm.py — Three-Tape Universal Turing Machine Simulator
COSC 3340 Spring 2026 · Project Part 1

Encoding alphabet: {c, I}  (c = comma/separator, I = tally mark)
Encoding conventions (from Sipser / class slides):
  - States:   q1=I, q2=II, q3=III, ... (qi encoded as i I's)
  - Symbols:  X1=I, X2=II, X3=III, ...
              Blank (B) = X1 = I
              0        = X2 = II   (used in some TMs)
              1        = X3 = III  (used in some TMs)
              'a'      = X2 = II
              'b'      = X3 = III
  - Direction: L=I, R=II
  - Transition δ(qi, Xj) = (qk, Xl, d):  encoded as Ii c Ij c Ik c Il c Id
  - Transitions separated by cc
  - TM description ends with ccc
  - Input w: each symbol encoded, symbols separated by c
  - Full input to U: <M,w> = [transitions]ccc[encoded w]

Tape layout for U:
  Tape 1: the input <M, w> (never modified)
  Tape 2: simulated tape of M (working tape)
  Tape 3: current state of M

The simulator reads transitions from Tape 1, matches on Tape 2's current
symbol and Tape 3's current state, then updates Tape 2 and Tape 3.
"""

from typing import Optional

# ─────────────────────────────────────────────
#  ENCODING HELPERS
# ─────────────────────────────────────────────

def encode_int(n: int) -> str:
    """Encode integer n ≥ 1 as n I's."""
    if n < 1:
        raise ValueError(f"encode_int requires n >= 1, got {n}")
    return "I" * n

def decode_int(s: str) -> int:
    """Decode a block of I's to an integer."""
    if not s or not all(c == 'I' for c in s):
        raise ValueError(f"Cannot decode '{s}' as int")
    return len(s)

def encode_state(q: int) -> str:
    """State qi → i I's."""
    return encode_int(q)

def encode_symbol(x: int) -> str:
    """Symbol Xj → j I's."""
    return encode_int(x)

def encode_direction(d: str) -> str:
    """L → I, R → II."""
    return "I" if d == "L" else "II"

def encode_transition(qi: int, xj: int, qk: int, xl: int, d: str) -> str:
    """Encode a single transition δ(qi, Xj) = (qk, Xl, d)."""
    return (encode_state(qi) + "c" +
            encode_symbol(xj) + "c" +
            encode_state(qk) + "c" +
            encode_symbol(xl) + "c" +
            encode_direction(d))

def encode_tm(transitions: list[tuple], accept_states: set[int] = None) -> str:
    """
    Encode a TM's transition function.
    transitions: list of (qi, xj, qk, xl, direction)
    Returns the encoded string up to (not including) ccc separator.
    """
    return "cc".join(encode_transition(*t) for t in transitions)

def encode_input_word(symbols: list[int]) -> str:
    """
    Encode input word w as a sequence of encoded symbols separated by c.
    symbols: list of symbol indices (1=blank, 2=a, 3=b, etc.)
    """
    return "c".join(encode_symbol(s) for s in symbols)

def build_utm_input(transitions: list[tuple], input_symbols: list[int]) -> str:
    """
    Build the full input string to U: <M, w> = [TM encoding]ccc[word encoding]
    """
    tm_enc = encode_tm(transitions)
    word_enc = encode_input_word(input_symbols)
    return tm_enc + "ccc" + word_enc

# ─────────────────────────────────────────────
#  PARSING
# ─────────────────────────────────────────────

def parse_utm_input(utm_input: str):
    """
    Parse the UTM input string into:
      - transitions: dict {(qi, xj): (qk, xl, direction)}
      - initial_tape: list of symbol indices
    """
    # Split on 'ccc' to separate TM description from input word
    parts = utm_input.split("ccc")
    if len(parts) != 2:
        raise ValueError("Input must contain exactly one 'ccc' separator")
    
    tm_part, word_part = parts
    
    # Parse transitions (separated by 'cc')
    transitions = {}
    if tm_part:
        raw_transitions = tm_part.split("cc")
        for raw in raw_transitions:
            fields = raw.split("c")
            if len(fields) != 5:
                raise ValueError(f"Malformed transition: '{raw}'")
            qi  = decode_int(fields[0])
            xj  = decode_int(fields[1])
            qk  = decode_int(fields[2])
            xl  = decode_int(fields[3])
            d   = "L" if fields[4] == "I" else "R"
            transitions[(qi, xj)] = (qk, xl, d)
    
    # Parse input word (symbols separated by 'c')
    if word_part:
        initial_tape = [decode_int(s) for s in word_part.split("c")]
    else:
        initial_tape = [1]  # blank
    
    return transitions, initial_tape

# ─────────────────────────────────────────────
#  THE THREE-TAPE UTM SIMULATOR
# ─────────────────────────────────────────────

class Tape:
    """Infinite tape backed by a dict. Blank = symbol index 1."""
    BLANK = 1

    def __init__(self, initial: list[int] = None):
        self.cells: dict[int, int] = {}
        self.head: int = 0
        if initial:
            for i, sym in enumerate(initial):
                self.cells[i] = sym

    def read(self) -> int:
        return self.cells.get(self.head, self.BLANK)

    def write(self, sym: int):
        self.cells[self.head] = sym

    def move(self, direction: str):
        if direction == "R":
            self.head += 1
        elif direction == "L":
            self.head -= 1
        else:
            raise ValueError(f"Unknown direction: {direction}")

    def to_list(self, lo: int = None, hi: int = None) -> list[int]:
        """Return tape contents between lo and hi (inclusive)."""
        if not self.cells:
            return [self.BLANK]
        lo = lo if lo is not None else min(self.cells)
        hi = hi if hi is not None else max(self.cells)
        return [self.cells.get(i, self.BLANK) for i in range(lo, hi + 1)]

    def snapshot(self) -> str:
        """Human-readable tape snapshot with head marker."""
        if not self.cells:
            positions = [0]
        else:
            lo = min(min(self.cells), self.head)
            hi = max(max(self.cells), self.head)
            positions = range(lo, hi + 1)
        parts = []
        for i in positions:
            sym = self.cells.get(i, self.BLANK)
            label = f"[{sym}]" if i == self.head else f" {sym} "
            parts.append(label)
        return "".join(parts)


class UTM:
    """
    Three-tape Universal Turing Machine.

    Tape 1: read-only input  <M, w>
    Tape 2: simulated tape of M
    Tape 3: current state of M (stored as an integer, conceptually)

    The accept state of any TM fed to U is always q_accept = state with no
    outgoing transitions (we halt when no transition is found).
    The start state is always q1 (= 1).

    Every move: either write OR move, not both (per project spec).
    We implement this by separating each δ step into:
      1. Write new symbol (head stays)
      2. Move head in direction d
    """

    MAX_STEPS = 100_000  # safety limit

    def __init__(self, utm_input: str, verbose: bool = True):
        self.raw_input = utm_input
        self.verbose = verbose
        self.transitions, initial_tape = parse_utm_input(utm_input)
        
        # Tape 1: the full input string stored for reference (not used as tape cells;
        #         in a true UTM tape 1 is scanned to find transitions. Here we
        #         represent it as the parsed transition dict for efficiency.)
        self.tape1_raw = utm_input
        
        # Tape 2: working tape of M, initialized with input word
        self.tape2 = Tape(initial_tape)
        
        # Tape 3: current state (start = q1 = 1)
        self.state: int = 1
        
        self.step_count: int = 0
        self.halted: bool = False
        self.accepted: bool = False

    def log(self, msg: str):
        if self.verbose:
            print(msg)

    def step(self) -> bool:
        """
        Execute one step of the simulated TM.
        Returns False if halted, True if still running.
        """
        if self.halted:
            return False

        current_sym = self.tape2.read()
        key = (self.state, current_sym)

        if key not in self.transitions:
            # No transition → halt (accept/reject depends on TM definition)
            self.halted = True
            self.accepted = True  # we treat halt as accept for computing TMs
            self.log(f"  Step {self.step_count}: state=q{self.state}, "
                     f"read=X{current_sym} → NO TRANSITION → HALT")
            return False

        qk, xl, direction = self.transitions[key]
        self.log(f"  Step {self.step_count:>4}: q{self.state} × X{current_sym}"
                 f" → q{qk}, write X{xl}, move {direction}"
                 f"  |  tape: {self.tape2.snapshot()}")

        # Per spec: either write OR move, not both in a single step.
        # We model each δ as TWO micro-steps: write, then move.
        self.tape2.write(xl)   # micro-step 1: write
        self.tape2.move(direction)  # micro-step 2: move

        self.state = qk
        self.step_count += 1
        return True

    def run(self) -> str:
        """Run until halt or MAX_STEPS. Returns encoded output tape."""
        self.log(f"\n{'='*60}")
        self.log(f"UTM START — simulating TM on input")
        self.log(f"  Transitions loaded: {len(self.transitions)}")
        self.log(f"  Initial tape (symbols): {self.tape2.to_list()}")
        self.log(f"{'='*60}")

        while self.step_count < self.MAX_STEPS:
            if not self.step():
                break

        if self.step_count >= self.MAX_STEPS:
            self.log(f"  !! MAX_STEPS ({self.MAX_STEPS}) reached — possible infinite loop")
            self.halted = True

        self.log(f"\n{'='*60}")
        self.log(f"UTM HALT after {self.step_count} steps")
        
        # Collect output: non-blank cells on tape 2
        output = self.get_output()
        encoded = self.encode_output(output)
        self.log(f"  Output tape (symbols): {output}")
        self.log(f"  Encoded output:        {encoded}")
        self.log(f"{'='*60}\n")
        return encoded

    def get_output(self) -> list[int]:
        """Return non-blank portion of tape 2."""
        if not self.tape2.cells:
            return [1]
        lo = min(self.tape2.cells)
        hi = max(self.tape2.cells)
        result = [self.tape2.cells.get(i, 1) for i in range(lo, hi + 1)]
        # Strip leading and trailing blanks
        while result and result[0] == 1:
            result.pop(0)
        while result and result[-1] == 1:
            result.pop()
        return result if result else [1]

    def encode_output(self, symbols: list[int]) -> str:
        """Encode output symbol list back to {c, I} string."""
        return "c".join("I" * s for s in symbols)


# ─────────────────────────────────────────────
#  THREE EXAMPLE TURING MACHINES
# ─────────────────────────────────────────────

"""
SYMBOL MAP (used across all TMs):
  X1 = I    = Blank (B)
  X2 = II   = 'a'
  X3 = III  = 'b'
  X4 = IIII = 'X' (used marker)
  X5 = IIIII= 'Y' (used marker)

STATE NAMING: qi = i (encoded as i I's)
  q1 = start state (always)
  Last reachable state = accept (halt on no transition)
"""

# ── TM 1: Recognizer for {aⁿbⁿ | n ≥ 1} ─────────────────────────────────
#
# Strategy: repeatedly cross off one 'a' (replace with X) and one 'b' (replace with Y)
# States:
#   q1: scan right looking for 'a'; if see 'b' first → reject; if blank → accept
#   q2: saw an 'a', replaced with X; scan right to find matching 'b'
#   q3: found 'b', replaced with Y; scan left to find next 'a'
#   q4: scan left back to leftmost 'a'
#   q5: accept (halts — no outgoing transitions)
#
# Symbols: B=1, a=2, b=3, X=4, Y=5
#
# FULL δ table:
#   q1 × a(2) → q2, X(4), R    [mark 'a', go right to find 'b']
#   q1 × Y(5) → q1, Y(5), R    [skip over already-matched Y's]
#   q1 × B(1) → q5, B(1), R    [all matched → accept]
#   q2 × a(2) → q2, a(2), R    [skip unmatched a's]
#   q2 × Y(5) → q2, Y(5), R    [skip matched Y's]
#   q2 × b(3) → q3, Y(5), L    [found matching b → mark it, go left]
#   q3 × a(2) → q3, a(2), L    [scan left past a's]
#   q3 × Y(5) → q3, Y(5), L    [scan left past Y's]
#   q3 × X(4) → q1, X(4), R    [back to leftmost X → restart]
#   (q5 has no transitions → halts = accepts)

TM1_TRANSITIONS = [
    # (qi, xj, qk, xl, direction)
    (1, 2, 2, 4, "R"),   # q1 × a → q2, X, R
    (1, 5, 1, 5, "R"),   # q1 × Y → q1, Y, R
    (1, 1, 5, 1, "R"),   # q1 × B → q5, B, R  (accept)
    (2, 2, 2, 2, "R"),   # q2 × a → q2, a, R
    (2, 5, 2, 5, "R"),   # q2 × Y → q2, Y, R
    (2, 3, 3, 5, "L"),   # q2 × b → q3, Y, L
    (3, 2, 3, 2, "L"),   # q3 × a → q3, a, L
    (3, 5, 3, 5, "L"),   # q3 × Y → q3, Y, L
    (3, 4, 1, 4, "R"),   # q3 × X → q1, X, R
]
TM1_ACCEPT = {5}
# Input: "ab" → symbols [2, 3]
TM1_INPUT_AB  = [2, 3]
# Input: "aabb" → symbols [2, 2, 3, 3]
TM1_INPUT_AABB = [2, 2, 3, 3]


# ── TM 2: String copier — copies 'a's: w → wBw (function TM) ────────────
#
# This TM computes a function: given input aⁿ, it produces aⁿBaⁿ
# (the string followed by a blank followed by a copy of the string)
# This satisfies the requirement that at least one TM computes a function.
#
# Symbols: B=1, a=2, X=3 (mark processed), Y=4 (copy placeholder)
# States:
#   q1: mark next 'a' as X, go to end, write 'a' copy
#   q2: scan right to end of tape (to find blank)
#   q3: write 'a' at end
#   q4: scan back left to next X
#   q5: restore X back to 'a', move right for next round
#   q6: all done — scan left to restore all X's if any remain
#      (simpler: X's can remain as 'a'; we just leave output right of blank)
#   q7: accept
#
# Simplified version — track with two-pass approach:
# Phase 1: Move all a's right, building copy separated by blank
#   q1: scan for 'a'; mark as X, remember to copy
#   q2: go to right end (past any 'a' and past blank section)  
#   q3: write 'a' there; scan all the way left
#   q4: scan left to find leftmost X; convert back to 'a'
#   q5: next round

TM2_TRANSITIONS = [
    # Phase 1: find next unprocessed 'a', mark as X
    (1, 2, 2, 3, "R"),   # q1 × a → q2, X, R    [mark 'a', scan right]
    (1, 3, 1, 3, "R"),   # q1 × X → q1, X, R    [skip already-marked a's]
    (1, 1, 7, 1, "R"),   # q1 × B → q7, B, R    [no more a's → accept]
    # Phase 2: scan right past input + separator to copy zone
    (2, 2, 2, 2, "R"),   # q2 × a → q2, a, R    [skip unprocessed a's]
    (2, 3, 2, 3, "R"),   # q2 × X → q2, X, R    [skip marked a's]
    (2, 1, 3, 1, "R"),   # q2 × B → q3, B, R    [cross blank separator]
    # Phase 3: skip existing copies to find blank at far right
    (3, 4, 3, 4, "R"),   # q3 × Y → q3, Y, R    [skip written copies]
    (3, 1, 4, 4, "L"),   # q3 × B → q4, Y, L    [write copy (Y=a), go left]
    # Phase 4: scan left back across copies and separator
    (4, 4, 4, 4, "L"),   # q4 × Y → q4, Y, L    [skip copies going left]
    (4, 1, 5, 1, "L"),   # q4 × B → q5, B, L    [cross separator going left]
    # Phase 5: scan left through input to find mark X
    (5, 2, 5, 2, "L"),   # q5 × a → q5, a, L    [skip unprocessed a's going left]
    (5, 3, 1, 2, "R"),   # q5 × X → q1, a, R    [restore X→a, next round]
]
TM2_ACCEPT = {7}
# Input: "aa" → symbols [2, 2]
TM2_INPUT = [2, 2]


# ── TM 3: Unary incrementer — given aⁿ, outputs aⁿ⁺¹ ───────────────────
#
# Simple: scan right to end of input, write one more 'a', halt.
# States:
#   q1: scan right over 'a's
#   q2: write 'a' at first blank, then go back to halt position, accept
#
# Symbols: B=1, a=2
# δ:
#   q1 × a(2) → q1, a(2), R    [keep scanning right]
#   q1 × B(1) → q2, a(2), L    [write extra 'a', go left]
#   q2: no transitions → halt (accept)
#
# Input: "aaa" (n=3) → output "aaaa" (n+1=4)

TM3_TRANSITIONS = [
    (1, 2, 1, 2, "R"),   # q1 × a → q1, a, R
    (1, 1, 2, 2, "L"),   # q1 × B → q2, a, L  (write extra 'a')
]
TM3_ACCEPT = {2}
# Input: "aaa" → symbols [2, 2, 2]
TM3_INPUT = [2, 2, 2]


# ─────────────────────────────────────────────
#  DEMO RUNNER
# ─────────────────────────────────────────────

def run_demo(name: str, transitions: list, input_symbols: list, description: str):
    print(f"\n{'#'*60}")
    print(f"# {name}")
    print(f"# {description}")
    print(f"{'#'*60}")
    
    utm_input = build_utm_input(transitions, input_symbols)
    print(f"\nEncoded UTM input string:")
    print(f"  {utm_input[:120]}{'...' if len(utm_input) > 120 else ''}")
    print(f"  (total length: {len(utm_input)} chars)")
    
    sim = UTM(utm_input, verbose=True)
    output = sim.run()
    
    print(f"ENCODED OUTPUT: {output}")
    print(f"OUTPUT (symbol indices): {sim.get_output()}")
    return output


if __name__ == "__main__":
    # ── Demo 1: TM1 on "ab" (should accept / halt) ──
    run_demo(
        "DEMO 1 — TM1: {aⁿbⁿ | n≥1} recognizer on input 'ab'",
        TM1_TRANSITIONS,
        TM1_INPUT_AB,
        "Input 'ab' ∈ L, expects TM to halt (accept). Output tape = blank or accept config."
    )

    # ── Demo 2: TM2 on "aa" (function: copies string) ──
    run_demo(
        "DEMO 2 — TM2: String copier on input 'aa' (function TM)",
        TM2_TRANSITIONS,
        TM2_INPUT,
        "Input 'aa' → Output 'aa B aa'. Demonstrates a string→string function."
    )

    # ── Demo 3: TM3 on "aaa" (unary increment) ──
    run_demo(
        "DEMO 3 — TM3: Unary incrementer on input 'aaa'",
        TM3_TRANSITIONS,
        TM3_INPUT,
        "Input aaa (n=3) → output aaaa (n+1=4). Simplest nontrivial function."
    )
