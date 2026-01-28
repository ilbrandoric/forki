console.log("Forki booting...");



// Game state variables
const GAME_STATE = {
  BOOT: "boot",
  PLAYING: "playing",
  PAUSED: "paused"
};

let gameState = GAME_STATE.BOOT;

function setGameState(newState) {
  console.log("Game state:", gameState, "→", newState);
  gameState = newState;
}

function getGameState() {
  return gameState;
}

function bootGame() {
  setGameState(GAME_STATE.PLAYING);
}

// Stores when the previous frame happened
let lastTime = 0;

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLAYER_SPEED = 150; // pixels per second

// Obstacles

const obstacles = [
  {
    x: 300,
    y: 200,
    width: 100,
    height: 40
  }
];


//Game container (DOM Setup)

const app = document.getElementById("app");
const game = document.createElement("div");

// Sets <div id="game"> to the above created div
//This is also the 'world' for JS
game.id = "game";


// Is a key pressed? (Movement intent NOT movement itself)

const input = {
  left: false,
  right: false,
  up: false,
  down: false
};

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") input.left = true;
  if (e.key === "ArrowRight") input.right = true;
  if (e.key === "ArrowUp") input.up = true;
  if (e.key === "ArrowDown") input.down = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") input.left = false;
  if (e.key === "ArrowRight") input.right = false;
  if (e.key === "ArrowUp") input.up = false;
  if (e.key === "ArrowDown") input.down = false;
});


/*

JS defines reality
Logic to the fine 'world size' in pixels. This way:

- logic knows the world size
- collisions use the same numbers
- movement uses the same numbers
- boundaries use the same numbers
- rendering matches logic

*/

game.style.width = GAME_WIDTH + "px";
game.style.height = GAME_HEIGHT + "px";
game.style.position = "relative";  
game.style.background = "#222";
game.style.margin = "40px auto";

//Puts the game <div id="game"> inside the <div id="app">  
app.appendChild(game);


/* === World state (authoritative game data; logic, not visuals) === */

// Create a game state object (data position)

const state = {
  player: {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    vx: 0,       //Velocity value
    vy: 0
  }
};


// Crate data (STATE)

const crate = {
  x: 100,
  y: 200,
  width: 40,
  height: 40
};



// ==== Defines objects ====

// Creates a player 'dummy' inside game

const playerEl = document.createElement("div");
playerEl.id = "player";
playerEl.style.position = "absolute";
playerEl.style.background = "orange";
game.appendChild(playerEl);

// Creates obstacle

const obstacleEl = document.createElement("div");
obstacleEl.style.position = "absolute";
obstacleEl.style.background = "gray";
game.appendChild(obstacleEl);

// Creates crate 

const crateEl = document.createElement("div");
crateEl.style.position = "absolute";
crateEl.style.background = "brown";
game.appendChild(crateEl);




// === Renders objects visually inside world ===

// Create a render function (bring data → DOM)

function render() {
  // Player
  playerEl.style.width = state.player.width + "px";
  playerEl.style.height = state.player.height + "px";
  playerEl.style.left = state.player.x + "px";
  playerEl.style.top = state.player.y + "px";

  // Obstacle
  obstacleEl.style.width = obstacles[0].width + "px";
  obstacleEl.style.height = obstacles[0].height + "px";
  obstacleEl.style.left = obstacles[0].x + "px";
  obstacleEl.style.top = obstacles[0].y + "px";

  // Crate
crateEl.style.width = crate.width + "px";
crateEl.style.height = crate.height + "px";
crateEl.style.left = crate.x + "px";
crateEl.style.top = crate.y + "px";

}


/*  === World boundaries ===
 clamp explained: (where the player is at, min = world begins here, max = world ends here) 
in out case game width is 800 px and height = 500 px.

Math.min(max,…) = Do not allow value to be bigger than max
Math.max(min, …) = Do not allow value to be smaller than min
*/

function clamp(value, min, max) {   
  return Math.max(min, Math.min(max, value));
 }

// This causes a collision: if X overlap AND Y overlap if TRUE = Collision


function isColliding(a, b) {
  return (
    a.x < b.x + b.width && a.x + a.width > b.x && // Is A’s left edge left of B’s right edge?
    a.y < b.y + b.height && a.y + a.height > b.y
  );
}


function gameLoop(timestamp) {
  if (lastTime === 0) {
    lastTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  // Delta time in seconds 
  const deltaTime = (timestamp - lastTime) / 1000;  
  lastTime = timestamp;


  // Playing block
  if (getGameState() === GAME_STATE.PLAYING) {

    // Reset velocity: no keystroke = no movement
    state.player.vx = 0;
    state.player.vy = 0;

    // Input → velocity (intent)
    if (input.left)  state.player.vx -= PLAYER_SPEED; // Left is negative like in cartesian plane
    if (input.right) state.player.vx += PLAYER_SPEED;
    if (input.up)    state.player.vy -= PLAYER_SPEED;
    if (input.down)  state.player.vy += PLAYER_SPEED;

    const prevX = state.player.x;
    const prevY = state.player.y;


    // This is where movement happens
    state.player.x += state.player.vx * deltaTime;
    state.player.y += state.player.vy * deltaTime;

    // Collision with obstacles
    for (const obstacle of obstacles) {
    if (isColliding(state.player, obstacle)) {
    state.player.x = prevX;
    state.player.y = prevY;
        }
    }


    // World boundaries
    state.player.x = clamp(
      state.player.x,
      0,
      GAME_WIDTH - state.player.width
    );

    state.player.y = clamp(
      state.player.y,
      0,
      GAME_HEIGHT - state.player.height
    );
  }

  // Render (EVERY FRAME)
  render();

  // Schedule next frame
  requestAnimationFrame(gameLoop);
}


bootGame();
requestAnimationFrame(gameLoop);
