(function() {
  ﻿;
  var Message, MessageRoundTrip, ViewModel, root, viewmodel;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  Message = (function() {
    function Message(message, elapsed) {
      var _ref;
      this.id = message.id;
      this.name = (_ref = message.command) != null ? _ref : message.event;
      this.time = message.time;
      this.sender = message.sender;
      this.raw = message;
      this.raw_str = JSON.stringify(message);
      this.payload = message.payload;
      this.payload_str = JSON.stringify(message.payload);
      this.elapsed = elapsed != null ? elapsed : 'unkown';
    }
    return Message;
  })();
  MessageRoundTrip = (function() {
    function MessageRoundTrip(command) {
      this.id = command.id;
      this.command = new Message(command);
      this.events = ko.observableArray([]);
    }
    return MessageRoundTrip;
  })();
  ViewModel = (function() {
    function ViewModel() {
      this.items = ko.observableArray([]);
      this.last = ko.observable(0);
      this._avg = ko.observable(0);
      this._avg_event_count = ko.observable(0);
      this.average = ko.dependentObservable(__bind(function() {
        return Math.ceil(this._avg());
      }, this));
    }
    ViewModel.prototype.addCommand = function(command) {
      return this.items.push(new MessageRoundTrip(command));
    };
    return ViewModel;
  })();
  root.viewmodel = viewmodel = new ViewModel();
  root.msgRoundTrip = MessageRoundTrip;
  ko.applyBindings(root.viewmodel);
  PubSub.subscribe('commands', function(msg, data) {
    data.time = new Date(data.time);
    return viewmodel.addCommand(data);
  });
  PubSub.subscribe('events', function(msg, data) {
    var avg, c, match, milliseconds, _i, _len, _ref;
    data.time = new Date(data.time);
    match = null;
    _ref = viewmodel.items();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (match) {
        break;
      }
      if (data.id.indexOf(c.id) > -1) {
        match = c;
      }
    }
    if (match) {
      milliseconds = data.time.getTime() - match.command.time.getTime();
      viewmodel.last(milliseconds);
      avg = (viewmodel._avg() * viewmodel._avg_event_count() + milliseconds) / (viewmodel._avg_event_count() + 1);
      viewmodel._avg(avg);
      viewmodel._avg_event_count(viewmodel._avg_event_count() + 1);
      return match.events.push(new Message(data, milliseconds));
    }
  });
}).call(this);
