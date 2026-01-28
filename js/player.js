console.log("player.js loaded")

import { checkGoal } from "./goal.js"
import { getBoxElement, getBoxX, getBoxY, canPushBox, pushBox } from "./box.js"
import { checkCollision } from "./collision.js"
import { canMove } from "./main.js"

// Get DOM elements
const playerNode = document.querySelector("#player")
const gameAreaNode = document.querySelector("#game-area")

// Initialize position variables
let x = 0
let y = 0

// Movement speed (pixels per keypress)
const moveSpeed = 7

// Set initial position styling
playerNode.style.position = "absolute"
playerNode.style.left = x + "px"
playerNode.style.top = y + "px"

// Handle arrow key presses
document.addEventListener("keydown", (event) => {
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const playerRect = playerNode.getBoundingClientRect()

  
  
  // Calculate maximum allowed positions
  const maxX = gameAreaRect.width - playerRect.width
  const maxY = gameAreaRect.height - playerRect.height
  
  // Store current position
  const oldX = x
  const oldY = y
  
  // Determine direction for box pushing
  let direction = null
  
  // Update position based on arrow key pressed
  if (event.key === "ArrowUp") {
    y -= moveSpeed
    direction = "up"
  } else if (event.key === "ArrowDown") {
    y += moveSpeed
    direction = "down"
  } else if (event.key === "ArrowLeft") {
    x -= moveSpeed
    direction = "left"
  } else if (event.key === "ArrowRight") {
    x += moveSpeed
    direction = "right"
  } else {
    return // Not an arrow key, exit without updating
  }
  
  // Clamp position to stay within game area boundaries
  x = Math.max(0, Math.min(x, maxX))
  y = Math.max(0, Math.min(y, maxY))
  
  // Check collision with box before moving
 
  const boxElement = getBoxElement()
  const boxRect = boxElement.getBoundingClientRect()
  const boxX = getBoxX()
  const boxY = getBoxY()
  
  // Calculate if new player position would overlap with box
  const wouldCollide = (
    x < boxX + boxRect.width &&
    x + playerRect.width > boxX &&
    y < boxY + boxRect.height &&
    y + playerRect.height > boxY
  )
  
  if (wouldCollide) {
    // Collision detected - try to push the box
    if (canPushBox(direction)) {
      // Box can be pushed - push it and keep player movement
      pushBox(direction)
    } else {
      // Box cannot be pushed - revert player movement
      x = oldX
      y = oldY
    }
  }
  
  // Check if movement is blocked by world geometry
  if (!canMove('player', x, y, playerRect.width, playerRect.height)) {
    x = oldX
    y = oldY
  }
  
  // Update DOM with final position
  playerNode.style.left = x + "px"
  playerNode.style.top = y + "px"
  
  // Check if goal reached
  checkGoal()
})
