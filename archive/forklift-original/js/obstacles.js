console.log("obstacles.js loaded")

import { checkCollision } from "./collision.js"
import { triggerGameOver, getGameState } from "./game-state.js"

// Get DOM elements
const playerNode = document.querySelector("#player")
const boxNode = document.querySelector("#box")
const gameAreaNode = document.querySelector("#game-area")

// Guard to prevent repeated failure triggers
let failureTriggered = false

// Guard to ensure cones initialize once per round
let conesInitialized = false

// Guard to ensure persons initialize once per round
let personsInitialized = false

// Movement speed (pixels per tick)
const speed = 4

// Cone initialization and placement
const conePositions = []
const numCones = 3

// Persons array
const persons = []

function initializeCones() {
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const dropZoneNode = document.querySelector("#drop-zone")
  const dropZoneRect = dropZoneNode.getBoundingClientRect()
  
  // Define unsafe zones (player start, box start, drop zone)
  const unsafeZones = [
    { x: 0, y: 0, width: 40, height: 40 }, // Player start
    { x: 100, y: 100, width: 40, height: 40 }, // Box start
    { x: dropZoneRect.left - gameAreaRect.left, y: dropZoneRect.top - gameAreaRect.top, width: dropZoneRect.width, height: dropZoneRect.height } // Drop zone
  ]
  
  function isSafePosition(x, y, width, height) {
    for (const zone of unsafeZones) {
      if (!(x + width < zone.x || x > zone.x + zone.width || y + height < zone.y || y > zone.y + zone.height)) {
        return false
      }
    }
    for (const cone of conePositions) {
      const coneX = parseFloat(cone.element.style.left)
      const coneY = parseFloat(cone.element.style.top)
      if (!(x + width < coneX || x > coneX + cone.width || y + height < coneY || y > coneY + cone.height)) {
        return false
      }
    }
    return true
  }
  
  // Create and place multiple cones
  for (let i = 0; i < numCones; i++) {
    const coneNode = document.createElement("div")
    coneNode.textContent = "🚧"
    coneNode.style.position = "absolute"
    coneNode.style.fontSize = "24px"
    gameAreaNode.appendChild(coneNode)
    
    let x, y
    let attempts = 0
    
    // Try to find safe position (max 50 attempts to avoid infinite loop)
    do {
      x = Math.random() * (gameAreaRect.width - 30)
      y = Math.random() * (gameAreaRect.height - 30)
      attempts++
    } while (!isSafePosition(x, y, 30, 30) && attempts < 50)
    
    // Place cone
    coneNode.style.left = x + "px"
    coneNode.style.top = y + "px"
    
    conePositions.push({
      element: coneNode,
      x: x,
      y: y,
      width: 30,
      height: 30
    })
  }
}

// Private function to check if a position overlaps with any cone
function checkPositionAgainstCones(x, y, width, height) {
  for (const cone of conePositions) {
    const coneX = parseFloat(cone.element.style.left)
    const coneY = parseFloat(cone.element.style.top)
    
    // AABB collision check
    if (!(x + width < coneX || x > coneX + cone.width || y + height < coneY || y > coneY + cone.height)) {
      return true // Collision detected
    }
  }
  return false // No collision
}

// Export single boolean decision function for movement blocking
export function isPositionBlockedByCones(x, y, width, height) {
  return checkPositionAgainstCones(x, y, width, height)
}

// Initialize persons
function initializePersons() {
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  const dropZoneNode = document.querySelector("#drop-zone")
  const dropZoneRect = dropZoneNode.getBoundingClientRect()
  
  // Define unsafe zones (player start, box start, drop zone)
  const unsafeZones = [
    { x: 0, y: 0, width: 40, height: 40 }, // Player start
    { x: 100, y: 100, width: 40, height: 40 }, // Box start
    { x: dropZoneRect.left - gameAreaRect.left, y: dropZoneRect.top - gameAreaRect.top, width: dropZoneRect.width, height: dropZoneRect.height } // Drop zone
  ]
  
  function isSafePositionForPerson(x, y, width, height) {
    // Check unsafe zones
    for (const zone of unsafeZones) {
      if (!(x + width < zone.x || x > zone.x + zone.width || y + height < zone.y || y > zone.y + zone.height)) {
        return false
      }
    }
    // Check cones
    if (checkPositionAgainstCones(x, y, width, height)) {
      return false
    }
    // Check existing persons
    for (const person of persons) {
      const px = parseFloat(person.element.style.left)
      const py = parseFloat(person.element.style.top)
      if (!(x + width < px || x > px + person.width || y + height < py || y > py + person.height)) {
        return false
      }
    }
    return true
  }
  
  // Spawn random number of persons (2-5)
  const numPersons = Math.floor(Math.random() * 4) + 2
  
  for (let i = 0; i < numPersons; i++) {
    const personNode = document.createElement("div")
    personNode.textContent = "👤"
    personNode.style.position = "absolute"
    personNode.style.fontSize = "24px"
    gameAreaNode.appendChild(personNode)
    
    let x, y
    let attempts = 0
    
    // Try to find safe position
    do {
      x = Math.random() * (gameAreaRect.width - 30)
      y = Math.random() * (gameAreaRect.height - 30)
      attempts++
    } while (!isSafePositionForPerson(x, y, 30, 30) && attempts < 50)
    
    // Random axis (0 = horizontal, 1 = vertical)
    const axis = Math.floor(Math.random() * 2)
    // Random direction (-1 or 1)
    const direction = Math.random() < 0.5 ? -1 : 1
    
    // Place person
    personNode.style.left = x + "px"
    personNode.style.top = y + "px"
    
    persons.push({
      element: personNode,
      x: x,
      y: y,
      axis: axis, // 0 = horizontal, 1 = vertical
      direction: direction,
      width: 30,
      height: 30
    })
  }
}

// Start automatic movement
setInterval(() => {
  const currentState = getGameState()
  
  // Only run obstacle logic when game is playing
  if (currentState !== "playing") {
    // Reset cones when exiting playing state for next round
    if (conesInitialized) {
      conesInitialized = false
      conePositions.length = 0
      document.querySelectorAll("div[style*='🚧']").forEach(cone => cone.remove())
    }
    // Reset persons when exiting playing state for next round
    if (personsInitialized) {
      personsInitialized = false
      persons.forEach(person => person.element.remove())
      persons.length = 0
      failureTriggered = false
    }
    return
  }
  
  // Initialize cones once when entering playing state
  if (!conesInitialized) {
    initializeCones()
    conesInitialized = true
  }
  
  // Initialize persons once when entering playing state
  if (!personsInitialized) {
    initializePersons()
    personsInitialized = true
  }
  
  // Move each person
  const gameAreaRect = gameAreaNode.getBoundingClientRect()
  
  for (const person of persons) {
    // Calculate next position
    let nextX = person.x
    let nextY = person.y
    
    if (person.axis === 0) {
      // Horizontal movement
      nextX += person.direction * speed
    } else {
      // Vertical movement
      nextY += person.direction * speed
    }
    
    // Check if next position is blocked
    const maxX = gameAreaRect.width - person.width
    const maxY = gameAreaRect.height - person.height
    const outOfBounds = nextX < 0 || nextX > maxX || nextY < 0 || nextY > maxY
    const blockedByCones = checkPositionAgainstCones(nextX, nextY, person.width, person.height)
    
    if (outOfBounds || blockedByCones) {
      // Reverse direction
      person.direction *= -1
      // Recalculate with new direction
      if (person.axis === 0) {
        nextX = person.x + person.direction * speed
      } else {
        nextY = person.y + person.direction * speed
      }
    }
    
    // Update position
    person.x = nextX
    person.y = nextY
    person.element.style.left = nextX + "px"
    person.element.style.top = nextY + "px"
    
    // Check collision with player
    if (checkCollision(playerNode, person.element)) {
      if (!failureTriggered) {
        failureTriggered = true
        triggerGameOver("Game Over!")
      }
    }
    
    // Check collision with box
    if (checkCollision(boxNode, person.element)) {
      if (!failureTriggered) {
        failureTriggered = true
        triggerGameOver("Game Over!")
      }
    }
  }
}, 50)
