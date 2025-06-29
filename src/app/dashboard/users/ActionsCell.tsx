// src/app/dashboard/users/ActionsCell.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminUserView } from "@/lib/types";
import { deleteUser } from "@/lib/api";
import { useUser } from "@/contexts/user-provider"; // Untuk mendapatkan token

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useConfirmationDialog } from "@/contexts/ConfirmationDialogProvider";
interface ActionsCellProps {
  user: AdminUserView;
}

export function ActionsCell({ user }: ActionsCellProps) {
  const router = useRouter();
  const { session } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showDialog } = useConfirmationDialog(); 
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
        router.refresh(); // Refresh data di tabel
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
            Copy User ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)}>
            View & Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}