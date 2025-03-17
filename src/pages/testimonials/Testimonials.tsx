import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
import { StarRating } from "../../components/common/DataTable";
import { testimonials } from "../../config/mock/testimonialsTable";

import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { Testimonial } from "../../types/testimonials.types";

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(testimonials), 1000); // Simulate 1-second delay
  });
};

const TestimonialsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const handleEditUser = (item: Testimonial) => {
    navigate("/testimonials/:id", { state: { testimonial: item } });
  };
  
  const actionRenderer = (item:Testimonial) => (
    <div className="flex justify-center items-center gap-4">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditUser(item)}
      />
    </div>
  );

  // Define columns for testimonials table
  const columns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Rating",
      key: "rating",
      render: (item: Testimonial) => <StarRating rating={item.rating} />,
    },
    {
      header: "Description",
      key: "description",
    },
    {
      header: "Actions",
      key: "actions",
    },
  ];
  const navigate = useNavigate();

  const handleAddNewTestimonials = () => {
    // Navigate to the user details page for creating a new user
    navigate("/testimonials/:id");
  };
   const {
      data: testimonials = [],
      isLoading,
      
    } = useQuery({
      queryKey: ["testimonials"],
      queryFn: fetchTestimonials,
    });

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
                    // style={{ color: "var(--secondary-color)" }}
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

          <div className="flex ml-auto">
            <button
              className="px-2 py-2 bg-blue-600 text-white rounded-md "
              onClick={handleAddNewTestimonials}
              disabled={isLoading}
            >
              Add Testimonials
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={testimonials}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="testimonial"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default TestimonialsPage;
