import { fireEvent, render, screen } from "@testing-library/react";

import { UsersClient } from "@/app/users/users-client";
import type { Post, Todo, User } from "@/lib/jsonplaceholder";

let currentSearchParams = new URLSearchParams();
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/users",
  useSearchParams: () => currentSearchParams,
}));

function setSearchParams(next: string) {
  currentSearchParams = new URLSearchParams(next);
}

const users: User[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "leanne@example.com",
    phone: "1-770-736-8031",
    website: "hildegard.org",
    address: { street: "Kulas", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874" },
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "ervin@example.com",
    phone: "010-692-6593",
    website: "anastasia.net",
    address: { street: "Victor Plains", suite: "Suite 879", city: "Wisokyburgh", zipcode: "90566-7771" },
    company: { name: "Deckow-Crist", catchPhrase: "Proactive didactic contingency" },
  },
];

const posts: Post[] = [
  { id: 1, userId: 1, title: "Post A", body: "Body A" },
  { id: 2, userId: 1, title: "Post B", body: "Body B" },
  { id: 3, userId: 2, title: "Post C", body: "Body C" },
];

const todos: Todo[] = [
  { id: 1, userId: 1, title: "Todo 1", completed: true },
  { id: 2, userId: 1, title: "Todo 2", completed: false },
  { id: 3, userId: 2, title: "Todo 3", completed: false },
];

describe("UsersClient", () => {
  beforeEach(() => {
    pushMock.mockClear();
    setSearchParams("");
  });

  it("renders users with activity signals", () => {
    render(<UsersClient users={users} posts={posts} todos={todos} />);

    expect(screen.getAllByText("Leanne Graham").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ervin Howell").length).toBeGreaterThan(0);

    // Activity signals are derived from posts/todos
    expect(
      screen.getAllByText("2 posts • 1 done • 1 pending").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("1 posts • 0 done • 1 pending").length,
    ).toBeGreaterThan(0);
  });

  it("filters by search query (name/email/website)", () => {
    setSearchParams("q=anastasia");
    render(<UsersClient users={users} posts={posts} todos={todos} />);

    expect(screen.getAllByText("Ervin Howell").length).toBeGreaterThan(0);
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
  });

  it("applies additional filter: users with no completed todos", () => {
    setSearchParams("filter=no-completed");
    render(<UsersClient users={users} posts={posts} todos={todos} />);

    expect(screen.getAllByText("Ervin Howell").length).toBeGreaterThan(0);
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
  });

  it("sorts by most pending when clicking Activity header", () => {
    render(<UsersClient users={users} posts={posts} todos={todos} />);

    fireEvent.click(screen.getByRole("button", { name: /sort by pending todos/i }));

    expect(pushMock).toHaveBeenCalled();
    const lastCall = pushMock.mock.calls.at(-1)?.[0] as string;
    expect(lastCall).toContain("sort=pending-desc");
  });

  it("shows empty state when no results", () => {
    setSearchParams("q=does-not-exist");
    render(<UsersClient users={users} posts={posts} todos={todos} />);

    expect(screen.getAllByText(/no results/i).length).toBeGreaterThan(0);
  });
});

