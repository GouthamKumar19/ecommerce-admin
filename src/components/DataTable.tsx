import React, { useState, useEffect } from "react";
import { Edit, ToggleOn } from "@mui/icons-material";

import { items } from "../config/mock/userTable";
import type { User } from "../types/users.types";

const DataTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayItems, setDisplayItems] = useState<User[]>([]);
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

  return (
    <div>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
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
                    {/* <button
                      style={{ background: "#ffffff" }} className="hover:"
                      title="Edit"
                    >
                      <Edit fontSize="small" />
                  
                    </button> */}
                    <Edit fontSize="small" />

                    {/* Delete Button */}
                    {/* <button style={{ background: "#ffffff" }} title="Delete">
                      <ToggleOn fontSize="small" />
                    </button> */}
                    <ToggleOn fontSize="small" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={handlePrevious}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={handleNext}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
