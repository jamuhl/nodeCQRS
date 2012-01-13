// the hub coordinates communication between webserver and browser:
//
// __commands__: viewmodel -> webserver _-> redis -> domain_    
// __events__: viewmodel <- webserver _<- redis <- domain_
//
// communication between browser and webserver goes through socket.io.
// between socket.io and viewmodel the communication is passed through 
// pubsub module.

(function() {

    socket = io.connect('http://localhost:3000');

    // on getting a command on the __commands__ channel emit 
    // the command via socket.io to the server.
    //
    // commands will be emitted from viewmodel
    PubSub.subscribe('commands', function(msg, data) {
        socket.emit('commands', data);
    });

    // on receiving an event from the server via socket.io 
    // publish the event on PubSub.
    //
    // in bootstrap.js we subscribe to the __events__ channel 
    // and map it to viewmodel functions
    socket.on('events', function(data) {
        PubSub.publish('events', data);
    });
  
})();
