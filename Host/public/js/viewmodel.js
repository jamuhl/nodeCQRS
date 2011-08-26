(function() {
  ﻿;
  var Item, ViewModel, root;
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  Item = (function() {
    function Item(id, text) {
      this.id = id;
      this.text = ko.observable(text);
    }
    return Item;
  })();
  ViewModel = (function() {
    function ViewModel() {
      this.items = ko.observableArray([]);
      this.newItem = ko.observable('');
    }
    ViewModel.prototype.createItem = function() {
      PubSub.publish('createItem', {
        id: new ObjectId().toString(),
        payload: {
          text: this.newItem()
        }
      });
      return this.newItem('');
    };
    ViewModel.prototype.deleteItem = function(item) {
      return PubSub.publish('deleteItem', {
        id: new ObjectId().toString(),
        payload: {
          id: item.id
        }
      });
    };
    return ViewModel;
  })();
  PubSub.subscribe('itemCreated', function(msg, data) {
    var item;
    if ((data.payload.text != null) && data.payload.text !== '') {
      item = new Item(data.payload.id, data.payload.text);
    }
    return root.viewmodel.items.push(item);
  });
  PubSub.subscribe('itemDeleted', function(msg, data) {
    var item, _i, _len, _ref, _results;
    _ref = root.viewmodel.items();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push((function(item) {
        if (item.id === data.payload.id) {
          return root.viewmodel.items.remove(item);
        }
      })(item));
    }
    return _results;
  });
  root.viewmodel = new ViewModel();
  root.item = Item;
  ko.applyBindings(root.viewmodel);
}).call(this);
