const RectWall = require('./wall');

class GameMap {
    constructor(mapName, width, height){
        this.gameComponents = [];
        this.width = width;
        this.height = height;
        this.mapName = mapName;
    }

    addComponent(component) {
        this.gameComponents.push(component);
    }
}

class Map1 extends GameMap {
    constructor(mapName, width, height) {
        super(mapName, width, height);
        this.wall1 = new RectWall(this.width / 2 - 40,
              this.height / 2 - 200,
              80, 400, 'gray')
        this.wall2 = new RectWall(this.width / 2 - 200,
              this.height / 2 - 40,
              400, 80, 'gray')
        this.addComponent(this.wall1);
        this.addComponent(this.wall2);
    }
}

module.exports = Map1;