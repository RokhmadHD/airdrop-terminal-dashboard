// src/app/(dashboard)/airdrops/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Airdrop } from "@/lib/types";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export const columns: ColumnDef<Airdrop>[] = [
  // Kolom Checkbox untuk seleksi massal
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Kolom Nama Airdrop (dengan sorting)
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>
    }
  },

  // Kolom Status
  {
    id: "status", // Beri ID kustom karena tidak langsung dari accessorKey
    header: "Status",
    cell: ({ row }) => {
      const { is_confirmed, is_active } = row.original;

      const status: "Pending" | "Active" | "Finished" = !is_confirmed
        ? "Pending"
        : is_active
          ? "Active"
          : "Finished";

      const variant: "secondary" | "default" | "outline" =
        status === "Pending" ? "secondary" : status === "Active" ? "default" : "outline";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },

  // Kolom Kategori
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },

  // Kolom Network
  {
    accessorKey: "network",
    header: "Network",
  },

  // Kolom Tanggal Dibuat (dengan sorting)
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      // Format tanggal yang lebih informatif
      const formatted = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },


  // Kolom Actions
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const airdrop = row.original;
      
      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Separator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(airdrop.slug)}
              >
                Copy Slug
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!airdrop.is_confirmed && (
                <DropdownMenuItem className="text-green-600 focus:text-green-600">
                  Approve Airdrop
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/airdrops/${airdrop.slug}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];