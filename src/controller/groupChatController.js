const websocket = require('ws');

const web_socket_server = new websocket.Server({port:8080});
clients = []
web_socket_server.on('connection', function(ws, req){
    const clientId = req.headers['client_identifier'];
    console.log('Client connected with ID:', clientId);

    ws.on('message', function incoming(message){
        console.log('Received message from client', clientId, ':', message);
    })
})

module.exports = web_socket_server;