var server = require('./server/server');
var httpHandlers = require('./server/httpHandlers');
var socketHandlers = require('./server/socketHandlers');
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", function(worker, code, signal) {
    cluster.fork();
  });
} else {
	server.start(httpHandlers.handle, socketHandlers.handle);
}
