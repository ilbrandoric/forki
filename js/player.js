console.log("player.js loaded")

import { checkGoal } from "./goal.js"
import { getBoxElement, getBoxX, getBoxY, canPushBox, pushBox } from "./box.js"
import { checkCollision } from "./collision.js"
import { canMove } from "./main.js"

// ============================================================================
// ENTITY: Player (Forklift)
// Lifecycle: INIT → UPDATE (on keypress) → RENDER (immediate style update) → CLEANUP (none)
// Collision Participation: Box collision (push logic), Goal collision (external check in goal.js)
// ============================================================================
//
// COLLISION OWNERSHIP (Player):
//   - Box Collision (line ~90): Checked directly in keydown handler
//     * Purpose: Determine if player can push box or should stop
//     * Type: Movement-affecting (not terminal)
//     * Ownership: Player checks and handles this locally
//   - Cone Collision (line ~109): Checked via main.js canMove()
//     * Purpose: Block movement against obstacles
//     * Type: Movement-blocking (movement-deciding)
//     * Ownership: Centralized in main.js, called from player
//   - Goal Collision: NOT checked here
//     * Purpose: Win condition (box reaches drop zone)
//     * Type: Terminal
//     * Ownership: External – goal.js owns this check
//     * Called via: checkGoal() at line ~125
//   - Person Collision: NOT checked here
//     * Purpose: Hazard detection (losing condition)
//     * Type: Terminal
//     * Ownership: External – obstacles.js (persons) own this check
//
// COLLISION FLOW (Order of Checks):
//   1. Calculate new position
//   2. Check box collision (can we push it?)
//   3. Check cone collision (are we blocked?)
//   4. Apply movement (update DOM)
//   5. Check goal (external – goal.js does this)
//
// ============================================================================

// Get DOM elements
const playerNode = document.querySelector("#player")
const gameAreaNode = document.querySelector("#game-area")

// INIT: Position state initialized at module load and persists across rounds
let x = 0
let y = 0

// Movement speed (pixels per keypress)
const moveSpeed = 7

// RENDER: Set initial position styling (init render)
playerNode.style.position = "absolute"
playerNode.style.left = x + "px"
playerNode.style.top = y + "px"

// UPDATE & RENDER: Handle arrow key input (event-driven update)
document.addEventListener("keydown", (event) => {
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const playerRect = playerNode.getBoundingClientRect()

  
  
  // Calculate maximum allowed positions
  const maxX = gameAreaRect.width - playerRect.width
  const maxY = gameAreaRect.height - playerRect.height
  
  // Store current position (for rollback on collision)
  const oldX = x
  const oldY = y
  
  // Determine direction for box pushing
  let direction = null
  
  // UPDATE: Calculate new position based on arrow key
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
  
  // COLLISION: Check box collision (box pushing logic)
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
  
  // COLLISION: Check if movement is blocked by world geometry (cones)
  if (!canMove('player', x, y, playerRect.width, playerRect.height)) {
    x = oldX
    y = oldY
  }
  
  // RENDER: Update DOM with final position
  playerNode.style.left = x + "px"
  playerNode.style.top = y + "px"
  
  // COLLISION: Check goal (goal detection external to this entity)
  checkGoal()
})

// Note: Player lifecycle is event-driven. No periodic updates.
// Reset is called on game-state transition to "playing" to enable replay.

// CLEANUP & RE-INIT: Reset player to initial spawn position
// Idempotent: safe to call multiple times
export function resetPlayer() {
  x = 0
  y = 0
  playerNode.style.left = x + "px"
  playerNode.style.top = y + "px"
}
