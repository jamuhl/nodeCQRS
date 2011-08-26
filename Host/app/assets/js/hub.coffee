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
PubSub.subscribe 'commands', (msg, data) ->
        socket.emit('commands', data)

#-----------------------------------------------------------------
# EVENTS 

# receive event from socket.io
socket.on 'events', (data) ->
	# publish to clientside bus
	PubSub.publish('events', data)





