var chat = require('./chat');
var chatRoomManager = chat.get();

function handle (io, socket, redisClient) {
    chatRoomManager.onSocketConnection(io, socket, redisClient);

    socket.on('login', chatRoomManager.onLogin);
    socket.on('createRoom', chatRoomManager.onCreateRoom);
    socket.on('joinRoom', chatRoomManager.onJoinRoom);
    socket.on('chat', chatRoomManager.onChat);
    socket.on('leaveRoom', chatRoomManager.onLeaveRoom);
}

exports.handle = handle;