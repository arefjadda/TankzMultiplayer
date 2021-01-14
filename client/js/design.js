'use strict';

const pi2 = Math.PI*2;

class Tank {
    constructor() {
        this.speed = 1;
        this.rotation = 0;
        this.tRotatation = 0;
        this.tank = null;
    }

    init(ix, iy, irotation) {
        this.rotation = irotation;
        this.tRotatation = irotation;
        this.tank = document.createElement('div');
        this.tank.setAttribute('class', 'tank');
        this.tank.innerHTML = '<span></span><i></i><span></span>';
        document.getElementById('container').appendChild(this.tank);

        this.x = ix;
        this.y = iy;
    }

    wander(objects) {
        if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight)
        {
            this.repel = true;
            this.tRotatation += .01;

        }
        else if (count % Math.round(Math.random() * 100) == 0 && !this.repel) {
            count = 0;
            this.tRotatation = this.tRotatation + ((Math.random() * 2) - 1);
        }
        else {
            this.repel = false;
        }
        
        if (this.rotation < 0 || this.rotation > pi2) {
            this.rotation = Math.abs(pi2 - this.rotation);
            this.tRotatation = Math.abs(pi2 - this.tRotatation);  
        }
        
        this.rotation += (this.tRotatation - this.rotation) * .05;
        
        this.y += this.speed * Math.cos(this.rotation);
        this.x += this.speed * Math.sin(this.rotation);

        const transformStyle = 'rotate(' + (-this.rotation) + 'rad)';

        this.tank.style.transform = transformStyle;
        this.tank.style.mozTransform = transformStyle;
        this.tank.style.oTransform = transformStyle;
        this.tank.style.left = this.x + 'px';
        this.tank.style.top = this.y + 'px';
    }

    distance(x1, y1, x2, y2) {
        const distX = x2 - x1;
        distX = distX * distX;
        const distY = y2 - y1;
        distY = distY * distY;
        return Math.sqrt(distX + distY);
    }
}

class App {
    constructor() {
        this.tanks = [];
        this.totalTanks = 10;
    }
    
    createTanks() {
      for (let i = 0; i < this.totalTanks; i++) {
        const lady = new Tank();
        lady.init(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * pi2);

        this.tanks.push(lady);
      }
    }

    updateTanks() {
      for (let i = 0; i < this.totalTanks; i++) {
        this.tanks[i].wander(this.tanks);
      }
    }
}
let count = 0;
const app = new App();
app.createTanks();

function step() {
  app.updateTanks();
  window.requestAnimationFrame(step);
  count++;
}

window.requestAnimationFrame(step);