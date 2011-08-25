#-----------------------------------------------------------------
# ROOT 
root = exports ? this

# append some objects
#scqrs = if root.scqrs then root.scqrs else {}
#scqrs.messaging = if scqrs.messaging then scqrs.messaging else {}

# http://stackoverflow.com/questions/4825812/clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
# Array::removeElement = (e) -> @[t..t] = [] if (t = @.indexOf(e)) > -1

class ViewModel
    
    constructor: ->
        @items = ko.observableArray([])
        @newItem = ko.observable('')
        
    createItem: ->
        PubSub.publish('createItem', {id: new ObjectId().toString(), payload: {text: @newItem()}})
        @newItem('')
        
        
#-----------------------------------------------------------------
# BIND

# add a viewmodel to root
root.viewmodel = new ViewModel()

# bind
ko.applyBindings(root.viewmodel)
