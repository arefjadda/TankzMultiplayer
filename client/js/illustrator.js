let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");

function drawTank(tank) {
    canvas.fillStyle = tank.reccolor;
    canvas.fillRect(tank.posX, tank.posY, tank.width, tank.height);

    canvas.beginPath();
    canvas.arc((tank.posX + (tank.width / 2)), (tank.posY + (tank.height / 2)), tank.height / 3, 0, 2 * Math.PI);
    canvas.fillStyle = tank.circolor;
    canvas.fill();
    
    // Rotate the nozzle
    canvas.save();
    canvas.translate(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2));
    canvas.rotate(tank.nozzleRot * Math.PI / 180);
    canvas.translate(-(tank.posX + (tank.width / 2)), - (tank.posY + (tank.height / 2)));
    canvas.fillStyle = tank.nozzleColor;
    canvas.fillRect(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2) - 4.5, 50, 9);
    canvas.restore();
}

function drawBullet(bullet) {
    canvas.beginPath();
    canvas.arc(bullet.posX, bullet.posY, bullet.radius, 0, 2 * Math.PI);
    canvas.fillStyle = "red"; // TODO: move back
    canvas.fill();
}

function drawWall(wall) {
    canvas.fillStyle = wall.color;
    canvas.fillRect(wall.posX, wall.posY, wall.width, wall.height);
}