import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Category } from "../../types/category.types"
import { useQuery } from "@tanstack/react-query";
import { mockCategoryData } from "../../config/mock/categoryTable";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";

const fetchCategory = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategoryData), 1000);
  });
};


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
  const [categories, setCategories] = useState<Category[]>(mockCategoryData);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/category/new");
  };
  const { isLoading } = useQuery({
    queryKey: ["mockCategoryData"],
    queryFn: fetchCategory,
  });

  const handleDeleteCategory = (categoryId: string) => {
    setSelectedCategory(
      categories.find((category) => category.id === categoryId) || null
    );
    setDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      console.log(`Deleting category with ID: ${selectedCategory.id}`);
      setCategories(
        categories.filter((category) => category.id !== selectedCategory.id)
      );
    }
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const actionRenderer = (item: Category) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => navigate("/category/new")}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCategory(item.id)}
      />
    </div>
  );

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
    },
  ];

  return (
    <div className="">
      <div className="bg-white p-2.5 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-2 p-2">
          <div className="flex justify-center w-full md:w-auto flex-grow">
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
                  className="absolute rounded-l-none rounded-md inset-y-0 right-0 flex items-center justify-center px-2.5"
                >
                  <svg
                    className="w-4 h-4 text-white"
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
              className="ml-2 px-2.5 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1 text-sm"
              onClick={handleAdd}
              disabled={isLoading}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable<Category>
          items={categories}
          columns={columns}
          idKey="id"
          itemsPerPage={10}
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Category"
        subtitle={`Are you sure you want to delete the category "${selectedCategory?.category}"?`}
        onClose={(confirm: boolean) => {
          if (confirm) {
            confirmDeleteCategory();
          } else {
            setDialogOpen(false);
            setSelectedCategory(null);
          }
        }}
      />
    </div>
  );
};

export default CategoryPage;
