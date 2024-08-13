"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DailyTable, columns } from "./column";
import { DataTable } from "./data-table";
import Data from "./Data";
import debounce from "lodash/debounce"; // Import debounce from lodash
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { Button } from "@/components/ui/button";

async function getData(): Promise<DailyTable[]> {
  const get = Data();
  return get;
}

// Memoize DataTable to prevent unnecessary re-renders
const MemoizedDataTable = React.memo(DataTable);

export default function Page() {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [data, setData] = useState<DailyTable[]>([]); // Original data state

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setData(data);
    };
    fetchData();
  }, []);

  // Filter data based on search query using useMemo for efficiency
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

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

  return (
    <div className="container mx-auto py-10 bg-slate-800">
      {/* Search bar */}
      <div className="sm:flex sm:flex-row  sm:justify-center sm:items-center md:w-1/4   sm:w-full sm:float-center md:float-right">
        <input
          className="sm:p-3 md:p-4 border bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 rounded-md mb-4 "
          placeholder="Search..."
          onChange={searchFun}
        />
      </div>
      {/* DataTable */}
      <MemoizedDataTable columns={columns} data={filteredData} />
    </div>
  );
}
