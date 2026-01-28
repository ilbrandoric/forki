console.log("game-state.js loaded")

// Get DOM elements
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")
const resultTextNode = document.querySelector("#result-text")

// Game state
let gameState = "start"

// Read-only accessor for game state
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
  } else if (screenName === "playing") {
    gameScreenNode.classList.remove("hidden")
  } else if (screenName === "gameOver") {
    gameOverScreenNode.classList.remove("hidden")
  }
  
  gameState = screenName
}

// Trigger game over with a reason
export function triggerGameOver(reason) {
  resultTextNode.textContent = reason
  showScreen("gameOver")
}

// Start button listener
startBtnNode.addEventListener("click", () => {
  showScreen("playing")
})

// Restart button listener
restartBtnNode.addEventListener("click", () => {
  window.location.reload()
})
