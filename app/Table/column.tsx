import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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

// Define columns
export const columns: ColumnDef<DailyTable>[] = [
  {
    accessorKey: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DATE" />
    ),
  },
  {
    accessorKey: "Hour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="HOUR" />
    ),
  },
  {
    accessorKey: "Machine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MACHINE" />
    ),
  },
  {
    accessorKey: "partName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PART NAME" />
    ),
  },
  {
    accessorKey: "partColor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PART COLOR" />
    ),
  },
  {
    accessorKey: "cavityAvai",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CAVITY AVAILABLE" />
    ),
  },
  {
    accessorKey: "cavityUsed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CAVITY USED" />
    ),
  },
  {
    accessorKey: "hourlyTarget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="HOURLY TARGET" />
    ),
  },
  {
    accessorKey: "producedQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRODUCED QUANTITY" />
    ),
  },
  {
    accessorKey: "acceptedQty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACCEPTED QUANTITY" />
    ),
  },
  {
    accessorKey: "workingTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WORKING TIME" />
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
