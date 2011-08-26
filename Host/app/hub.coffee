redis = require 'redis'
colors = require './colors'
map = require './msgmap'

#-----------------------------------------------------------------
# CHANNELS

cmd = redis.createClient()
evt = redis.createClient()


subscriptions = []

#-----------------------------------------------------------------
# EXPORTS

exports.emit = (commandName, sender, message) ->
    data = map.to(commandName, sender, message) 
    console.log colors.blue('\nhub -- publishing command ' + commandName + ' to redis:')
    console.log data
    cmd.publish('commands', data)
    
exports.on = (channel, callback) ->
    subscriptions.push({channel: channel, callback: callback})
    console.log colors.blue('hub -- subscribers: ' + subscriptions.length)
    
evt.on 'message', (channel, message) ->
    for subscriber in subscriptions
        do (subscriber) ->
            if (channel == subscriber.channel)
                data = map.from(subscriber.channel, message)
                
                console.log colors.green('\nhub -- received event ' + data.event + ' from redis:')
                console.log message
                
                subscriber.callback(data)
        
evt.subscribe('events')
