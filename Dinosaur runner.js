const landWalking = 280
const jumpingSpeed = 70
class dinosaur {
    constructor() {
        this.x = 75
        this.y = landWalking
        this.vy = jumpingSpeed
        this.leg = 1
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = "black"
        ctx.moveTo(this.x + 18, this.y - 20);
        ctx.lineTo(this.x + 18, this.y - 7);
        ctx.lineTo(this.x + 7, this.y - 7)
        ctx.lineTo(this.x + 7, this.y + 4)
        ctx.lineTo(this.x, this.y + 14)
        ctx.lineTo(this.x - 7, this.y + 9)
        ctx.lineTo(this.x - 18, this.y - 7)
        ctx.lineTo(this.x - 7, this.y)
        ctx.lineTo(this.x, this.y - 7)
        ctx.lineTo(this.x, this.y - 20)
        ctx.lineTo(this.x + 18, this.y - 20)
        ctx.fill()
        if (this.leg == 1) {
            ctx.lineWidth = 3;
            ctx.moveTo(this.x - 1, this.y + 10)
            ctx.lineTo(this.x - 1, this.y + 19)
            ctx.lineTo(this.x + 3, this.y + 19)
        } else {
            ctx.lineWidth = 3;
            ctx.moveTo(this.x - 5, this.y + 10)
            ctx.lineTo(this.x - 5, this.y + 19)
            ctx.lineTo(this.x - 3, this.y + 19)
        }
        ctx.stroke()
    }
}
class obstacle {
    constructor() {
        this.x = 800
        this.y = ground
        this.lenght = Math.floor(Math.random() * (4 - 1) + 1)
        this.heigh = Math.floor(Math.random() * (4 - 1) + 1)
        this.vx = 50
    }

    draw(ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = "black"
        for (let i = 0; i < this.lenght; ++i) {
            ctx.beginPath();
            ctx.moveTo(this.x + 30 * i, this.y);
            ctx.lineTo(this.x + 30 * i, this.y - 20 * this.heigh)
            ctx.lineTo((this.x + 30 * i) + 25, this.y - 20 * this.heigh)
            ctx.lineTo((this.x + 30 * i) + 25, this.y)
            ctx.fill()
        }
    }
}

const ground = 300
const canvasWidth = 700
const canvasHeigh = 400
const dinosaurRunner = new dinosaur()
window.onload = function () {
    meniu("Start")
}
function play(event) {
    if (event.offsetX < 450 && event.offsetX > 250 && event.offsetY < 350 && event.offsetY > 250) {
        const canvas = document.getElementById("canvas")
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvasWidth, canvasHeigh)
        dinosaurRunner.draw(ctx)
        ctx.lineWidth = 1
        ctx.moveTo(0, ground)
        ctx.lineTo(canvasWidth, ground)
        ctx.stroke();
        addEvent()
        canvas.removeEventListener("click", play)
    }
}

function meniu(buttonValue) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "blue"
    ctx.fillRect(100, 0, 500, canvasHeigh)
    ctx.fillStyle = "green"
    ctx.fillRect(250, 250, 200, 100)
    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.font = "50px serif"
    ctx.fillText(buttonValue, 350, 320)
    if (buttonValue == "Start") {
        ctx.font = "30px serif"
        ctx.fillText("Use ArrowUp and spacebar to jump", 350, 100);
        ctx.fillText("Press the Start button to start the game", 350, 230)
        canvas.addEventListener("click", play)
    } else {
        ctx.fillText("Score: " + score, 350, 230)
        canvas.addEventListener("click", restart)
    }
}

function addEvent() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    window.addEventListener("keydown", keydownHandler)
    window.addEventListener("keyup", keyupHandler)
}

let jump = false
let goDown = false
let start = false
let space = 32
let arrowUp = 38
let jumpAnimationId
let legIntervalId

function keydownHandler(event) {
    if (event.keyCode === space || event.keyCode === arrowUp) {
        jump = true
        if (start == false) {
            legIntervalId = setInterval(moveLegs, 100)
            start = true
            jumpAnimationId = requestAnimationFrame(jumpDinosaur)
        }
    }
    if (start == false) {
        legIntervalId = setInterval(moveLegs, 100)
        start = true
        jumpAnimationId = requestAnimationFrame(jumpDinosaur)
    }
}

function keyupHandler(event) {
    if (event.keyCode === space || event.keyCode === arrowUp) {
        jump = false
    }
}

let lastTime = null

function jumpDinosaur(currentTime) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasWidth, canvasHeigh)
    if (!lastTime) {
        lastTime = currentTime
    }
    const elapsedTime = currentTime - lastTime;
    const distance = dinosaurRunner.vy * elapsedTime / 100;
    if ((dinosaurRunner.vy < 5 || goDown) && dinosaurRunner.y != landWalking) {
        dinosaurRunner.vy += 4
        dinosaurRunner.y += distance;
        goDown = true
        if (dinosaurRunner.vy > jumpingSpeed) {
            dinosaurRunner.vy = jumpingSpeed
        }
    }
    if (dinosaurRunner.y > landWalking) {
        dinosaurRunner.y = landWalking
        dinosaurRunner.vy = jumpingSpeed
    }
    if (((dinosaurRunner.y == landWalking && jump) || !goDown)) {
        dinosaurRunner.vy -= 4
        dinosaurRunner.y -= distance;
        goDown = false
    }
    dinosaurRunner.draw(ctx)
    ctx.lineWidth = 1
    ctx.moveTo(0, ground)
    ctx.lineTo(canvasWidth, ground)
    ctx.stroke();
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, 650, 50);
    lastTime = currentTime
    jumpAnimationId = requestAnimationFrame(jumpDinosaur)
    drawObstaclesAnimationId = requestAnimationFrame(drawObstacles)
}

function moveLegs() {
    dinosaurRunner.leg = -dinosaurRunner.leg
}

let score = 0
let drawObstaclesAnimationId
let finish = 1
let begin = 0
let obstacles = []
let distanceBetweenObstacles = []
let timeMeasure = null
for (let i = 0; i < 50; ++i) {
    obstacles[i] = new obstacle()
    distanceBetweenObstacles[i] = Math.floor(Math.random() * (3 - 1) + 1)
}

function drawObstacles(currentTime) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    if (!timeMeasure) {
        timeMeasure = currentTime
    }
    const elapsedTime = currentTime - timeMeasure;
    for (let i = begin; i < finish; ++i) {
        const distance = obstacles[i].vx * elapsedTime / 100;
        obstacles[i].x -= distance
        obstacles[i].draw(ctx)
        for (let j = 0; j < obstacles[i].lenght; ++j) {
            if (collide(obstacles[i])) {
                gameOver()
                return
            }
        }
        if (obstacles[finish].x - obstacles[finish - 1].x + obstacles[finish - 1].lenght * 30 >= distanceBetweenObstacles[finish - 1] * 350 && finish < 49) {
            ++finish;
        }
        if (obstacles[begin].x < -50) {
            ++begin
            ++score
            if (begin == 49) {
                newObstacles()
            }
        }
    }
    timeMeasure = currentTime
}

let moreSpeed = 1

function newObstacles() {
    finish = 1
    begin = 0
    for (let i = 0; i < 50; ++i) {
        obstacles[i] = new obstacle()
        obstacles[i].vy += moreSpeed * 10
        distanceBetweenObstacles[i] = Math.floor(Math.random() * (3 - 1) + 1)
    }
    ++moreSpeed
}

function collide(currentObstacle) {
    if (dinosaurRunner.x < currentObstacle.x + 30 * currentObstacle.lenght && dinosaurRunner.x > currentObstacle.x && dinosaurRunner.y + 20 > currentObstacle.y - 20 * currentObstacle.heigh ||
        dinosaurRunner.x + 18 < currentObstacle.x + 30 * currentObstacle.lenght && dinosaurRunner.x + 18 > currentObstacle.x && dinosaurRunner.y > currentObstacle.y - 20 * currentObstacle.heigh) {
        return true
    }
    return false
}

function gameOver() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    cancelAnimationFrame(jumpAnimationId)
    cancelAnimationFrame(drawObstaclesAnimationId)
    clearInterval(legIntervalId)
    ctx.font = "30px serif";
    ctx.textAlign = "center";
    removeEventListener("keydown", keydownHandler)
    removeEventListener("keyup", keyupHandler)
    meniu("Restart")
    ctx.fillText("G a m e  O v e r", 350, 100);
}

function restart(event) {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    if (event.offsetX < 450 && event.offsetX > 250 && event.offsetY < 350 && event.offsetY > 250) {
        clearInterval(legIntervalId)
        canvas.removeEventListener("click", restart)
        ctx.clearRect(0, 0, canvasWidth, canvasHeigh)
        for (let i = 0; i < 50; ++i) {
            obstacles[i] = new obstacle()
            distanceBetweenObstacles[i] = Math.floor(Math.random() * (3 - 1) + 1)
        }
        finish = 1
        begin = 0
        timeMeasure = null
        lastTime = null
        start = false
        dinosaurRunner.y = landWalking
        dinosaurRunner.draw(ctx)
        ctx.lineWidth = 1
        ctx.moveTo(0, ground)
        ctx.lineTo(canvasWidth, ground)
        ctx.stroke();
        score = 0
        dinosaurRunner.vy = jumpingSpeed
        addEvent()
    }
}
