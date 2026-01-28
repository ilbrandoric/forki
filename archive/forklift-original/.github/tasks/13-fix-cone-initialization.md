# Task — Iteration 13: Fix Cone Initialization Timing

## Status
OPEN — must be completed before blocking integration

---

## Problem Summary

Static construction cones are spawning at position `(0,0)`.

This happens because cone initialization currently runs at **module load time**, when:

- the game is still in `"start"` state
- `#game-area` has width = 0 and height = 0
- random placement collapses to `(0,0)`

This is a lifecycle bug, not a math bug.

---

## Objective

Move cone initialization so that cones are created:

- only when the game is in `"playing"` state
- only once per round
- after the DOM has real dimensions
- without delays or timeouts
- without architectural changes

---

## Architectural Constraints (MANDATORY)

- Modify **only**:
  - `js/obstacles.js`
  - `js/main.js` (orchestration only, if needed)
- Do NOT modify:
  - Player.js
  - Box.js
  - HTML
  - CSS
- Do NOT refactor existing systems
- Do NOT add new intervals
- Do NOT export cone geometry
- Cone collision logic must remain PRIVATE to obstacles.js
- World decides blocking (not entities)
- Use only a boolean guard for initialization
- Reuse the existing obstacle interval
- No timeouts, no delays, no hardcoded positions

---

## Required Fix (Exact Behavior)

### 1. Add initialization guard
In `obstacles.js`:
```js
let conesInitialized = false;
