// ============================================================================
// SYSTEM: Game initialization and central movement approval
// Responsibilities: Module imports, movement blocking decision, audio management
// ============================================================================
//
// COLLISION FLOW SUMMARY (System-Level):
//   The game uses a two-tier collision system:
//
//   TIER 1 - MOVEMENT-BLOCKING (Movement-Deciding):
//     Called BEFORE movement is applied to ensure safe positions
//     Checked by: player.js, box.js, obstacles.js (person movement)
//     Centralized at: main.js canMove() function (called by all movers)
//     Implementation: canMove() → isPositionBlockedByCones() → conePositions check
//     Decision: "Can I move to this position?" (returns true/false)
//     Entities checked: Player, Box, Persons
//     Obstacles checked against: Cones (boundaries implicitly in obstacles.js)
//
//   TIER 2 - TERMINAL COLLISION (Game-State-Changing):
//     Called AFTER movement is applied to detect win/loss conditions
//     Not centralized – each terminal-type check is owned by its detector:
//       - goal.js checks box→goal (win condition)
//       - obstacles.js persons check person→player (loss condition)
//       - obstacles.js persons check person→box (loss condition)
//     Decision: "Did this cause game over?" (triggers triggerGameOver)
//     No blocking decision – these are post-movement event triggers
//
// SYMMETRY NOTE:
//   - Persons move autonomously and check collisions with player/box
//   - Player and box never check collisions with persons
//   - Goal is static and checked by player (external invocation)
//   - Cone is static and checked by all movers (blocking decision)
//
// ============================================================================

// Game state setup is in js/game-state.js
import { getGameState } from "./game-state.js";
// Player movement setup is in js/player.js
import "./player.js";
// Obstacle movement setup is in js/obstacles.js
import { isPositionBlockedByCones } from "./obstacles.js";
// Collision detection setup is in js/collision.js
import "./collision.js";
// Goal detection setup is in js/goal.js
import "./goal.js";
// Score tracking setup is in js/score.js
import "./score.js";
// Timer countdown setup is in js/timer.js
import "./timer.js";
// Box pushing setup is in js/box.js
import "./box.js";

// COLLISION: Movement approval hook - centralized blocking decision
// Called by: player.js and box.js to check if movement is allowed
// Returns: true if allowed, false if blocked by cones
export function canMove(type, nextX, nextY, width, height) {
  const blocked = isPositionBlockedByCones(nextX, nextY, width, height);
  return !blocked; // true if allowed, false if blocked
}

// SYSTEM: Audio management
const bgm = new Audio();
bgm.src = "assets/audio/bgm-sheherazade.ogg";
bgm.loop = true;
bgm.volume = 0.05;

let isMuted = true;
let lastGameState = "start"

const audioToggleBtn = document.querySelector("#audio-toggle-btn")

// Initial visual state (default muted)
audioToggleBtn.textContent = "🔇"
bgm.pause()


// Toggle mute state
audioToggleBtn.addEventListener("click", () => {
  isMuted = !isMuted
  if (isMuted) {
    bgm.pause()
    audioToggleBtn.textContent = "🔇"
  } else {
    if (getGameState() === "playing") {
      bgm.play()
    }
    audioToggleBtn.textContent = "🔊"
  }
})

// Monitor game state and control music
setInterval(() => {
  const currentState = getGameState()
  
  // State changed to playing
  if (lastGameState !== "playing" && currentState === "playing") {
    if (!isMuted) {
      bgm.play()
    }
  }
  
  // State changed from playing
  if (lastGameState === "playing" && currentState !== "playing") {
    bgm.pause()
    bgm.currentTime = 0
  }
  
  lastGameState = currentState
}, 100)

console.log("main.js loaded")