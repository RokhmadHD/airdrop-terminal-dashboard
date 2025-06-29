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
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/contexts/SidebarProvider";

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
  variant?: 'default' | 'v2' | 'v3'
}

export function Sidebar({ variant = 'v2' }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded } = useSidebar()
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!sidebarOpen || event.keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(sidebarExpanded));
    const body = document.querySelector("body");
    if (!body) return;
    if (sidebarExpanded) {
      body.classList.add("sidebar-expanded");
    } else {
      body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={cn(
          buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "lg", className: 'w-full max-w-40' }),
          " justify-start px-3 lg:px-4 transition-all duration-300"
        )}
        key={item.label}
      >
        <Icon className="h-5 w-5" />
        <span className="ml-3 truncate transition-all duration-200 hidden sidebar-expanded:inline-flex">
          {item.label}
        </span>

      </Link>
    );
  };

  useEffect(() => {
    console.log('sidebarExpanded', sidebarExpanded)
  }, [sidebarExpanded])
  return (
    <>

      {/* Sidebar (Responsive) */}
      <aside
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto hide-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-54 \shrink-0 bg-muted md:bg-muted/40 p-4 transition-all duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} 
        ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
        onMouseEnter={() => !sidebarExpanded && setSidebarExpanded(true)}
        onMouseLeave={() => sidebarExpanded && sidebarOpen && setSidebarExpanded(false)}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Link href="/dashboard" className="flex flex-col justify-center items-center w-full">
            <svg className="fill-violet-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
            <span className="opacity-0 sidebar-expanded:opacity-100 text-xl transition-all duration-300 ease-linear ">ATerminal</span>
          </Link>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
            <nav className="grid items-start w-full text-sm font-medium">
              {mainNavItems.map(renderNavItem)}
            </nav>
          </div>

          <div className="mt-auto py-4 border-t ">
            <nav className="grid items-start w-full text-sm font-medium">
              {secondaryNavItems.map(renderNavItem)}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay di mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

    </>
  )
}