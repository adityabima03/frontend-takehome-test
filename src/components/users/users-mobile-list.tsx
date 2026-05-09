"use client";

import Link from "next/link";

import type { UserRow } from "@/components/users/types";

export function UsersMobileList({
  rows,
  listQueryString,
}: {
  rows: UserRow[];
  listQueryString: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium">No results</p>
          <p className="text-sm text-muted-foreground">
            Try a different search or filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((u) => (
        <Link
          key={u.id}
          href={`/users/${u.id}${listQueryString ? `?${listQueryString}` : ""}`}
          className="block rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">
                <span className="mr-2 font-mono text-muted-foreground">{u.id}.</span>
                {u.name}
              </div>
              <div className="mt-1 break-words text-xs text-muted-foreground">
                {u.email}
              </div>
              <div className="mt-1 break-words text-xs text-muted-foreground">
                {u.website}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {u.postsCount} posts • {u.todosCompleted} done • {u.todosPending} pending
          </div>
        </Link>
      ))}
    </div>
  );
}

