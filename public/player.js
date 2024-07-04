const bingoBoard = document.getElementById('bingo-board');
const generateBoardButton = document.getElementById('generate-board');
const calledNumbersDiv = document.getElementById('called-numbers');

let calledNumbers = [];
let boardNumbers = [];
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
        calledNumbers = data.calledNumbers;
        updateCalledNumbers();
    } else if (data.type === 'new-number') {
        calledNumbers.push(data.number);
        updateCalledNumbers();
    } else if (data.type === 'reset-numbers') {
        calledNumbers = [];
        generateBingoBoard();
        updateCalledNumbers();
    }
});

function generateBingoBoard() {
    bingoBoard.innerHTML = '';
    boardNumbers = [];

    for (let i = 0; i < 36; i++) {
        const number = getRandomNumber(1, 72, boardNumbers);
        boardNumbers.push(number);

        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = number;
        cell.dataset.number = number;

        bingoBoard.appendChild(cell);
    }
    // Clear the called numbers for this player
    calledNumbers = [];
    updateCalledNumbers();
}

function updateCalledNumbers() {
    calledNumbersDiv.textContent = `Called Numbers: ${calledNumbers.join(', ')}`;
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
        if (calledNumbers.includes(parseInt(cell.dataset.number))) {
            cell.classList.add('called');
        } else {
            cell.classList.remove('called');
        }
    });
}

function getRandomNumber(min, max, exclude) {
    let num;
    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(num));
    return num;
}

generateBoardButton.addEventListener('click', generateBingoBoard);
