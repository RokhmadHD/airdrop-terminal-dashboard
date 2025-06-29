// src/app/dashboard/media/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/user-provider";
import { createClient } from "@/lib/supabase/client";
import { FileObject } from "@supabase/storage-js";

// Komponen UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Copy, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MediaLibraryPage() {
    const { user } = useUser();
    const supabase = createClient();

    const [files, setFiles] = useState<FileObject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const BUCKET_NAME = "media-library";

    // Fungsi untuk mengambil semua file dari bucket
    async function loadMedia() {
        setIsLoading(true);
        setError(null);
        try {
            toast.loading('Getting last media');
            const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
                limit: 100, // Ambil 100 file terakhir
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });
            if (error) {
                setError(error.message);
                toast.error(error.message);
            } else {
                setFiles(data || []);
                toast.success('Media loaded successfully');
            }
        } catch (err: any) {
            setError(err.message || 'Unknown error');
            toast.error(err.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(files.length <= 0){
            loadMedia();
        }
    }, [files]);




    // Handler untuk upload file
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        if (!user) {
            setError("You must be logged in to upload.");
            return;
        }

        const file = e.target.files[0];
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        setIsUploading(true);
        setError(null);

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file);

        if (uploadError) {
            setError(uploadError.message);
        } else {
            // Jika berhasil, muat ulang daftar media
            await loadMedia();
        }
        setIsUploading(false);
    };

    // Handler untuk menghapus file
    const handleDeleteFile = async (fileName: string) => {
        if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;

        toast.loading('Deleting file...');
        const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([fileName]);

        if (deleteError) {
            setError(deleteError.message);
            toast.error(deleteError.message);
        } else {
            setFiles(prev => prev.filter(file => file.name !== fileName));
            toast.success('File deleted successfully');
        }
    }

    // Handler untuk menyalin URL
    const handleCopyUrl = (fileName: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        navigator.clipboard.writeText(data.publicUrl);
        // Tambahkan notifikasi toast di sini untuk UX yang lebih baik
        toast.success("URL copied to clipboard!");
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Media Library</h1>
                    <p className="text-muted-foreground">Manage all your uploaded images and assets.</p>
                </div>
                <div>
                    <Button asChild>
                        <label htmlFor="media-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New
                        </label>
                    </Button>
                    <Input id="media-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} accept="image/*" />
                </div>
            </div>

            {isUploading && (
                <div className="flex items-center gap-2 text-primary p-4 border-dashed border-2 border-primary rounded-lg mb-6">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <p className="font-semibold">Uploading file, please wait...</p>
                </div>
            )}

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                </div>
            ) : files.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {files.map(file => {
                        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                        return (
                            <Card key={file.id} className="group relative overflow-hidden p-0">
                                <Image
                                    src={publicUrl}
                                    alt={file.name}
                                    width={200}
                                    height={200}
                                    className="aspect-square object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="secondary" size="icon" onClick={() => handleCopyUrl(file.name)}><Copy className="h-4 w-4" /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteFile(file.name)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 border-dashed border-2 rounded-lg">
                    <p className="text-muted-foreground">No media files found. Upload your first file!</p>
                </div>
            )}
        </div>
    );
}