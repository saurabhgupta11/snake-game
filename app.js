var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
let score = 0;
let isPaused = false;
let snake = {
    x: 0,
    y: 0,
    cells: [],
};
let apple = {
    x: 0,
    y: 0,
};

/*-------------------Local Storage-----------------------*/
/*-------------------------------------------------------*/

window.addEventListener('load', e => {
    getSnakeCoordinates();
    getAppleCoordinates();
    getScore();
});

function getSnakeCoordinates() {
    if (!localStorage.snake) {
        snake = {
            x: 160,
            y: 160,
            cells: [{ x: 160, y: 160 }, { x: 144, y: 160 }]
        }
    }
    else {
        snake = JSON.parse(localStorage.getItem('snake'));
    }
}

function getAppleCoordinates() {
    if (!localStorage.apple) {
        apple = {
            x: 320,
            y: 320,
        }
    } else {
        apple = JSON.parse(localStorage.getItem('apple'));
    }
}

function getScore() {
    if (!localStorage.score) {
        score = 0;
    } else {
        score = JSON.parse(localStorage.getItem('score'));
        document.getElementById('score').textContent = 'Score: ' + `${score}`;
    }
}

function storeDataInLocalStorage() {
    localStorage.snake = JSON.stringify(snake);
    localStorage.setItem('apple', JSON.stringify(apple));
    localStorage.setItem('score', score);
}

/*-------------------Local Storage-----------------------*/
/*-------------------------------------------------------*/


// draw apple
function drawApple(x, y) {
    context.fillStyle = 'red';
    context.fillRect(x, y, grid, grid);
}
drawApple(apple.x, apple.y);

// draw snake
function drawSnake() {
    for (let i = 0; i < snake.cells.length; i++) {
        if (i == 0) {
            context.fillStyle = 'rgb(139,0,139)';
            context.fillRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
            context.strokeStyle = 'rgb(75,0,130)';
            context.strokeRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
        }
        else {
            context.fillStyle = 'rgb(34,139,34)';
            context.fillRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
            context.strokeStyle = 'rgb(0,100,0)';
            context.strokeRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
        }
    }
}
drawSnake();

// let eventOrInterval = 0;

function moveSnake(dx, dy) {
    checkCollision();
    snake.x += dx;
    snake.y += dy;
    snake.cells.unshift({ x: snake.x, y: snake.y }); // Insert at 0th position
    snake.cells.pop();  // remove the last element
    isPaused = false;
    checkCollision();
}

// listen to keyboard events to move the snake

let dir = '';

document.addEventListener('keydown', function (e) {
    let dx = 0, dy = 0;
    let key = e.keyCode;
    // left arrow key
    if (key == 37 && dir.localeCompare('LEFT') != 0 && dir.localeCompare("RIGHT") != 0) {
        dx = -grid;
        dy = 0;
        dir = "LEFT";
        isPaused = true;
        moveSnake(dx, dy);
    }
    // up arrow key
    else if (key == 38 && dir.localeCompare('UP') != 0 && dir.localeCompare("DOWN") != 0) {
        dy = -grid;
        dx = 0;
        dir = "UP";
        isPaused = true;
        moveSnake(dx, dy);
    }
    // right arrow key
    else if (key == 39 && dir.localeCompare('RIGHT') != 0 && dir.localeCompare("LEFT") != 0) {
        dx = grid;
        dy = 0;
        dir = "RIGHT";
        isPaused = true;
        moveSnake(dx,dy);
    }
    // down arrow key
    else if (key == 40 && dir.localeCompare('DOWN') != 0 && dir.localeCompare("UP") != 0) {
        dy = grid;
        dx = 0;
        dir = "DOWN";
        isPaused = true;
        moveSnake(dx, dy);
    }
    else if (key == 80) {
        storeDataInLocalStorage();
        isPaused = true;
    }
    else if (key == 82) {
        isPaused = false;
    }
});

function checkCollision() {
    if (snake.x == (canvas.width) || snake.x == (0 - grid) || snake.y == (canvas.height) || snake.y == (0 - grid)) {
        clearInterval(game);
        setTimeout(function () {
            alert("you hit the wall");
        }, 10);
        localStorage.clear();
        location.reload();
    }
    else if (snake.x == apple.x && snake.y == apple.y) {
        document.getElementById('score').textContent = 'Score: ' + `${++score}`;
        // context.fillStyle = 'purple';
        // context.fillRect(apple.x, apple.y, grid, grid);
        generateNewApple();
        increaseSnakeLength();
    }
    else if (checkBodyCollision()) {
        clearInterval(game);
        setTimeout(function () {
            alert("You ran into your body");
        }, 10);
        localStorage.clear();
        location.reload();
    }
}

function checkBodyCollision() {
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.x == snake.cells[i].x && snake.y == snake.cells[i].y) {
            return true;
        }
    }
    return false;
}

function generateNewApple() {

    // generating apple in such a way that it doesn't collide with body
    while (true) {
        apple.x = Math.floor(Math.random() * 25 + 0) * (grid);
        apple.y = Math.floor(Math.random() * 25 + 0) * (grid);
        let flag = false;
        for (let i = 0; i < snake.cells.length; i++) {
            if (apple.x == snake.cells[i].x && apple.y == snake.cells[i].y) {
                flag = true;
            }
        }
        if (flag == false)
            break;
    }
    drawApple(apple.x, apple.y);
}

function increaseSnakeLength() {
    let tailX = snake.cells[snake.cells.length - 1].x;
    let tailY = snake.cells[snake.cells.length - 1].y;
    let tailObj = new Object();
    tailObj.x = tailX;
    tailObj.y = tailY;
    snake.cells.push(tailObj);
}

function drawGame() {
    if(isPaused == false) {
        context.clearRect(0, 0, canvas.width, canvas.height);// Clear the Canvas
        drawSnake();
        drawApple(apple.x, apple.y);

        if (dir.localeCompare("LEFT") == 0) {
            moveSnake(-grid, 0);
        }
        else if (dir.localeCompare("RIGHT") == 0) {
            moveSnake(grid, 0);
        }
        else if (dir.localeCompare("DOWN") == 0) {
            moveSnake(0, grid);
        }
        else if (dir.localeCompare("UP") == 0) {
            moveSnake(0, -grid);
        }

        checkCollision();
    }
}

let game = setInterval(drawGame, 100);
