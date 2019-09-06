let express = require('express');
let socket = require('socket.io');

// default rooms
let available_rooms = ['Room 1', 'Room 2', 'Room 3']
let users = []
let users_room = {}

// App setup 
let app = express();
let PORT = process.env.PORT || 4000

let server = app.listen(PORT, function(){
    console.log('listening to 4000')
});

// Searches for static files (html,css)
app.use(express.static('public'));


let io = socket(server);

io.on('connection', (socket) => {
    users.push(socket.id)
    socket.emit('available rooms', available_rooms)
    console.log('Connection from ' + socket.id)
    
    // join a room
    socket.on('subscribe', (room) => {
        users_room[socket.id] = room
        socket.join(room)
        // io.sockets.in(room).emit('joined', {id: socket.id, name: room})
        socket.broadcast.in(room).emit('joined', {id: socket.id, name: room})
        io.sockets.emit('users online', {users_room: users_room})
    })

    // leave a room
    socket.on('unsubscribe', (current_room) => {
        socket.broadcast.in(current_room).emit('left', socket.id)
        socket.leave(current_room)
    })

    // emit 'msg' event and it's data to all sockets in the same room
    socket.on('msg', (data) => {
        io.sockets.in(data.room).emit('msg', data.details)
    })

    // broadcast 'feedback' event and it's data to all sockets in the same room except the sender
    socket.on('feedback', (data) => {
        socket.broadcast.in(data.room).emit('feedback', data.handle)
    })

    // create new room
    socket.on('create room', (room) => {
        available_rooms.push(room)
        io.sockets.emit('available rooms', available_rooms)
    })

    // when user disconnects
    socket.on('disconnect', () => {
        delete users_room[socket.id]
        io.sockets.emit('users online', {users_room: users_room})
    });
});