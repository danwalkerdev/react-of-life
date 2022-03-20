import React from "react";

class ControlPanel extends React.Component {

  render() {
    return (
      <button onClick={this.props.stepForward}>Step forward</button>
    )
  }
}
