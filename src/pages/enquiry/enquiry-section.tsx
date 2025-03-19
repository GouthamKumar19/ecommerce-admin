import React, { useState, useEffect } from "react";

import DataTable from "../../components/common/DataTable";
// import { enquiries } from "../../config/mock/enquiriesTable"; // Keep this as mock data if needed
import { Visibility, Close } from "@mui/icons-material";
import { Enquiry } from "../../types/enquiry.types";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllEnquiry } from "../../api/enquiry"; // Import your API function

// Add this interface to match what DataTable expects
interface TableColumn<T> {
  header: React.ReactNode;
  key: string;
  render?: (item: T) => React.ReactNode;
}

// const fetchEnquiry = async (): Promise<Enquiry[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(enquiries), 1000);
//   });
// };

const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const [animateIn, setAnimateIn] = useState(false);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      timeoutId = setTimeout(() => {
        setAnimateIn(true);
      }, 50);
    } else {
      setAnimateIn(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto transition-opacity duration-300"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        opacity: animateIn ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ${
          animateIn
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        <div
          className="px-8 py-6 border-b border-gray-200 flex justify-center items-center"
          style={{ backgroundColor: "#0d7f3f" }}
        >
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div
            className="cursor-pointer p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200 flex items-center justify-center absolute right-8"
            onClick={onClose}
          >
            <Close sx={{ fontSize: 24, color: "#ffffff" }} />
          </div>
        </div>
        <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
          {children}
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {/* Modal footer content if needed */}
        </div>
      </div>
    </div>
  );
};

const EnquiryPopup: React.FC<{
  data: {
    [key: string]: unknown;
  };
}> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {Object.entries(data).map(([key, value]) => {
          if (key === "id" || key.startsWith("_") || key === "actions") {
            return null;
          }

          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          if (
            key === "message" ||
            key.includes("Message") ||
            key.includes("Description") ||
            key === "description"
          ) {
            return (
              <div
                key={key}
                className="group text-center col-span-1 md:col-span-2"
              >
                <span className="font-medium text-gray-500 text-sm uppercase tracking-wider block mb-2 text-center">
                  {formattedKey}
                </span>
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm group-hover:border-blue-300 group-hover:shadow transition-all duration-200">
                  <span className="text-gray-800 block text-center">
                    {value ? String(value) : "N/A"}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="group text-center">
              <span className="font-medium text-gray-500 text-sm uppercase tracking-wider block mb-2 text-center">
                {formattedKey}
              </span>
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm group-hover:border-blue-300 group-hover:shadow transition-all duration-200">
                <span className="text-gray-800 block text-center">
                  {value ? String(value) : "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EnquirySection: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Enquiry | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = {
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: ["createdAt"], // Adjust sort parameters as needed
      sortDesc: [true],
    },
  };

  useEffect(() => {
    const fetchEnquiriesData = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error
      console.log(error);
      try {
        const response = await getAllEnquiry(payload); // Call the API with payload
        setEnquiries(response); // Update state with fetched data
      } catch (err: any) {
        setError(err.message || "Failed to fetch enquiries");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchEnquiriesData();
  }, []);

  const handleViewEnquiry = (id: string) => {
    setSelectedItem(enquiries.find((enquiry) => enquiry._id === id) || null); // Update how you identify items here
    setOpenDialog(true);
  };

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedEnquiries = useSortableData(enquiries, sortConfig);

  const actionRenderer = (item: Enquiry) => (
    <div className="flex justify-center items-center gap-2">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleViewEnquiry(item._id)} // Using _id now
      />
    </div>
  );

  // Updated columns with proper typing
  const columns: TableColumn<Enquiry>[] = [
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
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="flex ml-auto"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={sortedEnquiries}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="Enquiry"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>

      {openDialog && (
        <CustomModal
          isOpen={openDialog}
          onClose={handleCloseDialog}
          title="Enquiry Details"
        >
          {selectedItem && <EnquiryPopup data={selectedItem} />}
        </CustomModal>
      )}
    </div>
  );
};

export default EnquirySection;
