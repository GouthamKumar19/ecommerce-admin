import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Category } from "../../types/category.types";
import { mockCategoryData } from "../../config/mock/categoryTable";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const SubcategoryCell: React.FC<{ category: string }> = ({ category }) => {
  const allSubcategories = [
    ...new Set(
      mockCategoryData
        .filter((item) => item.category === category)
        .map((item) => item.subcategory)
    ),
  ];

  const displayCount = 3;
  const displayedSubcategories = allSubcategories.slice(0, displayCount);
  const remainingCount = Math.max(0, allSubcategories.length - displayCount);

  return (
    <Box
      sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: "center" }}
    >
      {displayedSubcategories.map((subcat, index) => (
        <Chip
          key={index}
          label={subcat}
          size="small"
          sx={{
            backgroundColor: "#e8f5e9",
            color: "#0d7f3f",
            "&:hover": {
              backgroundColor: "#c8e6c9",
            },
            height: "24px",
            fontSize: "0.75rem",
          }}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          (+{remainingCount} more)
        </span>
      )}
    </Box>
  );
};

const CategoryPage: React.FC = () => {
  const [categories] = useState<Category[]>(mockCategoryData);
  const [searchValue, setSearchValue] = useState<string>("");

  const columns = [
    {
      header: "Category",
      key: "category",
      render: (item: Category) => (
        <div className="text-sm text-gray-900 capitalize">{item.category}</div>
      ),
    },
    {
      header: "Subcategory",
      key: "subcategory",
      render: (item: Category) => <SubcategoryCell category={item.category} />,
    },

    {
      header: "Actions",
      key: "actions",
      render: (item: Category) => (
        <div className="flex justify-center items-center gap-2">
          <Visibility
            sx={{ fontSize: 18, cursor: "pointer", color: "#666" }}
            onClick={() => console.log("View:", item.id)}
          />
          <Edit
            sx={{ fontSize: 18, cursor: "pointer", color: "#666" }}
            onClick={() => handleEdit(item.id)}
          />
          <Delete
            sx={{ fontSize: 18, cursor: "pointer", color: "#dc2626" }}
            onClick={() => handleDelete(item.id)}
          />
        </div>
      ),
    },
  ];
  const navigate = useNavigate();

  const handleAdd = () => {
    // Navigate to the user details page for creating a new user
    navigate("/category/new");
  };

  const handleEdit = (id: string) => {
    console.log("Edit category:", id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log("Delete category:", id);
    }
  };

  return (
    <div className="">
      <div className="bg-white p-2.5 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-2 p-2">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="flex ml-auto">
            <button
              className="ml-2 px-2.5 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1 text-sm"
              onClick={handleAdd}
            >
              ADD CATEGORY
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable<Category>
          items={categories}
          columns={columns}
          idKey="id"
          tableType="category"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
