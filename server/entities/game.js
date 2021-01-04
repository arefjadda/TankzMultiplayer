const CollisionManager = require('../managers/collisionManager');

const GameState = {
    IDLE: "idle",
    COUNTING_DOWN: "count_down",
    STARTING: "start",
    PLAYING: "play", 
    ENDING: "end"
}


class Game {
    constructor(gameMap, FPS=120) {
        this.players = []
        this.spectators = [];

        // The map of the game
        this.gameMap = gameMap;
        // List of all game components
        this.gameComponents = this.gameMap.getMapComponents();

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


    addPlayerToGame(player, selectedColor) {
        // create the tank based on the selected color and add it to the list
        // of components of this game.
    }

    getMapName() {
        return this.gameMap.mapName;
    }

    getMap() {
        return this.gameMap;
    }

    // ====== START: state functions ======

    init() {
        // setInterval(() => {
        //     this.UpdateGameState();
        //     this.updateComponents();
        //     this.sendStates();
        
        // }, 1000 / this.FPS);
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

    UpdateGameState() {
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

    // ====== END: state functions ======


}

module.exports = Game;