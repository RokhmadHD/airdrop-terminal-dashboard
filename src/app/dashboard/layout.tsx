// src/app/(dashboard)/layout.tsx
'use client';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/contexts/user-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/contexts/SidebarProvider";
import { ConfirmationDialogProvider } from "@/contexts/ConfirmationDialogProvider";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, session, isLoading: isUserLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
   useEffect(() => {
        if (isUserLoading) return;
        if (!user) {
            router.push("/login");
            return;
        }
    }, [user, session, isUserLoading, router]);
  return (
    <ConfirmationDialogProvider>

    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
      <Sidebar open={isOpen}toggle={setIsOpen} />
      <SidebarProvider>
        <div className="flex flex-col">
        <Header toggle={setIsOpen} open={isOpen} />
        <main className="relative flex flex-1 flex-col h-screen overflow-hidden hide-scrollbar gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
      <RightSidebar />
      </SidebarProvider>
    </div>
    </ConfirmationDialogProvider>
  );
}