# Boot Flow Documentation

## 1. Browser → Game Handoff

When you open the game in a browser, this is what happens:

1. The browser loads `index.html`
2. `index.html` declares three screens (start-screen, game-screen, game-over-screen) but only the start-screen is visible initially
3. At the very end of `index.html`, a single `<script type="module">` tag loads `js/main.js`
4. `js/main.js` is the true runtime entry point — it imports all the game systems
5. The browser executes `main.js`, which causes all imported modules to run their top-level code
6. Once all modules are loaded and initialized, control returns to the browser, which waits for user input

**Key insight**: The game does not start playing when the page loads. It loads and waits.

---

## 2. Initialization Phase (Before Play)

During the module loading phase (when `main.js` runs), these things happen:

### DOM Setup (Immediate)
- Three screens exist in the HTML, but only `#start-screen` is visible
- The `#game-screen` contains the game area and HUD (all initially hidden)
- All DOM elements are present but inactive

### Module Imports and Side Effects
`main.js` imports these systems, and each runs its top-level code:

- **game-state.js**: Initializes game state to `"start"`, sets up screen-switching logic, registers start/restart button listeners
- **player.js**: Initializes player position to (0, 0), attaches keyboard listener, sets up CSS positioning
- **obstacles.js**: Creates initialization guards (cones and persons are not created yet), registers a 50ms interval loop
- **collision.js**: Sets up collision detection functions (no state yet)
- **goal.js**: Sets up goal-checking logic (no state yet)
- **score.js**: Initializes score to 0, registers score display update
- **timer.js**: Initializes time to 30 seconds, registers a 1000ms interval loop (countdown only runs during "playing" state)
- **box.js**: Initializes box position, attaches collision logic, sets up CSS positioning
- **main.js**: Registers audio system and state monitoring (music only plays during "playing" state)

### What Is Armed But Dormant
- The 50ms obstacle loop is registered (will run every 50ms forever) but checks game state before doing anything
- The 1000ms timer loop is registered (will run every 1000ms forever) but checks game state before counting down
- Keyboard listeners are active but only meaningful during "playing" state
- All reset functions are defined but not called

### What Is NOT Initialized Yet
- **Cones** are not created (guarded by `conesInitialized` flag)
- **Persons** are not created (guarded by `personsInitialized` flag)
- **Rat** is not spawned
- Player cannot move (keyboard input exists but game state blocks meaningful action)
- Obstacles cannot move
- Timer cannot count down

---

## 3. The Waiting State (Start Screen Logic)

After all modules load, the game enters a waiting state:

- **Game state**: `"start"` (set in game-state.js)
- **Screen visible**: `#start-screen` (showing game title and "Start" button)
- **All other screens**: Hidden (`#game-screen` and `#game-over-screen`)

What can run during this state:
- Keyboard input is processed, but player cannot move (game state blocks movement)
- The 50ms obstacle loop runs, but checks `getGameState()` and returns early before creating cones or persons
- The 1000ms timer loop runs, but checks `getGameState()` and returns early before counting down
- Audio system monitors state but does not play music

What cannot run:
- Nothing moves
- Nothing spawns
- Time does not count down
- The game is inert, waiting for user action

**Key insight**: The game is loaded and armed, but frozen in state. This prevents accidental behavior and gives the player control over when play begins.

---

## 4. Transition to Active Play

When the player clicks the "Start" button:

1. The click listener in game-state.js fires
2. `showScreen("playing")` is called
3. This is where the reset cascade happens:
   - `resetPlayer()` — player position back to (0, 0)
   - `resetBox()` — box position back to (100, 100)
   - `resetScore()` — score back to 0
   - `resetGoal()` — goal state reset
   - `resetTimer()` — timer reset (prepares for countdown)
   - `spawnRat()` — rat appears on screen

4. Game state is changed to `"playing"`
5. `#game-screen` becomes visible, `#start-screen` hidden
6. The audio system detects the state change and starts playing background music (if not muted)

Now what happens next:

- The keyboard listener is already active, so arrow keys now cause movement (because `canMove()` checks succeed)
- The 50ms obstacle loop still runs, but now the state check passes, so it:
  - Creates cones if not already created
  - Creates persons if not already created
  - Updates person positions
  - Checks for person-to-player and person-to-box collisions
- The 1000ms timer loop still runs, and now the state check passes, so it:
  - Decrements `timeRemaining` by 1 each second
  - Updates the timer display
  - Triggers game over if time reaches 0

**Key insight**: The state transition is the moment everything comes alive. Resetting happens as a side effect of the transition, not as a separate step.

---

## 5. Dependency Ordering (Critical)

This table shows which systems must initialize before others:

| System | Must Wait For | Can Run Early | Reason |
|--------|---------------|---------------|--------|
| game-state | (none) | ✓ | Owns the state machine; everything depends on it |
| player | game-state | ✓ | Position is independent; movement checks state later |
| box | game-state | ✓ | Position is independent; collision checks state later |
| score | game-state | ✓ | Display-only; updates on state changes |
| timer | game-state | ✓ | Loop starts early; checks state in callback |
| obstacles | game-state, collision | ✓ | Loop starts early; checks state in callback |
| collision | (none) | ✓ | Provides utility functions; no state |
| goal | game-state, collision, box | ✓ | Checked by player, depends on box being initialized |
| main | all others | (last) | Imports all systems; registers central `canMove()` |
| rat | game-state, collision, obstacles | (on demand) | Spawned only during "playing" state |

**Safe invariants**:
- Any system can be imported early; none are unsafe to load
- No system should *run behavior* until game state is "playing" (they all check this)
- Cones and persons should not be created until "playing" (guarded by flags)
- `canMove()` in main.js is safe to call anytime (it checks game state implicitly through position checks)

---

## 6. Common Failure Modes (Educational)

Understanding these failure modes explains why the boot flow is structured this way:

### Failure Mode 1: Initializing Cones or Persons at Module Load
**What would break:**
- Cones would appear on the start screen (wrong place, wrong time)
- Persons would be moving on the start screen (confusing)
- When the player clicks start, the entities would already exist, causing duplication or undefined behavior

**Why it's prevented:**
- Initialization is guarded by `conesInitialized` and `personsInitialized` flags
- These flags only become `true` during the first run of the 50ms loop when `getGameState() === "playing"`
- On restart, the flags are reset to `false` so entities spawn fresh

### Failure Mode 2: Skipping the Reset Phase During State Transition
**What would break:**
- Player position would carry over from the previous game (could be anywhere)
- Box position would carry over (could be at the drop zone, instantly winning)
- Score would not reset (confusing display)
- Timer would not reset (countdown would start at 0 or a previous value)

**Why it's prevented:**
- `showScreen("playing")` explicitly calls all reset functions
- Reset functions are idempotent (safe to call multiple times)
- This happens on both first start and restart

### Failure Mode 3: Running Obstacle Logic Before Game State Exists
**What would break:**
- The 50ms interval would try to check `getGameState()` before game-state.js has defined it
- Reference errors would crash the game

**Why it's prevented:**
- game-state.js is imported first by main.js
- All interval loops are registered after game-state.js runs
- By the time the first interval callback fires, `getGameState()` is safely defined

### Failure Mode 4: Duplicating Boot Logic Across Multiple Files
**What would break:**
- Player reset might happen in player.js AND in game-state.js (state mutation twice)
- Cone initialization might happen in multiple places (creating duplicate cones)
- Systems could get out of sync

**Why it's prevented:**
- Boot logic lives in one place: game-state.js `showScreen("playing")`
- Systems are reset by calling exported reset functions from game-state.js
- Cone/person creation happens in only one place: the 50ms loop in obstacles.js
- No system reinitializes itself

---

## Summary: The Three Phases

```
PHASE 1: MODULE LOAD (Browser → Initialization)
  Browser loads index.html
    ↓
  index.html loads js/main.js
    ↓
  main.js imports all systems
    ↓
  Each module runs top-level code:
    - State is initialized to "start"
    - Timers are registered (dormant)
    - Listeners are registered (dormant)
    - Entities are positioned but invisible
    ↓
  RESULT: Game is armed and waiting

PHASE 2: WAITING STATE (User Sees Start Screen)
  Game state: "start"
  Visible: #start-screen
  All loops run but exit early after checking game state
  Player waits to click "Start"

PHASE 3: TRANSITION TO PLAYING (User Clicks Start)
  showScreen("playing") is called
    ↓
  Reset functions run (player, box, score, goal, timer, rat)
    ↓
  Game state changes to "playing"
    ↓
  #game-screen becomes visible
    ↓
  Interval loops now pass state check
    ↓
  RESULT: Game is live and playable
```

---

## Reading This Documentation

When you read the code files in order, you'll see this boot flow:

1. **index.html** — Defines the three screens and loads main.js
2. **game-state.js** — Sets initial state to "start" and defines state transitions
3. **main.js** — Imports all systems (which causes their initialization) and defines `canMove()`
4. **player.js, box.js, timer.js, obstacles.js, etc.** — Each registers its behavior (listeners, loops, etc.) at load time
5. **Back to runtime** — The browser waits for user input; loops run but check state before doing real work
6. **Start button click** — Triggers the state transition, which cascades resets and makes the game live

The key is understanding that initialization (registering code to run later) happens at load time, but execution of that code (actually moving things, counting down, etc.) only happens when state allows it.
