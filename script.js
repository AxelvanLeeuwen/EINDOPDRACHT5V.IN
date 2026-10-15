class Raster {
  constructor(r,k) {
    this.aantalRijen = 12;
    this.aantalKolommen = 18;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6,9);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  gleb = new Vijand(700,400);
  gleb.stapGrootte = 1*eve.stapGrootte;
  gleb.sprite = loadImage("images/sprites/Bob100px/Bob.png");  
}
function jeHebtVerloren() {  
  background('red')
  fill("white")
  text("je hebt verloren!",30,300)
  noLoop();
}
function jeHebtGewonnen() 
{background('green');
fill('white');
text("Je hebt gewonnen!",30,300);
noLoop();}

function draw() {
  background(brug);
  raster.teken();

  const cols = raster.aantalKolommen;
  const rows = raster.aantalRijen;
  const celGrootte = raster.celGrootte;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * celGrootte;
      let y = j * celGrootte;

      // Dit moet BINNEN de j-loop staan, zodat 'i' en 'j' bekend zijn
      let isBuitenrand = (i === 0 || i === cols - 1 || j === 0 || j === rows - 1);

      if (isBuitenrand) {
        if (mouseX > x && mouseX < x + celGrootte && mouseY > y && mouseY < y + celGrootte) {
          fill('red');
        } else {
          fill('blue');
        }
      } else {
        fill(255); // Kleur voor de binnenkant (bijv. wit)
      }

      // Vergeet niet het vakje hier te tekenen!
      rect(x, y, celGrootte, celGrootte);

    } // <--- Hier sluit pas de j-loop
  } // <--- Hier sluit pas de i-loop


  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  gleb.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  gleb.toon();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
     jeHebtVerloren(true)
  }

  if (eve.gehaald) {
   jeHebtGewonnen(true)
}
}