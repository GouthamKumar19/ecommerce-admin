import React, { useState, useEffect } from "react";
import {
  Edit,
  ToggleOn,
  ToggleOff,
  Star,
  StarBorder,
  Visibility,
  Delete,
  Close,
} from "@mui/icons-material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

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
  tableType?: "user" | "testimonial" | "product" | "Enquiry" | "collection"|"order"|"category";
}

// Star Rating Component for testimonials
export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex justify-center">
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

// Custom Modal Component with enhanced styling and smooth animations
const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      // Delay before starting the animation
      timeoutId = setTimeout(() => {
        setAnimateIn(true);
      }, 50);
    } else {
      setAnimateIn(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto transition-opacity duration-300"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        opacity: animateIn ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ${
          animateIn
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        <div
          className="px-8 py-6 border-b border-gray-200 flex justify-center items-center"
          style={{ backgroundColor: "#0d7f3f" }}
        >
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div
            className="cursor-pointer p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200 flex items-center justify-center absolute right-8"
            onClick={onClose}
          >
            <Close sx={{ fontSize: 24, color: "#ffffff" }} />
          </div>
        </div>
        <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
          {children}
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {/* Modal footer content if needed */}
        </div>
      </div>
    </div>
  );
};

// EnquiryPopup Component with enhanced styling
const EnquiryPopup: React.FC<{
  data: {
    [key: string]: unknown;
  };
}> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering the id key or any internal keys that start with underscore
          if (key === "id" || key.startsWith("_") || key === "actions") {
            return null;
          }

          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Special handling for message fields to make them full width and centered
          if (
            key === "message" ||
            key.includes("Message") ||
            key.includes("Description") ||
            key === "description"
          ) {
            return (
              <div
                key={key}
                className="group text-center col-span-1 md:col-span-2"
              >
                <span className="font-medium text-gray-500 text-sm uppercase tracking-wider block mb-2 text-center">
                  {formattedKey}
                </span>
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm group-hover:border-blue-300 group-hover:shadow transition-all duration-200">
                  <span className="text-gray-800 block text-center">
                    {value ? String(value) : "N/A"}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="group text-center">
              <span className="font-medium text-gray-500 text-sm uppercase tracking-wider block mb-2 text-center">
                {formattedKey}
              </span>
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm group-hover:border-blue-300 group-hover:shadow transition-all duration-200">
                <span className="text-gray-800 block text-center">
                  {value ? String(value) : "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
const navigate = useNavigate();

const handleViewOrder = (item: T) => {
  // Navigate to order details page
  navigate(`/orders/${item[idKey]}`);
};

const handleEditProduct = (item: T) => {
  // Navigate to product details page
  navigate(`/product/${item[idKey]}`);
};

  const handleToggleRow = (id: string) => {
    setDisabledRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleOpenEnquiryDialog = (item: T) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleViewCategory=(item:T)=>{
    navigate(`/category/${item[idKey]}`);
  }
  const handleViewCollection=(item:T)=>{
    navigate(`/collection/${item[idKey]}`);
  }


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
              
             
               <span
                onClick={() => handleEditProduct(item)}
                className="cursor-pointer"
              >
              <Edit sx={{ fontSize: 26, color: "#000000" }} />
              </span>
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
          } else if (tableType === "order") {
          return (
            <div className="flex justify-center items-center gap-4">
              <span
                onClick={() => handleViewOrder(item)}
                className="cursor-pointer"
              >
                <Visibility sx={{ fontSize: 26, color: "#000000" }} />
              </span>
            </div>
          );
          
          
        } else if (tableType === "Enquiry") {
          return (
            <div className="flex justify-center items-center gap-4">
              <span
                onClick={() => handleOpenEnquiryDialog(item)}
                className="cursor-pointer"
              >
                <Visibility sx={{ fontSize: 26, color: "#000000" }} />
              </span>
            </div>
          );
        } else if (tableType === "category") {
          return (
            <div className="flex justify-center items-center gap-4">
              <span
                onClick={() => handleViewCategory(item)}
                className="cursor-pointer">
             
              
                <Edit sx={{ fontSize: 26, color: "#000000" }} />
                 </span>
                <Delete sx={{ fontSize: 26, color: "#000000" }} />
              
            </div>
          );
        } else if (tableType == "collection") {
          return (
            <div className="flex justify-center items-center gap-4">
              <span
              onClick={() => handleViewCollection(item)}
                className="cursor-pointer">
              <Edit sx={{ fontSize: 26, color: "#000000" }} />
              </span>
              <Delete sx={{ fontSize: 26, color: "#000000" }} />
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
        return (
          <div className="flex justify-center items-center">
            {column.render(item)}
          </div>
        );
        
      } else {
        return (
          <div
            className={`text-center ${isDisabled ? "text-gray-400" : "text-gray-900"}`}
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
                          header.getContext(),
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
                        cell.getContext(),
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

      {/* Pagination Controls - Centered */}
      <div className="px-6 py-4 flex items-center justify-center border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between w-full">
          <div className="text-center w-full">
            <p className="text-sm text-gray-700 text-center">
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
                  items.length,
                )}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> results
            </p>
          </div>

          <div className="flex justify-center">
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

      {/* Enhanced Custom Modal */}
      {tableType === "Enquiry" && (
        <CustomModal
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title="Enquiry Details"
        >
          {selectedItem && <EnquiryPopup data={selectedItem} />}
        </CustomModal>
      )}
    </div>
  );
};

export default DataTable;