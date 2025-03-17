import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
import { StarRating } from "../../components/common/DataTable";
import { testimonials } from "../../config/mock/testimonialsTable";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { Testimonial } from "../../types/testimonials.types";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(testimonials), 1000); // Simulate 1-second delay
  });
};

const TestimonialsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  const handleEditUser = (item: Testimonial) => {
    navigate("/testimonials/:id", { state: { testimonial: item } });
  };

  const actionRenderer = (item: Testimonial) => (
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

  const handleAddNewTestimonials = () => {
    // Navigate to the user details page for creating a new user
    navigate("/testimonials/:id");
  };

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

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
              className="px-2 py-2 bg-blue-600 text-white rounded-md"
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
