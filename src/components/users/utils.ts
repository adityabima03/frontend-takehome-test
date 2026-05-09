import type { Post, Todo } from "@/lib/jsonplaceholder";

type UserSignals = {
  userId: number;
  postsCount: number;
  todosCompleted: number;
  todosPending: number;
};

export function buildSignals(posts: Post[], todos: Todo[]): Map<number, UserSignals> {
  const map = new Map<number, UserSignals>();

  for (const p of posts) {
    const cur = map.get(p.userId) ?? {
      userId: p.userId,
      postsCount: 0,
      todosCompleted: 0,
      todosPending: 0,
    };
    cur.postsCount += 1;
    map.set(p.userId, cur);
  }

  for (const t of todos) {
    const cur = map.get(t.userId) ?? {
      userId: t.userId,
      postsCount: 0,
      todosCompleted: 0,
      todosPending: 0,
    };
    if (t.completed) cur.todosCompleted += 1;
    else cur.todosPending += 1;
    map.set(t.userId, cur);
  }

  return map;
}

export function clampInt(
  value: string | null,
  { min, max, fallback }: { min: number; max: number; fallback: number },
) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}

export function getPaginationItems(total: number, current: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: Array<number | "ellipsis"> = [];
  const add = (v: number | "ellipsis") => items.push(v);

  add(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) add("ellipsis");
  for (let p = start; p <= end; p++) add(p);
  if (end < total - 1) add("ellipsis");
  add(total);

  return items;
}

