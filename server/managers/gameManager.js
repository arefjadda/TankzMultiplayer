class GameManager {
    constructor() {
        this.games = [];

    }

    addGame() {
    }

    initGames() {
    }

    addPlayerToGame(player, selectedMap, selectedColor) {
        // create the player and add it to the game based on the 
        // selectedMap 
        
        this.games.forEach(game => {
            if (game.getMapName() === selectedMap.toLowerCase()) {
                game.addPlayerToGame(player, selectedColor);
            }
        });
    }
    removePlayer(player) {
        // first remove it from list of all players
        // tell the corresponding game to remove from its list
    }
}

module.exports = GameManager;