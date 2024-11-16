const board = document.getElementById('game-board');
const currentScoreElement = document.getElementById('current-score');
const bestScoreElement = document.getElementById('best-score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

bestScoreElement.textContent = bestScore;

// Create the grid
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        alert('Game Over! Final Score: ' + score);
        updateBestScore();
        resetGame();
        return;
    }
    if (isFoodEaten()) {
        growSnake();
        generateFood();
        score++;
        currentScoreElement.textContent = score;
    }
    render();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function isFoodEaten() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function growSnake() {
    const tail = snake[snake.length - 1];
    snake.push({ x: tail.x, y: tail.y });
}

function generateFood() {
    food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
}

function render() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'food'));

    snake.forEach(segment => {
        const index = segment.y * gridSize + segment.x;
        cells[index].classList.add('snake');
    });

    const foodIndex = food.y * gridSize + food.x;
    cells[foodIndex].classList.add('food');
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    currentScoreElement.textContent = score;
    generateFood();
}

// Run game loop every 100ms
setInterval(gameLoop, 100);
