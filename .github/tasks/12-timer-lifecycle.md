# Iteration 12 — Timer Lifecycle Logic

## Goal

Fix the timer so it respects the **game lifecycle**.

At the end of this iteration:
- The timer runs **only while the game is playing**
- The timer stops immediately when the player **wins or loses**
- The timer must never overwrite a win or loss after the game ends

This iteration is about **timer lifecycle correctness**, not UI or scoring.

---

## Files Allowed to Touch

- js/timer.js
- js/game-state.js (read-only access if needed)
- js/main.js (wiring only, if needed)

❌ No changes to js/player.js  
❌ No changes to js/box.js  
❌ No changes to js/obstacles.js  
❌ No HTML changes  
❌ No CSS changes  
❌ No refactors  
❌ No new systems  

---

## Required DOM Elements

```txt
#timer
