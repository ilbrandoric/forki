# 23 – Collision Participation Alignment (Behavior-Neutral)

## Purpose

This task aligns how all entities participate in collisions so collision rules are
**consistent, predictable, and extensible**.

No gameplay behavior may change.
No collision outcomes may change.
This task is structural alignment only.

---

## Scope (Strict)

This task is limited to:

- Aligning how entities register for collision participation
- Aligning where collision checks are performed
- Aligning who owns collision responsibility
- Removing implicit or duplicated collision logic
- Making collision flow explicit and readable

This task **must not**:
- Change collision rules
- Change collision outcomes
- Change hitboxes or dimensions
- Change movement behavior
- Add new entities
- Add new collision types
- Introduce new systems
- Introduce abstractions or base classes

If collision behavior changes, the task fails.

---

## Why this is needed

Right now, collision logic is correct but **distributed unevenly**:

- Some collisions are checked in `player.js`
- Some are checked in `box.js`
- Some are checked in `obstacles.js`
- Some are checked externally (goal, persons)
- Some collisions are movement-blocking, others are terminal

This makes adding new entities (Rat) risky because
it’s unclear where collision rules should live.

This task makes collision participation **explicit and uniform** without changing results.

---

## Conceptual Goal (Design Only)

All entities must follow the same collision participation model:

- Each entity declares what it collides with
- Collision checks happen in predictable locations
- Collision consequences remain unchanged
- Movement-blocking vs terminal collisions are clearly separated
- The collision flow can be explained without reading all files

This is **alignment**, not a rewrite.

---

## Files in Scope

Only existing files may be modified:

- `js/player.js`
- `js/box.js`
- `js/obstacles.js`
- `js/goal.js`
- `js/collision.js`
- `js/main.js`

No new files may be created.

---

## Required Alignments (Conceptual, not Code Instructions)

### 1. Collision ownership must be explicit
- For each entity, it must be clear where its collision checks live
- No entity should rely on “hidden” external checks without documentation

### 2. Collision flow must be consistent
- Movement collisions must be checked before movement is applied
- Terminal collisions (game over / win) must be checked after movement
- This ordering must be explicit and consistent

### 3. Collision participation must be symmetric
- If A checks collision with B, this must be documen# 23 – Collision Participation Alignment (Behavior-Neutral)

## Purpose

This task aligns how all entities participate in collisions so collision rules are
**consistent, predictable, and extensible**.

No gameplay behavior may change.
No collision outcomes may change.
This task is structural alignment only.

---

## Scope (Strict)

This task is limited to:

- Aligning how entities register for collision participation
- Aligning where collision checks are performed
- Aligning who owns collision responsibility
- Removing implicit or duplicated collision logic
- Making collision flow explicit and readable

This task **must not**:
- Change collision rules
- Change collision outcomes
- Change hitboxes or dimensions
- Change movement behavior
- Add new entities
- Add new collision types
- Introduce new systems
- Introduce abstractions or base classes

If collision behavior changes, the task fails.

---

## Why this is needed

Right now, collision logic is correct but **distributed unevenly**:

- Some collisions are checked in `player.js`
- Some are checked in `box.js`
- Some are checked in `obstacles.js`
- Some are checked externally (goal, persons)
- Some collisions are movement-blocking, others are terminal

This makes adding new entities (Rat) risky because
it’s unclear where collision rules should live.

This task makes collision participation **explicit and uniform** without changing results.

---

## Conceptual Goal (Design Only)

All entities must follow the same collision participation model:

- Each entity declares what it collides with
- Collision checks happen in predictable locations
- Collision consequences remain unchanged
- Movement-blocking vs terminal collisions are clearly separated
- The collision flow can be explained without reading all files

This is **alignment**, not a rewrite.

---

## Files in Scope

Only existing files may be modified:

- `js/player.js`
- `js/box.js`
- `js/obstacles.js`
- `js/goal.js`
- `js/collision.js`
- `js/main.js`

No new files may be created.

---

## Required Alignments (Conceptual, not Code Instructions)

### 1. Collision ownership must be explicit
- For each entity, it must be clear where its collision checks live
- No entity should rely on “hidden” external checks without documentation

### 2. Collision flow must be consistent
- Movement collisions must be checked before movement is applied
- Terminal collisions (game over / win) must be checked after movement
- This ordering must be explicit and consistent

### 3. Collision participation must be symmetric
- If A checks collision with B, this must be documented as symmetric
- Avoid one-sided collision logic without explanation

### 4. Blocking vs terminal collisions must be explicit
- Blocking collisions (cones, walls) must be clearly separated from terminal ones
- The code must reflect this distinction structurally (not behaviorally)

### 5. Central collision utility usage must be consistent
- `collision.js` must be used consistently where appropriate
- No ad-hoc AABB logic should be duplicated
- Existing helpers must be reused, not replaced

---

## Validation Rules

This task is done **only when**:

- All collisions behave exactly as before
- No entity collides differently
- No collision outcome changes
- No new collision rules exist
- No regressions in movement or game over logic
- Code is easier to reason about
- Collision flow is explainable step-by-step

User must confirm behavior unchanged.

---

## Output Expectation

After this task:
- Adding a new collision entity (Rat) is obvious
- Collision rules are readable
- Collision flow is predictable
- Copilot has fewer places to guess
- Bugs become harder to introduce accidentally

Copilot must stop and wait for user validation when finished.
ted as symmetric
- Avoid one-sided collision logic without explanation

### 4. Blocking vs terminal collisions must be explicit
- Blocking collisions (cones, walls) must be clearly separated from terminal ones
- The code must reflect this distinction structurally (not behaviorally)

### 5. Central collision utility usage must be consistent
- `collision.js` must be used consistently where appropriate
- No ad-hoc AABB logic should be duplicated
- Existing helpers must be reused, not replaced

---

## Validation Rules

This task is done **only when**:

- All collisions behave exactly as before
- No entity collides differently
- No collision outcome changes
- No new collision rules exist
- No regressions in movement or game over logic
- Code is easier to reason about
- Collision flow is explainable step-by-step

User must confirm behavior unchanged.

---

## Output Expectation

After this task:
- Adding a new collision entity (Rat) is obvious
- Collision rules are readable
- Collision flow is predictable
- Copilot has fewer places to guess
- Bugs become harder to introduce accidentally

Copilot must stop and wait for user validation when finished.
