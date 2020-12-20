let getCanvas = document.getElementById("myCanvas");
let canvas = getCanvas.getContext("2d");



function Tank(posX, posY, color){
    this.posX =  posX;
    this.posY = posY;
    this.width = 75;
    this.height = 50;
    this.reccolor = color;
    this.circolor = "black";
    this.nozzleColor = "black";
    this.update = function(){
        canvas.fillStyle = this.reccolor;
        canvas.fillRect(this.posX, this.posY, this.width, this.height);

        canvas.beginPath();
        canvas.arc((this.posX + (this.width/2)), (this.posY + (this.height/2)), this.height/3, 0, 2 * Math.PI);
        canvas.fillStyle = this.circolor;
        canvas.fill()
        canvas.stroke();

        canvas.fillStyle = this.nozzleColor;
        canvas.fillRect((this.posX + (this.width/2)), (this.posY + (this.height/2) - 4.5), 50, 9);
        console.log(this);
    }

}

let tank1 = new Tank(20, 20, "pink");
tank1.update();

document.addEventListener('keydown', moveTank);
function moveTank(){
    tank1.posX +=1;
    tank1.posY +=1;
    canvas.clearRect(0, 0, getCanvas.width, getCanvas.height);
    tank1.update();
}

// setInterval(() => {
//     moveTank
// }, 0.02);

