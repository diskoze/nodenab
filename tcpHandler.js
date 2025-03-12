// tcpHandler.js
const clients = new Set();
let lastUpdate = 0;

function handleTCPConnection(socket) {
    console.log('PHP API connected');
    socket.on('data', (data) => {
        const now = Date.now();
        if (now - lastUpdate >= 5000) {
            lastUpdate = now;
            const message = data.toString().trim();
            console.log(`Received from PHP: ${message}`);
            broadcastToClients(message);
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