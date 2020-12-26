let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");
const FPS = 50;

let gameComponents = [];


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
let test_wall = new RectWall(500, 240, 100, 100);
gameComponents.push(tank1);
gameComponents.push(test_wall);


setInterval(() => {
    tank1.move(leftKey, rightKey, upKey, downKey);
    tank1.rotateNozzle(nozzleCW, nozzleCCW);

    canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
    gameComponents.forEach((component) => {
        component.update();

        if (component instanceof Bullet && component.explode) {
            gameComponents.splice(gameComponents.indexOf(component), 1);
        }

    });

}, 1 / FPS);






