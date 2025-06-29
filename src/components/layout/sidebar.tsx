// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  BarChart,
  Settings,
  Rocket,
  BookOpen,
  Image,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

// Struktur data navigasi yang lebih baik
const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/airdrops", label: "Airdrops", icon: Rocket },
  { href: "/dashboard/guides", label: "Guides", icon: BookOpen },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: '/dashboard/media', label: 'Media Library', icon: Image }
];

const secondaryNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open: boolean,
  toggle: (open:boolean) => void;
}

export function Sidebar({open,toggle}: SidebarProps){
  const pathname = usePathname();
  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <TooltipProvider key={item.href} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                buttonVariants({ variant: isActive ? "secondary" : "ghost", size: 'lg' }),
                "w-full justify-start px-3"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b bg-background">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Rocket className="h-6 w-6 text-primary" />
          <span></span>
        </Link>
        <button onClick={() => toggle(!open)}className="p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar (Responsive) */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-muted border-r shadow transition-transform transform 
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:relative lg:flex`}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between lg:hidden h-14 border-b px-4">
          <span className="font-semibold text-lg">Airdrop Admin<
          <button onClick={() => toggle(!open)}className="p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          <div className="hidden lg:flex items-center h-14 border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Rocket className="h-6 w-6 text-primary" />
              <span>Airdrop Admin</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Manage
              </p>
              {mainNavItems.map(renderNavItem)}
            </nav>
          </div>

          <div className="mt-auto p-4 border-t">
            <nav className="grid items-start text-sm font-medium">
              {secondaryNavItems.map(renderNavItem)}
              <div className="w-full flex justify-between px-3 mt-2">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay di mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => toggle(!open)}
        />
      )}
    </>
  )
}