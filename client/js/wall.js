class RectWall extends Rectangle {
    constructor(posX, posY, width, height, color='gray') {
        super(posX, posY, width, height);
        
        this.color = color;
    }
    update() {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.posX, this.posY, this.width, this.height);
    }
}

