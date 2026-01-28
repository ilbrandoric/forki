console.log("score.js loaded")

// ============================================================================
// SYSTEM: Score Tracking
// Lifecycle: INIT → UPDATE (on goal reached) → RENDER (immediate DOM update)
// ============================================================================
//
// INIT PHASE (Module Load):
//   - currentScore initialized to 0 at module load
//   - Score persists across game rounds (accumulates)
//   - DOM element initialized with "Score: 0"
//
// UPDATE PHASE (On Goal Reached):
//   - Triggered by goal.js calling incrementScore()
//   - Only happens when box reaches drop zone
//   - Increments currentScore by 1
//   - Frequency: once per goal reached
//
// RENDER PHASE (Immediate):
//   - Updates scoreNode.textContent immediately after incrementScore() call
//   - Frequency: once per goal reached
//
// CLEANUP PHASE:
//   - No cleanup – score persists across game rounds by design
//   - Score accumulates and carries over to next game
//   - Only resets on page reload
//
// ============================================================================

// Get DOM element
const scoreNode = document.querySelector("#score")

// INIT: Initialize score (persists across rounds by design)
let currentScore = 0

// UPDATE: Increment score function (called by goal.js when box reaches drop zone)
export function incrementScore() {
  currentScore += 1
  scoreNode.textContent = "Score: " + currentScore
}

// Note: Score was accumulated state (persisted across rounds by design).
// Reset is now called on game-state transition to "playing" for clean round isolation.

// CLEANUP & RE-INIT: Reset score to 0 for new round
// Idempotent: safe to call multiple times
export function resetScore() {
  currentScore = 0
  scoreNode.textContent = "Score: " + currentScore
}
