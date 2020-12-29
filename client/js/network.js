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
            canvas.fillStyle = tank.reccolor;
            canvas.fillRect(tank.posX, tank.posY, tank.width, tank.height);

            canvas.beginPath();
            canvas.arc((tank.posX + (tank.width / 2)), (tank.posY + (tank.height / 2)), tank.height / 3, 0, 2 * Math.PI);
            canvas.fillStyle = tank.circolor;
            canvas.fill();
            
            // Rotate the heck out of my nozzle
            canvas.save();
            canvas.translate(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2));
            canvas.rotate(tank.nozzleRot * Math.PI / 180);
            canvas.translate(-(tank.posX + (tank.width / 2)), - (tank.posY + (tank.height / 2)));
            canvas.fillStyle = tank.nozzleColor;
            canvas.fillRect(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2) - 4.5, 50, 9);
            canvas.restore();
        });
    }

}
