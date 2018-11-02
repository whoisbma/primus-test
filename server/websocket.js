'use strict';

const Primus = require('primus');
const http = require('http');

const transformers = {
  WEBSOCKETS: 'websockets',
  ENGINEIO: 'engine.io', 
  SOCKJS: 'sockjs'
};

class WebsocketServer {
  constructor(app, port) {
    this.onConnection = this.onConnection.bind(this);
    this.onDisconnection = this.onDisconnection.bind(this);

    const server = http.createServer(app);
    this.primus = new Primus(server, {
      transformer: transformers.WEBSOCKETS
    });

    this.primus.on('connection', this.onConnection);
    this.primus.on('disconnection', this.onDisconnection);
    this.startServer(app, server, port);
  }

  startServer(app, server, port) {
    server.listen(port, function() {
      console.log("websocket server listening on port " + port);
    });

    if (process.env.NODE_ENV === 'development') {
      app.get('/primus.js', (req, res) => {
        res.send(this.primus.library());
      });
    }

    if (process.env.NODE_ENV === 'production') {
      this.primus.save(__dirname + '/../client/primus.js');
    }
  }

  onConnection(spark) {
    console.log("got connection");
    spark.on('data', this.onData.bind(this, spark));
  }

  onDisconnection(spark) {
    console.log("connection lost");
  }

  onData(spark, data) {
    console.log("server got data");
    console.log(data);
  }

}

module.exports = WebsocketServer;