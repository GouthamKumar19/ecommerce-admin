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
    key: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3); // Set items per page to 3
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true); // Start loading

      try {
        const payload = {
        
          search: [
            {
              term: searchValue,
              fields: ["name", "email", "message"],
              startsWith: false,
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
        console.log("Payload:", payload); // Log the payload for debugging
        const response = await getAllEnquiry(payload); // Call the API

        if (response) {
          console.log("Fetched Enquiries:", response.data);
          setEnquiries(response.data); // Set the enquiries data
        }
      } catch (err: any) {
        if (!signal.aborted) {
          console.error(err.message || "Failed to fetch enquiries"); // Handle any errors
        }
      } finally {
         setTimeout(() => setIsLoading(false), 1000); // End loading
      }
    };

    fetchEnquiries(); // Execute fetching function
  }, [searchValue, sortConfig, page, itemsPerPage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

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

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedEnquiries = useSortableData(enquiries, sortConfig);

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
      header: (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      key: "actions",
      render: actionRenderer,
    },
  ];

  return (
    <div className="container mx-auto p-1">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable<Enquiry>
            items={sortedEnquiries.filter(
              (enquiry) =>
                enquiry.name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                enquiry.email
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                enquiry.message
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Enquiry Popup Dialog */}
      <EnquiryPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        enquiry={selectedEnquiry}
      />
    </div>
  );
};

export default EnquiryPage;
