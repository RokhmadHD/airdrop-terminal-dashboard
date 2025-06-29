// src/contexts/UserProvider.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// Definisikan tipe untuk context value
interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

// Buat context dengan nilai default
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Komponen Provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialUser = async () => {
      // Ambil sesi awal saat komponen pertama kali mount
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialUser();

    // Dengarkan perubahan state otentikasi
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup listener saat komponen unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    session,
    isLoading,
  };

  // Selama loading, kita bisa tampilkan skeleton atau null
  // Ini mencegah "flicker" antara state login/logout
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook untuk menggunakan context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};