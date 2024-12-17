const cells = document.querySelectorAll('.cell');
const winnerMessage = document.getElementById('winner-message');
const resetButton = document.getElementById('reset-button');
let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameOver = false;

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            displayWinner(`${currentPlayer} Wins!`);
            launchConfetti();
            return;
        }
    }

    if (!board.includes(null)) {
        displayWinner("It's a Draw!");
        launchConfetti();
        gameOver = true;
    }
}

function displayWinner(message) {
    winnerMessage.textContent = message;
    winnerMessage.classList.add('animate');
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] || gameOver) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    winnerMessage.textContent = '';
    winnerMessage.classList.remove('animate');
    currentPlayer = 'X';
    gameOver = false;
}

function launchConfetti() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 2,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            p.size *= 0.99;
        });
        particles.forEach((p, i) => { if (p.size < 0.5) particles.splice(i, 1); });
        if (particles.length) requestAnimationFrame(render);
        else document.body.removeChild(canvas);
    }
    render();
}

cells.forEach((cell, i) => {
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
