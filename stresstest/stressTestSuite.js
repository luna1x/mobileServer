var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

function run (from, to, makeOptions)
{
  if (cluster.isMaster) {
    for  (var i=0; i<numCPUs; i++) {
      cluster.fork();
    }
  }
  else
  {
    var testDelay = 1;
    var bandWidth = calcBandwidth(from, to, cluster.worker.id);
    for (var j=bandWidth.from; j<=bandWidth.to; j++)
    {
      httpRequest(makeOptions, j);
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + 'died');
    });
  }
}

function httpRequest (makeOptions,i) {
  var options = makeOptions(i);
  var reqDate = new Date();

  var req = http.request(options, function(res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // console.log(i);
      console.log(chunk);

      var resDate = new Date();
      var responseTime =  resDate.getMilliseconds() - reqDate.getMilliseconds();
      console.log('responseTime : ' + responseTime);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}

function calcBandwidth (from, to, index)
{
  var bandWidth = to - from;

  var dividedBandwidth = parseInt(bandWidth / numCPUs, 10);
  var dividedBandwidthRemain = bandWidth % numCPUs;

  var dividedFrom = (index-1)*dividedBandwidth+1;

  if (numCPUs > index)
    return { from : dividedFrom, to : dividedBandwidth*index };
  else
    return { from : dividedFrom, to : dividedBandwidth*index + dividedBandwidthRemain+1 };
}

exports.run = run;