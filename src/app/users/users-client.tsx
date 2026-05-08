"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableState } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import type { Post, Todo, User } from "@/lib/jsonplaceholder";
import { cn } from "@/lib/utils";
import { createUsersColumns } from "./columns";

type UserSignals = {
  userId: number;
  postsCount: number;
  todosCompleted: number;
  todosPending: number;
};

function buildSignals(posts: Post[], todos: Todo[]): Map<number, UserSignals> {
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

function clampInt(value: string | null, { min, max, fallback }: { min: number; max: number; fallback: number }) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}

type SortMode = "name-asc" | "name-desc" | "pending-desc";
type FilterMode = "all" | "has-pending";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  website: string;
  postsCount: number;
  todosCompleted: number;
  todosPending: number;
};

export function UsersClient({
  users,
  posts,
  todos,
}: {
  users: User[];
  posts: Post[];
  todos: Todo[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const signals = React.useMemo(() => buildSignals(posts, todos), [posts, todos]);

  const q = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as SortMode) ?? "name-asc";
  const filter = (searchParams.get("filter") as FilterMode) ?? "all";
  const pageSize = clampInt(searchParams.get("pageSize"), {
    min: 5,
    max: 50,
    fallback: 5,
  });

  const normalizedQ = q.trim().toLowerCase();

  const rows: UserRow[] = React.useMemo(() => {
    return users.map((u) => {
      const s = signals.get(u.id) ?? {
        userId: u.id,
        postsCount: 0,
        todosCompleted: 0,
        todosPending: 0,
      };

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        website: u.website,
        postsCount: s.postsCount,
        todosCompleted: s.todosCompleted,
        todosPending: s.todosPending,
      };
    });
  }, [signals, users]);

  const filteredRows = React.useMemo(() => {
    const base =
      normalizedQ.length === 0
        ? rows
        : rows.filter((r) =>
            `${r.name} ${r.email}`.toLowerCase().includes(normalizedQ),
          );

    return filter === "has-pending" ? base.filter((r) => r.todosPending > 0) : base;
  }, [rows, normalizedQ, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const page = clampInt(searchParams.get("page"), {
    min: 1,
    max: totalPages,
    fallback: 1,
  });

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value.length === 0) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`);
  }

  const listQueryString = searchParams.toString();

  const sorting = React.useMemo(() => {
    if (sort === "name-asc") return [{ id: "name", desc: false }];
    if (sort === "name-desc") return [{ id: "name", desc: true }];
    return [{ id: "activity", desc: true }];
  }, [sort]);

  const tableState: DataTableState = React.useMemo(
    () => ({
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    }),
    [sorting, page, pageSize],
  );

  function onTableStateChange(next: DataTableState) {
    const nextPage = next.pagination.pageIndex + 1;
    const nextPageSize = next.pagination.pageSize;

    // Update pageSize first (resets page to 1 by setParam behavior)
    if (nextPageSize !== pageSize) {
      setParam("pageSize", String(nextPageSize));
      return;
    }
    if (nextPage !== page) setParam("page", String(nextPage));
  }

  function toggleNameSort() {
    setParam(
      "sort",
      sort === "name-asc" ? "name-desc" : sort === "name-desc" ? "name-asc" : "name-asc",
    );
  }

  function togglePendingSort() {
    setParam("sort", sort === "pending-desc" ? "name-asc" : "pending-desc");
  }

  const columns = React.useMemo(
    () =>
      createUsersColumns({
        listQueryString,
        onToggleNameSort: toggleNameSort,
        onTogglePendingSort: togglePendingSort,
        nameSortLabel:
          sort === "name-asc" ? "A–Z" : sort === "name-desc" ? "Z–A" : "",
        pendingSortLabel: sort === "pending-desc" ? "pending" : "",
      }),
    [listQueryString, sort],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Search, sort, and filter users. Data cached for 60s.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="sm:w-[280px]"
          />

          <div className="flex gap-2">
            <Button
              variant={filter === "has-pending" ? "secondary" : "outline"}
              onClick={() => setParam("filter", filter === "has-pending" ? "all" : "has-pending")}
            >
              Pending todos
            </Button>
            <Button variant="outline" onClick={toggleNameSort}>
              Sort: Name ({sort === "name-desc" ? "Z–A" : "A–Z"})
            </Button>
            <Button variant="outline" onClick={togglePendingSort}>
              Sort: Pending ({sort === "pending-desc" ? "on" : "off"})
            </Button>
          </div>
        </div>
      </header>

      <DataTable
        columns={columns}
        data={filteredRows}
        state={tableState}
        onStateChange={onTableStateChange}
      />

      <footer className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="text-xs text-muted-foreground">
            Showing {Math.min(pageSize, Math.max(0, filteredRows.length - (page - 1) * pageSize))}{" "}
            of {filteredRows.length} results (page {page} of{" "}
            {totalPages})
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Rows per page
            <select
              className={cn(
                "h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              value={String(pageSize)}
              onChange={(e) => setParam("pageSize", e.target.value)}
              aria-label="Rows per page"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
          >
            Prev
          </Button>
          <div className="text-xs text-muted-foreground">Page {page}</div>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setParam("page", String(page + 1))}
          >
            Next
          </Button>
        </div>
      </footer>
    </div>
  );
}

