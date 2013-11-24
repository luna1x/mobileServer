var redis = require('redis');

function redisManager () {
	/*
	var client = redis.createClient(6379, "54.249.67.106", {no_ready_check: true});
	client.auth("mobileserver");
	*/
	var that = {};
	/*
	that.shard = function (index) {
		return client;
	};
	that.master = function (index) {
		return client;
	};
	that.AIDLookUP = function (platformID, phoneNumber, cb) {
		var AIDKey = that.makeAIDKey(platformID, phoneNumber);

		var redisMaster = that.master();
		redisMaster.hget('AID:lookup', AIDKey, function (err, AID) {
			if (err)
				console.log(err);
			cb(AIDKey, AID);
		});
	};
	that.makeAIDKey = function (platformID, phoneNumber) {
		return platformID+':'+phoneNumber;
	};
	*/

	return that;
}

var redisManagerObj;

function get (index) {
	if (redisManagerObj === undefined) {
		redisManagerObj = redisManager();
	}

	return redisManagerObj;
}

exports.get = get;
