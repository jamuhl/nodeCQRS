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

- [Clarified CQRS - Udi Dahan](http://www.udidahan.com/2009/12/09/clarified-cqrs/)
- [Top 10 Reasons to do CQRS - Rinat Abdullin](http://abdullin.com/journal/2010/10/22/top-10-reasons-to-do-cqrs-in-a-pdf.html)
               
## got the sample - where to go now?

As of today i know of three implementations for doing (D)DDD / CQRS in node.js. Building a codebase for production is a whole different 
thing to doing a little show case / demo code. If it can break - it will break.

### adrai's modules

This modules are the result of open sourcing parts of a large reallife project of a distributed system based on the principle of 
DDDD and CQRS. It's gone through a lot of iterations and should address most pitfalls.

The API is designed well so you can focus on the domain without worring to much about the infrastructure.

- [domain](https://github.com/adrai/node-cqrs-domain)
- [eventdenormalizing](https://github.com/adrai/node-cqrs-eventdenormalizer)
- [viewmodel, read/write repository](https://github.com/adrai/node-viewmodel)
- [eventstore](https://github.com/jamuhl/nodeEventStore)
- [proper dequeing](https://github.com/adrai/node-queue)
- [business-rules and validation](https://github.com/adrai/rule-validator)
- [message bus](https://github.com/adrai/rabbitmq-nodejs-client)

- [without distributing](https://github.com/adrai/node-cqs)


Documentation can be found [here](http://adrai.github.com/cqrs/)

### brightas's modules

Looking promising but still work in progress - hopefully reaching it's primetime soon.

- [CQRS Framework](https://github.com/brighthas/cqrsnode)
- [CQRS DbStore](https://github.com/brighthas/cqrsnode.dbstore)
- [Eventstore](https://github.com/brighthas/cqrsnode.eventstore)

### petrjanda's module

Framework for non distributed system using couchDb as storage.

- [CQRS Framework](https://github.com/petrjanda/node-cqrs)


### goloroden's modules

Easy to read codebase to study further on how to do cqrs in node.js. 

- [cqrs-handlers](https://github.com/goloroden/cqrs-handlers)
- [cqrs-eventstore](https://github.com/goloroden/cqrs-eventstore)
- [cqrs-repository](https://github.com/goloroden/cqrs-repository)
- [cqrs-bus](https://github.com/goloroden/cqrs-bus)
- [cqrs-events](https://github.com/goloroden/cqrs-events)
- [cqrs-commands](https://github.com/goloroden/cqrs-commands)



_complete list can be found under [node modules](https://github.com/joyent/node/wiki/Modules#wiki-ddd-cqrs-es)_


## Which one to choose?

1.  If your project is simple enough to be implemented in a traditional way - go for the traditional approach

2.  If your project really profits from doing DDDD / CQRS it might be a good idea to create your own codebase (it's not to complicated, and 
compared to the overall project size worth the effort as it's the core of your distributed system)

3.  If you need to get fast results and more than a sample - i would try adrai's modules.

