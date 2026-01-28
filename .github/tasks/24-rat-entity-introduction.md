# 24 – Rat Entity Introduction (Temporary Obstacle)

## Purpose

This task introduces a **new obstacle entity: Rat**, using the architecture established in Tasks 20–23.

The Rat is a temporary entity:
- It spawns
- Exists for a short time
- Expires automatically
- Causes game over on collision with the player

This task proves that the architecture can be extended cleanly **without hacks or special cases**.

---

## Scope (Explicit)

This task introduces:
- One new entity (Rat)
- Temporary lifecycle (spawn → update → expire)
- Terminal collision with player
- No movement blocking behavior

This task **must not**:
- Change existing entities’ behavior
- Change collision rules of existing entities
- Change visuals of existing entities
- Change timing of existing systems
- Introduce new abstractions or base classes
- Rewrite existing logic

---

## Why this is needed

We have aligned:
- Lifecycles (Tasks 20–21)
- Round resets (Task 22)
- Collision participation (Task 23)

Now we validate the architecture by adding a **new entity that fits cleanly**.

If Rat can be added without hacks, the architecture is correct.

---

## Rat Behavior (Defined)

### Lifecycle
- **INIT:** Spawned randomly within world bounds
- **UPDATE:** Exists for a fixed duration (e.g., N seconds or ticks)
- **RENDER:** Visible while alive
- **CLEANUP:** Automatically removed after expiration or game end

### Collision
- Collision with **player → game over**
- Rat does NOT block movement
- Rat does NOT interact with box
- Rat does NOT interact with cones
- Rat does NOT interact with persons

Terminal collision only.

---

## Spawn Rules

- Spawn only when game state = "playing"
- Spawn randomly within valid world area
- Must not spawn inside player, box, cones, or goal
- Only one rat at a time (for now)
- Spawn frequency must be controlled (not spammy)

---

## Expiration Rules

- Rat expires automatically after a fixed lifetime
- Rat expires immediately on game end
- Rat must not persist across rounds
- Rat cleanup must be idempotent

---

## Files in Scope

Only existing files may be modified, plus **one new file**:

- `js/obstacles.js` (rat lifecycle integration)
- `js/collision.js` (reuse existing helpers only)
- `js/game-state.js` (spawn/cleanup trigger)
- `js/main.js` (render/update integration)
- `style.css` (visual only, minimal)
- `index.html` (if required for rendering hook)

New file allowed:
- `js/rat.js` (Rat entity only)

No other new files may be created.

---

## Required Alignments

### 1. Lifecycle
- Rat must follow same lifecycle model as other entities
- Init on game start or timed spawn
- Cleanup on game end
- No module-load persistence

### 2. Reset integration
- Rat must disappear on restart
- No state leak across rounds
- No duplicate rats

### 3. Collision integration
- Collision must use existing collision helpers
- Collision must be documented per Task 23 patterns
- Collision ownership must be explicit (Rat owns check OR external owner documented)

### 4. Architectural cleanliness
- No special cases in player.js
- No hardcoded hacks
- Rat logic isolated to rat.js + documented integration points

---

## Validation Rules

This task is done **only when**:

### Spawn
- Rat spawns only during "playing"
- Rat spawns within world bounds
- Rat never spawns on top of other entities
- Only one rat exists at a time

### Lifetime
- Rat disappears automatically after lifetime expires
- Rat disappears immediately on game end
- Rat never persists across rounds

### Collision
- Player touching rat causes game over
- Box touching rat does nothing
- Rat touching cones/persons does nothing
- Existing collisions unchanged

### Stability
- No console errors
- No duplicate rats
- No memory leaks
- No performance degradation

User must validate behavior.

---

## Output Expectation

After this task:
- Architecture is proven extensible
- New entities can be added predictably
- Rat can later be upgraded to moving entity
- Future obstacles have a clear template

Copilot must stop and wait for user validation when finished.
