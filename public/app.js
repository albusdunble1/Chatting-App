let socket = io.connect();


// ====================== Query D0M ======================

let output = document.querySelector('#output')
// let display = document.querySelector('#display')
let message = document.querySelector('#message')
let handle = document.querySelector('#handle')
let submit = document.querySelector('#submit')
let rooms = document.querySelector('#rooms')
let room_name = document.querySelector('#room_name')
let create_room = document.querySelector('#create_room')
let individual_room = document.querySelector('#rooms h5')
let online_users = document.querySelector('#online_users')
let total_online = document.querySelector('#total_online')
let current_room_name = document.querySelector('#current_room_name')

let available_rooms = []

// default room
let current_room = 'Room 1'

// first child of output div
let theFirstChild;


let newMessage = ''




// ====================== Set up event listeners ======================

// click event listener for each room(h5) in available rooms
document.addEventListener("click", (event) => {
    var element = event.target;
    // if h5 tag (room name) is found
    if(element.tagName == 'H5'){
        // leave room
        socket.emit('unsubscribe', current_room)
        // join room
        socket.emit('subscribe', element.textContent)

        console.log('left ' + current_room + ' and joined ' + element.textContent)

        // change current_room to newly joined room
        current_room = element.textContent

        // change room name
        current_room_name.textContent = current_room

        // reset chat window
        output.innerHTML = ''
        output.innerHTML = '<p><strong style="color:green;">' + socket.id + ' has joined ' + current_room + '.</strong></p>'
        output.innerHTML += '<p id="feedback"></p>'

    }
} );

// create new room when "create new room" button is clicked
create_room.addEventListener('click', () => {
    socket.emit('create room', room_name.value)
    room_name.value = ''
})

// send new message to the current room 
submit.addEventListener('click', () => {
    let data = {
        room: current_room,
        details: {
                handle: handle.value,
                message: message.value
            }
    }
    socket.emit('msg', data)
    message.value = ''
})

// detect keypress event in the input textbox
message.addEventListener('keypress', () => {
    let data = {
        room: current_room,
        handle: handle.value
    }
    socket.emit('feedback', data)
})




// ====================== listen to emits ======================

// join default room once connected to the server
socket.on('connect', (data) => {
    socket.emit('subscribe', current_room)
    current_room_name.textContent = current_room
    output.innerHTML = ''
    output.innerHTML = '<p><strong style="color:green;">' + socket.id + ' has joined ' + current_room + '.</strong></p>'
    output.innerHTML += '<p id="feedback"></p>'
    let feedback = document.querySelector('#feedback')
})

// display user message in the chat window
socket.on('msg', (data) => {
    // theFirstChild = feedback
    feedback.innerHTML = ''
    // output.innerHTML += '<p><strong> ' + data.handle + ': </strong>' + data.message + ' </p>'
    let helper = document.createElement('p');
    helper.innerHTML = '<strong>' + data.handle  + ': </strong>' + data.message + '</p>'
    output.insertBefore(helper, feedback);
    // make sure it is always scrolled to the bottom
    output.scrollTop = output.scrollHeight;
})

// notify other users in the room that this user is typing
socket.on('feedback', (handle) => {
    feedback.innerHTML = '<p><em> ' + handle + ' is typing...  </em></p>'
    // make sure it is always scrolled to the bottom
    output.scrollTop = output.scrollHeight;
})

// retrieve the latest available rooms from the server
socket.on('available rooms', (all) => {
    available_rooms = all
    rooms.innerHTML = ''
    for (let i = 0; i < available_rooms.length; i++){
        rooms.innerHTML += '<h5>'+ available_rooms[i] + '</h5>'
    }
})

// notify the room about the new user
socket.on('joined', (data) => {
    // theFirstChild = feedback
    // insert before feedback paragraph
    let helper = document.createElement('p');
    helper.innerHTML = '<strong style="color:green;">' + data.id + ' has joined ' + data.name + '.</strong>'
    output.insertBefore(helper, feedback);
    // make sure it is always scrolled to the bottom
    output.scrollTop = output.scrollHeight;
})

// notify the room that a user has left
socket.on('left', (user) => {
    // theFirstChild = feedback
    // insert before feedback paragraph
    let helper = document.createElement('p');
    helper.innerHTML = '<strong style="color:red;">' + user + ' has left ' + current_room + '.</strong>'
    output.insertBefore(helper, feedback);
    // make sure it is always scrolled to the bottom
    output.scrollTop = output.scrollHeight;
})


// update online users
socket.on('users online', (data) => {
    online_users.innerHTML = ''
    total_online.textContent = Object.keys(data.users_room).length
    for (let key in data.users_room){
        online_users.innerHTML += '<p style="color:green;"><strong>' + key + ' in ' + data.users_room[key] +'.</strong></p>'
    }
})






