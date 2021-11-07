let amoebas = [];
let food = [];
let hunting;
let generations = 1;

// GAME VARIABLES
let numbAmoebas = 22;
let minSpeed = 0.3;
let maxSpeed = 1.3;
let amoebaSize = 7;
let lightSize = 7;
let randomFactor = 0.9;
let targetDistance = 4;
let maxHungry = 200;
let numbFood = 5;
let reproductionAge = 800;
let foodPackages = 10;

//DEFIINE CLASSES
class Amoeba {
  constructor(a,b){
    this.x = a,
    this.y = b, 
    this.color = [255,0,120],
    this.movement = {x: random(minSpeed,maxSpeed)*(random()<0.5?1:-1),
                     y: random(minSpeed,maxSpeed)*(random()<0.5?1:-1)},
    this.lastPos = {x: this.x, y: this.y}
    this.target = {}, // Momentary target, x. and y.
    this.oldDistance = 0;
    this.targets = [], // Array with Distances to targets
    this.hungry = 0;
    this.age = 0;
    }
  show(){
    fill(this.color);
    rect(this.x, this.y, amoebaSize, amoebaSize);
  }
  run(){
    this.lastPos = {x: this.x, y: this.y};
    this.x += this.movement.x;
    this.y += this.movement.y;
  }
  tumble(){
    this.movement = { x: random(minSpeed,maxSpeed)*(random()<0.5?1:-1),
                      y: random(minSpeed,maxSpeed)*(random()<0.5?1:-1)}
  }
  move(){
    this.run();
    if (dist(this.x,this.y,this.target.x,this.target.y) 
        > dist(this.lastPos.x,this.lastPos.y,this.target.x,this.target.y)
        || random() > randomFactor){
      this.tumble(); // Amoeba tries to move towards target, tumbles if moving away. Some randomness.
    }
  }
  setTarget(){
    if (food.length>0){
      for (let i = 0; i < food.length; i++){
        this.targets.push(dist(this.x,this.y,food[i].x,food[i].y));
      }
      this.target = {x: food[findMin(this.targets)].x, y: food[findMin(this.targets)].y};
      hunting = true;
    } else {
      this.target = {x: mouseX, y: mouseY};
      hunting = false;
    }
  }
  eat(){
    this.color = [255-this.hungry,0,120];
    if (dist(this.x,this.y,this.target.x,this.target.y)<targetDistance && hunting){
      food.splice(findMin(this.targets),1);
      this.hungry = 0;
    }
  }
  reproduce(){
    if (this.age > reproductionAge){
      amoebas.push(new Amoeba(this.x,this.y))
      this.age = 0;
    }
    
  }
  beAmoeba(){
    this.targets = [];
    this.show();
    this.setTarget();
    this.eat();
    this.move();
    this.reproduce();
  }
}
class Food {
  constructor(xPos,yPos){
    this.x = xPos + random()*50 - random()*50,
    this.y = yPos + random()*50 - random()*50
  }
  show(){
    fill(122,255,123,sin(frameCount/5)*50+150);
    rect(this.x, this.y, lightSize, lightSize);
    }
}


/// FUNCTION DEFINITIONS
function findMin(a){
  return a.indexOf(Math.min.apply(Math, a));
}
function createAmoebas(){
  for (let i=0; i<numbAmoebas; i++){
    amoebas.push(new Amoeba(random(100,200),random(100,200)));
  }
}
function createFood(a,b){
  if (foodPackages > 0){
    for (i = 0; i < numbFood; i++){
      food.push(new Food(a,b));
    }
    foodPackages -= 1;
  }
}
function mousePressed(){
  if (amoebas.length>0){
    createFood(mouseX,mouseY);
  } else {
    createAmoebas(); 
  }
}

// P5 SETUP
function setup(){
  createCanvas(windowWidth,windowHeight);
  noStroke();
  noCursor();
  createAmoebas();
}

//P5 DRAW LOOP
function draw(){
  //color setup
  blendMode(BLEND);
  background(56,54,60);
  blendMode(SCREEN);
  //draw mouse cursor light
  fill(255,230,120,sin(frameCount/5)*50+150);
  rect(mouseX, mouseY, lightSize, lightSize);

  //Food
  for (let i=0; i<food.length;i++){
    food[i].show();
  }

  //Amoebas
  for (let i = 0; i < amoebas.length; i++){
    amoebas[i].age += 1
    amoebas[i].hungry += random();
    amoebas[i].beAmoeba();
    if (amoebas[i].hungry > maxHungry){
      amoebas.splice(i,1);
    }
  }

  //Generation counter for score
  if (amoebas.length > 0 && amoebas[0].age == reproductionAge){
    generations += 1;
  }

  // Score
  fill(250,120,120);
  textSize(15);
  textAlign(RIGHT);
  textFont("Courier New");
  text(amoebas.length +" amoebas are alive", width-25, 25);
  text(foodPackages + " food packages left", width-25, 45);
  text(generations + ". generation ", width-25, 65);
} // END OF DRAW