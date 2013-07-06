var server = require('./server/server');
var httpHandlers = require('./server/httpHandlers');
var socketHandlers = require('./server/socketHandlers');

server.start(httpHandlers.handle, socketHandlers.handle);