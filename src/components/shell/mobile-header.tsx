"use client";

import { ShellBrand } from "@/components/shell/shell-brand";
import { Button } from "@/components/ui/button";

export function MobileHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur md:hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <Button variant="outline" size="sm" onClick={onOpen} aria-label="Open menu">
          Menu
        </Button>
        <ShellBrand />
      </div>
    </header>
  );
}

