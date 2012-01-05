var redis = require('redis')
  , colors = require('./app/colors')
  , handler = require('./app/commandHandler');


var cmd = redis.createClient();

cmd.on('message', function(channel, message) {
    console.log(colors.blue('\nreceived command from redis:'));
    console.log(message);
    
    console.log(colors.cyan('\n-> handle command'));
    handler.handle(JSON.parse(message));
});

cmd.subscribe('commands');

console.log('Starting domain service'.cyan);