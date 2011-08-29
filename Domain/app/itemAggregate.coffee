colors = require './colors'

class Item
    
    constructor: (id) ->
        @id = id
        @text = ''
        @_destroy = false
        @uncommittedEvents = []
        
    createItem: (evt, callback) -> 
        evt.payload.id = @id
        
        if (evt.payload.text == '')
            callback new Error('It is not allowed to set an item text to empty string.')
        else
            @apply(evt)
            callback null, @uncommittedEvents.length
            
    changeItem: (evt, callback) ->
        if (evt.payload.text == '')
            callback new Error('It is not allowed to set an item text to empty string.')
        else
            @apply(evt)
            callback null, @uncommittedEvents.length
            
    deleteItem: (evt, callback) ->
        @apply(evt)
        callback null, @uncommittedEvents.length
        
    apply: (evt) ->      
        @['_' + evt.event] evt
        @uncommittedEvents.push(evt) if !evt.fromHistory
        
    _itemCreated: (evt) ->
        @text = evt.payload.text

    _itemChanged: (evt) ->
        @text = evt.payload.text
    
    _itemDeleted: (evt) ->
        @_destroy = true
        
    loadFromHistory: (history) ->
        for e in history
            e.fromHistory = true
            @apply(e)
        
exports.create = (id) ->
    return new Item(id)
