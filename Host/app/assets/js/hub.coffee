#-----------------------------------------------------------------
# ROOT 
root = exports ? this

# append some objects
#scqrs = if root.scqrs then root.scqrs else {}
#scqrs.messaging = if scqrs.messaging then scqrs.messaging else {}

		
socket = io.connect('http://localhost:3030');

#-----------------------------------------------------------------
# COMMANDS 

# send command via socket.io
PubSub.subscribe 'createItem', (msg, data) ->
	if data.payload.text? && data.payload.text != ''
		socket.emit('createItem', data)


PubSub.subscribe 'deleteItem', (msg, data) ->
        socket.emit('deleteItem', data)

#-----------------------------------------------------------------
# EVENTS 

# receive event from socket.io
socket.on 'itemCreated', (data) ->
	# publish to clientside bus
	PubSub.publish('itemCreated', data)
    
socket.on 'itemDeleted', (data) ->
    PubSub.publish('itemDeleted', data)





