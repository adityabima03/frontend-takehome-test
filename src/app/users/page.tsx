import { UsersClient } from "./users-client";
import { getPosts, getTodos, getUsers } from "@/lib/jsonplaceholder";

export default async function UsersPage() {
  const revalidateSeconds = 60;

  const [users, posts, todos] = await Promise.all([
    getUsers({ revalidateSeconds }),
    getPosts({ revalidateSeconds }),
    getTodos({ revalidateSeconds }),
  ]);

  return <UsersClient users={users} posts={posts} todos={todos} />;
}

