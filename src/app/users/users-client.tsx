"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import type { Post, Todo, User } from "@/lib/jsonplaceholder";
import { createUsersColumns } from "./columns";
import type { UserRow, UsersFilterMode, UsersSortMode } from "@/components/users/types";
import { UsersFooter } from "@/components/users/users-footer";
import { UsersHeader } from "@/components/users/users-header";
import { UsersMobileList } from "@/components/users/users-mobile-list";
import { buildSignals, clampInt } from "@/components/users/utils";

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
  const sort = (searchParams.get("sort") as UsersSortMode) ?? "id-asc";
  const filter = (searchParams.get("filter") as UsersFilterMode) ?? "all";
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
      <UsersHeader
        q={q}
        filter={filter}
        onQueryChange={(value) => setParam("q", value)}
        onFilterChange={(value) => setParam("filter", value)}
      />

      <div className="sm:hidden">
        <UsersMobileList rows={pageRows} listQueryString={listQueryString} />
      </div>

      <div className="hidden sm:block">
        <DataTable
          columns={columns}
          data={pageRows}
          footer={
            <UsersFooter
              rangeText={rangeText}
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageSizeChange={(next) => setParam("pageSize", String(next))}
              hrefWithParam={hrefWithParam}
            />
          }
        />
      </div>
    </div>
  );
}

