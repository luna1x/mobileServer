var redis = require("../db/redis.js").get();

function reward(request, response) {
	var platformID = request.param('platformID');
	var phoneNumber = request.param('phoneNumber');

	redis.AIDLookUP(platformID, phoneNumber, function (AIDKey, AID) {
		if (null === AID)
			return;

		var redisShard = redis.shard(AID);
		redisShard.hincrby('AID:'+AID, 'level', 1, function (err, level) {
			if (err)
				console.log(err);
			send(response, level);
		});
	});
}

function send(response, level)
{
	var info = {
		level : level
	};

	response.end(JSON.stringify(info));
}


exports.reward = reward;