import React, { useState, useEffect } from "react";
import { Edit, ToggleOn, ToggleOff } from "@mui/icons-material";

import { items } from "../config/mock/userTable";
import type { User } from "../types/users.types";

const DataTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayItems, setDisplayItems] = useState<User[]>([]);
  const [disabledRows, setDisabledRows] = useState<string[]>([]);
  const itemsPerPage = 15;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Update displayed items when page changes
  useEffect(() => {
    setDisplayItems(items.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, indexOfFirstItem, indexOfLastItem]);

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
        style={{ background: "#ffffff" }}
        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
          currentPage === 1 ? "text-black" : "text-gray-700"
        }`}
      >
        1
      </button>
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
              style={{ background: "#ffffff" }}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
                currentPage === i ? "text-black" : "text-gray-700"
              }`}
            >
              {i}
            </button>
          );
        }
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
      // Case: current page is among last 3 pages
      else if (currentPage > totalPages - 3) {
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
        for (let i = totalPages - 2; i <= totalPages - 1; i++) {
          pageButtons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              style={{ background: "#ffffff" }}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
                currentPage === i ? "text-black" : "text-gray-700"
              }`}
            >
              {i}
            </button>
          );
        }
      }
      // Case: current page is in the middle
      else {
        pageButtons.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
        pageButtons.push(
          <button
            key={currentPage}
            onClick={() => handlePageClick(currentPage)}
            style={{ background: "#ffffff" }}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50"
          >
            {currentPage}
          </button>
        );
        pageButtons.push(
          <span
            key="ellipsis2"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
    } else {
      // If less than 5 pages, show all pages
      for (let i = 2; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            style={{ background: "#ffffff" }}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
              currentPage === i ? "text-black" : "text-gray-700"
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          style={{ background: "#ffffff" }}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 ${
            currentPage === totalPages ? "text-black" : "text-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div>
      <div className="overflow-x-auto overflow-y-auto max-h-115">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="sticky top-0 text-header ">
            <tr>
              <th className="px-8 py-4 text-center text-header font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-10 py-4 text-center text-header font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-10 py-4 text-center text-header font-medium uppercase tracking-wider">
                Phone
              </th>
              <th className="px-10 py-4 text-left text-header font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayItems.map((item: User) => (
              <tr key={item.id}>
                <td className="px-10 py-4 whitespace-nowrap">
                  {item.name || "N/A"}
                </td>
                <td className="px-10 py-4 whitespace-nowrap">
                  {item.email || "N/A"}
                </td>
                <td className="px-10 py-4 whitespace-nowrap">
                  {item.phone || "N/A"}
                </td>
                <td className="px-10 py-4 whitespace-nowrap">
                  <div className="flex gap-6">
                    {/* Edit Button */}
                    <Edit sx={{ fontSize: 25 }} />

                    {/* Toggle Button */}
                    <div
                      onClick={() => handleToggleRow(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {disabledRows.includes(item.id) ? (
                        <ToggleOff sx={{ fontSize: 25 }} />
                      ) : (
                        <ToggleOn sx={{ fontSize: 25 }} />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, items.length)}
              </span>{" "}
              of <span className="font-medium">{items.length}</span> results
            </p>
          </div>
          <div className="gap-2">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {/* Previous button - hidden when on first page */}
              {currentPage > 1 && (
                <button
                  onClick={handlePrevious}
                  style={{ background: "#ffffff" }}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium text-gray-500 "
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
                  style={{ background: "#ffffff" }}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
