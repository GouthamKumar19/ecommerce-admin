import React, { useState } from "react";
import DataTable from "../../components/common/DataTable";
import { orderMockData } from "../../config/mock/orderNew";
import type { Order } from "../../types/order.types";
import { useNavigate } from "react-router-dom";
import { Visibility, Delete, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";
import OrderFilterDialog from "../../components/orders/OrderFilterDialog";
import SearchBar from "../../components/common/SearchBar"; // Import the SearchBar component

const OrderPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filters, setFilters] = useState<{
    paymentStatus: string;
    orderStatus: string;
  }>({
    paymentStatus: "",
    orderStatus: "",
  });
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [
    {
      header: "Order ID",
      key: "orderId",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderId}</div>
      ),
    },
    {
      header: "Username",
      key: "username",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.username}</div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">${item.amount.toFixed(2)}</div>
      ),
    },
    {
      header: "Date",
      key: "date",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">
          {new Date(item.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Payment Status",
      key: "paymentStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.paymentStatus}</div>
      ),
    },
    {
      header: "Order Status",
      key: "orderStatus",
      render: (item: Order) => (
        <div className="text-sm text-gray-900">{item.orderStatus}</div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (item: Order) => (
        <div className="flex justify-center items-center gap-4">
          <Visibility
            className="cursor-pointer"
            onClick={() => navigate(`/orders/${item.orderId}`)}
          />
          <Delete
            className="cursor-pointer"
            onClick={() => handleDeleteOrder(item.orderId)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteOrder = (orderId: string | number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log(`Deleting order with ID: ${orderId}`);
    }
  };

  const handleFilterClick = () => {
    setOpenFilterDialog(true);
  };

  const applyFilters = (newFilters: {
    paymentStatus: string;
    orderStatus: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-1">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex justify-center w-full md:w-auto flex-grow">
            {/* Use the SearchBar component */}
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
        // @ts-expect-error - TODO: fix typings
        onApply={applyFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        <DataTable<Order>
          items={orderMockData
            .filter(
              (order) =>
                !filters.paymentStatus ||
                order.paymentStatus === filters.paymentStatus
            )
            .filter(
              (order) =>
                !filters.orderStatus ||
                order.orderStatus === filters.orderStatus
            )
            .filter((order) =>
              order.orderId.toLowerCase().includes(searchValue.toLowerCase())
            )}
          columns={columns}
          idKey="orderId"
          itemsPerPage={15}
          tableType="order"
        />
      </div>
    </div>
  );
};

export default OrderPage;
