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
PubSub.subscribe('createItem', (msg, data) ->
	if data.text? && data.text != ''
		socket.emit('createItem', data)
)

#-----------------------------------------------------------------
# EVENTS 

# receive event from socket.io
socket.on('itemCreated', (data) ->
	# publish to clientside bus
	PubSub.publish('itemCreated', data)
)

# and pass it to slientside bus
PubSub.subscribe('itemCreated', (msg, data) ->
	if data.text? && data.text != ''
		root.viewmodel.items.push(data.text)
)



