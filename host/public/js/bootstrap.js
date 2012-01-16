// bootstap glues the clientside together:
//
// - create a viewmodel object using [knockout.js MVVM](http://knockoutjs.com/) 
// and bind it to the html page.
// - As events are passed from webserver to browser via [socket.io](http://socket.io/) to 
// apply incrementel updates on clientside too, we map events from it to matching viewmodel 
// functions

(function() {
    
    // create a new viewmodel object
    var viewmodel = window.viewmodel = new window.ViewModel();
    window.Item = function(id, text) {this.id = id; this.text = text};

    // readside of _CQRS_: we load all items on initial load and add them 
    // to the viewmodels itemcollection 
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

    // bind the viewmodel to the current html page
    ko.applyBindings(viewmodel);

    // different to classical _CQRS_ approaches we don't reload the item, instead we denormalize the 
    // event on clientside, too
    //
    // to decouple incoming events from socket.io we use an own _PubSub_ module (alternative would 
    // be to use jquery bind on a dom object).
    //
    // each event gets mapped to a viewmodel function
    PubSub.subscribe('events', function(msg, data) {
        if (data.event === 'itemCreated') {
            window.viewmodel._itemCreated(data.payload.id, data.payload.text);
        } else if (data.event === 'itemChanged') {
            window.viewmodel._itemChanged(data.payload.id, data.payload.text);
        } else if (data.event === 'itemDeleted') {
            window.viewmodel._itemDeleted(data.payload.id);
        }
    });

})();
