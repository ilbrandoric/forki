//* GLOBAL DOM ELEMENTS

// screens
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// buttons
const startBtnNode = document.querySelector("#start-btn")

// game box
const gameBoxNode = document.querySelector("#game-box")


//* GLOBAL GAME VARIABLES
let birdObj = null // the game has not yet started, there should be no bird
// let obstacleObj = null
let obstacleArr = []
let gameIntervalId = null
let obstacleSpawnIntervalId = null


//* GLOBAL GAME FUNCTIONS
function startGame() {
  // 1. hide start screen & show the game screen
  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"

  // 2. add the initial game elements
  birdObj = new Bird()
  console.log(birdObj)
  // obstacleObj = new Obstacle()
  // obstacleSpawn()

  // 3. start the game loop
  gameIntervalId = setInterval(gameLoop, Math.round(1000/60)) // 60fps (don't change this)
  
  // 4. start all other intervals that might be needed
  obstacleSpawnIntervalId = setInterval(obstacleSpawn, 2000)

}

function gameLoop() {
  // console.log("game running at 60fps")
  // all automated movements and all collision checks
  
  birdObj.gravity()
  // obstacleObj.automaticMovement()
  obstacleArr.forEach((eachObstacleObj) => {
    eachObstacleObj.automaticMovement()
  })

  obstacleDespawnCheck()
  collisionBirdObstacles()
  collisionBirdFloor()
  
}

function obstacleSpawn() {

  // random Y position between -100 and 0
  let randomObstacleTopPositionY = Math.floor( Math.random() * 100 ) - 100
  let distanceBetweenPipes = 310

  let obstacleTop = new Obstacle(randomObstacleTopPositionY, "top")
  obstacleArr.push(obstacleTop)
  
  let obstacleBottom = new Obstacle(randomObstacleTopPositionY + distanceBetweenPipes, "bottom")
  obstacleArr.push(obstacleBottom)
  
  console.log(obstacleArr)
}

function obstacleDespawnCheck() {

  if (obstacleArr.length === 0) {
    return // if there are not obstacles in the array stop the function from executing
  }

  // if the first object on the array, reaches x === 0, then remove it.
  if ((obstacleArr[0].x + obstacleArr[0].width) <= 0) {
    obstacleArr[0].node.remove() // removed the element from the DOM environment
    obstacleArr.shift() // removes the first element. removing the obstacle from the JS environment
  }

}

function collisionBirdObstacles() {

  // birdObj
  obstacleArr.forEach((eachObstacleObj) => {
    // eachObstacleObj
    let isColliding = checkCollision(birdObj, eachObstacleObj)
    if (isColliding) {
      console.log("the bird has collided with a pipe!")
      gameOver()
    }
  })

}

function checkCollision(obj1, obj2) {
    // return true if both objects collide
    // return false if both objects don't collide
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
}

function collisionBirdFloor() {
  if ((birdObj.y + birdObj.height) > gameBoxNode.offsetHeight) {
    gameOver()
  }
}

function gameOver() {
  //1. stop ALL intervals
  clearInterval(gameIntervalId)
  clearInterval(obstacleSpawnIntervalId)

  //2. change states
  gameScreenNode.style.display = "none"
  gameOverScreenNode.style.display = "flex"
}


//* EVENT LISTENERS
startBtnNode.addEventListener("click", startGame)
gameBoxNode.addEventListener("click", () => {
  birdObj.jump()
})

document.addEventListener("keydown", (event) => {
  console.log(event.key)
  if (event.key === " ") {
    birdObj.jump()
  }
})



//* planning session

// - bird object ✅
//  - properties(x, y, w, h, gravitySpeed, jumpSpeed) ✅

// - obstacle object ✅
//  - properties(x, y, w, h, speed) ✅
//  - come in pairs (different heights and different images) ✅
//  - randomize the y position of the obstacles ✅

// obstacleSpawn (set timer) ✅
// obstacleDespawn (when they reach left screen) ✅
// moves obstacles right to left (x decrease) ✅
// move bird always moves down (gravity) ✅
// jump effect on the bird (space or click on screen) ✅
// - collision between bird and the ceiling ✅
// collision between the bird and the pipe ✅
// collision between bird and the floor ✅
// game over ✅

//* Bonus
// UI elements like score or life
// slow jumping animation
// restart
// pause
// sound & music



