"use client";

import * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaginationItems } from "@/components/users/utils";

export function UsersFooter({
  rangeText,
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  hrefWithParam,
}: {
  rangeText: string;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (next: number) => void;
  hrefWithParam: (key: string, value: string) => string;
}) {
  return (
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
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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

          {getPaginationItems(totalPages, page).map((p, idx) =>
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
              href={hrefWithParam("page", String(Math.min(totalPages, page + 1)))}
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
  );
}

