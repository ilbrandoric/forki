# State Machine & Lifecycle Documentation (Runtime Control Architecture)

## Purpose

This document explains how **state controls what systems are allowed to run, when they run, and when they must stop** in the Forki game.

State is not just a variable — it is **the traffic light of the entire game**. Every moving system obeys it.

---

## The Three States (Canonical)

The game has exactly three states. No more, no less.

| State | Purpose | Visible Screen | Systems Running | Systems Blocked |
|-------|---------|----------------|-----------------|-----------------|
| **start** | Initial state before game begins | Start screen (`#start-screen`) | None | All gameplay systems (timer, obstacles, input) |
| **playing** | Active gameplay | Game screen (`#game-screen`) | All (timer countdown, obstacle movement, player input, collision detection) | None |
| **gameOver** | Game ended (win or loss) | Game over screen (`#game-over-screen`) | None | All gameplay systems |

**Source of Truth**: `js/game-state.js` — the `gameState` variable and `getGameState()` function

---

## State Transitions (Lifecycle Flow)

### Transition 1: `start` → `playing`

**Trigger**: User clicks "Start Game" button (`#start-btn`)

**What Happens**:
1. Start screen becomes hidden
2. Game screen becomes visible
3. All entity positions reset to spawn values:
   - Player resets to (0, 0) via `resetPlayer()`
   - Box resets to (100, 100) via `resetBox()`
   - Score resets to 0 via `resetScore()`
   - Goal flag resets to allow new win via `resetGoal()`
   - Timer resets to 30 seconds via `resetTimer()`
4. Rat spawns via `spawnRat()`
5. Obstacles initialize (cones and persons placed randomly)
6. State variable changes to `"playing"`

**Side Effects**:
- Background music starts (if not muted)
- Timer begins counting down
- Obstacles begin moving
- Input is now accepted

**What Must Not Happen**:
- No entity positions can persist from previous round
- No stale collision flags can remain
- No obstacles from previous round can exist

**Source**: [game-state.js](../js/game-state.js#L46-L62)

---

### Transition 2: `playing` → `gameOver`

**Trigger**: One of four terminal conditions:
1. Timer reaches 0 (via `timer.js`)
2. Box reaches goal (via `goal.js`)
3. Player collides with person (via `obstacles.js`)
4. Player collides with rat (via `obstacles.js`)
5. Box collides with person (via `obstacles.js`)

**What Happens**:
1. Triggering system calls `triggerGameOver(reason)`
2. Game screen becomes hidden
3. Game over screen becomes visible
4. Result text displays the reason (e.g., "You won!" or "Time's up!")
5. Rat cleanup via `cleanupRat()`
6. State variable changes to `"gameOver"`

**Side Effects**:
- Background music stops and resets to start
- Timer interval stops via `clearInterval()`
- Obstacle loop stops processing movements
- Input is now ignored (player keypress events return early)
- Cones and persons are removed from DOM in next interval tick

**What Must Not Happen**:
- Multiple game-over triggers from same event (prevented by `failureTriggered` guard in `obstacles.js`)
- Systems continuing to run after game over
- Score or timer updating after game ends

**Source**: [game-state.js](../js/game-state.js#L65-L68)

---

### Transition 3: `gameOver` → `start` (via restart)

**Trigger**: User clicks "Restart" button (`#restart-btn`)

**What Happens**:
1. Entire page reloads via `window.location.reload()`

**Why Full Reload**:
- Ensures all module-level state is reset
- Prevents any residual state bugs
- Simple and reliable cleanup strategy

**Source**: [game-state.js](../js/game-state.js#L71-L73)

---

## State Transition Diagram

```
    ┌─────────┐
    │  start  │  (Initial state, waiting for user)
    └─────────┘
         │
         │ User clicks "Start Game"
         │ → Reset all entities
         │ → Spawn obstacles and rat
         ↓
    ┌─────────┐
    │ playing │  (Active gameplay, all systems running)
    └─────────┘
         │
         │ Terminal condition triggered:
         │ • Timer expires
         │ • Box reaches goal (win)
         │ • Collision with hazard (lose)
         │
         ↓
    ┌──────────┐
    │ gameOver │  (Game ended, showing result)
    └──────────┘
         │
         │ User clicks "Restart"
         │ → Full page reload
         │
         └───────→ (back to start)
```

---

## System Gating (Who Obeys State)

Every system that performs actions must check state. Here's how each system enforces state-based behavior:

### Timer (`timer.js`)

**How It Checks State**:
```javascript
const state = getGameState()
if (state !== "playing") {
  if (state === "gameOver") {
    clearInterval(timerIntervalId)
  }
  return
}
```

**Behavior**:
- Interval runs continuously from module load
- Only decrements time when `state === "playing"`
- Returns early in all other states
- Stops interval permanently on `gameOver` via `clearInterval()`

**State Violation Would Break**: Timer would count down during start screen or after game over

**Pattern**: Loop-driven with early return guard

**Source**: [timer.js](../js/timer.js#L36-L43)

---

### Obstacles (`obstacles.js`)

**How It Checks State**:
```javascript
const currentState = getGameState()
if (currentState !== "playing") {
  // Cleanup logic for cones and persons
  return
}
```

**Behavior**:
- Interval runs continuously (50ms tick rate)
- Only processes movements when `state === "playing"`
- Performs cleanup when exiting `"playing"` state:
  - Removes cones from DOM
  - Removes persons from DOM
  - Resets initialization guards
- Initialization happens only once per round via guards (`conesInitialized`, `personsInitialized`)

**State Violation Would Break**: 
- Persons would move during start or game over screens
- Collisions would trigger on wrong screens
- Obstacles would not reset between rounds

**Pattern**: Loop-driven with early return guard and cleanup logic

**Source**: [obstacles.js](../js/obstacles.js#L224-L245)

---

### Player (`player.js`)

**How It Checks State**:
- Player does NOT explicitly check state
- Input is accepted at all times, but only visible on game screen
- Movement happens regardless of state (architectural choice)

**Behavior**:
- Event-driven (keydown listener)
- Responds to arrow keys immediately
- Relies on screen visibility for functional state gating

**Why This Works**:
- Player element only visible during `"playing"` state
- User cannot see or interact with player during other states
- Invisible movement has no gameplay impact
- Goal and collision checks only matter when obstacles and goal are active

**State Violation Would Break**: 
- Nothing (movement during wrong state is harmless due to screen isolation)
- This is an example of **implicit state gating via visibility**

**Pattern**: Event-driven without explicit state check (screen visibility provides isolation)

**Source**: [player.js](../js/player.js#L57-L117)

---

### Background Music (`main.js`)

**How It Checks State**:
```javascript
const currentState = getGameState()
if (lastGameState !== "playing" && currentState === "playing") {
  if (!isMuted) {
    bgm.play()
  }
}
if (lastGameState === "playing" && currentState !== "playing") {
  bgm.pause()
  bgm.currentTime = 0
}
```

**Behavior**:
- Interval runs continuously (100ms tick rate)
- Monitors state transitions
- Starts music when entering `"playing"`
- Stops music when leaving `"playing"`
- Respects mute toggle regardless of state

**State Violation Would Break**: Music would play during wrong screens

**Pattern**: Loop-driven with transition detection

**Source**: [main.js](../js/main.js#L91-L103)

---

### Score (`score.js`)

**How It Checks State**:
- Score does NOT check state directly
- Only incremented when `incrementScore()` is called
- Only called by `goal.js` during `"playing"` state (indirect enforcement)

**Behavior**:
- Passive system (no autonomous updates)
- Updated only via external function call
- Relies on caller to enforce state

**Why This Works**:
- Goal checks only happen during `"playing"`
- Goal is only visible and active on game screen
- Reset function called during state transition to `"playing"`

**State Violation Would Break**: 
- If `incrementScore()` were called during wrong state, score would update incorrectly
- This is prevented by goal system's state isolation, not score itself

**Pattern**: Event-driven (external invocation) with no explicit state check

**Source**: [score.js](../js/score.js#L31-L34)

---

### Goal (`goal.js`)

**How It Checks State**:
- Goal does NOT check state directly
- Only checked when `checkGoal()` is called by player
- Player movement only visible during `"playing"` state (indirect enforcement)

**Behavior**:
- Passive system (no autonomous updates)
- Collision check triggered by player movement
- Uses `goalReached` flag to prevent repeated triggers
- Flag resets during state transition to `"playing"`

**Why This Works**:
- Player is only visible and can only move meaningfully during `"playing"`
- Goal element only visible on game screen
- Even if checked during wrong state, no visual or gameplay consequence

**State Violation Would Break**: 
- If goal check happened during `"start"` or `"gameOver"`, premature win condition
- Prevented by screen visibility isolation

**Pattern**: Event-driven (external invocation) with flag-based idempotency

**Source**: [goal.js](../js/goal.js#L44-L51)

---

### Box (`box.js`)

**How It Checks State**:
- Box does NOT check state directly
- Only moves when pushed by player
- Player interaction only meaningful during `"playing"` (indirect enforcement)

**Behavior**:
- Completely passive (only responds to player push)
- Movement and collision checks delegated to player
- Position resets during state transition to `"playing"`

**Why This Works**:
- Box cannot move autonomously
- Player is only active during `"playing"`
- Screen visibility provides functional isolation

**State Violation Would Break**: 
- If player could push box during wrong state, position would change incorrectly
- Prevented by player visibility and state isolation

**Pattern**: Event-driven (external invocation) with no explicit state check

**Source**: [box.js](../js/box.js#L67-L115)

---

## Summary: State Gating Patterns

| System | Pattern | State Check Method | Gating Mechanism |
|--------|---------|-------------------|------------------|
| **Timer** | Loop-driven | Explicit (`getGameState()`) | Early return + `clearInterval()` |
| **Obstacles** | Loop-driven | Explicit (`getGameState()`) | Early return + cleanup |
| **Background Music** | Loop-driven | Explicit (`getGameState()`) | Transition detection |
| **Player** | Event-driven | Implicit (screen visibility) | DOM visibility isolation |
| **Score** | Event-driven | Implicit (via caller) | External enforcement |
| **Goal** | Event-driven | Implicit (via caller + screen) | External enforcement + visibility |
| **Box** | Event-driven | Implicit (via player) | External enforcement |

**Two Philosophies**:
1. **Explicit Gating**: Systems check state themselves and return early
2. **Implicit Gating**: Systems rely on screen visibility and external callers

Both are valid. The choice depends on system autonomy:
- Autonomous systems (timers, obstacles) → Explicit checks
- Passive systems (entities) → Implicit isolation via visibility

---

## State as a Safety Mechanism (Why This Design Exists)

### Why Intervals Run Forever

**Design**: Timers and obstacle loops use `setInterval()` that runs from module load until page unload.

**Reason**:
- Simplifies lifecycle management (no need to start/stop intervals)
- State acts as gate, not switch
- Prevents timing bugs from interval restart
- Early return is cheaper than stopping/restarting

**Alternative (Not Used)**: Start interval on `"playing"`, stop on `"gameOver"`
- More complex (start/stop management)
- Risk of interval not restarting properly
- Risk of multiple intervals running (if restart bug)

---

### Why Behavior Is Blocked Instead of Destroyed

**Design**: Entities exist in DOM at all times. State controls whether they act.

**Reason**:
- Initialization is expensive (random placement, collision checks)
- Destruction/recreation creates garbage collection overhead
- State transition can fail mid-creation
- Reset functions are simpler than recreate functions

**Alternative (Not Used)**: Destroy entities on `"gameOver"`, recreate on `"playing"`
- More memory efficient (minor)
- More error-prone (creation can fail)
- Harder to debug (entities don't exist to inspect)

---

### Why Resets Are Centralized

**Design**: All reset functions called from `game-state.js` during transition to `"playing"`.

**Reason**:
- Single source of truth for "what resets when"
- Impossible to forget to reset a system
- Easy to see full reset sequence in one place
- State transition owns side effects

**Location**: [game-state.js](../js/game-state.js#L46-L62) `showScreen("playing")` block

**Alternative (Not Used)**: Each system resets itself when detecting state change
- Distributed logic (harder to reason about)
- Risk of systems missing state change detection
- Harder to guarantee reset order

---

### Why State Is Checked Everywhere

**Design**: Systems that run continuously check state in every iteration.

**Reason**:
- State can change at any moment
- Prevents race conditions (state change mid-operation)
- Clear, explicit guard at function entry
- Easy to verify correctness (one check per loop)

**Pattern**:
```javascript
setInterval(() => {
  if (getGameState() !== "playing") return
  // Do work
}, 50)
```

**Alternative (Not Used)**: Check state once, assume it doesn't change
- Faster (micro-optimization)
- Dangerous (state can change mid-operation)
- Hard to debug (stale state assumptions)

---

## Common State Bugs (Educational Guardrails)

### Bug 1: Adding Logic That Ignores State

**Example**:
```javascript
// BAD: This runs in all states
setInterval(() => {
  moveEnemy()
}, 100)
```

**Fix**:
```javascript
// GOOD: This only runs during "playing"
setInterval(() => {
  if (getGameState() !== "playing") return
  moveEnemy()
}, 100)
```

**Why Dangerous**: Enemy would move during start screen and after game over.

---

### Bug 2: Running Logic in Multiple States

**Example**:
```javascript
// BAD: This runs in both "playing" and "paused"
if (getGameState() === "playing" || getGameState() === "paused") {
  updateUI()
}
```

**Fix**:
```javascript
// GOOD: This only runs in one specific state
if (getGameState() === "playing") {
  updateUI()
}
```

**Why Dangerous**: Behavior becomes unpredictable across states. State should be mutually exclusive.

---

### Bug 3: Resetting Outside Transitions

**Example**:
```javascript
// BAD: Resetting in system's own loop
setInterval(() => {
  if (getGameState() === "playing") {
    resetTimer() // Don't do this
    updateTimer()
  }
}, 1000)
```

**Fix**:
```javascript
// GOOD: Resets happen only in game-state.js during transition
// In game-state.js showScreen("playing"):
resetTimer()

// In timer.js:
setInterval(() => {
  if (getGameState() !== "playing") return
  updateTimer() // No reset here
}, 1000)
```

**Why Dangerous**: Resets scattered across codebase are hard to track. Centralized resets guarantee consistency.

---

### Bug 4: Checking DOM Instead of State

**Example**:
```javascript
// BAD: Checking if screen is visible
if (!gameScreenNode.classList.contains("hidden")) {
  updateGame()
}
```

**Fix**:
```javascript
// GOOD: Checking state variable
if (getGameState() === "playing") {
  updateGame()
}
```

**Why Dangerous**: DOM and state can desync (e.g., CSS changes, animations). State is source of truth.

---

### Bug 5: Using Flags Instead of State

**Example**:
```javascript
// BAD: Parallel flag system
let isGameRunning = false

function startGame() {
  isGameRunning = true
  gameState = "playing"
}
```

**Fix**:
```javascript
// GOOD: State is the only source of truth
function startGame() {
  gameState = "playing"
}

// Check state directly:
if (getGameState() === "playing") {
  // ...
}
```

**Why Dangerous**: Flags and state can desync. Multiple sources of truth create bugs.

---

## Key Principles (Non-Negotiable)

1. **State controls behavior** — Not timers, not flags, not DOM. State is the authority.

2. **Systems obey state** — Every system that acts must check state or be isolated by visibility.

3. **Transitions are sacred** — State changes only via `showScreen()` or `triggerGameOver()`. Never set `gameState` directly elsewhere.

4. **Resets are centralized** — All reset logic lives in `game-state.js`. Systems don't reset themselves.

5. **State is checked often** — Continuous systems check state in every iteration. State can change anytime.

6. **One source of truth** — `gameState` variable in `game-state.js`. Never duplicate state logic.

---

## State Validation Checklist

When adding new features, ask these questions:

- [ ] Does this system run continuously? → Add explicit state check
- [ ] Does this system respond to events? → Verify state isolation (visibility or caller)
- [ ] Does this system need reset? → Add reset function and call it from `game-state.js`
- [ ] Does this system check state? → Use `getGameState()`, never read `gameState` directly
- [ ] Does this system change state? → Only via `showScreen()` or `triggerGameOver()`
- [ ] Does this system use flags? → Replace with state checks if possible
- [ ] Does this system check DOM visibility? → Replace with state checks

---

## Architecture Summary

**State Machine**: Simple 3-state FSM (`start` → `playing` → `gameOver`)

**Control Flow**: State gates behavior (traffic light model)

**Reset Strategy**: Centralized reset on transition to `"playing"`

**Gating Strategy**: Mix of explicit checks (autonomous systems) and implicit isolation (passive systems)

**Safety Mechanism**: Early return guards in all continuous loops

**Source of Truth**: `js/game-state.js` owns state variable and all transitions

---

## Related Documentation

- [Boot Flow](boot-flow.md) — How the game initializes before state machine takes over
- [Reset Logic](reset-logic.md) — Detailed explanation of all reset functions
- [Responsibility Map](responsibility-map.md) — Which modules own which behaviors
- [Timing Model](timing-model.md) — How intervals and event loops coordinate with state

---

## For Copilot: Adding New Features

When implementing new gameplay features:

1. **Always check state first** if your system runs continuously
2. **Never bypass state** — even if you think it's safe
3. **Add reset function** if your feature has persistent state
4. **Call reset from game-state.js** during `showScreen("playing")`
5. **Test all three states** — verify your feature behaves correctly in start, playing, and gameOver
6. **Never introduce new states** — use existing three states only
7. **Never duplicate state logic** — use `getGameState()` exclusively

State is not optional. State is not a suggestion. State is the law.
