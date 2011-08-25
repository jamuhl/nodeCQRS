redis = require 'redis'
colors = require './colors'
map = require './msgmap'

#-----------------------------------------------------------------
# CHANNELS

cmd = redis.createClient()
evt = redis.createClient()

#-----------------------------------------------------------------
# EXPORTS

exports.emit = (commandName, sender, message) ->
    data = map.to(commandName, sender, message) 
    console.log colors.blue('hub -- publishing command ' + commandName + ' to redis:')
    console.log data
    cmd.publish('commands', data)
    
exports.on = (name, callback) ->
    evt.on 'message', (channel, message) ->
        console.log colors.green('hub -- received event ' + name + ' from redis:')
        console.log message
        data = map.from(name, message)
        callback(data)
        
evt.subscribe('events')
