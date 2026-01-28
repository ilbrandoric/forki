console.log("goal.js loaded")

import { checkCollision } from "./collision.js"
import { incrementScore } from "./score.js"
import { triggerGameOver } from "./game-state.js"
import { getBoxElement } from "./box.js"

// ============================================================================
// ENTITY: Goal (Drop Zone)
// Lifecycle: INIT → UPDATE (checking win condition) → RENDER (none) → CLEANUP (reset flag)
// Collision Participation: Box collision ownership (goal.js owns win-condition check)
// ============================================================================
//
// COLLISION OWNERSHIP (Goal):
//   - Box Collision: OWNED BY GOAL.JS (line 44)
//     * Purpose: Win condition (box successfully dropped in goal)
//     * Type: Terminal
//     * Ownership: goal.js actively calls checkCollision(box, dropZone)
//     * Triggered by: Called from player.js after every movement decision
//     * Flow: checkCollision() → incrementScore() → triggerGameOver("win")
//   - No other collisions affect goal
//
// COLLISION CHECK PATTERN:
//   Goal doesn't check itself – it's checked BY player.js (external invocation)
//   This is a "pull" pattern: "Have you reached me?" not "I'll detect you"
//   Multiple checks per frame are safe (idempotent goal state)
//
// NOTE: Goal is STATIC – position never changes
// Only goalReached flag toggles (set on win, reset per round)
//
// ============================================================================
//   - New game starts with goalReached=true (cannot win second time without reload)
//
// ============================================================================

// Get DOM elements
const dropZoneNode = document.querySelector("#drop-zone")

// INIT: Track if goal has been reached (prevents repeated triggers, persists across rounds)
let goalReached = false

// COLLISION: Goal detection function (called by player.js on each movement)
export function checkGoal() {
  const boxNode = getBoxElement()
  if (!goalReached && checkCollision(boxNode, dropZoneNode)) {
    console.log("Goal reached!")
    incrementScore()
    triggerGameOver("You won!")
    goalReached = true
  }
}

// Note: Goal is passive. It responds only to external checks from player.js.
// Reset is called on game-state transition to "playing" to enable replay.

// CLEANUP & RE-INIT: Reset goal flag to allow re-triggering in new round
// Idempotent: safe to call multiple times
export function resetGoal() {
  goalReached = false
}
