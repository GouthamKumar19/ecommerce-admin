import React, { useState, useEffect, useRef } from "react";
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
import { getImage } from "../../utils/imagePreview";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader";

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
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialMount = useRef(true);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchProductData = async () => {
      if (!id) {
        setError("Collection ID is missing");
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      setError(null);

      try {
        // Update the search payload to allow partial matches anywhere in the string
        const payload = {
          search: [
            {
              term: searchValue,
              fields: ["productDetails.name"],
              startsWith: false, // Allow matches anywhere in the string
              endsWith: false,   // Allow matches anywhere in the string
            },
          ],
          options: {
            sortBy: [sortConfig.key],
            sortDesc: [sortConfig.direction === "descending"],
            page: page,
            itemsPerPage: itemsPerPage,
          },
        };
        console.log("Payload:", payload);

        const response: ApiResponse<Collections> = await getCollectionById(id);
        console.log("Fetched Collection Response:", response);

        if (response?.data?.collectionProducts) {
          // Filter the products based on the searchValue
          const filteredProducts = response.data.collectionProducts.filter((product) =>
            product.productDetails?.name
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
          );

          setTableData(filteredProducts);
          console.log("Filtered Collection Products:", filteredProducts);

          // Extract product IDs for later use when adding new products
          const productIds = filteredProducts
            .filter((product) => product.isEnabled) // Filter out disabled products
            .map((product) => product.productId);
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
        if (!signal.aborted) {
          setError(err.message || "Failed to fetch products");
          console.error("Error fetching products:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id, searchValue, sortConfig, page, itemsPerPage]);

  const handleAddNewProduct = () => {
    // When navigating, we're already storing the existing product IDs in sessionStorage
    navigate(`/collections/collection-product/collectionAdd/${id}`);
  };

  const handleToggleProduct = (item: CollectionProduct) => {
    setCurrentProduct(item);
    if (!item.isEnabled) {
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
          // 👇 Wrap the product ID in an array
          await deleteProduct([currentProduct._id]);

          // Remove the deleted product from the UI
          setTableData((prevData) =>
            prevData.filter((product) => product._id !== currentProduct._id)
          );

          // Also clean up from disabled list
          setDisabledProducts((prev) =>
            prev.filter((id) => id !== String(currentProduct._id))
          );
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      } else if (
        dialogTitle === "Disable Product" ||
        dialogTitle === "Enable Product"
      ) {
        const isEnabling = dialogTitle === "Enable Product";
        console.log("Current Product ID:", isEnabling);

        try {
          const response = await toggleProductStatus(
            currentProduct._id,
            isEnabling
          );
          console.log("Toggle Response:", response);

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

          // Update the product status in the table data
          setTableData((prevData) =>
            prevData.map((product) =>
              product._id === currentProduct._id
                ? { ...product, isEnabled: isEnabling }
                : product
            )
          );
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

    return (
      <div className="flex justify-center items-center gap-4">
        <Switch
          checked={!!typedItem.isEnabled}
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
              src={getImage(typedItem?.productDetails?.thumbnailImage)}
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
          <TableSkeletonLoader columns={6} rows={10} /> // Show the skeleton loader while loading
        ) : tableData.length === 0 ? (
          <div className="p-4 text-center">No products found</div>
        ) : (
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            totalCount={tableData.length} // Use the actual length of tableData
            pageCount={Math.ceil(tableData.length / itemsPerPage)} // Calculate the page count based on data length
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            actionRenderer={actionRenderer}
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