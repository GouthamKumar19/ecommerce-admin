import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Category } from "../../types/category.types";
import { useQuery } from "@tanstack/react-query";
import { mockCategoryData } from "../../config/mock/categoryTable";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const navigate = useNavigate();

  const handleAddNewCategory = () => {
    // Navigate to the collection creation page
    navigate("/category/:id");
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
  const handleEditUser = (item: Category) => {
    navigate("/category/:id", { state: { Category: item } });
  };

  const actionRenderer = (item: Category) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditUser(item)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCategory(item.id)}
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

  const sortedCategories = React.useMemo(() => {
    if (sortConfig.key && sortConfig.direction) {
      return [...categories].sort((a, b) => {
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
    return categories;
  }, [categories, sortConfig]);

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

  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Category</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("category")}
          >
            {renderSortIcon("category")}
          </div>
        </div>
      ),
      key: "category",
      render: (item: Category) => (
        <div className="text-sm text-gray-900 capitalize">{item.category}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Subcategory</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("subcategory")}
          >
            {renderSortIcon("subcategory")}
          </div>
        </div>
      ),
      key: "subcategory",
      render: (item: Category) => <SubcategoryCell category={item.category} />,
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
              onClick={handleAddNewCategory}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable<Category>
          items={sortedCategories}
        // @ts-expect-error non fix error
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
