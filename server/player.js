const Tank = require('./tank');

class Player {
    constructor(socketID, tank, spawnID) {
        this.name = '';

        this.socketID = socketID;

        this.tank = tank;

        this.spawnID = spawnID;
    
    }
}

module.exports = Player;