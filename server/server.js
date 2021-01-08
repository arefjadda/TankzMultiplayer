const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const session = require('express-session');
const path = require('path');

const PlayerManager = require('./managers/playerManager');
const GameManager = require('./managers/gameManager');
const Map1 = require("./entities/map");
const Game = require("./entities/game");


// App initialize
const app = express();
const server = app.listen(5000, () => {
    console.log('listening to requests on port 5000')
})


// ==== middlewares ====
// Static files
app.use('/js', express.static(path.join(__dirname, "../client/js")));
app.use('/map/js', express.static(path.join(__dirname, "../client/js")));
app.use('/css', express.static(path.join(__dirname, "../client/css")));
app.use('/map/css', express.static(path.join(__dirname, "../client/css")));
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

app.set('view engine', 'ejs');

// Socket setup
let io = socketio(server);

/* ========== Game initialization ========= */
const game1 = new Game(
    new Map1("tanksmas", 1000, 640),
    io
)

/* ========== Manager initialization ========= */
const playerManager = new PlayerManager();
const gameManager = new GameManager();

// add games
gameManager.addGame(game1);

io.on('connection', (socket) => {
    // A player/tank object needs to be to created
    console.log('user connected', socket.id);

    socket.on('player-entry', (data) => {
        // add the player to the map name socket room
        socket.join(data.mapName);

        let player = playerManager.getPlayerByName(data.playerName);

        // add player, if player doesn't exist
        if (!player) {
            player = playerManager.addPlayer(data.playerName);
        }

        // attach the socket id to the player
        playerManager.attachSocketIDToPlayer(socket.id, data.playerName);

        gameManager.addPlayerToGame(player, data.mapName, data.selectedColor);

    });

    socket.on('tank-movement', (data) => {
        playerManager.movePlayer(socket.id, data);
    });

    socket.on('tank-shot', () => {
        playerManager.playerShot(socket.id);
    });

    // Handle chat events
    socket.on('chat', data => {
        io.sockets.emit('chat', data);
    });
    
    // Disconnect player
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        
        // remove it from the list of players
        const removedPlayer = playerManager.removePlayer(socket.id);

        // remove it from the corresponding game
        gameManager.removePlayerFromGame(removedPlayer);

        
    });
});


// ======================= SERVER ENDPOINTS =================

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

    // add the player to the list
    playerManager.addPlayer(data.handle);

    // redirect to menu
    res.redirect('/menu');
});

app.get('/menu', checkSession, (req, res) => {
    res.sendFile(path.join(__dirname,'../client/menu.html'));
})

app.post('/menu', checkSession, (req, res) => {
    const selections = req.body;
    
    req.session.player.selections = selections;
    
    res.redirect(`/map/${selections.selectedMap}`);
});

app.get('/map/:mapName', checkSession, (req, res) => {
    const selections = req.session.player.selections;

    const map = gameManager.getMapByName(selections.selectedMap);

    res.render(path.join(__dirname, '../client/map.ejs'), 
        {width: map.width, 
         height: map.height, 
         playerName: req.session.player.handle,
         selectedColor: selections.selectedColor});
});


// Custom 404 message
app.get('*', (req, res) => {
    res.status(404).send({message: "404: Nothing to see here!"});
});

app.post("*", (req, res) => {
    res.status(404).send({message: "404: Nothing to post here!"});
});



// ==================== session middleware functions =================
function checkSession(req, res, next) {
    if (req.session.player) {
        next();
    } else {
        res.redirect('/');
    }
}


