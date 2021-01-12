const { Rectangle } = require('./shapes');
const Bullet = require('./bullet');

class Tank extends Rectangle {
    constructor(posX, posY, color, nozzleRot, mapFriction = 0.5, acceleration = 1, owner, ownerID) {
        super(posX, posY, 75, 50);
        this.owner = owner;
        this.ownerID = ownerID;
        this.reccolor = color;
        this.circolor = "black";

        // Movement
        this.acceleration = acceleration;
        this.friction = mapFriction;
        this.maxSpeed = 1;
        this.speedX = 0;
        this.speedY = this.speedX;

        // Health
        this.health = 100;
        this.exploded = false;

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

        this.shotBullet = null;

        // component type
        this.type = 'tank';
    }

    restore() {
        this.health = 100;
        this.exploded = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.rotNozzleCW = false;
        this.rotNozzleCCW = false;
    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0) this.exploded = true;
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
        // set a max speed if acceleration is not given

        if (this.moveLeft) 
            if (Math.abs(this.speedX) < this.maxSpeed) 
                this.speedX -= this.acceleration;
    
        if (this.moveRight) 
            if (Math.abs(this.speedX) < this.maxSpeed) 
                this.speedX += this.acceleration; 
        
        if (this.moveUp) 
            if (Math.abs(this.speedY) < this.maxSpeed) 
                this.speedY -= this.acceleration;
        
        if (this.moveDown) 
            if (Math.abs(this.speedY) < this.maxSpeed) 
                this.speedY += this.acceleration;

        if (this.speedX !== 0) {
            if (Math.abs(this.speedX) <= 0.01) this.speedX = 0;

            if (this.speedX > 0) this.speedX -= this.friction;
            else if (this.speedX < 0) this.speedX += this.friction;
        }

        if (this.speedY !== 0) {
            if (Math.abs(this.speedY) <= 0.01) this.speedY = 0;
            
            if (this.speedY > 0) this.speedY -= this.friction;
            else if (this.speedY < 0) this.speedY += this.friction;
        }

        this.posX += this.speedX;
        this.posY += this.speedY;
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
        this.shotBullet = new Bullet(bulletX, bulletY, 3, this.nozzleRot, 3);

    }

    getBullet() {
        const bullet = this.shotBullet;
        this.shotBullet = null;
        return bullet;
    }

}

module.exports = Tank;