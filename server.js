// server.js
const net = require('net');
const WebSocket = require('ws');
const { handleTCPConnection } = require('./tcpHandler');
const { setupWebSocketServer } = require('./wsHandler');

const TCP_PORT = 4000;
const WS_PORT = 8080;

// Create TCP Server
const tcpServer = net.createServer(handleTCPConnection);
tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP Server listening on port ${TCP_PORT}`);
});

// Create WebSocket Server
const wss = setupWebSocketServer(WS_PORT);

module.exports = { wss };
