const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const session = require('express-session');
const path = require('path');

// Game requirements
const GameManager = require('./gameManager');
const Map1 = require('./map');


// App initialize
const app = express();
const server = app.listen(5000, () => {
    console.log('listening to requests on port 5000')
})


// ==== middlewares ====
// Static files
app.use('/js', express.static(path.join(__dirname, "../client/js")));
app.use('/css', express.static(path.join(__dirname, "../client/css")));
app.use(bodyParser.json({
    limit: "2mb",
}));

app.use(session({
    secret: "no milk pls!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true
    }
}))

// Socket setup
let io = socketio(server);


/* =========== GAME LOGIC ========= */
const FPS = 120;
let map = new Map1('Christmas', 1000, 640);
let game = new GameManager(io, map);

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


app.get('/', (req, res) => {
    if (req.session.player) {
        res.redirect('/menu');
    } else {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    }
})


app.post('/handle', (req, res) => {
    const data = req.body;
    if (data.handle === '') {
        res.status(400).send('cannot have empty name/handle');
    }
    console.log('new player joined', data.handle);

    // set the session
    req.session.player = {
        handle: data.handle
    }

    // redirect to menu
    res.redirect('/menu');
});

app.get('/menu', checkSession, (req, res) => {
    res.sendFile(path.join(__dirname,'../client/menu.html'));
})

app.get('/menu/:mapName', checkSession, (req, res) => {
    const mapName = req.params.mapName;
    // load the map with this mapName
    if (mapName.toLowerCase() === 'tanksmas') {
        res.redirect('/' + mapName);
        res.status(200);
    } else if (mapName.toLowerCase() === 'awaz') {
        console.log("MUST CREATE THIS MAP");
        res.status(500).send({error: "Coming soon!"});
    } else {
        res.status(404).send("no such map");
    }
    
});

app.get('/tanksmas', checkSession, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/map.html'));
});

// Custom 404 message
app.get('*', (req, res) => {
    res.status(404).send("404: Nothing to see here!");
})



// session middleware functions
function checkSession(req, res, next) {
    if (req.session.player) {
        next();
    } else {
        res.redirect('/');
    }
}



setInterval(() => {
    // console.log("update");
    game.updateComponents();
    game.sendStates();

}, 1000 / FPS);



