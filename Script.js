const CANVAS_NODE = document.getElementById("arkanoid");
const CTX = CANVAS_NODE.getContext("2d");

// Даем нашему будуйщему шарику радиус в 10 пикселей.
const BALL_RADIUS = 10;

// Этот цвет будет главным цветом в нашей игре. Для примера, граница нашей игры.
CTX.fillStyle = "#0095DD";
// Шрифт текста в игре.
CTX.font = "16px Arial";

// Ширина и высота платформы в игре.
const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 10;

// Разметка блоков в игре. Сколько будет стоять в колонну и в ряд. Также указана дистанция блоков.
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 3;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET = 30;

// Даем нашему будуйщему шарику координаты где он будет появлятся.
let BallX = CANVAS_NODE.width / 2;
let BallY = CANVAS_NODE.height - 30;


// Даем начальное направление нашему шарику.
let paddleX = (CANVAS_NODE.width - CANVAS_NODE.height) / 2;

// Создаем начальный счёт и количество жизней.
let score = 0;
let lives = 3;

const bricks = [];

// Задаем нашим блокам свойства как они будут построены.
for (let c=0; c<BRICK_COLUMN_COUNT; c++){
    bricks[c] = [];

    for (let  r=0;  r<BRICK_ROW_COUNT; r++){
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        }
    }
}

// Создаем функцию которая будет рисовать наш шарик.
function drawBall() {
    CTX.beginPath();
    CTX.arc(BallX, BallY, BALL_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
}

// Создаем функцию которая будет рисовать платформу.
function drawPaddle() {
    CTX.beginPath();
    CTX.rect(
        paddleX,
        CANVAS_NODE.height - PADDLE_HEIGHT,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );

    CTX.fill();
    CTX.closePath();
}

// Создаем функцию которая будет рисовать блоки.
function drawBricks() {
    for (let c=0; c<BRICK_COLUMN_COUNT; c++){
        for (let r=0; r< BRICK_ROW_COUNT; r++){
            if (bricks[c][r].status === 1) {

                const BRICK_X = r * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET;
                const BRICK_Y = c * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET;

                bricks[c][r].x = BRICK_X;
                bricks[c][r].y = BRICK_Y;

                CTX.beginPath();
                CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
                CTX.fill();
                CTX.closePath();
            }
        }
    }
}

// Создаем функцию которая будет рисовать  счёт.
function drawScore() {
    CTX.fillText("Счет: " + score, 8, 20);
}

// Создаем функцию которая будет рисовать наш количество жизней.
function drawLives() {
    CTX.fillText("Жизней: " + lives, CANVAS_NODE.width - 85,20);
}

// Создаем функцию которая будет подмечать столкновения шарика с блоками. Если шарик коснется блока то блок исчезнет. Также она имеет свойство если вся блоки исчезнут то игра закончится.
function detectCollision() {
    for (let c=0; c<BRICK_COLUMN_COUNT; c++) {
        for (let r=0; r<BRICK_ROW_COUNT; r++){
            let brick = bricks[c][r];

            if (brick.status === 1) {
                const isCollisionTrue = 
                BallX > brick.x &&
                 BallX < brick.x + BRICK_WIDTH &&
                BallY > brick.y &&
                 BallY < brick.y + BRICK_HEIGHT;

                if (isCollisionTrue) {
                    dy = -dy;
                    brick.status = 0;

                    score++;

                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT){
                        alert("Вы победили!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//  Данный код Сделает чтобы функция handleMouseMove работала в игре.
document.addEventListener('mousemove',handleMouseMove);

// Создаем функцию с помощъю которой мы будем управлять нашей платформой при помощи мышки.
function handleMouseMove(e) {

    const RELATIVE_X = e.clientX - CANVAS_NODE.offsetLeft;

    if (RELATIVE_X >0 && RELATIVE_X < CANVAS_NODE.width) {
    paddleX = RELATIVE_X - PADDLE_WIDTH/2;
    }
}

// Создаем функцию которая будет выводить на экран нарисованные обьекты. Она также будет отвечать за конец игры; если количество жизней будет 0 то игра закончится
function draw() {
    CTX.clearRect(0, 0, CANVAS_NODE.width, CANVAS_NODE.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollision();

    if (
        BallX + dx < BALL_RADIUS ||
        BallX + dx > CANVAS_NODE.width - BALL_RADIUS
    ) {
        dx = -dx;
    }
    if (BallY + dy < BALL_RADIUS) {
        dy = -dy;
    }

    if (BallY + dy > CANVAS_NODE.height - BALL_RADIUS) {
        if (BallX > paddleX && BallX < paddleX + PADDLE_WIDTH) {
            dy = -dy;
        } else {
            lives--;

            if (lives === 0) {
                alert("Игра закончена");

                document.location.reload();
            } else {
                BallX = CANVAS_NODE.width / 2;
                BallY = CANVAS_NODE.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    BallX += dx;
    BallY += dy;

    requestAnimationFrame(draw);
}

//Запускаем функцию.
draw();
