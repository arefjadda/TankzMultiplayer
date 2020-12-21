let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");
const FPS = 50;


class Tank {
    constructor(posX, posY, color, nozzleRot) {
        this.posX = posX;
        this.posY = posY;
        this.width = 75;
        this.height = 50;
        this.speed = 0.5;
        this.reccolor = color;
        this.circolor = "black";

        // Nuzzle properties
        this.nozzleColor = "red";
        this.nozzleRot = 0;
        this.nozzleRotSpeed = 1;

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
}

let tank1 = new Tank(20, 20, "forestgreen", 0);

let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;
let nozzleCW = false;
let nozzleCCW = false; 

document.addEventListener('keydown', (e) => {

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
    
    
        default:
            break;
    }
});





setInterval(() => {
    tank1.move(leftKey, rightKey, upKey, downKey);
    tank1.rotateNozzle(nozzleCW, nozzleCCW);

    canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
    tank1.update();
}, 1 / FPS);






