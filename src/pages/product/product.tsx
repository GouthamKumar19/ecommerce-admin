import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import DataTable from "../../components/common/DataTable";
import { getAllProducts, deleteProduct } from "../../api/product"; // Import your API fetching function
import { Product } from "../../types/product.types";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ProductPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    navigate("/product/new?action=add");
  };

  // Payload for API fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Reset error state
      setTimeout(async () => {
        try {
          const response = await getAllProducts(); // Fetching data without payload
          console.log(response);
          setProducts(response.data.tableData); // Assuming response.data.tableData is an array of products
        } catch (error) {
          setError("Failed to fetch products");
          console.error("Failed to fetch products",error);
        } finally {
          setIsLoading(false); // Loading is finished
        }
      }, 500);
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on component mount

  const handleDeleteProduct = (productId: string | number) => {
    setSelectedProduct(
      products.find((product) => product._id === productId) || null
    ); // Update ID checking based on your Product type
    setDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await deleteProduct(selectedProduct._id);
        setSnackbarMessage(response.message);
        setProducts(
          products.filter((product) => product._id !== selectedProduct._id)
        ); // Remove the deleted product from the list
      } catch (error: any) {
        setSnackbarMessage(error.message || "Failed to delete product");
      }
    }
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const actionRenderer = (item: Product) => (
    <div className="flex justify-center items-center gap-4">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => navigate(`/product/${item._id}?action=edit`)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteProduct(item._id)}
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

  const sortedProducts = useSortableData(products, sortConfig);

  const columns = [
    {
      header: (
        <SortableHeader
          label="Featured"
          columnKey="isFeatured"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "isFeatured",
      render: (item: Product) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={item.isFeatured}
            className="form-checkbox h-5 w-5 checkbox-green"
            readOnly
          />
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Image"
          columnKey="imageUrl"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "imageUrl",
      render: (item: Product) => (
        <div className="text-center flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={item.thumbnailImage} // Use appropriate image field
            alt={item.name}
          />
        </div>
      ),
    },
    // Other column definitions remain the same...
    {
      header: (
        <SortableHeader
          label="Product Name"
          columnKey="name"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "name",
      render: (item: Product) => (
        <div className="flex text-left">
          <div className="ml-0">
            <div className="text-sm text-gray-900 max-w-xs truncate">
              {item.name}
            </div>
          </div>
        </div>
      ),
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
      render: (item: Product) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {item.description}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Price"
          columnKey="price"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "price",
      render: (item: Product) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          {item.slashedPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${item.slashedPrice.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Quantity"
          columnKey="quantity"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "quantity",
      render: (item: Product) => (
        <div className="text-sm text-gray-900">{item.quantity}</div>
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
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewProduct}
              disabled={isLoading}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={4} rows={10} /> // Show the skeleton loader while loading
        ) : (
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id" // Use _id based on your Product type structure
            itemsPerPage={15}
            tableType="product"
            actionRenderer={actionRenderer}
            loading={isLoading}
          />
        )}
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Product"
        subtitle={`Are you sure you want to delete the product "${selectedProduct?.name}"?`}
        onClose={(confirm: boolean) => {
          if (confirm) {
            confirmDeleteProduct();
          } else {
            setDialogOpen(false);
            setSelectedProduct(null);
          }
        }}
      />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity={snackbarMessage?.includes("Failed") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductPage;
