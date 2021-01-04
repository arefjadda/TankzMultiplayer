// const Tank = require('./tank');
const PlayerState = {
    SPECTATING: 'spectating',
    PLAYING: 'playing'
}

class Player {
    constructor(name) {
        this.name = name;

        this.socketID = null;

        this.tank = null;

        this.state = null;
    
    }

    attachSocketID(socketID) {
        this.socketID = socketID;
    }

    attachTank(tank) {
        this.tank = tank;
    }
}

module.exports = Player;