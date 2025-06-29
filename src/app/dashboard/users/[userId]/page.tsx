// src/app/dashboard/users/[userId]/page.tsx

import { getAdminUserDetail } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UserProfileClientPage } from "./UserProfileClientPage"; // Komponen client yang akan kita buat

interface UserDetailPageProps {
    params: {
        userId: string;
    }
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
    const {userId} = await params;
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Atau redirect ke login
        return <p>Unauthorized</p>;
    }

    const userDetail = await getAdminUserDetail(userId, session.access_token);

    if (!userDetail) {
        notFound();
    }

    // Me-render komponen client dan mengoper data sebagai props
    return <UserProfileClientPage initialUser={userDetail} />;
}