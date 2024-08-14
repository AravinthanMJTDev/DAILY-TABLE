import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

interface RenderPaginationButtonsProps<TData> {
  totalPages: number;
  table: Table<TData>;
}

const RenderPaginationButtons = <TData,>({
  totalPages,
  table,
}: RenderPaginationButtonsProps<TData>) => {
  const buttons = [];
  for (let i = 0; i < totalPages; i++) {
    buttons.push(
      <Button
        key={i}
        variant={
          table.getState().pagination.pageIndex === i ? "default" : "outline"
        }
        size="sm"
        onClick={() => table.setPageIndex(i)}
      >
        {i + 1}
      </Button>
    );
  }

  return <>{buttons}</>;
};

export default RenderPaginationButtons;
