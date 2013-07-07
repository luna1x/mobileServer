var redis = require("../db/redis.js").get();

function login(request, response) {
	var platformID = request.param('platformID');
	var phoneNumber = request.param('phoneNumber');

	redis.AIDLookUP(platformID, phoneNumber, function (AIDKey, AID) {
		if (null === AID)
		{
			console.log('create');
			createAccount(redis, response, send, AIDKey);
		}
		else
		{
			console.log('get');
			getAccount(redis, response, send, AID);
		}
	});
}


function createAccount(redis, response, send, AIDKey)
{
	var redisMaster = redis.master();

	redisMaster.incr('AID:gen', function(err, AID) {
		redisMaster.hset('AID:lookup', AIDKey, AID, function (err) {
			var level = 1;
			var createDate = new Date().toUTCString();

			var redisShard = redis.shard(AID);
			var multi = redisShard.multi();
			multi.hset('AID:'+AID, 'level', level);
			multi.hset('AID:'+AID, 'createDate', createDate);
			multi.exec(function (err, replies) {
				if (err)
					console.log(err);

				send(response, level, createDate);
			});
		});
	});
}

function getAccount(redis, response, send, AID)
{
	var redisShard = redis.shard(AID);

	var multi = redisShard.multi();
	multi.hget('AID:'+AID, 'level');
	multi.hget('AID:'+AID, 'createDate');

	multi.exec(function (err, replies) {
		if (err)
			console.log(err);

		send(response, Number(replies[0]), replies[1]);
	});
}

function send(response, level, createDate)
{
	var info = {
		level : level,
		createDate : createDate
	};

	response.writeHead(200, { 'Content-Type': 'text/html'});
	response.end(JSON.stringify(info));
}

exports.login = login;