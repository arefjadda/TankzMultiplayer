/**
 * This is the socket network between the client and the backend
 */
class Network {
    constructor() {
        // TODO: get this URL from the environment variables
        this.socket = io.connect();
        this.explodedBullets = [];

        
        let network = this;

        // Listening on these events
        this.socket.on('current-state', function closure(data) { 
            network.updateState(data, network.explodedBullets); 
        });
        this.socket.on('game-state', this.updateGameState);
        this.socket.on('chat', this.writeMessage);
        this.socket.on('user-lists', this.updateUserList);
        this.socket.on('count-down', this.countDownUpdate);

    }

    sendPlayerEntry(mapName, playerName, selectedColor) {
        this.socket.emit('player-entry', {
            mapName, 
            playerName, 
            selectedColor});
    }

    sendMovement(data) {
        this.socket.emit('tank-movement', data);
    }

    sendShot() {
        this.socket.emit('tank-shot');
    }

    // Send chat events
    sendMessage(data) {
        this.socket.emit('chat', data);
    }

    /**
     * Listens for updated states from server.
     *f
     * @param {{tanks: array, bullets: array, walls: array}} data - a collection of game components
     */
    updateState(data, explodedBullets) {
        data.tanks.forEach((tank) => {
            if (tank.shotBullet)
            {
                let audio = new Audio('../assets/bullet_fire.mp3');
                audio.play();
            }
            drawTank(tank);
        });

        data.bullets.forEach((bullet) => {
            if (bullet.exploded) {
                let audio = new Audio('../assets/explosion2.mp3');
                audio.play();

                bullet.explosionSpan = 60;
                explodedBullets.push(bullet);
            }
            else{
                drawBullet(bullet);
            }

            if (bullet.hitWall) {
                let audio = new Audio('../assets/pong.mp3');
                audio.volume = 0.3;
                audio.play();
            }
        });

        data.walls.forEach((wall) => {
            drawWall(wall);
        });

        drawBulletsExplosions(explodedBullets);
    }

    updateGameState(data) {
        gameState = data.state;
    }

    /**
     * Listens for updated user list from server.
     * @param {{players: array, spectators: array}} data - A list of players and spectators
     */
    updateUserList(data) {
        // clear player list
        playerList.innerHTML = '';
        spectatorList.innerHTML = '';
        data.players.forEach(p => {
            playerList.innerHTML += `<p>${p.name } (${p.gameWins})<p>`;
        });

        data.spectators.forEach(s => {
           spectatorList.innerHTML += `<p>${s.name} (${s.gameWins})</p>`;
        });
    }

    countDownUpdate(data) {
        drawTimer(data.timer);
    }

    // Chat update functions

    writeMessage(data) {
        console.log('received')
        feedback.innerHTML = '';
        output.innerHTML += ('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>');
    }

}
