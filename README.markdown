## Introduction

This is a sample implementation of CQRS / Eventsourcing Infrastructure in node.js using:

- [redis](http://redis.io/) for Pub/Sub and Storage.
- [node-eventstore](https://github.com/adrai/node-eventstore) for EventSourcing including it's redis storage implementation.
- [backbone.CQRS](https://github.com/jamuhl/backbone.CQRS) to bring CQRS to client with ease.

### get it up and running

1.  start redis server

        cd redis-x.x.x
        // make
        ./src/redis-server

2.  start server in _host_ and _domain_ folder

        node server.js
        
3.  direct your browser to 

        http://localhost:3000
        
the source code is well documented to understand the core principles.

## why should i care?

- [Clarified CQRS - Udi Dahan](http://www.udidahan.com/2009/12/09/clarified-cqrs/)
- [Top 10 Reasons to do CQRS - Rinat Abdullin](http://abdullin.com/post/top-10-reasons-to-do-cqrs-in-a-pdf/)
               
## got the sample - where to go now?

As of today i know of three implementations for doing (D)DDD / CQRS in node.js. Building a codebase for production is a whole different 
thing to doing a little show case / demo code. If it can break - it will break.

### adrai's modules

This modules are the result of open sourcing parts of a large reallife project of a distributed system based on the principle of 
DDDD and CQRS. It's gone through a lot of iterations and should address most pitfalls.

- you could find this sample done with adrai's framework at [adrai's cqrs-sample](https://github.com/adrai/cqrs-sample)

The API is designed well so you can focus on the domain without worring to much about the infrastructure.

- [domain](https://github.com/adrai/node-cqrs-domain)
- [eventdenormalizing](https://github.com/adrai/node-cqrs-eventdenormalizer)
- [viewmodel, read/write repository](https://github.com/adrai/node-viewmodel)
- [eventstore](https://github.com/adrai/node-eventstore)
- [proper dequeing](https://github.com/adrai/node-queue)
- [business-rules and validation](https://github.com/adrai/rule-validator)
- [message bus](https://github.com/adrai/rabbitmq-nodejs-client)

- [without distributing](https://github.com/adrai/node-cqs)


Documentation can be found [here](http://adrai.github.com/cqrs/)


### petrjanda's module

Framework for non distributed system using couchDb as storage.

- [CQRS Framework](https://github.com/petrjanda/node-cqrs)


### efacilitation's module

Build web applications based on Domain-driven Design and Layered Architecture.

- [eventric](https://github.com/efacilitation/eventric)




_complete list can be found under [node modules](https://github.com/joyent/node/wiki/Modules#wiki-ddd-cqrs-es)_


## Which one to choose?

1.  If your project is simple enough to be implemented in a traditional way - go for the traditional approach

2.  If your project really profits from doing DDDD / CQRS it might be a good idea to create your own codebase (it's not to complicated, and 
compared to the overall project size worth the effort as it's the core of your distributed system)

3.  If you need to get fast results and more than a sample - i would try adrai's modules.

