# State Machine & Lifecycle Documentation

## 1. The State List (Canonical)

The game has exactly three states. This is the single source of truth:

| State | Purpose | Visible Screen | What Can Run | What Is Blocked |
|-------|---------|----------------|-------------|-----------------|
| `"start"` | Waiting for player to begin | `#start-screen` | Keyboard listeners register (dormant), Audio system monitors | Obstacles do not spawn, Timer does not count, Player cannot move, Persons do not move |
| `"playing"` | Active gameplay | `#game-screen` | All systems (player movement, obstacles, timer countdown, collision detection) | None – everything runs |
| `"gameOver"` | Game has ended (win or loss) | `#game-over-screen` | Audio system monitors | Obstacles stop, Timer stops, Player input is ignored, Nothing new spawns |

**Key insight**: State determines *visibility* (which screen shows) and *behavior* (which systems are allowed to run).

---

## 2. State Transitions (Lifecycle Flow)

The game follows a simple cycle:

```
start
  ↓
[Player clicks "Start" button]
  ↓
playing
  ↓
[Box reaches goal OR time runs out OR person touches player]
  ↓
gameOver
  ↓
[Player clicks "Restart" button]
  ↓
[Page reloads]
  ↓
start
  ↓
...
```

### Transition: start → playing

**Trigger**: Player clicks the "Start" button (registered in game-state.js)

**Conceptual event**: `showScreen("playing")` is called

**Side effects (in order)**:
1. All reset functions are called:
   - `resetPlayer()` — player position to (0, 0)
   - `resetBox()` — box position to (100, 100)
   - `resetScore()` — score to 0
   - `resetGoal()` — goal flag to false (can be triggered again)
   - `resetTimer()` — timer state prepared for countdown
2. Rat is spawned onto the game area
3. Game state is changed to `"playing"`
4. `#game-screen` becomes visible, `#start-screen` is hidden
5. Audio system detects state change and plays background music (if not muted)

**Must NOT happen**:
- Cones or persons should not be created (guarded by `conesInitialized` and `personsInitialized` flags)
- Old entities from a previous game should not persist
- Timer should not begin counting until state is actually `"playing"`

**Why this order matters**: Resets happen *before* state changes so that systems read clean state when they wake up.

---

### Transition: playing → gameOver

**Trigger**: One of three events
1. Box reaches the goal (checked by goal.js after player movement)
2. Timer reaches 0 (checked by timer.js in its interval)
3. Person collides with player or box (checked by obstacles.js in its interval)

**Conceptual event**: `triggerGameOver(reason)` is called (from goal.js, timer.js, or obstacles.js)

**Side effects (in order)**:
1. Result text is set to the provided reason ("You won!", "Time's up!", or "Game Over!")
2. `showScreen("gameOver")` is called
3. Rat is cleaned up (removed from DOM)
4. Game state is changed to `"gameOver"`
5. `#game-over-screen` becomes visible, `#game-screen` is hidden
6. Audio system detects state change and pauses background music

**Must NOT happen**:
- Obstacles should not continue moving (guarded by state check in obstacles.js)
- Timer should not continue counting (guarded by state check in timer.js)
- Player input should not affect the game (keyboard listener still active but game state blocks meaningful behavior)
- Goal flag reset should not happen (carry over to next round)

**Why this structure**: The game-over screen displays until the player clicks restart, giving them time to see the result.

---

### Transition: gameOver → start

**Trigger**: Player clicks the "Restart" button (registered in game-state.js)

**Conceptual event**: `window.location.reload()` is called

**What happens**:
- The entire page reloads from scratch
- All JavaScript modules run again
- Game state is initialized to `"start"` again
- The boot flow repeats

**Why this design**: Instead of trying to reset every system manually, a full reload guarantees a clean slate. This is simpler and safer than partial cleanup.

---

## 3. System Gating (Who Obeys State)

Every major system checks state before running behavior. Here is how each system respects the state machine:

### Player (player.js)

**How it checks state**: Keyboard listener is always active, but movement checks depend on game state indirectly through collision blocking and state-based behavior.

**State behavior**:
- `"start"` and `"gameOver"`: Keyboard input is registered but cannot cause meaningful movement (position changes are blocked)
- `"playing"`: Keyboard input causes movement and collision checks

**If state is ignored**: Player could move on the start screen or after game over, breaking the visual model that the game is frozen until you click start.

**Type**: Event-driven (keyboard input)

---

### Obstacles (obstacles.js)

**How it checks state**: The 50ms interval loop contains an explicit state check at the top: `if (currentState !== "playing") { cleanup and return; }`

**State behavior**:
- `"start"` and `"gameOver"`: Interval runs but returns early; cones and persons are cleaned up and removed from DOM
- `"playing"`: After state check passes, cones and persons are created (once) and updated every 50ms

**If state is ignored**: Cones and persons would appear on the start screen, move during game over, and behave unpredictably across rounds.

**Type**: Loop-driven (50ms interval) with state gating

---

### Timer (timer.js)

**How it checks state**: The 1000ms interval loop contains an explicit state check: `if (currentState !== "playing") { return; }`

**State behavior**:
- `"start"` and `"gameOver"`: Interval runs but returns early before decrementing
- `"playing"`: Time decrements once per second and updates display

**If state is ignored**: Timer would count down during the start screen and after game over, making the time meaningless and breaking win/loss conditions.

**Type**: Loop-driven (1000ms interval) with state gating

---

### Goal (goal.js)

**How it checks state**: Goal checking happens inside `checkGoal()`, which is called by player.js. There is no explicit state check *inside* goal.js, but goal.js relies on being called only when movement is allowed.

**State behavior**:
- `"start"` and `"gameOver"`: `checkGoal()` is not called (because player is not moving)
- `"playing"`: `checkGoal()` is called after every player movement

**If state is ignored**: Win conditions could trigger on the start screen or after game over, breaking the game flow.

**Type**: External event (called by player.js)

---

### Score (score.js)

**How it checks state**: Score checking happens inside `incrementScore()`, which is called by goal.js. Score has no explicit state check because it only runs when goal is reached, which only happens during play.

**State behavior**:
- All states: Score can only change when `incrementScore()` is called by goal.js
- Reset happens during state transition to `"playing"`

**If state is ignored**: Score could increment at the wrong time or persist between games unexpectedly.

**Type**: External event (called by goal.js)

---

### Audio (main.js)

**How it checks state**: The audio system has an explicit state check in its monitoring loop: `if (lastGameState !== "playing" && currentState === "playing")` and `if (lastGameState === "playing" && currentState !== "playing")`

**State behavior**:
- `"start"`: Music is paused
- `"playing"`: Music plays (if not muted)
- `"gameOver"`: Music is paused

**If state is ignored**: Music would play during the start screen and game over, breaking immersion.

**Type**: Loop-driven (100ms monitor loop) with state transitions

---

## 4. State as a Safety Mechanism (Why This Design Exists)

This game uses a **state-gating architecture** instead of simpler approaches. Understanding why prevents dangerous refactors:

### Why Intervals Are Always Running (Not Started/Stopped)

**Dangerous approach**: Start and stop intervals when entering/exiting play state.

**Why it doesn't work here**:
- Intervals are registered during module load, before state exists
- Starting/stopping intervals requires keeping track of interval IDs globally
- It's easy to accidentally leave an old interval running or fail to clear it
- Testing and debugging become harder (state is scattered across code)

**Better approach** (used here): Intervals are registered once and run forever. Each interval checks state at the top and returns early if state is wrong.

**Benefit**: State is the single authority. Intervals don't need to manage their own lifecycle.

---

### Why Behavior Is Blocked Instead of Destroyed

**Dangerous approach**: Delete obstacles when state changes, recreate them when playing.

**Why it doesn't work here**:
- Cleanup errors can leave DOM elements behind
- Recreating entities requires resetting all their state perfectly
- It's easy to forget to update one property during cleanup

**Better approach** (used here): Obstacles are created and kept in the DOM. They are hidden (DOM is not modified) and marked for cleanup when state changes, then cleaned up lazily in the next interval loop.

**Benefit**: Simpler cleanup logic and less risk of half-cleaned states.

---

### Why Resets Are Centralized (Not Scattered)

**Dangerous approach**: Have each system reset itself when state changes.

**Why it doesn't work here**:
- Multiple systems need to be reset in a specific order
- Systems might forget to reset or reset incompletely
- Reset logic scattered across files is hard to understand
- Easy to accidentally reset something twice or not at all

**Better approach** (used here): All resets are called from one place: `showScreen("playing")` in game-state.js.

**Benefit**: Reset order is explicit and can be debugged in one location.

---

### Why State Is Checked Everywhere (Not Just at Entry)

**Dangerous approach**: Check state only once at the start of an interval, trust systems afterward.

**Why it doesn't work here**:
- A system might take multiple steps; state could change mid-execution
- Systems depend on state being true when they access other systems
- Code becomes fragile if state can change unexpectedly

**Better approach** (used here): Every system checks state before behavior. Interval loops check at the top. Event handlers assume state is valid (because they're only called during play).

**Benefit**: No race conditions or surprise state changes mid-operation.

---

## 5. Common State Bugs (Educational Guardrails)

Understanding these failure modes prevents Copilot from making the same mistakes:

### Bug 1: Adding Logic That Ignores State

**The mistake**:
```
A new system is added that runs an interval without checking state.
It updates the DOM or game logic regardless of state.
```

**Why it's dangerous**: The new system runs during start, playing, and game over. This breaks the visual model (things move when they shouldn't) and can interfere with UI.

**How to avoid**: Every interval loop must check `getGameState()` at the top and return early if state is not `"playing"`.

**Correct pattern**:
```
setInterval(() => {
  if (getGameState() !== "playing") return
  // system behavior here
}, 50)
```

---

### Bug 2: Running Logic in Multiple States

**The mistake**:
```
A system checks state but is allowed to run in multiple states.
For example: if (state === "playing" || state === "start") { ... }
```

**Why it's dangerous**: The system's behavior becomes state-dependent in a way that's hard to trace. Different states require different behavior, and mixing states creates bugs.

**How to avoid**: Systems should run in only one state: `"playing"`. If a system must run in multiple states, document why and make the logic explicit.

---

### Bug 3: Resetting Outside Transitions

**The mistake**:
```
A system resets itself in its own code.
For example: player.js calls resetPlayer() in some event handler.
```

**Why it's dangerous**: Resets become scattered across files. Multiple systems reset in wrong order. A new system might be created before an old one is reset, causing duplicates or conflicts.

**How to avoid**: All resets happen in game-state.js, in `showScreen("playing")`, in a defined order.

---

### Bug 4: Checking DOM Instead of State

**The mistake**:
```
A system checks if an element is visible: if (!element.classList.contains("hidden"))
Instead of checking state: if (getGameState() === "playing")
```

**Why it's dangerous**: The system depends on CSS class names, which can change during refactoring. DOM visibility can be wrong if state is not managed carefully. State is the source of truth, not CSS.

**How to avoid**: Always check `getGameState()` directly. Let the state-to-screen mapping in game-state.js handle CSS.

---

### Bug 5: Using Flags Instead of State

**The mistake**:
```
A new system creates its own `isRunning` flag to track whether it should behave.
Example: let isRunning = false; // private to the system
```

**Why it's dangerous**: You now have two authorities (state and the flag) instead of one. They can get out of sync. It's unclear which one is the source of truth.

**How to avoid**: Use `getGameState()` directly. There is one state; all systems obey it.

---

## Summary: State Controls Everything

```
STATE MACHINE:

start (waiting) ──[click Start]──> playing (active) ──[goal|timer|collision]──> gameOver (frozen)
    ↑                                                                                  │
    └──────────────[click Restart]──────────────────────[page reload]────────────────┘

SYSTEMS BEHAVIOR:

                    start          playing        gameOver
Player movement     blocked        allowed        blocked
Obstacles          spawned not    active         cleanup
Timer countdown    blocked        counting       blocked
Audio              silent         playing        silent
Cones/Persons      not created    created/moving cleanup
Player input       ignored        processed      ignored
```

When adding new features, always ask:
1. **In which state(s) should this run?** (Usually only `"playing"`)
2. **How do I check state?** (Call `getGameState()` explicitly)
3. **What cleanup happens?** (What resets in `showScreen("playing")`?)

State is the traffic light. Your feature is the car. Red light = don't go.
