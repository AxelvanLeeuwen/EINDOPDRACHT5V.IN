class Raster {
  constructor() {
    this.aantalRijen = 12;
    this.aantalKolommen = 18;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }
  // blauwe rand 
  teken() {
    push();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        let x = kolom * this.celGrootte;
        let y = rij * this.celGrootte;
        let isBuitenrand = (kolom === 0 || kolom === this.aantalKolommen - 1 || rij === 0 || rij === this.aantalRijen - 1);
        if (isBuitenrand) {
          if (mouseX > x && mouseX < x + this.celGrootte && mouseY > y && mouseY < y + this.celGrootte) {
            fill('red');
          } else {
            fill('blue');
          }
        } else {
          noFill();
        }
        rect(x, y, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
      if (keyIsDown(65)) { this.x -= this.stapGrootte; this.frameNummer = 2; }
      if (keyIsDown(68)) { this.x += this.stapGrootte; this.frameNummer = 1; }
      if (keyIsDown(87)) { this.y -= this.stapGrootte; this.frameNummer = 4; }
      if (keyIsDown(83)) { this.y += this.stapGrootte; this.frameNummer = 5; }

      // speler blijft binnen de blauwe randen
      this.x = constrain(this.x, raster.celGrootte, canvas.width - 2 * raster.celGrootte);

      // extra toevoeging: van onder naar boven "teleporteren"
      if (this.y >= canvas.height - raster.celGrootte) {
          this.y = raster.celGrootte;
      }
      this.y = constrain(this.y, raster.celGrootte, canvas.height - 2 * raster.celGrootte);

      if (this.x >= canvas.width - 2 * raster.celGrootte) {
          this.gehaald = true;
      }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    } else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;
    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}
// raket 
class Raket {
  constructor(x, zwaartekracht) {
    this.x = x;
    this.sprite = null;
    this.zwaartekracht = zwaartekracht;
    this.plafond = raster.celGrootte;
    this.bodem = canvas.height - 2 * raster.celGrootte;
    this.y = this.bodem;

    let hoogte = this.bodem - this.plafond;
    this.startSnelheid = sqrt(2 * this.zwaartekracht * hoogte);      //m.b.v. ChatGPT
    this.snelheidY = -this.startSnelheid;
  }

  beweeg() {
    this.snelheidY += this.zwaartekracht;
    this.y += this.snelheidY;

    if (this.y >= this.bodem) {
      this.y = this.bodem;
      this.snelheidY = -this.startSnelheid;
    }
    if (this.y < this.plafond) {
      this.y = this.plafond;
      this.snelheidY = 0;
    }
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}
//pingpongbal
class Bal {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.sx = 8;
    this.sy = 8;
    this.grootte = 30;
  }

  beweeg() {
    this.x += this.sx;
    this.y += this.sy;
    if (this.x < 0 || this.x > canvas.width) this.sx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.sy *= -1;
  }

  toon() {
    fill('orange');
    noStroke();
    ellipse(this.x, this.y, this.grootte);
  }
}
// piramide op de achtergrond
function piramide(x, y, b) {
  if (b < 10) return;
  fill(255, 215, 0, 80);
  noStroke();
  rect(x - b / 2, y, b, 20);
  piramide(x, y + 20, b * 0.8);
}

function eindscherm(tekst, kleur) {
  background(kleur);
  fill('white');
  text(tekst, 30, 300);
  noLoop();
}
// verliesscherm en eindschermfuncties
function jeHebtVerloren() { eindscherm("Je hebt verloren!", 'red'); }
function jeHebtGewonnen() { eindscherm("Je hebt gewonnen!", 'green'); }

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(40);

  raster = new Raster();
  raster.berekenCelGrootte();

  levens = 3;

  eve = new Jos();
  eve.stapGrootte = raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");
  // extra vijand Gleb (bom)
  gleb = new Vijand(700, 400);
  gleb.stapGrootte = eve.stapGrootte;
  gleb.sprite = loadImage("images/sprites/bom.png");
  // extra vijand cindy
  cindy = new Vijand(500, 300);
  cindy.stapGrootte = eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  raketSprite = loadImage("images/sprites/Raket.png");
  raketten = [];
  for (var i = 0; i < 3; i++) {
    let kolom = floor(random(10, 18));
    let r = new Raket(kolom * raster.celGrootte, random(8, 15));
    r.sprite = raketSprite;
    raketten.push(r);
  }

  bal = new Bal();
}

function draw() {
  background(brug);
  piramide(canvas.width / 2, 100, 400);
  raster.teken();

  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  gleb.beweeg();
  cindy.beweeg();
  for (var r of raketten) r.beweeg();
  bal.beweeg();

  eve.toon();
  alice.toon();
  bob.toon();
  gleb.toon();
  cindy.toon();
  for (var r of raketten) r.toon();
  bal.toon();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
    levens--;
    eve.x = 0;
  }

  //extra vijand Gleb (bom: geraakt=verloren)
  if (eve.wordtGeraakt(gleb)) {
    jeHebtVerloren();
  }
  
  for (var r of raketten) {
    if (eve.x < r.x + raster.celGrootte && eve.x + raster.celGrootte > r.x &&
      eve.y < r.y + raster.celGrootte && eve.y + raster.celGrootte > r.y) {
      levens--;
      eve.x = 0;
    }
  }

  if (eve.x < bal.x + bal.grootte && eve.x + raster.celGrootte > bal.x &&
    eve.y < bal.y + bal.grootte && eve.y + raster.celGrootte > bal.y) {
    levens++;
    bal.x = random(100, 800);
    bal.y = random(100, 500);
  }
  //levens
  fill('white');
  textSize(20);
  text("Levens: " + levens, 10, 30);
  textSize(40);

  if (levens <= 0) jeHebtVerloren();
  if (eve.gehaald) jeHebtGewonnen();
}