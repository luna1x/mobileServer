var stressTestSuite = require('./stressTestSuite');

stressTestSuite.run(1, 1000, function (i) {
  var options = {
    hostname: '54.250.134.172',
    port: 8888,
    method: 'GET',
    path: '/login?platformID=1&phoneNumber='+i
  };

  return options;
});
