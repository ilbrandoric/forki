# Iteration 10 — Cargo Delivery Logic

## Goal

Change the win condition so that **only the box can complete the objective**.

At the end of this iteration:
- The box overlapping the X (drop zone) triggers a win
- The player overlapping the X does nothing
- The player acts only as a facilitator
- The round ends or “You won!” is shown on successful delivery

This iteration is about **delivery ownership**, not movement.

---

## Files Allowed to Touch

- js/goal.js
- js/box.js
- js/main.js (if needed for wiring only)

❌ No changes to js/player.js  
❌ No HTML changes  
❌ No CSS changes  
❌ No refactors  
❌ No new systems  

---

## Required DOM Elements

```txt
#box
#drop-zone
