let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");
const FPS = 50;

let gameComponents = [];


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

class Tank {
    constructor(posX, posY, color, nozzleRot) {
        this.posX = posX;
        this.posY = posY;
        this.width = 75;
        this.height = 50;
        this.speed = 1;
        this.reccolor = color;
        this.circolor = "black";

        // Nozzle properties
        this.nozzleColor = "red";
        this.nozzleRot = 0;
        this.nozzleRotSpeed = 1;
        this.nozzleLen = 50;

    }

    update() {
        canvas.fillStyle = this.reccolor;
        canvas.fillRect(this.posX, this.posY, this.width, this.height);

        canvas.beginPath();
        canvas.arc((this.posX + (this.width / 2)), (this.posY + (this.height / 2)), this.height / 3, 0, 2 * Math.PI);
        canvas.fillStyle = this.circolor;
        canvas.fill();
        
        // Rotate the heck out of my nozzle
        canvas.save();
        canvas.translate(this.posX + (this.width / 2), this.posY + (this.height / 2));
        canvas.rotate(this.nozzleRot * Math.PI / 180);
        canvas.translate(-(this.posX + (this.width / 2)), - (this.posY + (this.height / 2)));
        canvas.fillStyle = this.nozzleColor;
        canvas.fillRect(this.posX + (this.width / 2), this.posY + (this.height / 2) - 4.5, 50, 9);
        canvas.restore();
    };

    move(left=false, right=false, up=false, down=false) {
        if (left) {
            this.posX -= this.speed;
        }
    
        if (right) {
            this.posX += this.speed;
        }
    
        if (up) {
            this.posY -= this.speed;
        }
    
        if (down) {
            this.posY += this.speed;
        }

        if(this.posX < 0) {
            this.posX = 0;
        }

        // Nozzle can't cross the boundaries
        if(this.posX + (this.width / 2) + (50 * Math.cos(this.nozzleRot * (Math.PI / 180))) < 0) {
            this.posX = -12.5 * Math.cos(this.nozzleRot * (Math.PI / 180));
        }

        if(this.posY < 0) {
            this.posY = 0;
        }

        // Nozzle can't cross the boundaries
        if(this.posY + (this.height / 2) + (50 * Math.sin(this.nozzleRot * (Math.PI / 180))) < 0) {
            this.posY = -25 * Math.sin(this.nozzleRot * (Math.PI / 180));
        }

        if(this.posX + this.width > getCanvas.width) {
            this.posX = getCanvas.width - this.width;
        }

        // Nozzle can't cross the boundaries
        if(this.posX + (this.width / 2) + (50 * Math.cos(this.nozzleRot * (Math.PI / 180))) > getCanvas.width) {
            this.posX = getCanvas.width - 12.5 * Math.cos(this.nozzleRot * (Math.PI / 180)) - this.width;
        }

        if(this.posY + this.height > getCanvas.height) {
            this.posY = getCanvas.height - this.height;
        }

        // Nozzle can't cross the boundaries
        if(this.posY + (this.height / 2) + (50 * Math.sin(this.nozzleRot * (Math.PI / 180))) > getCanvas.height) {
            this.posY = getCanvas.height -25 * Math.sin(this.nozzleRot * (Math.PI / 180)) - this.height;
        }
    }

    rotateNozzle(nozzleCW=false, nozzleCCW=false) {
        if (nozzleCW) {
            this.nozzleRot += this.nozzleRotSpeed;
        }
    
        if (nozzleCCW) {
            this.nozzleRot -= this.nozzleRotSpeed;
        }

        this.nozzleRot = this.nozzleRot % 360;
    }

    shoot() {
        const bulletX = this.posX + (this.width / 2) + (52 * Math.cos(this.nozzleRot * (Math.PI / 180)));
        const bulletY = this.posY + (this.height / 2) + (52 * Math.sin(this.nozzleRot * (Math.PI / 180)));
        const bullet = new Bullet(bulletX, bulletY, this.nozzleRot);
        gameComponents.push(bullet);
    }

}

let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;
let nozzleCW = false;
let nozzleCCW = false; 
let shoot = false;

document.addEventListener('keydown', (e) => {

    if(e.repeat){return}
    switch (e.key) {
        case 'a':
            // Move left
            leftKey = true;
            break;

        case 'd':
            // Move right
            rightKey = true;
            break;
        
        case 'w':
            // Move up
            upKey = true;
            break;
        
        case 's':
            // Move down
            downKey = true;
            break;
        
        case '.':
            // Nozzle CW
            nozzleCW = true;
            break;
        
        case ',':
            // Nozzle CCW
            nozzleCCW = true;
            break;

        case ' ':
            // Shoot
            e.preventDefault();
            tank1.shoot()
            break;
    
        default:
            break;
    }
});

document.addEventListener('keyup', (e) => {

    switch (e.key) {
        case 'a':
            // Move left
            leftKey = false;
            break;

        case 'd':
            // Move right
            rightKey = false;
            break;
    
        case 'w':
            // Move up
            upKey = false;
            break;
        
        case 's':
            // Move down
            downKey = false;
            break;

        case '.':
            // Nozzle CW
            nozzleCW = false;
            break;
        
        case ',':
            // Nozzle CCW
            nozzleCCW = false;
            break;
        
        case ' ':
            // Shoot
            e.preventDefault();
            shoot = false;
            break;
    
        default:
            break;
    }
});


let tank1 = new Tank(20, 20, "forestgreen", 0);
gameComponents.push(tank1);


setInterval(() => {
    tank1.move(leftKey, rightKey, upKey, downKey);
    tank1.rotateNozzle(nozzleCW, nozzleCCW);

    canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);

    gameComponents.forEach((component) => {
        component.update();
    });

}, 1 / FPS);






