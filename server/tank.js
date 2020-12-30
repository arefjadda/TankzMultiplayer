const { Rectangle } = require('./shapes');
const Bullet = require('./bullet');

class Tank extends Rectangle {
    constructor(posX, posY, color, nozzleRot, gameMap) {
        super(posX, posY, 75, 50);
        this.speed = 1;
        this.reccolor = color;
        this.circolor = "black";
        
        this.gameMap = gameMap;

        // Nozzle properties
        this.nozzleColor = this.circolor;
        this.nozzleRot = nozzleRot;
        this.nozzleRotSpeed = 0.5;
        this.nozzleLen = 50;

        // To move or not to move
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.rotNozzleCW = false;
        this.rotNozzleCCW = false;
    }

    updateDirections(dirs) {
        this.moveLeft = dirs.leftKey;
        this.moveRight = dirs.rightKey;
        this.moveUp = dirs.upKey;
        this.moveDown = dirs.downKey;
        this.rotNozzleCW = dirs.nozzleCW;
        this.rotNozzleCCW = dirs.nozzleCCW;
    }

    update() {
        this.move();
        this.rotateNozzle();
    }

    move() {
        if (this.moveLeft) {
            this.posX -= this.speed;
        }
    
        if (this.moveRight) {
            this.posX += this.speed;
        }
    
        if (this.moveUp) {
            this.posY -= this.speed;
        }
    
        if (this.moveDown) {
            this.posY += this.speed;
        }

    }

    rotateNozzle() {
        if (this.rotNozzleCW) {
            this.nozzleRot += this.nozzleRotSpeed;
        }
    
        if (this.rotNozzleCCW) {
            this.nozzleRot -= this.nozzleRotSpeed;
        }

        this.nozzleRot = this.nozzleRot % 360;
    }

    shoot() {
        const bulletX = this.posX + (this.width / 2) + (52 * Math.cos(this.nozzleRot * (Math.PI / 180)));
        const bulletY = this.posY + (this.height / 2) + (52 * Math.sin(this.nozzleRot * (Math.PI / 180)));
        const bullet = new Bullet(bulletX, bulletY, 3, this.nozzleRot, 3, this.gameMap);
        return bullet;
    }

}

module.exports = Tank;