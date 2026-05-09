import { render, screen } from "@testing-library/react";

import type { Post, Todo, User } from "@/lib/jsonplaceholder";

const notFoundMock = jest.fn(() => {
  throw new Error("NOT_FOUND");
});

jest.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

const getUserMock = jest.fn<Promise<User>, [number]>();
const getPostsMock = jest.fn<Promise<Post[]>, []>();
const getTodosMock = jest.fn<Promise<Todo[]>, []>();

jest.mock("@/lib/jsonplaceholder", () => ({
  getUser: (id: number) => getUserMock(id),
  getPosts: () => getPostsMock(),
  getTodos: () => getTodosMock(),
}));

describe("/users/[id] page", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    getUserMock.mockReset();
    getPostsMock.mockReset();
    getTodosMock.mockReset();
  });

  it("renders user details with posts and todos", async () => {
    getUserMock.mockResolvedValue({
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "leanne@example.com",
      phone: "1-770-736-8031",
      website: "hildegard.org",
      address: { street: "Kulas", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874" },
      company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" },
    });

    getPostsMock.mockResolvedValue([
      { id: 1, userId: 1, title: "Post A", body: "Body A" },
      { id: 2, userId: 2, title: "Post B", body: "Body B" },
    ]);

    getTodosMock.mockResolvedValue([
      { id: 1, userId: 1, title: "Todo 1", completed: true },
      { id: 2, userId: 1, title: "Todo 2", completed: false },
    ]);

    const mod = await import("@/app/users/[id]/page");
    const element = await mod.default({
      params: Promise.resolve({ id: "1" }),
      searchParams: Promise.resolve({ q: "x", page: "2" }),
    });

    render(element);

    expect(screen.getByRole("heading", { name: "Leanne Graham" })).toBeInTheDocument();
    expect(screen.getByText("@Bret")).toBeInTheDocument();
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
    expect(screen.getByText(/Multi-layered/i)).toBeInTheDocument();

    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });

  it("calls notFound for invalid user id", async () => {
    const mod = await import("@/app/users/[id]/page");

    await expect(
      mod.default({
        params: Promise.resolve({ id: "abc" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NOT_FOUND");
  });
});

