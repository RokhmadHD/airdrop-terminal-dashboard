// src/contexts/SidebarProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  openRightSidebar: () => void;
  closeRightSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);
  const openRightSidebar = () => setIsRightSidebarOpen(true);
  const closeRightSidebar = () => setIsRightSidebarOpen(false);

  return (
    <SidebarContext.Provider value={{ isRightSidebarOpen, toggleRightSidebar, openRightSidebar, closeRightSidebar }}>
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