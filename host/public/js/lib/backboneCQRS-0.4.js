//     Backbone.CQRS.js
//     (c) 2012 Jan Mühlemann
//     Backbone.CQRS may be freely distributed under the MIT license.

(function(){

    // Initial Setup
    // -------------

    // Save a reference to the global object.
    var root = this;

    // Save the value of the `Backbone` variable. All extended modules will 
    // be appended to Backbone namespace
    var Backbone = root.Backbone;
    Backbone.CQRS = {};

    // Shortcut to underscore
    var _ = root._;

    // For Backbone's purposes, jQuery or Zepto owns the `$` variable.
    var $ = root.jQuery || root.Zepto;
    var noop = $.noop;


    // Message Objects
    // ---------------

    Backbone.CQRS.Message = Backbone.Model.extend({      
        url: noop,
        fetch: noop,
        save: noop,
        destroy: noop
    });

    // event
    var Event = Backbone.CQRS.Message.extend({});

    // command
    Backbone.CQRS.Command = Backbone.CQRS.Message.extend({
        emit: function() {
            Backbone.CQRS.hub.emit(Backbone.CQRS.hub.commandsChannel, this.parse(this.toJSON()));
        },

        parse: function(data) {
            return data;
        },

        observe: function(callback) {
            Backbone.CQRS.eventHandler.observe(this.id, callback);
        }
    });


    // Event Handling
    // --------------

    // Hub will listen to events and pass them to the eventdispatcher
    var hub = Backbone.CQRS.hub = {

        commandsChannel: 'commands',
        
        defaults: {
            commandsChannel: 'commands',
            eventsChannel: 'events',
            eventNameAttr: 'name',
            eventModelIdAttr: 'payload.id',
            eventResponseToCommandId: 'commandId'
        },

        init: function(options) {
            var self = this;

            if (!this.initialized) {
                this.initialized = true;
            
                options = _.extend(this.defaults, options);
                if (options.parseEvent) this.parseEvent = options.parseEvent;
                if (options.getCommandId) this.getCommandId = options.getCommandId;

                this.commandsChannel = options.commandsChannel;

                // forward incoming events to eventHandler by emitting it to 
                // dispatchEvent -> eventHandler is bound to this 'channel'
                this.on(options.eventsChannel, function(msg) {              
                    
                    // create an event object and set parsed message attributes
                    var evt = new Event();
                    evt.set(this.parseEvent(msg));

                    var attrs = evt.toJSON();
                    evt.name = dive(attrs, options.eventNameAttr);
                    evt.id = dive(attrs, options.eventModelIdAttr);
                    evt.cmdId = self.getCommandId(attrs, options.eventResponseToCommandId);
                    
                    // emit it -> forward to eventHandler
                    this.emit('dispatchEvent', evt);
                });
            }

        },

        parseEvent: function(msg) {
            var evt = msg;
            if (typeof evt == 'string') {
                evt = JSON.parse(evt);
            }
            return evt;
        },

        getCommandId: function(data, field) {
            return dive(data, field);
        }

    };
    _.extend(hub, Backbone.Events);

    // we use Backbone.Event but provide EventEmitters interface
    hub.on = hub.bind;
    hub.emit = hub.trigger;


    // EventDenormalizer
    // --------------

    Backbone.CQRS.EventDenormalizer = function(options) {
        options = options || {};
        if (options.forEvent) this.forEvent = options.forEvent;
        if (options.forModel) this.forModel = options.forModel;
        this.methode = options.methode || 'update';
        this.model = options.model;
        this.collection = options.collection;

        if (this.forEvent && this.forModel) this.register.apply(this);

        this.initialize.apply(this, arguments);
    };


    // Set up all inheritable properties and methods.
    _.extend(Backbone.CQRS.EventDenormalizer.prototype, Backbone.Events, {

        defaultPayloadValue: 'payload',

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize : noop,

        // will be called by Backbone.CQRS.eventHandler 
        // models can listen to this event via myModel.bindCQRS()
        handle: function(evt) {
            if (this.methode !== 'create') {
                if (evt.id) {
                    this.trigger('change:' + evt.id, this.parse(evt), this.apply(this.methode));
                }
            } else {
                var mdl = new this.model(this.parse(evt));
                this.collection.add(mdl);
            }
        },

        // as the denormalizer is for a specific model it can provide an 
        // apply function for the model
        apply: function(methode) {
            return function(data, model) {
                if (methode === 'delete') {
                    // unbind it
                    if (model.isCQRSBound) model.unbindCQRS();

                    // destroy it
                    model.destroy();
                } else {
                    model.set(data);
                }
            };
        },        

        // get the needed part from event to apply to model
        parse: function(evt) {
            if (this.defaultPayloadValue) {
                return dive(evt.toJSON(), this.defaultPayloadValue);
            } else {
                return evt.toJSON();
            } 
        },

        // used to add denormalizer to Backbone.CQRS.eventHandler which forwards 
        // event to specific denormalizers handle function
        register: function(forEvt, forMdl) {
            
            this.forEvent = forEvt || this.forEvent;
            this.forModel = forMdl || this.forModel;

            Backbone.CQRS.eventHandler.register(this);

        }

    });

    Backbone.CQRS.EventDenormalizer.extend = Backbone.Model.extend;
    

    // Global EventHandler
    // -------------------

    var EventHandler = Backbone.CQRS.EventDenormalizer.extend({
        
        initialize: function() {
            this.denormalizers = [];
            this.observedCommands = [];
            
            // subscribe on incoming events
            Backbone.CQRS.hub.on('dispatchEvent', function(evt) {
                this.handle(evt);
            }, this);

        },

        // get specific denormalizer for model or event type
        getDenormalizer: function(forEvent, forModel) {
            if (forEvent) {
                return _(this.denormalizers).filter(function(r) {
                    return r.forEvent == forEvent;
                });
            } else if (forModel) {
                return _(this.denormalizers).filter(function(r) {
                    return r.forModel == forModel;
                });
            } else {
                return null;
            }
        },

        // handles incoming events from hub
        handle: function(evt) {
            // to observing commands
            var pending = this.getPendingCommand(evt);
            if (pending) {
                pending.callback(evt);
                this.removePendingCommand(pending);
            }

            // to denormalizers
            var denorm = this.getDenormalizer(evt.name);

            _(denorm).each(function(d) {
                d.handle(evt);
            });
        },

        // a model can bind to events via ev = 'modelName:id' 
        // this will happen on myModel.bindCQRS()
        // the binding is forwarded to matching denormalizers
        bind: function(ev, callback, context) {
            if (ev.indexOf(':') < 0) return false;

            var modelName = ev.substring(0, ev.indexOf(':')),
                evtName = 'change:' + ev.substring(ev.indexOf(':') + 1, ev.length);
            
            var denorm = this.getDenormalizer(null, modelName);

            _(denorm).each(function(d) {
                d.bind(evtName, callback, context);
            });
        },

        unbind: function(ev, callback) {
            if (ev.indexOf(':') < 0) return false;

            var parts = ev.split(':'),
                modelName = parts[0],
                evtName = 'change:' + parts[1];
            
            var denorm = this.getDenormalizer(null, modelName);

            _(denorm).each(function(d) {
                d.unbind(evtName, callback);
            });
        },

        // add command to observe
        // in the handle function an event matching the command will 
        // call the provided callback
        observe: function(cmdId, callback) {
            this.observedCommands.push({id: cmdId, callback: callback});
        },

        getPendingCommand: function(evt) {
            return _.detect(this.observedCommands, function(pend) {
                return pend.id == evt.cmdId;
            });
        },
        
        removePendingCommand: function(pending) {
            var index = _.indexOf(this.observedCommands, pending);       
            this.observedCommands.splice(index, 1);
        },

        register: function(denormalizer) {
            this.denormalizers.push(denormalizer);
        }

    });

    // create one instace of this global handler
    Backbone.CQRS.eventHandler = new EventHandler();


    // Extend Backbone.Model
    // ---------------------

    Backbone.Model = Backbone.Model.extend({
        
        modelName: null, // you should set this in your model or provide val on bindCQRS

        // just an easier shortcut to Backbone.CQRS.eventHandler.bind
        bindCQRS: function(modelName) {
            if (modelName) this.modelName = modelName;
            if (!this.modelName) return;
            var id = this.id || this.cid;

            Backbone.CQRS.eventHandler.bind(this.modelName + ':' + id, this.apply, this);
            this.isCQRSBound = true;
        },

        unbindCQRS: function(modelName) {
            if (modelName) this.modelName = modelName;
            if (!this.modelName) return;
            var id = this.id || this.cid;

            Backbone.CQRS.eventHandler.unbind(this.modelName + ':' + id, this.apply, this);
            this.isCQRSBound = false;
        },

        // will call the provided function with the data from denormalizer 
        // so you can have denormalizing functionality capsulated in denormalizer
        // override this with you function if needed just be aware all matching 
        // events (eg. personCreated, personChange) will call the same function
        apply: function(data, funct) {
            funct.apply(this, [data, this]);
        }

    });


    // Modified Backbone.Sync
    // ----------------------
    var origSync = Backbone.sync;

    Backbone.CQRS.sync = function(method, model, options) {
        var type = methodMap[method];

        // __only change is here__ only allow get!
        if (type !== 'GET') {
            return options.success();
        } else {
            origSync(method, model, options);
        }
    };

    // Functions
    // ---------

    var dive = function(obj, key) {
        var keys = key.split('.');
        var x = 0;
        var value = obj;
        while (keys[x]) {
            value = value && value[keys[x]];
            x++;
        }
        return value;
    };

    // Mappings from backbone to server methode.
    var methodMap = {
     'create': 'POST',
     'update': 'PUT',
     'delete': 'DELETE',
     'read': 'GET'
    };


}).call(this);
