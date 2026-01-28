console.log("box.js loaded")

import { canMove } from "./main.js"

// ============================================================================
// ENTITY: Box (Cargo)
// Lifecycle: INIT → UPDATE (when pushed by player) → RENDER (immediate style update) → CLEANUP (none)
// Collision Participation: Goal collision (external check in goal.js), Persons collision (external check in obstacles.js)
// ============================================================================
//
// COLLISION OWNERSHIP (Box):
//   - Cone Collision (line ~85-92): Checked via main.js canMove()
//     * Purpose: Prevent pushing box into obstacles
//     * Type: Movement-blocking (movement-deciding)
//     * Ownership: Centralized in main.js, called from canPushBox()
//     * Note: Box never directly checks this; delegation via main.js
//   - Goal Collision: NOT checked here
//     * Purpose: Win condition (box reaches drop zone)
//     * Type: Terminal
//     * Ownership: External – goal.js owns this check
//   - Person Collision: NOT checked here
//     * Purpose: Hazard detection (losing condition if box touches person)
//     * Type: Terminal
//     * Ownership: External – obstacles.js (persons) own this check
//
// COLLISION FLOW (Box Only Participates In):
//   1. canPushBox() checks if movement is allowed (cones blocking via main.js)
//   2. If allowed, pushBox() applies movement
//   3. Goal.js checks if box reached drop zone (external)
//   4. Obstacles.js checks if persons hit box (external)
//
// NOTE: Box is PASSIVE – it only responds to pushes from player.js
// All collision checks except movement-deciding are done externally
//
// ============================================================================

// Get DOM elements
const boxNode = document.querySelector("#box")
const gameAreaNode = document.querySelector("#game-area")

// INIT: Position state initialized at module load and persists across rounds
let x = 100
let y = 100

// Movement speed (must match player speed)
const moveSpeed = 7

// RENDER: Set initial position styling (init render)
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

// UPDATE: Check if box can be pushed in a direction (collision check with world)
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
  
  // Check if movement is blocked by world geometry (cones)
  if (!withinBounds) {
    return false
  }
  
  return canMove('box', newX, newY, boxRect.width, boxRect.height)
}

// UPDATE & RENDER: Push box in a direction (assumes canPushBox was checked)
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
  
  // RENDER: Update DOM with new position
  boxNode.style.left = x + "px"
  boxNode.style.top = y + "px"
}

// Note: Box lifecycle is passive (triggered by player). No autonomous updates.
// Reset is called on game-state transition to "playing" to enable replay.

// CLEANUP & RE-INIT: Reset box to initial spawn position
// Idempotent: safe to call multiple times
export function resetBox() {
  x = 100
  y = 100
  boxNode.style.left = x + "px"
  boxNode.style.top = y + "px"
}
