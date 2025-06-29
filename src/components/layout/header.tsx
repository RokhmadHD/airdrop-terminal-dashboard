// src/components/layout/header.tsx
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
// Di masa depan, ini bisa berisi breadcrumbs, search bar, atau menu user

interface HeaderProps {
    open: boolean;
    toggle: (open: boolean) => void
}

export function Header({ open, toggle }: HeaderProps) {
    const { user, isLoading } = useUser()
    const { toggleRightSidebar } = useSidebar()
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-muted/40 backdrop-blur-lg px-6">
            <div className="flex-1">
                <div className="flex">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <button onClick={() => toggle(!open)} className="p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <NotificationPanel />
                <Button variant="outline" size="icon" onClick={toggleRightSidebar}>
                    <Sparkles className="h-4 w-4" />
                    <span className="sr-only">Toggle AI Assistant</span>
                </Button>
                {isLoading ? (
                    // Tampilkan skeleton saat loading
                    <Skeleton className="h-8 w-8 rounded-full" />
                ) : user ? (
                    // Tampilkan UserNav jika sudah login
                    <UserNav user={user} />
                    // <></>
                ) : (
                    // Tampilkan tombol Login jika belum login
                    <Button asChild>
                        <Link href="/auth/login">Login</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
