const { Circle, Rectangle } = require('./shapes');
class Bullet extends Circle {
    constructor(posX, posY, radius, angle, speed, ownerID) {
        super(posX, posY, radius)
        this.angle = angle;
        this.speedX = speed * Math.cos(this.angle * Math.PI / 180);
        this.speedY = speed * Math.sin(this.angle * Math.PI / 180);
        this.lifeSpan = 3;
        this.exploded = false;

        this.hitWall = false;

        // tank that shot this bullet
        this.ownerID = ownerID;

        // Damage
        this.damage = 20;

        // Damage
        this.damage = 20;

        // component type
        this.type = 'bullet';
    }

    update() {
        this.move();
    }

    move() {
        if (this.lifeSpan == 0 ) {
            this.exploded = true;
        }
        
        this.posX = this.posX + this.speedX;
        this.posY = this.posY + this.speedY;
    }

    explode() {
        this.exploded = true;
        this.lifeSpan = 0;
    }

}

module.exports = Bullet;