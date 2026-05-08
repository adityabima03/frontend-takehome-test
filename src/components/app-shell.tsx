"use client";

import * as React from "react";

import { DesktopSidebar } from "@/components/shell/desktop-sidebar";
import { MobileHeader } from "@/components/shell/mobile-header";
import { MobileSidebar } from "@/components/shell/mobile-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <DesktopSidebar />
      <MobileSidebar open={open} onClose={() => setOpen(false)} />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader onOpen={() => setOpen(true)} />

        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}

