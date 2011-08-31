(function() {
  ﻿;
  var root, socket;
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  socket = io.connect('http://localhost:3031');
  socket.on('events', function(data) {
    return PubSub.publish('events', data);
  });
  socket.on('commands', function(data) {
    return PubSub.publish('commands', data);
  });
}).call(this);
