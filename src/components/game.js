import React from "react";
import { Grid } from "./base";

export default class GameOfLife extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      squares: this.initBackingArray(),
      running: false
    }
  }

  initBackingArray() {
    let rows = Array(this.props.size);
    for (let i = 0; i < rows.length; i++) {
      rows[i] = Array(this.props.size).fill(false);
    }
    return rows;
  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.running) {
        this.stepForward()
      }
    }, 500);
  }

  stepForward() {
    // process each square in grid
    const squares = this.deepCopySquares();
    for (let i = 0; i < this.props.size; i++) {
      for (let j = 0; j < this.props.size; j++) {
        if (this.state.squares[i][j]) {
          squares[i][j] = this.isCellStillLive(i, j);
        } else {
          squares[i][j] = this.isDeadCellNowAlive(i, j);
        }
      }
    }

    // save new state

    this.setState({
      step: this.state.step + 1,
      squares: squares
    })

  }

  deepCopySquares() {
    const squares = Array(this.props.size)
    for (let i = 0; i < squares.length; i++) {
      squares[i] = [...this.state.squares[i]];
    }
    return squares;
  }

  isCellStillLive(row, col) {
    // get neighbours
    const neighbours = this.getNeighbours(row, col);

    const liveNeighbours = neighbours.filter(e => !!e);

    return liveNeighbours.length === 2 || liveNeighbours.length === 3;
  }

  isDeadCellNowAlive(row, col) {
    const neighbours = this.getNeighbours(row, col);

    const liveNeighbours = neighbours.filter(e => !!e);

    return liveNeighbours.length === 3;
  }

  getNeighbours(row, col) {
    const up = row > 0 ? this.state.squares[row - 1][col] : null;
    const down = row < this.props.size - 1 ? this.state.squares[row + 1][col] : null;
    const left = col > 0 ? this.state.squares[row][col - 1] : null;
    const right = col < this.props.size - 1 ? this.state.squares[row][col + 1] : null;
    const upLeft = row > 0 && col > 0 ? this.state.squares[row - 1][col - 1] : null;
    const upRight = row > 0 && col < this.props.size - 1 ? this.state.squares[row - 1][col + 1] : null;
    const downLeft = row < this.props.size - 1 && col > 0 ? this.state.squares[row + 1][col - 1] : null;
    const downRight = row < this.props.size - 1 && col < this.props.size - 1 ? this.state.squares[row + 1][col + 1] : null;

    return [up, down, left, right, upLeft, upRight, downLeft, downRight].filter(e => e != null);
  }

  onSquareClick(i, j) {
    const squares = this.state.squares.slice();
    squares[i][j] = !squares[i][j]
    this.setState({
      squares: squares,
      lastClicked: `${i} ${j}`
    })
  }

  startOrStop() {
    this.setState({
      running: !this.state.running
    })
  }

  render() {
    return (
      <div>
        <Grid onClick={(i, j) => this.onSquareClick(i, j)} size={this.props.size} squares={this.state.squares} />
        <button onClick={() => this.stepForward()}>Step forward</button>
        <button onClick={() => this.startOrStop()}>{this.state.running ? "Stop" : "Start"}</button>
        <p>Step {this.state.step}</p>
      </div>
    )
  }
}
