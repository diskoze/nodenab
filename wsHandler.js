// wsHandler.js
const WebSocket = require('ws');
const { clients } = require('./tcpHandler');

function setupWebSocketServer(port) {
    const wss = new WebSocket.Server({ port });
    console.log(`WebSocket Server listening on port ${port}`);

    wss.on('connection', (ws) => {
        console.log('New WebSocket client connected');
        clients.add(ws);
        ws.on('close', () => clients.delete(ws));
    });

    return wss;
}

module.exports = { setupWebSocketServer };