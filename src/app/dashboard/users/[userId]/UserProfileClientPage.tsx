"use client";

import { AdminUserDetail } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "recharts";
import { useUser } from "@/contexts/user-provider";
import { deleteUser, updateUserRole } from "@/lib/api";
import { toast } from "sonner";
import { useConfirmationDialog } from "@/contexts/ConfirmationDialogProvider";
import { useRouter } from "next/navigation";


interface UserProfileClientPageProps {
    initialUser: AdminUserDetail;
}

function InfoRow({ label, value }: { label: string, value: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex justify-between py-2">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-right">{value}</dd>
        </div>
    )
}

export function UserProfileClientPage({ initialUser }: UserProfileClientPageProps) {
    const { session } = useUser();
    const [user, setUser] = useState(initialUser);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const { showDialog } = useConfirmationDialog(); 

    const handleRoleChange = async (newRole: 'member' | 'admin') => {
        if (!session) {
            toast.error("Session expired", { description: "Please log in again to continue." });
            return;
        }

        setIsUpdating(true);

        const promise = updateUserRole(user.id, newRole, session.access_token);

        toast.promise(promise, {
            loading: 'Updating user role...',
            success: (data) => {
                // Update state lokal setelah promise berhasil
                setUser(prev => ({ ...prev, role: newRole }));
                return `User role has been successfully updated to ${newRole}.`;
            },
            error: (err) => {
                // Kembalikan pesan error dari promise yang gagal
                return err.message || "An unknown error occurred.";
            },
            finally: () => {
                setIsUpdating(false);
            }
        });
    };

    const handleDelete = async () => {
        if (!session) {
          toast.error("Authentication Error", { description: "Your session has expired. Please log in again." });
          return;
        }
        setIsDeleting(true);
    
        const promise = deleteUser(user.id, session.access_token);
    
        toast.promise(promise, {
          loading: `Deleting user ${user.email}...`,
          success: () => {
            router.push('/dashboard/users'); // Refresh data di tabel
            return `User ${user.email} has been deleted.`;
          },
          error: (err) => {
            return err.message;
          },
          finally: () => setIsDeleting(false)
        });
      };

    const handleDeleteClick = () => {
        // Panggil fungsi showDialog dari context
        showDialog({
            title: "Are you absolutely sure?",
            description: (
                <>
                    This action cannot be undone. This will permanently delete the user{' '}
                    <span className="font-bold">{user.email}</span> and all of their associated data.
                </>
            ),
            confirmText: "Yes, delete user",
            onConfirm: handleDelete, // Berikan fungsi yang akan dijalankan saat dikonfirmasi
        });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Kolom Kiri: Info Profil */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="text-3xl">
                                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{user.full_name || 'No Name'}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.role && <Badge className="mt-2">{user.role}</Badge>}
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Detail & Aksi */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                            <CardDescription>Full information about this user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="divide-y">
                                <InfoRow label="User ID" value={<code className="text-xs">{user.id}</code>} />
                                <InfoRow label="Username" value={user.username || 'N/A'} />
                                <InfoRow label="Website" value={user.website ? <a href={user.website} className="text-primary hover:underline">{user.website}</a> : 'N/A'} />
                                <InfoRow label="Email Confirmed" value={user.email_confirmed_at ? new Date(user.email_confirmed_at).toLocaleString() : 'No'} />
                                <InfoRow label="Last Sign In" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'} />
                                <InfoRow label="Joined On" value={new Date(user.created_at).toLocaleString()} />
                            </dl>

                            <Separator className="my-6" />

                            <div className="space-y-2">
                                <h3 className="font-semibold">Admin Actions</h3>
                                <div className="flex items-center gap-4">
                                    <Label>Change Role</Label>
                                    <Select value={user.role || 'member'} onValueChange={handleRoleChange} disabled={isUpdating}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="destructive" className="mt-4" disabled={isDeleting} onClick={handleDeleteClick}>Delete User</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}