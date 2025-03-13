
import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
  itemsCount: number;
}

const Pagination = <T,>({ table, itemsCount }: PaginationProps<T>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="px-6 py-4 flex items-center justify-center border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between w-full">
        <div className="text-center w-full">
          <p className="text-sm text-gray-700 text-center">
            Showing{" "}
            <span className="font-medium">
              {itemsCount > 0
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
                itemsCount
              )}
            </span>{" "}
            of <span className="font-medium">{itemsCount}</span> results
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
  );
};

export default Pagination;
