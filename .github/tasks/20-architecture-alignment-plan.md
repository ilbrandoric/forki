# 20 – Architecture Alignment Plan (Preparation Task)

## Purpose

This task establishes a **controlled architectural alignment phase** for the game.  
It does **not add features**, **does not change gameplay**, and **does not introduce new systems**.

Its only goal is to make existing game entities conceptually consistent so future work (new obstacles, visuals, layout, Rat) can be added without hacks or duplication.

This is a **preparatory task** that unlocks all following tasks.

---

## Scope (Strict)

This task is limited to:

- Clarifying responsibilities of existing entities
- Aligning lifecycle expectations across entities
- Making flow consistent (init → update → render → cleanup)
- Reducing implicit coupling between files
- Making existing behavior easier to reason about

This task **must not**:
- Add new features
- Change game rules
- Change visuals
- Change timing
- Introduce new abstractions or systems
- Add new entity types
- Rewrite working logic

If behavior changes, the task is failed.

---

## Why this is needed

Right now, the game works, but:

- Entities follow different implicit rules
- Lifecycles are inconsistent
- Update/render logic is not conceptually aligned
- Collision participation varies per object
- Future additions (like the Rat) would require special cases

This task makes the current structure **explicit, predictable, and consistent**, so future tasks can be smaller, safer, and cleaner.

---

## Conceptual Goal (Design Only)

All game entities must be treated consistently as *objects with a shared conceptual lifecycle*:

- Player (forklift)
- Obstacles (cones, barriers)
- Persons (moving hazards)
- Box (cargo)
- Goal

This is a **design alignment**, not an implementation of inheritance or a new base class.

Copilot must work strictly within existing files and flows.

---

## Files in Scope

Copilot must review and align behavior across these existing files only:

- `main.js`
- `js/main.js`
- `js/player.js`
- `js/obstacles.js`
- `js/box.js`
- `js/goal.js`
- `js/collision.js`
- `js/game-state.js`
- `js/timer.js`
- `js/score.js`

No new files may be created in this task.

---

## What “alignment” means (non-code)

By the end of this task:

- Each entity has a clear moment of:
  - initialization
  - update
  - render
  - removal / inactivity
- Entities participate in collisions in a predictable way
- Movement rules are conceptually similar across entities
- No entity relies on hidden side effects from unrelated files
- The game loop can be described clearly in words
- Future entities can follow the same mental model

---

## Validation Rules

This task is done **only when**:

- The game runs with no errors
- Gameplay is identical to before
- No feature regressed
- No new feature was added
- The user confirms behavior is unchanged
- The structure is easier to reason about than before

If any visible change occurs, the task is invalid and must be corrected.

---

## Output Expectation

This task prepares the ground for the next tasks:

- Entity lifecycle alignment
- Positioning consistency
- Collision participation alignment
- Render/update flow clarity
- Future obstacle introduction (Rat)

Copilot must treat this task as **foundation work only**.