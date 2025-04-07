import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { getAllProducts } from "../../api/product";
import {
  addProductsToCollection,
  getProductsByCollectionId,
} from "../../api/collectionProduct";
import { Product } from "../../types/product.types";
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
import { getImage } from "../../utils/imagePreview";

const CollectionAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [checkedProducts, setCheckedProducts] = useState<
    Record<string, boolean>
  >({});
  const [existingCollectionProducts, setExistingCollectionProducts] = useState<
    string[]
  >([]);
  const [, setInitialCheckedState] = useState<Record<string, boolean>>({});
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);

  const navigate = useNavigate();
  const { id: collectionId } = useParams<{ id: string }>();

  // Read saved product IDs from the previous screen
  useEffect(() => {
    const loadSavedProductIds = () => {
      const savedIds = sessionStorage.getItem("existingProductIds");
      if (savedIds) {
        try {
          const parsedIds = JSON.parse(savedIds);
          setExistingCollectionProducts(parsedIds);
          console.log(
            "Loaded existing product IDs from sessionStorage:",
            parsedIds
          );

          // Initialize checked products state with existing collection products
          const initialCheckedProducts: Record<string, boolean> = {};
          parsedIds.forEach((id: string) => {
            initialCheckedProducts[id] = true;
          });
          setCheckedProducts(initialCheckedProducts);
          setInitialCheckedState({ ...initialCheckedProducts });
          setIsLoadingCollection(false);
        } catch (error) {
          console.error("Error parsing saved product IDs:", error);
          fetchCollectionProducts();
        }
      } else {
        fetchCollectionProducts();
      }
    };

    const fetchCollectionProducts = async () => {
      if (!collectionId) return;

      setIsLoadingCollection(true);
      try {
        const response = await getProductsByCollectionId(collectionId);
        const productIds = response.data.products.map(
          (product) => product._id || ""
        );
        setExistingCollectionProducts(productIds);

        // Initialize checked products state with existing collection products
        const initialCheckedProducts: Record<string, boolean> = {};
        productIds.forEach((id) => {
          initialCheckedProducts[id] = true;
        });
        setCheckedProducts(initialCheckedProducts);
        setInitialCheckedState({ ...initialCheckedProducts });
      } catch (error) {
        console.error("Failed to fetch collection products", error);
        setSnackbarMessage("Failed to fetch existing collection products");
      } finally {
        setIsLoadingCollection(false);
      }
    };

    loadSavedProductIds();
  }, [collectionId]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllProducts(
          page,
          itemsPerPage,
          searchValue,
          sortConfig
        );
        console.log(response, "Fetched products");
        setProducts(response.data.tableData);

        // Mark existing product IDs as checked once they load
        if (!isLoadingCollection && existingCollectionProducts.length > 0) {
          const updatedCheckedProducts = { ...checkedProducts };
          response.data.tableData.forEach((product: Product) => {
            if (
              product._id &&
              existingCollectionProducts.includes(product._id)
            ) {
              updatedCheckedProducts[product._id] = true;
            }
          });
          setCheckedProducts(updatedCheckedProducts);
        }
      } catch (error) {
        setError("Failed to fetch products");
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    itemsPerPage,
    searchValue,
    sortConfig,
    isLoadingCollection,
    existingCollectionProducts,
  ]);

  const handleCheckboxChange = (productId: string) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleCancel = () => {
    // Clear session storage before navigating back
    sessionStorage.removeItem("existingProductIds");
    navigate(-1);
  };

  const handleAdd = async () => {
    try {
      if (!collectionId) {
        setSnackbarMessage("Collection ID is missing");
        return;
      }

      // Get selected product IDs
      const selectedProductIds = Object.entries(checkedProducts)
        .filter(([, isChecked]) => isChecked)
        .map(([productId]) => productId);

      // Identify new products that are not already in the collection
      const newProductIds = selectedProductIds.filter(
        (id) => !existingCollectionProducts.includes(id)
      );

      // Identify products that were previously in the collection but are now unchecked
      const removedProductIds = existingCollectionProducts.filter(
        (id) => !selectedProductIds.includes(id)
      );

      console.log("Selected Product IDs:", selectedProductIds);
      console.log("New Product IDs to add:", newProductIds);
      console.log("Removed Product IDs to remove:", removedProductIds);

      if (newProductIds.length > 0) {
        // Prepare the payload in the required format
        const addPayload = newProductIds.map((productId) => ({
          collectionId: collectionId,
          productId: productId,
        }));

        console.log("Payload for adding products:", addPayload);

        // Add new products to the collection
        const addResponse = await addProductsToCollection(addPayload);
        console.log("Add Response:", addResponse);

        if (addResponse.status === 200 && addResponse.data.success) {
          setSnackbarMessage("New products added to collection successfully");
        } else {
          setSnackbarMessage("Failed to add new products");
        }
      }

      // Navigate to the ProductAddPage after attempting to update the collection
      navigate(`/collections/collection-product/${collectionId}`);
    } catch (error) {
      setSnackbarMessage("Error updating collection products");
      console.error("Error updating collection products:", error);
      // Navigate to the ProductAddPage even if there is an error
      navigate(`/collections/collection-product/${collectionId}`);
    }
  };

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
          label="Select"
          columnKey="select"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "select",
      render: (item: Product) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={checkedProducts[item._id || ""] || false}
            className="form-checkbox h-5 w-5 checkbox-green"
            onChange={() => handleCheckboxChange(item._id || "")}
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
            src={getImage(item.thumbnailImage)}
            alt={item.name}
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
              onClick={handleAdd}
              disabled={isLoading || isLoadingCollection}
            >
              Update Collection
            </button>
            <button
              className="ml-4 px-2 py-2 bg-blue-600 text-white rounded-md"
              onClick={handleCancel}
              disabled={isLoading || isLoadingCollection}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading || isLoadingCollection ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            tableType="product"
            loading={isLoading}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>

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

export default CollectionAddPage;
