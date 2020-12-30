const RectWall = require('./wall');

class GameMap {
    constructor(mapName, width, height){
        this.width = width;
        this.height = height;
        this.mapName = mapName;
        this.mapComponents = [];
    }

    addMapComponent(component) {
        this.mapComponents.push(component);
    }

    getMapComponents() {
        return this.mapComponents;
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

        this.playerTanks = {
            tank1: {
                used: false,
                pos: [20, 20],
                
            } 
        }
    }
}

module.exports = Map1;