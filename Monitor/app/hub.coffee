redis = require 'redis'
colors = require './colors'

#-----------------------------------------------------------------
# CHANNELS

msg = redis.createClient()

subscriptions = []

#-----------------------------------------------------------------
# EXPORTS
    
exports.on = (channel, callback) ->
    subscriptions.push({channel: channel, callback: callback})
    console.log colors.blue('hub -- subscribers: ' + subscriptions.length)
    
msg.on 'message', (channel, message) ->
    for subscriber in subscriptions
        do (subscriber) ->
            if (channel == subscriber.channel)
                data = JSON.parse(message)          
                subscriber.callback(data)
        
msg.subscribe('events')
msg.subscribe('commands')
