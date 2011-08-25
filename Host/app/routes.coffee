exports.actions = (app, argv, options) ->

    app.get '/', (req, res) -> 
        res.render 'index', { title: 'Set title for index page in routes.coffee' }
        
    # add more actions here
