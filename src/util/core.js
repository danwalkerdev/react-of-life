/**
 * @param {Array<boolean>} squares Assumes a square grid passed in so that width and height are equal
 * @param {int} row Row of the square whose neighbours to find
 * @param {int} col Column of the square whose neighbours to find
 * @returns 
 */
function getNeighbours(squares, row, col) {
  const height = squares.length;
  const width = squares[0].length;

  const up = row > 0 ? squares[row - 1][col] : null;
  const down = row < height - 1 ? squares[row + 1][col] : null;
  const left = col > 0 ? squares[row][col - 1] : null;
  const right = col < width - 1 ? squares[row][col + 1] : null;
  const upLeft = row > 0 && col > 0 ? squares[row - 1][col - 1] : null;
  const upRight = row > 0 && col < width - 1 ? squares[row - 1][col + 1] : null;
  const downLeft = row < height - 1 && col > 0 ? squares[row + 1][col - 1] : null;
  const downRight = row < height - 1 && col < width - 1 ? squares[row + 1][col + 1] : null;

  return [up, down, left, right, upLeft, upRight, downLeft, downRight].filter(e => e != null);
}

function deepCopySquares(inputSquares) {
  const squares = Array(inputSquares.length);
  for (let i = 0; i < squares.length; i++) {
    squares[i] = [...inputSquares[i]];
  }
  return squares;
}

function initBackingArray(width, height) {
  let rows = Array(height);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = Array(width).fill(false);
  }
  return rows;
}

export {
  getNeighbours,
  deepCopySquares,
  initBackingArray
}
