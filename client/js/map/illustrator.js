function drawTank(tank) {
  ctx.fillStyle = tank.reccolor;
  ctx.fillRect(tank.posX, tank.posY, tank.width, tank.height);

  ctx.beginPath();
  ctx.arc(
    tank.posX + tank.width / 2,
    tank.posY + tank.height / 2,
    tank.height / 3,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = tank.circolor;
  ctx.fill();

  // Rotate the nozzle
  ctx.save();
  ctx.translate(tank.posX + tank.width / 2, tank.posY + tank.height / 2);
  ctx.rotate((tank.nozzleRot * Math.PI) / 180);
  ctx.translate(-(tank.posX + tank.width / 2), -(tank.posY + tank.height / 2));
  ctx.fillStyle = tank.nozzleColor;
  ctx.fillRect(
    tank.posX + tank.width / 2,
    tank.posY + tank.height / 2 - 4.5,
    50,
    9
  );
  ctx.restore();

  // Draw health bar
  ctx.fillStyle = "red";
  ctx.fillRect(tank.posX, tank.posY - 10, tank.width, 5);
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(tank.posX, tank.posY - 10, (tank.width * tank.health) / 100, 5);
  ctx.strokeStyle = "black";
  ctx.strokeRect(tank.posX, tank.posY - 10, tank.width, 5);

  // draw name
  const fontSize = 15;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(tank.owner, tank.posX + tank.width / 2, tank.posY - 14);
}

function drawBullet(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.posX, bullet.posY, bullet.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "red"; // TODO: move to backend
  ctx.fill();
}

function drawWall(wall) {
  // Create a pattern, offscreen
  const patternCanvas = document.createElement("canvas");
  const patternContext = patternCanvas.getContext("2d");

  // Give the pattern a width and height of 50
  patternCanvas.width = 15;
  patternCanvas.height = 15;

  // Give the pattern a background color and draw an arc
  patternContext.fillStyle = wall.color;
  patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.beginPath();
  patternContext.moveTo(0, 0);
  patternContext.lineTo(15, 15);
  patternContext.lineWidth = 3;
  patternContext.strokeStyle = "#5a5570";
  patternContext.stroke();
  patternContext.beginPath();
  patternContext.moveTo(0, 15);
  patternContext.lineTo(15, 0);
  patternContext.lineWidth = 3;
  patternContext.strokeStyle = "#5a5570";
  patternContext.stroke();
  const pattern = ctx.createPattern(patternCanvas, "repeat");

  ctx.fillStyle = pattern;
  ctx.fillRect(wall.posX, wall.posY, wall.width, wall.height);
}

function drawBulletsExplosions(explodedBullets) {
  // if there exist exploded bullets then draw them
  if (explodedBullets) {
    const colors = ["red", "orange", "yellow", "rgb(200, 0, 0)"];
    explodedBullets.forEach((bullet) => {
      let scale = 60 - bullet.explosionSpan;
      for (let index = 0; index < 5 + Math.floor(Math.random() * 6); index++) {
        ctx.beginPath();

        ctx.arc(
          bullet.posX +
            (Math.round(Math.random()) ? 1 : -1) *
              Math.floor((Math.random() * scale) / 5),
          bullet.posY +
            (Math.round(Math.random()) ? 1 : -1) *
              Math.floor((Math.random() * scale) / 5),
          3 + Math.floor((Math.random() * scale) / 6),
          0,
          2 * Math.PI
        );

        ctx.fillStyle = colors[Math.floor(Math.random() * 4)]; //`rgba(${142 + Math.floor(Math.random() * 120)}, ${42 + Math.floor(Math.random() * 120)}, ${0 + Math.floor(Math.random() * 20)}, ${0.3 + Math.floor(Math.random() * 8) * 0.1})`;
        ctx.fill();
      }
      for (let index = 0; index < 5 + Math.floor(Math.random() * 10); index++) {
        ctx.beginPath();

        ctx.arc(
          bullet.posX +
            (Math.round(Math.random()) ? 1 : -1) *
              Math.floor((Math.random() * scale) / 2),
          bullet.posY +
            (Math.round(Math.random()) ? 1 : -1) *
              Math.floor((Math.random() * scale) / 2),
          1 + Math.floor(Math.random() * 2),
          0,
          2 * Math.PI
        );

        ctx.fillStyle = "gray"; //`rgba(${142 + Math.floor(Math.random() * 120)}, ${42 + Math.floor(Math.random() * 120)}, ${0 + Math.floor(Math.random() * 20)}, ${0.3 + Math.floor(Math.random() * 8) * 0.1})`;
        ctx.fill();
      }

      bullet.explosionSpan--;
      if (bullet.explosionSpan == 0) {
        // remove it from the explodedBullets
        explodedBullets.splice(explodedBullets.indexOf(bullet), 1);
      }
    });
  }
}

function drawTimer(time) {
  clearCircle(ctx, getCanvas.width / 2, getCanvas.height / 2, 50);
  ctx.beginPath();
  ctx.arc(getCanvas.width / 2, getCanvas.height / 2, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  const fontSize = 55;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  if (time === 2 || time === 1 || time === 0) {
    ctx.fillText("GO", getCanvas.width / 2, getCanvas.height / 2 + 20);
  } else {
    ctx.fillText(
      (time - 2).toString(),
      getCanvas.width / 2,
      getCanvas.height / 2 + 20
    );
  }

  console.log(time);
}

function drawWinner(winner) {
  const fontSize = 65;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  ctx.fillText(
    winner.name + " won!",
    getCanvas.width / 2,
    getCanvas.height / 2 + 20
  );
}

function drawIdleEvent() {
  const fontSize = 30;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  ctx.fillText(
    "Wait for others to join!",
    getCanvas.width / 2,
    getCanvas.height / 2 + 8
  );
}

function clearCircle(ctx, x, y, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.clip();
  ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
}

function clearCanvas() {
  ctx.clearRect(0, 0, getCanvas.width, getCanvas.height);
}
