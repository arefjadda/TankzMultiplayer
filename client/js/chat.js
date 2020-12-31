const socket = io.connect('http://localhost:5000');

// Query DOM
const message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events
message.addEventListener('keypress', function(e){
    if (e.key === 'Enter'){
        socket.emit('chat', {
            message: message.value,
            handle: handle.value
        });
        message.value = "";
    }
    socket.emit('typing', handle.value);
});

btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

// Listen for events from server
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += ('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>');
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});