redis = require 'redis'
colors = require './app/colors'
handler = require './app/commandHandler'

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

cmd = redis.createClient()

cmd.on 'message', (channel, message) ->
    console.log colors.blue('\nreceived command from redis:')
    console.log(message)
    
    console.log colors.cyan('\n-> handle command')
    handler.handle(JSON.parse(message))

cmd.subscribe('commands')

#-----------------------------------------------------------------
# START

#port = options.port || 3000
console.log 'Starting service'.cyan

