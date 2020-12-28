// Everything that should be in this file:
// New user enters or leaves the room (assigning a new tank)


setInterval(() => {
    tank1.move(leftKey, rightKey, upKey, downKey);
    tank1.rotateNozzle(nozzleCW, nozzleCCW);

    canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
    map.gameComponents.forEach((component) => {
        component.update();

        if (component instanceof Bullet && component.explode) {
            map.gameComponents.splice(map.gameComponents.indexOf(component), 1);
        }

    });

}, 1 / FPS);