# 22 – Round Reset & Replay Correctness (Behavioral, Explicit)

## Purpose

This task **intentionally introduces behavioral changes** to make game rounds replayable and state-correct.

After this task:
- Starting a game always begins from a clean state
- Restarting after win/lose always begins from a clean state
- No state leaks across rounds
- Replay behavior is predictable and correct

This task is explicitly allowed to change behavior.

---

## Scope (Explicit)

This task introduces **controlled resets** on:

- Game start
- Game restart (after win, lose, or timeout)

This task is limited to **state reset and cleanup only**.
No new features may be added.

---

## Why this is needed

After Tasks 20–21, lifecycles are clear and aligned, but **state persistence is intentional and documented**.

This task now changes that design:
- State persistence across rounds is removed
- Each round is isolated
- Game replay works correctly every time

This must be done explicitly, not implicitly, to avoid hidden bugs later.

---

## Behavioral Changes (Allowed)

On **game start** and **game restart**, the following MUST reset:

- Player position → initial spawn position
- Box position → initial spawn position
- Score → 0
- Timer → 30 seconds
- Goal reached flag → false
- Obstacles → reinitialized
- Persons → reinitialized

These changes are **required** and intentional.

---

## Conceptual Goal

All entities must now follow a full lifecycle:

1. INIT (on game start)
2. UPDATE (while playing)
3. RENDER (while visible)
4. CLEANUP (on game end)
5. RE-INIT (on restart)

After this task, no entity should rely on module-load initialization for round state.

---

## Files in Scope

Only existing files may be modified:

- `js/player.js`
- `js/box.js`
- `js/goal.js`
- `js/score.js`
- `js/timer.js`
- `js/obstacles.js`
- `js/game-state.js`
- `js/main.js`

No new files may be created.

---

## Required Changes (Conceptual, not Code Instructions)

### 1. Player reset
- Reset x/y to initial spawn on start/restart
- Must not reset mid-round

### 2. Box reset
- Reset x/y to initial spawn on start/restart
- Must not reset mid-round

### 3. Score reset
- Reset score to 0 on start/restart
- Must not reset mid-round

### 4. Timer reset
- Reset timeRemaining to 30 on start/restart
- Restart interval cleanly

### 5. Goal reset
- Reset goalReached flag on start/restart

### 6. Obstacles cleanup & re-init
- Cones and persons must fully cleanup on game end
- Fresh instances on new round
- No duplicate spawns

### 7. Centralized reset trigger
- Use existing game-state transitions as the trigger
- Do NOT add new systems
- Do NOT add new global coordinators

---

## Hard Rules

This task must NOT:
- Change movement logic
- Change collision logic
- Change visuals
- Change timing values
- Add new entities
- Introduce new abstractions
- Introduce new files

Only reset behavior is allowed.

---

## Validation Rules

This task is done **only when**:

### Start behavior
- Starting game always begins from clean state
- Player at spawn
- Box at spawn
- Score = 0
- Timer = 30
- Goal can be triggered

### Restart behavior
- Win → restart → clean state
- Lose → restart → clean state
- Timeout → restart → clean state

### Gameplay unchanged
- Movement identical
- Collisions identical
- Timing identical
- Visuals identical
- Audio identical

### Stability
- No console errors
- No duplicate obstacles/persons
- No race conditions
- No memory leaks

User must confirm replay correctness before next task.

---

## Output Expectation

After this task:
- Game replay is correct and predictable
- Round boundaries are clean
- State does not leak
- Future entities (Rat) can rely on clean lifecycle
- Architecture is ready for extension

Copilot must stop and wait for user validation when finished.
