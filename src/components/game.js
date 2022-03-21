import React from "react";
import { Grid } from "./grid";
import { getNeighbours, deepCopySquares } from "../util/core";

export default class GameOfLife extends React.Component {

  constructor(props) {
    super(props);
    const squares = this.initBackingArray();
    this.state = {
      step: 0,
      squares: squares,
      running: false,
      startingGrid: deepCopySquares(squares),
      mouseDown: false,
      speed: 10,
      red: true
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
    const squares = deepCopySquares(this.state.squares);
    for (let i = 0; i < this.props.size; i++) {
      for (let j = 0; j < this.props.size; j++) {
        squares[i][j] = this.isCellAliveOnNextStep(i, j);
      }
    }

    this.setState({
      step: this.state.step + 1,
      squares: squares
    })

  }

  updateTimer(speed) {
    if (this.state.interval) {
      clearInterval(this.state.interval)
    }

    let interval = setInterval(() => {
      if (this.state.running) {
        this.stepForward()
      }
    }, 1000 / speed);
    
    this.setState({
      interval: interval,
      speed: speed
    })
  }

  isCellAliveOnNextStep(row, col) {
    const neighbours = getNeighbours(this.state.squares, row, col);

    const liveNeighbours = neighbours.filter(e => !!e);

    return liveNeighbours.length === 3 || (liveNeighbours.length == 2 && this.state.squares[row][col]);
  }

  onSquareClick(i, j) {
    const squares = this.state.squares.slice();
    squares[i][j] = !squares[i][j]
    this.setState({
      squares: squares
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
        startingGrid: deepCopySquares(this.state.squares)
      })
      this.updateTimer(this.state.speed);
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
      squares: deepCopySquares(this.state.startingGrid),
      running: false,
      step: 0
    })
  }

  randomise() {
    let rows = Array(this.props.size);
    for (let i = 0; i < rows.length; i++) {
      rows[i] = Array(this.props.size);
      for (let j = 0; j < rows[i].length; j++) {
        rows[i][j] = Math.random() > 0.5;
      }
    }
    
    this.setState({
      squares: rows,
      step: 0
    })
  }

  changeColour() {
    this.setState({
      red: !this.state.red
    })
  }

  render() {
    return (
      <div>
        <Grid
          onClick={(i, j) => this.onSquareClick(i, j)}
          onMouseOver={(i, j) => this.onMouseOver(i, j)}
          colour={this.state.red}
          size={this.props.size}
          squares={this.state.squares} />
        <button onClick={() => this.startOrStop()}>{this.state.running ? "Stop" : "Start"}</button>
        <button onClick={() => this.stepForward()} disabled={this.state.running}>Step</button>
        <button onClick={() => this.reset()} disabled={this.state.running}>Reset</button>
        <button onClick={() => this.clearGrid()} disabled={this.state.running}>Clear</button>
        <button onClick={() => this.randomise()} disabled={this.state.running}>Random</button>
        <button onClick={() => this.changeColour()}>Alt colour</button>
        <br/>
        <label htmlFor="speed-slider">Speed</label>
        <input type="range" min="1" max="20" defaultValue={this.state.speed} step="1" id="speed-slider" onChange={(event) => this.updateTimer(event.currentTarget.value)}/>
        <p>Step [{this.state.step}]</p>
        <p>Speed: {this.state.speed}</p>
      </div>
    )
  }
}
