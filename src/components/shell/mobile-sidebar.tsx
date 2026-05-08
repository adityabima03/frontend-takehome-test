"use client";

import * as React from "react";

import { ShellBrand } from "@/components/shell/shell-brand";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background shadow-lg transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <ShellBrand />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        <div className="px-2 pb-4">
          <SidebarNav onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}

