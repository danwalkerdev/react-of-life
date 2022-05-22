/**
 * @param {Array<boolean>} squares Assumes a grid with at least one row is provided
 * @param {int} row Row of the square whose neighbours to find
 * @param {int} col Column of the square whose neighbours to find
 * @returns 
 */
function getLiveNeighbors(squares, row, col) {
  const height = squares.length;
  const width = squares[0].length;

  const neighbors = [];

  for (let x of [-1, 0, 1]) {
    for (let y of [-1, 0, 1]) {
      if (x == 0 && x == y) { // ignore self
        continue;
      }
      if (row + x < 0 || row + x >= height) {
        continue;
      }
      if (col + y < 0 || col + y >= width) {
        continue;
      }

      let neighbor = squares[row + x][col + y];
      if (neighbor) neighbors.push(neighbor);
    }
  }
  return neighbors;
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
  getLiveNeighbors,
  deepCopySquares,
  initBackingArray
}
