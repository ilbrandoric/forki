# Task — Iteration 19: Background Music + Speaker Toggle

## Objective

Add background music with a speaker toggle button.

---

## Behavior

- Music starts when game enters "playing"
- Music stops when game ends
- Music loops while playing
- One track only
- Default sound: ON
- User can toggle sound on/off via button
- Button icon reflects state (🔊 / 🔇)

---

## Files Allowed

- index.html (button only)
- js/main.js
- js/game-state.js (if needed)
- CSS (minimal)

---

## Architectural Rules

- No refactors
- No new systems
- Entities untouched
- Audio controlled by main.js
- Game state drives audio lifecycle
- Button only changes mute state

---

## Definition of Done

- Music plays on start
- Music stops on game over
- Toggle works at any time
- No regressions
