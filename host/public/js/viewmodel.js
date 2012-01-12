(function() {

    var Item = function(id, text) {
        this.id = id;
        this.text = ko.observable(text);
    };

    var ViewModel = function() {
        this.items = ko.observableArray([]);
        this.newItem = ko.observable('');
        this.selectedItem= ko.observable('');
    };

    ViewModel.prototype = {

        createItem: function() {
            PubSub.publish('commands', {
                id: new ObjectId().toString(), 
                command: 'createItem', 
                payload: { text: this.newItem() }
            });
            this.newItem('');
        },
        
        selectItem: function(item) {
            this.selectedItem(item);
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

        _itemCreated: function(item) {
            this.items.push(item);
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
    window.Item = Item;
  
})();