## Introduction

This is a sample implementation of CQRS / Eventsourcing Infrastructure in node.js using:

- [redis](http://redis.io/) for Pub/Sub and Storage
- [nodeEventStore](https://github.com/KABA-CCEAC/nodeEventStore) for EventSourcing including it's redis storage implementation.

### get it up and running
        
1.  start server in _host_ and _domain_ folder

        node server.js
        
1.  direct your browser to 

        http://localhost:3000
