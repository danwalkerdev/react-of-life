import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Square, Grid } from "./grid";
import { initBackingArray } from "../util/core"


let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
})

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
})

describe("Square renders", () => {
  it("Should start as a dead cell", () => {
    act(() => {
      render(<Square />, container)
    });
    expect(container.firstChild.classList.length).toBe(0);
  });

  it("Should be live if live prop true passed in", () => {
    act(() => {
      render(<Square live={true} />, container)
    });
    expect(container.firstChild.classList.contains("live")).toBe(true);
  })
})

describe("Grid renders", () => {
  it("starts with all dead squares", () => {
    const size = 4;
    act(() => {
      render(<Grid size={size} squares={initBackingArray(size)} />, container)
    });
    let squares = Array.from(document.getElementsByTagName("s"));

    squares.forEach(square => {
      expect(square.classList).not.toContain("live")
    });
  })
})
