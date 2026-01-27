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

// Movement approval hook - centralized blocking decision
export function canMove(type, nextX, nextY, width, height) {
  const blocked = isPositionBlockedByCones(nextX, nextY, width, height);
  return !blocked; // true if allowed, false if blocked
}

// Audio management
const bgm = new Audio();
bgm.src = "assets/audio/bgm-sheherazade.ogg";
bgm.loop = true;
bgm.volume = 0.5;

let isMuted = false;
let lastGameState = "start"

const audioToggleBtn = document.querySelector("#audio-toggle-btn")

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