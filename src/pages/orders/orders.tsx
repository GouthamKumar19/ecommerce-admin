import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import type { Order, OrderFilters } from "../../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";
import OrderFilterDialog from "../../components/orders/OrderFilterDialog";
import SearchBar from "../../components/common/SearchBar";
import SortableHeader, {
  SortConfig,
} from "../../components/common/SortableHeader";
import {
  useSortableData,
  getNextSortDirection,
} from "../../components/common/SortUtils";
import TableSkeletonLoader from "../../components/common/TableSkeletonLoader"; // Import Skeleton Loader
import { getAllOrders } from "../../api/orders";

const OrderPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<OrderFilters>({
    paymentStatus: [],
    orderStatus: [],
    date: "",
  });

  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "descending",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [, setError] = useState<string | null>(null); // Error state
  const [page, setPage] = useState<number>(1); // Pagination state
  const [itemsPerPage] = useState<number>(10); // Items per page

  const navigate = useNavigate();

  const handleViewOrder = (item: Order) => {
    navigate(`/orders/${item._id}`, { state: { order: item } });
  };

  const actionRenderer = (item: Order) => (
    <div className="flex justify-center items-center gap-4">
      <Visibility
        sx={{ fontSize: 22, cursor: "pointer", color: "#0d7f3f" }}
        onClick={() => handleViewOrder(item)}
      />
    </div>
  );

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Reset error

      try {
        const response = await getAllOrders(
          page,
          itemsPerPage,
          searchValue,
          sortConfig
        );
        console.log("Fetched Orders Response:", response); // Log the entire response
        console.log("Fetched Orders Data:", response.data); // Log the fetched data
        setOrders(response.data.tableData); // Ensure the correct data structure is passed
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [page, itemsPerPage, searchValue, sortConfig]); // Dependencies updated

  const handleSort = (key: string) => {
    const direction = getNextSortDirection(
      sortConfig.key,
      key,
      sortConfig.direction
    );
    setSortConfig({ key, direction });
  };

  const sortedOrders = useSortableData(orders, sortConfig);

  const columns = [
    {
      header: (
        <SortableHeader
          label="Order ID"
          columnKey="orderId"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Customer Name"
          columnKey="customerDetails.name"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "customerDetails.name",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.customerDetails.name}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Total"
          columnKey="total"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "total",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.total.toFixed(2)}</div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Date"
          columnKey="createdAt"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "createdAt",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Payment Status"
          columnKey="paymentDetails.status"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "paymentDetails.status",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {item?.paymentDetails?.status}
        </div>
      ),
    },
    {
      header: (
        <SortableHeader
          label="Order Status"
          columnKey="status"
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ),
      key: "status",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.status}</div>
      ),
    },
    {
      header: (
        <div className="flex items-center justify-center">
          <span>Actions</span>
        </div>
      ),
      key: "actions",
      render: actionRenderer,
    },
  ];

  const handleFilterClick = () => {
    setOpenFilterDialog(true);
  };

  const applyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

 const filterOrders = (orders: Order[]) => {
   return orders
     .filter((order) => {
       if (filters.paymentStatus.length === 0) return true;
       return (
         order.paymentDetails?.status &&
         filters.paymentStatus.includes(order.paymentDetails.status)
       );
     })
     .filter((order) => {
       if (filters.orderStatus.length === 0) return true;
       return filters.orderStatus.includes(order.status);
     })
     .filter((order) =>
       order.orderId.toLowerCase().includes(searchValue.toLowerCase())
     );
 };


  return (
    <div className="container mx-auto p-1">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="flex ml-auto">
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              disabled={isLoading}
              sx={{
                backgroundColor: "var(--secondary-color)",
                color: "#ffffff",
              }}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <OrderFilterDialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        onApply={applyFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {isLoading ? (
          <TableSkeletonLoader columns={columns.length} rows={10} />
        ) : (
          <DataTable<Order>
            items={filterOrders(sortedOrders)}
            columns={columns}
            idKey="_id"
            itemsPerPage={itemsPerPage}
            tableType="order"
            actionRenderer={actionRenderer}
            loading={isLoading}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default OrderPage;
