redis = require 'redis'
async = require 'async'
colors = require './colors'
items = require './itemAggregate'


db = redis.createClient()

store = {
    load: (id, callback) -> 
        loaded = null
        
        async.waterfall [
            # create an empty aggregate (with newId if necessary)
            (callback) -> 
                if (id == null)
                    db.incr 'nextItemId', (err, id) ->
                        newId = 'item:' + id
                        
                        console.log colors.cyan('create a new aggregate with id= ' + newId)
                        
                        callback null, items.create(newId)
                else
                    console.log colors.cyan('create existing aggregate with id= ' + id)
                    
                    callback null, items.create(id)
            , 
            # load history from redis
            (item, callback) ->
                console.log colors.cyan('load history for id= ' +  item.id)
                db.lrange 'events:' + item.id, 0, -1, (err, data) ->
                    if (err)
                        callback err
                        
                    arr = []
                    for e in data
                        arr.push(JSON.parse(e))
                        
                    callback null, item, arr
            ,
            # load aggregate from history
            (item, history, callback) ->
                console.log colors.cyan('apply existing events ' + history.length)
                item.loadFromHistory(history)
                loaded = item
                callback null
        ], 
        (err) ->
            if err
                callback err
            else
                callback null, loaded
    ,
    
    save: (item, callback) -> 
        console.log colors.magenta('store events for id= ' + item.id)
        for e in item.uncommittedEvents
            evt = JSON.stringify(e) 
            console.log evt
            db.lpush 'events:' + item.id, evt
                
        # todo pass errors
        callback null                    
}
        
exports.load = store.load
exports.save = store.save
