# Iteration 11 — Obstacle Failure Logic

## Goal

Define and implement **failure behavior when the player collides with an obstacle**, and ensure obstacle logic is **only active while the game is playing**.

At the end of this iteration:
- Player colliding with an obstacle triggers failure
- Failure triggers only once per round
- Obstacle logic is inactive before the game starts
- Obstacle logic is inactive after game over
- No instant failure on pressing Start

This iteration is about **failure consequences and lifecycle correctness**, not movement or detection.

---

## Files Allowed to Touch

- js/obstacles.js
- js/game-state.js (read-only import if needed)
- js/main.js (wiring only, if needed)

❌ No changes to js/player.js  
❌ No changes to js/box.js  
❌ No HTML changes  
❌ No CSS changes  
❌ No refactors  
❌ No new systems  

---

## Required DOM Elements

```txt
#player
.obstacle
#game-area
