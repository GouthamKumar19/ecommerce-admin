import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productTable";
import type { Product } from "../../types/product.types";
import { useNavigate } from "react-router-dom";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const ProductPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    // Navigate to the user details page for creating a new user
    navigate("/product/new");
  };

  // Define columns for product table
  const columns = [
    {
      header: "Featured",
      key: "featured",
      render: (item: Product) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={item.featured}
            className="form-checkbox h-5 w-5 text-blue-600"
            readOnly
          />
        </div>
      ),
    },
    {
      header: "Product Name",
      key: "name",
      render: (item: Product) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={item.imageUrl}
              alt={item.name}
            />
          </div>
          <div className="ml-4">
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
            {/* StoreFront UI inspired search bar */}
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
                  className="absolute rounded-l-none rounded-md inset-y-0 right-0 flex items-center justify-center px-3"
                >
                  <svg
                    className="w-6 h-6 text-white text-bold"
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
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleAddNewProduct}
            >
              Add Product
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

export default ProductPage;
