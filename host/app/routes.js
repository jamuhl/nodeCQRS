var store = require('./storage');

exports.actions = function(app) {

    app.get('/', function(req, res) {
        res.render('index');
    });
        
    app.get('/allItems.json', function(req, res) { 
        store.loadAll(function(err, items) {
            if (err) res.json({});
                
            res.json(items);
        });
    });

};