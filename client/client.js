'use strict';

let url = (window.location.hostname !== '') ? window.location.hostname : '127.0.0.1';
let port = 1234;
let primus = Primus.connect(`ws://${url}:${port}/`, {
  manual: true,
  reconnect: {
    max: 1000,
    min: 1,
    retries: Infinity,
    "reconnect timeout": 1000
  }
});

primus.on('open', function(spark) {
  console.log('connection opened');
});

primus.on('data', function(data) {
  console.log(data);
  primus.write("client got message");
});

primus.on('disconnect', function(data) {
  console.log("disconnected");
});

primus.open();