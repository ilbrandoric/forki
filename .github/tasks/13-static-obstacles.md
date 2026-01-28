# Iteration 13 — Static Obstacles (Construction Cones)

## Goal

Introduce **static construction cones** that act as **immovable world blockers**.

At the end of this iteration:
- Multiple construction cones exist in the game area
- Cones are placed once at game start
- Cones block forklift movement
- Cones block box movement (boxes cannot be pushed into cones)
- Cones never move and cannot be interacted with

This iteration is about **static world geometry**, not entity behavior.

---

## Files Allowed to Touch

- js/obstacles.js
- js/main.js (orchestration only)

❌ No changes to js/player.js  
❌ No changes to js/box.js  
❌ No changes to js/goal.js  
❌ No changes to js/timer.js  
❌ No HTML changes  
❌ No CSS changes  
❌ No refactors  
❌ No new systems  

---

## Required DOM Elements

```txt
#player
#box
#game-area
