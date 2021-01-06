const { Player, PlayerState } = require('../entities/player');

class PlayerManager {
    constructor() {
        this.players = [] ;
    }

    getPlayerByName(name) {
        return this.players.filter(player => player.name === name)[0];
    }

    getPlayerBySocketID(socketID) {
        return this.players.filter(player => player.socketID === socketID)[0];
    }

    attachSocketIDToPlayer(socketID, playerName) {
        const player = this.getPlayerByName(playerName);
        player.attachSocketID(socketID);
    }

    movePlayer(socketID, directions) {
        const player = this.getPlayerBySocketID(socketID);
        if (player && player.state === PlayerState.PLAYING) {
            player.moveTank(directions);
        }
    }

    playerShot(socketID) {
        const player = this.getPlayerBySocketID(socketID);
        if (player.state === PlayerState.PLAYING) {
            player.tankShot();
        }
    }


    addPlayer(name) {
        const newPlayer = new Player(name);

        this.players.push(newPlayer);

        return newPlayer;
    }

    removePlayer(socketID) {
        const player = this.getPlayerBySocketID(socketID);
        this.players = this.players.filter(player => player.socketID !== socketID);

        // return the removed player
        return player;
    }
}

module.exports = PlayerManager;