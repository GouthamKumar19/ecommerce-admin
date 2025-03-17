import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productTable";
import type { Product } from "../../types/product.types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { ArrowBack } from "@mui/icons-material"; // Import the ArrowBack component

// Mock fetch function
const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(productMockData), 1000);
  });
};

const CollectionAddPage: React.FC = () => {
  const [checkedProducts, setCheckedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const navigate = useNavigate();

  // Use React Query for data fetching with loading state
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (productId: string | number) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    navigate(-1);
  };

  // Function to handle add button click
  const handleAdd = () => {
    console.log("Selected products:", checkedProducts);
    navigate(-1);
  };

  // Define columns for product table
  const columns = [
    {
      header: "Featured",
      key: "featured",
      render: (item: Product) => (
        <div className="flex justify-center">
          {isLoading ? (
            <Skeleton variant="rectangular" width={20} height={20} />
          ) : (
            <input
              type="checkbox"
              checked={checkedProducts[item.id] || false}
              className="form-checkbox h-5 w-5 custom-checkbox"
              onChange={() => handleCheckboxChange(item.id)}
            />
          )}
        </div>
      ),
    },
    {
      header: "",
      key: "productImage",
      render: (item: Product) => (
        <div className="text-center flex-shrink-0 h-10 w-10">
          {isLoading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <img
              className="h-10 w-10 rounded-full"
              src={item.imageUrl}
              alt={item.name}
            />
          )}
        </div>
      ),
    },
    {
      header: "Product Name",
      key: "name",
      render: (item: Product) => (
        <div className="flex text-left">
          <div className="ml-0">
            {isLoading ? (
              <Skeleton variant="text" width={120} />
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {item.name}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      key: "description",
      render: (item: Product) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {isLoading ? (
            <Skeleton variant="text" width={200} />
          ) : (
            item.description
          )}
        </div>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (item: Product) => (
        <div className="flex items-center">
          {isLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <>
              <span className="text-sm font-medium text-gray-900">
                ${item.price.toFixed(2)}
              </span>
              {item.discountPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${item.discountPrice.toFixed(2)}
                </span>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      header: "Quantity",
      key: "quantity",
      render: (item: Product) => (
        <div className="text-sm text-gray-900">
          {isLoading ? <Skeleton variant="text" width={40} /> : item.quantity}
        </div>
      ),
    },
  ];

  // Generate skeleton rows when loading
  const skeletonData = isLoading
    ? Array(5).fill({
        id: "skeleton",
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        imageUrl: "",
      })
    : [];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <ArrowBack /> {/* Add ArrowBack component here */}
          <div className="flex ml-auto space-x-4">
            <Button
              variant="outlined"
              sx={{
                borderColor: "#0d7f3f",
                color: "#0d7f3f",
                width: "96px",
                mr: 2,
                "&:hover": {
                  borderColor: "grey.700",
                  backgroundColor: "grey.50",
                },
              }}
              onClick={handleCancel}
              disabled={isLoading}
            >
              CANCEL
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "var(--secondary-color, #4CAF50)",
                color: "white",
                width: "96px",
                "&:hover": {
                  bgcolor: "var(--secondary-dark-color, #388E3C)",
                },
              }}
              onClick={handleAdd}
              disabled={isLoading || Object.keys(checkedProducts).length === 0}
            >
              ADD
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table with Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={isLoading ? skeletonData : products}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="product"
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default CollectionAddPage;