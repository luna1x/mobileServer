var redis = require("../db/redis.js").get();

function login(request, response) {
	var platformID = request.param('platformID');
	var phoneNumber = request.param('phoneNumber');

	var i = phoneNumber;
	// if (2490 == i || 4990 == i || 7490 == i || 9990 == i ||
	//       10 == i || 2510 == i || 5010 == i || 7510 == i)
	// 	  console.log('req : ' + new Date() + ' , '  + i);

	redis.AIDLookUP(platformID, phoneNumber, function (AIDKey, AID) {
		if (null === AID)
		{
			createAccount(redis, response, send, AIDKey, i);
		}
		else
		{			
			getAccount(redis, response, send, AID, i);
		}
	});
}


function createAccount(redis, response, send, AIDKey, i)
{
	var redisMaster = redis.master();

	// redisMaster.incr('AID:gen', function(err, AID) {
	// 	redisMaster.hset('AID:lookup', AIDKey, AID, function (err) {
	// 		var level = 1;
	// 		var createDate = new Date().toUTCString();

	// 		var redisShard = redis.shard(AID);
	// 		var multi = redisShard.multi();
	// 		multi.hset('AID:'+AID, 'level', level);
	// 		multi.hset('AID:'+AID, 'createDate', createDate);
	// 		multi.exec(function (err, replies) {
	// 			if (err)
	// 				console.log(err);

	// 			send(response, level, createDate);
	// 		});
	// 	});
	// });

	send(response, 1, 1, i);
}

function getAccount(redis, response, send, AID, i)
{
	// var redisShard = redis.shard(AID);

	// var multi = redisShard.multi();
	// multi.hget('AID:'+AID, 'level');
	// multi.hget('AID:'+AID, 'createDate');

	// multi.exec(function (err, replies) {
	// 	if (err)
	// 		console.log(err);

	// 	send(response, Number(replies[0]), replies[1]);
	// });

	send(response, 1, 1, i);

	
}

function send(response, level, createDate, i)
{
	var info = {
		level : level,
		createDate : createDate
	};

	response.writeHead(200, { 'Content-Type': 'text/html'});
	response.end(JSON.stringify(info));
	
	// if (2490 == i || 4990 == i || 7490 == i || 9990 == i ||
	// 	10 == i || 2510 == i || 5010 == i || 7510 == i)
	// 	console.log('response : ' + new Date() + ' , '  + i);
}

exports.login = login;
