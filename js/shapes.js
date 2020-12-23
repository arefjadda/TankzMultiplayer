class Rectangle {
    constructor(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
    }

    rectCollision(rect) {
        if (this.posX < rect.posX + rect.width &&
            this.posX + this.width > rect.posX &&
            this.posY < rect.posY + rect.height &&
            this.posY + this.height > rect.posY) {
            
            if (this.posY + this.height > rect.posY) {
                this.posY = rect.posY - this.height;
            }
            return true;
        }
        return false;
        
    }

    circleCollision(circle) {
        Error("Implement");
    }

}


class Circle {
    constructor(posX, posY, radius) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }
}