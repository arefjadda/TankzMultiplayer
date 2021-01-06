class Rectangle {
    constructor(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
    }

}


class Circle {
    constructor(posX, posY, radius) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }
}

module.exports = {
    Rectangle, 
    Circle
}