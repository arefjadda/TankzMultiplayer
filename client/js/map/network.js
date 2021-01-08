class Network {
    constructor() {
        // TODO: get this URL from the environment variables
        this.socket = io.connect();

        // Listening on these events
        this.socket.on('current-state', this.updateState);
        this.socket.on('game-state', this.updateGameState);
        this.socket.on('chat', this.writeMessage);
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

    // Chat update functions

    writeMessage(data) {
        console.log('received')
        feedback.innerHTML = '';
        output.innerHTML += ('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>');
    }

}
