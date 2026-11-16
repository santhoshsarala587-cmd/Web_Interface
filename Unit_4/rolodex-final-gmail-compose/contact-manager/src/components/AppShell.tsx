import { Link, useRouterState } from "@tanstack/react-router";
import {
  Users as ContactsIcon,
  LayoutDashboard,
  UserPlus,
  Clock,
  Tags,
  Database,
  Settings,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "All Contacts", icon: ContactsIcon },
  { to: "/contacts/add", label: "Add Contact", icon: UserPlus },
  { to: "/recent", label: "Recently Added", icon: Clock },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/data-management", label: "Data Management", icon: Database },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-primary")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      {/* stacked rolodex cards, fanned */}
      <rect
        x="8"
        y="8"
        width="13"
        height="9"
        rx="1.6"
        fill="var(--primary-foreground)"
        opacity="0.35"
        transform="rotate(-8 8 8)"
      />
      <rect
        x="9"
        y="9.5"
        width="13"
        height="9"
        rx="1.6"
        fill="var(--primary-foreground)"
        opacity="0.65"
        transform="rotate(4 9 9.5)"
      />
      <rect x="9" y="10" width="14" height="10" rx="1.8" fill="var(--primary-foreground)" />
      <circle cx="13" cy="14" r="1.7" fill="var(--primary)" />
      <path
        d="M10.3 18c0.6-2.1 2-3.2 3.7-3.2s3.1 1.1 3.7 3.2"
        stroke="var(--primary)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <BrandMark size={32} />
      <span className="text-sm font-semibold tracking-tight">Rolodex</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="mb-6 flex items-center justify-between px-1">
          <Brand />
          <ThemeToggle />
        </div>
        <NavLinks />
        <p className="mt-auto px-2 label-mono">Local database</p>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-4">
            <div className="mb-6">
              <Brand />
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Brand />
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
