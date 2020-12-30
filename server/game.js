// Everything that should be in this file:
// New user enters or leaves the room (assigning a new tank)
const Bullet = require('./bullet');
const Player = require('./player');
const Tank = require('./tank');

    // TODO: rename to GameManager
class Game {

    constructor(io, gameMap) {

        // Connect io
        this.io = io;

        // A map of socketID to player object
        this.players = new Map();

        // TODO;
        this.gameMap = gameMap;

        this.gameComponents = [];


    }

    addPlayer(socketID) {
        let tank;

        // This is the first connected player
        // TODO: get the position from GameMap
        if (this.players.size === 0) {
            tank = new Tank(20, 20, 'forestgreen', 0, this.gameMap);
        } else if (this.players.size === 1) {
            tank = new Tank(900, 500, 'pink', 180, this.gameMap);
        }
        
        // Add the player's tank to the game map
        this.addComponent(tank);

        // Add new player to the collection of players
        const newPlayer = new Player(socketID, tank);
        this.players.set(socketID, newPlayer);
    }

    removePlayer(socketID) {
        const player = this.getPlayerBySocketID(socketID);
        this.gameComponents.splice(this.gameComponents.indexOf(player.tank), 1);
        this.players.delete(socketID);
        console.log('After removing', this.players);
    }

    onPlayerMove(socketID, directions) {
        const player = this.getPlayerBySocketID(socketID);
        player.tank.updateDirections(directions);
    }

    onPlayerShoot(socketID) {
        const player = this.getPlayerBySocketID(socketID);
        let bullet = player.tank.shoot();
        this.addComponent(bullet);
    }

    getPlayerBySocketID(socketID) {
        return this.players.get(socketID);
    }

    updateComponents() {
        const components = this.getComponents();

        components.forEach(component => {
            if (component instanceof Bullet) {
                if (component.explode) {
                    this.gameComponents.splice(this.gameComponents.indexOf(component), 1);
                }
                
            }
            component.update()
            component.detectCollision(this.gameComponents);
        });
    }

    sendStates() {
        const data = [];
        this.gameComponents.forEach(component => {
            if (component instanceof Tank) {
                component.type = 'tank';
            } 

            if (component instanceof Bullet) {
                component.type = 'bullet';
            }
            data.push(component);
        });
        this.io.emit('current-state', data);
        
    }

    addComponent(component) {
        this.gameComponents.push(component);
    }

    getComponents() {
        return this.gameComponents;
    }


}

module.exports = Game;