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

    detectCollision(gameComponents) {
        // border collision check
        this.detectBorderCollision();
        // compoenent collision check
        this.detectComponentCollision(gameComponents);
    }

    detectBorderCollision() {
        if(this.posX < 0) {
            this.posX = 0;
        }

        // Nozzle can't cross the boundaries
        if(this.posX + (this.width / 2) + (50 * Math.cos(this.nozzleRot * (Math.PI / 180))) < 0) {
            this.posX = -12.5 * Math.cos(this.nozzleRot * (Math.PI / 180));
        }

        if(this.posY < 0) {
            this.posY = 0;
        }

        // Nozzle can't cross the boundaries
        if(this.posY + (this.height / 2) + (50 * Math.sin(this.nozzleRot * (Math.PI / 180))) < 0) {
            this.posY = -25 * Math.sin(this.nozzleRot * (Math.PI / 180));
        }

        if(this.posX + this.width > this.gameMap.width) {
            this.posX = this.gameMap.width - this.width;
        }

        // Nozzle can't cross the boundaries
        if(this.posX + (this.width / 2) + (50 * Math.cos(this.nozzleRot * (Math.PI / 180))) > this.gameMap.width) {
            this.posX = this.gameMap.width - 12.5 * Math.cos(this.nozzleRot * (Math.PI / 180)) - this.width;
        }

        if(this.posY + this.height > this.gameMap.height) {
            this.posY = this.gameMap.height - this.height;
        }

        // Nozzle can't cross the boundaries
        if(this.posY + (this.height / 2) + (50 * Math.sin(this.nozzleRot * (Math.PI / 180))) > this.gameMap.height) {
            this.posY = this.gameMap.height -25 * Math.sin(this.nozzleRot * (Math.PI / 180)) - this.height;
        }
    }

    detectComponentCollision(gameComponents) {
        gameComponents.forEach((component) => {
            if (component != this && 
                component instanceof Rectangle && 
                this.rectCollision(component)) {
                    
                    // Aref made this
                    if (this.moveRight && this.posX + this.width < component.posX + this.speed + this.speed / 2) {
                        this.posX = component.posX - this.width;
                    }

                    if (this.moveLeft && this.posX > component.posX + component.width - this.speed - this.speed / 2) {
                        this.posX = component.posX + component.width;
                    }

                    if (this.moveUp && this.posY > component.posY + component.height - this.speed - this.speed / 2) {
                        this.posY = component.posY + component.height;
                    }

                    if (this.moveDown && this.posY + this.height < component.posY + this.speed + this.speed / 2) {
                        this.posY = component.posY - this.height;
                    }

            }
            
        });
    }


}

module.exports = Tank;