# Dependency Direction Rules

## Scope (Existing Structure Only)

This document is grounded in the actual import graph and entry wiring shown in:
- [index.html](index.html#L1-L47)
- [js/main.js](js/main.js#L1-L105)
- [js/game-state.js](js/game-state.js#L1-L77)
- [js/player.js](js/player.js#L1-L147)
- [js/box.js](js/box.js#L1-L128)
- [js/goal.js](js/goal.js#L1-L60)
- [js/obstacles.js](js/obstacles.js#L1-L356)
- [js/collision.js](js/collision.js#L1-L48)
- [js/score.js](js/score.js#L1-L50)
- [js/timer.js](js/timer.js#L1-L75)
- [js/rat.js](js/rat.js#L1-L242)
- [style.css](style.css#L1-L254)

No new layers or dependencies are invented.

---

## 1. Architectural Layers (Conceptual)

These are **conceptual layers**, not folders:

1. **Entry**: HTML entry and JS coordinator
   - [index.html](index.html#L1-L47)
   - [js/main.js](js/main.js#L1-L105)
2. **State & lifecycle**: screen and state transitions
   - [js/game-state.js](js/game-state.js#L1-L77)
3. **Systems & entities**: movement, hazards, win/loss checks, counters
   - [js/player.js](js/player.js#L1-L147), [js/box.js](js/box.js#L1-L128), [js/goal.js](js/goal.js#L1-L60), [js/obstacles.js](js/obstacles.js#L1-L356), [js/rat.js](js/rat.js#L1-L242), [js/score.js](js/score.js#L1-L50), [js/timer.js](js/timer.js#L1-L75)
4. **Utilities**: pure helpers
   - [js/collision.js](js/collision.js#L1-L48)
5. **UI & side effects**: presentation only
   - [index.html](index.html#L1-L47), [style.css](style.css#L1-L254)

---

## 2. Allowed Import Directions (Canonical Table)

**Conceptual layer rules (one‑way):**

| From Layer | May Import | Must Not Import |
|---|---|---|
| Entry | State, Systems, Utilities | UI does not import JS (HTML is the entry) |
| State & lifecycle | Systems/Entities (for resets and lifecycle triggers) | Utilities are not required here | 
| Systems & entities | State, Utilities, other systems when needed | UI files, or Entry coordinator |
| Utilities | Nothing | Systems, State, UI |
| UI & side effects | Nothing | Systems or State |

**Actual file‑level imports (single source of truth):**

| File | Imports | Evidence |
|---|---|---|
| [index.html](index.html#L1-L47) | Loads [js/main.js](js/main.js#L1-L105) | [index.html](index.html#L43-L44) |
| [js/main.js](js/main.js#L1-L105) | `game-state`, `player`, `obstacles`, `collision`, `goal`, `score`, `timer`, `box` | [js/main.js](js/main.js#L35-L50) |
| [js/game-state.js](js/game-state.js#L1-L77) | `player`, `box`, `score`, `goal`, `timer`, `rat` | [js/game-state.js](js/game-state.js#L3-L8) |
| [js/player.js](js/player.js#L1-L147) | `goal`, `box`, `collision`, `main` | [js/player.js](js/player.js#L3-L6) |
| [js/box.js](js/box.js#L1-L128) | `main` | [js/box.js](js/box.js#L3-L3) |
| [js/goal.js](js/goal.js#L1-L60) | `collision`, `score`, `game-state`, `box` | [js/goal.js](js/goal.js#L3-L6) |
| [js/obstacles.js](js/obstacles.js#L1-L356) | `collision`, `game-state`, `rat` | [js/obstacles.js](js/obstacles.js#L3-L5) |
| [js/timer.js](js/timer.js#L1-L75) | `game-state` | [js/timer.js](js/timer.js#L3-L3) |
| [js/score.js](js/score.js#L1-L50) | (none) | [js/score.js](js/score.js#L1-L50) |
| [js/collision.js](js/collision.js#L1-L48) | (none) | [js/collision.js](js/collision.js#L1-L48) |
| [js/rat.js](js/rat.js#L1-L242) | (none) | [js/rat.js](js/rat.js#L1-L242) |

---

## 3. Forbidden Dependency Patterns (Hard Rules)

These patterns **do not exist** in the current architecture and must stay forbidden:

- **Utilities importing systems or entities.** This would turn a pure helper into a rule engine. Utility files stay leaf‑only, as shown in [js/collision.js](js/collision.js#L1-L48).
- **UI importing gameplay logic.** HTML/CSS define structure and visuals only, as shown in [index.html](index.html#L1-L47) and [style.css](style.css#L1-L254).
- **Bidirectional imports (cycles).** Cycles make load order and state unpredictable. The current graph is acyclic.
- **Entry file owning rules.** The entry coordinator wires systems and owns audio, but it does not decide gameplay outcomes (see [js/main.js](js/main.js#L1-L105)).

---

## 4. Root vs Leaf Files (Authority Model)

| Role | Files | Why |
|---|---|---|
| **Roots (may import many)** | [js/main.js](js/main.js#L35-L50), [js/game-state.js](js/game-state.js#L3-L8) | They coordinate setup and lifecycle, so they legitimately depend on multiple systems |
| **Leaves (import nothing)** | [js/collision.js](js/collision.js#L1-L48), [js/score.js](js/score.js#L1-L50), [js/rat.js](js/rat.js#L1-L242), [style.css](style.css#L1-L254) | They are single‑purpose endpoints with no upstream dependencies |
| **Entry shell** | [index.html](index.html#L1-L47) | Loads [js/main.js](js/main.js#L1-L105) but is not a system |

**Why `collision.js` is a leaf:** it is pure math with no imports or side effects [js/collision.js](js/collision.js#L1-L48).

**Why `main.js` is a coordinator, not a god file:** it wires systems and owns audio, but game rules live elsewhere [js/main.js](js/main.js#L35-L103).

---

## 5. How to Add New Files Safely (Rules for Copilot)

When adding a new file in this project, it must fit one of the existing layers:

1. **Decide the layer first.** Entry, State, System/Entity, Utility, or UI.
2. **Follow the allowed import directions.**
   - Utilities import nothing.
   - Systems may import State and Utilities.
   - State may import Systems for resets and lifecycle triggers.
   - UI imports nothing.
3. **Avoid cycles.** If two files need each other, extract the shared logic into a utility leaf.
4. **Keep entry coordination only.** New files should not move rule logic into [js/main.js](js/main.js#L1-L105) or [index.html](index.html#L1-L47).

These rules preserve the existing, working dependency flow.

---

## Summary (Beginner‑Friendly Mental Model)

- **Imports define architecture.**
- **Direction matters.** Utilities are leaves; coordinators are roots.
- **No cycles, no UI‑to‑logic imports.**
- **Stick to the existing import graph.**

If these rules hold, the system stays stable and predictable.