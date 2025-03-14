const WebSocket = require('ws');

const clients = new Set();
let lastUpdate = 0;
let delayedMessage = null;
let delayTimeout = null;

function handleTCPConnection(socket) {
    console.log('PHP API connected');
    
    socket.on('data', (data) => {
        const now = Date.now();
        const message = data.toString().trim();
        const elapsedTime = now - lastUpdate;
        console.log(`Received from PHP: ${message}`);

        if (elapsedTime >= 5000) {
            // If 5 seconds have passed, send immediately
            lastUpdate = now;
            broadcastToClients(message);
        } else {
            // If less than 5 seconds, schedule it for later
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

module.exports = { handleTCPConnection, clients };
