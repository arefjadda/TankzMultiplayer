// Initialize network
const network = new Network('http://localhost:5000');
myCanvas = document.getElementById("myCanvas");

// Authenticate player
network.sendPlayerAuthentication('Player');

let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;
let nozzleCW = false;
let nozzleCCW = false;
let correctKey = false;

myCanvas.addEventListener('keydown', (e) => {
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

myCanvas.addEventListener('keyup', (e) => {

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






