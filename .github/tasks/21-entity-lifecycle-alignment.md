# 21 – Entity Lifecycle Alignment (Behavior-Neutral)

## Purpose

This task takes the **documented lifecycles from Task 20** and aligns how they are *used* across entities.

No new behavior is added.  
No gameplay changes are allowed.  
No visuals change.

This task is about making **existing lifecycle phases real and consistent**, not theoretical.

---

## Scope (Strict)

This task is limited to:

- Aligning when entities initialize
- Aligning how update logic is entered
- Aligning how render logic is triggered
- Aligning how entities become inactive or irrelevant
- Removing lifecycle ambiguity (not logic)

This task **must not**:
- Change movement rules
- Change collision rules
- Change timing
- Add features
- Add entities
- Add systems
- Rewrite working logic
- Modify visuals
- Introduce abstractions (base classes, factories, inheritance)

If behavior changes, the task fails.

---

## Why this is needed

After Task 20, lifecycles are **documented but not enforced consistently**.

Right now:
- Some entities initialize on module load
- Some initialize on game start
- Some rely on implicit guards
- Some update via intervals, others via key events
- Cleanup is inconsistent or implicit

This creates future risk when adding new entities (Rat) or changing layout.

This task makes lifecycle usage **predictable and consistent without changing results**.

---

## Conceptual Goal (Design Only)

All entities must follow the same *conceptual* lifecycle:

1. **INIT** – entity is created or activated  
2. **UPDATE** – entity logic runs (movement, checks)  
3. **RENDER** – entity is drawn  
4. **CLEANUP** – entity becomes inactive or irrelevant

This is a **consistency task**, not a refactor or rewrite.

---

## Files in Scope

Only existing files may be modified:

- `js/player.js`
- `js/box.js`
- `js/obstacles.js`
- `js/goal.js`
- `js/main.js`
- `js/collision.js`
- `js/game-state.js`
- `js/timer.js`
- `js/score.js`
- `main.js`

No new files may be created.

---

## Required Alignments (Conceptual, not Code Instructions)

Copilot must ensure that:

### 1. Initialization is explicit and consistent
- Entities that should exist only during `playing` do not initialize earlier
- Entities that persist across rounds behave consistently
- Guards against double initialization are aligned in intent

### 2. Update entry points are predictable
- Update logic is not split across unrelated triggers
- The update phase can be described consistently for all entities
- Update timing remains identical to before

### 3. Render responsibility is clear
- Render logic is not mixed with state changes
- Each entity has a clear render responsibility
- Render frequency remains unchanged

### 4. Cleanup / deactivation is explicit
- Entities that stop mattering do so consistently
- End-of-round and game-over cleanup is predictable
- No entity lingers implicitly

---

## Validation Rules

This task is done **only when**:

- Game behavior is identical to before
- No feature regressed
- No feature added
- Visuals are unchanged
- Timing is unchanged
- No new abstractions exist
- Code is easier to reason about
- Lifecycles are consistent across entities
- The user confirms nothing changed functionally

---

## Output Expectation

After this task, it should be possible to:

- Add a new entity (Rat) without guessing lifecycle rules
- Know exactly where init/update/render/cleanup belong
- Predict how entities enter and exit the game
- Reason about entity behavior without reading all files

This task is a **foundation alignment task**, not a feature task.

Copilot must stop and wait for user validation when finished.
