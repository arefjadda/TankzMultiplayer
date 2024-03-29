const {Rectangle} = require('../entities/shapes');
const Tank = require('../entities/tank');
const Bullet = require('../entities/bullet');

class CollisionManager {
    constructor(gameComponents, gameMap) {
        this.gameComponents = gameComponents;
        this.gameMap = gameMap;
    }

    rectOnRectCollision(rect1, rect2) {
        return rect1.posX < rect2.posX + rect2.width &&
            rect1.posX + rect1.width > rect2.posX &&
            rect1.posY < rect2.posY + rect2.height &&
            rect1.posY + rect1.height > rect2.posY;

    }

    circleOnRectCollision(circle, rect) {
        // Nearest edge of rectangle to the circle in the x direction 
        let nearestEdgeX = circle.posX;

        // Nearest edge of rectangle to the circle in the y direction
        let nearestEdgeY = circle.posY;

        if (circle.posX <= rect.posX) {                      // near the left edge
            nearestEdgeX = rect.posX;

        } else if (circle.posX >= rect.posX + rect.width) { // near the right edge
            nearestEdgeX = rect.posX + rect.width;
        } 

        if (circle.posY < rect.posY) {                      // near the top edge
            nearestEdgeY = rect.posY;

        } else if (circle.posY > rect.posY + rect.height) { // near the bottom edge
            nearestEdgeY = rect.posY + rect.height;

        }

        // Calculating the distance
        const distX = circle.posX - nearestEdgeX;
        const distY = circle.posY - nearestEdgeY;

        // Euclidean distance
        const distance = Math.sqrt((distX * distX) + (distY * distY));
        
        return {
            collided: distance <= circle.radius,
            horizontalCollision: Math.abs(distX) <  Math.abs(distY)
        }
    }

    circleOnCircleCollision(circle1, circle2) {
        const distance = Math.sqrt((circle1.posX - circle2.posX)**2 + (circle1.posY - circle2.posY)**2);
        return circle1.radius + circle2.radius >= distance;

    }

    /* ====== TANK Collision ===== */
    detectCollisionForTank(tank) {
        this.detectBordersForTank(tank);
        this.detectRectForTank(tank);
    }

    detectBordersForTank(tank) {
        if(tank.posX < 0) {
            tank.posX = 0;
        }

        // Nozzle can't cross the boundaries
        if(tank.posX + (tank.width / 2) + (50 * Math.cos(tank.nozzleRot * (Math.PI / 180))) < 0) {
            tank.posX = -12.5 * Math.cos(tank.nozzleRot * (Math.PI / 180));
        }

        if(tank.posY < 0) {
            tank.posY = 0;
        }

        // Nozzle can't cross the boundaries
        if(tank.posY + (tank.height / 2) + (50 * Math.sin(tank.nozzleRot * (Math.PI / 180))) < 0) {
            tank.posY = -25 * Math.sin(tank.nozzleRot * (Math.PI / 180));
        }

        if(tank.posX + tank.width > this.gameMap.width) {
            tank.posX = this.gameMap.width - tank.width;
        }

        // Nozzle can't cross the boundaries
        if(tank.posX + (tank.width / 2) + (50 * Math.cos(tank.nozzleRot * (Math.PI / 180))) > this.gameMap.width) {
            tank.posX = this.gameMap.width - 12.5 * Math.cos(tank.nozzleRot * (Math.PI / 180)) - tank.width;
        }

        if(tank.posY + tank.height > this.gameMap.height) {
            tank.posY = this.gameMap.height - tank.height;
        }

        // Nozzle can't cross the boundaries
        if(tank.posY + (tank.height / 2) + (50 * Math.sin(tank.nozzleRot * (Math.PI / 180))) > this.gameMap.height) {
            tank.posY = this.gameMap.height -25 * Math.sin(tank.nozzleRot * (Math.PI / 180)) - tank.height;
        }
    }

    detectRectForTank(tank) {
        // tanks and walls are rectangles
        this.gameComponents.tanks.concat(this.gameComponents.walls)
            .forEach((component) => {
                if (component !== tank &&
                    component instanceof Rectangle &&
                    this.rectOnRectCollision(tank, component)) {
                    if (tank.posX + tank.width < component.posX + tank.maxSpeed + tank.acceleration / 2) {
                        tank.speedX = 0;
                        tank.posX = component.posX - tank.width;
                    }

                    if (tank.posX > component.posX + component.width - tank.maxSpeed - tank.acceleration / 2) {
                        tank.speedX = 0;
                        tank.posX = component.posX + component.width;
                    }

                    if (tank.posY > component.posY + component.height - tank.maxSpeed - tank.acceleration / 2) {
                        tank.speedY = 0;
                        tank.posY = component.posY + component.height;
                    }

                    if (tank.posY + tank.height < component.posY + tank.maxSpeed + tank.acceleration / 2) {
                        tank.speedY = 0;
                        tank.posY = component.posY - tank.height;
                    }
                }
        });
    }

    /* ====== Bullet Collision ===== */

    detectCollisionForBullet(bullet) {
        bullet.hitWall = false;
        this.detectBorderForBullet(bullet);
        this.detectRectForBullet(bullet);
        this.detectBulletForBullet(bullet);
    }

    detectBorderForBullet(bullet) {
        if (bullet.posX + bullet.radius < 0 || 
            bullet.posX + bullet.radius > this.gameMap.width) {
            bullet.speedX *= -1;
            bullet.lifeSpan -= 1;

            if ( bullet.lifeSpan > 0) {
                bullet.hitWall = true;
            }
        } 
        
        if (bullet.posY + bullet.radius < 0 ||
            bullet.posY + bullet.radius > this.gameMap.height) {
            bullet.speedY *= -1;
            bullet.lifeSpan -= 1;

            if ( bullet.lifeSpan > 0) {
                bullet.hitWall = true;
            }
        }
    }

    detectRectForBullet(bullet) {
        // tanks and walls are rectangles
        this.gameComponents.tanks.concat(this.gameComponents.walls)
            .forEach(component => {
                if (component !== this && component instanceof Rectangle) {

                const collisionResult = this.circleOnRectCollision(bullet, component);

                if (collisionResult.collided) {
                    if (collisionResult.horizontalCollision) { // hits the horizontal wall
                        bullet.speedY *= -1;
                        bullet.hitWall = true;
                    } else {
                        bullet.speedX *= -1;
                        bullet.hitWall = true;
                    }

                    // max 2 bounces unless it hits a tank
                    if (component instanceof Tank){
                        component.takeDamage(bullet.damage);
                        bullet.explode()
                        bullet.hitWall = false;
                    } else {
                        bullet.lifeSpan -= 1;
                        if ( bullet.lifeSpan == 0) {
                            bullet.hitWall = false;
                        }
                    }
                }
                    
                    
                }
        });
    }

    detectBulletForBullet(bullet) {
        this.gameComponents.bullets.forEach(component => {
            if (component !== bullet &&
                component instanceof Bullet &&
                // collision detected
                this.circleOnCircleCollision(bullet, component)) {
                    bullet.lifeSpan = 0;
                }
        });
        
    }

    /* For all collidable components */
    detectCollision(component) {
        if (component instanceof Tank) {
            this.detectCollisionForTank(component);
        } else if (component instanceof Bullet) {
            this.detectCollisionForBullet(component);
        }
    }
}

module.exports = CollisionManager;