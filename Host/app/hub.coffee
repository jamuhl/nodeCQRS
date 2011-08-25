redis = require 'redis'
colors = require './colors'

#-----------------------------------------------------------------
# CHANNELS

cmd = redis.createClient()
evt = redis.createClient()

#-----------------------------------------------------------------
# EXPORTS

exports.emit = (name, payload) ->
    data = JSON.stringify(payload)
    console.log colors.blue('hub -- publishing command ' + name + ' to redis: ' + data)
    cmd.publish('commands', data)
    
exports.on = (name, callback) ->
    evt.on 'message', (channel, message) ->
        console.log colors.green('hub -- received event ' + name + ' from redis: ' + message)
        callback(JSON.parse(message))
        
evt.subscribe('events')
