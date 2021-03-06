'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const WebsocketServer = require('./websocket.js');

const app = express();

let websocketServer = new WebsocketServer(app, 1234);
app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

app.listen(8080, function() {
  console.log("express server listening on port 8080");
});

setInterval(function() {
  websocketServer.primus.write("hello from server");
}, 3000);