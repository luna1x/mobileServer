var express = require('express');
var socketio = require('socket.io');
var http = require('http');

function start(httpHandle, socketHandle) {
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);

    var port = process.env.PORT || 8888;

    server.listen(port, function() {
        console.log('Server has started by in use port : ' + port);
    });

    httpHandle(app);

    // io.sockets.on('connection', function (socket) {
    //     socketHandle(io, socket);
    // });
}

exports.start = start;