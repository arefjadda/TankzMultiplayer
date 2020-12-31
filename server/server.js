const express = require("express");
const socketio = require("socket.io");
const path = require('path');

// Game requirements
const GameManager = require('./gameManager');
const Map1 = require('./map');


// App initialize
const app = express();
const server = app.listen(5000, () => {
    console.log('listening to requests on port 5000')
})


// Static files
app.use(express.static(path.join(__dirname, "../client")));

// Socket setup
let io = socketio(server);



/* =========== GAME LOGIC ========= */
const FPS = 120;
const map = new Map1('Christmas', 1000, 640);
const game = new GameManager(io, map);

io.on('connection', (socket) => {
    // A player/tank object needs to be to created
    console.log('user connected', socket.id);

    // Make sure to only create tank if it's the player
    socket.on('authentication', (data) => {
        if (data === 'Player') game.addPlayer(socket.id);
    });

    socket.on('tank-movement', (data) => {
        game.onPlayerMove(socket.id, data);
    })

    socket.on('tank-shot', () => {
        game.onPlayerShoot(socket.id);
    });

    // Handle chat events
    socket.on('chat', function(data){
        console.log(data);
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        console.log(data);
        socket.broadcast.emit('typing', data);
    });
    
    // Disconnect player
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        game.removePlayer(socket.id);
    });
});



setInterval(() => {
    // console.log("update");
    game.updateComponents();
    game.sendStates();

}, 1000 / FPS);



