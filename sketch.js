let amoebas = [];
let origin = [100,100];
let numbAmoebas = 40;
let minSpeed = .5;
let maxSpeed = 2;
let amoebaSize = 7;
let pathSize = 3;
let randomFactor = 0.7;
let pathLength = 30;
let lightSize = 7;
let blink = 0;
let maxHungry=200;
let food = [];
let targetDistance=2;
let hungryAmoebas = 0;

function setup(){
  createCanvas(windowWidth,windowHeight);
  noStroke();
  noCursor();
  drawAmoebas();
  // Create Swarm of Amoebas

}


function drawAmoebas(){
  for (i=0; i<numbAmoebas; i+=1){
    // Single Amoeba Object 
    let myAmoeba = {
    x: origin[0], // start X
    y: origin[1], // start Y
    color: [0,255,120],
    move: [random(minSpeed,maxSpeed),random(minSpeed,maxSpeed)], // movement vector
    path: [], //history of past positions
    hungry: round(random(0,8),0),
    targetX: mouseX,
    targetY: mouseY,
    targets: []
    }
    amoebas.push(myAmoeba)
  }
}
// Define a new movement vector
function tumble(amoeba){
  amoeba.move[0] = random(-maxSpeed,maxSpeed),random(-maxSpeed,maxSpeed);
  amoeba.move[1] = random(-maxSpeed,maxSpeed),random(-maxSpeed,maxSpeed);
}

// Amoeba moves as defined by its movement vector
function run(amoeba){
  amoeba.x+=amoeba.move[0];
  amoeba.y+=amoeba.move[1];
}

// Add Food 
function mousePressed(){
  if (amoebas.length>1){
    food.push({x: mouseX, y: mouseY});
  } else {
    drawAmoebas();
  }
  
}


//Needed to find best target
function findMin(a){
  return a.indexOf(Math.min.apply(Math, a));
 }


//Here comes the fun part
function draw(){
  blendMode(BLEND);
  background(56,54,60);
  blendMode(SCREEN);
  
  //draw mouse cursor light
  fill(255,230,120,sin(frameCount/5)*50+150);
  rect(mouseX, mouseY, lightSize, lightSize);

  //draw food
  for (let i=0; i<food.length; i++){
    let thisFood = food[i];
    fill(122,255,123,sin(frameCount/5)*50+150);
    rect(thisFood.x, thisFood.y, lightSize, lightSize);
    console.log("I put some food at position x:"+ thisFood.x + " y: " + thisFood.y)
  }


  // Loop through all the amoebas
  for (let i=0; i<amoebas.length;i++) {
    let thisAmoeba = amoebas[i];

    //Temporally add mouse position to food array because it's a target, too
    food.push({x: mouseX, y: mouseY});

    //Set Amoeba Target && check if Amoeba
    for (let i=0; i<food.length; i++){
      let thisFood = food[i];
      targetX=thisFood.x;
      targetY=thisFood.y;
      thisAmoeba.targets.push(dist(thisAmoeba.x,thisAmoeba.y,targetX,targetY));
    }
  
    // Set Ammoeba target to closets target in targets array
    thisAmoeba.targetX = food[findMin(thisAmoeba.targets)].x;
    thisAmoeba.targetY = food[findMin(thisAmoeba.targets)].y;

    // Remove mouse position again from food array because it's not fucking food.
    food.pop();

    //See if this Amoeba ate something
    if (dist(thisAmoeba.x,thisAmoeba.y,thisAmoeba.targetX,thisAmoeba.targetY)<targetDistance &&
        dist(thisAmoeba.x,thisAmoeba.y,mouseX,mouseY)>targetDistance){
        console.log(food);
        food.splice(findMin(thisAmoeba.targets),1);
        console.log("I spliced the foot array at position " + findMin(thisAmoeba.targets));
        console.log(food);
        thisAmoeba.hungry=0;
    }
    

    // Distance from target at the moment
    let oldDistance = dist(thisAmoeba.x,thisAmoeba.y,thisAmoeba.targetX,thisAmoeba.targetY)
    
    // Draw path of amoeba
    for (let j = 0; j < thisAmoeba.path.length; j +=1){
      fill(thisAmoeba.color);
      rect(thisAmoeba.path[j].x, thisAmoeba.path[j].y, pathSize)
    }
    
    // Draw this little Amoebey
    fill(thisAmoeba.color);
    rect(thisAmoeba.x,thisAmoeba.y,amoebaSize,amoebaSize);
    run(thisAmoeba);

    //Tumble or Run Descission
    let newDistance=dist(thisAmoeba.x,thisAmoeba.y,thisAmoeba.targetX,thisAmoeba.targetY)
    if (newDistance > oldDistance || random()>randomFactor){
    tumble(thisAmoeba);
    }

    // Write current x,y to path
    thisAmoeba.path.push({x: thisAmoeba.x, y: thisAmoeba.y})
    if (thisAmoeba.path.length>pathLength){
      thisAmoeba.path.shift();
     } 


    // Let amoeba get Hungry
    if (frameCount % 10 == 0){
     thisAmoeba.hungry++
     thisAmoeba.color = [thisAmoeba.hungry*255/maxHungry,255-thisAmoeba.hungry*255/maxHungry,120-thisAmoeba.hungry*120/maxHungry];
    }
  
   // Starve Amoebas
   if (thisAmoeba.hungry == maxHungry){
     amoebas.splice(i,1);
   }

   thisAmoeba.targets = [];
   if (thisAmoeba.hungry > maxHungry/2){
     hungryAmoebas++;
   }

  } // END OF AMOEBA LOOP 
  
// Score

fill(250,120,120);
textSize(15);
textAlign(RIGHT);
textFont("Courier New")
text(amoebas.length +" of your amoebas are alive", width-25, 25);
text(hungryAmoebas + " of your amoebas are very hungry", width-25,42)

hungryAmoebas=0;
} // END OF DRAW