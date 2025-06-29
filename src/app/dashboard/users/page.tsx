// src/app/dashboard/users/page.tsx

import { getAdminUsers } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Ambil data user dari backend. Perlu token admin.
    // Di aplikasi nyata, Anda mungkin perlu menangani jika sesi tidak ada atau bukan admin.
    const users = session ? await getAdminUsers(session.access_token) : [];
    
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <DataTable columns={columns} data={users} />
        </div>
    );
}