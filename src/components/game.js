import React from "react";
import { Grid } from "./grid";
import { getNeighbours, deepCopySquares, initBackingArray } from "../util/core";
import { useState, useEffect } from "react";

export default function GameOfLife(props) {
  const initialSquares = initBackingArray(props.size);

  const [step, setStep] = useState(0);
  const [squares, setSquares] = useState(initialSquares);
  const [running, setRunning] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [color, setColor] = useState('red');
  const [startingGrid, setStartingGrid] = useState(deepCopySquares(initialSquares));
  const [currentInterval, setCurrentInterval] = useState(null);

  useEffect(() => {
    document.body.onmousedown = () => {
      setMouseDown(true);
    }
  });
  useEffect(() => {
    document.body.onmouseup = () => {
      setMouseDown(false);
    }
  });

  const stepForward = () => {
    setStep(currentStep => currentStep + 1);
    setSquares(currentSquares => {
      const newSquares = deepCopySquares(currentSquares);
      for (let i = 0; i < props.size; i++) {
        for (let j = 0; j < props.size; j++) {
          newSquares[i][j] = isCellAliveOnNextStep(i, j, currentSquares);
        }
      }
      return newSquares;
    });

  }

  const updateTimer = (speed) => {
    if (currentInterval) {
      clearInterval(currentInterval)
    }

    let newInterval = setInterval(() => stepForward(), 1000 / speed);

    setCurrentInterval(newInterval);
    setSpeed(speed);

  }

  const isCellAliveOnNextStep = (row, col, currentSquares) => {
    const neighbours = getNeighbours(currentSquares, row, col);

    const liveNeighbours = neighbours.filter(e => !!e);

    return liveNeighbours.length === 3 || (liveNeighbours.length === 2 && currentSquares[row][col]);
  }

  const handleSquareClick = (i, j) => {
    const squaresCopy = squares.slice();
    squaresCopy[i][j] = !squaresCopy[i][j]

    setSquares(squaresCopy);

  }

  const handleMouseOver = (i, j) => {
    if (mouseDown) {
      handleSquareClick(i, j)
    }
  }

  const startOrStop = () => {
    if (running) {
      stop();
    } else {
      start();
    }
  }

  const start = () => {
    if (step === 0) {
      setStartingGrid(deepCopySquares(squares));
    }

    setRunning(true);
    updateTimer(speed);

  }

  const stop = () => {
    setRunning(false);
    clearInterval(currentInterval);
  }

  const clearGrid = () => {
    setSquares(initBackingArray(props.size));
    setRunning(false);
    setStep(0);
  }

  const reset = () => {
    setSquares(deepCopySquares(startingGrid));
    setRunning(false);
    setStep(0);
  }

  const randomise = () => {
    let rows = Array(props.size);
    for (let i = 0; i < rows.length; i++) {
      rows[i] = Array(props.size);
      for (let j = 0; j < rows[i].length; j++) {
        rows[i][j] = Math.random() > 0.85;
      }
    }

    setSquares(rows);
    setStep(0);
  }

  const changeColor = (color) => {
    setColor(color);
  }

  return (
    <div>
      <Grid
        handleClick={(i, j) => handleSquareClick(i, j)}
        handleMouseOver={(i, j) => handleMouseOver(i, j)}
        color={color}
        size={props.size}
        squares={squares} />
      <div className="controls">
        <div>
          <button className={running ? "stop" : "start"} onClick={() => startOrStop()}>{running ? "Stop" : "Start"}</button>
          <button onClick={() => stepForward()} disabled={running}>Step</button>
          <button onClick={() => reset()} disabled={running}>Reset</button>
          <button onClick={() => clearGrid()} disabled={running}>Clear</button>
          <button onClick={() => randomise()} disabled={running}>Random</button>
        </div>
        <div>
          <button onClick={() => changeColor("red")}>Red</button>
          <button onClick={() => changeColor("blue")}>Blue</button>
          <button onClick={() => changeColor("green")}>Green</button>
          <button onClick={() => changeColor("purple")}>Purple</button>
          <button onClick={() => changeColor("yellow")}>Yellow</button>
        </div>
      </div>

      <br />
      <label htmlFor="speed-slider">Speed</label>
      <input type="range" min="1" max="20" defaultValue={speed} step="1" id="speed-slider" onChange={(event) => updateTimer(event.currentTarget.value)} />
      <p>Step [{step}]</p>
      <p>Speed: {speed}</p>
    </div>
  )

}
/*
export default class GameOfLife extends React.Component {

  constructor(props) {
    super(props);
    const squares = initBackingArray(this.props.size);
    this.state = {
      step: 0,
      squares: squares,
      running: false,
      startingGrid: deepCopySquares(squares),
      mouseDown: false,
      speed: 10,
      color: "red"
    }
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

    return liveNeighbours.length === 3 || (liveNeighbours.length === 2 && this.state.squares[row][col]);
  }

  handleSquareClick(i, j) {
    const squares = this.state.squares.slice();
    squares[i][j] = !squares[i][j]
    this.setState({
      squares: squares
    })
  }

  handleMouseOver(i, j) {
    if (this.state.mouseDown) {
      this.handleSquareClick(i, j)
    }
  }

  startOrStop() {
    if (this.state.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (this.state.step === 0) {
      this.setState({
        startingGrid: deepCopySquares(this.state.squares)
      });
    }

    this.updateTimer(this.state.speed);

    this.setState({
      running: true
    })
  }

  stop() {
    clearInterval(this.state.interval);
    this.setState({
      running: false
    });
  }

  clearGrid() {
    this.setState({
      squares: initBackingArray(this.props.size),
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
        rows[i][j] = Math.random() > 0.85;
      }
    }

    this.setState({
      squares: rows,
      step: 0
    })
  }

  changeColor(color) {
    this.setState({
      color: color
    })
  }

  render() {
    return (
      <div>
        <Grid
          handleClick={(i, j) => this.handleSquareClick(i, j)}
          handleMouseOver={(i, j) => this.handleMouseOver(i, j)}
          color={this.state.color}
          size={this.props.size}
          squares={this.state.squares} />
        <div className="controls">
          <button className={this.state.running ? "stop" : "start"} onClick={() => this.startOrStop()}>{this.state.running ? "Stop" : "Start"}</button>
          <button onClick={() => this.stepForward()} disabled={this.state.running}>Step</button>
          <button onClick={() => this.reset()} disabled={this.state.running}>Reset</button>
          <button onClick={() => this.clearGrid()} disabled={this.state.running}>Clear</button>
          <button onClick={() => this.randomise()} disabled={this.state.running}>Random</button>
          <button onClick={() => this.changeColor("red")}>Red</button>
          <button onClick={() => this.changeColor("blue")}>Blue</button>
          <button onClick={() => this.changeColor("green")}>Green</button>
          <button onClick={() => this.changeColor("purple")}>Purple</button>
          <button onClick={() => this.changeColor("yellow")}>Yellow</button>
        </div>

        <br />
        <label htmlFor="speed-slider">Speed</label>
        <input type="range" min="1" max="20" defaultValue={this.state.speed} step="1" id="speed-slider" onChange={(event) => this.updateTimer(event.currentTarget.value)} />
        <p>Step [{this.state.step}]</p>
        <p>Speed: {this.state.speed}</p>
      </div>
    )
  }
}
*/
