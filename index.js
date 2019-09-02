let express = require('express');
let socket = require('socket.io');


// App setup 
let app = express();

let server = app.listen(4000, function(){
    console.log('listening to 4000')
});

// Searches for static files (html,css)
app.use(express.static('public'));


let io = socket(server);

io.on('connection', (socket) => {
    console.log('Connection from ' + socket.id)

    // emit 'msg' event and it's data to all sockets
    socket.on('msg', (data) => {
        io.sockets.emit('msg', data)
    })

    // broadcast 'feedback' event and it's data to all sockets except the sender
    socket.on('feedback', (handle) => {
        socket.broadcast.emit('feedback', handle)
    })

});