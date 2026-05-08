"use client";

import { ShellNavLink } from "@/components/shell/nav-link";
import { navItems } from "@/components/shell/nav-items";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <ShellNavLink key={item.href} href={item.href} onNavigate={onNavigate}>
          {item.label}
        </ShellNavLink>
      ))}
    </nav>
  );
}

