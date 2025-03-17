import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
import { StarRating } from "../../components/common/DataTable";
import { testimonials } from "../../config/mock/testimonialsTable";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { Testimonial } from "../../types/testimonials.types";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { MenuItem, Select, Typography } from "@mui/material";

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(testimonials), 1000); // Simulate 1-second delay
  });
};

const TestimonialsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [ratingFilter, setRatingFilter] = useState<string>("");

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

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

    const { data: testimonials = [], isLoading } = useQuery({
      queryKey: ["testimonials"],
      queryFn: fetchTestimonials,
    });


  const sortedTestimonials = React.useMemo(() => {
    const filteredTestimonials = testimonials.filter((testimonial) =>
      ratingFilter ? testimonial.rating === parseInt(ratingFilter) : true
    );

    if (sortConfig.key && sortConfig.direction) {
      return filteredTestimonials.sort((a, b) => {
        const aValue = a[sortConfig.key] as string | number;
        const bValue = b[sortConfig.key] as string | number;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredTestimonials;
  }, [testimonials, sortConfig, ratingFilter]);

  const renderSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        return <ArrowUpwardIcon />;
      } else if (sortConfig.direction === "descending") {
        return <ArrowDownwardIcon />;
      }
    }
    return (
      <div className="flex flex-col gap-0">
        <SwapVertIcon />
      </div>
    );
  };

  // Define columns for testimonials table
  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Name</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            {renderSortIcon("name")}
          </div>
        </div>
      ),
      key: "name",
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Rating</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("rating")}
          >
            {renderSortIcon("rating")}
          </div>
        </div>
      ),
      key: "rating",
      render: (item: Testimonial) => <StarRating rating={item.rating} />,
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Description</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("description")}
          >
            {renderSortIcon("description")}
          </div>
        </div>
      ),
      key: "description",
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

  const handleAddNewTestimonials = () => {
    // Navigate to the user details page for creating a new user
    navigate("/testimonials/:id");
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
          <div className="flex items-center">
            <Typography variant="body1" className="mr-2">
              Filter by Rating:
            </Typography>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Select>
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
          items={sortedTestimonials}
          // @ts-expect-error non fix error
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
