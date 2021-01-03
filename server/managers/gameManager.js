class GameManager {
    constructor() {
        this.games = [];

    }

    addGame(game) {
    }

    initGames() {
    }

    addPlayerToGame(socketID, playerName, selectedMap, selectedTank) {
        // create the player and add it to the game based on the 
        // selectedMap 
    }
    removePlayerBySocketID(socketID) {
        // first remove it from list of all players
        // tell the corresponding game to remove from its list
    }
}