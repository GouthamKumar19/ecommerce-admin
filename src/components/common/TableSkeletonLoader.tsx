import React from "react";

interface SkeletonLoaderProps {
  columns: number;
  rows?: number;
}

const TableSkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  columns,
  rows = 5,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Skeleton for the header */}
          <thead
            className="bg-white z-10"
            style={{ position: "sticky", top: 0 }}
          >
            <tr>
              {Array(columns)
                .fill(0)
                .map((_, index) => (
                  <th
                    key={`skeleton-header-${index}`}
                    className="px-6 py-3 text-center text-header font-medium uppercase tracking-wider bg-white"
                  >
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
            </tr>
          </thead>

          {/* Skeleton for the body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) => (
                <tr
                  key={`skeleton-row-${rowIndex}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {Array(columns)
                    .fill(0)
                    .map((_, colIndex) => (
                      <td
                        key={`skeleton-cell-${rowIndex}-${colIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-center"
                      >
                        {/* Different skeleton styles based on column type */}
                        {colIndex === 0 ? (
                          <div className="flex justify-center">
                            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ) : colIndex === 1 ? (
                          <div className="flex justify-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                          </div>
                        ) : colIndex === columns - 1 ? (
                          <div className="flex justify-center items-center gap-4">
                            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ) : (
                          <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                        )}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Skeleton for pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 flex justify-center">
            <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-page-${index}`}
                    className="w-8 h-8 bg-gray-200 rounded-md m-1 animate-pulse"
                  ></div>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeletonLoader;
