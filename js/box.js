console.log("box.js loaded")

import { canMove } from "./main.js"

// Get DOM elements
const boxNode = document.querySelector("#box")
const gameAreaNode = document.querySelector("#game-area")

// Initialize position variables
let x = 100
let y = 100

// Movement speed (must match player speed)
const moveSpeed = 7

// Set initial position styling
boxNode.style.position = "absolute"
boxNode.style.left = x + "px"
boxNode.style.top = y + "px"

// Export box element for collision detection
export function getBoxElement() {
  return boxNode
}

// Export position getters
export function getBoxX() {
  return x
}

export function getBoxY() {
  return y
}

// Check if box can be pushed in a direction
export function canPushBox(direction) {
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const boxRect = boxNode.getBoundingClientRect()
  
  // Calculate maximum allowed positions
  const maxX = gameAreaRect.width - boxRect.width
  const maxY = gameAreaRect.height - boxRect.height
  
  // Calculate new position based on direction
  let newX = x
  let newY = y
  
  if (direction === "up") {
    newY -= moveSpeed
  } else if (direction === "down") {
    newY += moveSpeed
  } else if (direction === "left") {
    newX -= moveSpeed
  } else if (direction === "right") {
    newX += moveSpeed
  }
  
  // Check if new position is within boundaries
  const withinBounds = newX >= 0 && newX <= maxX && newY >= 0 && newY <= maxY
  
  // Check if movement is blocked by world geometry
  if (!withinBounds) {
    return false
  }
  
  return canMove('box', newX, newY, boxRect.width, boxRect.height)
}

// Push box in a direction (assumes canPushBox was checked)
export function pushBox(direction) {
  if (direction === "up") {
    y -= moveSpeed
  } else if (direction === "down") {
    y += moveSpeed
  } else if (direction === "left") {
    x -= moveSpeed
  } else if (direction === "right") {
    x += moveSpeed
  }
  
  // Update DOM with new position
  boxNode.style.left = x + "px"
  boxNode.style.top = y + "px"
}
