console.log("score.js loaded")

// Get DOM element
const scoreNode = document.querySelector("#score")

// Initialize score
let currentScore = 0

// Increment score function
export function incrementScore() {
  currentScore += 1
  scoreNode.textContent = "Score: " + currentScore
}
