"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { UsersFilterMode } from "@/components/users/types";

export function UsersHeader({
  q,
  filter,
  onQueryChange,
  onFilterChange,
}: {
  q: string;
  filter: UsersFilterMode;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: UsersFilterMode) => void;
}) {
  return (
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
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, email, or website…"
          aria-label="Search users"
          className="sm:w-[320px]"
        />

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Filter
          <select
            className={cn(
              "h-9 rounded-lg border border-input bg-background px-2 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as UsersFilterMode)}
            aria-label="Filter users"
          >
            <option value="all">All users</option>
            <option value="has-pending">Users with pending todos</option>
            <option value="no-completed">Users with no completed todos</option>
          </select>
        </label>
      </div>
    </header>
  );
}

