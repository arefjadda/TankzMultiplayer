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

        this.currentMap = null;

        this.spawnID = null;
    
    }

    getName() {
        return this.name;
    }

    changeState(state) {
        this.state = state;
    }


    moveTank(directions) {
        if (this.tank) {
            this.tank.updateDirections(directions);
        }
    }

    tankShot() {
        if (this.tank) {
            this.tank.shoot();
        }
    }

    attachSocketID(socketID) {
        this.socketID = socketID;
    }

    attachTank(tank) {
        this.tank = tank;
    }

    attachSpawnID(spawnID) {
        this.spawnID = spawnID;
    }

    changeCurrentMap(mapName) {
        this.currentMap = mapName;
    }
}

module.exports = { Player, PlayerState };