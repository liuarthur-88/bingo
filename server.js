const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let calledNumbers = [];

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', ws => {
    console.log('New client connected');
    
    // Send the current called numbers to the new client
    ws.send(JSON.stringify({ type: 'init', calledNumbers }));

    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'call-number') {
            const number = getRandomNumber(1, 72, calledNumbers);
            calledNumbers.push(number);

            // Broadcast the new number to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'new-number', number }));
                }
            });
        } else if (data.type === 'reset-numbers') {
            calledNumbers = [];

            // Broadcast the reset event to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'reset-numbers' }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function getRandomNumber(min, max, exclude) {
    let num;
    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(num));
    return num;
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
