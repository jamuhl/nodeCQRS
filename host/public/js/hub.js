(function() {

  socket = io.connect('http://localhost:3000');

  PubSub.subscribe('commands', function(msg, data) {
      socket.emit('commands', data);
  });

  socket.on('events', function(data) {
      PubSub.publish('events', data);
  });
  
})();
