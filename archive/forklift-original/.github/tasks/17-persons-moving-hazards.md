# Task — Iteration 17: Moving Persons (Hazards)

## Objective

Replace the existing `.obstacle` logic with **person objects** that act as moving hazards.

---

## Behavior Rules

- Persons are created dynamically in JS (not in HTML)
- At round start, spawn a random number of persons (2–5)
- Each person moves back and forth along one axis
- Before moving, check if next step is blocked by:
  - cones
  - walls
  - bounds
- If blocked → reverse direction (Pac-Man style)
- Persons never move through barriers
- No diagonal movement
- No randomness after spawn

---

## Failure Rules

- If forklift touches a person → game over
- If box touches a person → game over
- Failure triggers once per round

---

## Architectural Rules (NON-NEGOTIABLE)

- Persons are NOT entities
- Persons are world-controlled (obstacles.js)
- Player.js untouched
- Box.js untouched
- Person geometry & collision remain private
- No new systems
- No refactors
- No HTML or CSS changes

---

## Files Allowed

- js/obstacles.js
- js/main.js (orchestration only, if needed)

---

## Definition of Done

- 2–5 persons spawn each round
- Persons bounce off barriers
- Persons never pass through cones
- Touching person ends game
- No regressions
