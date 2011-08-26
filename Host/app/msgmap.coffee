#-----------------------------------------------------------------
# MAPPINGS

map = {}

map.to = {
    channelNeedsCustom: (channel, sender, message) ->
        msg = {
            id: message.id,
            command: message.command,
            sender: sender,
            payload: message.payload
        }
        JSON.stringify(msg)
    , default: (channel, sender, message) ->
        msg = {
            id: message.id,
            command: message.command,
            sender: sender,
            payload: message.payload
        }
        JSON.stringify(msg)
}

map.from = {
    channelNeedsCustom: (channel, message) ->
        msg = JSON.parse(message)
        data = {
            id: msg.id,
            event: msg.event,
            payload: msg.payload
        }
    , default: (channel, message) ->
        msg = JSON.parse(message)
        data = {
            id: msg.id,
            event: msg.event,
            payload: msg.payload
        }
}



#-----------------------------------------------------------------
# EXPORTS

exports.to = (channel, sender, message) ->
    if map.to[channel]?
        map.to[channel](channel, sender, message)
    else
        map.to['default'](channel, sender, message)
    
    
exports.from = (channel, message) ->
    if map.from[channel]?
        map.from[channel](channel, message)
    else
        map.from['default'](channel, message)
