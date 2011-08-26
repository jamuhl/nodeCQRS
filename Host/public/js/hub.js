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
  PubSub.subscribe('deleteItem', function(msg, data) {
    return socket.emit('deleteItem', data);
  });
  socket.on('itemCreated', function(data) {
    return PubSub.publish('itemCreated', data);
  });
  socket.on('itemDeleted', function(data) {
    return PubSub.publish('itemDeleted', data);
  });
}).call(this);
