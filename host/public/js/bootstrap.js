(function() {
    
    var viewmodel = window.viewmodel = new window.ViewModel();

    // initial load data
    $.ajax({
        url: '/allItems.json',
        success: function(data, status, xhr){
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                viewmodel.items.push(new window.Item(item.id, item.text));
            }
        },
        dataType: "json"
    });

    // bind view
    ko.applyBindings(viewmodel);

    // updates
    PubSub.subscribe('events', function(msg, data) {
        if (data.event === 'itemCreated') {
            window.viewmodel._itemCreated(new window.Item(data.payload.id, data.payload.text));
        } else if (data.event === 'itemChanged') {
            window.viewmodel._itemChanged(data.payload.id, data.payload.text);
        } else if (data.event === 'itemDeleted') {
            window.viewmodel._itemDeleted(data.payload.id);
        }
    });

})();