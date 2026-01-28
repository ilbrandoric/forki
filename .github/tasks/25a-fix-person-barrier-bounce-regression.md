# 25a – Fix Person–Barrier Bounce Regression

## Purpose

Fix a regression where persons disappear when colliding with barriers instead of bouncing back.

This behavior worked before Task 25 and must be restored.

This is a bugfix task, not a feature task.

---

## Symptoms

- Persons collide with cones/barriers
- Instead of bouncing, they continue moving
- They leave world bounds and disappear
- Game continues without them

---

## Scope (Strict)

This task is limited to:

- Restoring correct person bounce behavior
- Fixing update ordering if necessary
- Restoring direction reversal on barrier collision

This task must NOT:
- Change person movement rules
- Change person speed
- Change collision rules
- Change rat behavior
- Change architecture
- Add new systems
- Refactor loops beyond ordering
- Introduce new abstractions

---

## Files in Scope

- `js/obstacles.js` ONLY

No other files may be touched.

---

## Likely Cause (for guidance only)

The addition of rat update logic changed the ordering of:

- person movement
- person barrier collision
- direction reversal

Direction reversal must occur immediately when barrier collision is detected.

---

## Required Fix (Conceptual)

Ensure that for persons:

1. Movement is calculated
2. Barrier collision is checked
3. Direction is reversed immediately if collision detected
4. Position is corrected if needed
5. Person never moves past barrier

Ordering matters more than logic changes.

---

## Validation Rules

This task is done only when:

- Persons bounce correctly off cones
- Persons never pass through barriers
- Persons never disappear
- Persons reach world boundaries and bounce correctly
- Rat behavior unchanged
- Player behavior unchanged
- No new console errors

User must confirm behavior restored.

---

Copilot must stop and wait for user validation when finished.
