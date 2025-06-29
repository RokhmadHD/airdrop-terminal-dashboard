"use client";
import { useUser } from "@/contexts/user-provider";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NotificationPanel } from "./notifications";
import { useSidebar } from "@/contexts/SidebarProvider";
import { Menu, Sparkles } from "lucide-react";
import { RefObject } from "react";

interface HeaderProps {
    variant?: 'default' | 'v2' | 'v3',
}

export function Header({ variant = 'v3' }: HeaderProps) {
    const { user, isLoading } = useUser();
  const {sidebarOpen, setSidebarOpen} = useSidebar()

    const { toggleRightSidebar } = useSidebar();

    return (
        <header className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${variant === 'v2' || variant === 'v3' ? 'before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10' : 'max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90'} 
        ${variant === 'v2' ? 'dark:before:bg-gray-800' : ''} ${variant === 'v3' ? 'dark:before:bg-gray-900' : ''}`}>
            <div className={`flex items-center justify-between h-16 px-8 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold hidden md:block">Dashboard</h1>
                        <button
                            className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                            aria-controls="sidebar"
                            aria-expanded={sidebarOpen}
                            onClick={(e) => { e.stopPropagation(); setSidebarOpen()}}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <NotificationPanel />
                    <Button variant="outline" size="icon" onClick={toggleRightSidebar}>
                        <Sparkles className="h-4 w-4" />
                        <span className="sr-only">Toggle AI Assistant</span>
                    </Button>
                    {isLoading ? (
                        <Skeleton className="h-8 w-8 rounded-full" />
                    ) : user ? (
                        <UserNav user={user} />
                    ) : (
                        <Button asChild>
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
