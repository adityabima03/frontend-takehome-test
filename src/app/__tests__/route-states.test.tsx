import { fireEvent, render, screen } from "@testing-library/react";

import UsersError from "@/app/users/error";
import UsersLoading from "@/app/users/loading";
import UserDetailsError from "@/app/users/[id]/error";
import UserDetailsLoading from "@/app/users/[id]/loading";

describe("Route states", () => {
  it("renders /users loading skeleton", () => {
    const { container } = render(<UsersLoading />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders /users error and calls reset", () => {
    const reset = jest.fn();
    render(<UsersError error={new Error("boom")} reset={reset} />);

    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("renders /users/[id] loading skeleton", () => {
    const { container } = render(<UserDetailsLoading />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders /users/[id] error and calls reset", () => {
    const reset = jest.fn();
    render(<UserDetailsError error={new Error("boom")} reset={reset} />);

    expect(
      screen.getByText(/something went wrong while loading user details/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

