class Bullet {
    constructor(posX, posY, angle, speed = 1) {
        this.posX = posX;
        this.posY = posY;
        this.speed = speed;
        this.angle = angle;
    }

    update() {
        canvas.beginPath();
        canvas.arc(this.posX, this.posY, 3, 0, 2 * Math.PI);
        canvas.fillStyle = "orange";
        canvas.fill();
        this.posX = this.posX + this.speed * Math.cos(this.angle * Math.PI / 180);
        this.posY = this.posY + this.speed * Math.sin(this.angle * Math.PI / 180);
    }

}