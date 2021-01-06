class Network {
    constructor(url) {
        // TODO: get this URL from the environment variables
        this.socket = io.connect(url);

        // Listening on these events
        this.socket.on('current-state', this.updateState);
        this.socket.on('game-state', this.updateGameState);
    }

    sendPlayerAuthentication(data) {
        this.socket.emit('authentication', data);
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

}
