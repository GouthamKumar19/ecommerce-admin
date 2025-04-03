import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import { useNavigate, useParams } from "react-router-dom";
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
import { getCollectionById } from "../../api/collections";
import {
  toggleProductStatus,
  deleteProduct,
} from "../../api/collectionProduct";
import BackArrow from "../../components/common/BackArrow";
import {
  CollectionProduct,
  ApiResponse,
  BaseRecord,
  Collections,
} from "../../types/collectionResponse.types";

const ProductAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentProduct, setCurrentProduct] =
    useState<CollectionProduct | null>(null);
  const [disabledProducts, setDisabledProducts] = useState<string[]>([]);
  const [tableData, setTableData] = useState<CollectionProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError("Collection ID is missing");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Collections> = await getCollectionById(id);
        console.log("Fetched Collection Response:", response);

        if (response?.data?.collectionProducts) {
          setTableData(response.data.collectionProducts);
          // Extract product IDs for later use when adding new products
          const productIds = response.data.collectionProducts.map(
            (product) => product.productId
          );
          console.log("Product IDs in this collection:", productIds);

          // Store these IDs in sessionStorage for use in the CollectionAddPage
          sessionStorage.setItem(
            "existingProductIds",
            JSON.stringify(productIds)
          );
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
  }, [id]);

  const handleAddNewProduct = () => {
    // When navigating, we're already storing the existing product IDs in sessionStorage
    navigate(`/collections/collection-product/collectionAdd/${id}`);
  };

  const handleToggleProduct = (item: CollectionProduct) => {
    setCurrentProduct(item);
    if (disabledProducts.includes(String(item._id))) {
      setDialogTitle("Enable Product");
      setDialogSubtitle(
        `Are you sure you want to enable "${item.productDetails?.name}"?`
      );
    } else {
      setDialogTitle("Disable Product");
      setDialogSubtitle(
        `Are you sure you want to disable "${item.productDetails?.name}"?`
      );
    }
    setDialogOpen(true);
  };

  const handleDeleteProduct = (item: CollectionProduct) => {
    console.log(item);
    setCurrentProduct(item);
    setDialogTitle("Delete Product");
    setDialogSubtitle(
      `Are you sure you want to delete the product "${item.productDetails?.name}"?`
    );
    setDialogOpen(true);
  };

  const handleDialogClose = async (confirm: boolean) => {
    if (confirm && currentProduct) {
      if (dialogTitle === "Delete Product") {
        try {
          // Call the API to delete the product
          await deleteProduct(currentProduct._id);

          // Remove the product from the table data
          setTableData((prevData) =>
            prevData.filter((product) => product._id !== currentProduct._id)
          );

          // If the product was in the disabled list, remove it from there too
          setDisabledProducts((prev) =>
            prev.filter((id) => id !== String(currentProduct._id))
          );
        } catch (error) {
          console.error("Error deleting product:", error);
          // Optionally add error handling/notification here
        }
      } else if (
        dialogTitle === "Disable Product" ||
        dialogTitle === "Enable Product"
      ) {
        const isEnabling = dialogTitle === "Enable Product";

        try {
          await toggleProductStatus(currentProduct._id, isEnabling);

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
        } catch (error) {
          console.error("Error toggling product status:", error);
        }
      }
    }
    setDialogOpen(false);
    setCurrentProduct(null);
  };

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  // Use BaseRecord instead of Record<string, unknown> for better type compatibility
  const sortedProducts = useSortableData(
    tableData as unknown as BaseRecord[],
    sortConfig
  );

  // Type guard function to check if an item is a CollectionProduct
  const isCollectionProduct = (item: any): item is CollectionProduct => {
    return (
      item !== null &&
      typeof item === "object" &&
      "_id" in item &&
      "productDetails" in item
    );
  };

  // Safely convert BaseRecord to CollectionProduct
  const toCollectionProduct = (item: BaseRecord): CollectionProduct => {
    if (isCollectionProduct(item)) {
      return item;
    }
    // Return a default CollectionProduct if conversion fails
    // This is a fallback and should rarely be triggered if data is correct
    return item as unknown as CollectionProduct;
  };

  const actionRenderer = (item: BaseRecord) => {
    const typedItem = toCollectionProduct(item);
    const isDisabled = disabledProducts.includes(String(typedItem._id));

    return (
      <div className="flex justify-center items-center gap-4">
        <Switch
          checked={!isDisabled}
          onChange={() => handleToggleProduct(typedItem)}
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
          onClick={() => handleDeleteProduct(typedItem)}
        />
      </div>
    );
  };

  const columns = [
    {
      header: "",
      key: "imageUrl",
      render: (item: BaseRecord) => {
        const typedItem = toCollectionProduct(item);
        return (
          <div className="text-center flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={typedItem?.productDetails?.thumbnailImage}
              alt={typedItem?.productDetails?.name || "Product thumbnail"}
            />
          </div>
        );
      },
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
      render: (item: BaseRecord) => {
        const typedItem = toCollectionProduct(item);
        return (
          <div className="flex text-left">
            <div className="ml-0">
              <div
                className={`text-sm max-w-xs truncate ${
                  disabledProducts.includes(String(typedItem._id))
                    ? "text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {typedItem?.productDetails?.name}
              </div>
            </div>
          </div>
        );
      },
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
      render: (item: BaseRecord) => {
        const typedItem = toCollectionProduct(item);
        return (
          <div
            className={`text-sm max-w-xs truncate ${
              disabledProducts.includes(String(typedItem._id))
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            {typedItem?.productDetails?.description}
          </div>
        );
      },
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
      render: (item: BaseRecord) => {
        const typedItem = toCollectionProduct(item);
        return (
          <div
            className={`flex items-center ${
              disabledProducts.includes(String(typedItem._id))
                ? "text-gray-400"
                : ""
            }`}
          >
            <span
              className={`text-sm font-medium ${
                disabledProducts.includes(String(typedItem._id))
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
              ${typedItem?.productDetails?.price}
            </span>
          </div>
        );
      },
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
      render: (item: BaseRecord) => {
        const typedItem = toCollectionProduct(item);
        return (
          <div
            className={`text-sm ${
              disabledProducts.includes(String(typedItem._id))
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            {typedItem?.productDetails?.quantity}
          </div>
        );
      },
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
            idKey="_id"
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
