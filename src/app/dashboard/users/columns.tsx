// src/app/dashboard/users/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminUserView } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActionsCell } from "./ActionsCell";

export const columns: ColumnDef<AdminUserView>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-3 group">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
            <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.full_name || 'No Name'}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      if (!role) return <span className="text-muted-foreground">N/A</span>;
      return <Badge variant={role === 'admin' ? 'default' : 'secondary'}>{role}</Badge>;
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (<ActionsCell user={user} />);
    },
  },
];