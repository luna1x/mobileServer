var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function handle(app) {
	app.get('/', start);
	app.get('start', start);
	app.get('faviconIco', faviconIco);
}

function start(request, response) {
	fs.readFile('HTMLPage.html', 'utf8', function(err, data) {
		response.writeHead(200, {'content-type' : 'text/html'});
		response.end(data);
	});
}

function faviconIco() {
}

exports.handle = handle;