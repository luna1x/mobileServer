var stressTestSuite = require('./stressTestSuite');

stressTestSuite.run(1, 10000, function (i) {
  var options = {
    hostname: 'lob-989701275.ap-northeast-1.elb.amazonaws.com',
    port: 8888,
    method: 'GET',
    path: '/reward?platformID=1&phoneNumber='+i
  };

  return options;
});

