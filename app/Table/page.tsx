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
  const [data, setData] = useState<DailyTable[]>([]); // Original data state
  // const Data = getData();
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10 bg-slate-200 transition-all duration-700 ease-in-out border rounded-lg">
      <div className="w-full mx-auto text-center ">
        <p className="font-lato text-xl">Machine Table</p>
      </div>

      {/* DataTable */}
      <MemoizedDataTable columns={columns} data={data} />
    </div>
  );
}
