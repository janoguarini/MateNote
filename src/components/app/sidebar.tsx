"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-sidebar-border px-3 py-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Settings className="size-4" />
          Configuración
        </Link>
        <UserMenu email={email} />
      </div>
    </aside>
  );
}
