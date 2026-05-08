"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import type { UserRow } from "@/app/users/users-client";
import { Button } from "@/components/ui/button";

export function createUsersColumns(params: {
  listQueryString: string;
  onToggleNameSort: () => void;
  onTogglePendingSort: () => void;
  nameSortLabel: string;
  pendingSortLabel: string;
}): ColumnDef<UserRow>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <Button variant="ghost" size="sm" onClick={params.onToggleNameSort}>
          Name <span className="ml-1 text-muted-foreground">{params.nameSortLabel}</span>
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <Link
            href={`/users/${u.id}${params.listQueryString ? `?${params.listQueryString}` : ""}`}
            className="font-medium hover:underline underline-offset-4"
          >
            {u.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a
          href={`mailto:${row.original.email}`}
          className="text-muted-foreground hover:underline underline-offset-4"
        >
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <a
          href={`https://${row.original.website}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:underline underline-offset-4"
        >
          {row.original.website}
        </a>
      ),
    },
    {
      accessorKey: "activity",
      header: () => (
        <Button variant="ghost" size="sm" onClick={params.onTogglePendingSort}>
          Activity{" "}
          <span className="ml-1 text-muted-foreground">{params.pendingSortLabel}</span>
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.postsCount} posts • {row.original.todosCompleted} done •{" "}
          {row.original.todosPending} pending
        </span>
      ),
      sortingFn: (a, b) => {
        const ap = a.original.todosPending;
        const bp = b.original.todosPending;
        return ap === bp ? a.original.name.localeCompare(b.original.name) : ap - bp;
      },
    },
  ];
}

