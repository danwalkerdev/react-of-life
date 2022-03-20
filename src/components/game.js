import React from "react";
import { Grid } from "./base";

export default class GameOfLife extends React.Component {

  constructor(props) {
    super(props);
    const squares = this.initBackingArray();
    this.state = {
      step: 0,
      squares: squares,
      running: false,
      startingGrid: this.deepCopySquares(squares),
      mouseDown: false
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

    document.body.onmousedown = () => {
      this.setState({
        mouseDown: true
      });
    }

    document.body.onmouseup = () => {
      this.setState({
        mouseDown: false
      });
    }
  }

  stepForward() {
    const squares = this.deepCopySquares(this.state.squares);
    for (let i = 0; i < this.props.size; i++) {
      for (let j = 0; j < this.props.size; j++) {
        if (this.state.squares[i][j]) {
          squares[i][j] = this.isCellStillLive(i, j);
        } else {
          squares[i][j] = this.isDeadCellNowAlive(i, j);
        }
      }
    }

    this.setState({
      step: this.state.step + 1,
      squares: squares
    })

  }

  deepCopySquares(inputSquares) {
    const squares = Array(this.props.size)
    for (let i = 0; i < squares.length; i++) {
      squares[i] = [...inputSquares[i]];
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

  onMouseOver(i, j) {
    if (this.state.mouseDown) {
      this.onSquareClick(i, j)
    }
  }

  startOrStop() {
    if (!this.state.running && this.state.step === 0) {
      // save start configuration
      this.setState({
        startingGrid: this.deepCopySquares(this.state.squares)
      })
    }

    this.setState({
      running: !this.state.running
    })
  }

  clearGrid() {
    this.setState({
      squares: this.initBackingArray(),
      running: false,
      step: 0
    })
  }

  reset() {
    this.setState({
      squares: this.deepCopySquares(this.state.startingGrid),
      running: false,
      step: 0
    }) 
  }

  render() {
    return (
      <div>
        <Grid 
          onClick={(i, j) => this.onSquareClick(i, j)} 
          onMouseOver={(i, j) => this.onMouseOver(i, j)}
          size={this.props.size} 
          squares={this.state.squares} />
        <button onClick={() => this.startOrStop()}>{this.state.running ? "Stop" : "Start"}</button>
        <button onClick={() => this.stepForward()} disabled={this.state.running}>Step</button>
        <button onClick={()=> this.reset()} disabled={this.state.running}>Reset</button>
        <button onClick={() => this.clearGrid()} disabled={this.state.running}>Clear</button>
        <p>Step [{this.state.step}]</p>
      </div>
    )
  }
}
