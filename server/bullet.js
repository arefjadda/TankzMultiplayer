const { Circle, Rectangle } = require('./shapes');
class Bullet extends Circle {
    constructor(posX, posY, radius, angle, speed, gameMap) {
        super(posX, posY, radius)
        this.angle = angle;
        this.speedX = speed * Math.cos(this.angle * Math.PI / 180);
        this.speedY = speed * Math.sin(this.angle * Math.PI / 180);
        this.lifeSpan = 3;
        this.explode = false;

        this.gameMap = gameMap;
    }

    update() {
        this.move();
    }

    move() {
        if (this.lifeSpan == 0 ) {
            this.explode = true;
        }
        
        this.posX = this.posX + this.speedX;
        this.posY = this.posY + this.speedY;
    }

    detectCollision(gameComponents) {
        // check for border collision
        this.detectBorderCollision();

        // check for collision
        this.detectRectCollision(gameComponents);

        // check for bullet collision
        this.detectBulletCollision(gameComponents);
    }

    detectRectCollision(gameComponents) {
        gameComponents.forEach(component => {
            if (component != this && 
                component instanceof Rectangle &&
                // collision detected
                this.rectCollision(component)[0]) {
                    if (this.rectCollision(component)[1]) { // hits the horizontal wall
                        this.speedY *= -1;
                    } else {
                        this.speedX *= -1;
                    }

                    // max 2 bounces unless it hits a tank
                    if (component instanceof Tank){
                        this.lifeSpan = 0;
                    } else {
                        this.lifeSpan -= 1;
                    }
                    
                }
        });
    }

    detectBulletCollision(gameComponents) {
        gameComponents.forEach(component => {
            if (component != this && 
                component instanceof Bullet &&
                // collision detected
                this.circleCollision(component)) {
                    this.lifeSpan = 0;
                }
        });
    }

    detectBorderCollision() {
        if (this.posX + this.radius < 0 || 
            this.posX + this.radius > this.gameMap.width) {
            this.speedX *= -1;
            this.lifeSpan -= 1;
        } 
        
        if (this.posY + this.radius < 0 ||
            this.posY + this.radius > this.gameMap.height) {
            this.speedY *= -1;
            this.lifeSpan -= 1;
        }

    }

}

module.exports = Bullet;