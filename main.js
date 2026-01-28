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
game.style.position = "relative";  // This element becomes a reference point for absolutely positioned children.
game.style.background = "#222";
game.style.margin = "40px auto";

//Puts the game <div id="game"> inside the <div id="app">  
app.appendChild(game);


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


// Create a render function (bring data → DOM)

  function render() {
  playerEl.style.width = state.player.width + "px";
  playerEl.style.height = state.player.height + "px";
  playerEl.style.left = state.player.x + "px";
  playerEl.style.top = state.player.y + "px";
}



// Creates a player 'dummy' inside game

const playerEl = document.createElement("div");
playerEl.id = "player";
playerEl.style.position = "absolute"; // Place player using x,y coordinates
playerEl.style.background = "orange";

game.appendChild(playerEl);
render();

/*

Why we start with a box?
Because:

boxes are simple
collisions are rectangles
forklifts are rectangles
walls are rectangles
DOM works with rectangles

Absolute elements are positioned relative to the nearest positioned ancestor.

game (relative)
 └── player (absolute)


 This means (0,0) is top-left of the game world

 ---

 Notice game.style.position = "relative";  
 
 Relative to what?
    The game element is now positioned relative to itself — but more importantly:

    It tells the browser:
    “Any child with position: absolute should measure its coordinates from me.”

PAGE (body)
 └── app
      └── game  ← (relative anchor)
           └── player (absolute)


 */




function gameLoop(timestamp) {
  if (lastTime === 0) {
    lastTime = timestamp;
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;


  // Playing block
  if (getGameState() === GAME_STATE.PLAYING) {

  // No keyboard input or no input = no velocity
  state.player.vx = 0;
  state.player.vy = 0;

  if (input.left)  state.player.vx -= PLAYER_SPEED;  // Left = -x because of a cartisian plane reference
  if (input.right) state.player.vx += PLAYER_SPEED;
  if (input.up)    state.player.vy -= PLAYER_SPEED;
  if (input.down)  state.player.vy += PLAYER_SPEED;

//   console.log("vx:", state.player.vx, "vy:", state.player.vy);
}


  // Render (visuals)
  render();

  // Schedule next frame
  requestAnimationFrame(gameLoop);
}


bootGame();
requestAnimationFrame(gameLoop);


/*

=== Explanation: requestAnimationFrame(gameLoop); ====

requestAnimationFrame is a BROWSER function and its not defined on this code. Its like console.log
"Hey browser, next time you’re about to draw a frame, please run this function first.” or 
"Before your next screen repaint, run gameLoop.”

        Browser is about to refresh screen
            ↓
        Browser runs gameLoop()
            ↓
        Your code updates positions + styles
            ↓
        Browser paints the frame



gameLoop runs ≈ 60 times per second if your monitor refreshes at 60Hz or 144 if its 144 Hz, etc
So we're basically setting up the game to obey time, not frames. 

*/


