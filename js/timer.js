console.log("timer.js loaded")

import { triggerGameOver, getGameState } from "./game-state.js"

// Get DOM element
const timerNode = document.querySelector("#timer")

// Initialize time
let timeRemaining = 30

// Single interval to avoid duplicates
const timerIntervalId = setInterval(() => {
  const state = getGameState()

  // Only count down while playing
  if (state !== "playing") {
    // Stop entirely once game has ended to avoid overwriting outcome
    if (state === "gameOver") {
      clearInterval(timerIntervalId)
    }
    return
  }

  timeRemaining -= 1
  timerNode.textContent = "Time: " + timeRemaining
  
  if (timeRemaining <= 0) {
    console.log("Time's up!")
    triggerGameOver("Time's up!")
    clearInterval(timerIntervalId)
  }
}, 1000)
