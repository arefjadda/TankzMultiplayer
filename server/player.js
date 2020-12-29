const Tank = require('./tank');

class Player {
    constructor(socketID) {
        this.name = '';
        this.socketID = socketID;
        this.tank = null;
        this.leftKey = false;
        this.rightKey = false;
        this.upKey = false;
        this.downKey = false;
        this.nozzleCW = false;
        this.nozzleCCW = false;
    }

    addTank(posX, posY, color, nozzleRot) {
        this.tank = new Tank(posX, posY, color, nozzleRot);
    }

    moveTank(data) {
        this.leftKey = data.leftKey;
        this.rightKey = data.rightKey;
        this.upKey = data.upKey;
        this.downKey = data.downKey;
        this.nozzleCW = data.nozzleCW;
        this.nozzleCCW = data.nozzleCCW;
        this.tank.move()
    }

    update() {
        this.tank.move(this.leftKey, this.rightKey, this.upKey, this.downKey)
        this.tank.rotateNozzle(this.nozzleCW, this.nozzleCCW);
    }
}

module.exports = Player;