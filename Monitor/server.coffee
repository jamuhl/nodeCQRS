express = require 'express'
stylus = require 'stylus'
colors = require './app/colors'

app = express.createServer()
io = require('socket.io').listen(3031)

#-----------------------------------------------------------------
# CONFIGURATION

## express
app.configure ->
    app.use express.logger('dev')
    app.use express.bodyParser()
    app.use express.compiler({
        src: __dirname + '/app/assets', 
        dest: __dirname + '/public',
        enable: ['coffeescript'] })
    app.use stylus.middleware({
        src: __dirname + '/app/assets', 
        dest: __dirname + '/public',
        compress: true })
    app.use express.static(__dirname + '/public')
    
    app.set 'view engine', 'jade'
    app.set 'views', __dirname + '/app/views'

# run NODE_ENV=development coffee server.coffee
app.configure 'development', ->
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })
    
app.configure 'production', ->
    app.use express.errorHandler()

## socket.io
io.configure ->
    io.set('log level', 1)

io.configure 'development', ->
    io.set('log level', 3)
    io.set('transports', ['websocket'])
    
io.configure 'production', ->
    io.enable('browser client minification');
    io.enable('browser client etag')
    io.set('log level', 1)
    io.set('transports', ['websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    ])



#-----------------------------------------------------------------
# OPTIONS

argv = []
options = {}
for arg in process.argv
    if arg.substr(0, 2) == '--'
        parts = arg.split '='
        options[parts[0].substr(2).replace('-', '_')] = parts[1] || true
    else
        argv.push arg

#-----------------------------------------------------------------
# APP BOOTSTRAPPING
console.log '\nBOOTSTRAPPING:'.cyan

# routes
console.log '1. -> routes'.cyan
require('./app/routes').actions app, argv, options

# messaging
console.log '2. -> message hub'.cyan
hub = require('./app/hub')

# send commands
io.sockets.on 'connection', (socket) ->
    user = socket.handshake.address.address + ":" + socket.handshake.address.port
    console.log colors.magenta(user + ' -- connects to socket.io')

# receive events
hub.on 'events', (data) ->
    io.sockets.emit 'events', data
    
hub.on 'commands', (data) ->
    io.sockets.emit 'commands', data

#-----------------------------------------------------------------
# START

port = options.port || 3001
console.log colors.cyan('\nStarting monitor on port ' + port)
app.listen port if !module.parent
