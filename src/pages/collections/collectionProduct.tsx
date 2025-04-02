import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import type { Product } from "../../types/collectionProduct.types";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import ConfirmationDialog from "../../components/common/Dialog";
import SearchBar from "../../components/common/SearchBar";

import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import { getAllProducts } from "../../api/collectionProduct";
import { toggleProductStatus } from "../../api/collectionProduct";
import BackArrow from "../../components/common/BackArrow";

const ProductAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [disabledProducts, setDisabledProducts] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllProducts();
        console.log("Fetched Products ResponseEWEWEEW:", response);

        // Make sure we're accessing the data properly
        if (response && response.data && response.data.tableData) {
          setTableData(response.data.tableData);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleAddNewProduct = () => {
    navigate("/collection/collection-product/:id");
  };

  const handleToggleProduct = (item: Product) => {
    setCurrentProduct(item);
    if (disabledProducts.includes(String(item._id))) {
      setDialogTitle("Enable Product");
      setDialogSubtitle(`Are you sure you want to enable "${item.name}"?`);
    } else {
      setDialogTitle("Disable Product");
      setDialogSubtitle(`Are you sure you want to disable "${item.name}"?`);
    }
    setDialogOpen(true);
  };

  const handleDeleteProduct = (item: Product) => {
    setCurrentProduct(item);
    setDialogTitle("Delete Product");
    setDialogSubtitle(
      `Are you sure you want to delete the product "${item.name}"?`
    );
    setDialogOpen(true);
  };

  const handleDialogClose = async (confirm: boolean) => {
    if (confirm && currentProduct) {
      if (dialogTitle === "Delete Product") {
        // Existing delete logic
        setTableData((prevData) =>
          prevData.filter((product) => product._id !== currentProduct._id)
        );

        const deletedIds = {
          ids: [currentProduct._id],
        };
        console.log(JSON.stringify(deletedIds, null, 2));

        try {
          // await deleteProduct(currentProduct._id);
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      } else if (
        dialogTitle === "Disable Product" ||
        dialogTitle === "Enable Product"
      ) {
        const isEnabling = dialogTitle === "Enable Product";
        const productIds = [currentProduct._id];

        // Log the toggle action in the required format
        console.log(
          JSON.stringify(
            {
              ids: productIds,
              isEnabled: isEnabling,
            },
            null,
            2
          )
        );

        try {
          // Call the API to toggle the product status
          await toggleProductStatus(currentProduct._id, isEnabling);

          // Update the local state
          if (isEnabling) {
            setDisabledProducts((prev) =>
              prev.filter((id) => id !== String(currentProduct._id))
            );
          } else {
            setDisabledProducts((prev) => [
              ...prev,
              String(currentProduct._id),
            ]);
          }

          // Optionally refetch the products to get the updated data
          // queryClient.invalidateQueries(['products']);
        } catch (error) {
          console.error("Error toggling product status:", error);
        }
      }
    }
    setDialogOpen(false);
    setCurrentProduct(null);
  };

  // Filter products based on search value
  // const filteredProducts = tableData.filter((product) =>
  //   product && product.name
  //     ? product.name.toLowerCase().includes(searchValue.toLowerCase())
  //     : false
  // );

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedProducts = useSortableData(tableData, sortConfig);

  const actionRenderer = (item: Product) => {
    // Make sure we're using _id consistently, not id
    const isDisabled = disabledProducts.includes(String(item._id));
    return (
      <div className="flex justify-center items-center gap-4">
        <Switch
          checked={!isDisabled}
          onChange={() => handleToggleProduct(item)}
          inputProps={{ "aria-label": "Toggle product status" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#0d7f3f",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#0d7f3f",
            },
          }}
        />

        <Delete
          sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
          onClick={() => handleDeleteProduct(item)}
        />
      </div>
    );
  };

  const columns = [
    {
      header: "",
      key: "imageUrl",
      render: (item: Product) => (
        <div className="text-center flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={item?.productDetails?.thumbnailImage} // Use appropriate image field
          />
        </div>
      ),
    },
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
            <div
              className={`text-sm max-w-xs truncate ${
                disabledProducts.includes(String(item._id))
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
              {item?.productDetails?.name}
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
        <div
          className={`text-sm max-w-xs truncate ${
            disabledProducts.includes(String(item._id))
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
          {item?.productDetails?.description}
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
        <div
          className={`flex items-center ${
            disabledProducts.includes(String(item._id)) ? "text-gray-400" : ""
          }`}
        >
          <span
            className={`text-sm font-medium ${
              disabledProducts.includes(String(item._id))
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            ${item?.productDetails?.price}
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
        <div
          className={`text-sm ${
            disabledProducts.includes(String(item._id))
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
          {item?.productDetails?.quantity}
        </div>
      ),
    },
    {
      header: <span>Actions</span>,
      key: "actions",
      render: actionRenderer,
    },
  ];

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <BackArrow />
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
              ADD PRODUCT
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <div className="p-4 text-center">Loading products...</div>
        ) : tableData.length === 0 ? (
          <div className="p-4 text-center">No products found</div>
        ) : (
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id" // Changed from "id" to "_id" to match your data structure
            itemsPerPage={15}
            tableType="product"
            actionRenderer={actionRenderer}
            disabledRows={disabledProducts}
            loading={isLoading}
          />
        )}
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title={dialogTitle}
        subtitle={dialogSubtitle}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default ProductAddPage;
