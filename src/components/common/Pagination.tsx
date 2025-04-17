import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
  itemsCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
}
const Pagination = <T,>({
  table,
  itemsCount,
  currentPage,
  onPageChange,
  totalCount,
}: PaginationProps<T>) => {
  const goToPage = (page: number) => {
    onPageChange(page);
  };

  // Use totalCount if provided, otherwise fall back to itemsCount
  const displayTotalCount = totalCount !== undefined ? totalCount : itemsCount;
  
  // Calculate total pages
  const totalPages = Math.ceil(displayTotalCount / table.getState().pagination.pageSize);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page if we have more than 1 page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="px-6 py-2 flex items-center justify-center border-t border-gray-200 bg-gray-50">
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
          <nav className="relative z-0 inline-flex items-center space-x-1" aria-label="Pagination">
            {/* Previous Button - only show if more than 3 pages */}
            {totalPages > 3 && (
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed bg-[#0d7f3f] border-none"
                    : "text-white bg-[#0d7f3f] hover:bg-[#0d7f3f]/90 border-none hover:shadow-sm"
                }`}
                aria-label="Previous page"
              >
                {"<"}
              </button>
            )}

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => goToPage(page)}
                  className={`inline-flex items-center justify-center transition-all duration-200 rounded-md ${
                    currentPage === page
                      ? "w-10 h-10 text-sm font-medium bg-[#0d7f3f] border-2 border-[#0d7f3f] text-white font-semibold shadow-sm transform scale-105"
                      : "w-9 h-9 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="inline-flex items-center justify-center px-2 h-9 text-gray-400">
                  ...
                </span>
              )
            ))}

            {/* Next Button - only show if more than 3 pages */}
            {totalPages > 3 && (
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage >= totalPages
                    ? "text-gray-300 cursor-not-allowed bg-[#0d7f3f] border-none"
                    : "text-white bg-[#0d7f3f] hover:bg-[#0d7f3f]/90 border-none hover:shadow-sm"
                }`}
                aria-label="Next page"
              >
                {">"}
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;