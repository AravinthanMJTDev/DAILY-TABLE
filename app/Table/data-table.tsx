"use client";
import React, { useState } from "react";
import debounce from "lodash/debounce"; // Import debounce from lodash
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2024-04-04")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-04-04"));

  //   Filtering
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
  //   []
  // );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      // columnFilters,
    },
  });

  return (
    <>
      <div className="flex flex-col space-y-2 mb-2">
        <div className="flex flex-col sm:flex-col sm:space-y-2 sm:text-center md:flex md:flex-row md:justify-start md:items-center md:space-x-2 md:space-y-0 lg:space-x-2 lg:space-y-0 z-50">
          <label className="text-white font-semibold">Date:</label>
          <div className="flex flex-row justify-center items-center m-0">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="MMMM d, yyyy"
              className="border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md p-2 text-sm"
              placeholderText="Start Date"
            />
          </div>
          <div className="flex flex-row justify-center items-center m-0">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="MMMM d, yyyy"
              className="border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md p-2 text-sm"
              placeholderText="End Date"
            />
          </div>
        </div>
        <div className="sm:flex sm:flex-row sm:justify-center sm:space-y-2 sm:space-x-2 sm:text-center sm:items-center  md:flex md:flex-row md:justify-between md:items-center mb-2">
          {/* Buttons */}

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300"
            >
              copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300"
            >
              Excel
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300"
                >
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Butt0n */}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
