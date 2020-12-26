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

            return true;
        }
        return false;
        
    }

    circleCollision(circle) {
        // Nearest edge to the circle in the x direction 
        let nearestEdgeX;

        // Nearest edge to the circle in the y direciton
        let nearestEdgeY;

        if (circle.posX < this.posX) {                      // near the left edge
            nearestEdgeX = this.posX;

        } else if (circle.posX > this.posX + this.width) { // near the right edge
            nearestEdgeX = this.posX + this.width;
        } 

        if (circle.posY < this.posY) {                      // near the top edge
            nearestEdgeY = this.posY;

        } else if (circle.posY > this.posY + this.height) { // near the bottom edge
            nearestEdgeY = this.posY + this.height;

        }

        // Calculating the distance
        const distX = circle.posX - nearestEdgeX;
        const distY = circle.posY - nearestEdgeY;
        // Eculidean distance
        const distance = Math.sqrt((distX * distX)+(distY * distY));

        return distance <= circle.radius;
    }

}


class Circle {
    constructor(posX, posY, radius) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }

    rectCollision(rect) {
        // Nearest edge to the circle in the x direction 
        let nearestEdgeX = this.posX;

        // Nearest edge to the circle in the y direciton
        let nearestEdgeY = this.posY;

        if (this.posX < rect.posX) {                      // near the left edge
            nearestEdgeX = rect.posX;

        } else if (this.posX > rect.posX + rect.width) { // near the right edge
            nearestEdgeX = rect.posX + rect.width;
        } 

        if (this.posY < rect.posY) {                      // near the top edge
            nearestEdgeY = rect.posY;

        } else if (this.posY > rect.posY + rect.height) { // near the bottom edge
            nearestEdgeY = rect.posY + rect.height;

        }

        // Calculating the distance
        const distX = this.posX - nearestEdgeX;
        const distY = this.posY - nearestEdgeY;
;
        // Eculidean distance
        const distance = Math.sqrt((distX * distX) + (distY * distY));
        
        return [distance <= this.radius, Math.abs(distX) <  Math.abs(distY)];
    }

    circleCollision(circle) {
        const distance = Math.sqrt((this.posX - circle.posX)**2 + (this.posY - circle.posY)**2);
        if (this.radius + circle.radius >= distance) {
            return true;
        }
        return false;
    }
}