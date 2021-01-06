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
                // change player's current map
                player.changeCurrentMap(game.getMapName());
                game.addNewPlayerToGame(player, selectedColor);
            }
        });
    }

    removePlayerFromGame(player) {
        // if player doesn't exist then do not proceed
        if (!player) return;

        // tell the corresponding game to remove from its list
        this.games.forEach(game => {
            if (game.getMapName() === player.currentMap) {
                game.removePlayer(player);
            }
        });
    }
}

module.exports = GameManager;