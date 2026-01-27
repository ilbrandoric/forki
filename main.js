console.log("Forki booting...");


// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

//Game container

const app = document.getElementById("app");
const game = document.createElement("div");

// Sets <div id="game"> to the above created div
//This is also the 'world' for JS
game.id = "game";


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
    height: 40
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


