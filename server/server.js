// modules
var express = require('express')
  , http = require('http')
  , morgan = require('morgan');

// configuration files
var configServer = require('./lib/config/server');

// app parameters
var app = express();
app.set('port', configServer.httpPort);
app.use(express.static(configServer.staticFolder));
app.use(morgan('dev'));

// serve index
require('./lib/routes').serveIndex(app, configServer.staticFolder);

// HTTP server
var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('HTTP server listening on port ' + app.get('port'));
});

// WebSocket server
var io = require('socket.io')(server);
var socketList = [];
var broadcaster = require('./lib/routes/socket')(socketList);
io.on('connection', (socket) => {
  socketList.push(socket)
  socket.on('disconnect',function() {
    let i = socketList.indexOf(socket);
    socketList.splice(i,1);
  })
});

module.exports.app = app;