import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productTable";
import type { Product } from "../../types/product.types";
import { useNavigate } from "react-router-dom";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
const ProductAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    // Navigate to the user details page for creating a new user
    navigate("/collection/collection-add-product");
  };

  // Define columns for product table
  const columns = [
    {
      header: "",
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
      header: "Product Name",
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
      header: "Description",
      key: "description",
      render: (item: Product) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {item.description}
        </div>
      ),
    },
    {
      header: "Price",
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
      header: "Quantity",
      key: "quantity",
      render: (item: Product) => (
        <div className="text-sm text-gray-900">{item.quantity}</div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (item: Product) => (
        <div className="flex justify-center items-center gap-4">
          <Visibility
            sx={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => navigate(`/products/${item.id}`)}
          />
          <Edit
            sx={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => navigate(`/products/edit/${item.id}`)}
          />
          <Delete
            sx={{ fontSize: 22, cursor: "pointer", color: "#ff0000" }}
            onClick={() => handleDeleteProduct(item.id)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteProduct = (productId: string | number) => {
    // Implement delete logic here
    // For example, show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log(`Deleting product with ID: ${productId}`);
      // Here you would typically call an API to delete the product
      // Then update your state or refetch data
    }
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

          <div className="flex ml-auto">
            <button
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewProduct}
            >
              ADD PRODUCT
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={productMockData}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="product"
        />
      </div>
    </div>
  );
};

export default ProductAddPage;
