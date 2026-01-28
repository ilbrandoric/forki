console.log("timer.js loaded")

import { triggerGameOver, getGameState } from "./game-state.js"

// ============================================================================
// SYSTEM: Timer Countdown
// Lifecycle: INIT → UPDATE (periodic interval) → CLEANUP (implicit)
// ============================================================================
//
// INIT PHASE (Module Load):
//   - timeRemaining initialized to 30 at module load
//   - Interval started immediately (setInterval callback registered)
//   - Interval callback runs every 1000ms
//
// UPDATE PHASE (Periodic Interval):
//   - Triggered by setInterval(1000ms) – once per second
//   - Checks game state: only decrements when state="playing"
//   - Calls triggerGameOver() if timeRemaining <= 0
//   - Updates DOM with current time
//   - Frequency: 1 per second
//
// RENDER PHASE (Periodic Interval):
//   - Updates timerNode.textContent with current time
//   - Frequency: 1 per second (same as UPDATE)
//
// CLEANUP PHASE:
//   - Implicit: interval stops via clearInterval() when state="gameOver"
//   - timeRemaining is NOT reset (stays at final value)
//   - On restart, interval still runs but returns early until "playing"
//   - Note: This is different from obstacles (which reset state actively)
//
// ============================================================================

// Get DOM element
const timerNode = document.querySelector("#timer")

// INIT: Initialize time (starts at module load, stays at end value until reload)
let timeRemaining = 30

// MAIN LOOP: Periodic countdown (runs continuously from module load)
// Entry point: setInterval(1000ms) – once per second
const timerIntervalId = setInterval(() => {
  const state = getGameState()

  // Only count down while playing
  if (state !== "playing") {
    // CLEANUP: Stop interval entirely once game has ended to avoid overwriting outcome
    if (state === "gameOver") {
      clearInterval(timerIntervalId)
    }
    return
  }

  // UPDATE & RENDER: Decrement time and update display
  timeRemaining -= 1
  timerNode.textContent = "Time: " + timeRemaining
  
  if (timeRemaining <= 0) {
    console.log("Time's up!")
    triggerGameOver("Time's up!")
    clearInterval(timerIntervalId)
  }
}, 1000)

// Note: Timer uses implicit cleanup (clearInterval) rather than state resets.
// This is consistent with timer being a system service, not an entity.
// Reset is called on game-state transition to "playing" to enable replay.

// CLEANUP & RE-INIT: Reset timer to initial value (30 seconds) for new round
// Idempotent: safe to call multiple times
// Note: Does NOT restart the interval (interval runs continuously from module load)
export function resetTimer() {
  timeRemaining = 30
  timerNode.textContent = "Time: " + timeRemaining
}
