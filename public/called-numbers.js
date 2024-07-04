const calledNumbersDiv = document.getElementById('called-numbers');
let calledNumbers = [];

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
    console.log('Connected to the WebSocket server');
});

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
        calledNumbers = data.calledNumbers;
        updateCalledNumbers(calledNumbers);
    } else if (data.type === 'new-number') {
        calledNumbers.push(data.number);
        updateCalledNumbers(calledNumbers);
    } else if (data.type === 'reset-numbers') {
        resetCalledNumbers();
    }
});

socket.addEventListener('close', () => {
    console.log('Disconnected from the WebSocket server');
});

function updateCalledNumbers(numbers) {
    calledNumbersDiv.innerHTML = numbers.map(number => `<span class="called-number">${number}</span>`).join(', ');
}

function resetCalledNumbers() {
    calledNumbers = [];
    calledNumbersDiv.innerHTML = '';
}
