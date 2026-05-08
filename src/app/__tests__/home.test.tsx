import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home", () => {
  it("renders headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /to get started/i }),
    ).toBeInTheDocument();
  });
});

