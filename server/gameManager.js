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

        // Previous number of players
        this.currPlayerCount = 0;


    }

    addPlayer(socketID) {

        let tank;

        // This is the first connected player
        // TODO: get the position from GameMap
        try {
            // Spawn the tank
            const spawn = this.gameMap.getSpawnPoint();
            tank = new Tank(spawn.coord[0], spawn.coord[1], 'forestgreen', spawn.angle, this.gameMap.friction, this.gameMap.tanksAcceleration);
            
            // Add the player's tank to the game map
            this.addComponent(tank);

            // Add new player to the collection of players
            const newPlayer = new Player(socketID, tank, spawn.id);
            this.players.set(socketID, newPlayer);

            // Update player count
            this.currPlayerCount ++;
        }
        catch(error){
            console.log(error);
        }
        
    }

    removePlayer(socketID) {
        if (this.players.has(socketID)) {
            const player = this.getPlayerBySocketID(socketID);
            this.gameMap.restoreSpawn(player.spawnID);
            this.gameComponents.splice(this.gameComponents.indexOf(player.tank), 1);
            this.players.delete(socketID);
        }
        
        if (this.currPlayerCount === 2) {
            this.players.forEach((value, key) => {
                console.log(key, 'won!');
            });
        }
        this.currPlayerCount -= 1;
        console.log('After removing');
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
            if (component instanceof Tank) {
                if (component.explode) {
                    this.players.forEach((value, key, map) => {
                        if (value.tank === component) {
                            this.gameComponents.splice(this.gameComponents.indexOf(component), 1);
                            this.removePlayer(key);
                        }
                    });

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