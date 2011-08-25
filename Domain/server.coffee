redis = require 'redis'
colors = require './app/colors'

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
evt = redis.createClient()

cmd.on 'message', (channel, message) ->
    console.log colors.blue('received command from redis: ' + message)
    
    console.log 'handle command: ' + message
    
    console.log colors.green('publishing event to redis: ' + message)
    
    evt.publish('events', message)

cmd.subscribe('commands')

#-----------------------------------------------------------------
# START

#port = options.port || 3000
console.log 'Starting service'.cyan

