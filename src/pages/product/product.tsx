import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import DataTable from "../../components/common/DataTable";
import { getAllProducts, deleteProduct } from "../../api/product";
import { Product } from "../../types/product.types";
import ConfirmationDialog from "../../components/common/Dialog";
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

const ProductPage: React.FC = () => {
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
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAddNewProduct = () => {
    navigate("/product/new?action=add");
  };
  useEffect(() => {
      setPage(1);
    }, [searchValue]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
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

        // Debugging: Log the entire API response
        console.log("[DEBUG] API Response:", response);

        // Debugging: Log the totalCount and tableData from the response
        console.log("[DEBUG] totalCount from API:", response.data.totalCount);
        console.log("[DEBUG] tableData from API:", response.data.tableData);

        setProducts(response.data.tableData);
        setTotalProducts(response.data.totalCount); // Set the total product count
        setPageCount(Math.ceil(response.data.totalCount / itemsPerPage)); // Calculate total pages
      } catch (error) {
        setError("Failed to fetch products");
        console.error("[DEBUG] Error fetching products:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchProducts();
  }, [page, itemsPerPage, searchValue, sortConfig]);

  const handleDeleteProduct = (productId: string | number) => {
    setSelectedProduct(
      products.find((product) => product._id === productId) || null
    );
    setDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await deleteProduct(selectedProduct._id);
        setSnackbarMessage(response.message);
        setProducts(
          products.filter((product) => product._id !== selectedProduct._id)
        );
        setTotalProducts((prevTotal) => prevTotal - 1); // Update total count after deletion
        setPageCount(Math.ceil((totalProducts - 1) / itemsPerPage)); // Recalculate page count
      } catch (error: any) {
        setSnackbarMessage(error.message || "Failed to delete product");
      }
    }
    setDialogOpen(false);
    setSelectedProduct(null);
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

  const actionRenderer = (item: Product) => (
    <div className="flex justify-center items-center gap-4">
      <Edit
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => navigate(`/product/${item._id}?action=edit`)}
      />
      <Delete
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleDeleteProduct(item._id)}
      />
    </div>
  );

 const columns = [
   {
     header: (
       <SortableHeader
         label="Featured"
         columnKey="isFeatured"
         sortConfig={sortConfig}
         onSort={handleSort}
       />
     ),
     key: "isFeatured",
     render: (item: Product) => (
       <div className="flex justify-center">
         <input
           type="checkbox"
           checked={item.isFeatured}
           className="form-checkbox h-5 w-5 checkbox-green"
           readOnly
         />
       </div>
     ),
   },
   {
     header: <span></span>, // Removed SortableHeader for Image
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
   
   {
     header: <span>Actions</span>,
     key: "actions",
     render: actionRenderer,
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
              onClick={handleAddNewProduct}
              disabled={isLoading}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable
            items={sortedProducts}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={(newPage) => {
              console.log("[DEBUG] Changing page to:", newPage);
              setPage(newPage);
            }}
            pageCount={pageCount}
            totalCount={totalProducts} // Pass total product count
          />
        )}
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Product"
        subtitle={`Are you sure you want to delete the product "${selectedProduct?.name}"?`}
        onClose={(confirm: boolean) => {
          if (confirm) {
            confirmDeleteProduct();
          } else {
            setDialogOpen(false);
            setSelectedProduct(null);
          }
        }}
      />

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

export default ProductPage;