const callNumberButton = document.getElementById('call-number');
const resetNumbersButton = document.getElementById('reset-numbers');
const calledNumbersDiv = document.getElementById('called-numbers');

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
        calledNumbersDiv.textContent = `Called Numbers: ${data.calledNumbers.join(', ')}`;
    } else if (data.type === 'new-number') {
        updateCalledNumbers(data.number);
    } else if (data.type === 'reset-numbers') {
        resetCalledNumbers();
    }
});

callNumberButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'call-number' }));
});

resetNumbersButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'reset-numbers' }));
});

function updateCalledNumbers(number) {
    calledNumbersDiv.textContent += `, ${number}`;
}

function resetCalledNumbers() {
    calledNumbersDiv.textContent = 'Called Numbers: ';
}
