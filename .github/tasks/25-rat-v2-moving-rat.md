# 25 – Rat v2 (Moving Rat)

## Purpose

Upgrade the Rat entity from temporary static hazard to a **moving temporary hazard**.

This task adds behavior to an existing entity without changing architecture,
proving that the system supports evolution as well as extension.

---

## Scope (Explicit)

This task adds:
- Movement to Rat
- Direction changes
- Boundary handling
- Continued expiration after lifetime

This task **must not**:
- Change Rat lifecycle ownership
- Change reset model
- Change collision ownership
- Change other entities
- Introduce new systems or abstractions
- Modify core loops beyond adding rat movement update

---

## Behavior Definition

### Movement
- Rat moves every update tick (same 50ms loop as persons)
- Movement speed is slower than persons (e.g., 2–3px per tick)
- Direction is chosen at spawn (random)
- Direction can change on boundary hit or randomly

### Boundaries
- Rat must stay within world bounds
- On boundary collision:
  - Reverse direction OR
  - Choose new random direction

### Lifetime
- Lifetime behavior unchanged
- Still expires automatically after fixed duration
- Movement stops after expiration

### Collision
- Collision rules unchanged
- Player touching rat → game over
- Rat touching others → no effect

---

## Files in Scope

Only existing files may be modified:

- `js/rat.js` (movement logic)
- `js/obstacles.js` (call rat movement update)
- `style.css` (if visual tweak needed)
- `js/game-state.js` (no changes expected, but allowed if needed for reset)

No new files may be created.

---

## Required Alignments

### 1. Lifecycle
- INIT: direction chosen at spawn
- UPDATE: movement + lifetime check
- RENDER: update position visually
- CLEANUP: unchanged

### 2. Update ownership
- Rat movement update must be called from existing 50ms loop
- No new intervals allowed
- No requestAnimationFrame usage

### 3. Architectural cleanliness
- Rat remains isolated in rat.js
- No rat logic in player.js
- No rat logic in main.js
- No rat logic in collision.js
- obstacles.js only coordinates update/collision

---

## Validation Rules

This task is done **only when**:

### Movement
- Rat moves smoothly at constant speed
- Rat stays within world bounds
- Rat changes direction correctly
- Rat never teleports

### Lifetime
- Rat still expires after lifetime
- Rat cleanup removes movement + DOM
- Rat does not move after expiration

### Collision
- Player touching rat still causes game over
- No new collision interactions added

### Stability
- No console errors
- No duplicate rats
- No memory leaks
- No performance regression

User must validate behavior.

---

## Output Expectation

After this task:
- Rat feels alive
- Architecture remains untouched
- Moving hazards can be added easily
- Difficulty scaling becomes trivial

Copilot must stop and wait for user validation when finished.
