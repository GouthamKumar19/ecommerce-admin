import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import { enquiries } from "../../config/mock/enquiriesTable";
import { useQuery } from "@tanstack/react-query";
import { Visibility, Close } from "@mui/icons-material";
import { Enquiry } from "../../types/enquiry.types";

const fetchEnquiry = async (): Promise<Enquiry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(enquiries), 1000);
  });
};

const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      // Delay before starting the animation
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
          // Skip rendering the id key or any internal keys that start with underscore
          if (key === "id" || key.startsWith("_") || key === "actions") {
            return null;
          }

          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Special handling for message fields to make them full width and centered
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

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiry,
  });

  const handleViewEnquiry = (id: string) => {
    setSelectedItem(enquiries.find((enquiry) => enquiry.id === id) || null);
    setOpenDialog(true);
  };

  const actionRenderer = (item: Enquiry) => (
    <div className="flex justify-center items-center gap-2">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleViewEnquiry(item.id.toString())}
      />
    </div>
  );

  // Define columns for enquiry table
  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Message",
      key: "message",
    },
    {
      header: "Actions",
      key: "actions",
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
            {/* StoreFront UI inspired search bar */}
            <form role="search" className="flex items-center w-full max-w-sm">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                  style={{ height: "42px" }}
                />
                <div
                  style={{
                    background: "var(--secondary-color)",
                    height: "42px",
                  }}
                  className="absolute rounded-l-none rounded-md inset-y-0 right-0 flex items-center justify-center px-3"
                >
                  <svg
                    className="w-6 h-6 text-white text-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.35-5.65A7 7 0 1 1 4 12a7 7 0 0 1 14 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </form>
          </div>

          <div className="flex ml-auto"></div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={enquiries}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="Enquiry"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>

      {/* Enhanced Custom Modal */}
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
