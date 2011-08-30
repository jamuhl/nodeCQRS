store = require './storage'
async = require 'async'
colors = require './colors'


class EventHandler
    
    constructor: () ->
        
    handle: (evt) =>         
        @[evt.event](evt)
        
    itemCreated: (evt) ->
        store.save {id: evt.payload.id, text: evt.payload.text}, (err) ->
            
    itemChanged: (evt) ->
        store.load evt.payload.id, (err, item) ->
            item.text = evt.payload.text
            store.save {id: item.id, text: evt.payload.text}, (err) ->
            
    itemDeleted: (evt) -> 
        store.delete evt.payload.id, err ->
            


handler = new EventHandler()

exports.handle = handler.handle
