// src/app/(workspace)/guides/[slug]/edit/page.tsx (disarankan membuat folder (workspace))
"use client"
import { useState, ChangeEvent } from 'react';
import { createPost } from '@/lib/api'; // Anggap fungsi ini ada
import { useUser } from '@/contexts/user-provider';
import { GuideDetailsSidebar } from '@/components/guides/GuideDetailsSidebar';
import {  GuideFormData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Workspace from '@/components/workspace/Workspace';
// import { toast } from 'sonner';

const emptyFormData: GuideFormData = {
    title: "",
    description: "",
    content: "",
    image_url: "",
    category: "Beginner",
    status: "draft"
};



export default function GuideEditPage() {
    const { session } = useUser()
    const [formData, setFormData] = useState<GuideFormData>(emptyFormData);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (newContent: string) => {
        setFormData(prev => ({ ...prev, content: newContent }));
    };

    const handleSelectChange = (name: 'category' | 'status', value: string) => {
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSwitchChange = (name: 'is_confirmed', checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async () => {
        if (!session) { setError("You must be logged in."); return; }
        if (!formData.title) { setError("Title is required."); return; }

        setIsLoading(true);
        setError(null);

        try {
            const resultGuide = await createPost(formData, session.access_token);
            // Redirect ke halaman edit setelah berhasil dibuat, agar bisa lanjut menulis
            router.push(`/guides/${resultGuide.slug}/edit`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:grid lg:grid-cols-4 h-auto lg:h-[calc(100vh-8rem)] bg-muted/50 rounded-xl">
            {/* Kolom Editor Utama */}
            <Workspace />
            <div className="w-full lg:w-auto">
                <GuideDetailsSidebar
                    formData={formData}
                    onFormChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    isEditMode={false} // Selalu false di halaman create
                    error={error}
                />
            </div>
        </div>
    );
}