// board
const blockSize = 10
const rows = 40
const cols = 40
const board = document.getElementById("board")
board.height = rows * blockSize
board.width = cols * blockSize
let context = board.getContext("2d")

// food
let foodX, foodY

function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize
  foodY = Math.floor(Math.random() * rows) * blockSize
}

// snake
let snakeX, snakeY 
let dirX = 0
let dirY = 0
let snakeBody = []

function placeSnake() {
  snakeX = Math.floor(Math.random() * cols) * blockSize
  snakeY = Math.floor(Math.random() * rows) * blockSize
}

// moving obstacle
let mob1X, mob1Y
let vel1X = 0
let vel1Y = 0

let mob2X, mob2Y
let vel2X = 0
let vel2Y = 0

function placeMovingObstacle() {
  mob1X = Math.floor(Math.random() * cols)
  mob1Y = Math.floor(Math.random() * rows)

  mob2X = Math.floor(Math.random() * cols)
  mob2Y = Math.floor(Math.random() * rows)
}

// leaderboard
let leaderboard = []
const leaderboardElement = document.getElementById("leaderboard")

// game
let intervalTime = 200
let interval = null
let gameOver = false
const resetButton = document.getElementById("reset")


function update() {
  if (gameOver) {
    return;
  }

  console.log(mob1X,mob1Y,mob2X,mob2Y)
  context.fillStyle = "lightgrey"
  context.fillRect(0,0,board.width,board.height)

  context.fillStyle = "red"
  context.fillRect(foodX,foodY,blockSize,blockSize)

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX,foodY])
    increaseSpeed()
    placeFood()
  }  

  context.fillStyle = "brown"
  mob1X = move(mob1X)
  mob1Y = move(mob1Y)
  mob2X = move(mob2X)
  mob2Y = move(mob2Y)

  function move(x) {
    x += Math.floor(Math.random() * 3 ) - 1
    if (x == -1) {
      x = 39
    } else if (x == 40) {
      x = 0
    }
    return x
  }

  context.fillRect(mob1X*blockSize,mob1Y*blockSize,blockSize,blockSize)
  context.fillRect(mob2X*blockSize,mob2Y*blockSize,blockSize,blockSize)

  for (let i = snakeBody.length-1; i > 0; i--) {
    snakeBody[i] = snakeBody[i-1]
  }

  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY]
  }

  context.fillStyle = "yellow"
  snakeX += dirX * blockSize
  snakeY += dirY * blockSize
  context.fillRect(snakeX,snakeY,blockSize,blockSize) 
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillStyle = "green"
    context.fillRect(snakeBody[i][0],snakeBody[i][1],blockSize,blockSize)
  }

  //game over conditions
  if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize) {
    endGame()
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
      endGame()
    }
  }

  if (snakeX == mob1X && snakeY == mob1Y) {
    endGame()
  }

  if (snakeX == mob2X && snakeY == mob2Y) {
    endGame()
  }
}

function endGame() {
  gameOver = true
  alert("Game Over")
  name = prompt("Please enter your name")
  leaderboard.push([name,snakeBody.length])
  displayLeaderboard() 
}

function changeDirection(event) {
  if (event.code == "ArrowUp" && dirY != 1) {
    dirX = 0
    dirY = -1
  } else if (event.code == "ArrowDown" && dirY != -1) {
    dirX = 0
    dirY = 1   
  } else if (event.code == "ArrowLeft" && dirX != 1) {
    dirX = -1
    dirY = 0
  } else if (event.code == "ArrowRight" && dirX != -1) {
    dirX = 1
    dirY = 0
  }
}

function increaseSpeed() {
  intervalTime *= 0.9
  clearInterval(interval)
  interval = setInterval(update,intervalTime)
}

function displayLeaderboard() {
  leaderboardElement.innerHTML = `
    <section class="d-flex" style="justify-content:center">
      <p>Leaderboard</p>
    </section><br>
  `
  leaderboard.forEach((user,index) => {
    const listItem = document.createElement('section')
    listItem.innerHTML = `
      <section class="d-flex space-between">
        <p>${user[0]}</p> 
        <p>${user[1]}</p>
      </section>
    `

    leaderboardElement.append(listItem)
  })
}

function reset() {
  gameOver = false
  clearInterval(interval)
  intervalTime = 200
  snakeBody = []
  dirX = 0
  dirY = 0
  placeFood()
  placeSnake()
  interval = setInterval(update,intervalTime)
}

displayLeaderboard()
placeFood()
placeSnake()
placeMovingObstacle()
interval = setInterval(update,intervalTime)
document.addEventListener('keydown',changeDirection)
resetButton.addEventListener('click', reset)

