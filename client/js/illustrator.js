function drawTank(tank) {
    
    ctx.fillStyle = tank.reccolor;
    ctx.fillRect(tank.posX, tank.posY, tank.width, tank.height);
    
    ctx.beginPath();
    ctx.arc((tank.posX + (tank.width / 2)), (tank.posY + (tank.height / 2)), tank.height / 3, 0, 2 * Math.PI);
    ctx.fillStyle = tank.circolor;
    ctx.fill();
    
    // Rotate the nozzle
    ctx.save();
    ctx.translate(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2));
    ctx.rotate(tank.nozzleRot * Math.PI / 180);
    ctx.translate(-(tank.posX + (tank.width / 2)), - (tank.posY + (tank.height / 2)));
    ctx.fillStyle = tank.nozzleColor;
    ctx.fillRect(tank.posX + (tank.width / 2), tank.posY + (tank.height / 2) - 4.5, 50, 9);
    ctx.restore();

    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillRect(tank.posX, tank.posY - 10, tank.width, 5);
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(tank.posX, tank.posY - 10, tank.width * tank.health / 100, 5);
    ctx.strokeStyle = "black";
    ctx.strokeRect(tank.posX, tank.posY - 10, tank.width, 5);

    // draw name
    const fontSize = 15;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center"; 
    ctx.fillText(tank.owner, tank.posX + (tank.width / 2), tank.posY - 14)

}

function drawBullet(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.posX, bullet.posY, bullet.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red"; // TODO: move to backend
    ctx.fill();
}

function drawWall(wall) {
    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.posX, wall.posY, wall.width, wall.height);
}


function clearCanvas() {
    ctx.clearRect(0, 0, getCanvas.width, getCanvas.height);
}