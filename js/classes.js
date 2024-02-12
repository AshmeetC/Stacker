let last_placed_width;

class PieceCell {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.removed = false;
    this.currentDirection = "r";
  }

  display() {
    if (this.removed) {
      board[this.y][this.x] = 0;
      return;
    }

    let x = this.x * cellWidth;
    let y = this.y * cellWidth;

    stroke(255);
    strokeWeight(1.5);
    fill("#dc2626");
    square(x, y, cellWidth);
  }

  move(dir) {
    if (dir === "r" && this.x < cols - 1) {
      this.x++;
      this.currentDirection = "r";
    } else if (dir === "l" && this.x > 0) {
      this.x--;
      this.currentDirection = "l";
    }

    if (dir === "d" && this.y < rows - 1) {
      this.y++;
      this.currentDirection = "d";
    }
  }

  placePiece() {
    board[this.y][this.x] = this;
    return true;
  }

  removePiece() {
    board[this.y][this.x] = 0;
  }

  removedFromBoard() {
    this.removed = true;
    board[this.y][this.x] = 0;
  }

  getCurrentDirection() {
    return this.currentDirection;
  }
}

// Made up of PieceCells
class Piece {
  constructor(x, y, width, last_width) {
    this.x = x;
    this.y = y;
    this.width = Math.min(width, last_width);
    this.cells = [];
    if (x === 0) {
      for (let i = 0; i < this.width; i++) {
        this.cells.push(new PieceCell(this.x + i, this.y));
      }
    } else {
      for (let i = this.width; i > 0; i--) {
        this.cells.push(new PieceCell(this.x - i, this.y));
      }
    }
    this.display();
  }

  placePiece() {
    console.log("Placing piece");

    let isAnyPlaced = false;
    let cells_placed = 0;
    for (let cell of this.cells) {
      const x = cell.x;
      const y = cell.y;
      const isAtBottom = y === rows - 1;

      if (!isAtBottom) {
        let cell_below = board[y + 1][x];
        if (cell_below != 0) {
          cell.placePiece();
          cells_placed++;
          isAnyPlaced = true;
        } else {
          // board[y][x] = 0;
          // Make animation where the piece falls down to the very bottom

          const interval = setInterval(() => {
            if (cell.y < rows - 1 && board[cell.y + 1][cell.x] === 0) {
              cell.move("d");
              // cell.display();
            } else {
              setTimeout(() => {
                cell.removedFromBoard();
                clearInterval(interval);
                board[y][x] = 0;
              }, 100);
            }
          }, 100);
        }
      } else {
        isAnyPlaced = true;
        cells_placed++;
        cell.placePiece();
      }
    }
    last_placed_width = cells_placed;
    if (!isAnyPlaced) {
      setTimeout(() => {
        const loseAudio = new Audio("sfx/lose.wav");
        loseAudio.play();

        const wrong = document.querySelector("#wrong-screen");
        wrong.classList.remove("hidden");
        wrong.classList.add("flex");
      }, 500);

      return false;
    }
  }

  display() {
    for (let cell of this.cells) {
      cell.placePiece();
      cell.display();
    }
  }

  move() {
    // Check if the piece is at the edge of the board
    if (this.cells[0].x === 0) {
      isMovingRight = true;
    } else if (this.cells[this.cells.length - 1].x === cols - 1) {
      isMovingRight = false;
    }

    for (let cell of this.cells) {
      cell.removePiece();
    }

    for (let cell of this.cells) {
      cell.move(isMovingRight ? "r" : "l");
    }

    this.display();
  }

  getCurrentDirection() {
    return this.cells[0].getCurrentDirection();
  }
}
