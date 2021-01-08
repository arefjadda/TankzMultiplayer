// Get map name from the URL and send it through socket
let urlSplit = document.URL.split('/'); 
network.sendPlayerEntry(
    urlSplit[urlSplit.length - 1], 
    $("#playerName").val(),
    $("#tankColor").val());

let leftKey = false;
let rightKey = false;
let upKey = false;
let downKey = false;
let nozzleCW = false;
let nozzleCCW = false;
let correctKey = false;

getCanvas.addEventListener('keydown', (e) => {
    if(e.repeat){return}

    if (gameState === 'play') {
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
    }
   
    
});

getCanvas.addEventListener('keyup', (e) => {

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

// Chat

const message = $("#message"),
    handle = $("#playerName"),
    btn = $("#send");

message.on('keypress', function(e) {
    if (e.key === 'Enter' && message.val() !== "") {
        network.sendMessage({
            handle: handle.val(),
            message: message.val()});
        message.val("");
    }
});

btn.on('click', function() {
    if (message.val() !== "") {
        network.sendMessage({
            handle: handle.val(),
            message: message.val()});
        message.val("");
    }
});





