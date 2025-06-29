// src/app/(dashboard)/airdrops/page.tsx

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getAirdrops } from "@/lib/api";

    
export default async function AirdropsDashboardPage() {
    const airdrops = await getAirdrops();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Airdrops</h1>
                    <p className="text-muted-foreground">View, edit, and approve airdrops.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/airdrops/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Airdrop
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={airdrops} />
        </div>
    );
}