function chatRoomManager () {
	var io;
	var socket;
	var redisClient;

	function enterLoby() {
		redisClient.smembers("roomIDs", function (err, roomIDs) {
			var multi = redisClient.multi();

			for (var i in roomIDs) {
				var roomID = roomIDs[i];
				multi.get("room:"+roomID+":title");
				multi.get("room:"+roomID+":hostUserID");
			}

			multi.exec(function (err, replies) {
				var roomShortInfo = [];
				for (var i in roomIDs) {
					roomShortInfo.push({id:roomID, title:replies[i]});
				}

				io.sockets.sockets[socket.id].emit('enterLoby', roomShortInfo);
			});
		});
	}

	function joinRoom(roomID, userID) {
        redisClient.sismember("roomIDs", roomID, function(err, existRoomID) {
			if (!existRoomID)
				return;

			var multi = redisClient.multi();
			multi.sadd("room:"+roomID+":userIDs", userID);
			multi.smembers("room:"+roomID+":userIDs");
			multi.lrange("room:"+roomID+":chats", 0, 10000);

			multi.exec(function (err, replies) {
				var userIDs = replies[1];
				var chats = replies[2];

				socket.join(roomID);

				var chatList = [];
				for(var i in chats) {
					var reply = chats[i];
					if (undefined === reply)
						continue;

					var chat = JSON.parse(reply);
					chatList.push(chat);
				}

				var command = {
				userIDs : userIDs,
				chatList : chatList,
				roomID : roomID,
				userID : userID};

				io.sockets['in'](roomID).emit('joinRoom', command);
			});
		});
    }

	var that = {};
	that.onLogin = function(userID) {
        io.sockets.sockets[socket.id].emit('login', userID);
        enterLoby();
    };

    that.onCreateRoom = function(command) {
		redisClient.incr("maxRoomID", function(err, roomID) {
			redisClient.sadd("roomIDs", roomID, function() {

				var multi = redisClient.multi();
				multi.set("room:"+roomID+":title", command.title);
				multi.set("room:"+roomID+":hostUserID", command.hostUserID);

				multi.exec(function (err, replies) {
					joinRoom(roomID, command.hostUserID);
				});
			});
		});
    };

    that.onJoinRoom = function(command) {
		joinRoom(command.roomID, command.userID);
    };

    that.onChat = function(command) {
		redisClient.sismember("roomIDs", command.roomID, function(err, existRoomID) {
			if (!existRoomID)
				return;
			redisClient.sismember("room:"+command.roomID+":userIDs", command.userID, function(err, existUserID) {
				if (!existUserID)
					return;

				redisClient.rpush("room:"+command.roomID+":chats", JSON.stringify(command));
				io.sockets['in'](command.roomID).emit('chat', command);
			});
		});
    };

    that.onLeaveRoom = function(command) {
        redisClient.sismember("roomIDs", command.roomID, function(err, existRoomID) {
			if (!existRoomID)
				return;

			redisClient.srem("room:"+command.roomID+":userIDs", command.userID, function(err, reply) {
				redisClient.scard("room:"+command.roomID+":userIDs", function (err, length) {
					if (0 < length) {
						io.sockets['in'](command.roomID).emit('leaveRoom', command);
						enterLoby();
					}
					else {
						var multi = redisClient.multi();
						multi.srem("roomIDs", command.roomID);
						multi.del("room:"+command.roomID+":userIDs");
						multi.del("room:"+command.roomID+":chats");
						multi.del("room:"+command.roomID+":title");
						multi.del("room:"+command.roomID+":hostUserID");

						multi.exec(function (err, replies) {
							io.sockets['in'](command.roomID).emit('leaveRoom', command);
							enterLoby();
						});
					}
				});
			});
		});
	};

    that.onSocketConnection = function(_io, _socket, _redisClient) {
		io = _io;
		socket = _socket;
		redisClient = _redisClient;
    };

	return that;
}

var chatRoomManagerObj;

function get () {
	if (chatRoomManagerObj === undefined) {
		chatRoomManagerObj = chatRoomManager();
	}

	return chatRoomManagerObj;
}

exports.get = get;