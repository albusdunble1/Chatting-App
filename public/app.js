let socket = io.connect('http://localhost:4000/');


// Query D0M
let output = document.querySelector('#output')
let display = document.querySelector('#display')
let message = document.querySelector('#message')
let feedback = document.querySelector('#feedback')
let handle = document.querySelector('#handle')
let submit = document.querySelector('#submit')




// Set up event listeners
submit.addEventListener('click', () => {
    let data = {
        handle: handle.value,
        message: message.value
    }
    socket.emit('msg', data)
    message.value = ''
})

message.addEventListener('keypress', () => {
    socket.emit('feedback', handle.value)
})


// listen to emits

socket.on('msg', (data) => {
    feedback.innerHTML = ''
    display.innerHTML += '<p><strong> ' + data.handle + ': </strong>' + data.message + ' </p>'
})

socket.on('feedback', (handle) => {
    feedback.innerHTML = '<p><em> ' + handle + ' is typing...  </em></p>'
})

