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
          <button onClick={() => changeColor("orange")}>Orange</button>
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
