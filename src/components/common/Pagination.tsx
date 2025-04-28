import { Table } from "@tanstack/react-table";
import Button from "@mui/material/Button"; // <-- Add this line

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
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="contained"
                size="small"
                sx={{
                  minWidth: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "6px",
                  bgcolor: "#0d7f3f",
                  color: currentPage === 1 ? "#d1d5db" : "#fff",
                  boxShadow: "none",
                  mr: 1,
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#0d7f3f",
                    opacity: 0.9,
                  },
                }}
                aria-label="Previous page"
              >
                {"<"}
              </Button>
            )}

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={index}
                  onClick={() => goToPage(page)}
                  variant={currentPage === page ? "contained" : "outlined"}
                  size="small"
                  sx={{
                    minWidth: 0,
                    width: currentPage === page ? 32 : 28,
                    height: currentPage === page ? 32 : 28,
                    borderRadius: "6px",
                    bgcolor: currentPage === page ? "#0d7f3f" : "#fff",
                    color: currentPage === page ? "#fff" : "#374151",
                    borderColor: currentPage === page ? "#0d7f3f" : "#d1d5db",
                    fontWeight: currentPage === page ? 600 : 500,
                    fontSize: "0.95rem",
                    boxShadow: currentPage === page ? 2 : "none",
                    mx: 0.5, // <-- Add horizontal margin for spacing
                    "&:hover": {
                      bgcolor: "#0d7f3f",
                      color: "#fff",
                    },
                  }}
                >
                  {page}
                </Button>
              ) : (
                <span
                  key={index}
                  className="inline-flex items-center justify-center px-2 h-7 text-gray-400"
                >
                  ...
                </span>
              )
            )}

            {/* Next Button - only show if more than 3 pages */}
            {totalPages > 3 && (
              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant="contained"
                size="small"
                sx={{
                  minWidth: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "6px",
                  bgcolor: "#0d7f3f",
                  color: currentPage >= totalPages ? "#d1d5db" : "#fff",
                  boxShadow: "none",
                  ml: 1,
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#0d7f3f",
                    opacity: 0.9,
                  },
                }}
                aria-label="Next page"
              >
                {">"}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;