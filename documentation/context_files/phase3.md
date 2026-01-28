# CONTEXT HANDOFF — Forki Forklift Game
## Phase 3 Ready

## Project Overview
I am rebuilding the Forki forklift game from scratch as a learning exercise.

This is a **guided reconstruction**, not a tutorial.
ChatGPT acts as a **mentor/engineer**, explaining architecture and decisions step by step.
Code is written by me; ChatGPT guides structure and logic.

The original game already exists and is used only as a conceptual reference.

---

## Phase 2 — COMPLETED (Engine & Core Systems)

Phase 2 goal was to build a **correct, stable game engine spine**.
This phase is complete and working.

### What is implemented and working

### 1. Game Loop
- Browser-driven loop using `requestAnimationFrame`
- Proper first-frame guard
- Continuous per-frame rendering
- No duplicate render functions

### 2. Time System
- Delta time (`deltaTime`) calculated from browser timestamps
- Movement is time-based, not frame-based
- Velocity expressed in pixels per second

### 3. Game State System
- Explicit game states: BOOT, PLAYING, PAUSED
- Logic gated by state
- Rendering runs independently

### 4. Input System
- Keyboard input stored as **intent**
- Input never modifies position directly
- Input → velocity → position pipeline

### 5. Player Motion
- Velocity (`vx`, `vy`) reset every frame
- Velocity rebuilt from current input
- Position updated using `velocity × deltaTime`
- No drift, no accumulation bugs

### 6. World Boundaries
- World has fixed size (800 × 500)
- Player position clamped using `clamp(value, min, max)`
- Player cannot leave world

### 7. Collision System (Phase 2 Final)
- Axis-aligned bounding box (AABB) collision
- `isColliding(a, b)` implemented and understood
- Static obstacle defined in world
- Collision blocking via:
  - Save previous position
  - Apply movement
  - Revert position if collision detected
- Obstacle is solid and visible
- Player cannot pass through obstacle

### 8. Rendering
- Single render function
- Render called every frame
- Player and obstacle rendered from state data
- DOM is treated as a visual reflection of state

---

## Architectural Rules (Important)
These rules are intentionally enforced and must be preserved:

- Input never changes position directly
- Velocity never persists without input (unless explicitly designed later)
- Position changes only in one place
- Clamp always runs after movement and collisions
- Render never mutates state
- Collision detection is rectangle-based (no rotation)

---

## Mental Models Locked In
- Browser coordinate system:
  - Origin at top-left (0,0)
  - +X right, +Y down
- Collision understood visually using rectangle overlap
- Delta time understood as “real time between frames”
- Game loop understood as browser-driven, not manual

---

## Phase 3 — READY TO START

Phase 3 will focus on **gameplay mechanics**, not engine plumbing.

Candidate Phase 3 topics:
- Pushable crates (Forki’s core mechanic)
- Collision resolution improvements (axis separation, sliding)
- Acceleration / friction (forklift weight)
- Game states (pause, reset, win/lose)
- System refactoring (entities, components)

Instruction for next chat:
➡️ Continue with **Phase 3** using the same slow, step-by-step, mentor-style guidance.
➡️ Keep explanations concise and incremental.
➡️ Do not rewrite existing systems unless explicitly requested.
