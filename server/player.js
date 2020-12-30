const Tank = require('./tank');

class Player {
    constructor(socketID, tank) {
        this.name = '';

        this.socketID = socketID;

        this.tank = tank;
    
    }
}

module.exports = Player;