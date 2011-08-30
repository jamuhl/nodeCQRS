## Introduction

This is a first try to implement a CQRS / Eventsourcing Infrastructure in node.js using redis for Pub/Sub and Storage.

For further information in wiki tutorial.

### prerequisition

1. you need node.js [-> install node.js](https://github.com/joyent/node/wiki/Installation)
1. you need coffee-script [-> install coffee-script](http://jashkenas.github.com/coffee-script/)
1. you need redis.io [-> install redis.io](http://redis.io/download)

### get it up and running

In order to run the project you need to complete following steps:

1.  load needed node modules - run cake files in folder _Host_ and _Domain_

        cake module
        
1.  start your redis server

        src/redis_server
        
1.  start server in _Host_ and _Domain_

        coffee server.coffee
        
1.  direct your browser to 

        http://localhost:3000
