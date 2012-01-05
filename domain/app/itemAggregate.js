var colors = require('./colors');

var Item = function(id) {
    this.id = id;
    this.text = '';
    this._destroy = false;
    this.uncommittedEvents = [];
};

Item.prototype = {

    createItem: function(evt, callback) {
        evt.payload.id = this.id;
        
        if (evt.payload.text === '') {
            callback(new Error('It is not allowed to set an item text to empty string.'));
        } else {
            this.apply(evt);
            callback(null, this.uncommittedEvents);
        }
    },
            
    changeItem: function(evt, callback) {
        if (evt.payload.text === '') {
            callback(new Error('It is not allowed to set an item text to empty string.'));
        } else {
            this.apply(evt);
            callback(null, this.uncommittedEvents);
        }
    },
            
    deleteItem: function(evt, callback) {
        this.apply(evt);
        callback(null, this.uncommittedEvents);
    },
        
    apply: function(evt) {     
        this['_' + evt.event](evt);

        if (!evt.fromHistory) {
            this.uncommittedEvents.push(evt);
        }
    },
        
    _itemCreated: function(evt) {
        this.text = evt.payload.text;
    },

    _itemChanged: function(evt) {
        this.text = evt.payload.text;
    },
    
    _itemDeleted: function(evt) {
        this._destroy = true;
    },

    loadFromHistory: function(history) {

        for (var i = 0, len = history.length; i < len; i++) {
            e = history[i].payload;
            e.fromHistory = true;
            this.apply(e);
        }
    }

};

        
exports.create = function(id) {
    return new Item(id);
};