// src/app/airdrops/[slug]/edit/page.tsx

import { AirdropForm } from "@/components/airdrops/AirdropForm";
import { getAirdropBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface EditAirdropPageProps {
    params: {
        slug: string;
    };
}

export default async function EditAirdropPage({ params }: EditAirdropPageProps) {
    const {slug} = await params
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // console.log(user?.id) return {...}
    const airdrop = await getAirdropBySlug(slug);

    if (!airdrop) {
        notFound();
    }

    // --- BLOK OTORISASI YANG SUDAH DIPERBAIKI ---
    // Kita bandingkan langsung user.id dengan airdrop.created_by
    if (!user) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-muted-foreground">You do not have permission to edit this airdrop.</p>
            </div>
        )
    }
    // -------------------------------------------

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Airdrop</h1>
                <p className="text-muted-foreground">Update the details for: {airdrop.name}</p>
            </div>
            <AirdropForm initialData={airdrop} />
        </div>
    );
}