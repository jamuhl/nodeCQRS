redis = require 'redis'
async = require 'async'
colors = require './colors'

db = redis.createClient()

store = {
    load: (id, callback) -> 
        db.get 'readmodel:' + id, (err, data) ->
            if err
                callback err
                
            callback null, JSON.parse(data)
    ,
    
    loadAll: (callback) -> 
        db.smembers 'readmodel:items', (err, keys) ->
            if err
                callback err
                
            async.map keys, store.load, (err, items) ->
                if err
                    callback err
             
                callback null, items
    ,
    
    save: (item, callback) -> 
        db.sismember 'readmodel:items', item.id, (err, exists) ->
            if err
                callback err
                
            if (!exists)
                db.sadd 'readmodel:items', item.id
                
            db.set 'readmodel:' + item.id, JSON.stringify(item)
                    
            # todo pass errors
            callback null
    ,
    
    delete: (id, callback) ->
        db.srem 'readmodel:items', id, (err) ->
            if err
                callback err
                
            db.del id, (err) ->
                if err
                    callback err
                    
                callback null
}


exports.load = store.load
exports.loadAll = store.loadAll
exports.save = store.save
exports.delete = store.delete
