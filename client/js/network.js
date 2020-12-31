class Network {
    constructor(url) {
        // TODO: get this URL from the environment variables
        this.socket = io.connect(url);
        this.socket.on('current-state', this.updateState);
    }

    sendPlayerAuthentication(data) {
        this.socket.emit('authentication', data);
    }

    sendMovement(data) {
        this.socket.emit('tank-movement', data);
    }

    sendShot() {
        this.socket.emit('tank-shot');
    }

    updateState(data) {
        canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
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
