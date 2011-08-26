(function() {
  ﻿;
  var root, socket;
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  socket = io.connect('http://localhost:3030');
  PubSub.subscribe('commands', function(msg, data) {
    return socket.emit('commands', data);
  });
  socket.on('events', function(data) {
    return PubSub.publish('events', data);
  });
}).call(this);
