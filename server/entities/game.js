const CollisionManager = require('../managers/collisionManager');
const Bullet = require('../entities/bullet');
const Tank = require('../entities/tank');
const {PlayerState} = require('../entities/player');

const GameState = {
    IDLE: "idle",
    STARTING_COUNTDOWN: "starting_countdown",
    COUNTING_DOWN: "counting_down",
    STARTING: "start",
    PLAYING: "play", 
    ENDING: "end",
}


class Game {
    constructor(gameMap, socketio, FPS=120) {
        this.players = []
        this.spectators = [];

        // The map of the game
        this.gameMap = gameMap;
        // List of all game components
        this.gameComponents = {
            tanks: [],
            bullets: [],
            walls: this.gameMap.getMapComponents(),
        }

        // socketio
        this.socketio = socketio;

        // A manager for game's collision system
        this.collisionManager = new CollisionManager(this.gameComponents, this.gameMap);

        // If game tied
        this.isTie = false;
        this.winner = null;

        this.state = GameState.IDLE;
        this.nextState = this.state;

        /* timer countdown in seconds */
        this.countDownDuration = 65;
        this.countDownTimer = this.countDownDuration;
        this.FPS = FPS;

        this.init();
    }

    getMapName() {
        return this.gameMap.mapName;
    }

    getMap() {
        return this.gameMap;
    }

    addComponent(component) {
        if (component instanceof Tank) {
            this.gameComponents.tanks.push(component)
        } else if (component instanceof Bullet) {
            this.gameComponents.bullets.push(component)
        } else {
            throw "can't add component to the list of components"
        }

    }

    changePlayerState(player, state) {
        player.changeState(state);
    }

    addPlayerToSpectators(player) {
        this.changePlayerState(player, PlayerState.SPECTATING);
        this.spectators.push(player);
    }


    addPlayerToPlayers(player, spawnID) {
        this.changePlayerState(player, PlayerState.PLAYING);
        player.attachSpawnID(spawnID);
        
        this.initPlayerSpawn(player, spawnID);

        // Add new player to the collection of players
        this.players.push(player);
    }

    initPlayerSpawn(player, spawnID) {
        player.tank.posX = this.gameMap.getSpawnByID(spawnID).coord[0];
        player.tank.posY = this.gameMap.getSpawnByID(spawnID).coord[1];
        player.tank.nozzleRot = this.gameMap.getSpawnByID(spawnID).angle;
    }

    addNewPlayerToGame(player, selectedColor) {
        // create the tank based on the selected color and add it to the list
        // of components of this game.

        const tank = new Tank(
            null, 
            null, 
            selectedColor, 
            null, 
            this.gameMap.friction, 
            this.gameMap.tanksAcceleration,
            player.getName(),
            player.socketID);
        
        // Attach the tank to player
        player.attachTank(tank);
        
        if (this.state === GameState.IDLE || this.state === GameState.COUNTING_DOWN)
            this.movePlayerToGame(player);
        else 
            this.addPlayerToSpectators(player);
    }

    movePlayerToGame (player) {
            // TODO: If this game state is in idle/counting down then player may be added!

            // Spawn the tank
        const spawn = this.gameMap.getSpawnPoint();

        if (spawn) {

            this.addPlayerToPlayers(player, spawn.id);

            // Add the player's tank to the game map
            this.addComponent(player.tank);
        }
        else {
            this.addPlayerToSpectators(player);
        }
    }


    removeOwnerByTank(tank) {
        const owner = this.players.filter(p => p.socketID === tank.ownerID)[0];
        this.removePlayerFromPlayers(owner);
        this.addPlayerToSpectators(owner);
    }

    /**
     * Remove player tank component from game
     * @param {Player} player - player object
     */
    removePlayerTank(player) {
        let tankIndx = -1;
        for (let i = 0; i < this.gameComponents.tanks.length; i++) {
            if (this.gameComponents.tanks[i].ownerID === player.socketID) {
                tankIndx = i;
            }
        }

        // make sure the tank is actually player's
        this.gameComponents.tanks.splice(tankIndx, 1);

    }

    removePlayerFromPlayers(player) {
        this.removePlayerTank(player);
        this.gameMap.restoreSpawn(player.spawnID);
        this.players = this.players.filter(p => p.socketID !== player.socketID);
    }

    removePlayerFromSpectators(player) {
        this.spectators = this.spectators.filter(p => p.socketID !== player.socketID);
    }

    removePlayer(player) {
        console.log('removing player');
        if (player.state === PlayerState.PLAYING) {
            this.removePlayerFromPlayers(player);
        } else if (player.state === PlayerState.SPECTATING) {
            this.removePlayerFromSpectators(player);
        }
    }

    // ====== START: state functions ======

    init() {
        setInterval(() => {
            this.updateGameState();
            this.updateComponents();
            this.sendStates();
            this.sendGameState();
        
        }, 1000 / this.FPS);
    }

    startCountDown(seconds) {
        this.countDownTimer = seconds;
        const timer = setInterval(() => {
            console.log(this.countDownTimer);
            this.countDownTimer -= 1;
            if (this.countDownTimer === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    resetCountDown() {
        this.countDownTimer = this.countDownDuration; 
    }

    addSpectatorsToGame() {
        let totalSpawns = this.gameMap.getTotalSpawns();
        console.log(totalSpawns, "totalspawns")
        if (this.winner) {
            totalSpawns --;
            this.initPlayerSpawn(this.winner, this.winner.spawnID);
        }
        // remove the first totalSpawns spectators and add them to the game
        for (let i=0; i < totalSpawns; i++) {
            if (this.spectators.length > 0) {
                this.movePlayerToGame(this.spectators.shift());
                console.log(this.spectators, "L");
            }
                
        }
    }

    restoreGameState() {
        this.isTie = false;
        this.winner = null;
        this.gameComponents.tanks.forEach(tank => tank.restore());
    }

    updateGameState() {
        this.state = this.nextState;
        switch (this.state) {
            case GameState.IDLE:
                if (this.players.length >= 2) 
                    this.nextState = GameState.STARTING_COUNTDOWN;
                break;

            case GameState.STARTING_COUNTDOWN:
                this.startCountDown(this.countDownDuration);
                this.nextState = GameState.COUNTING_DOWN;
                break;

            case GameState.COUNTING_DOWN:
                if (this.countDownTimer === 0) {
                    this.resetCountDown();

                    if (this.players.length < 2) {
                        this.nextState = GameState.IDLE;
                    }
                    else {
                        console.log("about to start homie");
                        this.nextState = GameState.STARTING;
                    }
                }
                break;

            case GameState.STARTING:
                this.nextState = GameState.PLAYING;
                break;
            
            case GameState.PLAYING:
                if (this.players.length === 1) {
                    this.winner = this.players[0];
                    this.startCountDown(5);
                    console.log(this.winner.name, 'won');
                    this.nextState = GameState.ENDING;
                } else if (this.players.length === 0) {
                    this.isTie = true;
                    this.startCountDown(5);
                    console.log('tie');
                    this.nextState = GameState.ENDING;
                }
                break;

            case GameState.ENDING:
                if (this.countDownTimer === 0) {
                    this.addSpectatorsToGame();
                    this.restoreGameState();
                    this.nextState = GameState.IDLE;
                }
                break;
        
            default:
                break;
        }

    }


    sendGameState() {
        this.socketio
            .to(this.getMapName())
            .emit('game-state', { state: this.state});
    }
    // ====== END: state functions ======

    updateComponents() {
        // Loop through bullets
        this.gameComponents.bullets.forEach(bullet => {
            // if bullet is exploded, remove bullet from bullet list
            if (bullet.exploded) {
                this.gameComponents.bullets.splice(this.gameComponents.bullets.indexOf(bullet), 1);

            } else {
                bullet.update()
                this.collisionManager.detectCollision(bullet);
            }
        });

        // Loop through tanks
        this.gameComponents.tanks.forEach(tank => {
            // if tank has bullet ready
            const bullet = tank.getBullet();
            if (bullet) {
                this.addComponent(bullet);
            }

            // if tank is exploded, remove tank from tank list
            if (tank.exploded) {
                this.removeOwnerByTank(tank);

            } else {
                tank.update()
                this.collisionManager.detectCollision(tank);
            }
        });

    }

    sendStates() {
        this.socketio
            .to(this.getMapName())
            .emit('current-state', this.gameComponents);
    }


}

module.exports = Game;