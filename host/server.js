var express = require('express')
  , colors = require('./app/colors')
  , handler = require('./app/eventDenormalizer')
  , socket = require('socket.io');

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

// COMMUNICATION
io.sockets.on('connection', function(socket) {
    var conn = socket.handshake.address.address + ":" + socket.handshake.address.port;
    console.log(colors.magenta(conn + ' -- connects to socket.io'));
    
    socket.on('commands', function(data) {
        console.log(colors.magenta('\n' + conn + ' -- sends command ' + data.command + ':'));
        console.log(JSON.stringify(data, null, 4));

        hub.emit(data.command, conn, data);
    });
});

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