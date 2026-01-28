# Task — Iteration 14: Cone Blocking Integration

## Status
OPEN

---

## Problem

Construction cones exist visually but are transparent to:

- Forklift movement
- Box pushing

This means cones are not yet integrated into world blocking logic.

---

## Objective

Integrate cones as **static blocking world geometry** so that:

- Forklift cannot move through cones
- Box cannot be pushed through cones
- Blocking is atomic
- No entity is aware of cones

---

## Files Allowed

- js/obstacles.js
- js/main.js (orchestration only, if required)

---

## Files Forbidden

- js/player.js
- js/box.js
- js/goal.js
- js/timer.js
- HTML
- CSS

---

## Architectural Rules (NON-NEGOTIABLE)

- Cones are NOT entities
- Cones never move
- Cones are created dynamically in JavaScript
- Cone geometry and collision logic remain PRIVATE to obstacles.js
- Do NOT export cone positions or helpers
- obstacles.js may export ONLY a single boolean decision:
  - e.g. `isMoveBlockedByCones(nextX, nextY, width, height)`
- main.js may call that decision
- main.js must NOT calculate collisions itself
- Player.js and Box.js remain unaware of cones
- World/orchestration decides blocking

---

## Behavioral Rules

- Cones block forklift movement
- Cones block box pushing
- Blocking is atomic (movement is either fully allowed or fully denied)
- Cones do NOT trigger win or loss
- Cones are placed once per round
- No randomness after game start

---

## Required Implementation (Conceptual)

1. In `obstacles.js`
   - Keep cone geometry private
   - Add collision check against cones
   - Export a single boolean function: “is this move blocked by cones?”

2. In `main.js`
   - Before allowing player movement:
     - ask obstacles.js if the move is blocked
   - Before allowing box push:
     - ask obstacles.js if the move is blocked
   - If blocked → cancel movement

---

## Constraints

- No new intervals
- No timeouts
- No refactors
- No new systems
- No changes to entity logic
- No HTML or CSS changes

---

## Definition of Done

- Forklift cannot move through cones
- Box cannot be pushed through cones
- No regressions
- Architecture remains intact
- Iteration 14 can be locked

---

## Copilot Instructions

Copilot MUST:

1. Read this file completely
2. Produce an implementation plan
3. STOP and wait for approval
4. Only after approval, write code
