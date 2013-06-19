var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function handle(server) {
	server.get('/', start);
	server.get('start', start);
	server.get('faviconIco', faviconIco);
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