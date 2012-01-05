var store = require ('./storage')
  , async = require ('async')
  , colors = require ('./colors');

var eventHandler = {
    
    handle: function(evt) {
        eventHandler[evt.event](evt);
    },

    itemCreated: function(evt) {
        store.save({id: evt.payload.id, text: evt.payload.text}, function(err) {});
    },

    itemChanged: function(evt) {
        store.load(evt.payload.id, function(err, item) {
            item.text = evt.payload.text;
            store.save(item, function(err) {});
        });
    },

    itemDeleted: function(evt) {
        store.del(evt.payload.id, function(err) {});
    }
    
};

exports.handle = eventHandler.handle;