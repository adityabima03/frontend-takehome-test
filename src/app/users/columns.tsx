"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import type { UserRow } from "@/app/users/users-client";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export function createUsersColumns(params: {
  listQueryString: string;
  onToggleNameSort: () => void;
  onToggleEmailSort: () => void;
  onToggleWebsiteSort: () => void;
  onTogglePendingSort: () => void;
  activeSort:
    | "name-asc"
    | "name-desc"
    | "email-asc"
    | "email-desc"
    | "website-asc"
    | "website-desc"
    | "pending-desc";
}): ColumnDef<UserRow>[] {
  const nameIcon =
    params.activeSort === "name-asc" ? (
      <ArrowUp className="size-3.5" aria-hidden="true" />
    ) : params.activeSort === "name-desc" ? (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    ) : (
      <ArrowUpDown className="size-3.5 opacity-60" aria-hidden="true" />
    );

  const pendingIcon =
    params.activeSort === "pending-desc" ? (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    ) : (
      <ArrowUpDown className="size-3.5 opacity-60" aria-hidden="true" />
    );

  const emailIcon =
    params.activeSort === "email-asc" ? (
      <ArrowUp className="size-3.5" aria-hidden="true" />
    ) : params.activeSort === "email-desc" ? (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    ) : (
      <ArrowUpDown className="size-3.5 opacity-60" aria-hidden="true" />
    );

  const websiteIcon =
    params.activeSort === "website-asc" ? (
      <ArrowUp className="size-3.5" aria-hidden="true" />
    ) : params.activeSort === "website-desc" ? (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    ) : (
      <ArrowUpDown className="size-3.5 opacity-60" aria-hidden="true" />
    );

  return [
    {
      accessorKey: "name",
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={params.onToggleNameSort}
          aria-label="Sort by name"
          className="-ml-2 gap-2"
        >
          Name {nameIcon}
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
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={params.onToggleEmailSort}
          aria-label="Sort by email"
          className="-ml-2 gap-2"
        >
          Email {emailIcon}
        </Button>
      ),
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
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          onClick={params.onToggleWebsiteSort}
          aria-label="Sort by website"
          className="-ml-2 gap-2"
        >
          Website {websiteIcon}
        </Button>
      ),
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
        <Button
          variant="ghost"
          size="sm"
          onClick={params.onTogglePendingSort}
          aria-label="Sort by pending todos"
          className="-ml-2 gap-2"
        >
          Activity {pendingIcon}
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

