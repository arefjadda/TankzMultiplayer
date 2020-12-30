const RectWall = require('./wall');

class GameMap {
    constructor(mapName, width, height){
        this.width = width;
        this.height = height;
        this.mapName = mapName;
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
    }
}

module.exports = Map1;