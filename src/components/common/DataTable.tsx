import React, { useState, useEffect } from "react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import TableSkeletonLoader from "./TableSkeletonLoader";


// Define a base interface for data objects
interface BaseRecord {
  [key: string]: unknown;
}

// Generic Table Column interface
interface TableColumn<T> {
  header: React.ReactNode;
  key: string;
  render?: (item: T) => React.ReactNode;
}

// Generic DataTable Props
// Update the DataTableProps interface to include totalCount
interface DataTableProps<T extends BaseRecord> {
  items: T[];  // Array of items of generic type T
  columns: TableColumn<T>[];
  idKey: string;
  itemsPerPage?: number;
  actionRenderer?: (item: T) => React.ReactNode;
  disabledRows?: string[];
  pageCount: number;
  totalCount?: number; // Add totalCount prop
  loading?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

// Update the DataTable component parameters to include totalCount
const DataTable = <T extends BaseRecord>({
  items,
  columns,
  idKey,
  itemsPerPage = 15,
  actionRenderer,
  disabledRows = [],
  loading = false,
  currentPage = 1,
  pageCount,
  totalCount, // Add totalCount to destructuring
  onPageChange,
}: DataTableProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: currentPage - 1 }));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Convert TableColumn array to Tanstack ColumnDef array
  const tableColumns: ColumnDef<T>[] = columns.map((column) => ({
    id: column.key,
    accessorKey: column.key,
    header: () => (
      <div className="text-center font-medium uppercase tracking-wider text-gray-700">
        {column.header}
      </div>
    ),
    cell: ({ row }) => {
      const item = row.original;
      const isDisabled = disabledRows.includes(String(item[idKey]));

      if (column.key === "actions") {
        return actionRenderer ? actionRenderer(item) : null;
      } else if (column.render) {
        return (
          <div className="flex justify-center items-center">
            {column.render(item)}
          </div>
        );
      } else {
        return (
          <div
            className={`text-center ${
              isDisabled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {String(item[column.key] ?? "N/A")}
          </div>
        );
      }
    },
  }));

  // Initialize Tanstack Table with pagination
  const table = useReactTable({
    data: items,
    columns: tableColumns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Set to true for manual pagination
    pageCount, // Set the pageCount from props
  });

  if (loading) {
    return <TableSkeletonLoader columns={columns.length} rows={itemsPerPage} />;
  }

  // Update the Pagination component to pass totalCount
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead
            className="bg-white z-10"
            style={{ position: "sticky", top: 0 }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-center text-header font-medium uppercase tracking-wider bg-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors ${
                  disabledRows.includes(String(row.original[idKey]))
                    ? "bg-gray-50"
                    : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        table={table}
        itemsCount={items.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalCount={totalCount} // Pass totalCount to Pagination
      />
    </div>
  );
};

export default DataTable;