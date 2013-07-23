var stressTestSuite = require('./stressTestSuite');

stressTestSuite.run(1, 5000, function (i) {
  var options = {
    // hostname: 'localhost',
    hostname: '54.249.67.106',
    port: 8888,
    method: 'GET',
    path: '/login?platformID=1&phoneNumber='+i
  };

  return options;
});

