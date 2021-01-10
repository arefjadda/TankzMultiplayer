const { User } = require('../utils/models/user');

const PlayerState = {
    SPECTATING: 'spectating',
    PLAYING: 'playing'
}

class Player {
    constructor(name) {
        this.name = name;
        this.gameWins = 0;

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

    getWinsLosses() {
        const playerDB = User.findOne({name: this.name});
        return {
            wins: playerDB.wins,
            losses: playerDB.losses
        }
    }

    incrementWin() {
        this.gameWins ++;
        User.findOneAndUpdate(
            {name: this.name},
            {$inc: {'wins': 1}},
            (err, res) => { if (err) console.log(err)});

    }

    incrementLosses() {
        User.findOneAndUpdate(
            {name: this.name},
            {$inc: {'losses': 1}},
            (err, res) => {if (err) console.log(err)});
    }

}

module.exports = { Player, PlayerState };