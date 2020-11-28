/*
Any live cell with two or three live neighbours survives.
Any dead cell with three live neighbours becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.

calculate the state of the board after n iterations
assume the board is a square
*/

const EMPTY = " ";
const LIVE = "X";

function countLiveNeighbors(board, r, c) {
  let count = 0;
  if (r > 0) {
    count += board[r - 1][c] != EMPTY ? 1 : 0;
  }

  if (c > 0) {
    count += board[r][c - 1] != EMPTY ? 1 : 0;

    if (r > 0) {
      count += board[r - 1][c - 1] != EMPTY ? 1 : 0;
    }

    if (r < board.length - 2) {
      count += board[r + 1][c - 1] != EMPTY ? 1 : 0;
    }
  }

  if (r < board.length - 2) {
    count += board[r + 1][c] != EMPTY ? 1 : 0;
  }

  if (c < board.length - 2) {
    count += board[r][c + 1] != EMPTY ? 1 : 0;

    if (r < board.length - 2) {
      count += board[r + 1][c + 1] != EMPTY ? 1 : 0;
    }

    if (r > 0) {
      count += board[r - 1][c + 1] != EMPTY ? 1 : 0;
    }
  }

  return count;
}

function gameOfLifeNRuns(board, n) {
  while (n >= 0) {
    const newBoard = [];
    for (let r = 0; r < board.length; r++) {
      const newRow = [];
      for (let c = 0; c < board[r].length; c++) {
        const element = board[r][c];

        const count = countLiveNeighbors(board, r, c);
        if ((element == LIVE && count > 3) || count < 2) {
          newRow.push(EMPTY);
        } else if (count == 3) {
          newRow.push(LIVE);
        } else {
          newRow.push(element);
        }
      }

      newBoard.push(newRow); // use a new board so changes in current board won't interfere
    }
    board = newBoard;
    n--;
    console.log(board);
  }
}

const board = [
  [" ", " ", " ", " ", " ", " "],
  [" ", " ", "X", " ", " ", " "],
  ["X", " ", "X", " ", " ", " "],
  [" ", "X", "X", " ", " ", " "],
  [" ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " "],
];
gameOfLifeNRuns(board, 9);
