import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import { Category, Subcategory } from "../../types/category.types";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
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
import { getAllCategory, deleteCategoryById } from "../../api/category";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader"; // Import TableSkeletonLoader

// New type extending Category and Record<string, unknown>
interface CategoryRecord extends Category, Record<string, unknown> {}

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
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryRecord | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1); // Pagination state
  const [itemsPerPage] = useState<number>(10); // Items per page
  const [totalCount, setTotalCount] = useState<number>(0); // Total category count
  const [pageCount, setPageCount] = useState<number>(0); // Page count

  const navigate = useNavigate();

  const handleAddNewCategory = () => {
    navigate("/category/new");
  };

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };
useEffect(() => {
    setPage(1);
  }, [searchValue]);
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const response = await getAllCategory(
          page,
          itemsPerPage,
          searchValue,
          sortConfig
        );
        console.log("Fetched Categories Response:", response); // Log the entire response
        console.log("Fetched Categories Data:", response.data); // Log the fetched data

        if (response.data && Array.isArray(response.data.tableData)) {
          setCategories(response.data.tableData as CategoryRecord[]); // Set the categories from fetched data
          setTotalCount(response.data.totalCount); // Update total category count
          setPageCount(Math.ceil(response.data.totalCount / itemsPerPage)); // Calculate total pages
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
        console.error("Error fetching categories:", err);
      } finally {
         setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchCategories();
  }, [page, itemsPerPage, searchValue, sortConfig]); // Add page, itemsPerPage, searchValue, and sortConfig as dependencies

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete =
      categories.find((category) => category._id === categoryId) || null;
    setSelectedCategory(categoryToDelete);
    setDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (selectedCategory) {
      console.log(`Deleting category with ID: ${selectedCategory._id}`);
      try {
        const response = await deleteCategoryById(selectedCategory._id);
        if (response.status === 200) {
          setCategories(
            categories.filter(
              (category) => category._id !== selectedCategory._id
            )
          );
          setTotalCount((prev) => prev - 1); // Decrement total category count
          setPageCount((prev) => Math.ceil((prev - 1) / itemsPerPage)); // Recalculate page count
          console.log("Category deleted successfully:", response.message);
        } else {
          console.error("Error deleting category:", response.message);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleEditCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const actionRenderer = (item: CategoryRecord) => (
    <div className="flex justify-center items-center gap-2">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleEditCategory(item._id)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteCategory(item._id)}
      />
    </div>
  );

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
      render: (item: CategoryRecord) => (
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
      render: (item: CategoryRecord) => (
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
              disabled={isLoading}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable<CategoryRecord>
            items={filteredCategories}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            currentPage={page}
            onPageChange={(newPage) => {
              console.log("Changing page to:", newPage);
              setPage(newPage);
            }}
            pageCount={pageCount}
            totalCount={totalCount} // Pass total category count
          />
        )}
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
    </div>
  );
};

export default CategoryPage;