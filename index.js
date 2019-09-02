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

    socket.on('msg', (data) => {
        console.log('msg')
        io.sockets.emit('msg', data)
    })

    socket.on('feedback', (handle) => {
        console.log('feedback')
        socket.broadcast.emit('feedback', handle)
    })

});