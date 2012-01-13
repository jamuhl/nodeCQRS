// the message map just enriches or reduces the commands/events 
// received from browser / redis with additional 
// information like sender and timestamp

var map = {
    
    to: {  
        
        channelNeedsCustom: function(channel, sender, message) {
            msg = {
                id: message.id,
                command: message.command,
                sender: sender,
                payload: message.payload
            };
            return JSON.stringify(msg, null, 4);
        },
        
        'default': function(channel, sender, message) {
            msg = {
                id: message.id,
                command: message.command,
                time: new Date(),
                sender: sender,
                payload: message.payload
            };
            return JSON.stringify(msg, null, 4);
        }
    },

    from: {

        channelNeedsCustom: function(channel, message) {
            msg = JSON.parse(message);
            data = {
                id: msg.id,
                event: msg.event,
                payload: msg.payload
            };
            return data;
        },

        'default': function(channel, message) {
            msg = JSON.parse(message);
            data = {
                id: msg.id,
                event: msg.event,
                payload: msg.payload
            };
            return data;
        }
    }

};

exports.to = function(channel, sender, message) {
    if (map.to[channel]) {
        return map.to[channel](channel, sender, message);
    } else {
        return map.to['default'](channel, sender, message);
    }
};

exports.from = function(channel, message) {
    if (map.from[channel]) {
        return map.from[channel](channel, message);
    } else {
        return map.from['default'](channel, message);
    }
};
