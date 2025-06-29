// src/app/dashboard/guides/page.tsx

import { getAdminGuides } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Kita gunakan ulang komponen DataTable
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function AdminGuidesPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const guides = session ? await getAdminGuides(session.access_token) : [];
    
    return (
        <div className=''>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Guide Management</h1>
                <Button asChild>
                    <Link href="/dashboard/guides/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Guide
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={guides} />
        </div>
    );
}