import React, { useState } from "react";
import {
  Edit,
  ToggleOn,
  ToggleOff,
  Star,
  StarBorder,
  Visibility,
  Delete,
} from "@mui/icons-material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

// Define a base interface for data objects
interface BaseRecord {
  [key: string]: unknown;
}

// Generic Table Column interface
interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T) => React.ReactNode;
}

// Generic DataTable Props
interface DataTableProps<T extends BaseRecord> {
  items: T[];
  columns: TableColumn<T>[];
  idKey: string;
  itemsPerPage?: number;
  tableType?: "user" | "testimonial" | "product";
}

// Star Rating Component for testimonials
export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <Star sx={{ fontSize: 20, color: "#FFD700" }} />
          ) : (
            <StarBorder sx={{ fontSize: 20, color: "#FFD700" }} />
          )}
        </span>
      ))}
    </div>
  );
};

// Generic DataTable Component
const DataTable = <T extends BaseRecord>({
  items,
  columns,
  idKey,
  itemsPerPage = 15,
  tableType = "user",
}: DataTableProps<T>) => {
  const [disabledRows, setDisabledRows] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });

  const handleToggleRow = (id: string) => {
    setDisabledRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
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
        if (tableType === "product") {
          return (
            <div className="flex justify-center items-center gap-4">
              <Visibility sx={{ fontSize: 26, color: "#000000" }} />
              <Edit sx={{ fontSize: 26, color: "#000000" }} />
              <Delete sx={{ fontSize: 26, color: "#000000" }} />
            </div>
          );
        } else if (tableType === "user") {
          return (
            <div className="flex justify-center items-center gap-4">
              <Edit sx={{ fontSize: 26, color: "#000000" }} />
              <span onClick={() => handleToggleRow(String(item[idKey]))}>
                {isDisabled ? (
                  <ToggleOff sx={{ fontSize: 26, color: "#000000" }} />
                ) : (
                  <ToggleOn sx={{ fontSize: 26, color: "#000000" }} />
                )}
              </span>
            </div>
          );
        } else {
          // Default action for testimonial or other types
          return (
            <div className="flex justify-center items-center gap-4">
              <Edit sx={{ fontSize: 26, color: "#000000" }} />
            </div>
          );
        }
      } else if (column.render) {
        return column.render(item);
      } else {
        return (
          <div className={isDisabled ? "text-gray-400" : "text-gray-900"}>
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
    manualPagination: false,
    pageCount: Math.ceil(items.length / pagination.pageSize),
  });

  const currentPage = pagination.pageIndex + 1;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 text-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-center text-header font-medium uppercase tracking-wider"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination with only page number */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {items.length > 0
                  ? table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                    1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  items.length
                )}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> results
            </p>
          </div>

          <div>
            <nav
              className="relative z-0 inline-flex items-center space-x-2"
              aria-label="Pagination"
            >
              {/* Previous Button */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                  table.getCanPreviousPage()
                    ? "text-gray-700 hover:bg-gray-100 border border-gray-300"
                    : "text-gray-300 cursor-not-allowed border border-gray-200"
                }`}
                aria-label="Previous page"
              >
                {"<"}
              </button>

              {/* Current Page */}
              <div className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md">
                {currentPage}
              </div>

              {/* Next Button */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                  table.getCanNextPage()
                    ? "text-gray-700 hover:bg-gray-100 border border-gray-300"
                    : "text-gray-300 cursor-not-allowed border border-gray-200"
                }`}
                aria-label="Next page"
              >
                {">"}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
