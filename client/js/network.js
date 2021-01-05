class Network {
    constructor(url) {
        // TODO: get this URL from the environment variables
        this.socket = io.connect(url);

        // Listening on these events
        this.socket.on('current-state', this.updateState);
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

    updateState(data) {
        clearCanvas();
        data.forEach(el => {
            if (el.type === 'tank') {
                drawTank(el);
            }
            if (el.type === 'bullet') {
                drawBullet(el);
            }
            if (el.type === 'wall') {
                drawWall(el);
            }
        });
    }

}
