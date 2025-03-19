import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
import { productMockData } from "../../config/mock/productCollectionTable";
import type { Product } from "../../types/collectionProduct.types";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import BackArrow from "../../components/common/BackArrow";
import SearchBar from "../../components/common/SearchBar";
import { getProductById } from "../../api/CollectionProduct"; // Adjust the import path as needed
// Mock fetch function
const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(productMockData), 1000);
  });
};

const CollectionAddPage: React.FC = () => {
  const [checkedProducts, setCheckedProducts] = useState<
    Record<string, boolean>
  >({});
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  // Use React Query for data fetching with loading state
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (productId: string) => {
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
  // Function to handle add button click
  const handleAdd = async () => {
    try {
      const selectedProductIds = Object.entries(checkedProducts)
        .filter(([ isChecked]) => isChecked)
        .map(([productId]) => productId);

      // Fetch complete details for each selected product
      const selectedProductsDetails = await Promise.all(
        selectedProductIds.map(async (productId) => {
          try {
            const response = await getProductById(productId);
            return response.data;
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validProducts = selectedProductsDetails.filter(
        (product) => product !== null
      );

      // Log the complete product details
      console.log("Selected products details:", validProducts);

      navigate(-1);
    } catch (error) {
      console.error("Error processing selected products:", error);
    }
  };

  // Filter products based on search input
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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
              checked={checkedProducts[item._id || ""] || false}
              className="form-checkbox h-5 w-5 custom-checkbox"
              onChange={() => handleCheckboxChange(item._id || "")}
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
              // src={item.imageUrl}
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
                  {/* @ts-ignore */}
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
        _id: "skeleton",
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
          <BackArrow />
          <div className="flex justify-center w-full md:w-auto ml-40">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
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
              disabled={
                isLoading ||
                Object.keys(checkedProducts).filter(
                  (key) => checkedProducts[key]
                ).length === 0
              }
            >
              ADD
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable
          items={isLoading ? skeletonData : filteredProducts}
          columns={columns}
          idKey="_id"
          itemsPerPage={15}
          tableType="product"
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default CollectionAddPage;
