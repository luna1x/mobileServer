var express = require('express');
var url = require('url');
var socketio = require('socket.io');
var http = require('http');

function start(requestHandle, socketHandle, redisClient) {
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);

    var port = process.env.PORT || 8888;

    server.listen(port, function() {
        console.log('Server has started by in use port : ' + port);
    });

    requestHandle(app);

    io.sockets.on('connection', function (socket) {
        socketHandle(io, socket, redisClient);
    });
}

exports.start = start;