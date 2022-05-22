import React from "react";

function Square(props) {
  return (
    <s
      className={`${props.live ? "live" : ""}`}
      onClick={() => props.handleClick(props.row, props.col)}
      onMouseOver={() => props.handleMouseOver(props.row, props.col)} />
  )
}

function Grid(props) {
  const size = props.size;
  const rows = []
  for (let i = 0; i < size; i++) {
    const cols = []
    for (let j = 0; j < size; j++) {
      cols.push((<Square
        key={`${i},${j}`}
        row={i}
        col={j}
        live={props.squares[i][j]}
        handleClick={(i, j) => props.handleClick(i, j)}
        handleMouseOver={(i, j) => props.handleMouseOver(i, j)}
      />))
    }
    rows.push(<div key={i}>{cols}</div>)
  }
  return <div id="grid" className={`${props.color}`}>{rows}</div>;
}

export {
  Square,
  Grid
}


