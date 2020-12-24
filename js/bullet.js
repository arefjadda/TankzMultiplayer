class Bullet extends Circle {
    constructor(posX, posY, radius, angle, speed) {
        super(posX, posY, radius)
        this.angle = angle;
        this.speedX = speed * Math.cos(this.angle * Math.PI / 180);
        this.speedY = speed * Math.sin(this.angle * Math.PI / 180);
        this.lifeSpan = 3;
        this.explode = false;
    }

    update() {
        // draw
        canvas.beginPath();
        canvas.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        canvas.fillStyle = "orange";
        canvas.fill();

        this.move()
        
    }

    move() {
        if (this.lifeSpan == 0 ) {
            this.explode = true;
        }
        
        this.posX = this.posX + this.speedX;
        this.posY = this.posY + this.speedY;

        // check for collision
        this.detectRectCollision()

        // check for border collision
        this.detectBorderCollision()
    }

    detectRectCollision() {
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

                    this.lifeSpan -= 1;
                }
        });
    }

    detectBorderCollision() {
        if (this.posX + this.radius < 0 || 
            this.posX + this.radius > getCanvas.width) {
            this.speedX *= -1;
            this.lifeSpan -= 1;
        } 
        
        if (this.posY + this.radius < 0 ||
            this.posY + this.radius > getCanvas.height) {
            this.speedY *= -1;
            this.lifeSpan -= 1;
        }

    }

}