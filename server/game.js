// Everything that should be in this file:
// New user enters or leaves the room (assigning a new tank)
const Player = require('./player');

class Game {
    constructor(io, gameMap) {

        // Connect io
        this.io = io;

        // A map of socketID to player object
        this.players = new Map();

        // TODO;
        this.gameMap = gameMap;
    }

    addPlayer(socketID) {
        const newPlayer = new Player(socketID);

        // This is the first connected player
        // TODO: move this logic to GameMap
        if (this.players.size === 0) {
            newPlayer.addTank(20, 20, 'forestgreen', 0);
        } else if (this.players.size === 1) {
            newPlayer.addTank(900, 500, 'pink', 180);
        }
        this.gameMap.addComponent(newPlayer.tank);


        this.players.set(socketID, newPlayer);
    }

    removePlayer(socketID) {
        const player = this.getPlayerBySocketID(socketID);
        this.gameMap.gameComponents.splice(this.gameMap.gameComponents.indexOf(player.tank), 1);
        this.players.delete(socketID);
        console.log('After removing', this.players);
    }

    getPlayerBySocketID(socketID) {
        return this.players.get(socketID);
    }

    update() {
        this.players.forEach((player, socketID, _) => {
            player.update();
        });
    }

    sendStates() {
        const data = [];
        this.players.forEach((player, socketID, _) => {
            data.push(player.tank);
        });
        this.io.emit('current-state', data);
        
    }


}

module.exports = Game;