import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { enquiries } from "../../config/mock/enquiriesTable";
import { useNavigate } from "react-router-dom";

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

  // const handleAddNewEnquiry = () => {
  //   // Navigate to the enquiry details page for creating a new enquiry
  //   navigate("/enquiries/new");
  // };

  const handleViewEnquiry = (id: string) => {
    // Navigate to the enquiry details page
    navigate(`/enquiries/${id}`);
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
        />
      </div>
    </div>
  );
};

export default EnquirySection;
