# Iteration 02 — Player Movement

## Goal

Allow the player to move the forklift inside the game area using the arrow keys.

At the end of this iteration:
- The forklift moves
- It stays inside the game area
- Nothing else moves
- No win/lose logic exists

---

## Files Allowed to Touch

- js/player.js (new)
- js/main.js (only to import / connect player.js)

❌ No HTML changes  
❌ No CSS changes (unless strictly needed for positioning)

---

## Controls

- ArrowUp → move up
- ArrowDown → move down
- ArrowLeft → move left
- ArrowRight → move right

Movement must be:
- Simple
- Constant speed
- Grid-free (pixel movement)

---

## Constraints

- Player cannot leave #game-area
- Movement must be frame-based (keydown)
- No physics
- No acceleration
- No smooth scrolling

---

## Required DOM Elements

```txt
#player
#game-area
