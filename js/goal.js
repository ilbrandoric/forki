console.log("goal.js loaded")

import { checkCollision } from "./collision.js"
import { incrementScore } from "./score.js"
import { triggerGameOver } from "./game-state.js"
import { getBoxElement } from "./box.js"

// Get DOM elements
const dropZoneNode = document.querySelector("#drop-zone")

// Track if goal has been reached
let goalReached = false

// Goal detection function
export function checkGoal() {
  const boxNode = getBoxElement()
  if (!goalReached && checkCollision(boxNode, dropZoneNode)) {
    console.log("Goal reached!")
    incrementScore()
    triggerGameOver("You won!")
    goalReached = true
  }
}
