class Map {
    constructor(){
        this.gameComponents = [];
    }

    addComponent(component) {
        this.gameComponents.push(component);
    }
}

class Map1 extends Map {
    constructor() {
        super()
        this.wall1 = new RectWall(getCanvas.width / 2 - 40,
             getCanvas.height / 2 - 200,
              80, 400, 'gray')
        this.wall2 = new RectWall(getCanvas.width / 2 - 200,
             getCanvas.height / 2 - 40,
              400, 80, 'gray')
        this.addComponent(this.wall1);
        this.addComponent(this.wall2);
    }
}