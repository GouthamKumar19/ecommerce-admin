import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { enquiries } from "../../config/mock/enquiriesTable";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const EnquirySection: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");

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
      // @ts-expect-error next non fixable
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleViewEnquiry(item.id)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="View Enquiry"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleViewEnquiry = (id: string) => {
    // Navigate to the enquiry details page
    navigate(`/enquiries/${id}`);
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
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
        />
      </div>
    </div>
  );
};

export default EnquirySection;
