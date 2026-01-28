console.log("game-state.js loaded")

import { resetPlayer } from "./player.js"
import { resetBox } from "./box.js"
import { resetScore } from "./score.js"
import { resetGoal } from "./goal.js"
import { resetTimer } from "./timer.js"
import { spawnRat, cleanupRat } from "./rat.js"

// ============================================================================
// SYSTEM: Game State Management
// Responsibilities: Screen visibility, game state transitions
// States: "start" (initial) → "playing" (active) → "gameOver" (ended)
// ============================================================================

// Get DOM elements
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")
const resultTextNode = document.querySelector("#result-text")

// INIT: Game state initialized to start screen
let gameState = "start"

// Read-only accessor for game state (used by obstacles.js, timer.js, main.js)
export function getGameState() {
  return gameState
}

// Show specified screen and hide others
function showScreen(screenName) {
  startScreenNode.classList.add("hidden")
  gameScreenNode.classList.add("hidden")
  gameOverScreenNode.classList.add("hidden")
  
  if (screenName === "start") {
    startScreenNode.classList.remove("hidden")
    // CLEANUP: Remove rat when returning to start screen
    cleanupRat()
  } else if (screenName === "playing") {
    gameScreenNode.classList.remove("hidden")
    // RESET: When transitioning to "playing", reset all entity state for clean round
    // This happens on both initial start and after restart
    // All reset functions are idempotent (safe to call multiple times)
    resetPlayer()
    resetBox()
    resetScore()
    resetGoal()
    resetTimer()
    // SPAWN: Spawn rat for this round (passive initialization triggered by state transition)
    spawnRat()
  } else if (screenName === "gameOver") {
    gameOverScreenNode.classList.remove("hidden")
    // CLEANUP: Remove rat when game ends
    cleanupRat()
  }
  
  gameState = screenName
}

// Trigger game over with a reason (called by goal.js, obstacles.js, timer.js)
export function triggerGameOver(reason) {
  resultTextNode.textContent = reason
  showScreen("gameOver")
}

// Start button listener (start screen → playing screen)
startBtnNode.addEventListener("click", () => {
  showScreen("playing")
})

// Restart button listener (game over screen → page reload)
restartBtnNode.addEventListener("click", () => {
  window.location.reload()
})
