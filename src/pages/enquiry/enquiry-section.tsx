import React, { useState, useEffect, useRef } from "react";
import DataTable from "../../components/common/DataTable";
import type { Enquiry } from "../../types/enquiry.types";
import { Visibility } from "@mui/icons-material";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import EnquiryPopup from "../../components/EnquiryPopup";
import { getAllEnquiry } from "../../api/enquiry"; // Import the API call
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";

const EnquiryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Items per page
  const [totalEnquiries, setTotalEnquiries] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset to page 1 when search value changes
  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);

      try {
        const payload = {
          search: [
            {
              term: searchValue,
              fields: ["name", "email", "message"],
              startsWith: true, // Changed to true to match only text that starts with the search value
              endsWith: false,
            },
          ],
          options: {
            sortBy: [sortConfig.key],
            sortDesc: [sortConfig.direction === "descending"],
            page: page,
            itemsPerPage: itemsPerPage,
          },
        };

        console.log("[DEBUG] Payload:", payload); // Debugging

        const response = await getAllEnquiry(payload); // Fetch data from API

        if (response && response.data) {
          console.log("[DEBUG] API Response:", response.data);
          setEnquiries(response.data.totalData || []);
          setTotalEnquiries(response.data.totalCount || 0);
          setPageCount(
            Math.ceil((response.data.totalCount || 0) / itemsPerPage)
          );
        } else {
          console.warn("[DEBUG] No data received from API");
          setEnquiries([]);
          setTotalEnquiries(0);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("[DEBUG] Error fetching enquiries:", error);
        }
        setEnquiries([]);
        setTotalEnquiries(0);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchEnquiries();
  }, [searchValue, sortConfig, page, itemsPerPage]);

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  // Custom search handler to manage search value changes
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Page reset is handled by the useEffect hook above
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const sortedEnquiries = useSortableData(enquiries, sortConfig);

  const actionRenderer = (item: Enquiry) => (
    <div className="flex justify-center items-center gap-4">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => {
          setSelectedEnquiry(item);
          setIsPopupOpen(true);
        }}
      />
    </div>
  );

  const columns = [
    {
      header: (
        <SortableHeader
          label="Name"
          columnKey="name"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "name",
      render: (item: Enquiry) => (
        <div className="text-sm text-gray-900">{item.name}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Email"
          columnKey="email"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "email",
      render: (item: Enquiry) => (
        <div className="text-sm text-gray-900">{item.email}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Message"
          columnKey="message"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "message",
      render: (item: Enquiry) => (
        <div className="text-sm text-gray-900 truncate max-w-xs">
          {item.message}
        </div>
      ),
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable<Enquiry>
            items={sortedEnquiries}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={(newPage) => {
              console.log("[DEBUG] Changing page to:", newPage);
              setPage(newPage);
            }}
            pageCount={pageCount}
            totalCount={totalEnquiries}
          />
        )}
      </div>

      {/* Enquiry Popup */}
      <EnquiryPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        enquiry={selectedEnquiry}
      />
    </div>
  );
};

export default EnquiryPage;
