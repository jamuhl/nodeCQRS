var redis = require('redis')
  , colors = require('./colors')
  , async = require('async')
  , items = require('./itemAggregate')
  , eventstore = require('eventstore')
  , storage = require('eventstore.redis');

var db = redis.createClient();

var publisher = {
    
    evt: redis.createClient(),

    publish: function(evt) {
        var msg = JSON.stringify(evt, null, 4);

        console.log(colors.green('\npublishing event to redis:'));
        console.log(msg);

        publisher.evt.publish('events', msg);
    }
      
};

// eventstore
var es = eventstore.createStore({logger: 'console'});

storage.createStorage(function(err, db) {
    es.configure(function(){
        es.use(db);
        es.use(publisher);
    });

    es.start();
});


// commandHandler
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



var commandHandler = {
    
    handle: function(cmd) {
        
        var cmdName = cmd.command
          , id = cmd.payload.id
          , evt = map.toEvent(cmd);

        evt.time = new Date();

        async.waterfall([

            function(callback) {
                if (!id) {
                    db.incr('nextItemId', function(err, id) {
                        var newId = 'item:' + id;
                        
                        console.log(colors.cyan('create a new aggregate with id= ' + newId));
                        
                        callback(null, items.create(newId));
                    });
                } else {
                    console.log(colors.cyan('create existing aggregate with id= ' + id));
                    
                    callback(null, items.create(id));
                }
            },

            function(item, callback) {
                
                console.log(colors.cyan('load history for id= ' +  item.id));
                es.getEventStream(id, 0, function(err, stream) {                    
                    callback(null, item, stream);
                });
            },

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