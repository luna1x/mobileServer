var fs = require("fs");
var login = require("../logic/login.js");
var reward = require("../logic/reward.js");


function handle(app) {
	app.get('/login', login.login);
	app.get('/reward', reward.reward);

	app.get('faviconIco', faviconIco);
	app.get('/ping', ping);
}


function faviconIco() {
}

function ping(request, response) {
	response.writeHead(200, { 'Content-Type': 'text/html'});
	response.end('pong');
}

exports.handle = handle;