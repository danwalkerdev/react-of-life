import React from "react";

function Square(props) {
  return (
    <s 
      className={`${props.live ? "live" : ""}`}
      onClick={() => props.onClick(props.row, props.col)}
      onMouseOver={() => props.onMouseOver(props.row, props.col)} />
  )
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const size = this.props.size;
    const rows = []
    for (let i = 0; i < size; i++) {
      const cols = []
      for (let j = 0; j < size; j++) {
        cols.push((<Square 
          key={`${i},${j}`}
          row={i}
          col={j}
          live={this.props.squares[i][j]}
          onClick={(i, j) => this.props.onClick(i, j)}
          onMouseOver={(i, j) => this.props.onMouseOver(i, j)}
          />))
      }
      rows.push(<div key={i}>{cols}</div>)
    }
    return <div id="grid" className={`${this.props.red ? "red" : "blue"}`}>{rows}</div>;
  }
}

export {
  Square,
  Grid
}


