(function() {
  ﻿;
  var ViewModel, root;
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  ViewModel = (function() {
    function ViewModel() {
      this.items = ko.observableArray([]);
      this.newItem = ko.observable('');
    }
    ViewModel.prototype.createItem = function() {
      PubSub.publish('createItem', {
        text: this.newItem()
      });
      return this.newItem('');
    };
    return ViewModel;
  })();
  root.viewmodel = new ViewModel();
  ko.applyBindings(root.viewmodel);
}).call(this);
