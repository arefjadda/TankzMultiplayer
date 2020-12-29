class Network {
    constructor(url) {
        // TODO: get this URL from the environment variables
        this.socket = io.connect(url);
        this.socket.on('current-state', this.updateState);
    }

    sendMovement(data) {
        this.socket.emit('tank-movement', data);
    }

    sendShot() {
        this.socket.emit('tank-shot');
    }

    updateState(data) {
        canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
        data.forEach(tank => {
            drawTank(tank);
        });
    }

}
