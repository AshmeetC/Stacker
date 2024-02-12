let board;
let cols, rows;
let cellWidth;
let currentColor = "#09090b";
let currentPiece;
let level;
let levelSpeed;
let spawnSide;
let gameState;
let lastDirection = "r";
let isMovingRight = false;
let score = 0;
let isWaiting = false;

const canvasDimension = 300;

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", "assets/particles.json", function () {
  console.log("callback - particles.js config loaded");
});

const drawBoard = (rows, cols) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellWidth;
      const y = r * cellWidth;

      stroke(255);
      fill(currentColor);
      square(x, y, cellWidth);
    }
  }
};

const drawAllPieces = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = board[r][c];
      if (piece !== 0) {
        piece.display();
      }
    }
  }
};

function setup() {
  cols = 8;
  rows = 15;

  const canvas = createCanvas(canvasDimension, (canvasDimension / cols) * rows);
  frameRate(60);
  canvas.parent("Stacker");
  strokeWeight(1.5);

  cellWidth = canvasDimension / cols;
  cellHeight = canvasDimension / rows;

  board = new Array(rows).fill().map(() => new Array(cols).fill(0));
  level = 1;

  currentPiece = new Piece(0, rows - 1, LEVEL_WIDTHS[level], 5);
  drawBoard(rows, cols);
  drawAllPieces();
  gameState = true;

  window.pJSDom[0].pJS.particles.move.speed = 6;
}

function draw() {
  levelSpeed = LEVEL_SPEED[level];
  if (!isWaiting && frameCount % levelSpeed == 0 && gameState) {
    currentPiece.move();

    if (lastDirection != currentPiece.getCurrentDirection()) {
      const bounceAudio = new Audio("sfx/nock.mp3");
      bounceAudio.play();
    }
    lastDirection = currentPiece.getCurrentDirection();
  }
  drawBoard(rows, cols);
  drawAllPieces();
}

let spaceCount = 0;
spawnSide = 0;

document.addEventListener("keydown", function (event) {
  if (isWaiting || !gameState) return;
  if (event.code === "Space") {
    const placeAudio = new Audio("sfx/click.mp3");
    placeAudio.play();
    spaceCount++;

    if (currentPiece != null) {
      if (currentPiece.placePiece() != false) {
        let cnt = last_placed_width;
        score += (cnt < 3 ? cnt * 2 : cnt) * (level > 3 ? level * 2 : level);
        document.getElementById("scoreDisplay").textContent = "Score: " + score;

        window.pJSDom[0].pJS.particles.move.speed = 6 + level * 6;
        // Increase number of particles
        window.pJSDom[0].pJS.particles.number.value = 100 + level * 300;

        if (rows - spaceCount > 0) {
          if (spaceCount % 3 == 0) {
            level++;
          }
          isWaiting = true;
          setTimeout(function () {
            isWaiting = false;
            if (spawnSide % 2 === 0) {
              spawnSide++;
              currentPiece = new Piece(
                0,
                rows - spaceCount - 1,
                LEVEL_WIDTHS[level],
                last_placed_width
              );
            } else {
              spawnSide++;
              currentPiece = new Piece(
                7,
                rows - spaceCount - 1,
                LEVEL_WIDTHS[level],
                last_placed_width
              );
            }
          }, 1000); // 500 milliseconds delay
        } else {
          gameState = false;
          currentPiece = null;
          setTimeout(() => {
            const winAudio = new Audio("sfx/win.wav");
            winAudio.play();
            confetti({
              particleCount: 280,
              startVelocity: 30,
              spread: 360,
            });
            const wrong = document.querySelector("#right-screen");
            wrong.classList.remove("hidden");
            wrong.classList.add("flex");
          }, 500);
        }
      } else {
        gameState = false;
      }
    }
  }
});

const restart = document.getElementById("restart");
restart.addEventListener("click", function () {
  const clickAudio = new Audio("sfx/click.mp3");
  clickAudio.play();

  setTimeout(() => {
    location.reload();
  }, 500);
});

const restartWin = document.getElementById("restart-win");
restartWin.addEventListener("click", function () {
  const clickAudio = new Audio("sfx/click.mp3");
  clickAudio.play();

  setTimeout(() => {
    location.reload();
  }, 500);
});
