(function() {
  ﻿;
  var root, socket;
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  socket = io.connect('http://localhost:3030');
  PubSub.subscribe('createItem', function(msg, data) {
    if ((data.payload.text != null) && data.payload.text !== '') {
      return socket.emit('createItem', data);
    }
  });
  socket.on('itemCreated', function(data) {
    return PubSub.publish('itemCreated', data);
  });
  PubSub.subscribe('itemCreated', function(msg, data) {
    if ((data.payload.text != null) && data.payload.text !== '') {
      return root.viewmodel.items.push(data.payload.text);
    }
  });
}).call(this);
