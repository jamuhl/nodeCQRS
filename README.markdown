## Introduction

This is a sample implementation of CQRS / Eventsourcing Infrastructure in node.js using:

- [redis](http://redis.io/) for Pub/Sub and Storage.
- [nodeEventStore](https://github.com/jamuhl/nodeEventStore) for EventSourcing including it's redis storage implementation.
- [backbone.CQRS](https://github.com/jamuhl/backbone.CQRS) to bring CQRS to client with ease.

### get it up and running
        
1.  start server in _host_ and _domain_ folder

        node server.js
        
1.  direct your browser to 

        http://localhost:3000
        
the source code is well documented to understand the core principles.

## why should i care?

- [Clarified CQRS - Udi Dahan](http://www.udidahan.com/2009/12/09/clarified-cqrs/
- [Top 10 Reasons to do CQRS - Rinat Abdullin](http://abdullin.com/journal/2010/10/22/top-10-reasons-to-do-cqrs-in-a-pdf.html)
               
## got the sample - where to go now?

As of today i know of three implementations for doing (D)DDD / CQRS in node.js. Building a codebase for production is a whole different 
thing to doing a little show case / demo code. If it can break - it will break.

### adrai's modules

- [domain](https://github.com/adrai/node-cqrs-domain)
- [eventdenormalizing](https://github.com/adrai/node-cqrs-eventdenormalizer)
- [viewmodel, read/write repository](https://github.com/adrai/node-viewmodel)
- [eventstore](https://github.com/jamuhl/nodeEventStore)
- [proper dequeing](https://github.com/adrai/node-queue)
- [business-rules and validation](https://github.com/adrai/rule-validator)
- [message bus](https://github.com/adrai/rabbitmq-nodejs-client)


Documentation can be found [here](http://adrai.github.com/cqrs/)

### brightas's modules

- [CQRS Framework](https://github.com/brighthas/cqrsnode)
- [CQRS DbStore](https://github.com/brighthas/cqrsnode.dbstore)
- [Eventstore](https://github.com/brighthas/cqrsnode.eventstore)

### petrjanda's module

- [CQRS Framework](https://github.com/petrjanda/node-cqrs)


### goloroden's modules

- [cqrs-handlers](https://github.com/goloroden/cqrs-handlers)
- [cqrs-eventstore](https://github.com/goloroden/cqrs-eventstore)
- [cqrs-repository](https://github.com/goloroden/cqrs-repository)
- [cqrs-bus](https://github.com/goloroden/cqrs-bus)
- [cqrs-events](https://github.com/goloroden/cqrs-events)
- [cqrs-commands](https://github.com/goloroden/cqrs-commands)


_complete list can be found under [node modules](https://github.com/joyent/node/wiki/Modules#wiki-ddd-cqrs-es)_

