redis = require 'redis'
colors = require './colors'
store = require './storage'
items = require './itemAggregate'

map = {
    mappings:  {
            createItem: 'itemCreated',
            changeItem: 'itemChanged',
            deleteItem: 'itemDeleted'
    }
    ,
    toEvent: (cmd) -> 
        cmd.id = cmd.id + '_event_0'
        cmd.event = if @mappings[cmd.command]? then @mappings[cmd.command] else 'unknown'
        cmd.command = undefined
        return cmd
}

publisher = {
    evt: redis.createClient()
    ,
    publish: (evts) ->
        msg = JSON.stringify(evts[0])
        
        console.log colors.green('\npublishing event to redis:')
        console.log(msg)
        
        # todo: walk array (for sagas only -> comes a lot later)
        @evt.publish('events', msg)
}

class CommandHandler
    
    constructor: () ->
        @evt = redis.createClient()
        
    handle: (cmd) -> 
        cmdName = cmd.command
        id  = cmd.payload.id ? null
        
        # load aggregate
        store.load id, (err, item) ->
            # apply change
            evt = map.toEvent(cmd)
            console.log colors.magenta('apply new event ' + evt.event + ' to aggregate')
            item[cmdName] evt, (err, uncommitted) ->
                if (err)
                    console.log colors.red err
                    # do something meaningful -> error queue?
                else
                    # save events
                    store.save item, (err) ->
                        if (!err)
                            publisher.publish(item.uncommittedEvents)
                            

handler = new CommandHandler()

exports.handle = handler.handle
