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
    
exports.on = (eventName, callback) ->
    subscriptions.push({eventName: eventName, callback: callback})
    console.log colors.blue('hub -- subscribers: ' + subscriptions.length)
    
evt.on 'message', (channel, message) ->
    for subscriber in subscriptions
        do (subscriber) ->
            if (message.indexOf(subscriber.eventName) > -1)
                console.log colors.green('\nhub -- received event ' + subscriber.eventName + ' from redis:')
                console.log message
                data = map.from(subscriber.eventName, message)
                subscriber.callback(data)
        
evt.subscribe('events')
