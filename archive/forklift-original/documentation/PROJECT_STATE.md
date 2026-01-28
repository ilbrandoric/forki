# PROJECT_STATE.md

## Project Overview

Browser-based 2D forklift game built iteratively with strict scope control.

Key principles:
- One iteration = one new behavior
- No refactors unless explicitly scoped
- Lifecycle and game state are authoritative
- Entities (player, box) remain dumb
- World decides what is allowed (blocking, failure, win)
- Copilot is used as the coding engine with mandatory control-check gates

---

## Core Systems (Current State)

### Game State
- States: `"start"`, `"playing"`, `"gameOver"`
- Read-only accessor is used across systems
- Lifecycle gating is enforced consistently

### Player
- Controlled via keyboard
- Cannot overlap solid world geometry
- Cannot push box into blocked space

### Box
- Pushable cargo
- Delivery triggers win when box overlaps drop zone
- Box is blocked by world geometry (cones)

### Obstacles
- Moving obstacle (person) moves back and forth
- Player collision with moving obstacle triggers failure
- Obstacle logic is gated by game state (`"playing"` only)
- Failure triggers once per round

### Timer
- Runs only while game state is `"playing"`
- Stops immediately on win or loss
- Cannot override an ended game

---

## Completed Iterations

### Iteration 09 — Pushable Cargo
- Player can push box
- Atomic movement
- No pulling

### Iteration 10 — Cargo Delivery
- Only box overlapping drop zone triggers win
- Player is facilitator only

### Iteration 11 — Obstacle Failure Logic
- Player–obstacle collision triggers failure
- Failure triggers once
- Obstacle logic gated by game state

### Iteration 12 — Timer Lifecycle Logic
- Timer runs only while `"playing"`
- Stops on win or loss
- No duplicate intervals

---

## Current Iteration (IN PROGRESS)

### Iteration 13 — Static Obstacles (Construction Cones)

#### Goal
Introduce **static construction cones** that act as **immovable world geometry**.

#### Rules
- Cones are static, never move
- Cones are created dynamically (NOT in HTML)
- Cones are placed once per round
- Cones block:
  - Forklift movement
  - Box pushing
- Blocking is atomic
- Cones do NOT trigger win or loss
- Player.js and Box.js must NOT be modified
- Movement blocking is centralized
- Cone geometry/collision logic remains PRIVATE to obstacles.js
- Only a single boolean decision may be exported (e.g. is position blocked)

#### Files Allowed
- js/obstacles.js
- js/main.js (orchestration only, if needed)

---

## Current Problem (Last Known Issue)

Cones were appearing at `(0,0)` despite random placement logic.

### Root Cause
- Cone initialization was running at module load time
- At that moment:
  - Game was still on start screen
  - `#game-area` had width/height = 0
- Random placement based on zero-size container collapses to `(0,0)`

### Correct Fix (NOT YET APPLIED)
- Cone initialization must be gated by game state
- Cones should initialize **once**, when:
  - `getGameState() === "playing"`
  - and only the first time
- Best hook location:
  - Inside existing obstacle `setInterval`
  - Guarded by:
    - gameState check
    - `conesInitialized` boolean

No timeouts, no delays, no hardcoded positions.

---

## Architectural Rules (Critical)

- Entities do NOT ask the world questions
- World/orchestration decides movement validity
- No exporting of geometry or collision helpers
- No HTML or CSS changes unless explicitly scoped
- No refactors outside iteration scope
- Copilot must always stop at CONTROL CHECK before writing code

---

## Next Action When Resuming

1. Open a new chat window
2. Paste this file if needed
3. Continue Iteration 13 by:
   - Moving cone initialization behind a game-state `"playing"` check
   - Ensuring it runs once only
4. Verify cones appear scattered after pressing Start
5. Then finish blocking integration and lock Iteration 13
