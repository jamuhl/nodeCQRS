// simple storage for loading, changing and deleting items

var redis = require('redis')
  , async = require('async')
  , colors = require('./colors');

var db = redis.createClient();

var store = {

    load: function(id, callback) {
        db.get('readmodel:' + id, function(err, data) {
            if (err) callback(err);
                
            callback(null, JSON.parse(data));
        });
    },
    
    loadAll: function(callback) {
        db.smembers('readmodel:items', function(err, keys) {
            if (err) callback(err);
                
            async.map(keys, store.load, function(err, items) {
                if (err) callback(err);
             
                callback(null, items);
            });
        });
    },
    
    save: function(item, callback) {
        db.sismember('readmodel:items', item.id, function(err, exists) {
            if (err) callback(err);
                
            if (!exists) db.sadd('readmodel:items', item.id);
                
            db.set('readmodel:' + item.id, JSON.stringify(item));
            
            callback(null);
        });
    },
    
    del: function(id, callback) {
        db.srem('readmodel:items', id, function(err) {
            if (err) callback(err);
                
            db.del(id, function(err) {
                if (err) callback(err);
                    
                callback(null);
            });
        });
    }
};

module.exports = store;