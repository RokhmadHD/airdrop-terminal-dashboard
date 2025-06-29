// src/app/(dashboard)/layout.tsx
'use client';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/contexts/user-provider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/contexts/SidebarProvider";
import { ConfirmationDialogProvider } from "@/contexts/ConfirmationDialogProvider";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, session, isLoading: isUserLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Header />  
            <main className="grow">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {children}
              </div>
            </main>
            <RightSidebar/>
          </div>
        </div>
      </SidebarProvider>
    </ConfirmationDialogProvider>
  );
}