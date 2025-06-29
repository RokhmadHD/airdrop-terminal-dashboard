// src/components/dashboard/settings/ProfileForm.tsx
"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-provider";
import { getMe, getPublicProfile, updateProfile } from "@/lib/api"; // Asumsi fungsi ini sudah ada
import { Profile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";


interface ProfileFormProps {
    initialData: Profile; // Menerima data profil awal
}

export function ProfileForm() {
    const supabase = createClient();
    const router = useRouter();
    const { session, user } = useUser();
    const [formData, setFormData] = useState<Profile>({
        avatar_url: '',
        full_name: '',
        username: '',
        website: '',
        id: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session) return;
        const get_profile = async () => {
            const user = await getPublicProfile(session.user.id)
            if (user) {
                setFormData(user)
            }
        }
        get_profile()
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => {
            const base: Profile = prev ?? {
                id: "",
                username: "",
                full_name: "",
                avatar_url: "",
                website: ""
            };
            return { ...base, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session || !formData || !user) {
            setError("User session not found.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updateProfile(user.id, formData, session.access_token);
            alert("Profile updated successfully!");
            // Refresh halaman untuk memastikan semua data (misal di header) ikut terupdate
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

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

        const { error: uploadError, data } = await supabase.storage
            .from('avatar')
            .upload(fileName, file);

        setFormData(prev => {
            const base: Profile = prev ?? {
                id: "",
                username: "",
                full_name: "",
                avatar_url: "",
                website: ""
            };
            return { ...base, avatar_url: data?.fullPath };
        });
        if (uploadError) {
            setError(uploadError.message);
        } else {
            // Jika berhasil, muat ulang daftar media

        }
        setIsUploading(false);
    };



    return (
        <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold">Public Profile</CardTitle>
                <CardDescription className="text-muted-foreground">
                    This information will be displayed publicly.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="px-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span group mx-auto">
                            <Avatar className=" mb-4 relative ">
                                <div className="absolute inset-0 bg-muted/20"></div>
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                    <span className="bg-muted/80 text-xs px-3 py-1 rounded shadow font-medium flex items-center gap-1">
                                        {isUploading ? (
                                            <Loader2 className="animate-spin h-4 w-4" />
                                        ) : (
                                            <>
                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                                </svg>
                                                Upload
                                            </>
                                        )}
                                    </span>
                                </label>
                                <AvatarImage src={formData.avatar_url} className="rounded-2xl h-42 w-42" />
                                <AvatarFallback className="text-3xl">
                                    {formData.full_name?.charAt(0) || formData?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="space-y-2">
                            </div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData?.username}
                                onChange={handleChange}
                                placeholder="@yourhandle"
                            />

                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    value={formData?.full_name}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formData?.website}
                            onChange={handleChange}
                            placeholder="https://your-website.com"
                        />
                    </div>
                </CardContent>

                <CardFooter className="px-6 mt-2 py-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>

    );
}