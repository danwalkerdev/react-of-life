import React from "react";

class Square extends React.Component {

  render() {
    return (
      <s 
        className={`${this.props.live ? "live" : ""}`}
        onClick={() => this.props.onClick(this.props.row, this.props.col)}
        onMouseOver={() => this.props.onMouseOver(this.props.row, this.props.col)}></s>
    )
  }
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
    return <div className="grid">{rows}</div>;
  }
}

export {
  Grid
}


