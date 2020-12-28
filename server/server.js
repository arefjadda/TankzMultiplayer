const express = require("express");
const socketio = require("socket.io");
const path = require('path');

// App initialize
const app = express();
const server = app.listen(5000, () => {
    console.log('listening to requests on port 5000')
})


// Static files
app.use(express.static(path.join(__dirname, "../client")));

// Socket setup
let io = socketio(server);