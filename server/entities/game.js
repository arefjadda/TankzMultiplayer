const CollisionManager = require('../managers/collisionManager');
const Bullet = require('../entities/bullet');
const Tank = require('../entities/tank');
const {PlayerState} = require('../entities/player');

const GameState = {
    IDLE: "idle",
    COUNTING_DOWN: "count_down",
    STARTING: "start",
    PLAYING: "play", 
    ENDING: "end"
}


class Game {
    constructor(gameMap, socketio, FPS=120) {
        this.players = []
        this.spectators = [];

        // The map of the game
        this.gameMap = gameMap;
        // List of all game components
        this.gameComponents = this.gameMap.getMapComponents();

        // socketio
        this.socketio = socketio;

        // A manager for game's collision system
        this.collisionManager = new CollisionManager(this.gameComponents, this.gameMap);
        // Previous number of players
        this.currPlayerCount = 0;

        this.state = GameState.IDLE;
        this.nextState = this.state;

        /* timer countdown in seconds */
        this.countDownTimer = 30;
        this.FPS = FPS;

        this.init();
    }

    addComponent(component) {
        this.gameComponents.push(component)
    }

    changePlayerState(player, state) {
        player.changeState(state);
    }


    addPlayerToGame(player, selectedColor) {
        // create the tank based on the selected color and add it to the list
        // of components of this game.
        
        try {
            // TODO: If this game state is in idle/counting down then player may be added!

            // Spawn the tank
            const spawn = this.gameMap.getSpawnPoint();
            const tank = new Tank(
                spawn.coord[0], 
                spawn.coord[1], 
                selectedColor, 
                spawn.angle, 
                this.gameMap.friction, 
                this.gameMap.tanksAcceleration,
                player.getName());
            
            // Add the player's tank to the game map
            this.addComponent(tank);
            // Attach the tank to player
            player.attachTank(tank);
            this.changePlayerState(player, PlayerState.PLAYING);

            // Add new player to the collection of players
            this.players.push(player);

            // Update player count
            this.currPlayerCount ++;
        }
        catch(error){
            console.log(error);
            this.changePlayerState(player, PlayerState.SPECTATING);
            // add player to spectator
            this.spectators.push(player);
        }
    }

    getMapName() {
        return this.gameMap.mapName;
    }

    getMap() {
        return this.gameMap;
    }

    // ====== START: state functions ======

    init() {
        setInterval(() => {
            // this.UpdateGameState();
            this.updateComponents();
            this.sendStates();
        
        }, 1000 / this.FPS);
    }

    idle() {
    }

    countDown() {
    }

    start() {
    }

    playing(){
    }

    end() {
    }

    updateGameState() {
        // this.state = this.nextState;
        // switch (this.state) {
        //     case GameState.IDLE:
        //         if (this.players.length >= 2) {
        //             this.nextState = GameState.COUNTING_DOWN;
        //         }
        //         break;
        //     case GameState.COUNTING_DOWN:
        //         if (this.countDownTimer == 0) {
        //             this.nextState = GameState.STARTING;
        //         }
        
        //     default:
        //         break;
        // }

    }

    updateComponents() {
        this.gameComponents.forEach(component => {
            if (component instanceof Bullet) {
                if (component.exploded) {
                    this.gameComponents.splice(this.gameComponents.indexOf(component), 1);
                }
            }
            if (component instanceof Tank) {
                // if tank has bullet ready
                const bullet = component.getBullet();
                if (bullet) {
                    this.addComponent(bullet);
                }


                if (component.exploded) {
                    this.players.forEach((value, key, map) => {
                        if (value.tank === component) {
                            this.gameComponents.splice(this.gameComponents.indexOf(component), 1);
                            this.removePlayer(key);
                        }
                    });

                }
            }

            if (!component.exploded) {
                component.update()
                this.collisionManager.detectCollision(component);
            }

        });
    }

    sendStates() {
        this.socketio
            .to(this.getMapName())
            .emit('current-state', this.gameComponents);
    }

    // ====== END: state functions ======


}

module.exports = Game;