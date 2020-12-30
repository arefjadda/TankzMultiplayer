const { Rectangle } = require('./shapes');

class RectWall extends Rectangle {
    constructor(posX, posY, width, height, color='gray') {
        super(posX, posY, width, height);
        
        this.color = color;
    }

    update() {
        // console.log("must update wall");
    }
}

module.exports = RectWall;