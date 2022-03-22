/**
 * @param {Array<boolean>} squares Assumes a square grid passed in so that width and height are equal
 * @param {int} row Row of the square whose neighbours to find
 * @param {int} col Column of the square whose neighbours to find
 * @returns 
 */
function getNeighbours(squares, row, col) {
  const up = row > 0 ? squares[row - 1][col] : null;
  const down = row < squares.length - 1 ? squares[row + 1][col] : null;
  const left = col > 0 ? squares[row][col - 1] : null;
  const right = col < squares.length - 1 ? squares[row][col + 1] : null;
  const upLeft = row > 0 && col > 0 ? squares[row - 1][col - 1] : null;
  const upRight = row > 0 && col < squares.length - 1 ? squares[row - 1][col + 1] : null;
  const downLeft = row < squares.length - 1 && col > 0 ? squares[row + 1][col - 1] : null;
  const downRight = row < squares.length - 1 && col < squares.length - 1 ? squares[row + 1][col + 1] : null;

  return [up, down, left, right, upLeft, upRight, downLeft, downRight].filter(e => e != null);
}

function deepCopySquares(inputSquares) {
  const squares = Array(inputSquares.length)
  for (let i = 0; i < squares.length; i++) {
    squares[i] = [...inputSquares[i]];
  }
  return squares;
}

function initBackingArray(size) {
  let rows = Array(size);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = Array(size).fill(false);
  }
  return rows;
}

export {
  getNeighbours,
  deepCopySquares,
  initBackingArray
}
