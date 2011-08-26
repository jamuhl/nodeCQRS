#-----------------------------------------------------------------
# ROOT 
root = exports ? this

# append some objects
#scqrs = if root.scqrs then root.scqrs else {}
#scqrs.messaging = if scqrs.messaging then scqrs.messaging else {}

# http://stackoverflow.com/questions/4825812/clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
# Array::removeElement = (e) -> @[t..t] = [] if (t = @.indexOf(e)) > -1

class Item
    
    constructor: (id, text) ->
        @id = id
        @text = ko.observable(text)

class ViewModel
    
    constructor: ->
        @items = ko.observableArray([])
        @newItem = ko.observable('')
        
    createItem: ->
        PubSub.publish('createItem', {id: new ObjectId().toString(), payload: {text: @newItem()}})
        @newItem('')
        
    deleteItem: (item) ->
        PubSub.publish('deleteItem', {id: new ObjectId().toString(), payload: {id: item.id}})


# Update viewmodel
PubSub.subscribe 'itemCreated', (msg, data) ->
	if data.payload.text? && data.payload.text != ''
        item = new Item(data.payload.id, data.payload.text)
		root.viewmodel.items.push(item)
        
PubSub.subscribe 'itemDeleted', (msg, data) ->
    for item in root.viewmodel.items()
        do (item) ->
            root.viewmodel.items.remove(item) if item.id == data.payload.id
        
#-----------------------------------------------------------------
# BIND

# add a viewmodel to root
root.viewmodel = new ViewModel()
root.item = Item

# bind
ko.applyBindings(root.viewmodel)
