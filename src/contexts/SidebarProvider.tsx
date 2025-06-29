// src/contexts/SidebarProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextType {
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  openRightSidebar: () => void;
  closeRightSidebar: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open?: boolean) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);
  const openRightSidebar = () => setIsRightSidebarOpen(true);
  const closeRightSidebar = () => setIsRightSidebarOpen(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-expanded") === "true";
    }
    return false;
  });

  // Sync to localStorage + body class
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("sidebar-expanded", String(sidebarExpanded));

    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const handleSidebarOpen = (open?: boolean) => {
    setSidebarExpanded(!sidebarExpanded)
    setSidebarOpen(open ? open : !sidebarOpen)
  }
  return (
    <SidebarContext.Provider value={{
      isRightSidebarOpen,
      toggleRightSidebar,
      openRightSidebar,
      closeRightSidebar,
      sidebarOpen,
      setSidebarOpen: handleSidebarOpen,
      sidebarExpanded,
      setSidebarExpanded,
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};