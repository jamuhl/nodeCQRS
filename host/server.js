// server.js is the starting point of the host process:
//
// `node server.js` 
var express = require('express')
  , colors = require('./app/colors')
  , handler = require('./app/eventDenormalizer')
  , socket = require('socket.io');

// create an configure:
//
// - express webserver
// - socket.io socket communication from/to browser
var app = express.createServer()
  , io = socket.listen(app);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express['static'](__dirname + '/public'));
    
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/app/views');
});

io.configure(function() {
    io.set('log level', 1);
});

// BOOTSTRAPPING
console.log('\nBOOTSTRAPPING:'.cyan);

console.log('1. -> routes'.cyan);
require('./app/routes').actions(app);

console.log('2. -> message hub'.cyan);
var hub = require('./app/hub');

// SETUP COMMUNICATION CHANNELS

// on receiving __commands__ from browser via socket.io emit them on the ĥub module (which will 
// forward it to redis pubsub)
io.sockets.on('connection', function(socket) {
    var conn = socket.handshake.address.address + ":" + socket.handshake.address.port;
    console.log(colors.magenta(conn + ' -- connects to socket.io'));
    
    socket.on('commands', function(data) {
        console.log(colors.magenta('\n' + conn + ' -- sends command ' + data.command + ':'));
        console.log(JSON.stringify(data, null, 4));

        hub.emit(data.command, conn, data);
    });
});

// on receiving an __event__ from redis via the hub module:
//
// - let it be handled from the eventDenormalizer to update the viewmodel storage
// - forward it to connected browsers via socket.io
hub.on('events', function(data) {
    console.log(colors.cyan('eventDenormalizer -- denormalize event ' + data.event));
    handler.handle(data, null, 4);
    
    console.log(colors.magenta('\nsocket.io -- publish event ' + data.event + ' to browser'));
    io.sockets.emit('events', data);
});

// START LISTENING
var port = 3000;
console.log(colors.cyan('\nStarting server on port ' + port));
app.listen(port);