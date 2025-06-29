// src/app/dashboard/guides/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Guide } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Aksi untuk publish/unpublish & delete
// Anda bisa memindahkannya ke file ActionsCell terpisah seperti pada user management
const GuideActions = ({ guide }: { guide: Guide }) => {
    // TODO: Buat state dan handler untuk update status dan delete
    const handleTogglePublish = () => {
        const newStatus = guide.status === 'published' ? 'draft' : 'published';
        // Panggil API: updateGuideStatus(guide.id, newStatus, token)
        alert(`Simulating: Set status to ${newStatus}`);
    }
    const handleDelete = () => {
        // Panggil API: deleteGuide(guide.id, token) dengan konfirmasi
        alert('Simulating: Delete guide');
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href={`/guides/${guide.slug}`}>View Public Page</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href={`/dashboard/guides/${guide.slug}/edit`}>Edit</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublish}>
                    {guide.status === 'published' ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Guide>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title<ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === 'published' ? 'default' : 'outline'}>{status}</Badge>
    }
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "author_name",
    header: "Author",
    cell: ({row}) => row.getValue("author_name") || <span className="text-muted-foreground">N/A</span>
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => new Date(row.getValue("updated_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <GuideActions guide={row.original} />,
  },
];