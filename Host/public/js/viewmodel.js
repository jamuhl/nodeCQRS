(function() {
  ﻿;
  var Item, ViewModel, root, viewmodel;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      this.selectedItem = ko.observable('');
    }
    ViewModel.prototype.createItem = function() {
      PubSub.publish('commands', {
        id: new ObjectId().toString(),
        command: 'createItem',
        payload: {
          text: this.newItem()
        }
      });
      return this.newItem('');
    };
    ViewModel.prototype.selectItem = function(item) {
      return this.selectedItem(item);
    };
    ViewModel.prototype.changeItem = function() {
      this.selectedItem('');
      return PubSub.publish('commands', {
        id: new ObjectId().toString(),
        command: 'changeItem',
        payload: {
          id: this.selectedItem().id,
          text: this.selectedItem().text
        }
      });
    };
    ViewModel.prototype.deleteItem = function(item) {
      return PubSub.publish('commands', {
        id: new ObjectId().toString(),
        command: 'deleteItem',
        payload: {
          id: item.id
        }
      });
    };
    ViewModel.prototype._itemCreated = function(item) {
      return this.items.push(item);
    };
    ViewModel.prototype._itemChanged = function(id, text) {
      var item, _i, _len, _ref, _results;
      _ref = this.items();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(__bind(function(item) {
          if (item.id === id) {
            return item.text = text;
          }
        }, this)(item));
      }
      return _results;
    };
    ViewModel.prototype._itemDeleted = function(id) {
      var item, _i, _len, _ref, _results;
      _ref = this.items();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(__bind(function(item) {
          if (item.id === id) {
            return this.items.remove(item);
          }
        }, this)(item));
      }
      return _results;
    };
    return ViewModel;
  })();
  root.viewmodel = viewmodel = new ViewModel();
  root.item = Item;
  ko.applyBindings(root.viewmodel);
  PubSub.subscribe('events', function(msg, data) {
    if (data.event === 'itemCreated') {
      viewmodel._itemCreated(new Item(data.payload.id, data.payload.text));
    }
    if (data.event === 'itemChanged') {
      viewmodel._itemChanged(data.payload.id, data.payload.text);
    }
    if (data.event === 'itemDeleted') {
      return viewmodel._itemDeleted(data.payload.id);
    }
  });
}).call(this);
