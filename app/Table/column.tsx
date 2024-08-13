"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import DataTableColumnHeader from "./DataTableColumnHeadProps";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DailyTable = {
  id: number;
  Date: string;
  Hour: string;
  Machine: string;
  partName: string;
  partNo: string;
  partColor: string;
  cavityAvai: number;
  cavityUsed: number;
  hourlyTarget: number;
  producedQty: number;
  acceptedQty: number;
  workingTime: string;
};

export const columns: ColumnDef<DailyTable>[] = [
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "Hour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hour" />
    ),
  },
  {
    accessorKey: "Machine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Machine" />
    ),
  },
  {
    accessorKey: "partName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="partName" />
    ),
  },
  {
    accessorKey: "partColor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="partColor" />
    ),
  },
  {
    accessorKey: "cavityAvai",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="cavity_Available" />
    ),
  },
  {
    accessorKey: "cavityUsed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="cavity_used" />
    ),
  },
  {
    accessorKey: "hourlyTarget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="hourlyTarget" />
    ),
  },
  {
    accessorKey: "producedQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="producedQty" />
    ),
  },
  {
    accessorKey: "acceptedQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="acceptedQty" />
    ),
  },
  {
    accessorKey: "workingTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="workingTime" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const DailyTable = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(DailyTable.id))
              }
            >
              Copy DailyTable ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Machine works</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
