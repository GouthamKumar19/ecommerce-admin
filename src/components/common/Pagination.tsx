import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
  itemsCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount?: number; // Add optional totalCount prop
}

const Pagination = <T,>({
  table,
  itemsCount,
  currentPage,
  onPageChange,
  totalCount, // Add totalCount to destructuring
}: PaginationProps<T>) => {
  const goToPage = (page: number) => {
    onPageChange(page);
  };

  // Use totalCount if provided, otherwise fall back to itemsCount
  const displayTotalCount = totalCount !== undefined ? totalCount : itemsCount;
  
  return (
    <div className="px-6 py-4 flex items-center justify-center border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between w-full">
        <div className="text-center w-full">
          <p className="text-sm text-gray-700 text-center">
            Showing{" "}
            <span className="font-medium">
              {displayTotalCount > 0
                ? (currentPage - 1) * table.getState().pagination.pageSize + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * table.getState().pagination.pageSize,
                displayTotalCount
              )}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>
        </div>

        <div className="flex justify-center">
          <nav
            className="relative z-0 inline-flex items-center space-x-2"
            aria-label="Pagination"
          >
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed border border-gray-200"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
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
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(displayTotalCount / table.getState().pagination.pageSize)}
              className={`relative inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                currentPage >= Math.ceil(displayTotalCount / table.getState().pagination.pageSize)
                  ? "text-gray-300 cursor-not-allowed border border-gray-200"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
              aria-label="Next page"
            >
              {">"}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;