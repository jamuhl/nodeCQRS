store = require './storage'

exports.actions = (app, argv, options) ->

    app.get '/', (req, res) -> 
        res.render 'index', { title: 'Set title for index page in routes.coffee' }
        
    # add more actions here
    app.post '/allItems.json', (req, res) -> 
        res.contentType('json');
        
        store.loadAll (err, items) ->
            if err
                res send ''
                
            res.send items
