class Obstacle {

  constructor(posY, type) {
    // let posY = 200
    this.type = type //* this allows you to access the type even inside methods for dynamic functionalities.

    this.node = document.createElement("img")
    if (type === "top") {
      this.node.src = "./images/obstacle_top.png"
    } else if (type === "bottom") {
      this.node.src = "./images/obstacle_bottom.png"
    }

    //* you can also do it like this
    // this.node.src = `./images/obstacle_${type}.png`

    gameBoxNode.append(this.node)

    this.x = gameBoxNode.offsetWidth // ALWAYS point to the numeric width value
    this.y = posY
    this.width = 50
    this.height = 220

    this.node.style.position = "absolute"
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
    this.node.style.width = `${this.width}px`
    this.node.style.height = `${this.height}px`

    this.speed = 1.8

  }

  automaticMovement() {
    // if (this.type === "top") {
    //   this.x -= this.speed
    // } else if (this.type === "bottom") {
    //   this.x -= (this.speed * 2)
    // }
    this.x -= this.speed
    this.node.style.left = `${this.x}px`
  }


}