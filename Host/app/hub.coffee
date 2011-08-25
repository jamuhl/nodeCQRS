redis = require 'redis'
colors = require './colors'

#-----------------------------------------------------------------
# CHANNELS

cmd = redis.createClient()
evt = redis.createClient()

#-----------------------------------------------------------------
# EXPORTS

exports.emit = (commandName, sender, message) ->
    msg = {
        id: message.id,
        command: commandName,
        sender: sender,
        payload: message.payload
    }

    data = JSON.stringify(msg)
    console.log colors.blue('hub -- publishing command ' + commandName + ' to redis:')
    console.log data
    cmd.publish('commands', data)
    
exports.on = (name, callback) ->
    evt.on 'message', (channel, message) ->
        console.log colors.green('hub -- received event ' + name + ' from redis:')
        console.log message
        msg = JSON.parse(message)
        
        data = {
            id: msg.id,
            payload: msg.payload
        }
        
        callback(data)
        
evt.subscribe('events')
