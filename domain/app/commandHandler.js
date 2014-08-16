// here all the magic happens to handle a command:
//
// - pass it to aggregation root
// - store the event to storage
// - publishing event back to redis

var redis = require('redis')
  , colors = require('./colors')
  , async = require('async')
  , items = require('./itemAggregate')
  , eventstore = require('eventstore');

// create a redis client - we will use this later to get new aggregateIds
var db = redis.createClient();

// create a publisher which we use later to publish committed events back.  
// just use another redis client and publish events to the _events channel_
var publisher = {
    
    evt: redis.createClient(),

    publish: function(evt) {
        var msg = JSON.stringify(evt, null, 4);

        console.log(colors.green('\npublishing event to redis:'));
        console.log(msg);

        publisher.evt.publish('events', msg);
    }
      
};

// for _EventSourcing_ we use [nodeEventStore](https://github.com/KABA-CCEAC/nodeEventStore):
//
// just create an instance and use one of the provided database providers
var es = eventstore({ type: 'redis' });

// configure the eventstore to use it and also inject the publisher implementation.
//
// finally start the eventstore instance so it will publish committed events to the provided 
// publisher.
es.useEventPublisher(publisher.publish);
es.init();

// for simplicity just map command names to event names. remove the command and change the message's id.
// in fact we just send back the received data with minor changes
var map = {

    mappings: {
            createItem: 'itemCreated',
            changeItem: 'itemChanged',
            deleteItem: 'itemDeleted'
    },

    toEvent: function(cmd) {
        cmd.id = cmd.id + '_event_0';
        cmd.event = map.mappings[cmd.command] ? map.mappings[cmd.command] : 'unknown';
        delete cmd.command;
        return cmd;
    }
};


// the commandHandler does the heavy lifting:
var commandHandler = {
    
    handle: function(cmd) {
        
        var cmdName = cmd.command
          , id = cmd.payload.id
          // __don't do this at home:__ for simplicity we create the event already outside the aggregate - in a real system 
          // you should create the event inside the aggregate (success or error), but as we only mirroring 
          // the command back we take this shortcut.
          , evt = map.toEvent(cmd);

        evt.time = new Date();

        async.waterfall([

            // create an instance of itemAggregate    
            // if the command provides no id (=createItem) - get a new id from redis db
            function(callback) {
                if (!id) {
                    es.getNewId(function(err, id) {
                        var newId = 'item:' + id;
                        
                        console.log(colors.cyan('create a new aggregate with id= ' + newId));
                        
                        callback(null, items.create(newId));
                    });
                } else {
                    console.log(colors.cyan('create existing aggregate with id= ' + id));
                    
                    callback(null, items.create(id));
                }
            },

            // load the eventstream (history) for the given id from eventstore
            function(item, callback) {
                
                console.log(colors.cyan('load history for id= ' +  item.id));
                es.getEventStream(item.id, function(err, stream) {                    
                    callback(null, item, stream);
                });
            },

            // handle the command on aggregate
            //
            // - call loadFromHistory to apply all past events
            // - call the function matching the commandName
            // - add the uncommitted event to the eventstream and commit it   
            //   the event will be published in eventstore after successful commit   
            function(item, stream, callback) {
                console.log(colors.cyan('apply existing events ' + stream.events.length));
                item.loadFromHistory(stream.events);


                console.log(colors.magenta('apply new event ' + evt.event + ' to aggregate'));
                item[cmdName](evt, function(err, uncommitted) {
                    if (err) {
                        console.log(colors.red(err));
                    } else {
                        stream.addEvent(uncommitted[0]);
                        stream.commit();
                    }
                });
            }

        ]);    

    }

};

exports.handle = commandHandler.handle;
