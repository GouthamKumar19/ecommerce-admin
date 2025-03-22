import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/common/DataTable";
// import { productMockData } from "../../config/mock/productCollectionTable";
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

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await getAllProducts();
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ProductAddPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogSubtitle, setDialogSubtitle] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [disabledProducts, setDisabledProducts] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });

  const navigate = useNavigate();

  const { data: fetchedProducts = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (fetchedProducts.length > 0) {
      setTableData(fetchedProducts);
    }
  }, [fetchedProducts]);

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
  const filteredProducts = tableData.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedProducts = useSortableData(filteredProducts, sortConfig);

  const actionRenderer = (item: Product) => {
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
      key: "productImage",
      render: (item: Product) => (
        <div className="text-center flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            // @ts-ignore
            src={item.imageUrl}
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
            <div
              className={`text-sm font-medium ${
                disabledProducts.includes(String(item.id))
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
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
        <div
          className={`text-sm max-w-xs truncate ${
            disabledProducts.includes(String(item.id))
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
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
        <div
          className={`flex items-center ${
            disabledProducts.includes(String(item.id)) ? "text-gray-400" : ""
          }`}
        >
          <span
            className={`text-sm font-medium ${
              disabledProducts.includes(String(item.id))
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            ${item.price.toFixed(2)}
          </span>
          {item.discountPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {/* @ts-ignore */
              }${item.discountPrice.toFixed(2)}
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
            disabledProducts.includes(String(item.id))
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
          {item.quantity}
        </div>
      ),
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
        <DataTable
          items={sortedProducts}
          columns={columns}
          idKey="id"
          itemsPerPage={15}
          tableType="product"
          actionRenderer={actionRenderer}
          disabledRows={disabledProducts}
          loading={isLoading}
        />
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
