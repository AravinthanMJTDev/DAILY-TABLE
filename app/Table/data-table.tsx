"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import debounce from "lodash/debounce";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Copy, Download, Filter, RefreshCcw } from "lucide-react";
import moment from "moment";
// import { DataTableColumnHeader } from "./DataTableColumnHeadProps";
import RenderPaginationButtons from "./pagination";

import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderContext,
  Column,
  PaginationState,
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("04-03-2024")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("04-05-2024"));
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  console.log("data ", data);
  console.log("column ", columns);
  // Filter data based on date range
  const dateFilteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      const itemDate = moment(Object(item).Date, "DD-MM-YYYY");
      // console.log(itemDate);
      // console.log(itemDate.isSameOrAfter(moment(startDate), "day"));
      // console.log(itemDate.isSameOrBefore(moment(endDate).endOf("day"), "day"));
      return (
        itemDate.isSameOrAfter(moment(startDate), "day") &&
        itemDate.isSameOrBefore(moment(endDate).endOf("day"), "day")
      );
    });
  }, [data, startDate, endDate]);

  // Filter data based on search query
  const searchFilteredData = useMemo(() => {
    if (!searchQuery) return dateFilteredData;
    return dateFilteredData.filter((item) =>
      Object.entries(Object(item)).some((value: any) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, dateFilteredData]);

  // Debounced search handler to optimize performance
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300), // Adjust the debounce delay as needed
    []
  );

  // Handle search input change
  const searchFun = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleCopy = async () => {
    // Extract headers as plain text
    const headers = columns
      .map((col) => {
        if (col.header && typeof col.header === "function") {
          // Call header function and handle its result
          const headerComponent = col.header({ column: {} as any });
          console.log(headerComponent);
          return typeof headerComponent === "string"
            ? headerComponent
            : col.accessorKey;
        } else {
          // Use accessorKey if no header function is provided
          return col.accessorKey;
        }
      })
      .join("\t");
    // Extract rows as plain text
    const rows = table
      .getRowModel()
      .rows.map((row) =>
        row
          .getVisibleCells()
          .map((cell) => {
            const value = cell.getValue();
            return typeof value === "string" || typeof value === "number"
              ? String(value)
              : ""; // Handle complex objects gracefully
          })
          .join("\t")
      )
      .join("\n");

    // Combine headers and rows
    const tableContent = `${headers}\n${rows}`;

    try {
      await navigator.clipboard.writeText(tableContent);
      // alert("Table content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // REFRESH FUNCTION

  const refreshFun = () => {
    setStartDate(new Date("04-03-2024"));
    setEndDate(new Date("04-05-2024"));
  };

  //Download function

  // Mock HeaderContext object
  const mockHeaderContext: HeaderContext<any, any> = {
    column: {} as Column<any, any>,
    header: {} as any,
    table: {} as any,
  };
  const convertToCSV = (data: any[], columns: ColumnDef<any, any>[]) => {
    const header = columns
      .map((col) => {
        if (col.header && typeof col.header === "function") {
          const headerComponent = col.header(mockHeaderContext);
          return typeof headerComponent === "string"
            ? headerComponent
            : col.accessorKey;
        } else {
          return col.accessorKey;
        }
      })
      .join(",");
    console.log("header", header);
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const cellValue = row[col.accessorKey];
          return typeof cellValue === "string"
            ? cellValue.replace(/,/g, "")
            : cellValue;
        })
        .join(",")
    );
    console.log("row", rows);
    return [header, ...rows].join("\n");
  };

  const handleDownload = () => {
    const csvData = convertToCSV(searchFilteredData, columns);
    console.log("csv ", csvData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "table-data.csv");
      // link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const table = useReactTable({
    data: searchFilteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  console.log("table", table);
  const totalPages = table.getPageCount();

  return (
    <>
      <div className="md:flex md:flex-row md:items-center md:space-x-2 md:space-y-0  mb-4 sm:flex sm:flex-col sm:items-center sm:justify-center sm:space-y-2 border border-slate-700 p-3">
        <div className="sm:flex-col sm:space-y-2 md:flex-col md:items-center md:space-x-2 md:space-y-0 lg:flex lg:flex-row lg:items-center lg:justify-center lg:space-x-2 z-50 lg:text-center">
          <div className="flex flex-row justify-between items-center space-x-2">
            <label className="md:font-lato md:text-lg md:font-medium sm:font-lato sm:text-sm">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
              className="border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md p-2 text-sm"
              placeholderText="Start Date"
            />
          </div>
          <div className="flex flex-row justify-between items-center space-x-2">
            <label className="md:font-lato md:text-lg md:font-medium sm:font-lato sm:text-sm">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="dd-MM-yyyy"
              className="border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md p-2 text-sm"
              placeholderText="End Date"
            />
          </div>
        </div>
        <div className="flex space-x-2 md:space-y-0 ">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download />
          </Button>
          <Button variant="outline" size="sm" onClick={refreshFun}>
            <RefreshCcw />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
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
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Search bar */}
        <div className="md:w-auto lg:w-1/4 sm:w-1/2 sm:flex sm:flex-row  sm:justify-center sm:items-center sm:float-center md:float-right flex-wrap">
          <input
            className="w-full p-2 border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md  "
            placeholder="Search..."
            onChange={searchFun}
          />
        </div>
      </div>
      <div className="rounded-md border border-slate-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
      <div className="flex items-center md:justify-end md:space-x-2 py-4 md:mx-2 sm:justify-evenly sm:space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        {/* RenderPaginationButtons */}

        <RenderPaginationButtons totalPages={totalPages} table={table} />
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
