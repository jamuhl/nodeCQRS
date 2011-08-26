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
    console.log colors.blue('\nreceived command from redis:')
    console.log(message)
    
    console.log '-> handle command'
    
    msg = JSON.parse(message)
    
    msg.event = if (msg.command == 'createItem') then 'itemCreated' else 'itemDeleted'
    msg.command = null
    
    if msg.payload.id?
        message = JSON.stringify(msg)
        
        console.log colors.green('\npublishing event to redis:')
        console.log(message)
        
        evt.publish('events', message)
    else
        # get an new id from redis
        evt.incr 'nextItemId', ( err, id ) ->
            msg.payload.id = 'item:' + id
            message = JSON.stringify(msg)
        
            console.log colors.green('\npublishing event to redis:')
            console.log(message)
            
            evt.publish('events', message)

cmd.subscribe('commands')

#-----------------------------------------------------------------
# START

#port = options.port || 3000
console.log 'Starting service'.cyan

