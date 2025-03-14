const WebSocket = require('ws');
const { clients, getLatestJackpotState } = require('./tcpHandler');

function setupWebSocketServer(port) {
    const wss = new WebSocket.Server({ port });
    console.log(`WebSocket Server listening on port ${port}`);

    wss.on('connection', (ws) => {
        console.log('New WebSocket client connected');
        clients.add(ws);

        // Send the latest jackpot state if available
        const latestJackpot = getLatestJackpotState();
        if (latestJackpot) {
            ws.send(latestJackpot);
        }

        ws.on('close', () => clients.delete(ws));
    });

    return wss;
}

module.exports = { setupWebSocketServer };
