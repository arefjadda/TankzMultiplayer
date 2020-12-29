const express = require("express");
const socketio = require("socket.io");
const path = require('path');

// Game requirements
const Game = require('./game');
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
const FPS = 100;
const map = new Map1('Christmas', 1000, 640);
const game = new Game(io, map);

io.on('connection', (socket) => {
    // A player/tank object needs to be to created
    console.log('user connected', socket.id);
    game.addPlayer(socket.id);
    console.log(game.players);

    socket.on('tank-movement', (data) => {
        const player = game.getPlayerBySocketID(socket.id);
        player.moveTank(data);

    })

    socket.on('tank-shot', () => {
        console.log("tank shot");
        const player = game.getPlayerBySocketID(socket.id);
        player.tank.shoot();
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        game.removePlayer(socket.id);
    });
});



setInterval(() => {
    // console.log("update");
    game.update();
    game.sendStates();

}, 1000 / FPS);



