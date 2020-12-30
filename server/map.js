const RectWall = require('./wall');

class NoSpawnPointsError extends Error {
    constructor(msg){
        super(msg);
    }
}

class GameMap {
    constructor(mapName, width, height){
        this.width = width;
        this.height = height;
        this.mapName = mapName;
        this.mapComponents = [];
        this.spawnPoints = {};
    }

    addMapComponent(component) {
        this.mapComponents.push(component);
    }

    getMapComponents() {
        return this.mapComponents;
    }

    getSpawnPoint(){

        for (const spawn in this.spawnPoints) {
            if (!this.spawnPoints[spawn].used) {
                this.spawnPoints[spawn].used = true;
                return this.spawnPoints[spawn];
            }
        }
        throw new NoSpawnPointsError('Sorry, all spawn points in this room are already occupied.');
    }

    restoreSpawn(spawnID){
        this.spawnPoints['spawn' + spawnID].used = false;
    }

}

class Map1 extends GameMap {
    constructor(mapName, width, height) {
        super(mapName, width, height);

        const wall1 = new RectWall(this.width / 2 - 40,
              this.height / 2 - 200,
              80, 400, 'gray')
        const wall2 = new RectWall(this.width / 2 - 200,
              this.height / 2 - 40,
              400, 80, 'gray')
        
        // add the two walls to the map's list of components
        this.addMapComponent(wall1);
        this.addMapComponent(wall2);
        
        this.spawnPoints = {
            spawn1: {
                used: false,
                coord: [20, 20],
                angle: 0,
                id: 1
            },
            
            spawn2: {
                used: false,
                coord: [900, 500],
                angle: 180,
                id: 2
            },

            spawn3: {
                used: false,
                coord: [900, 20],
                angle: 180,
                id: 3
            },

            spawn4: {
                used: false,
                coord: [20, 500],
                angle: 0,
                id: 4
            }
        }
        
    }
}

module.exports = Map1;