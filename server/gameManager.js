// Everything that should be in this file:
// New user enters or leaves the room (assigning a new tank)
const Player = require('./player');
const Bullet = require('./bullet');
const Tank = require('./tank');
const RectWall = require('./wall');
const CollisionManager = require('./collisionManager');

    // TODO: rename to GameManager
class GameManager {

    constructor(io, gameMap) {

        // SocketIO connection
        this.io = io;

        // A map of socketID to player object
        this.players = new Map();

        // The map of the game
        this.gameMap = gameMap;

        // List of all game components
        this.gameComponents = this.gameMap.getMapComponents();

        // A manager for game's collision system
        this.collisionManager = new CollisionManager(this.gameComponents, this.gameMap);


    }

    addPlayer(socketID) {
        let tank;

        // This is the first connected player
        // TODO: get the position from GameMap
        if (this.players.size === 0) {
            tank = new Tank(20, 20, 'forestgreen', 0);
        } else if (this.players.size === 1) {
            tank = new Tank(900, 500, 'pink', 180);
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
            this.collisionManager.detectCollision(component);
        });
    }

    sendStates() {
        const data = [];
        this.gameComponents.forEach(component => {
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

module.exports = GameManager;