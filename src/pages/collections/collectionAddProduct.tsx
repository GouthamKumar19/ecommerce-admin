import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { getAllProducts } from "../../api/product";
import {
  addProductsToCollection,
  getProductsByCollectionId,
  deleteCollectionProducts,
} from "../../api/collectionProduct";
import { getCollectionById } from "../../api/collections";
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

import { getImage } from "../../utils/imagePreview";

const CollectionAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  //const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [checkedProducts, setCheckedProducts] = useState<
    Record<string, boolean>
  >({});
  const [existingCollectionProducts, setExistingCollectionProducts] = useState<
    { _id: string; productId: string }[]
  >([]);
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);

  const navigate = useNavigate();
  const { id: collectionId } = useParams<{ id: string }>();

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

          const initialCheckedProducts: Record<string, boolean> = {};
          parsedIds.forEach((item: { productId: string }) => {
            initialCheckedProducts[item.productId] = true;
          });
          setCheckedProducts(initialCheckedProducts);
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
        const productMappings = response.data.products.map((product: any) => ({
          _id: product._id || "",
          productId: product.productId || "",
        }));
        setExistingCollectionProducts(productMappings);

        const initialCheckedProducts: Record<string, boolean> = {};
        productMappings.forEach((mapping) => {
          initialCheckedProducts[mapping.productId] = true;
        });
        setCheckedProducts(initialCheckedProducts);
      } catch (error) {
        console.error("Failed to fetch collection products", error);
        //setSnackbarMessage("Failed to fetch existing collection products");
      } finally {
        setIsLoadingCollection(false);
      }
    };

    loadSavedProductIds();
  }, [collectionId]);

  // Add these state variables for pagination
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  
  // Add this useEffect to reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchValue]);
  
  // Update the fetchProducts function to handle pagination properly
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
  
      try {
        // Handle null direction case properly
        const effectiveSortConfig: SortConfig = sortConfig.direction === null 
          ? { key: "updatedAt", direction: "descending" }  // Default sort
          : sortConfig;
          
        const response = await getAllProducts(
          page,
          itemsPerPage,
          searchValue,
          effectiveSortConfig
        );
        console.log(response, "Fetched products");
        
        // Set products from the response
        setProducts(response.data.tableData);
        
        // Set pagination data
        setTotalCount(response.data.totalCount);
        setPageCount(Math.ceil(response.data.totalCount / itemsPerPage));
  
        // Call getCollectionById immediately after getAllProducts
        if (collectionId) {
          console.log("Fetching collection details after products");
          const collectionResponse = await getCollectionById(collectionId);
          console.log("Collection data:", collectionResponse);
  
          // Extract product mappings from collection response
          if (
            collectionResponse?.data?.collectionProducts &&
            Array.isArray(collectionResponse.data.collectionProducts)
          ) {
            const productMappings =
              collectionResponse.data.collectionProducts.map(
                (product: any) => ({
                  _id: product._id,
                  productId: product.productId,
                })
              );
  
            console.log(
              "Collection Products Mapping (_id -> productId):",
              productMappings
            );
            console.table(productMappings);
  
            // Update the existingCollectionProducts with actual IDs
            setExistingCollectionProducts(productMappings);
  
            // Update the checked state based on these product IDs
            const updatedCheckedProducts: Record<string, boolean> = {
              ...checkedProducts,
            };
            response.data.tableData.forEach((product: Product) => {
              if (
                product._id &&
                productMappings.some(
                  (mapping) => mapping.productId === product._id
                )
              ) {
                updatedCheckedProducts[product._id] = true;
              }
            });
            setCheckedProducts(updatedCheckedProducts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
  
    fetchProducts();
  }, [page, itemsPerPage, searchValue, sortConfig, collectionId]);

  const handleCheckboxChange = (productId: string) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleCancel = () => {
    sessionStorage.removeItem("existingProductIds");
    navigate(-1);
  };

  const handleAdd = async () => {
    try {
      if (!collectionId) {
        //setSnackbarMessage("Collection ID is missing");
        return;
      }

      const selectedProductIds = Object.entries(checkedProducts)
        .filter(([, isChecked]) => isChecked)
        .map(([productId]) => productId);

      const newProductIds = selectedProductIds.filter(
        (id) =>
          !existingCollectionProducts.some(
            (mapping) => mapping.productId === id
          )
      );

      const removedProductMappings = existingCollectionProducts.filter(
        (mapping) => !selectedProductIds.includes(mapping.productId)
      );

      console.log("Selected Product IDs:", selectedProductIds);
      console.log("New Product IDs to add:", newProductIds);
      console.log(
        "Removed Product Mappings to remove:",
        removedProductMappings
      );

      // Updating product statuses for the newly selected products
      if (newProductIds.length > 0) {
        const addPayload = newProductIds.map((productId) => ({
          collectionId: collectionId,
          productId: productId,
        }));

        console.log("Payload for adding products:", addPayload);

        const addResponse = await addProductsToCollection(addPayload);
        console.log("Add Response:", addResponse);

        
      }

      // Delete removed products - now using deleteCollectionProducts API
      if (removedProductMappings.length > 0) {
        const deletePayload = removedProductMappings.map(
          (mapping) => mapping._id
        );

        console.log("Payload for deleting products:", deletePayload);

        const deleteResponse = await deleteCollectionProducts(deletePayload);
        if (deleteResponse.status === 200 && deleteResponse.data.success) {
          console.log("Removed products deleted successfully");
        } else {
          console.log("Failed to delete removed products");
        }
      }

      navigate(`/collections/collection-product/${collectionId}`);
    } catch (error) {
      //setSnackbarMessage("Error updating collection products");
      console.error("Error updating collection products:", error);
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
      render: (item: Product) => {
        const formattedPrice = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }).format(item.price);

        const formattedSlashedPrice =
          item.slashedPrice &&
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
          }).format(item.slashedPrice);

        return (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {formattedPrice}
            </span>
            {formattedSlashedPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formattedSlashedPrice}
              </span>
            )}
          </div>
        );
      },
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
              className="ml-4 px-2 py-2 bg-[#0d7f3f] text-white rounded-md hover:bg-[#0d7f3f]/90"
              onClick={handleAdd}
              disabled={isLoading || isLoadingCollection}
            >
              Update Collection
            </button>
            <button
              className="ml-4 px-2 py-2 bg-[#0d7f3f] text-white rounded-md hover:bg-[#0d7f3f]/90"
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
          // In the return section, update the DataTable component
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            loading={isLoading}
            currentPage={page}
            onPageChange={(newPage) => {
              console.log("Changing page to:", newPage);
              setPage(newPage);
            }}
            pageCount={pageCount}
            totalCount={totalCount}
          />
        )}
      </div>

      
    </div>
  );
};

export default CollectionAddPage;
