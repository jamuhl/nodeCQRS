var redis = require('redis')
  , colors = require('./colors')
  , map = require('./msgmap')
  , cmd = redis.createClient()
  , evt = redis.createClient()
  , subscriptions = [];

exports.emit = function(commandName, sender, message) {
    var data = map.to(commandName, sender, message);
    console.log(colors.blue('\nhub -- publishing command ' + commandName + ' to redis:'));
    console.log(data);
    cmd.publish('commands', data);
};
    
exports.on = function(channel, callback) {
    subscriptions.push({channel: channel, callback: callback});
    console.log(colors.blue('hub -- subscribers: ' + subscriptions.length));
};
    
evt.on('message', function(channel, message) {

    var data = map.from(channel, message);
    console.log(colors.green('\nhub -- received event ' + data.event + ' from redis:'));
    console.log(message);
    
    subscriptions.forEach(function(subscriber){
        if (channel === subscriber.channel) {
            subscriber.callback(data);
        }
    });
});
        
evt.subscribe('events');