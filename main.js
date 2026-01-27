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
game.style.position = "relative";
game.style.background = "#222";
game.style.margin = "40px auto";

//Puts the game div inside the app html id="div"

app.appendChild(game);


