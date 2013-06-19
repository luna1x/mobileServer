var server = require('./server');
var requestHandlers = require('./requestHandlers');
var socketHandlers = require('./socketHandlers');

var redis = require('redis');
var url = require('url');

process.env.REDISCLOUD_URL = "redis://rediscloud:hUASkTEjmAlbh6De@pub-redis-18793.us-east-1-2.1.ec2.garantiadata.com:18793";

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
redisClient.auth(redisURL.auth.split(":")[1]);

server.start(requestHandlers.handle, socketHandlers.handle, redisClient);