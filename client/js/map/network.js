/**
 * This is the socket network between the client and the backend
 */
class Network {
    constructor() {
        // TODO: get this URL from the environment variables
        this.socket = io.connect();

        // Listening on these events
        this.socket.on('current-state', this.updateState);
        this.socket.on('game-state', this.updateGameState);
        this.socket.on('chat', this.writeMessage);
        this.socket.on('user-lists', this.updateUserList);
        this.socket.on('count-down', this.countDownUpdate);
    }

    sendPlayerEntry(mapName, playerName, selectedColor) {
        this.socket.emit('player-entry', {
            mapName, 
            playerName, 
            selectedColor});
    }

    sendMovement(data) {
        this.socket.emit('tank-movement', data);
    }

    sendShot() {
        this.socket.emit('tank-shot');
    }

    // Send chat events
    sendMessage(data) {
        this.socket.emit('chat', data);
    }

    /**
     * Listens for updated states from server.
     *
     * @param {{tanks: array, bullets: array, walls: array}} data - a collection of game components
     */
    updateState(data) {
        clearCanvas();

        data.tanks.forEach((tank) => {
            drawTank(tank);
        });

        data.bullets.forEach((bullet) => {
            drawBullet(bullet);
        });

        data.walls.forEach((wall) => {
            drawWall(wall);
        });
    }

    updateGameState(data) {
        gameState = data.state;
    }

    /**
     * Listens for updated user list from server.
     * @param {{players: array, spectators: array}} data - A list of players and spectators
     */
    updateUserList(data) {
        // clear player list
        playerList.innerHTML = '';
        spectatorList.innerHTML = '';
        data.players.forEach(p => {
            playerList.innerHTML += `<p>${p.name } (${p.gameWins})<p>`;
        });

        data.spectators.forEach(s => {
           spectatorList.innerHTML += `<p>${s.name} (${s.gameWins})</p>`;
        });
    }

    countDownUpdate(data) {
        console.log(data.timer);
    }

    // Chat update functions

    writeMessage(data) {
        console.log('received')
        feedback.innerHTML = '';
        output.innerHTML += ('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>');
    }

}
