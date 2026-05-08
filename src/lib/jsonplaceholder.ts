export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
  };
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetchJson<T>(
  path: string,
  {
    signal,
    revalidateSeconds,
  }: { signal?: AbortSignal; revalidateSeconds?: number } = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    signal,
    ...(revalidateSeconds
      ? { next: { revalidate: revalidateSeconds } }
      : undefined),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${path} (${res.status})`);
  }

  return (await res.json()) as T;
}

export function getUsers(opts?: { revalidateSeconds?: number; signal?: AbortSignal }) {
  return fetchJson<User[]>("/users", opts);
}

export function getUser(
  userId: number,
  opts?: { revalidateSeconds?: number; signal?: AbortSignal },
) {
  return fetchJson<User>(`/users/${userId}`, opts);
}

export function getPosts(opts?: { revalidateSeconds?: number; signal?: AbortSignal }) {
  return fetchJson<Post[]>("/posts", opts);
}

export function getTodos(opts?: { revalidateSeconds?: number; signal?: AbortSignal }) {
  return fetchJson<Todo[]>("/todos", opts);
}

