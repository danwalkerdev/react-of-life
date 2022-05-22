import React from "react";
import { Grid } from "./grid";
import { getNeighbours, deepCopySquares, initBackingArray } from "../util/core";
import { useState, useEffect } from "react";

export default function GameOfLife(props) {
  const initialSquares = initBackingArray(props.width, props.height);

  const [step, setStep] = useState(0);
  const [squares, setSquares] = useState(initialSquares);
  const [running, setRunning] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [color, setColor] = useState('red');
  const [startingGrid, setStartingGrid] = useState(deepCopySquares(initialSquares));
  const [currentInterval, setCurrentInterval] = useState(null);
  const [proportion, setProportion] = useState(15);

  useEffect(() => {
    const handleMouseUp = () => {
      setMouseDown(false);
    };
    const handleMouseDown = () => {
      setMouseDown(true);
    };

    document.body.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, []);

  useEffect(() => {
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    if (running) {
      let newInterval = setInterval(() => {
        stepForward();
      }, 1000 / speed);
      setCurrentInterval(newInterval);
    }

  }, [running, speed]);

  const stepForward = () => {
    setStep(currentStep => currentStep + 1);
    setSquares(currentSquares => {
      const newSquares = deepCopySquares(currentSquares);
      for (let i = 0; i < props.height; i++) {
        for (let j = 0; j < props.width; j++) {
          newSquares[i][j] = isCellAliveOnNextStep(i, j, currentSquares);
        }
      }
      return newSquares;
    });

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

  }

  const stop = () => {
    setRunning(false);
  }

  const clearGrid = () => {
    setSquares(initBackingArray(props.width, props.height));
    setRunning(false);
    setStep(0);
  }

  const reset = () => {
    setSquares(deepCopySquares(startingGrid));
    setRunning(false);
    setStep(0);
  }

  const randomise = () => {
    let rows = Array(props.height);
    for (let i = 0; i < rows.length; i++) {
      rows[i] = Array(props.width);
      for (let j = 0; j < rows[i].length; j++) {
        rows[i][j] = Math.random() > 1 - proportion / 100;
      }
    }

    setSquares(rows);
    setStep(0);
  }

  const changeColor = (color) => {
    setColor(color);
  }

  const handleSetProportion = (value) => {
    let newValue = value;
    if (newValue > 100) {
      newValue = 100;
    } else if (newValue < 0) {
      newValue = 0;
    }

    setProportion(newValue);
  }

  return (
    <>
      <Grid
        handleClick={(i, j) => handleSquareClick(i, j)}
        handleMouseOver={(i, j) => handleMouseOver(i, j)}
        color={color}
        height={props.height}
        width={props.width}
        squares={squares} />
      <div className="controls">
        <div>
          <button className={running ? "stop" : "start"} onClick={() => startOrStop()}>{running ? "Stop" : "Start"}</button>
          <button onClick={() => stepForward()} disabled={running}>Step</button>
          <button onClick={() => reset()} disabled={running}>Reset</button>
          <button onClick={() => clearGrid()} disabled={running}>Clear</button>
          <button onClick={() => randomise()} disabled={running}>Random</button>
          <span>
            <label>Proportion: </label>
            <input type="number" min={0} max={100} defaultValue={proportion} onChange={(event) => handleSetProportion(event.currentTarget.value)} />
            %
          </span>
        </div>
        <div>
          <button onClick={() => changeColor("red")}>Red</button>
          <button onClick={() => changeColor("blue")}>Blue</button>
          <button onClick={() => changeColor("green")}>Green</button>
          <button onClick={() => changeColor("purple")}>Purple</button>
          <button onClick={() => changeColor("orange")}>Orange</button>
        </div>
      </div>
      <div>
        <p>
          <label>Speed: </label>
          {speed}<br />
          <input type="range" min="1" max="20" defaultValue={speed} step="1" id="speed-slider" onChange={(event) => setSpeed(event.currentTarget.value)} />
        </p>
        <p>Step [{step}]</p>
      </div>
    </>
  )

}
