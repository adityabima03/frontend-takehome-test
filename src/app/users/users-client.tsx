"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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

type SortMode =
  | "id-asc"
  | "id-desc"
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc"
  | "website-asc"
  | "website-desc"
  | "pending-desc";
type FilterMode = "all" | "has-pending" | "no-completed";

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
  const sort = (searchParams.get("sort") as SortMode) ?? "id-asc";
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
            `${r.name} ${r.email} ${r.website}`.toLowerCase().includes(normalizedQ),
          );

    if (filter === "has-pending") return base.filter((r) => r.todosPending > 0);
    if (filter === "no-completed") return base.filter((r) => r.todosCompleted === 0);
    return base;
  }, [rows, normalizedQ, filter]);

  const sortedRows = React.useMemo(() => {
    const next = [...filteredRows];
    if (sort === "id-asc") next.sort((a, b) => a.id - b.id);
    else if (sort === "id-desc") next.sort((a, b) => b.id - a.id);
    else if (sort === "name-asc") next.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") next.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "email-asc") next.sort((a, b) => a.email.localeCompare(b.email));
    else if (sort === "email-desc") next.sort((a, b) => b.email.localeCompare(a.email));
    else if (sort === "website-asc") next.sort((a, b) => a.website.localeCompare(b.website));
    else if (sort === "website-desc") next.sort((a, b) => b.website.localeCompare(a.website));
    else
      next.sort((a, b) => {
        const cmp = b.todosPending - a.todosPending;
        return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
      });
    return next;
  }, [filteredRows, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
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
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function hrefWithParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set(key, value);
    return `${pathname}?${next.toString()}`;
  }

  function getPageItems(total: number, current: number) {
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

  const listQueryString = searchParams.toString();
  const pageRows = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  const rangeText = React.useMemo(() => {
    const total = sortedRows.length;
    if (total === 0) return "0-0 of 0";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return `${start}-${end} of ${total}`;
  }, [sortedRows.length, page, pageSize]);

  function toggleIdSort() {
    setParam("sort", sort === "id-asc" ? "id-desc" : "id-asc");
  }

  function toggleNameSort() {
    setParam(
      "sort",
      sort === "name-asc" ? "name-desc" : "name-asc",
    );
  }

  function togglePendingSort() {
    setParam("sort", sort === "pending-desc" ? "id-asc" : "pending-desc");
  }

  function toggleEmailSort() {
    setParam("sort", sort === "email-asc" ? "email-desc" : "email-asc");
  }

  function toggleWebsiteSort() {
    setParam("sort", sort === "website-asc" ? "website-desc" : "website-asc");
  }

  const columns = React.useMemo(
    () =>
      createUsersColumns({
        listQueryString,
        onToggleIdSort: toggleIdSort,
        onToggleNameSort: toggleNameSort,
        onToggleEmailSort: toggleEmailSort,
        onToggleWebsiteSort: toggleWebsiteSort,
        onTogglePendingSort: togglePendingSort,
        activeSort: sort,
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

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Filter
            <select
              className={cn(
                "h-9 rounded-lg border border-input bg-background px-2 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              value={filter}
              onChange={(e) => setParam("filter", e.target.value)}
              aria-label="Filter users"
            >
              <option value="all">All users</option>
              <option value="has-pending">Users with pending todos</option>
              <option value="no-completed">Users with no completed todos</option>
            </select>
          </label>
        </div>
      </header>

      <div className="sm:hidden space-y-3">
        {pageRows.length === 0 ? (
          <div className="rounded-xl border bg-card p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">No results</p>
              <p className="text-sm text-muted-foreground">
                Try a different search or filter.
              </p>
            </div>
          </div>
        ) : (
          pageRows.map((u) => (
            <Link
              key={u.id}
              href={`/users/${u.id}${listQueryString ? `?${listQueryString}` : ""}`}
              className="block rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">
                    <span className="text-muted-foreground font-mono mr-2">
                      {u.id}.
                    </span>
                    {u.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground break-words">
                    {u.email}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground break-words">
                    {u.website}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {u.postsCount} posts • {u.todosCompleted} done • {u.todosPending} pending
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={pageRows}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="text-xs text-muted-foreground">{rangeText}</div>

                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Show
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

              <Pagination className="sm:w-auto sm:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href={hrefWithParam("page", "1")}
                      isActive={false}
                      size="sm"
                      aria-label="First page"
                      aria-disabled={page <= 1}
                      className={cn(page <= 1 ? "pointer-events-none opacity-50" : "")}
                    >
                      <span className="sr-only">First page</span>
                      <ChevronsLeft className="size-4" aria-hidden="true" />
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href={hrefWithParam("page", String(Math.max(1, page - 1)))}
                      isActive={false}
                      size="sm"
                      aria-label="Previous page"
                      aria-disabled={page <= 1}
                      className={cn(page <= 1 ? "pointer-events-none opacity-50" : "")}
                    >
                      <span className="sr-only">Previous page</span>
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </PaginationLink>
                  </PaginationItem>

                  {getPageItems(totalPages, page).map((p, idx) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href={hrefWithParam("page", String(p))}
                          isActive={p === page}
                          size="sm"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationLink
                      href={hrefWithParam(
                        "page",
                        String(Math.min(totalPages, page + 1)),
                      )}
                      isActive={false}
                      size="sm"
                      aria-label="Next page"
                      aria-disabled={page >= totalPages}
                      className={cn(page >= totalPages ? "pointer-events-none opacity-50" : "")}
                    >
                      <span className="sr-only">Next page</span>
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href={hrefWithParam("page", String(totalPages))}
                      isActive={false}
                      size="sm"
                      aria-label="Last page"
                      aria-disabled={page >= totalPages}
                      className={cn(page >= totalPages ? "pointer-events-none opacity-50" : "")}
                    >
                      <span className="sr-only">Last page</span>
                      <ChevronsRight className="size-4" aria-hidden="true" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          }
        />
      </div>
    </div>
  );
}

