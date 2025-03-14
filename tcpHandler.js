const WebSocket = require('ws');

const clients = new Set();
let lastUpdate = 0;
let delayedMessage = null;
let delayTimeout = null;
let latestJackpotState = null; // Store the latest jackpot message

function handleTCPConnection(socket) {
    console.log('PHP API connected');

    socket.on('data', (data) => {
        const now = Date.now();
        const message = data.toString().trim();
        latestJackpotState = message; // Update the stored jackpot state

        const elapsedTime = now - lastUpdate;

        if (elapsedTime >= 5000) {
            lastUpdate = now;
            console.log(`Received from PHP: ${message}`);
            broadcastToClients(message);
        } else {
            delayedMessage = message;
            const remainingTime = 5000 - elapsedTime;

            if (delayTimeout) clearTimeout(delayTimeout);

            delayTimeout = setTimeout(() => {
                lastUpdate = Date.now();
                console.log(`Delayed send: ${delayedMessage}`);
                broadcastToClients(delayedMessage);
                delayedMessage = null;
            }, remainingTime);
        }
    });

    socket.on('end', () => console.log('PHP API disconnected'));
}

function broadcastToClients(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function getLatestJackpotState() {
    return latestJackpotState; // Provide access to the latest jackpot state
}

module.exports = { handleTCPConnection, clients, getLatestJackpotState };
