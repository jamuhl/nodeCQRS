#-----------------------------------------------------------------
# ROOT 
root = exports ? this

# append some objects
#scqrs = if root.scqrs then root.scqrs else {}
#scqrs.messaging = if scqrs.messaging then scqrs.messaging else {}

# http://stackoverflow.com/questions/4825812/clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
# Array::removeElement = (e) -> @[t..t] = [] if (t = @.indexOf(e)) > -1

class Message

    constructor: (message, elapsed) -> 
        @id = message.id
        @name = message.command ? message.event
        @time = message.time
        @sender = message.sender
        @raw = message
        @raw_str = JSON.stringify(message)
        @payload = message.payload
        @payload_str = JSON.stringify(message.payload)
        @elapsed = elapsed ? 'unkown'

class MessageRoundTrip
    
    constructor: (command) ->
        @id = command.id
        @command = new Message(command)
        @events = ko.observableArray([])

class ViewModel
    
    constructor: ->
        @items = ko.observableArray([])
        @last = ko.observable(0)
        @_avg = ko.observable(0)
        @_avg_event_count = ko.observable(0)
        @average = ko.dependentObservable =>
            return Math.ceil(@_avg())
        
    addCommand: (command) ->
        @items.push(new MessageRoundTrip(command))
        

        
#-----------------------------------------------------------------
# BOOTSTRAPPER

# add a viewmodel to root
root.viewmodel = viewmodel = new ViewModel()
root.msgRoundTrip = MessageRoundTrip

# bind
ko.applyBindings(root.viewmodel)

# Update viewmodel
PubSub.subscribe 'commands', (msg, data) ->
    data.time = new Date(data.time)
    viewmodel.addCommand(data)

PubSub.subscribe 'events', (msg, data) ->
    data.time = new Date(data.time)
    match = null
    for c in viewmodel.items()
        if match
            break
        
        match = c if data.id.indexOf(c.id) > -1
        
    if match
        milliseconds = data.time.getTime() - match.command.time.getTime()
        viewmodel.last(milliseconds)
        
        avg = (viewmodel._avg() * viewmodel._avg_event_count() + milliseconds) / (viewmodel._avg_event_count() + 1)
        viewmodel._avg(avg)
        viewmodel._avg_event_count(viewmodel._avg_event_count() + 1)
        
        match.events.push(new Message(data, milliseconds))
        
