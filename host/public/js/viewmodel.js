// the viewmodel holds the actual data and is bound to the html page in bootstrap.js
//
// - using [knockout.js MVVM](http://knockoutjs.com/) 

(function() {

    // an object for a single item
    var Item = function(id, text) {
        this.id = id;
        this.text = ko.observable(text);
    };

    // the viewmodel:
    // 
    // - holding a collection of items
    // - mapping UI events to commands
    var ViewModel = function() {
        this.items = ko.observableArray([]);
        this.newItem = ko.observable('');
        this.selectedItem= ko.observable('');
    };

    ViewModel.prototype = {

        // UI event to select an item
        selectItem: function(item) {
            this.selectedItem(item);
        },

        // __Commands:__   
        // are published via PubSub
        createItem: function() {
            PubSub.publish('commands', {
                id: new ObjectId().toString(), 
                command: 'createItem', 
                payload: { text: this.newItem() }
            });
            this.newItem('');
        },
            
        changeItem: function() {
            var id = this.selectedItem().id
              , text = this.selectedItem().text();

            this.selectedItem('');

            PubSub.publish('commands', {
                id: new ObjectId().toString(), 
                command: 'changeItem', 
                payload: { id: id, text: text }
            });
        },
                    
        deleteItem: function(item) {
            PubSub.publish('commands', {
                id: new ObjectId().toString(), 
                command: 'deleteItem', 
                payload: { id: item.id }
            });
        },

        // __Events:__   
        // received from socket.io and passed in through 
        // PubSub.
        _itemCreated: function(id, text) {
            this.items.push(new Item(id, text));
        },
            
        _itemChanged: function(id, text) {
            $.each(this.items(),function(i, item) {
                if (item.id === id) {
                    item.text(text);
                }
            });
        },
            
        _itemDeleted: function(id) {
            var self = this;
            $.each(this.items(),function(i, item) {
                if (item.id === id) {
                    self.items.remove(item);
                }
            });
        }
        
    };

    window.ViewModel = ViewModel;
  
})();