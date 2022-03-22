/**
 * @jest-environment jsdom
 */

import { act } from "react-dom/test-utils";
import GameOfLife from "./game";
import { render } from "@testing-library/react";

describe("Game tests", () => {
  it("makes squares live when clicking on one", () => {
    act(() => {
      const {container} = render(<GameOfLife size={4}/>);
      container.querySelector('#grid > div:nth-child(2) > s:nth-child(2)').click();
    })

    expect(document.getElementsByClassName("live")).toHaveLength(1);
    expect(document.querySelector('#grid > div:nth-child(2) > s:nth-child(2)')).toHaveClass("live");

  })
})
