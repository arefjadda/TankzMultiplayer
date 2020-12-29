const { Rectangle } = require('./shapes');

// Todo: Hardcoding canvas
const CANVAS = {
    width: 1000,
    height: 640
}

class Tank extends Rectangle {
    constructor(posX, posY, color, nozzleRot) {
        super(posX, posY, 75, 50);
        this.speed = 1;
        this.reccolor = color;
        this.circolor = "black";

        // Nozzle properties
        this.nozzleColor = this.circolor;
        this.nozzleRot = nozzleRot;
        this.nozzleRotSpeed = 0.5;
        this.nozzleLen = 50;

    }

    move(left=false, right=false, up=false, down=false) {
        if (left) {
            this.posX -= this.speed;
        }
    
        if (right) {
            this.posX += this.speed;
        }
    
        if (up) {
            this.posY -= this.speed;
        }
    
        if (down) {
            this.posY += this.speed;
        }

        // border collision check
        // this.detectBorderCollision()

        // compoenent collision check
        // this.detectRectCollision(left, right, up, down)

    }

    rotateNozzle(nozzleCW=false, nozzleCCW=false) {
        if (nozzleCW) {
            this.nozzleRot += this.nozzleRotSpeed;
        }
    
        if (nozzleCCW) {
            this.nozzleRot -= this.nozzleRotSpeed;
        }

        this.nozzleRot = this.nozzleRot % 360;
    }

    shoot() {
        const bulletX = this.posX + (this.width / 2) + (52 * Math.cos(this.nozzleRot * (Math.PI / 180)));
        const bulletY = this.posY + (this.height / 2) + (52 * Math.sin(this.nozzleRot * (Math.PI / 180)));
        const bullet = new Bullet(bulletX, bulletY, 3, this.nozzleRot, 3);
        map.addComponent(bullet);
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

        if(this.posX + this.width > CANVAS.width) {
            this.posX = CANVAS.width - this.width;
        }

        // Nozzle can't cross the boundaries
        if(this.posX + (this.width / 2) + (50 * Math.cos(this.nozzleRot * (Math.PI / 180))) > CANVAS.width) {
            this.posX = CANVAS.width - 12.5 * Math.cos(this.nozzleRot * (Math.PI / 180)) - this.width;
        }

        if(this.posY + this.height > CANVAS.height) {
            this.posY = CANVAS.height - this.height;
        }

        // Nozzle can't cross the boundaries
        if(this.posY + (this.height / 2) + (50 * Math.sin(this.nozzleRot * (Math.PI / 180))) > CANVAS.height) {
            this.posY = CANVAS.height -25 * Math.sin(this.nozzleRot * (Math.PI / 180)) - this.height;
        }
    }

    detectRectCollision(left, right, up, down) {
        map.gameComponents.forEach((component) => {
            if (component != this && 
                component instanceof Rectangle && 
                this.rectCollision(component)) {
                    
                    // Aref made this
                    if (right && this.posX + this.width < component.posX + this.speed + this.speed / 2) {
                        this.posX = component.posX - this.width;
                    }

                    if (left && this.posX > component.posX + component.width - this.speed - this.speed / 2) {
                        this.posX = component.posX + component.width;
                    }

                    if (up && this.posY > component.posY + component.height - this.speed - this.speed / 2) {
                        this.posY = component.posY + component.height;
                    }

                    if (down && this.posY + this.height < component.posY + this.speed + this.speed / 2) {
                        this.posY = component.posY - this.height;
                    }
            }
            
        });
    }

}

module.exports = Tank;