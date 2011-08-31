#-----------------------------------------------------------------
# ROOT 
root = exports ? this

# append some objects
#scqrs = if root.scqrs then root.scqrs else {}
#scqrs.messaging = if scqrs.messaging then scqrs.messaging else {}
		
socket = io.connect('http://localhost:3031');

#-----------------------------------------------------------------
# EVENTS 

# receive event from socket.io
socket.on 'events', (data) ->
	# publish to clientside bus
	PubSub.publish('events', data)
    
# receive event from socket.io
socket.on 'commands', (data) ->
	# publish to clientside bus
	PubSub.publish('commands', data)





