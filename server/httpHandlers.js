var fs = require("fs");
var login = require("../logic/login.js");
var reward = require("../logic/reward.js");


function handle(app) {
	app.get('/login', login.login);
	app.get('/reward', reward.reward);

	app.get('faviconIco', faviconIco);
}


function faviconIco() {
}

exports.handle = handle;