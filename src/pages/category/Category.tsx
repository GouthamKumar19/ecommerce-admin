import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Category, Subcategory } from "../../types/category.types"; // Ensure correct import
import { useNavigate } from "react-router-dom";
import { Box, Chip, CircularProgress } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllCategory } from "../../api/category";

const SubcategoryCell: React.FC<{ subcategories: Subcategory[] }> = ({
  subcategories,
}) => {
  const displayCount = 3;
  const displayedSubcategories = subcategories.slice(0, displayCount);
  const remainingCount = Math.max(0, subcategories.length - displayCount);

  return (
    <Box
      sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: "center" }}
    >
      {displayedSubcategories.map((subcat) => (
        <Chip
          key={subcat._id}
          label={subcat.name}
          size="small"
          sx={{
            backgroundColor: "#e8f5e9",
            color: "#0d7f3f",
            "&:hover": { backgroundColor: "#c8e6c9" },
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddNewCategory = () => {
    navigate("/category/new");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Declare the payload with pagination options
        const payload = {
          options: {
            page: 1, // Set to the current page you want to fetch
            itemsPerPage: 10, // Number of items per page
          },
        };

        // Pass the payload to the getAllCategory function
        const response = await getAllCategory(payload);
        setCategories(response.data); // Set the categories from fetched data
        console.log("Fetched Categories:", response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete =
      categories.find((category) => category._id === categoryId) || null;
    setSelectedCategory(categoryToDelete);
    setDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      console.log(`Deleting category with ID: ${selectedCategory._id}`);
      setCategories(
        categories.filter((category) => category._id !== selectedCategory._id)
      );
    }
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleEditUser = (item: Category) => {
    navigate(`/category/${item._id}`, {
      state: { Category: item },
    });
  };

  const actionRenderer = (item: Category) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditUser(item)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCategory(item._id)}
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

  const sortedCategories = useSortableData(categories, sortConfig);
  const filteredCategories = sortedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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
      render: (item: Category) => (
        <div className="text-sm text-gray-900 capitalize">{item.name}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Subcategories"
          columnKey="subcategories"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "subcategories",
      render: (item: Category) => (
        <SubcategoryCell subcategories={item.subcategories} />
      ),
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          {error && <div className="text-red-600">{error}</div>}

          <div className="bg-white p-2.5 rounded-lg shadow mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-2 p-2">
              <div className="flex justify-center w-full md:w-auto flex-grow">
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
              items={filteredCategories}
              columns={columns}
              idKey="_id"
              itemsPerPage={10}
              tableType="category"
              actionRenderer={actionRenderer}
              loading={isLoading}
            />
          </div>

          <ConfirmationDialog
            open={dialogOpen}
            title="Delete Category"
            subtitle={`Are you sure you want to delete the category "${selectedCategory?.name}"?`}
            onClose={(confirm: boolean) => {
              if (confirm) {
                confirmDeleteCategory();
              } else {
                setDialogOpen(false);
                setSelectedCategory(null);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
