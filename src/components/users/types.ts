export type UsersSortMode =
  | "id-asc"
  | "id-desc"
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc"
  | "website-asc"
  | "website-desc"
  | "pending-desc";

export type UsersFilterMode = "all" | "has-pending" | "no-completed";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  website: string;
  postsCount: number;
  todosCompleted: number;
  todosPending: number;
};

