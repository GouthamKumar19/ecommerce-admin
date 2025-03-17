import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productTable";
import type { Product } from "../../types/product.types";
//import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component
import { Button } from "@mui/material";

const CollectionAddPage: React.FC = () => {
  // const [searchValue, setSearchValue] = useState<string>("");
  const [checkedProducts, setCheckedProducts] = useState<{
    [key: string]: boolean;
  }>({}); // State to track checked products

  // Function to handle checkbox change
  const handleCheckboxChange = (productId: string | number) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId], // Toggle the checked state
    }));
  };

  // Define columns for product table without 'Actions' column
  const columns = [
    {
      header: "Featured",
      key: "featured",
      render: (item: Product) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={checkedProducts[item.id]} // Use state to determine if the checkbox is checked
            className="form-checkbox h-5 w-5 custom-checkbox"
            onChange={() => handleCheckboxChange(item.id)} // Call the change handler
          />
        </div>
      ),
    },
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
  ];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
            {/* <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            /> */}
          </div>

          <div className="flex ml-auto space-x-4">
            <Button
              variant="outlined"
              sx={{
                borderColor: "#0d7f3f",
                color: "#0d7f3f",
                width: "96px", // Ensuring fixed width
                mr: 2, // Adds right margin for spacing
                "&:hover": {
                  borderColor: "grey.700",
                  backgroundColor: "grey.50",
                },
              }}
            >
              CANCEL
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "var(--secondary-color, #4CAF50)",
                color: "white",
                width: "96px", // Matching width with CANCEL button
                "&:hover": {
                  bgcolor: "var(--secondary-dark-color, #388E3C)",
                },
              }}
            >
              ADD
            </Button>
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

export default CollectionAddPage;
