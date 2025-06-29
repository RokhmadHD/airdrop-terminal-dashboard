"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Komponen UI dari shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Supabase client helper
import { createClient } from "@/lib/supabase/client";

// Definisikan tipe props yang diterima oleh komponen
interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  
  // Fungsi untuk menangani proses logout
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Refresh halaman untuk membersihkan semua state client dan server
    // dan memicu listener di UserProvider untuk mengupdate UI.
    router.refresh(); 
  };

  // Mendapatkan inisial untuk fallback avatar
  // Misalnya dari "user@example.com" -> "U"
  // Atau dari "John Doe" (jika ada di metadata) -> "JD"
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  const userFullName = user.user_metadata?.full_name;
  const userAvatarUrl = user.user_metadata?.avatar_url;
  const userEmail = user.email;

  return (
    <DropdownMenu>
      {/* Tombol pemicu dropdown, yang juga menampilkan avatar */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatarUrl} alt={userFullName || "User avatar"} />
            <AvatarFallback>{getInitials(userFullName, userEmail)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      {/* Konten dropdown menu */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userFullName || 'Welcome!'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/airdrops/create')}>
            Post New Airdrop
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            My Profile
          </DropdownMenuItem>
          {/* Tambahkan link lain di sini, misal "Settings" */}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}