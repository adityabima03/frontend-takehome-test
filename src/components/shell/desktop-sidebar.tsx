"use client";

import { ShellBrand } from "@/components/shell/shell-brand";
import { SidebarNav } from "@/components/shell/sidebar-nav";

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <ShellBrand />
      </div>
      <div className="px-2 pb-4">
        <SidebarNav />
      </div>
    </aside>
  );
}

