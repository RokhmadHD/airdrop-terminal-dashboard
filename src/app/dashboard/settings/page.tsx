// src/app/dashboard/settings/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getMe } from "@/lib/api";
import { ProfileForm } from "@/components/settings/Profile";
// Tambahkan komponen lain di sini, misal untuk Avatar atau Akun
// import { AvatarSettings } from "@/components/dashboard/settings/AvatarSettings";

export const metadata: Metadata = {
  title: "Settings | Airdrop Terminal",
  description: "Manage your account and profile settings.",
};



export default async function SettingsPage() {
  const supabase = await createClient();
  
  // 1. Ambil user yang sedang login di server
  const { data: { user } } = await supabase.auth.getUser();

  // Jika tidak ada user, redirect ke halaman login
  if (!user) {
    redirect('/auth/login?message=You must be logged in to view this page.');
  }


  // Jika profil tidak ditemukan (misal, karena trigger belum berjalan)
  if (!user) {
    // Anda bisa menampilkan pesan error atau me-redirect
    return (
        <div className="container py-12 text-center">
            <h1 className="text-2xl font-bold">Profile Not Found</h1>
            <p className="text-muted-foreground">We couldn't find your profile data. Please try again later.</p>
        </div>
    )
  }

  // 3. Render halaman dengan layout responsif
  return (
    <div className="space-y-6 p-4 md:p-8">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account and profile settings.</p>
        </div>
      
        {/* Layout responsif: 1 kolom di mobile, 2 kolom di layar besar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri (atau atas di mobile) */}
            <div className="lg:col-span-2 space-y-6">
                <ProfileForm/>
                {/* Anda bisa menambahkan Card lain di sini, misal untuk pengaturan Notifikasi */}
            </div>

            {/* Kolom Kanan (atau bawah di mobile) */}
            <div className="space-y-6">
                {/* Di sini Anda bisa menaruh form untuk ganti password, upload avatar, atau hapus akun */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Manage your account security.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Contoh: <AvatarSettings /> atau <ChangePasswordForm /> */}
                        <p className="text-sm text-muted-foreground">Account management features coming soon.</p>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    </div>
  );
}