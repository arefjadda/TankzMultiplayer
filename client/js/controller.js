let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");
const FPS = 60;


// Initialize network
const network = new Network('http://localhost:5000')

let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;
let nozzleCW = false;
let nozzleCCW = false;
let correctKey = false;

document.addEventListener('keydown', (e) => {

    if(e.repeat){return}
    switch (e.key) {
        case 'a':
            // Move left
            leftKey = true;
            correctKey = true;
            break;

        case 'd':
            // Move right
            rightKey = true;
            correctKey = true;
            break;
        
        case 'w':
            // Move up
            upKey = true;
            correctKey = true;
            break;
        
        case 's':
            // Move down
            downKey = true;
            correctKey = true;
            break;
        
        case '.':
            // Nozzle CW
            nozzleCW = true;
            correctKey = true;
            break;
        
        case ',':
            // Nozzle CCW
            nozzleCCW = true;
            correctKey = true;
            break;

        case ' ':
            // Shoot
            e.preventDefault();
            correctKey = true;
            tank1.shoot();
            network.sendShot();
            break;
    
        default:
            break;
    }
    if (correctKey) {
        network.sendMovement({
            leftKey,
            rightKey,
            upKey,
            downKey,
            nozzleCW,
            nozzleCCW
        });
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
            break;
    
        default:
            break;
    }

    network.sendMovement({
        leftKey,
        rightKey,
        upKey,
        downKey,
        nozzleCW,
        nozzleCCW
    });
});


let tank1 = new Tank(20, 20, "forestgreen", 0);
let tank2 = new Tank(900, 500, "pink", 180);
let map = new Map1();

map.addComponent(tank1);
map.addComponent(tank2);


// setInterval(() => {
//     tank1.move(leftKey, rightKey, upKey, downKey);
//     tank1.rotateNozzle(nozzleCW, nozzleCCW);

//     canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
//     map.gameComponents.forEach((component) => {
//         component.update();

//         if (component instanceof Bullet && component.explode) {
//             map.gameComponents.splice(map.gameComponents.indexOf(component), 1);
//         }

//     });

// }, 1000 / FPS);






