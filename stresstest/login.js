var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

process.argv[2] = 1;
process.argv[3] = 1;

if (4 > process.argv.length) {
  console.log('You must insert begin and end number');
  return;
}

if (cluster.isMaster) {
  for  (var i=0; i<numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + 'died');
  });
}

function calcBandwidth (index)
{
  var from = process.argv[2];
  var to = process.argv[3];
  var bandWidth = to - from;

  var dividedBandWidth = parseInt(bandWidth / numCPUs, 10);
  var dividedBandWidthRemain = bandWidth % numCPUs;

  var dividedFrom = (index-1)*dividedBandWidth+1;

  if (numCPUs > index)
    return { from : dividedFrom, to : dividedBandWidth*index };
  else
    return { from : dividedFrom, to : dividedBandWidth*index + dividedBandWidthRemain+1 };
}



cluster.on('fork', function(worker) {
  console.log(calcBandwidth(worker.id));

  var fromto = calcBandwidth(worker.id);

  onFork(fromto.from, fromto.to);
});

function onFork(from, to)
{
  for (var i=from; i<=to; i++)
  {
    setTimeout(requestLogin, 50*i, i);
  }
}

function requestLogin (phoneNumber) {
  var options = {
    hostname: '54.250.134.172',
    port: 8888,
    path: '/login?platformID=1&phoneNumber=1',
    method: 'GET'
  };

  options.path = '/login?platformID=1&phoneNumber=' + phoneNumber;

  console.log(options.path);

  var reqDate = new Date();

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);

      var resDate = new Date();
      var responseTime =  resDate.getMilliseconds() - reqDate.getMilliseconds();
      console.log('responseTime : ' + responseTime);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
}
