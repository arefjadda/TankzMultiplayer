const Player = require('../entities/player');

class PlayerManager {
    constructor() {
        this.players = [];
    }

    getPlayerByName(name) {
        return this.players.filter(player => player.name === name)[0];
    }

    addPlayer(name) {
        const newPlayer = new Player(name);

        this.players.push(newPlayer);

        return newPlayer;
    }

    removePlayer(socketID) {
        if (!this.players.has(socketID)) {
            throw "(500): no such socket id"
        }
        this.players.delete(socketID);
    }
}

module.exports = PlayerManager;