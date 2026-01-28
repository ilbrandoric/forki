# Iteration 01 — Project Setup & Static Layout

## Goal

Create the **full HTML structure** of the game using the approved DOM inventory.
At the end of this iteration:
- All screens exist
- Nothing moves
- No game logic exists
- Only structure + visibility control

This iteration is about stability, not behavior.

---

## Files Allowed to Touch

- index.html
- style.css

❌ No JS in this iteration

---

## Screens Required

### 1. Start Screen
Contains:
- Game title
- Start button

### 2. Game Screen
Contains:
- HUD (timer, score)
- Game area
- Player
- Box
- Obstacle
- Drop zone

### 3. Game Over Screen
Contains:
- Result text
- Restart button

---

## DOM Contract (MUST MATCH EXACTLY)

```txt
#app
 ├── #start-screen
 │     ├── h1#game-title
 │     └── button#start-btn
 │
 ├── #game-screen (hidden by default)
 │     ├── #hud
 │     │     ├── span#timer
 │     │     └── span#score
 │     │
 │     └── #game-area
 │           ├── #player
 │           ├── #box
 │           ├── .obstacle
 │           └── #drop-zone
 │
 └── #game-over-screen (hidden by default)
       ├── p#result-text
       └── button#restart-btn
