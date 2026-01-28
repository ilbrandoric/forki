console.log("rat.js loaded")

// ============================================================================
// ENTITY: Rat (Temporary Moving Hazard)
// Lifecycle: INIT (spawn on game start) → UPDATE (movement + lifetime countdown) → RENDER (position updates) → CLEANUP (on expiration or game end)
// Collision Participation: Terminal collision with player only (game over on contact)
// ============================================================================
//
// INIT PHASE (Game Start via game-state.js):
//   - Spawned by game-state.js calling spawnRat() on state transition to "playing"
//   - Rat is passive: no side-effect imports, no module-load init
//   - Position: random within game bounds, avoiding player/box/cones/goal
//   - Direction: random axis (horizontal OR vertical) and direction (-1 or 1)
//   - State: created with birthTime timestamp for lifetime tracking
//
// UPDATE PHASE (Periodic Interval via obstacles.js):
//   - Called every 50ms in obstacles.js main loop via updateRat()
//   - Movement: autonomous axis-based movement (mirrors persons pattern)
//   - Boundary handling: reverses direction on collision with world edges
//   - Lifetime countdown: current time vs. birthTime + lifetime
//   - Only runs when rat exists (ratElement !== null)
//   - Only runs when game state = "playing"
//
// RENDER PHASE (Per-Tick Position Updates):
//   - Position updated every 50ms tick during UPDATE phase
//   - DOM element position (style.left, style.top) updated after movement calculation
//   - Cleanup removes DOM element and clears all state
//
// CLEANUP PHASE (On Expiration or Game End):
//   - Triggered when: lifetime exceeded OR game-state transition to "gameOver"/"start"
//   - Called by: obstacles.js (lifetime) OR game-state.js (game end)
//   - Idempotent: safe to call multiple times (checks if rat exists)
//   - Must remove DOM element and clear all state
//
// COLLISION OWNERSHIP (Rat):
//   - Player Collision: OWNED BY OBSTACLES.JS (checked in main interval loop)
//     * Purpose: Game over if player touches rat (hazard hit)
//     * Type: Terminal
//     * Ownership: obstacles.js autonomously checks (similar to persons)
//     * Checked AFTER rat position is confirmed alive
//   - No other collisions: Rat does NOT interact with box, cones, goal, or persons
//
// ============================================================================

// Get DOM element reference (game-area)
const gameAreaNode = document.querySelector("#game-area")

// RAT STATE (Persistent across calls, reset only on cleanup)
let ratElement = null
let ratX = 0
let ratY = 0
let ratBirthTime = 0
let ratAxis = 0 // 0 = horizontal, 1 = vertical
let ratDirection = 1 // -1 or 1
const RAT_LIFETIME_MS = 5000 // 5 seconds
const RAT_SIZE = 32 // Approximate size for collision avoidance
const RAT_SPEED = 2 // Pixels per tick (slower than persons' 4px)

// GETTERS (Read-only access for other modules)
export function getRatElement() {
  return ratElement
}

export function getRatX() {
  return ratX
}

export function getRatY() {
  return ratY
}

export function isRatAlive() {
  return ratElement !== null
}

// ============================================================================
// SPAWN RAT (Called by game-state.js on state→"playing" transition)
// ============================================================================
export function spawnRat() {
  // CLEANUP: Remove old rat if it exists (idempotent safety)
  cleanupRat()
  
  // Get world bounds
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const worldWidth = gameAreaRect.width
  const worldHeight = gameAreaRect.height
  
  // Define unsafe zones (player start, box start, cones, goal)
  const playerNode = document.querySelector("#player")
  const boxNode = document.querySelector("#box")
  const dropZoneNode = document.querySelector("#drop-zone")
  
  const unsafeZones = [
    { x: 0, y: 0, width: 40, height: 40 }, // Player start
    { x: 100, y: 100, width: 40, height: 40 }, // Box start
    { x: parseFloat(dropZoneNode.style.right) - 100, y: worldHeight - 60, width: 100, height: 60 } // Approximate drop zone
  ]
  
  // Helper: Check if position is safe from all obstacles
  function isSafePosition(x, y) {
    // Check world bounds
    if (x < 0 || x + RAT_SIZE > worldWidth || y < 0 || y + RAT_SIZE > worldHeight) {
      return false
    }
    
    // Check unsafe zones (player, box, goal)
    for (const zone of unsafeZones) {
      if (!(x + RAT_SIZE < zone.x || x > zone.x + zone.width || y + RAT_SIZE < zone.y || y > zone.y + zone.height)) {
        return false
      }
    }
    
    // Check existing cones (query DOM for all cones)
    const cones = document.querySelectorAll("div[style*='🚧']")
    for (const cone of cones) {
      const coneStyle = cone.getAttribute("style")
      const coneX = parseFloat(coneStyle.match(/left: ([0-9.]+)px/)?.[1] || 0)
      const coneY = parseFloat(coneStyle.match(/top: ([0-9.]+)px/)?.[1] || 0)
      const coneSize = 32
      if (!(x + RAT_SIZE < coneX || x > coneX + coneSize || y + RAT_SIZE < coneY || y > coneY + coneSize)) {
        return false
      }
    }
    
    return true
  }
  
  // Find safe spawn position (with retry limit)
  let x, y
  let attempts = 0
  const maxAttempts = 50
  do {
    x = Math.random() * (worldWidth - RAT_SIZE)
    y = Math.random() * (worldHeight - RAT_SIZE)
    attempts++
  } while (!isSafePosition(x, y) && attempts < maxAttempts)
  
  // If no safe position found after max attempts, spawn at fallback (top-left corner)
  if (attempts >= maxAttempts) {
    x = 50
    y = 50
  }
  
  // Create rat DOM element
  ratElement = document.createElement("div")
  ratElement.textContent = "🐀"
  ratElement.style.position = "absolute"
  ratElement.style.fontSize = "32px"
  ratElement.style.left = x + "px"
  ratElement.style.top = y + "px"
  gameAreaNode.appendChild(ratElement)
  
  // Store state
  ratX = x
  ratY = y
  ratBirthTime = Date.now()
  
  // Initialize movement direction (random axis and direction)
  ratAxis = Math.floor(Math.random() * 2) // 0 = horizontal, 1 = vertical
  ratDirection = Math.random() < 0.5 ? -1 : 1 // Random direction
}

// ============================================================================
// CLEANUP RAT (Called by game-state.js on state→"gameOver"/"start" OR by obstacles.js on lifetime expire)
// Idempotent: safe to call multiple times
// ============================================================================
export function cleanupRat() {
  if (ratElement !== null) {
    ratElement.remove()
    ratElement = null
    ratX = 0
    ratY = 0
    ratBirthTime = 0
    ratAxis = 0
    ratDirection = 1
  }
}

// ============================================================================
// CHECK RAT LIFETIME (Called by obstacles.js in main loop every 50ms)
// Removes rat from game if lifetime exceeded
// ============================================================================
export function checkRatLifetime() {
  if (ratElement === null) {
    return // No rat active, nothing to check
  }
  
  const currentTime = Date.now()
  const elapsedTime = currentTime - ratBirthTime
  
  if (elapsedTime > RAT_LIFETIME_MS) {
    cleanupRat()
  }
}

// ============================================================================
// UPDATE RAT MOVEMENT (Called by obstacles.js in main loop every 50ms)
// Handles autonomous movement with boundary collision detection
// Mirrors persons movement pattern (axis-based, boundary bounce)
// ============================================================================
export function updateRat() {
  if (ratElement === null) {
    return // No rat active, nothing to update
  }
  
  // Get world bounds
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const maxX = gameAreaRect.width - RAT_SIZE
  const maxY = gameAreaRect.height - RAT_SIZE
  
  // UPDATE: Calculate next position based on axis and direction
  let nextX = ratX
  let nextY = ratY
  
  if (ratAxis === 0) {
    // Horizontal movement
    nextX += ratDirection * RAT_SPEED
  } else {
    // Vertical movement
    nextY += ratDirection * RAT_SPEED
  }
  
  // COLLISION: Check world bounds (boundary collision)
  const outOfBounds = nextX < 0 || nextX > maxX || nextY < 0 || nextY > maxY
  
  if (outOfBounds) {
    // UPDATE: Reverse direction (bounce off boundary)
    ratDirection *= -1
    // Recalculate with new direction
    if (ratAxis === 0) {
      nextX = ratX + ratDirection * RAT_SPEED
    } else {
      nextY = ratY + ratDirection * RAT_SPEED
    }
  }
  
  // RENDER: Update position
  ratX = nextX
  ratY = nextY
  ratElement.style.left = nextX + "px"
  ratElement.style.top = nextY + "px"
}
