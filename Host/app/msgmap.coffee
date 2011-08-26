#-----------------------------------------------------------------
# MAPPINGS

commandMap = {
    createItem: (commandName, sender, message) ->
        msg = {
            id: message.id,
            command: commandName,
            sender: sender,
            payload: message.payload
        }
        JSON.stringify(msg)
    , default: (commandName, sender, message) ->
        msg = {
            id: message.id,
            command: commandName,
            sender: sender,
            payload: message.payload
        }
        JSON.stringify(msg)
}

eventMap = {
    itemCreated: (eventName, message) ->
        msg = JSON.parse(message)
        data = {
            id: msg.id,
            payload: msg.payload
        }
    , default: (eventName, message) ->
        msg = JSON.parse(message)
        data = {
            id: msg.id,
            payload: msg.payload
        }
}



#-----------------------------------------------------------------
# EXPORTS

exports.to = (commandName, sender, message) ->
    if commandMap[commandName]?
        commandMap[commandName](commandName, sender, message)
    else
        commandMap['default'](commandName, sender, message)
    
    
exports.from = (eventName, message) ->
    if eventMap[eventName]?
        eventMap[eventName](eventName, message)
    else
        eventMap['default'](eventName, message)
