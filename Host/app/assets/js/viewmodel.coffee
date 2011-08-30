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
        @selectedItem = ko.observable('')
        
    createItem: ->
        PubSub.publish('commands', {id: new ObjectId().toString(), command: 'createItem', payload: {text: @newItem()}})
        @newItem('')
    
    selectItem: (item) ->
        @selectedItem(item)
        
    changeItem: ->
        id = @selectedItem().id
        text = @selectedItem().text()
        @selectedItem('')
        PubSub.publish('commands', {id: new ObjectId().toString(), command: 'changeItem', payload: {id: id, text: text}})
                
    deleteItem: (item) ->
        PubSub.publish('commands', {id: new ObjectId().toString(), command: 'deleteItem', payload: {id: item.id}})
        
    _itemCreated: (item) ->
        @items.push(item)
        
    _itemChanged: (id, text) ->
        for item in @items()
            do (item) =>
                if item.id == id
                    item.text(text)
        
    _itemDeleted: (id) ->
        for item in @items()
            do (item) =>
                @items.remove(item) if item.id == id

        
#-----------------------------------------------------------------
# BOOTSTRAPPER

# add a viewmodel to root
root.viewmodel = viewmodel = new ViewModel()
root.item = Item

# load data
$.post 'allItems.json', (data) ->
    for item in data
        viewmodel.items.push new Item(item.id, item.text)

# bind
ko.applyBindings(root.viewmodel)

# Update viewmodel
PubSub.subscribe 'events', (msg, data) ->
    if data.event == 'itemCreated'
        viewmodel._itemCreated(new Item(data.payload.id, data.payload.text))
        
    if data.event == 'itemChanged'
        viewmodel._itemChanged(data.payload.id, data.payload.text)
        
    if data.event == 'itemDeleted'
        viewmodel._itemDeleted(data.payload.id)
