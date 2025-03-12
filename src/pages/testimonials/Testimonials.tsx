import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { StarRating } from "../../components/common/DataTable";
import { testimonials } from "../../config/mock/testimonialsTable";
import type { Testimonial } from "../../types/testimonials.types";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const TestimonialsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");

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
    navigate("/testimonials/new");
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

          <div className="flex ml-auto">
            <button
              className="px-2 py-2 bg-blue-600 text-white rounded-md "
              onClick={handleAddNewTestimonials}
            >
              ADD TESTIMONIALS
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
        />
      </div>
    </div>
  );
};

export default TestimonialsPage;
