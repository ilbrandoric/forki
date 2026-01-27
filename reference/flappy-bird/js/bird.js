class Bird {

  constructor() {
    // this is where the properties will be added

    this.node = document.createElement("img")
    this.node.src = "./images/flappy.png"

    gameBoxNode.append(this.node)

    this.x = 60
    this.y = 60
    this.width = 40
    this.height = 35

    this.node.style.position = "absolute"
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
    this.node.style.width = `${this.width}px`
    this.node.style.height = `${this.height}px`

    this.gravitySpeed = 1.8
    this.jumpSpeed = 30
  }

  // this is where the methods will be added
  gravity() {
    this.y += this.gravitySpeed
    //! EVERYTIME you change a position or dimension value of the object, we need to adjust the DOM
    this.node.style.top = `${this.y}px`
  }

  jump() {
    if (this.y > 0) {
      this.y -= this.jumpSpeed
      this.node.style.top = `${this.y}px`
    }
  }

}