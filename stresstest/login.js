var stressTestSuite = require('./stressTestSuite');

stressTestSuite.run(1, 10000, function (i) {
  var options = {
    hostname: 'localhost',
    // hostname: '192.168.123.100',
    port: 8888,
    method: 'GET',
    path: '/login?platformID=1&phoneNumber='+i
  };

  return options;
});

