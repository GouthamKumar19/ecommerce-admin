import React, { useState, useEffect } from "react";
import {
  Edit,
  ToggleOn,
  ToggleOff,
  Star,
  StarBorder,
} from "@mui/icons-material";

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
  tableType?: "user" | "testimonial";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const [disabledRows, setDisabledRows] = useState<string[]>([]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Update displayed items when page changes
  useEffect(() => {
    setDisplayItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, indexOfFirstItem, indexOfLastItem, items]);

  // Page change handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
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

  // Generate pagination buttons with ellipses
  const renderPaginationButtons = () => {
    const pageButtons = [];

    // Always show first page
    pageButtons.push(
      <button
        key={1}
        onClick={() => handlePageClick(1)}
        style={{ background: "#ffffff", color: "black" }}
        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
          currentPage === 1 ? "text-black" : "text-black"
        }`}
      >
        1
      </button>,
    );

    // Logic for middle pages with ellipses
    if (totalPages > 5) {
      // Case: current page is among first 3 pages
      if (currentPage < 4) {
        for (let i = 2; i <= 3; i++) {
          pageButtons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              style={{ background: "#ffffff", color: "black" }}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
                currentPage === i ? "text-black" : "text-black"
              }`}
            >
              {i}
            </button>,
          );
        }
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black"
          >
            ...
          </span>,
        );
      }
      // Case: current page is among last 3 pages
      else if (currentPage > totalPages - 3) {
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black"
          >
            ...
          </span>,
        );
        for (let i = totalPages - 2; i <= totalPages - 1; i++) {
          pageButtons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              style={{ background: "#ffffff", color: "black" }}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
                currentPage === i ? "text-black" : "text-black"
              }`}
            >
              {i}
            </button>,
          );
        }
      }
      // Case: current page is in the middle
      else {
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black"
          >
            ...
          </span>,
        );
        pageButtons.push(
          <button
            key={currentPage}
            onClick={() => handlePageClick(currentPage)}
            style={{ background: "#ffffff", color: "black" }}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50"
          >
            {currentPage}
          </button>,
        );
        pageButtons.push(
          <span
            key="ellipsis2"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black"
          >
            ...
          </span>,
        );
      }
    } else {
      // If less than 5 pages, show all pages
      for (let i = 2; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            style={{ background: "#ffffff", color: "black" }}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
              currentPage === i ? "text-black" : "text-black"
            }`}
          >
            {i}
          </button>,
        );
      }
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          style={{ background: "#ffffff", color: "black" }}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
            currentPage === totalPages ? "text-black" : "text-black"
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pageButtons;
  };

  return (
    <div>
      <div className="overflow-x-auto overflow-y-auto max-h-115">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="sticky top-0 text-header">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-8 py-4 text-center text-header font-medium uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayItems.map((item) => (
              <tr key={String(item[idKey])}>
                {columns.map((column, index) => (
                  <td key={index} className="px-10 py-4 whitespace-nowrap">
                    {column.key === "actions" ? (
                      <div className="flex justify-center items-center gap-6">
                        {/* Edit Button */}
                        <Edit sx={{ fontSize: 25 }} />

                        {/* Toggle Button - only display for user table */}
                        {tableType === "user" && (
                          <div
                            onClick={() => handleToggleRow(String(item[idKey]))}
                            style={{ cursor: "pointer" }}
                          >
                            {disabledRows.includes(String(item[idKey])) ? (
                              <ToggleOff sx={{ fontSize: 25 }} />
                            ) : (
                              <ToggleOn sx={{ fontSize: 25 }} />
                            )}
                          </div>
                        )}
                      </div>
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      String(item[column.key] ?? "N/A")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center3 sm:justify-between">
          <div>
            <p className="text-sm text-black">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, items.length)}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> results
            </p>
          </div>
          <div className="gap-2 ">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {/* Previous button - hidden when on first page */}
              {currentPage > 1 && (
                <button
                  onClick={handlePrevious}
                  style={{ background: "#ffffff", color: "black" }}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium text-black"
                >
                  {"<"}
                </button>
              )}

              {/* Page buttons with ellipses */}
              {renderPaginationButtons()}

              {/* Next button - hidden when on last page */}
              {currentPage < totalPages && (
                <button
                  onClick={handleNext}
                  style={{ background: "#ffffff", color: "black" }}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50"
                >
                  {">"}
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
