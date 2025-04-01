import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { StarRating } from "../../components/common/DataTable";
import { Edit } from "@mui/icons-material";
import { Testimonial } from "../../types/testimonials.types";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllTestimonials } from "../../api/tesstimonial";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader"; // Import TableSkeletonLoader
import {  CircularProgress } from "@mui/material";
const TestimonialsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [page, setPage] = useState<number>(1); // Pagination state
  const [itemsPerPage] = useState<number>(10); // Items per page

  const navigate = useNavigate();

  const handleEditUser = (item: Testimonial) => {
    navigate(`/testimonials/${item._id}`);
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
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const response = await getAllTestimonials(
          page,
          itemsPerPage,
          searchValue,
          sortConfig
        );
        console.log("Fetched Testimonials Response:", response); // Log the entire response
        console.log("Fetched Testimonials Data:", response.data); // Log the fetched data
        setTestimonials(response.data.tableData); // Ensure the correct data structure is passed
      } catch (error) {
        setError("");
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, itemsPerPage, searchValue, sortConfig]); // Add page, itemsPerPage, searchValue, and sortConfig as dependencies

  const sortedTestimonials = useSortableData(testimonials, sortConfig);

  useEffect(() => {
    console.log("Sorted Testimonials:", sortedTestimonials);
  }, [sortedTestimonials]);

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
    },
    {
      header: (
        <SortableHeader
          label="Rating"
          columnKey="rating"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "rating",
      render: (item: Testimonial) => <StarRating rating={item.ratings} />, // Use item.ratings
    },
    {
      header: (
        <SortableHeader
          label="Description"
          columnKey="description"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "description",
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  const handleAddNewTestimonials = () => {
    navigate("/testimonials/new");
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
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}{" "}
      {/* Displaying the error message */}
       <div className="bg-white rounded-lg shadow overflow-hidden">
        {
        isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : Array.isArray(sortedTestimonials) &&
          sortedTestimonials.length > 0 ? (
          <DataTable
            items={sortedTestimonials}
            columns={columns}
            idKey="_id" // Assuming _id is the key for testimonials
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={setPage}
          />
        ):(
          <div className="text-center p-4">
            <CircularProgress sx={{ color: "#0d7f3f" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
