import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import { useQuery } from "@tanstack/react-query";
import { enquiries } from "../../config/mock/enquiriesTable";
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

const fetchEnquiries = async (): Promise<Enquiry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(enquiries), 1000);
  });
};

const EnquiryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  // State for managing the popup dialog
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: enquiryData = [], isLoading: queryLoading } = useQuery({
    queryKey: ["enquiryData"],
    queryFn: fetchEnquiries,
  });

  useEffect(() => {
    const fetchEnquiries = async () => {
      setIsLoading(true); // Start loading

      try {
        const payload = {}; // Define payload if needed
        const response = await getAllEnquiry(payload); // Call the API

        console.log("Fetched Enquiries:", response.data);

        // Log each enquiry's id, name, email, and message
      } catch (err: any) {
        console.error(err.message || "Failed to fetch enquiries"); // Handle any errors
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchEnquiries(); // Execute fetching function
  }, []);

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

  const sortedEnquiries = useSortableData(enquiryData, sortConfig);

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
        <DataTable<Enquiry>
          items={sortedEnquiries.filter(
            (enquiry) =>
              enquiry.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              enquiry.email.toLowerCase().includes(searchValue.toLowerCase()) ||
              enquiry.message.toLowerCase().includes(searchValue.toLowerCase())
          )}
          columns={columns}
          idKey="_id"
          itemsPerPage={15}
          tableType="enquiry"
          actionRenderer={actionRenderer}
          loading={isLoading || queryLoading}
        />
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
