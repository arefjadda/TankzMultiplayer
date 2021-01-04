class GameManager {
    constructor() {
        this.games = [];

    }

    addGame(game) {
        this.games.push(game);
    }

    initGames() {
    }

    getMapByName(mapName) {
        let map;
        this.games.forEach(game => {
            if (game.getMapName() === mapName.toLowerCase()) {
                map = game.getMap();
            }
        });

        return map; // did not find such map
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