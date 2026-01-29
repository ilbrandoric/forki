# Entity Model & Responsibility Boundaries

## 1. What Counts as an Entity (Canonical Definition)

In this project, an **entity** is:

- A DOM element with visual presence (something you can see)
- A position in the game world (x, y coordinates)
- A defined responsibility (what it does)
- Clear boundaries (what it does **not** control)

Entities are **not**:
- State machines (that is game-state.js)
- Timers or intervals (that is timer.js or loop management)
- Collision utilities (that is collision.js)
- Screen controllers (that is game-state.js)

In simple terms: **if you can see it moving or colliding, it is probably an entity**. If it is abstract logic or infrastructure, it is not.

---

## 2. Entity List (Single Source of Truth)

The game has exactly six entities:

| Entity | Created Where | DOM Owned | When Created | When Destroyed |
|--------|----------------|-----------|-------------|-----------------|
| **Player** | index.html `#player` | `<div id="player">🚜</div>` | Module load | Never (persists across rounds) |
| **Box** | index.html `#box` | `<div id="box">📦</div>` | Module load | Never (persists across rounds) |
| **Goal** | index.html `#drop-zone` | `<div id="drop-zone">X</div>` | Module load | Never (static, persists) |
| **Cones** | obstacles.js `initializeCones()` | Multiple `<div>` with 🚧 | First 50ms loop when state="playing" | When state leaves "playing" |
| **Persons** | obstacles.js `initializePersons()` | Multiple `<div>` created dynamically | First 50ms loop when state="playing" | When state leaves "playing" |
| **Rat** | obstacles.js `spawnRat()` (called by game-state.js) | One `<div>` with 🐀 | When state transitions to "playing" | After 5 second lifetime OR when state leaves "playing" |

---

## 3. Responsibility Boundaries (Critical)

For each entity, here are the hard boundaries of what it controls, observes, and is forbidden from doing:

### Player (player.js)

**What it controls**:
- Its own position (x, y)
- Its own DOM rendering (style.left, style.top)
- Movement logic (arrow key input)

**What it observes** (read-only):
- Game state (via `getGameState()`)
- Box position (for collision checks)
- Game area bounds
- Cone positions (via `canMove()`)

**What it triggers**:
- Calls `checkGoal()` after every movement

**What it is FORBIDDEN from doing**:
- ❌ Change game state
- ❌ Create, destroy, or reset itself
- ❌ Move the box directly
- ❌ Create or check obstacles
- ❌ Access the timer or score
- ❌ Spawn or manage the rat

---

### Box (box.js)

**What it controls**:
- Its own position (x, y)
- Its own DOM rendering (style.left, style.top)
- Push/movement logic (when player pushes it)

**What it observes** (read-only):
- Game area bounds
- Cone positions (via `canMove()`)

**What it triggers**:
- Nothing (box is passive, only responds to push)

**What it is FORBIDDEN from doing**:
- ❌ Move itself unprompted
- ❌ Create, destroy, or reset itself
- ❌ Check collisions with goal or persons
- ❌ Access game state
- ❌ Access any other entity directly

---

### Goal (goal.js)

**What it controls**:
- Goal reached flag (whether goal has been triggered this round)

**What it observes** (read-only):
- Box position (to check if box is in goal zone)
- Exists as a static DOM element (no movement)

**What it triggers**:
- Calls `incrementScore()` when box reaches it
- Calls `triggerGameOver("You won!")` when box reaches it

**What it is FORBIDDEN from doing**:
- ❌ Move itself or other entities
- ❌ Create, destroy, or reset itself
- ❌ Change game state directly
- ❌ Check collisions with anything except box
- ❌ Access player, cones, persons, or rat

---

### Cones (obstacles.js - static obstacles)

**What they control**:
- Their own positions (created once per round)
- Their own DOM elements (created and removed by obstacles.js)

**What they observe** (read-only):
- Game area bounds
- Player and box positions (for safe spawn zones)

**What they trigger**:
- Nothing (cones are passive, only blocking)

**What they are FORBIDDEN from doing**:
- ❌ Move themselves
- ❌ Check collisions with anything
- ❌ Access game state
- ❌ Change any other entity
- ❌ Have any behavior beyond "be a wall"

---

### Persons (obstacles.js - moving hazards)

**What they control**:
- Their own position (x, y)
- Their own movement direction
- Their own DOM rendering (created and updated by obstacles.js)

**What they observe** (read-only):
- Game state (via `getGameState()` in the loop)
- Game area bounds
- Cone positions (for movement blocking)
- Player position (for collision checking)
- Box position (for collision checking)

**What they trigger**:
- Calls `triggerGameOver()` if they hit player
- Calls `triggerGameOver()` if they hit box

**What they are FORBIDDEN from doing**:
- ❌ Create or destroy themselves
- ❌ Change their own lifetime (managed by obstacles.js loop)
- ❌ Access score, timer, or goal
- ❌ Check collisions with rat or other persons
- ❌ Reset themselves or other entities

---

### Rat (rat.js - temporary moving hazard)

**What it controls**:
- Its own position (x, y)
- Its own movement direction
- Its own lifetime countdown
- Its own DOM element (created and destroyed by rat.js)

**What it observes** (read-only):
- Game state (via `getGameState()` in obstacles.js loop)
- Game area bounds
- Cone positions (for spawn safety only, not collision)
- Player position (for collision checking, checked by obstacles.js)
- Box position (for collision checking, checked by obstacles.js)

**What it triggers**:
- Nothing directly (obstacles.js checks rat collisions and calls `triggerGameOver()`)

**What it is FORBIDDEN from doing**:
- ❌ Create or destroy itself (game-state.js or obstacles.js does this)
- ❌ Change game state
- ❌ Modify player, box, or other entities
- ❌ Check its own collisions (obstacles.js does this)
- ❌ Reset itself
- ❌ Interact with persons

---

## 4. Entity Lifecycle (Create → Use → Destroy)

Every entity follows a defined lifecycle. Understanding this prevents memory leaks and undefined behavior:

### Static Entities (Player, Box, Goal)

```
MODULE LOAD
    ↓
HTML defines #player, #box, #drop-zone
    ↓
JavaScript module loads, gets references
    ↓
Initial position set via style.left / style.top
    ↓
Entity exists for entire game lifetime
    ↓
resetEntity() called when state→"playing" (resets position, not DOM)
    ↓
...game loop...
    ↓
[PAGE RELOAD] only way to destroy
```

**Why this matters**: Static entities are created once and reused. Reset only means "put back to start position," not "recreate."

---

### Dynamic Entities (Cones, Persons)

```
MODULE LOAD
    ↓
obstacles.js loaded, no DOM created yet
    ↓
State → "playing"
    ↓
50ms loop runs
    ↓
conesInitialized flag is false → initializeCones() runs → flag becomes true
    ↓
Cones created and added to DOM
    ↓
...50ms loop updates persons each tick...
    ↓
State leaves "playing" (→ "gameOver" or page reload)
    ↓
50ms loop detects state change
    ↓
Cleanup runs: DOM elements removed, arrays cleared, flags reset
    ↓
conesInitialized flag is false again → next time state→"playing", cones respawn
```

**Why this matters**: Dynamic entities must be cleaned up when state changes to prevent:
- Memory leaks (DOM not removed)
- Duplicates (creating entities twice without cleaning up first)
- Confusion (old entities visible on wrong screen)

---

### Temporary Entity (Rat)

```
State → "playing"
    ↓
game-state.js calls spawnRat()
    ↓
rat.js spawnRat() creates DOM element, sets random position, records birthTime
    ↓
obstacles.js 50ms loop calls updateRat() every tick
    ↓
Rat moves, DOM updated
    ↓
[TWO POSSIBLE OUTCOMES]
    ↓
OUTCOME 1: Lifetime expires (current time > birthTime + 5000ms)
    ↓
cleanupRat() called by obstacles.js
    ↓
DOM removed, state cleared
    ↓
Rat is dead until next game
    ↓
---
    ↓
OUTCOME 2: State leaves "playing"
    ↓
game-state.js calls cleanupRat() explicitly
    ↓
DOM removed, state cleared
    ↓
Rat is dead until next game
```

**Why this matters**: Rat has a built-in timeout (5 seconds). It must be cleaned up both on:
- Lifetime expiration (automatic)
- Game end (explicit cleanup)

This prevents the rat from persisting across games or appearing after game over.

---

## 5. How Entities Interact (Without Coupling)

Entities in this system do **not coordinate directly**. There are no imports like `import { moveOtherEntity } from "other-entity.js"`. Instead, they interact through three mechanisms:

### 1. Shared Collision Utility (collision.js)

Collision detection is centralized. Entities do not call each other; they call `checkCollision()`:

```
goal.js: checkCollision(boxElement, dropZoneElement) → checks if won
obstacles.js: checkCollision(personElement, playerElement) → checks if lost
player.js: (calculates overlap inline) → checks if pushing box
```

**Why this works**: Collision detection has no side effects; it just returns true/false. Multiple systems can call it independently.

---

### 2. State as Mediator (game-state.js)

Entities read game state to decide whether to run:

```
Player: getGameState() → only move if "playing"
Obstacles: getGameState() → only update if "playing"
Timer: getGameState() → only count if "playing"
```

Entities change state indirectly by calling trigger functions:

```
goal.js: triggerGameOver("You won!")
obstacles.js: triggerGameOver("Game Over!")
timer.js: triggerGameOver("Time's up!")
```

Game state then handles cleanup and screen switching. **Entities never directly change state.**

---

### 3. Observers (Score, Timer)

Score and Timer observe other events but do not coordinate:

```
goal.js reaches goal → calls incrementScore() → score updates
timer.js tick happens → decrements time → triggers game over if needed
```

**Why this works**: Score and Timer have no bidirectional communication. They observe external events and react locally.

---

### What Does NOT Happen

Entities never do this:

```
❌ Player calls: box.move() or box.reset()
❌ Rat calls: obstacles.spawnPerson()
❌ Cones call: player.triggerGameOver()
❌ Persons import: rat.js directly
❌ Goal checks: obstacles or timer state
```

This coupling would make the system fragile. Instead, everything goes through game-state.js or utility functions.

---

## 6. Common Entity Design Failures (Guardrails)

Understanding these prevents Copilot from breaking the architecture:

### Failure 1: Entity Calls triggerGameOver Directly

**The mistake**:
```
Person collides with player → person calls triggerGameOver()
```

**Why it seems reasonable**: Person detects collision, so person should report it.

**Why it breaks the architecture**: Now trigger logic is scattered across files. If you want to change game-over behavior, you have to modify multiple entity files.

**Correct pattern**: Person detects collision and calls a trigger function in obstacles.js. Obstacles.js calls `triggerGameOver()`. One place handles "what happens on game over," and it is not scattered.

---

### Failure 2: Entity Resets Itself

**The mistake**:
```
player.js: onStateChange() { if (state === "playing") resetPlayer() }
```

**Why it seems reasonable**: When playing starts, the player should reset itself.

**Why it breaks the architecture**: Reset logic is now in multiple places. Player resets here, box resets somewhere else, score resets elsewhere. On state change, you have to trace through five files to see what actually happens.

**Correct pattern**: All resets happen in one place: `showScreen("playing")` in game-state.js. It calls:
```
resetPlayer()
resetBox()
resetScore()
resetGoal()
resetTimer()
```

One place, clear order, easy to verify.

---

### Failure 3: Entity Spawns Other Entities

**The mistake**:
```
obstacles.js: if (personsNeedRat()) spawnRat()
```

**Why it seems reasonable**: Obstacles loop updates hazards, so it spawns rat.

**Why it breaks the architecture**: Now lifecycle management is diffuse. When does rat spawn? When does it die? If obstacles.js spawns it, who cleans it up? Confusing boundaries.

**Correct pattern**: game-state.js is the lifecycle authority. When state→"playing," game-state.js calls:
```
spawnRat()
```

Rat's responsibility is to exist and move. Spawning is not its responsibility. Game-state owns the timeline.

---

### Failure 4: Entity Owns a Timer or Interval

**The mistake**:
```
rat.js: setInterval(() => { if (lifetimeExpired) die() }, 100)
```

**Why it seems reasonable**: Rat has a lifetime, so it should manage its own expiration.

**Why it breaks the architecture**: Now rat.js has an interval running independently. If the game ends, who stops it? If rat resets, does the interval reset? Multiple systems managing time = chaos.

**Correct pattern**: Rats are updated by the central 50ms loop in obstacles.js:
```
setInterval(() => {
  updateRat()
  if (ratLifetimeExpired()) cleanupRat()
}, 50)
```

One loop, one authority, one place to debug timing issues.

---

### Failure 5: Entity Checks DOM Instead of State

**The mistake**:
```
Obstacles check: if (!document.querySelector("#player").classList.contains("hidden"))
```

**Why it seems reasonable**: If the player is hidden, it is not playing.

**Why it breaks the architecture**: Now logic depends on CSS classes. If someone changes the class name during refactoring, collisions break silently.

**Correct pattern**: Check state directly:
```
if (getGameState() === "playing")
```

State is the source of truth. CSS is just visual representation.

---

### Failure 6: Entity Coordinates with Another Entity Directly

**The mistake**:
```
player.js imports rat.js to check: if (isRatAlive()) avoid it
```

**Why it seems reasonable**: Player and rat collide, so player should know about rat.

**Why it breaks the architecture**: Now player depends on rat implementation. If rat.js changes how it tracks lifetime, player.js breaks. They are coupled.

**Correct pattern**: Both player and rat are checked by obstacles.js in the main loop:
```
// obstacles.js
checkCollision(playerElement, ratElement) → call triggerGameOver()
```

Entities never import each other. A central place checks all interactions.

---

## Summary: Entities Are Simple, Separated, and Stateless

```
ENTITY PROPERTIES:

            Player    Box       Goal      Cones    Persons   Rat
Owns DOM      ✓        ✓        ✓         ✓        ✓        ✓
Owns position ✓        ✓        ✗         ✓        ✓        ✓
Active during"playing" "playing" always  "playing" "playing" "playing"
Persists     ✓        ✓        ✓         ✗        ✗        ✗
Spawns self  ✗        ✗        ✗         ✗        ✗        ✗
Resets self  ✗        ✗        ✗         ✗        ✗        ✗
Calls reset others ✗ ✗ ✗ ✗ ✗ ✗

INTERACTION RULES:

Entities read state    ✓ (one-way, no permission to write)
Entities call triggers ✓ (only triggerGameOver / incrementScore)
Entities check collisions ✓ (via shared utility)
Entities import entities  ✗ (forbidden)
Entities own timers     ✗ (forbidden)
Entities manage state   ✗ (forbidden)
Entities reset others   ✗ (forbidden)
```

When adding new entities, follow these rules:
1. **Define its responsibility** — what does it do and only that?
2. **Define its lifecycle** — when is it created, used, destroyed?
3. **Define its boundaries** — what is it forbidden from doing?
4. **No imports between entities** — use state or utilities instead
5. **No self-management** — game-state owns lifecycle authority

Entities are simple. Simplicity is strength.
