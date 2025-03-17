import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Edit, Delete} from "@mui/icons-material";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productTable";
import type { Product } from "../../types/product.types";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(productMockData), 1000);
  });
};

const ProductPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });

  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    // Navigate to the product details page for creating a new product
    navigate("/product/new?action=add");
  };

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleDeleteProduct = (productId: string | number) => {
    setSelectedProduct(
      products.find((product) => product.id === productId) || null
    );
    setDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      console.log(`Deleting product with ID: ${selectedProduct.id}`);
      refetch(); // Refetch after deletion (or update cache)
    }
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const actionRenderer = (item: Product) => (
    <div className="flex justify-center items-center gap-4">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => navigate(`/product/${item.id}?action=edit`)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteProduct(item.id)}
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

  const sortedProducts = React.useMemo(() => {
    if (sortConfig.key && sortConfig.direction) {
      return [...products].sort((a, b) => {
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
    return products;
  }, [products, sortConfig]);

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
          <span>Featured</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("featured")}
          >
            {renderSortIcon("featured")}
          </div>
        </div>
      ),
      key: "featured",
      render: (item: Product) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={item.featured}
            className="form-checkbox h-5 w-5 checkbox-green"
            readOnly
          />
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Image</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("productImage")}
          >
            
          </div>
        </div>
      ),
      key: "productImage",
      render: (item: Product) => (
        <div className="text-center flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={item.imageUrl}
            alt={item.name}
          />
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Product Name</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            {renderSortIcon("name")}
          </div>
        </div>
      ),
      key: "name",
      render: (item: Product) => (
        <div className="flex text-left">
          <div className="ml-0">
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
          </div>
        </div>
      ),
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
      render: (item: Product) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {item.description}
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Price</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("price")}
          >
            {renderSortIcon("price")}
          </div>
        </div>
      ),
      key: "price",
      render: (item: Product) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          {item.discountPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${item.discountPrice.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Quantity</span>
          <div
            className="flex flex-col ml-1 cursor-pointer"
            onClick={() => handleSort("quantity")}
          >
            {renderSortIcon("quantity")}
          </div>
        </div>
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
            {/* Use the SearchBar component */}
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

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={sortedProducts}
          // @ts-expect-error non fix error
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="product"
          actionRenderer={actionRenderer}
          loading={isLoading}
        />
      </div>

      {/* Confirmation Dialog */}
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
    </div>
  );
};

export default ProductPage;
